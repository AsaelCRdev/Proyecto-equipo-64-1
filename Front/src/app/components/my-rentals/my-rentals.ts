import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CatalogComponent } from '../catalog/catalog';
import { MovieRentalService, Rental } from '../../services/movie-rental-service';
import { MovieCard } from '../movie-card/movie-card';

@Component({
  selector: 'app-my-rentals',
  standalone: true,
  imports: [CommonModule, CatalogComponent,MovieCard],
  templateUrl: './my-rentals.html',
  styleUrls: ['./my-rentals.css'],
})
export class MyRentals {
  activeTab: 'alquilar' | 'activos' | 'historial' = 'alquilar';
  activeRentals: Rental[] = [];
  rentalHistory: Rental[] = [];
  constructor(private rentalService: MovieRentalService) {}
  ngOnInit() {
    this.loadRentals();
  }
  selectTab(tab: 'alquilar' | 'activos' | 'historial'): void {
    this.activeTab = tab;
    if (tab !== 'alquilar') {
      this.loadRentals();
    }
  }
  private loadRentals() {
    this.activeRentals = this.rentalService.getActiveRentals();
    this.rentalHistory = this.rentalService.getRentalHistory();
  }
}
