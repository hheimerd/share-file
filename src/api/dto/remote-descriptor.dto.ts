import type {AnyDescriptor} from '@/entities/Descriptor';
import {DescriptorType} from '@/entities/Descriptor';

export function createRemoteFileDto(file: AnyDescriptor) {
  return {
    type: file.type == DescriptorType.LocalFile
      ? DescriptorType.RemoteFile as const
      : DescriptorType.RemoteDirectory as const,
    id: file.id,
    name: file.name,
  };
}

export type RemoteDescriptorDto = ReturnType<typeof createRemoteFileDto>;
