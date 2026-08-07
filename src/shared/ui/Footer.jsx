import React from 'react';
import { useAppStore } from '../../app/useAppStore.js';
import { useTranslation } from 'react-i18next';

/**
 * @file Footer.jsx
 * @description Componente de Pie de Página Estandarizado (EEAT & Cumplimiento AdSense DART Cookie).
 * Reutilizable en todas las vistas de la plataforma NMerge IA y estandarizado para la suite de proyectos.
 */
export const Footer = ({ onNavigate }) => {
  const { setActiveTab } = useAppStore();
  const { i18n } = useTranslation();
  const isEn = i18n?.language?.startsWith('en');

  const handleNav = (tabId, path) => {
    if (onNavigate) {
      onNavigate(tabId, path);
    } else if (setActiveTab) {
      setActiveTab(tabId);
    }
  };

  return (
    <footer 
      className="app-footer-standard"
      style={{
        background: 'var(--bg-tertiary, #0f172a)',
        color: 'var(--text-tertiary, #94a3b8)',
        padding: '50px 20px 30px 20px',
        borderTop: '1px solid var(--border-color, rgba(255, 255, 255, 0.08))',
        fontFamily: '"Outfit", "Inter", sans-serif',
        width: '100%',
        boxSizing: 'border-box',
        marginTop: 'auto'
      }}
    >
      <div 
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '35px',
          marginBottom: '40px'
        }}
      >
        {/* Columna 1: Marca & EEAT */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <span className="material-symbols-rounded" style={{ fontSize: '2rem', color: 'var(--accent-primary, #06b6d4)' }}>
              compare_arrows
            </span>
            <strong style={{ fontSize: '1.4rem', color: 'var(--text-primary, #ffffff)' }}>NMerge IA</strong>
          </div>
          <p style={{ fontSize: '0.9rem', lineHeight: '1.6', color: 'var(--text-secondary, #cbd5e1)', margin: '0 0 16px 0' }}>
            {isEn 
              ? 'Professional Local-First directory comparison, matrix diffing, and AI-assisted semantic merge platform built with total privacy.' 
              : 'Plataforma profesional para comparación de directorios local-first, análisis de diferencias en matriz y fusión semántica asistida por IA con privacidad total.'}
          </p>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-tertiary, #64748b)' }}>
            © 2026 <strong>StackUpIA Software Labs</strong>. {isEn ? 'All rights reserved.' : 'Todos los derechos reservados.'}
          </div>
        </div>

        {/* Columna 2: Cumplimiento Legal & AdSense */}
        <div>
          <h4 style={{ color: 'var(--text-primary, #ffffff)', fontSize: '1.05rem', margin: '0 0 16px 0', borderBottom: '2px solid var(--accent-primary, #06b6d4)', paddingBottom: '6px', display: 'inline-block' }}>
            {isEn ? 'Legal & EEAT Compliance' : 'Páginas Legales y EEAT'}
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.9rem', lineHeight: '2.1' }}>
            <li>
              <a href="/privacy" onClick={(e) => { e.preventDefault(); handleNav('privacy', '/privacy'); }} style={{ color: 'var(--text-secondary, #cbd5e1)', textDecoration: 'none', transition: 'color 0.2s' }}>
                {isEn ? 'Privacy Policy (DART Cookie)' : 'Política de Privacidad (Cookie DART)'}
              </a>
            </li>
            <li>
              <a href="/terms" onClick={(e) => { e.preventDefault(); handleNav('terms', '/terms'); }} style={{ color: 'var(--text-secondary, #cbd5e1)', textDecoration: 'none', transition: 'color 0.2s' }}>
                {isEn ? 'Terms & Conditions' : 'Términos y Condiciones'}
              </a>
            </li>
            <li>
              <a href="/about" onClick={(e) => { e.preventDefault(); handleNav('about', '/about'); }} style={{ color: 'var(--text-secondary, #cbd5e1)', textDecoration: 'none', transition: 'color 0.2s' }}>
                {isEn ? 'About Us (EEAT Authority)' : 'Sobre Nosotros (EEAT)'}
              </a>
            </li>
            <li>
              <a href="/contact" onClick={(e) => { e.preventDefault(); handleNav('contact', '/contact'); }} style={{ color: 'var(--text-secondary, #cbd5e1)', textDecoration: 'none', transition: 'color 0.2s' }}>
                {isEn ? 'Contact & Support' : 'Contacto y Soporte'}
              </a>
            </li>
            <li>
              <a href="/cookie-policy" onClick={(e) => { e.preventDefault(); handleNav('cookie-policy', '/cookie-policy'); }} style={{ color: 'var(--text-secondary, #cbd5e1)', textDecoration: 'none', transition: 'color 0.2s' }}>
                {isEn ? 'Cookie Policy' : 'Política de Cookies'}
              </a>
            </li>
            <li>
              <a href="/legal-notice" onClick={(e) => { e.preventDefault(); handleNav('legal-notice', '/legal-notice'); }} style={{ color: 'var(--text-secondary, #cbd5e1)', textDecoration: 'none', transition: 'color 0.2s' }}>
                {isEn ? 'Legal Notice' : 'Aviso Legal'}
              </a>
            </li>
          </ul>
        </div>

        {/* Columna 3: Herramientas & Recursos */}
        <div>
          <h4 style={{ color: 'var(--text-primary, #ffffff)', fontSize: '1.05rem', margin: '0 0 16px 0', borderBottom: '2px solid var(--accent-secondary, #10b981)', paddingBottom: '6px', display: 'inline-block' }}>
            {isEn ? 'Tools & Platform' : 'Herramientas y Plataforma'}
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.9rem', lineHeight: '2.1' }}>
            <li>
              <a href="/main" onClick={(e) => { e.preventDefault(); handleNav('main', '/main'); }} style={{ color: 'var(--text-secondary, #cbd5e1)', textDecoration: 'none' }}>
                {isEn ? 'Matrix Diff Comparator' : 'Comparador Principal'}
              </a>
            </li>
            <li>
              <a href="/features" onClick={(e) => { e.preventDefault(); handleNav('features', '/features'); }} style={{ color: 'var(--text-secondary, #cbd5e1)', textDecoration: 'none' }}>
                {isEn ? 'Technical Features' : 'Características Técnicas'}
              </a>
            </li>
            <li>
              <a href="/pricing" onClick={(e) => { e.preventDefault(); handleNav('pricing', '/pricing'); }} style={{ color: 'var(--text-secondary, #cbd5e1)', textDecoration: 'none' }}>
                {isEn ? 'Plans & Pricing' : 'Planes y Precios'}
              </a>
            </li>
            <li>
              <a href="/faq" onClick={(e) => { e.preventDefault(); handleNav('faq', '/faq'); }} style={{ color: 'var(--text-secondary, #cbd5e1)', textDecoration: 'none' }}>
                {isEn ? 'Frequently Asked Questions' : 'Preguntas Frecuentes (FAQ)'}
              </a>
            </li>
            <li>
              <a href="/docs" onClick={(e) => { e.preventDefault(); handleNav('docs', '/docs'); }} style={{ color: 'var(--text-secondary, #cbd5e1)', textDecoration: 'none' }}>
                {isEn ? 'Technical Library' : 'Biblioteca Técnica'}
              </a>
            </li>
          </ul>
        </div>

        {/* Columna 4: SEO & Sitemap */}
        <div>
          <h4 style={{ color: 'var(--text-primary, #ffffff)', fontSize: '1.05rem', margin: '0 0 16px 0', borderBottom: '2px solid #8b5cf6', paddingBottom: '6px', display: 'inline-block' }}>
            {isEn ? 'Indexing & Sitemap' : 'Indexación y Sitemap'}
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.9rem', lineHeight: '2.1' }}>
            <li>
              <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary, #cbd5e1)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <span className="material-symbols-rounded" style={{ fontSize: '1.1rem', color: '#8b5cf6' }}>account_tree</span>
                {isEn ? 'Sitemap XML (Search Console)' : 'Mapa del Sitio (Sitemap XML)'}
              </a>
            </li>
            <li>
              <a href="/robots.txt" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary, #cbd5e1)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <span className="material-symbols-rounded" style={{ fontSize: '1.1rem', color: '#8b5cf6' }}>smart_toy</span>
                {isEn ? 'Robots.txt Crawler Standard' : 'Robots.txt (Estándar Googlebot)'}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div 
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          paddingTop: '20px',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '15px',
          fontSize: '0.8rem',
          color: 'var(--text-tertiary, #64748b)'
        }}
      >
        <div>
          <span>Google AdSense Authorized Publisher (ca-pub-1905747793263573)</span>
        </div>
        <div>
          <span>Local-First Air-Gapped Standard | GDPR & CCPA Compliant</span>
        </div>
      </div>
    </footer>
  );
};
