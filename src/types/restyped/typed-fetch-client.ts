import type {RestypedIndexedBase} from '@/types/restyped/restyped';

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

type RequestOptions<TQuery> = RequestInit & {
  searchParams: TQuery | URLSearchParams
}

export class TypedFetchClient<APIDef extends RestypedIndexedBase> {
  private readonly _headers = defaultHeaders;
  private readonly _baseUrl: string | URL;

  public get headers(): ReadonlyHeaders {return this._headers;}

  public constructor(baseUrl: string | URL) {
    this._baseUrl = baseUrl;
  }

  public post<
    TPath extends Extract<keyof APIDef, string>,
    TBody extends APIDef[TPath]['POST']['body'],
    TQuery extends APIDef[TPath]['POST']['query'],
  >(path: TPath | URL, body: TBody | FormData, options?: RequestOptions<TQuery>) {
    return this.request('POST', path, body, options);
  }

  public get<
    TPath extends Extract<keyof APIDef, string>,
    TQuery extends APIDef[TPath]['GET']['query'],
  >(path: TPath | URL, options?: RequestOptions<TQuery>) {
    return this.request('GET', path, undefined, options);
  }

  public put<
    TPath extends Extract<keyof APIDef, string>,
    TBody extends APIDef[TPath]['PUT']['body'],
    TQuery extends APIDef[TPath]['PUT']['query'],
  >(path: TPath | URL, body: TBody | FormData, options?: RequestOptions<TQuery>) {
    return this.request('PUT', path, body, options);
  }

  public patch<
    TPath extends Extract<keyof APIDef, string>,
    TBody extends APIDef[TPath]['PATCH']['body'],
    TQuery extends APIDef[TPath]['PATCH']['query'],
  >(path: TPath | URL, body: TBody | FormData, options?: RequestOptions<TQuery>) {
    return this.request('PATCH', path, body, options);
  }

  public delete<
    TPath extends Extract<keyof APIDef, string>,
    TBody extends APIDef[TPath]['DELETE']['body'],
    TQuery extends APIDef[TPath]['DELETE']['query'],
  >(path: TPath | URL, body?: TBody | FormData, options?: RequestOptions<TQuery>) {
    return this.request('DELETE', path, body, options);
  }

  public async request<
    TPath extends Extract<keyof APIDef, string>,
    TMethod extends HTTPMethod,
    TQuery extends APIDef[TPath][TMethod]['query'],
    TResponse extends APIDef[TPath][TMethod]['response'],
  >(method: TMethod, path: TPath | URL, body: APIDef[TPath][TMethod]['body'] | FormData, options?: RequestOptions<TQuery>): Promise<TResponse> {
    const headers = new Headers(this._headers);

    if (body instanceof FormData == false) {
      headers.set('Content-Type', 'application/json');
    }

    const url = new URL(path, this._baseUrl);

    if (options?.searchParams) {

      if (options.searchParams instanceof URLSearchParams) {
        for (const queryParamsKey in options.searchParams.keys()) {
          url.searchParams.set(queryParamsKey, options.searchParams.get(queryParamsKey)!);
        }
      }
      else {
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
      });
    });
  }

  public setGlobalHeader(key: string, value: string) { this._headers.set(key, value);}

  public removeGlobalHeader(key: string) { this._headers.delete(key);}

}
