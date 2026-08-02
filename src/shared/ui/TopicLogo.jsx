import React from 'react';

/**
 * @file TopicLogo.jsx
 * @description Renderizador de logos e insignias SVG de alta calidad para cada tecnología y tema.
 */
export const TopicLogo = ({ topicId, size = "42px", alt = "Tech Logo" }) => {
  const normalizedId = String(topicId || '').toLowerCase().replace(/[^a-z0-9]/g, '');

  // Map SVGs o colores/iconos SVG profesionales vectoriales
  const topicMap = {
    datascience: {
      name: 'Data Science & AI',
      color: '#10b981',
      bg: 'rgba(16, 185, 129, 0.15)',
      svg: (
        <svg viewBox="0 0 128 128" width={size} height={size}>
          <path fill="#10B981" d="M64 8L16 32v64l48 24 48-24V32L64 8zm0 18l32 16v32L64 90 32 74V42l32-16z"/>
          <circle cx="64" cy="58" r="10" fill="#34D399"/>
        </svg>
      )
    },
    postgres: {
      name: 'PostgreSQL',
      color: '#336791',
      bg: 'rgba(51, 103, 145, 0.15)',
      svg: (
        <svg viewBox="0 0 128 128" width={size} height={size}>
          <path fill="#336791" d="M63.8 2.2C30 2.2 2.6 29.6 2.6 63.4S30 124.6 63.8 124.6s61.2-27.4 61.2-61.2S97.6 2.2 63.8 2.2zm28.6 69.3c-2.4 1.3-9.7.7-13.6-.9-3.8-1.5-6.7-4.2-11.4-4.2-4.7 0-7.3 2.7-11.1 4.2-3.9 1.6-11.2 2.2-13.6.9-2.3-1.3-4.2-7.2-4.2-14.8 0-7.6 1.9-13.5 4.2-14.8 2.4-1.3 9.7-.7 13.6.9 3.8 1.5 6.4 4.2 11.1 4.2 4.7 0 7.6-2.7 11.4-4.2 3.9-1.6 11.2-2.2 13.6-.9 2.3 1.3 4.2 7.2 4.2 14.8.1 7.6-1.8 13.5-4.2 14.8z"/>
        </svg>
      )
    },
    oracle: {
      name: 'Oracle DB',
      color: '#f80000',
      bg: 'rgba(248, 0, 0, 0.15)',
      svg: (
        <svg viewBox="0 0 128 128" width={size} height={size}>
          <path fill="#F80000" d="M42.2 101.5H85.8C108.7 101.5 125 85.2 125 64C125 42.8 108.7 26.5 85.8 26.5H42.2C19.3 26.5 3 42.8 3 64C3 85.2 19.3 101.5 42.2 101.5ZM44 41.5H84C96.4 41.5 107 50.8 107 64C107 77.2 96.4 86.5 84 86.5H44C31.6 86.5 21 77.2 21 64C21 50.8 31.6 41.5 44 41.5Z"/>
        </svg>
      )
    },
    docker: {
      name: 'Docker',
      color: '#2496ed',
      bg: 'rgba(36, 150, 237, 0.15)',
      svg: (
        <svg viewBox="0 0 128 128" width={size} height={size}>
          <path fill="#2496ED" d="M125.7 49.3c-2.3-1.6-7.3-2.1-11.7.2-2.1 1.1-3.7 2.8-4.9 4.7-5.9-4.2-13.6-6-21.4-4.8-1.5.2-2.9.6-4.3 1.1V40.2h-11v10.3h-1.6V40.2h-11v10.3h-1.6V40.2h-11v10.3H46V40.2h-11v10.3h-1.6V40.2h-11v20.4H7.8C3.5 60.6.2 64 0 68.3v5.1c.5 15.6 11.2 29.8 26.5 34.3 29.2 8.6 63.8 2 81.3-19 8.2-8 15.4-15 19.8-23.7.8-1.6 1.4-3.3 1.9-5 .8-3.4-.6-8.6-3.8-10.7z"/>
        </svg>
      )
    },
    ngac: {
      name: 'Sentinel-NGAC',
      color: '#ec4899',
      bg: 'rgba(236, 72, 153, 0.15)',
      svg: (
        <svg viewBox="0 0 128 128" width={size} height={size}>
          <path fill="#EC4899" d="M64 6L14 26v38c0 32.5 21.3 62.8 50 70 28.7-7.2 50-37.5 50-70V26L64 6zm0 20c16.6 0 30 13.4 30 30 0 21.7-22.3 42.4-30 48.2-7.7-5.8-30-26.5-30-48.2 0-16.6 13.4-30 30-30z"/>
        </svg>
      )
    },
    extreact: {
      name: 'React.js',
      color: '#61dafb',
      bg: 'rgba(97, 218, 251, 0.15)',
      svg: (
        <svg viewBox="0 0 128 128" width={size} height={size}>
          <ellipse cx="64" cy="64" rx="14" ry="34" fill="none" stroke="#61DAFB" strokeWidth="8" transform="rotate(30 64 64)"/>
          <ellipse cx="64" cy="64" rx="14" ry="34" fill="none" stroke="#61DAFB" strokeWidth="8" transform="rotate(90 64 64)"/>
          <ellipse cx="64" cy="64" rx="14" ry="34" fill="none" stroke="#61DAFB" strokeWidth="8" transform="rotate(150 64 64)"/>
          <circle cx="64" cy="64" r="9" fill="#61DAFB"/>
        </svg>
      )
    },
    extvue: {
      name: 'Vue.js',
      color: '#42b883',
      bg: 'rgba(66, 184, 131, 0.15)',
      svg: (
        <svg viewBox="0 0 128 128" width={size} height={size}>
          <path fill="#42B883" d="M78.8 11.2L64 36.8 49.2 11.2H4.4L64 114.8l59.6-103.6H78.8z"/>
          <path fill="#35495E" d="M78.8 11.2L64 36.8 49.2 11.2H29.1L64 71.6l34.9-60.4H78.8z"/>
        </svg>
      )
    },
    extnode: {
      name: 'Node.js',
      color: '#339933',
      bg: 'rgba(51, 153, 51, 0.15)',
      svg: (
        <svg viewBox="0 0 128 128" width={size} height={size}>
          <path fill="#339933" d="M64 8l52 30v60L64 128 12 98V38L64 8zm0 18L28 47v44l36 21 36-21V47L64 26z"/>
        </svg>
      )
    },
    extaws: {
      name: 'AWS Cloud',
      color: '#ff9900',
      bg: 'rgba(255, 153, 0, 0.15)',
      svg: (
        <svg viewBox="0 0 128 128" width={size} height={size}>
          <path fill="#FF9900" d="M96 74c-12 9-28 14-44 14-22 0-42-8-56-22-1-1 0-3 1-2 15 8 33 13 52 13 14 0 29-3 42-10 2-1 4 1 3 3zM102 67c-1-1-6-1-13-1-2 0-3-1-1-2 5-3 14-2 15 0 1 1-1 10-6 13-1 1-2 0-2-1 1-2 3-6 3-7v-2z"/>
        </svg>
      )
    },
    extpentest: {
      name: 'Pentesting',
      color: '#f43f5e',
      bg: 'rgba(244, 63, 94, 0.15)',
      svg: (
        <svg viewBox="0 0 128 128" width={size} height={size}>
          <path fill="#F43F5E" d="M64 12L20 32v36c0 30 24 50 44 54 20-4 44-24 44-54V32L64 12zm0 24a20 20 0 1 1 0 40 20 20 0 0 1 0-40z"/>
        </svg>
      )
    }
  };

  let matched = topicMap[normalizedId];
  if (!matched) {
    if (normalizedId.includes('postgres')) matched = topicMap.postgres;
    else if (normalizedId.includes('oracle')) matched = topicMap.oracle;
    else if (normalizedId.includes('docker')) matched = topicMap.docker;
    else if (normalizedId.includes('ngac')) matched = topicMap.ngac;
    else if (normalizedId.includes('react')) matched = topicMap.extreact;
    else if (normalizedId.includes('vue')) matched = topicMap.extvue;
    else if (normalizedId.includes('node')) matched = topicMap.extnode;
    else if (normalizedId.includes('aws')) matched = topicMap.extaws;
    else if (normalizedId.includes('pentest')) matched = topicMap.extpentest;
  }

  if (matched) {
    return (
      <div 
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '8px',
          borderRadius: '10px',
          background: matched.bg,
          border: `1px solid ${matched.color}40`,
          boxShadow: `0 2px 10px ${matched.color}20`,
          flexShrink: 0
        }}
        title={matched.name}
      >
        {matched.svg}
      </div>
    );
  }

  // Fallback a ícono genérico en contenedor con estilo
  return (
    <div 
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        borderRadius: '10px',
        background: 'rgba(99, 102, 241, 0.15)',
        border: '1px solid rgba(99, 102, 241, 0.3)',
        color: 'var(--accent-secondary)',
        fontSize: '1.4rem',
        flexShrink: 0
      }}
    >
      <span className="material-symbols-rounded">school</span>
    </div>
  );
};
