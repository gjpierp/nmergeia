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

  return (
    <div className="main-screen">
      <h2 className="main-screen-title">Filtros de Archivos</h2>
      
      <div className="section-card config-card" style={{ padding: '20px' }}>
        <h3 style={{ marginBottom: '15px', color: 'var(--text-primary)' }}>Gestión de Reglas Activas</h3>
        
        {/* Formulario para añadir nueva regla */}
        <form onSubmit={handleAddRule} style={{ display: 'flex', gap: '10px', marginBottom: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
          
          {/* Acción: Incluir / Excluir */}
          <select
            value={newType}
            onChange={(e) => setNewType(e.target.value)}
            className="input-field"
            style={{ width: '130px', padding: '8px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '6px', height: '40px' }}
          >
            <option value="exclude">Excluir (-)</option>
            <option value="include">Incluir (+)</option>
          </select>

          {/* Destino: Archivo / Carpeta */}
          <select
            value={patternTarget}
            onChange={(e) => setPatternTarget(e.target.value)}
            className="input-field"
            style={{ width: '150px', padding: '8px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '6px', height: '40px' }}
          >
            <option value="file">Aplica a: Archivo</option>
            <option value="directory">Aplica a: Carpeta</option>
          </select>

          {/* Expresión del patrón */}
          <input
            type="text"
            placeholder={patternTarget === 'directory' ? "Ejemplo: node_modules, temp, vendor" : "Ejemplo: *.log, .env, config.json"}
            value={newPattern}
            onChange={(e) => setNewPattern(e.target.value)}
            className="input-field"
            style={{ flex: 1, minWidth: '200px', padding: '8px 12px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '6px', height: '40px' }}
          />
          
          <button type="submit" className="btn primary-btn" style={{ padding: '0 20px', height: '40px', borderRadius: '6px' }}>
            Añadir Regla
          </button>
        </form>

        {/* Listado de reglas */}
        <div className="rules-list-container">
          {activeRules.length === 0 ? (
            <p style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem', textAlign: 'center', padding: '20px 0' }}>
              No hay reglas dinámicas de filtrado configuradas.
            </p>
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
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '6px',
                    height: '46px',
                    boxSizing: 'border-box'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
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
                        fontSize: '10px',
                        fontWeight: 'bold',
                        color: 'var(--text-secondary)',
                        backgroundColor: 'var(--bg-tertiary)'
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
                    style={{ border: '1px solid #ef4444', color: '#ef4444', height: '26px' }}
                    data-tooltip="Eliminar regla"
                  >
                    <span className="material-symbols-rounded" style={{ fontSize: '1rem' }}>delete</span>
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="section-card config-card" style={{ padding: '20px', textAlign: 'left' }}>
        <h3 style={{ marginBottom: '10px', color: 'var(--text-primary)' }}>Edición Avanzada</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '15px' }}>
          ¿Prefieres escribir las reglas en texto plano? Puedes editar directamente el archivo de configuración en el editor de diferencias.
        </p>
        <button
          className="btn secondary-btn"
          onClick={() => {
            if (sessionFilterConfig !== null) {
              openDiffTab('filtro.txt', sessionFilterConfig, 0, true);
            } else {
              apiClient.readFilter('filtro.txt')
                .then(txt => { openDiffTab('filtro.txt', txt, 0, true); })
                .catch(e => console.error("Error reading filter:", e));
            }
          }}
          style={{ height: '40px' }}
        >
          📝 Abrir editor avanzado (filtro.txt)
        </button>
      </div>
    </div>
  );
};
