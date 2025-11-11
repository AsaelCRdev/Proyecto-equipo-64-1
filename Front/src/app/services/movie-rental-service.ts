import { Injectable, OnInit, inject } from '@angular/core';
import { Movie } from '../model/Movie';
import { MovieService } from './movie.service';
import { WritableSignal, signal } from '@angular/core';
export interface Rental {
  movie: Movie;
  rentDate: Date;
  expireDate: Date;
}
/*Todo esto es codigo base entonces puede ser reemplazado por una consulta al Json*/
@Injectable({ providedIn: 'root' })
export class MovieRentalService implements OnInit {
  movieService = inject(MovieService);
  rentals: WritableSignal<Rental[] | undefined> = signal(undefined);
  ngOnInit(): void {
    this.movieService.getMovies(undefined, undefined).then((res) =>
      this.rentals.set(
        (res as Movie[]).map((mv) => {
          return { movie: mv, rentDate: new Date(), expireDate: new Date(2050, 1) };
        }),
      ),
    );
  }

  // Método para saber si los alquileres aun estan activos
  getActiveRentals(): Rental[] {
    const today = new Date();
    return this.rentals()?.filter((r) => r.expireDate > today) as Rental[];
  }

  getRentalHistory(): Rental[] {
    const today = new Date();
    return this.rentals()?.filter((r) => r.expireDate <= today) as Rental[];
  }
}
