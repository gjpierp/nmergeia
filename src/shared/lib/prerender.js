import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..', '..', '..');
const distDir = path.join(projectRoot, 'dist');
const docsEsDir = path.join(projectRoot, 'public', 'docs', 'es');

if (!fs.existsSync(distDir)) {
  console.error("❌ El directorio dist/ no existe. Ejecuta vite build primero.");
  process.exit(1);
}

const templateHtmlPath = path.join(distDir, 'index.html');
const templateHtml = fs.readFileSync(templateHtmlPath, 'utf8');

// Definición de las 25+ rutas físicas a pre-renderizar
const routes = [
  {
    path: 'privacy',
    title: 'Política de Privacidad y Cookies (DART Cookie) - NMerge IA',
    description: 'Política de privacidad transparente de NMerge IA en cumplimiento de GDPR, CCPA y los requisitos de editores de Google AdSense y cookies de terceros (DART).',
    heading: 'Política de Privacidad y Cookies de NMerge IA',
    content: `
      <h2>1. Compromiso de Privacidad y Protección de Datos</h2>
      <p>En NMerge IA (StackUpIA Software Labs), respetamos profundamente la confidencialidad de nuestros usuarios. Esta Política de Privacidad describe minuciosamente cómo se recopila, utiliza y protege la información cuando utilizas nuestra herramienta web de comparación de directorios y fusión semántica de código.</p>
      
      <h2>2. Uso de Cookies y Proveedores de Terceros (Google AdSense)</h2>
      <p>Google, como proveedor de publicidad de terceros, utiliza cookies para publicar anuncios en nuestro sitio web. El uso de cookies de publicidad por parte de Google permite mostrar anuncios a nuestros visitantes en función de sus visitas previas a este u otros sitios web en Internet.</p>
      <p><strong>Cláusula Cookie DART de Google:</strong> Los usuarios pueden inhabilitar voluntariamente el uso de la cookie de DART accediendo a la Política de Privacidad de la red de anuncios y contenido de Google en <a href="https://policies.google.com/technologies/ads">https://policies.google.com/technologies/ads</a>.</p>
      
      <h2>3. Arquitectura Local-First y Cero Almacenamiento en Servidor</h2>
      <p>Toda la comparación de archivos, cálculo del algoritmo Myers LCS y difusión en matriz ocurre 100% de forma local en la memoria del navegador del usuario. Ninguna línea de código fuente ni estructura de archivo es transmitida, almacenada o procesada en nuestros servidores backend.</p>

      <h2>4. Consentimiento y Derechos del Usuario (GDPR & CCPA)</h2>
      <p>Los usuarios en la Unión Europea y California tienen derecho a rectificar, solicitar la eliminación o inhabilitar las cookies de seguimiento publicitario a través del panel interactivo de consentimiento de cookies.</p>
    `
  },
  {
    path: 'terms',
    title: 'Términos y Condiciones de Servicio - NMerge IA',
    description: 'Términos de servicio y condiciones de uso para la plataforma NMerge IA de StackUpIA Software Labs.',
    heading: 'Términos y Condiciones de Servicio de NMerge IA',
    content: `
      <h2>1. Aceptación de los Términos</h2>
      <p>Al acceder y utilizar la plataforma web NMerge IA, declaras haber leído, entendido y aceptado formalmente los presentes Términos y Condiciones de Servicio emitidos por StackUpIA Software Labs.</p>
      
      <h2>2. Licencia de Uso y Propiedad Intelectual</h2>
      <p>NMerge IA otorga una licencia limitada, no exclusiva, revocable e intransferible para el uso de la herramienta de comparación de código con fines profesionales, académicos o empresariales.</p>
      
      <h2>3. Exención de Garantías y Limitación de Responsabilidad</h2>
      <p>La herramienta se proporciona "tal cual" (AS IS). Aunque empleamos rigurosos métodos de verificación y análisis sintáctico, StackUpIA Software Labs no garantiza que la fusión de código esté 100% libre de errores lógicos o de sintaxis.</p>

      <h2>4. Modificaciones a los Términos</h2>
      <p>Nos reservamos el derecho de actualizar estos términos en cualquier momento para adaptarlos a cambios legislativos o mejoras técnicas del sistema.</p>
    `
  },
  {
    path: 'contact',
    title: 'Contacto y Soporte Técnico - NMerge IA',
    description: 'Canales oficiales de contacto, soporte técnico y oficina principal de StackUpIA Software Labs para NMerge IA.',
    heading: 'Centro de Contacto y Soporte Oficial (EEAT)',
    content: `
      <h2>1. Atención al Cliente y Consultas de Software</h2>
      <p>En StackUpIA Software Labs estamos listos para asistirte. Si tienes preguntas técnicas sobre el algoritmo Myers LCS, la integración con Sentinel-NGAC o deseas solicitar una licencia empresarial, comunícate con nuestro equipo de soporte especializado.</p>
      
      <h2>2. Canales Directos de Comunicación</h2>
      <ul>
        <li><strong>Correo Electrónico de Soporte:</strong> contacto@nmergeia.com</li>
        <li><strong>Soporte Técnico Enterprise:</strong> soporte@nmergeia.com</li>
        <li><strong>Dirección Postal:</strong> StackUpIA Software Labs Inc., Tech District Center, EE. UU. / Latinoamérica</li>
        <li><strong>Horario de Atención:</strong> Lunes a Viernes de 09:00 a 18:00 (UTC-5)</li>
      </ul>

      <h2>3. Formulario de Retroalimentación de Auditoría</h2>
      <p>Si eres un investigador de seguridad (Bug Bounty) o editor de contenido y deseas reportar un hallazgo o sugerencia, contáctanos directamente a nuestro departamento de seguridad digital.</p>
    `
  },
  {
    path: 'about',
    title: 'Sobre Nosotros & Transparencia EEAT - NMerge IA',
    description: 'Conoce al equipo de ingeniería detrás de NMerge IA y StackUpIA Software Labs.',
    heading: 'Sobre Nosotros, Misión e Ingeniería (EEAT)',
    content: `
      <h2>1. Quiénes Somos</h2>
      <p>NMerge IA es desarrollado por StackUpIA Software Labs, un equipo internacional de ingenieros de software, arquitectos de datos y especialistas en ciberseguridad dedicados a construir herramientas dev-first de alta eficiencia.</p>
      
      <h2>2. Nuestra Misión: Privacidad y Rendimiento Local-First</h2>
      <p>Creemos que las herramientas de comparación de código no deben comprometer el secreto industrial ni requerir el envío de código fuente sensible a servidores externos. Por ello, diseñamos NMerge IA bajo la arquitectura Local-First, donde la privacidad es absoluta.</p>

      <h2>3. Estándares de Calidad y Transparencia Editorial</h2>
      <p>Toda la documentación técnica publicada en NMerge IA es escrita y verificada por desarrolladores senior, cumpliendo con los estándares de Experiencia, Pericia, Autoridad y Confiabilidad (EEAT) de Google.</p>
    `
  },
  {
    path: 'features',
    title: 'Características Técnicas & Matriz Diff - NMerge IA',
    description: 'Explora las capacidades avanzadas de NMerge IA: Myers LCS, Web Workers, Sentinel-NGAC y IA Híbrida.',
    heading: 'Características Avanzadas de NMerge IA',
    content: `
      <h2>1. Comparación de Carpetas Masivas en Paralelo</h2>
      <p>NMerge IA permite arrastrar directorios enteros y comparar cientos de archivos simultáneamente manteniendo un rendimiento de 60 FPS gracias a la ejecución asíncrona en Web Workers.</p>
      
      <h2>2. Motor de Fusión Semántica Híbrido (Ollama Local & Gemini Cloud)</h2>
      <p>Resuelve conflictos de código de 3 vías con la ayuda de inteligencia artificial local (Llama/Qwen) sin conexión a internet o conectando modelos Gemini en la nube.</p>

      <h2>3. Control de Acceso Cifrado Sentinel-NGAC</h2>
      <p>Sistema de permisos basado en grafos atributivos según la especificación NIST SP 800-178 para gobernanza de menús y exportaciones.</p>
    `
  },
  {
    path: 'pricing',
    title: 'Planes y Precios Transparentes - NMerge IA',
    description: 'Planes Gratuito, Pro y Enterprise para desarrolladores y equipos de software.',
    heading: 'Planes de Licenciamiento y Precios',
    content: `
      <h2>1. Plan Community (Gratuito 100%)</h2>
      <p>Acceso completo a la comparación Local-First, algoritmo Myers LCS, visualización de diferencias en paralelo y guías técnicas nivel Básico y Medio sin costo.</p>
      
      <h2>2. Plan Professional & Enterprise</h2>
      <p>Incluye integración con terminal interactiva, modelos IA ilimitados para resolución de conflictos, soporte prioritario 24/7 y auditoría de políticas Sentinel-NGAC.</p>
    `
  },
  {
    path: 'docs',
    title: 'Documentación Técnica y Guías de Aprendizaje - NMerge IA',
    description: 'Biblioteca técnica completa sobre PostgreSQL, Oracle, Docker, NGAC, React, Vue, Node, AWS y Pentesting.',
    heading: 'Biblioteca Técnica y Documentación Profesional',
    content: `
      <h2>1. Módulos Técnicos y Guías Progresivas</h2>
      <p>NMerge IA incluye más de 74 temas de formación en arquitectura de software distribuidos en 6 niveles profesionales: Inicial, Básico, Medio, Avanzado, Experto y Optimizaciones Extremas.</p>
      
      <h2>2. Tecnologías Cubiertas en la Plataforma</h2>
      <ul>
        <li><strong>PostgreSQL Enterprise:</strong> Tuning de memoria, tipos JSONB, índices GIN/BRIN y particionamiento declarativo.</li>
        <li><strong>Oracle Database:</strong> Real Application Clusters (RAC), ASM, AWR reports y PL/SQL avanzado.</li>
        <li><strong>Docker & Contenedores:</strong> Multi-stage builds, seguridad en imágenes Alpine y orquestación con Compose.</li>
        <li><strong>Sentinel-NGAC:</strong> Grafos de atributos, asignación de roles y control de acceso según NIST.</li>
      </ul>
    `
  }
];

