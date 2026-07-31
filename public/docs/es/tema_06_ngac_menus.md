# Renderizado Dinámico de UI y Control de Menús (Feature Toggles)

En una aplicación empresarial segura (Zero Trust), el frontend nunca asume qué pantallas o botones puede ver el usuario basándose en su JWT o rol. Un usuario avanzado podría modificar el HTML en el navegador o alterar variables locales de estado para forzar la visibilidad de una pestaña (ej. "Admin Panel").

Para prevenir vulnerabilidades e inconsistencias de UI, la interfaz de usuario debe ser **gobernada dinámicamente desde el Backend**, idealmente a través de un motor de políticas (como NGAC).

## 1. El Peligro del Control de UI Lado-Cliente (Client-Side)
El enfoque *novato* (Hardcoded RBAC en la UI):
```jsx
// ANTI-PATRÓN
function Sidebar({ userRole }) {
  return (
    <nav>
      <Link to="/home">Inicio</Link>
      {userRole === 'ADMIN' && <Link to="/config">Configuración</Link>}
    </nav>
  )
}
```
* **Problema 1 (Falsa Seguridad):** Ocultar un botón en React no protege la ruta `/config`. Si el backend no tiene seguridad independiente, el usuario ingresará la URL manualmente y accederá.
* **Problema 2 (Acoplamiento y Deuda Técnica):** Si el rol cambia de nombre o se añade un nuevo rol "MANAGER", debes re-compilar y desplegar el Frontend. La seguridad queda acoplada al ciclo de despliegue de la app.

## 2. Server-Driven UI (Feature Toggles / Menús Dinámicos)
El enfoque profesional delega la decisión visual al servidor.
Al cargar la aplicación (en la fase de arranque o *Bootstrap*), el Frontend solicita al backend: *"Tengo el JWT de Juan. ¿Qué pantallas estoy autorizado a renderizar?"*.

El backend evalúa las reglas complejas (NGAC, Horarios, Dispositivos) y devuelve una matriz estricta:
```json
{
  "menus_permitidos": [
    "dashboard_inicial",
    "reportes_ventas",
    "btn_exportar_excel"
  ]
}
```

## 3. Implementación Práctica con React Router y Guards
Con la lista recibida, el Frontend carga la configuración en el estado global (Context, Zustand o Redux).
Se implementa un **Guard / HOC (Higher-Order Component)** que envuelve tanto la barra lateral (Sidebar) como el manejador de Rutas.

```jsx
// PRO-TIP: El NgacGuard
export const NgacGuard = ({ menuKey, children }) => {
  const { allowedMenus } = useAppStore();
  
  if (!allowedMenus.includes(menuKey)) {
    // Renderea Nothing, redirige, o muestra un 403.
    return <Page403 Forbidden />; 
  }
  return children;
};

// En el enrutador:
<Route path="/admin" element={
  <NgacGuard menuKey="admin_panel">
    <AdminScreen />
  </NgacGuard>
} />
```

## 4. Ventajas Organizacionales y DevOps
* **Seguridad Absoluta (Fail-Close):** Si el motor de permisos colapsa, la API devuelve una lista vacía y la interfaz se vuelve invisible, evitando exposición accidental (Falla segura).
* **Gestión en Tiempo Real:** El equipo de Seguridad puede crear un nuevo panel, asignar permisos a usuarios específicos desde un Panel de Control centralizado de IAM (Sentinel), y la pantalla aparecerá en la UI del usuario final sin necesidad de redesplegar el Frontend.
