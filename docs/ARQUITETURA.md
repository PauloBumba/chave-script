# Arquitetura do ChavScript

Este documento descreve como o tradutor funciona por dentro. O código está
separado por responsabilidade em `js/`, carregado pelo `ChavScript.html` via
`<script src>` na ordem de dependência. As seções abaixo seguem essa ordem.

## Visão geral do pipeline

```
código-fonte (.chav)
      │
      ▼
┌──────────┐   tokens[]    ┌──────────┐    AST       ┌─────────────┐
│   LEXER  │ ────────────► │  PARSER  │ ──────────► │  SEMÂNTICA  │
│  lex()   │               │ parse()  │             │    sem()    │
└──────────┘               └──────────┘             └──────┬──────┘
        erros léxicos (linha)      erros sintáticos        │ erros semânticos
                                                           ▼
                                              ┌────────────────────┐
                                              │  INTERPRETADOR     │
                                              │  events() (async)  │──► eventos da cena
                                              │  toJS()            │──► JavaScript
                                              └────────────────────┘
```

O compilador é invocado pelo botão **Compilar** e registra cada fase no
console do estúdio (tokens, resumo da AST, erros). Se qualquer fase falha,
a execução para — como num compilador de verdade.

## 1. Tabelas de dados

Antes do pipeline existem as tabelas que o resto do código consulta:

- `CH` — elenco: chave → `{ n: nome, c: cor, h: cor da pele, x: desenho SVG,
  p: pitch, r: ritmo }`. Os 6 personagens: `CHAVES`, `SEU_MADRUGA`, `QUICO`,
  `CHIQUINHA`, `PROFESSOR_GIRAFALES`, `SR_BARRIGA`.
- `D` — **dicionário**: fonte única das palavras reservadas. Cada entrada
  `[palavra, categoria, descrição, exemplo]` alimenta o dicionário da UI,
  o highlight de sintaxe e — indiretamente — o lexer via `KWS`.
- `KWS` — `Set` de todas as palavras reservadas normalizadas, gerado de `D`.
- `BANK` / `MAIS` / `INTER` — frases prontas para a **conversa automática**
  (quando a cena não tem falas escritas).
- `ESTILOS` — `ENGRACADO`, `EDUCATIVO`, `DRAMÁTICO`.

`norm()` remove acentos e coloca em maiúsculas — por isso `COMEÇA` e `COMECA`,
`SENÃO` e `SENAO`, `DRAMÁTICO` e `DRAMATICO` são equivalentes.

## 2. Análise léxica — `lex()`

Transforma o texto em `L.T` (lista de tokens `{t, v, l}` onde `t` é o tipo e
`l` a linha) e `L.E` (erros).

Tokens reconhecidos:

| Tipo | Exemplos |
|---|---|
| `KW` | palavras reservadas (`VILA`, `SE`, `DIZ`, `CHAVES`…) |
| `ID` | identificadores (variáveis, nomes de personagens fora do dicionário) |
| `NUM` | números (`42`, `3.14`) |
| `STR` | textos entre aspas duplas |
| `SYM` | `= + - * / ( )` |

Erros léxicos: símbolo inválido (`@`, `#`…), aspas sem fechar. Todo erro
carrega o número da linha.

## 3. Análise sintática — `parse()`

Descendente recursivo com um cursor `p` sobre os tokens. Funções auxiliares:

- `pk()` — olha o token atual; `is(k)`/`kw(k)` — testa/consome palavra;
  `sym(s)` — testa/consome símbolo; `id()` — consome identificador/personagem.
- `err(msg)` — lança erro sintático com linha.

### Gramática (EBNF, resumida)

```
programa    ::= VILA COMECA conversa* VILA TERMINA
conversa    ::= CONVERSA ENTRE personagem (E personagem)+
                ( ASSUNTO expr | ESTILO estilo | comando )* CENA TERMINA
comando     ::= personagem ENTRA | SAI
              | personagem (DIZ|RESPONDE|PENSA|GRITA) expr
              | personagem PERGUNTA expr EM variavel
              | declaracao | repeticao | condicao
expr        ::= termo (('+'|'-') termo)*
termo       ::= fator (('*'|'/') fator)*
fator       ::= '-' fator | primario
declaracao  ::= (TEXTO|NUMERO) nome = expr
repeticao   ::= REPETE expr VEZES comando* FIM
condicao    ::= SE expr (IGUAL|DIFERENTE|MAIOR|MENOR) expr comando*
                [ SENAO comando* ] FIMSE
```

### AST

Nós relevantes:

- `{type:'Programa', conversas:[...]}` — raiz
- conversa: `{cast:[{v,l}], assunto, estilo, cmds:[...]}` (também guarda
  `a`/`b` = primeiros dois, para compatibilidade)
- comandos: `{op:'DECL'|'REPETE'|'SE'|'ENTRA'|'SAI'|'DIZ'|'RESPONDE'|'PENSA'|'GRITA'|'PERGUNTA', ...}`
- expressões: `{k:'n'|'s'|'var'|'neg'|'bin', v, name, op, l, r}`

