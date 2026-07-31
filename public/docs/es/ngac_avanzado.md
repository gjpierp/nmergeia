# Obligaciones y Condiciones Temporales

NGAC permite inyectar **Prohibiciones** o restricciones geográficas/temporales sin ensuciar los permisos estáticos.

```json
{
  "policy": "Horario Laboral",
  "condition": {
    "time": ["09:00", "18:00"],
    "ip_range": "10.0.0.0/8"
  },
  "action": "DENY"
}
```
El PDP evaluará esta regla dinámicamente en microsegundos, previniendo exfiltración de datos nocturna.
