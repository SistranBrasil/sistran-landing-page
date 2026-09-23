/* Sonda do erro «Encountered a script tag while rendering React component»
   apontado em `src/app/layout.tsx:322`.

   O que precisa ser separado, porque muda a conclusão inteira:

   • Se o aviso sai numa CARGA LIMPA (primeiro acesso, sem Fast Refresh), então a
     hidratação está recriando o `<script>` e o script de `data-motion` não roda
     antes do paint — é defeito de produção.
   • Se ele só sai DEPOIS de um Fast Refresh (editar o layout ou um módulo que ele
     importa), é re-render de cliente do `RootLayout` em desenvolvimento: o
     `<script>` é reconstruído por React, nunca executado de novo, e o HTML
     servido continua com o script na primeira posição do `<body>`.

   Então a sonda lê as duas situações e, na carga limpa, confirma o que de fato
   importa: `data-motion` gravado em `<html>` e nenhum aviso de hidratação. */
import { chromium } from 'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/361ceb562f3b3235/node_modules/playwright/index.mjs';

const EXEC =
  process.env.LOCALAPPDATA +
  '/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe';
const BASE = 'http://localhost:3000';

const navegador = await chromium.launch({ executablePath: EXEC });
const ctx = await navegador.newContext({ viewport: { width: 1440, height: 900 } });
const p = await ctx.newPage();

const mensagens = [];
p.on('console', (m) => {
  if (m.type() === 'error' || m.type() === 'warning') mensagens.push(m.text().slice(0, 200));
});
p.on('pageerror', (e) => mensagens.push('pageerror: ' + e.message.slice(0, 200)));

await p.goto(BASE + '/', { waitUntil: 'networkidle' });
await p.waitForTimeout(2500);

const saida = {
  /* O `<script>` continua sendo o primeiro elemento do `<body>` no DOM vivo?
     (o `<div hidden>` de Suspense vem antes, e isso é esperado) */
  primeirosFilhosDoBody: await p.evaluate(() =>
    [...document.body.children].slice(0, 3).map((n) => n.tagName.toLowerCase()),
  ),
  dataMotion: await p.evaluate(() => document.documentElement.getAttribute('data-motion')),
  avisos: mensagens,
};

/* Segunda metade: provoca o Fast Refresh com a página aberta. É o único jeito de
   fazer o `RootLayout` ser renderizado NO CLIENTE — e é aí que o React reconstrói
   o `<script>` e imprime o aviso. A edição é uma linha em branco no fim do
   arquivo, devolvida em seguida. */
const { readFileSync, writeFileSync } = await import('node:fs');
const ALVO = 'src/app/layout.tsx';
const original = readFileSync(ALVO, 'utf8');
const antes = mensagens.length;
try {
  writeFileSync(ALVO, original + '\n');
  await p.waitForTimeout(4000);
} finally {
  writeFileSync(ALVO, original);
  await p.waitForTimeout(3000);
}
saida.avisosDepoisDoFastRefresh = mensagens.slice(antes);

/* Terceira leitura: navegação de CLIENTE para rotas, incluindo a rota morta que a
   SIS-279 apagou. Um 404 alcançado por `router.push` é o caso em que o App Router
   monta a árvore de erro no cliente — candidato natural a renderizar o
   `RootLayout` fora da hidratação. */
saida.navegacaoDeCliente = {};
for (const rota of ['/solucoes', '/transformacao-legado', '/']) {
  const marca = mensagens.length;
  await p.evaluate((r) => {
    const a = document.createElement('a');
    a.href = r;
    document.body.appendChild(a);
    a.click();
  }, rota);
  await p.waitForTimeout(3500);
  saida.navegacaoDeCliente[rota] = { url: p.url(), avisos: mensagens.slice(marca) };
}

await ctx.close();
await navegador.close();
console.log(JSON.stringify(saida, null, 2));
