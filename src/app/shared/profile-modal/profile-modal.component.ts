import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-profile-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-modal.component.html',
})
export class ProfileModalComponent {
  @Input() profile: any = null;
  @Input() role = '';
  @Output() close = new EventEmitter<void>();

  get displayName() {
    return this.profile?.fullName || this.profile?.name || this.profile?.username || 'OptimumPool user';
  }
}