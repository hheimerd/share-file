import type {RemoteDescriptorDto} from '@/api/dto/remote-descriptor.dto';

export interface Api {
  '/all-files': {
    GET: {
      response: RemoteDescriptorDto[],
    }
  },
  '/dir-content/:id': {
    GET: {
      response: RemoteDescriptorDto[],
      params: {
        id: string
      }
    }
  },
  '/file/:id': {
    GET: {
      response: Blob,
      params: {
        id: string
      }
    }
  }
}
