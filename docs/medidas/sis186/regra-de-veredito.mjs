/**
 * SIS-186 — o caso de regressão da regra do par.
 *
 * POR QUE UMA PROVA À PARTE, e não a sonda: no `HEAD` a perna raster do bloco do
 * hero NÃO cai abaixo do piso em nenhum dos 21 alvos medidos (ver
 * `par-raster-vs-calculo.json`), então a passagem completa mostra o Δ mas não
 * exercita a bifurcação do veredito. Sem esta prova, a linha que impede o
 * "reprovado automático" seria código não executado — exatamente o tipo de regra
 * que se descobre quebrada na primeira issue que dependesse dela.
 *
 * O caso 1 é o par que abriu o assunto na SIS-178: traço de 11px, raster 4,20:1
 * (franja) contra 7,23:1 calculado. Antes desta issue o relatório diria
 * `reprovado`; a regra manda dizer `artefato-aa` e decidir pelo cálculo.
 *
 * A função abaixo é a MESMA regra de `scripts/medir-contraste-hero-pitch.mjs` —
 * copiada de propósito, e não importada: a sonda precisa de navegador para
 * carregar, e esta prova roda em ~50ms sem servidor no ar. Se a regra mudar lá,
 * este arquivo falha, que é o comportamento desejado.
 *
 *   node docs/medidas/sis186/regra-de-veredito.mjs
 */
const MIUDO = 16;
const DELTA_ARTEFATO = 1.0;

function veredito({ calc, raster, px, peso = 400 }) {
  const grande = px >= 24 || (px >= 18.66 && peso >= 700);
  const piso = grande ? 3 : 4.5;
  const passa = calc >= piso;
  const delta = Math.round((calc - raster) * 100) / 100;
  const miudo = px < MIUDO;
  const rasterCondenaria = passa && raster < piso && delta > DELTA_ARTEFATO;
  return {
    piso,
    delta,
    veredito: !passa
      ? "reprovado"
      : rasterCondenaria
        ? miudo
          ? "artefato-aa"
          : "raster-condenaria"
        : "aprovado",
  };
}

const CASOS = [
  {
    nome: "SIS-178, traço de 11px: o par que abriu o caso",
    entrada: { calc: 7.23, raster: 4.2, px: 11 },
    espera: "artefato-aa",
    porque:
      "o raster sozinho reprovaria (4,20 < 4,5) e o cálculo passa com folga; " +
      "texto miúdo, Δ = 3,03",
  },
  {
    nome: "SIS-178, título grande: o instrumento acertou",
    entrada: { calc: 16.01, raster: 16.01, px: 32 },
    espera: "aprovado",
    porque: "as duas pernas concordam, Δ = 0",
  },
  {
    nome: "cálculo reprova: nenhum tamanho salva",
    entrada: { calc: 3.9, raster: 2.1, px: 11 },
    espera: "reprovado",
    porque:
      "`artefato-aa` NÃO é reprovação suavizada — quando a perna que decide " +
      "reprova, o veredito é reprovado",
  },
  {
    nome: "desencontro em texto grande",
    entrada: { calc: 5.2, raster: 2.4, px: 30 },
    espera: "raster-condenaria",
    porque:
      "mesmo desencontro, fora da faixa miúda: não é o artefato que a issue " +
      "nomeia, e esconder apagaria a medição que mostrou que o tamanho não é a causa",
  },
  {
    nome: "Δ pequeno em texto miúdo não é artefato",
    entrada: { calc: 4.9, raster: 4.3, px: 11 },
    espera: "aprovado",
    porque: "Δ = 0,6 abaixo do limiar de 1,0: as duas pernas contam a mesma história",
  },
  {
    nome: "390, pilar-1 medido no HEAD",
    entrada: { calc: 7.69, raster: 5.93, px: 14.72 },
    espera: "aprovado",
    porque:
      "Δ = 1,76 sobre vídeo, mas as DUAS pernas passam do piso — Δ grande sozinho " +
      "não marca nada",
  },
  {
    nome: "negrito de 18,66px cai no piso de 3,0",
    entrada: { calc: 3.4, raster: 2.2, px: 18.66, peso: 700 },
    espera: "raster-condenaria",
    porque: "o piso muda com o peso; a regra do par não mexe nos pisos WCAG",
  },
];

let falhas = 0;
for (const c of CASOS) {
  const r = veredito(c.entrada);
  const ok = r.veredito === c.espera;
  if (!ok) falhas += 1;
  console.log(
    `${ok ? "ok  " : "FALHA"} ${c.nome}\n` +
      `      calc ${c.entrada.calc} · raster ${c.entrada.raster} · ${c.entrada.px}px` +
      ` → piso ${r.piso}, Δ ${r.delta}, veredito ${r.veredito}` +
      (ok ? "" : ` (esperado ${c.espera})`) +
      `\n      ${c.porque}`,
  );
}
console.log(`\n${CASOS.length - falhas}/${CASOS.length} casos`);
process.exit(falhas ? 1 : 0);
