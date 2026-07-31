# Modelado de Políticas

A diferencia del RBAC, el NGAC usa "User Attributes" (UA) y "Object Attributes" (OA).

## 1. El Paradigma Lineal

```text
User(Alice) -> UA(Managers) -> Association(Read/Write) -> OA(Confidential_Docs) <- Object(Doc_1)
```
Si queremos revocar el acceso a un solo documento temporalmente, no necesitamos crear un nuevo rol. Simplemente movemos el Objeto `Doc_1` a otro `OA`. Esto es matemáticamente elegante e infinitamente escalable.
