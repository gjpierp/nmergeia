# 使用 Pinia 进行状态管理

Vuex 已被弃用。Vue 3 中全局状态管理的现代标准是 **Pinia**。

## 1. 为什么选择 Pinia？
Pinia 极其轻量，对类型（TypeScript）有原生支持，不需要复杂的嵌套 mutations，并且允许创建多个模块化的 stores（数据仓库）。

## 2. 定义 Store (Setup 语法)

```javascript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  // State (状态)
  const usuario = ref(null)
  
  // Getters (计算属性)
  const estaAutenticado = computed(() => usuario.value !== null)
  
  // Actions (动作)
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

## 3. 在组件中使用

```html
<script setup>
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
</script>
```
