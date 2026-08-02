import React from 'react';
import { useAppStore } from '../../app/useAppStore.js';
import { useTranslation } from 'react-i18next';
import { Logo } from '../../shared/ui/Logo.jsx';
import { Breadcrumbs } from '../../shared/ui/Breadcrumbs.jsx';

export const AboutPage = () => {
  const { setActiveTab } = useAppStore();
  const { i18n } = useTranslation();
  const isEn = i18n?.language?.startsWith('en');

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      height: '100%',
      padding: '40px 20px',
      background: 'radial-gradient(circle at top, var(--bg-tertiary) 0%, var(--bg-primary) 70%)',
      color: 'var(--text-primary)',
      fontFamily: '"Outfit", sans-serif',
      overflowY: 'auto',
      boxSizing: 'border-box'
    }}>
      <div style={{ width: '100%', width: '100%',  textAlign: 'left' }}>
        <Breadcrumbs items={[{ label: 'Sobre Nosotros (EEAT)' }]} />
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px', borderBottom: '1px solid var(--border-light)', paddingBottom: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <Logo height="42px" alt="NMerge IA - Logo Sobre Nosotros" />
            <div>
              <h1 style={{ fontSize: '2rem', fontWeight: '800', margin: 0, color: 'var(--text-primary)' }}>
                {isEn ? 'About Us (EEAT) & Architecture' : 'Sobre Nosotros (EEAT) & Arquitectura'}
              </h1>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>
                {isEn ? 'Meet the engineering team behind NMerge IA and our mission' : 'Conozca al equipo detrás de NMerge IA y nuestra misión'}
              </span>
            </div>
          </div>
        </div>

        {!isEn ? (
          <div className="section-card" style={{ padding: '35px', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-light)', lineHeight: '1.7' }}>
            <h2 style={{ fontSize: '1.4rem', color: '#10b981', marginTop: 0 }}>1. Nuestra Misión y Visión Tecnológica</h2>
            <p>
              <strong>NMerge IA</strong> es una plataforma de ingeniería de software desarrollada por <strong>StackUpIA Software Labs</strong>. Nuestra misión es empoderar a desarrolladores, administradores de bases de datos y analistas con herramientas de alto rendimiento para el análisis sintáctico de diferencias (Diffing), sincronización de carpetas en matriz y resolución asistida de conflictos de código sin comprometer la privacidad ni la propiedad intelectual.
            </p>
            <p>
              A diferencia de las herramientas convencionales que suben el código fuente a servidores remotos para procesar diferencias, NMerge IA fue diseñada bajo el paradigma inquebrantable de <strong>Local-First Privacy by Design</strong>. Todo el procesamiento computacional ocurre directamente en la memoria volátil del navegador del usuario utilizando aceleración por Web Workers y la API estandarizada de <em>File System Access</em> de Chromium.
            </p>

            <h2 style={{ fontSize: '1.4rem', color: '#10b981', marginTop: '30px' }}>2. Experiencia, Autoridad y Confianza (EEAT)</h2>
            <p>
              En el desarrollo de NMerge IA participan ingenieros senior de software con más de 15 años de trayectoria acumulada en arquitectura de sistemas distribuidos, seguridad informática y algoritmos de optimización de cadenas de texto. El núcleo de nuestra solución implementa el algoritmo <strong>Myers LCS (Longest Common Subsequence)</strong> optimizado en memoria, complementado con el motor de edición profesional <strong>Monaco Editor</strong> (el mismo núcleo que impulsa Visual Studio Code).
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '15px', margin: '20px 0' }}>
              <div style={{ padding: '15px', background: 'var(--bg-tertiary)', borderRadius: '8px', borderLeft: '4px solid #10b981' }}>
                <h4 style={{ margin: '0 0 5px 0', color: 'var(--text-primary)' }}>Ingeniería de Privacidad</h4>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Garantizamos auditoría completa Zero-Trust. Sus archivos locales no abandonan su dispositivo durante el proceso de comparación.</p>
              </div>
              <div style={{ padding: '15px', background: 'var(--bg-tertiary)', borderRadius: '8px', borderLeft: '4px solid #3b82f6' }}>
                <h4 style={{ margin: '0 0 5px 0', color: 'var(--text-primary)' }}>Control de Accesos NGAC</h4>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Integramos Sentinel-NGAC (Next Generation Access Control) para gobernar los permisos de funciones premium y publicidad transparente.</p>
              </div>
              <div style={{ padding: '15px', background: 'var(--bg-tertiary)', borderRadius: '8px', borderLeft: '4px solid #8b5cf6' }}>
                <h4 style={{ margin: '0 0 5px 0', color: 'var(--text-primary)' }}>Asistencia de IA Responsable</h4>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Los módulos de IA son opcionales y conectan exclusivamente mediante API Keys del usuario hacia proveedores oficiales (Ollama u Google Cloud).</p>
              </div>
            </div>

            <h2 style={{ fontSize: '1.4rem', color: '#10b981', marginTop: '30px' }}>3. Arquitectura del Motor y Seguridad</h2>
            <p>
              NMerge IA combina tecnologías web modernas como React 19, Vite, Zustand para la gestión de estado reactivo y Vitest para la verificación automatizada de calidad. Los módulos clave de nuestra arquitectura incluyen:
            </p>
            <ul style={{ paddingLeft: '20px', color: 'var(--text-secondary)' }}>
              <li><strong>Motor Matrix Processing:</strong> Permite comparar una carpeta origen contra múltiples carpetas destino simultáneamente en un plano multidimensional.</li>
              <li><strong>Filtros Avanzados (filtro.txt):</strong> Soporte completo para patrones tipo .gitignore con inclusión (+) y exclusión (-) de extensiones o directorios en caliente.</li>
              <li><strong>Guías PostgreSQL de Producción:</strong> Tutoriales y herramientas analíticas especializadas en comparación y migración de esquemas de bases de datos relacionales.</li>
            </ul>

            <h2 style={{ fontSize: '1.4rem', color: '#10b981', marginTop: '30px' }}>4. Transparencia y Contacto Institucional</h2>
            <p>
              Respaldamos nuestro compromiso de servicio manteniendo canales de contacto directo para soporte técnico, auditorías de seguridad y sugerencias de mejoras comunitarias. Si desea comunicarse con nuestro equipo de ingeniería o consultar información corporativa adicional, puede escribirnos a <strong>contacto@nmergeia.com</strong> o visitar nuestra página de contacto.
            </p>

            <div style={{ marginTop: '40px', display: 'flex', gap: '15px' }}>
              <button className="btn primary-btn" onClick={() => setActiveTab('landing')}>
                <span className="material-symbols-rounded" style={{ marginRight: '8px' }}>arrow_back</span>
                Volver al Inicio
              </button>
              <button className="btn secondary-btn" onClick={() => setActiveTab('contact')}>
                <span className="material-symbols-rounded" style={{ marginRight: '8px' }}>mail</span>
                Ir a Contacto
              </button>
            </div>
          </div>
        ) : (
          <div className="section-card" style={{ padding: '35px', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-light)', lineHeight: '1.7' }}>
            <h2 style={{ fontSize: '1.4rem', color: '#10b981', marginTop: 0 }}>1. Our Mission and Technological Vision</h2>
            <p>
              <strong>NMerge IA</strong> is a software engineering platform developed by <strong>StackUpIA Software Labs</strong>. Our mission is to empower developers, database administrators, and technical analysts with high-performance tools for diffing, matrix folder synchronization, and AI-assisted code conflict resolution without compromising privacy or intellectual property.
            </p>
            <p>
              Unlike conventional web tools that upload your source code to remote servers to process file differences, NMerge IA was engineered from the ground up under a strict <strong>Local-First Privacy by Design</strong> paradigm. All computing tasks run directly inside the user's browser volatile memory using Web Workers and the standardized Chromium <em>File System Access API</em>.
            </p>

            <h2 style={{ fontSize: '1.4rem', color: '#10b981', marginTop: '30px' }}>2. Expertise, Authoritativeness & Trustworthiness (EEAT)</h2>
            <p>
              NMerge IA is designed and maintained by senior software engineers with over 15 years of combined experience in distributed systems architecture, cybersecurity, and string optimization algorithms. At its core, NMerge IA implements an in-memory optimized <strong>Myers LCS (Longest Common Subsequence)</strong> algorithm, paired with the industry-standard <strong>Monaco Editor</strong> (the editing engine powering Visual Studio Code).
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '15px', margin: '20px 0' }}>
              <div style={{ padding: '15px', background: 'var(--bg-tertiary)', borderRadius: '8px', borderLeft: '4px solid #10b981' }}>
                <h4 style={{ margin: '0 0 5px 0', color: 'var(--text-primary)' }}>Privacy Engineering</h4>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>We guarantee complete Zero-Trust auditing. Your local files never leave your machine during comparisons.</p>
              </div>
              <div style={{ padding: '15px', background: 'var(--bg-tertiary)', borderRadius: '8px', borderLeft: '4px solid #3b82f6' }}>
                <h4 style={{ margin: '0 0 5px 0', color: 'var(--text-primary)' }}>NGAC Access Control</h4>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Sentinel-NGAC (Next Generation Access Control) governs access rights for premium tiers and transparent ads.</p>
              </div>
              <div style={{ padding: '15px', background: 'var(--bg-tertiary)', borderRadius: '8px', borderLeft: '4px solid #8b5cf6' }}>
                <h4 style={{ margin: '0 0 5px 0', color: 'var(--text-primary)' }}>Responsible AI Integration</h4>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>AI features are optional and connect strictly using user-provided API keys directly to official channels (Ollama / Google Cloud).</p>
              </div>
            </div>

            <h2 style={{ fontSize: '1.4rem', color: '#10b981', marginTop: '30px' }}>3. Engine Architecture & Security Standards</h2>
            <p>
              NMerge IA brings together cutting-edge modern web technologies including React 19, Vite, Zustand for state management, and Vitest for automated quality assurance. Key modules of our architecture include:
            </p>
            <ul style={{ paddingLeft: '20px', color: 'var(--text-secondary)' }}>
              <li><strong>Matrix Processing Engine:</strong> Allows comparing a source directory against multiple destination folders simultaneously.</li>
              <li><strong>Advanced Filtering (filtro.txt):</strong> Full support for .gitignore style rules with instant inclusion (+) and exclusion (-) patterns.</li>
              <li><strong>Production PostgreSQL Guides:</strong> Expert documentation and analytical tools for database schema comparison and migration.</li>
            </ul>

            <h2 style={{ fontSize: '1.4rem', color: '#10b981', marginTop: '30px' }}>4. Corporate Transparency & Contact</h2>
            <p>
              We stand by our commitment to service excellence by maintaining direct communication channels for technical support, security audits, and feature requests. To reach out to our engineering team or inquire about corporate inquiries, email us at <strong>contacto@nmergeia.com</strong> or visit our Contact page.
            </p>

            <div style={{ marginTop: '40px', display: 'flex', gap: '15px' }}>
              <button className="btn primary-btn" onClick={() => setActiveTab('landing')}>
                <span className="material-symbols-rounded" style={{ marginRight: '8px' }}>arrow_back</span>
                Back to Home
              </button>
              <button className="btn secondary-btn" onClick={() => setActiveTab('contact')}>
                <span className="material-symbols-rounded" style={{ marginRight: '8px' }}>mail</span>
                Go to Contact
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
