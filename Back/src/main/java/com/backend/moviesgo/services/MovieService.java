package com.backend.moviesgo.services;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.backend.moviesgo.model.Movie;

@Service
public class MovieService { 
      public JsonService<Movie> json = new JsonService<>("src/main/java/com/backend/moviesgo/json/movies.json",
      Movie.class);

      
    public Movie updateMovie(String id, Movie newData) throws IOException{

        List<Movie> movies = json.cargar();

        Movie existingMovie = movies.stream()
        .filter(m -> m.imdbID.equalsIgnoreCase(id))
        .findFirst()
        .orElseThrow(() -> new RuntimeException("pelicula no ENCONTRADA")); 

        if(newData.price == null || newData.price.trim().isEmpty() || newData.stock == null || newData.stock.trim().isEmpty()){ throw new RuntimeException("no pueden haber campos vacios");}
        if(!newData.price.matches("\\d+")){ throw new RuntimeException("el precio debe ser numerico"); }
        if(!newData.stock.matches("\\d+")){ throw new RuntimeException("el stock debe ser numerico"); }

        existingMovie.stock  = newData.stock;
        existingMovie.price  = newData.price;
        json.guardar(movies);

        return existingMovie;

    }    

    public Movie[] deleteMovie(String id) throws IOException{
        List <Movie> movies = json.cargar();

        boolean exists = movies.stream()
                    .anyMatch(m -> m.imdbID.equals(id));

        if(!exists) {
            throw new RuntimeException("pelicula no encontrada");
        }

        movies = movies.stream()
                .filter(m -> !m.imdbID.equals(id))
                .collect(Collectors.toList());

        json.guardar(movies);
        return movies.toArray(new Movie[0]);
    }
}