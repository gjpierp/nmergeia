import React from 'react';
import { Helmet } from 'react-helmet-async';
import { PageHeader } from '../../shared/ui/PageHeader.jsx';
import { Breadcrumbs } from '../../shared/ui/Breadcrumbs.jsx';

export const LegalNoticePage = () => {
  return (
    <div style={{
      width: '100%',
      
      padding: '40px 20px',
      color: 'var(--text-primary)',
      fontFamily: '"Outfit", sans-serif',
      lineHeight: '1.7',
      textAlign: 'left',
      overflowY: 'auto'
    }}>
      <Helmet>
        <title>NMerge IA | Aviso Legal e Información Corporativa</title>
        <meta name="description" content="Aviso legal, derechos de propiedad intelectual, gobernanza NGAC y exención de responsabilidad para la plataforma NMerge IA." />
      </Helmet>

      <Breadcrumbs items={[{ label: 'Aviso Legal', path: '/legal-notice' }]} />
      <PageHeader title="Aviso Legal e Información Corporativa" subtitle="Regulaciones Generales, Propiedad Intelectual, Licencia y Transparencia de Operaciones" />

      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '25px' }}>
        Identificación del titular del sitio web, régimen de responsabilidad, legislación aplicable y condiciones legales de uso de la plataforma NMerge IA.
      </p>

      <div className="section-card" style={{ padding: '30px', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <section>
          <h2 style={{ fontSize: '1.3rem', color: '#10b981', marginTop: 0 }}>1. Identificación Titular del Sitio Web (Datos Ley LSSI-CE)</h2>
          <p>
            En cumplimiento del deber de información dispuesto en la Ley 34/2002 de Servicios de la Sociedad de la Información y del Comercio Electrónico (LSSI-CE), el Reglamento General de Protección de Datos (GDPR 2016/679) y normativas internacionales equivalentes, se hacen constar los siguientes datos identificativos del titular de esta plataforma web:
          </p>
          <ul style={{ paddingLeft: '20px', color: 'var(--text-secondary)' }}>
            <li><strong>Denominación Social:</strong> StackUpIA Software Labs / NMerge Technologies</li>
            <li><strong>Dominio Oficial Registrado:</strong> <a href="https://nmergeia.com" style={{ color: 'var(--accent-secondary)' }}>https://nmergeia.com</a></li>
            <li><strong>Correo Electrónico de Contacto Institucional:</strong> contacto@nmergeia.com / legal@stackupia.com</li>
            <li><strong>Objeto Social y Actividad Principal:</strong> Desarrollo y distribución de herramientas de software especializado para comparación de código fuente, análisis de diferencias en matriz (Diffing), integración local asistida por IA y educación técnica.</li>
          </ul>
        </section>

        <section>
          <h2 style={{ fontSize: '1.3rem', color: '#10b981' }}>2. Derechos de Propiedad Intelectual e Industrial</h2>
          <p>
            Todos los elementos que forman la estructura visual y lógica de NMerge IA —incluyendo, pero no limitándose a: marcas registradas, nombres comerciales, logotipos, elementos gráficos de la interfaz (UI/UX), archivos JavaScript compilados, estilos CSS, componentes React, arquitectura de menús y el motor de cálculo basado en el algoritmo Myers LCS— son propiedad exclusiva de <strong>StackUpIA Software Labs</strong> o cuentan con las licencias correspondientes otorgadas por sus titulares.
          </p>
          <p>
            Queda estrictamente prohibida la reproducción total o parcial, modificación, distribución, comercialización o descompilación no autorizada del código fuente sin la previa autorización por escrito de los titulares. Las marcas y logotipos de terceros (como PostgreSQL, Docker, Oracle, Google Cloud, AWS) pertenecen a sus respectivos dueños y se citan en esta web con fines puramente informativos y descriptivos dentro del ámbito educativo y técnico.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.3rem', color: '#10b981' }}>3. Exención de Responsabilidad y Naturaleza Local-First</h2>
          <p>
            NMerge IA opera como una herramienta cliente ejecutable directamente en la memoria volátil del navegador web del usuario a través de la File System Access API nativa. Debido a esta naturaleza <strong>Local-First Privacy by Design</strong>:
          </p>
          <ul style={{ paddingLeft: '20px', color: 'var(--text-secondary)' }}>
            <li><strong>Responsabilidad sobre Archivos y Respaldos:</strong> El usuario es el único y exclusivo responsable de realizar copias de seguridad (backups) de su código fuente y archivos de configuración (.env, .json, .sql) antes de ejecutar operaciones de combinación o escritura (Merge / Override). NMerge IA no asume ninguna responsabilidad por pérdidas de información provocadas por decisiones deliberadas del operador.</li>
            <li><strong>Disponibilidad Técnica:</strong> Si bien realizamos esfuerzos continuos para garantizar el funcionamiento ininterrumpido del sitio, no garantizamos la ausencia de caídas del servidor motivadas por mantenimiento, actualizaciones de la red o fallas ajenas en proveedores de infraestructura en la nube.</li>
          </ul>
        </section>

        <section>
          <h2 style={{ fontSize: '1.3rem', color: '#10b981' }}>4. Gobernanza de Seguridad con Sentinel-NGAC</h2>
          <p>
            El acceso a las funcionalidades avanzadas, el control de roles de usuario (ROLE_INVITADO, ROLE_REGISTRADO, ROLE_PREMIUM) y la visibilidad de los recursos publicitarios de Google AdSense se encuentran regulados de forma inmutable por el motor de seguridad <strong>Sentinel-NGAC</strong>.
          </p>
          <p>
            Sentinel implementa el estándar NGAC (Next Generation Access Control de NIST SP 800-178), verificando atributos de sesión de forma dinámica para prevenir cualquier bypass de seguridad o elevación no autorizada de privilegios en el frontend.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.3rem', color: '#10b981' }}>5. Enlaces Externos e Integración Publicitaria</h2>
          <p>
            Esta web puede contener enlaces hacia sitios web de terceros o anuncios servidos por Google AdSense. StackUpIA Software Labs no ejerce control sobre dichos sitios externos y rechaza toda responsabilidad por sus contenidos, políticas de privacidad o prácticas de rastreo. Recomendamos leer los términos y condiciones específicos de cada sitio externo que visite.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.3rem', color: '#10b981' }}>6. Jurisdicción y Legislación Aplicable</h2>
          <p>
            Para la resolución de todas las controversias o cuestiones relacionadas con el presente sitio web o de las actividades en él desarrolladas, será de aplicación la legislación española e internacional vigente, sometiéndose expresamente las partes a la jurisdicción de los Juzgados y Tribunales competentes.
          </p>
        </section>
      </div>
    </div>
  );
};
