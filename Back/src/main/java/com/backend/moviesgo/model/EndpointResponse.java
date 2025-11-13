package com.backend.moviesgo.model;

public class EndpointResponse {
  public Object value;
  public Boolean error;

  public EndpointResponse(Object value, Boolean error) {
    this.value = value;
    this.error = error;
  }

  public EndpointResponse() {
  }

}
