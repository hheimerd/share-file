import type {RestypedBase, RestypedRoute} from '@/types/restyped/restyped';
import type {IsObject} from '@/types/is-object.typeguard';

type ReadonlyHeaders = Omit<Headers, 'set' | 'delete' | 'append'>;
const defaultHeaders = new Headers();

type HTTPMethod =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'PATCH'
  | 'HEAD'
  | 'DELETE'
  | 'OPTIONS'

type RequestOptions<TRoute extends RestypedRoute> = RequestInit
  & (
  IsObject<TRoute['params']> extends true
    ? { params: TRoute['params'] }
    : { params?: undefined }
  ) & (
  IsObject<TRoute['query']> extends true
    ? { searchParams: TRoute['query'] | URLSearchParams }
    : { searchParams?: undefined }
  )

export class TypedFetchClient<APIDef extends RestypedBase> {
  private readonly _headers = defaultHeaders;
  private readonly _baseUrl: string | URL;

  public get headers(): ReadonlyHeaders {return this._headers;}

  public constructor(baseUrl: string | URL) {
    this._baseUrl = baseUrl;
  }

  public post<
    TPath extends Extract<keyof APIDef, string>,
    TRoute extends APIDef[TPath]['POST'],
    TBody extends TRoute['body'],
  >(path: TPath, body: TBody | FormData, options?: RequestOptions<TRoute>) {
    return this.request('POST', path, body, options);
  }

  public get<
    TPath extends Extract<keyof APIDef, string>,
    TRoute extends APIDef[TPath]['GET'],
  >(path: TPath, options?: RequestOptions<TRoute>) {
    return this.request('GET', path, undefined, options);
  }

  public put<
    TPath extends Extract<keyof APIDef, string>,
    TRoute extends APIDef[TPath]['PUT'],
    TBody extends TRoute['body'],
  >(path: TPath, body: TBody | FormData, options?: RequestOptions<TRoute>) {
    return this.request('PUT', path, body, options);
  }

  public patch<
    TPath extends Extract<keyof APIDef, string>,
    TRoute extends APIDef[TPath]['PATCH'],
    TBody extends TRoute['body'],
  >(path: TPath, body: TBody | FormData, options?: RequestOptions<TRoute>) {
    return this.request('PATCH', path, body, options);
  }

  public delete<
    TPath extends Extract<keyof APIDef, string>,
    TRoute extends APIDef[TPath]['DELETE'],
    TBody extends TRoute['body'],
  >(path: TPath, body?: TBody | FormData, options?: RequestOptions<TRoute>) {
    return this.request('DELETE', path, body, options);
  }

  public async request<
    TPath extends Extract<keyof APIDef, string>,
    TMethod extends HTTPMethod,
    TQuery extends APIDef[TPath][TMethod]['query'],
    TResponse extends APIDef[TPath][TMethod]['response'],
  >(method: TMethod, path: TPath, body: APIDef[TPath][TMethod]['body'] | FormData, options?: RequestOptions<TQuery>): Promise<TResponse> {
    const headers = new Headers(this._headers);
    let preparedPath = path as string;

    if (body && body instanceof FormData == false) {
      headers.set('Content-Type', 'application/json');
    }

    if (options?.params) {
      for (const paramsKey in options.params) {
        preparedPath = preparedPath.replace(`:${paramsKey}`, options.params[paramsKey]);
      }
    }

    const url = new URL(preparedPath, this._baseUrl);

    if (options?.searchParams) {

      if (options.searchParams instanceof URLSearchParams) {
        for (const queryParamsKey in options.searchParams.keys()) {
          url.searchParams.set(queryParamsKey, options.searchParams.get(queryParamsKey)!);
        }
      } else {
        for (const queryParamsKey in options.searchParams) {
          url.searchParams.set(queryParamsKey, options.searchParams[queryParamsKey]);
        }
      }

    }


    return new Promise<TResponse>((resolve, reject) => {
      fetch(url.toString(), {
        body: body instanceof FormData ? body : JSON.stringify(body),
        headers: headers,
        method,
        ...options,
      }).then(response => {
        if (response.status < 200 || response.status >= 300) {
          reject(response);
          return;
        }

        if (response.headers.get('Content-Type')?.includes('application/json'))
          response.json().then(r => {
            resolve(r as TResponse);
          });
        else
          response.text().then(r => {
            resolve(r as TResponse);
          });
      }).catch(reject);
    });
  }

  public setGlobalHeader(key: string, value: string) { this._headers.set(key, value);}

  public removeGlobalHeader(key: string) { this._headers.delete(key);}

}
