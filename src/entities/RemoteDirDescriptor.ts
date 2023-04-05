import {Descriptor, DescriptorType} from '@/entities/Descriptor';
import type {RemoteDescriptorDto} from '@/api/dto/remote-descriptor.dto';
import type {RemoteFileDescriptor} from '@/entities/RemoteFileDescriptor';
import type {RemoteDescriptorsRepository} from '@/data/remote-descriptors.repository';


export class RemoteDirDescriptor extends Descriptor {
  readonly type: DescriptorType.RemoteDirectory = DescriptorType.RemoteDirectory;
  private readonly _descriptorRepository: RemoteDescriptorsRepository;

  constructor(dto: RemoteDescriptorDto, descriptorRepository: RemoteDescriptorsRepository) {
    super(dto.name);
    this._descriptorRepository = descriptorRepository;
    this.id = dto.id;
  }

  public async content(): Promise<(RemoteDirDescriptor | RemoteFileDescriptor)[]> {
    return this._descriptorRepository.getDirContent(this.id);
  }
}
