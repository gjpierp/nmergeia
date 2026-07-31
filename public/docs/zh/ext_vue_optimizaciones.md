# 极致优化与 SSR (服务端渲染)

Vue 3 速度很快，但在企业级应用程序中需要进行架构优化。

## 1. 组件的懒加载 (Lazy Loading)
在需要之前，不要加载模态框或次级视图。使用 `defineAsyncComponent`。

```javascript
import { defineAsyncComponent } from 'vue'

const ModalPesado = defineAsyncComponent(() =>
  import('./components/ModalPesado.vue')
)
```

## 2. 记忆化 (Memoization) 与 `v-once` / `v-memo`
如果你有一个巨大的列表或者一个只需渲染一次的元素：

- `v-once`: 仅渲染组件一次，并在未来的重新渲染中将其视为静态内容。
- `v-memo`: 相当于 React 的 `useMemo`。除非依赖项发生更改，否则避免重新渲染。

```html
<div v-memo="[item.id, item.estado]">
  <!-- 仅在 item.id 或 item.estado 更改时更新 -->
  {{ item.nombre }}
</div>
```

## 3. Server-Side Rendering (Nuxt)
为了获得极佳的 SEO 和超快的首次内容绘制 (FCP)，Vue 应用的自然演进是迁移到 **Nuxt 3**。
