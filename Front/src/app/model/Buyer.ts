import { ShoppingCart } from './ShoppingCart';
import { MovieRental } from './MovieRental';

export interface Buyer {
  id: string;
  name: string;
  email: string;
  password: string;
  address: string;
  phone: string;
  cart: ShoppingCart;
  rentedMovies: MovieRental[];
}
