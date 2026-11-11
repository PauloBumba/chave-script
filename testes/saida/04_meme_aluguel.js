// ChavScript -> JavaScript (Node.js)
// Gerado pelo tradutor ChavScript — projeto de Compiladores
"use strict";
const fs=require("fs");
const __linhas=fs.readFileSync(0,"utf8").split(/\r?\n/);
let __pos=0;
function __pergunta(msg){process.stdout.write(String(msg)+" ");return __linhas[__pos++]??"";}
function __lerNumero(msg){for(;;){const v=Number(__pergunta(msg));if(!Number.isNaN(v))return v;console.log("Erro: informe um número.");}}

// Conversa: Chaves e Seu Madruga
{
  let PROMESSAS = 0;
  let RESPOSTA = "";
  // Chaves entra em cena.
  // Seu Madruga entra em cena.
  console.log("Chaves: "+"Seu Madruga! O aluguel venceu ontem!");
  console.log("Seu Madruga: "+"Calma, Chaves... eu prometo pagar.");
  console.log("  ("+"Chaves"+" pensa: "+"Essa promessa ele faz desde 1971..."+")");
  PROMESSAS = __lerNumero(""+"Quantas promessas o senhor já prometeu pagar?");
  if(PROMESSAS > 10){
    console.log("Chaves GRITA: "+"Mais de dez promessas! E o senhor acha que eu esqueci?");
    console.log("Seu Madruga: "+"São só nove! Nove promessas, Chaves!");
  }else{
    console.log("Chaves: "+"Pior ainda: o senhor nunca pagou de verdade!");
    console.log("Seu Madruga: "+"Isso é uma maledicência!");
  }
  RESPOSTA = __pergunta(""+"E o senhor, Chaves, nunca comeu do meu lanche?");
  console.log("Chaves: "+"Comeu sim! Mas o lanche era seu, o problema é o aluguel!");
  console.log("Seu Madruga GRITA: "+"Então dessa vez eu pago! Pode acreditar!");
  console.log("  ("+"Chaves"+" pensa: "+"Ele diz isso toda semana..."+")");
  console.log("Chaves: "+"Certo. Mas se não pagar até sexta, eu conto pro Don Ramón!");
  console.log("Seu Madruga: "+"Não! Qualquer coisa menos isso!");
  console.log("Chaves GRITA: "+"Sexta-feira, então. Sem falta!");
  // Chaves sai de cena.
  // Seu Madruga sai de cena.
}
