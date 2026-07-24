import React from 'react';
import { useAppStore } from '../../app/useAppStore.js';
import logo from '../../assets/logo.png';

export const PrivacyPage = () => {
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
            Política de Privacidad
          </h1>
        </div>

        <div className="section-card" style={{ padding: '30px', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-light)', lineHeight: '1.6' }}>
          <h2 style={{ fontSize: '1.3rem', color: '#10b981', marginTop: 0 }}>1. Filosofía Local-First (Privacidad por Diseño)</h2>
          <p>
            En NMergeIA, la privacidad de su código fuente es nuestra prioridad absoluta. Operamos bajo un paradigma <strong>Local-First</strong>. Esto significa que todo el análisis de diferencias, normalización de archivos JSON/YAML/XML y fusionado Myers LCS se realiza en su propio navegador web local. Sus archivos y código jamás se transmiten a nuestros servidores.
          </p>

          <h2 style={{ fontSize: '1.3rem', color: '#10b981', marginTop: '25px' }}>2. Integraciones de Inteligencia Artificial</h2>
          <p>
            Si decide utilizar el Asistente de IA Híbrido, el código de las diferencias detectadas se enviará únicamente al proveedor que usted configure (Ollama local o Gemini Cloud). En el caso de Gemini Cloud, la transmisión se realiza mediante HTTPS cifrado directamente hacia las APIs oficiales de Google Cloud utilizando la API Key provista por usted.
          </p>

          <h2 style={{ fontSize: '1.3rem', color: '#10b981', marginTop: '25px' }}>3. Publicidad y AdSense</h2>
          <p>
            NMergeIA utiliza servicios publicitarios provistos por Google AdSense para la monetización del rol no-premium. Google AdSense utiliza cookies para mostrar anuncios relevantes basados en sus visitas anteriores. Puede desactivar la publicidad personalizada visitando la configuración de anuncios de Google.
          </p>

          <h2 style={{ fontSize: '1.3rem', color: '#10b981', marginTop: '25px' }}>4. Almacenamiento Local</h2>
          <p>
            Utilizamos almacenamiento local persistente (LocalStorage e IndexedDB) exclusivamente para guardar sus perfiles de configuración y el historial de comparaciones de forma aislada para su comodidad. Estos datos no son compartidos ni transmitidos a ningún servicio externo.
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
