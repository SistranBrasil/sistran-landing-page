# Tipografia da LP

Atualizado em 2026-09-08.

## As duas fontes em uso

| Papel | Fonte | Onde é declarada | Onde aparece |
| --- | --- | --- | --- |
| Base (interface, títulos, botões, labels) | **Inter** | `app/globals.css:43` no `body` | Todo o site por herança; reforçada em `app/globals.css:665` (`.hero-quote span`) e no `app/icon.svg` |
| Citações | **Georgia** | `app/globals.css:655` e `app/globals.css:2115` | `.hero-quote` (aspa flutuante do hero) e `.testimonial-card blockquote` (depoimentos) |

Pilhas completas, como estão no CSS:

```css
/* base */
font-family:
  Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
  sans-serif;

/* citações */
font-family: Georgia, "Times New Roman", serif;
```

Georgia é fonte de sistema — está no Windows e no macOS, com `"Times New Roman"` e `serif` como reserva. **Não precisa ser baixada nem hospedada.** O contraste serifada/itálica contra a sans-serif da base é intencional: marca a voz de outra pessoa (o depoimento) dentro da página.

## Estado atual: Inter não está sendo carregada

Não existe no projeto nenhum `@font-face`, nenhum `next/font` e nenhum `<link>` para o Google Fonts — o `<head>` em `app/layout.tsx:45` só contém o script da preferência de movimento. Consequência prática:

- Em máquina com Inter instalada (comum em quem trabalha com design), o site renderiza Inter.
- Em qualquer outra, o navegador pula para o próximo item da pilha: `ui-sans-serif` / `system-ui` — na prática **Segoe UI** no Windows, **San Francisco** no macOS/iOS, **Roboto** no Android.

Ou seja, a tipografia do site hoje varia por máquina, e a validação visual feita em um computador com Inter instalada não representa o que o visitante vê. Há ainda um segundo efeito: o CSS usa `font-weight: 650`, `750` e `850` (além de 600, 700, 800 e 900). Pesos intermediários como esses **só existem em fonte variável**. Sem Inter variável carregada, o navegador arredonda 650 → 700, 750 → 700 ou 800, 850 → 900, e o ritmo tipográfico planejado se achata.

Antes de carregar a fonte, decidir é uma escolha de projeto, não uma correção óbvia:

1. **Carregar Inter variável** — mantém a intenção do CSS, custa ~1 requisição e ~100 kB (subset latino).
2. **Assumir a fonte do sistema** — custo zero de rede, mas então trocar 650/750/850 por 600/700/800/900 no CSS, para o resultado ser previsível.

O restante deste documento cobre o caminho 1, que é o que o CSS atual pressupõe.

## Como obter Inter

Inter é de **Rasmus Andersson**, licenciada em **SIL Open Font License 1.1** — uso comercial e hospedagem própria liberados, sem custo e sem atribuição obrigatória na página.

- Site oficial: <https://rsms.me/inter/>
- Download direto: <https://github.com/rsms/inter/releases> — baixar `Inter-<versão>.zip` e usar, de dentro de `web/`, o arquivo **`InterVariable.woff2`** (fonte variável, cobre 100–900 em um único arquivo).
- Google Fonts: <https://fonts.google.com/specimen/Inter>

## Como aplicar (recomendado): `next/font/google`

Este é um projeto Next.js. O `next/font` baixa a fonte em tempo de build, serve do próprio domínio (sem requisição ao Google em runtime, o que também evita a questão de LGPD de IP do visitante), gera a `@font-face` e adiciona `size-adjust` para reduzir o pulo de layout na troca.

Em `app/layout.tsx`:

```tsx
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" data-motion="full" suppressHydrationWarning className={inter.variable}>
      {/* … */}
    </html>
  );
}
```

E em `app/globals.css:43`, trocar a primeira entrada da pilha pela variável:

```css
body {
  font-family:
    var(--font-inter), ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
    "Segoe UI", sans-serif;
}
```

A mesma troca vale na linha 665 (`.hero-quote span`). Como `next/font` carrega a versão variável, os pesos 650/750/850 passam a renderizar de verdade.

`display: "swap"` mostra a fonte de sistema imediatamente e troca por Inter quando ela chega. O texto nunca fica invisível; em contrapartida existe um reflow perceptível no primeiro acesso. `display: "optional"` elimina o reflow ao custo de, em conexão lenta, simplesmente não usar Inter naquele carregamento.

## Alternativa: self-host com `@font-face`

