// ChavScript -> JavaScript (Node.js)
// Gerado pelo tradutor ChavScript — projeto de Compiladores
"use strict";
const fs=require("fs");
const __linhas=fs.readFileSync(0,"utf8").split(/\r?\n/);
let __pos=0;
function __pergunta(msg){process.stdout.write(String(msg)+" ");return __linhas[__pos++]??"";}
function __lerNumero(msg){for(;;){const v=Number(__pergunta(msg));if(!Number.isNaN(v))return v;console.log("Erro: informe um número.");}}

// Conversa: Chaves, Seu Madruga
{
const __pool0=["{o}, você tem algum dinheiro aí?","Tenho sim, mas está guardado onde ninguém acha.","Então dá para pagar o que o senhor deve?","Quem te contou que eu devo alguma coisa?","Todo mundo sabe, está escrito na parede!","Pois vou apagar essa parede agora mesmo!","Então me empresta uma moeda só até amanhã?","Amanhã eu estarei muito longe daqui.","Para onde o senhor vai?","Para qualquer lugar onde ninguém me cobre."];
for(let __i=0;__i<6;__i++){const __w=__i%2?"Seu Madruga":"Chaves";const __o=__i%2?"Chaves":"Seu Madruga";let __t=__pool0[__i%__pool0.length].replace("{o}",__o);
if(__i%3===2)__t+=" Hahaha!";
console.log(__w+": "+__t);}
// (diálogo automático: 6 falas alternadas)
}
