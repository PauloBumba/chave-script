# ChavScript — Documentação Oficial da Linguagem

**Versão 1.0** — Trabalho de Compiladores, "Do Meme ao Código"
**Linguagem de destino:** JavaScript (Node.js)
**Documento de referência:** tokens, gramática, semântica e exemplos.

---

## 1. Identificação

| Item | Valor |
|---|---|
| Nome | **ChavScript** |
| Inspiração | Chaves (El Chavo del Ocho) — Roberto Gómez Bolaños |
| Universo | Vila do Chaves |
| Extensão de arquivo | `.chav` |
| Case | Palavras reservadas e personagens em **MAIÚSCULAS** |
| Acentos | **Opcionais** — `SENÃO` = `SENAO`, `COMEÇA` = `COMECA` |
| Comentário | `//` até o fim da linha |

## 2. Estrutura de um programa

Todo programa é uma **peça encenada na Vila**:

```
VILA COMEÇA
  CONVERSA ENTRE <personagens>
    <comandos>
  CENA TERMINA
VILA TERMINA
```

- `VILA COMEÇA` abre o programa; `VILA TERMINA` fecha (obrigatório).
- Uma `CONVERSA` agrupa **dois ou mais personagens** distintos, separados por `E`.
- Dentro da conversa: direções de cena (`ENTRA`/`SAI`), falas, variáveis,
  decisões e repetições.
- Uma conversa sem nenhuma fala escrita usa o **modo automático**: o motor
  gera o diálogo a partir de `ASSUNTO` e `ESTILO`.

## 3. Elenco (personagens reservados)

| Identificador | Personagem |
|---|---|
| `CHAVES` | Chaves (o protagonista) |
| `CHIQUINHA` | Chiquinha (filha do Seu Madruga) |
| `QUICO` | Quico (amigo do Chaves) |
| `SEU_MADRUGA` | Seu Madruga (pobre, marido da Florinda) |
| `SR_BARRIGA` | Sr. Barriga (dono do cômodo) |
| `PROFESSOR_GIRAFALES` | Professor Girafales |

## 4. Palavras reservadas

### Estrutura
`VILA` `COMECA` `CONVERSA` `ENTRE` `ASSUNTO` `ESTILO` `CENA` `TERMINA`
`E` `EM`

### Direção e fala
`ENTRA` `SAI` `DIZ` `RESPONDE` `PENSA` `GRITA` `PERGUNTA`

### Variáveis e tipos
`TEXTO` `NUMERO`

### Controle
`SE` `SENAO` `FIMSE` `IGUAL` `DIFERENTE` `MAIOR` `MENOR` `REPETE` `VEZES` `FIM`

### Estilos de cena
`ENGRACADO` `EDUCATIVO` `DRAMATICO`

## 5. Tokens

| Token | Forma | Exemplo |
|---|---|---|
| Palavra reservada | maiúsculas, acento opcional | `DIZ`, `SENAO` |
| Personagem | maiúsculas com `_` | `SEU_MADRUGA` |
| Identificador | `[A-Za-zÀ-ÿ_][A-Za-zÀ-ÿ_0-9]*` | `moedas`, `nome1` |
| String | `"..."` (sem aspas internas) | `"Onde está?"` |
| Número | dígitos inteiros | `42`, `100` |
| Operador | `+ - * / = ( )` | `moedas + 1` |
| Comentário | `//` até fim da linha | `// comentário` |

> **Atenção:** `//` inicia comentário — para dividir use espaços (`10 / 2`).
> Números são inteiros; expressões aritméticas produzem inteiros.

## 6. Tipos de dados

| Tipo | Declaração | Valores |
|---|---|---|
| `NUMERO` | `NUMERO nome = expr` | inteiros |
| `TEXTO` | `TEXTO nome = expr` | strings entre aspas |

## 7. Operadores

### Aritméticos (precedência usual)

