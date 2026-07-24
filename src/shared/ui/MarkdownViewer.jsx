import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { useAppStore } from '../../app/useAppStore.js';
import 'highlight.js/styles/github-dark.css';
import './MarkdownViewer.css';

export const MarkdownViewer = ({ filename, title, requiredRole }) => {
  const { appLanguage } = useAppStore();
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
      {/* Header Interactivo */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid var(--border-color)',
        paddingBottom: '1rem',
        marginBottom: '2rem'
      }}>
        <h2 style={{ fontSize: '1.8rem', margin: 0, color: 'var(--accent-primary)' }}>{title}</h2>
        {requiredRole && (
          <span style={{
            background: 'var(--bg-secondary)',
            padding: '0.4rem 0.8rem',
            borderRadius: '4px',
            fontSize: '0.85rem',
            fontWeight: '600',
            border: '1px solid var(--accent-secondary)',
            color: 'var(--text-secondary)'
          }}>
            🔐 NGAC Policy: {requiredRole}
          </span>
        )}
      </div>

      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', animation: 'pulse 1.5s infinite' }}>
          <div style={{ height: '30px', background: 'var(--bg-secondary)', borderRadius: '4px', width: '60%' }}></div>
          <div style={{ height: '15px', background: 'var(--bg-secondary)', borderRadius: '4px', width: '100%' }}></div>
          <div style={{ height: '15px', background: 'var(--bg-secondary)', borderRadius: '4px', width: '90%' }}></div>
          <div style={{ height: '200px', background: 'var(--bg-secondary)', borderRadius: '8px', width: '100%', marginTop: '1rem' }}></div>
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
        <div className="markdown-body" style={{ lineHeight: '1.6', fontSize: '1rem' }}>
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]} 
            rehypePlugins={[rehypeHighlight]}
          >
            {content}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
};
