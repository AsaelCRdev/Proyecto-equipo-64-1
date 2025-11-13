import { Component, EventEmitter, Output, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart-service';

interface Day {
  day: number;
  available: boolean;
  selected: boolean;
  dateStr?: string;
}

@Component({
  selector: 'app-alquiler-dias',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './Time-Rental.html',
  styleUrls: ['./Time-Rental.css'],
})
export class AlquilerDiasComponent {
  @Input() movie: any = null;
  @Output() close = new EventEmitter<void>();

  private cartService = inject(CartService);

  // Inicializar con la fecha actual
  currentYear: number = new Date().getFullYear();
  currentMonthIndex: number = new Date().getMonth(); // 0-based index
  months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  days: Day[] = [];
  maxDays: number = 30; // se recalcula en generateDays()
  pricePerDay: number = 2;
  basePricePerDay: number = 5.99;
  // Guardar fechas seleccionadas como strings ISO (YYYY-MM-DD) para distinguir meses/años
  selectedDays: Set<string> = new Set<string>();

  // Para mostrar mensajes toast

  toastMessage: string | null = null;
  toastTimeout: any = null;

  // Guardar mes/año actual del sistema para comparación
  readonly systemYear: number = new Date().getFullYear();
  readonly systemMonthIndex: number = new Date().getMonth();

  constructor() {
    this.generateDays();
  }


  generateDays() {
    this.days = [];
    // calcular días reales del mes actual mostrado
    this.maxDays = this.daysInMonth(this.currentYear, this.currentMonthIndex);

    for (let i = 1; i <= this.maxDays; i++) {
      const dateStr = this.toDateStr(this.currentYear, this.currentMonthIndex, i);
      const available = !this.isPastDate(i);
      const selected = this.selectedDays.has(dateStr);
      this.days.push({
        day: i,
        available: available,
        selected: selected,
        dateStr: dateStr,
      });
    }
    // Nota: NO limpiamos selectedDays para preservar la selección al navegar entre meses
  }

  previousMonth() {
    if (this.currentMonthIndex === 0) {
      this.currentMonthIndex = 11;
      this.currentYear--;
    } else {
      this.currentMonthIndex--;
    }
    this.generateDays();
  }

  nextMonth() {
    if (this.currentMonthIndex === 11) {
      this.currentMonthIndex = 0;
      this.currentYear++;
    } else {
      this.currentMonthIndex++;
    }
    this.generateDays();
  }

  toggleDaySelection(day: Day) {
    if (!day.available) return;

    const dateStr = day.dateStr!; // se asigna en generateDays

    if (day.selected) {
      // deseleccionar
      day.selected = false;
      this.selectedDays.delete(dateStr);
    } else {
      // comprobar límite
      const MAX_SELECTION = 30;
      if (this.selectedDays.size >= MAX_SELECTION) {
        this.showToast(`No puedes seleccionar más de ${MAX_SELECTION} días.`);
        return;
      }

      day.selected = true;
      this.selectedDays.add(dateStr);
    }
  }

  showToast(message: string) {
    this.toastMessage = message;
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }
    this.toastTimeout = setTimeout(() => {
      this.toastMessage = null;
    }, 2500);
  }

  canGoToPreviousMonth(): boolean {
    // Solo permitir si el mes/año mostrado es posterior al actual
    return (
      this.currentYear > this.systemYear ||
      (this.currentYear === this.systemYear && this.currentMonthIndex > this.systemMonthIndex)
    );
  }

  onCancel() {
    this.close.emit();
  }

  onAddToCart() {
    if (this.selectedDays.size === 0) {
      this.showToast('Por favor selecciona al menos un día.');
      return;
    }
    const movieId = (this.movie && (this.movie.id || this.movie.imdbID || this.movie._id)) ? (this.movie.id || this.movie.imdbID || this.movie._id) : null;
    const added = this.cartService.addItem({
      id: movieId,
      name: this.movie?.title ?? this.movie?.name ?? 'Desconocido',
      price: this.priceTotal,
      quantity: 1,
      movie: this.movie,
      rentalDays: Array.from(this.selectedDays),
      totalDays: this.selectedDays.size
    });

    if (added) {
      this.showToast(`¡${this.movie?.title ?? 'Película'} agregado al carrito!`);
      // CartService.addItem ya llama a open(), así que el carrito se mostrará.
      setTimeout(() => this.close.emit(), 700);
    } else {
      this.showToast('No se pudo agregar al carrito. Revisa los mensajes.');
    }
  }

  get priceTotal(): number {
    return this.basePricePerDay + this.pricePerDay * this.selectedDays.size;
  }

  // Accept a possibly undefined day coming from the template (day?.day)
  isToday(day?: number): boolean {
    if (typeof day !== 'number') return false;
    const today = new Date();
    return (
      day === today.getDate() &&
      this.currentMonthIndex === today.getMonth() &&
      this.currentYear === today.getFullYear()
    );
  }

  // Devuelve true si la fecha (año/mes/ día) es anterior al día de hoy
  isPastDate(day: number): boolean {
    const today = new Date();
    const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const check = new Date(this.currentYear, this.currentMonthIndex, day);
    return check < todayOnly;
  }

  // Días en un mes
  daysInMonth(year: number, monthIndex: number): number {
    // monthIndex es 0-based; pasar next month y dia 0 para obtener último día del mes
    return new Date(year, monthIndex + 1, 0).getDate();
  }

  // Formato YYYY-MM-DD
  toDateStr(year: number, monthIndex: number, day: number): string {
    const y = year.toString().padStart(4, '0');
    const m = (monthIndex + 1).toString().padStart(2, '0');
    const d = day.toString().padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  // Build calendar weeks for the template. Returns array of weeks, each week is an array
  // of Day | null (null = empty cell).
  getWeeks(): (Day | null)[][] {
    const weeks: (Day | null)[][] = [];
    const daysPerWeek = 7;

    // Simple approach: place days sequentially into weeks (starting at first cell).
    // This matches the simple calendar used in the template.
    let week: (Day | null)[] = [];
    for (let i = 0; i < this.days.length; i++) {
      week.push(this.days[i]);
      if (week.length === daysPerWeek) {
        weeks.push(week);
        week = [];
      }
    }

    // Push remaining days and pad to 7
    if (week.length > 0) {
      while (week.length < daysPerWeek) {
        week.push(null);
      }
      weeks.push(week);
    }

    // If there are no weeks (no days), ensure at least one empty week
    if (weeks.length === 0) {
      weeks.push(new Array(daysPerWeek).fill(null));
    }

    return weeks;
  }
  
}
