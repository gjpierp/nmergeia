import React from 'react';
import { useAppStore } from '../../app/useAppStore.js';
import logo from '../../assets/logo.png';
import { AppAdInjectedContent } from '../../app/core/components/AppAdInjectedContent.jsx';
import { PageHeader } from '../../shared/ui/PageHeader.jsx';

export const DocsPanel = () => {
  const { setActiveTab } = useAppStore();

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
      <div style={{ maxWidth: '850px', width: '100%', margin: '0 auto', textAlign: 'left' }}>
        <PageHeader title="Documentación Técnica e i18n" />

        <AppAdInjectedContent interval={3}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
          {/* Article 1 */}
          <div className="section-card" style={{ padding: '25px', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
            <h3 style={{ fontSize: '1.2rem', color: '#10b981', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="material-symbols-rounded">account_tree</span>
              1. El Algoritmo Myers LCS para Comparación de Archivos
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6', margin: '0 0 10px 0' }}>
              El motor de comparación de StackUpIA utiliza una variante optimizada del algoritmo Myers LCS (Longest Common Subsequence). Propuesto por Eugene Myers en 1986, este algoritmo calcula de forma determinista la secuencia más corta de ediciones (inserciones y eliminaciones) necesarias para transformar un archivo en otro.
            </p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0 }}>
              StackUpIA aplica este algoritmo de forma asíncrona dentro de un Web Worker dedicado. Esto permite procesar estructuras complejas y archivos de gran tamaño sin bloquear el hilo principal (main thread) de la interfaz de usuario, garantizando una animación en 3D fluida y una tasa constante de 60 FPS en el navegador.
            </p>
          </div>

          {/* Article 2 */}
          <div className="section-card" style={{ padding: '25px', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
            <h3 style={{ fontSize: '1.2rem', color: '#10b981', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="material-symbols-rounded">psychology</span>
              2. Fusión Asistida por Inteligencia Artificial Híbrida
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6', margin: '0 0 10px 0' }}>
              A diferencia de las herramientas de comparación de código tradicionales, StackUpIA ofrece una capa de Inteligencia Artificial Híbrida. Cuando ocurren conflictos de fusión complejos de tres vías (3-way merge), el Asistente de IA puede proponer un bloque de código unificado combinando semánticamente los cambios en conflicto.
            </p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0 }}>
              Esta integración es híbrida porque puede configurarse localmente empleando modelos open-source ligeros (vía Ollama, ejecutando Llama o Qwen local en su puerto predeterminado 11434) o mediante los modelos avanzados de Google Gemini en la nube (a través del SDK oficial con API Key de forma directa y cifrada).
            </p>
          </div>

          {/* Article 3 */}
          <div className="section-card" style={{ padding: '25px', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
            <h3 style={{ fontSize: '1.2rem', color: '#10b981', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="material-symbols-rounded">security</span>
              3. Control de Accesos y Seguridad Dinámica con Sentinel-NGAC
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6', margin: '0 0 10px 0' }}>
              La seguridad del sistema y el flujo de navegación de StackUpIA se encuentran gobernados de manera estricta por Sentinel-NGAC. Este motor implementa el estándar NGAC (Next Generation Access Control) de NIST para verificar de forma dinámica y basada en atributos los permisos de acceso de cada usuario.
            </p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0 }}>
              Las políticas dinámicas definen qué rutas de la interfaz (como la MatrixView o el Panel de Filtros) y qué recursos publicitarios se cargan en base a la sesión del usuario (ROLE_INVITADO, ROLE_REGISTRADO o ROLE_REGISTRADO_PREMIUM). Los tokens y roles se validan localmente contra las políticas inyectadas por Sentinel.
            </p>
          </div>

          <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'center' }}>
            <button className="premium-btn-secondary" onClick={() => setActiveTab('landing')}>
              <span className="material-symbols-rounded" style={{ marginRight: '8px' }}>arrow_back</span>
              Volver al Inicio
            </button>
          </div>
        </div>
        </AppAdInjectedContent>
      </div>
    </div>
  );
};
