import React, { useState, useEffect, useRef } from 'react';
import { useAppStore } from '../../app/useAppStore.js';
import { useMonetizationStore } from '../monetization/MonetizationStore.js';
import { apiClient } from '../../shared/lib/apiClient.js';

export const CommandTerminal = ({
  processFiles,
  handleClear
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState([
    { type: 'system', text: 'Terminal de Comandos de NodeMerge. Escribe /help para ver la lista.' }
  ]);

  const appTheme = useAppStore(s => s.appTheme);
  const setAppTheme = useAppStore(s => s.setAppTheme);
  const addToast = useAppStore(s => s.addToast);
  const sessionFilterConfig = useAppStore(s => s.sessionFilterConfig);
  const setSessionFilterConfig = useAppStore(s => s.setSessionFilterConfig);

  const consoleEndRef = useRef(null);
  const inputRef = useRef(null);

  // Escuchar la tecla de escape o de consola para abrir/cerrar
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '`') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Autofoco al abrir
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Hacer scroll automático al final de la historia
  useEffect(() => {
    if (consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history, isOpen]);

  const logText = (text, type = 'output') => {
    setHistory(prev => [...prev, { type, text }]);
  };

  const handleCommand = async (cmdStr) => {
    const trimmed = cmdStr.trim();
    if (!trimmed) return;

    logText(`> ${trimmed}`, 'input');

    const parts = trimmed.split(' ');
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    switch (command) {
      case '/help':
      case '/ayuda':
        logText('Comandos disponibles:');
        logText('  /sync           - Inicia el proceso de comparación de directorios');
        logText('  /clear          - Limpia la selección de carpetas actual');
        logText('  /theme          - Cambia el tema (Claro / Oscuro)');
        logText('  /filter <+|-|exclude|include> <patrón> - Agrega una regla de filtrado (ej. /filter - *.log)');
        logText('  /cls            - Limpia la pantalla de la terminal');
        break;

      case '/sync':
      case '/comparar':
        logText('Iniciando comparación de archivos...');
        try {
          await processFiles();
          logText('Comparación finalizada.');
        } catch (e) {
          logText(`Error: ${e.message}`, 'error');
        }
        break;

      case '/clear':
      case '/limpiar':
        handleClear();
        logText('Slots y selecciones limpiadas con éxito.');
        break;

      case '/theme':
        const nextTheme = appTheme === 'dark' ? 'light' : 'dark';
        setAppTheme(nextTheme);
        logText(`Tema cambiado a: ${nextTheme === 'dark' ? 'Oscuro' : 'Claro'}`);
        break;

      case '/cls':
        setHistory([]);
        break;

      case '/filter':
        if (args.length < 2) {
          logText('Uso: /filter <+|-|exclude|include> <patrón>. Ejemplo: /filter - *.log', 'error');
          break;
        }
        const ruleType = args[0] === '+' || args[0] === 'include' ? '+' : '-';
        const pattern = args.slice(1).join(' ').trim();
        const ruleText = `${ruleType} ${pattern}`;

        try {
          const currentFilter = sessionFilterConfig || '';
          const lines = currentFilter.split('\n');
          lines.push(ruleText);
          const newFilterText = lines.join('\n');

          await apiClient.writeFilter('filtro.txt', newFilterText);
          setSessionFilterConfig(newFilterText);
          logText(`Filtro guardado correctamente: "${ruleText}"`);
          addToast("Filtros actualizados", "success");
        } catch (e) {
          logText(`Error al guardar filtro: ${e.message}`, 'error');
        }
        break;

      default:
        logText(`Comando no reconocido: "${command}". Escribe /help para ayuda.`, 'error');
        break;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    handleCommand(inputVal);
    setInputVal('');
  };

  return (
    <div 
      className="terminal-wrapper" 
      style={{
        borderTop: '1px solid var(--border-color)',
        background: 'var(--bg-secondary)',
        display: 'flex',
        flexDirection: 'column',
        height: isOpen ? '250px' : '36px',
        transition: 'height 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        zIndex: 50
      }}
    >
      {/* Header barra */}
      <div 
        onClick={() => setIsOpen(!isOpen)} 
        style={{
          height: '36px',
          padding: '0 15px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
          background: 'var(--bg-tertiary)',
          fontSize: '0.8rem',
          fontWeight: 'bold',
          color: 'var(--text-secondary)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="material-symbols-rounded" style={{ fontSize: '1.1rem' }}>terminal</span>
          Terminal de comandos (Presiona ` para alternar)
        </div>
        <span className="material-symbols-rounded" style={{ fontSize: '1.2rem' }}>
          {isOpen ? 'expand_more' : 'expand_less'}
        </span>
      </div>

      {/* Historial y prompt */}
      {isOpen && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: '10px' }}>
          {/* Historial */}
          <div 
            style={{
              flex: 1,
              overflowY: 'auto',
              fontFamily: 'monospace',
              fontSize: '0.75rem',
              textAlign: 'left',
              lineHeight: '1.4',
              background: 'var(--bg-primary)',
              padding: '10px',
              borderRadius: '4px',
              border: '1px solid var(--border-color)',
              marginBottom: '8px',
              color: 'var(--text-primary)'
            }}
          >
            {history.map((h, i) => {
              let color = 'var(--text-secondary)';
              if (h.type === 'input') color = 'var(--accent-primary)';
              if (h.type === 'error') color = '#ef4444';
              if (h.type === 'system') color = '#f59e0b';
              return (
                <div key={i} style={{ color, whiteSpace: 'pre-wrap', marginBottom: '4px' }}>
                  {h.text}
                </div>
              );
            })}
            <div ref={consoleEndRef} />
          </div>

          {/* Formulario/Input */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px' }}>
            <input
              ref={inputRef}
              type="text"
              placeholder="Escribe un comando... (ej. /help)"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              style={{
                flex: 1,
                padding: '6px 12px',
                height: '32px',
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                fontFamily: 'monospace',
                fontSize: '0.75rem',
                borderRadius: '4px'
              }}
            />
            <button 
              type="submit" 
              className="btn primary-btn small-btn" 
              style={{ height: '32px', padding: '0 15px', borderRadius: '4px', fontSize: '0.75rem' }}
            >
              Ejecutar
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
