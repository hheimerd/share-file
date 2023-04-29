import type {AnyDescriptor, DirDescriptor, FileDescriptor} from '@/entities/Descriptor';
import {isDir} from '@/entities/Descriptor';
import {IS_ELECTRON} from '@/constants/environment';

export abstract class FileSystem {
  async saveDescriptor(descriptor: AnyDescriptor, destPath: string): Promise<boolean> {
    if (isDir(descriptor))
      return this.saveDirectory(descriptor, destPath);
    else
      return this.saveFile(descriptor, destPath);
  }

  abstract saveFile(descriptor: FileDescriptor, filePath: string): Promise<boolean>;

  abstract saveDirectory(descriptor: DirDescriptor, dirPath: string): Promise<boolean>;

  abstract startDrag(descriptor: AnyDescriptor): Promise<void>;

  private static _fs: FileSystem | null = null;

  public static getFs() {
    return FileSystem._fs;
  }

  public static async getFsAsync() {
    if (IS_ELECTRON) {
      const FsImpl = (await import('@/services/file-system/node-file-system')).NodeFileSystem;
      return FileSystem._fs = new FsImpl();
    } else {
      throw Error('Not implemented'); // TODO: implement remote FS
    }
  }
}

FileSystem.getFsAsync();

