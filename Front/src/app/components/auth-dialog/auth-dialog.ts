import { inject, Component, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../../services/auth-service';
import { FormGroup, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'app-auth-dialog',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './auth-dialog.html',
  styleUrls: ['./auth-dialog.css'],
})
export class AuthDialog {
  @Output() closeDialog = new EventEmitter<void>();
  @Output() loggedIn = new EventEmitter<void>();

  auth = inject(AuthService);

  fb = inject(FormBuilder);
  authForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    direction: [''],
    phone: [''],
  });
  isLoginMode: boolean = true;
  onSubmit(): void {
    // credenciales admin fijas solicitadas para acceder
    const adminEmail = 'admin@MoviesGo.com';
    const adminPassword = 'Movies20betheOne*';

    if (
      this.authForm.get('email')?.value === adminEmail &&
      this.authForm.get('password')?.value === adminPassword
    ) {
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
