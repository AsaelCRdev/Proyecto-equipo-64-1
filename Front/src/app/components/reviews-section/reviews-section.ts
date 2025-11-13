import { Component, Input, OnChanges, SimpleChanges, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ReviewsService, Review } from '../../services/reviews.service';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-reviews-section',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reviews-section.html',
  styleUrls: ['./reviews-section.css'],
})
export class ReviewsSectionComponent implements OnChanges, OnDestroy {
  @Input() movieId?: string | number;

  private reviewsService = inject(ReviewsService);
  private auth = inject(AuthService);
  private sub = new Subscription();

  reviews: Review[] = [];
  loading = false;
  error: string | null = null;

  form = new FormGroup({
    comment: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(300)]),
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['movieId']) {
      this.subscribeReviews();
    }
  }

  private subscribeReviews(): void {
    this.sub.unsubscribe();
    this.sub = new Subscription();
    const id = this.movieId;
    if (id == null) {
      this.reviews = [];
      return;
    }
    this.loading = true;
    const obs = this.reviewsService.getReviews(id);
    this.sub.add(
      obs.subscribe({
        next: (r) => {
          this.reviews = r ?? [];
          this.loading = false;
        },
        error: () => {
          this.error = 'No se pudieron cargar las reseñas locales.';
          this.loading = false;
        },
      })
    );
  }

  isLoggedIn(): boolean {
    const a: any = this.auth;
    if (typeof a.isLoggedIn === 'boolean') return a.isLoggedIn;
    if (a.isLoggedIn$ && typeof a.isLoggedIn$.subscribe === 'function') {
      let v = false;
      const s = a.isLoggedIn$.subscribe((x: any) => (v = !!x));
      try { s.unsubscribe?.(); } catch {}
      return v;
    }
    return false;
  }

  private currentUserName(): string {
    return (this.auth as any).userName ?? 'Usuario';
  }

  submit(): void {
    if (!this.isLoggedIn()) {
      alert('Inicia sesión para agregar una reseña.');
      return;
    }
    if (this.form.invalid) return;

    const id = this.movieId;
    if (id == null) return;

    const comment = String(this.form.value.comment ?? '').trim();
    if (comment.length < 8 || comment.length > 300) return;

    const saved = this.reviewsService.addReview(id, {
      userName: this.currentUserName(),
      comment,
    });

    this.form.reset({ comment: '' });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
