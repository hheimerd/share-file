import {TypedFetchClient} from '@/types/restyped/typed-fetch-client';
import type {Api} from '@/api/api-declaration';
import {isDir} from '@/entities/Descriptor';
import {RemoteDirDescriptor} from '@/entities/RemoteDirDescriptor';
import {RemoteFileDescriptor} from '@/entities/RemoteFileDescriptor';
import type {RemoteDescriptorDto} from '@/api/dto/remote-descriptor.dto';

export class RemoteDescriptorsRepository {
  private _api: TypedFetchClient<Api>;

  constructor(remoteAddress: URL) {
    this._api = new TypedFetchClient<Api>(remoteAddress);
  }

  async getFiles() {
    return (await this._api.get('/all-files')).map(this.toEntity);
  }

  async getDirContent(id: string) {
    const dtos = await this._api.get('/dir-content/:id', {
      params: {
        id
      }
    });
    return dtos.map(this.toEntity);
  }
  
  private toEntity = (dto: RemoteDescriptorDto) => {
    return isDir(dto) 
      ? new RemoteDirDescriptor(dto, this)
      : new RemoteFileDescriptor(dto, this);
  };

  async getFile(id: string): Promise<Blob> {
    return this._api.get('/file/:id', {
      params: {
        id
      },
      responseIsFile: true
    });
  }
}
