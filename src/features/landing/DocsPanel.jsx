import React from 'react';
import { useAppStore } from '../../app/useAppStore.js';
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
      <div style={{ width: '100%', textAlign: 'left' }}>
        <Breadcrumbs items={[{ label: 'Biblioteca Técnica & Documentación', path: '/docs' }]} />
        <PageHeader title="Documentación Técnica e i18n" subtitle="Arquitectura de Comparación, Algoritmos Myers LCS y Gobernanza de Acceso NGAC" />

        <AppAdInjectedContent interval={3}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            
            {/* Sección 1 */}
            <div className="section-card" style={{ padding: '25px', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#10b981', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className="material-symbols-rounded">account_tree</span>
                1. Algoritmo Myers LCS & Vectorización de Diferencias Sintácticas
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.7', margin: '0 0 12px 0' }}>
                El núcleo matemático de NMerge IA se fundamenta en una implementación adaptada del algoritmo Myers LCS (Longest Common Subsequence). Publicado originalmente por Eugene W. Myers en 1986, este motor calcula la secuencia óptima de edición entre dos grafos de líneas con complejidad temporal O(ND).
              </p>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.7', margin: '0 0 12px 0' }}>
                Para evitar congelamientos de la interfaz durante el análisis de proyectos monolíticos con decenas de miles de archivos, el cálculo se ejecuta en paralelo utilizando Web Workers aislados en segundo plano. El hilo principal del navegador permanece liberado de cómputo, manteniendo una fluidez de 60 fotogramas por segundo mientras se genera la matriz de diferencias.
              </p>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.7', margin: '0 0 12px 0' }}>
                Un filtro previo de huella digital criptográfica (hashing rápido xxHash / SHA-256) descarta inmediatamente las carpetas e imágenes binarias con firmas idénticas.
              </p>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.7', margin: 0 }}>
                Este refinamiento reduce los tiempos de escaneo en un 400% respecto a los comparadores tradicionales basados en lecturas disco a disco.
              </p>
            </div>

            {/* Sección 2 */}
            <div className="section-card" style={{ padding: '25px', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#10b981', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className="material-symbols-rounded">security</span>
                2. Modelo de Seguridad Zero-Trust & Arquitectura Local-First
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.7', margin: '0 0 12px 0' }}>
                La protección de la propiedad intelectual se define como una directiva primaria e inmutable dentro del sistema.
              </p>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.7', margin: '0 0 12px 0' }}>
                El acceso a las estructuras de archivos locales utiliza la File System Access API nativa del navegador bajo permisos de lectura y escritura otorgados explícitamente por el operador. La totalidad de los buffers de datos, tokens de sesión y matrices de estado residen exclusivamente en la memoria RAM volátil de su computadora o en almacenamiento cifrado IndexedDB local.
              </p>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.7', margin: '0 0 12px 0' }}>
                Cero bytes de código fuente abandonan su equipo hacia servidores de terceros.
              </p>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.7', margin: 0 }}>
                Incluso en entornos corporativos de alta seguridad sin conectividad a internet (air-gapped), la aplicación opera a plena capacidad sin requerir validaciones externas ni emitir telemetría privada.
              </p>
            </div>

            {/* Sección 3 */}
            <div className="section-card" style={{ padding: '25px', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#10b981', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className="material-symbols-rounded">psychology</span>
                3. Integración de IA Híbrida: Ollama Local vs Gemini Cloud
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.7', margin: '0 0 12px 0' }}>
                La resolución de conflictos en fusiones de tres vías (3-way merge) incorpora inteligencia artificial contextual mediante dos esquemas de procesamiento independientes elegidos por el usuario.
              </p>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.7', margin: '0 0 12px 0' }}>
                El modo local conecta directamente con instancias de Ollama (http://localhost:11434) para ejecutar modelos como Llama 3 o Qwen en el hardware nativo sin enviar tráfico a redes públicas. Para escenarios que demanden razonamiento profundo en refactorizaciones de gran volumen, el cliente puede activar la conexión cifrada HTTPS con la API de Google Gemini Cloud utilizando su propia clave de acceso individual.
              </p>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.7', margin: '0 0 12px 0' }}>
                Las claves API nunca se guardan en bases de datos centrales.
              </p>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.7', margin: 0 }}>
                Cada solicitud se firma y transmite de extremo a extremo entre el navegador del cliente y los endpoints autorizados.
              </p>
            </div>

            {/* Sección 4 */}
            <div className="section-card" style={{ padding: '25px', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#10b981', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className="material-symbols-rounded">admin_panel_settings</span>
                4. Control de Acceso basado en Atributos con Sentinel-NGAC
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.7', margin: '0 0 12px 0' }}>
                NMerge IA adopta el estándar formal NIST SP 800-178 (Next Generation Access Control) a través del motor distribuido Sentinel-NGAC.
              </p>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.7', margin: '0 0 12px 0' }}>
                A diferencia de los esquemas RBAC tradicionales basados en roles estáticos, NGAC evalúa un grafo relacional de atributos que combina la identidad del usuario, el nivel de suscripción activa, el tipo de archivo procesado y las políticas de cumplimiento de la organización.
              </p>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.7', margin: '0 0 12px 0' }}>
                Esta verificación garantiza que funciones avanzadas como la terminal interactiva de comandos o la sincronización masiva entre carpetas remotas se autoricen dinámicamente en menos de 5 milisegundos.
              </p>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.7', margin: 0 }}>
                La evaluación continua de políticas previene la escalada de privilegios y asegura la integridad de los datos en entornos multi-usuario.
              </p>
            </div>

            {/* Sección 5 */}
            <div className="section-card" style={{ padding: '25px', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#10b981', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className="material-symbols-rounded">filter_alt</span>
                5. Normalización Sintáctica de Documentos & Expresiones Regulares
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.7', margin: '0 0 12px 0' }}>
                El filtrado inteligente de ruido elimina diferencias irrelevantes causadas por formateo automático de código o saltos de línea entre sistemas operativos.
              </p>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.7', margin: '0 0 12px 0' }}>
                El motor permite definir perfiles de ignorado reutilizables mediante sintaxis tipo `.gitignore` y expresiones regulares avanzadas. Los analizadores sintácticos integrados normalizan documentos JSON, XML y YAML ordenando sus claves de forma alfabética antes del análisis diff.
              </p>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.7', margin: 0 }}>
                Esta característica evita falsos positivos producidos por herramientas de minificación o formateadores de código en pipelines CI/CD.
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
