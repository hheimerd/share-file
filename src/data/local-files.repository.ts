import {LocalFileDescriptor} from '@/entities/LocalFileDescriptor';
import {LocalDirDescriptor} from '@/entities/LocalDirDescriptor';
import type {LocalDescriptor} from '@/entities/Descriptor';

class LocalFilesRepository {

  public get descriptors(): ReadonlyArray<LocalDescriptor> { return this._descriptors; }
  public get rootDescriptors(): ReadonlyArray<LocalDescriptor> { return this._rootDescriptors; }

  private _descriptors: LocalDescriptor[] = [];
  private _rootDescriptors: LocalDescriptor[] = [];

  public createDescriptor = async (entry: FileSystemEntry, path?: string): Promise<LocalDescriptor> => {

    const descriptor = entry.isFile
      ? new LocalFileDescriptor(entry as FileSystemFileEntry, path)
      : new LocalDirDescriptor(entry as FileSystemDirectoryEntry, path);

    this._descriptors.push(descriptor);
    return descriptor;
  };

  public async createRootDescriptor(entry: FileSystemEntry, path?: string): Promise<LocalDescriptor> {
    const descriptor = await this.createDescriptor(entry, path);
    this._rootDescriptors.push(descriptor);
    return descriptor;
  }
}

export const fileRepository = new LocalFilesRepository();
