import { Component, EventEmitter, Output, Input, inject, OnInit } from '@angular/core';
import { Movie } from '../../model/Movie';
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
export class AlquilerDiasComponent implements OnInit {
  @Input() movie: Movie | undefined = undefined;
  @Input() buyerId: string | undefined = undefined;
  @Output() close = new EventEmitter<void>();
  @Output() edited = new EventEmitter<void>();
  @Input() edit: boolean | undefined = undefined;
  @Input() editRental: boolean | undefined = undefined;

  private cartService = inject(CartService);

  // Inicializar con la fecha actual
  currentYear: number = new Date().getFullYear();
  currentMonthIndex: number = new Date().getMonth(); // 0-based index
  months = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];

  days: Day[] = [];
  maxDays: number = 30; // se recalcula en generateDays()
  pricePerDay: number = 0;
  // Guardar fechas seleccionadas como strings ISO (YYYY-MM-DD) para distinguir meses/años
  selectedDays: Set<string> = new Set<string>();

  // Para mostrar mensajes toast

  toastMessage: string | null = null;
  toastTimeout: any = null;

  // Guardar mes/año actual del sistema para comparación
  systemYear: number = new Date().getFullYear();
  systemMonthIndex: number = new Date().getMonth();
  systemDay = 0;

  ngOnInit(): void {
    const today = this.createDateWithoutTime();
    this.systemYear = today.getFullYear();
    this.systemMonthIndex = today.getMonth();
    this.systemDay = today.getDate();
    if (this.movie) {
      console.log('Película recibida:', this.movie.title);
      console.log('Precio:', parseFloat(this.movie.price ?? '0'));
      this.pricePerDay = parseFloat(this.movie?.price ?? '0');
    }
    this.generateDays();
  }
  constructor() {}

  getSelectedRange(): number {
    if (this.selectedDays.size < 2) return 0;

    const dates = Array.from(this.selectedDays).map((dateStr) => new Date(dateStr));
    const minDate = new Date(Math.min(...dates.map((d) => d.getTime())));
    const maxDate = new Date(Math.max(...dates.map((d) => d.getTime())));

    const diffMs = maxDate.getTime() - minDate.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    return diffDays;
  }
  getRangeToDay(day: Day): number {
    if (this.selectedDays.size !== 1 || !day.dateStr) return 0;

    const selectedDateStr = Array.from(this.selectedDays)[0];
    const selectedDate = new Date(selectedDateStr);
    const targetDate = new Date(day.dateStr);

    const diffMs = Math.abs(targetDate.getTime() - selectedDate.getTime());
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    return diffDays;
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
    } else if (this.selectedDays.size >= 2) {
      this.showToast('Solo puedes seleccionar la fecha de inicio y fin!');
    } else {
      // comprobar límite
      const MAX_DAYS = 30;
      if (this.getRangeToDay(day) >= MAX_DAYS) {
        this.showToast(`No puedes seleccionar más de ${MAX_DAYS} días.`);
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

  onAddToCart(edit?: boolean) {
    if (this.selectedDays.size === 0) {
      this.showToast('Por favor selecciona al menos un día.');
      return;
    }
    const dates = Array.from(this.selectedDays)
      .sort((a, b) => a.localeCompare(b))
      .map((dateStr) => {
        const [year, month, day] = dateStr.split('-').map(Number);
        return new Date(year, month - 1, day, 0, 0, 0, 0); // Medianoche
      });

    const movieId = this.movie && this.movie.imdbID ? this.movie.imdbID : null;
    if (edit) {
      this.cartService
        .editCartMovie(
          this.cartService.auth.buyer?.id as string,
          movieId as string,
          // También puedes formatear las fechas para que no muestren hora:
          dates[0].toDateString(), // Esto muestra sin hora: "Fri Jan 31 2026"
          dates[1].toDateString(), // Igual aquí
          this.priceTotal.toString(),
          this.getSelectedRange().toString(),
        )
        .then((ok) => {
          console.log(ok);
          if (ok) this.edited.emit();
        });
    } else if (this.editRental) {
      this.cartService
        .editRent(
          this.buyerId!,
          movieId as string,
          // También puedes formatear las fechas para que no muestren hora:
          dates[0].toDateString(), // Esto muestra sin hora: "Fri Jan 31 2026"
          this.priceTotal.toString(),
          this.getSelectedRange().toString(),
          dates[1].toDateString(), // Igual aquí
        )
        .then((ok) => {
          console.log(ok);
          if (ok) this.edited.emit();
        });
    } else {
      const added = this.cartService.addItem({
        movieId: movieId ?? '',
        price: this.priceTotal.toString(),
        days: this.getSelectedRange().toString(),
        // También puedes formatear las fechas para que no muestren hora:
        startDate: dates[0].toDateString(), // Esto muestra sin hora: "Fri Jan 31 2026"
        endDate: dates[1].toDateString(), // Igual aquí
      });

      if (added) {
        this.showToast(`¡${this.movie?.title ?? 'Película'} agregado al carrito!`);
        // CartService.addItem ya llama a open(), así que el carrito se mostrará.
        setTimeout(() => this.close.emit(), 700);
      } else {
        this.showToast('No se pudo agregar al carrito. Revisa los mensajes.');
      }
    }
  }

  get priceTotal(): number {
    return this.pricePerDay * this.getSelectedRange();
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
    const check = new Date(this.currentYear, this.currentMonthIndex, day, 0, 0, 0, 0); // ← Agrega ,0,0,0,0
    const today = new Date(this.systemYear, this.systemMonthIndex, this.systemDay, 0, 0, 0, 0); // ← Agrega ,0,0,0,0
    return check < today;
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
  // Crear tiempo en UTC
  private createDateWithoutTime(year?: number, month?: number, day?: number): Date {
    if (year !== undefined && month !== undefined && day !== undefined) {
      return new Date(year, month, day, 0, 0, 0, 0); // Medianoche hora local
    }
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
  }
}
