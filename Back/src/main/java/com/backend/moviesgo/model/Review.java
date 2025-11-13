package com.backend.moviesgo.model;

import java.util.Objects;

public class Review {
  public String author;
  public String authorId;
  public String message;
  public String rating;

  public Review() {
  }

  public Review(
      String authorId,
      String author,
      String message,
      String rating) {
    this.authorId = authorId;
    this.author = author;
    this.message = message;
    this.rating = rating;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o)
      return true;
    if (o == null || getClass() != o.getClass())
      return false;
    Review r = (Review) o;
    return Objects.equals(this.authorId, r.authorId);
  }

  @Override
  public int hashCode() {
    return Objects.hash(this.authorId);
  }

}
