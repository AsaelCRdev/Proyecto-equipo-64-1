package com.backend.moviesgo.services;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.backend.moviesgo.model.Movie;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class MovieService {
    private ObjectMapper ObjectMapper = new ObjectMapper();

    private final JsonService<Movie> jsonService;

    public MovieService() {
        this.jsonService = new JsonService <>(
            "C:\\Users\\jenry\\Downloads\\ProyectoSoftware\\Proyecto-equipo-64-1\\Back\\src\\main\\java\\com\\backend\\moviesgo\\services\\JsonService.java", Movie.class
        );
    }

    public Movie updateMovie(String id, Movie newData) throws IOException{

        List<Movie> movies = jsonService.cargar();

        Movie existingMovie = movies.stream()
        .filter(m -> m.imdbID.equals(id))
        .findFirst()
        .orElseThrow(() -> new RuntimeException("pelicula no encontrada"));

        existingMovie.stock  = newData.stock;
        existingMovie.price  = newData.price;
        
        jsonService.guardar(movies);

        return existingMovie;

    }




    

    public void deleteMovie(String id) throws IOException{
        List <Movie> movies = jsonService.cargar();

        boolean exists = movies.stream()
                    .anyMatch(m -> m.imdbID.equals(id));

        if(!exists) {
            throw new RuntimeException("Película no encontrada");
        }

        movies = movies.stream()
                .filter(m -> !m.imdbID.equals(id))
                .collect(Collectors.toList());

        jsonService.guardar(movies);
    }
}