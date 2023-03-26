import {TypedFetchClient} from '@/types/restyped/typed-fetch-client';
import type {Api} from '@/api/api-declaration';

export class RemoteFilesRepository {
  private _api: TypedFetchClient<Api>;

  constructor(remoteAddress: URL) {
    this._api = new TypedFetchClient<Api>(remoteAddress);
  }

  getFiles() {
    return this._api.get('/all-files');
  }
}
