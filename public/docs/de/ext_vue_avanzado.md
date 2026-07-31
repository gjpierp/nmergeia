# Zustandsverwaltung mit Pinia

Vuex ist veraltet. Der moderne Standard für das globale State Management in Vue 3 ist **Pinia**.

## 1. Warum Pinia?
Pinia ist extrem leichtgewichtig, hat native Typisierungsunterstützung (TypeScript), erfordert keine komplexen verschachtelten Mutationen und ermöglicht die Erstellung mehrerer modularer Stores (Geschäfte).

## 2. Definieren eines Stores (Setup Syntax)

```javascript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  // State
  const usuario = ref(null)
  
  // Getters
  const estaAutenticado = computed(() => usuario.value !== null)
  
  // Actions
  const login = async (credenciales) => {
    const res = await api.post('/login', credenciales)
    usuario.value = res.data
  }
  
  const logout = () => {
    usuario.value = null
  }

  return { usuario, estaAutenticado, login, logout }
})
```

## 3. Verwendung in der Komponente

```html
<script setup>
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
</script>
```
