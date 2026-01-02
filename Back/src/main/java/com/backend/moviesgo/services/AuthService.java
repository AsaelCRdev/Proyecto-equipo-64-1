package com.backend.moviesgo.services;

import com.backend.moviesgo.model.Buyer;
import java.util.HashSet;
import com.backend.moviesgo.model.AuthResponse;

public class AuthService {
  private String adminEmail;
  private String adminPass;

  public AuthService(String mail, String pass) {
    this.adminEmail = mail;
    this.adminPass = pass;
  }

  public boolean isAdminEmail(String mail) {
    return mail.toLowerCase().equals(this.adminEmail.toLowerCase());
  }

  private boolean validate(String mail1, String mail2, String pass1, String pass2) {
    return mail1.toLowerCase().equals(mail2.toLowerCase()) && pass1.equals(pass2);
  }

  public boolean isAdmin(String mail, String pass) {
    return this.validate(this.adminEmail, mail, this.adminPass, pass);
  }

  private boolean isUser(String mail, String pass, HashSet<Buyer> users) {
    return users.stream().anyMatch(u -> this.validate(u.email, mail, u.password, pass));

  }

  public AuthResponse validLogin(String mail, String pass, HashSet<Buyer> users) {
    if (this.isAdmin(mail, pass)) {
      return new AuthResponse(true, false, new Buyer("admin"));

    }
    if (this.isUser(mail, pass, users)) {

      return new AuthResponse(
          false,
          true,
          (Buyer) users.stream().filter(u -> this.validate(u.email, mail, u.password, pass))
              .findFirst().orElse(null));
    }
    return new AuthResponse(false, false, new Buyer());

  }
}
