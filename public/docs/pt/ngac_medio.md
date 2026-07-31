# Nível Médio

> [!TIP]
> Nesse nível, as políticas estáticas (quem é quem) são misturadas com as Políticas Dinâmicas, proporcionando controle em tempo real.

## Políticas Dinâmicas e Autorização

Ao contrário do RBAC, no NGAC as alterações entram em vigor imediatamente, sem exigir o recarregamento de sessões ou a redistribuição de tokens JWT. A validação é feita no gráfico de autorização centralizado em cada solicitação crítica.

### Avaliação de permissão (avaliação de política)

Para avaliar se uma solicitação foi aprovada, o mecanismo NGAC intercepta a solicitação.

```sereia
diagrama de sequência
    Usuário participante como Web Client
    API participante como API Gateway/Proxy
    participante NGAC como Motor Sentinel-NGAC
    Banco de dados participante como banco de dados
    
    Usuário->>API: GET /resources/protected/1
    API->>NGAC: O usuário pode ler o Objeto 1?
    
    reto rgb(20, 50, 40)
        Nota sobre NGAC: O gráfico (PDP) é avaliado
        NGAC-->>NGAC: Caminho de pesquisa: U -> UA -> OA <- O
    fim
    
    caminho alternativo encontrado
        NGAC-->>API: 200 OK (Permitido)
        API->>DB: buscar dados
        Banco de dados -->>API: Dados
        API ->>Usuário: 200 OK + Dados
    else Caminho inexistente
        NGAC-->>API: 403 Proibido
        API ->>Usuário: 403 Proibido
    fim
```

## Ponto de decisão de política (PDP) e ponto de aplicação de política (PEP)
O **PEP** (no nosso caso, o interceptador de solicitação) é responsável por interromper a ação e pedir permissão. O **PDP** (Sentinel-NGAC) é o cérebro que navega no gráfico.

> [!CUIDADO]
>

> [!NOTE]
> O restante do white paper é mantido em seu idioma original para preservar a sintaxe do código e dos diagramas.

 No hardcodees los chequeos de seguridad en la lógica de negocio. Toda autorización debe manejarse limpiamente en el nivel PEP, dejando a los controladores (controllers) libres de lógica de seguridad.
