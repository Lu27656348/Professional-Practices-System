export interface ResponseBlob<T> extends Response {
    blob(): Promise<Blob>;
  }