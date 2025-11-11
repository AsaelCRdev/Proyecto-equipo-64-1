
package com.backend.moviesgo.model;

import java.util.List;
import com.backend.moviesgo.model.Movie;
import java.util.Set;
import java.util.HashSet;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.stream.Collectors;
import com.backend.moviesgo.services.JsonService;

public class MovieCatalog {
  public Set<Movie> catalog = new HashSet<>();
  public Set<String> genres = new HashSet<>();
  public JsonService<Movie> json = new JsonService<>("src/main/java/com/backend/moviesgo/json/movies.json",
      Movie.class);

  public MovieCatalog() {
    // TODO: Deberia cargar del JSON
    this.catalog = new HashSet<Movie>(this.json.cargar());
    for (Movie mov : this.catalog) {
      for (String genre : mov.genre) {

        genres.add(genre);
      }
    }
    genres.add("All");
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

  public Movie getMovieById(String id) {
    for (Movie mov : this.catalog) {
      if (mov.imdbID.equals(id)) {

        return mov;
      }
    }
    return null;
  }
}
