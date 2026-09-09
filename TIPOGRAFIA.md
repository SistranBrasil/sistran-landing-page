# Tipografia — proposta importada do projeto `apresentação/site`

Documento de referência para alinhar a tipografia deste site (`sistran-landing-page`)
com a proposta usada na apresentação da Transformação de Legado
(`C:\Users\maria.martinelli\inovacao_landing_page\apresentação\site`).

> ## ✅ ADOTADO — 03/09/2026
>
> **Este documento deixou de ser proposta.** Os seis passos da §4 foram
> executados e verificados; as seções 1–4 e 6 seguem valendo como a
> **justificativa** de cada decisão, e a §5 virou registro do que foi conferido.
>
> O que o plano NÃO previa e foi feito junto, porque a adoção não fechava sem
> isso (números medidos no código, não estimados):
>
> - **11 referências órfãs a `--font-display`**, não 9 — o levantamento da §2
>   estava desatualizado. Todas resolvem hoje para a serifa.
> - **73 pesos removidos no JSX**, o caso dominante que a §4/passo 5 não
>   enxergava: quase todo `font-display` vinha acompanhado de
>   `font-bold`/`font-black` na mesma classe. Só um ponto do projeto já estava
>   limpo (`EventsGrid.tsx:190`). Não dava para resolver com uma regra em
>   `.font-display`: um `font-weight` ali tem a mesma especificidade de
>   `.font-bold` e **perde**, porque as utilitárias de peso do Tailwind vêm
>   depois das de família. Daí a remoção ter sido feita nas classes, não abafada
>   com `!important`.
> - **15 pesos removidos no CSS** (13 na primeira passada, mais dois achados na
>   verificação: `.solution-info-titulo` do modo dirigido, que sobrescrevia 750
>   de volta dentro de uma `@media`, e `.evento-ordem`, que **herdava** a serifa
>   do `.evento-titulo` e pedia 700 em cima dela — esse virou
>   `var(--font-interface)`, porque "01" a 0.8rem com 0.22em de tracking é
>   rótulo de interface, não texto editorial).
> - **As declarações por rota saíram.** A serifa era importada de novo em
>   `src/app/page.tsx` e em `src/app/transformacao-legado/page.tsx` como
>   `--font-legacy-serif`, e `legacy.css` redefinia `--font-editorial` /
>   `--font-interface` localmente. Com o token no `:root`, manter as duas
>   fontes de verdade faria a local ganhar por vir depois.
> - **O itálico entrou na declaração** (`style: ['normal', 'italic']`): a home e
>   `/transformacao-legado` já o usavam quando a serifa era por rota, e
>   centralizá-la sem o itálico teria sintetizado a inclinação.

---

## 1. A proposta em uma frase

**Par editorial + interface**: um serif de display com contraste alto para
títulos (`Instrument Serif`) e um sans neutro para todo o resto (`Inter`).

| Papel | Fonte | Peso | Onde aparece |
|---|---|---|---|
| Editorial / display | **Instrument Serif** | 400 (único) | Títulos de hero, títulos de seção, números grandes, citações |
| Interface | **Inter** | variável (100–900) | Corpo, botões, chips, labels, navegação, tabelas |

As duas são **Google Fonts**, carregadas via `next/font/google` — sem arquivo
de fonte no repositório, sem `@font-face`, sem request para o domínio do Google
em runtime (o `next/font` faz self-host no build).

### Por que essas duas

- **Instrument Serif** só tem peso 400. Isso é a característica, não limitação:
  o display nunca fica "negrito", ele fica **grande**. A hierarquia vem de
  tamanho e `letter-spacing` negativo, não de peso.
- **Inter** já é a fonte de interface deste projeto. Nada muda no corpo do texto.

### O que muda de verdade

Este projeto hoje usa **Inter (corpo) + Sora (display)**. A proposta troca
**apenas o display**: `Sora` → `Instrument Serif`. Sai um sans geométrico,
entra um serif editorial. O corpo continua Inter.

---

## 2. Como está hoje neste projeto

`src/app/layout.tsx:2,135-136,188`

