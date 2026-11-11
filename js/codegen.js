const JSRES=new Set('break case catch class const continue debugger default delete do else enum export extends false finally for function if import in instanceof new null return super switch this throw true try typeof var void while with let static yield await implements interface package private protected public'.split(' '));
const jn=n=>JSRES.has(n)?'__v_'+n:n;
function toJS(ast){const o=['// ChavScript -> JavaScript (Node.js)','// Gerado pelo tradutor ChavScript — projeto de Compiladores','"use strict";','const fs=require("fs");','const __linhas=fs.readFileSync(0,"utf8").split(/\\r?\\n/);','let __pos=0;','function __pergunta(msg){process.stdout.write(String(msg)+" ");return __linhas[__pos++]??"";}','function __lerNumero(msg){for(;;){const v=Number(__pergunta(msg));if(!Number.isNaN(v))return v;console.log("Erro: informe um número.");}}',''];
const je=x=>{switch(x.k){case'n':return String(x.v);case's':return JSON.stringify(x.v);case'var':return jn(x.name);case'neg':return'(-'+je(x.e)+')';case'bin':return'('+je(x.l)+' '+x.op+' '+je(x.r)+')'}};
const CMP={IGUAL:'===',DIFERENTE:'!==',MAIOR:'>',MENOR:'<'};
ast.conversas.forEach((c,ci)=>{o.push('// Conversa: '+c.cast.map(p=>CH[p.v].n).join(', '),'{');
if(!hasFala(c.cmds)){const as=key(c.assunto||'amizade'),pool=BANK[as]||BANK.amizade,A=JSON.stringify(CH[c.a.v].n),B=JSON.stringify(CH[c.b.v].n),st=c.estilo&&c.estilo.v||'ENGRACADO';
o.push('const __pool'+ci+'='+JSON.stringify(pool)+';','for(let __i=0;__i<6;__i++){const __w=__i%2?'+B+':'+A+';const __o=__i%2?'+A+':'+B+';let __t=__pool'+ci+'[__i%__pool'+ci+'.length].replace("{o}",__o);');
if(st==='ENGRACADO')o.push('if(__i%3===2)__t+=" Hahaha!";');
if(st==='EDUCATIVO')o.push('if(__i===0)__t="Vamos aprender: "+__t;');
if(st==='DRAMATICO')o.push('__t=__t.replace(/[.!?]$/,"...");if(__i%2)__t="(suspira) "+__t;');
o.push('console.log(__w+": "+__t);}','// (diálogo automático: 6 falas alternadas)');}
else{const tipos={};const emit=(L,ind)=>L.forEach(m=>{const pad='  '.repeat(ind);
if(m.op==='DECL'){tipos[m.name]=m.tipo;o.push(pad+'let '+jn(m.name)+' = '+je(m.val)+';')}
else if(m.op==='REPETE'){o.push(pad+'for(let __i=0;__i<('+je(m.n)+');__i++){');emit(m.body,ind+1);o.push(pad+'}')}
else if(m.op==='SE'){o.push(pad+'if('+je(m.a)+' '+CMP[m.o]+' '+je(m.b)+'){');emit(m.then,ind+1);if(m.else.length){o.push(pad+'}else{');emit(m.else,ind+1);o.push(pad+'}')}else o.push(pad+'}')}
else if(m.op==='PERGUNTA'){const fn=tipos[m.name]==='NUMERO'?'__lerNumero':'__pergunta';o.push(pad+jn(m.name)+' = '+fn+'('+JSON.stringify('')+'+'+je(m.text)+');')}
else if(m.op==='ENTRA'||m.op==='SAI')o.push(pad+'// '+CH[m.who.v].n+(m.op==='ENTRA'?' entra em cena.':' sai de cena.'));
else if(m.op==='PENSA')o.push(pad+'console.log("  ("+'+JSON.stringify(CH[m.who.v].n)+'+" pensa: "+'+je(m.text)+'+")");');
else if(m.op==='GRITA')o.push(pad+'console.log("'+CH[m.who.v].n+' GRITA: "+'+je(m.text)+');');
else o.push(pad+'console.log("'+CH[m.who.v].n+': "+'+je(m.text)+');')});
emit(c.cmds,1)}
o.push('}','')});
return o.join('\n')}
