import { Injectable } from '@angular/core';

export interface EndpointResponse {
  value: any;
  error: boolean;
}
@Injectable({
  providedIn: 'root',
})
export class ApiBackService {
  api: string = 'http://localhost:8080';

  async fetchBack(uri: string, method: string): Promise<any> {
    console.log(uri);
    const f = await fetch(this.api + uri, { method: method });
    return await f.json();
  }
  async getFromBackAsT<T>(uri: string, method: string = 'GET'): Promise<T | string> {
    const response = await this.fetchBack(uri, method);
    const asEnd = response as EndpointResponse;
    console.log(asEnd);
    return asEnd.error ? (asEnd.value as string) : (asEnd.value as T);
  }
}
