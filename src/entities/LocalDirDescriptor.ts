import type {Descriptor, DescriptorType} from '@/entities/Descriptor';
import type {LocalFileDescriptor} from '@/entities/LocalFileDescriptor';

export interface LocalDirDescriptor extends Descriptor {
  type: DescriptorType.LocalDirectory;
  path: string;
  content: (LocalFileDescriptor | LocalDirDescriptor)[]
}
