# Otimização Extrema e SSR

O Vue 3 é rápido, mas em aplicativos corporativos (Enterprise) requer otimizações arquitetônicas.

## 1. Lazy Loading de Componentes
Não carregue modais ou visualizações secundárias até que sejam necessários. Use `defineAsyncComponent`.

```javascript
import { defineAsyncComponent } from 'vue'

const ModalPesado = defineAsyncComponent(() =>
  import('./components/ModalPesado.vue')
)
```

## 2. Memoização e `v-once` / `v-memo`
Se você tiver uma lista enorme ou um elemento que deve ser renderizado apenas uma vez:

- `v-once`: Renderiza o componente uma única vez e o trata como estático em futuras re-renderizações.
- `v-memo`: Equivalente ao `useMemo` do React. Evita re-renderizações, a menos que as dependências mudem.

```html
<div v-memo="[item.id, item.estado]">
  <!-- Só é atualizado se item.id ou item.estado mudarem -->
  {{ item.nome }}
</div>
```

## 3. Server-Side Rendering (Nuxt)
Para SEO e First Contentful Paint (FCP) ultrarrápido, a evolução natural de um aplicativo Vue é migrar para o **Nuxt 3**.
