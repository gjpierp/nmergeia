# React 上級：グローバル状態管理 (Redux Toolkit & Zustand)

ReactのContext APIは、（ダーク/ライトテーマやユーザーセッションのような）静的な依存関係には素晴らしいものです。しかし、データが1秒間に何千回も変更される（ソケット、フィルター、リアルタイムチャートなど）巨大なダッシュボード（NMergeIAなど）を構築する場合、**Contextはアーキテクチャ的に崩壊します**。

なぜでしょうか？ Context Provider内の値が変更されると、そのコンテキストを購読している**すべて**のコンポーネントが、そのデータのほんのわずかな部分しか必要としていない場合でも、即座に再レンダリングされるからです。

## 1. アトミックマネージャー / Flux の台頭

**選択的セレクター (Selectores Selectivos)** を可能にするマネージャーが必要です：コンポーネントがユーザーの `nombre`（名前）のみを読み取る必要がある場合、`edad`（年齢）が変更されても再レンダリングされるべきではありません。

### Zustand アーキテクチャ (現代の標準)
古典的なReduxの反復的なコード（Actions, Reducers, Types）の時代は終わりました。今日、Zustandはそのシンプルさと強力さでエコシステムをリードしています。

```mermaid
graph LR
    subgraph sub_1 [Zustand ストア (Store)]
        Estado[(グローバル状態)]
        Acciones[ミューテーター (Setters)]
    end
    
    ComponenteA[コンポーネント A (名前を読み取る)] -->|選択的セレクター| Estado
    ComponenteB[コンポーネント B (年齢を変更する)] -->|呼び出す| Acciones
    Acciones -->|"不変 (イミュータブル) に変更する"| Estado
```

## 2. Zustand での Store の実装

Zustandを使用すると、Reactツリーの外部にグローバルな状態フックを作成でき、`App.jsx` 内の息苦しい `<Provider>` の必要性を排除できます。

```jsx
// store/useUserStore.js
import { create } from 'zustand';

export const useUserStore = create((set) => ({
  // 初期状態
  usuario: { nombre: 'Alice', edad: 25 },
  tema: 'oscuro',
  
  // アクション (ミューテーター)
  setNombre: (nuevoNombre) => set((state) => ({
    usuario: { ...state.usuario, nombre: nuevoNombre }
  })),
  
  toggleTema: () => set((state) => ({
    tema: state.tema === 'oscuro' ? 'claro' : 'oscuro'
  }))
}));
```

## 3. 外科的セレクター (パフォーマンスの秘密)

ここがZustandがContext APIを圧倒するところです。コンポーネント内で状態全体を呼び出すことはせず、コールバック関数を使用して関心のあるもの**だけ**を抽出します。

```jsx
import { useUserStore } from './store/useUserStore';

export const UserBadge = () => {
  // 外科的セレクター：'tema' が変更されても、このコンポーネントは再レンダリングされません。
  // 'usuario.nombre' が変更された場合にのみ反応します。
  const nombre = useUserStore((state) => state.usuario.nombre);
  
  return <div className="badge">{nombre}</div>;
};

export const ThemeSwitcher = () => {
  // ミューテーターアクションを分割代入します
  const toggleTema = useUserStore((state) => state.toggleTema);
  
  return <button onClick={toggleTema}>テーマを変更</button>;
};
```

## 4. ミドルウェアと永続性

Reactのライフサイクルの外にあるため、これらのマネージャーは1行のコードでネイティブの「ミドルウェア」を注入できます。F5（ページのリロード）を行っても状態を維持したいですか？

```jsx
import { persist } from 'zustand/middleware';

export const useAppStore = create(
  persist(
    (set) => ({
      filtros: [],
      addFiltro: (f) => set((s) => ({ filtros: [...s.filtros, f] }))
    }),
    {
      name: 'nmerge-storage', // Zustandは自動的に保存し、LocalStorageと同期します
    }
  )
);
```

**エキスパート**レベルでは、状態を離れ、React開発者が最も恐れる地獄に集中します。それは、深い非同期処理、React QueryによるHTTPリクエストのキャッシュ、そしてSSRです。
