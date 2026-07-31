# Optimisation Extrême et SSR

Vue 3 est rapide, mais dans les applications Enterprise, il nécessite des optimisations architecturales.

## 1. Lazy Loading de Composants
Ne chargez pas les fenêtres modales ou les vues secondaires tant qu'elles ne sont pas nécessaires. Utilisez `defineAsyncComponent`.

```javascript
import { defineAsyncComponent } from 'vue'

const ModalPesado = defineAsyncComponent(() =>
  import('./components/ModalPesado.vue')
)
```

## 2. Mémoïsation et `v-once` / `v-memo`
Si vous avez une liste énorme ou un élément qui ne doit être rendu qu'une seule fois :

- `v-once` : Rend le composant une seule fois et le traite comme statique lors des rendus futurs.
- `v-memo` : Équivalent de `useMemo` de React. Évite les rendus à moins que les dépendances ne changent.

```html
<div v-memo="[item.id, item.estado]">
  <!-- Mis à jour uniquement si item.id ou item.estado changent -->
  {{ item.nombre }}
</div>
```

## 3. Server-Side Rendering (Nuxt)
Pour un SEO et un First Contentful Paint (FCP) ultra-rapide, l'évolution naturelle d'une application Vue est de migrer vers **Nuxt 3**.
