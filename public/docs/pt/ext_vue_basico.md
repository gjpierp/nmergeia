# Fundamentos e Diretivas

Vue utiliza diretivas integradas no HTML para estender seu comportamento de maneira declarativa.

## 1. Diretivas Principais

- **v-if / v-else**: Renderização condicional real (remove o nó do DOM).
- **v-show**: Renderização condicional baseada em CSS (`display: none`). Útil para elementos que mudam de estado com frequência.
- **v-for**: Renderização de listas. Sempre requer um atributo `:key`.
- **v-model**: Data binding bidirecional, ideal para formulários.

## 2. Exemplo Prático

```html
<script setup>
import { ref } from 'vue'

const tarefas = ref([
  { id: 1, texto: 'Aprender Vue', completada: true },
  { id: 2, texto: 'Dominar Pinia', completada: false }
])
const novaTarefa = ref('')

const adicionarTarefa = () => {
  if (novaTarefa.value.trim()) {
    tarefas.value.push({ id: Date.now(), texto: novaTarefa.value, completada: false })
    novaTarefa.value = ''
  }
}
</script>

<template>
  <div>
    <input v-model="novaTarefa" @keyup.enter="adicionarTarefa" placeholder="Nova tarefa" />
    <ul>
      <li v-for="tarefa in tarefas" :key="tarefa.id">
        <span :class="{ tachado: tarefa.completada }">{{ tarefa.texto }}</span>
      </li>
    </ul>
  </div>
</template>
```