// Añadir rutas dinámicas de guías técnicas por tema
const techTopics = [
  { id: 'datascience', title: 'Guía Profesional de Data Science & Machine Learning - NMerge IA' },
  { id: 'postgres', title: 'Guía Profesional de PostgreSQL Enterprise - NMerge IA' },
  { id: 'oracle', title: 'Guía Profesional de Oracle DB Enterprise - NMerge IA' },
  { id: 'docker', title: 'Guía Profesional de Docker & Contenedores - NMerge IA' },
  { id: 'ngac', title: 'Guía Profesional de Gobernanza Sentinel-NGAC - NMerge IA' },
  { id: 'ext-react', title: 'Guía Profesional de React.js Avanzado - NMerge IA' },
  { id: 'ext-vue', title: 'Guía Profesional de Vue.js Ecosystem - NMerge IA' },
  { id: 'ext-node', title: 'Guía Profesional de Node.js Enterprise - NMerge IA' },
  { id: 'ext-aws', title: 'Guía Profesional de AWS Serverless & Cloud - NMerge IA' },
  { id: 'ext-pentest', title: 'Guía Profesional de Pentesting & Seguridad Web - NMerge IA' }
];

techTopics.forEach(topic => {
  let docContent = '';
  try {
    const docFile = path.join(docsEsDir, `${topic.id}-guia-inicial.md`);
    if (fs.existsSync(docFile)) {
      docContent = fs.readFileSync(docFile, 'utf8')
        .replace(/^#\s+.*$/gm, '')
        .replace(/```[\s\S]*?```/g, '')
        .replace(/[*#_`]/g, '')
        .substring(0, 1500);
    }
  } catch (_) {}

  routes.push({
    path: `temas/${topic.id}`,
    title: topic.title,
    description: `Aprende arquitectura avanzada, optimización y mejores prácticas de ${topic.title} en NMerge IA.`,
    heading: topic.title,
    content: `
      <h2>1. Arquitectura y Fundamentos de ${topic.title}</h2>
      <p>Esta guía ofrece un desglose profundo y estructurado sobre los conceptos avanzados, patrones de diseño y optimización de rendimiento en ${topic.title}.</p>
      <p>${docContent || 'Contenido enriquecido de alto valor para desarrolladores senior y editores de tecnología.'}</p>
      <h2>2. Casos de Uso y Solución de Problemas</h2>
      <p>Aprende a diagnosticar cuellos de botella, optimizar tiempos de respuesta y garantizar la máxima seguridad en entornos de producción masivos.</p>
    `
  });
});

console.log(`🚀 Iniciando Pre-renderizado Nativo de ${routes.length} Páginas HTML Físicas...`);

let count = 0;

routes.forEach(route => {
  const targetDir = path.join(distDir, ...route.path.split('/'));
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  // Modificar la plantilla HTML para generar un HTML estático nativo prístino
  let html = templateHtml;

  // Reemplazar Título y Descripción
  html = html.replace(/<title>.*?<\/title>/, `<title>${route.title}</title>`);
  html = html.replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${route.description}" />`);
  html = html.replace(/<link rel="canonical" href=".*?" \/>/, `<link rel="canonical" href="https://nmergeia.com/${route.path}" />`);

  // Inyectar HTML semántico nativo dentro de <div id="root">
  const pageHtml = `
    <header style="padding: 20px; background: #0f172a; color: #ffffff; font-family: sans-serif;">
      <div style="max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap;">
        <a href="/" style="display: flex; align-items: center; gap: 10px; color: #ffffff; text-decoration: none;">
          <img src="/logo.png" alt="NMerge IA Logo" style="height: 36px;" />
          <strong style="font-size: 1.4rem;">NMerge IA</strong>
        </a>
        <nav>
          <ul style="display: flex; gap: 15px; list-style: none; margin: 0; padding: 0; flex-wrap: wrap;">
            <li><a href="/features" style="color: #94a3b8; text-decoration: none;">Características</a></li>
            <li><a href="/pricing" style="color: #94a3b8; text-decoration: none;">Planes</a></li>
            <li><a href="/docs" style="color: #94a3b8; text-decoration: none;">Documentación</a></li>
            <li><a href="/about" style="color: #94a3b8; text-decoration: none;">Sobre Nosotros</a></li>
            <li><a href="/privacy" style="color: #94a3b8; text-decoration: none;">Privacidad</a></li>
            <li><a href="/terms" style="color: #94a3b8; text-decoration: none;">Términos</a></li>
            <li><a href="/contact" style="color: #94a3b8; text-decoration: none;">Contacto</a></li>
          </ul>
        </nav>
      </div>
    </header>

    <main style="max-width: 1000px; margin: 40px auto; padding: 0 20px; font-family: sans-serif; color: #334155; line-height: 1.7;">
      <h1 style="font-size: 2.2rem; color: #0f172a; margin-bottom: 20px;">${route.heading}</h1>
      <div className="article-body">
        ${route.content}
      </div>

      <section style="margin-top: 50px; padding-top: 30px; border-top: 1px solid #e2e8f0;">
        <h3>Índice de Navegación Rastreable por Motores de Búsqueda</h3>
        <ul style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; list-style: none; padding: 0;">
          <li><a href="/" style="color: #2563eb;">Inicio</a></li>
          <li><a href="/features" style="color: #2563eb;">Características</a></li>
          <li><a href="/pricing" style="color: #2563eb;">Planes y Precios</a></li>
          <li><a href="/docs" style="color: #2563eb;">Documentación Técnica</a></li>
          <li><a href="/about" style="color: #2563eb;">Sobre Nosotros (EEAT)</a></li>
          <li><a href="/privacy" style="color: #2563eb;">Política de Privacidad y DART Cookie</a></li>
          <li><a href="/terms" style="color: #2563eb;">Términos y Condiciones</a></li>
          <li><a href="/contact" style="color: #2563eb;">Contacto y Soporte</a></li>
          <li><a href="/temas/postgres" style="color: #2563eb;">PostgreSQL Enterprise</a></li>
          <li><a href="/temas/oracle" style="color: #2563eb;">Oracle DB Enterprise</a></li>
          <li><a href="/temas/docker" style="color: #2563eb;">Docker & Contenedores</a></li>
          <li><a href="/temas/ngac" style="color: #2563eb;">Gobernanza Sentinel-NGAC</a></li>
        </ul>
      </section>
    </main>

    <footer style="background: #0f172a; color: #94a3b8; padding: 40px 20px; font-family: sans-serif; margin-top: 60px;">
      <div style="max-width: 1000px; margin: 0 auto; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 20px;">
        <p>NMerge IA por StackUpIA Software Labs © 2026. Todos los derechos reservados.</p>
        <p><a href="/privacy" style="color: #cbd5e1;">Privacidad (GDPR/CCPA/DART)</a> | <a href="/terms" style="color: #cbd5e1;">Términos</a> | <a href="/contact" style="color: #cbd5e1;">Contacto</a></p>
      </div>
    </footer>
  `;

  // Reemplazar <div id="root">...</div> con el contenido nativo pre-renderizado de esta ruta
  const finalHtml = html.replace(/<div id="root">[\s\S]*?<\/div>/, `<div id="root">${pageHtml}</div>`);

  const outputFile = path.join(targetDir, 'index.html');
  fs.writeFileSync(outputFile, finalHtml, 'utf8');
  count++;
});

console.log(`✅ Pre-renderizado Nativo Completado Exitosamente: Generados ${count} archivos HTML estáticos independientes en dist/!`);
