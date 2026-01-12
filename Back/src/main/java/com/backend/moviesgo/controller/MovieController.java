package com.backend.moviesgo.controller;

import org.springframework.web.bind.annotation.PatchMapping;

import org.springframework.web.bind.annotation.DeleteMapping;

import org.springframework.web.bind.annotation.PostMapping;
import com.backend.moviesgo.model.OmdbSearchResponse;
import com.backend.moviesgo.controller.ApiController;
import com.backend.moviesgo.model.MovieDetail;
import com.backend.moviesgo.model.MovieRental;
import com.backend.moviesgo.model.MovieSummary;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.ArrayList;
import java.util.List;
import reactor.core.publisher.Mono;
import com.backend.moviesgo.model.Movie;
import com.backend.moviesgo.model.EndpointResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.CrossOrigin;
import com.backend.moviesgo.model.Review;
import com.backend.moviesgo.model.Buyer;
import com.backend.moviesgo.services.CatalogService;

@CrossOrigin(origins = "*")

@RestController
public class MovieController {
  private final ApiController api;
  private CatalogService catalog;
  private BuyerController buyerController;

  @Autowired
  public MovieController(@Value("${omdb.endpoint}") String endpointUrl, @Value("${omdb.api-key}") String apiKey,
      BuyerController buyerController, CatalogService catalog) {
    this.api = new ApiController(endpointUrl, apiKey);
    this.catalog = new CatalogService();
    this.buyerController = buyerController;
    this.catalog = catalog;
  }

  @GetMapping("/getAllReviews")
  public EndpointResponse getAllReviews(@RequestParam(value = "id", required = false) String id) {
    if (id != null && id.trim() != "") {
      ArrayList<Review> r = this.catalog.getReviewById(id);
      return new EndpointResponse(r == null ? "Movie not found" : r, r == null);
    }

    return new EndpointResponse(this.catalog.getAllReviews(), false);
  }

  @PostMapping("/addReview")
  public EndpointResponse addReview(@RequestParam(value = "id", required = true) String id,
      @RequestParam(value = "u", required = true) String userId,
      @RequestParam(value = "m", required = true) String message,
      @RequestParam(value = "r", required = true) String rating) {

    System.out.println("Id de usuario");
    System.out.println(id);
    Buyer validAuthor = this.buyerController.users.getBuyerById(userId);
    System.out.println("validAuthor");
    System.out.println(validAuthor);
    if (validAuthor == null)
      return new EndpointResponse("Buyer not found", true);
    Review r = new Review(userId, validAuthor.name, message, rating);

    return this.catalog.addReview(id, r) ? new EndpointResponse("Succes", false)
        : new EndpointResponse("Invalid id or u or review or rating", true);
  }

  @PostMapping("/addMovie")
  public EndpointResponse addMovie(@RequestParam(value = "id", required = true) String id,
      @RequestParam(value = "st", required = true) String stock,
      @RequestParam(value = "p", required = true) String price) {
    EndpointResponse res = this.api.getMovieById(id).block();
    if (res.error)
      return res;
    return this.catalog.addMovie(new Movie((MovieDetail) res.value, stock, price))
        ? new EndpointResponse("Succes", false)
        : new EndpointResponse("Movie already added", true);

  }

  @GetMapping("/getMoviesAvailables")
  public Mono<EndpointResponse> getMoviesAvailables(@RequestParam(value = "s", required = true) String search,
      @RequestParam(value = "page", required = false) String page) {

    Mono<EndpointResponse> res = this.api.getMovieBySearch(search, page);
    return res.map(r -> {
      if (r.error == true) {

        return r;
      }

      return new EndpointResponse(
          ((ArrayList<MovieSummary>) r.value).stream().filter(mv -> this.catalog.getMovieById(mv.imdbID) == null)
              .map(m -> new Movie(m)),
          false); // FIXME: riesgoso
    });

  }

  @GetMapping("/getGenres")
  public EndpointResponse getGenres() {
    return new EndpointResponse(this.catalog.genres, false);
  }

