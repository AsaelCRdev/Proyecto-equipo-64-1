package com.backend.moviesgo.model;

public class AuthResponse {
  public boolean isAdmin;
  public boolean isUser;
  public Buyer buyer;

  public AuthResponse(boolean adm, boolean isUser, Buyer user) {
    isAdmin = adm;
    this.isUser = isUser;
    this.buyer = user;
  }
}
