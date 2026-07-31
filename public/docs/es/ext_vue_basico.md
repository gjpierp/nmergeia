# Fundamentos y Directivas

Vue utiliza directivas integradas en el HTML para extender su comportamiento de manera declarativa.

## 1. Directivas Principales

- **v-if / v-else**: Renderizado condicional real (elimina el nodo del DOM).
- **v-show**: Renderizado condicional basado en CSS (`display: none`). Útil para elementos que cambian de estado frecuentemente.
- **v-for**: Renderizado de listas. Siempre requiere un atributo `:key`.
- **v-model**: Data binding bidireccional, ideal para formularios.

## 2. Ejemplo Práctico

```html
<script setup>
import { ref } from 'vue'

const tareas = ref([
  { id: 1, texto: 'Aprender Vue', completada: true },
  { id: 2, texto: 'Dominar Pinia', completada: false }
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
    <input v-model="nuevaTarea" @keyup.enter="agregarTarea" placeholder="Nueva tarea" />
    <ul>
      <li v-for="tarea in tareas" :key="tarea.id">
        <span :class="{ tachado: tarea.completada }">{{ tarea.texto }}</span>
      </li>
    </ul>
  </div>
</template>
```
