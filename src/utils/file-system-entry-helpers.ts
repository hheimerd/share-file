export function fileFromEntryAsync(fileEntry: FileSystemFileEntry): Promise<File> {
  return new Promise<File>((resolve, reject) => { fileEntry.file(resolve, reject);});
}

export function readDirEntriesAsync(entry: FileSystemDirectoryEntry): Promise<FileSystemEntry[]> {
  const reader = entry.createReader();
  return new Promise<FileSystemEntry[]>((resolve, reject) => {
    reader.readEntries(resolve, reject);
  });
}