Se preferir não depender do `next/font`, colocar `InterVariable.woff2` em `public/assets/fonts/` e declarar no topo de `app/globals.css`:

```css
@font-face {
  font-family: "Inter";
  src: url("/assets/fonts/InterVariable.woff2") format("woff2-variations");
  font-weight: 100 900;  /* faixa da variável: habilita 650, 750, 850 */
  font-style: normal;
  font-display: swap;
}
```

E pré-carregar em `app/layout.tsx`, dentro do `<head>`, porque a fonte é usada no texto acima da dobra:

```tsx
<link
  rel="preload"
  href="/assets/fonts/InterVariable.woff2"
  as="font"
  type="font/woff2"
  crossOrigin="anonymous"
/>
```

O `crossOrigin` é obrigatório no `preload` de fonte mesmo em mesma origem — sem ele o navegador baixa o arquivo duas vezes.

Não usar `.ttf`: o WOFF2 do mesmo arquivo é cerca de 60% menor. Registrar apenas uma `@font-face` com a faixa `100 900`, e não uma por peso — a variável entrega todos.

## O que checar depois de aplicar

1. **A fonte está mesmo vindo do projeto**: DevTools → Network → filtro `Font`. Deve aparecer um `.woff2` servido pelo próprio domínio, e nenhuma requisição para `fonts.gstatic.com` em runtime.
2. **A variável está ativa**: DevTools → Elements → selecionar um `h1` → aba Computed → `font-family` deve resolver para Inter, e Rendered Fonts deve dizer `Inter` (não `Segoe UI`).
3. **Os pesos intermediários renderizam**: comparar visualmente um elemento em `650` com o mesmo em `700`. Se estiverem idênticos, a variável não carregou e o navegador está arredondando.
4. **Sem salto de layout**: Lighthouse → CLS. Recarregar com throttling "Slow 4G" e observar o hero — com `swap` há troca, mas o texto não deve reposicionar blocos inteiros.
5. **Citações intactas**: `.hero-quote` e `.testimonial-card blockquote` devem continuar em Georgia serifada itálica. Se viraram sans-serif, alguma regra nova está sobrescrevendo as linhas 655/2115.

## Escala e ajustes existentes

Vale conhecer antes de mexer em tipografia aqui, porque as decisões estão espalhadas pelo CSS:

- **Tamanhos fluidos com `clamp()`** — por exemplo `clamp(1.35rem, 2vw, 2rem)` no `blockquote` dos depoimentos e `clamp(1rem, 1.35vw, 1.35rem)` na aspa do hero. Ao trocar de fonte, os limites podem precisar de recalibragem: métricas diferentes ocupam larguras diferentes no mesmo `font-size`.
- **`letter-spacing` negativo forte** em títulos grandes (`-0.04em`, `-0.12em`) e positivo em labels caixa-alta (`0.08em`, `0.13em`, `0.25em`). O tracking negativo é calibrado para as métricas da Inter — em fonte de sistema ele fecha demais as letras.
- **`text-rendering: optimizeLegibility` e `-webkit-font-smoothing: antialiased`** no `body` (`app/globals.css:47-48`).
- **`app/icon.svg`** repete a pilha da Inter em `font-family` com `letter-spacing: -4.5` no monograma "RS". SVG usado como favicon **não carrega webfont** — esse texto sempre renderiza em fonte de sistema, independente do que for feito no CSS. Se o monograma precisa ser exatamente Inter, converter o texto em path (`<path>`) em vez de manter `<text>`.

## Armadilhas

- Declarar `Inter` na pilha **não carrega** a fonte. É o erro que está no projeto hoje: a pilha existe desde o início, o `@font-face` nunca existiu.
- Pesos 650/750/850 exigem fonte variável e `font-weight: 100 900` na `@font-face`. Com fonte estática, o navegador arredonda silenciosamente — nenhum aviso no console.
- `preload` de fonte sem `crossOrigin` causa download duplicado.
- Registrar vários `@font-face` de pesos estáticos junto com a variável faz o navegador escolher o estático e perder os intermediários.
- Testar em máquina que já tem Inter instalada esconde exatamente o problema que se está tentando corrigir. Verificar em uma máquina limpa ou desabilitando a fonte local.
- Georgia não precisa de carregamento, mas **não é universal no Linux**. A reserva `"Times New Roman", serif` cobre o caso; se a fidelidade das citações for crítica em qualquer sistema, o caminho é hospedar uma serifada (por exemplo Source Serif 4, também OFL).
