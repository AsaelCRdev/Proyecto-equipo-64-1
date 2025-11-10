import { Component, EventEmitter, Input, Output, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart-service';
import { AuthService } from '../../services/auth-service';

export interface Movie {
  id: number;
  title: string;
  year: number;
  rating: number;
  duration: string;
  imageUrl: string;
  genre: string;
  price: number;
}

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './movie-card.html',
  styleUrls: ['./movie-card.css']
})

export class MovieCard {
  @Input() movie!: Movie;

  @Output() showDetails = new EventEmitter<Movie>();
  @Output() addToCart = new EventEmitter<Movie>();

  constructor(private cartService: CartService, private auth: AuthService) {}

  onDetailsClick(): void {
    this.showDetails.emit(this.movie);
  }

  onAddClick(): void {
    if (!this.movie) return;

    this.cartService.addItem({
      id: this.movie.id,
      name: this.movie.title,
      price: this.movie.price ?? 0,
      quantity: 1,
      movie: this.movie
    });

    this.addToCart.emit(this.movie);
  }

  @HostListener('click', ['$event'])
  handleHostClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (target.closest('.add-btn')) {
      if (this.auth.isLoggedIn) {
        this.onAddClick();
        return;
      } else {
        alert('Por favor Inicia Sesión para agregar alquileres al carrito.');
        return;
      }

    }
    if (target.closest('.details-btn')) {
      this.onDetailsClick();
      return;
    }
  }
}
