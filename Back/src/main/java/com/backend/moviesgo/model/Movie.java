package com.backend.moviesgo.model;

import java.util.ArrayList;

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
      String price) {
    this.imdbID = imdbID;
    this.title = title;
    this.genre = genre;
    this.reviews = reviews;
    this.rating = rating;
    this.released = released;
    this.poster = poster;
    this.plot = plot;
    this.price = price;

  }
}
