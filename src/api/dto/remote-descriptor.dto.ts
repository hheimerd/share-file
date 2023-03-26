import type {AnyDescriptor} from '@/entities/Descriptor';

export function createRemoteFileDto(file: AnyDescriptor) {
  return {
    type: file.type,
    id: file.id,
    name: file.name,
  };
}

export type RemoteDescriptorDto = ReturnType<typeof createRemoteFileDto>;
