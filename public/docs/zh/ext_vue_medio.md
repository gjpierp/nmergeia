# Componentes, Props y Emits

A medida que tu aplicación crece, necesitas dividir la UI en componentes reutilizables que se comuniquen entre sí.

## 1. Comunicación Padre a Hijo (Props)

Las **Props** son de solo lectura. Un componente hijo nunca debe mutar una prop directamente.

```html
<script setup>
const props = defineProps({
  titulo: { type: String, required: true },
  contador: { type: Number, default: 0 }
})
</script>

<template>
  <div>
    <h3>{{ titulo }}</h3>
    <p>Valor: {{ contador }}</p>
  </div>
</template>
```

## 2. Comunicación Hijo a Padre (Emits)

Para avisar al padre de un evento, usamos `defineEmits`.

```html
<script setup>
const emit = defineEmits(['actualizar'])

const notificarPadre = () => {
  emit('actualizar', 'nuevo valor')
}
</script>

<template>
  <button @click="notificarPadre">Notificar</button>
</template>
```
