# Tipografia da LP

Atualizado em 2026-09-10 (SIS-174). Reescrito por inteiro: a versão de 2026-09-08 descrevia **Instrument Serif + Inter** e um projeto sem `next/font`, e as duas coisas deixaram de ser verdade — ver "Histórico das duas decisões de marca" no fim.

Cada afirmação daqui é conferível contra `src/app/layout.tsx`, `src/app/globals.css` ou `tailwind.config.ts`, com o número da linha ao lado. Se um número não bater, o arquivo mudou depois desta data: confie no código e corrija aqui.

## As duas fontes em uso

| Papel | Fonte | Onde é carregada | Onde é declarada |
| --- | --- | --- | --- |
| Proporcional — hero, títulos, navegação, parágrafo, botões, labels | **Geist Sans** (400/500/600/700, normal + itálico) | `src/app/layout.tsx:2` e `:209-215` | `globals.css:46` (`--font-proportional`) |
| Técnica — rótulo curto, categoria, metadado, código | **Geist Mono** (600) | `src/app/layout.tsx:2` e `:216-221` | `globals.css:51` (`--font-mono`) |

As duas entram por `next/font/google` com `display: 'swap'`, e as variáveis CSS são aplicadas no `<html>` em `layout.tsx:280`. O `<body>` recebe `font-sans` (`layout.tsx:315`), que o Tailwind resolve em `tailwind.config.ts:61` para `var(--font-proportional)`.

**Não existe mais serifa no site.** A queda de `--font-proportional` é `"Helvetica Neue", Arial, sans-serif` (`globals.css:46`) — e isso é critério, não gosto: com `Georgia, serif` no fim da lista, uma falha de carregamento entregaria justamente a personalidade que a marca retirou. A explicação longa está em `tailwind.config.ts:67-72`.

## A camada de papéis (é por aqui que se mexe)

Nenhum componente nomeia a fonte. Há três nomes de compatibilidade que hoje resolvem todos para a mesma grotesca, em `globals.css:52-54`:

```css
--font-editorial: var(--font-proportional);
--font-interface: var(--font-proportional);
--font-display: var(--font-editorial);
```

⚠️ **`--font-editorial` não é mais editorial, e o nome ficou.** Ele era a serifa; hoje é a mesma grotesca de `--font-proportional`. O nome mente — a nota em `globals.css:23-35` conta por que renomear custaria mais do que documentar. Não leia o nome como especificação.

Trocar a família do site inteiro é editar `globals.css:46` e `:51`. Trocar o papel de um bloco é apontá-lo para outra variável. **Nunca escrever `Geist` direto num componente**: isso cria um segundo lugar para editar, que é o defeito que esta indireção existe para evitar.

## Escala e piso de tamanho

Os degraus da escala vivem em `globals.css:73-82`, e os de manchete continuam em `tailwind.config.ts` (`hero`, `section`, `palco`, `pagehero`, `pagehero-medio`, `pagehero-longo`) — foram calibrados contra os títulos reais das quatorze rotas.

**Piso de tamanho de texto (SIS-174, decisão da usuária — não remedir):**

| Tipo de texto | Piso |
| --- | --- |
| Texto corrido — frase, parágrafo, mensagem, número solto, label de campo de formulário | **12px** (`0.75rem` / `text-xs`) |
| Label caixa-alta com `letter-spacing` positivo | **11px** (`0.6875rem` / `text-[11px]`) |

Os dois números já estão na escala: `--tipo-rotulo` e `--tipo-legenda` são `0.6875rem` (`globals.css:79-80`), e `--tipo-corpo` é `1rem`, que é piso e não desce para salvar quebra de linha (`globals.css:78`).

Duas leituras que a régua não deixa em aberto:

