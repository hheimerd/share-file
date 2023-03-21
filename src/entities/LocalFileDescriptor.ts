import type {Descriptor, DescriptorType} from '@/entities/Descriptor';

export interface LocalFileDescriptor extends Descriptor {
  type: DescriptorType.LocalFile;
  path: string;
  file: File;
}
