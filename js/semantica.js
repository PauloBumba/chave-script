/* 3. Análise semântica (tabela de símbolos + tipos de expressões) */
function sem(ast){const E=[],W=[];if(!ast.conversas.length)E.push('O programa não tem nenhuma CONVERSA');
ast.conversas.forEach(c=>{c.cast.forEach(x=>{if(!CH[x.v])E.push('Linha '+x.l+': personagem inexistente '+x.v)});
if(new Set(c.cast.map(x=>x.v)).size!==c.cast.length)E.push('Linha '+c.cast[0].l+': há personagens repetidos na conversa');
if(!hasFala(c.cmds)&&c.cast.length!==2)E.push('Linha '+c.cast[0].l+': conversa automática precisa de exatamente 2 personagens');
if(c.estilo&&!ESTILOS.includes(c.estilo.v))E.push('Linha '+c.estilo.l+': estilo inválido '+c.estilo.v);
if(c.assunto!==null&&!BANK[key(c.assunto)])W.push('Assunto “'+c.assunto+'” sem frases prontas; usando frases de amizade');
const TS={};
const ty=x=>{switch(x.k){
case'n':return'NUMERO';case's':return'TEXTO';
case'var':if(!(x.name in TS)){E.push('Linha '+x.l+': variável '+x.name+' não declarada');return null}return TS[x.name];
case'neg':{const t=ty(x.e);if(t&&t!=='NUMERO')E.push('Linha '+x.l+': não dá para negar '+t);return'NUMERO'}
case'bin':{const a=ty(x.l),b=ty(x.r);if(!a||!b)return null;
if(x.op==='+'){if(a==='NUMERO'&&b==='NUMERO')return'NUMERO';return'TEXTO'}
if(a!=='NUMERO'||b!=='NUMERO'){E.push('Linha '+x.ln+': operador '+x.op+' só vale para NUMERO');return null}return'NUMERO'}}return null};
const walk=L=>L.forEach(m=>{
if(m.op==='DECL'){if(KWS.has(m.name))E.push('Linha '+m.l+': '+m.name+' é palavra reservada');else if(m.name in TS)E.push('Linha '+m.l+': variável '+m.name+' já declarada');const t=ty(m.val);if(t&&t!==m.tipo)E.push('Linha '+m.l+': '+m.tipo+' precisa receber '+m.tipo+', mas a expressão é '+t);TS[m.name]=m.tipo}
else if(m.op==='REPETE'){const t=ty(m.n);if(t&&t!=='NUMERO')E.push('Linha '+m.l+': REPETE precisa de NUMERO');if(m.n.k==='n'&&(m.n.v<1||m.n.v>20))E.push('Linha '+m.l+': REPETE aceita de 1 a 20 vezes');walk(m.body)}
else if(m.op==='SE'){const a=ty(m.a),b=ty(m.b);if(a&&b){if(a!==b)E.push('Linha '+m.l+': não dá para comparar '+a+' com '+b);else if((m.o==='MAIOR'||m.o==='MENOR')&&a!=='NUMERO')E.push('Linha '+m.l+': '+m.o+' só vale para NUMERO')}walk(m.then);walk(m.else)}
else if(m.op==='PERGUNTA'){if(!c.cast.some(p=>p.v===m.who.v))E.push('Linha '+m.l+': '+m.who.v+' não participa desta conversa');const t=ty(m.text);if(t&&t!=='TEXTO')E.push('Linha '+m.l+': PERGUNTA precisa de TEXTO');if(!(m.name in TS))E.push('Linha '+m.l+': variável '+m.name+' não declarada')}
else{if(!c.cast.some(p=>p.v===m.who.v))E.push('Linha '+m.l+': '+m.who.v+' não participa desta conversa');if(m.text!==null){const t=ty(m.text);if(t&&t!=='TEXTO')E.push('Linha '+m.l+': '+m.op+' precisa de TEXTO')}}});
walk(c.cmds)});return{E,W}}
