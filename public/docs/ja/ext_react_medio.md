# React 中級：Context API、Prop Drilling、条件付きレンダリング

コンポーネントツリーが成長するにつれて、`props`（パラメータ）を使用して状態を親コンポーネントからひ孫コンポーネントに渡すことは、アーキテクチャ上の悪夢になります。このアンチパターンは **Prop Drilling** として知られています。

## 1. 問題点: Prop Drilling

```mermaid
graph TD
    App[App.jsx (theme=dark を持つ)] --> Header[Header.jsx]
    Header --> Nav[Nav.jsx]
    Nav --> Button[ThemeButton.jsx (theme が必要)]
    
    App -.->|theme を渡すが使用しない| Header
    Header -.->|theme を渡すが使用しない| Nav
    Nav -.->|最終的にそれを使用する| Button
```
`Header` と `Nav` は、自分たちには関係のないプロパティで汚染され、カプセル化の原則に違反します。

## 2. ネイティブの解決策: Context API

Context APIは、コンポーネント（その深さに関係なく）が接続してデータを直接読み取ることができるグローバルな保管庫です。

### ステップ 1: コンテキストの作成と提供

```jsx
// ThemeContext.jsx
import React, { createContext, useState } from 'react';

// 1. 次元ポータルを作成します
export const ThemeContext = createContext();

// 2. プロバイダー（状態のルーター）を作成します
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('dark');

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
```

最上位の `App.jsx` で、アプリケーションをラップします：
```jsx
<ThemeProvider>
  <Header />
</ThemeProvider>
```

### ステップ 2: コンテキストの消費 (useContext)

これで、ボタンは保管庫にテレポートして、`Header` と `Nav` を完全に無視してデータを取得できます。

```jsx
import React, { useContext } from 'react';
import { ThemeContext } from './ThemeContext';

export const ThemeButton = () => {
  // グローバルなエーテルから直接分割代入します
  const { theme, setTheme } = useContext(ThemeContext);

  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      現在のテーマ: {theme}
    </button>
  );
};
```

## 3. 高度な条件付きレンダリング

中規模のアプリケーションでは、コンポーネントを隠したり表示したりする必要が常にあります。このためにCSS（`display: none`）を使用することは避けてください。代わりに、仮想DOM（Virtual DOM）にコンポーネントを描画しないでください。

### 短絡論理演算子 (&&)
状態が2つ（表示するか、何もしないか）しかない場合のデファクトスタンダードです。
```jsx
const LoadingSpinner = ({ isLoading }) => {
  return (
    <div>
      {/* isLoading が true の場合、React は Spinner を描画します。false の場合、コンポーネントは無視されます */}
      {isLoading && <Spinner />}
    </div>
  );
};
```

武器庫にContext APIがあれば、認証、ショッピングカート、グローバルなテーマの状態を処理できます。しかし、グローバルなビジネスルールが純粋で複雑な数学になると、Contextはレンダリングのボトルネックに悩まされ始めます。**上級レベル**では、Redux ToolkitやZustandのような不変なグローバルアーキテクチャに進みます。
