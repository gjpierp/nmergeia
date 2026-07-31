# Docker 上級：極限の最適化とマルチステージビルド (Multi-Stage Builds)

Dockerイメージを本番環境に導入するには、ローカルの開発環境とはまったく異なる厳密さが求められます。ビルドツール、ローカルリポジトリ、そして公開されたソースコードを含む 1 ギガバイトのイメージは、財務上の時限爆弾（転送コスト）であり、サイバーセキュリティの悪夢です。

上級レベルでは、Docker の最も重要なアーキテクチャパターンである **マルチステージビルド (Multi-Stage Builds)** を習得します。

## 1. モノリシックイメージの問題

Go または React でアプリケーションをビルドしているとします。実行可能ファイルまたは静的ファイルを作成するには、Go コンパイラー全体、または `node_modules` のすべてのパッケージ（数百メガバイトの重さ）をダウンロードする必要があります。

1 つのステップでイメージをビルドすると、本番環境には役に立たないこれらすべてのファイルが最終的なコンテナ内に残ってしまいます。

### マルチステージ (Multi-Stage) のフローチャート

```mermaid
flowchart LR
    subgraph sub_1 [Stage 1: Build (ビルダー/コンストラクター)]
        A[ベースイメージ Node.js 18] --> B(NPM パッケージのインストール)
        B --> C(ソースコードのコピー)
        C --> D(npm run build の実行)
        D --> E{/dist フォルダの生成}
    end
    
    subgraph sub_2 [Stage 2: Production (ファイナル/本番)]
        F[ベースイメージ NGINX Alpine] --> G(Stage 1 から /dist をコピー)
        G --> H[本番用の最終イメージ]
    end
    
    E -.->|外科的転送| G
```

## 2. Multi-Stage Dockerfile の作成 (React/Vue の例)

マルチステージパターンの秘密は、同じファイル内で `FROM` 命令を複数回使用することです。それぞれの `FROM` は、クリーンな新しいステージ（段階）を開始します。最後に、**最後のステージのみがイメージとして保存されます**。その他のものはすべて破棄されます。

```dockerfile
# ==========================================
# STAGE 1: ビルダー (Build Stage)
# 後で参照できるように、ステージに "builder" という名前を付けます。
# ==========================================
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./

# (Webpack などの devDependencies を含め) すべての依存関係をインストールします
RUN npm install

COPY . .

# アプリケーションをコンパイルします。これにより、/app/dist に静的な HTML/CSS/JS が生成されます
RUN npm run build

# ==========================================
# STAGE 2: 本番 (Production Stage)
# 超軽量のWebイメージ (約 5MB) から始めます
# ==========================================
FROM nginx:alpine

# (React Router での 404 エラーを回避するために) カスタム Nginx 設定をコピーします
COPY nginx.conf /etc/nginx/conf.d/default.conf

# ここが魔法です："builder" ステージから /dist フォルダーをコピーします
COPY --from=builder /app/dist /usr/share/nginx/html

# ポートを公開します
EXPOSE 80

# Nginx を起動するコマンド
CMD ["nginx", "-g", "daemon off;"]
```

### 劇的な結果 (Massive Results):
従来の React イメージは **400 MB** を超えていました。このマルチステージ技術を使用すると、結果のイメージの重さは **15 ～ 20 MB** になります。ホスティング費用が安くなり、起動が速くなり、攻撃ベクトル（攻撃面）が大幅に減少します（Node.js、bash、NPM はインストールされていません）。

## 3. Distroless による最適化

コンパイル済みバイナリ (Go、Rust、Java) や、運用シェルを必要としない言語を実行している場合は、（Googleによって作成された）**Distroless**イメージを使用することで、セキュリティを極限まで高めることができます。

Distroless イメージには、**アプリケーションとその実行時の依存関係のみ**が含まれています。パッケージマネージャー、シェル (`sh`, `bash`)、またはオペレーティングシステムのその他の一般的なユーティリティは含まれていません。

```dockerfile
# Stage 1: Builder
FROM golang:1.20 AS builder
WORKDIR /app
COPY . .
RUN go build -o mi-api .

# Stage 2: Distroless プロダクション
FROM gcr.io/distroless/base-debian11
COPY --from=builder /app/mi-api /
EXPOSE 8080
CMD ["/mi-api"]
```

攻撃者がAPIの脆弱性を悪用してリモートでのコマンド実行（RCE）に成功したとしても、悪意のあるスクリプトを実行するためのコマンドコンソールがないことに気づくでしょう。彼らは空の檻（ケージ）に閉じ込められることになります。

Multi-Stage と Distroless を習得することで、あなたのイメージはプロフェッショナルなものになります。**エキスパート**レベルでは、コンテナの物理的な消費を制御するために、カーネルのさらに深い領域（Limits、CGroups、およびネームスペース）を探求します。
