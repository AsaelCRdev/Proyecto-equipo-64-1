package com.backend.moviesgo.model;

public class ReviewExtended extends Review {
  public String movie;

  public ReviewExtended(Review base, String movie) {
    super(base.authorId, base.author, base.message, base.rating);
    this.movie = movie;
  }
}
