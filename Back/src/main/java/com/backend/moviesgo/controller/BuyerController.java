package com.backend.moviesgo.controller;

import org.springframework.web.bind.annotation.PatchMapping;

import org.springframework.web.bind.annotation.DeleteMapping;

import java.util.ArrayList;

import org.springframework.web.bind.annotation.PostMapping;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.backend.moviesgo.model.EndpointResponse;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import com.backend.moviesgo.model.BuyerList;
import com.backend.moviesgo.model.Buyer;
import com.backend.moviesgo.model.AuthResponse;
import com.backend.moviesgo.services.AuthService;
import com.backend.moviesgo.model.MovieRental;
import com.backend.moviesgo.services.CatalogService;

@CrossOrigin(origins = "*")

@RestController
public class BuyerController {
  public BuyerList users = new BuyerList();
  public int currentId = this.users.getMaxId();
  public AuthService auth;
  public CatalogService catalog;

  @Autowired
  public BuyerController(
      @Value("${admin.mail}") String adminMail,
      @Value("${admin.pass}") String adminPass,
      CatalogService catalog

  ) {
    this.auth = new AuthService(adminMail, adminPass);
    this.catalog = catalog;

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
    rental.buyerId = buyerId;
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

  @DeleteMapping("/removeFromCart")
  public EndpointResponse removeFromCart(
      @RequestParam(value = "buyerId", required = true) String buyerId,
      @RequestParam(value = "movieId", required = true) String movieId) {

    if (buyerId == null || buyerId.trim().isEmpty() ||
        movieId == null || movieId.trim().isEmpty()) {
      return new EndpointResponse("Debe proveer buyerId y movieId", true);
    }

    // Buscar el buyer por id
    Buyer buyer = this.users.getBuyerById(buyerId);
    if (buyer == null) {
      return new EndpointResponse("Buyer no encontrado", true);
    }

    // Validar que el carrito exista
    if (buyer.cart == null || buyer.cart.movies == null) {
      return new EndpointResponse("El carrito está vacío", true);
    }

    // Eliminar la película del carrito
    boolean removed = buyer.cart.movies.removeIf(r -> r.movieId.equals(movieId));

    if (removed) {
      return new EndpointResponse("Película eliminada del carrito", false);
    } else {
      return new EndpointResponse("Película no encontrada en el carrito", true);
    }
  }

  @PatchMapping("/editCartMovie")
  public EndpointResponse editCartMovie(
      @RequestParam(value = "buyerId", required = true) String buyerId,
      @RequestParam(value = "movieId", required = true) String movieId,
      @RequestParam(value = "startDate", required = true) String startDate,
      @RequestParam(value = "endDate", required = true) String endDate,
      @RequestParam(value = "price", required = true) String price,
      @RequestParam(value = "days", required = true) String days) {

    if (buyerId == null || buyerId.trim().isEmpty() ||
        movieId == null || movieId.trim().isEmpty()) {
      return new EndpointResponse("Debe proveer buyerId y movieId", true);
    }

    Buyer buyer = this.users.getBuyerById(buyerId);
    if (buyer == null) {
      return new EndpointResponse("Buyer no encontrado", true);
    }

    if (buyer.cart == null || buyer.cart.movies == null) {
      return new EndpointResponse("El carrito está vacío", true);
    }

    // Buscar la película en el carrito
    MovieRental rental = buyer.cart.movies.stream()
        .filter(r -> r.movieId.equals(movieId))
        .findFirst()
        .orElse(null);

    if (rental == null) {
      return new EndpointResponse("Película no encontrada en el carrito", true);
    }

    // Actualizar los atributos
    rental.startDate = startDate;
    rental.endDate = endDate;
    rental.price = price;
    rental.days = days;

    return new EndpointResponse("Película en carrito actualizada", false);
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

  @DeleteMapping("/deleteBuyer")
  public EndpointResponse deleteBuyer(@RequestParam(value = "id", required = true) String id) {
    if (id == null || id.trim().isEmpty()) {
      return new EndpointResponse("Must provide an id", true);
    }

    Buyer buyer = this.users.getBuyerById(id);
    if (buyer == null) {
      return new EndpointResponse("Buyer not found", true);
    }

    boolean removed = this.users.users.remove(buyer);
    if (removed) {
      this.users.json.guardar(new ArrayList<>(this.users.users));
      this.users.refresh();
      return new EndpointResponse("Succes", false);
    }

    return new EndpointResponse("Error deleting buyer", true);
  }

  @PatchMapping("/editBuyer")
  public EndpointResponse editBuyer(
      @RequestParam(value = "id", required = true) String id,
      @RequestParam(value = "name", required = false) String name,
      @RequestParam(value = "password", required = false) String password,
      @RequestParam(value = "email", required = false) String email,
      @RequestParam(value = "address", required = false) String address,
      @RequestParam(value = "phone", required = false) String phone) {

    if (id == null || id.trim().isEmpty()) {
      return new EndpointResponse("Must provide an id", true);
    }

    Buyer buyer = this.users.getBuyerById(id);
    if (buyer == null) {
      return new EndpointResponse("Buyer not found", true);
    }

    boolean changed = false;

    if (name != null && !name.trim().isEmpty()) {
      buyer.name = name.trim();
      changed = true;
    }
    if (password != null && !password.trim().isEmpty()) {
      buyer.password = password.trim();
      changed = true;
    }
    if (email != null && !email.trim().isEmpty()) {
      if (this.auth.isAdminEmail(email)
          || this.users.users.stream().filter(b -> b.email.equals(email.trim()) && b.id != buyer.id).findAny()
              .orElse(null) instanceof Buyer) {
        return new EndpointResponse("Email ya registrado a otra cuenta", true);

      }
      buyer.email = email.trim();
      changed = true;
    }
    if (address != null && !address.trim().isEmpty()) {
      buyer.address = address.trim();
      changed = true;
    }
    if (phone != null && !phone.trim().isEmpty()) {
      buyer.phone = phone.trim();
      changed = true;
    }

    if (!changed) {
      return new EndpointResponse("No valid fields provided", true);
    }

    // Persistir cambios en buyers.json
    this.users.json.guardar(new ArrayList<>(this.users.users));
    this.users.refresh();

    return new EndpointResponse("Succes", false);
  }

  @PatchMapping("/editRent")
  public EndpointResponse editRent(

      @RequestParam(value = "id", required = true) String id,
      @RequestParam(value = "movieId", required = true) String movieId,
      @RequestParam(value = "startDate", required = true) String startDate,
      @RequestParam(value = "days", required = true) String days,
      @RequestParam(value = "endDate", required = true) String endDate) {

    Buyer buyer = this.users.getBuyerById(id);
    if (buyer == null) {
      return new EndpointResponse("Buyer not found", true);
    }
    MovieRental r = buyer.rentedMovies.stream().filter(m -> m.movieId.equalsIgnoreCase(movieId)).findFirst()
        .orElse(null);
    r.days = days;
    r.endDate = endDate;
    r.startDate = startDate;
    return new EndpointResponse(r, false);

  }
}
