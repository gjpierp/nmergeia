# 组件，Props (属性) 与 Emits (触发事件)

随着应用程序的增长，你需要将 UI 拆分为可以相互通信的可重用组件。

## 1. 父到子通信 (Props)

**Props** 是只读的。子组件永远不应该直接更改 prop。

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
    <p>值: {{ contador }}</p>
  </div>
</template>
```

## 2. 子到父通信 (Emits)

为了向父组件通知事件，我们使用 `defineEmits`。

```html
<script setup>
const emit = defineEmits(['actualizar'])

const notificarPadre = () => {
  emit('actualizar', '新值')
}
</script>

<template>
  <button @click="notificarPadre">通知</button>
</template>
```
