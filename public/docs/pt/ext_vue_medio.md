# Componentes, Props e Emits

À medida que sua aplicação cresce, você precisa dividir a UI em componentes reutilizáveis que se comuniquem entre si.

## 1. Comunicação Pai para Filho (Props)

As **Props** são somente leitura. Um componente filho nunca deve mutar uma prop diretamente.

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
    <p>Valor: {{ contador }}</p>
  </div>
</template>
```

## 2. Comunicação Filho para Pai (Emits)

Para avisar ao pai sobre um evento, usamos `defineEmits`.

```html
<script setup>
const emit = defineEmits(['atualizar'])

const notificarPai = () => {
  emit('atualizar', 'novo valor')
}
</script>

<template>
  <button @click="notificarPai">Notificar</button>
</template>
```
