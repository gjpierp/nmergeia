import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SentinelAdsService, IAnnouncement } from '../services/sentinel-ads.service';

@Component({
  selector: 'app-ad-sidebar-slot',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="announcements.length > 0" class="sentinel-ad-sidebar-slot-container">
      <div *ngFor="let ad of announcements" class="sentinel-ad-card ad-sidebar-bottom">
        <div class="ad-header">
          <span class="ad-badge" [ngClass]="ad.announcement_type?.toLowerCase()">
            {{ ad.announcement_type || 'INFO' }}
          </span>
          <button 
            *ngIf="ad.is_dismissible" 
            class="ad-dismiss-btn" 
            (click)="dismiss(ad.announcement_id)" 
            title="Descartar anuncio"
          >
            &times;
          </button>
        </div>
        <h4 class="ad-title">{{ ad.title }}</h4>
        <p class="ad-message">{{ ad.message }}</p>
        <a 
          *ngIf="ad.action_url" 
          [href]="ad.action_url" 
          target="_blank" 
          rel="noopener noreferrer" 
          class="ad-action-btn"
        >
          {{ ad.action_label || 'Ver más' }}
        </a>
      </div>
    </div>
  `,
  styles: [`
    .sentinel-ad-sidebar-slot-container {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 12px;
      width: 100%;
      box-sizing: border-box;
      background: rgba(15, 23, 42, 0.4);
      border-top: 1px solid var(--border-color, #1e293b);
      border-radius: 8px;
    }
    .sentinel-ad-card {
      background: var(--bg-glass, rgba(10, 10, 12, 0.75));
      border: 1px solid var(--border-light, rgba(6, 182, 212, 0.2));
      border-radius: 8px;
      padding: 12px;
      color: var(--text-primary, #f8fafc);
      font-size: 0.85rem;
    }
    .ad-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 6px;
    }
    .ad-badge {
      font-size: 0.65rem;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 4px;
      text-transform: uppercase;
      background: var(--accent-primary, #06b6d4);
      color: #fff;
    }
    .ad-badge.warning { background: #f59e0b; }
    .ad-badge.critical { background: #ef4444; }
    .ad-badge.feature { background: #8b5cf6; }
    .ad-dismiss-btn {
      background: transparent;
      border: none;
      color: var(--text-tertiary, #64748b);
      font-size: 1.1rem;
      cursor: pointer;
      line-height: 1;
    }
    .ad-dismiss-btn:hover { color: #ef4444; }
    .ad-title { margin: 0 0 4px 0; font-size: 0.9rem; font-weight: 600; color: var(--text-primary); }
    .ad-message { margin: 0 0 8px 0; font-size: 0.8rem; color: var(--text-secondary); }
    .ad-action-btn {
      display: inline-block;
      padding: 4px 10px;
      font-size: 0.75rem;
      font-weight: 600;
      color: #fff;
      background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
      border-radius: 4px;
      text-decoration: none;
      text-align: center;
    }
  `]
})
export class AppAdSidebarSlotComponent implements OnInit {
  @Input() userId: string = 'anonymous';
  public announcements: IAnnouncement[] = [];

  async ngOnInit() {
    await this.loadAnnouncements();
  }

  async loadAnnouncements() {
    this.announcements = await SentinelAdsService.getActiveAnnouncements('SIDEBAR_BOTTOM', this.userId);
  }

  async dismiss(announcementId: string) {
    await SentinelAdsService.dismissAnnouncement(announcementId, this.userId);
    this.announcements = this.announcements.filter(a => a.announcement_id !== announcementId);
  }
}
