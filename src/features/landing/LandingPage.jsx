import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAppStore } from '../../app/useAppStore.js';
import { useTranslation } from 'react-i18next';
import logo from '../../assets/logo.png';

export const LandingPage = () => {
  const { t } = useTranslation();
  const { setActiveTab } = useAppStore();
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      q: "¿Cómo garantiza NMergeIA la privacidad de mi código fuente?",
      a: "NMergeIA opera bajo una arquitectura Local-First. Todo el procesamiento del algoritmo de comparación Myers LCS, la normalización sintáctica y las búsquedas se ejecutan localmente en la memoria de su navegador. Su código fuente y archivos jamás se transmiten a nuestros servidores."
    },
    {
      q: "¿Es compatible con cualquier tipo de archivo o lenguaje de programación?",
      a: "Sí. El comparador avanzado soporta cualquier archivo de texto plano (Javascript, Python, C++, HTML, CSS, Markdown, etc.). Cuenta además con normalizadores sintácticos específicos para JSON, YAML y XML, permitiendo ignorar variaciones de formato irrelevantes."
    },
    {
      q: "¿Cómo funciona el Asistente de IA Híbrido integrado?",
      a: "El asistente de IA le permite resolver conflictos de código de manera semántica. Puede configurarse con un modelo Ollama de ejecución local sin conexión a Internet (100% privado) o mediante las APIs seguras de Google Gemini en la nube ingresando su API Key personal cifrada."
    },
    {
      q: "¿Se pueden comparar múltiples carpetas y guardar el progreso?",
      a: "Sí. A través de la MatrixView multi-destino puede comparar una carpeta de origen contra múltiples destinos simultáneamente. Toda su configuración, filtros y matrices de estado se persisten localmente en IndexedDB para consultarlas en futuras sesiones."
    }
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "NMergeIA - Advanced Agentic Diffing & Merge Tool",
    "description": "Herramienta avanzada de comparación de directorios y fusión de código local-first con asistente de IA integrado y políticas dinámicas NGAC.",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Windows, macOS, Linux, Android, iOS",
    "browserRequirements": "Requires HTML5, WebGL and Javascript enabled.",
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD"
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      height: '100%',
      padding: '40px 20px',
      textAlign: 'center',
      background: 'radial-gradient(circle at top, var(--bg-tertiary) 0%, var(--bg-primary) 70%)',
      color: 'var(--text-primary)',
      fontFamily: '"Outfit", sans-serif',
      overflowY: 'auto',
      boxSizing: 'border-box'
    }}>
      <Helmet>
        <title>{t('app_title')} | Local-First Diff & AI Merge Tool</title>
        <meta name="description" content="NMergeIA es la herramienta número 1 para comparación de directorios y fusión semántica con IA. Local-First, segura, rápida y con soporte de traducción a 7 idiomas." />
        <meta name="keywords" content="diff tool, compare folders, git merge, local-first, myers lcs, code fusion, adsense approved" />
        <meta property="og:title" content="NMergeIA | Advanced Agentic Diff & Merge" />
        <meta property="og:description" content="Comparación de código y carpetas en 3D local-first con resolución semántica mediante IA." />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      </Helmet>

      {/* Hero Section */}
      <div style={{ maxWidth: '800px', margin: '0 auto 50px auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ marginBottom: '20px' }}>
          <img src={logo} alt="NMergeIA Logo" style={{ height: '95px', filter: 'drop-shadow(0 4px 20px rgba(16, 185, 129, 0.15))' }} />
        </div>
        
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.2)',
          padding: '6px 14px',
          borderRadius: '50px',
          fontSize: '0.8rem',
          fontWeight: '600',
          color: '#10b981',
          marginBottom: '25px'
        }}>
          <span className="material-symbols-rounded" style={{ fontSize: '0.95rem' }}>security</span>
          {t('sec_local_first')}
        </div>

        <h1 style={{
          fontSize: '3rem',
          fontWeight: '800',
          lineHeight: '1.2',
          margin: '0 0 20px 0',
          letterSpacing: '-0.03em',
          background: 'linear-gradient(135deg, var(--text-primary) 40%, var(--accent-secondary) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          {t('app_title')}
        </h1>

        <p style={{
          fontSize: '1.05rem',
          color: 'var(--text-secondary)',
          lineHeight: '1.6',
          maxWidth: '650px',
          margin: '0 auto 35px auto'
        }}>
          {t('landing_lead')}
        </p>

        {/* CTA Button */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button 
            className="btn primary-btn"
            onClick={() => setActiveTab('main')}
            style={{
              height: '52px',
              padding: '0 36px',
              fontSize: '1.05rem',
              fontWeight: '600',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              boxShadow: '0 4px 14px var(--accent-primary-glow)',
              cursor: 'pointer',
              border: 'none',
              color: '#ffffff',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}
          >
            <span className="material-symbols-rounded">compare</span>
            {t('btn_start_compare')}
          </button>
        </div>
      </div>

      {/* Guía de Funcionamiento (Glassmorphism UI) */}
      <div style={{
        maxWidth: '1200px',
        width: '100%',
        margin: '0 auto 40px auto',
        textAlign: 'left',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        backdropFilter: 'blur(12px)',
        borderRadius: '16px',
        padding: '35px',
        boxSizing: 'border-box'
      }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '25px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span className="material-symbols-rounded" style={{ color: '#10b981' }}>menu_book</span>
          {t('guide_title')}
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '30px'
        }}>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 10px 0' }}>
              <span className="material-symbols-rounded" style={{ color: '#3b82f6', fontSize: '1.15rem' }}>folder_open</span>
              {t('guide_step1_title')}
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0 }}>
              {t('guide_step1_desc')}
            </p>
          </div>

          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 10px 0' }}>
              <span className="material-symbols-rounded" style={{ color: '#10b981', fontSize: '1.15rem' }}>table_chart</span>
              {t('guide_step2_title')}
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0 }}>
              {t('guide_step2_desc')}
            </p>
          </div>

          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 10px 0' }}>
              <span className="material-symbols-rounded" style={{ color: '#a78bfa', fontSize: '1.15rem' }}>find_in_page</span>
              {t('guide_step3_title')}
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0 }}>
              {t('guide_step3_desc')}
            </p>
          </div>

          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 10px 0' }}>
              <span className="material-symbols-rounded" style={{ color: '#f59e0b', fontSize: '1.15rem' }}>cleaning_services</span>
              {t('guide_step4_title')}
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0 }}>
              {t('guide_step4_desc')}
            </p>
          </div>

          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 10px 0' }}>
              <span className="material-symbols-rounded" style={{ color: '#ec4899', fontSize: '1.15rem' }}>terminal</span>
              {t('guide_step5_title')}
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0 }}>
              {t('guide_step5_desc')}
            </p>
          </div>

          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 10px 0' }}>
              <span className="material-symbols-rounded" style={{ color: '#06b6d4', fontSize: '1.15rem' }}>history</span>
              {t('guide_step6_title')}
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0 }}>
              {t('guide_step6_desc')}
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Accordion Section (Para mejorar el volumen SEO y AdSense) */}
      <div style={{
        maxWidth: '1200px',
        width: '100%',
        margin: '0 auto 40px auto',
        textAlign: 'left',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        borderRadius: '16px',
        padding: '35px',
        boxSizing: 'border-box'
      }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '25px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span className="material-symbols-rounded" style={{ color: '#3b82f6' }}>help_center</span>
          Preguntas Frecuentes (FAQ)
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {faqs.map((faq, idx) => (
            <div 
              key={idx}
              style={{
                border: '1px solid var(--border-light)',
                borderRadius: '8px',
                background: 'var(--bg-tertiary)',
                overflow: 'hidden'
              }}
            >
              <button
                onClick={() => toggleFaq(idx)}
                style={{
                  width: '100%',
                  padding: '16px 20px',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--text-primary)',
                  fontWeight: '600',
                  fontSize: '0.95rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <span>{faq.q}</span>
                <span 
                  className="material-symbols-rounded"
                  style={{
                    transform: openFaq === idx ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease',
                    color: '#10b981'
                  }}
                >
                  expand_more
                </span>
              </button>
              {openFaq === idx && (
                <div style={{
                  padding: '0 20px 16px 20px',
                  fontSize: '0.85rem',
                  color: 'var(--text-secondary)',
                  lineHeight: '1.6',
                  borderTop: '1px solid var(--border-light)',
                  paddingTop: '16px'
                }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
