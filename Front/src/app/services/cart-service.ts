import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CartItem {
  id: any;
  name: string;
  price?: number;
  quantity: number;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly MAX_ITEMS = 5;

  private itemsSubject = new BehaviorSubject<CartItem[]>([]);
  items$ = this.itemsSubject.asObservable();

  private isOpenSubject = new BehaviorSubject<boolean>(false);
  isOpen$ = this.isOpenSubject.asObservable();

  private getTotalItems(): number {
    return this.itemsSubject.value.reduce((sum, i) => sum + (i.quantity || 0), 0);
  }

  isFull(): boolean {
    return this.getTotalItems() >= this.MAX_ITEMS;
  }

  getRemainingSlots(): number {
    return Math.max(0, this.MAX_ITEMS - this.getTotalItems());
  }

  addItem(item: Partial<CartItem>): boolean {
    const desired = Math.max(1, item.quantity ?? 1);
    const currentTotal = this.getTotalItems();

    if (currentTotal + desired > this.MAX_ITEMS) {
      alert('No se pueden añadir más ítems al carrito. Límite de 5 alquileres alcanzado.');
      return false;
    }

    const current = [...this.itemsSubject.value];
    const existing = current.find(i => i.id === item.id);
    if (existing) {
      alert('Este alquiler ya está en el carrito.');
      return false;
    } else {
      const toAdd: CartItem = {
        id: item.id,
        name: item.name ?? '',
        price: item.price ?? 0,
        quantity: desired,
        ...item
      };
      current.push(toAdd);
    }

    this.itemsSubject.next(current);
    this.open();
    return true;
  }

  removeItem(id: any) {
    const next = this.itemsSubject.value.filter(i => i.id !== id);
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
