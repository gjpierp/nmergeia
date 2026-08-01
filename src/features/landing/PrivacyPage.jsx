import React, { useState } from 'react';
import { useAppStore } from '../../app/useAppStore.js';
import { Logo } from '../../shared/ui/Logo.jsx';

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
            <Logo height="40px" alt="NMerge IA - Logo de Privacidad" />
            <div>
              <h1 style={{ fontSize: '2rem', fontWeight: '800', margin: 0, color: 'var(--text-primary)' }}>
                {lang === 'es' ? 'Política de Privacidad y Protección de Datos (GDPR/CCPA)' : 'Privacy Policy & Data Protection Disclosure'}
              </h1>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>
                {lang === 'es' ? 'Última actualización: Agosto 2026' : 'Last updated: August 2026'}
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
              En <strong>NMerge IA (StackUpIA Labs)</strong>, la privacidad de su código fuente y archivos personales es nuestra prioridad estratégica absoluta. Operamos de manera nativa bajo el estándar <strong>Local-First Privacy by Design</strong>. Esto garantiza que todo el procesamiento de diferencias (Diffing), la normalización sintáctica de archivos estructurados (JSON, XML, YAML) y la resolución del algoritmo Myers LCS ocurre íntegramente dentro de la memoria volátil de su propio navegador web o entorno ejecutable local. Sus archivos y carpetas locales <strong>jamás son transmitidos, almacenados ni copiados en servidores externos o de terceros</strong>.
            </p>

            <h2 style={{ fontSize: '1.3rem', color: '#10b981', marginTop: '25px' }}>2. Marco Normativo de Cumplimiento Global (GDPR, CCPA, LGPD, PIPEDA)</h2>
            <p>
              Esta política cumple con los estándares globales más exigentes:
            </p>
            <ul style={{ paddingLeft: '20px', color: 'var(--text-secondary)' }}>
              <li><strong>GDPR (Reglamento General de Protección de Datos):</strong> Unión Europea y Espacio Económico Europeo.</li>
              <li><strong>CCPA & CPRA (Ley de Privacidad del Consumidor de California):</strong> Estados Unidos.</li>
              <li><strong>LGPD:</strong> Brasil y <strong>PIPEDA:</strong> Canadá.</li>
            </ul>

            <h2 style={{ fontSize: '1.3rem', color: '#10b981', marginTop: '25px' }}>3. Publicidad, Cookies de Terceros y Google AdSense</h2>
            <p>
              NMerge IA utiliza servicios publicitarios provistos por <strong>Google AdSense</strong> y sus socios comerciales para mantener el acceso gratuito a la herramienta en cuentas no-premium. Al utilizar nuestro sitio web, usted acepta el uso de cookies para la personalización y medición de anuncios.
            </p>
            <ul style={{ paddingLeft: '20px', color: 'var(--text-secondary)' }}>
              <li><strong>Cookies de DoubleClick / Google:</strong> Google, como proveedor de terceros, utiliza cookies para publicar anuncios en nuestro sitio. El uso de la cookie de DoubleClick permite a Google y a sus socios mostrar anuncios basados en las visitas anteriores del usuario a NMerge IA o a otros sitios en Internet.</li>
              <li><strong>Desactivación de Publicidad Personalizada:</strong> Los usuarios pueden inhabilitar el uso de la cookie de DoubleClick para la publicidad basada en intereses visitando la <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-secondary)' }}>Configuración de anuncios de Google</a>. Alternativamente, puede inhabilitar el uso de cookies de proveedores terceros para la publicidad basada en intereses visitando <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-secondary)' }}>aboutads.info</a>.</li>
            </ul>

            <h2 style={{ fontSize: '1.3rem', color: '#10b981', marginTop: '25px' }}>4. Integraciones de Inteligencia Artificial Opcionales</h2>
            <p>
              NMerge IA ofrece asistencia opcional de Inteligencia Artificial para la resolución de conflictos complejos. Si el usuario decide utilizar el Asistente de IA Híbrido:
            </p>
            <ul style={{ paddingLeft: '20px', color: 'var(--text-secondary)' }}>
              <li><strong>Proveedor Ollama (Local):</strong> Las consultas se envían a su propia instancia local de Ollama (http://localhost:11434). Ningún dato sale de su computadora.</li>
              <li><strong>Proveedor Gemini Cloud:</strong> Las diferencias seleccionadas se envían cifradas por TLS/HTTPS directamente hacia las APIs de Google Cloud utilizando la API Key personal configurada por el propio usuario. NMerge IA no intercepta ni retiene dichas llaves API en bases de datos centrales.</li>
            </ul>

            <h2 style={{ fontSize: '1.3rem', color: '#10b981', marginTop: '25px' }}>5. Derechos de Privacidad del Usuario (Derechos ARCO)</h2>
            <p>
              De conformidad con GDPR y CCPA, los usuarios tienen derecho a solicitar la portabilidad de sus datos, exigir la supresión completa (Derecho al Olvido) y gestionar sus preferencias de privacidad a través de <strong>dpo@stackupia.com</strong>.
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
              At <strong>NMerge IA (StackUpIA Labs)</strong>, the privacy of your source code and local files is our top strategic priority. We operate strictly under a <strong>Local-First Privacy by Design</strong> architecture. All file diffing and Myers LCS execution take place exclusively inside your local browser memory.
            </p>

            <h2 style={{ fontSize: '1.3rem', color: '#10b981', marginTop: '25px' }}>2. Global Compliance Framework (GDPR, CCPA, LGPD, PIPEDA)</h2>
            <p>
              This policy strictly adheres to global data protection laws including GDPR (EU), CCPA (California), LGPD (Brazil), and PIPEDA (Canada).
            </p>

            <h2 style={{ fontSize: '1.3rem', color: '#10b981', marginTop: '25px' }}>3. Advertising, Third-Party Cookies & Google AdSense</h2>
            <p>
              NMerge IA utilizes advertising services provided by <strong>Google AdSense</strong> to offer free access for non-premium accounts.
            </p>
            <ul style={{ paddingLeft: '20px', color: 'var(--text-secondary)' }}>
              <li><strong>Google DoubleClick Cookies:</strong> Google uses cookies to serve ads based on prior visits.</li>
              <li><strong>Opting Out:</strong> Visit <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-secondary)' }}>Google Ads Settings</a> to manage your preferences.</li>
            </ul>

            <h2 style={{ fontSize: '1.3rem', color: '#10b981', marginTop: '25px' }}>4. Data Protection Officer (DPO)</h2>
            <p>
              Contact our Data Protection Officer at <strong>dpo@stackupia.com</strong> or <strong>contacto@nmergeia.com</strong>.
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
