package com.backend.moviesgo.model;

import java.util.ArrayList;
import java.util.Objects;

public class Movie {
  public String imdbID;
  public String title;
  public String genre[];
  public ArrayList<String> reviews; // TODO: Cambiar a objeto reviews
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
      ArrayList<String> reviews,
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
      ArrayList<String> reviews,
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
    this.reviews = new ArrayList<String>();
    this.rating = mv.imdbRating;
    this.released = mv.Released;
    this.poster = mv.Poster;
    this.plot = mv.Plot;
    this.price = stock;
    this.stock = price;

  }

  public Movie(MovieSummary mv) {

    this.imdbID = mv.imdbID;
    this.title = mv.Title;
    this.reviews = new ArrayList<String>();
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
// Error cargando productos: Cannot construct instance of
// `com.backend.moviesgo.model.Movie` (no Creators, like default constructor,
// exist): cannot deserialize from Object value (no delegate- or property-based
// Creator)
// at [Source: REDACTED (`StreamReadFeature.INCLUDE_SOURCE_IN_LOCATION`
// disabled); line: 2, column: 3] (through reference chain:
// java.util.ArrayList[0])
// []
