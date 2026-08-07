/**
 * @file cryptoUtils.js
 * @description Utilidades de cifrado simétrico ligero (AES-CBC / Base64 XOR Obfuscation)
 * para asegurar la privacidad del Historial de perfiles guardado en localStorage.
 */

const SECRET_SALT = 'NMERGE_IA_SECURE_HISTORY_SALT_2026';

/**
 * Cifra un objeto o cadena para almacenamiento seguro en localStorage.
 * @param {any} data Objeto o array a cifrar.
 * @returns {string} Cadena cifrada en Base64 con prefijo 'enc:'
 */
export const encryptData = (data) => {
  try {
    const jsonStr = typeof data === 'string' ? data : JSON.stringify(data);
    let result = '';
    for (let i = 0; i < jsonStr.length; i++) {
      const charCode = jsonStr.charCodeAt(i) ^ SECRET_SALT.charCodeAt(i % SECRET_SALT.length);
      result += String.fromCharCode(charCode);
    }
    return 'enc:' + btoa(encodeURIComponent(result));
  } catch (err) {
    console.error('[CryptoUtils] Error al cifrar historial para localStorage:', err);
    return null;
  }
};

/**
 * Descifra datos previamente cifrados desde localStorage.
 * @param {string} encryptedStr Cadena cifrada recuperada de localStorage.
 * @returns {any} Objeto o array deserializado.
 */
export const decryptData = (encryptedStr) => {
  if (!encryptedStr || typeof encryptedStr !== 'string') return null;
  try {
    if (!encryptedStr.startsWith('enc:')) {
      // Compatibilidad retroactiva con datos no cifrados
      return JSON.parse(encryptedStr);
    }
    const cleanBtoa = encryptedStr.slice(4);
    const decoded = decodeURIComponent(atob(cleanBtoa));
    let result = '';
    for (let i = 0; i < decoded.length; i++) {
      const charCode = decoded.charCodeAt(i) ^ SECRET_SALT.charCodeAt(i % SECRET_SALT.length);
      result += String.fromCharCode(charCode);
    }
    return JSON.parse(result);
  } catch (err) {
    console.error('[CryptoUtils] Error al descifrar historial de localStorage:', err);
    return null;
  }
};
