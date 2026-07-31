# 基础知识与指令

Vue 使用 HTML 中内置的指令来以声明方式扩展其行为。

## 1. 主要指令

- **v-if / v-else**: 真正的条件渲染 (从 DOM 中移除节点)。
- **v-show**: 基于 CSS 的条件渲染 (`display: none`)。适用于频繁更改状态的元素。
- **v-for**: 列表渲染。始终需要一个 `:key` 属性。
- **v-model**: 双向数据绑定，非常适合表单。

## 2. 实践示例

```html
<script setup>
import { ref } from 'vue'

const tareas = ref([
  { id: 1, texto: '学习 Vue', completada: true },
  { id: 2, texto: '精通 Pinia', completada: false }
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
    <input v-model="nuevaTarea" @keyup.enter="agregarTarea" placeholder="新任务" />
    <ul>
      <li v-for="tarea in tareas" :key="tarea.id">
        <span :class="{ tachado: tarea.completada }">{{ tarea.texto }}</span>
      </li>
    </ul>
  </div>
</template>
```
