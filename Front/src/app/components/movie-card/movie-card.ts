import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Movie {
  id: number;
  title: string;
  year: number;
  rating: number;
  duration: string;
  imageUrl: string;
  genre: string;
  price:number;
}
@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './movie-card.html',
  styleUrls: ['./movie-card.css']
})
export class MovieCard {
  @Input() movie!:Movie;

  @Output() showDetails = new EventEmitter<Movie>();
  @Output() addToCart = new EventEmitter<Movie>();

  onDetailsClick():void{
    this.showDetails.emit(this.movie);
  }

  onAddClick():void{
    this.addToCart.emit(this.movie);
  }
}