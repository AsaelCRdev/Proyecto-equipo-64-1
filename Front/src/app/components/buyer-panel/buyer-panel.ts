import { inject, Component, Input } from '@angular/core';
import { Buyer } from '../../model/Buyer';
import { AuthService } from '../../services/auth-service';
import { MovieRental } from '../../model/MovieRental';
import { BuyerEditDialog } from '../buyer-edit-dialog/buyer-edit-dialog';
import { BuyerService } from '../../services/buyer.service';
import { Movie } from '../../model/Movie';
import { AlquilerDiasComponent } from '../Time-Rental/Time-Rental';
import { MovieService } from '../../services/movie.service';

@Component({
  selector: 'app-buyer-panel',
  imports: [BuyerEditDialog, AlquilerDiasComponent],
  templateUrl: './buyer-panel.html',
  styleUrl: './buyer-panel.css',
})
export class BuyerPanel {
  auth = inject(AuthService);
  movieService = inject(MovieService);
  buyer: Buyer = this.auth.buyer!;
  showEdit = false;
  buyerService = inject(BuyerService);
  selectedMovieForRental: Movie | undefined;
  showEditRental = false;
  onClose() {
    this.showEdit = false;
  }
  onEditBuyer(payload: {
    id: string;
    email?: string;
    pass?: string;
    name?: string;
    address?: string;
    phone?: string;
  }) {
    console.log('Editando buyer', payload);
    this.buyerService
      .editBuyer(
        payload.id,
        payload.pass,
        payload.name,
        payload.email,
        payload.address,
        payload.phone,
      )
      .then((ok) => {
        if (ok) {
          alert('Cambios realizados exitosamente');
          this.buyerService.getBuyers(this.buyer.id).then((b) => {
            if (b) {
              this.buyer = b as Buyer;
              this.auth.buyer = this.buyer;
            }
          });
        } else {
          alert(
            'El email ya esta registrado en otra cuenta o hubo un error en el servidor. Intente de nuevo',
          );
        }
      });
  }
  returnMovie(mv: MovieRental) {
    const confirm = window.confirm('Quieres devolver esta pelicula?');
    if (!confirm) return;

    const foo = this.buyerService.returnMovie(this.buyer.id, mv.movieId);
    foo.then((ok) => {
      if (ok) {
        this.buyerService.getBuyers(this.buyer.id).then((b) => {
          if (b) {
            this.buyer = b as Buyer;
            this.auth.buyer = this.buyer;
          }
        });
      }
    });
  }
  edit(item: MovieRental) {
    this.movieService.getMovie(item.movieId).then((r) => {
      if (r) {
        this.selectedMovieForRental = r;
      }
    });
    this.showEditRental = true;
  }
  onCloseRentalModal() {
    this.buyerService.getBuyers(this.buyer.id).then((v) => {
      if (v != null) {
        this.buyer = v as Buyer;
        this.auth.buyer = this.buyer;
      }
    });
    this.showEditRental = false;
  }
}
