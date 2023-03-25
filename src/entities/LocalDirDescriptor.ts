import {Descriptor, DescriptorType} from '@/entities/Descriptor';
import type {LocalFileDescriptor} from '@/entities/LocalFileDescriptor';
import {fileRepository} from '@/data/files-repository';

function readDirEntriesAsync(entry: FileSystemDirectoryEntry): Promise<FileSystemEntry[]> {
  const reader = entry.createReader();
  return new Promise<FileSystemEntry[]>((resolve, reject) => {
    reader.readEntries(resolve, reject);
  });
}

export class LocalDirDescriptor extends Descriptor {
  readonly type: DescriptorType.LocalDirectory = DescriptorType.LocalDirectory;
  readonly path: string;

  private readonly _entry: FileSystemDirectoryEntry;

  constructor(entry: FileSystemDirectoryEntry, path?: string) {
    super(entry.name);
    this.path = path ?? entry.fullPath;
    this._entry = entry;
  }

  public async content(): Promise<(LocalFileDescriptor | LocalDirDescriptor)[]> {
    const entries = await readDirEntriesAsync(this._entry);
    return Promise.all(entries.map(entry =>
      fileRepository.createDescriptor(entry)
    ));
  }
}
