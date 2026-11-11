# ChavScript

> Do Meme ao Código — uma linguagem de programação inspirada em **Chaves — O Show do Chaves**.

Linguagem própria com sintaxe temática da Vila do Chaves, um **tradutor completo**
(lexer → parser → análise semântica → interpretador → gerador de código) e um
**estúdio animado** que executa as cenas no navegador. O código gerado é
**JavaScript/Node.js** válido e independente.

Projeto da disciplina de **Compiladores**.

---

## Funcionalidades

- **Linguagem ChavScript**: `VILA COMEÇA`, `CONVERSA ENTRE ... CENA TERMINA`,
  falas (`DIZ`, `RESPONDE`, `PENSA`, `GRITA`), direção de cena (`ENTRA`, `SAI`),
  variáveis (`TEXTO`, `NUMERO`), aritmética (`+ - * /`), condicionais
  (`SE ... SENÃO ... FIMSE`), repetição (`REPETE n VEZES`), entrada de dados
  (`PERGUNTA ... EM var`) e comentários (`//`).
- **Compilador real** (não é substituição de texto):
  - `lex()` — análise léxica com tokens e erros por linha
  - `parse()` — análise sintática, descendente recursivo, gera AST
  - `sem()` — análise semântica: tabela de símbolos, inferência de tipos,
    variáveis não declaradas, tipos incompatíveis, personagens inválidos
  - `events()` — interpretador assíncrono que produz os eventos da cena
  - `toJS()` — geração de JavaScript/Node.js executável
- **Estúdio animado**: personagens em SVG, cenários, balões de fala, voz
  (speechSynthesis), sons, entrada interativa e histórico de execuções.
- **6 personagens**: Chaves, Seu Madruga, Quico, Chiquinha, Professor
  Girafales e Sr. Barriga — conversas aceitam **N participantes**.
- **Cena real**: o exemplo padrão recria o episódio *"O Dinheiro Perdido"*
  (1978) com os 5 personagens do episódio.

## Requisitos do trabalho — cobertura

| Requisito | ChavScript |
|---|---|
| Declaração de variáveis | `TEXTO nome = "..."` / `NUMERO nome = 2` |
| Tipos de dados | texto e número, verificados estaticamente |
| Aritmética | `+ - * /`, parênteses e precedência |
| Entrada de dados | `PERGUNTA expr EM var` (input no estúdio / stdin no Node) |
| Saída de dados | `DIZ / RESPONDE / PENSA / GRITA` |
| Condicional | `SE ... IGUAL/DIFERENTE/MAIOR/MENOR ... SENÃO ... FIMSE` |
| Repetição | `REPETE n VEZES ... FIM` (aninhável) |
| Comentários | `//` até o fim da linha |
| Erros | léxicos, sintáticos e semânticos com número da linha |
| Geração de código | JavaScript/Node.js executável |

## Como usar

### Estúdio (navegador)

```bash
# opção 1: abrir o arquivo direto
xdg-open ChavScript.html        # ou simplesmente dê dois cliques

# opção 2: servidor local (recomendado)
python3 -m http.server 8765
# abra http://localhost:8765/ChavScript.html
```

No estúdio: **Compilar** mostra as fases no console → **Executar** roda a cena
animada → **Gerar JavaScript** abre a aba JS com o código traduzido (copiar ou
baixar `.js`).

### Linha de comando (Node.js)

```bash
node testes/testar.js           # roda toda a suíte de testes
```

O harness extrai o compilador de dentro do HTML, executa cada programa
`.chav` por todas as fases e roda o JavaScript gerado com as entradas de
teste.

### Executar um programa gerado

```bash
node programa.js < respostas.txt    # respostas.txt contém as respostas do PERGUNTA
```

## Estrutura do repositório

```
ChaveSCript/
├── ChavScript.html          ← página do estúdio (carrega os módulos js/)
├── js/                      ← código-fonte separado por responsabilidade
│   ├── util.js              ← helpers (norm, key, $)
│   ├── dados.js             ← elenco, palavras reservadas, falas prontas
│   ├── lexer.js             ← análise léxica (tokens + erros)
│   ├── parser.js            ← análise sintática -> AST
│   ├── semantica.js         ← análise semântica (símbolos + tipos)
│   ├── interpretador.js     ← eventos da cena + drain
│   ├── codegen.js           ← gerador de JavaScript/Node.js
│   └── estudio.js           ← estúdio animado (DOM, voz, sons, painéis)
├── README.md                ← este arquivo
├── ESPECIFICACAO.md         ← especificação da linguagem (tokens, gramática, exemplos)
├── especificacao.pdf        ← especificação para impressão
├── apresentacao.pdf         ← guia da demonstração
├── slides.pdf               ← slides da apresentação
├── docs/
│   └── ARQUITETURA.md       ← arquitetura interna do tradutor (fases, AST, codegen)
└── testes/
    ├── 01_conversa_automatica.chav
    ├── 02_entrada_e_decisoes.chav  (+ .in.txt)
    ├── 03_calculos_e_repeticao.chav
    ├── 04_dinheiro_perdido.chav    ← cena real, 5 personagens (+ .in.txt)
    ├── erro_1..4_*.chav            ← exemplos de erro (léxico, sintático, semântico)
    ├── testar.js                   ← harness de testes
    └── saida/                      ← códigos JavaScript gerados (evidência)
```

## Exemplo rápido

```chavscript
VILA COMEÇA
CONVERSA ENTRE CHAVES E SEU_MADRUGA
  NUMERO socos = 3
  CHAVES ENTRA
  SEU_MADRUGA ENTRA
  SEU_MADRUGA DIZ "Eu juro que tinha o dinheiro!"
  CHAVES PERGUNTA "Onde o senhor viu?" EM lugar
  REPETE socos VEZES
    SEU_MADRUGA GRITA "Direita! Esquerda!"
    CHAVES RESPONDE "Ai! Ai!"
  FIM
CENA TERMINA
VILA TERMINA
```

Gera JavaScript equivalente:

```js
let SOCOS = 3;
LUGAR = __pergunta(""+"Onde o senhor viu?");
for(let __i=0;__i<(SOCOS);__i++){
  console.log("Seu Madruga GRITA: "+"Direita! Esquerda!");
  console.log("Chaves: "+"Ai! Ai!");
}
```

## Documentação

- [`ESPECIFICACAO.md`](ESPECIFICACAO.md) — linguagem completa: comandos, tipos,
  gramática EBNF, tokens, erros e a cena real
- [`docs/ARQUITETURA.md`](docs/ARQUITETURA.md) — como o tradutor funciona por
  dentro: cada fase, a AST, o interpretador e o gerador de código
- [`slides.pdf`](slides.pdf) — apresentação do projeto
- [`especificacao.pdf`](especificacao.pdf) — documento técnico para impressão

## Referências

- Episódio real: *Chaves — O Dinheiro Perdido* (*El sobre de la renta*, 1978)
  — YouTube: <https://www.youtube.com/watch?v=pzcAyxehVVQ> (parte 1) e
  <https://www.youtube.com/watch?v=UUowj7zxsMg> (parte 2)
- Trabalho de referência: **BIRL** — Bambam's "It's show time" Recursive Language

---

Feito com ♥ e muito humor para a disciplina de Compiladores.
