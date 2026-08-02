# DevSecOps y Gestión de Secretos (Vault)

En un pipeline de DevOps tradicional, la seguridad se suele evaluar al final del ciclo (durante la fase de QA o en pre-producción). **DevSecOps** trata de "desplazar la seguridad a la izquierda" (*Shift-Left*), integrándola desde la primera línea de código.

## 1. El Peligro del Hardcoding (Secret Leakage)
El error de seguridad más común en la industria es dejar credenciales (API Keys, Contraseñas de Base de Datos, Tokens de AWS) quemadas (hardcodeadas) en el código fuente. Si ese código se sube a GitHub (incluso a un repositorio privado), cualquier desarrollador, herramienta de CI, o atacante que comprometa una cuenta tendrá acceso a la infraestructura crítica.

Incluso los archivos `.env` locales no son seguros para entornos de producción, ya que a menudo terminan filtrados en logs, contenedores o volcados de memoria.

## 2. HashiCorp Vault (El Estándar de la Industria)
Para solucionar esto, se utilizan **Gestores de Secretos (Secret Managers)** como HashiCorp Vault, AWS Secrets Manager o Azure Key Vault.

Vault actúa como una "caja fuerte digital" centralizada para tu infraestructura:
1. **Centralización:** Los secretos no viven en el servidor de la aplicación, viven en Vault.
2. **Encriptación en Tránsito y en Reposo:** Todo dato almacenado está fuertemente cifrado.
3. **Control de Acceso Riguroso:** Una app de NodeJS debe autenticarse contra Vault (ej. usando roles de Kubernetes o AWS IAM) para que Vault le preste un secreto.
4. **Secretos Dinámicos (El superpoder de Vault):** En lugar de guardar una contraseña estática de PostgreSQL en Vault, puedes configurar Vault para que **genere una contraseña nueva al vuelo** cada vez que la app la pide. Esa contraseña caduca automáticamente en 1 hora. Si un atacante roba el secreto de la memoria, será inútil al poco tiempo.

## 3. Integración en el Flujo de Trabajo (Shift-Left)
Un flujo maduro de DevSecOps implementa guardrails automáticos en las tuberías de CI/CD:
* **Pre-commit Hooks (TruffleHog / GitLeaks):** Scripts que escanean el código localmente antes de dejarte hacer `git commit` buscando firmas de contraseñas.
* **SAST (Static Application Security Testing):** En el pipeline de GitHub Actions/GitLab CI, herramientas como SonarQube escanean el código en busca de vulnerabilidades lógicas (Inyección SQL, XSS) sin necesidad de compilarlo.
* **SCA (Software Composition Analysis):** Dependabot o Snyk escanean el archivo `package.json` o `pom.xml` para alertar si estás usando una librería con un CVE (Vulnerabilidad y Exposición Común) conocido.
* **Inyección en Tiempo de Ejecución (Runtime):** El contenedor Docker arranca, contacta a Vault, inyecta los secretos directamente en la memoria del proceso (tmpfs) y evita escribirlos en el disco.
