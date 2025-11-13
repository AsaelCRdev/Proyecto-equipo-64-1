// public String imdbID;
// public String title;
// public String genre[];
// public ArrayList<String> reviews; // TODO: Cambiar a objeto review
// public String released;
// public String poster;
// public String plot;
import { Review } from '../model/Review';
export interface Movie {
  imdbID: string;
  title: string;
  genre: string[];
  reviews: Review[];
  rating: number;
  released: string;
  poster: string;
  plot: string;
  price: string;
  stock: string;
}
