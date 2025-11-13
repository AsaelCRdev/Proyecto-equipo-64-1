import { Component, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart-service';

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shopping-cart.html',
  styleUrls: ['./shopping-cart.css']
})
export class ShoppingCartComponent implements OnDestroy {
  isOpen$: Observable<boolean>;
  cartItems: any[] = [];
  private sub = new Subscription();

  constructor(private cartService: CartService) {
    this.isOpen$ = this.cartService.isOpen$;
    if ((this.cartService as any).items$) {
      this.sub.add((this.cartService as any).items$.subscribe((items: any[]) => {
        this.cartItems = items || [];
      }));
    }
  }

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
      this.cartItems = this.cartItems.filter(i => i.id !== id);
    }
  }

  calcularTotal() {
    return this.cartItems.reduce((sum, i) => sum + (i.price || 0) * (i.quantity || 1), 0);
  }

  checkout() {
    console.log('Checkout', this.calcularTotal());
    this.cartService.clear?.();
    this.cartService.close?.();
    window.alert('¡Compra exitosa!');
  }
}
