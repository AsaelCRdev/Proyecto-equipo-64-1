import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MovieCard } from '../movie-card/movie-card';

interface Movie {
  id: number;
  title: string;
  year: number;
  rating: number;
  duration: string;
  imageUrl: string;
  genre: string;
}
interface Movie {
  id: number;
  title: string;
  year: number;
  rating: number;
  duration: string;
  imageUrl: string;
  genre: string;
}

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, FormsModule, MovieCard],
  templateUrl: './catalog.html',
  styleUrls: ['./catalog.css']
})
export class CatalogComponent implements OnInit {

  searchText: string = '';
  genres: string[] = ['Todos', 'Acción', 'Ciencia Ficción', 'Romance', 'Comedia', 'Terror', 'Drama', 'Aventura', 'Thriller'];
  selectedGenre: string = 'Todos';

  movies: Movie[] = [
    {
      id: 1,
      title: 'Acción Extrema',
      year: 2024,
      rating: 8.5,
      duration: '2h 15min',
      imageUrl: 'https://images.example.com/accion-extrema.jpg', 
      genre: 'Acción',
    },
    {
      id: 2,
      title: 'Viaje Estelar',
      year: 2024,
      rating: 9,
      duration: '2h 40min',
      imageUrl: 'https://images.example.com/viaje-estelar.jpg',
      genre: 'Ciencia Ficción',
    },
    {
      id: 3,
      title: 'Amor en París',
      year: 2023,
      rating: 7.8,
      duration: '1h 55min',
      imageUrl: 'https://images.example.com/amor-en-paris.jpg',
      genre: 'Romance',
    },
    // Agrega más películas según necesites
  ];

  filteredMovies: Movie[] = [];

  constructor() { }

  ngOnInit(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = this.movies;

    if (this.selectedGenre !== 'Todos') {
      filtered = filtered.filter(movie => movie.genre === this.selectedGenre);
    }

    if (this.searchText.trim()) {
      const lowerSearch = this.searchText.toLowerCase();
      filtered = filtered.filter(movie => movie.title.toLowerCase().includes(lowerSearch));
    }

    this.filteredMovies = filtered;
  }

  onGenreSelect(genre: string): void {
    this.selectedGenre = genre;
    this.applyFilters();
  }

  onSearchChange(): void {
    this.applyFilters();
  }
}

