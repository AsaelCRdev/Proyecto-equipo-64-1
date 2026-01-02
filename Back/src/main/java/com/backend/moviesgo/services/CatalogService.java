
package com.backend.moviesgo.services;

import java.util.List;
import com.backend.moviesgo.model.Movie;
import java.util.Set;
import java.util.HashSet;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.backend.moviesgo.model.Review;
import com.backend.moviesgo.model.ReviewExtended;

@Service
public class CatalogService {
  public Set<Movie> catalog = new HashSet<>();
  public Set<String> genres = new HashSet<>();
  public JsonService<Movie> json = new JsonService<>("src/main/java/com/backend/moviesgo/json/movies.json",
      Movie.class);

  public void refresh() {
    this.catalog = new HashSet<Movie>(this.json.cargar());
    for (Movie mov : this.catalog) {
      for (String genre : mov.genre) {

        genres.add(genre);
      }
    }
    genres.add("All");

  }

  public CatalogService() {
    // TODO: Deberia cargar del JSON
    this.refresh();
  }

  public ArrayList<Review> getReviewById(String id) {
    return new ArrayList<Review>(
        ((Movie) this.catalog.stream().filter(m -> m.imdbID.equals(id)).findFirst().orElse(null)).reviews);
  }

  public List<ReviewExtended> getAllReviews() {
    return this.catalog.stream()
        .flatMap(m -> m.reviews.stream().map(r -> new ReviewExtended(r, m.title)))
        .collect(Collectors.toList());
  }

  public ArrayList<Movie> getMovies() {
    return new ArrayList<>(this.catalog);
  }

  public ArrayList<Movie> getMoviesBySearch(String search, String genre) {
    ArrayList<Movie> toFilter;
    if (genre.toLowerCase().equals("all")) {
      toFilter = this.getMovies();
    } else {

      toFilter = this.catalog.stream()
          .filter(mv -> Arrays.stream(mv.genre).anyMatch(g -> g.equalsIgnoreCase(genre)))
          .collect(Collectors.toCollection(ArrayList::new));
    }
    return toFilter.stream().filter(mv -> mv.title.toLowerCase().contains(search.toLowerCase()))
        .collect(Collectors.toCollection(ArrayList::new));
  }

  public ArrayList<Movie> getMoviesBySearch(String search) {
    return this.catalog.stream().filter(mv -> mv.title.toLowerCase().contains(search.toLowerCase()))
        .collect(Collectors.toCollection(ArrayList::new));
  }

  public ArrayList<Movie> getMoviesByGenre(String genre) {
    if (genre.toLowerCase().equals("all")) {
      return this.getMovies();
    }
    return this.catalog.stream()
        .filter(mv -> Arrays.stream(mv.genre).anyMatch(g -> g.equalsIgnoreCase(genre)))
        .collect(Collectors.toCollection(ArrayList::new));
  }

  public boolean addMovie(Movie mv) {
    boolean res = this.catalog.add(mv);
    if (res)
      this.json.guardar(new ArrayList<Movie>(this.catalog));

    return res;
  }

  public Movie getMovieById(String id) {
    for (Movie mov : this.catalog) {
      if (mov.imdbID.equals(id)) {

        return mov;
      }
    }
    return null;
  }

  public boolean addReview(String movieId, Review r) {
    for (Movie m : this.catalog) {
      if (m.imdbID.equals(movieId)) {
        boolean value = m.reviews.add(r);
        this.json.guardar(new ArrayList<Movie>(this.catalog));
        this.refresh();
        return value;
      }
    }
    return false;

  }

  public boolean deleteMovieById(String id) {
    Movie toRemove = this.getMovieById(id);
    if (toRemove == null) {
      return false;
    }

    boolean removed = this.catalog.remove(toRemove);
    if (removed) {
      this.json.guardar(new ArrayList<Movie>(this.catalog));
      this.refresh();
    }
    return removed;
  }

  public boolean editMovieStockPrice(String id, String stock, String price) {
    Movie m = this.getMovieById(id);
    if (m == null) {
      return false;
    }

    boolean changed = false;

    if (stock != null && !stock.trim().isEmpty()) {
      m.stock = stock.trim();
      changed = true;
    }

    if (price != null && !price.trim().isEmpty()) {
      m.price = price.trim();
      changed = true;
    }

    if (!changed) {
      return false;
    }

    // Persistir cambios
    this.json.guardar(new ArrayList<Movie>(this.catalog));
    this.refresh();

    return true;
  }
}
