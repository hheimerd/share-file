import {fileRepository} from '@/data/files-repository';

export function getAllFiles() {
  return fileRepository.descriptors;
}
