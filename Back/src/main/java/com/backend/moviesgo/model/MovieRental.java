package com.backend.moviesgo.model;

import java.util.Objects;

public class MovieRental {
  String movieId;
  String startDate;
  String endDate;
  String price;

  @Override
  public boolean equals(Object o) {
    if (this == o)
      return true;
    if (o == null || getClass() != o.getClass())
      return false;
    MovieRental r = (MovieRental) o;
    return Objects.equals(this.movieId, r.movieId);
  }

  @Override
  public int hashCode() {
    return Objects.hash(this.movieId);
  }
}
