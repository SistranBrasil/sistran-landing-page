import { chromium } from 'playwright';
const B='https://sistran-landing-page.vercel.app';
const GRAUS = [
 ['sistran-sobre-nos', -2], ['tecnologia-disruptiva', -3], ['servicos-diferenciais', -3],
 ['sistran-consultoria', -3], ['sistran-tecnologias', -2], ['nossa-trajetoria', -3],
 ['parceiros-e-implementacoes', -3], ['realizado-pela-sistran-labs', -3],
 ['sistran-match-ai', -5], ['sistran-smart-miner', -3], ['sistran-qa-integrado', -3],
 ['sistran-connect-api', -3], ['sistran-fast', -3], ['guru-de-seguros', -3],
 ['sistran-luminna-ai', -3], ['desafios-no-desenvolvimento', -3],
 ['luminna-ai-beneficios', -3], ['sistran-sds', -3],
];
const b = await chromium.launch();
const p = await b.newPage({ viewport:{width:1440,height:1000} });

async function entrar() {
  for (let i = 1; i <= 8; i++) {
    await p.goto(`${B}/admin/carimbo`, {waitUntil:'networkidle'});
    if (!/admin\/entrar/.test(p.url())) return true;
    await p.locator('input[type=password]').fill('eventos-local');
    await p.locator('button[type=submit]').click();
    await p.waitForTimeout(3000 + i*1000);
  }
  return false;
}
if (!await entrar()) throw new Error('não consegui entrar');
console.log('login ok\n');

let ok = 0, pendentes = [];
for (const [id, graus] of GRAUS) {
  await p.goto(`${B}/admin/carimbo?aba=criar&editar=${id}`, {waitUntil:'networkidle'});
  if (/admin\/entrar/.test(p.url())) { await entrar(); await p.goto(`${B}/admin/carimbo?aba=criar&editar=${id}`, {waitUntil:'networkidle'}); }
  await p.waitForTimeout(1300);
  const nome = await p.locator('#nome').inputValue().catch(()=> '');
  if (!nome) { console.log('ERRO não abriu em edição:', id); pendentes.push(id); continue; }
  const faixa = p.locator('#rotacao');
  await faixa.fill(String(graus));
  await p.waitForTimeout(900);
  const lido = await faixa.inputValue();
  await p.getByRole('button', {name:/Salvar alterações/}).click();
  await p.waitForTimeout(5000);
  const recado = (await p.locator('[aria-live=polite]').first().innerText()).trim();
  const bom = recado.includes('atualizado');
  if (bom) ok++; else pendentes.push(id);
  console.log(bom?'ok  ':'ERRO', nome.padEnd(30), lido+'°', '|', recado.slice(0,46));
}
console.log('\natualizados:', ok, 'de', GRAUS.length, pendentes.length?('pendentes: '+pendentes.join(', ')):'');
await b.close();
