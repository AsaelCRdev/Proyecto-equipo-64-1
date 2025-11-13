import { inject, OnInit, Component, Output, EventEmitter } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { Movie } from '../../model/Movie';
import { MovieService } from '../../services/movie.service';

@Component({
  selector: 'app-movie-select-dialog',
  imports: [ReactiveFormsModule],
  standalone: true,
  templateUrl: './movie-select-dialog.html',
  styleUrl: './movie-select-dialog.css',
})
export class MovieSelectDialog implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Output() select = new EventEmitter<Movie>();
  queryControl = new FormControl('');
  movies: Movie[] | undefined = undefined;
  movieService = inject(MovieService);
  query = '';
  get filtered() {
    return this.movies;
    //   const q = this.query.trim().toLowerCase();
    //   if (!q) return this.movies;
    //   return this.movies.filter(
    //     (m) => (m.title || '').toLowerCase().includes(q) || (m.genre || '').toLowerCase().includes(q),
    //   );
  }

  ngOnInit(): void {
    this.queryControl.valueChanges
      .pipe(debounceTime(300)) // espera 300ms después del último cambio
      .subscribe((value) => {
        // this.searchText = encodeURIComponent(value!.toLocaleLowerCase());
        this.query = encodeURIComponent(value!.toLowerCase());
        console.log(this.query);
        this.movieService.getMoviesAvailables(this.query).then((res) => {
          console.log(res);
          if (res) this.movies = res;
        });
      });
  }
  onSelect(m: Movie) {
    this.select.emit(m);
  }

  onClose() {
    this.close.emit();
  }
}
