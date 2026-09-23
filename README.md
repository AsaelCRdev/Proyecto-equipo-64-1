# Moviesgo

## Documentacion

Brief, ERS, y el diagrama de clase corregido se encuentra en `./docs/`

## Front

Web App, en `Angular 21` usando `npm` como package manager

### Como ejecutar

```bash
# Primero se debe instalar el CLI de angular
# https://angular.dev/installation#install-angular-cli
cd ./Front/
npm start # ng serve
```

Y en el log te dice en que puerto ejecuto el servidor, normalmente en `localhost:4200`

### Detalles tecnicos

el Servicio `ApiBackService` es el encargado de hacer las consultas al back.
su metodo `getFromBackAsT<T>` Devuelve una promesa que puede ser de tipo `T` o `string` en caso de que todo vaya bien o no.
Servicios que consultan el back:

- MovieService

#### MovieService

- **getGenres(): Promise<string[] | null>** : Devuelve la lista de géneros disponibles.
- **getMovie(id: string): Promise<Movie | null>** Requiere: id=id de película de IMDb
- **getMovies(search?: string | undefined, genre?: string | undefined): Promise<Movie[] | null>** : Parametros opcionales, s=string de búsqueda por título, g=género de la película, id=id de película.
- **getMoviesAvailables(search: String, page?: String | undefined): Promise<boolean | null>** Requiere: s=string de búsqueda por título Opcional: page=número de página (la API devuelve resultados paginados) Nota: Filtra resultados que tengan poster === 'N/A'.
- **addMovie(id: string, stock: string, price: string): Promise<Movie[] | null>** (POST) Requiere: id=id de película de IMDb, st=cantidad de stock, p=precio por unidad

## Back

Servidor escrito en `Java 21` bajo el framework `Spring boot` que expone APIs

### Como ejecutar

1. Primero debes obtener una `API key` de [omdbapi](https://www.omdbapi.com/apikey.aspx) (es gratis)
2. Definir la variable de entorno `OMDB_KEY` con el valor de dicha `API key`
3. Ejecutar

```bash
cd ./Back/
OMDB_KEY=17655cc4C6Ik1IBxBxhOPhe7gHZvDN648LPjgupE5H5KPNsEXgL5MyjNatA9f6__evIkjPzt && mvn spring-boot:run
# ^ Una forma de definir la variable de entorno es esta, sin embargo hay mas formas.
```

El puerto que usa es el `8080`

### Usuario Admin

Las credenciales del administrador se encuentran definidas en `./Back/src/main/resources/application.properties`

### Almacenamiento Persistente

Usamos archivos `json` para esto, se guardan en el directorio `./Back/src/main/java/com/backend/moviesgo/json`

- buyers.json: Guarda una lista de objetos de la clase [Buyer](https://github.com/AsaelCRdev/Proyecto-equipo-64-1/blob/main/Back/src/main/java/com/backend/moviesgo/model/Buyer.java)
- movies.json: Guarda una lista de objetos de la clase [Movie](https://github.com/AsaelCRdev/Proyecto-equipo-64-1/blob/main/Back/src/main/java/com/backend/moviesgo/model/Movie.java)

### Detalles tecnicos

Por convencion TODAS las respuestas de los endpoints debe ser un Objeto `EndpointResponse`
**EndpointRespone:** 2 parametros, value:Cualquiera | string , error:Boolean; En caso de que haya un problema value sera una string indicando el problema y error=true de contrario value sera lo que tenga que devolver y error = false

Clases con endpoint:

- MovieController

#### MovieController

Consta de 2 atributos `ApicController api` `MovieCatalog catalog`, el primero esta encargado de todo lo relacionado con la API, el ultimo esta encargado de la persistencia de datos de las peliculas
Endpoints:

- **/addMovie** (POST) : Requiere  id,st,p. id=id de pelicula de imdb, st=cantidad de stock, p=precio por unidad de pelicula. Devuelve (value:string, error:true/false)
- **/getMoviesAvailables** (GET) : Requiere s, opcionalmente, page; s=string de titulo de pelicula a buscar, page=numero de pagina (0-100O porque la API devuelve la busqueda de forma paginada. Devuelve (value:Movie[]|string , error:false/true)
- **/getGenres** (GET) : Devuelve (value:string[] | string, error:false/true)
- **/getMovies** (GET) : Opcional s,id,g ; s=string de titulo de pelicula a buscar, id=id de pelicula de imdb, g=genero de la pelicula. Devuelve (value: Movie[] | Movie[] | Movie | Movies[] | Movies[] | string, error:false/true)
