import React from 'react';
import { useMonetizationStore } from './MonetizationStore';

export const AdBanner = () => {
  const isPro = useMonetizationStore(s => s.isPro);
  const openPremiumModal = useMonetizationStore(s => s.openPremiumModal);

  if (isPro) return null;

  return (
    <div 
      className="ad-banner" 
      onClick={openPremiumModal}
      style={{
        background: 'linear-gradient(90deg, #4f46e5, #7c3aed)',
        color: 'white',
        padding: '0.75rem',
        textAlign: 'center',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '11px',
        borderRadius: '4px',
        margin: '0.5rem'
      }}
    >
      Desbloquea el poder total. ¡Hazte Pro y elimina los límites! 🚀
    </div>
  );
};
