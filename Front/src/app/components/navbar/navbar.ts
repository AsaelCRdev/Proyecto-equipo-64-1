import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthDialog } from '../auth-dialog/auth-dialog';
import { AuthService } from '../../services/auth-service';
import { CartService } from '../../services/cart-service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule,AuthDialog],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})

export class NavbarComponent implements OnInit {
  isLoggedIn: boolean = false;
  userInitial: string = 'D';
  cartItemCount: number = 3;
  showAuth: boolean = false;

  constructor(private auth:AuthService, private cartService:CartService) {
    this.auth.isLoggedIn$.subscribe(v => this.isLoggedIn = v)
  }

  ngOnInit(): void { }

  toggleCart() {
    this.cartService.toggle();
  }

  openAuth(): void {
    this.showAuth = true;
  }

  onAuthClose(): void {
    this.showAuth = false;
  }

  onLoggedIn(): void {
    this.auth.login();
    this.showAuth = false;
  }

  logout(): void {
    this.auth.logout();
  }
}
