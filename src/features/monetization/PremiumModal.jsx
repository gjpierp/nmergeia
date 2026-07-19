import React, { useState } from 'react';
import { useMonetizationStore } from './MonetizationStore.js';
import { CustomModal, showModal } from '../../shared/ui/CustomModal.jsx';

export const PremiumModal = () => {
  const { isPremiumModalOpen, closePremiumModal, verifyLicense } = useMonetizationStore();
  const [key, setKey] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isPremiumModalOpen) return null;

  const handleVerify = async () => {
    setLoading(true);
    const result = await verifyLicense(key);
    setLoading(false);
    
    if (!result.success) {
      alert(result.message);
    } else {
      alert("¡Licencia Activada con éxito!");
    }
  };

  return (
    <div className="custom-modal-overlay premium-modal" style={{zIndex: 9999}}>
      <div className="custom-modal-content">
        <header style={{background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))', color: 'white', padding: '1rem', borderTopLeftRadius: '12px', borderTopRightRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <h2 style={{margin: 0, fontSize: '1.25rem'}}>Desbloquea NodeMerge Pro</h2>
          <button onClick={closePremiumModal} className="close-btn" style={{color: 'white'}}>
            <span className="material-symbols-rounded">close</span>
          </button>
        </header>
        <div style={{padding: '2rem'}}>
          <p style={{marginBottom: '1rem', color: 'var(--text-secondary)'}}>Ingresa tu clave de licencia para activar todas las funciones avanzadas.</p>
          <input 
            type="text" 
            className="filter-input" 
            placeholder="PRO-XXXXXXXXXXXXXXXX" 
            value={key} 
            onChange={e => setKey(e.target.value)}
            style={{marginBottom: '1rem'}}
          />
          <div style={{display: 'flex', gap: '10px', justifyContent: 'flex-end'}}>
            <button className="btn secondary-btn" onClick={closePremiumModal} disabled={loading}>Cancelar</button>
            <button className="btn primary-btn" onClick={handleVerify} disabled={loading || key.length < 10}>
              {loading ? 'Verificando...' : 'Activar Licencia'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