  @GetMapping("/getMovies")
  public EndpointResponse getMovies(@RequestParam(value = "s", required = false) String search,
      @RequestParam(value = "id", required = false) String id,
      @RequestParam(value = "g", required = false) String genre) {
    if (search != null && genre != null && genre.trim() != "") {
      return new EndpointResponse(this.catalog.getMoviesBySearch(search, genre), false);

    }
    if (search != null) {
      if (search.trim() == "")
        return new EndpointResponse("Must provide search string", true);
      return new EndpointResponse(this.catalog.getMoviesBySearch(search), false);

    }
    if (id != null) {
      if (id.trim() == "")
        return new EndpointResponse("Must provide an id", true);
      return new EndpointResponse(this.catalog.getMovieById(id), false);

    }
    if (genre != null) {
      if (genre.trim() == "")
        return new EndpointResponse("Must provide genre string", true);
      return new EndpointResponse(this.catalog.getMoviesByGenre(genre), false);

    }
    return new EndpointResponse(this.catalog.getMovies(), false);

  }

  @DeleteMapping("/deleteMovie")
  public EndpointResponse deleteMovie(@RequestParam(value = "id", required = true) String id) {
    if (id == null || id.trim().isEmpty()) {
      return new EndpointResponse("Must provide an id", true);
    }

    // Eliminar la película de todos los carritos y rents
    this.buyerController.users.users.forEach(b -> {
      if (b.cart != null && b.cart.movies != null) {
        b.cart.movies.removeIf(r -> r.movieId.equals(id));

      }
      if (b.rentedMovies != null) {
        b.rentedMovies.removeIf(r -> r.movieId.equals(id));
      }
    });

    boolean deleted = this.catalog.deleteMovieById(id);

    return deleted
        ? new EndpointResponse("Succes", false)
        : new EndpointResponse("Movie not found", true);
  }

  @GetMapping("/getUserReview")
  public EndpointResponse getUserReview(
      @RequestParam(value = "buyerId", required = true) String buyerId,
      @RequestParam(value = "movieId", required = true) String movieId) {

    if (buyerId == null || buyerId.trim().isEmpty() ||
        movieId == null || movieId.trim().isEmpty()) {
      return new EndpointResponse("Must provide buyerId and movieId", true);
    }

    Buyer buyer = this.buyerController.users.getBuyerById(buyerId);
    if (buyer == null) {
      return new EndpointResponse("Buyer not found", true);
    }

    // Buscar película por id
    Movie movie = this.catalog.getMovies().stream()
        .filter(m -> m.imdbID.equalsIgnoreCase(movieId.trim()))
        .findFirst()
        .orElse(null);

    if (movie == null) {
      return new EndpointResponse("Movie not found", true);
    }

    if (movie.reviews == null || movie.reviews.isEmpty()) {
      return new EndpointResponse("No reviews found for this movie", true);
    }

    // Buscar reseña por authorId
    Review userReview = movie.reviews.stream()
        .filter(r -> r.authorId.equals(buyerId))
        .findFirst()
        .orElse(null);

    if (userReview == null) {
      return new EndpointResponse("Review not found for this buyer", true);
    }

    // Devolver la reseña encontrada como string (puedes serializar a JSON si lo
    // prefieres)
    return new EndpointResponse(userReview, false);
  }

  @PatchMapping("/editReview")
  public EndpointResponse editReview(
      @RequestParam(value = "buyerId", required = true) String buyerId,
      @RequestParam(value = "movieId", required = true) String movieId,
      @RequestParam(value = "message", required = true) String message,
      @RequestParam(value = "rating", required = true) String rating) {

    if (buyerId == null || buyerId.trim().isEmpty() ||
        movieId == null || movieId.trim().isEmpty()) {
      return new EndpointResponse("Must provide buyerId and movieTitle", true);
    }

    Buyer buyer = this.buyerController.users.getBuyerById(buyerId);
    if (buyer == null) {
      return new EndpointResponse("Buyer not found", true);
    }

    // Buscar película por título
    Movie movie = this.catalog.getMovies().stream()
        .filter(m -> m.imdbID.equals(movieId))
        .findFirst()
        .orElse(null);

    if (movie == null) {
      return new EndpointResponse("Movie not found", true);
    }

    if (movie.reviews == null || movie.reviews.isEmpty()) {
      return new EndpointResponse("No reviews found for this movie", true);
    }

    // Buscar reseña por authorId
    Review toEdit = movie.reviews.stream()
        .filter(r -> r.authorId.equals(buyerId))
        .findFirst()
        .orElse(null);

    if (toEdit == null) {
      return new EndpointResponse("Review not found for this buyer", true);
    }

    // Actualizar los campos
    toEdit.message = message;
    toEdit.rating = rating;

    // Guardar cambios en catálogo
    this.catalog.json.guardar(new ArrayList<Movie>(this.catalog.catalog));
    this.catalog.refresh();

    return new EndpointResponse("Review updated successfully", false);
  }

