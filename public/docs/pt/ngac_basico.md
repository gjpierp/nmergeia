# Nível Básico

> [!IMPORTANTE]
> Para dominar o NGAC, você deve primeiro compreender seus blocos de construção fundamentais. Cada elemento é um nó no gráfico de autorização.

## Elementos Centrais (O Núcleo Básico)

O NGAC é baseado em 5 tipos principais de elementos:

1. **U (Usuários):** As entidades que solicitam acesso.
2. **O (Objetos):** Os recursos que estão sendo protegidos (arquivos, registros de banco de dados, URLs).
3. **UA (Atributos do Usuário):** Grupos de usuários (como Funções, Departamentos ou Cargos).
4. **OA (Atributos de Objeto):** Agrupamentos de objetos (como Pastas, Etiquetas de Confidencialidade).
5. **Op (Operações):** As ações permitidas (Leitura, Gravação, Exclusão).

### O Gráfico de Relacionamento

O controle de acesso no NGAC é determinado traçando um caminho de um Usuário (U) até um Objeto (O).

```sereia
gráfico TD
    U1[Usuário: Alice] -->|Atribuído a| UA1 (Atributo do usuário: Departamento de TI)
    UA1 -->|"Pode Ler/Escrever"| OA1 (Atributo do Objeto: Servidores de Produção)
    O1[Objeto: Servidor de Aplicativo 1] -->|Pertence a| OA1
    
    U2[Usuário: Bob] -->|Atribuído a| UA2 (Atributo do usuário: Marketing)
    UA2 -->|Pode Ler| OA2 (Atributo do Objeto: Relatórios Públicos)
    O2[Objeto: Relatório Q1] -->|Pertence a| OA2
```

> [!NOTA]
> Neste diagrama, Alice herda permissões em "App Server 1" porque existe um caminho válido: `Alice -> Departamento de TI -> (Leitura/Escrita) -> Servidores de Produção <- App Server 1`.

## Associação

> [!NOTE]
> O restante do white paper é mantido em seu idioma original para preservar a sintaxe do código e dos diagramas.

ones
Las asociaciones son aristas especiales que conectan un `UA` con un `OA` y contienen las Operaciones (Op). Las aristas regulares de pertenencia no contienen operaciones.
