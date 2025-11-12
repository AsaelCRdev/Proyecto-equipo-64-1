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
  selector: 'app-movie-config-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './movie-config-dialog.html',
  styleUrls: ['./movie-config-dialog.css'],
})
export class MovieConfigDialog implements OnInit {
  fb = inject(FormBuilder);
  formControl: FormGroup = this.fb.group({
    stockControl: [
      0,
      [
        Validators.required,
        (control: AbstractControl): ValidationErrors | null => {
          const value = control.value;
          return Number.isInteger(value) && value > 0 ? null : { notValid: true };
        },
      ],
    ],
    priceControl: [
      0,
      [
        Validators.required,
        (control: AbstractControl): ValidationErrors | null => {
          const value = control.value;
          return value < 0 ? { notValid: true } : null;
        },
      ],
    ],
  });
  @Input() movie!: Movie;
  @Output() close = new EventEmitter<void>();
  @Output() add = new EventEmitter<{ movie: Movie; stock: number; price: number }>();
  @Output() selectOtherMovie = new EventEmitter<boolean>();

  stock: number = 0;
  price: number = 0;

  ngOnInit(): void {
    this.formControl.get('stockControl')?.valueChanges.subscribe((value) => {
      if (value != null) this.stock = value;
    });
    this.formControl.get('priceControl')?.valueChanges.subscribe((value) => {
      if (value != null) this.price = value;
    });
  }

  onAdd() {
    this.add.emit({ movie: this.movie, stock: this.stock, price: this.price });
  }

  onClose() {
    this.close.emit();
  }
  onSelectOtherMovie() {
    this.onClose();
    this.selectOtherMovie.emit(true);
  }
}
