import { Injectable } from '@angular/core';

interface EndpointResponse {
  value: any;
  error: boolean;
}
@Injectable({
  providedIn: 'root',
})
export class ApiBackService {
  api: string = 'http://localhost:8080';

  async fetchBack(uri: string): Promise<any> {
    const f = await fetch(this.api + uri);
    return await f.json();
  }
  async getFromBackAsT<T>(uri: string) {
    const response = await this.fetchBack(uri);
    const asEnd = response as EndpointResponse;

    return asEnd.value as T;
  }
}
