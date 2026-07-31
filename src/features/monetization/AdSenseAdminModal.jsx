import React, { useState, useEffect } from 'react';

export default function AdSenseAdminModal({ isOpen, onClose }) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);
  const [updatedAt, setUpdatedAt] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchAdSenseConfig();
    }
  }, [isOpen]);

  const fetchAdSenseConfig = async () => {
    setLoading(true);
    setStatusMsg(null);
    try {
      const token = localStorage.getItem('ngac_token') || 'MOCK_TOKEN_ADMIN';
      const res = await fetch('/api/admin/adsense', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setContent(data.content || '');
        setUpdatedAt(data.updatedAt);
      } else {
        setStatusMsg({ type: 'error', text: data.error || 'Error al cargar la configuración' });
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: 'No se pudo conectar con el servidor backend' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setStatusMsg(null);
    try {
      const token = localStorage.getItem('ngac_token') || 'MOCK_TOKEN_ADMIN';
      const res = await fetch('/api/admin/adsense', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content })
      });
      const data = await res.json();
      if (data.success) {
        setStatusMsg({ type: 'success', text: '✅ Archivo ads.txt guardado en disco y sincronizado con Sentinel-NGAC.' });
        setUpdatedAt(data.updatedAt);
      } else {
        setStatusMsg({ type: 'error', text: data.error || 'Error al guardar el archivo' });
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: 'Fallo de red al intentar guardar' });
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999
    }}>
      <div className="premium-modal" style={{
        backgroundColor: '#1e1e2e',
        color: '#cdd6f4',
        borderRadius: '8px',
        width: '560px',
        maxWidth: '92vw',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
        overflow: 'hidden',
        border: '1px solid #313244',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Cabecera modal 100% de ancho */}
        <div style={{
          backgroundColor: '#181825',
          padding: '12px 16px',
          borderBottom: '1px solid #313244',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#cba6f7', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🔒 Admin: Gestión de Google AdSense (`ads.txt`)</span>
          </h3>
          <button
            onClick={onClose}
            style={{
              background: 'none', border: 'none', color: '#a6adc8', fontSize: '18px', cursor: 'pointer'
            }}
          >&times;</button>
        </div>

        {/* Cuerpo del formulario denso */}
        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <p style={{ margin: 0, fontSize: '11px', color: '#a6adc8', lineHeight: 1.4 }}>
            Edita las líneas de vendedores autorizados para Google AdSense. Al guardar, el contenido se escribirá directamente en el disco en la raíz pública (`/ads.txt`) y se registrará en la base de datos <strong>Sentinel-NGAC</strong>.
          </p>

          {statusMsg && (
            <div style={{
              padding: '8px 12px',
              borderRadius: '4px',
              fontSize: '11px',
              backgroundColor: statusMsg.type === 'success' ? '#11261f' : '#2d1820',
              color: statusMsg.type === 'success' ? '#a6e3a1' : '#f38ba8',
              border: `1px solid ${statusMsg.type === 'success' ? '#275d46' : '#72293d'}`
            }}>
              {statusMsg.text}
            </div>
          )}

          {loading ? (
            <div style={{ padding: '20px', textAlignment: 'center', fontSize: '12px', color: '#89b4fa' }}>
              Cargando configuración actual...
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '11px', fontWeight: 600, color: '#bac2de' }}>
                  Contenido del archivo ads.txt:
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="google.com, pub-0000000000000000, DIRECT, f08c47fec0942fa0"
                  rows={6}
                  style={{
                    backgroundColor: '#11111b',
                    color: '#a6e3a1',
                    border: '1px solid #45475a',
                    borderRadius: '4px',
                    padding: '8px',
                    fontFamily: 'monospace',
                    fontSize: '11px',
                    resize: 'vertical',
                    outline: 'none'
                  }}
                />
              </div>

              {updatedAt && (
                <div style={{ fontSize: '10px', color: '#6c7086', textAlign: 'right' }}>
                  Última actualización: {new Date(updatedAt).toLocaleString()}
                </div>
              )}
            </>
          )}
        </div>

        {/* Pie de modal denso (height 40px inputs/buttons) */}
        <div style={{
          backgroundColor: '#181825',
          padding: '10px 16px',
          borderTop: '1px solid #313244',
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center'
        }}>
          <a
            href="/ads.txt"
            target="_blank"
            rel="noreferrer"
            style={{
              color: '#89b4fa',
              fontSize: '11px',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            🔗 Probar /ads.txt público
          </a>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={onClose}
              style={{
                height: '32px',
                padding: '0 12px',
                borderRadius: '4px',
                border: '1px solid #45475a',
                backgroundColor: 'transparent',
                color: '#cdd6f4',
                fontSize: '11px',
                cursor: 'pointer'
              }}
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={saving || loading}
              style={{
                height: '32px',
                padding: '0 14px',
                borderRadius: '4px',
                border: 'none',
                backgroundColor: '#cba6f7',
                color: '#11111b',
                fontWeight: 600,
                fontSize: '11px',
                cursor: saving ? 'wait' : 'pointer',
                opacity: saving ? 0.7 : 1
              }}
            >
              {saving ? 'Guardando en Disco...' : 'Guardar y Sincronizar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
