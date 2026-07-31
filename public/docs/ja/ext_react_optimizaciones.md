# React 最適化：プロファイリング、メモ化、および高性能レンダリング

あなたのReactアプリケーションはZustandとReact Queryを使用しています。アーキテクチャは完璧です。しかし、5,000件のレコードを持つテーブルをレンダリングすると、ブラウザはフリーズし、入力時の文字入力には*ラグ*が生じ、CPUファンが唸りを上げます。

あなたは再レンダリング（Re-render）の地獄に衝突したのです。この極限の最適化レベル（🔥）では、メスを使用して不要なレンダリングを切り落とし、コードを分割する（コードスプリッティング / Code Splitting）方法を学びます。

## 1. 静かなる暗殺者：不要な再レンダリング

デフォルトでは、Reactの数学的な動作は次のようになります：**「親コンポーネントが更新された場合（例：状態が変わった場合）、その`props`が変更されていなくても、すべての子、孫、ひ孫コンポーネントが再レンダリングされる」**。

### 解決策: React.memo()

`React.memo` は関数コンポーネントをラップし、その出力をメモ化（記憶）します。親がレンダリングされると、Reactは子の `props` をチェックします。それらが完全に同一である場合、Reactはその子のレンダリングを**中止（アボート）**し、以前の写真を使用します。

```jsx
import React, { memo } from 'react';

// 非常に重いコンポーネント (例: 3D グラフや巨大なテーブル)
const TablaMasiva = ({ data, onFiltro }) => {
  console.log("テーブルがレンダリングされました"); // 'memo' がないと、これは絶え間なく出力されます
  return <BigGrid data={data} />;
};

// memo でラップします
export const TablaOptimizada = memo(TablaMasiva);
```

## 2. メモの破壊：参照の等価性 (useCallback)

`React.memo` は厳密な比較（`===`）を行います。これは文字列やブール値にはうまく機能しますが、**関数**や**オブジェクト**では大失敗します。なぜなら、JavaScriptでは、同じ内容を持つ2つのオブジェクトや関数はメモリ上で等しくないからです。

親が `memo` を持つ子に無名関数や再作成された関数を渡すと、子は親のレンダリングのたびに関数のメモリ参照が変更されたと認識し、`memo` を壊してしまいます。

ここで **useCallback** の出番です：

```jsx
import React, { useState, useCallback } from 'react';
import { TablaOptimizada } from './Tabla';

export const Dashboard = () => {
  const [texto, setTexto] = useState('');

  // 危険：useCallback を使用しない場合、この関数は
  // ユーザーが Input (setTexto) で入力するたびに新しいメモリアドレスで生成されます。
  // そしてそれは 'TablaOptimizada' に愚かにも再レンダリングを強制します。
  const procesarFiltro = useCallback((filtroId) => {
    ejecutarQuery(filtroId);
  }, []); // 空の配列：関数は「1回だけ」作成され、そのメモリアドレスを維持します。

  return (
    <div>
      {/* ここに入力すると 'texto' が変わり、Dashboard は再レンダリングされます */}
      <input value={texto} onChange={e => setTexto(e.target.value)} />
      
      {/* しかし、'procesarFiltro' の参照は変わっていないため、テーブルは救われます */}
      <TablaOptimizada onFiltro={procesarFiltro} />
    </div>
  );
};
```

## 3. 追加の重要な最適化

### リストの仮想化
実際のDOMに10,000個の要素をレンダリングすると、Reactをどれだけ最適化してもブラウザは破壊されます。画面外（ビューポート外）にある要素を描画してはいけません。
**必須ライブラリ：** `TanStack Virtual` または `react-window`。ユーザーが見ている10〜20個のノードだけを描画し、スクロール時にそれらをリサイクルします（AndroidのRecyclerViewの動作と同じです）。

### コード分割 (Lazy Loading / Code Splitting)
5MBのバンドル（メインJSファイル）は受け入れられません。ユーザーが訪問したものだけをダウンロードするようにアプリケーションを分割する必要があります。

```jsx
import React, { Suspense, lazy } from 'react';

// AdminPanel コンポーネントはランディングの初期バンドルにはダウンロードされ「ません」。
// この行が実行されたときにのみネットワークからダウンロードされます。
const AdminPanel = lazy(() => import('./AdminPanel'));

export const App = () => {
  return (
    <Suspense fallback={<SpinnerCarga />}>
      <Routes>
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </Suspense>
  );
};
```

外科的なメモ化、ビッグデータのための仮想化、およびルートレベルでの大規模なコード分割を適用することで、Reactアプリケーションはローエンドのデバイスでも一定の60fpsで実行されます。あなたは今、エリートのフロントエンドエンジニアです。
