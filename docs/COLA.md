# Cola rápida — ChavScript (uso na apresentação)

## Estrutura do programa

```
VILA COMEÇA
CONVERSA ENTRE <personagens separados por E>
  ... comandos ...
CENA TERMINA
VILA TERMINA
```

## Comandos

| ChavScript | O que faz |
|---|---|
| `TEXTO nome = "..."` | variável de texto |
| `NUMERO nome = 2` | variável numérica |
| `personagem ENTRA` / `SAI` | entra/sai de cena |
| `personagem DIZ "..."` | fala |
| `personagem RESPONDE "..."` | resposta |
| `personagem PENSA "..."` | pensamento (sem voz) |
| `personagem GRITA "..."` | fala em destaque |
| `personagem PERGUNTA "...?" EM var` | pergunta → guarda resposta na var |
| `SE expr OP expr ... SENÃO ... FIMSE` | if/else — OP: `IGUAL DIFERENTE MAIOR MENOR` |
| `REPETE n VEZES ... FIM` | laço (aninhável, máx. 20) |
| `// texto` | comentário |
| expressões | `+ - * / ( )` — `+` também junta textos |

Personagens: `CHAVES` `SEU_MADRUGA` `QUICO` `CHIQUINHA` `PROFESSOR_GIRAFALES` `SR_BARRIGA`

## Roteiro da demo (3 min)

1. YouTube: https://www.youtube.com/watch?v=pzcAyxehVVQ (parte 1)
2. Estúdio: https://paulobumba.github.io/chave-script/
3. **Compilar** → mostrar tokens/AST no console
4. **Executar** → responder `bolso` na pergunta → 5 personagens em cena
5. **Gerar JavaScript** → aba JS → mostrar código traduzido
6. Terminal: `node testes/testar.js` → "TODOS OS TESTES PASSARAM"

## Se o professor pedir mudanças ao vivo

| Pedido | Como fazer |
|---|---|
| Trocar personagem | painel "Configurar cena" → seletores p1/p2 |
| Mudar assunto/estilo | selects do painel (só em conversa automática) |
| Novo programa | colar no editor → Compilar → Executar |
| Ver erro | digitar `@` ou esquecer `FIMSE` → mostrar linha do erro |
| Gerar código | botão "Gerar JavaScript" |

## Perguntas prováveis → resposta curta

**"Isso é só substituição de texto?"**
Não — tem lexer, parser com AST, análise semântica com tipos e tabela de
símbolos, interpretador assíncrono e codegen. Cada fase é uma estrutura real.

**"Onde está a gramática?"**
Aba **Gramática** do estúdio + `ESPECIFICACAO.md` §5 (EBNF).

**"Como funciona o PERGUNTA?"**
O interpretador emite um evento `ask` e **pausa** (async generator); a
resposta volta e a execução continua. No JS gerado vira `__pergunta()` que
lê stdin.

**"Por que JavaScript?"**
Opção permitida pelo enunciado; roda no navegador e no Node; o `.js` gerado
executa standalone com `node programa.js < respostas.txt`.

**"E se quiser while de verdade?"**
`REPETE n VEZES` equivale a um `for` — o enunciado aceita "while **ou** for".

**"Tem funções?"**
Não — era desafio **opcional**. Temos em troca: N personagens por conversa,
estúdio animado, entrada interativa e AST/eventos como IR.

**"A cena é real?"**
Sim — "O Dinheiro Perdido" (1978), links no slide 9. As falas são adaptadas
das transcrições da dublagem.

## Arquivos-chave (se pedirem para mostrar código)

- `js/lexer.js` → tokens `{t,v,l}` + erros "Linha N"
- `js/parser.js` → `expr()→term()→fator()→prim()` (precedência) + AST
- `js/semantica.js` → `ty()` inferência de tipos + tabela `TS`
- `js/interpretador.js` → `async function* events()` — `yield` = evento
- `js/codegen.js` → `toJS()` — `let`, `if/else`, `for`, `console.log`
- `testes/testar.js` → harness que roda tudo e executa o JS gerado
