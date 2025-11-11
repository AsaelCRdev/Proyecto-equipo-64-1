package com.backend.moviesgo.controller;

import com.backend.moviesgo.model.OmdbSearchResponse;
import com.backend.moviesgo.controller.ApiController;
import com.backend.moviesgo.model.MovieCatalog;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import java.util.List;
import reactor.core.publisher.Mono;
import com.backend.moviesgo.model.Movie;
import com.backend.moviesgo.model.EndpointResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin(origins = "*")

@RestController
public class MovieController {
  private final ApiController api;
  private MovieCatalog catalog;

  public MovieController(@Value("${omdb.endpoint}") String endpointUrl, @Value("${omdb.api-key}") String apiKey) {
    this.api = new ApiController(endpointUrl, apiKey);
    this.catalog = new MovieCatalog();
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

}
