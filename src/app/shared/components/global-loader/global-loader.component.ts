import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../../../services/loading.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
    selector: 'app-global-loader',
    standalone: true,
    imports: [CommonModule, MatProgressBarModule],
    template: `
    @if (loadingService.loading()) {
      <div class="loader-container">
        <mat-progress-bar mode="indeterminate" color="accent" class="custom-loader"></mat-progress-bar>
      </div>
    }
  `,
    styles: [`
    .loader-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      z-index: 9999;
    }
    .custom-loader {
      height: 3px !important;
      --mdc-linear-progress-active-indicator-color: var(--primary-accent);
      --mdc-linear-progress-track-color: var(--highlight);
    }
  `]
})
export class GlobalLoaderComponent {
    public loadingService = inject(LoadingService);
}
