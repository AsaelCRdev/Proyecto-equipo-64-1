package com.backend.moviesgo.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;
import com.backend.moviesgo.services.ApiService;

import org.springframework.beans.factory.annotation.Value;

@CrossOrigin(origins = "*")
@RestController
public class ApiController {
  ApiService api;

  public ApiController(@Value("${omdb.endpoint}") String endpointUrl, @Value("${omdb.api-key}") String apiKey) {
    this.api = new ApiService(endpointUrl, apiKey);
  }

}
