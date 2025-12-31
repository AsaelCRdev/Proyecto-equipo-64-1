import { Component, inject, OnInit } from '@angular/core';
import { MovieConfigDialog } from '../movie-config-dialog/movie-config-dialog';
import { MovieSelectDialog } from '../movie-select-dialog/movie-select-dialog';
import { MovieService } from '../../services/movie.service';
import { Movie } from '../../model/Movie';
import { BuyerService } from '../../services/buyer.service';
import { Buyer } from '../../model/Buyer';
import { Review } from '../../model/Review';
import { MovieRental } from '../../model/MovieRental';
import { ɵInternalFormsSharedModule } from "@angular/forms";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.html',
  imports: [MovieSelectDialog, MovieConfigDialog, ɵInternalFormsSharedModule, FormsModule],
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
  rentals: MovieRental[] = [];
  reviews: Review[] | undefined = undefined;

isEditing = false;

  ngOnInit(): void {
    this.buyerService.getAllRented().then((v) => {
      if (v != null) this.rentals = v;
    });
    this.movieService.getMovies().then((mv) => {
      if (mv != null) this.movies = mv;
    });
    this.buyerService.getBuyers().then((b) => {
      this.buyers = b as Buyer[];
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

  edit(movie: Movie) {
    this.selectedMovie = { ...movie};
    this.isEditing = true;
  }

  async saveMovie() {
    if(!this.selectedMovie) return;
        const updateMovie = await this.movieService.updateMovie(this.selectedMovie.imdbID, this.selectedMovie);
        if(updateMovie){
            this.movies = this.movies.map(m=>m.imdbID === updateMovie.imdbID ? updateMovie : m);
        }
        this.isEditing = false;
        this.selectedMovie = undefined;
        alert('Actualizado');
  } 

  async remove(movie: Movie){
      if(!confirm('¿seguro?')) return;
      const result = await this.movieService.deleteMovie(movie.imdbID);
      if(result){
        this.movies = this.movies.filter(m => m.imdbID !== movie.imdbID);
        alert('Eliminado');
      }
  }

  cancelEdit(){
    this.isEditing = false;
    this.selectedMovie = undefined;
  }
}
