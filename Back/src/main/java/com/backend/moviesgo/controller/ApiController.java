package com.backend.moviesgo.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;
import com.backend.moviesgo.services.ApiService;

@CrossOrigin(origins = "*")
@RestController
public class ApiController {
  ApiService api;

}
