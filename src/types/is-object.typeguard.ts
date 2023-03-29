export type IsObject<T> = T extends Record<string, unknown> ? (
  T extends Array<any> ? false : true
) : false;
