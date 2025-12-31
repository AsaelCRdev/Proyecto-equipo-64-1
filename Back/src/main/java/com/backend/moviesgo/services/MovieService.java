package com.backend.moviesgo.services;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.backend.moviesgo.model.Movie;

@Service
public class MovieService {
     String h;
      public JsonService<Movie> json = new JsonService<>("Back\\src\\main\\java\\com\\backend\\moviesgo\\json\\movies.json",
      Movie.class);

      
    public Movie updateMovie(String id, Movie newData) throws IOException{

        List<Movie> movies = json.cargar();

        
        for(Movie m: movies){
            h=m.imdbID;
            System.out.println("ID JSON: [" + m.imdbID + "]");
        }
        System.out.println("ID recibido: [" + id + "]"); 

        Movie existingMovie = movies.stream()
        .filter(m -> m.imdbID.equalsIgnoreCase(id))
        .findFirst()
        .orElseThrow(() -> new RuntimeException("pelicula no ENCONTRADA, id dado : " + id + " ID encontrado : " + h));

        if(newData.stock!=null) existingMovie.stock  = newData.stock;
        if(newData.price!=null) existingMovie.price  = newData.price;
        json.guardar(movies);

        return existingMovie;

    }




    

    public void deleteMovie(String id) throws IOException{
        List <Movie> movies = json.cargar();

        boolean exists = movies.stream()
                    .anyMatch(m -> m.imdbID.equals(id));

        if(!exists) {
            throw new RuntimeException("Película no encontrada");
        }

        movies = movies.stream()
                .filter(m -> !m.imdbID.equals(id))
                .collect(Collectors.toList());

        json.guardar(movies);
    }
}