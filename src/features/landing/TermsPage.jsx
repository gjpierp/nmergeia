import React from 'react';
import { useAppStore } from '../../app/useAppStore.js';
import logo from '../../assets/logo.png';

export const TermsPage = () => {
  const { setActiveTab } = useAppStore();

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
      <div style={{ maxWidth: '800px', width: '100%', margin: '0 auto', textAlign: 'left' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px', borderBottom: '1px solid var(--border-light)', paddingBottom: '15px' }}>
          <img src={logo} alt="Logo" style={{ height: '40px' }} />
          <h1 style={{ fontSize: '2rem', fontWeight: '800', margin: 0, color: 'var(--text-primary)' }}>
            Términos y Condiciones
          </h1>
        </div>

        <div className="section-card" style={{ padding: '30px', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-light)', lineHeight: '1.6' }}>
          <h2 style={{ fontSize: '1.3rem', color: '#10b981', marginTop: 0 }}>1. Aceptación de los Términos</h2>
          <p>
            Al acceder o utilizar NMergeIA, usted acepta estar sujeto a estos términos de servicio. Si no está de acuerdo con alguna de las cláusulas aquí especificadas, se le prohíbe el uso o acceso a esta herramienta web.
          </p>

          <h2 style={{ fontSize: '1.3rem', color: '#10b981', marginTop: '25px' }}>2. Licencia de Uso</h2>
          <p>
            Se otorga permiso para cargar temporalmente una copia de los materiales en NMergeIA para uso personal o comercial de desarrollo. Esta es la concesión de una licencia, no una transferencia de título, y bajo esta licencia usted no puede modificar de forma maliciosa el motor de control de accesos Sentinel-NGAC para eludir anuncios sin contar con el rol premium correspondiente.
          </p>

          <h2 style={{ fontSize: '1.3rem', color: '#10b981', marginTop: '25px' }}>3. Limitación de Responsabilidad</h2>
          <p>
            NMergeIA se proporciona "tal cual". No ofrecemos garantías, explícitas o implícitas, y por la presente renunciamos y negamos todas las demás garantías, incluyendo, sin limitación, las garantías implícitas o condiciones de comerciabilidad, idoneidad para un propósito particular o no infracción de propiedad intelectual.
          </p>

          <h2 style={{ fontSize: '1.3rem', color: '#10b981', marginTop: '25px' }}>4. Modificaciones del Servicio</h2>
          <p>
            NMergeIA puede revisar estos términos de servicio para su aplicación web en cualquier momento sin previo aviso. Al utilizar este sitio web, usted acepta estar sujeto a la versión actual de estos términos de servicio.
          </p>

          <div style={{ marginTop: '40px', display: 'flex', gap: '15px' }}>
            <button className="btn primary-btn" onClick={() => setActiveTab('landing')}>
              <span className="material-symbols-rounded" style={{ marginRight: '8px' }}>arrow_back</span>
              Volver al Inicio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
