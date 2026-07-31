# Fundamentals and Directives

Vue uses directives built into the HTML to extend its behavior in a declarative way.

## 1. Main Directives

- **v-if / v-else**: Real conditional rendering (removes the node from the DOM).
- **v-show**: CSS-based conditional rendering (`display: none`). Useful for elements that change state frequently.
- **v-for**: List rendering. Always requires a `:key` attribute.
- **v-model**: Two-way data binding, ideal for forms.

## 2. Practical Example

```html
<script setup>
import { ref } from 'vue'

const tasks = ref([
  { id: 1, text: 'Learn Vue', completed: true },
  { id: 2, text: 'Master Pinia', completed: false }
])
const newTask = ref('')

const addTask = () => {
  if (newTask.value.trim()) {
    tasks.value.push({ id: Date.now(), text: newTask.value, completed: false })
    newTask.value = ''
  }
}
</script>

<template>
  <div>
    <input v-model="newTask" @keyup.enter="addTask" placeholder="New task" />
    <ul>
      <li v-for="task in tasks" :key="task.id">
        <span :class="{ strikethrough: task.completed }">{{ task.text }}</span>
      </li>
    </ul>
  </div>
</template>
```
