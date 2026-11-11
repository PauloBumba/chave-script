/* 2. Parser (descendente recursivo) -> AST */
function parse(T){let p=0;const pk=()=>T[p],err=m=>{throw{m:'Linha '+((T[p]||T[T.length-1]||{l:1}).l)+': '+m}},is=v=>pk()&&pk().t==='KW'&&pk().v===v,sym=v=>pk()&&pk().t==='SYM'&&pk().v===v;
const kw=v=>{if(!is(v))err('esperado '+v+(pk()?', encontrado '+(pk().v||pk().t):' (fim do arquivo)'));p++};
const id=()=>{const t=pk();if(!t||t.t==='STR'||t.t==='NUM'||t.t==='SYM')err('esperado um nome');p++;return{v:t.v,l:t.l}};
const expr=()=>{let l=term();for(;;){const t=pk();if(t&&t.t==='SYM'&&(t.v==='+'||t.v==='-')){p++;l={k:'bin',op:t.v,l:l,r:term(),ln:t.l}}else return l}};
const term=()=>{let l=fator();for(;;){const t=pk();if(t&&t.t==='SYM'&&(t.v==='*'||t.v==='/')){p++;l={k:'bin',op:t.v,l:l,r:fator(),ln:t.l}}else return l}};
const fator=()=>{const t=pk();if(t&&t.t==='SYM'&&t.v==='-'){p++;return{k:'neg',e:fator(),l:t.l}}return prim()};
const prim=()=>{const t=pk();if(!t)err('esperado um valor');if(t.t==='NUM'){p++;return{k:'n',v:t.v,l:t.l}}if(t.t==='STR'){p++;return{k:'s',v:t.v,l:t.l}}if(t.t==='ID'){p++;return{k:'var',name:t.v,l:t.l}}if(sym('(')){p++;const e=expr();if(!sym(')'))err('esperado )');p++;return e}err('esperado texto, número, variável ou (')};
const OPS=['ENTRA','SAI','DIZ','RESPONDE','PENSA','GRITA','PERGUNTA'],FALA=['DIZ','RESPONDE','PENSA','GRITA'];
kw('VILA');kw('COMECA');const cs=[];
while(is('CONVERSA')){p++;kw('ENTRE');const cast=[id()];while(is('E')){p++;cast.push(id())}if(cast.length<2)err('a conversa precisa de pelo menos dois personagens');const c={cast,a:cast[0],b:cast[1],assunto:null,estilo:null,cmds:[]},fr=[{list:c.cmds}];
while(!is('CENA')){const t=pk();if(!t)err('CENA TERMINA não encontrado');const cur=fr[fr.length-1].list;
if(is('ASSUNTO')){p++;const e=expr();if(e.k!=='s')err('ASSUNTO precisa de um texto entre aspas');c.assunto=e.v}
else if(is('ESTILO')){p++;c.estilo=id()}
else if(is('TEXTO')||is('NUMERO')){const tp=t.v;p++;const n=id();if(!sym('='))err('esperado = depois do nome da variável');p++;const v=expr();cur.push({op:'DECL',tipo:tp,name:n.v,val:v,l:n.l})}
else if(is('REPETE')){p++;const n=expr();kw('VEZES');const nd={op:'REPETE',n,l:t.l,body:[]};cur.push(nd);fr.push({list:nd.body,nd})}
else if(is('FIM')){if(fr.length<2||fr[fr.length-1].nd.op!=='REPETE')err('FIM sem REPETE');p++;fr.pop()}
else if(is('SE')){p++;const x=expr(),o=pk();if(!o||o.t!=='KW'||!['IGUAL','DIFERENTE','MAIOR','MENOR'].includes(o.v))err('esperado IGUAL, DIFERENTE, MAIOR ou MENOR');p++;const y=expr();const nd={op:'SE',a:x,o:o.v,b:y,l:t.l,then:[],else:[]};cur.push(nd);fr.push({list:nd.then,nd})}
else if(is('SENAO')){const f=fr[fr.length-1];if(fr.length<2||f.nd.op!=='SE'||f.list===f.nd.else)err('SENÃO fora de um SE');p++;f.list=f.nd.else}
else if(is('FIMSE')){if(fr.length<2||fr[fr.length-1].nd.op!=='SE')err('FIMSE sem SE');p++;fr.pop()}
else if(t.t==='ID'||CH[t.v]){const w=id(),o=pk();if(!o||o.t!=='KW'||!OPS.includes(o.v))err('esperado ENTRA, SAI, DIZ, RESPONDE, PENSA, GRITA ou PERGUNTA');p++;
if(o.v==='PERGUNTA'){const prompt=expr();kw('EM');const n=id();cur.push({who:w,op:'PERGUNTA',text:prompt,name:n.v,l:w.l})}
else cur.push({who:w,op:o.v,text:FALA.includes(o.v)?expr():null,l:w.l})}
else err('comando inesperado '+t.v)}
if(fr.length>1)err('bloco '+fr[fr.length-1].nd.op+' sem fechamento');
kw('CENA');kw('TERMINA');cs.push(c)}
kw('VILA');kw('TERMINA');if(p<T.length)err('código depois de VILA TERMINA');return{type:'Programa',conversas:cs}}