| Operador | Significado | Tipos |
|---|---|---|
| `+` | soma ou concatenação | `NUMERO+NUMERO→NUMERO`; com `TEXTO` → concatena |
| `-` | subtração | só `NUMERO` |
| `*` | multiplicação | só `NUMERO` |
| `/` | divisão inteira | só `NUMERO` |

### Relacionais (somente dentro de `SE`)

| Operador | Significado | Tipos |
|---|---|---|
| `IGUAL` | igualdade | mesmo tipo |
| `DIFERENTE` | desigualdade | mesmo tipo |
| `MAIOR` | maior que | só `NUMERO` |
| `MENOR` | menor que | só `NUMERO` |

## 8. Comandos

| Sintaxe | Efeito |
|---|---|
| `personagem ENTRA` | entra em cena |
| `personagem SAI` | sai de cena |
| `personagem DIZ expr` | fala (com voz) |
| `personagem RESPONDE expr` | resposta (com voz) |
| `personagem PENSA expr` | pensamento (sem voz) |
| `personagem GRITA expr` | fala em destaque |
| `personagem PERGUNTA expr EM var` | pergunta → guarda resposta em `var` (precisa ser `TEXTO` declarada) |
| `TEXTO nome = expr` | declara variável de texto |
| `NUMERO nome = expr` | declara variável numérica |
| `ASSUNTO expr` | tema da conversa automática |
| `ESTILO estilo` | tom da cena (`ENGRACADO`/`EDUCATIVO`/`DRAMATICO`) |

## 9. Estruturas de controle

### Condicional

```
SE expr OP expr
  <comandos>
SENAO            ← opcional
  <comandos>
FIMSE
```

### Repetição

```
REPETE expr VEZES     ← expr deve ser NUMERO entre 1 e 20
  <comandos>
FIM
```

Ambas podem ser **aninhadas**. `FIM` fecha o `REPETE` mais recente; `FIMSE`
fecha o `SE` mais recente.

## 10. Gramática formal (EBNF)

```
programa     ::= VILA COMECA conversa* VILA TERMINA

conversa     ::= CONVERSA ENTRE personagem (E personagem)+ corpo CENA TERMINA
elenco       ::= 2 ou mais personagens distintos

corpo        ::= (ASSUNTO expr | ESTILO estilo | comando)*

comando      ::= personagem ENTRA
               | personagem SAI
               | personagem (DIZ | RESPONDE | PENSA | GRITA) expr
               | personagem PERGUNTA expr EM identificador
               | declaracao
               | repeticao
               | condicao

personagem   ::= CHAVES | CHIQUINHA | QUICO | SEU_MADRUGA
               | SR_BARRIGA | PROFESSOR_GIRAFALES

estilo       ::= ENGRACADO | EDUCATIVO | DRAMATICO

expr         ::= termo (("+" | "-") termo)*
termo        ::= fator (("*" | "/") fator)*
fator        ::= "-" fator | primario
primario     ::= NUMERO | STRING | identificador | "(" expr ")"

declaracao   ::= (TEXTO | NUMERO) identificador "=" expr

repeticao    ::= REPETE expr VEZES comando* FIM

condicao     ::= SE expr (IGUAL | DIFERENTE | MAIOR | MENOR) expr
                 comando* [SENAO comando*] FIMSE

identificador::= [A-Za-zÀ-ÿ_][A-Za-zÀ-ÿ_0-9]*   (normalizado: sem acento, maiúsculas)
STRING        ::= "..."   (sem quebra de linha nem aspas internas)
NUMERO        ::= [0-9]+
```

## 11. Regras semânticas

1. **Escopo:** variáveis pertencem à conversa em que foram declaradas.
2. **Declaração única:** redeclarar o mesmo nome na mesma conversa é erro.
3. **Uso antes da declaração** (ou de variável inexistente) é erro.
4. **Tipos:** `-`, `*`, `/` exigem `NUMERO` dos dois lados; `+` concatena se
   houver `TEXTO`; `IGUAL`/`DIFERENTE` exigem tipos iguais; `MAIOR`/`MENOR`
   exigem `NUMERO`.
