import { Component, OnInit, inject, WritableSignal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieCard } from '../movie-card/movie-card';
import { AlquilerDiasComponent } from '../Time-Rental/Time-Rental';
import { AuthService } from '../../services/auth-service';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { Movie } from '../../model/Movie';
import { RouterLink } from '@angular/router';
import { debounceTime } from 'rxjs/operators';
import { MovieService } from '../../services/movie.service';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MovieCard, RouterLink, AlquilerDiasComponent],
  templateUrl: './catalog.html',
  styleUrls: ['./catalog.css'],
})
export class CatalogComponent implements OnInit {
  searchText: string = '';
  genres: string[] = [];
  selectedGenre: string = 'All';

  private movieService: MovieService = inject(MovieService);
  movies: WritableSignal<Movie[] | undefined> = signal(undefined);

  filteredMovies: Movie[] = [];
  searchControl: FormControl = new FormControl('');

  showRentalModal: boolean = false;
  selectedMovieForRental: any = null;

  constructor() {}

  async ngOnInit(): Promise<void> {
    this.genres = (await this.movieService.getGenres()) as string[];
    this.movies.set((await this.movieService.getMovies(undefined, undefined)) as Movie[]);
    this.filteredMovies = (this.movies() ?? []) as Movie[];

    this.searchControl.valueChanges.pipe(debounceTime(300)).subscribe((value) => {
      this.searchText = encodeURIComponent((value ?? '').toString().toLocaleLowerCase());
      this.applyFilters();
    });
  }

  applyFilters(): void {
    this.movieService
      .getMovies(
        this.searchText.trim() === '' ? undefined : this.searchText,
        this.selectedGenre.trim() === '' ? undefined : this.selectedGenre,
      )
      .then((res) => {
        this.movies.set(res as Movie[]);
        this.filteredMovies = (res ?? []) as Movie[];
      });
  }

  onGenreSelect(genre: string): void {
    this.selectedGenre = genre;
    this.movieService.getMovies(undefined, this.selectedGenre).then((res) => {
      this.movies.set(res as Movie[]);
      this.filteredMovies = (res ?? []) as Movie[];
    });
  }

  onShowRentalModal(movie: Movie | any): void {
    // si hay control de sesión, podría validarse aquí; por ahora abrimos modal
    this.selectedMovieForRental = movie;
    this.showRentalModal = true;
  }

  onCloseRentalModal(): void {
    this.showRentalModal = false;
    this.selectedMovieForRental = null;
  }
}
