# Grundlagen und Direktiven

Vue verwendet in HTML integrierte Direktiven, um sein Verhalten auf deklarative Weise zu erweitern.

## 1. Hauptdirektiven

- **v-if / v-else**: Echtes bedingtes Rendering (entfernt den Knoten aus dem DOM).
- **v-show**: Bedingtes Rendering basierend auf CSS (`display: none`). Nützlich für Elemente, die häufig ihren Zustand ändern.
- **v-for**: Rendering von Listen. Erfordert immer ein `:key`-Attribut.
- **v-model**: Bidirektionale Datenbindung (Data Binding), ideal für Formulare.

## 2. Praktisches Beispiel

```html
<script setup>
import { ref } from 'vue'

const tareas = ref([
  { id: 1, texto: 'Vue lernen', completada: true },
  { id: 2, texto: 'Pinia meistern', completada: false }
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
    <input v-model="nuevaTarea" @keyup.enter="agregarTarea" placeholder="Neue Aufgabe" />
    <ul>
      <li v-for="tarea in tareas" :key="tarea.id">
        <span :class="{ tachado: tarea.completada }">{{ tarea.texto }}</span>
      </li>
    </ul>
  </div>
</template>
```
