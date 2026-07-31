import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SentinelAdsService, IAnnouncement } from '../services/sentinel-ads.service';

@Component({
  selector: 'app-ad-right-aside',
  standalone: true,
  imports: [CommonModule],
  template: `
    <aside *ngIf="announcements.length > 0" class="sentinel-ad-right-aside-container">
      <div class="aside-header">
        <span class="aside-label">Comunicados Sentinel</span>
      </div>
      <div *ngFor="let ad of announcements" class="sentinel-ad-card ad-right-aside">
        <div class="ad-header">
          <span class="ad-badge" [ngClass]="ad.announcement_type?.toLowerCase()">
            {{ ad.announcement_type || 'INFO' }}
          </span>
          <button 
            *ngIf="ad.is_dismissible" 
            class="ad-dismiss-btn" 
            (click)="dismiss(ad.announcement_id)" 
            title="Cerrar"
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
          {{ ad.action_label || 'Más información' }}
        </a>
      </div>
    </aside>
  `,
  styles: [`
    .sentinel-ad-right-aside-container {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 16px;
      width: 240px;
      min-width: 200px;
      box-sizing: border-box;
      background: var(--bg-glass, rgba(10, 10, 12, 0.85));
      border-left: 1px solid var(--border-color, #1e293b);
      height: 100%;
      overflow-y: auto;
    }
    .aside-header {
      border-bottom: 1px solid var(--border-color, #1e293b);
      padding-bottom: 8px;
      text-align: center;
    }
    .aside-label {
      font-size: 0.7rem;
      font-weight: 700;
      color: var(--text-tertiary, #64748b);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .sentinel-ad-card {
      background: rgba(15, 23, 42, 0.6);
      border: 1px solid var(--border-light, rgba(6, 182, 212, 0.2));
      border-radius: 10px;
      padding: 14px;
      color: var(--text-primary, #f8fafc);
    }
    .ad-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
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
    }
    .ad-dismiss-btn:hover { color: #ef4444; }
    .ad-title { margin: 0 0 6px 0; font-size: 0.92rem; font-weight: 600; }
    .ad-message { margin: 0 0 10px 0; font-size: 0.82rem; color: var(--text-secondary); line-height: 1.4; }
    .ad-action-btn {
      display: block;
      width: 100%;
      text-align: center;
      padding: 6px 12px;
      font-size: 0.78rem;
      font-weight: 600;
      color: #fff;
      background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
      border-radius: 6px;
      text-decoration: none;
      box-sizing: border-box;
    }
  `]
})
export class AppAdRightAsideComponent implements OnInit {
  @Input() userId: string = 'anonymous';
  public announcements: IAnnouncement[] = [];

  async ngOnInit() {
    await this.loadAnnouncements();
  }

  async loadAnnouncements() {
    this.announcements = await SentinelAdsService.getActiveAnnouncements('RIGHT_ASIDE', this.userId);
  }

  async dismiss(announcementId: string) {
    await SentinelAdsService.dismissAnnouncement(announcementId, this.userId);
    this.announcements = this.announcements.filter(a => a.announcement_id !== announcementId);
  }
}
