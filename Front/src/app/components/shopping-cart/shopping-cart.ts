import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart-service';
import { MovieRental } from '../../model/MovieRental';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shopping-cart.html',
  styleUrls: ['./shopping-cart.css'],
})
export class ShoppingCartComponent implements OnDestroy, OnInit {
  isOpen$: Observable<boolean> = new Observable<boolean>();
  cartItems: MovieRental[] = [];
  auth = inject(AuthService);
  private sub = new Subscription();
  cartService = inject(CartService);

  ngOnInit(): void {
    this.auth.isLoggedIn$.subscribe((isLogged) => {
      if (isLogged) {
        this.cartService.getCart().then((v) => {
          this.cartItems = v;
        });
      }
    });
    this.isOpen$ = this.cartService.isOpen$;
    if (this.cartService.items$) {
      this.sub.add(
        this.cartService.items$.subscribe((items: any[]) => {
          this.cartItems = items || [];
        }),
      );
    }
  }
  constructor() {}

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  closeCarrito() {
    this.cartService.close?.() ?? null;
  }

  eliminarItem(id: any) {
    if (typeof (this.cartService as any).removeItem === 'function') {
      (this.cartService as any).removeItem(id);
    } else {
      this.cartItems = this.cartItems.filter((i) => i.movieId !== id);
    }
  }

  checkout() {
    this.cartService.checkout().then((v) => {
      if (v) {
        this.cartService.clear?.();
        this.cartService.close?.();
        window.alert('¡Compra exitosa!');
      }
    });
  }
}
