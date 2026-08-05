# Handoff Técnico: Paquete Standalone ZIP Ultraligero (v1.2.2)

## 1. Resumen de Entregable
Se ha consolidado y generado el paquete ZIP estandarizado en el directorio único de entregables:
📦 **[releases/NMerge-Standalone-v1.2.2.zip](file:///c:/Local/nmerge/releases/NMerge-Standalone-v1.2.2.zip)** (Tamaño: **3.94 MB**).

---

## 2. Contenido del Paquete Standalone
El paquete ZIP contiene **únicamente los componentes esenciales de runtime** para levantar la aplicación (comparador, filtro y servidor local) en cualquier otro equipo sin archivos innecesarios de desarrollo:

1. **`dist/`**: Compilación estática de producción pre-renderizada de la UI en React.
2. **`server.js`**: Servidor liviano Express para endpoints API de filtros, licencias y configuraciones.
3. **`package.json` & `package-lock.json`**: Manifiestos de dependencias esenciales de producción.
4. **`configs/` & `filtro.txt`**: Motor y perfiles de filtrado/exclusión de archivos y directorios.
5. **`run-local.bat`**: Lanzador automático de 1 solo clic para entornos Windows.
6. **`docker-compose.yml` & `Dockerfile`**: Manifiestos opcionales para despliegue contenerizado.
7. **`INSTRUCCIONES_INICIO.txt`**: Guía clara en español para inicio rápido (Automático, Terminal o Docker).

---

## 3. Instrucciones de Despliegue en Otro Equipo
1. Descomprimir `NMerge-Standalone-v1.2.2.zip`.
2. Ejecutar `run-local.bat` (Windows) o `npm install --omit=dev && npm start` (Linux / Mac).
3. Acceder al comparador visual en `http://localhost:8880`.
