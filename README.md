# ChavScript

> Do Meme ao Código — linguagem de programação inspirada em **Chaves — O Show do Chaves**.

[**▶ Abrir o estúdio online**](https://paulobumba.github.io/chave-script/ChavScript.html) ·
[Especificação (PDF)](especificacao.pdf) ·
[Slides da apresentação](slides.pdf) ·
[Arquitetura do compilador](docs/ARQUITETURA.md)

Linguagem própria com sintaxe temática da Vila do Chaves, um **tradutor
completo** (lexer → parser → análise semântica → interpretador → gerador de
código) e um **estúdio animado** que executa as cenas no navegador. O código
gerado é **JavaScript/Node.js** válido e independente.

Projeto da disciplina de **Compiladores** — recria a cena real do episódio
*"O Dinheiro Perdido"* (1978) com os 5 personagens do episódio.

---

## Funcionalidades

- **Linguagem ChavScript**: `VILA COMEÇA`, `CONVERSA ENTRE ... CENA TERMINA`,
  falas (`DIZ`, `RESPONDE`, `PENSA`, `GRITA`), direção de cena (`ENTRA`, `SAI`),
  variáveis (`TEXTO`, `NUMERO`), aritmética (`+ - * /`), condicionais
  (`SE ... SENÃO ... FIMSE`), repetição (`REPETE n VEZES`), entrada de dados
  (`PERGUNTA ... EM var`) e comentários (`//`).
- **Compilador real** (não é substituição de texto):
  - `lexer.js` — análise léxica com tokens e erros por linha
  - `parser.js` — análise sintática, descendente recursivo, gera AST
  - `semantica.js` — análise semântica: tabela de símbolos, inferência de
    tipos, variáveis não declaradas, tipos incompatíveis, personagens inválidos
  - `interpretador.js` — gerador assíncrono de eventos da cena
  - `codegen.js` — geração de JavaScript/Node.js executável
- **Estúdio animado**: personagens em SVG, cenários, balões de fala, voz
  (speechSynthesis), sons, entrada interativa e histórico de execuções.
- **6 personagens**: Chaves, Seu Madruga, Quico, Chiquinha, Professor
  Girafales e Sr. Barriga — conversas aceitam **N participantes**.

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

### Online (GitHub Pages)

Abra direto no navegador, sem instalar nada:

**https://paulobumba.github.io/chave-script/ChavScript.html**

O exemplo *"Cena real: O Dinheiro Perdido (todos os personagens)"* já vem
carregado. Clique em **Compilar** para ver as fases, **Executar** para a cena
animada e **Gerar JavaScript** para o código traduzido.

### Local

```bash
# opção 1: abrir o arquivo direto (duplo clique em ChavScript.html)

# opção 2: servidor local (recomendado)
python3 -m http.server 8765
# abra http://localhost:8765/ChavScript.html
```

> A página carrega os módulos de `js/` — mantenha a pasta `js/` junto do HTML.

### Testes (Node.js)

```bash
node testes/testar.js
```

O harness carrega os módulos `js/`, executa cada programa `.chav` por todas as
fases e roda o JavaScript gerado com as entradas de teste. Saída esperada:
`TODOS OS TESTES PASSARAM`.

### Executar um programa gerado

```bash
node programa.js < respostas.txt    # respostas.txt contém as respostas do PERGUNTA
```

## Estrutura do repositório

```
chavescript/
├── ChavScript.html          ← página do estúdio (carrega os módulos js/)
├── index (README renderizado pelo GitHub Pages)
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
├── docs/
│   └── ARQUITETURA.md       ← arquitetura interna do tradutor (fases, AST, codegen)
├── *.pdf                    ← especificacao, apresentacao e slides (impressão)
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

- [`docs/CONFORMIDADE.md`](docs/CONFORMIDADE.md) — **mapa completo**: cada
  exigência do enunciado → onde está implementada → como comprovar
- [`docs/JUSTIFICATIVA.md`](docs/JUSTIFICATIVA.md) — **o porquê** de cada
  decisão: justificativa por exigência, roteiro de defesa na apresentação
- [`ESPECIFICACAO.md`](ESPECIFICACAO.md) — linguagem completa: comandos, tipos,
  gramática EBNF, tokens, erros e a cena real
- [`docs/ARQUITETURA.md`](docs/ARQUITETURA.md) — como o tradutor funciona por
  dentro: cada fase, a AST, o interpretador e o gerador de código
- [`especificacao.pdf`](especificacao.pdf) — documento técnico para impressão
- [`slides.pdf`](slides.pdf) — apresentação do projeto
- [`apresentacao.pdf`](apresentacao.pdf) — guia da demonstração

## Referências

- Episódio real: *Chaves — O Dinheiro Perdido* (*El sobre de la renta*, 1978)
  — YouTube: <https://www.youtube.com/watch?v=pzcAyxehVVQ> (parte 1) e
  <https://www.youtube.com/watch?v=UUowj7zxsMg> (parte 2)
- Trabalho de referência: **BIRL** — Bambam's "It's show time" Recursive Language
