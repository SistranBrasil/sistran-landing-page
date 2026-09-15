/**
 * SIS-245 — seção "Onde Estamos" de /contato, uma foto por unidade.
 *
 * As três fotos são o critério de aceite da issue: Pato Branco com o endereço da
 * Tamôio e o mapa apontando para lá, o Rio sem o link de rota, São Paulo
 * inalterado no essencial — e, nas três, o azul do mapa mais claro com o toque de
 * branco nos rótulos.
 *
 * Só 1440: o que a issue pede é conteúdo do painel e cor do mapa, e nenhum dos
 * dois muda de decisão por largura. Cada clique espera de propósito: o mapa
 * desliza a câmera (`flyTo`) e os tiles do zoom novo ainda precisam chegar —
 * fotografar antes disso retrataria o enquadramento antigo.
 *
 * Uso: URL_BASE=http://localhost:3999 node scripts/capturar-onde-estamos-sis245.mjs
 */
import { chromium } from 'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';
import { mkdir } from 'node:fs/promises';

const URL_BASE = process.env.URL_BASE ?? 'http://localhost:3000';
const PASTA = 'docs/capturas';
await mkdir(PASTA, { recursive: true });

const navegador = await chromium.launch();
const contexto = await navegador.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
});
const pagina = await contexto.newPage();
await pagina.goto(`${URL_BASE}/contato`, { waitUntil: 'domcontentloaded', timeout: 180_000 });
await pagina.waitForSelector('#onde-estamos', { timeout: 180_000 });
await pagina.addStyleTag({
  content: `nextjs-portal,[data-nextjs-toast],[data-nextjs-dev-tools-button]{display:none!important}`,
});

/* Diálogo de preferências de movimento: aceitar o padrão (movimento normal) é o
   estado que a issue quer ver. */
const continuar = pagina.getByRole('button', { name: 'Continuar' });
if (await continuar.count()) {
  await continuar.first().click();
  await pagina.waitForTimeout(600);
}

const topo = await pagina.evaluate(
  () => document.querySelector('#onde-estamos').getBoundingClientRect().top + window.scrollY,
);
await pagina.evaluate((y) => window.scrollTo(0, y), Math.max(0, topo - 60));
/* Espera longa na primeira: o mapa só começa a carregar quando a seção aparece
   (IntersectionObserver), e são tiles de rede. */
await pagina.waitForTimeout(6000);

/* O diálogo de movimento pode nascer DEPOIS da primeira tentativa de fechá-lo
   (ele espera a hidratação). Segunda tentativa aqui, já com a seção na tela:
   sem ela o cartão cobre o meio do mapa em todas as fotos. */
if (await continuar.count()) {
  await continuar.first().click();
  await pagina.waitForTimeout(800);
}

for (const nome of ['São Paulo', 'Pato Branco', 'Rio de Janeiro']) {
  const botao = pagina.getByRole('button', { name: new RegExp(nome) });
  await botao.first().click();
  /* 9s, e não 4,5: com 4,5 a foto de Pato Branco saiu com o mapa em branco numa
     das rodadas — o zoom 16 novo pede um lote inteiro de tiles que o zoom 12
     antigo não tinha em cache, e o `flyTo` termina antes deles chegarem. */
  await pagina.waitForTimeout(9000);
  const arquivo = nome.split(' ').pop().toLowerCase();
  await pagina.screenshot({ path: `${PASTA}/sis245-${arquivo}-1440.png` });

  /* Número, e não só foto: se o link de rota existe para esta unidade. É o item
     2 da issue medido, em vez de conferido a olho na imagem. */
  const rota = await pagina.getByRole('link', { name: /Ver no Google Maps/ }).count();
  const endereco = await pagina.evaluate(() => {
    /* O `id` desta seção mora no `<h2>`, não na `<section>` (é o padrão do
       ScrollSpy registrado em `pageSections.ts`), então a busca sobe para a seção
       antes de procurar os parágrafos. */
    const secao = document.querySelector('#onde-estamos')?.closest('section') ?? document.body;
    return Array.from(secao.querySelectorAll('p'))
      .map((e) => e.textContent.trim())
      .filter((t) => /R\.|Endereço não divulgado/.test(t))
      .join(' | ');
  });
  console.log(`${nome}: links de rota=${rota} · painel="${endereco}"`);
}

await contexto.close();
await navegador.close();
