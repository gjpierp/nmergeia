import React, { useState } from 'react';
import { useAppStore } from '../../app/useAppStore.js';
import { useTranslation } from 'react-i18next';
import { NgacService } from '../../shared/lib/NgacService.js';

export const LoginPage = () => {
  const { t } = useTranslation();
  const { setActiveTab, addToast, setUserSession } = useAppStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      addToast(t('login_error_missing_credentials'), 'error');
      return;
    }
    setLoading(true);
    try {
      // Intentar login con Sentinel-NGAC
      const session = await NgacService.loginUser(email, password);
      setUserSession(session);
      addToast(t('login_success_ngac'), 'success');
      setActiveTab('main');
    } catch (err) {
      // Remover mock y mostrar el error devuelto por Sentinel-NGAC
      console.error('Error al iniciar sesión en Sentinel-NGAC:', err);
      addToast(err.message || t('login_error_missing_credentials'), 'error');
    } finally {
      setLoading(false);
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
        maxWidth: '420px',
        width: '100%',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        borderRadius: '16px',
        padding: '35px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
        textAlign: 'left'
      }}>
        {/* Logo and title */}
        <div style={{ textAlign: 'center', marginBottom: '25px' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '800', margin: '0 0 8px 0', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <span className="material-symbols-rounded" style={{ color: 'var(--accent-primary)', fontSize: '2rem' }}>account_circle</span>
            {t('login_title')}
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>{t('login_subtitle')}</p>
        </div>

        {/* Email Form */}
        <form onSubmit={handleEmailLogin} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '20px' }}>
          <input 
            type="email" 
            placeholder={t('login_placeholder_email')} 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
            style={{ height: '40px', fontSize: '11px' }}
            required
            disabled={loading}
          />
          <input 
            type="password" 
            placeholder={t('login_placeholder_password')} 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
            style={{ height: '40px', fontSize: '11px' }}
            required
            disabled={loading}
          />
          
          <button 
            type="submit" 
            className="btn primary-btn" 
            disabled={loading}
            style={{ height: '40px', fontSize: '12px', fontWeight: '600', marginTop: '5px' }}
          >
            {loading ? t('login_btn_loading') : t('login_btn_email')}
          </button>
        </form>



        {/* Bottom Switch Links / Enlace a Registro */}
        <div style={{
          marginTop: '22px',
          paddingTop: '16px',
          borderTop: '1px dashed var(--border-color)',
          textAlign: 'center',
          fontSize: '0.85rem',
          color: 'var(--text-secondary)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>¿No tienes una cuenta aún?</span>
          <button 
            type="button"
            className="btn secondary-btn"
            onClick={() => setActiveTab('register')}
            style={{
              width: '100%',
              height: '38px',
              fontSize: '0.85rem',
              fontWeight: '600',
              color: 'var(--accent-secondary)',
              borderColor: 'var(--border-color)',
              background: 'var(--bg-tertiary)',
              cursor: 'pointer'
            }}
          >
            Registrarse / Crear Cuenta
          </button>
        </div>
      </div>
    </div>
  );
};


