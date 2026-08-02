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

          // Verificar palabras clave válidas de Mermaid
          const validKeywords = ['graph', 'flowchart', 'sequenceDiagram', 'classDiagram', 'stateDiagram', 'erDiagram', 'gantt', 'pie', 'gitGraph', 'C4Context'];
          const firstWord = str.split(/\s+/)[0];
          if (!validKeywords.includes(firstWord)) {
            str = 'flowchart TD\n' + str;
          }

          // Normalizar 'graph' -> 'flowchart'
          str = str.replace(/^\s*graph\s+/gm, 'flowchart ');

          // Envolver etiquetas de subgraphs: subgraph sub_1 [Label (Info)] -> subgraph sub_1 ["Label (Info)"]
          let subCount = 0;
          str = str.replace(/^\s*subgraph\s+([a-zA-Z0-9_-]+)?\s*\[(.*?)\]/gm, (match, id, label) => {
            subCount++;
            const subId = id ? id.trim() : `sub_${subCount}`;
            const cleanLabel = label.replace(/"/g, "'").trim();
            return `subgraph ${subId} ["${cleanLabel}"]`;
          });

          // Envolver etiquetas de nodos: Node[Label / Info] -> Node["Label / Info"]
          str = str.replace(/([a-zA-Z0-9_-]+)\[([^"\n][^\]]*?)\]/g, (match, id, label) => {
            const cleanLabel = label.replace(/"/g, "'").trim();
            return `${id}["${cleanLabel}"]`;
          });

          // Envolver etiquetas de BD: Node[(Label)] -> Node[("Label")]
          str = str.replace(/([a-zA-Z0-9_-]+)\[\((.*?)\)\]/g, (match, id, label) => {
            const cleanLabel = label.replace(/"/g, "'").trim();
            return `${id}[("${cleanLabel}")]`;
          });

          return str;
        };

        const safeChart = sanitizeMermaidChart(chart);
        const chartId = 'mermaid_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now();

        // Ejecutar renderizado seguro de Mermaid
        const { svg } = await mermaid.render(chartId, safeChart);

        // Remover elemento DOM temporal si fue creado por el render de Mermaid en body
        const tempEl = document.getElementById(chartId);
        if (tempEl) tempEl.remove();

        if (isMounted && ref.current) {
          ref.current.innerHTML = svg;
        }
      } catch (e) {
        console.error("[NMerge Mermaid Error]:", e);
        if (isMounted) {
          setErrorMsg(e?.message || String(e));
          setHasError(true);
        }
      }
    };

    if (chart) {
      renderChart();
    }

    return () => {
      isMounted = false;
    };
  }, [chart, theme]);

  if (hasError) {
    return (
      <div className="mermaid-error-fallback" style={{
        background: 'var(--bg-tertiary, #1e1e1e)',
        color: '#f87171',
        padding: '1.2rem',
        borderRadius: '8px',
        border: '1px solid #7f1d1d',
        margin: '1.5rem 0',
        fontFamily: 'monospace',
        whiteSpace: 'pre-wrap',
        overflowX: 'auto',
        fontSize: '0.85rem'
      }}>
        <p style={{ margin: '0 0 8px 0', fontSize: '0.9rem', fontWeight: 'bold' }}>⚠️ Vista de Código Diagrama Mermaid:</p>
        <pre style={{ margin: 0, color: 'var(--text-primary)', background: 'transparent' }}>{chart}</pre>
      </div>
    );
  }

  return (
    <div 
      className="mermaid-diagram" 
      style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        margin: '2rem 0',
        background: 'var(--bg-secondary)',
        padding: '24px',
        borderRadius: '12px',
        border: '1px solid var(--border-color)',
        overflowX: 'auto',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.15)'
      }} 
      ref={ref} 
    />
  );
};

export const MarkdownViewer = ({ filename, title, requiredRole }) => {
  const { appLanguage, appTheme } = useAppStore();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoc = async () => {
      try {
        setLoading(true);
        // Fallback inteligente: probar idioma actual -> español -> archivo base
        let response = await fetch(`/docs/${appLanguage}/${filename}`);
        if (!response.ok && appLanguage !== 'es') {
          response = await fetch(`/docs/es/${filename}`);
        }
        if (!response.ok) {
          // Si es un subtema de nivel como datascience_pyspark_inicial.md, probar datascience_pyspark.md
          const baseName = filename.replace(/_(inicial|basico|medio|avanzado|experto|optimizaciones)\.md$/, '.md');
          if (baseName !== filename) {
            response = await fetch(`/docs/${appLanguage}/${baseName}`);
            if (!response.ok && appLanguage !== 'es') {
              response = await fetch(`/docs/es/${baseName}`);
            }
          }
        }

        if (!response.ok) {
          throw new Error('No se pudo cargar el documento.');
        }
        const text = await response.text();
        setContent(text);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDoc();
  }, [filename, appLanguage]);

  return (
    <div style={{
      padding: '2rem',
      background: 'var(--bg-tertiary)',
      color: 'var(--text-primary)',
      borderRadius: '8px',
      border: '1px solid var(--border-color)',
      boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
      minHeight: '600px',
      position: 'relative'
    }}>
      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div className="premium-skeleton skeleton-title"></div>
          <div className="premium-skeleton skeleton-text"></div>
          <div className="premium-skeleton skeleton-text" style={{ width: '90%' }}></div>
          <div className="premium-skeleton skeleton-block"></div>
        </div>
      )}

      {error && (
        <div style={{
          padding: '1.5rem',
          background: 'rgba(255, 60, 60, 0.1)',
          borderLeft: '4px solid #ff4d4f',
          color: '#ff4d4f',
          borderRadius: '4px'
        }}>
          <strong>Hubo un problema:</strong> {error}. <br/>
          <em>Estamos trabajando para restaurar este gemelo digital.</em>
        </div>
      )}

      {!loading && !error && (
        <div className="markdown-body">
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            components={{
              h1: 'h2',
              code({node, inline, className, children, ...props}) {
                const match = /language-(\w+)/.exec(className || '');
                if (!inline && match && match[1] === 'mermaid') {
                  return <MermaidChart chart={String(children).replace(/\n$/, '')} theme={appTheme} />;
                }
                return <code className={className} {...props}>
                  {children}
                </code>;
              }
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
};
