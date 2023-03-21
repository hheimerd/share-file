import type {LocalFileDescriptor} from '@/entities/LocalFileDescriptor';
import type {LocalDirDescriptor} from '@/entities/LocalDirDescriptor';
import type {AnyDescriptor} from '@/entities/Descriptor';
import { DescriptorType} from '@/entities/Descriptor';
import {v4 as uuid} from 'uuid';

class FilesRepository {

  public get descriptors(): ReadonlyArray<AnyDescriptor[]> { return this.descriptors; }

  private _descriptors: AnyDescriptor[] = [];

  public createDescriptor = async (entry: FileSystemEntry): Promise<AnyDescriptor> => {
    const descriptor = entry.isFile
      ? await this.createFileDescriptor(entry as FileSystemFileEntry)
      : await this.createDirDescriptor(entry as FileSystemDirectoryEntry);
    
    this._descriptors.push(descriptor);
    return descriptor;
  };

  private async createFileDescriptor(entry: FileSystemFileEntry): Promise<LocalFileDescriptor> {
    return {
      type: DescriptorType.LocalFile,
      path: entry.fullPath,
      name: entry.name,
      file: await fileFromEntryAsync(entry),
      id: uuid(),
    };
  }

  private async createDirDescriptor(entry: FileSystemDirectoryEntry): Promise<LocalDirDescriptor> {
    const dirReader = entry.createReader();
    const entries = await readDirEntriesAsync(dirReader);
    const content = await Promise.all(entries.map(this.createDescriptor));

    return {
      id: uuid(),
      name: entry.name,
      type: DescriptorType.LocalDirectory,
      path: entry.fullPath,
      content,
    };
  }
}

function readDirEntriesAsync(reader: FileSystemDirectoryReader): Promise<FileSystemEntry[]> {
  return new Promise<FileSystemEntry[]>((resolve, reject) => {
    reader.readEntries(resolve, reject);
  });
}

function fileFromEntryAsync(fileEntry: FileSystemFileEntry): Promise<File> {
  return new Promise<File>((resolve, reject) => { fileEntry.file(resolve, reject);});
}

export const fileRepository = new FilesRepository();
