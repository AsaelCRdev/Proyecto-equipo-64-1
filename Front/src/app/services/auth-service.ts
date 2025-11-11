import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _isLoggedIn = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this._isLoggedIn.asObservable();

  private _isAdmin = new BehaviorSubject<boolean>(false);
  isAdmin$ = this._isAdmin.asObservable();

  loginUser(): void {
    this._isLoggedIn.next(true);
    this._isAdmin.next(false);
  }

  loginAsAdmin(): void {
    this._isLoggedIn.next(true);
    this._isAdmin.next(true);
  }

  logout(): void {
    this._isLoggedIn.next(false);
    this._isAdmin.next(false);
  }
}