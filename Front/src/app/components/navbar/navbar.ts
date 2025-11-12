import { inject, Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthDialog } from '../auth-dialog/auth-dialog';
import { AuthService } from '../../services/auth-service';
import { CartService } from '../../services/cart-service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, AuthDialog],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  isLoggedIn: boolean = false;
  userInitial: string = 'D';
  cartItemCount: number = 0;
  auth = inject(AuthService);
  cartService = inject(CartService);
  private subs = new Subscription();
  showAuth: boolean = false;

  constructor() {}

  ngOnInit(): void {
    this.subs.add(this.auth.isLoggedIn$.subscribe((v) => (this.isLoggedIn = v)));

    // Suscribirse al stream de ítems del carrito si existe
    const maybeItems$ = (this.cartService as any).items$;
    if (maybeItems$ && typeof maybeItems$.subscribe === 'function') {
      this.subs.add(
        maybeItems$.subscribe((items: any) => {
          if (Array.isArray(items)) {
            this.cartItemCount = items.length;
          } else if (items && typeof items === 'object' && 'length' in items) {
            this.cartItemCount = (items as any).length || 0;
          } else {
            // caso genérico
            this.cartItemCount = 0;
          }
        })
      );
    } else {
      // fallback: si el servicio expone un método sincronico para obtener items
      const maybeGet = (this.cartService as any).getItems;
      if (typeof maybeGet === 'function') {
        const items = maybeGet.call(this.cartService);
        this.cartItemCount = Array.isArray(items) ? items.length : 0;
      }
    }
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  toggleCart() {
    // llama a toggle si existe
    const toggleFn = (this.cartService as any).toggle;
    if (typeof toggleFn === 'function') {
      toggleFn.call(this.cartService);
    }
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
