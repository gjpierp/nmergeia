# Docker 中級：Docker Compose とネットワークによるローカルオーケストレーション

API が 1 つのコンテナで稼働しているのは素晴らしいことですが、現実世界のソフトウェアには複数のコンポーネント（バックエンド、データベース、Redis キャッシュ、フロントエンドなど）が必要です。無限のパラメータを持つ多数の `docker run` コマンドを使用して、これらすべてを手動で起動するのは持続不可能であり、エラーが発生しやすくなります。

その答えが **Docker Compose** です。これは、ローカル環境用の宣言型オーケストレーターです。

## 1. 宣言型ファイル：docker-compose.yml

命令型のコマンドを入力する代わりに、YAML ファイルにインフラストラクチャの最終的な希望状態を定義します。Docker は、すべてを正しい順序で起動し、接続し、シャットダウンする処理を行います。

```mermaid
graph TD
    subgraph sub_1 [Docker Compose ネットワーク (app-network)]
        React[フロントエンド - ポート 80]
        API[バックエンド API Node.js - ポート 3000]
        DB[(PostgreSQL - ポート 5432)]
        Caché[(Redis - ポート 6379)]
    end
    
    Usuario((ブラウザ)) --> React
    React --> API
    API --> DB
    API --> Caché
```

**ネットワークのルールに注意:** Docker Compose ネットワーク内では、コンテナは `localhost` を使用して通信しません。それらは DNS ドメインとして **サービス名** を使用して通信します。

## 2. 開発クラスターの構築

プロジェクトのルートに `docker-compose.yml` という名前のファイルを作成します：

```yaml
version: '3.8'

services:
  # サービス 1: データベース
  db:
    image: postgres:15-alpine
    restart: always # DB がクラッシュした場合、Docker が再起動します
    environment:
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: mysecretpassword
      POSTGRES_DB: main_db
    volumes:
      - pg_data:/var/lib/postgresql/data # 永続性 (Persistence)
    ports:
      - "5432:5432" # ローカルの DBeaver/DataGrip からアクセスする場合にのみ必要

  # サービス 2: カスタムバックエンド
  api:
    build: 
      context: ./backend # バックエンドの Dockerfile の場所
    ports:
      - "3000:3000"
    environment:
      - DB_HOST=db # 魔法: Docker Compose による自動 DNS
      - DB_USER=admin
      - DB_PASS=mysecretpassword
    depends_on:
      - db # API の前にデータベースを起動するように強制します

  # サービス 3: 超高速キャッシュ
  redis-cache:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  pg_data: # データの永続性のための名前付きボリューム (named volume) を定義します
```

## 3. 内部 DNS の力

API サービスの環境変数 `DB_HOST=db` に注目してください。両方のサービス（`api` と `db`）が同じ Compose ファイルで定義されているため、Docker は自動的にブリッジネットワーク (bridge network) と内部 DNS サーバーを作成します。

Node.js のコードが `postgresql://admin:mysecretpassword@db:5432/main_db` に接続しようとすると、Docker は `db` という単語を PostgreSQL コンテナの内部 IP アドレスに解決します。生の IP アドレスを使用する必要はありません（使用すべきではありません）。

## 4. Compose コマンドのライフサイクル

最新の開発者の毎日のワークフローは、Compose を使用すると非常にシンプルになります：

1. **バックグラウンドでクラスター全体を起動する:**
   ```bash
   docker-compose up -d
   ```
2. **すべてのコンテナの一元化されたログを表示する:**
   ```bash
   docker-compose logs -f
   ```
3. **（ボリュームをそのままにして）コンテナをシャットダウンして破棄する:**
   ```bash
   docker-compose down
   ```

## 5. ボリューム (Volumes): データのための不死性 (Immortality)

コンテナは**短命（エフェメラル）**なエンティティです。データベースのコンテナを削除すると、そのデータはすべてコンテナとともに消滅します。永続性を持たせるために、**ボリューム (Volumes)** を使用します。

前の例では、`volumes: - pg_data:/var/lib/postgresql/data` を定義することで、Docker に次のように指示しています。「PostgreSQL がその内部フォルダーに保存するすべてを取得し、私の物理ハードドライブのボリュームに安全に保存してくれ」。Postgres コンテナを破棄し、翌日に新しいコンテナを立ち上げると、新しいコンテナは `pg_data` ボリュームに接続し、すべてのテーブルを瞬時に回復します。

`docker-compose` を習得すれば、「ローカル環境の構成」シンドローム（面倒さ）は完全に解消されます。**上級レベル**では、開発から本番への重要な飛躍を遂げます。マルチステージビルド (Multi-Stage Builds) を探求し、ギガバイトのイメージを数メガバイトの強固なイメージに削減する方法を学びます。
