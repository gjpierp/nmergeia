# Composables y Reusabilidad de Lógica

Los **Composables** son la respuesta de Vue a los Hooks personalizados de React, pero sin las restricciones del orden de renderizado.

## 1. Creando un Composable

Un composable es simplemente una función que encapsula estado reactivo.

```javascript
// useMousePosition.js
import { ref, onMounted, onUnmounted } from 'vue'

export function useMousePosition() {
  const x = ref(0)
  const y = ref(0)

  const actualizar = (event) => {
    x.value = event.pageX
    y.value = event.pageY
  }

  onMounted(() => window.addEventListener('mousemove', actualizar))
  onUnmounted(() => window.removeEventListener('mousemove', actualizar))

  return { x, y }
}
```

## 2. Consumiendo el Composable

```html
<script setup>
import { useMousePosition } from './useMousePosition'

const { x, y } = useMousePosition()
</script>

<template>
  <div>Posición del ratón: {{ x }}, {{ y }}</div>
</template>
```
