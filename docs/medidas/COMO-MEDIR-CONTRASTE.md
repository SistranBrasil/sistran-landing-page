# Como medir contraste neste projeto

Registro de método, escrito porque as três armadilhas abaixo já produziram **número
errado aceito como verdade** em issues deste repositório. Todas as três dão falso
resultado silenciosamente: a sonda roda, devolve um número plausível, e ninguém
tem como desconfiar dele depois. Por isso a regra final não é só "meça certo" —
é **escrever junto de cada número de onde ele foi lido**.

## 1. Não meça tinta nenhuma — nem a própria, nem a do vizinho

Para ler o fundo atrás de um texto, capture o retângulo do próprio elemento com a
tinta oculta. O erro óbvio é esquecer de ocultar e medir a cor do texto contra ela
mesma (razão ~1,0).

O erro **não** óbvio, e que custou uma rodada na SIS-137: ocultar somente o
elemento medido deixa o **irmão** renderizado dentro do mesmo retângulo. Um
`<span>` de destaque dentro de uma manchete branca tem, na sua própria caixa, os
pixels antisserrados das letras brancas ao lado. A sonda devolveu **1,01 e FALHA**
com fundo `224,230,235` — que não era o fundo, era a manchete.

```js
// ERRADO: esconde só o span; a tinta branca do resto do h1 continua na caixa dele
await span.evaluate((e) => (e.style.visibility = 'hidden'));

// CERTO: esconde o bloco de texto INTEIRO, mede o retângulo do span
await h1.evaluate((e) => (e.style.visibility = 'hidden'));
const buf = await page.screenshot({ clip: caixaDoSpan });
```

Vale para toda manchete com destaque colorido — `/esg`, `/contato`,
`#timeSISTRAN`, `/trabalhe-conosco` — e para qualquer rótulo dentro de parágrafo.

## 2. Componha o alfa antes de calcular

`text-white/85` não é branco. A cor efetiva é `fg × α + fundo × (1 − α)`, e ela
depende do fundo — então não há como pré-calcular. Medir a cor **declarada**
produz falso APROVADO, que é o pior dos dois erros porque nada chama atenção.

Na SIS-137 a descrição deu 5,16:1 contra branco puro e 3,93:1 composta: reprovada
no piso de 4,5:1 que texto normal de 20px exige. A diferença entre entregar e não
entregar era só isto.

```js
const comp = (fg, a, bg) => fg.map((c, i) => Math.round(c * a + bg[i] * (1 - a)));
```

## 3. O piso é o pior pixel, não a média

Sobre vídeo ou fotografia o fundo varia dentro do próprio retângulo. `YAVG` do
`ffprobe` é média de quadro e não decide nada: na SIS-137 a média de 68,9 parecia
folgada enquanto `YMAX` batia em 255. Percorra **todos** os pixels do recorte e
guarde o menor resultado.

O mesmo vício aparece fora de contraste: na SIS-135 um painel foi medido no caso
mais alto dos dados de hoje (só São Paulo tem `address` em `contact.ts`) e a
margem sobrando foi reportada como se fosse o caso apertado.

## 4. `clip` do Playwright é relativo à janela

`page.screenshot({ clip })` usa coordenadas de viewport, não de documento. Role
até o elemento antes de capturar, e esconda o aviso do `next dev`
(`[class*=motion-banner], [class*=motion-dialog]`), que sobrepõe a abertura.

Prefira `locator.screenshot()` ao `clip`: a caixa que a sonda calculou pode ficar
fora da janela e o Playwright falha com "Clipped area is either empty or outside
the resulting image" — aconteceu na SIS-138.

## 5. O cabeçalho fixo entra no recorte e polui o pior pixel

`header.fixed` acompanha a rolagem e cobre o topo do que você mandou capturar,
com o azul dele. Numa varredura de pior pixel esse azul é o vencedor, e o número
que sai não é do elemento medido. Esconda o cabeçalho junto com os avisos do
`next dev`:

```js
header.fixed { display: none !important; }
```

Apague a tinta com `color: transparent` + `webkitTextFillColor: transparent`,
nunca com `visibility: hidden` — o segundo tira o elemento do fluxo e muda o
layout que você está medindo.

## 6. Medir antes da entrada assentar dá número fantasma

`motion` escreve `transform` e `opacity` em linha durante a entrada. Capturar no
meio disso lê pixels que não existirão: na SIS-142 o `h2` do CTA mediu **1,23:1**
contra um fundo quase branco que, depois de assentado, não estava lá — a varredura
seguinte não achou **um** pixel claro. Na SIS-138 o mesmo vício deu duas bases
desalinhadas (588 vs 604) onde o valor assentado é 570 nas duas.

Método: role, espere ~3,5s, e tome o **mínimo entre seis quadros**. Um
`Buffer.equals` entre dois quadros consecutivos denuncia quadro instável — se
diferem, ainda está animando.

## 7. O pior pixel pega franja de antialiasing, e o número mente para baixo

Os itens 1 a 6 evitam **falso reprovado por recorte errado**. Este é diferente: o
recorte está certo, a tinta está certa, e o número ainda sai baixo — porque o pior
pixel de um recorte de texto costuma ser **franja de antialiasing**, tinta parcial
na borda do glifo, e não a cor da letra.

