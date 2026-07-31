# Components, Props and Emits

As your application grows, you need to split the UI into reusable components that communicate with each other.

## 1. Parent to Child Communication (Props)

**Props** are read-only. A child component should never mutate a prop directly.

```html
<script setup>
const props = defineProps({
  title: { type: String, required: true },
  counter: { type: Number, default: 0 }
})
</script>

<template>
  <div>
    <h3>{{ title }}</h3>
    <p>Value: {{ counter }}</p>
  </div>
</template>
```

## 2. Child to Parent Communication (Emits)

To notify the parent of an event, we use `defineEmits`.

```html
<script setup>
const emit = defineEmits(['update'])

const notifyParent = () => {
  emit('update', 'new value')
}
</script>

<template>
  <button @click="notifyParent">Notify</button>
</template>
```
