import type {RemoteDescriptorDto} from '@/api/dto/remote-descriptor.dto';

export interface Api {
  '/all-files': {
    'GET': {
      response: RemoteDescriptorDto[],
    }
  }
}
