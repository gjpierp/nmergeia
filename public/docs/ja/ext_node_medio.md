# Node.js 中級：ミドルウェア、コントローラー、階層化アーキテクチャ

すべてのビジネスロジック（SQLクエリ、バリデーション、メール送信）を `app.get()` 内に直接詰め込むのは、Expressにおける最悪のアンチパターンです。コードはテスト不可能で混沌としたものになります。

## 1. MVC パターン / 階層化アーキテクチャ

責任を分離する必要があります。ルート（Routes）層はルーティングのみを行い、コントローラー（Controller）はHTTPリクエストからデータを抽出し、サービス（Service）は計算やデータベースの操作を実行します。

```mermaid
graph LR
    Cliente[クライアント / React] -->|HTTP リクエスト| Routes[ルート (Router)]
    Routes -->|委譲する| Controller[コントローラー]
    Controller -->|req.body を抽出する| Service[サービス層]
    Service -->|クエリ| DB[(データベース)]
    
    DB --> Service
    Service -->|純粋な結果| Controller
    Controller -->|"res.status(200)"| Cliente
```

## 2. Express の心臓部：ミドルウェア

ミドルウェアとは、単に**中間（ミドル）で**実行される関数のことです。つまり、リクエストが到着した後、コントローラーに到達する前に実行されます。

これらはバリデーション、セキュリティ、ログ、認証に最適なメカニズムです。これらは `req`、`res`、および魔法の関数 `next()` にアクセスできます。

```javascript
// 認証ミドルウェア
const verificarToken = (req, res, next) => {
  const token = req.headers['authorization'];
  
  if (!token) {
    return res.status(401).json({ error: "権限がありません、トークンが不足しています" });
  }

  // トークンが有効な場合、次のリンクにボールを渡します
  if (token === "TOKEN_SECRETO") {
    next(); 
  } else {
    return res.status(403).json({ error: "無効なトークン" });
  }
};

// 保護されたルートにミドルウェアを注入する
app.get('/api/datos-privados', verificarToken, (req, res) => {
  res.json({ secreto: "コカ・コーラの公式" });
});
```

## 3. グローバルエラーハンドリング (セーフティネット)

「すべての」コントローラーに `try/catch` を配置して500エラーを返す代わりに、専門家は**エラーハンドリングミドルウェア**を使用します。
Expressでは、4つのパラメータ `(err, req, res, next)` を持つミドルウェアを宣言すると、Expressはそれがグローバルなエラーインターセプターであることを認識します。

```javascript
// コントローラー (非同期の失敗をシミュレート)
app.get('/api/fallo', async (req, res, next) => {
  try {
    throw new Error("データベースが崩壊しました");
  } catch (error) {
    next(error); // エラーをグローバルハンドラーに送信します
  }
});

// グローバルエラーミドルウェア (常に index.js ファイルの最後に配置します)
app.use((err, req, res, next) => {
  console.error(err.stack); // サーバーにログを保存します
  res.status(500).json({ 
    mensaje: "内部サーバーエラー", 
    detalles: err.message 
  });
});
```

このアーキテクチャはあなたを遠くまで連れて行きますが、今日、厳密な型付け（Typing）なしでExpressを使用することは企業リスクです。**上級レベル**では、NestJSに飛躍するか、依存性の注入（DI）を備えたTypeScript (OOP) にExpressを移行します。
