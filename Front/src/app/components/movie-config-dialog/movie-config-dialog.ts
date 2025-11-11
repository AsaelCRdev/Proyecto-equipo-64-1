import { Component, Input, EventEmitter, Output, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MovieItem } from '../movie-select-dialog/movie-select-dialog';

@Component({
  selector: 'app-movie-config-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './movie-config-dialog.html',
  styleUrls: ['./movie-config-dialog.css'],
})
export class MovieConfigDialog implements OnChanges {
  @Input() movie!: MovieItem;
  @Output() close = new EventEmitter<void>();
  @Output() add = new EventEmitter<{ movie: MovieItem; stock: number; price: number }>();

  stock: number = 10;
  price: number = 3.99;

  ngOnChanges() {
    if (this.movie) {
      this.stock = 10;
      this.price = 3.99;
    }
  }

  onAdd() {
    this.add.emit({ movie: this.movie, stock: this.stock, price: this.price });
  }

  onClose() {
    this.close.emit();
  }
}