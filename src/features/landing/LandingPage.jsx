import React from 'react';
import { useAppStore } from '../../app/useAppStore.js';
import { useMonetizationStore } from '../monetization/MonetizationStore.js';

export const LandingPage = () => {
  const { setActiveTab } = useAppStore();
  const { isPremium, licenseKey } = useMonetizationStore();

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '80vh',
      padding: '40px 20px',
      textAlign: 'center',
      background: 'radial-gradient(circle at top, var(--bg-tertiary) 0%, var(--bg-primary) 70%)',
      color: 'var(--text-primary)',
      fontFamily: '"Outfit", sans-serif',
      overflowY: 'auto'
    }}>
      {/* Hero Section */}
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(245, 158, 11, 0.1)',
          border: '1px solid rgba(245, 158, 11, 0.2)',
          padding: '6px 14px',
          borderRadius: '50px',
          fontSize: '0.8rem',
          fontWeight: '500',
          color: '#f59e0b',
          marginBottom: '20px'
        }}>
          <span className="material-symbols-rounded" style={{ fontSize: '0.95rem' }}>star</span>
          NMerge v1.2.0 - Comparador Inteligente de Carpetas
        </div>

        <h1 style={{
          fontSize: '3rem',
          fontWeight: '800',
          lineHeight: '1.15',
          margin: '0 0 20px 0',
          letterSpacing: '-0.03em',
          background: 'linear-gradient(135deg, var(--text-primary) 30%, var(--accent-secondary) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Compara carpetas y resuelve conflictos a velocidad luz
        </h1>

        <p style={{
          fontSize: '1.1rem',
          color: 'var(--text-secondary)',
          lineHeight: '1.6',
          maxWidth: '600px',
          margin: '0 auto 40px auto'
        }}>
          Una herramienta local-first ultra-rápida equipada con copilot de IA para conflictos, sincronización de filtros y normalizadores de código de alta densidad visual.
        </p>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginBottom: '60px' }}>
          <button 
            className="btn primary-btn"
            onClick={() => setActiveTab('main')}
            style={{
              height: '46px',
              padding: '0 28px',
              fontSize: '0.95rem',
              fontWeight: '600',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px var(--accent-primary-glow)'
            }}
          >
            <span className="material-symbols-rounded">folder_open</span>
            Iniciar Comparador
          </button>
          
          <button 
            className="btn secondary-btn"
            onClick={() => setActiveTab('register')}
            style={{
              height: '46px',
              padding: '0 28px',
              fontSize: '0.95rem',
              fontWeight: '600',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span className="material-symbols-rounded">vpn_key</span>
            {isPremium ? 'Ver Licencia' : 'Registrarse / Pasar a PRO'}
          </button>
        </div>
      </div>

      {/* Features Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '20px',
        maxWidth: '1000px',
        width: '100%',
        margin: '0 auto'
      }}>
        <div style={cardStyle}>
          <span className="material-symbols-rounded" style={{ ...iconStyle, color: '#f59e0b' }}>bolt</span>
          <h3 style={cardTitleStyle}> Myers LCS Ultra-Rápido</h3>
          <p style={cardDescStyle}>Comparación rápida de diferencias a través de Web Workers en hilos independientes sin congelar la UI.</p>
        </div>

        <div style={cardStyle}>
          <span className="material-symbols-rounded" style={{ ...iconStyle, color: '#a78bfa' }}>smart_toy</span>
          <h3 style={cardTitleStyle}>Copiloto de IA Híbrido</h3>
          <p style={cardDescStyle}>Resuelve conflictos de código en 1 clic utilizando modelos locales con Ollama o modelos rápidos de Gemini Cloud.</p>
        </div>

        <div style={cardStyle}>
          <span className="material-symbols-rounded" style={{ ...iconStyle, color: '#3b82f6' }}>settings_ethernet</span>
          <h3 style={cardTitleStyle}>Normalizadores Semánticos</h3>
          <p style={cardDescStyle}>Elimina ruido en JSON, YAML, XML y código ignorando espacios, indentaciones y saltos de línea.</p>
        </div>
      </div>

      {/* Pricing / Sales Section */}
      <div style={{ marginTop: '70px', maxWidth: '1000px', width: '100%', margin: '70px auto 0 auto' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '10px' }}>Planes de Licencia Transparentes</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '40px' }}>Compara localmente gratis o desbloquea funciones inteligentes para acelerar tu desarrollo.</p>

        <div style={{
          display: 'flex',
          gap: '30px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          {/* Free Plan */}
          <div style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            padding: '35px',
            flex: 1,
            minWidth: '280px',
            maxWidth: '350px',
            textAlign: 'left',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-primary)', margin: '0 0 10px 0' }}>Plan Free</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0 0 20px 0' }}>Comparación tradicional de archivos y directorios en local.</p>
              <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '25px' }}>$0 <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 'normal' }}>/ gratis</span></div>
              
              <ul style={{ padding: 0, margin: '0 0 30px 0', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span className="material-symbols-rounded" style={{ color: '#10b981', fontSize: '1.1rem' }}>check</span> Comparación de carpetas local</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span className="material-symbols-rounded" style={{ color: '#10b981', fontSize: '1.1rem' }}>check</span> Algoritmo Myers LCS tradicional</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span className="material-symbols-rounded" style={{ color: '#10b981', fontSize: '1.1rem' }}>check</span> Vista de diferencias lado a lado</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', textDecoration: 'line-through' }}><span className="material-symbols-rounded" style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>close</span> Normalizadores inteligentes (JSON/YAML/XML)</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', textDecoration: 'line-through' }}><span className="material-symbols-rounded" style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>close</span> Copiloto de IA local para conflictos</li>
              </ul>
            </div>
            
            <button 
              className="btn secondary-btn" 
              onClick={() => setActiveTab('main')}
              style={{ width: '100%', height: '40px', fontWeight: '600' }}
            >
              Comenzar Gratis
            </button>
          </div>

          {/* Pro Plan */}
          <div style={{
            background: 'linear-gradient(145deg, var(--bg-secondary) 0%, rgba(245,158,11,0.05) 100%)',
            border: '2px solid #f59e0b',
            borderRadius: '16px',
            padding: '35px',
            flex: 1,
            minWidth: '280px',
            maxWidth: '350px',
            textAlign: 'left',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 8px 30px rgba(245,158,11,0.08)'
          }}>
            <div style={{
              position: 'absolute',
              top: '-15px',
              right: '20px',
              background: '#f59e0b',
              color: '#000',
              fontWeight: 'bold',
              fontSize: '0.75rem',
              padding: '4px 12px',
              borderRadius: '20px',
              textTransform: 'uppercase'
            }}>Recomendado</div>

            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-primary)', margin: '0 0 10px 0' }}>Plan Pro</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0 0 20px 0' }}>Soporte de IA y herramientas premium avanzadas de fusión.</p>
              <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '25px' }}>$19 <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 'normal' }}>/ licencia vitalicia</span></div>
              
              <ul style={{ padding: 0, margin: '0 0 30px 0', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span className="material-symbols-rounded" style={{ color: '#f59e0b', fontSize: '1.1rem' }}>check</span> Todo lo del plan Free</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span className="material-symbols-rounded" style={{ color: '#f59e0b', fontSize: '1.1rem' }}>check</span> Normalizadores avanzados JSON, YAML, XML</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span className="material-symbols-rounded" style={{ color: '#f59e0b', fontSize: '1.1rem' }}>check</span> Copiloto de IA Híbrido (Ollama y Gemini)</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span className="material-symbols-rounded" style={{ color: '#f59e0b', fontSize: '1.1rem' }}>check</span> Sincronización en caliente y filtros de exclusión</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span className="material-symbols-rounded" style={{ color: '#f59e0b', fontSize: '1.1rem' }}>check</span> Soporte prioritario permanente</li>
              </ul>
            </div>
            
            <button 
              className="btn primary-btn" 
              onClick={() => setActiveTab('register')}
              style={{ width: '100%', height: '40px', fontWeight: '600', background: '#f59e0b', border: '1px solid #f59e0b', color: '#000' }}
            >
              Adquirir Licencia PRO
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const cardStyle = {
  background: 'var(--bg-secondary)',
  border: '1px solid var(--border-color)',
  borderRadius: '12px',
  padding: '25px',
  textAlign: 'left',
  transition: 'transform 0.2s, box-shadow 0.2s',
  display: 'flex',
  flexDirection: 'column',
  gap: '10px'
};

const cardTitleStyle = {
  fontSize: '1rem',
  fontWeight: '700',
  margin: 0,
  color: 'var(--text-primary)'
};

const cardDescStyle = {
  fontSize: '0.85rem',
  color: 'var(--text-secondary)',
  lineHeight: '1.5',
  margin: 0
};

const iconStyle = {
  fontSize: '2rem',
  marginBottom: '5px'
};
