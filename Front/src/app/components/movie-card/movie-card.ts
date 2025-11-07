import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Movie {
  id: number;
  title: string;
  year: number;
  rating: number;
  duration: string;
  imageUrl: string;
  genre: string;
}
@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './movie-card.html',
  styleUrls: ['./movie-card.css']
})
export class MovieCard {
  @Input() movie!: { title: string; imageUrl: string; rating: number; duration: string; year: number; };
}