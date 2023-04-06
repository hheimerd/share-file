import {Descriptor, DescriptorType} from '@/entities/Descriptor';
import type {RemoteDescriptorDto} from '@/api/dto/remote-descriptor.dto';
import type {RemoteDescriptorsRepository} from '@/data/remote-descriptors.repository';

export class RemoteFileDescriptor extends Descriptor {
  readonly type: DescriptorType.RemoteFile = DescriptorType.RemoteFile;
  private _descriptorRepository: RemoteDescriptorsRepository;
  
  constructor(dto: RemoteDescriptorDto, descriptorRepository: RemoteDescriptorsRepository) {
    super(dto.name);
    this._descriptorRepository = descriptorRepository;
    this.id = dto.id;
  }

  public file(): Promise<Blob> {
    return this._descriptorRepository.getFile(this.id);
  }

  public stream(): Promise<ReadableStream> {
    return this._descriptorRepository.getFileStream(this.id);
  }
}
