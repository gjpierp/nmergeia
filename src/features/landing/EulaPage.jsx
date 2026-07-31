import { PageHeader } from '../../shared/ui/PageHeader.jsx';
import React from 'react';
import { Helmet } from 'react-helmet-async';

export const EulaPage = () => {
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
        <title>Acuerdo de Licencia de Usuario Final (EULA) | StackUpIA</title>
        <meta name="description" content="Términos de la licencia de uso del ejecutable de escritorio StackUpIA." />
      </Helmet>

      <PageHeader title="Acuerdo de Licencia de Usuario Final (EULA)" />

      <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '25px' }}>
        Este acuerdo rige el uso del software ejecutable autoempaquetado de StackUpIA.
      </p>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '10px' }}>1. Concesión de Licencia</h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Se concede una licencia no exclusiva, personal e intransferible para instalar y ejecutar StackUpIA en sus dispositivos compatibles bajo los términos del plan adquirido (Invitado, Registrado o Pro).
        </p>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '10px' }}>2. Uso Aceptable</h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Queda prohibido descompilar, modificar la protección del ejecutable ofuscado o sublicenciar la aplicación sin autorización previa por escrito.
        </p>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '10px' }}>3. Garantía y Soporte</h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          El software se proporciona "tal cual" (*AS IS*). Las actualizaciones y mejoras continuas se distribuyen a través de los canales oficiales de StackUpIA.
        </p>
      </section>
    </div>
  );
};
