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

  const handleSocialLogin = (provider) => {
    setLoading(true);
    addToast(t('login_connecting_provider').replace('{provider}', provider), 'info');
    setTimeout(() => {
      setLoading(false);
      localStorage.setItem('nmerge_user_session', JSON.stringify({ email: `user@${provider.toLowerCase()}.com`, method: provider }));
      addToast(t('login_success_provider').replace('{provider}', provider), 'success');
      setActiveTab('main');
    }, 1200);
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
        <form onSubmit={handleEmailLogin} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
          <input 
            type="email" 
            placeholder={t('login_placeholder_email')} 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
            style={{ height: '38px', fontSize: '0.85rem' }}
            required
            disabled={loading}
          />
          <input 
            type="password" 
            placeholder={t('login_placeholder_password')} 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
            style={{ height: '38px', fontSize: '0.85rem' }}
            required
            disabled={loading}
          />
          
          <button 
            type="submit" 
            className="btn primary-btn" 
            disabled={loading}
            style={{ height: '38px', fontSize: '0.85rem', fontWeight: '600', marginTop: '5px' }}
          >
            {loading ? t('login_btn_loading') : t('login_btn_email')}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-secondary)', fontSize: '0.75rem', marginBottom: '20px' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
          <span>{t('login_divider_text')}</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
        </div>

        {/* Social logins */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button 
            className="btn secondary-btn" 
            onClick={() => handleSocialLogin('Google')}
            disabled={loading}
            style={socialBtnStyle}
          >
            <span style={{ fontWeight: 'bold', color: '#ea4335', marginRight: '8px', fontSize: '1.1rem' }}>G</span>
            {t('login_btn_google')}
          </button>
          
          <button 
            className="btn secondary-btn" 
            onClick={() => handleSocialLogin('Facebook')}
            disabled={loading}
            style={socialBtnStyle}
          >
            <span style={{ fontWeight: 'bold', color: '#1877f2', marginRight: '8px', fontSize: '1.1rem' }}>f</span>
            {t('login_btn_facebook')}
          </button>

          <button 
            className="btn secondary-btn" 
            onClick={() => handleSocialLogin('GitHub')}
            disabled={loading}
            style={socialBtnStyle}
          >
            <span className="material-symbols-rounded" style={{ fontSize: '1.1rem', marginRight: '8px', color: 'var(--text-primary)' }}>code</span>
            {t('login_btn_github')}
          </button>
        </div>

        {/* Bottom Switch Links */}
        <div style={{ marginTop: '25px', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          {t('login_no_account')}{' '}
          <span 
            onClick={() => setActiveTab('register')}
            style={{ color: 'var(--accent-primary)', cursor: 'pointer', fontWeight: '600' }}
          >
            {t('login_register_link')}
          </span>
        </div>
      </div>
    </div>
  );
};

const socialBtnStyle = {
  height: '38px',
  fontSize: '0.85rem',
  fontWeight: '500',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '8px',
  width: '100%'
};
