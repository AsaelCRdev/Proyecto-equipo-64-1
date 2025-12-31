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


  async postToBack<T>(uri: String, body: any): Promise<T | string>{
      const f = await fetch(this.api + uri, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const response = await f.json();
      const u = response as EndpointResponse;
      return u.error ? (u.value as string) : (u.value as T);

  }
}
