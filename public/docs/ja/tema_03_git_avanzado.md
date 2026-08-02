# Git y Control de Versiones para Trabajo en Equipo

Usar Git para guardar tu trabajo localmente (`git add .`, `git commit -m "updates"`, `git push`) es solo el 10% de su capacidad. Cuando integras un equipo de desarrolladores sobre el mismo código base, esa práctica provoca conflictos caóticos de integración (Merge Conflicts) y regresiones que rompen producción.

## 1. El Peligro del Desarrollo Basado en Main
El **Anti-patrón:** Todos los desarrolladores suben cambios directamente a la rama `main` o `master`.
* El código no se revisa antes de integrarse.
* Si un desarrollador sube código que no compila, bloquea el trabajo del resto del equipo.
* Rastrear quién introdujo un bug y por qué, se vuelve arqueología imposible.

## 2. Estrategias de Ramificación (Branching Models)

### Git Flow (El Estándar Enterprise Clásico)
Ideal para software versionado o que se entrega por ventanas de lanzamiento.
* **`main`**: Contiene únicamente código estable reflejando lo que está corriendo en Producción.
* **`develop`**: La rama de integración diaria. Todo el trabajo nuevo aterriza aquí.
* **Feature Branches**: Se desprenden de `develop` (Ej: `feature/login-oauth`). Cuando terminan, se fusionan (*Merge*) de vuelta a `develop` mediante un Pull Request.
* **Release Branches**: Cuando `develop` está maduro para salir a producción, se crea `release/v1.2` para pruebas finales de QA. Luego se fusiona a `main` (con un Tag) y a `develop`.
* **Hotfix Branches**: Si hay un fuego en producción, se crea un `hotfix` desde `main`, se arregla, y se fusiona directo a `main` y a `develop`.

### Trunk-Based Development (El Estándar DevOps/Cloud-Native)
GitFlow puede ser lento por el aislamiento prolongado en ramas *feature*. Los equipos maduros de CI/CD (Continuous Integration / Continuous Deployment) prefieren TBD.
* Todos los desarrolladores trabajan sobre ramas de corta vida (horas, máximo un par de días) y fusionan directo al "Trunk" (`main`).
* **Regla de oro:** Se requieren pruebas automatizadas estrictas (Automated Testing Pipeline) y **Feature Flags**.
* Si estás trabajando en el nuevo módulo de pagos y no está listo, lo fusionas a `main` protegido tras un *Feature Flag* (un If en el código que lee de la base de datos). El código va a Producción, pero está apagado para los usuarios. Esto evita las masivas pesadillas de conflictos por desincronización de ramas.

## 3. Pull Requests, Code Reviews y Conventional Commits
Nadie sube código directo. Todo cambio se propone vía un **Pull Request (PR) / Merge Request (MR)**.
* Obliga a que al menos 1 o 2 humanos (o un Agente de IA) revisen tu código (Code Review).
* Dispara automáticamente las pruebas (CI pipeline).

### Conventional Commits
Escribir mensajes de commit como `fix typo` o `working on logic` es inútil. Se exige el estándar de Conventional Commits para autogenerar *Changelogs* e incrementar las versiones (SemVer) mágicamente.
* `feat(auth): add google oauth login` (Añade una funcionalidad)
* `fix(payment): resolve crash on timeout` (Corrige un bug)
* `docs(readme): update install steps` (Cambios solo en docs)
* `refactor(api): decouple user service` (No añade feature ni arregla bug, solo limpia código)

## 4. Rebase vs Merge (Manteniendo una Historia Limpia)
Cuando actualizas tu rama con cambios recientes:
* **`git merge`**: Conserva el tiempo exacto en que ocurrieron los commits, pero crea "Commits de Merge" que ensucian el grafo haciéndolo parecer un mapa de trenes inentendible.
* **`git rebase`**: Reescribe la historia. Desengancha tus commits, pone tu rama al nivel más actual, y re-aplica tus commits encima en una línea recta perfecta. *Advertencia:* Nunca hagas rebase de commits que ya has hecho `push` público.
