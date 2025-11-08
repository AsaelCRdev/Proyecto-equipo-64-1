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
      title: 'Avatar 3',
      year: 2027,
      rating: 8.5,
      duration: '2h 15min',
      imageUrl: 'https://lumiere-a.akamaihd.net/v1/images/image_17096efb.jpeg?region=0%2C0%2C540%2C810&width=320', 
      genre: 'Acción',
    },
    {
      id: 2,
      title: 'Interestelar',
      year: 2024,
      rating: 9,
      duration: '2h 40min',
      imageUrl: 'https://m.media-amazon.com/images/S/pv-target-images/79194981293eabf6620ece96eb5a9c1fffa04d3374ae12986e0748800b37b9cf.jpg',
      genre: 'Ciencia Ficción',
    },
    {
      id: 3,
      title: 'Amor, París y cine',
      year: 2023,
      rating: 7.8,
      duration: '1h 55min',
      imageUrl: 'https://m.media-amazon.com/images/S/pv-target-images/c6a2456c95a7794614959a861d952ae8934678fc6052bdbf0c1ebe0be03ae7f1.png',
      genre: 'Romance',
    },
   
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

