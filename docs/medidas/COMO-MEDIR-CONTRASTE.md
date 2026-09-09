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
