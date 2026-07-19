@echo off
color 0a
echo ====================================================
echo          INICIANDO WEB-DIFF CON DOCKER
echo ====================================================
echo.

echo [1/3] Levantando contenedor (en segundo plano)...
docker compose up -d

echo.
echo [2/3] Esperando a que el servidor inicie...
timeout /t 2 >nul

echo.
echo [3/3] Abriendo navegador...
start http://localhost:8880

echo.
echo ====================================================
echo   LISTO! Puedes cerrar esta ventana sin problemas.
echo   La aplicacion seguira corriendo en Docker en el puerto 8880.
echo ====================================================
pause
