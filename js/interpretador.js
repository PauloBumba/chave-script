/* 4. Interpretador (gerador assíncrono de eventos) + gerador de JavaScript */
const FALA_OPS=['DIZ','RESPONDE','PENSA','GRITA'];
function hasFala(L){return L.some(m=>FALA_OPS.includes(m.op)||m.op==='PERGUNTA'||(m.body&&hasFala(m.body))||(m.then&&hasFala(m.then))||(m.else&&hasFala(m.else)))}
async function* events(ast,cf){for(let ci=0;ci<ast.conversas.length;ci++){const c=ast.conversas[ci];
const map={};c.cast.forEach((p,i)=>map[p.v]=i===0?(cf.p1||p.v):i===1?(cf.p2||p.v):p.v);
const A=map[c.cast[0].v],B=map[c.cast[1].v],st=cf.st||(c.estilo&&c.estilo.v)||'ENGRACADO',as=key(cf.as||c.assunto||'amizade'),pool=BANK[as]||BANK.amizade,ak=BANK[as]?as:'amizade';
yield{k:'cast',who:c.cast.map(p=>map[p.v])};
if(!hasFala(c.cmds)){yield{k:'enter',w:A},{k:'enter',w:B};
for(let i=0;i<cf.n;i++){const w=i%2?B:A,o=CH[i%2?A:B].n;let t=pool[i%pool.length].replace('{o}',o);
if(Math.random()<.4)t=INTER[w][Math.random()<.5?0:1]+t;
if(st==='ENGRACADO'&&i%3===2)t+=' Hahaha!';if(st==='EDUCATIVO'&&i===0)t='Vamos aprender: '+t;if(st==='DRAMATICO'){t=t.replace(/[.!?]$/,'...');if(i%2)t='(suspira) '+t}
yield{k:'say',w,text:t,key:('c'+ci+'_'+w+'_'+ak+'_'+(i%pool.length)).toLowerCase()}}
yield{k:'exit',w:A},{k:'exit',w:B};continue}
const env={};
const g=x=>{switch(x.k){case'n':return x.v;case's':return x.v;case'var':return env[x.name].v;
case'neg':return -g(x.e);
case'bin':{const a=g(x.l),b=g(x.r);return x.op==='+'?(typeof a==='string'||typeof b==='string'?String(a)+String(b):a+b):x.op==='-'?a-b:x.op==='*'?a*b:a/b}}};
async function* walk(L){for(const m of L){
if(m.op==='DECL')env[m.name]={v:g(m.val),t:m.tipo};
else if(m.op==='REPETE'){const n=Math.floor(g(m.n));for(let i=0;i<n&&i<1000;i++)yield* walk(m.body)}
else if(m.op==='SE'){const x=g(m.a),y=g(m.b);yield* walk((m.o==='IGUAL'?x===y:m.o==='DIFERENTE'?x!==y:m.o==='MAIOR'?x>y:x<y)?m.then:m.else)}
else if(m.op==='PERGUNTA'){const pr=String(g(m.text)),tp=(env[m.name]||{}).t||'TEXTO';
for(;;){const ans=yield{k:'ask',w:map[m.who.v],text:pr,tp};
if(tp==='NUMERO'){const v=Number(ans);if(ans!==''&&!Number.isNaN(v)){env[m.name]={v,t:tp};break}yield{k:'log',cls:'er',text:'Erro: informe um número.'}}
else{env[m.name]={v:String(ans??''),t:tp};break}}}
else yield{k:{ENTRA:'enter',SAI:'exit',DIZ:'say',RESPONDE:'say',PENSA:'think',GRITA:'shout'}[m.op],w:map[m.who.v],text:m.text==null?null:g(m.text)}}}
yield* walk(c.cmds)}}
async function drain(ast,cf){const evs=[];const it=events(ast,cf);let r=await it.next();while(!r.done){evs.push(r.value);const ans=r.value.k==='ask'?(r.value.tp==='NUMERO'?'7':'teste'):undefined;r=await it.next(ans)}return evs}
