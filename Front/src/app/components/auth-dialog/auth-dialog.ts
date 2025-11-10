import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
@Component({
  selector: 'app-auth-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth-dialog.html',
  styleUrls: ['./auth-dialog.css'],
})
export class AuthDialog {
  @Output () closeDialog = new EventEmitter<void>()
  @Output () loggedIn = new EventEmitter<void>()


  isLoginMode:boolean = true;
  email:string = '';
  password:string = '';
  direction:string =''
  phone: string = '';

 constructor(private auth: AuthService) {}

  onSubmit(): void {
    // credenciales admin fijas solicitadas para acceder
    const adminEmail = 'admin@MoviesGo.com';
    const adminPassword = 'Movies20betheOne*';

    if (this.email === adminEmail && this.password === adminPassword) {
      this.auth.loginAsAdmin();
    } else {
      // login de para usuario normal
      this.auth.loginUser();
    }
    this.loggedIn.emit();
    this.closeDialog.emit();
  }

  onClose(): void {
    this.closeDialog.emit();
  }
}
