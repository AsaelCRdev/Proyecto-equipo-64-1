import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Review {
  id: string;
  userName: string;
  comment: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class ReviewsService {
  private storageKey = 'app_reviews_v1';
  private subjects = new Map<string, BehaviorSubject<Review[]>>();
  private data: Record<string, Review[]> = {};

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    try {
      const raw = localStorage.getItem(this.storageKey);
      this.data = raw ? JSON.parse(raw) : {};
    } catch {
      this.data = {};
    }
  }

  private persist(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.data));
    } catch {
      // ignore
    }
  }

  private ensureSubject(movieId: string): BehaviorSubject<Review[]> {
    if (!this.subjects.has(movieId)) {
      const list = (this.data[movieId] ?? [])
        .slice()
        .sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1));
      this.subjects.set(movieId, new BehaviorSubject<Review[]>(list));
    }
    return this.subjects.get(movieId)!;
  }

  getReviews(movieId: string | number): Observable<Review[]> {
    const key = String(movieId ?? '');
    if (!key) return new BehaviorSubject<Review[]>([]).asObservable();

    const subj = this.ensureSubject(key);
    return subj.asObservable();
  }

  addReview(movieId: string | number, partial: { userName: string; comment: string }): Review {
    const key = String(movieId ?? '');
    if (!key) throw new Error('movieId requerido');
    const review: Review = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      userName: partial.userName ?? 'Usuario',
      comment: partial.comment ?? '',
      createdAt: new Date().toISOString(),
    };

    this.data[key] = [review, ...(this.data[key] ?? [])];
    this.persist();

    const subj = this.ensureSubject(key);
    subj.next(this.data[key].slice());
    return review;
  }

  // método opcional para pruebas / limpieza
  clearAll(): void {
    this.data = {};
    this.persist();
    this.subjects.forEach((s) => s.next([]));
  }
}
