# Extreme Optimization and SSR

Vue 3 is fast, but in Enterprise applications it requires architectural optimizations.

## 1. Component Lazy Loading
Do not load modals or secondary views until they are needed. Use `defineAsyncComponent`.

```javascript
import { defineAsyncComponent } from 'vue'

const HeavyModal = defineAsyncComponent(() =>
  import('./components/HeavyModal.vue')
)
```

## 2. Memoization and `v-once` / `v-memo`
If you have a huge list or an element that should only be rendered once:

- `v-once`: Renders the component only once and treats it as static in future re-renders.
- `v-memo`: Equivalent to React's `useMemo`. Avoids re-renders unless dependencies change.

```html
<div v-memo="[item.id, item.status]">
  <!-- Only updates if item.id or item.status change -->
  {{ item.name }}
</div>
```

## 3. Server-Side Rendering (Nuxt)
For SEO and ultra-fast First Contentful Paint (FCP), the natural evolution of a Vue app is to migrate to **Nuxt 3**.
