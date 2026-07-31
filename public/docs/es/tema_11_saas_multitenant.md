# Arquitectura SaaS Multi-Tenant (Inquilinos Múltiples)

Construir un software como servicio (SaaS) B2B implica resolver cómo vas a almacenar los datos de docenas o cientos de empresas (inquilinos/tenants) sin que la información se filtre entre ellos.

## 1. Estrategias de Separación de Datos (Data Isolation)
Existen tres modelos fundamentales para diseñar un SaaS, cada uno con ventajas distintas en costos, seguridad y escalabilidad:

### A. Base de Datos Aislada (Silo / Database-per-Tenant)
Cada cliente tiene su propia instancia física de Base de Datos.
* **Pros:** Máxima seguridad y aislamiento. Si un tenant exige cumplir con HIPAA o regulaciones bancarias, puedes cifrar su base de datos con su propia llave. El "noisy neighbor" (vecino ruidoso) no existe; un cliente que hace una consulta masiva no tira el sistema de los demás.
* **Contras:** Muy costoso y extremadamente difícil de mantener. Si tienes 500 clientes y necesitas agregar una columna a una tabla, debes correr la migración 500 veces.

### B. Esquema Aislado (Schema-per-Tenant)
Todos los clientes comparten el mismo servidor de Base de Datos (ej. Postgres), pero cada uno tiene un esquema distinto (ej. `tenant_acme.users`, `tenant_stark.users`).
* **Pros:** Equilibrio razonable. Un poco más barato que bases de datos aisladas, mantiene el aislamiento lógico, y hacer copias de seguridad de un solo cliente es fácil.
* **Contras:** Escalar verticalmente una sola base de datos tiene un límite. Correr migraciones sigue siendo tedioso, ya que debes iterar sobre 500 esquemas.

### C. Esquema Compartido (Pool / Shared-Schema)
Todos los clientes conviven en la misma base de datos y en las mismas tablas. Cada fila de cada tabla tiene una columna `tenant_id`.
* **Pros:** Costo ultrabajo. Mantenerlo es muy sencillo; una migración actualiza a todos instantáneamente. Es la arquitectura preferida para startups SaaS de alto crecimiento (ej. Notion, Slack).
* **Contras:** Riesgo masivo de filtración de datos si olvidas un `WHERE tenant_id = X` en una consulta. Para mitigar esto, NUNCA se debe confiar en los desarrolladores; el `tenant_id` debe ser inyectado y filtrado automáticamente por el ORM, o mejor aún, mediante **Row Level Security (RLS)** directamente en el motor de la base de datos (PostgreSQL).

## 2. Enrutamiento y Resolutores de Tenant (Tenant Resolution)
¿Cómo sabe la aplicación de qué tenant es la petición entrante?
1. **Por Subdominio:** `acme.misaas.com` o `stark.misaas.com`. El balanceador lee el *Host Header* y pasa el ID.
2. **Por Token (Recomendado):** Al hacer login, el servicio IAM inyecta el `tenant_id` en los claims del JWT (JSON Web Token). En cada request, el API Gateway lee el token y sabe a quién pertenece.

## 3. Despliegue Multi-Tenant
En despliegues de Cloud Native (Kubernetes), puedes tener un clúster *compartido* donde corren los pods del frontend y backend para todos. Si un cliente Enterprise paga el plan más caro, se le puede aprovisionar un clúster completamente dedicado a través de Infraestructura como Código (Terraform).
