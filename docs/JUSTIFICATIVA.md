# Justificativa do Projeto — ChavScript

Este documento explica o **porquê** de cada decisão de design, exigência por
exigência. Serve como roteiro de defesa na apresentação: para cada item do
enunciado, aqui está a justificativa do que foi feito e por que aquilo é a
forma correta de atender ao pedido.

## 1. Por que Chaves como meme?

O enunciado pede um meme **reconhecível** cujas expressões possam virar
comandos. Chaves é ideal porque:

- É patrimônio da cultura pop brasileira — qualquer pessoa da sala reconhece
  na hora, o que a BIRL (referência do trabalho) também explora;
- A série tem **natureza pedagógica** (a Vila ensinava as crianças) — a
  linguagem herda esse espírito: o programa é uma "aula" encenada;
- As interações entre personagens mapeiam naturalmente para conceitos de
  programação: quem fala é quem "executa", decisões na trama são `SE`, cenas
  que se repetem são `REPETE`;
- O episódio escolhido ("O Dinheiro Perdido") é uma **cena real e famosa** —
  a demo não é inventada, é uma recriação de algo que a turma pode assistir
  no YouTube antes.

## 2. Por que uma linguagem de "cenas" e não de cálculo?

Escolhemos uma linguagem de **domínio específico**: o programa não calcula
números abstratos, ele *encena uma conversa*. Isso é uma decisão consciente:

- torna a linguagem **memorável e criativa** (critério de 1,0 ponto);
- mantém todos os conceitos de compiladores intactos — variáveis, tipos,
  expressões, laços e condicionais existem, só que "dentro" das falas;
- o interpretador gera **eventos de cena** (entrar, falar, pensar, perguntar),
  o que permite o estúdio animado — um diferencial que nenhuma linguagem
  genérica teria.

## 3. Análise léxica — por que um lexer próprio?

`js/lexer.js` implementa `lex()` do zero, sem bibliotecas, porque o enunciado
exige demonstrar a etapa. O lexer:

- percorre o fonte **linha a linha**, removendo comentários `//` antes de
  tokenizar;
- classifica cada token em `KW` (palavra reservada), `ID`, `NUM`, `STR`, `SYM`
  usando uma regex com grupos nomeados;
- guarda o **número da linha** em cada token — é o que permite todos os erros
  dizerem "Linha N";
- reporta símbolos inválidos (`@`, `#`) como erros léxicos, não como crash.

## 4. Análise sintática — por que descendente recursivo?

`js/parser.js` usa **descendente recursivo** porque a gramática EBNF do
ChavScript é LL(1)-like: cada decisão de parse depende de um único token à
frente. Isso gera uma **AST real** (não uma lista de strings substituídas):

- expressões têm **precedência correta**: `expr → term → fator → prim`
  implementa `+/-` depois `*//` depois unary `-` e parênteses;
- blocos (`SE`, `REPETE`) viram nós com listas `then/else/body` — é isso que
  permite a semântica e o codegen tratarem estruturas aninhadas;
- o parser **rejeita estrutura malformada**: `FIMSE` sem `SE`, `SENÃO` fora de
  `SE`, código depois de `VILA TERMINA`, conversa com 1 personagem só.

## 5. Análise semântica — o que ela garante?

`js/semantica.js` faz o que um compilador de verdade faz: verifica consistência
além da sintaxe, usando **tabela de símbolos** e **inferência de tipos**:

- variável não declarada ou redeclarada;
- tipo incompatível: `NUMERO x = nome - 2` com `nome` texto → erro;
- regras de tipo das expressões: `+` concatena texto mas `- * /` exigem número;
- comparações só entre tipos iguais; `MAIOR/MENOR` só com `NUMERO`;
- personagem que fala precisa estar **no elenco** da conversa;
- `PERGUNTA` só grava em variável declarada;
- `REPETE` entre 1 e 20.

Isso é o que separa um "tradutor" de um "script de replace" — o enunciado
alerta explicitamente contra substituição textual.

## 6. Interpretador assíncrono — por que não traduzir direto?

O `PERGUNTA` exige **entrada do usuário no meio da execução**. Um tradutor
estático não consegue "pausar" — por isso existe o interpretador
(`js/interpretador.js`), um **gerador assíncrono** (`async function*`):

- cada `yield` emite um evento (`enter`, `say`, `think`, `shout`, `ask`,
  `exit`) que o estúdio renderiza;
- quando chega um `ask`, o gerador **pausa**; a resposta do usuário volta via
  `it.next(resposta)` e a execução continua de onde parou;
- isso permite `SE`/`REPETE` avaliarem valores em runtime, incluindo os que
  vieram do `PERGUNTA` — impossível com tradução puramente estática.

## 7. Geração de código — por que JavaScript?

- É uma das linguagens de destino **explicitamente permitidas** pelo enunciado;
- roda em qualquer lugar (navegador e Node.js) — a demo pode ser 100% online;
- o código gerado é **realmente executável**: `console.log` para falas,
  `let` para variáveis, `if/else` para `SE`, `for` para `REPETE`, e helpers
  `__pergunta`/`__lerNumero` que leem stdin — o `.js` gerado roda com
  `node programa.js < respostas.txt` sem nenhuma dependência.

## 8. Conversas com N personagens — decisão de design

A sintaxe original era `CONVERSA ENTRE X E Y` (2 personagens). Estendemos para
`personagem (E personagem)+` porque:

- o episódio real tem **5 personagens** — a cena fiel exigia isso;
- generalizar para N é trivial na AST (`cast` é uma lista) e mostra domínio
  real de compiladores (gramática recursiva);
- a conversa **automática** continua exigindo 2 (o diálogo gerado alterna
  entre dois) — regra semântica explícita, não acidente.

## 9. Testes — por que 4 válidos + 4 erros?

O enunciado pede mínimo 3+3. Fomos além porque cada teste prova uma fase:

- `01` prova o diálogo automático e N personagens;
- `02` prova **entrada + decisão + repetição** (o programa "completo" exigido);
- `03` prova aritmética e precedência;
- `04` prova a **cena real** — a evidência mais forte de criatividade;
- os 4 erros cobrem **cada fase separadamente**: léxico (`@`), sintático
  (`FIMSE` faltando), semântico (tipo + variável) e personagem inexistente.

O harness `testar.js` não só compila — **executa o JavaScript gerado** com as
entradas, então "funciona" é verificado de verdade, não só "compila".

## 10. Estúdio animado — diferencial, não enfeite

O estúdio não é cosmético: ele é a **interface de execução** do interpretador.
Cada evento da AST vira algo visível — boneco que entra, bolha de fala, input
na pergunta. Isso transforma o projeto de "tradutor de linha de comando" em
"ambiente de desenvolvimento de cenas", o que é exatamente a identidade da
linguagem. Na apresentação, a demo ao vivo é a prova de que a linguagem
"realmente funciona".

## Resumo em uma frase

> ChavScript é uma linguagem de domínio específico cuja gramática, análise e
> geração de código seguem o pipeline clássico de compiladores — e cuja
> execução produz uma peça encenada, não apenas texto na tela.
