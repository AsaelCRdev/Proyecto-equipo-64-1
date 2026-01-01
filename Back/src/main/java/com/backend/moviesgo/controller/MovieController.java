package com.backend.moviesgo.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.backend.moviesgo.model.OmdbSearchResponse;
import com.backend.moviesgo.controller.ApiController;
import com.backend.moviesgo.model.MovieDetail;
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
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;

import com.backend.moviesgo.model.Review;
import com.backend.moviesgo.model.Buyer;
import com.backend.moviesgo.services.CatalogService;
import com.backend.moviesgo.services.MovieService;

@CrossOrigin(origins = "*")

@RestController
public class MovieController {
  private final ApiController api;
  private CatalogService catalog;
  private BuyerController buyerController;

  private MovieService movieService;

  @Autowired
  public MovieController(@Value("${omdb.endpoint}") String endpointUrl, @Value("${omdb.api-key}") String apiKey,
      BuyerController buyerController, CatalogService catalog, MovieService movieService) {
    this.api = new ApiController(endpointUrl, apiKey);
    this.catalog = new CatalogService();
    this.buyerController = buyerController;
    this.catalog = catalog;
    this.movieService = movieService;
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




  
  //modifica pelicual
  @PostMapping("/updateMovie")
  public EndpointResponse updateMovie(@RequestParam String id, @RequestBody Movie movie){
    try{
      Movie updateMovie = movieService.updateMovie(id, movie);
      return new EndpointResponse(updateMovie, false);
    }
    catch(Exception e){
      return new EndpointResponse(e.getMessage(), true);
    }
  } 

 

  //elimina pelicula
  @DeleteMapping("/deleteMovie")
  public EndpointResponse deleteMovie(@RequestParam String id){
    try{
      Movie[] h = movieService.deleteMovie(id);
      return new EndpointResponse(h, false);
    }
    catch(Exception e){
       return new EndpointResponse(e.getMessage(), true);
    }
  }


}
