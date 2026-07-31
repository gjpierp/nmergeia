# 究極の最適化とSSR

Vue 3は高速ですが、エンタープライズアプリケーションではアーキテクチャの最適化が必要です。

## 1. コンポーネントのレイジーローディング
必要になるまでモーダルやセカンダリビューを読み込まないでください。`defineAsyncComponent`を使用します。

```javascript
import { defineAsyncComponent } from 'vue'

const ModalPesado = defineAsyncComponent(() =>
  import('./components/ModalPesado.vue')
)
```

## 2. メモ化と `v-once` / `v-memo`
巨大なリストや一度だけレンダリングすべき要素がある場合：

- `v-once`: コンポーネントを一度だけレンダリングし、将来の再レンダリングでは静的なものとして扱います。
- `v-memo`: Reactの`useMemo`に相当します。依存関係が変更されない限り、再レンダリングを防ぎます。

```html
<div v-memo="[item.id, item.estado]">
  <!-- item.id または item.estado が変更された場合のみ更新されます -->
  {{ item.nombre }}
</div>
```

## 3. サーバーサイドレンダリング (Nuxt)
SEOと超高速なFirst Contentful Paint (FCP) のために、Vueアプリの自然な進化は**Nuxt 3**への移行です。
