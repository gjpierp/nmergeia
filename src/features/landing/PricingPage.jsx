import React from 'react';
import { useAppStore } from '../../app/useAppStore.js';
import { PageHeader } from '../../shared/ui/PageHeader.jsx';
import { Breadcrumbs } from '../../shared/ui/Breadcrumbs.jsx';

export const PricingPage = () => {
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
      <div style={{ width: '100%', textAlign: 'left' }}>
        <Breadcrumbs items={[{ label: 'Planes y Precios' }]} />
        <PageHeader title="Planes y Precios" subtitle="Modelo Transparente de Licenciamiento Local-First & Opciones para Desarrolladores y Equipos" />
        
        <p style={{ color: 'var(--text-secondary)', marginBottom: '30px', fontSize: '0.95rem', lineHeight: '1.7' }}>
          La plataforma NMerge IA garantiza un modelo de licenciamiento transparente basado en el valor técnico real sin suscripciones recurrentes ni costos ocultos.
        </p>

        {/* Pricing Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '30px',
          marginBottom: '40px'
        }}>
          {/* Plan Gratis */}
          <div className="section-card" style={{
            padding: '30px',
            background: 'var(--bg-secondary)',
            borderRadius: '12px',
            border: '1px solid var(--border-light)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative'
          }}>
            <h3 style={{ fontSize: '1.2rem', margin: '0 0 10px 0', color: 'var(--text-primary)' }}>Gratuito (Invitado)</h3>
            <div style={{ fontSize: '2rem', fontWeight: '800', margin: '10px 0', color: '#10b981' }}>$0 <span style={{ fontSize: '0.9rem', fontWeight: 'normal', color: 'var(--text-secondary)' }}>/ siempre</span></div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', minHeight: '40px', textAlign: 'center', lineHeight: '1.6' }}>Comparación local ilimitada de archivos y carpetas financiada mediante patrocinio publicitario no intrusivo.</p>
            <ul style={{ width: '100%', padding: '20px 0', borderTop: '1px solid var(--border-light)', borderBottom: '1px solid var(--border-light)', listStyle: 'none', margin: '20px 0', fontSize: '0.82rem', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span className="material-symbols-rounded" style={{ color: '#10b981', fontSize: '1.1rem' }}>check_circle</span> Motor Myers LCS multihilo</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span className="material-symbols-rounded" style={{ color: '#10b981', fontSize: '1.1rem' }}>check_circle</span> Normalizadores JSON / YAML / XML</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span className="material-symbols-rounded" style={{ color: '#10b981', fontSize: '1.1rem' }}>check_circle</span> 100% Procesamiento Local-First</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span className="material-symbols-rounded" style={{ color: '#ef4444', fontSize: '1.1rem' }}>cancel</span> Sin Asistente de IA Híbrido</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span className="material-symbols-rounded" style={{ color: '#ef4444', fontSize: '1.1rem' }}>cancel</span> Banners de soporte publicitario</li>
            </ul>
            <button className="premium-btn-secondary" style={{ width: '100%', height: '40px' }} onClick={() => setActiveTab('main')}>Comenzar Gratis</button>
          </div>

          {/* Plan Premium */}
          <div className="section-card" style={{
            padding: '30px',
            background: 'rgba(16, 185, 129, 0.03)',
            borderRadius: '12px',
            border: '2px solid #10b981',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
            boxShadow: '0 8px 24px rgba(16, 185, 129, 0.1)'
          }}>
            <div className="premium-badge" style={{ position: 'absolute', top: '-12px', background: 'var(--accent-secondary)', color: '#ffffff', border: 'none' }}>RECOMENDADO</div>
            <h3 style={{ fontSize: '1.2rem', margin: '0 0 10px 0', color: 'var(--text-primary)' }}>Registrado Premium</h3>
            <div style={{ fontSize: '2rem', fontWeight: '800', margin: '10px 0', color: '#10b981' }}>$19 <span style={{ fontSize: '0.9rem', fontWeight: 'normal', color: 'var(--text-secondary)' }}>/ pago único</span></div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', minHeight: '40px', textAlign: 'center', lineHeight: '1.6' }}>Licencia perpetua individual sin publicidad obligatoria y acceso total a IA Híbrida.</p>
            <ul style={{ width: '100%', padding: '20px 0', borderTop: '1px solid var(--border-light)', borderBottom: '1px solid var(--border-light)', listStyle: 'none', margin: '20px 0', fontSize: '0.82rem', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span className="material-symbols-rounded" style={{ color: '#10b981', fontSize: '1.1rem' }}>check_circle</span> Motor Myers LCS acelerado</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span className="material-symbols-rounded" style={{ color: '#10b981', fontSize: '1.1rem' }}>check_circle</span> 🤖 Asistente de IA Híbrido (Ollama / Gemini)</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span className="material-symbols-rounded" style={{ color: '#10b981', fontSize: '1.15rem' }}>check_circle</span> 🚫 Cero Anuncios (Ad-Free Total)</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span className="material-symbols-rounded" style={{ color: '#10b981', fontSize: '1.15rem' }}>check_circle</span> Historial Ilimitado & Exportaciones ZIP</li>
            </ul>
            <button className="premium-btn-primary" style={{ width: '100%', height: '40px' }} onClick={() => setActiveTab('register')}>Obtener Licencia Premium</button>
          </div>
        </div>

        {/* Secciones Explicativas Técnicas con Longitud de Párrafos Variable y Cero Muletillas */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px', marginTop: '30px' }}>
          
          <div className="section-card" style={{ padding: '25px', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
            <h3 style={{ fontSize: '1.15rem', color: '#10b981', margin: '0 0 10px 0' }}>Filosofía de Pago Único sin Cobros Recurrentes</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.7', margin: '0 0 12px 0' }}>
              La industria del software para desarrolladores ha sido dominada por esquemas de suscripción mensual que encarecen innecesariamente las herramientas de productividad básica.
            </p>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.7', margin: '0 0 12px 0' }}>
              NMerge IA rechaza este modelo cobrando una tarifa única de $19 USD por usuario. Al adquirir una clave de licencia activa, el cliente obtiene derechos de uso perpetuos sobre la aplicación web y las versiones ejecutables de escritorio para Windows, macOS y Linux.
            </p>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.7', margin: '0 0 12px 0' }}>
              Las actualizaciones de mantenimiento y parches de seguridad menores se distribuyen sin costo adicional.
            </p>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.7', margin: 0 }}>
              Esta política garantiza un retorno de inversión predecible sin comprometer el presupuesto operativo de desarrolladores independientes o pequeños estudios de ingeniería.
            </p>
          </div>

          <div className="section-card" style={{ padding: '25px', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
            <h3 style={{ fontSize: '1.15rem', color: '#10b981', margin: '0 0 10px 0' }}>Garantías de Privacidad Corporativa y Air-Gapped Compliance</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.7', margin: '0 0 12px 0' }}>
              Los entornos de desarrollo empresarial imponen restricciones severas de fuga de datos (Data Loss Prevention).
            </p>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.7', margin: '0 0 12px 0' }}>
              Tanto la versión Gratuita como la versión Premium procesan la comparación de archivos íntegramente en la máquina del cliente. En la modalidad sin costo, la publicidad se entrega mediante bloques aislados en el marco DOM sin acceso a las estructuras ni nombres de los archivos locales. En la versión Premium, todos los módulos publicitarios y scripts de seguimiento se deshabilitan por completo a nivel de compilación.
            </p>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.7', margin: '0 0 12px 0' }}>
              Organizaciones con políticas estricta de Cero Confianza (Zero-Trust) pueden desplegar los binarios empaquetados en redes aisladas de internet.
            </p>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.7', margin: 0 }}>
              El cumplimiento estricto con las normativas ISO 27001 y GDPR se mantiene inalterado independientemente del nivel de suscripción seleccionado.
            </p>
          </div>

          <div className="section-card" style={{ padding: '25px', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
            <h3 style={{ fontSize: '1.15rem', color: '#10b981', margin: '0 0 10px 0' }}>Diferencias de Infraestructura entre Cuentas Invitado y Premium</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.7', margin: '0 0 12px 0' }}>
              El plan Gratuito satisface las necesidades de ingenieros que realizan verificaciones ocasionales de diferencias entre directorios localizados.
            </p>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.7', margin: '0 0 12px 0' }}>
              El plan Premium desbloquea capacidades avanzadas como la resolución automatizada de conflictos mediante LLMs locales (Ollama) o nubes de alto rendimiento (Google Gemini Cloud), la gestión ilimitada de perfiles de exclusión por expresiones regulares, la sincronización masiva de proyectos y la exportación en paquetes comprimidos ZIP.
            </p>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.7', margin: 0 }}>
              El motor de autorización Sentinel-NGAC habilita de forma dinámica las características premium en menos de 5 milisegundos tras la inserción de la clave de licencia.
            </p>
          </div>

        </div>

        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '30px' }}>
          <button className="premium-btn-secondary" onClick={() => setActiveTab('landing')}>
            <span className="material-symbols-rounded" style={{ marginRight: '8px' }}>arrow_back</span>
            Volver al Inicio
          </button>
        </div>
      </div>
    </div>
  );
};
