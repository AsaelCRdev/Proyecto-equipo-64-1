import { Injectable, inject } from '@angular/core';
import { ApiBackService } from './api-back.service';
import { Buyer } from '../model/Buyer';
import { MovieRental } from '../model/MovieRental';

@Injectable({
  providedIn: 'root',
})
export class BuyerService {
  api = inject(ApiBackService);

  async getAllRented(): Promise<MovieRental[]> {
    const uriBuilder = `/getAllRented`;
    const res = await this.api.getFromBackAsT<MovieRental[]>(uriBuilder, 'GET');
    console.log('Respuesta getAllRented:', res);

    return Array.isArray(res) ? res : [];
  }
  async createAccount(
    email: string,
    pass: string,
    name: string,
    address: string,
    phone: string,
  ): Promise<boolean> {
    const res = (await this.api.getFromBackAsT<string>(
      `/addBuyer?email=${email}&password=${pass}&name=${name}&address=${address}&phone=${phone}`,
      'POST',
    )) as string;
    if (res.toLowerCase() === 'succes') {
      return true;
    }
    return false;
  }
  async getBuyers(id?: string | undefined): Promise<Buyer[] | Buyer> {
    let uriBuilder = '/getBuyers';
    if (id && id.trim() != '') {
      uriBuilder += `?id=${id}`;
      const res = await this.api.getFromBackAsT<Buyer>(uriBuilder);
      console.log('/getBuyers');
      console.log(res);

      return res as Buyer;
    }
    const res = await this.api.getFromBackAsT<Buyer[]>(uriBuilder);
    console.log('/getBuyers');
    console.log(res);
    return Array.isArray(res) ? res : [];
  }
  async deleteBuyer(id: string): Promise<boolean> {
    if (!id || id.trim() === '') return false;

    const uri = `/deleteBuyer?id=${encodeURIComponent(id)}`;
    const res = await this.api.getFromBackAsT<string>(uri, 'DELETE');
    console.log('Respuesta deleteBuyer:', res);

    return (res as string).toLowerCase() === 'succes';
  }
  async editBuyer(
    id: string,
    name?: string,
    email?: string,
    address?: string,
    phone?: string,
  ): Promise<boolean> {
    if (!id || id.trim() === '') return false;

    let uri = `/editBuyer?id=${encodeURIComponent(id)}`;
    if (name && name.trim() !== '') uri += `&name=${encodeURIComponent(name)}`;
    if (email && email.trim() !== '') uri += `&email=${encodeURIComponent(email)}`;
    if (address && address.trim() !== '') uri += `&address=${encodeURIComponent(address)}`;
    if (phone && phone.trim() !== '') uri += `&phone=${encodeURIComponent(phone)}`;

    const res = await this.api.getFromBackAsT<string>(uri, 'PATCH');
    console.log('Respuesta editBuyer:', res);

    return (res as string).toLowerCase() === 'succes';
  }
}
