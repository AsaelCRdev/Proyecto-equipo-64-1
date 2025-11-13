package com.backend.moviesgo.model;

import java.util.Objects;
import java.util.HashSet;

public class Buyer {
  public String id;
  public String name;
  public String email;
  public String password;
  public String address;
  public String phone;
  public ShoppingCart cart;
  public HashSet<MovieRental> rentedMovies;

  public Buyer() {
  }

  public Buyer(String name) {
    this.name = name;
  }

  public Buyer(
      String id,
      String name,
      String email,
      String password,
      String address,
      String phone) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.address = address;
    this.phone = phone;
    this.cart = new ShoppingCart();
    this.rentedMovies = new HashSet<MovieRental>();

  }

  @Override
  public boolean equals(Object o) {
    if (this == o)
      return true;
    if (o == null || getClass() != o.getClass())
      return false;
    Buyer r = (Buyer) o;
    if ("admin@MoviesGo.com".equals(r.email)) {
    }
    return Objects.equals(this.email, r.email);
  }

  @Override
  public int hashCode() {
    return Objects.hash(this.id);
  }
}
