import { Injectable } from '@angular/core';
import { Movie } from '../components/movie-card/movie-card';
export interface Rental {
  movie: Movie;
  rentDate: Date;
  expireDate: Date;
}
/*Todo esto es codigo base entonces puede ser reemplazado por una consulta al Json*/
@Injectable({ providedIn: 'root' })
export class MovieRentalService {
  
  private rentals: Rental[] = [
   
    {
      movie: {
        id: 1,
        title: 'Acción Extrema',
        year: 2024,
        rating: 8.5,
        duration: '2h 15min',
        imageUrl: 'url-imagen1.jpg',
        genre: 'Acción'
      },
      rentDate: new Date('2024-07-10'),
      expireDate: new Date('2024-07-17')
    },
    {
      movie: {
        id: 2,
        title: 'Amor en París',
        year: 2023,
        rating: 7.8,
        duration: '1h 55min',
        imageUrl: 'url-imagen2.jpg',
        genre: 'Romance'
      },
      rentDate: new Date('2024-06-01'),
      expireDate: new Date('2024-06-08')
    },
  ];

  // Método para saber si los alquileres aun estan activos
  getActiveRentals(): Rental[] {
    const today = new Date();
    return this.rentals.filter(r => r.expireDate > today);
  }

   getRentalHistory(): Rental[] {
    const today = new Date();
    return this.rentals.filter(r => r.expireDate <= today);
  }
}
