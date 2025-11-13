import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiBackService } from './api-back.service';
import { AuthResponse } from '../model/AuthResponse';
import { Buyer } from '../model/Buyer';
import { BuyerService } from './buyer.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  api = inject(ApiBackService);
  buyerService = inject(BuyerService);
  buyer: Buyer | undefined = undefined;

  private _isLoggedIn = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this._isLoggedIn.asObservable();

  private _isAdmin = new BehaviorSubject<boolean>(false);
  isAdmin$ = this._isAdmin.asObservable();

  async logIn(email: string, pass: string): Promise<boolean> {
    const res = (await this.api.getFromBackAsT<AuthResponse>(
      `/logIn?email=${email}&password=${pass}`,
    )) as AuthResponse;
    if (res.isAdmin === true) {
      console.log('isAdmin');
      this.buyer = res.buyer;
      this.loginAsAdmin();
      return true;
    }
    if (res.isUser === true) {
      console.log('isUser');
      this.buyer = res.buyer;
      this.loginUser();
      return true;
    }
    return false;
  }

  async createAccount(email: string, pass: string, name: string, address: string, phone: string) {
    const res = await this.buyerService.createAccount(email, pass, name, address, phone);
    if (res) {
      return await this.logIn(email, pass);
    }
    return false;
  }

  loginUser(): void {
    this._isLoggedIn.next(true);
    this._isAdmin.next(false);
  }

  loginAsAdmin(): void {
    this._isLoggedIn.next(true);
    this._isAdmin.next(true);
  }

  get isLoggedIn(): boolean {
    return this._isLoggedIn.value;
  }

  logout(): void {
    this._isLoggedIn.next(false);
    this._isAdmin.next(false);
    this.buyer = undefined;
  }
}
