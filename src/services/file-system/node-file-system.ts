import {FileSystem} from '@/services/file-system/file-system';
import {mkdir, writeFile} from 'fs/promises';
import {ipcRenderer} from 'electron';
import {join} from 'node:path';
import type {DirDescriptor, FileDescriptor, AnyDescriptor} from '@/entities/Descriptor';
import {isDir} from '@/entities/Descriptor';

export class NodeFileSystem extends FileSystem {
  // TODO: add existence check

  async saveDirectory(descriptor: DirDescriptor, initialPath: string): Promise<boolean> {
    const directoriesQueue: [DirDescriptor, string][] = [[descriptor, initialPath]];
    const promises: Promise<boolean>[] = [];

    while (directoriesQueue.length > 0) {
      const [dir, path] = directoriesQueue.pop()!;
      const destPath = join(path, dir.name);
      const content = await dir.content();
      await mkdir(destPath, {recursive: true});

      for (const innerDescriptor of content) {
        if (isDir(innerDescriptor))
          directoriesQueue.push([innerDescriptor, destPath]);
        else
          promises.push(this.saveFile(innerDescriptor, destPath));
      }
    }

    await Promise.all(promises);

    return true;
  }

  async saveFile(descriptor: FileDescriptor, path: string, name = descriptor.name): Promise<boolean> {
    const destPath = join(path, name);
    const file = await descriptor.file();
    const buffer = await file.arrayBuffer();

    await writeFile(destPath, new DataView(buffer));
    return true;
  }

  public async startDrag(descriptor: AnyDescriptor) {
    ipcRenderer.once('file-dropped', (_, path: string | null) => {
      if (path)
        this.saveDescriptor(descriptor, path);
    });
    ipcRenderer.send('start-file-drag');
  }


}
