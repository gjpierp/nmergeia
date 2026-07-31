# Piniaによる状態管理

Vuexは非推奨となりました。Vue 3におけるグローバル状態管理の最新の標準は**Pinia**です。

## 1. なぜPiniaなのか？
Piniaは非常に軽量で、ネイティブの型サポート（TypeScript）を備えており、複雑なネストされたミューテーションを必要とせず、複数のモジュール式ストア（stores）を作成できます。

## 2. ストアの定義 (Setup Syntax)

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

## 3. コンポーネントでの使用

```html
<script setup>
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
</script>
```