  @DeleteMapping("/deleteReview")
  public EndpointResponse deleteReview(
      @RequestParam(value = "buyerId", required = true) String buyerId,
      @RequestParam(value = "movieTitle", required = true) String movieTitle) {

    if (buyerId == null || buyerId.trim().isEmpty() ||
        movieTitle == null || movieTitle.trim().isEmpty()) {
      return new EndpointResponse("Must provide buyerId and movieTitle", true);
    }

    // Buscar película por título
    Movie movie = this.catalog.catalog.stream()
        .filter(m -> m.title.equalsIgnoreCase(movieTitle.trim()))
        .findFirst()
        .orElse(null);

    if (movie == null) {
      return new EndpointResponse("Movie not found", true);
    }

    // Buscar reseña por authorId
    Review toRemove = movie.reviews.stream()
        .filter(r -> r.authorId.equals(buyerId))
        .findFirst()
        .orElse(null);

    if (toRemove == null) {
      return new EndpointResponse("Review not found", true);
    }

    boolean removed = movie.reviews.remove(toRemove);
    if (removed) {
      this.catalog.json.guardar(new ArrayList<Movie>(this.catalog.catalog));
      this.catalog.refresh();
      return new EndpointResponse("Succes", false);
    }

    return new EndpointResponse("Error deleting review", true);
  }

  @PatchMapping("/editMovieStockPrice")
  public EndpointResponse editMovieStockPrice(
      @RequestParam(value = "id", required = true) String id,
      @RequestParam(value = "stock", required = false) String stock,
      @RequestParam(value = "price", required = false) String price) {

    if (id == null || id.trim().isEmpty()) {
      return new EndpointResponse("Must provide an id", true);
    }

    boolean updated = this.catalog.editMovieStockPrice(id, stock, price);

    return updated
        ? new EndpointResponse("Succes", false)
        : new EndpointResponse("Movie not found or no valid fields provided", true);
  }

  @PostMapping("/returnMovie")
  public EndpointResponse returnMovie(
      @RequestParam(value = "buyerId", required = true) String buyerId,
      @RequestParam(value = "movieId", required = true) String movieId) {

    if (buyerId == null || buyerId.trim().isEmpty() ||
        movieId == null || movieId.trim().isEmpty()) {
      return new EndpointResponse("Must provide buyerId and movieId", true);
    }

    Movie movie = this.catalog.catalog.stream()
        .filter(m -> m.imdbID.equalsIgnoreCase(movieId.trim()))
        .findFirst()
        .orElse(null);

    // Buscar reseña por authorId
    Buyer buyer = this.buyerController.users.users.stream().filter(b -> b.id.equals(buyerId)).findFirst().orElse(null);

    if (buyer == null) {
      return new EndpointResponse("user not found", true);
    }

    boolean removed = false;
    for (MovieRental m : buyer.rentedMovies) {
      if (m.movieId.equalsIgnoreCase(movieId)) {
        removed = buyer.rentedMovies.remove(m);
        if (removed) {
          this.buyerController.users.json.guardar(new ArrayList<>(this.buyerController.users.users));
          this.buyerController.users.refresh();

          movie.stock += 1;
          this.catalog.json.guardar(new ArrayList<Movie>(this.catalog.catalog));
          this.catalog.refresh();
          return new EndpointResponse("Succes", false);
        }
      }

    }

    return new EndpointResponse("Error deleting review", true);
  }

}
