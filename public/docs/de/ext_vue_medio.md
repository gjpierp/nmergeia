# Komponenten, Props und Emits

Wenn Ihre Anwendung wächst, müssen Sie die UI in wiederverwendbare Komponenten unterteilen, die miteinander kommunizieren.

## 1. Eltern-zu-Kind-Kommunikation (Props)

**Props** sind schreibgeschützt. Eine untergeordnete Komponente (Kind) sollte niemals eine Prop direkt mutieren.

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
    <p>Wert: {{ contador }}</p>
  </div>
</template>
```

## 2. Kind-zu-Eltern-Kommunikation (Emits)

Um das übergeordnete Element (Eltern) über ein Ereignis zu informieren, verwenden wir `defineEmits`.

```html
<script setup>
const emit = defineEmits(['actualizar'])

const notificarPadre = () => {
  emit('actualizar', 'neuer Wert')
}
</script>

<template>
  <button @click="notificarPadre">Benachrichtigen</button>
</template>
```
