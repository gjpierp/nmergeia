import React, { useState } from 'react';
import { useAppStore } from '../../app/useAppStore.js';
import logo from '../../assets/logo.png';

export const PrivacyPage = () => {
  const { setActiveTab } = useAppStore();
  const [lang, setLang] = useState('es');

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      height: '100%',
      padding: '40px 20px',
      background: 'radial-gradient(circle at top, var(--bg-tertiary) 0%, var(--bg-primary) 70%)',
      color: 'var(--text-primary)',
      fontFamily: '"Outfit", sans-serif',
      overflowY: 'auto',
      boxSizing: 'border-box'
    }}>
      <div style={{ maxWidth: '900px', width: '100%', margin: '0 auto', textAlign: 'left' }}>
        
        {/* Header & Language Selector */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px', borderBottom: '1px solid var(--border-light)', paddingBottom: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <img src={logo} alt="Logo" style={{ height: '40px' }} />
            <div>
              <h1 style={{ fontSize: '2rem', fontWeight: '800', margin: 0, color: 'var(--text-primary)' }}>
                {lang === 'es' ? 'Política de Privacidad y Cookies' : 'Privacy Policy & Cookies Disclosure'}
              </h1>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>
                {lang === 'es' ? 'Última actualización: 31 de julio de 2026' : 'Last updated: July 31, 2026'}
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              className={`btn ${lang === 'es' ? 'primary-btn' : 'secondary-btn'}`} 
              onClick={() => setLang('es')}
              style={{ fontSize: '0.8rem', padding: '6px 12px' }}
            >
              Español
            </button>
            <button 
              className={`btn ${lang === 'en' ? 'primary-btn' : 'secondary-btn'}`} 
              onClick={() => setLang('en')}
              style={{ fontSize: '0.8rem', padding: '6px 12px' }}
            >
              English
            </button>
          </div>
        </div>

        {lang === 'es' ? (
          <div className="section-card" style={{ padding: '35px', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-light)', lineHeight: '1.7' }}>
            <h2 style={{ fontSize: '1.3rem', color: '#10b981', marginTop: 0 }}>1. Filosofía Local-First (Privacidad por Diseño)</h2>
            <p>
              En <strong>NMerge IA</strong>, la privacidad de su código fuente y archivos personales es nuestra prioridad estratégica absoluta. Operamos de manera nativa bajo el estándar <strong>Local-First Privacy by Design</strong>. Esto garantiza que todo el procesamiento de diferencias (Diffing), la normalización sintáctica de archivos estructurados (JSON, XML, YAML) y la resolución del algoritmo Myers LCS ocurre íntegramente dentro de la memoria volátil de su propio navegador web o entorno ejecutable local. Sus archivos y carpetas locales <strong>jamás son transmitidos, almacenados ni copiados en servidores externos o de terceros</strong>.
            </p>

            <h2 style={{ fontSize: '1.3rem', color: '#10b981', marginTop: '25px' }}>2. Publicidad, Cookies de Terceros y Google AdSense</h2>
            <p>
              NMerge IA utiliza servicios publicitarios provistos por <strong>Google AdSense</strong> y sus socios comerciales para mantener el acceso gratuito a la herramienta en cuentas no-premium. Al utilizar nuestro sitio web, usted acepta el uso de cookies para la personalización y medición de anuncios.
            </p>
            <ul style={{ paddingLeft: '20px', color: 'var(--text-secondary)' }}>
              <li><strong>Cookies de DoubleClick / Google:</strong> Google, como proveedor de terceros, utiliza cookies para publicar anuncios en nuestro sitio. El uso de la cookie de DoubleClick permite a Google y a sus socios mostrar anuncios basados en las visitas anteriores del usuario a NMerge IA o a otros sitios en Internet.</li>
              <li><strong>Desactivación de Publicidad Personalizada:</strong> Los usuarios pueden inhabilitar el uso de la cookie de DoubleClick para la publicidad basada en intereses visitando la <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-secondary)' }}>Configuración de anuncios de Google</a>. Alternativamente, puede inhabilitar el uso de cookies de proveedores terceros para la publicidad basada en intereses visitando <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-secondary)' }}>aboutads.info</a>.</li>
            </ul>

            <h2 style={{ fontSize: '1.3rem', color: '#10b981', marginTop: '25px' }}>3. Integraciones de Inteligencia Artificial Opcionales</h2>
            <p>
              NMerge IA ofrece asistencia opcional de Inteligencia Artificial para la resolución de conflictos complejos. Si el usuario decide utilizar el Asistente de IA Híbrido:
            </p>
            <ul style={{ paddingLeft: '20px', color: 'var(--text-secondary)' }}>
              <li><strong>Proveedor Ollama (Local):</strong> Las consultas se envían a su propia instancia local de Ollama (http://localhost:11434). Ningún dato sale de su computadora.</li>
              <li><strong>Proveedor Gemini Cloud:</strong> Las diferencias seleccionadas se envían cifradas por TLS/HTTPS directamente hacia las APIs de Google Cloud utilizando la API Key personal configurada por el propio usuario. NMerge IA no intercepta ni retiene dichas llaves API en bases de datos centrales.</li>
            </ul>

            <h2 style={{ fontSize: '1.3rem', color: '#10b981', marginTop: '25px' }}>4. Almacenamiento Local (LocalStorage e IndexedDB)</h2>
            <p>
              Utilizamos tecnologías de almacenamiento local persistente (LocalStorage, SessionStorage e IndexedDB) exclusivamente para:
            </p>
            <ul style={{ paddingLeft: '20px', color: 'var(--text-secondary)' }}>
              <li>Recordar sus preferencias de interfaz (Idioma activo, Tema Claro/Oscuro).</li>
              <li>Almacenar sus perfiles guardados de comparación de carpetas y reglas personalizadas de <code>filtro.txt</code>.</li>
              <li>Mantener el estado de licencias activas autenticadas localmente.</li>
            </ul>
            <p>Estos datos permanecen 100% aislados en su dispositivo y pueden ser eliminados en cualquier momento limpiando el caché del navegador.</p>

            <h2 style={{ fontSize: '1.3rem', color: '#10b981', marginTop: '25px' }}>5. Derechos de Privacidad del Usuario (GDPR & CCPA)</h2>
            <p>
              De conformidad con el Reglamento General de Protección de Datos (GDPR) y la Ley de Privacidad del Consumidor de California (CCPA), los usuarios de NMerge IA tienen derecho a solicitar información sobre el tratamiento de sus datos, exigir la no comercialización de su información personal y gestionar el consentimiento de rastreo publicitario mediante el panel de privacidad de su navegador.
            </p>

            <h2 style={{ fontSize: '1.3rem', color: '#10b981', marginTop: '25px' }}>6. Contacto del Oficial de Protección de Datos</h2>
            <p>
              Si tiene preguntas, inquietudes o solicitudes sobre esta Política de Privacidad, puede ponerse en contacto con nuestro equipo oficial escribiendo a <strong>contacto@nmergeia.com</strong> o <strong>soporte@nmergeia.com</strong>.
            </p>

            <div style={{ marginTop: '40px', display: 'flex', gap: '15px' }}>
              <button className="btn primary-btn" onClick={() => setActiveTab('landing')}>
                <span className="material-symbols-rounded" style={{ marginRight: '8px' }}>arrow_back</span>
                Volver al Inicio
              </button>
              <button className="btn secondary-btn" onClick={() => setActiveTab('terms')}>
                Términos y Condiciones
              </button>
              <button className="btn secondary-btn" onClick={() => setActiveTab('contact')}>
                Contacto
              </button>
            </div>
          </div>
        ) : (
          <div className="section-card" style={{ padding: '35px', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-light)', lineHeight: '1.7' }}>
            <h2 style={{ fontSize: '1.3rem', color: '#10b981', marginTop: 0 }}>1. Local-First Philosophy (Privacy by Design)</h2>
            <p>
              At <strong>NMerge IA</strong>, the privacy of your source code and local files is our top priority. We operate strictly under a <strong>Local-First Privacy by Design</strong> architecture. This guarantees that all file diffing, syntax normalization for structured files (JSON, XML, YAML), and Myers LCS algorithm execution take place exclusively inside your local browser volatile memory or local executable environment. Your local files and folders <strong>are never transmitted, stored, or copied to remote or third-party servers</strong>.
            </p>

            <h2 style={{ fontSize: '1.3rem', color: '#10b981', marginTop: '25px' }}>2. Advertising, Third-Party Cookies & Google AdSense</h2>
            <p>
              NMerge IA utilizes advertising services provided by <strong>Google AdSense</strong> and its vendor network to offer free access for non-premium accounts. By using our website, you consent to the use of cookies for ad personalization and analytics measurement.
            </p>
            <ul style={{ paddingLeft: '20px', color: 'var(--text-secondary)' }}>
              <li><strong>Google DoubleClick Cookies:</strong> Google, as a third-party vendor, uses cookies to serve ads on our site. Google's use of the DoubleClick cookie enables it and its partners to serve ads based on users' visits to NMerge IA and/or other sites on the Internet.</li>
              <li><strong>Opting Out of Personalized Advertising:</strong> Users may opt out of personalized advertising by visiting <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-secondary)' }}>Google Ads Settings</a>. Alternatively, users can opt out of a third-party vendor's use of cookies for personalized advertising by visiting <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-secondary)' }}>aboutads.info</a>.</li>
            </ul>

            <h2 style={{ fontSize: '1.3rem', color: '#10b981', marginTop: '25px' }}>3. Optional Artificial Intelligence Integrations</h2>
            <p>
              NMerge IA provides optional AI assistance for resolving complex code merge conflicts. If you choose to enable the Hybrid AI Assistant:
            </p>
            <ul style={{ paddingLeft: '20px', color: 'var(--text-secondary)' }}>
              <li><strong>Ollama Provider (Local):</strong> Queries are dispatched directly to your local Ollama instance (http://localhost:11434). No code leaves your machine.</li>
              <li><strong>Gemini Cloud Provider:</strong> Selected code diffs are transmitted via TLS/HTTPS encrypted connections directly to official Google Cloud APIs using your personal API key. NMerge IA never intercepts or logs your API keys on central servers.</li>
            </ul>

            <h2 style={{ fontSize: '1.3rem', color: '#10b981', marginTop: '25px' }}>4. Local Storage Usage (LocalStorage & IndexedDB)</h2>
            <p>
              We use client-side persistent storage mechanisms (LocalStorage, SessionStorage, IndexedDB) solely to:
            </p>
            <ul style={{ paddingLeft: '20px', color: 'var(--text-secondary)' }}>
              <li>Remember your UI preferences (Active Language, Dark/Light Theme).</li>
              <li>Store your saved folder comparison profiles and custom <code>filtro.txt</code> rules locally.</li>
              <li>Maintain your authenticated license state locally.</li>
            </ul>

            <h2 style={{ fontSize: '1.3rem', color: '#10b981', marginTop: '25px' }}>5. User Rights (GDPR & CCPA Compliance)</h2>
            <p>
              Under the General Data Protection Regulation (GDPR) and the California Consumer Privacy Act (CCPA), users have the right to inspect data processing policies, demand non-sale of personal data, and manage cookie preferences through their browser privacy control center.
            </p>

            <h2 style={{ fontSize: '1.3rem', color: '#10b981', marginTop: '25px' }}>6. Contacting our Data Protection Officer</h2>
            <p>
              If you have any questions or concerns regarding this Privacy Policy, feel free to contact our official team at <strong>contacto@nmergeia.com</strong> or <strong>soporte@nmergeia.com</strong>.
            </p>

            <div style={{ marginTop: '40px', display: 'flex', gap: '15px' }}>
              <button className="btn primary-btn" onClick={() => setActiveTab('landing')}>
                <span className="material-symbols-rounded" style={{ marginRight: '8px' }}>arrow_back</span>
                Back to Home
              </button>
              <button className="btn secondary-btn" onClick={() => setActiveTab('terms')}>
                Terms & Conditions
              </button>
              <button className="btn secondary-btn" onClick={() => setActiveTab('contact')}>
                Contact
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
