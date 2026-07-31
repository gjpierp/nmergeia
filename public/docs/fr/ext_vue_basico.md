# Fondamentaux et Directives

Vue utilise des directives intégrées au HTML pour étendre son comportement de manière déclarative.

## 1. Directives Principales

- **v-if / v-else** : Rendu conditionnel réel (supprime le nœud du DOM).
- **v-show** : Rendu conditionnel basé sur le CSS (`display: none`). Utile pour les éléments qui changent d'état fréquemment.
- **v-for** : Rendu de listes. Nécessite toujours un attribut `:key`.
- **v-model** : Liaison de données bidirectionnelle (data binding), idéale pour les formulaires.

## 2. Exemple Pratique

```html
<script setup>
import { ref } from 'vue'

const tareas = ref([
  { id: 1, texto: 'Apprendre Vue', completada: true },
  { id: 2, texto: 'Maîtriser Pinia', completada: false }
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
    <input v-model="nuevaTarea" @keyup.enter="agregarTarea" placeholder="Nouvelle tâche" />
    <ul>
      <li v-for="tarea in tareas" :key="tarea.id">
        <span :class="{ tachado: tarea.completada }">{{ tarea.texto }}</span>
      </li>
    </ul>
  </div>
</template>
```
