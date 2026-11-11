# Conformidade com o Enunciado — ChavScript

Mapa completo de onde cada exigência do trabalho está implementada e como
comprovar. Use este documento na apresentação e na entrega.

## 1. Contextualização e objetivo

- **Meme escolhido:** Chaves — O Show do Chaves (*El Chavo del Ocho*, Chespirito)
- **Justificativa:** um dos personagens mais icônicos da cultura pop brasileira;
  as falas e situações viraram memes ("sem querer querendo", o aluguel do
  Seu Madruga); a série já tinha natureza pedagógica na Vila.
- **Nome da linguagem:** ChavScript — comandos são falas e ações dos personagens.
- **Linguagem de destino:** JavaScript (Node.js), opção permitida pelo enunciado.

Referência do trabalho: **BIRL** (Bambam's "It's show time" Recursive Language).
O ChavScript segue a mesma ideia — expressões populares viram comandos de
programação — com sintaxe, gramática e implementação próprias.

## 2. Etapas de desenvolvimento

| Etapa | Onde está | Como demonstrar |
|---|---|---|
| 1. Concepção e especificação | `ESPECIFICACAO.md`, `especificacao.pdf` | tabela de comandos, tokens, gramática EBNF, exemplos |
| 2. Análise léxica | `js/lexer.js` → `lex()` | console mostra N tokens; `erro_4_lexico.chav` → "símbolo inválido @" |
| 3. Análise sintática | `js/parser.js` → `parse()` | descendente recursivo gera AST; `erro_2_sintaxe_fimse.chav` → "bloco SE sem fechamento" |
| 4. Análise semântica | `js/semantica.js` → `sem()` | tabela de símbolos + tipos; `erro_3_semantica.chav` → tipo errado e variável não declarada |
| 5. Geração de código | `js/codegen.js` → `toJS()` | aba JS do estúdio; `testes/saida/*.js` executáveis com Node |
| 6. Testes e demonstração | `testes/` + `testes/testar.js` | `node testes/testar.js` → "TODOS OS TESTES PASSARAM" |

## 3. Requisitos mínimos da linguagem

| Requisito | Sintaxe ChavScript | Onde é verificado |
|---|---|---|
| Declaração de variáveis | `TEXTO nome = "..."` / `NUMERO nome = 2` | parser (`DECL`) + semântica (tipo confere) |
| Tipos de dados | `TEXTO` e `NUMERO` | `ty()` em `semantica.js` |
| Aritmética | `+ - * /` e parênteses, precedência | `expr/term/fator/prim` no parser |
| Entrada de dados | `PERGUNTA expr EM var` | interpretador (`ask`) + codegen (`__pergunta`/`__lerNumero` lendo stdin) |
| Saída de dados | `DIZ / RESPONDE / PENSA / GRITA` | eventos `say/think/shout` + `console.log` |
| Condicional | `SE ... IGUAL/DIFERENTE/MAIOR/MENOR ... SENÃO ... FIMSE` | parser (`SE`) + interpretador + `if/else` no JS |
| Repetição | `REPETE n VEZES ... FIM` (aninhável) | parser (`REPETE`) + `for` no JS |
| Operadores relacionais | `IGUAL`, `DIFERENTE`, `MAIOR`, `MENOR` | `semantica.js` valida tipos; `CMP` no codegen |
| Comentários | `//` até o fim da linha | `lexer.js` remove antes de tokenizar |
| Tratamento de erros | erros léxicos, sintáticos e semânticos com linha | `L.E`, `ErroCompilador`, `S.E`/`S.W` |

## 4. Programas de teste (`testes/`)

Válidos (4 — o mínimo pedido é 3):

| Arquivo | Cobre |
|---|---|
| `01_conversa_automatica.chav` | conversa gerada por assunto/estilo, N personagens |
| `02_entrada_e_decisoes.chav` | **entrada + decisões + repetição** (o exigido) |
| `03_calculos_e_repeticao.chav` | aritmética, precedência, `REPETE`, `SE`/`SENÃO` |
| `04_dinheiro_perdido.chav` | **cena real do episódio** com os 5 personagens, `PERGUNTA`, `SE`, `REPETE` |

Com entradas simuladas: `02_entrada_e_decisoes.in.txt`, `04_dinheiro_perdido.in.txt`.

Erros (4 — o mínimo pedido é 3):

| Arquivo | Fase | Erro detectado |
|---|---|---|
| `erro_1_personagem_inexistente.chav` | semântica | "personagem inexistente CHAVES2" |
| `erro_2_sintaxe_fimse.chav` | sintática | "bloco SE sem fechamento" |
| `erro_3_semantica.chav` | semântica | "operador - só vale para NUMERO", "variável não declarada" |
| `erro_4_lexico.chav` | léxica | "símbolo inválido @" |

O harness `testar.js` roda tudo: compila, interpreta, gera o `.js` em
`testes/saida/` e **executa o JavaScript gerado** com as entradas — as saídas
ficam salvas como evidência de funcionamento.

## 5. Entregáveis

| Entregável | Arquivo |
|---|---|
| Documento de especificação (PDF) | `especificacao.pdf` (fonte: `ESPECIFICACAO.md`) |
| Código-fonte do tradutor | `ChavScript.html` + `js/` (8 módulos) |
| Programas de teste | `testes/*.chav` (4 válidos + 4 erros) |
| Instruções de execução | `README.md` |
| Evidências de funcionamento | `testes/saida/*.js` + saída do `testar.js` |
| Apresentação | `slides.pdf`, `apresentacao.pdf` + demo ao vivo |
| Repositório | https://github.com/PauloBumba/chave-script |
| Estúdio online | https://paulobumba.github.io/chave-script/ |

## 6. Arquitetura (resumo — detalhes em `docs/ARQUITETURA.md`)

```
.chav → lexer.js (tokens) → parser.js (AST) → semantica.js (tipos)
      → interpretador.js (eventos p/ estúdio) → codegen.js (JavaScript)
```

- **Lexer** (`js/lexer.js`): regex por token, `//` comentário, erros por linha.
- **Parser** (`js/parser.js`): descendente recursivo, precedência
  `expr → term → fator → prim`, AST em objetos JS.
- **Semântica** (`js/semantica.js`): tabela de símbolos por conversa,
  inferência de tipos (`NUMERO`/`TEXTO`), elenco de personagens.
- **Interpretador** (`js/interpretador.js`): gerador assíncrono — cada
  `yield` é um evento; `PERGUNTA` pausa até o usuário responder.
- **Codegen** (`js/codegen.js`): emite JS Node.js com helpers de stdin,
  `let`, `if/else`, `for`, `console.log`.
- **Estúdio** (`js/estudio.js`): renderiza os eventos — personagens SVG,
  cenários, voz, sons, input interativo, histórico.

## 7. Critérios de avaliação — onde pontuar

| Critério | Evidência |
|---|---|
| Criatividade e identidade (1,0) | linguagem inteira temática da Vila; estúdio animado com a cena real |
| Tokens e gramática (1,5) | `ESPECIFICACAO.md` §tokens/gramática; aba Gramática do estúdio |
| Análise léxica (1,5) | `js/lexer.js`; erro léxico demonstrado |
| Análise sintática (2,0) | `js/parser.js` + EBNF; erros de delimitador demonstrados |
| Verificações semânticas (1,0) | `js/semantica.js`; erros de tipo/variável/personagem |
| Geração de código (1,5) | `js/codegen.js`; `.js` gerado executa no Node |
| Testes, documentação e apresentação (1,5) | `testes/`, PDFs, `slides.pdf`, demo ao vivo |

## 8. Desafio adicional (opcional) — o que já existe

- **Representação intermediária:** a AST + a lista de eventos do interpretador
- **Mensagens de erro com linha:** todas as fases
- **Extras próprios:** estúdio animado completo, N personagens por conversa,
  diálogo automático por assunto, entrada interativa no navegador,
  geração de código-fonte JS com download

Não implementado (continua opcional): funções, escopos de variáveis,
segunda estrutura de repetição (`while`), erros com coluna.
