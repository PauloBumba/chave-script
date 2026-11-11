// testar.js — harness de testes do tradutor ChavScript (Node.js)
// Uso: node testes/testar.js
// Carrega os módulos js/*.js do projeto (com DOM simulado),
// roda cada programa de testes/*.chav pelas fases LEXER → PARSER → SEMÂNTICA,
// gera os eventos (interpretador) e o JavaScript de destino, e executa o JS.
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { execFileSync } = require('child_process');

const DIR = __dirname;
const ROOT = path.join(DIR, '..');
// ordem de carga = ordem de dependência entre os módulos
const MODULOS = ['util', 'dados', 'lexer', 'parser', 'semantica', 'interpretador', 'codegen', 'estudio'];
const code = MODULOS
  .map(m => `// ==== js/${m}.js ====\n` + fs.readFileSync(path.join(ROOT, 'js', m + '.js'), 'utf8'))
  .join('\n');

// ---- DOM mínimo para o script do estúdio carregar no Node ----
const fakeEl = () => {
  const o = {
    style: {}, classList: { add() {}, remove() {}, toggle() {} }, children: [],
    value: '', checked: false, innerHTML: '', textContent: '', scrollTop: 0,
    scrollLeft: 0, selectedOptions: [{ text: 'pátio' }], files: [], dataset: {},
  };
  o.querySelector = () => fakeEl();
  o.appendChild = () => {};
  o.focus = () => {};
  o.click = () => {};
  return o;
};
global.window = global;
global.document = {
  querySelector: () => fakeEl(),
  querySelectorAll: () => [],
  createElement: () => fakeEl(),
};
global.localStorage = { getItem: () => null, setItem() {}, removeItem() {} };
global.navigator = { clipboard: { writeText: () => Promise.resolve() } };

vm.runInThisContext(code, { filename: 'js/*.js' });
const { lex, parse, sem, drain, toJS } =
  vm.runInThisContext('({lex,parse,sem,drain,toJS})');

const CF = { p1: '', p2: '', as: '', st: '', n: 4 };
const saidaDir = path.join(DIR, 'saida');
fs.mkdirSync(saidaDir, { recursive: true });

const files = fs.readdirSync(DIR).filter(f => f.endsWith('.chav')).sort();
let falhas = 0;

(async () => {
  for (const f of files) {
    const src = fs.readFileSync(path.join(DIR, f), 'utf8');
    const ehErro = f.startsWith('erro');
    console.log('\n' + '='.repeat(64));
    console.log((ehErro ? '✗ ERRO ESPERADO  ' : '✓ PROGRAMA VÁLIDO  ') + f);
    console.log('='.repeat(64));

    // Fase 1 — lexer
    const L = lex(src);
    if (L.E.length) {
      console.log('LEXER:'); L.E.forEach(e => console.log('  ' + e));
      if (!ehErro) falhas++;
      continue;
    }
    console.log(`LEXER: ${L.T.length} tokens`);

    // Fase 2 — parser
    let ast;
    try { ast = parse(L.T); }
    catch (e) {
      console.log('PARSER: ' + e.m);
      if (!ehErro) falhas++;
      continue;
    }
    console.log(`PARSER: AST ok (${ast.conversas.length} conversa(s))`);

    // Fase 3 — semântica
    const S = sem(ast);
    S.W.forEach(w => console.log('  aviso: ' + w));
    if (S.E.length) {
      console.log('SEMÂNTICA:'); S.E.forEach(e => console.log('  ' + e));
      if (!ehErro) falhas++;
      continue;
    }
    if (ehErro) { console.log('ERRO: esperava falha, mas compilou!'); falhas++; continue; }
    console.log('SEMÂNTICA: ok');

    // Interpretador — eventos
    const evs = await drain(ast, CF);
    const falas = evs.filter(e => e.k === 'say' || e.k === 'think' || e.k === 'shout');
    const asks = evs.filter(e => e.k === 'ask');
    console.log(`INTERPRETADOR: ${evs.length} eventos (${falas.length} falas, ${asks.length} perguntas)`);
    falas.slice(0, 6).forEach(e => console.log(`  ${e.w}: ${String(e.text).slice(0, 70)}`));

    // Fase 4 — codegen JavaScript
    const js = toJS(ast);
    const jsPath = path.join(saidaDir, f.replace(/\.chav$/, '.js'));
    fs.writeFileSync(jsPath, js);
    console.log(`CODEGEN: ${jsPath} (${js.split('\n').length} linhas)`);

    // Executa o JS gerado (com respostas simuladas, se houver .in.txt)
    try {
      const inp = path.join(DIR, f.replace(/\.chav$/, '.in.txt'));
      const args = inp.endsWith('.in.txt') && fs.existsSync(inp) ? [jsPath] : [jsPath];
      const input = fs.existsSync(inp) ? fs.readFileSync(inp) : Buffer.alloc(0);
      const out = execFileSync('node', args, { input, encoding: 'utf8', timeout: 10000 });
      console.log('EXECUÇÃO DO JS:');
      out.trim().split('\n').slice(0, 10).forEach(l => console.log('  ' + l));
      if (out.trim().split('\n').length > 10) console.log('  ...');
    } catch (e) {
      console.log('EXECUÇÃO DO JS FALHOU: ' + (e.message || e));
      falhas++;
    }
  }
  console.log('\n' + '='.repeat(64));
  console.log(falhas ? `FALHARAM: ${falhas} teste(s)` : 'TODOS OS TESTES PASSARAM');
  process.exit(falhas ? 1 : 0);
})();
