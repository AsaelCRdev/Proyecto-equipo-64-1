# Moviesgo
## Front

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
