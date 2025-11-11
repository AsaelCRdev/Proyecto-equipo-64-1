import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar';
import { AdminPanel } from './components/admin-panel/admin-panel';
import { AuthService } from './services/auth-service';
import { ShoppingCartComponent } from './components/shopping-cart/shopping-cart';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, AdminPanel, AsyncPipe, ShoppingCartComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
  standalone: true,
})
export class App {
  auth = inject(AuthService);
  protected readonly title = signal('Front');
}
