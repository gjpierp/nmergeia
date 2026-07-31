# 基礎とディレクティブ

Vueは、HTMLに組み込まれたディレクティブを使用して、宣言的にその動作を拡張します。

## 1. 主なディレクティブ

- **v-if / v-else**: 真の条件付きレンダリング（DOMからノードを削除します）。
- **v-show**: CSSベースの条件付きレンダリング（`display: none`）。状態が頻繁に変わる要素に便利です。
- **v-for**: リストのレンダリング。常に`:key`属性が必要です。
- **v-model**: 双方向データバインディング。フォームに最適です。

## 2. 実践例

```html
<script setup>
import { ref } from 'vue'

const tareas = ref([
  { id: 1, texto: 'Vueを学ぶ', completada: true },
  { id: 2, texto: 'Piniaをマスターする', completada: false }
])
const nuevaTarea = ref('')

const agregarTarea = () => {
  if (nuevaTarea.value.trim()) {
    tareas.value.push({ id: Date.now(), texto: nuevaTarea.value, completada: false })
    nuevaTarea.value = ''
  }
}
</script>

<template>
  <div>
    <input v-model="nuevaTarea" @keyup.enter="agregarTarea" placeholder="新しいタスク" />
    <ul>
      <li v-for="tarea in tareas" :key="tarea.id">
        <span :class="{ tachado: tarea.completada }">{{ tarea.texto }}</span>
      </li>
    </ul>
  </div>
</template>
```
