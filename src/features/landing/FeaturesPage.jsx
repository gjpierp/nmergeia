import React from 'react';
import { useAppStore } from '../../app/useAppStore.js';
import { useTranslation } from 'react-i18next';
import { Logo } from '../../shared/ui/Logo.jsx';
import { PageHeader } from '../../shared/ui/PageHeader.jsx';
import { Breadcrumbs } from '../../shared/ui/Breadcrumbs.jsx';

export const FeaturesPage = () => {
  const { t } = useTranslation();
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
      <div style={{ maxWidth: '900px', width: '100%', margin: '0 auto', textAlign: 'left' }}>
        <Breadcrumbs items={[{ label: 'Características Principales' }]} />
        <PageHeader title="Funcionalidades Clave y Capacidades Técnicas" subtitle="Herramienta Profesional de Comparación NMerge IA para Desarrolladores y Equipos DevOps" />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px', marginBottom: '40px' }}>
          {/* Feature 1 */}
          <div className="section-card" style={{ padding: '25px', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
            <h3 style={{ fontSize: '1.2rem', color: '#10b981', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="material-symbols-rounded">move_to_inbox</span>
              Carga Ultra Rápida con Drag & Drop
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0 }}>
              Arrastra cualquier directorio o conjunto de archivos directamente desde tu explorador nativo hacia los slots de comparación. StackUpIA resolverá de manera jerárquica y en milisegundos toda la topología de archivos para comenzar la inspección sin demoras.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="section-card" style={{ padding: '25px', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
            <h3 style={{ fontSize: '1.2rem', color: '#10b981', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="material-symbols-rounded">difference</span>
              Normalizadores Sintácticos Inteligentes
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0 }}>
              ¿Cansado de ver diferencias provocadas por un salto de línea extra o llaves desordenadas? Nuestros normalizadores inteligentes para JSON, XML y YAML ordenan las propiedades alfabéticamente y limpian los espacios en blanco para centrarte únicamente en las modificaciones de lógica y contenido real.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="section-card" style={{ padding: '25px', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
            <h3 style={{ fontSize: '1.2rem', color: '#10b981', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="material-symbols-rounded">psychology</span>
              Asistente de Fusión Semántica por IA
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0 }}>
              La resolución de conflictos nunca fue tan sencilla. En lugar de copiar bloques a ciegas, StackUpIA analiza semánticamente las diferencias y te propone una fusión inteligente y limpia del código, reduciendo la fricción en integraciones complejas.
            </p>
          </div>
        </div>

        <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'center' }}>
          <button className="premium-btn-secondary" onClick={() => setActiveTab('landing')}>
            <span className="material-symbols-rounded" style={{ marginRight: '8px' }}>arrow_back</span>
            Volver al Inicio
          </button>
        </div>
      </div>
    </div>
  );
};
