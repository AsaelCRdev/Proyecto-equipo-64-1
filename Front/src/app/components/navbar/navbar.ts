import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})

export class NavbarComponent implements OnInit {
  userInitial: string = 'D';
  cartItemCount: number = 3;
  isUserLoggedIn: boolean = true;
  
  constructor() { }
  ngOnInit(): void { }
  logout(): void {
    console.log('Cerrar sesión llamado');
    this.isUserLoggedIn = false;
  }
}