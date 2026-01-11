import { Component, inject, OnInit, signal } from '@angular/core';
import { WritableSignal } from '@angular/core';
import { MovieConfigDialog } from '../movie-config-dialog/movie-config-dialog';
import { MovieSelectDialog } from '../movie-select-dialog/movie-select-dialog';
import { MovieService } from '../../services/movie.service';
import { Movie } from '../../model/Movie';
import { BuyerService } from '../../services/buyer.service';
import { Buyer } from '../../model/Buyer';
import { Review } from '../../model/Review';
import { MovieRental } from '../../model/MovieRental';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MovieEditDialog } from '../movie-edit-dialog/movie-edit-dialog';
import { BuyerEditDialog } from '../buyer-edit-dialog/buyer-edit-dialog';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.html',
  imports: [
    ReactiveFormsModule,
    MovieSelectDialog,
    MovieConfigDialog,
    MovieEditDialog,
    BuyerEditDialog,
  ],
  standalone: true,
  styleUrl: './admin-panel.css',
})
export class AdminPanel implements OnInit {
  buyerSignal: WritableSignal<Buyer | undefined> = signal(undefined);
  showBuyerEdit = false;
  movieService = inject(MovieService);
  activeSection: 'compradores' | 'alquileres' | 'peliculas' | 'reseñas' = 'compradores';

  showSelect = false;
  showConfig = false;
  showEdit = false;
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

  onEditMovie(payload: { imdbId: string; price: string; stock: string }) {
    this.movieService
      .editMovieStockPrice(
        encodeURIComponent(payload.imdbId.toLowerCase()),
        encodeURIComponent(payload.stock),
        encodeURIComponent(payload.price),
      )
      .then((ok) => {
        this.showEdit = false;
        if (ok) {
          alert('Película editada');
          this.movieService.getMovies().then((mv) => (this.filteredMovies = mv ?? []));
        } else {
          alert('No se pudo editar la pelicula, intente de nuevo');
        }
      });
  }
  onEditBuyer(payload: {
    id: string;
    email?: string;
    pass?: string;
    name?: string;
    address?: string;
    phone?: string;
  }) {
    console.log('Editando buyer', payload);
    this.buyerService
      .editBuyer(payload.id, payload.name, payload.email, payload.address, payload.phone)
      .then((ok) => {
        if (ok) {
          alert('Cambios realizados exitosamente');
          this.buyerService.getBuyers().then((b) => (this.filteredBuyers = b as Buyer[]));
        } else {
          alert(
            'El email ya esta registrado en otra cuenta o hubo un error en el servidor. Intente de nuevo',
          );
        }
      });
  }
  edit(item: any) {
    console.log('editar', item);
    if ('email' in item) {
      // Es un buyer
      this.buyerSignal.set(item as Buyer);
      this.showBuyerEdit = true;
    } else {
      // Es una movie
      this.selectedMovie = item as Movie;
      this.showEdit = true;
      console.log('editando pelicula');
    }
  }
  remove(item: any) {
    if ('email' in item) {
      // Es un Buyer
      console.log('Eliminar Buyer', item);
      this.buyerService.deleteBuyer(item.id).then((ok) => {
        if (ok) {
          alert('Buyer eliminado');
          this.buyerService.getBuyers().then((b) => (this.filteredBuyers = b as Buyer[]));
        }
      });
    } else if ('genre' in item) {
      // Es una Movie
      console.log('Eliminar Movie', item);
      this.movieService.deleteMovie(item.imdbID).then((ok) => {
        if (ok) {
          alert('Película eliminada');
          this.movieService.getMovies().then((mv) => (this.filteredMovies = mv ?? []));
        }
      });
    } else if ('message' in item) {
      // Es una Review
      console.log('Eliminar Review', item);
      this.movieService.deleteReview(item.authorId, item.movie).then((ok) => {
        if (ok) {
          alert('Reseña eliminada');
          this.movieService.getAllReviews().then((r) => (this.filteredReviews = r));
        }
      });
    }
  }
}
