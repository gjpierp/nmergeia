import React from 'react';
import { Helmet } from 'react-helmet-async';
import { PageHeader } from '../../shared/ui/PageHeader.jsx';
import { Breadcrumbs } from '../../shared/ui/Breadcrumbs.jsx';

export const EulaPage = () => {
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
        <title>NMerge IA | Acuerdo de Licencia de Usuario Final (EULA)</title>
        <meta name="description" content="Acuerdo de Licencia de Usuario Final (EULA), condiciones de concesión de software, privacidad Local-First y términos de uso para NMerge IA." />
      </Helmet>

      <Breadcrumbs items={[{ label: 'EULA (Licencia de Software)', path: '/eula' }]} />
      <PageHeader title="Acuerdo de Licencia de Usuario Final (EULA)" subtitle="Contrato de Licencia de Software, Ejecución Local-First y Gobernanza de Acceso" />

      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '25px' }}>
        Este Acuerdo de Licencia de Usuario Final ("EULA") es un contrato legalmente vinculante entre usted (persona física o entidad corporativa) y <strong>StackUpIA Software Labs / NMerge Technologies</strong> para el uso del software ejecutable y la aplicación web NMerge IA.
      </p>

      <div className="section-card" style={{ padding: '30px', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <section>
          <h2 style={{ fontSize: '1.3rem', color: '#10b981', marginTop: 0 }}>1. Concesión de Licencia Limitada e Intransferible</h2>
          <p>
            StackUpIA Software Labs le concede a usted una licencia limitada, personal, no exclusiva, revocable e intransferible para descargar, instalar y ejecutar la aplicación NMerge IA en sus dispositivos informáticos compatibles, únicamente de acuerdo con las especificaciones de este contrato y bajo el nivel de suscripción correspondiente (Invitado, Registrado o Premium).
          </p>
          <p>
            Esta licencia no constituye una venta del código fuente ni del motor binario subyacente. Todos los derechos no otorgados expresamente en este acuerdo quedan reservados de forma exclusiva por StackUpIA Software Labs.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.3rem', color: '#10b981' }}>2. Garantía de Arquitectura Local-First y Privacidad de Código</h2>
          <p>
            NMerge IA está diseñado bajo el estándar inalterable <strong>Local-First Privacy by Design</strong>. El software ejecuta la inspección de directorios, la matriz de comparación de diferencias (Diffing), el análisis sintáctico de esquemas (JSON, SQL, YAML) y la resolución de fusiones de código exclusivamente en el entorno de ejecución local del cliente (navegador Chromium / Web Worker multihilo).
          </p>
          <ul style={{ paddingLeft: '20px', color: 'var(--text-secondary)' }}>
            <li><strong>Ausencia de Telemetría de Código:</strong> NMerge IA no envía, replica ni almacena archivos de código fuente, secretos (.env) o datos corporativos en servidores externos.</li>
            <li><strong>Modelos de IA Locales (Ollama):</strong> Al conectar instancias de LLM locales (http://localhost:11434), todo el procesamiento semántico permanece desconectado de la red pública (Air-Gapped).</li>
          </ul>
        </section>

        <section>
          <h2 style={{ fontSize: '1.3rem', color: '#10b981' }}>3. Restricciones de Uso Aceptable e Ingeniería Inversa</h2>
          <p>
            Usted se compromete formalmente a no realizar ni permitir que terceros realicen ninguna de las siguientes acciones:
          </p>
          <ul style={{ paddingLeft: '20px', color: 'var(--text-secondary)' }}>
            <li>Descompilar, desensamblar, realizar ingeniería inversa o intentar extraer el código fuente ofuscado de los módulos core de la aplicación.</li>
            <li>Modificar, traducir, adaptar o crear trabajos derivados basados en la interfaz de usuario, lógica de menús o algoritmos de comparación de NMerge IA.</li>
            <li>Sublicenciar, alquilar, arrendar, vender o redistribuir comercialmente el ejecutable o sus licencias Pro a terceros sin autorización escrita explícita.</li>
            <li>Bypassear, desactivar o alterar las comprobaciones del motor de gobernanza <strong>Sentinel-NGAC</strong> que verifican atributos de roles e inyectan políticas de seguridad.</li>
          </ul>
        </section>

        <section>
          <h2 style={{ fontSize: '1.3rem', color: '#10b981' }}>4. Exención de Garantías (Cláusula "AS IS")</h2>
          <p>
            El software NMerge IA se proporciona "tal cual" (*AS IS*) y "según disponibilidad", sin garantías de ningún tipo, ya sean explícitas o implícitas. En la máxima medida permitida por la ley aplicable, StackUpIA Software Labs renuncia a cualquier garantía de comerciabilidad, idoneidad para un propósito particular y no infracción.
          </p>
          <p>
            StackUpIA no garantiza que el software sea ininterrumpido o libre de errores. El usuario asume toda la responsabilidad de verificar los resultados de las fusiones de archivos antes de sobrescribir código de producción.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.3rem', color: '#10b981' }}>5. Limitación de Responsabilidad</h2>
          <p>
            En ningún caso StackUpIA Software Labs será responsable ante usted o cualquier tercero por daños indirectos, incidentales, consecuentes, especiales o punitivos (incluyendo pérdida de beneficios, interrupción del negocio o pérdida de datos) derivados del uso o la imposibilidad de uso de NMerge IA.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.3rem', color: '#10b981' }}>6. Rescisión y Ley Aplicable</h2>
          <p>
            Este acuerdo de licencia continuará vigente hasta su rescisión. Sus derechos bajo esta licencia se darán por terminados automáticamente sin previo aviso si incumple cualquiera de los términos estipulados. Este contrato se rige por las leyes vigentes y cualquier disputa será sometida a los tribunales competentes.
          </p>
        </section>
      </div>
    </div>
  );
};
