import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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

  onSubmit():void{
    this.loggedIn.emit();
    this.closeDialog.emit(); 
  }
  onClose(): void {
    this.closeDialog.emit();
  }
}
