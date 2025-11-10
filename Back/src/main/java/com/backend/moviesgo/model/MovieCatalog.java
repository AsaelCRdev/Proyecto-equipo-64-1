
package com.backend.moviesgo.model;

import com.backend.moviesgo.model.Movie;
import java.util.Set;
import java.util.HashSet;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.stream.Collectors;

public class MovieCatalog {
  public Set<Movie> catalog = new HashSet<>();
  public Set<String> genres = new HashSet<>();

  public MovieCatalog() {
    genres.add("All");
    // TODO: Deberia cargar del JSON
    Movie movies[] = {
        new Movie("tt3896198", "Guardians of the Galaxy Vol. 2", new String[] { "Action", "Adventure", "Comedy" },
            new ArrayList<>(), "7.6", "05 May 2017",
            "https://m.media-amazon.com/images/M/MV5BNWE5MGI3MDctMmU5Ni00YzI2LWEzMTQtZGIyZDA5MzQzNDBhXkEyXkFqcGc@._V1_SX300.jpg",
            "The Guardians struggle to keep together as a team while dealing with their personal family issues, notably Star-Lord's encounter with his father, the ambitious celestial being Ego."),

        new Movie("tt0180093", "Requiem for a Dream", new String[] { "Drama" }, new ArrayList<>(), "8.3", "15 Dec 2000",
            "https://m.media-amazon.com/images/M/MV5BN2ZlMjIzZjctYzA2My00ZWYyLWI4ZjctMGI2NWYyNzFiZjAwXkEyXkFqcGc@._V1_SX300.jpg",
            "The drug-induced utopias of four Coney Island people are shattered when their addictions run deep."),
        new Movie("tt0120586", "American History X", new String[] { "Crime", "Drama" }, new ArrayList<>(), "8.5",
            "20 Nov 1998",
            "https://m.media-amazon.com/images/M/MV5BMzhiOTQ0NDItOTg0Zi00OGVmLWE0OGEtMTI4NDM0NWMxZWU4XkEyXkFqcGc@._V1_SX300.jpg",
            "Living a life marked by violence, neo-Nazi Derek finally goes to prison after killing two black youths. Upon his release, Derek vows to change; he hopes to prevent his brother, Danny, who idolizes Derek, from following in his footsteps."),
        new Movie("tt0093058", "Full Metal Jacket", new String[] { "Drama", "War" }, new ArrayList<>(), "8.2",
            "10 Jul 1987",
            "https://m.media-amazon.com/images/M/MV5BYWUzNzZkNzUtNDdiYy00Nzk5LTgxMmItNTk0MjRjNjdjNDA0XkEyXkFqcGc@._V1_SX300.jpg",
            "A pragmatic U.S. Marine observes the dehumanizing effects the Vietnam War has on his fellow recruits from their brutal boot camp training to the bloody street fighting in Hue."),
        new Movie("tt0325950", "El padrino", new String[] { "Action", "Crime", "Drama" }, new ArrayList<>(), "4.7",
            "27 Sep 2005",
            "https://m.media-amazon.com/images/M/MV5BMTI2MjI4NTgyNF5BMl5BanBnXkFtZTcwOTM5NzQ5MQ@@._V1_SX300.jpg",
            "In the streets of East Los Angeles, Manny is a formidable drug dealer. Impressed by his extravagant lifestyle and prowess, his young son Kilo yearns to follow in his footsteps. Kilo resolves to learn how to prosper in the drug world."),
        new Movie("tt5860550", "Vico C: La vida del filosofo", new String[] { "Biography", "Drama", "Music" },
            new ArrayList<>(), "7.1", "10 Aug 2017",
            "https://m.media-amazon.com/images/M/MV5BNjVkNzg1NTYtMTU2ZC00YWE2LWE3ZGUtOGUwZTNmZmE1ZTcxXkEyXkFqcGdeQXVyNDcyMzkyMTQ@._V1_SX300.jpg",
            "The film take us in an intimate journey through the life, trials and tribulation of iconic urban movement figure Vico C. From his days as a shy school boy, his self discovery, and the development of his amazing talent, his rapid rise to fame.")
    };
    for (Movie mov : movies) {
      for (String genre : mov.genre) {

        genres.add(genre);
      }
      catalog.add(mov);
    }
  }

  public ArrayList<Movie> getMovies() {
    return new ArrayList<>(this.catalog);
  }

  public ArrayList<Movie> getMoviesBySearch(String search, String genre) {
    ArrayList<Movie> toFilter;
    if (genre.toLowerCase().equals("all")) {
      toFilter = this.getMovies();
    } else {

      toFilter = this.catalog.stream()
          .filter(mv -> Arrays.stream(mv.genre).anyMatch(g -> g.equalsIgnoreCase(genre)))
          .collect(Collectors.toCollection(ArrayList::new));
    }
    return toFilter.stream().filter(mv -> mv.title.toLowerCase().contains(search.toLowerCase()))
        .collect(Collectors.toCollection(ArrayList::new));
  }

  public ArrayList<Movie> getMoviesBySearch(String search) {
    return this.catalog.stream().filter(mv -> mv.title.toLowerCase().contains(search.toLowerCase()))
        .collect(Collectors.toCollection(ArrayList::new));
  }

  public ArrayList<Movie> getMoviesByGenre(String genre) {
    if (genre.toLowerCase().equals("all")) {
      return this.getMovies();
    }
    return this.catalog.stream()
        .filter(mv -> Arrays.stream(mv.genre).anyMatch(g -> g.equalsIgnoreCase(genre)))
        .collect(Collectors.toCollection(ArrayList::new));
  }

  public Movie getMovieById(String id) {
    for (Movie mov : this.catalog) {
      if (mov.imdbID.equals(id)) {

        return mov;
      }
    }
    return null;
  }
}
