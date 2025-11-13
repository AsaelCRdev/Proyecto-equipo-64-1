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
    password: ['', [Validators.required]],
    name: ['', Validators.required],
    direction: ['', Validators.required],
    phone: ['', Validators.required],
  });
  isLoginMode: boolean = true;
  isFormValid() {
    if (this.isLoginMode) {
      return this.authForm.get('email')?.valid && this.authForm.get('password')?.valid;
    } else {
      return (
        this.authForm.get('email')?.valid &&
        this.authForm.get('password')?.valid &&
        this.authForm.get('name')?.valid &&
        this.authForm.get('direction')?.valid &&
        this.authForm.get('phone')?.valid
      );
    }
  }
  onSubmit(): void {
    // credenciales admin fijas solicitadas para acceder
    if (this.isLoginMode) {
      this.auth
        .logIn(
          encodeURIComponent(this.authForm.get('email')?.value.trim()),
          encodeURIComponent(this.authForm.get('password')?.value.trim()),
        )
        .then((r) => {
          if (r) {
            this.loggedIn.emit();
            this.closeDialog.emit();
          }
        });
    } else {
      this.auth
        .createAccount(
          this.authForm.get('email')?.value,
          this.authForm.get('password')?.value,
          this.authForm.get('name')?.value,
          this.authForm.get('direction')?.value,
          this.authForm.get('phone')?.value,
        )
        .then((r) => {
          if (r) {
            this.loggedIn.emit();
            this.closeDialog.emit();
          } else {
            alert('Email ya registrado!');
          }
        });
    }
  }

  onClose(): void {
    this.closeDialog.emit();
  }
}
