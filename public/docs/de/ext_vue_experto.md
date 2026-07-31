# Composables und Wiederverwendbarkeit von Logik

**Composables** sind Vues Antwort auf Reacts Custom Hooks, jedoch ohne die Einschränkungen der Rendering-Reihenfolge.

## 1. Erstellen eines Composables

Ein Composable ist einfach eine Funktion, die reaktiven Zustand kapselt.

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

## 2. Verwendung des Composables

```html
<script setup>
import { useMousePosition } from './useMousePosition'

const { x, y } = useMousePosition()
</script>

<template>
  <div>Mausposition: {{ x }}, {{ y }}</div>
</template>
```
