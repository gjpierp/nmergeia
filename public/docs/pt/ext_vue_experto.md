# Composables e Reutilização de Lógica

Os **Composables** são a resposta do Vue aos Hooks personalizados do React, mas sem as restrições da ordem de renderização.

## 1. Criando um Composable

Um composable é simplesmente uma função que encapsula estado reativo.

```javascript
// useMousePosition.js
import { ref, onMounted, onUnmounted } from 'vue'

export function useMousePosition() {
  const x = ref(0)
  const y = ref(0)

  const atualizar = (event) => {
    x.value = event.pageX
    y.value = event.pageY
  }

  onMounted(() => window.addEventListener('mousemove', atualizar))
  onUnmounted(() => window.removeEventListener('mousemove', atualizar))

  return { x, y }
}
```

## 2. Consumindo o Composable

```html
<script setup>
import { useMousePosition } from './useMousePosition'

const { x, y } = useMousePosition()
</script>

<template>
  <div>Posição do mouse: {{ x }}, {{ y }}</div>
</template>
```
