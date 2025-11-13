import { inject, Component, Input } from '@angular/core';
import { Buyer } from '../../model/Buyer';
import { AuthService } from '../../services/auth-service';
import { MovieRental } from '../../model/MovieRental';

@Component({
  selector: 'app-buyer-panel',
  imports: [],
  templateUrl: './buyer-panel.html',
  styleUrl: './buyer-panel.css',
})
export class BuyerPanel {
  auth = inject(AuthService);
  buyer: Buyer = this.auth.buyer!;
}
