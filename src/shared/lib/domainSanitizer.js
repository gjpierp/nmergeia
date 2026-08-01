/**
 * @file domainSanitizer.js
 * @description Función utilitaria para limpiar URLs de proyectos y generar el nombre normalizado: "Informe [NombreDominio]"
 */

/**
 * Limpia cualquier URL o texto de proyecto dejando únicamente el nombre del dominio.
 * Ejemplo:
 *   "https://www.nmergeia.com/" -> "Informe nmergeia"
 *   "http://nmergeia.com/#features" -> "Informe nmergeia"
 *   "https://www.mi-empresa.com.co" -> "Informe mi-empresa"
 * 
 * @param {string} rawUrl - URL o identificador del proyecto
 * @returns {string} Nombre formateado como "Informe [DominioLimpio]"
 */
export function formatProjectReportTitle(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return 'Informe NMergeIA';
  }

  let domain = rawUrl.trim();

  // 1. Quitar esquema (http://, https://, ftp://, etc.)
  domain = domain.replace(/^(https?:\/\/|ftp:\/\/)/i, '');

  // 2. Quitar www. o subdominios iniciales www
  domain = domain.replace(/^www\./i, '');

  // 3. Tomar solo el host (ignorar rutas, querystrings o hashes como /#features o ?lang=es)
  domain = domain.split('/')[0].split('?')[0].split('#')[0].split(':')[0];

  // 4. Remover extensiones TLD comunes (.com, .net, .org, .co, .es, .io, .ai, .app, .dev, .local, etc.)
  domain = domain.replace(/\.(com|net|org|co|es|io|ai|app|dev|local|cl|mx|ar|pe|uy|gov|edu)(\.[a-z]{2,3})?$/i, '');

  // 5. Quitar puntos restantes y limpiar caracteres extraños
  domain = domain.replace(/\./g, '').trim();

  // Si queda vacío por algún motivo, fallback seguro
  if (!domain) {
    domain = 'NMergeIA';
  }

  return `Informe ${domain}`;
}
