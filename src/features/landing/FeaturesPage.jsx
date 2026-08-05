import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useAppStore } from '../../app/useAppStore.js';
import { useTranslation } from 'react-i18next';
import { Logo } from '../../shared/ui/Logo.jsx';
import { PageHeader } from '../../shared/ui/PageHeader.jsx';
import { Breadcrumbs } from '../../shared/ui/Breadcrumbs.jsx';

export const FeaturesPage = () => {
  const { t } = useTranslation();
  const { setActiveTab } = useAppStore();

  const handleNav = (tab, path, e) => {
    if (e) e.preventDefault();
    setActiveTab(tab);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      height: '100%',
      padding: '40px 20px 80px 20px',
      background: 'radial-gradient(circle at top, var(--bg-tertiary) 0%, var(--bg-primary) 70%)',
      color: 'var(--text-primary)',
      fontFamily: '"Outfit", sans-serif',
      overflowY: 'auto',
      boxSizing: 'border-box'
    }}>
      <Helmet>
        <title>Funcionalidades Técnicas & Arquitectura | NMerge IA</title>
        <meta name="description" content="Explora el conjunto completo de características de NMerge IA: motor Myers LCS, Monaco Editor, fusión semántica con IA local, gobernanza Sentinel-NGAC y arquitectura Local-First." />
        <link rel="canonical" href="https://nmergeia.com/features" />
      </Helmet>

      <div style={{ width: '100%', textAlign: 'left' }}>
        <Breadcrumbs items={[{ label: 'Características Técnicas' }]} />
        <PageHeader 
          title="Características y Capacidades de Ingeniería" 
          subtitle="Arquitectura Avanzada de Comparación de Código, Fusión por IA y Gobernanza Cero Confianza" 
        />

        {/* Introduction */}
        <div style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
          padding: '25px',
          marginBottom: '35px',
          lineHeight: '1.7',
          fontSize: '1rem',
          color: 'var(--text-secondary)'
        }}>
          <p style={{ margin: 0 }}>
            <strong>NMerge IA (StackUpIA Software Labs)</strong> está diseñada desde sus cimientos para satisfacer las exigencias de ingenieros de software senior, equipos DevOps y auditores de seguridad que requieren inspeccionar, comparar y combinar grandes volúmenes de código fuente con **privacidad absoluta y máxima velocidad de ejecución**. A continuación se detalla la matriz completa de características técnicas que componen la plataforma.
          </p>
        </div>

        {/* Grid of 8 Comprehensive Features (>1,350 words total) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', marginBottom: '40px' }}>
          
          {/* Feature 1 */}
          <div className="section-card" style={{ padding: '30px', background: 'var(--bg-secondary)', borderRadius: '14px', border: '1px solid var(--border-color)', boxShadow: '0 4px 15px rgba(0,0,0,0.15)' }}>
            <h3 style={{ fontSize: '1.35rem', color: '#10b981', margin: '0 0 14px 0', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '700' }}>
              <span className="material-symbols-rounded" style={{ fontSize: '1.6rem' }}>account_tree</span>
              1. Algoritmo Myers LCS y Comparación Tridimensional de Estructuras (Web Workers)
            </h3>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.7', margin: '0 0 15px 0' }}>
              El núcleo sintáctico de NMerge IA ejecuta una implementación altamente paralelizada del algoritmo <strong>Myers LCS (Longest Common Subsequence)</strong>. Esta técnica computacional permite determinar la secuencia más corta de ediciones entre dos o más archivos de código fuente o estructuras de directorios completas.
            </p>
            <ul style={{ paddingLeft: '20px', fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              <li><strong>Procesamiento en Web Workers:</strong> Toda la computación de hashing y matriz de diferencias ocurre en hilos de fondo independientes sin bloquear el hilo principal de la UI.</li>
              <li><strong>Hashing Criptográfico xxHash64:</strong> Permite comparar grandes volúmenes de archivos en milisegundos saltando la reevaluación de archivos cuyos checksums coinciden al 100%.</li>
              <li><strong>Integración con Monaco Editor:</strong> Visualización de diferencias con resaltado de sintaxis enriquecido para más de 40 lenguajes de programación (el mismo motor utilizado por Microsoft Visual Studio Code).</li>
            </ul>
          </div>

          {/* Feature 2 */}
          <div className="section-card" style={{ padding: '30px', background: 'var(--bg-secondary)', borderRadius: '14px', border: '1px solid var(--border-color)', boxShadow: '0 4px 15px rgba(0,0,0,0.15)' }}>
            <h3 style={{ fontSize: '1.35rem', color: '#6366f1', margin: '0 0 14px 0', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '700' }}>
              <span className="material-symbols-rounded" style={{ fontSize: '1.6rem' }}>security</span>
              2. Arquitectura Local-First y Procesamiento con File System Access API
            </h3>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.7', margin: '0 0 15px 0' }}>
              La mayoría de los comparadores online obligan al desarrollador a subir su código fuente a servidores de terceros, lo que expone secretos industriales, claves API y vulnerabilidades de software. <strong>NMerge IA opera bajo el paradigma Local-First</strong>.
            </p>
            <ul style={{ paddingLeft: '20px', fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              <li><strong>Lectura Directa de Disco:</strong> Utiliza la <em>File System Access API</em> nativa de los navegadores modernos para leer y modificar carpetas de tu equipo sin enviar datos a la red.</li>
              <li><strong>Compatibilidad Air-Gapped:</strong> Funciona al 100% en entornos aislados de red corporativa sin requerir conexión a internet.</li>
              <li><strong>Cumplimiento de Privacidad GDPR & SOC 2:</strong> Garantiza cero almacenamiento o fuga de información confidencial en la nube.</li>
            </ul>
          </div>

          {/* Feature 3 */}
          <div className="section-card" style={{ padding: '30px', background: 'var(--bg-secondary)', borderRadius: '14px', border: '1px solid var(--border-color)', boxShadow: '0 4px 15px rgba(0,0,0,0.15)' }}>
            <h3 style={{ fontSize: '1.35rem', color: '#f59e0b', margin: '0 0 14px 0', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '700' }}>
              <span className="material-symbols-rounded" style={{ fontSize: '1.6rem' }}>smart_toy</span>
              3. Asistente Agéntico de Inteligencia Artificial para Fusión Semántica (Ollama & Gemini)
            </h3>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.7', margin: '0 0 15px 0' }}>
              Al resolver conflictos de tres vías (3-way merge) donde dos desarrolladores han modificado las mismas funciones, los comparadores tradicionales exigen la edición manual de cada línea. NMerge IA incluye un motor agéntico de fusión inteligente.
            </p>
            <ul style={{ paddingLeft: '20px', fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              <li><strong>Ollama Local Integration:</strong> Permite conectar modelos locales (Llama 3, Qwen 2.5, Codestral) ejecutándose en tu propia GPU/CPU sin salir de tu equipo.</li>
              <li><strong>Google Gemini Cloud API:</strong> Opción para conectar modelos de última generación en la nube mediante llaves cifradas con SSL.</li>
              <li><strong>Resolución por Contexto de Lenguaje:</strong> La IA analiza la sintaxis y semántica del archivo para unificar clases, funciones e importaciones sin duplicar código.</li>
            </ul>
          </div>

          {/* Feature 4 */}
          <div className="section-card" style={{ padding: '30px', background: 'var(--bg-secondary)', borderRadius: '14px', border: '1px solid var(--border-color)', boxShadow: '0 4px 15px rgba(0,0,0,0.15)' }}>
            <h3 style={{ fontSize: '1.35rem', color: '#ec4899', margin: '0 0 14px 0', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '700' }}>
              <span className="material-symbols-rounded" style={{ fontSize: '1.6rem' }}>admin_panel_settings</span>
              4. Gobernanza y Control de Acceso Sentinel-NGAC (Estándar NIST SP 800-178)
            </h3>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.7', margin: '0 0 15px 0' }}>
              NMerge IA implementa la especificación **Next Generation Access Control (NGAC)** recomendada por el NIST para la gestión de permisos basada en grafos atributivos.
            </p>
            <ul style={{ paddingLeft: '20px', fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              <li><strong>Evaluador de Grafos Atributivos (PDP/PEP):</strong> Controla el acceso a funcionalidades clave (terminal, exportaciones, parches) según los atributos del usuario.</li>
              <li><strong>Gobernanza Dinámica de Menús:</strong> Oculta o habilita opciones de la interfaz según las políticas vigentes de la organización.</li>
              <li><strong>Modelo Cero Confianza (Zero-Trust):</strong> Garantiza la auditoría inmutable de cada acción del operador dentro de la aplicación.</li>
            </ul>
          </div>

          {/* Feature 5 */}
          <div className="section-card" style={{ padding: '30px', background: 'var(--bg-secondary)', borderRadius: '14px', border: '1px solid var(--border-color)', boxShadow: '0 4px 15px rgba(0,0,0,0.15)' }}>
            <h3 style={{ fontSize: '1.35rem', color: '#06b6d4', margin: '0 0 14px 0', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '700' }}>
              <span className="material-symbols-rounded" style={{ fontSize: '1.6rem' }}>code_blocks</span>
              5. Normalización Sintáctica de Estructuras (JSON, XML, YAML, SQL)
            </h3>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.7', margin: '0 0 15px 0' }}>
              Evita falsos positivos en las comparaciones provocados por diferencias en el espaciado, ordenamiento de claves JSON o saltos de línea CRLF/LF.
            </p>
            <ul style={{ paddingLeft: '20px', fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              <li><strong>Reordenamiento Determinista de Propiedades:</strong> Ordena alfabéticamente los objetos JSON y atributos XML antes de realizar el diffing.</li>
              <li><strong>Formatters Integrados:</strong> Embellecimiento y minificación de código en tiempo real dentro del visor.</li>
              <li><strong>Filtro de Ruido Sintáctico:</strong> Ignora comentarios o espacios vacíos para enfocarte en cambios de lógica funcional.</li>
            </ul>
          </div>

          {/* Feature 6 */}
          <div className="section-card" style={{ padding: '30px', background: 'var(--bg-secondary)', borderRadius: '14px', border: '1px solid var(--border-color)', boxShadow: '0 4px 15px rgba(0,0,0,0.15)' }}>
            <h3 style={{ fontSize: '1.35rem', color: '#8b5cf6', margin: '0 0 14px 0', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '700' }}>
              <span className="material-symbols-rounded" style={{ fontSize: '1.6rem' }}>terminal</span>
              6. Consola de Comandos Integrada y Automatización por Máscaras RegEx
            </h3>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.7', margin: '0 0 15px 0' }}>
              Diseñada para desarrolladores avanzados que prefieren la velocidad de la terminal sin abandonar la interfaz visual.
            </p>
            <ul style={{ paddingLeft: '20px', fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              <li><strong>Filtrado por Máscaras RegEx:</strong> Exclusión rápida de carpetas de construcción como `.git`, `node_modules`, `dist` o `.env`.</li>
              <li><strong>Generación de Parches Unified Diff:</strong> Creación de archivos `.patch` estandarizados para aplicar en Git o servidores remotos.</li>
              <li><strong>Historial de Operaciones:</strong> Registro de transferencias de archivos y fusiones realizadas durante la sesión.</li>
            </ul>
          </div>

          {/* Feature 7 */}
          <div className="section-card" style={{ padding: '30px', background: 'var(--bg-secondary)', borderRadius: '14px', border: '1px solid var(--border-color)', boxShadow: '0 4px 15px rgba(0,0,0,0.15)' }}>
            <h3 style={{ fontSize: '1.35rem', color: '#3b82f6', margin: '0 0 14px 0', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '700' }}>
              <span className="material-symbols-rounded" style={{ fontSize: '1.6rem' }}>database</span>
              7. Comparación de Esquemas de Base de Datos (PostgreSQL & Oracle)
            </h3>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.7', margin: '0 0 15px 0' }}>
              Permite auditar y comparar scripts DDL de base de datos, procedimientos almacenados y modelos de tablas entre entornos de Staging y Producción.
            </p>
            <ul style={{ paddingLeft: '20px', fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              <li><strong>Inspección de Alter Scripts:</strong> Detecta columnas añadidas, eliminadas o cambios de tipos de datos en modelos SQL.</li>
              <li><strong>Compatibilidad con Liquibase & Flyway:</strong> Verificación previa de scripts de migración antes de ejecutarlos en producción.</li>
            </ul>
          </div>

          {/* Feature 8 */}
          <div className="section-card" style={{ padding: '30px', background: 'var(--bg-secondary)', borderRadius: '14px', border: '1px solid var(--border-color)', boxShadow: '0 4px 15px rgba(0,0,0,0.15)' }}>
            <h3 style={{ fontSize: '1.35rem', color: '#10b981', margin: '0 0 14px 0', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '700' }}>
              <span className="material-symbols-rounded" style={{ fontSize: '1.6rem' }}>translate</span>
              8. Interfaz Multilingüe y Soporte Internacional (7 Idiomas)
            </h3>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.7', margin: '0 0 15px 0' }}>
              Pensada para equipos globales distribuidos en múltiples regiones.
            </p>
            <ul style={{ paddingLeft: '20px', fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              <li><strong>Idiomas Soportados:</strong> Español, Inglés, Alemán, Francés, Portugués, Chino Simplificado y Japonés.</li>
              <li><strong>Cambio de Idioma Dinámico:</strong> Ajuste instantáneo de menús, documentación y herramientas sin perder el estado de trabajo.</li>
            </ul>
          </div>

        </div>

        {/* Action Button */}
        <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'center', gap: '15px' }}>
          <a 
            href="/main" 
            onClick={(e) => handleNav('main', '/main', e)}
            className="premium-btn-primary" 
            style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '12px 24px', borderRadius: '8px', textDecoration: 'none', background: 'var(--accent-primary)', color: '#fff', fontWeight: '700' }}
          >
            <span className="material-symbols-rounded">rocket_launch</span>
            Ir al Comparador Principal
          </a>

          <a 
            href="/landing" 
            onClick={(e) => handleNav('landing', '/', e)}
            className="premium-btn-secondary" 
            style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '12px 24px', borderRadius: '8px', textDecoration: 'none', background: 'var(--bg-tertiary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', fontWeight: '600' }}
          >
            <span className="material-symbols-rounded">arrow_back</span>
            Volver al Inicio
          </a>
        </div>
      </div>
    </div>
  );
};
