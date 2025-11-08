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
       title: 'Avatar 3',
       year: 2027,
       rating: 8.5,
       duration: '2h 15min',
       imageUrl: 'https://lumiere-a.akamaihd.net/v1/images/image_17096efb.jpeg?region=0%2C0%2C540%2C810&width=320', 
       genre: 'Acción',
      },
      rentDate: new Date('2024-07-10'),
      expireDate: new Date('2024-07-17')
    },
    {
      movie: {
       id: 2,
       title: 'Interestelar',
       year: 2024,
       rating: 9,
       duration: '2h 40min',
       imageUrl: 'https://m.media-amazon.com/images/S/pv-target-images/79194981293eabf6620ece96eb5a9c1fffa04d3374ae12986e0748800b37b9cf.jpg',
       genre: 'Ciencia Ficción',
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
