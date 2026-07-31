# イベント駆動型アーキテクチャと V8 エンジン

JavaScriptによるサーバーサイドへようこそ。Node.jsがWeb開発に革命をもたらしたのは、新しい言語だからではなく、Google ChromeのV8エンジンを非同期でノンブロッキングなイベントループ (Event Loop) と結合してバックエンドに持ち込んだからです。

## 1. 「シングルスレッド」の神話

Node.jsは「シングルスレッド (Single Threaded)」であると一般的に言われています。これは半分本当です。

* **メインスレッド (Main Thread):** あなたのJavaScriptコードを実行します。
* **スレッドプール (Thread Pool / libuv):** Nodeは、C++で書かれた `libuv` ライブラリによって管理される隠れたスレッドプールに、重いタスク（I/O、圧縮、暗号化、ネットワーク）を委譲します。

```mermaid
graph TD
    Cliente[HTTP クライアント] -->|リクエスト| MainThread[メインスレッド (V8)]
    MainThread -->|純粋な JS コードか？| Ejecucion[即座に実行される]
    MainThread -->|"ファイル/DB の読み取りか？"| EventLoop[イベントループ]
    
    EventLoop -->|委譲する| Libuv[libuv スレッドプール (C++)]
    Libuv -->|スレッド 1| Disco[(ファイルシステム)]
    Libuv -->|スレッド 2| DB[(データベース)]
    
    Disco -->|完了| CallbackQueue[コールバックキュー]
    DB -->|完了| CallbackQueue
    
    CallbackQueue -->|メインスレッドに戻す| MainThread
```

## 2. イベントループのブロック (大罪)

あなたのコード用のメインスレッドは1つしかないため、巨大な数学的演算や無限の `while` ループを実行すると、**サーバー全体がフリーズします**。他のユーザーはログインしたりデータをロードしたりできなくなります。

```javascript
// ❌ 危険：ブロッキングコード (同期的)
app.get('/hash', (req, res) => {
  // この2GBのファイルを読み込んでいる間、Node.jsは他の誰にも応答できません。
  const data = fs.readFileSync('/archivo-gigante.mp4'); 
  res.send('完了');
});

// ✅ 正解：ノンブロッキングコード (非同期的)
app.get('/hash', async (req, res) => {
  // Node はタスクを libuv に送信し、他の HTTP リクエストの処理を続行します
  const data = await fs.promises.readFile('/archivo-gigante.mp4');
  res.send('完了');
});
```

## 3. Node は CPU インテンシブ向けではない

ビデオ処理、人工知能モデルのトレーニング、または3Dレンダリングが必要な場合、Node.jsは間違ったツールです。CPUインテンシブなタスクには、Python（Cライブラリを使用）、Rust、またはGoの方が優れています。
Node.jsは、**I/Oインテンシブ** (Input/Output) なアプリケーションにおいて絶対的な王様です：リアルタイムチャット、REST API、データストリーミング、マイクロサービスなど。

## 次のステップ
Node.jsがどのように機能するかを理解しました。**ベーシックレベル**では理論を離れ、市場の90%を支配するフレームワークである Express.js を使用して最初の HTTP サーバーを作成します。
