import {LocalFileDescriptor} from '@/entities/LocalFileDescriptor';
import {LocalDirDescriptor} from '@/entities/LocalDirDescriptor';
import type {LocalDescriptor} from '@/entities/Descriptor';

class FilesRepository {

  public get descriptors(): ReadonlyArray<LocalDescriptor> { return this._descriptors; }

  private _descriptors: LocalDescriptor[] = [];

  public createDescriptor = async (entry: FileSystemEntry, path?: string): Promise<LocalDescriptor> => {

    const descriptor = entry.isFile
      ? new LocalFileDescriptor(entry as FileSystemFileEntry, path)
      : new LocalDirDescriptor(entry as FileSystemDirectoryEntry, path);

    this._descriptors.push(descriptor);
    return descriptor;
  };
}

export const fileRepository = new FilesRepository();
