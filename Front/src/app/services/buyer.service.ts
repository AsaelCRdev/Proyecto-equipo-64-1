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


  //modificacion de comprador

  async updateBuyer(id: string,  buyer: Buyer): Promise<Buyer | null>{
      const res = await this.api.postToBack<Buyer>(`/updateBuyer?id=${id}`, buyer);
              if (typeof res === 'string') {
                console.error('error:', res);  
                return null;
              }
              return res as Buyer;
  }   

  //eliminacion de comprador
  async deleteBuyer(id: string): Promise<Buyer[] | null>{
      const res = await this.api.getFromBackAsT<Buyer[]>(`/deleteBuyer?id=${id}`, 'DELETE');
      if(typeof res === 'string'){
        console.log('error:', res);
        return null;
      }
      return res as Buyer[];
  }

} 