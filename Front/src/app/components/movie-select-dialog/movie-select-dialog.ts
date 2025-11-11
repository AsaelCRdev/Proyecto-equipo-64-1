import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface MovieItem {
  id?: number;
  title: string;
  genre: string;
  year?: number;
  rating?: number;
  duration?: string;
  imageUrl?: string;
}

@Component({
  selector: 'app-movie-select-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './movie-select-dialog.html',
  styleUrls: ['./movie-select-dialog.css'],
})
export class MovieSelectDialog {
  @Output() close = new EventEmitter<void>();
  @Output() select = new EventEmitter<MovieItem>();

  query: string = '';

  movies: MovieItem[] = [
    { title: 'Persecución', genre: 'Acción', year: 2024, rating: 5, duration: '2h 10min', imageUrl: 'https://picsum.photos/300/420?random=1' },
    { title: 'Despertar', genre: 'Acción', year: 2024, rating: 4.5, duration: '2h 5min', imageUrl: 'https://picsum.photos/300/420?random=2' },
    { title: 'La Casa', genre: 'Terror', year: 2023, rating: 3.3, duration: '1h 45min', imageUrl: 'https://picsum.photos/300/420?random=3' },
    { title: 'Sombras del Pasado', genre: 'Terror', year: 2024, rating: 4.5, duration: '1h 45min', imageUrl: 'https://picsum.photos/300/420?random=4' },
    ...Array.from({length: 20}).map((_, i) => ({
      title: `Película ${i+1}`,
      genre: ['Acción','Comedia','Romance','Terror'][i % 4],
      year: 2020 + (i % 6),
      rating: 6 + (i % 4) * 0.5,
      duration: `${1 + (i % 3)}h ${15 + (i % 3)*5}min`,
      imageUrl: `https://picsum.photos/300/420?random=${10 + i}`
    }))
  ];

  get filtered() {
    const q = this.query.trim().toLowerCase();
    if (!q) return this.movies;
    return this.movies.filter(m =>
      (m.title || '').toLowerCase().includes(q) ||
      (m.genre || '').toLowerCase().includes(q)
    );
  }

  onSelect(m: MovieItem) {
    this.select.emit(m);
  }

  onClose() {
    this.close.emit();
  }
}