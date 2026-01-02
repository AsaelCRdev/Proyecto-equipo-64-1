import { Component, OnInit, inject, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { Movie } from '../../model/Movie';
import { ReviewsSectionComponent } from '../reviews-section/reviews-section';

@Component({
  selector: 'app-movie-details',
  imports: [ReviewsSectionComponent],
  templateUrl: './movie-details.html',
  styleUrl: './movie-details.css',
})
export class MovieDetails implements OnInit {
  movie: WritableSignal<Movie | undefined> = signal(undefined);
  status: string | undefined;
  private movieService: MovieService = inject(MovieService);
  route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.route.paramMap.subscribe(async (params) => {
      const id = params.get('id');
      if (id) {
        this.movieService.getMovie(id).then((mv) => {
          if (mv !== null) {
            this.movie.set(mv);
            this.status = parseInt(this.movie()!.stock) > 0 ? 'Disponible' : 'Agotado';
          }
          console.log(this.movie()?.reviews);
        });
      }
    });
  }
}