```tsx
import { Inter, Sora } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const sora  = Sora({  subsets: ['latin'], variable: '--font-sora',  display: 'swap' });

<html lang="pt-BR" className={`${inter.variable} ${sora.variable}`}>
```

`tailwind.config.ts` → `theme.extend.fontFamily`:

```ts
sans:    ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
display: ['var(--font-sora)', 'var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
```

Consumo: classe `font-display` em ~29 arquivos de `src/`, mais referências
diretas em CSS (`src/app/globals.css`, `src/components/legacy/legacy.css`,
`src/components/partners-timeline.css`).

> ⚠️ **Bug pré-existente encontrado ao levantar isto — CORRIGIDO na adoção.**
> Eram **11** referências, não 9 (o levantamento abaixo ficou desatualizado).
> Hoje `--font-display` é definida no `:root` do `globals.css` como alias de
> `--font-editorial`, e os 11 pontos renderizam a serifa. O texto original
> segue aqui porque explica por que o sintoma era invisível.
>
> O CSS referencia
> `var(--font-display)` em 9 lugares (`globals.css:1472, 2790, 4785, 8346,
> 8369, 8991, 9202, 9310, 9345`), mas **`--font-display` nunca é definida** —
> `layout.tsx` só declara `--font-inter` e `--font-sora`. Resultado atual:
> as 7 ocorrências com fallback (`var(--font-display, inherit)`) herdam a fonte
> do pai, e as 2 sem fallback (`2790`, `4785`) caem direto em `system-ui`.
> Ou seja: **parte do site que deveria estar em display já não está.**
> Definir `--font-display` faz parte da adoção (§4, passo 3).

---

## 3. Como está no projeto `apresentação/site`

### Declaração — `app/layout.tsx`

```tsx
import { Instrument_Serif, Inter } from "next/font/google"

const serif = Instrument_Serif({
  weight: "400",          // obrigatório: a fonte não é variável
  subsets: ["latin"],
  display: "swap",
  variable: "--font-serif",
})

const sans = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
})

<html lang="pt-BR" className={`${serif.variable} ${sans.variable}`}>
```

### Tokens semânticos — `app/styles/tokens.css`

Uma camada de indireção: o CSS nunca usa `--font-serif` direto, usa o **papel**.

```css
:root {
  --font-editorial: var(--font-serif), Georgia, "Times New Roman", serif;
  --font-interface: var(--font-sans), Inter, Manrope, system-ui, sans-serif;
}
```

### Base — `app/styles/base.css`

```css
body {
  font-family: var(--font-interface);
  font-size: 1rem;
  line-height: 1.55;
}
```

### Classes de papel — `app/styles/base.css`

Este é o coração da proposta. Em vez de escolher tamanho caso a caso, existem
três degraus fechados de display:

```css
.display {
  margin: 0;
  font-family: var(--font-editorial);
  font-weight: 400;
  letter-spacing: -0.04em;   /* serif grande precisa fechar */
  line-height: 0.92;         /* < 1: títulos grandes respiram demais */
  text-wrap: balance;
}

.display--xl { font-size: clamp(2.9rem, 7.5vw, 7.5rem); }
.display--lg { font-size: clamp(2.4rem, 5.5vw, 5rem); }
.display--md { font-size: clamp(1.8rem, 3vw, 2.6rem); line-height: 1; }

.lead {
  max-width: 46ch;
  margin: 1.6rem 0 0;
  font-size: clamp(1.05rem, 1.4vw, 1.3rem);
  line-height: 1.5;
  color: color-mix(in srgb, currentColor 78%, transparent);
}

.eyebrow {
  margin: 0 0 1rem;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.numeric { font-variant-numeric: tabular-nums; }
```

Regras implícitas que valem copiar:

- **`line-height` cai conforme o corpo sobe** — `0.92` no xl/lg, `1` no md,
  `1.5` no `.lead`, `1.55` no body.
- **`letter-spacing` negativo só no display** (`-0.04em`); no `.eyebrow` é
  positivo e forte (`+0.16em`), porque caixa-alta pequena precisa abrir.
- **`text-wrap: balance`** em todo display — evita a última linha órfã.
- **`--font-interface` é reafirmada explicitamente** em alguns pontos
  (`sections.css:117, 348`) quando o elemento está dentro de um bloco
  editorial e precisa voltar ao sans.
