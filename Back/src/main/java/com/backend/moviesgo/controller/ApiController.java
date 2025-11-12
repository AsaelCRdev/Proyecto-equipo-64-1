package com.backend.moviesgo.controller;

import com.backend.moviesgo.services.ApiService;

import org.springframework.beans.factory.annotation.Value;
import reactor.core.publisher.Mono;
import com.backend.moviesgo.model.OmdbSearchResponse;
import com.backend.moviesgo.model.EndpointResponse;
import com.backend.moviesgo.model.MovieDetail;

public class ApiController {
  ApiService api;

  public ApiController(@Value("${omdb.endpoint}") String endpointUrl, @Value("${omdb.api-key}") String apiKey) {
    this.api = new ApiService(endpointUrl, apiKey);
  }

  public Mono<EndpointResponse> getMovieById(String id) {
    Mono<MovieDetail> res = this.api.getMovieById(id);
    return res.map(r -> {
      if (!Boolean.parseBoolean(r.Response))
        return new EndpointResponse("Invalid Id", true);
      return new EndpointResponse(r, false);
    });

  }

  public Mono<EndpointResponse> getMovieBySearch(String s, String page) {
    Mono<OmdbSearchResponse> res = this.api.getMoviesBySearch(s, page);
    return res.map(r -> {
      if (!Boolean.parseBoolean(r.Response))
        return new EndpointResponse("Error", true);
      return new EndpointResponse(r.Search, false);
    });

  }
}
