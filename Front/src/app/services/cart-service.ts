import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CartItem {
  id: string;
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
    return this.itemsSubject.value.length;
  }

  isFull(): boolean {
    return this.getTotalItems() >= this.MAX_ITEMS;
  }

  getRemainingSlots(): number {
    return Math.max(0, this.MAX_ITEMS - this.getTotalItems());
  }

  private resolveId(item: Partial<CartItem>): string | null {
    const anyItem = item as any;
    const rawCandidates = [
      anyItem.id,
      anyItem.imdbID,
      anyItem.movieId,
      anyItem.movie?.imdbID,
      anyItem.movie?.id
    ];
    const raw = rawCandidates.find(r => r !== undefined && r !== null && String(r).trim() !== '');
    const normalized = raw == null ? '' : String(raw).trim();
    return normalized === '' ? null : normalized;
  }

  addItem(item: Partial<CartItem>): boolean {
    const current = [...this.itemsSubject.value];
    const normalizedId = this.resolveId(item);

    if (normalizedId == null) {
      console.error('CartService.addItem: película sin identificador válido', item);
      alert('Error interno: la película no tiene identificador válido. Revisa la consola para más detalles.');
      return false;
    }

    const existing = current.find(i => i.id === normalizedId);

    if (existing) {
      alert('Solo se permite 1 alquiler por película.');
      return false;
    }

    if (current.length >= this.MAX_ITEMS) {
      alert('No se pueden añadir más ítems al carrito. Límite de 5 alquileres distintos alcanzado.');
      return false;
    }

    const toAddItem: CartItem = {
      ...(item as any),
      id: normalizedId,
      name: item.name ?? '',
      price: item.price ?? 0,
      quantity: 1
    };

    current.push(toAddItem);
    this.itemsSubject.next(current);
    this.open();

    console.log('CartService.addItem: añadido', { id: normalizedId, currentCount: current.length });
    return true;
  }

  removeItem(id: any) {
    const next = this.itemsSubject.value.filter(i => i.id !== String(id));
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
