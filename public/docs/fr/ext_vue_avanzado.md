# Gestion d'État avec Pinia

Vuex est obsolète. Le standard moderne pour la gestion d'état global dans Vue 3 est **Pinia**.

## 1. Pourquoi Pinia ?
Pinia est extrêmement léger, bénéficie d'un support de typage natif (TypeScript), ne nécessite pas de mutations imbriquées complexes et permet de créer plusieurs magasins (stores) modulaires.

## 2. Définir un Store (Syntaxe Setup)

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

## 3. Utilisation dans le Composant

```html
<script setup>
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
</script>
