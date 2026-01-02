import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Movie } from '../../model/Movie';
import { Observable, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart-service';
import { MovieRental } from '../../model/MovieRental';
import { AuthService } from '../../services/auth-service';
import { MovieService } from '../../services/movie.service';

import { AlquilerDiasComponent } from '../Time-Rental/Time-Rental';
@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [CommonModule, AlquilerDiasComponent],
  templateUrl: './shopping-cart.html',
  styleUrls: ['./shopping-cart.css'],
})
export class ShoppingCartComponent implements OnDestroy, OnInit {
  isOpen$: Observable<boolean> = new Observable<boolean>();
  cartItems: MovieRental[] = [];
  auth = inject(AuthService);
  private sub = new Subscription();
  cartService = inject(CartService);
  showRentalModal = false;
  selectedMovieForRental: Movie | undefined = undefined;
  movieService: MovieService = inject(MovieService);

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
    this.cartService.removeFromCart(this.auth.buyer?.id as string, id as string).then((ok) => {
      if (ok) {
        this.cartService.getCart().then((v) => {
          this.cartItems = v;
        });
      }
    });
    // if (typeof (this.cartService as any).removeItem === 'function') {
    //   (this.cartService as any).removeItem(id);
    // } else {
    //   this.cartItems = this.cartItems.filter((i) => i.movieId !== id);
    // }
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
  editItem(movieId: string) {
    this.movieService.getMovie(movieId).then((r) => {
      this.selectedMovieForRental = r as Movie;
      console.log(this.selectedMovieForRental);
      this.showRentalModal = true;
    });
  }
  onCloseRentalModal() {
    this.cartService.getCart().then((v) => {
      this.cartItems = v;
    });
    this.showRentalModal = false;
  }
}
