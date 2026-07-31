import { PageHeader } from '../../shared/ui/PageHeader.jsx';
import React from 'react';
import { Helmet } from 'react-helmet-async';

export const LegalNoticePage = () => {
  return (
    <div style={{
      maxWidth: '900px',
      margin: '0 auto',
      padding: '40px 20px',
      color: 'var(--text-primary)',
      fontFamily: '"Outfit", sans-serif',
      lineHeight: '1.7',
      textAlign: 'left'
    }}>
      <Helmet>
        <title>Aviso Legal y Descargo de Responsabilidad | StackUpIA</title>
        <meta name="description" content="Aviso legal, propiedad intelectual y descargo de responsabilidad para StackUpIA." />
      </Helmet>

      <PageHeader title="Aviso Legal e Información Corporativa" />

      <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '25px' }}>
        Información regulatoria sobre StackUpIA y condiciones de uso del software.
      </p>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '10px' }}>1. Propiedad Intelectual</h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Todos los derechos de marcas, logotipos, código fuente, algoritmos de comparación y diseño de interfaz de <strong>StackUpIA</strong> pertenecen a sus desarrolladores y titulares originales. Se prohíbe la ingeniería inversa no autorizada o redistribución comercial sin licencia Pro expresa.
        </p>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '10px' }}>2. Exención de Responsabilidad por Datos</h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          StackUpIA es una herramienta que se ejecuta localmente en el dispositivo del usuario. El usuario es el único responsable de respaldar sus archivos antes de aplicar fusiones (*merges*) o sobrescribir código. StackUpIA no asume responsabilidad por pérdida de datos resultante de decisiones del usuario durante la fusión.
        </p>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '10px' }}>3. Gobernanza NGAC</h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          El control de acceso y menús está regulado dinámicamente mediante la arquitectura Sentinel-NGAC (Next Generation Access Control), garantizando que las funciones Pro y administrativas cumplan con estándares estrictos de seguridad.
        </p>
      </section>
    </div>
  );
};
