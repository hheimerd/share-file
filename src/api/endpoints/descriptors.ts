import {fileRepository} from '@/data/local-files.repository';
import {createRemoteFileDto} from '@/api/dto/remote-descriptor.dto';
import {isDir} from '@/entities/Descriptor';

export function getAllFiles() {
  return fileRepository.descriptors.map(createRemoteFileDto);
}

export async function getDirContent(id: string) {
  const descriptor = fileRepository.descriptors.find(x => x.id === id);
  if (!descriptor || !isDir(descriptor))
    return [];

  return (await descriptor.content()).map(createRemoteFileDto);
}

