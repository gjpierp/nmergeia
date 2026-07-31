# Ingeniería de Requerimientos en la Era IA (Agile + LLMs)

La toma de requerimientos es donde los proyectos fracasan. Escribir requerimientos no es redactar los deseos de un cliente; es diseñar un contrato de implementación que no deje lugar a ambigüedades. 

En la era del Desarrollo Asistido por Inteligencia Artificial, si la Historia de Usuario es vaga, el Agente Generador de Código escribirá código vago, provocando bucles infinitos de correcciones (High Token Burn). 

## 1. Anatomía de un Requerimiento Sólido (El Estándar BDD)
Las metodologías ágiles recomiendan **Behavior-Driven Development (BDD)** usando sintaxis **Gherkin**. Esto no es código, es un puente de lenguaje entre Negocio, QA y Desarrolladores (o LLMs).

Toda Historia de Usuario compleja debe contar con Criterios de Aceptación estructurados:
```gherkin
FEATURE: Control de Límite de Crédito
  AS A analista de riesgos
  I WANT TO restringir las compras de un cliente que exceda su línea de crédito
  SO THAT la compañía no asuma deudas irrecuperables

SCENARIO: El cliente intenta comprar con crédito insuficiente
  GIVEN un cliente con "crédito_disponible" de $100
  AND un carrito de compras con un total de $150
  WHEN el cliente presiona el botón de "Confirmar Orden"
  THEN el sistema debe rechazar la transacción
  AND mostrar un error HTTP 422 con el mensaje "Límite de crédito excedido"
```

> **Por qué esto importa:** Cuando delegas código a un Agente de IA, la estructura `GIVEN/WHEN/THEN` es directamente transformable a Tests Unitarios (Jest, JUnit, PyTest) y E2E (Cypress, Playwright).

## 2. Invariantes y Reglas de Negocio
Las descripciones narrativas a menudo olvidan las reglas en las sombras. En requerimientos profundos, siempre exige una sección de "Invariantes" (Reglas Inquebrantables):
* *Ejemplo:* "Un usuario registrado nunca, bajo ninguna circunstancia, puede ver la orden de otro usuario registrado".
* Esto define de forma tajante las pre-condiciones y post-condiciones matemáticas o lógicas que una Arquitectura Segura debe auditar (Zero Trust).

## 3. Arquitectura Dirigida por Requerimientos (Event Storming)
En vez de listar requerimientos pasivos (CRUD), las metodologías modernas como Domain-Driven Design (DDD) usan **Event Storming**. 
Reúnes a los expertos de negocio y en lugar de decir "Necesito una pantalla para guardar órdenes", les preguntas: *"¿Qué eventos pasan en el sistema?"*.
* Ellos responden (notas naranjas): `OrdenCreada`, `InventarioReservado`, `PagoRechazado`.
* Automáticamente traduces eso a una Arquitectura Basada en Eventos (EDA). `OrdenCreada` será un mensaje en Kafka; `PagoRechazado` detonará una Saga Compensatoria.

## 4. El Anti-Patrón "Requirement Churn"
Es el flujo donde el requerimiento muta diariamente porque el usuario no sabía lo que quería hasta que lo vio.
* **Mitigación (Wireframes Alta Fidelidad / Figma):** La IA permite prototipar interfaces en horas (v0.dev). En lugar de escribir 20 páginas de documento, genera un Frontend "Dummy" desechable. Al tener el prototipo táctil, el usuario afina el requerimiento real en días en lugar de meses.
