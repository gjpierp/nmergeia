# Node.js ベーシック：Express.js と REST アーキテクチャ

Node.jsにはサーバーを作成するためのネイティブモジュール `http` が用意されていますが、低レベルすぎて冗長です。そのため、エコシステムはデファクトスタンダードとして **Express.js** を採用しました。Expressはルーティングとリクエストを抽象化し、RESTful APIを数分で構築できるようにします。

## 1. Express の Hello World

サーバーの初期化は非常に簡単ですが、後で見るパイプライン（pipeline）設計を内包しています。

```javascript
const express = require('express');
const app = express();
const PORT = 3000;

// JSON を解析するための組み込みミドルウェア
app.use(express.json());

// 基本的な GET ルート
app.get('/api/usuarios', (req, res) => {
  res.status(200).json({ mensaje: "ユーザーリスト", data: [] });
});

app.listen(PORT, () => {
  console.log(`サーバーがポート ${PORT} で実行中`);
});
```

## 2. REST メソッド (CRUD)

プロフェッショナルな REST API は、HTTP 動詞をデータベースのアクションにマッピングする必要があります。データを取得するために `POST` を使用したり、削除するために `GET` を使用したりしないでください。

| HTTP 動詞 | CRUD 操作 | ルートの例 |
| :--- | :--- | :--- |
| **GET** | 読み取り (Read) | `/api/usuarios` (すべて) |
| **GET** | 読み取り (Read) | `/api/usuarios/:id` (1つのみ) |
| **POST** | 作成 (Create) | `/api/usuarios` |
| **PUT** | 全体更新 | `/api/usuarios/:id` |
| **PATCH** | 部分更新 | `/api/usuarios/:id` |
| **DELETE** | 削除 (Delete) | `/api/usuarios/:id` |

### POST の実践例

```javascript
app.post('/api/usuarios', (req, res) => {
  // req.body にはフロントエンド (React/Angular) から送信された JSON が含まれています
  const { nombre, email } = req.body;
  
  if (!nombre || !email) {
    // 400 Bad Request
    return res.status(400).json({ error: "必須フィールドが不足しています" });
  }

  // ここにデータベースのロジック...

  // 201 Created
  res.status(201).json({ mensaje: "ユーザーが正常に作成されました" });
});
```

## 3. ルートのパラメータ化 (Params vs Queries)

フロントエンドがどのようにURL経由でデータを送信するかを理解することが重要です。

* **Req.Params (`/api/usuarios/5`):** 一意の識別子。
  ```javascript
  app.get('/api/usuarios/:id', (req, res) => {
    console.log(req.params.id); // "5"
  });
  ```
* **Req.Query (`/api/usuarios?rol=admin&edad=25`):** フィルター、検索、ページネーション。
  ```javascript
  app.get('/api/usuarios', (req, res) => {
    console.log(req.query.rol); // "admin"
  });
  ```

これでルートを作成できるようになりましたが、すべてを1つの `index.js` ファイルに詰め込むとスパゲッティコードが作成されます。**中級レベル**では、レイヤー（Routes, Controllers, Services）ごとのアーキテクチャの構造化と、Expressの最も重要な概念である「ミドルウェア (Middlewares)」について学びます。