- **Números sempre `tabular-nums`** — em odômetros e métricas, dígitos de
  largura variável fazem o valor "tremer" ao animar.

---

## 4. O que precisa para adotar aqui

### Passo 1 — trocar a importação em `src/app/layout.tsx`

```diff
-import { Inter, Sora } from 'next/font/google';
+import { Instrument_Serif, Inter } from 'next/font/google';

 const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
-const sora = Sora({ subsets: ['latin'], variable: '--font-sora', display: 'swap' });
+const serif = Instrument_Serif({
+  weight: '400',
+  subsets: ['latin'],
+  variable: '--font-serif',
+  display: 'swap',
+});
```

```diff
-<html lang="pt-BR" className={`${inter.variable} ${sora.variable}`}>
+<html lang="pt-BR" className={`${inter.variable} ${serif.variable}`}>
```

> `weight: '400'` **não é opcional**. `Instrument Serif` não é variável;
> omitir o peso quebra o build do `next/font` com
> `Missing weight for font Instrument_Serif`.

### Passo 2 — apontar `font-display` do Tailwind para o serif

`tailwind.config.ts`:

```diff
 fontFamily: {
   sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
-  display: ['var(--font-sora)', 'var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
+  display: ['var(--font-serif)', 'Georgia', '"Times New Roman"', 'serif'],
 },
```

Com isso as ~29 telas que já usam `font-display` migram sem tocar em JSX.

> **Atenção ao fallback.** Trocar o fallback de `sans-serif` para `serif` é
> deliberado: se a fonte falhar, um serif de sistema mantém a intenção; o Inter
> como fallback de display faria o título parecer corpo aumentado.

### Passo 3 — definir os tokens semânticos e corrigir `--font-display`

Em `src/app/globals.css`, no `:root`:

```css
:root {
  /* Papéis tipográficos — o CSS consome estes, não as variáveis do next/font */
  --font-editorial: var(--font-serif), Georgia, "Times New Roman", serif;
  --font-interface: var(--font-inter), Inter, system-ui, sans-serif;

  /* Alias de compatibilidade: 9 pontos do CSS já referenciam --font-display,
     que nunca foi definida (ver aviso na §2). */
  --font-display: var(--font-editorial);
}
```

Isso resolve de uma vez as 9 referências órfãs **e** dá o vocabulário
(`--font-editorial` / `--font-interface`) que o `apresentação/site` usa.

### Passo 4 — substituir as referências diretas a `--font-sora`

Quatro pontos passam a apontar para o papel em vez da fonte concreta:

| Arquivo | Linha |
|---|---|
| `src/app/globals.css` | 2040 |
| `src/app/globals.css` | 5582 |
| `src/components/legacy/legacy.css` | 2735 |

```diff
-  font-family: var(--font-sora), system-ui, sans-serif;
+  font-family: var(--font-editorial);
```

`src/components/legacy/legacy.css:52` já define `--font-interface` localmente —
remover essa linha depois que o token global existir, para não haver duas
fontes de verdade.

`src/components/partners-timeline.css:20` usa `var(--font-inter)` direto;
trocar por `var(--font-interface)` é opcional (mesmo resultado), só consistência.

### Passo 5 — reconciliar a escala de display

Aqui está a única decisão real de design. Este projeto tem uma escala **muito
mais desenvolvida** que a da apresentação: `tailwind.config.ts` define
`hero`, `section`, `pagehero`, `pagehero-medio`, `pagehero-longo` — cinco
degraus, com comentário explicando que os três de `pagehero` existem porque os
títulos das 14 rotas variam de 9 a 118 caracteres (ver `escalaDoTitulo` em
`PageHero.tsx`).

**Recomendação: manter a escala daqui, só ajustar as métricas para serif.**
Os cinco degraus foram calibrados contra conteúdo real; jogá-los fora em favor
dos três da apresentação é regressão. O que precisa mudar é o entorno de cada
degrau, porque serif 400 em corpo grande se comporta diferente de sans 700:

