import {Descriptor, DescriptorType} from '@/entities/Descriptor';

function fileFromEntryAsync(fileEntry: FileSystemFileEntry): Promise<File> {
  return new Promise<File>((resolve, reject) => { fileEntry.file(resolve, reject);});
}

export class LocalFileDescriptor extends Descriptor {
  readonly type: DescriptorType.LocalFile = DescriptorType.LocalFile;
  readonly path: string;

  private readonly _entry: FileSystemFileEntry;

  constructor(entry: FileSystemFileEntry, path?: string) {
    super(entry.name);
    this.path = path ?? entry.fullPath;
    this._entry = entry;
  }

  public file(): Promise<Blob> {
    return fileFromEntryAsync(this._entry);
  }

  public async stream(): Promise<ReadableStream> {
    return (await fileFromEntryAsync(this._entry)).stream();
  }

}
