import {FileSystem} from '@/services/file-system/file-system';
import {mkdir, writeFile} from 'fs/promises';
import {ipcRenderer} from 'electron';
import {join} from 'node:path';
import type {DirDescriptor, FileDescriptor} from '@/entities/Descriptor';
import {isDir} from '@/entities/Descriptor';
import {IpcRendererMessage} from '../../../electron/main/ipc-renderer-message';
import {IpcMainMessage} from '../../../electron/main/ipc-main-message';

export class NodeFileSystem extends FileSystem {
  // TODO: add existence check

  async saveDirectory(descriptor: DirDescriptor, path: string, name = descriptor.name): Promise<boolean> {
    const destPath = join(path, name);
    const content = await descriptor.content();
    const promises: Promise<boolean>[] = [];

    await mkdir(destPath, {recursive: true});

    for (const innerDescriptor of content) {
      if (isDir(innerDescriptor))
        promises.push(this.saveDirectory(innerDescriptor, destPath));
      else
        promises.push(this.saveFile(innerDescriptor, destPath));
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

  public async selectDirectory() {
    return new Promise<string | null>((r) => {
      ipcRenderer.once(IpcMainMessage.DirSelected, (_, path: string | null) => {
        r(path);
      });
      ipcRenderer.send(IpcRendererMessage.OpenDirSelector);
    });
  }


}
