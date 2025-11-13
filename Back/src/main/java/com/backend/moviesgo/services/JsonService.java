package com.backend.moviesgo.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;

import java.io.File;
import java.io.IOException;
import java.util.List;

public class JsonService<T> {

  public String filePath;
  public Class<T> myClass;
  private final ObjectMapper mapper = new ObjectMapper()
      .enable(SerializationFeature.INDENT_OUTPUT);

  public JsonService(String filePath, Class<T> myClass) {
    this.filePath = filePath;
    this.myClass = myClass;
  }

  public void guardar(List<T> data) {
    try {
      mapper.writeValue(new File(this.filePath), data);
    } catch (IOException e) {
      System.err.println("Error guardando productos: " + e.getMessage());
    }
  }

  public List<T> cargar() {

    try {
      return mapper.readValue(new File(this.filePath),
          mapper.getTypeFactory().constructCollectionType(List.class, this.myClass));
    } catch (IOException e) {
      System.err.println("Error cargando " + e.getMessage());
      return List.of();
    }
  }

}
