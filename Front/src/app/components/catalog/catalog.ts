import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl } from '@angular/forms';
import { MovieCard } from '../movie-card/movie-card';
import { ReactiveFormsModule } from '@angular/forms';
import { ApiBackService } from '../../services/api-back.service';
import { inject } from '@angular/core';
import { Movie } from '../../model/Movie';
import { RouterLink } from '@angular/router';
import { WritableSignal, signal } from '@angular/core';
import { debounceTime } from 'rxjs/operators';
@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MovieCard, RouterLink],
  templateUrl: './catalog.html',
  styleUrls: ['./catalog.css'],
})
export class CatalogComponent implements OnInit {
  searchControl = new FormControl('');
  searchText: string = '';
  genres: string[] = [];
  selectedGenre: string = 'All';

  private apiBack: ApiBackService = inject(ApiBackService);
  movies: WritableSignal<Movie[] | undefined> = signal(undefined);

  filteredMovies: Movie[] = [];

  constructor() {}

  async ngOnInit(): Promise<void> {
    this.genres = await this.apiBack.getFromBackAsT<string[]>('/getGenres');
    this.movies.set(await this.apiBack.getFromBackAsT<Movie[]>('/getMovies'));
    this.filteredMovies = this.movies() as Movie[];
    this.searchControl.valueChanges
      .pipe(debounceTime(300)) // espera 300ms después del último cambio
      .subscribe((value) => {
        this.searchText = encodeURIComponent(value!.toLocaleLowerCase());
        this.applyFilters(); // o llamar al backend si querés
      });
  }

  applyFilters(): void {
    let uri: string = '/getMovies?';

    if (this.searchText.trim() != '') {
      uri += `s=${this.searchText}&`;
    }
    const genre = encodeURIComponent(this.selectedGenre.toLowerCase());
    if (genre.trim() != '') {
      uri += `g=${genre}`;
    }
    this.apiBack.getFromBackAsT<Movie[]>(uri).then((res) => {
      this.movies.set(res);
      this.filteredMovies = this.movies() as Movie[];
    });
  }

  onGenreSelect(genre: string, e: Event): void {
    this.selectedGenre = genre;
    this.apiBack
      .getFromBackAsT<
        Movie[]
      >(`/getMovies?g=${encodeURIComponent(this.selectedGenre.toLocaleLowerCase())}`)
      .then((res) => {
        this.movies.set(res);
        this.applyFilters();
      });
  }
}
