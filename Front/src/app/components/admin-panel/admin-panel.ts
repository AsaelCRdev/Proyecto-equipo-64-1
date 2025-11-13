import { Component, inject, OnInit } from '@angular/core';
import { MovieConfigDialog } from '../movie-config-dialog/movie-config-dialog';
import { MovieSelectDialog } from '../movie-select-dialog/movie-select-dialog';
import { MovieService } from '../../services/movie.service';
import { Movie } from '../../model/Movie';
import { BuyerService } from '../../services/buyer.service';
import { Buyer } from '../../model/Buyer';
import { Review } from '../../model/Review';

interface Rental {
  id: number;
  buyer: string;
  email: string;
  movie: string;
  rentDate: string;
  returnDate: string;
  price: number;
  status: 'Activo' | 'Inactivo';
}
@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.html',
  imports: [MovieSelectDialog, MovieConfigDialog],
  standalone: true,
  styleUrl: './admin-panel.css',
})
export class AdminPanel implements OnInit {
  movieService = inject(MovieService);
  activeSection: 'compradores' | 'alquileres' | 'peliculas' | 'reseñas' = 'compradores';

  showSelect = false;
  showConfig = false;
  selectedMovie: Movie | undefined = undefined;
  buyerService = inject(BuyerService);

  buyers: Buyer[] | undefined = undefined;

  movies: Movie[] = [];
  rentals: Rental[] = [
    {
      id: 1,
      buyer: 'Carlos Martínez',
      email: 'carlos@email.com',
      movie: 'Viaje Estelar',
      rentDate: '31/10/2025',
      returnDate: '7/11/2025',
      price: 5.99,
      status: 'Activo',
    },
    {
      id: 2,
      buyer: 'Ana López',
      email: 'ana@email.com',

      movie: 'El Enigma',
      rentDate: '2/11/2025',
      returnDate: '9/11/2025',
      price: 4.99,
      status: 'Activo',
    },
  ];
  reviews: Review[] | undefined = undefined;

  ngOnInit(): void {
    this.movieService.getMovies().then((mv) => {
      if (mv != null) this.movies = mv;
    });
    this.buyerService.getBuyers().then((b) => {
      this.buyers = b;
    });
    this.movieService.getAllReviews().then((r) => {
      this.reviews = r;
    });
  }
  // abrir selector
  openSelect() {
    this.showSelect = true;
  }
  onSelectMovie(movie: Movie) {
    this.selectedMovie = movie;
    this.showSelect = false;
    this.showConfig = true;
  }

  // recibir payload del diálogo de configuración y añadir al catálogo (o actualizar)
  onAddToCatalog(payload: { movie: Movie; stock: number; price: number }) {
    this.movieService.addMovie(
      encodeURIComponent(payload.movie.imdbID.toLowerCase()),
      encodeURIComponent(payload.stock),
      encodeURIComponent(payload.price),
    );
    setTimeout(() => {
      this.movieService.getMovies().then((mv) => {
        if (mv != null) {
          this.movies = mv;
          console.log(this.movies);
        }
      });
    }, 1000);
    this.showConfig = false;
    this.selectedMovie = undefined;
  }

  setSection(section: 'compradores' | 'alquileres' | 'peliculas' | 'reseñas') {
    this.activeSection = section;
  }

  edit(item: any) {
    console.log('editar', item);
  }
  remove(item: any) {
    console.log('eliminar', item);
  }
}
