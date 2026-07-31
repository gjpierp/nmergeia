# Extreme Optimierung und SSR

Vue 3 ist schnell, erfordert jedoch in Enterprise-Anwendungen architektonische Optimierungen.

## 1. Lazy Loading von Komponenten
Laden Sie Modale oder sekundäre Ansichten erst, wenn sie benötigt werden. Verwenden Sie `defineAsyncComponent`.

```javascript
import { defineAsyncComponent } from 'vue'

const ModalPesado = defineAsyncComponent(() =>
  import('./components/ModalPesado.vue')
)
```

## 2. Memoization und `v-once` / `v-memo`
Wenn Sie eine riesige Liste oder ein Element haben, das nur einmal gerendert werden soll:

- `v-once`: Rendert die Komponente nur einmal und behandelt sie bei zukünftigen Re-Renderings als statisch.
- `v-memo`: Entspricht `useMemo` von React. Vermeidet Re-Renderings, es sei denn, die Abhängigkeiten ändern sich.

```html
<div v-memo="[item.id, item.estado]">
  <!-- Wird nur aktualisiert, wenn sich item.id oder item.estado ändern -->
  {{ item.nombre }}
</div>
```

## 3. Server-Side Rendering (Nuxt)
Für SEO und ultraschnelles First Contentful Paint (FCP) ist die natürliche Weiterentwicklung einer Vue-App die Migration zu **Nuxt 3**.
