import React, { useState, useEffect } from 'react';
import { useAppStore } from "../../app/useAppStore";

export const showModal = (type, title, message, defaultValue = '') => {
  return new Promise((resolve) => {
    useAppStore.getState().setModalConfig({
      isOpen: true,
      type,
      title,
      message,
      defaultValue,
      resolvePromise: resolve
    });
  });
};

export const CustomModal = () => {
  const modalConfig = useAppStore(s => s.modalConfig);
  const setModalConfig = useAppStore(s => s.setModalConfig);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (modalConfig.isOpen) {
      setInputValue(modalConfig.defaultValue || '');
    }
  }, [modalConfig.isOpen, modalConfig.defaultValue]);

  if (!modalConfig.isOpen) return null;

  const close = (result = null) => {
    if (modalConfig.resolvePromise) {
      modalConfig.resolvePromise(result);
    }
    setModalConfig({ ...modalConfig, isOpen: false, resolvePromise: null });
  };

  const handleConfirm = () => {
    if (modalConfig.type === 'prompt') {
      close(inputValue);
    } else {
      close(true); // alert or confirm
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 9999, backdropFilter: 'blur(3px)'
    }}>
      <div className="section-card" style={{ 
          width: '400px', maxWidth: '90%', 
          background: '#09090b', border: '1px solid #3f3f46',
          boxShadow: '0 10px 25px rgba(0,0,0,0.5)', 
          animation: 'fadeIn 0.2s ease-out'
      }}>
        <h3 style={{ marginTop: 0, marginBottom: '15px', color: '#f4f4f5', fontSize: '1.2rem' }}>
          {modalConfig.title}
        </h3>
        
        {modalConfig.message && (
          <p style={{ color: '#a1a1aa', marginBottom: '20px', lineHeight: '1.5' }}>
            {modalConfig.message}
          </p>
        )}

        {modalConfig.type === 'prompt' && (
          <input
            type="text"
            className="filter-input"
            style={{ width: '100%', marginBottom: '20px', boxSizing: 'border-box' }}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleConfirm(); }}
            autoFocus
          />
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          {modalConfig.type !== 'alert' && (
            <button className="btn clear-btn" onClick={() => close(null)} style={{ padding: '8px 16px' }}>
              Cancelar
            </button>
          )}
          <button className="btn primary-btn" onClick={handleConfirm} style={{ padding: '8px 16px' }}>
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
};
