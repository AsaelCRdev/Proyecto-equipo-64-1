import { Component, inject, OnInit } from '@angular/core';
import { MovieConfigDialog } from '../movie-config-dialog/movie-config-dialog';
import { MovieSelectDialog } from '../movie-select-dialog/movie-select-dialog';
import { MovieService } from '../../services/movie.service';
import { Movie } from '../../model/Movie';
import { BuyerService } from '../../services/buyer.service';
import { Buyer } from '../../model/Buyer';
import { Review } from '../../model/Review';
import { MovieRental } from '../../model/MovieRental';
import { ReactiveFormsModule, FormControl } from '@angular/forms';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.html',
  imports: [ReactiveFormsModule, MovieSelectDialog, MovieConfigDialog],
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

  buyerControl = new FormControl('');
  rentControl = new FormControl('');
  movieControl = new FormControl('');
  reviewControl = new FormControl('');

  buyers: Buyer[] | undefined = undefined;

  movies: Movie[] = [];
  rentals: MovieRental[] = [];
  reviews: Review[] | undefined = undefined;

  filteredBuyers: Buyer[] = [];
  filteredMovies: Movie[] = [];
  filteredRentals: MovieRental[] = [];
  filteredReviews: Review[] = [];
  ngOnInit(): void {
    this.buyerService.getAllRented().then((v) => {
      if (v != null) {
        this.rentals = v;
        this.filteredRentals = this.rentals;
      }
    });
    this.movieService.getMovies().then((mv) => {
      if (mv != null) {
        this.movies = mv;
        this.filteredMovies = this.movies;
      }
    });
    this.buyerService.getBuyers().then((b) => {
      this.buyers = b as Buyer[];
      this.filteredBuyers = this.buyers as Buyer[];
    });
    this.movieService.getAllReviews().then((r) => {
      this.reviews = r;
      this.filteredReviews = this.reviews as Review[];
    });
    // Filtrar buyers por nombre
    this.buyerControl.valueChanges.subscribe((value) => {
      const search = (value || '').toLowerCase();
      this.filteredBuyers = this.buyers?.filter((b) =>
        b.name.toLowerCase().includes(search),
      ) as Buyer[];
    });

    // Filtrar rentals por título de película
    this.rentControl.valueChanges.subscribe((value) => {
      const search = (value || '').toLowerCase();
      this.filteredRentals = this.rentals.filter((r) =>
        (r.movieTitle || '').toLowerCase().includes(search),
      );
    });

    // Filtrar movies por título
    this.movieControl.valueChanges.subscribe((value) => {
      const search = (value || '').toLowerCase();
      this.filteredMovies = this.movies.filter((m) => m.title.toLowerCase().includes(search));
    });

    // Filtrar reviews por autor
    this.reviewControl.valueChanges.subscribe((value) => {
      const search = (value || '').toLowerCase();
      this.filteredReviews = this.reviews?.filter((r) =>
        r.author.toLowerCase().includes(search),
      ) as Review[];
    });

    // Inicializar arrays filtrados con todos los datos
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
