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
    const res = await this.endpoint.getFromBackAsT<Movie>(`/getMovies?id=${id}`);
    return typeof res === 'string' ? null : res;
  }
  async getMoviesAvailables(search: String, page?: String | undefined): Promise<Movie[] | null> {
    let uri = '/getMoviesAvailables?';
    if (search.trim() == '') return null;
    uri += `s=${search}`;
    if (page && page.trim() != '') uri += `page=${page}`;

    const res: Movie[] | string = await this.endpoint.getFromBackAsT<Movie[]>(uri);
    return typeof res === 'string' ? null : res.filter((mv) => mv.poster != 'N/A');
  }
  async addMovie(id: string, stock: string, price: string): Promise<boolean | null> {
    let uri = '/addMovie?';
    if (id.trim() == '') return null;
    uri += `id=${id}`;
    if (stock.trim() == '') return null;
    uri += `&st=${stock}`;
    if (price.trim() == '') return null;
    uri += `&p=${price}`;

    const res: boolean | string = await this.endpoint.getFromBackAsT<boolean>(uri, 'POST');
    return typeof res === 'string' ? null : res;
  }

  async getMovies(
    search?: string | undefined,
    genre?: string | undefined,
  ): Promise<Movie[] | null> {
    let uri: string = '/getMovies?';
    if (search && search.trim() != '') {
      uri += `s=${search}&`;
    }
    if (genre && genre.trim() != '') {
      uri += `g=${genre}`;
    }
    const res: Movie[] | string = await this.endpoint.getFromBackAsT<Movie[]>(uri);
    return typeof res === 'string' ? null : res;
  }
}
