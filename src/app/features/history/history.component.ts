import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { finalize, timeout } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { HistoryService } from '../../core/services/history.service';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './history.component.html',
})
export class HistoryComponent implements OnInit {
  items: any[] = [];
  activeTab = 'rides';
  loading = true;
  error = '';

  constructor(private historyService: HistoryService, public authService: AuthService, private cdr: ChangeDetectorRef) {}

  ngOnInit() { this.load(); }
  get role() { return this.authService.getRole(); }
  get backLink() { return this.role === 'OWNER' ? '/owner/dashboard' : '/customer/dashboard'; }

  load() {
    this.loading = true;
    this.error = '';
    const request = this.role === 'OWNER' ? this.historyService.getOwnerHistory() : this.historyService.getCustomerHistory();
    request.pipe(timeout(10000), finalize(() => { this.loading = false; this.cdr.detectChanges(); })).subscribe({
      next: (data) => (this.items = data || []),
      error: (err) => (this.error = err?.status === 404 ? 'History endpoint is not available yet.' : 'Could not load history.'),
    });
  }

  totalAmount(item: any) { return item.amount || item.pricePaid || item.bill_generated || item.distance * item.no_seat_want * item.offerObject?.charge_per_km || 0; }
}