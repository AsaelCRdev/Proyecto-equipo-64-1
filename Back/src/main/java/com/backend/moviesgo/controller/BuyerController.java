package com.backend.moviesgo.controller;

import java.util.ArrayList;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.backend.moviesgo.model.EndpointResponse;
import com.backend.moviesgo.model.Movie;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import com.backend.moviesgo.model.BuyerList;
import com.backend.moviesgo.model.Buyer;
import com.backend.moviesgo.model.AuthResponse;
import com.backend.moviesgo.services.AuthService;
import com.backend.moviesgo.services.BuyerService;
import com.backend.moviesgo.model.MovieRental;
import com.backend.moviesgo.services.CatalogService;

@CrossOrigin(origins = "*")

@RestController
public class BuyerController {
  public BuyerList users = new BuyerList();
  public int currentId = this.users.getMaxId();
  public AuthService auth;
  public CatalogService catalog;

  private BuyerService buyerService; 

  @Autowired
  public BuyerController(
      @Value("${admin.mail}") String adminMail,
      @Value("${admin.pass}") String adminPass,
      CatalogService catalog,
      BuyerService buyerService

  ) {
    this.auth = new AuthService(adminMail, adminPass);
    this.catalog = catalog;
    this.buyerService = buyerService;
  }

  @GetMapping("/getCatalog")
  public EndpointResponse getCatalog(
      @RequestParam(value = "buyerId", required = true) String buyerId) {
    if (buyerId == null || buyerId.trim().isEmpty()) {
      return new EndpointResponse("buyerId vacío", true);
    }

    Buyer buyer = this.users.getBuyerById(buyerId);
    if (buyer == null) {
      return new EndpointResponse("Buyer no encontrado", true);
    }

    // Devolver el carrito del usuario
    if (buyer.cart == null || buyer.cart.movies == null) {
      return new EndpointResponse("Carrito vacío", false);
    }

    return new EndpointResponse(buyer.cart.movies, false);
  }

  @PostMapping("/addToCart")
  public EndpointResponse addRental(
      @RequestParam(value = "buyerId", required = true) String buyerId,
      @RequestParam(value = "movieId", required = true) String movieId,
      @RequestParam(value = "startDate", required = true) String startDate,
      @RequestParam(value = "endDate", required = true) String endDate,
      @RequestParam(value = "price", required = true) String price,
      @RequestParam(value = "days", required = true) String days) {
    Buyer buyer = this.users.getBuyerById(buyerId);
    if (buyer == null) {
      return new EndpointResponse("Buyer not found", true);
    }

    MovieRental rental = new MovieRental();
    rental.movieTitle = this.catalog.getMovieById(movieId).title;
    rental.movieId = movieId;
    rental.startDate = startDate;
    rental.endDate = endDate;
    rental.price = price;
    rental.days = days;

    boolean added = buyer.cart.movies.add(rental);

    if (added) {
      return new EndpointResponse("Rental added successfully", false);
    } else {
      return new EndpointResponse("Rental already exists in cart", true);
    }
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

  @PostMapping("/rent")
  public EndpointResponse rent(
      @RequestParam(value = "id", required = true) String id) {

    if (id == null || id.trim().isEmpty()) {
      return new EndpointResponse("id vacío", true);
    }

    Buyer buyer = this.users.getBuyerById(id);
    if (buyer == null) {
      return new EndpointResponse("Buyer no encontrado", true);
    }

    if (buyer.cart == null || buyer.cart.movies == null || buyer.cart.movies.isEmpty()) {
      return new EndpointResponse("Carrito vacío", true);
    }

    // Mover items del carrito a rentedMovies
    buyer.rentedMovies.addAll(buyer.cart.movies);

    // Vaciar carrito
    buyer.cart.movies.clear();

    // Guardar cambios en buyers.json
    this.users.json.guardar(new ArrayList<>(this.users.users));
    this.users.refresh();

    // Refrescar catálogo
    this.catalog.refresh();

    return new EndpointResponse("Rent realizado correctamente", false);
  }

  @GetMapping("/getAllRented")
  public EndpointResponse getAllRented() {
    if (this.users == null || this.users.users == null || this.users.users.isEmpty()) {
      return new EndpointResponse("No hay usuarios registrados", true);
    }

    // Crear un arreglo con todos los rentals de todos los usuarios
    ArrayList<MovieRental> allRented = new ArrayList<>();
    for (Buyer b : this.users.users) {
      if (b.rentedMovies != null && !b.rentedMovies.isEmpty()) {
        allRented.addAll(b.rentedMovies);
      }
    }

    if (allRented.isEmpty()) {
      return new EndpointResponse("No hay alquileres registrados", true);
    }

    return new EndpointResponse(allRented, false);
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

  // actualizar comprador
  @PostMapping("/updateBuyer")
  public EndpointResponse updateBuyer(@RequestParam String id, @RequestBody Buyer buyer){
      try{
          Buyer updateBuyer = this.buyerService.updateBuyer(id, buyer);
          return new EndpointResponse(updateBuyer,false);
      }
          catch(Exception e){
      return new EndpointResponse(e.getMessage(), true);
    }
  }

  //eliminar comprador
  @DeleteMapping("/deleteBuyer")
  public EndpointResponse deleteBuyer(@RequestParam String id){
      try{
      Buyer[] h = buyerService.deleteBuyer(id);
      return new EndpointResponse(h, false);
    }
    catch(Exception e){
       return new EndpointResponse(e.getMessage(), true);
    }
  }

} 
