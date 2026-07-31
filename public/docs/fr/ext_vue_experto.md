# Composables et Réutilisabilité de la Logique

Les **Composables** sont la réponse de Vue aux Hooks personnalisés de React, mais sans les restrictions d'ordre de rendu.

## 1. Créer un Composable

Un composable est simplement une fonction qui encapsule un état réactif.

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

## 2. Utiliser le Composable

```html
<script setup>
import { useMousePosition } from './useMousePosition'

const { x, y } = useMousePosition()
</script>

<template>
  <div>Position de la souris : {{ x }}, {{ y }}</div>
</template>
```
