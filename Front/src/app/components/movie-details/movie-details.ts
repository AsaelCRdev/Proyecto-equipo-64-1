import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiBackService } from '../../services/api-back.service';
import { OnInit } from '@angular/core';
import { Movie } from '../../model/Movie';
import { inject } from '@angular/core';
import { WritableSignal } from '@angular/core';
import { signal } from '@angular/core';

@Component({
  selector: 'app-movie-details',
  imports: [],
  templateUrl: './movie-details.html',
  styleUrl: './movie-details.css',
})
export class MovieDetails implements OnInit {
  movie: WritableSignal<Movie | undefined> = signal(undefined);
  private apiBack: ApiBackService = inject(ApiBackService);
  route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.route.paramMap.subscribe(async (params) => {
      const id = params.get('id');
      if (id) {
        this.movie.set(await this.apiBack.getFromBackAsT<Movie>(`/getMovies?id=${id}`));
      }
    });
  }
}
