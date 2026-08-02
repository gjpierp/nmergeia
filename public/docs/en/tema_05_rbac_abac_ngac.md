# RBAC, ABAC y NGAC

La Autenticación (AuthN) responde a la pregunta: *"¿Quién eres?"* (Identity). La Autorización (AuthZ) responde: *"¿Qué tienes permitido hacer?"*. Cuando los sistemas crecen de Startups a Enterprise, los modelos de autorización tradicionales colapsan bajo su propia complejidad.

## 1. RBAC (Role-Based Access Control)
El modelo más común de la industria. A los usuarios se les asignan **Roles**, y a los Roles se les asignan **Permisos**.
* **Ejemplo:** Usuario(Ana) -> Rol(Cajero) -> Permiso(Puede Reembolsar Ticket).
* **Ventajas:** Simple de entender y rápido de implementar usando JWTs o bases de datos sencillas.
* **El Problema (Role Explosion):** A medida que la lógica de negocio se complica, empiezan los problemas. "¿Qué pasa si Ana puede reembolsar tickets, pero *solo* los menores a $500 y *solo* los de su propia sucursal?". De repente tienes que crear roles como `CAJERO_SUCURSAL_CENTRAL_LIMITE_BAJO`. Terminas con miles de roles imposibles de auditar. 

## 2. ABAC (Attribute-Based Access Control)
En ABAC no evalúas "roles estáticos", evalúas una **política dinámica y condicional**. Se basa en Atributos del Usuario, del Recurso, y del Entorno (Contexto).
* **Política ABAC:** `Permitir Acción(REEMBOLSO)` `SI (Usuario.Departamento == "Finanzas")` `Y (Recurso.Monto < 500)` `Y (Entorno.Hora < 18:00)`.
* **Ventajas:** Extremadamente flexible, granular y expresivo. Puede modelar cualquier escenario de seguridad posible. AWS IAM es fundamentalmente un modelo ABAC.
* **El Problema:** La lentitud de ejecución y la complejidad de administración. Las reglas viven dispersas en motores de reglas (como OPA - Open Policy Agent). Si un gerente te pregunta: "¿Exactamente qué archivos puede leer Juan hoy?", en ABAC es muy difícil responder sin simular todas las políticas de forma iterativa.

## 3. NGAC (Next Generation Access Control)
Un estándar de autorización avanzado promulgado por el NIST (Instituto Nacional de Estándares y Tecnología de EE.UU.). Es un modelo **basado en Grafo Matemático** que busca unir la simplicidad de RBAC con la flexibilidad granular de ABAC.

### Cómo funciona NGAC
Representa todas las entidades (Usuarios, Recursos, Acciones, Roles, Atributos) como *nodos* de un grafo dirigido acíclico, unidos por relaciones (aristas).
* **Clases de Nodos:**
  * Usuario (U)
  * Atributo de Usuario (UA) - Puede ser un Rol, un Grupo o una Organización.
  * Objeto (O) - El recurso final (ej. `Factura_001`).
  * Atributo de Objeto (OA) - Puede ser una Carpeta, una Clasificación (ej. `TopSecret`).
  * Asociación - La flecha que cruza entre los Atributos (Autorización `[READ, WRITE]`).

### El Algoritmo
Para que el Usuario A lea el Documento B, el motor de grafos NGAC busca si existe un camino navegable continuo (un Path) que conecte el Nodo Usuario A hasta el Nodo Documento B, pasando a través de una asociación válida de `[READ]`.
* **Ventaja Enorme de NGAC:** Al ser un grafo persistido en una base de datos centralizada (ej. Neo4j o Postgres recursivo), puedes hacer **Auditoría Lineal y Predictiva** con una simple consulta de nodos conexos. Responder "¿Qué puede ver Juan hoy?" es instantáneo. 
* Además, puedes añadir Políticas Dinámicas y Obligaciones que rompen o crean aristas del grafo bajo condiciones contextuales.