Erros sintáticos: delimitadores faltando (`FIMSE`, `FIM`, `CENA TERMINA`),
`=` ausente, operador relacional inválido, código após `VILA TERMINA`.

## 4. Análise semântica — `sem(ast)`

Percorre a AST com uma **tabela de símbolos** (`TS`) e inferência de tipos
(`ty(expr)`). Reúne erros `E` e avisos `W` — erros bloqueiam a compilação.

Verificações:

- personagem inexistente em `CONVERSA` ou em comandos de fala;
- personagens repetidos no elenco;
- conversa **automática** (sem falas) exige exatamente 2 participantes;
- `ESTILO` válido; `ASSUNTO` sem frases prontas → aviso;
- `DECL`: nome não pode ser palavra reservada nem já declarada; o tipo da
  expressão deve bater com `TEXTO`/`NUMERO`;
- `REPETE`: contagem `NUMERO` entre 1 e 20;
- `SE`: os dois lados da comparação devem ter o mesmo tipo; `MAIOR`/`MENOR`
  só com `NUMERO`;
- `PERGUNTA`: destino deve ser variável declarada; texto deve ser `TEXTO`;
- quem fala (`who`) precisa estar no elenco da conversa.

### Regras de tipo das expressões

- `+` entre dois `NUMERO` → `NUMERO`; se houver `TEXTO`, concatena → `TEXTO`
  (permite `"Idade: " + n`);
- `-`, `*`, `/` exigem `NUMERO`;
- `-` unário nega `NUMERO`;
- comparações `IGUAL`/`DIFERENTE` aceitam qualquer tipo (desde que iguais);
  `MAIOR`/`MENOR` só `NUMERO`.

## 5. Interpretador — `events(ast, cf)`

Gerador assíncrono (`async function*`) que **avalia em runtime** — necessário
porque `PERGUNTA` precisa pausar a cena até o usuário responder.

Para cada conversa:

1. Monta `map` personagem→personagem-efetivo (o painel de configuração pode
   trocar os dois primeiros) e emite `{k:'cast', who:[...]}`;
2. **Conversa automática** (sem falas): sorteia falas do `BANK` alternando
   entre os dois primeiros personagens, com toques de `ESTILO`;
3. **Comandos escritos**: `walk()` percorre a lista avaliando
   `DECL` (guarda `{v,t}` no ambiente), `REPETE` (até 1000 iterações por
   segurança), `SE` (avalia a condição), `PERGUNTA` (emite `{k:'ask'}` e
   recebe a resposta de volta via `it.next(resposta)`), e os comandos de
   cena viram eventos `{k:'enter'|'exit'|'say'|'think'|'shout', w, text}`.

`drain()` consome o gerador respondendo `"teste"`/`"7"` às perguntas — usado
pela prévia e pelos testes.

## 6. Gerador de código — `toJS(ast)`

Emite JavaScript Node.js linha a linha:

- helpers: `__pergunta(msg)` (lê stdin linha a linha) e `__lerNumero(msg)`
  (repete até receber número);
- `DECL` → `let NOME = expr;` (`__v_` prefixo se colidir com palavra JS);
- `SE` → `if (...) { } else { }`; `REPETE` → `for(let __i=0;__i<n;__i++)`;
- `PERGUNTA` → `NOME = __pergunta("..."+expr);` ou `__lerNumero(...)`;
- falas → `console.log("Nome: "+expr);` (`GRITA` → `"Nome GRITA: "`,
  `PENSA` → `"  (Nome pensa: "+expr+")"`);
- `ENTRA`/`SAI` viram comentários;
- conversa automática gera um `for` com o mesmo `__pool` de falas do interpretador.

O JS gerado é verificado com `node --check` e executado nos testes.

## 7. Estúdio (UI)

- `compile()` orquestra as fases e loga tokens/AST/erros no console;
- `play(e)` renderiza cada evento: slots na `#stage`, bolhas `.bub`,
  animações CSS, `speechSynthesis`, `AudioContext` para sons e `Audio`
  para arquivos de áudio por chave;
- `exec()`/`drain()` executam cena a cena; `paused`/`run` controlam
  pause/stop;
- painéis: dicionário pesquisável, gramática EBNF, manual, histórico,
  aba **JS** com highlight + copiar/baixar, upload de imagens de
  personagens e de cenário.

## 8. Testes — `testes/testar.js`

Harness Node que:

1. carrega `ChavScript.html` num contexto `vm` com DOM mínimo simulado;
2. para cada `*.chav` válido: roda `lex → parse → sem → drain → toJS`,
   grava o `.js` em `testes/saida/` e o executa com o `.in.txt`
   correspondente via `execFileSync`;
3. para cada `erro_*.chav`: confirma que a fase certa falha com a mensagem
   esperada.

Rodar: `node testes/testar.js` → `TODOS OS TESTES PASSARAM`.
