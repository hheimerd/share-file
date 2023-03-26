import type {RemoteDescriptorDto} from '@/api/dto/remote-descriptor.dto';
import type {RestypedBase} from '@/types/restyped/restyped';

export interface Api extends RestypedBase {
  '/all-files': {
    'GET': {
      response: RemoteDescriptorDto[],
    }
  }
}
