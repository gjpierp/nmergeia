# NGAC aplicado a menus e visualizações dinâmicas

A integração do Sentinel-NGAC em um frontend envolve a resolução do gráfico de permissões em tempo de execução.

## Resolução gráfica
Quando um usuário faz login, o backend do NGAC calcula todas as rotas válidas de seu nó (Usuário) para os objetos de menu (Objeto).

## História de sucesso: safi-core
Em sistemas ERP massivos como o `safi-core`, a resposta do menu é armazenada em cache no Redis. Se houver alterações de permissão, o cache será invalidado.

```sereia
diagrama de sequência
  Frontend->>+Backend: Solicitação /menu (JWT)
  Backend->>+Sentinel-NGAC: verificar caminhos
  Sentinel-NGAC-->>-Backend: Objetos permitidos
  Backend-->>-Fronend: Árvore de Menu
```

> [!NOTE]
> O restante do white paper é mantido em seu idioma original para preservar a sintaxe do código e dos diagramas.