```diff
 fontSize: {
-  hero:    ['clamp(2.8rem, 7vw, 5.8rem)',   { lineHeight: '0.98', letterSpacing: '-0.02em' }],
-  section: ['clamp(2.2rem, 4.6vw, 4.1rem)', { lineHeight: '1.04', letterSpacing: '-0.03em' }],
+  hero:    ['clamp(2.8rem, 7vw, 5.8rem)',   { lineHeight: '0.92', letterSpacing: '-0.04em' }],
+  section: ['clamp(2.2rem, 4.6vw, 4.1rem)', { lineHeight: '0.96', letterSpacing: '-0.04em' }],
 },
```

E **remover `font-weight: 700/800/900`** de onde o display é aplicado —
`Instrument Serif` não tem esses pesos, e o navegador vai sintetizar um negrito
falso (engrossamento artificial que borra as serifas). Pontos afetados em
`src/app/globals.css`: linhas `413`, `419`, `1467`, `1473`, `1785`.

```diff
-  font-weight: 700;
+  font-weight: 400;
```

> `globals.css:1473` usa `font-weight: 900` junto de
> `font-family: var(--font-display, inherit)` — é o caso mais visível de
> negrito sintético depois da troca.

### Passo 6 — `font-feature-settings`

`src/app/globals.css:92` traz:

```css
font-feature-settings: "cv11", "ss01";
```

`cv11` e `ss01` são *stylistic sets* do **Inter** (alternativas de `l`/`1` e de
`a`/`g`). Continuam válidos no body, mas **não devem herdar para o display** —
`Instrument Serif` não tem esses sets, e alguns motores desativam ligaturas
padrão ao receber feature desconhecida. Adicionar ao `.display` / `font-display`:

```css
font-feature-settings: normal;
```

---

## 5. Verificação — o que foi conferido, e como

- [x] **Build passa.** `npx next build` → compilou em 11.3s, 27/27 páginas
      estáticas, sem `Missing weight for font Instrument_Serif`.
      `npx tsc --noEmit` limpo; `npx eslint src --ext .ts,.tsx` em 19 avisos e 0
      erros, que é o baseline de antes da mudança. (Neste projeto **não existe**
      `npx next lint`.)
- [x] **Nenhum `var(--font-sora)` restante.** `grep -rn "font-sora\|Sora" src/
      tailwind.config.ts` devolve 3 linhas, todas **comentário** explicando a
      troca. Zero consumo.
- [x] **`--font-display` resolve para a serifa**, não para `inherit`/`system-ui`.
- [x] **Nenhum display com peso > 400, em nenhuma rota.** Verificado por medição,
      não a olho: um probe de Playwright varre `document.querySelectorAll('*')`
      nas **13 rotas**, rolando cada página inteira de 900 em 900px para forçar a
      montagem do conteúdo preso ao scroll, e reprova qualquer nó cujo
      `fontFamily` computado contenha `Instrument Serif` com
      `fontWeight > 400`. Foi essa varredura que achou os dois pesos que a
      inspeção estática deixou passar (`.solution-info-titulo` dentro de
      `@media`, e `.evento-ordem` por herança). Resultado final: `TODAS_400`.
- [x] **Os degraus de `PageHero` conferidos**, com métricas computadas em vez de
      impressão visual:

      | Rota | Degrau | `font-size` | `line-height` | `letter-spacing` | Linhas | Largura |
      |---|---|---|---|---|---|---|
      | `/quem-somos` | `pagehero` | 89.6px | 86.016px | -2.24px | 1 | 47% |
      | `/solucoes` | `pagehero-longo` | 51.2px | 55.296px | -1.28px | 3 | 56% |
      | `/esg` | `pagehero-longo` | 51.2px | — | — | 2 | — |
      | `/contato` | `pagehero-medio` | 70.4px | — | — | 1 | 1 linha |
      | `/solucoes` @1366 | `pagehero-longo` | 49.176px | — | — | 3 | 76% |
      | `/solucoes` @390 | `pagehero-longo` | 32px | — | — | 5 | 90% |

      `/solucoes` é o pior caso (118 caracteres) e fecha em 3 linhas a 1920 e a
      1366, 5 linhas a 390, sem transbordar e sem órfã — a última linha é
      "Seguradora." nos três casos.
