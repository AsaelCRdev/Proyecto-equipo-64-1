package com.backend.moviesgo.controller;

import org.springframework.web.bind.annotation.PostMapping;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.backend.moviesgo.model.EndpointResponse;
import org.springframework.web.bind.annotation.CrossOrigin;

import org.springframework.beans.factory.annotation.Value;
import com.backend.moviesgo.model.BuyerList;
import com.backend.moviesgo.model.Buyer;
import com.backend.moviesgo.model.AuthResponse;
import com.backend.moviesgo.services.AuthService;

@CrossOrigin(origins = "*")

@RestController
public class BuyerController {
  public BuyerList users = new BuyerList();
  public int currentId = this.users.getMaxId();
  public AuthService auth;

  public BuyerController(
      @Value("${admin.mail}") String adminMail,
      @Value("${admin.pass}") String adminPass

  ) {
    this.auth = new AuthService(adminMail, adminPass);

  }

  @GetMapping("/logIn")
  public EndpointResponse logIn(

      @RequestParam(value = "email", required = true) String email,
      @RequestParam(value = "password", required = true) String password) {
    AuthResponse r = this.auth.validLogin(email, password, this.users.users);
    return new EndpointResponse(r, !r.isAdmin && !r.isUser);
  }

  @GetMapping("/getBuyers")
  public EndpointResponse getBuyer(
      @RequestParam(value = "id", required = false) String id) {
    if (id != null && id.trim() != "") {

      Buyer u = this.users.getBuyerById(id);
      return u == null ? new EndpointResponse("Not found", true) : new EndpointResponse(u, false);
    }
    return new EndpointResponse(this.users.users, false);

  }

  @PostMapping("/addBuyer")
  public EndpointResponse addBuyer(

      @RequestParam(value = "name", required = true) String name,
      @RequestParam(value = "email", required = true) String email,
      @RequestParam(value = "password", required = true) String password,
      @RequestParam(value = "address", required = true) String address,
      @RequestParam(value = "phone", required = true) String phone) {

    if (this.auth.isAdmin(email, password))
      return new EndpointResponse("Error", true);

    Buyer u = new Buyer(Integer.toString(this.currentId), name, email, password, address, phone);
    boolean res = this.users.addBuyer(u);
    this.currentId++;
    return new EndpointResponse(res ? "Succes" : "Error", !res);

  }
}
