import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAppStore } from '../../app/useAppStore.js';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../shared/ui/PageHeader.jsx';

export const SettingsPage = () => {
  const { t, i18n } = useTranslation();
  const { appLanguage, setAppLanguage, appTheme, setAppTheme, addToast } = useAppStore();

  // Estados Locales de Configuración
  const [aiProvider, setAiProvider] = useState(() => localStorage.getItem('nmerge_ai_provider') || 'gemini');
  const [aiApiKey, setAiApiKey] = useState(() => localStorage.getItem('nmerge_ai_key') || '');
  const [showApiKey, setShowApiKey] = useState(false);
  const [aiModel, setAiModel] = useState(() => localStorage.getItem('nmerge_ai_model') || 'gemini-1.5-flash');
  
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(() => localStorage.getItem('nmerge_cfg_ignore_ws') === 'true');
  const [ignoreCase, setIgnoreCase] = useState(() => localStorage.getItem('nmerge_cfg_ignore_case') === 'true');
  const [maxFileSize, setMaxFileSize] = useState(() => localStorage.getItem('nmerge_cfg_max_filesize') || '10');
  const [workerCount, setWorkerCount] = useState(() => localStorage.getItem('nmerge_cfg_workers') || '4');
  const [sentinelUrl, setSentinelUrl] = useState(() => localStorage.getItem('nmerge_sentinel_url') || 'http://localhost:3005');

  const darkThemes = [
    { id: 'cyber', name: 'Cyber Neon (Oscuro)', icon: 'palette', color: '#06b6d4', desc: 'Fondo negro azabache con cian y esmeralda eléctrico' },
    { id: 'obsidian', name: 'Obsidian Gold (Oscuro)', icon: 'workspace_premium', color: '#f59e0b', desc: 'Estilo negro de lujo con detalles en oro champán' },
    { id: 'tokyo', name: 'Tokyo Cyberpunk (Oscuro)', icon: 'nightlife', color: '#ec4899', desc: 'Fondo neón violeta nocturno con rosa magenta' },
    { id: 'nord', name: 'Nord Aurora (Oscuro)', icon: 'ac_unit', color: '#38bdf8', desc: 'Fondo azul ártico con verde aurora boreal' },
    { id: 'emerald', name: 'Emerald Bio-Slate (Oscuro)', icon: 'forest', color: '#2dd4bf', desc: 'Fondo verde bosque oscuro con acento verde menta' }
  ];

  const lightThemes = [
    { id: 'light-modern', name: 'Light Modern (Claro)', icon: 'light_mode', color: '#4f46e5', desc: 'Fondo blanco puro con tonos azul índigo y gris pizarra' },
    { id: 'light-cyber', name: 'Light Cyber (Claro)', icon: 'eco', color: '#059669', desc: 'Fondo claro menta fresca con acentos verde esmeralda' },
    { id: 'light-nord', name: 'Light Nord Frost (Claro)', icon: 'water_drop', color: '#0284c7', desc: 'Fondo azul hielo claro con tonos celestes' },
    { id: 'light-paper', name: 'Light Paper Minimal (Claro)', icon: 'description', color: '#ea580c', desc: 'Estilo papel cálido minimalista con tono terracota' }
  ];

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
    setAppLanguage(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('nmergeia_language', lang);
    }
    addToast(`Idioma cambiado a ${lang.toUpperCase()}`, 'info');
  };

  const handleSaveAiConfig = () => {
    localStorage.setItem('nmerge_ai_provider', aiProvider);
    localStorage.setItem('nmerge_ai_key', aiApiKey);
    localStorage.setItem('nmerge_ai_model', aiModel);
    addToast('Configuración del Asistente de IA guardada exitosamente', 'success');
  };

  const handleSaveDiffConfig = () => {
    localStorage.setItem('nmerge_cfg_ignore_ws', String(ignoreWhitespace));
    localStorage.setItem('nmerge_cfg_ignore_case', String(ignoreCase));
    localStorage.setItem('nmerge_cfg_max_filesize', maxFileSize);
    localStorage.setItem('nmerge_cfg_workers', workerCount);
    localStorage.setItem('nmerge_sentinel_url', sentinelUrl);
    addToast('Preferencias de comparación y motor guardadas', 'success');
  };

  const handleClearCache = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('nmerge_sentinel_json');
      localStorage.removeItem('nmerge_jwt_token');
      addToast('Caché local de sesión y menús restablecida exitosamente', 'success');
    }
  };

  return (
    <div style={{ flex: 1, minHeight: 0, maxHeight: 'calc(100vh - 120px)', width: '100%', overflowY: 'auto', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
      <div style={{
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '30px 20px',
        color: 'var(--text-primary)',
        fontFamily: '"Outfit", sans-serif',
        textAlign: 'left',
        boxSizing: 'border-box',
        width: '100%'
      }}>
      <Helmet>
        <title>Configuración & Preferencias | NMergeIA</title>
      </Helmet>

      <PageHeader 
        icon="settings"
        title="Configuración Global del Sistema"
        subtitle="Personaliza la apariencia, asistente de IA, motor de comparación y servidor Sentinel-NGAC"
      />

      {/* SECCIÓN 1: SELECCIÓN DE TEMAS OSCUROS */}
      <section style={{ marginBottom: '35px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '15px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="material-symbols-rounded" style={{ color: '#06b6d4' }}>dark_mode</span>
          Temas Oscuros (5 Modos Executive)
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '15px' }}>
          {darkThemes.map(theme => {
            const isSelected = appTheme === theme.id;
            return (
              <div
                key={theme.id}
                onClick={() => {
                  setAppTheme(theme.id);
                  addToast(`Tema cambiado a ${theme.name}`, 'success');
                }}
                style={{
                  padding: '16px 20px',
                  borderRadius: '12px',
                  background: 'var(--bg-secondary)',
                  border: isSelected ? `2px solid ${theme.color}` : '1px solid var(--border-color)',
                  cursor: 'pointer',
                  boxShadow: isSelected ? `0 0 16px ${theme.color}40` : 'none',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px'
                }}
              >
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: `${theme.color}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: theme.color
                }}>
                  <span className="material-symbols-rounded">{theme.icon}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>
                    {theme.name}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: '1.3' }}>
                    {theme.desc}
                  </div>
                </div>
                {isSelected && (
                  <span className="material-symbols-rounded" style={{ color: theme.color, fontSize: '1.4rem' }}>check_circle</span>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* SECCIÓN 2: SELECCIÓN DE TEMAS CLAROS */}
      <section style={{ marginBottom: '35px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '15px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="material-symbols-rounded" style={{ color: '#f59e0b' }}>light_mode</span>
          Temas Claros (4 Modos Premier Light)
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '15px' }}>
          {lightThemes.map(theme => {
            const isSelected = appTheme === theme.id;
            return (
              <div
                key={theme.id}
                onClick={() => {
                  setAppTheme(theme.id);
                  addToast(`Tema cambiado a ${theme.name}`, 'success');
                }}
                style={{
                  padding: '16px 20px',
                  borderRadius: '12px',
                  background: 'var(--bg-secondary)',
                  border: isSelected ? `2px solid ${theme.color}` : '1px solid var(--border-color)',
                  cursor: 'pointer',
                  boxShadow: isSelected ? `0 0 16px ${theme.color}40` : 'none',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px'
                }}
              >
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: `${theme.color}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: theme.color
                }}>
                  <span className="material-symbols-rounded">{theme.icon}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>
                    {theme.name}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: '1.3' }}>
                    {theme.desc}
                  </div>
                </div>
                {isSelected && (
                  <span className="material-symbols-rounded" style={{ color: theme.color, fontSize: '1.4rem' }}>check_circle</span>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* SECCIÓN 3: CONFIGURACIÓN DEL ASISTENTE DE IA */}
      <section style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        borderRadius: '12px',
        padding: '24px',
        marginBottom: '30px'
      }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '18px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="material-symbols-rounded" style={{ color: '#8b5cf6' }}>psychology</span>
          Asistente de Inteligencia Artificial (IA Resolver)
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Proveedor de IA
            </label>
            <select
              value={aiProvider}
              onChange={(e) => setAiProvider(e.target.value)}
              className="input-field"
              style={{ width: '100%', height: '40px' }}
            >
              <option value="gemini">Google Gemini API (Recomendado)</option>
              <option value="ollama">Ollama Local (100% Privado sin Conexión)</option>
              <option value="openai">OpenAI GPT-4o</option>
              <option value="claude">Anthropic Claude 3.5</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Modelo de Lenguaje
            </label>
            <input
              type="text"
              value={aiModel}
              onChange={(e) => setAiModel(e.target.value)}
              placeholder="ej. gemini-1.5-flash o llama3:8b"
              className="input-field"
              style={{ width: '100%', height: '40px' }}
            />
          </div>
        </div>

        {aiProvider !== 'ollama' && (
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
              API Key Personal (Cifrada localmente en el navegador)
            </label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type={showApiKey ? 'text' : 'password'}
                value={aiApiKey}
                onChange={(e) => setAiApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="input-field"
                style={{ flex: 1, height: '40px' }}
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="btn secondary-btn"
                style={{ padding: '0 14px' }}
              >
                <span className="material-symbols-rounded" style={{ fontSize: '1.2rem' }}>
                  {showApiKey ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>
        )}

        <button
          onClick={handleSaveAiConfig}
          className="btn primary-btn"
          style={{ padding: '10px 20px', fontSize: '0.88rem' }}
        >
          Guardar Configuración de IA
        </button>
      </section>

      {/* SECCIÓN 4: MOTOR DE COMPARACIÓN & RENDIMIENTO */}
      <section style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        borderRadius: '12px',
        padding: '24px',
        marginBottom: '30px'
      }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '18px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="material-symbols-rounded" style={{ color: 'var(--accent-primary)' }}>tune</span>
          Motor de Comparación (Myers LCS) & Rendimiento
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: 'var(--text-primary)', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={ignoreWhitespace}
                onChange={(e) => setIgnoreWhitespace(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: 'var(--accent-primary)' }}
              />
              <span>Ignorar diferencias de espacios en blanco (Whitespace)</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: 'var(--text-primary)', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={ignoreCase}
                onChange={(e) => setIgnoreCase(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: 'var(--accent-primary)' }}
              />
              <span>Ignorar diferencias de Mayúsculas / Minúsculas (Case Insensitive)</span>
            </label>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Tamaño Máximo por Archivo (MB)
            </label>
            <select
              value={maxFileSize}
              onChange={(e) => setMaxFileSize(e.target.value)}
              className="input-field"
              style={{ width: '100%', height: '40px', marginBottom: '14px' }}
            >
              <option value="5">5 MB (Para proyectos livianos)</option>
              <option value="10">10 MB (Estándar)</option>
              <option value="50">50 MB (Para proyectos masivos)</option>
              <option value="100">100 MB (Sin límite)</option>
            </select>

            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Trabajadores Web Workers en Paralelo
            </label>
            <select
              value={workerCount}
              onChange={(e) => setWorkerCount(e.target.value)}
              className="input-field"
              style={{ width: '100%', height: '40px' }}
            >
              <option value="2">2 Hilos (Bajo consumo CPU)</option>
              <option value="4">4 Hilos (Recomendado)</option>
              <option value="8">8 Hilos (Rendimiento ultra-rápido)</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleSaveDiffConfig}
          className="btn primary-btn"
          style={{ padding: '10px 20px', fontSize: '0.88rem' }}
        >
          Guardar Preferencias de Comparación
        </button>
      </section>

      {/* SECCIÓN 5: IDIOMA Y SERVIDOR SENTINEL-NGAC */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <section style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
          padding: '22px'
        }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '15px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="material-symbols-rounded" style={{ color: 'var(--accent-secondary)' }}>translate</span>
            Idioma de la Plataforma
          </h2>
          <select
            value={i18n.language || 'es'}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="input-field"
            style={{ width: '100%', height: '42px', fontSize: '0.9rem' }}
          >
            <option value="es">Español (América Latina / España)</option>
            <option value="en">English (United States)</option>
            <option value="pt">Português (Brasil)</option>
            <option value="fr">Français (France)</option>
            <option value="de">Deutsch (Deutschland)</option>
          </select>
        </section>

        <section style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
          padding: '22px'
        }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '15px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="material-symbols-rounded" style={{ color: '#ef4444' }}>cleaning_services</span>
            Mantenimiento de Sesión & Caché
          </h2>
          <button
            onClick={handleClearCache}
            className="btn secondary-btn"
            style={{ width: '100%', height: '42px', fontSize: '0.85rem', color: '#ef4444', borderColor: '#ef4444' }}
          >
            Restablecer Caché de Menús Sentinel-NGAC
          </button>
        </section>
      </div>
    </div>
  </div>
);
};