- [x] **O hero da home não entra na conta, e isso é intencional.** O `text-hero`
      não tem consumo visível ali: `HeroCinematic.tsx:211` traz só
      `<h1 className="sr-only">`, porque "a escrita do hero saiu de cena a
      pedido — o video passou a ser o conteudo". Medir o `h1` da home devolve
      Inter/16px e **não** é regressão; é o título de acessibilidade/SEO. Quem
      exercita o degrau `hero` são as outras rotas.
- [x] **As duas rotas que perderam a fonte local continuam com a serifa**, agora
      pelo token global: `/transformacao-legado` (`Instrument Serif` 400) e a
      home, no mosaico e na montagem (`Instrument Serif` 400).
- [x] **`text-wrap: balance`** segue nos títulos (16 pontos em `src/`).
- [x] **`tabular-nums`** nos números e odômetros (36 pontos em `src/`).
- [x] **`display: 'swap'`** nas duas fontes (`layout.tsx:135` e `:153`).
- [x] **`prefers-reduced-motion`** revisado: nenhuma animação foi adicionada, e o
      único ponto que muda de cara é o título do diálogo de preferências de
      movimento, que renderiza a serifa a 400 corretamente.

---

## 6. Pitfalls

- **`Instrument Serif` só tem 400 e itálico 400.** Qualquer `font-weight`
  diferente é sintetizado pelo navegador. Hierarquia vem de tamanho.
- **Serif grande precisa de `letter-spacing` negativo e `line-height` < 1.**
  Sem isso, o título parece solto e "desmontado" — é a diferença mais visível
  entre a apresentação e um serif aplicado cru.
- **Não usar serif em corpo de texto nem em UI.** A proposta é um par de papéis;
  serif em label de botão ou em tabela derruba a legibilidade em corpo pequeno.
- **Fallback de display deve ser serif.** `Inter` como fallback de
  `Instrument Serif` faz o layout mudar de personalidade se a fonte atrasar.
- **`next/font` self-hospeda no build** — não há `<link>` para
  `fonts.googleapis.com` e não é preciso `preconnect`. Se aparecer request para
  o domínio do Google, alguma folha está importando a fonte por fora.
- **Trocar apenas o Tailwind não basta.** As referências diretas a
  `--font-sora` em CSS (§4, passo 4) não passam pelo `fontFamily` do Tailwind
  e ficariam com `system-ui`.
- **Peso de display não se resolve numa regra só.** `.font-display` define
  família; um `font-weight` no mesmo bloco empata em especificidade com
  `.font-bold` e perde na ordem das utilitárias do Tailwind. Tem de sair da
  classe. E depois de limpar o JSX, ainda sobra o que **herda** a serifa de um
  pai com `font-display` (foi o caso de `.evento-ordem`) e o que a
  **sobrescreve dentro de `@media`** (`.solution-info-titulo`) — os dois só
  aparecem medindo o computado na página, nunca no grep.
- **`--font-display` não existir era um bug silencioso** (corrigido), não um estilo
  intencional: nada quebra, os títulos só herdam a fonte do pai. Ao definir a
  variável, esses 9 pontos vão **mudar de aparência** — é correção, mas revise
  cada um, porque alguns podem ter sido ajustados visualmente por cima do
  comportamento errado.

---

## 7. Arquivos de origem (para consulta)

Base: `C:\Users\maria.martinelli\inovacao_landing_page\apresentação\site`

| Arquivo | Conteúdo |
|---|---|
| `app/layout.tsx` | declaração das duas fontes via `next/font/google` |
| `app/styles/tokens.css` | `--font-editorial` / `--font-interface` |
| `app/styles/base.css` | `body`, `.display`, `.display--xl/lg/md`, `.lead`, `.eyebrow`, `.numeric` |
| `app/styles/sections.css` | reafirmações de papel (`:117`, `:348`) e usos de display |
| `app/styles/layout.css` | display no navbar e no hero (`:336`, `:397`, `:635`) |

> O outro subprojeto da pasta `apresentação`
> (`luminna-legacy-transformation-lp`) usa `Geist` + `Geist Mono` — é o
> boilerplate padrão do `create-next-app`, **não** a proposta tipográfica.
