# Infraestructura como Código (IaC) y Terraform

Antes de IaC, crear infraestructura (servidores, redes, bases de datos) se hacía de forma manual: entrando a la consola web de AWS (ClickOps), buscando menús y dándole click a "Crear EC2". Esto es inauditable, lento, e irrepetible. Si un desastre borra tu infraestructura, reconstruirla a mano tomaría días.

## 1. El Concepto de Infraestructura Declarativa
Con Infraestructura como Código (IaC), **escribes código que define el Estado Deseado** de tu arquitectura. Guardas ese código en un repositorio (Git) al lado del código de tu aplicación. 

Existen dos enfoques en herramientas:
* **Imperativo (Scripts Bash, Ansible):** Dices *CÓMO* hacer las cosas. Ej: "Crea una EC2. Si ya hay 2, crea 1 más".
* **Declarativo (Terraform, CloudFormation, Kubernetes YAML):** Dices *QUÉ* quieres. Ej: "Quiero que existan exactamente 3 EC2". La herramienta calcula la diferencia contra la realidad y se encarga del *CÓMO* (creará una, borrará dos, o no hará nada).

## 2. HashiCorp Terraform (El Estándar Agnóstico)
Terraform permite usar su lenguaje declarativo (HCL) para crear recursos en cualquier nube (AWS, Azure, GCP, VMWare, DataDog) usando **Providers**. 

### Ciclo de vida básico de Terraform:
1. `terraform init`: Descarga el provider necesario (ej. el de AWS).
2. `terraform plan`: ¡El paso más importante! Analiza tu código, analiza la nube, y te muestra un "Dry Run" o *diff* de qué va a crear, modificar o destruir. Todavía no cambia nada.
3. `terraform apply`: Si estás de acuerdo con el plan, ejecuta los cambios en la nube real.
4. `terraform destroy`: Borra absolutamente todo lo declarado en el código. Útil para entornos temporales de QA.

## 3. El Archivo de Estado (State File - El Talón de Aquiles)
¿Cómo sabe Terraform que ya creó una Máquina Virtual si ejecutas `apply` por segunda vez? Lo sabe porque guarda un archivo llamado `terraform.tfstate`. Es un JSON masivo que mapea los recursos de tu código a sus equivalentes reales (IDs) en la nube.

* **Anti-patrón Fatal:** Dejar el `.tfstate` en tu disco duro local o hacerle push al repositorio de Git. Si tu compañero ejecuta Terraform, no tendrá tu estado y el código colapsará intentando crear recursos duplicados. Peor aún, el archivo de estado guarda contraseñas y llaves de bases de datos en texto plano.
* **La Solución (Remote State Backends):** El archivo de estado debe guardarse centralizadamente en un Storage cifrado de nube (ej. Amazon S3) e implementar un sistema de **Bloqueo (State Locking)** usando DynamoDB para asegurar que dos desarrolladores no apliquen cambios simultáneamente, corrompiendo la infraestructura.

## 4. Estructura y Módulos
No escribas un solo archivo de 3,000 líneas.
Los **Terraform Modules** permiten encapsular patrones. Por ejemplo, en vez de obligar a tus devs a escribir 20 recursos complejos para hacer un Servidor Web seguro (EC2 + Security Groups + IAM Role + Load Balancer), el equipo de DevOps crea un módulo reutilizable.
Los desarrolladores solo tienen que invocar:
```hcl
module "mi_web_app" {
  source = "./modules/servidor-web-seguro"
  nombre_app = "tienda-online"
  tamaño = "t3.medium"
}
```
