import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import mermaid from 'mermaid';
import { useAppStore } from '../../app/useAppStore.js';
import { PageHeader } from './PageHeader.jsx';
import 'highlight.js/styles/github-dark.css';
import './MarkdownViewer.css';

const MermaidChart = ({ chart, theme }) => {
  const ref = useRef(null);
  const [hasError, setHasError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    let isMounted = true;
    setHasError(false);
    setErrorMsg("");

    // Configuración dinámica de Mermaid basada en el tema global
    const isLight = theme && theme.includes('light');
    try {
      mermaid.initialize({
        startOnLoad: false,
        theme: isLight ? 'default' : 'dark',
        securityLevel: 'loose',
        fontFamily: '"Outfit", sans-serif'
      });
    } catch (_) {}

    const renderChart = async () => {
      try {
        const sanitizeMermaidChart = (rawChart = '') => {
          if (!rawChart) return '';
          let str = rawChart.replace(/\r/g, '').trim();

          // Palabras clave oficiales de inicio de diagramas Mermaid
          const validKeywords = [
            'graph', 'flowchart', 'sequenceDiagram', 'classDiagram', 
            'stateDiagram', 'stateDiagram-v2', 'erDiagram', 'gantt', 
            'pie', 'gitGraph', 'C4Context', 'architecture', 'mindmap', 
            'timeline', 'quadrantChart', 'sankey', 'requirementDiagram'
          ];
          const firstWord = str.split(/\s+/)[0];
          const isKnownDiagram = validKeywords.some(kw => firstWord.startsWith(kw));

          if (!isKnownDiagram) {
            str = 'flowchart TD\n' + str;
          }

          // Solo aplicar transformaciones de sintaxis de nodos si es un diagrama tipo flowchart o graph
          const currentType = str.split(/\s+/)[0];
          if (currentType === 'flowchart' || currentType === 'graph') {
            str = str.replace(/^\s*graph\s+/gm, 'flowchart ');

            // Limpieza de paréntesis dentro de etiquetas de enlace (ej: -->|5. Collect()| -> -->|5. Collect|)
            str = str.replace(/-->\|([^|]*?)\((.*?)\)([^|]*?)\|/g, (match, p1, p2, p3) => {
              const cleanInside = p2 ? ` ${p2} ` : '';
              return `-->|${p1.trim()}${cleanInside}${p3.trim()}|`;
            });

            let subCount = 0;
            str = str.replace(/^\s*subgraph\s+([a-zA-Z0-9_-]+)?\s*\[(.*?)\]/gm, (match, id, label) => {
              subCount++;
              const subId = id ? id.trim() : `sub_${subCount}`;
              const cleanLabel = label.replace(/"/g, "'").trim();
              return `subgraph ${subId} ["${cleanLabel}"]`;
            });

            str = str.replace(/([a-zA-Z0-9_-]+)\[([^"\n][^\]]*?)\]/g, (match, id, label) => {
              const cleanLabel = label.replace(/"/g, "'").trim();
              return `${id}["${cleanLabel}"]`;
            });

            str = str.replace(/([a-zA-Z0-9_-]+)\[\((.*?)\)\]/g, (match, id, label) => {
              const cleanLabel = label.replace(/"/g, "'").trim();
              return `${id}[("${cleanLabel}")]`;
            });
          }

          return str;
        };

        const safeChart = sanitizeMermaidChart(chart);
        const chartId = 'mermaid_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now();

        // Ejecutar renderizado seguro de Mermaid
        const { svg } = await mermaid.render(chartId, safeChart);
        
        if (isMounted && ref.current) {
          ref.current.innerHTML = svg;
          setHasError(false);
        }
      } catch (err) {
        console.warn("⚠️ Mermaid render warning:", err?.message || err);
        if (isMounted) {
          setHasError(true);
          setErrorMsg(err?.message || "Diagram render notice");
        }
      }
    };

    renderChart();
    return () => { isMounted = false; };
  }, [chart, theme]);

  if (hasError) {
    return (
      <div style={{
        padding: '12px 16px',
        margin: '1rem 0',
        background: 'rgba(239, 68, 68, 0.08)',
        border: '1px solid var(--accent-danger)',
        borderRadius: '8px',
        fontSize: '0.82rem',
        color: 'var(--text-secondary)',
        fontFamily: 'monospace'
      }}>
        <strong>📌 Diagrama de Arquitectura (Vista Previa de Código Raw):</strong>
        <pre style={{ margin: '8px 0 0 0', whiteSpace: 'pre-wrap', color: 'var(--text-primary)' }}>
          {chart}
        </pre>
      </div>
    );
  }

  return (
    <div 
      ref={ref} 
      className="mermaid-svg-wrapper"
      style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        margin: '1.5rem 0',
        overflowX: 'auto',
        background: 'var(--bg-primary)',
        padding: '1rem',
        borderRadius: '8px',
        border: '1px solid var(--border-light)'
      }} 
    />
  );
};

export const MarkdownViewer = ({ filename, title, requiredRole }) => {
  const { appLanguage, appTheme } = useAppStore();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchDoc = async () => {
      try {
        setLoading(true);
        setError(null);

        const isValidMarkdownResponse = (res, textStr) => {
          if (!res || !res.ok) return false;
          if (!textStr || textStr.trim().startsWith('<!doctype html') || textStr.trim().startsWith('<html')) {
            return false;
          }
          return true;
        };

        // 1. Probar idioma activo (ej. en, de, fr, etc.)
        let response = await fetch(`/docs/${appLanguage}/${filename}`);
        let text = response.ok ? await response.text() : '';

        // 2. Si falló o devolvió HTML de SPA, probar en español (es)
        if (!isValidMarkdownResponse(response, text) && appLanguage !== 'es') {
          response = await fetch(`/docs/es/${filename}`);
          text = response.ok ? await response.text() : '';
        }

        // 3. Si falló (ej. por nombre con sufijo de nivel), probar nombre base
        if (!isValidMarkdownResponse(response, text)) {
          const baseName = filename.replace(/_(inicial|basico|medio|avanzado|experto|optimizaciones)\.md$/, '.md');
          if (baseName !== filename) {
            response = await fetch(`/docs/${appLanguage}/${baseName}`);
            text = response.ok ? await response.text() : '';
            if (!isValidMarkdownResponse(response, text) && appLanguage !== 'es') {
              response = await fetch(`/docs/es/${baseName}`);
              text = response.ok ? await response.text() : '';
            }
          }
        }

        if (isMounted) {
          if (isValidMarkdownResponse(response, text)) {
            setContent(text);
            setError(null);
          } else {
            setError('No se pudo cargar la documentación técnica para este tema.');
          }
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError('Error al cargar la documentación técnica.');
          setLoading(false);
        }
      }
    };

    fetchDoc();
    return () => { isMounted = false; };
  }, [filename, appLanguage]);

  return (
    <div style={{
      padding: '2rem',
      background: 'var(--bg-tertiary)',
      color: 'var(--text-primary)',
      borderRadius: '8px',
      border: '1px solid var(--border-color)',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      {title && <PageHeader title={title} sticky={true} />}

      {loading ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <span className="material-symbols-rounded" style={{ animation: 'spin 1s linear infinite', fontSize: '2rem' }}>sync</span>
          <p>Cargando documentación...</p>
        </div>
      ) : error ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--accent-danger)' }}>
          <span className="material-symbols-rounded" style={{ fontSize: '2.5rem' }}>error</span>
          <p style={{ marginTop: '0.5rem' }}>{error}</p>
        </div>
      ) : (
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '');
              const lang = match ? match[1] : '';
              
              if (!inline && lang === 'mermaid') {
                return <MermaidChart chart={String(children).replace(/\n$/, '')} theme={appTheme} />;
              }

              return !inline ? (
                <pre style={{
                  background: 'var(--bg-primary)',
                  padding: '1rem',
                  borderRadius: '6px',
                  overflowX: 'auto',
                  border: '1px solid var(--border-light)'
                }}>
                  <code className={className} {...props}>
                    {children}
                  </code>
                </pre>
              ) : (
                <code className={className} style={{
                  background: 'var(--badge-bg)',
                  padding: '0.2rem 0.4rem',
                  borderRadius: '4px',
                  fontSize: '0.9em'
                }} {...props}>
                  {children}
                </code>
              );
            }
          }}
        >
          {content}
        </ReactMarkdown>
      )}
    </div>
  );
};
