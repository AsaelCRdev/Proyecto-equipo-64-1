import { Component, Input, Output, EventEmitter, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Movie } from '../../model/Movie';
import { CartService } from '../../services/cart-service';
import { AuthService } from '../../services/auth-service';
import { AlquilerDiasComponent } from '../Time-Rental/Time-Rental';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [CommonModule, AlquilerDiasComponent],
  templateUrl: './movie-card.html',
  styleUrls: ['./movie-card.css'],
})
export class MovieCard {
  @Input() movie!: Movie | any;

  @Output() showDetails = new EventEmitter<Movie | any>();
  @Output() addToCart = new EventEmitter<Movie | any>();
  @Output() showRentalModal = new EventEmitter<Movie | any>();

  private cartService = inject(CartService);
  private auth = inject(AuthService);
  showRental: boolean = false;

  constructor() {}

  // Retornar el id como string (OMDB usa `imdbID`), aceptar variantes y fallback a movie.imdbID
  private getMovieId(): string {
    const m = this.movie as any;
    const candidates = [
      m?.id,
      m?.imdbID,
      m?.imdbId,
      m?.movieId,
      m?._id,
      m?.movie?.imdbID,
      m?.movie?.id,
    ];
    const raw = candidates.find((c) => c !== undefined && c !== null && String(c).trim() !== '');
    return raw == null ? '' : String(raw).trim();
  }

  private getMoviePrice(): number {
    const m = this.movie as any;
    return Number(m?.price ?? m?.rentalPrice ?? 0) || 0;
  }

  private getMovieName(): string {
    const m = this.movie as any;
    return m?.title ?? m?.name ?? 'Desconocido';
  }

  onDetailsClick(): void {
    this.showDetails.emit(this.movie);
  }
  closeRental(): void {
    this.showRental = false;
  }

  onAddClick(): void {
    // Validar sesión antes de emitir para abrir el modal
    if (!this.isLoggedInSync()) {
      alert('Por favor inicia sesión para agregar alquileres al carrito.');
      return;
    }

    // Emitir al padre para que abra el modal de selección de días
    this.showRentalModal.emit(this.movie);
    if (!this.movie) return;

    const movieId = this.getMovieId();
    if (!movieId) {
      console.error('MovieCard.onAddClick: movie sin id válido', this.movie);
      alert('No se puede añadir la película: id inválido.');
      return;
    }

    this.addToCart.emit(this.movie);
  }

  private isLoggedInSync(): boolean {
    const a: any = this.auth;
    if (typeof a.isLoggedIn === 'boolean') return a.isLoggedIn;
    if (a.isLoggedIn$ && typeof a.isLoggedIn$.subscribe === 'function') {
      let current = false;
      const sub = a.isLoggedIn$.subscribe((v: any) => (current = !!v));
      try {
        sub.unsubscribe?.();
      } catch {}
      return current;
    }
    return false;
  }

  @HostListener('click', ['$event'])
  handleHostClick(event: Event): void {
    const target = event.target as HTMLElement;

    if (target.closest('.add-btn')) {
      // Evitar que el clic en el botón '+' propague al enlace padre y navegue
      try {
        event.preventDefault();
      } catch (e) {}
      try {
        event.stopPropagation();
      } catch (e) {}

      if (this.isLoggedInSync()) {
        this.onAddClick();
        return;
      } else {
        alert('Por favor inicia sesión para agregar alquileres al carrito.');
        return;
      }
    }

    if (target.closest('.details-btn')) {
      this.onDetailsClick();
      return;
    }
  }
}
