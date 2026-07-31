# Node.js 最適化：ワーカー・スレッド、クラスター、および PM2

ついに頂点に達しました。Node.jsサーバーは完璧に動作していますが、16コア（Cores）のサーバーにAPIをデプロイしているのに、Node.jsは1つしか使用していないことに気づきます。ユーザーが遅さに苦しんでいる間、サーバーの93%はアイドル状態です。

なぜでしょうか？ Nodeは単一のメインスレッド（Main Thread）で実行されるからです。

## 1. クラスター (Cluster) モジュール (ローカルでの水平スケーリング)

マルチコアサーバーを活用するには、アプリケーションを複製する必要があります。ネイティブの `cluster` モジュールを使用すると、CPUの物理コアごとにNodeプロセスを作成できます。

マスター（Master）プロセスは内部のロードバランサーとして機能し、インターネットからHTTPリクエストを受け取り、*ラウンドロビン (Round-Robin)* モードでそのクローン（Workers）に分配します。

```javascript
const cluster = require('cluster');
const os = require('os');
const express = require('express');

if (cluster.isPrimary) {
  // マスターのコード
  const numeroCores = os.cpus().length;
  console.log(`マスター PID ${process.pid} が実行中`);

  // コアの数に応じてプロセスをクローンします
  for (let i = 0; i < numeroCores; i++) {
    cluster.fork();
  }

  // 自己修復: ワーカーがクラッシュした (OOM) 場合、新しいワーカーを起動します
  cluster.on('exit', (worker, code, signal) => {
    console.log(`ワーカー ${worker.process.pid} が死亡しました。代替を作成中...`);
    cluster.fork();
  });
} else {
  // 労働者 (ワーカー / Workers) のコード
  const app = express();
  app.get('/', (req, res) => res.send(`ワーカー ${process.pid} が対応しました`));
  
  app.listen(3000, () => {
    console.log(`ワーカー ${process.pid} が開始しました`);
  });
}
```

## 2. PM2: 本番環境の標準

今日、上記のクラスターコードを直接手書きする人は誰もいません。私たちはプロセス管理ツール **PM2** を使用します。これにより、コードを1行も変更することなく、通常のExpressアプリケーションをクラスターモードで実行できます。さらに、OSのクラッシュや再起動後もサーバーを維持（自動起動）できます。

```bash
# 可能な最大 CPU 数を使用してアプリを起動します
pm2 start index.js -i max --name mi-api-node

# リアルタイムで RAM/CPU の消費を監視します (ターミナルインターフェース)
pm2 monit
```

## 3. ワーカー・スレッド (Worker Threads / CPUインテンシブな垂直スケーリング)

他のユーザーへのイベントループをブロックすることなく、Node.js内で（画像圧縮や仮想通貨のマイニングなどの）重い数学的タスクを実行**しなければならない**場合はどうなるでしょうか？

`worker_threads` を使用します。クラスターのサブプロセス（V8から独立した独自のメモリを持つ）とは異なり、ワーカー・スレッドは `SharedArrayBuffer` を介してメモリを共有し、同じNode.jsプロセス内で真のマルチスレッド並列処理を可能にします。

```javascript
const { Worker, isMainThread, parentPort } = require('worker_threads');

if (isMainThread) {
  // メインスレッドは重い計算を委譲します
  const worker = new Worker(__filename);
  worker.on('message', msg => console.log('スレッドからの結果:', msg));
  worker.postMessage('計算を開始します');
} else {
  // ワーカースレッド (API をブロックしません)
  parentPort.on('message', (msg) => {
    let result = 0;
    // 何十億回もの繰り返しの重いループ
    for(let i=0; i<1000000000; i++) result += i; 
    
    parentPort.postMessage(result);
  });
}
```

クラスター（I/Oリクエストのスケーリング用）、ワーカー・スレッド（重いCPU処理用）、およびPM2（デーモン管理用）を習得することで、基礎となるベアメタルを完全に制御できるようになります。あなたは今、シニアバックエンドアーキテクトです。
