package com.backend.moviesgo.model;

import java.util.Objects;

public class MovieRental {
  public String buyerId;
  public String movieTitle;
  public String movieId;
  public String startDate;
  public String endDate;
  public String price;
  public String days;

  @Override
  public boolean equals(Object o) {
    if (this == o)
      return true;
    if (o == null || getClass() != o.getClass())
      return false;
    MovieRental r = (MovieRental) o;
    return Objects.equals(this.movieId, r.movieId) &&
        Objects.equals(this.buyerId, r.buyerId);
  }

  @Override
  public int hashCode() {
    return Objects.hash(this.movieId + this.buyerId);
  }
}