Caso que abriu o assunto (SIS-178): traço de ~11px devolveu **4,20:1** onde o
cálculo sobre as cores declaradas dá **7,23:1**; o mesmo instrumento no título deu
**16,01:1** e fechou. O risco não é estético: reprovar o que passa empurra
escurecimento permanente de texto que já é legível.

### A regra do par

Para **todo** alvo de texto, reporte **dois** números, e diga qual decide:

| Perna | Como | Papel |
|---|---|---|
| **raster** | pior pixel do recorte, franja inclusa | fica à vista; **não** condena sozinho |
| **calculada** | tinta efetiva (com alfa) × fundo **amostrado** do mesmo recorte com a tinta apagada | é o veredito |

E o **Δ** entre as duas. Δ > **1,0** (folga acima de meio degrau de piso) é
assinatura de franja; abaixo disso os dois números contam a mesma história.

O fundo da perna calculada é **sempre amostrado do raster com a tinta apagada** —
nunca presumido do CSS (item 1 continua valendo).

Abaixo de **16px** o pior pixel sozinho **não** é veredito: exige o par. 16px é o
degrau da tabela de pisos abaixo, onde nenhum peso salva do 4,5:1.

### O que a medição contradisse: o tamanho não é a causa

A SIS-186 mediu os sete alvos do bloco do hero em duas larguras e o discriminador
**não** foi o corpo do texto:

* **1024 e 1440, coluna branca chapada** — as duas pernas deram **iguais** nos
  catorze alvos, de 14,72px a 41,76px. Δ = 0 (só o apoio de 16,8px em 1024 deu
  0,17), inclusive no texto miúdo.
* **390, vídeo por baixo** — Δ apareceu em **todos** os tamanhos: título de
  30,4px com 11,34 calculada contra 6,42 raster (Δ 4,92), e os pilares de 14,72px
  entre Δ 0 e Δ 2,63.

Evidência: `docs/medidas/sis186/par-raster-vs-calculo.json` (21 alvos, três
larguras). A regra do veredito tem prova própria em
`docs/medidas/sis186/regra-de-veredito.mjs` — sete casos, incluindo o par 4,20 vs
7,23 da SIS-178, que passa a sair como `artefato-aa` em vez de `reprovado`. Ela
existe porque no `HEAD` a perna raster não cai abaixo do piso em nenhum alvo: sem a
prova, a linha que impede o reprovado automático seria código nunca executado.

Ou seja: quem produz o desencontro é **fundo variável** (foto, vídeo, degradê), não
o tamanho da letra. O corte de 16px continua no relatório porque é o gatilho que a
SIS-186 prescreveu e porque casa com os pisos, mas quem discrimina de fato é a
**cobertura** do pixel — quanto da área dele a letra ocupa. Em fundo chapado a
franja é inofensiva (o fundo por baixo dela é o mesmo do resto); em vídeo a franja
cai sobre o trecho mais claro da imagem e é ela quem vence a varredura.

Implementação de referência: `scripts/medir-contraste-hero-pitch.mjs`. Ele obtém a
máscara da letra por **diferença entre duas abas** (uma com tinta, outra apagada) e
dá a cobertura de cada pixel, `|A − B| / |tinta − B|`. Decide por `piorCorpo`
(cobertura ≥ 0,85) e publica `piorTudo`, `delta`, `miudo` e `veredito`.

### Dois consertos que parecem óbvios e estão errados

**Não suavize o raster** — descartar os N% mais escuros, aplicar blur, medir a
média. Isso esconde contraste ruim de verdade em foto e vídeo, que é exatamente o
caso em que o pior pixel é o único instrumento honesto. O caminho é o par + regra
de veredito, nunca um filtro no raster.

**Não use a cor que o compositor pintou como perna raster.** Foi medido na SIS-186
e é **degenerado**: a máscara inclui pixels de cobertura 0,02–0,04, que são fundo
com um sopro de tinta, e ali a razão contra o próprio fundo tende a 1. O pior de
todos saturou em **1,00** nos sete alvos em 390 e em **1,04** nos sete em 1024 — o
mesmo valor para 14,72px e para 32px, isto é, zero poder de discriminação. A perna
raster é o **pior pixel do recorte com a franja dentro**, calculado da tinta
declarada; é o veredito clássico, e é ele que vai ao lado.

### Onde o artefato não se aplica

Sonda que mede **só o fundo** — apaga a tinta, varre o retângulo e compara a cor
declarada contra o pior pixel de fundo — não tem franja no recorte, porque não há
glifo nenhum pintado ali. É o caso de `scripts/medir-contraste-escritorios.mjs` e
de `scripts/medir-cena-eventos.mjs`. Nelas o par não faz sentido, e "corrigir" o
pior pixel seria remover a única proteção que elas têm. O que ainda vale nas duas é
o item 1 (fundo alheio dentro da caixa) e o recuo dos cantos arredondados.

## Pisos

| Texto | Piso AA |
|---|---|
| ≥ 24px, ou ≥ 18,66px em negrito | 3,0:1 |
| todo o resto | 4,5:1 |
| borda de campo, controle de interface (1.4.11) | 3,0:1 |

## A regra que engloba as outras

**Escreva ao lado de cada número onde a sonda leu** — qual retângulo, o que estava
oculto, e a cor do pior pixel. Um número sem proveniência é indistinguível de um
número errado, e os três erros acima passariam por qualquer revisão que só olhasse
o valor. É também o que permitiu descobrir o artefato do item 1: o `1,01` com
fundo `224,230,235` denuncia a si mesmo quando o fundo vem escrito junto.
