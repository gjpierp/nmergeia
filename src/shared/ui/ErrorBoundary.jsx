import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an uncaught runtime error:", error, errorInfo);
  }

  handleResetAndRecover = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
      // Recarga limpia en la raíz del sitio
      window.location.replace(window.location.origin + '/');
    } catch (e) {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '20px',
          background: 'radial-gradient(circle at top, #111827 0%, #030712 100%)',
          color: '#f3f4f6',
          fontFamily: '"Outfit", sans-serif',
          textAlign: 'center',
          boxSizing: 'border-box'
        }}>
          <div style={{
            fontSize: '4.5rem',
            marginBottom: '1.5rem',
            filter: 'drop-shadow(0 0 20px rgba(16, 185, 129, 0.2))'
          }}>
            🛡️
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '1rem', color: '#f3f4f6' }}>
            NMergeIA - Sistema de Recuperación Activa
          </h1>
          <p style={{ color: '#9ca3af', maxWidth: '500px', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '2rem' }}>
            Se ha detectado una excepción inesperada en el cliente o una inconsistencia en los datos locales almacenados en caché.
          </p>
          
          <div style={{
            background: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: '8px',
            padding: '15px',
            maxWidth: '600px',
            width: '100%',
            textAlign: 'left',
            marginBottom: '2rem',
            overflowX: 'auto',
            boxSizing: 'border-box'
          }}>
            <strong style={{ color: '#ef4444', fontSize: '0.8rem', display: 'block', marginBottom: '5px' }}>
              ERROR DETECTADO:
            </strong>
            <code style={{ fontSize: '0.75rem', color: '#f87171', fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
              {this.state.error?.stack || this.state.error?.toString() || 'Error desconocido'}
            </code>
          </div>

          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={this.handleResetAndRecover}
              style={{
                background: 'linear-gradient(90deg, #10b981, #059669)',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(16, 185, 129, 0.25)',
                transition: 'transform 0.2s',
                fontFamily: '"Outfit", sans-serif'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              Restablecer Caché y Recuperar Aplicación
            </button>
            
            <button
              onClick={() => window.location.reload()}
              style={{
                background: 'transparent',
                color: '#e5e7eb',
                border: '1px solid #374151',
                padding: '12px 24px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'background 0.2s, transform 0.2s',
                fontFamily: '"Outfit", sans-serif'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                e.currentTarget.style.transform = 'scale(1.02)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              Reintentar Carga
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
