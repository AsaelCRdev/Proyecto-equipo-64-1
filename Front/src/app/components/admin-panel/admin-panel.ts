import { Component, inject, OnInit } from '@angular/core';
import { MovieConfigDialog } from '../movie-config-dialog/movie-config-dialog';
import { MovieSelectDialog } from '../movie-select-dialog/movie-select-dialog';
import { MovieService } from '../../services/movie.service';
import { Movie } from '../../model/Movie';
import { BuyerService } from '../../services/buyer.service';
import { Buyer } from '../../model/Buyer';
import { Review } from '../../model/Review';
import { MovieRental } from '../../model/MovieRental';
import { ɵInternalFormsSharedModule } from "@angular/forms";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.html',
  imports: [MovieSelectDialog, MovieConfigDialog, ɵInternalFormsSharedModule, FormsModule],
  standalone: true,
  styleUrl: './admin-panel.css',
})
export class AdminPanel implements OnInit {
  movieService = inject(MovieService);
  activeSection: 'compradores' | 'alquileres' | 'peliculas' | 'reseñas' = 'compradores';

  showSelect = false;
  showConfig = false;
  selectedMovie: Movie | undefined = undefined;
  selectedBuyer: Buyer | undefined = undefined;
  buyerService = inject(BuyerService);

  buyers: Buyer[] = [];

  movies: Movie[] = [];
  rentals: MovieRental[] = [];
  reviews: Review[] | undefined = undefined;

isEditingMovie = false;
isEditingBuyer = false;

  ngOnInit(): void {
    this.buyerService.getAllRented().then((v) => {
      if (v != null) this.rentals = v;
    });
    this.movieService.getMovies().then((mv) => {
      if (mv != null) this.movies = mv;
    });
    this.buyerService.getBuyers().then((b) => {
      this.buyers = b as Buyer[];
    });
    this.movieService.getAllReviews().then((r) => {
      this.reviews = r;
    });
  }
  // abrir selector
  openSelect() {
    this.showSelect = true;
  }
  onSelectMovie(movie: Movie) {
    this.selectedMovie = movie;
    this.showSelect = false;
    this.showConfig = true;
  }

  // recibir payload del diálogo de configuración y añadir al catálogo (o actualizar)
  onAddToCatalog(payload: { movie: Movie; stock: number; price: number }) {
    this.movieService.addMovie(
      encodeURIComponent(payload.movie.imdbID.toLowerCase()),
      encodeURIComponent(payload.stock),
      encodeURIComponent(payload.price),
    );
    setTimeout(() => {
      this.movieService.getMovies().then((mv) => {
        if (mv != null) {
          this.movies = mv;
          console.log(this.movies);
        }
      });
    }, 1000);
    this.showConfig = false;
    this.selectedMovie = undefined;
  }

  setSection(section: 'compradores' | 'alquileres' | 'peliculas' | 'reseñas') {
    this.activeSection = section;
  }

  // pelicula

  editMovie(movie: Movie) {
    this.selectedMovie = { ...movie};
    this.isEditingMovie = true;
  }

  async saveMovie() {
        if(!this.selectedMovie) return;

        if(this.selectedMovie.stock.trim() === "" || this.selectedMovie.price.trim() === ""){
            alert("no pueden haber campos vacios");
            return;
        }

        let precio = parseFloat(this.selectedMovie.price);
        if(isNaN(precio)) { alert("el precio debe ser numerico"); return; }
        
        let stock = parseFloat(this.selectedMovie.stock);
        if(isNaN(stock)) { alert("el stock debe ser numerico"); return; }

        const updateMovie = await this.movieService.updateMovie(this.selectedMovie.imdbID, this.selectedMovie);
        if(updateMovie){
            this.movies = this.movies.map(m=>m.imdbID === updateMovie.imdbID ? updateMovie : m);
        }
        this.isEditingMovie = false;
        this.selectedMovie = undefined;
        alert('Actualizado');
  } 

  async removeMovie(movie: Movie){
      if(!confirm('¿seguro que quiere eliminar esta pelicula?')) return;
      const result = await this.movieService.deleteMovie(movie.imdbID);
      if(result){
        this.movies = result;
        alert('Eliminado');
      }
  } 

  cancelEditMovie(){
    this.isEditingMovie = false;
    this.selectedMovie = undefined;
  }




  // comprador

  editBuyer(buyer: Buyer) {
    this.selectedBuyer = { ...buyer};
    this.isEditingBuyer = true;
  }

  async saveBuyer(){
    if(!this.selectedBuyer) return;

    //validacion de campos
    if(this.selectedBuyer.name.trim() === "" || this.selectedBuyer.email.trim() === "" || this.selectedBuyer.address.trim() === "" || this.selectedBuyer.phone.trim() === ""){
            alert("no pueden haber campos vacios");
            return;
        }
      let name = parseFloat(this.selectedBuyer.name);
      if(!isNaN(name)){ alert("nombre invalido"); return;}
    
      if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.selectedBuyer.email)){ alert("el email tiene formato invalido, debe tener este formato: tudireccion@gmail.com"); return;}
      
      let phone = parseFloat(this.selectedBuyer.phone);
      if(isNaN(phone)){ alert("telefono invalido"); return;}
      

      const updateBuyer = await this.buyerService.updateBuyer(this.selectedBuyer.id, this.selectedBuyer);
        if(updateBuyer){
            this.buyers = this.buyers.map(m=>m.id === updateBuyer.id ? updateBuyer : m);
        }
        this.isEditingBuyer = false;
        this.selectedBuyer = undefined;
        alert('Actualizado');
  }

  async removeBuyer(buyer: Buyer){
      if(!confirm('¿seguro que quiere eliminar a este comprador?')) return;
      const result = await this.buyerService.deleteBuyer(buyer.id);
      if(result){
        this.buyers = result;
        alert('Eliminado');
      }
  }

  cancelEditBuyer(){
    this.isEditingBuyer = false;
    this.selectedBuyer = undefined;
  }

}
