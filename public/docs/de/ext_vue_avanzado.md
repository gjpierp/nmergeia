# Gestión de Estado con Pinia

Vuex está deprecado. El estándar moderno para la gestión de estado global en Vue 3 es **Pinia**.

## 1. ¿Por qué Pinia?
Pinia es extremadamente ligero, tiene soporte de tipado (TypeScript) nativo, no requiere mutaciones anidadas complejas y permite crear múltiples tiendas (stores) modulares.

## 2. Definiendo un Store (Setup Syntax)

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

## 3. Uso en el Componente

```html
<script setup>
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
</script>
```
