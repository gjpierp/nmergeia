# 初期設定と基本アーキテクチャ

世界で最も高度なオープンソースのリレーショナルデータベースであるPostgreSQLをマスターするための出発点へようこそ。この初期段階では、単にバイナリをインストールするだけでなく、PostgreSQLがOSとどのようにやり取りし、データがディスク上でどのように構成されているかを理解します。

## 1. プロセスアーキテクチャ

PostgreSQLは単一のプログラムではなく、堅牢なマルチプロセスアーキテクチャです。

### プロセス図 (Postmaster)

```mermaid
graph TD
    Client[クライアント (psql / Node.js)] -->|"TCP/IP接続"| Postmaster[Postmasterプロセス (PID 1)]
    
    subgraph sub_1 [PostgreSQLサーバー]
        Postmaster -->|Fork| Backend1[バックエンドプロセス 1 (セッション A)]
        Postmaster -->|Fork| Backend2[バックエンドプロセス 2 (セッション B)]
        
        Postmaster -.-> BGWriter[バックグラウンドライター]
        Postmaster -.-> WAL[WALライター]
        Postmaster -.-> Autovacuum[オートバキュームランチャー]
        Postmaster -.-> Checkpointer[チェックポインター]
    end
    
    Backend1 --> SharedBuffers[(共有バッファ / RAM)]
    Backend2 --> SharedBuffers
    
    SharedBuffers --> BGWriter
    BGWriter --> Disk[(物理ディスク)]
```

**重要な概念:** アプリケーションが接続するたびに、`Postmaster` (親プロセス) が *fork* を実行し、その接続専用のバックエンドプロセスを割り当てます。そのため、*PgBouncer* などのコネクションプーラーを使用しない場合、高並行環境では PostgreSQL はかなりの RAM リソースを必要とします。

## 2. 摩擦ゼロのインストール (Docker)

ローカルでデータベースを操作し、学習する最新の方法は、コンピューターにバイナリをインストールすることではなく、一時的なコンテナを使用することです。

```bash
docker run --name pg-initial \
  -e POSTGRES_PASSWORD=超安全なパスワード \
  -e POSTGRES_USER=admin \
  -e POSTGRES_DB=nmerge_db \
  -p 5432:5432 \
  -d postgres:15-alpine
```

### コマンドの解剖:
* `-e POSTGRES_PASSWORD`: 必須の環境変数。これがないと、コンテナは起動を中止します。
* `-p 5432:5432`: PostgreSQL の内部ポートを `localhost` に公開します。
* `postgres:15-alpine`: Alpine Linux をベースにしたバージョン 15 を使用します。Debian ベースのデフォルトのイメージが約 400MB であるのに対し、わずか約 80MB です。

## 3. データディレクトリ (PGDATA)

私のデータはどこにありますか？PostgreSQL が起動すると、`PGDATA` 環境変数によって定義されたパス（デフォルトでは `/var/lib/postgresql/data`）でデータクラスターを探します。

コンテナ内に入り、このディレクトリを調べると:

```bash
docker exec -it pg-initial bash
ls -la /var/lib/postgresql/data
```

次のような重要なフォルダーが表示されます:
* `base/`: 実際のデータ（バイナリ形式のテーブルとインデックス）が存在する場所。
* `pg_wal/`: (Write-Ahead Logs) 重要なトランザクションログ。サーバーが予期せずシャットダウンした場合、PostgreSQL はこれらのファイルを使用して、メモリ内で失われたデータを再構築します。
* `postgresql.conf`: 設定の「頭脳」。
* `pg_hba.conf`: どの IP がアクセスでき、どのように認証されるかを決定するゲートキーパー (Host-Based Authentication)。

## 次のステップ
物理的およびアーキテクチャの基盤が整いました。**基本レベル**では、PostgreSQL を MySQL のような単純なデータベースと区別する高度なデータ型について学習します。
