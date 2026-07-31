export interface IAnnouncementPosition {
  position_id: string;
  position_code: string;
  position_name: string;
  description?: string;
  recommended_dimensions?: string;
  css_layout_class?: string;
  injection_interval?: number;
  max_ads_per_page?: number;
  min_paragraphs_required?: number;
  is_active: boolean;
  order_index?: number;
}

export interface IAnnouncement {
  announcement_id: string;
  app_code: string;
  position_id: string;
  position_code?: string;
  title: string;
  message: string;
  announcement_type: 'INFO' | 'WARNING' | 'CRITICAL' | 'FEATURE' | 'MAINTENANCE';
  action_label?: string;
  action_url?: string;
  target_role_code?: string;
  is_dismissible: boolean;
  start_at?: string;
  end_at?: string;
  status_code?: string;
}

export class SentinelAdsService {
  private static readonly API_BASE = 'https://sentinel-ngac.local/api/announcements';
  private static readonly RELATIVE_API_BASE = '/api/announcements';
  public static readonly APP_CODE = 'nmerge';

  /**
   * Obtiene la lista de anuncios activos desde el backend de Sentinel NGAC
   */
  public static async getActiveAnnouncements(
    positionCode?: string,
    userId?: string,
    roleCode?: string
  ): Promise<IAnnouncement[]> {
    const params = new URLSearchParams();
    params.append('appCode', this.APP_CODE);
    if (positionCode) params.append('positionCode', positionCode);
    if (userId) params.append('userId', userId);
    if (roleCode) params.append('roleCode', roleCode);

    const queryString = params.toString();

    // Intentar primero proxy relativo local (/api/announcements/active) y luego fallback a dominio directo
    const urlsToTry = [
      `${this.RELATIVE_API_BASE}/active?${queryString}`,
      `${this.API_BASE}/active?${queryString}`
    ];

    for (const url of urlsToTry) {
      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-App-Code': this.APP_CODE
          }
        });

        if (response.ok) {
          const resData = await response.json();
          if (resData && resData.ok && Array.isArray(resData.data)) {
            return resData.data as IAnnouncement[];
          }
        }
      } catch (_err) {
        // Fallback silencioso entre endpoints sin contaminar los logs del navegador
      }
    }

    return [];
  }

  /**
   * Registra el descarte voluntario de un anuncio por parte del usuario
   */
  public static async dismissAnnouncement(
    announcementId: string,
    userId: string = 'anonymous'
  ): Promise<boolean> {
    const urlsToTry = [
      `${this.RELATIVE_API_BASE}/${announcementId}/dismiss`,
      `${this.API_BASE}/${announcementId}/dismiss`
    ];

    for (const url of urlsToTry) {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-App-Code': this.APP_CODE
          },
          body: JSON.stringify({ userId })
        });

        if (response.ok) {
          const resData = await response.json();
          return resData?.ok === true;
        }
      } catch (_err) {
        // Fallback silencioso entre endpoints
      }
    }

    return false;
  }
}

// Instancia singleton por defecto para facilitar uso en módulos JS/TS
export const sentinelAdsService = SentinelAdsService;
