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
  let PRECO = 10;
  let QTD = 3;
  let TAXA = 5;
  let TOTAL = ((PRECO * QTD) + TAXA);
  let MSG = ("Total da compra: " + TOTAL);
  // Chaves entra em cena.
  // Seu Madruga entra em cena.
  console.log("Chaves: "+MSG);
  if(TOTAL > 30){
    console.log("Seu Madruga: "+"Caro demais para o meu bolso!");
  }else{
    console.log("Seu Madruga: "+"Preço justo, meu amigo.");
  }
  for(let __i=0;__i<(2);__i++){
    let METADE = (TOTAL / 2);
    console.log("Chaves GRITA: "+("Cada um paga " + METADE));
    if(METADE < 20){
      console.log("  ("+"Seu Madruga"+" pensa: "+"Dá para pagar... acho."+")");
    }
  }
  // Chaves sai de cena.
  // Seu Madruga sai de cena.
}
