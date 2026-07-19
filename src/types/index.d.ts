/**
 * Definiciones de Tipos Globales de NMerge
 * Proporciona autocompletado y validación de tipos estáticos (IntelliSense)
 * sin añadir costo de transpilación al empaquetador de Vite.
 */

export interface FileObject {
    /** Nombre del archivo (ej. main.js) */
    name: string;
    /** Ruta relativa construida (ej. src/main.js) */
    webkitRelativePath: string;
    /** Tamaño en bytes */
    size: number;
    /** Tipo MIME del archivo */
    type: string;
    /** Marca de última modificación */
    lastModified: number;
    /** FileSystemFileHandle nativo asociado en Electron/Browser */
    fileHandle?: FileSystemFileHandle | null;
}

export interface DestSlot {
    /** ID único de slot de destino */
    id: string;
    /** FileSystemDirectoryHandle de la carpeta seleccionada */
    handle: FileSystemDirectoryHandle | null;
    /** Lista de archivos procesados contenidos en el slot */
    files: FileObject[];
    /** Ruta absoluta o nombre identificatorio */
    path: string;
}

export interface EqualityStats {
    /** Estado general de igualdad */
    status: 'identical' | 'different';
    /** Número de líneas añadidas en LCS */
    added: number;
    /** Número de líneas eliminadas en LCS */
    deleted: number;
}

export type FileEqualityMap = Record<string, 'identical' | 'different' | EqualityStats>;

export interface Profile {
    /** ID único del historial */
    id: string;
    /** Nombre personalizado asignado por el usuario */
    name: string;
    /** Ruta origen guardada */
    originPath: string;
    /** Rutas de destino serializadas */
    destPaths: string[];
    /** Contenido del filtro configurado en ese instante */
    filterContent: string;
}
