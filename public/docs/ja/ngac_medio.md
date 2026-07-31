# 中レベル

> [!ヒント]
> このレベルでは、静的ポリシー (誰が誰なのか) が動的ポリシーと混合され、リアルタイムの制御が可能になります。

## 動的ポリシーと認可

RBAC とは異なり、NGAC では、セッションのリロードや JWT トークンの再配布を必要とせずに、変更がすぐに有効になります。検証は、重要なリクエストごとに集中認証グラフに対して行われます。

### 権限の評価 (ポリシーの評価)

リクエストが承認されたかどうかを評価するために、NGAC エンジンはリクエストをインターセプトします。

「人魚」
シーケンス図
    Web クライアントとしての参加者ユーザー
    APIゲートウェイ/プロキシとしての参加者API
    Motor Sentinel-NGAC としての参加者 NGAC
    データベースとしての参加者 DB
    
    ユーザー >> API: GET /resources/protected/1
    API->>NGAC: ユーザーはオブジェクト 1 を読み取ることができますか?
    
    四角形 rgb(20, 50, 40)
        NGAC に関する注意: グラフ (PDP) が評価されます
        NGAC-->>NGAC: 検索パス: U -> UA -> OA <- O
    終わり
    
    alt パスが見つかりました
        NGAC-->>API: 200 OK (許可)
        API->>DB: データのフェッチ
        DB-->>API: データ
        API-->>ユーザー: 200 OK + データ
    else 存在しないパス
        NGAC-->>API: 403 禁止
        API-->>ユーザー: 403 禁止
    終わり
「」

## ポリシー決定ポイント (PDP) とポリシー施行ポイント (PEP)
**PEP** (この場合、リクエスト インターセプター) は、アクションを停止し、許可を求める責任があります。 **PDP** (Sentinel-NGAC) は、グラフをナビゲートする頭脳です。

> [!注意]
>

> [!NOTE]
> コードと図の構文を維持するために、ホワイト ペーパーの残りの部分は元の言語のままになっています。

 No hardcodees los chequeos de seguridad en la lógica de negocio. Toda autorización debe manejarse limpiamente en el nivel PEP, dejando a los controladores (controllers) libres de lógica de seguridad.
