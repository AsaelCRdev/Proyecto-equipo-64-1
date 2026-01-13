package com.backend.moviesgo.model;

import java.util.Objects;
import java.util.HashSet;
import com.backend.moviesgo.model.Review;

public class Movie {
  public String imdbID;
  public String title;
  public String genre[];
  public HashSet<Review> reviews; // TODO: Cambiar a objeto reviews
  public String rating;
  public String released;
  public String poster;
  public String plot;
  public String price;
  public String stock;

  public Movie() {
  }

  public Movie(
      String imdbID,
      String title,
      String genre[],
      HashSet<Review> reviews,
      String rating,
      String released,
      String poster,
      String plot) {
    this.imdbID = imdbID;
    this.title = title;
    this.genre = genre;
    this.reviews = reviews;
    this.rating = rating;
    this.released = released;
    this.poster = poster;
    this.plot = plot;

  }

  public Movie(
      String imdbID,
      String title,
      String genre[],
      HashSet<Review> reviews,
      String rating,
      String released,
      String poster,
      String plot,
      String price,
      String stock) {
    this.imdbID = imdbID;
    this.title = title;
    this.genre = genre;
    this.reviews = reviews;
    this.rating = rating;
    this.released = released;
    this.poster = poster;
    this.plot = plot;
    this.price = price;
    this.stock = stock;

  }

  public Movie(MovieDetail mv, String stock, String price) {

    this.imdbID = mv.imdbID;
    this.title = mv.Title;
    this.genre = mv.Genre.split(",\\s*");
    this.reviews = new HashSet<Review>();
    this.rating = mv.imdbRating;
    this.released = mv.Released;
    this.poster = mv.Poster;
    this.plot = mv.Plot;
    this.price = price;
    this.stock = stock;

  }

  public Movie(MovieSummary mv) {

    this.imdbID = mv.imdbID;
    this.title = mv.Title;
    this.reviews = new HashSet<Review>();
    this.poster = mv.Poster;
    this.price = "0";
    this.stock = "0";

  }

  @Override
  public boolean equals(Object o) {
    if (this == o)
      return true;
    if (o == null || getClass() != o.getClass())
      return false;
    Movie movie = (Movie) o;
    return Objects.equals(imdbID, movie.imdbID);
  }

  @Override
  public int hashCode() {
    return Objects.hash(imdbID);
  }
}
