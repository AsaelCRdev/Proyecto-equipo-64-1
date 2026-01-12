import { Component, Input, EventEmitter, Output, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormControl,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { Movie } from '../../model/Movie';
import { Buyer } from '../../model/Buyer';
import { ValidationErrors } from '@angular/forms';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-buyer-edit-dialog',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './buyer-edit-dialog.html',
  styleUrl: './buyer-edit-dialog.css',
})
export class BuyerEditDialog implements OnInit {
  @Input() buyer!: Buyer;
  @Output() close = new EventEmitter<void>();
  @Output() editBuyer = new EventEmitter<{
    id: string;
    email?: string;
    pass?: string;
    name?: string;
    address?: string;
    phone?: string;
  }>();
  email: string = '';
  pass: string = '';
  name: string = '';
  address: string = '';
  phone: string = '';
  fb = inject(FormBuilder);
  authForm!: FormGroup;
  isFormValid() {
    return (
      this.authForm.get('email')?.valid &&
      this.authForm.get('password')?.valid &&
      this.authForm.get('name')?.valid &&
      this.authForm.get('direction')?.valid &&
      this.authForm.get('phone')?.valid
    );
  }
  ngOnInit(): void {
    this.authForm = this.fb.group({
      email: [this.buyer.email, [Validators.required, Validators.email]],
      password: [this.buyer.password, [Validators.required]],
      name: [this.buyer.name, Validators.required],
      direction: [this.buyer.address, Validators.required],
      phone: [this.buyer.phone, Validators.required],
    });
    this.email = this.buyer.email;
    this.pass = this.buyer.address;
    this.name = this.buyer.name;
    this.address = this.buyer.address;
    this.phone = this.buyer.phone;
    this.authForm.get('email')?.valueChanges.subscribe((value) => {
      if (value != null) this.email = value;
    });
    this.authForm.get('password')?.valueChanges.subscribe((value) => {
      if (value != null) this.pass = value;
    });
    this.authForm.get('name')?.valueChanges.subscribe((value) => {
      if (value != null) this.name = value;
    });
    this.authForm.get('direction')?.valueChanges.subscribe((value) => {
      if (value != null) this.address = value;
    });
    this.authForm.get('phone')?.valueChanges.subscribe((value) => {
      if (value != null) this.phone = value;
    });
  }
  onClose() {
    this.close.emit();
  }
  onEditBuyer() {
    const payload: {
      id: string;
      email?: string;
      pass?: string;
      name?: string;
      address?: string;
      phone?: string;
    } = { id: this.buyer.id };

    console.log(this.buyer);
    console.log(this.buyer.email, this.email, this.buyer.email !== this.email);
    if (this.buyer.email !== this.email) {
      payload.email = this.email;
    }
    console.log(this.buyer.password, this.pass, this.buyer.password !== this.pass);
    if (this.buyer.password !== this.pass) {
      payload.pass = this.pass;
    }
    console.log(this.buyer.name, this.name, this.buyer.name !== this.name);
    if (this.buyer.name !== this.name) {
      payload.name = this.name;
    }
    console.log(this.buyer.address, this.address, this.buyer.address !== this.address);
    if (this.buyer.address !== this.address) {
      payload.address = this.address;
    }
    console.log(this.buyer.phone, this.phone, this.buyer.phone !== this.phone);
    if (this.buyer.phone !== this.phone) {
      payload.phone = this.phone;
    }

    this.editBuyer.emit(payload);
  }
}