5. **`PERGUNTA`** exige variável `TEXTO` já declarada na conversa.
6. **Falas** (`DIZ`, `RESPONDE`, `PENSA`, `GRITA`) aceitam qualquer expressão
   — são convertidas para texto na saída.
7. **`REPETE`** exige expressão `NUMERO` literal entre 1 e 20.
8. **Elenco:** personagem de comando deve estar na lista da conversa;
   elenco não pode ter repetição nem menos de 2 participantes.
9. **`ESTILO`** deve ser um dos três valores válidos.

## 12. Tradução para JavaScript

| ChavScript | JavaScript gerado |
|---|---|
| `TEXTO nome = expr` | `let nome = expr;` |
| `NUMERO nome = expr` | `let nome = expr;` |
| `DIZ/RESPONDE expr` | `console.log("Personagem: " + expr)` |
| `PENSA expr` | `console.log("  (Personagem pensa: " + expr + ")")` |
| `GRITA expr` | `console.log("Personagem GRITA: " + expr)` |
| `PERGUNTA expr EM v` | `v = __pergunta(expr)` |
| `SE c1 OP c2` | `if (c1 === c2)` / `!==` `>` `<` |
| `REPETE n VEZES` | `for (let __i = 0; __i < n; __i++)` |
| `ENTRA`/`SAI` | comentário de direção de cena |

O programa gerado lê respostas do `PERGUNTA` pelo stdin:

```bash
node programa.js < respostas.txt
```

## 13. Catálogo de erros

| Fase | Erro | Exemplo de mensagem |
|---|---|---|
| Léxico | símbolo inválido | `Linha 5: símbolo inválido @` |
| Léxico | string sem fechar | `Linha 3: string sem fechamento` |
| Sintático | bloco sem fechamento | `Linha 8: bloco SE sem fechamento (FIMSE)` |
| Sintático | delimitador ausente | `Linha 4: esperado =` |
| Semântico | variável inexistente | `Linha 7: variável 'x' não declarada` |
| Semântico | tipo inválido | `Linha 9: conta só aceita NUMERO` |
| Semântico | personagem inválido | `Linha 2: personagem 'X' não está no elenco` |
| Runtime | resposta não numérica | aviso + nova tentativa de leitura |

Todos os erros informam o **número da linha**.

## 14. Exemplos

### Mínimo

```
VILA COMEÇA
CONVERSA ENTRE CHAVES E QUICO
  CHAVES DIZ "Olá!"
  QUICO RESPONDE "Oi, Chaves!"
CENA TERMINA
VILA TERMINA
```

### Entrada, decisão e repetição

```
VILA COMEÇA
CONVERSA ENTRE CHAVES E SEU_MADRUGA
  NUMERO socos = 3
  TEXTO lugar = ""
  SEU_MADRUGA DIZ "Cadê meu dinheiro?"
  CHAVES PERGUNTA "Em que bolso?" EM lugar
  SE lugar IGUAL "bolso"
    CHAVES Grita "Achei!"
  SENAO
    SEU_MADRUGA GRITA "Tá vendo?!"
  FIMSE
  REPETE socos VEZES
    SEU_MADRUGA DIZ "Direita! Esquerda!"
  FIM
CENA TERMINA
VILA TERMINA
```

## 15. Implementação

O tradutor está em `js/`, em módulos por fase:

| Arquivo | Fase |
|---|---|
| `js/util.js` | normalização de texto/acentos |
| `js/dados.js` | elenco, estilos, banco de frases, dicionário |
| `js/lexer.js` | análise léxica → tokens |
| `js/parser.js` | análise sintática → AST |
| `js/semantica.js` | análise semântica → símbolos/tipos |
| `js/interpretador.js` | execução → eventos de cena |
| `js/codegen.js` | geração de JavaScript |
| `js/estudio.js` | interface do estúdio (UI) |

Execução interativa no navegador (`ChavScript.html`); testes com
`node testes/testar.js`.
