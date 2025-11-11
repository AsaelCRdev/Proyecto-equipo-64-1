import { inject, Component, OnInit } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthDialog } from '../auth-dialog/auth-dialog';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, AuthDialog, AsyncPipe],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
})
export class NavbarComponent implements OnInit {
  isLoggedIn: boolean = false;
  userInitial: string = 'D';
  cartItemCount: number = 3;
  auth = inject(AuthService);
  showAuth: boolean = false;

  constructor() {}
  ngOnInit(): void {
    this.auth.isLoggedIn$.subscribe((v) => (this.isLoggedIn = v));
  }

  openAuth(): void {
    this.showAuth = true;
  }

  onAuthClose(): void {
    this.showAuth = false;
  }

  onLoggedIn(): void {
    this.showAuth = false;
  }

  logout(): void {
    this.auth.logout();
  }
}
