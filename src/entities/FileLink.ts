import {basename} from 'node:path';
import {lstat} from 'node:fs/promises';

export type FileLink = {
  name: string,
  path: string,
  isFolder: boolean
}

export async function makeFileList(path: string) {
  return (
    {
      path,
      name: basename(path),
      isFolder: (await lstat(path)).isDirectory(),
    }
  );
}
