import type {AnyDescriptor, DirDescriptor, FileDescriptor} from '@/entities/Descriptor';
import {isDir} from '@/entities/Descriptor';

export abstract class FileSystem {
  async saveDescriptor(descriptor: AnyDescriptor, destPath: string): Promise<boolean> {
    if (isDir(descriptor))
      return this.saveDirectory(descriptor, destPath);
    else
      return this.saveFile(descriptor, destPath);
  }

  abstract saveFile(descriptor: FileDescriptor, filePath: string): Promise<boolean>;

  abstract saveDirectory(descriptor: DirDescriptor, dirPath: string): Promise<boolean>;
}
