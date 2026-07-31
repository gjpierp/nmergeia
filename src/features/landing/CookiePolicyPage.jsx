import { PageHeader } from '../../shared/ui/PageHeader.jsx';
import React from 'react';
import { useTranslation } from 'react-i18next';
import './LegalPages.css';

export const CookiePolicyPage = () => {
  const { t } = useTranslation();

  return (
    <div className="legal-page-container">
      <PageHeader title="Política de Cookies y Tecnologías de Rastreo (CMP)" />
      <p className="last-updated">Cumplimiento del Marco TCF v2.2 de IAB Europe y ePrivacy</p>

      <section>
        <h2>1. Definición y Alcance Transparente</h2>
        <p>
          Las "cookies" son pequeños fragmentos de datos, identificadores únicos y hashes criptográficos que se instalan en su navegador o dispositivo cuando interactúa con StackUpIA. Esta política le otorga control total (Granular Consent) sobre cómo la plataforma maneja su huella digital, cumpliendo al 100% con la Directiva ePrivacy de la UE y las leyes de rastreo de California (CCPA).
        </p>
      </section>

      <section>
        <h2>2. Categorización Estricta de Cookies</h2>
        <p>Nuestra infraestructura NGAC (Next Generation Access Control) clasifica las cookies en tres capas inflexibles:</p>
        
        <div className="cookie-category">
          <h3>2.1 Cookies Estrictamente Necesarias (Técnicas / Seguridad)</h3>
          <p><strong>Requeridas. No sujetas a consentimiento (Base legal: Interés legítimo / Ejecución de contrato).</strong></p>
          <ul>
            <li><strong>nmerge_jwt_token:</strong> Gestiona la autenticación JWT, previene ataques CSRF y mantiene la sesión activa.</li>
            <li><strong>StackUpIA_ngac_locked:</strong> Almacena atributos del grafo de permisos (Zero-Trust) para evitar acceso no autorizado.</li>
            <li><strong>nmerge_language / theme:</strong> Guarda preferencias estructurales básicas de la interfaz.</li>
          </ul>
        </div>

        <div className="cookie-category">
          <h3>2.2 Cookies Analíticas y de Rendimiento (Opt-In/Opt-Out)</h3>
          <p><strong>Consentimiento Requerido. Desactivadas por defecto.</strong></p>
          <p>
            Proveen telemetría y mapas de calor (Heatmaps) de forma agregada y anonimizada. Nos permite medir qué arquitecturas o cursos tienen mayor latencia o demanda. Utilizamos Proveedores Analíticos que garantizan que la IP será enmascarada antes de su procesamiento.
          </p>
        </div>

        <div className="cookie-category">
          <h3>2.3 Cookies Publicitarias y de Targeting (Google AdSense)</h3>
          <p><strong>Consentimiento Explícito Requerido (IAB TCF v2.2). Desactivadas por defecto en la UE.</strong></p>
          <p>
            StackUpIA utiliza Google AdSense para monetizar la plataforma educativa. Estas cookies recopilan identificadores publicitarios (Advertising ID) y datos de comportamiento transversal para mostrar anuncios altamente relevantes. Los datos pueden ser procesados por Google LLC y sus socios de la red de pujas (Real-Time Bidding).
          </p>
        </div>
      </section>

      <section>
        <h2>3. Gestión de Consentimiento (Consent Management)</h2>
        <p>
          Usted tiene el poder absoluto de revocar o modificar su consentimiento en cualquier momento. Al hacer clic en el botón "Aceptar Cookies" en nuestro Banner CMP, usted acepta el despliegue de las categorías 2.2 y 2.3. Si hace clic en "Rechazar", bloquearemos inmediatamente (Zero-Tolerance) cualquier script analítico o de monetización de AdSense en su navegador.
        </p>
        <p>
          Para modificar sus preferencias manualmente ahora mismo, puede acceder al Panel de Privacidad dentro de sus configuraciones de usuario o limpiar la caché local de su navegador.
        </p>
      </section>

      <section>
        <h2>4. Señales Globales de Privacidad (Global Privacy Control - GPC / Do Not Track)</h2>
        <p>
          StackUpIA respeta y acata de forma nativa la señal GPC (Global Privacy Control) emitida por los navegadores modernos (Ej. Brave, Firefox). Si detectamos un header GPC, nuestro firewall de aplicaciones (WAF) asume un "Opt-Out" global automático para las cookies de marketing.
        </p>
      </section>
    </div>
  );
};
