package com.backend.moviesgo.services;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.backend.moviesgo.model.MovieDetail;
import com.backend.moviesgo.model.OmdbRating;
import com.backend.moviesgo.model.OmdbSearchResponse;

import org.springframework.beans.factory.annotation.Value;
import reactor.core.publisher.Mono;
import org.springframework.http.HttpStatus;

// WARNING: No menos de 3 caracteres para la consulta
@Service
public class ApiService {
  private final WebClient client;
  private final String apiKey;

  public ApiService(@Value("${omdb.endpoint}") String endpointUrl, @Value("${omdb.api-key}") String apiKey) {
    this.apiKey = apiKey;

    client = WebClient.builder()
        .baseUrl(endpointUrl)
        .defaultHeader("Accept", "application/json")
        .build();

  }

  public Mono<MovieDetail> getMovieById(String id) {
    return client.get()
        .uri(uriBuilder -> uriBuilder
            .queryParam("type", "movie")
            .queryParam("i", id)
            .queryParam("apikey", apiKey)
            .build())
        .retrieve()
        .onStatus(HttpStatus.INTERNAL_SERVER_ERROR::equals,
            response -> response.bodyToMono(String.class).map(Exception::new))
        .bodyToMono(MovieDetail.class)
        .doOnError(error -> {
          System.err.println("[-] Error al consultar a la API: " + error.getMessage());
        });
  }

  public Mono<OmdbSearchResponse> getMoviesBySearch(String query, String page) {
    if (query == null || query.length() < 3) {
      return Mono.error(new IllegalArgumentException("La consulta debe tener al menos 3 caracteres."));
    }
    Mono<OmdbSearchResponse> res = client.get()
        .uri(uriBuilder -> {
          uriBuilder.queryParam("s", query);
          if (page != null && !page.isBlank()) {
            uriBuilder.queryParam("page", page);
          }
          uriBuilder.queryParam("type", "movie");
          uriBuilder.queryParam("apikey", apiKey);
          return uriBuilder.build();
        })
        .retrieve()
        .onStatus(HttpStatus.INTERNAL_SERVER_ERROR::equals,
            response -> response.bodyToMono(String.class).map(Exception::new))
        .bodyToMono(OmdbSearchResponse.class)
        .doOnError(error -> {
          System.err.println("[-] Error al consultar a la API: " + error.getMessage());
        });
    return res;
  }

}
