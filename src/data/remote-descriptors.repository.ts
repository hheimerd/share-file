import {TypedFetchClient} from '@/types/restyped/typed-fetch-client';
import type {Api} from '@/api/api-declaration';

export class RemoteDescriptorsRepository {
  private _api: TypedFetchClient<Api>;

  constructor(remoteAddress: URL) {
    this._api = new TypedFetchClient<Api>(remoteAddress);
  }

  getFiles() {
    return this._api.get('/all-files');
  }

  async getDirContent(id: string) {
    return this._api.get('/dir-content/:id', {
      params: {
        id
      }
    });
  }
}
