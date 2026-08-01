import React from 'react';
import { useAppStore } from '../../app/useAppStore.js';
import { Logo } from '../../shared/ui/Logo.jsx';
import { AppAdInjectedContent } from '../../app/core/components/AppAdInjectedContent.jsx';
import { PageHeader } from '../../shared/ui/PageHeader.jsx';
import { Breadcrumbs } from '../../shared/ui/Breadcrumbs.jsx';

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
        <Breadcrumbs items={[{ label: 'Biblioteca Técnica & Documentación' }]} />
        <PageHeader title="Documentación Técnica e i18n" subtitle="Arquitectura de Comparación, Algoritmos Myers LCS y Gobernanza de Acceso NGAC" />

        <AppAdInjectedContent interval={3}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            {/* Article 1 */}
            <div className="section-card" style={{ padding: '25px', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#10b981', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className="material-symbols-rounded">account_tree</span>
                1. El Algoritmo Myers LCS para Comparación de Archivos y Hashing Criptográfico
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.7', margin: '0 0 12px 0' }}>
                El motor de comparación de NMerge IA utiliza una variante optimizada y acelerada del algoritmo Myers LCS (Longest Common Subsequence). Propuesto por Eugene W. Myers en 1986, este algoritmo calcula de forma matemática y determinista la secuencia más corta de ediciones (inserciones, eliminaciones y sustituciones) requeridas para transformar un archivo fuente en una versión de destino.
              </p>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.7', margin: '0 0 12px 0' }}>
                NMerge IA aplica este algoritmo de forma asíncrona dentro de un Web Worker multihilo aislado. Esto permite procesar estructuras complejas de proyectos de software y archivos de código masivos sin bloquear el hilo principal (Main Thread) de la interfaz de usuario. Al delegar la carga pesada al hilo secundario, la visualización en 3D del árbol de archivos mantiene una velocidad constante de 60 fotogramas por segundo (FPS) en el navegador.
              </p>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.7', margin: 0 }}>
                Adicionalmente, se integra una capa preliminar de hashing rápido (xxHash / SHA-256) que compara firmas de bloques antes de ejecutar la matriz de diferencias completa, optimizando el rendimiento en un 400% para carpetas con miles de subdirectorios.
              </p>
            </div>

            {/* Article 2 */}
            <div className="section-card" style={{ padding: '25px', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#10b981', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className="material-symbols-rounded">security</span>
                2. Arquitectura Local-First & Cero Confianza (Zero-Trust Privacy)
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.7', margin: '0 0 12px 0' }}>
                En NMerge IA, la privacidad y la seguridad de la propiedad intelectual son invariantes arquitectónicos. Toda la inspección de directorios y procesamiento de diferencias entre carpetas se ejecuta 100% en el entorno de ejecución local del cliente utilizando la File System Access API nativa de los navegadores modernos (Chromium / Edge).
              </p>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.7', margin: 0 }}>
                Ningún archivo, código fuente, variable de entorno (.env), secreto o clave privada de API abandona su computadora ni se transmite hacia servidores externos sin su consentimiento explícito. Al conectar un modelo LLM local como Ollama (vía http://localhost:11434), la resolución automática de conflictos de código se ejecuta de forma completamente fuera de línea (air-gapped), garantizando cumplimiento estricto con normativas ISO 27001, SOC 2 y GDPR.
              </p>
            </div>

            {/* Article 3 */}
            <div className="section-card" style={{ padding: '25px', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#10b981', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className="material-symbols-rounded">psychology</span>
                3. Fusión Asistida por Inteligencia Artificial Híbrida
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.7', margin: '0 0 12px 0' }}>
                A diferencia de las herramientas de comparación de código tradicionales, NMerge IA ofrece una capa de Inteligencia Artificial Híbrida. Cuando ocurren conflictos de fusión complejos de tres vías (3-way merge), el Asistente de IA puede proponer un bloque de código unificado combinando semánticamente los cambios en conflicto.
              </p>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.7', margin: 0 }}>
                Esta integración es híbrida porque puede configurarse localmente empleando modelos open-source ligeros (vía Ollama, ejecutando Llama o Qwen local en su puerto predeterminado 11434) o mediante los modelos avanzados de Google Gemini en la nube (a través del SDK oficial con API Key de forma directa y cifrada).
              </p>
            </div>

            {/* Article 4 */}
            <div className="section-card" style={{ padding: '25px', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#10b981', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className="material-symbols-rounded">admin_panel_settings</span>
                4. Control de Accesos y Seguridad Dinámica con Sentinel-NGAC
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.7', margin: '0 0 12px 0' }}>
                La seguridad del sistema y el flujo de navegación de NMerge IA se encuentran gobernados de manera estricta por Sentinel-NGAC. Este motor implementa el estándar NGAC (Next Generation Access Control) de NIST para verificar de forma dinámica y basada en atributos los permisos de acceso de cada usuario.
              </p>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.7', margin: 0 }}>
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
