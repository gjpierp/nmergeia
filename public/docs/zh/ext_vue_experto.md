# Composables (组合式函数) 与逻辑复用

**Composables** 是 Vue 对 React 自定义 Hooks 的回应，但没有渲染顺序的限制。

## 1. 创建 Composable

Composable 只是一个封装了响应式状态的函数。

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

## 2. 使用 Composable

```html
<script setup>
import { useMousePosition } from './useMousePosition'

const { x, y } = useMousePosition()
</script>

<template>
  <div>鼠标位置: {{ x }}, {{ y }}</div>
</template>
```
