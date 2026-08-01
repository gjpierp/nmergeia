import React from 'react';
import { useAppStore } from '../../app/useAppStore.js';
import { PageHeader } from '../../shared/ui/PageHeader.jsx';
import { Breadcrumbs } from '../../shared/ui/Breadcrumbs.jsx';

export const PricingPage = () => {
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
      <div style={{ maxWidth: '1000px', width: '100%', margin: '0 auto', textAlign: 'left' }}>
        <Breadcrumbs items={[{ label: 'Planes y Precios' }]} />
        <PageHeader title="Planes y Precios" />
        <p style={{ color: 'var(--text-secondary)', marginBottom: '40px', fontSize: '1rem', maxWidth: '600px', margin: '0 auto 40px auto' }}>
          Elige el plan ideal para optimizar tu flujo de trabajo. Todas las comparaciones se ejecutan 100% de forma local en tu máquina.
        </p>

        {/* Pricing Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '30px',
          marginBottom: '40px'
        }}>
          {/* Plan Gratis */}
          <div className="section-card" style={{
            padding: '30px',
            background: 'var(--bg-secondary)',
            borderRadius: '12px',
            border: '1px solid var(--border-light)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative'
          }}>
            <h3 style={{ fontSize: '1.2rem', margin: '0 0 10px 0', color: 'var(--text-primary)' }}>Gratuito (Invitado)</h3>
            <div style={{ fontSize: '2rem', fontWeight: '800', margin: '10px 0', color: '#10b981' }}>$0 <span style={{ fontSize: '0.9rem', fontWeight: 'normal', color: 'var(--text-secondary)' }}>/ siempre</span></div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', minHeight: '40px', textAlign: 'center' }}>Comparación local básica de archivos y carpetas con banners de soporte publicitario.</p>
            <ul style={{ width: '100%', padding: '20px 0', borderTop: '1px solid var(--border-light)', borderBottom: '1px solid var(--border-light)', listStyle: 'none', margin: '20px 0', fontSize: '0.82rem', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span className="material-symbols-rounded" style={{ color: '#10b981', fontSize: '1.1rem' }}>check_circle</span> Myers LCS Diff Engine</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span className="material-symbols-rounded" style={{ color: '#10b981', fontSize: '1.1rem' }}>check_circle</span> Normalizadores de JSON/YAML</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span className="material-symbols-rounded" style={{ color: '#ef4444', fontSize: '1.1rem' }}>cancel</span> Sin Asistente de IA</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span className="material-symbols-rounded" style={{ color: '#ef4444', fontSize: '1.1rem' }}>cancel</span> Contiene Anuncios Publicitarios</li>
            </ul>
            <button className="premium-btn-secondary" style={{ width: '100%', height: '40px' }} onClick={() => setActiveTab('main')}>Comenzar Gratis</button>
          </div>

          {/* Plan Premium */}
          <div className="section-card" style={{
            padding: '30px',
            background: 'rgba(16, 185, 129, 0.03)',
            borderRadius: '12px',
            border: '2px solid #10b981',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
            boxShadow: '0 8px 24px rgba(16, 185, 129, 0.1)'
          }}>
            <div className="premium-badge" style={{ position: 'absolute', top: '-12px', background: 'var(--accent-secondary)', color: '#ffffff', border: 'none' }}>RECOMENDADO</div>
            <h3 style={{ fontSize: '1.2rem', margin: '0 0 10px 0', color: 'var(--text-primary)' }}>Registrado Premium</h3>
            <div style={{ fontSize: '2rem', fontWeight: '800', margin: '10px 0', color: '#10b981' }}>$19 <span style={{ fontSize: '0.9rem', fontWeight: 'normal', color: 'var(--text-secondary)' }}>/ pago único</span></div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', minHeight: '40px', textAlign: 'center' }}>Acceso total sin anuncios obligatorios y con Asistente de IA Híbrido.</p>
            <ul style={{ width: '100%', padding: '20px 0', borderTop: '1px solid var(--border-light)', borderBottom: '1px solid var(--border-light)', listStyle: 'none', margin: '20px 0', fontSize: '0.82rem', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span className="material-symbols-rounded" style={{ color: '#10b981', fontSize: '1.1rem' }}>check_circle</span> Myers LCS Diff Engine</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span className="material-symbols-rounded" style={{ color: '#10b981', fontSize: '1.1rem' }}>check_circle</span> 🤖 Asistente de IA Híbrido</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span className="material-symbols-rounded" style={{ color: '#10b981', fontSize: '1.15rem' }}>check_circle</span> 🚫 Cero Anuncios (Ad-Free)</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span className="material-symbols-rounded" style={{ color: '#10b981', fontSize: '1.15rem' }}>check_circle</span> Historial Ilimitado Aislado</li>
            </ul>
            <button className="premium-btn-primary" style={{ width: '100%', height: '40px' }} onClick={() => setActiveTab('register')}>Obtener Premium</button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '30px' }}>
          <button className="premium-btn-secondary" onClick={() => setActiveTab('landing')}>
            <span className="material-symbols-rounded" style={{ marginRight: '8px' }}>arrow_back</span>
            Volver al Inicio
          </button>
        </div>
      </div>
    </div>
  );
};
