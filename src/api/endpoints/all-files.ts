import {fileRepository} from '@/data/local-files.repository';
import {createRemoteFileDto} from '@/api/dto/remote-descriptor.dto';

export function getAllFiles() {
  return fileRepository.descriptors.map(createRemoteFileDto);
}
