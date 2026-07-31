# Composables and Logic Reusability

**Composables** are Vue's answer to React's custom Hooks, but without the restrictions of render order.

## 1. Creating a Composable

A composable is simply a function that encapsulates reactive state.

```javascript
// useMousePosition.js
import { ref, onMounted, onUnmounted } from 'vue'

export function useMousePosition() {
  const x = ref(0)
  const y = ref(0)

  const update = (event) => {
    x.value = event.pageX
    y.value = event.pageY
  }

  onMounted(() => window.addEventListener('mousemove', update))
  onUnmounted(() => window.removeEventListener('mousemove', update))

  return { x, y }
}
```

## 2. Consuming the Composable

```html
<script setup>
import { useMousePosition } from './useMousePosition'

const { x, y } = useMousePosition()
</script>

<template>
  <div>Mouse position: {{ x }}, {{ y }}</div>
</template>
```
