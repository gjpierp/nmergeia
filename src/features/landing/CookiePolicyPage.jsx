import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../shared/ui/PageHeader.jsx';
import { Breadcrumbs } from '../../shared/ui/Breadcrumbs.jsx';
import './LegalPages.css';

export const CookiePolicyPage = () => {
  const { t } = useTranslation();

  return (
    <div className="legal-page-container" style={{ padding: '40px 20px', maxWidth: '900px', margin: '0 auto', color: 'var(--text-primary)', fontFamily: '"Outfit", sans-serif', overflowY: 'auto' }}>
      <Breadcrumbs items={[{ label: 'Política de Cookies (CMP)' }]} />
      <PageHeader title="Política de Cookies y Tecnologías de Rastreo (CMP)" subtitle="Cumplimiento del Marco TCF v2.2 de IAB Europe, ePrivacy y Estándar GDPR" />
      <p className="last-updated" style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', marginBottom: '25px' }}>
        Última actualización y auditoría de privacidad: Agosto 2026 | Versión 2.4 de Consentimiento Granular
      </p>

      <div className="section-card" style={{ padding: '30px', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-light)', lineHeight: '1.7', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <section>
          <h2 style={{ fontSize: '1.3rem', color: '#10b981', marginTop: 0 }}>1. Definición y Alcance Transparente de las Tecnologías de Memoria Local</h2>
          <p>
            Las "cookies", los objetos de almacenamiento local (Web Storage API / LocalStorage / SessionStorage) y los identificadores de sesión en el navegador son pequeños fragmentos de datos, identificadores únicos y hashes criptográficos que se instalan o leen en su dispositivo cuando interactúa con la plataforma profesional <strong>NMerge IA (StackUpIA Software Labs)</strong>.
          </p>
          <p>
            Esta política le otorga a usted, como usuario u operador técnico, control absoluto y transparente (Granular Consent Management) sobre cómo la plataforma maneja su huella digital. Cumplimos al 100% con la Directiva ePrivacy de la Unión Europea (2002/58/CE modificada por 2009/136/CE), el Reglamento General de Protección de Datos (GDPR 2016/679), el marco IAB Europe Transparency and Consent Framework (TCF v2.2) y las legislaciones estatales de privacidad de EE. UU. (CCPA / CPRA de California).
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.3rem', color: '#10b981' }}>2. Arquitectura Local-First y Almacenamiento Cero-Servidor</h2>
          <p>
            A diferencia de las plataformas SaaS tradicionales que envían el estado completo del usuario a bases de datos en la nube, NMerge IA opera bajo el paradigma <strong>Local-First Privacy by Design</strong>. Los tokens de estado local, las configuraciones de árbol de archivos (.git, .env, schemas de PostgreSQL/Oracle) y los resultados de diferencias mediante el algoritmo Myers LCS permanecen encapsulados en su memoria volátil local.
          </p>
          <p>
            Ningún archivo fuente ingresado mediante la interfaz de arrastrar y soltar (Drag & Drop) se almacena en cookies ni se envía a servidores de almacenamiento remoto. Las cookies que utilizamos están estrictamente dedicadas a garantizar la navegación fluida, la seguridad contra vulnerabilidades de suplantación de identidad (CSRF/XSS) y la monetización publicitaria responsable mediante Google AdSense.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.3rem', color: '#10b981' }}>3. Categorización Estricta de Cookies y Almacenamiento Local</h2>
          <p>Nuestra infraestructura gobernada por Sentinel-NGAC (Next Generation Access Control de NIST) clasifica las cookies y almacenamiento local en tres categorías inflexibles:</p>
          
          <div className="cookie-category" style={{ background: 'var(--bg-tertiary)', padding: '20px', borderRadius: '8px', marginBottom: '15px' }}>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--accent-primary)', marginTop: 0 }}>3.1 Cookies Estrictamente Necesarias y Técnicas</h3>
            <p><strong>Requeridas obligatoriamente para el funcionamiento del sitio. No sujetas a consentimiento previo (Base legal: Ejecución de contrato / Interés legítimo).</strong></p>
            <ul style={{ paddingLeft: '20px' }}>
              <li><strong>nmerge_jwt_token:</strong> Mantiene la sesión cifrada y autenticada mediante firma JWT sin exponer claves privadas.</li>
              <li><strong>nmerge_ngac_policy_cache:</strong> Almacena localmente las reglas de atributos del grafo NGAC para autorizar acceso a vistas avanzadas.</li>
              <li><strong>nmerge_theme_pref / nmerge_lang:</strong> Guarda sus preferencias estéticas (Modo Oscuro / Claro) y el idioma activo de i18n (Español, Inglés, Portugués, Francés, Alemán, Chino, Japonés).</li>
              <li><strong>__Host-csrfToken:</strong> Token antisuplantación para solicitudes de API locales y configuraciones de cuenta.</li>
            </ul>
          </div>

          <div className="cookie-category" style={{ background: 'var(--bg-tertiary)', padding: '20px', borderRadius: '8px', marginBottom: '15px' }}>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--accent-primary)', marginTop: 0 }}>3.2 Cookies Analíticas y de Medición de Rendimiento</h3>
            <p><strong>Consentimiento Requerido. Desactivadas por defecto en la Unión Europea y jurisdicciones protegidas.</strong></p>
            <p>
              Estas cookies nos permiten contabilizar visitas, fuentes de tráfico y latencia de renderizado en el navegador para medir y mejorar el rendimiento de la aplicación. Nos ayudan a saber qué guías técnicas (como PostgreSQL Avanzado o Docker Multi-stage) son las más populares y cómo navegan los usuarios entre los niveles inicial, básico, medio, avanzado y experto.
            </p>
            <p>
              Toda la información recopilada por estas cookies es agregada y completamente anonimizada antes de su procesamiento. La dirección IP del cliente se ofusca aplicando enmascaramiento de subred antes de cualquier almacenamiento analítico.
            </p>
          </div>

          <div className="cookie-category" style={{ background: 'var(--bg-tertiary)', padding: '20px', borderRadius: '8px' }}>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--accent-primary)', marginTop: 0 }}>3.3 Cookies Publicitarias, Google AdSense y Red de Anuncios (IAB TCF v2.2)</h3>
            <p><strong>Consentimiento Explícito e Informado Requerido. Monetización responsable del servicio.</strong></p>
            <p>
              NMerge IA utiliza <strong>Google AdSense</strong> y la red de socios publicitarios certificados de Google para mostrar anuncios dentro del sitio web y financiar la infraestructura gratuita para desarrolladores y estudiantes.
            </p>
            <ul style={{ paddingLeft: '20px' }}>
              <li><strong>Cookie de DoubleClick (Google LLC):</strong> Google utiliza cookies para publicar anuncios en NMerge IA basados en las visitas previas del usuario a nuestro sitio web o a otros sitios de Internet.</li>
              <li><strong>Uso de Datos por Terceros Proveedores:</strong> Los proveedores externos de tecnología publicitaria pueden recopilar información no identificable sobre sus interacciones con los bloques publicitarios.</li>
              <li><strong>Desactivación de Anuncios Personalizados:</strong> Usted puede inhabilitar la publicidad personalizada visitando la <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-secondary)' }}>Configuración de anuncios de Google</a> o el sitio de control independiente <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-secondary)' }}>www.aboutads.info</a>.</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 style={{ fontSize: '1.3rem', color: '#10b981' }}>4. Gestión del Consentimiento (Consent Banner & CMP Control)</h2>
          <p>
            Al ingresar a NMerge IA por primera vez, se le presenta nuestro panel de gestión de consentimiento (Consent Management Platform - CMP). Usted tiene la facultad inalienable de otorgar, rechazar o personalizar sus preferencias de cookies categoría por categoría.
          </p>
          <p>
            Si decide hacer clic en "Rechazar Anuncios Personalizados", NMerge IA aplicará una política de cero tolerancia (*Zero-Tolerance Block*), impidiendo la ejecución de cualquier script de rastreo publicitario y solicitando a Google AdSense la entrega exclusiva de anuncios contextuales no personalizados.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.3rem', color: '#10b981' }}>5. Instrucciones para Configuración y Bloqueo en Navegadores Nativos</h2>
          <p>
            Además de nuestro panel CMP, usted puede restringir, bloquear o eliminar las cookies en cualquier momento ajustando la configuración de su navegador web:
          </p>
          <ul style={{ paddingLeft: '20px' }}>
            <li><strong>Google Chrome / Microsoft Edge:</strong> Configuración &gt; Privacidad y seguridad &gt; Cookies y otros datos de sitios.</li>
            <li><strong>Mozilla Firefox:</strong> Opciones &gt; Privacidad & Seguridad &gt; Cookies y datos del sitio.</li>
            <li><strong>Apple Safari:</strong> Preferencias &gt; Privacidad &gt; Bloquear todas las cookies.</li>
          </ul>
        </section>

        <section>
          <h2 style={{ fontSize: '1.3rem', color: '#10b981' }}>6. Datos de Contacto del Delegado de Protección de Datos (DPO)</h2>
          <p>
            Para cualquier consulta, ejercicio de derechos de privacidad (Acceso, Rectificación, Cancelación, Oposición - ARCO) o aclaración sobre esta política de cookies, póngase en contacto con nuestra oficina de privacidad en <strong>dpo@stackupia.com</strong> o <strong>contacto@nmergeia.com</strong>.
          </p>
        </section>
      </div>
    </div>
  );
};
