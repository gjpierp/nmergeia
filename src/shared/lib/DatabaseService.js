/**
 * @file DatabaseService.js
 * @description Servicio para la gestión de la base de datos IndexedDB local.
 * Permite persistir los handles (referencias) de directorios para que el usuario no tenga que volver a seleccionarlos.
 */

const DB_NAME = 'nmergeia-db';
const DB_VERSION = 1;
const STORE_NAME = 'handles';

/**
 * Abre la conexión con la base de datos IndexedDB.
 * @returns {Promise<IDBDatabase>} Promesa que resuelve con la instancia de la base de datos.
 */
export const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (e) => {
      e.target.result.createObjectStore(STORE_NAME);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

/**
 * Guarda un objeto (ej. un FileSystemDirectoryHandle) en la base de datos.
 * @param {string} key - La clave bajo la cual se guardará el objeto.
 * @param {any} handle - El objeto a guardar.
 * @returns {Promise<void>}
 */
export const saveHandle = async (key, handle) => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put(handle, key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject();
  });
};

/**
 * Recupera un objeto almacenado desde la base de datos.
 * @param {string} key - La clave a buscar.
 * @returns {Promise<any>} Promesa que resuelve con el objeto almacenado, o undefined si no existe.
 */
export const getHandle = async (key) => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const req = tx.objectStore(STORE_NAME).get(key);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject();
  });
};
