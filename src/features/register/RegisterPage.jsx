import React, { useState } from 'react';
import { useAppStore } from '../../app/useAppStore.js';
import { useMonetizationStore } from '../monetization/MonetizationStore.js';

export const RegisterPage = () => {
  const { setActiveTab, addToast } = useAppStore();
  const { isPro, licenseKey, verifyLicense, deactivateLicense } = useMonetizationStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [typedKey, setTypedKey] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name || !email) {
      addToast('Por favor completa todos los campos', 'error');
      return;
    }
    setLoading(true);
    // Simular llamada de registro y generación de licencia
    setTimeout(async () => {
      // Registrar llave PRO de prueba directamente por defecto
      const mockKey = "PRO-ANTIGRAVITY-2026";
      const res = await verifyLicense(mockKey);
      setLoading(false);
      if (res.success) {
        addToast('Registro completo. Licencia PRO activada con éxito', 'success');
      } else {
        addToast('Error al registrar la licencia', 'error');
      }
    }, 1000);
  };

  const handleActivateManual = async (e) => {
    e.preventDefault();
    if (!typedKey) {
      addToast('Ingresa una clave de licencia', 'error');
      return;
    }
    setLoading(true);
    const res = await verifyLicense(typedKey.trim());
    setLoading(false);
    if (res.success) {
      addToast('Licencia PRO activada con éxito', 'success');
    } else {
      addToast('Clave de licencia no válida o inactiva', 'error');
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '80vh',
      padding: '40px 20px',
      background: 'radial-gradient(circle at top, var(--bg-tertiary) 0%, var(--bg-primary) 70%)',
      fontFamily: '"Outfit", sans-serif'
    }}>
      <div style={{
        maxWidth: '450px',
        width: '100%',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        borderRadius: '16px',
        padding: '35px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
        textAlign: 'left'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <span className="material-symbols-rounded" style={{ fontSize: '3rem', color: '#f59e0b', marginBottom: '10px' }}>vpn_key</span>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '800', margin: '0 0 8px 0', color: 'var(--text-primary)' }}>Registro de Licencia</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>Desbloquea el poder total de NMerge Pro</p>
        </div>

        {isPro ? (
          /* Estado Premium Activo */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'center' }}>
            <div style={{
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              borderRadius: '8px',
              padding: '15px',
              color: '#10b981',
              fontSize: '0.9rem',
              fontWeight: '600'
            }}>
              ✔ Tienes una Licencia PRO activa
            </div>
            
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Clave de Licencia Activa:
              <code style={{
                display: 'block',
                background: 'var(--bg-primary)',
                padding: '8px 12px',
                borderRadius: '6px',
                marginTop: '6px',
                fontSize: '0.9rem',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-color)'
              }}>{licenseKey}</code>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button 
                className="btn secondary-btn" 
                onClick={deactivateLicense}
                style={{ flex: 1, height: '40px', color: '#ef4444', border: '1px solid #ef4444' }}
              >
                Desactivar Licencia
              </button>
              <button 
                className="btn primary-btn" 
                onClick={() => setActiveTab('main')}
                style={{ flex: 1, height: '40px' }}
              >
                Ir al Comparador
              </button>
            </div>
          </div>
        ) : (
          /* Formulario de Registro o Activación */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            {/* Opción 1: Obtener Llave de Prueba */}
            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: '700', margin: '0 0 5px 0', color: 'var(--text-primary)' }}>1. Registrar cuenta de Prueba</h3>
              <input 
                type="text" 
                placeholder="Nombre Completo" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                className="input-field"
                style={{ height: '38px', fontSize: '0.85rem' }}
                required
              />
              <input 
                type="email" 
                placeholder="Correo Electrónico" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                style={{ height: '38px', fontSize: '0.85rem' }}
                required
              />
              <button 
                type="submit" 
                className="btn primary-btn" 
                disabled={loading}
                style={{ height: '38px', fontSize: '0.85rem', fontWeight: '600', marginTop: '5px' }}
              >
                {loading ? 'Procesando...' : 'Obtener Llave PRO Gratis'}
              </button>
            </form>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
              <span>O TAMBIÉN</span>
              <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
            </div>

            {/* Opción 2: Activar Llave Existente */}
            <form onSubmit={handleActivateManual} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: '700', margin: '0 0 5px 0', color: 'var(--text-primary)' }}>2. Activar Clave Existente</h3>
              <input 
                type="text" 
                placeholder="PRO-XXXX-XXXX" 
                value={typedKey} 
                onChange={(e) => setTypedKey(e.target.value)}
                className="input-field"
                style={{ height: '38px', fontSize: '0.85rem' }}
                required
              />
              <button 
                type="submit" 
                className="btn secondary-btn" 
                disabled={loading}
                style={{ height: '38px', fontSize: '0.85rem', fontWeight: '600', marginTop: '5px' }}
              >
                Activar Licencia
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
