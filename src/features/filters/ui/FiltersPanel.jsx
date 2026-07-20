import React, { useState, useEffect } from 'react';
import { apiClient } from '../../../shared/lib/apiClient.js';
import { useAppStore } from '../../../app/useAppStore.js';

export const FiltersPanel = ({ openDiffTab, processFiles }) => {
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

      addToast("Filtros actualizados con éxito", "success");
      
      // Actualizar la comparación de directorios en caliente automáticamente
      if (processFiles) {
        await processFiles(true);
      }
    } catch (e) {
      addToast("Error al guardar los filtros", "error");
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

      addToast("Filtros de texto plano guardados", "success");
      if (processFiles) {
        await processFiles(true);
      }
    } catch (e) {
      addToast("Error al guardar texto plano", "error");
    }
  };

  return (
    <div className="main-screen" style={{ padding: '20px', fontFamily: '"Outfit", sans-serif' }}>
      <h2 className="main-screen-title" style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '20px', color: 'var(--text-primary)' }}>
        Filtros de Archivos
      </h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'start' }}>
        
        {/* Panel Izquierdo: Gestión de Reglas Activas */}
        <div className="section-card config-card" style={{ padding: '25px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '16px', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)' }}>
          <h3 style={{ marginBottom: '15px', color: 'var(--text-primary)', fontSize: '1.2rem', fontWeight: '700' }}>Gestión de Reglas Activas</h3>
          
          {/* Formulario para añadir nueva regla */}
          <form onSubmit={handleAddRule} style={{ display: 'flex', gap: '10px', marginBottom: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
            
            {/* Acción */}
            <select
              value={newType}
              onChange={(e) => setNewType(e.target.value)}
              className="input-field"
              style={{ width: '120px', padding: '8px 12px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '8px', height: '40px', fontSize: '0.85rem' }}
            >
              <option value="exclude">Excluir (-)</option>
              <option value="include">Incluir (+)</option>
            </select>

            {/* Destino */}
            <select
              value={patternTarget}
              onChange={(e) => setPatternTarget(e.target.value)}
              className="input-field"
              style={{ width: '150px', padding: '8px 12px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '8px', height: '40px', fontSize: '0.85rem' }}
            >
              <option value="file">Aplica a: Archivo</option>
              <option value="directory">Aplica a: Carpeta</option>
            </select>

            {/* Expresión */}
            <input
              type="text"
              placeholder={patternTarget === 'directory' ? "Ejemplo: node_modules, temp, vendor" : "Ejemplo: *.log, .env, config.json"}
              value={newPattern}
              onChange={(e) => setNewPattern(e.target.value)}
              className="input-field"
              style={{ flex: 1, minWidth: '150px', padding: '8px 12px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '8px', height: '40px', fontSize: '0.85rem' }}
            />
            
            <button type="submit" className="btn primary-btn" style={{ padding: '0 16px', height: '40px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 'bold' }}>
              Añadir Regla
            </button>
          </form>

          {/* Listado de reglas */}
          <div className="rules-list-container" style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '450px', overflowY: 'auto', paddingRight: '5px' }}>
            {activeRules.length === 0 ? (
              <div style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem', textAlign: 'center', padding: '40px 0', background: 'var(--bg-primary)', borderRadius: '8px', border: '1px dashed var(--border-color)' }}>
                <span className="material-symbols-rounded" style={{ fontSize: '2.5rem', display: 'block', marginBottom: '8px', color: 'var(--text-tertiary)' }}>filter_list_off</span>
                No hay reglas de filtrado activas.
              </div>
            ) : (
              activeRules.map((rule) => {
                const isDir = rule.pattern.endsWith('/');
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
                        {rule.type === 'include' ? 'INCLUIR' : 'EXCLUIR'}
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
                        {isDir ? '📁 CARPETA' : '📄 ARCHIVO'}
                      </span>
                      <code style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{rule.pattern}</code>
                    </div>
                    <button
                      type="button"
                      className="btn clear-btn small-btn"
                      onClick={() => handleDeleteRule(rule.id)}
                      style={{ color: '#ef4444', height: '28px', width: '28px', minWidth: '28px', padding: 0 }}
                      data-tooltip="Eliminar regla"
                    >
                      <span className="material-symbols-rounded" style={{ fontSize: '1.1rem' }}>delete</span>
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Panel Derecho: Edición Avanzada (Text Editor) */}
        <div className="section-card config-card" style={{ padding: '25px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '16px', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)', display: 'flex', flexDirection: 'column', height: '100%' }}>
          <h3 style={{ marginBottom: '10px', color: 'var(--text-primary)', fontSize: '1.2rem', fontWeight: '700' }}>Edición Avanzada (filtro.txt)</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '15px', lineHeight: '1.4' }}>
            Escribe directamente tus patrones de exclusión o inclusión. Las líneas que empiezan por <code>+</code> indican archivos incluidos, y <code>-</code> indican archivos excluidos. Las líneas con <code>//</code> o vacías se consideran comentarios.
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
            placeholder="// Escribe tus reglas aquí, una por línea. Ejemplo:&#10;- *.log&#10;- temp/&#10;+ .env"
          />

          <div style={{ display: 'flex', gap: '10px', marginTop: '15px', justifyContent: 'flex-end' }}>
            <button
              className="btn secondary-btn"
              onClick={() => {
                apiClient.readFilter('filtro.txt')
                  .then(txt => {
                    setRawText(txt);
                    addToast("Filtros recargados desde el archivo", "info");
                  })
                  .catch(e => console.error("Error reading filter:", e));
              }}
              style={{ height: '40px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 'bold' }}
            >
              Recargar
            </button>
            <button
              className="btn primary-btn"
              onClick={handleSaveRawText}
              style={{ height: '40px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 'bold', padding: '0 20px' }}
            >
              Guardar Cambios
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
