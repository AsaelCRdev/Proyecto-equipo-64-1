import { Injectable, inject } from '@angular/core';
import { ApiBackService, EndpointResponse } from './api-back.service';
import { Movie } from '../model/Movie';
import { Review } from '../model/Review';

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

  async addReview(id: string, userId: string, message: string, rating: string): Promise<boolean> {
    let uri = '/addReview?';
    if (id.trim() == '') return false;
    uri += `id=${id}`;
    if (userId.trim() == '') return false;
    uri += `&u=${userId}`;
    if (message.trim() == '') return false;
    uri += `&m=${message}`;
    if (rating.trim() == '') return false;
    uri += `&r=${rating}`;
    return (
      ((await this.endpoint.getFromBackAsT<string>(uri, 'POST')) as string).toLowerCase() ===
      'succes'
    );
  }
  async getAllReviews(id?: string | undefined): Promise<Review[]> {
    let uri = '/getAllReviews';
    if (id && id.trim() != '') uri += `?id=${id}`;
    const res = await this.endpoint.getFromBackAsT<Review[]>(uri);
    console.log(res);
    return Array.isArray(res) ? res : [];
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
  async editMovieStockPrice(id: string, stock?: string, price?: string): Promise<boolean> {
    if (!id || id.trim() === '') return false;

    let uri = `/editMovieStockPrice?id=${encodeURIComponent(id)}`;
    if (stock && stock.trim() !== '') uri += `&stock=${encodeURIComponent(stock)}`;
    if (price && price.trim() !== '') uri += `&price=${encodeURIComponent(price)}`;

    const res = await this.endpoint.getFromBackAsT<string>(uri, 'PATCH');
    console.log('Respuesta editMovieStockPrice:', res);

    return (res as string).toLowerCase() === 'succes';
  }

  async deleteReview(buyerId: string, movieTitle: string): Promise<boolean> {
    if (!buyerId || !movieTitle) return false;

    const uri = `/deleteReview?buyerId=${encodeURIComponent(buyerId)}&movieTitle=${encodeURIComponent(movieTitle)}`;
    const res = await this.endpoint.getFromBackAsT<string>(uri, 'DELETE');
    console.log('Respuesta deleteReview:', res);

    return (res as string).toLowerCase() === 'succes';
  }
  async deleteMovie(id: string): Promise<boolean> {
    if (!id || id.trim() === '') return false;

    const uri = `/deleteMovie?id=${encodeURIComponent(id)}`;
    const res = await this.endpoint.getFromBackAsT<string>(uri, 'DELETE');
    console.log('Respuesta deleteMovie:', res);

    return (res as string).toLowerCase() === 'succes';
  }
}
