import { Component, Input, EventEmitter, Output, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormControl,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { Movie } from '../../model/Movie';
import { ValidationErrors } from '@angular/forms';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-movie-edit-dialog',
  imports: [CommonModule, ReactiveFormsModule],
  standalone: true,
  templateUrl: './movie-edit-dialog.html',
  styleUrl: './movie-edit-dialog.css',
})
export class MovieEditDialog implements OnInit {
  @Input() movie!: Movie;
  @Output() close = new EventEmitter<void>();
  @Output() editMovie = new EventEmitter<{ imdbId: string; price: string; stock: string }>();
  stock: number = 0;
  price: number = 0;

  fb = inject(FormBuilder);
  formControl: FormGroup = this.fb.group({
    stockControl: [
      this.stock,
      [
        Validators.required,
        (control: AbstractControl): ValidationErrors | null => {
          const value = control.value;
          return Number.isInteger(value) && value > 0 ? null : { notValid: true };
        },
      ],
    ],
    priceControl: [
      this.price,
      [
        Validators.required,
        (control: AbstractControl): ValidationErrors | null => {
          const value = control.value;
          return value < 0 ? { notValid: true } : null;
        },
      ],
    ],
  });
  ngOnInit(): void {
    this.formControl.get('stockControl')?.valueChanges.subscribe((value) => {
      if (value != null) this.stock = value;
    });
    this.formControl.get('priceControl')?.valueChanges.subscribe((value) => {
      if (value != null) this.price = value;
    });
  }
  onClose() {
    this.close.emit();
  }
  onEditMovie() {
    this.editMovie.emit({
      imdbId: this.movie.imdbID,
      stock: this.stock.toString(),
      price: this.price.toString(),
    });
  }
}
