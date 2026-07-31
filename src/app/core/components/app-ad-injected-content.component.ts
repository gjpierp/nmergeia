import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SentinelAdsService, IAnnouncement } from '../services/sentinel-ads.service';

@Component({
  selector: 'app-ad-injected-content',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="announcements.length > 0" class="sentinel-ad-inline-container">
      <div *ngFor="let ad of announcements; let i = index" class="sentinel-ad-inline-card">
        <div class="ad-inline-header">
          <span class="ad-inline-badge" [ngClass]="ad.announcement_type?.toLowerCase()">
            {{ ad.announcement_type || 'INFO' }} (Patrocinado / Sentinel)
          </span>
          <button 
            *ngIf="ad.is_dismissible" 
            class="ad-dismiss-btn" 
            (click)="dismiss(ad.announcement_id)" 
            title="Ocultar anuncio"
          >
            &times;
          </button>
        </div>
        <div class="ad-inline-body">
          <h4 class="ad-inline-title">{{ ad.title }}</h4>
          <p class="ad-inline-message">{{ ad.message }}</p>
        </div>
        <div *ngIf="ad.action_url" class="ad-inline-footer">
          <a 
            [href]="ad.action_url" 
            target="_blank" 
            rel="noopener noreferrer" 
            class="ad-inline-action-btn"
          >
            {{ ad.action_label || 'Descubrir más' }} &rarr;
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .sentinel-ad-inline-container {
      margin: 1.5rem 0;
      width: 100%;
    }
    .sentinel-ad-inline-card {
      background: linear-gradient(135deg, rgba(6, 182, 212, 0.08) 0%, rgba(16, 185, 129, 0.08) 100%);
      border: 1px solid var(--border-light, rgba(6, 182, 212, 0.3));
      border-left: 4px solid var(--accent-primary, #06b6d4);
      border-radius: 12px;
      padding: 1.25rem;
      box-shadow: 0 4px 20px rgba(0,0,0,0.15);
      position: relative;
    }
    .ad-inline-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }
    .ad-inline-badge {
      font-size: 0.7rem;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 4px;
      background: var(--bg-glass, rgba(10, 10, 12, 0.8));
      color: var(--accent-primary, #06b6d4);
      border: 1px solid var(--border-color);
    }
    .ad-inline-badge.warning { color: #f59e0b; }
    .ad-inline-badge.critical { color: #ef4444; }
    .ad-inline-badge.feature { color: #8b5cf6; }
    .ad-dismiss-btn {
      background: transparent;
      border: none;
      color: var(--text-tertiary, #64748b);
      font-size: 1.2rem;
      cursor: pointer;
    }
    .ad-dismiss-btn:hover { color: #ef4444; }
    .ad-inline-title {
      margin: 0 0 6px 0;
      font-size: 1.05rem;
      font-weight: 700;
      color: var(--text-primary);
    }
    .ad-inline-message {
      margin: 0;
      font-size: 0.9rem;
      color: var(--text-secondary);
      line-height: 1.5;
    }
    .ad-inline-footer {
      margin-top: 12px;
    }
    .ad-inline-action-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      font-size: 0.85rem;
      font-weight: 600;
      color: #fff;
      background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
      border-radius: 6px;
      text-decoration: none;
    }
  `]
})
export class AppAdInjectedContentComponent implements OnInit {
  @Input() userId: string = 'anonymous';
  @Input() interval: number = 3;
  public announcements: IAnnouncement[] = [];

  async ngOnInit() {
    await this.loadAnnouncements();
  }

  async loadAnnouncements() {
    this.announcements = await SentinelAdsService.getActiveAnnouncements('INLINE_CONTENT', this.userId);
  }

  async dismiss(announcementId: string) {
    await SentinelAdsService.dismissAnnouncement(announcementId, this.userId);
    this.announcements = this.announcements.filter(a => a.announcement_id !== announcementId);
  }
}
