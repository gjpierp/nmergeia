# コンポーネント、Props、およびEmits

アプリケーションが成長するにつれて、UIを互いに通信する再利用可能なコンポーネントに分割する必要があります。

## 1. 親から子への通信 (Props)

**Props**は読み取り専用です。子コンポーネントは決してpropを直接変更してはいけません。

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
    <p>値: {{ contador }}</p>
  </div>
</template>
```

## 2. 子から親への通信 (Emits)

イベントを親に通知するために、`defineEmits`を使用します。

```html
<script setup>
const emit = defineEmits(['actualizar'])

const notificarPadre = () => {
  emit('actualizar', '新しい値')
}
</script>

<template>
  <button @click="notificarPadre">通知する</button>
</template>
```
