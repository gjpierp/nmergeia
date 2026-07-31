# State Management with Pinia

Vuex is deprecated. The modern standard for global state management in Vue 3 is **Pinia**.

## 1. Why Pinia?
Pinia is extremely lightweight, has native TypeScript support, doesn't require complex nested mutations, and allows you to create multiple modular stores.

## 2. Defining a Store (Setup Syntax)

```javascript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  // State
  const user = ref(null)
  
  // Getters
  const isAuthenticated = computed(() => user.value !== null)
  
  // Actions
  const login = async (credentials) => {
    const res = await api.post('/login', credentials)
    user.value = res.data
  }
  
  const logout = () => {
    user.value = null
  }

  return { user, isAuthenticated, login, logout }
})
```

## 3. Usage in the Component

```html
<script setup>
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
</script>
```
