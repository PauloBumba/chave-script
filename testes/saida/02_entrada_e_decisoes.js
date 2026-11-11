// ChavScript -> JavaScript (Node.js)
// Gerado pelo tradutor ChavScript — projeto de Compiladores
"use strict";
const fs=require("fs");
const __linhas=fs.readFileSync(0,"utf8").split(/\r?\n/);
let __pos=0;
function __pergunta(msg){process.stdout.write(String(msg)+" ");return __linhas[__pos++]??"";}
function __lerNumero(msg){for(;;){const v=Number(__pergunta(msg));if(!Number.isNaN(v))return v;console.log("Erro: informe um número.");}}

// Conversa: Chaves, Quico
{
  let IDADE = 0;
  let MOEDAS = 0;
  let NOME = "";
  // Chaves entra em cena.
  // Quico entra em cena.
  IDADE = __lerNumero(""+"Quantos anos o senhor tem?");
  NOME = __pergunta(""+"E o seu nome, criatura?");
  console.log("Chaves: "+(("Prazer, " + NOME) + "!"));
  let DOBRO = (IDADE * 2);
  if(IDADE > 17){
    console.log("Chaves: "+("Adulto! Dobro da idade: " + DOBRO));
  }else{
    console.log("Chaves GRITA: "+"MENOR DE IDADE! Volta pra escola!");
  }
  MOEDAS = __lerNumero(""+"Quantas moedas o Chaves te deve?");
  for(let __i=0;__i<(MOEDAS);__i++){
    console.log("Chaves GRITA: "+"Me paga!");
    console.log("Quico: "+"Não tenho!");
  }
  if(MOEDAS !== 0){
    console.log("  ("+"Quico"+" pensa: "+"Quem deve, paga... um dia."+")");
  }else{
    console.log("Quico: "+"Que alívio, estou quito.");
  }
  // Chaves sai de cena.
  // Quico sai de cena.
}
