import { Injectable, inject } from '@angular/core';
import { ApiBackService } from './api-back.service';
import { Movie } from '../model/Movie';
@Injectable({
  providedIn: 'root',
})
export class MovieService {
  endpoint = inject(ApiBackService);

  async getGenres(): Promise<string[] | null> {
    const res = await this.endpoint.getFromBackAsT<string[]>('/getGenres');
    return typeof res === 'string' ? null : res;
  }
  async getMovie(id: string): Promise<Movie | null> {
    const res = await this.endpoint.getFromBackAsT<Movie>(
      `/getMovies?id=${encodeURIComponent(id).toLowerCase()}`,
    );
    return typeof res === 'string' ? null : res;
  }
  async getMovies(
    search?: string | undefined,
    genre?: string | undefined,
  ): Promise<Movie[] | null> {
    let uri: string = '/getMovies?';
    if (search && search.trim() != '') {
      uri += `s=${encodeURIComponent(search.toLowerCase())}&`;
    }
    if (genre && genre.trim() != '') {
      uri += `g=${encodeURIComponent(genre.toLowerCase())}`;
    }
    const res: Movie[] | string = await this.endpoint.getFromBackAsT<Movie[]>(uri);
    return typeof res === 'string' ? null : res;
  }
}
