# コンポーザブルとロジックの再利用性

**コンポーザブル**（Composables）は、Reactのカスタムフックに対するVueの答えですが、レンダリング順序の制限はありません。

## 1. コンポーザブルの作成

コンポーザブルは、リアクティブな状態をカプセル化する単なる関数です。

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

## 2. コンポーザブルの使用

```html
<script setup>
import { useMousePosition } from './useMousePosition'

const { x, y } = useMousePosition()
</script>

<template>
  <div>マウスの位置: {{ x }}, {{ y }}</div>
</template>
```
