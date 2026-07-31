# Composants, Props et Emits

À mesure que votre application grandit, vous devez diviser l'interface utilisateur en composants réutilisables qui communiquent entre eux.

## 1. Communication Parent vers Enfant (Props)

Les **Props** sont en lecture seule. Un composant enfant ne doit jamais muter une prop directement.

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
    <p>Valeur : {{ contador }}</p>
  </div>
</template>
```

## 2. Communication Enfant vers Parent (Emits)

Pour avertir le parent d'un événement, nous utilisons `defineEmits`.

```html
<script setup>
const emit = defineEmits(['actualizar'])

const notificarPadre = () => {
  emit('actualizar', 'nouvelle valeur')
}
</script>

<template>
  <button @click="notificarPadre">Notifier</button>
</template>
```
