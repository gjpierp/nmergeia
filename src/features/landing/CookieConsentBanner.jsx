import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './CookieConsentBanner.css';

export const CookieConsentBanner = () => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Si no ha aceptado ni rechazado, mostramos el banner
    const consent = localStorage.getItem('nmergeia_cookie_consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('nmergeia_cookie_consent', 'accepted');
    setIsVisible(false);
    // Aquí inicializamos scripts analíticos o de AdSense si fuera necesario
  };

  const handleDecline = () => {
    localStorage.setItem('nmergeia_cookie_consent', 'declined');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="cookie-consent-overlay">
      <div className="cookie-consent-banner">
        <div className="cookie-content">
          <h4>{t('PRIVACY_TITLE', 'Privacidad y Cookies')}</h4>
          <p>
            Utilizamos cookies propias y de terceros para fines analíticos y para mostrarte publicidad 
            personalizada basada en un perfil elaborado a partir de tus hábitos de navegación. 
            Google AdSense requiere tu consentimiento para servir anuncios relevantes.
          </p>
          <a href="/privacy" className="cookie-link">Leer Política de Privacidad</a>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="premium-btn-secondary" onClick={handleDecline}>Rechazar</button>
          <button className="premium-btn-primary" onClick={handleAccept}>Aceptar Cookies</button>
        </div>
      </div>
    </div>
  );
};
