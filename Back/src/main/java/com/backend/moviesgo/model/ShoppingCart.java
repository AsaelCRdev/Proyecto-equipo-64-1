package com.backend.moviesgo.model;

import com.backend.moviesgo.model.MovieRental;
import java.util.HashSet;

public class ShoppingCart {
  public HashSet<MovieRental> movies;

  public ShoppingCart() {
    this.movies = new HashSet<MovieRental>();
  }
}
