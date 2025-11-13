import { Routes } from '@angular/router';
import { MovieDetails } from './components/movie-details/movie-details';
import { CatalogComponent } from './components/catalog/catalog';
import { BuyerPanel } from './components/buyer-panel/buyer-panel';
export const routes: Routes = [
  { path: '', component: CatalogComponent },
  { path: 'movie/:id', component: MovieDetails },
  { path: 'account/:id', component: BuyerPanel },
];
