import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MovieRental } from '../model/MovieRental';
import { ApiBackService } from './api-back.service';
import { AuthService } from './auth-service';
import { Buyer } from '../model/Buyer';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly MAX_ITEMS = 5;
  api = inject(ApiBackService);
  auth = inject(AuthService);
  itemsSubject = new BehaviorSubject<MovieRental[]>([]);
  items$ = this.itemsSubject.asObservable();

  private isOpenSubject = new BehaviorSubject<boolean>(false);
  isOpen$ = this.isOpenSubject.asObservable();

  private getTotalItems(): number {
    return this.itemsSubject.value.length;
  }

  constructor() {
    if (this.auth.buyer?.id) {
      this.getCart().then((v) => this.itemsSubject.next(v));
    }
  }
  async checkout(): Promise<boolean> {
    const id = this.auth.buyer?.id;
    if (!id || id.trim() === '') {
      console.error('No hay usuario logueado');
      return false;
    }

    const uriBuilder = `/rent?id=${encodeURIComponent(id)}`;
    const res = (await this.api.getFromBackAsT<string>(uriBuilder, 'POST')) as string;
    console.log('Respuesta rent:', res);

    if (res.toLowerCase().includes('rent realizado correctamente')) {
      // limpiar carrito en frontend
      this.itemsSubject.next([]);
      this.close();

      this.auth.buyer = (await this.auth.buyerService.getBuyers(
        this.auth.buyer?.id as string,
      )) as Buyer;
      return true;
    }
    return false;
  }
  async getCart(): Promise<MovieRental[]> {
    console.log(this.auth.buyer?.id);
    if (this.auth.buyer?.id === undefined) {
      console.error('id inválido');
      return [];
    }

    const uriBuilder = `/getCatalog?buyerId=${encodeURIComponent(this.auth.buyer.id)}`;
    const res = await this.api.getFromBackAsT<MovieRental[]>(uriBuilder, 'GET');
    console.log('Respuesta getCart:', res);

    return Array.isArray(res) ? res : [];
  }
  async getCartWithId(buyerId: string): Promise<MovieRental[]> {
    if (!buyerId || buyerId.trim() === '') {
      console.error('buyerId inválido');
      return [];
    }

    const uriBuilder = `/getCatalog?buyerId=${encodeURIComponent(buyerId)}`;
    const res = await this.api.getFromBackAsT<MovieRental[]>(uriBuilder, 'GET');
    console.log('Respuesta getCart:', res);

    return Array.isArray(res) ? res : [];
  }
  async addToCart(
    buyerId: string,
    movieId: string,
    startDate: string,
    endDate: string,
    price: string,
    days: string,
  ): Promise<boolean> {
    // Validaciones básicas antes de enviar
    if (!buyerId || !movieId || !startDate || !endDate || !price || !days) {
      console.error('Datos inválidos para addRental');
      return false;
    }

    const uriBuilder =
      `/addToCart?buyerId=${encodeURIComponent(buyerId)}` +
      `&movieId=${encodeURIComponent(movieId)}` +
      `&startDate=${encodeURIComponent(startDate)}` +
      `&endDate=${encodeURIComponent(endDate)}` +
      `&price=${encodeURIComponent(price)}` +
      `&days=${encodeURIComponent(days)}`;

    const res = (await this.api.getFromBackAsT<string>(uriBuilder, 'POST')) as string;
    console.log('Respuesta addRental:', res);
    return res.toLowerCase().includes('success');
  }
  isFull(): boolean {
    return this.getTotalItems() >= this.MAX_ITEMS;
  }

  getRemainingSlots(): number {
    return Math.max(0, this.MAX_ITEMS - this.getTotalItems());
  }

  addItem(rental: MovieRental): boolean {
    const current = [...this.itemsSubject.value];

    // Evitar duplicados por movieId
    const existing = current.find((i) => i.movieId === rental.movieId);
    if (existing) {
      alert('Solo se permite 1 alquiler por película.');
      return false;
    }

    if (current.length >= this.MAX_ITEMS) {
      alert(
        'No se pueden añadir más ítems al carrito. Límite de 5 alquileres distintos alcanzado.',
      );
      return false;
    }
    this.addToCart(
      this.auth.buyer?.id as string,
      rental.movieId,
      rental.startDate,
      rental.endDate,
      rental.price,
      rental.days,
    ).then((v) => {
      if (v) {
        this.getCart().then((r) => {
          this.itemsSubject.next(r);
          this.open();
          console.log('CartService.addItem: añadido', {
            id: rental.movieId,
            currentCount: current.length,
          });
        });
      }
    });

    return true;
  }

  removeItem(movieId: string) {
    const next = this.itemsSubject.value.filter((i) => i.movieId !== movieId);
    this.itemsSubject.next(next);
  }

  clear() {
    this.itemsSubject.next([]);
  }

  open() {
    this.isOpenSubject.next(true);
  }

  close() {
    this.isOpenSubject.next(false);
  }

  toggle() {
    this.isOpenSubject.next(!this.isOpenSubject.value);
  }
}
