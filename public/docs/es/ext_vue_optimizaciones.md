# Optimización Extrema y SSR

Vue 3 es rápido, pero en aplicaciones Enterprise requiere optimizaciones arquitectónicas.

## 1. Lazy Loading de Componentes
No cargues modales o vistas secundarias hasta que se necesiten. Utiliza `defineAsyncComponent`.

```javascript
import { defineAsyncComponent } from 'vue'

const ModalPesado = defineAsyncComponent(() =>
  import('./components/ModalPesado.vue')
)
```

## 2. Memoización y `v-once` / `v-memo`
Si tienes una lista enorme o un elemento que solo debe renderizarse una vez:

- `v-once`: Renderiza el componente una sola vez y lo trata como estático en re-renderizados futuros.
- `v-memo`: Equivalente a `useMemo` de React. Evita re-renderizados a menos que las dependencias cambien.

```html
<div v-memo="[item.id, item.estado]">
  <!-- Solo se actualiza si item.id o item.estado cambian -->
  {{ item.nombre }}
</div>
```

## 3. Server-Side Rendering (Nuxt)
Para SEO y First Contentful Paint (FCP) ultra rápido, la evolución natural de una app Vue es migrar a **Nuxt 3**.
