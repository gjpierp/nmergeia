import React, { useState, useEffect } from 'react';
import { apiClient } from '../../../shared/lib/apiClient.js';
import { useAppStore } from '../../../app/useAppStore.js';
import { useTranslation } from 'react-i18next';

export const FiltersPanel = ({ openDiffTab, processFiles }) => {
  const { t } = useTranslation();
  const sessionFilterConfig = useAppStore(s => s.sessionFilterConfig);
  const setSessionFilterConfig = useAppStore(s => s.setSessionFilterConfig);
  const addToast = useAppStore(s => s.addToast);

  const [rules, setRules] = useState([]);
  const [newPattern, setNewPattern] = useState('');
  const [newType, setNewType] = useState('exclude'); // 'exclude' (-) or 'include' (+)
  const [patternTarget, setPatternTarget] = useState('file'); // 'file' or 'directory'

  // Cargar filtros al montar
  useEffect(() => {
    if (sessionFilterConfig !== null) {
      parseRules(sessionFilterConfig);
    } else {
      const userSessionStr = typeof window !== 'undefined' ? localStorage.getItem('nmerge_user_session') : null;
      const userSession = userSessionStr ? JSON.parse(userSessionStr) : null;
      const userEmail = userSession ? userSession.email : null;
      const savedUserFilters = userEmail ? localStorage.getItem(`nmergeia_filters_${userEmail}`) : null;

      if (savedUserFilters !== null) {
        setSessionFilterConfig(savedUserFilters);
        parseRules(savedUserFilters);
      } else {
        apiClient.readFilter('filtro.txt')
          .then(txt => {
            setSessionFilterConfig(txt);
            parseRules(txt);
            if (userEmail) {
              localStorage.setItem(`nmergeia_filters_${userEmail}`, txt);
            }
          })
          .catch(e => console.error("Error reading filter:", e));
      }
    }
  }, [sessionFilterConfig, setSessionFilterConfig]);

  const parseRules = (txt) => {
    if (!txt) {
      setRules([]);
      return;
    }
    const lines = txt.split('\n');
    const parsed = [];
    lines.forEach((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('//')) {
        // Guardar comentarios o líneas vacías para no perder comentarios del usuario
        parsed.push({ id: idx, type: 'comment', raw: line });
        return;
      }
      if (trimmed.startsWith('+')) {
        parsed.push({ id: idx, type: 'include', pattern: trimmed.substring(1).trim(), raw: line });
      } else if (trimmed.startsWith('-') || trimmed.startsWith('!')) {
        parsed.push({ id: idx, type: 'exclude', pattern: trimmed.substring(1).trim(), raw: line });
      } else {
        // Por defecto excluir si no tiene signo
        parsed.push({ id: idx, type: 'exclude', pattern: trimmed, raw: line });
      }
    });
    setRules(parsed);
  };

  const serializeAndSave = async (newRules) => {
    const serialized = newRules.map(r => {
      if (r.type === 'comment') return r.raw;
      const prefix = r.type === 'include' ? '+' : '-';
      return `${prefix} ${r.pattern}`;
    }).join('\n');

    try {
      await apiClient.writeFilter('filtro.txt', serialized);
      setSessionFilterConfig(serialized);

      // Persistir filtros para la sesión activa del usuario
      const userSessionStr = typeof window !== 'undefined' ? localStorage.getItem('nmerge_user_session') : null;
      const userSession = userSessionStr ? JSON.parse(userSessionStr) : null;
      if (userSession && userSession.email) {
        localStorage.setItem(`nmergeia_filters_${userSession.email}`, serialized);
      }

      addToast(t('toast_filters_updated'), "success");
      
      // Actualizar la comparación de directorios en caliente automáticamente
      if (processFiles) {
        await processFiles(true);
      }
    } catch (e) {
      addToast(t('toast_save_filters_error'), "error");
    }
  };

  const handleAddRule = (e) => {
    e.preventDefault();
    if (!newPattern.trim()) return;

    let pattern = newPattern.trim();
    
    // Si se indicó que es una Carpeta y no termina con barra, se le concatena automáticamente
    if (patternTarget === 'directory' && !pattern.endsWith('/')) {
      pattern = pattern + '/';
    }

    const newRule = {
      id: Date.now(),
      type: newType,
      pattern: pattern
    };

    const updated = [...rules, newRule];
    setRules(updated);
    setNewPattern('');
    serializeAndSave(updated);
  };

  const handleDeleteRule = (id) => {
    const updated = rules.filter(r => r.id !== id);
    setRules(updated);
    serializeAndSave(updated);
  };

  const [editingRuleId, setEditingRuleId] = useState(null);
  const [editPattern, setEditPattern] = useState('');
  const [editType, setEditType] = useState('exclude');
  const [editTarget, setEditTarget] = useState('file');

  const startEditRule = (rule) => {
    setEditingRuleId(rule.id);
    const isDir = rule.pattern.endsWith('/');
    setEditPattern(isDir ? rule.pattern.slice(0, -1) : rule.pattern);
    setEditType(rule.type);
    setEditTarget(isDir ? 'directory' : 'file');
  };

  const handleSaveEditRule = (id) => {
    let finalPattern = editPattern.trim();
    if (!finalPattern) return;
    if (editTarget === 'directory' && !finalPattern.endsWith('/')) {
      finalPattern += '/';
    }
    
    const updated = rules.map(r => {
      if (r.id === id) {
        return { ...r, type: editType, pattern: finalPattern };
      }
      return r;
    });

    setRules(updated);
    setEditingRuleId(null);
    serializeAndSave(updated);
  };

  const activeRules = rules.filter(r => r.type !== 'comment');

  const [rawText, setRawText] = useState('');

  // Sincronizar editor de texto plano con la config de la sesión
  useEffect(() => {
    if (sessionFilterConfig !== null) {
      setRawText(sessionFilterConfig);
    }
  }, [sessionFilterConfig]);

  const handleSaveRawText = async () => {
    try {
      await apiClient.writeFilter('filtro.txt', rawText);
      setSessionFilterConfig(rawText);
      parseRules(rawText);
      
      const userSessionStr = typeof window !== 'undefined' ? localStorage.getItem('nmerge_user_session') : null;
      const userSession = userSessionStr ? JSON.parse(userSessionStr) : null;
      if (userSession && userSession.email) {
        localStorage.setItem(`nmergeia_filters_${userSession.email}`, rawText);
      }

      addToast(t('toast_raw_filters_saved'), "success");
      if (processFiles) {
        await processFiles(true);
      }
    } catch (e) {
      addToast(t('toast_raw_filters_error'), "error");
    }
  };

  return (
    <div className="main-screen" style={{ padding: '20px', fontFamily: '"Outfit", sans-serif' }}>
      <h2 className="main-screen-title" style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '20px', color: 'var(--text-primary)' }}>
        {t('filters_title')}
      </h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'start' }}>
        
        {/* Panel Izquierdo: Gestión de Reglas Activas */}
        <div className="section-card config-card" style={{ padding: '25px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '16px', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)' }}>
          <h3 style={{ marginBottom: '15px', color: 'var(--text-primary)', fontSize: '1.2rem', fontWeight: '700' }}>{t('active_rules_management')}</h3>
          
          {/* Formulario para añadir nueva regla */}
          <form onSubmit={handleAddRule} style={{ display: 'flex', gap: '10px', marginBottom: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
            
            {/* Acción */}
            <select
              value={newType}
              onChange={(e) => setNewType(e.target.value)}
              className="input-field"
              style={{ width: '120px', padding: '8px 12px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '8px', height: '40px', fontSize: '0.85rem' }}
            >
              <option value="exclude">{t('exclude_minus')}</option>
              <option value="include">{t('include_plus')}</option>
            </select>

            {/* Destino */}
            <select
              value={patternTarget}
              onChange={(e) => setPatternTarget(e.target.value)}
              className="input-field"
              style={{ width: '150px', padding: '8px 12px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '8px', height: '40px', fontSize: '0.85rem' }}
            >
              <option value="file">{t('apply_to_file')}</option>
              <option value="directory">{t('apply_to_directory')}</option>
            </select>

            {/* Expresión */}
            <input
              type="text"
              placeholder={patternTarget === 'directory' ? t('placeholder_dir_example') : t('placeholder_file_example')}
              value={newPattern}
              onChange={(e) => setNewPattern(e.target.value)}
              className="input-field"
              style={{ flex: 1, minWidth: '150px', padding: '8px 12px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '8px', height: '40px', fontSize: '0.85rem' }}
            />
            
            <button type="submit" className="btn primary-btn" style={{ padding: '0 16px', height: '40px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 'bold' }}>
              {t('btn_add_rule')}
            </button>
          </form>

          {/* Listado de reglas */}
          <div className="rules-list-container" style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '450px', overflowY: 'auto', paddingRight: '5px' }}>
            {activeRules.length === 0 ? (
              <div style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem', textAlign: 'center', padding: '40px 0', background: 'var(--bg-primary)', borderRadius: '8px', border: '1px dashed var(--border-color)' }}>
                <span className="material-symbols-rounded" style={{ fontSize: '2.5rem', display: 'block', marginBottom: '8px', color: 'var(--text-tertiary)' }}>filter_list_off</span>
                {t('no_active_rules')}
              </div>
            ) : (
              activeRules.map((rule) => {
                const isDir = rule.pattern.endsWith('/');
                const isEditing = rule.id === editingRuleId;

                if (isEditing) {
                  return (
                    <div
                      key={rule.id}
                      style={{
                        display: 'flex',
                        gap: '8px',
                        alignItems: 'center',
                        padding: '6px 10px',
                        background: 'var(--bg-tertiary)',
                        border: '1px solid var(--accent-primary)',
                        borderRadius: '10px',
                        height: '46px',
                        boxSizing: 'border-box'
                      }}
                    >
                      <select
                        value={editType}
                        onChange={(e) => setEditType(e.target.value)}
                        className="input-field"
                        style={{ width: '90px', padding: '4px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '6px', height: '30px', fontSize: '0.75rem' }}
                      >
                        <option value="exclude">{t('exclude_label')}</option>
                        <option value="include">{t('include_label')}</option>
                      </select>

                      <select
                        value={editTarget}
                        onChange={(e) => setEditTarget(e.target.value)}
                        className="input-field"
                        style={{ width: '100px', padding: '4px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '6px', height: '30px', fontSize: '0.75rem' }}
                      >
                        <option value="file">{t('file_label')}</option>
                        <option value="directory">{t('directory_label')}</option>
                      </select>

                      <input
                        type="text"
                        value={editPattern}
                        onChange={(e) => setEditPattern(e.target.value)}
                        className="input-field"
                        style={{ flex: 1, padding: '4px 8px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '6px', height: '30px', fontSize: '0.8rem', minWidth: '50px' }}
                      />

                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button
                          type="button"
                          className="btn clear-btn small-btn"
                          onClick={() => handleSaveEditRule(rule.id)}
                          style={{ color: '#10b981', height: '28px', width: '28px', minWidth: '28px', padding: 0 }}
                          data-tooltip={t('tooltip_save_changes')}
                        >
                          <span className="material-symbols-rounded" style={{ fontSize: '1.1rem' }}>check</span>
                        </button>
                        <button
                          type="button"
                          className="btn clear-btn small-btn"
                          onClick={() => setEditingRuleId(null)}
                          style={{ color: 'var(--text-secondary)', height: '28px', width: '28px', minWidth: '28px', padding: 0 }}
                          data-tooltip={t('tooltip_cancel_edit')}
                        >
                          <span className="material-symbols-rounded" style={{ fontSize: '1.1rem' }}>close</span>
                        </button>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={rule.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '10px 15px',
                      background: 'var(--bg-tertiary)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '10px',
                      height: '46px',
                      boxSizing: 'border-box',
                      transition: 'border-color 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span
                        style={{
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '10px',
                          fontWeight: 'bold',
                          color: 'white',
                          backgroundColor: rule.type === 'include' ? '#10b981' : '#ef4444'
                        }}
                       >
                         {rule.type === 'include' ? t('include_label') : t('exclude_label')}
                       </span>
                       <span
                         style={{
                           padding: '2px 6px',
                           borderRadius: '4px',
                           fontSize: '9px',
                           fontWeight: 'bold',
                           color: 'var(--text-secondary)',
                           backgroundColor: 'var(--bg-primary)'
                         }}
                       >
                         {isDir ? `📁 ${t('directory_label')}` : `📄 ${t('file_label')}`}
                       </span>
                      <code style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{rule.pattern}</code>
                    </div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        type="button"
                        className="btn clear-btn small-btn"
                        onClick={() => startEditRule(rule)}
                        style={{ color: '#3b82f6', height: '28px', width: '28px', minWidth: '28px', padding: 0 }}
                        data-tooltip={t('tooltip_edit_rule')}
                      >
                        <span className="material-symbols-rounded" style={{ fontSize: '1.1rem' }}>edit</span>
                      </button>
                      <button
                        type="button"
                        className="btn clear-btn small-btn"
                        onClick={() => handleDeleteRule(rule.id)}
                        style={{ color: '#ef4444', height: '28px', width: '28px', minWidth: '28px', padding: 0 }}
                        data-tooltip={t('tooltip_delete_rule')}
                      >
                        <span className="material-symbols-rounded" style={{ fontSize: '1.1rem' }}>delete</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Panel Derecho: Edición Avanzada (Text Editor) */}
        <div className="section-card config-card" style={{ padding: '25px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '16px', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)', display: 'flex', flexDirection: 'column', height: '100%' }}>
          <h3 style={{ marginBottom: '10px', color: 'var(--text-primary)', fontSize: '1.2rem', fontWeight: '700' }}>{t('advanced_edition_title')}</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '15px', lineHeight: '1.4' }}>
            {t('advanced_desc_write')} <code>+</code> {t('advanced_desc_include')} <code>-</code> {t('advanced_desc_exclude')} <code>//</code> {t('advanced_desc_comment')}
          </p>
          
          <textarea
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            style={{
              flex: 1,
              width: '100%',
              minHeight: '260px',
              fontFamily: 'monospace',
              fontSize: '0.85rem',
              padding: '15px',
              background: '#111827',
              border: '1px solid var(--border-color)',
              color: '#34d399',
              borderRadius: '10px',
              resize: 'vertical',
              outline: 'none',
              boxSizing: 'border-box',
              lineHeight: '1.5',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)'
            }}
            placeholder={t('placeholder_raw_text')}
          />

          <div style={{ display: 'flex', gap: '10px', marginTop: '15px', justifyContent: 'flex-end' }}>
            <button
              className="btn secondary-btn"
              onClick={() => {
                apiClient.readFilter('filtro.txt')
                  .then(txt => {
                    setRawText(txt);
                    addToast(t('toast_filters_reloaded'), "info");
                  })
                  .catch(e => console.error("Error reading filter:", e));
              }}
              style={{ height: '40px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 'bold' }}
            >
              {t('btn_reload')}
            </button>
            <button
              className="btn primary-btn"
              onClick={handleSaveRawText}
              style={{ height: '40px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 'bold', padding: '0 20px' }}
            >
              {t('btn_save_changes')}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
