import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar';
import { MyRentals } from './components/my-rentals/my-rentals';
import { AdminPanel } from './components/admin-panel/admin-panel';
import { AuthService } from './services/auth-service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, NavbarComponent, MyRentals, AdminPanel],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
  standalone: true
})
export class App {
  protected readonly title = signal('Front');

  constructor(public auth: AuthService) {}
}