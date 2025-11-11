import { Component } from '@angular/core';
interface Buyer {
  id: string;
  name: string;
  email: string;
  address: string;
  phone: string;
  registered: string;
}
interface Movie {
  id: number;
  title: string;
  genre: string;
  year: number;
  duration: string;
  rating: number;
  price: number;
  stock: number;
}
interface Rental {
  id: number;
  buyer: string;
  email: string;
  movie: string;
  rentDate: string;
  returnDate: string;
  price: number;
  status: 'Activo' | 'Inactivo';
}
interface Review {
  id: number;
  user: string;
  movie: string;
  rating: string;
  text: string;
  date: string;
}

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.html',
  standalone: true,
  styleUrl: './admin-panel.css',
})
export class AdminPanel {
  activeSection: 'compradores' | 'alquileres' | 'peliculas' | 'reseñas' = 'compradores';

  buyers: Buyer[] = [
    {
      id: '1',
      name: 'Carlos Martínez',
      email: 'carlos@email.com',
      address: 'Av de las mercedes,edif:el Pinar,Caracas',
      phone: '+58 04243389531',
      registered: '14/1/2025',
    },
    {
      id: '2',
      name: 'Jose Lopez',
      email: 'antilopez@email.com',
      address: 'La Taona,residencias el valle,Miranda',
      phone: '+58 04123312342',
      registered: '1/10/2025',
    },
  ];

  movies: Movie[] = [
    {
      id: 1,
      title: 'Acción Extrema',
      genre: 'Acción',
      year: 2024,
      duration: '2h 15min',
      rating: 8.5,
      price: 4.99,
      stock: 15,
    },
    {
      id: 2,
      title: 'Viaje Estelar',
      genre: 'Ciencia Ficción',
      year: 2024,
      duration: '2h 40min',
      rating: 9,
      price: 5.99,
      stock: 10,
    },
  ];

  rentals: Rental[] = [
    {
      id: 1,
      buyer: 'Carlos Martínez',
      email: 'carlos@email.com',
      movie: 'Viaje Estelar',
      rentDate: '31/10/2025',
      returnDate: '7/11/2025',
      price: 5.99,
      status: 'Activo',
    },
    {
      id: 2,
      buyer: 'Ana López',
      email: 'ana@email.com',
      movie: 'El Enigma',
      rentDate: '2/11/2025',
      returnDate: '9/11/2025',
      price: 4.99,
      status: 'Activo',
    },
  ];

  reviews: Review[] = [
    {
      id: 1,
      user: 'Carlos Martínez',
      movie: 'Acción Extrema',
      rating: '5/5',
      text: '¡Increíble película!',
      date: '1/11/2025',
    },
    {
      id: 2,
      user: 'Laura García',
      movie: 'Acción Extrema',
      rating: '4/5',
      text: 'Muy entretenida.',
      date: '3/11/2025',
    },
  ];

  setSection(section: 'compradores' | 'alquileres' | 'peliculas' | 'reseñas') {
    this.activeSection = section;
  }

  edit(item: any) {
    console.log('editar', item);
  }
  remove(item: any) {
    console.log('eliminar', item);
  }
}
