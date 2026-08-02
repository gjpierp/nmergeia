# Seguridad a Nivel de Fila (RLS) y Gobernanza de Datos

El fallo de seguridad más humillante y común en aplicaciones empresariales es el llamado **IDOR** (Insecure Direct Object Reference) o *BOLA* (Broken Object Level Authorization). Ocurre cuando un backend verifica que estás autenticado, pero olvida verificar que eres "el dueño" de los datos que solicitas (Ej. el Usuario 1 solicita la URL `/api/facturas/12` que le pertenece al Usuario 2 y el sistema se la muestra).

## 1. La Vía Tradicional (Y sus vulnerabilidades)
Tradicionalmente, en cada endpoint de una API (Node.js, Spring, Django), los desarrolladores escriben filtros:
`SELECT * FROM Facturas WHERE id = 12 AND usuario_id = :miId`

* **El Problema:** La seguridad depende del programador. Si en un equipo de 50 desarrolladores, alguien olvida incluir el `AND usuario_id = :miId` en un solo reporte de Power BI o un endpoint secundario, la información se filtra (Data Breach).
* **Solución Arquitectónica:** No confíes en la capa de la Aplicación (El Backend). Traslada la responsabilidad de la seguridad directamente al motor de la Base de Datos.

## 2. Row Level Security (RLS) en PostgreSQL
RLS permite crear **políticas de seguridad estrictas adjuntas directamente a las tablas** de la base de datos, no al código fuente de la app.

### Cómo funciona RLS
1. Se activa RLS en la tabla: `ALTER TABLE facturas ENABLE ROW LEVEL SECURITY;`
2. Se define la política: `CREATE POLICY solo_dueño ON facturas USING (usuario_id = current_setting('app.current_user_id'));`

### El Flujo de Ejecución Seguro:
1. El Backend (Node.js/Spring) recibe el JWT de Alice (User ID 5).
2. El Backend abre una transacción con Postgres y ejecuta un SET local: `SET LOCAL app.current_user_id = 5;`
3. El desarrollador Jr ejecuta descuidadamente `SELECT * FROM facturas;`
4. PostgreSQL intercepta la consulta antes de ejecutarla, inyecta forzosamente la política y la transforma silenciosamente en: `SELECT * FROM facturas WHERE usuario_id = 5`.
5. Alice solo verá sus facturas. El desarrollador no puede evadir la regla, ni siquiera si quiere (a menos que use credenciales de SuperAdmin, lo cual está prohibido).

## 3. Gobernanza de Datos Empresarial
RLS es el pilar de la Gobernanza (Data Governance) técnica. En arquitecturas modernas se acompaña de:
* **Enmascaramiento de Datos Dinámico (Dynamic Data Masking):** Si el rol que hace la consulta no tiene permiso `ViewPII`, la base de datos retorna los datos sensibles ofuscados en tiempo de ejecución (ej. un SSN o Tarjeta que retorna como `XXXX-XXXX-XXXX-1234`). La app nunca recibe el dato real.
* **Logs de Auditoría Inmutables (Audit Trails):** Se implementan triggers transparentes en la base de datos (como la extensión `pgaudit` o herramientas CDC) que registran el *quién*, *cuándo*, *valor_anterior* y *valor_nuevo* por cada operación UPDATE/DELETE.
* **Soft Deletion Estratégico:** En tablas financieras o transaccionales, el comando SQL `DELETE` está prohibido a nivel base de datos para los usuarios normales. Todo se marca con `deleted_at = NOW()` para conservar rastro contable.
