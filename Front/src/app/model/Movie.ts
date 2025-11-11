// public String imdbID;
// public String title;
// public String genre[];
// public ArrayList<String> reviews; // TODO: Cambiar a objeto review
// public String released;
// public String poster;
// public String plot;
export interface Movie {
  imdbID: string;
  title: string;
  genre: string[];
  reviews: string[];
  rating: number;
  released: string;
  poster: string;
  plot: string;
  price: string;
}
