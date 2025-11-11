import { Component, OnInit, inject, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { Movie } from '../../model/Movie';

@Component({
  selector: 'app-movie-details',
  imports: [],
  templateUrl: './movie-details.html',
  styleUrl: './movie-details.css',
})
export class MovieDetails implements OnInit {
  movie: WritableSignal<Movie | undefined> = signal(undefined);
  private movieService: MovieService = inject(MovieService);
  route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.route.paramMap.subscribe(async (params) => {
      const id = params.get('id');
      if (id) {
        this.movie.set((await this.movieService.getMovie(id)) as Movie);
      }
    });
  }
}
