// ChavScript -> JavaScript (Node.js)
// Gerado pelo tradutor ChavScript — projeto de Compiladores
"use strict";
const fs=require("fs");
const __linhas=fs.readFileSync(0,"utf8").split(/\r?\n/);
let __pos=0;
function __pergunta(msg){process.stdout.write(String(msg)+" ");return __linhas[__pos++]??"";}
function __lerNumero(msg){for(;;){const v=Number(__pergunta(msg));if(!Number.isNaN(v))return v;console.log("Erro: informe um número.");}}

// Conversa: Chaves, Chiquinha, Quico, Seu Madruga, Sr. Barriga
{
  let SOCOS = 4;
  let LUGAR = "";
  // Chaves entra em cena.
  // Chiquinha entra em cena.
  // Quico entra em cena.
  // Seu Madruga entra em cena.
  // Sr. Barriga entra em cena.
  console.log("Sr. Barriga: "+"Eu avisei que se não pagasse todo o aluguel atrasado, eu despejaria o senhor!");
  console.log("Seu Madruga: "+"Mas eu já tenho o dinheiro?");
  console.log("Sr. Barriga: "+"Ah é? Então dá!");
  console.log("Seu Madruga: "+"Está ali dentro, venha. Vamos entrar.");
  console.log("Chaves: "+"Chiquinha, Chiquinha! Olha, isso aqui é igualzinho ao que você tem na sua casa!");
  console.log("Chiquinha: "+"São os móveis da minha casa, Chaves!");
  console.log("Quico GRITA: "+"Não são iguaizinhos! São os móveis da Chiquinha!");
  console.log("Seu Madruga: "+"Eu não sei o que aconteceu... eu juro que tinha o dinheiro dentro de um envelope!");
  console.log("Sr. Barriga: "+"Um envelope com o dinheiro do aluguel, claro!");
  LUGAR = __pergunta(""+"Onde o senhor viu o dinheiro pela última vez?");
  if(LUGAR === "bolso"){
    console.log("Chaves: "+"Encontrei! Cem reais aqui no bolso!");
    console.log("Seu Madruga GRITA: "+"O que te interessa?! Mas o dinheiro é meu, hein?");
    console.log("Chaves: "+"Foi sem querer querendo...");
    console.log("Seu Madruga GRITA: "+"E agora eu vou te bater por querer querendo!");
    for(let __i=0;__i<(SOCOS);__i++){
      console.log("Seu Madruga: "+"Direita! Esquerda! Outra direita!");
      console.log("Chaves: "+"Ai! Ai! Ai!");
    }
    console.log("Chaves: "+"Não me aconteceu nada... estou perfeitamente bem!");
    console.log("  ("+"Sr. Barriga"+" pensa: "+"Esse rapaz anda achando dinheiro por aí..."+")");
  }else{
    console.log("Chaves: "+"Não encontrei dinheiro nenhum, juro!");
    console.log("Seu Madruga: "+"Então procure de novo...");
  }
  console.log("Chaves: "+"Será que não está aqui atrás do barril?");
  console.log("Chiquinha: "+"Dentro do roupeiro, Chaves!");
  console.log("  ("+"Chaves"+" pensa: "+"Achei! O envelope estava dentro do roupeiro!"+")");
  console.log("Seu Madruga: "+"Tomei um susto tão grande que até paguei!");
  console.log("Sr. Barriga: "+"Muito bem, Seu Madruga! Agora sim!");
  console.log("Chaves GRITA: "+"O dinheiro era seu, seu Madruga!");
  // Seu Madruga sai de cena.
  // Sr. Barriga sai de cena.
}