- **Label de campo de formulário vai a 12px, mesmo sendo caixa-alta.** O piso de 11px foi concedido a label que a pessoa reconhece pela silhueta; rótulo de campo é texto de que ela depende para preencher certo. Exemplo comentado: `.contact-dialog-campo label` em `globals.css`.
- **Uma única exceção no site, e é decisão registrada:** `.bm-rotulo .bm-coord` fica em 7px (9px em `max-width: 767px`). É coordenada decorativa em `<text>` de SVG dentro do rótulo do mapa — SVG não reflowa, então subir o glifo empurra a coordenada para fora da caixa do `viewBox`. O motivo completo está no comentário da própria regra.

## Ajustes existentes — conhecer antes de mexer

- **Tamanhos fluidos com `clamp()`** (`globals.css:73-76`). Ao trocar de família, os limites podem precisar de recalibragem: métricas diferentes ocupam larguras diferentes no mesmo `font-size`. Foi o custo real da troca de 09/09, e é o que voltará a custar na próxima.
- **`letter-spacing` negativo em títulos grandes** (`-0.04em` em `globals.css:9124`; há um ponto em `-0.12em`) e positivo em label caixa-alta. Está calibrado para as métricas da Geist. Fonte maior com o mesmo tracking é resultado desejado; recalibrar tracking junto com tamanho torna impossível saber qual das duas mudanças causou o quê.
- **`-webkit-font-smoothing: antialiased` e `text-rendering: optimizeLegibility`** no `body` (`globals.css:389-390`).
- **Pesos:** só existem 400/500/600/700 na Geist Sans e 600 na Mono (`layout.tsx:210` e `:217`). Pedir um peso fora dessa lista faz o navegador resolver no corte real mais próximo, sem aviso. Para o que se escreve de novo: 400 é a assinatura, 500 a navegação, e ênfase nova vai para a Mono — não para um 700 a mais (`layout.tsx:205-208`).
- **`weight` explícito, não eixo variável.** É deliberado (`layout.tsx:152`), não esquecimento.

## Histórico das duas decisões de marca

As duas datas ficam aqui de propósito: quem ler só uma delas vai achar que a outra é erro.

- **2026-09-08** — a usuária confirmou que `--font-display` apontar para a serifada estava **certo**, e que o documento de tipografia é que havia caducado. Valia então **Instrument Serif** (display e citações) + **Inter** (interface).
- **2026-09-09** — a usuária aprovou **retirar a serifa do site inteiro** (aval de marca no ponto 1 da SIS-155): entram Geist Sans + Geist Mono, sai a serifa dos 76 pontos de JSX e das quatorze rotas, e o fallback deixa de ser serifado. **Esta é a decisão em vigor.** A de 09-08 não foi um erro — foi substituída um dia depois.

O rastro do estado antigo não foi apagado, foi comentado: as linhas de `--font-editorial`/`--font-interface` de então estão em `globals.css:44-45`, e a lista de fallback serifada em `tailwind.config.ts:74`.

## Armadilhas

- **Não escrever o nome da família em componente.** Sempre a variável de papel.
- **Não ler `--font-editorial` como "serifa"** — ele é grotesca hoje (`globals.css:52`).
- **Não devolver `Georgia, "Times New Roman", serif` a nenhuma cauda de fallback.** Georgia também não é universal no Linux, mas o motivo aqui é outro: a serifa saiu por decisão de marca, e uma falha de carregamento não pode ser a porta de volta dela. Se algum dia uma serifada for necessária de novo, é decisão de marca nova, com uma OFL hospedada (por exemplo Source Serif 4) — não uma fonte de sistema herdada por acidente.
- **Não confiar em teste feito com a fonte instalada na máquina.** Conferir em `DevTools → Elements → Computed → Rendered Fonts`: deve dizer `Geist`, não `Segoe UI` nem `Geist Fallback`.
- **`display: 'swap'` troca a fonte depois do primeiro quadro.** O texto nunca fica invisível, em troca há reflow no primeiro acesso — conferir CLS no Lighthouse com throttling, sobretudo no hero.
- **Não converter `px` ↔ `rem` de passagem.** Onde está `9px`, sobe para `11px`; onde está `0.6rem`, sobe para `0.6875rem`. Unificar unidade é refatoração de outra natureza e desaparece no meio de um diff de tamanho.
