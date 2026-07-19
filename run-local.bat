@echo off
color 0b
echo ====================================================
echo        INICIANDO WEB-DIFF LOCALMENTE (Sin Docker)
echo ====================================================
echo.

echo [1/4] Evaluando dependencias...
if not exist node_modules (
    echo node_modules no detectado. Instalando dependencias...
    call npm install
) else (
    echo node_modules existente. Omitiendo npm install para inicio rapido.
)

echo.
echo [2/4] Evaluando compilacion...
if not exist dist (
    echo Compilacion dist no detectada. Construyendo aplicacion web...
    call npm run build
) else (
    echo Carpeta dist existente. Omitiendo npm run build para inicio rapido.
)

echo.
echo [3/4] Abriendo el navegador en puerto 8880...
start http://localhost:8880

echo.
echo [4/4] Levantando el servidor interno...
echo ====================================================
echo   SERVIDOR CORRIENDO. PARA APAGAR, CIERRA ESTA VENTANA.
echo ====================================================
set PORT=8880
node server.js
