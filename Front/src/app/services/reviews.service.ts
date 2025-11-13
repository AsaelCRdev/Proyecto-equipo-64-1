import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Review } from '../model/Review';

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
}
