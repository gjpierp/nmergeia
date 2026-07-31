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
    
    // Configuración dinámica basada en el tema global
    const isLight = theme && theme.includes('light');
    mermaid.initialize({ 
      startOnLoad: false, 
      theme: isLight ? 'default' : 'dark'
    });
    
    const renderChart = async () => {
      try {
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
        // Mermaid falla categóricamente si hay retornos de carro (\r) en Windows
        // Además, la sintaxis <-->|"text"| es exclusiva de 'flowchart', por lo que promovemos 'graph' a 'flowchart' on-the-fly.
        // También Mermaid 11 falla con paréntesis/espacios en títulos de subgraphs si no tienen comillas: subgraph id [Título (Algo)] -> subgraph id ["Título (Algo)"]
        const safeChart = chart
          .replace(/\r/g, '')
          .replace(/^graph /m, 'flowchart ')
          .replace(/subgraph\s+([a-zA-Z0-9_]+)\s+\[([^"\]]+)\]/g, 'subgraph $1 ["$2"]');
          
        const { svg } = await mermaid.render(id, safeChart);
        if (isMounted && ref.current) {
          ref.current.innerHTML = svg;
        }
      } catch (e) {
        console.error("Mermaid error:", e);
        const errorElement = document.querySelector(`[id^="dmermaid-"]`);
        if (errorElement) {
          errorElement.remove();
        }
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
  }, [chart]);
  
  if (hasError) {
    return (
      <div className="mermaid-error-fallback" style={{
        background: '#1e1e1e',
        color: '#f87171',
        padding: '1rem',
        borderRadius: '8px',
        border: '1px solid #7f1d1d',
        margin: '2rem 0',
        fontFamily: 'monospace',
        whiteSpace: 'pre-wrap',
        overflowX: 'auto'
      }}>
        <p style={{ margin: '0 0 10px 0', fontSize: '0.9rem', fontWeight: 'bold' }}>⚠️ Diagrama no compatible (Mostrando código fuente):</p>
        <p style={{ color: '#ffaaaa', marginBottom: '10px' }}>Error: {errorMsg}</p>
        {chart}
      </div>
    );
  }

  return (
    <div 
      className="mermaid-diagram" 
      style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        margin: '2rem 0',
        background: 'var(--bg-glass)',
        padding: '20px',
        borderRadius: '12px',
        border: '1px solid var(--border-light)'
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
        // Fallback to 'es' if translation is missing or as base
        const response = await fetch(`/docs/${appLanguage}/${filename}`);
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
