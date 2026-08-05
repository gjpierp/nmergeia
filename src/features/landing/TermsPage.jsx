import React from 'react';
import { useAppStore } from '../../app/useAppStore.js';
import { useTranslation } from 'react-i18next';
import { Logo } from '../../shared/ui/Logo.jsx';
import { Breadcrumbs } from '../../shared/ui/Breadcrumbs.jsx';

export const TermsPage = () => {
  const { setActiveTab } = useAppStore();
  const { i18n } = useTranslation();
  const isEn = i18n?.language?.startsWith('en');

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      height: '100%',
      padding: '0px 20px 80px 20px',
      background: 'radial-gradient(circle at top, var(--bg-tertiary) 0%, var(--bg-primary) 70%)',
      color: 'var(--text-primary)',
      fontFamily: '"Outfit", sans-serif',
      overflowY: 'auto',
      boxSizing: 'border-box'
    }}>
      <div style={{ width: '100%', textAlign: 'left' }}>
        <Breadcrumbs items={[{ label: 'Términos y Condiciones', path: '/terms' }]} />
        
        <PageHeader 
          icon="gavel"
          title={isEn ? 'Terms and Conditions of Service' : 'Términos y Condiciones de Uso'} 
          subtitle={isEn ? 'Last revised: August 2026' : 'Última revisión: Agosto 2026'} 
        />

        {!isEn ? (
          <div className="section-card" style={{ padding: '35px', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-light)', lineHeight: '1.7' }}>
            <h2 style={{ fontSize: '1.3rem', color: '#10b981', marginTop: 0 }}>1. Aceptación de las Condiciones de Servicio</h2>
            <p>
              Al acceder, navegar o utilizar la aplicación web o de escritorio <strong>NMerge IA</strong> (desarrollada por <strong>StackUpIA Software Labs S.A.</strong>), usted expresa su acuerdo formal vinculante con los presentes Términos y Condiciones de Uso. Si no está de acuerdo con alguna cláusula o disposición contenida en este documento, debe abstenerse de utilizar el servicio de forma inmediata.
            </p>

            <h2 style={{ fontSize: '1.3rem', color: '#10b981', marginTop: '25px' }}>2. Concesión de Licencia y Niveles de Uso</h2>
            <p>
              NMerge IA otorga al usuario una licencia revocable, no exclusiva, no transferible y limitada para operar el software con fines personales, profesionales o comerciales, sujeta a los siguientes niveles gobernados por el sistema de control de accesos Sentinel-NGAC:
            </p>
            <ul style={{ paddingLeft: '20px', color: 'var(--text-secondary)' }}>
              <li><strong>Nivel Gratuito / No-Premium:</strong> Permite el uso de las funciones principales de comparación de carpetas y edición de diferencias local. El acceso es financiado mediante la exhibición no intrusiva de anuncios de Google AdSense. Queda prohibida la alteración maliciosa del código o scripts para bloquear anuncios sin contar con suscripción Pro.</li>
              <li><strong>Nivel Pro / Suscripción Premium:</strong> Otorga una experiencia 100% libre de anuncios, soporte prioritario y acceso ilimitado a funciones avanzadas de la matriz de comparación y resolución por IA. La licencia se verifica de forma segura mediante Stripe y claves activas encriptadas.</li>
            </ul>

            <h2 style={{ fontSize: '1.3rem', color: '#10b981', marginTop: '25px' }}>3. Uso Aceptable y Restricciones de Seguridad</h2>
            <p>
              El usuario se compromete a hacer un uso legítimo del software y a no incurrir en actividades prohibidas, incluyendo sin limitación:
            </p>
            <ul style={{ paddingLeft: '20px', color: 'var(--text-secondary)' }}>
              <li>Intentar descompilar, realizar ingeniería inversa o eludir los mecanismos de seguridad y licenciamiento de Sentinel-NGAC.</li>
              <li>Utilizar NMerge IA para procesar o distribuir malware, material ilegal o contenido que viole derechos de autor o propiedad intelectual de terceros.</li>
              <li>Automatizar la realización de consultas masivas (scraping o botnets) contra los endpoints o infraestructura del servidor sin autorización.</li>
            </ul>

            <h2 style={{ fontSize: '1.3rem', color: '#10b981', marginTop: '25px' }}>4. Propiedad Intelectual</h2>
            <p>
              El código fuente, los diseños de interfaz visual, la marca comercial "NMerge IA", los logotipos, la documentación y los algoritmos originales son propiedad exclusiva de StackUpIA Software Labs S.A. o de sus respetivos licenciantes. Todos los derechos no concedidos expresamente en este contrato están reservados.
            </p>

            <h2 style={{ fontSize: '1.3rem', color: '#10b981', marginTop: '25px' }}>5. Limitación de Responsabilidad y Exención de Garantías</h2>
            <p>
              NMerge IA se proporciona "tal cual" y "según disponibilidad", sin garantías de ningún tipo, explícitas o implícitas. StackUpIA Software Labs no garantiza que la aplicación esté libre de errores ininterrumpidos o que las funciones de sincronización de archivos eviten pérdidas derivadas de fallos en el sistema operativo del usuario. Es responsabilidad exclusiva del usuario mantener copias de seguridad de sus archivos locales antes de confirmar operaciones destructivas de fusión o sobreescritura.
            </p>

            <h2 style={{ fontSize: '1.3rem', color: '#10b981', marginTop: '25px' }}>6. Ley Aplicable y Jurisdicción</h2>
            <p>
              Estos términos se regirán e interpretarán de acuerdo con las leyes vigentes del país de operación de StackUpIA Labs. Cualquier controversia será sometida a los tribunales competentes de dicha jurisdicción.
            </p>

            <div style={{ marginTop: '40px', display: 'flex', gap: '15px' }}>
              <button className="btn primary-btn" onClick={() => setActiveTab('landing')}>
                <span className="material-symbols-rounded" style={{ marginRight: '8px' }}>arrow_back</span>
                Volver al Inicio
              </button>
              <button className="btn secondary-btn" onClick={() => setActiveTab('privacy')}>
                Política de Privacidad
              </button>
              <button className="btn secondary-btn" onClick={() => setActiveTab('about')}>
                Sobre Nosotros (EEAT)
              </button>
            </div>
          </div>
        ) : (
          <div className="section-card" style={{ padding: '35px', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-light)', lineHeight: '1.7' }}>
            <h2 style={{ fontSize: '1.3rem', color: '#10b981', marginTop: 0 }}>1. Acceptance of Terms of Service</h2>
            <p>
              By accessing, browsing, or utilizing the <strong>NMerge IA</strong> web or desktop application (developed by <strong>StackUpIA Software Labs S.A.</strong>), you signify your explicit agreement to be bound by these Terms and Conditions of Service.
            </p>

            <h2 style={{ fontSize: '1.3rem', color: '#10b981', marginTop: '25px' }}>2. License Grant & Usage Tiers</h2>
            <p>
              NMerge IA grants the user a revocable, non-exclusive, non-transferable, limited license to operate the software for personal, educational, or commercial software engineering purposes, subject to Sentinel-NGAC governance.
            </p>

            <h2 style={{ fontSize: '1.3rem', color: '#10b981', marginTop: '25px' }}>3. Intellectual Property Rights</h2>
            <p>
              All source code, user interface designs, the "NMerge IA" trademark, logos, documentation, and original algorithms are the exclusive property of StackUpIA Software Labs S.A. or its licensors.
            </p>

            <h2 style={{ fontSize: '1.3rem', color: '#10b981', marginTop: '25px' }}>4. Governing Law</h2>
            <p>
              These terms shall be governed by and construed in accordance with the applicable laws of StackUpIA Labs.
            </p>

            <div style={{ marginTop: '40px', display: 'flex', gap: '15px' }}>
              <button className="btn primary-btn" onClick={() => setActiveTab('landing')}>
                <span className="material-symbols-rounded" style={{ marginRight: '8px' }}>arrow_back</span>
                Back to Home
              </button>
              <button className="btn secondary-btn" onClick={() => setActiveTab('privacy')}>
                Privacy Policy
              </button>
              <button className="btn secondary-btn" onClick={() => setActiveTab('about')}>
                About Us (EEAT)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
