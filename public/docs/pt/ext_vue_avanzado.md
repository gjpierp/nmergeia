# Gerenciamento de Estado com Pinia

Vuex está descontinuado. O padrão moderno para o gerenciamento de estado global no Vue 3 é o **Pinia**.

## 1. Por que Pinia?
Pinia é extremamente leve, tem suporte nativo para tipagem (TypeScript), não requer mutações aninhadas complexas e permite criar várias lojas (stores) modulares.

## 2. Definindo uma Store (Setup Syntax)

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

## 3. Uso no Componente

```html
<script setup>
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
</script>
```
