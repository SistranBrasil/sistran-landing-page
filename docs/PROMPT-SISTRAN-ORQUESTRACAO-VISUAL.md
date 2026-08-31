# Prompt para o Claude Code — Refatoração visual e sincronização da landing page Sistran

Você vai refatorar a landing page da Sistran para transformá-la em uma narrativa visual contínua, dinâmica, acessível e performática.

Referência pública atual: `https://sistran-landing-page.vercel.app/`

O site já possui bastante movimento. O problema central não é falta de efeitos: são seções que funcionam como ilhas independentes, durações de scroll excessivas, transições abruptas, controles de progresso redundantes e momentos com pouco conteúdo visual. A meta é fazer cada seção preparar e iniciar a próxima, com uma linguagem de movimento única.

## Regra inicial: inspecione antes de alterar

Antes de escrever código:

1. Leia o repositório e descubra os caminhos reais dos componentes, estilos, hooks e assets. Não invente nomes de arquivos.
2. Identifique onde são criados GSAP, ScrollTrigger, Lenis, `requestAnimationFrame`, IntersectionObserver, vídeos controlados por scroll, sticky e pin.
3. Produza para si um mapa curto da arquitetura atual e identifique possíveis triggers duplicados, pins aninhados ou múltiplas instâncias de scroll suave.
4. Preserve conteúdo, links, formulário, SEO, analytics, identidade visual, vídeos e assets existentes, exceto pelas mudanças descritas aqui.
5. Use a stack já existente — Next.js, GSAP, ScrollTrigger e Lenis. Não instale uma segunda biblioteca de animação.
6. Preserve alterações locais preexistentes e não faça reescritas amplas sem necessidade.

Depois da inspeção, implemente a refatoração sem aguardar confirmação, salvo se houver um bloqueio real, dado de negócio conflitante ou risco de remover comportamento funcional.

## Objetivo de experiência

A página deve contar esta história:

1. **Hero:** quem é a Sistran.
2. **Mosaico:** o que a Sistran já entrega.
3. **Soluções de Negócios:** como a Sistran atua.
4. **Sistran em números:** escala e resultados.
5. **Parceiros:** ecossistema e confiança.
6. **Luminna AI:** inovação e futuro.
7. **Pessoas e contato:** relação humana e conversão.

Crie um motivo visual recorrente: uma **linha-sinal ciano**. Ela deve nascer no hero, conectar os cards do mosaico, virar o conector das soluções, transformar-se na curva dos números, estabilizar-se como linha-base dos logos parceiros, reaparecer na Luminna e terminar desenhando parcialmente o contorno da área de contato.

Não use essa linha como mero ornamento. Em cada trecho ela deve indicar avanço, conexão ou transformação.

## Diagnóstico da versão atual que deve orientar a refatoração

Na versão desktop atual, as trilhas usam aproximadamente:

- Hero: `320vh`.
- Mosaico: `205svh`.
- Soluções: quatro passos de `100vh`.
- Sistran em números: `520vh`.
- Luminna: `320svh`.
- Contato: `200svh`.

Isso soma aproximadamente `1965vh` antes de considerar parceiros, LinkedIn e footer. Há muito scroll para a quantidade de informação entregue. Reduza a duração total com critério; não remova o caráter premium e cinematográfico.

## Prioridade 1 — Integrar Soluções, Números e Parceiros

Substitua as três experiências isoladas por uma jornada-mestra no desktop.

### Estrutura desejada

- Um wrapper da jornada, por exemplo `proof-journey` ou um nome adequado à arquitetura existente.
- Um único palco sticky/pinado.
- Camadas internas para Soluções, Números, Parceiros e linha-sinal.
- Uma timeline GSAP principal com labels semânticos: `solutions`, `handoff`, `metrics`, `partners`.
- Nenhum pin aninhado.

### Duração e distribuição

Use cerca de `650vh` a `720vh` no desktop para a jornada completa, em vez de aproximadamente `920vh` atuais.

- 0–40%: Soluções.
- 40–47%: transição/handoff.
- 47–91%: Números.
- 91–100%: Parceiros.

Esses percentuais são ponto de partida. Ajuste após inspeção visual, mantendo a proporção narrativa.

### Handoff Soluções → Números

A última mídia ou card de Soluções deve se transformar na lente/quadro da primeira métrica. Use GSAP Flip somente se o plugin já estiver disponível; caso contrário, implemente FLIP manual com `getBoundingClientRect`, translate e scale.

Durante esse handoff:

- “Soluções de Negócios” sai por máscara/clip vertical.
- “Sistran em números” entra pelo movimento complementar.
- O conector reto das soluções assume uma curva senoidal.
- O card final preserva posição visual e muda de função; ele não deve simplesmente desaparecer.

### Handoff Números → Parceiros

Ao chegar a `07 / 07`:

- a curva perde amplitude gradualmente;
- torna-se uma linha-base horizontal;
- os logos surgem dessa linha em sequência suave;
- o título de parceiros entra sem criar nova tela vazia ou reset visual.

## Prioridade 2 — Reconstruir “Sistran em números”

O trecho atual precisa parecer uma narrativa de prova e escala, não um carrossel solto.

### Composição do quadro ativo

- Número dominante: `font-size: clamp(7rem, 14vw, 13rem)` como referência.
- Título curto e texto de apoio no mesmo quadro.
- Contador `01 / 07` alinhado à direita.
- Métrica anterior e seguinte parcialmente visíveis para indicar continuidade.
- Microvisual contextual discreto para cada métrica.

### Movimento sugerido

- Entrada: `x: 38vw`, `scale: 0.74`, `opacity: 0.20`, `blur: 4px`.
- Ativo: `x: 0`, `scale: 1`, `opacity: 1`, `blur: 0`.
- Saída: `x: -38vw`, `scale: 0.84`, `opacity: 0.16`.
- Scroll scrub entre `0.8` e `1.1`.

O blur é opcional. Remova-o primeiro se afetar FPS. Transform e opacity devem sustentar o efeito sozinhos.

### Simplificação de navegação

Hoje existem sinais demais de progresso: contador, dots superiores, nós da curva e atalhos inferiores. Mantenha no máximo dois sistemas. Recomendação:

1. contador `01 / 07`;
2. nós interativos integrados à curva, se forem realmente úteis e acessíveis.

Remova o restante.

### Microvisuais

Use SVG/CSS leve e significativo:

| Métrica | Microvisual |
| --- | --- |
| 850+ profissionais | rede de pessoas/nós |
| 23+ reconhecimentos | selos em órbita lenta |
| 130+ clientes | mapa vetorial da América do Sul |
| 650 mil+ horas | linha de capacidade acumulada |
| 230+ implementações de ERP | módulos que se conectam |
| 35+ seguradoras | rede operacional |
| 25+ soluções de sinistro | comunicado → regulação → conclusão |

### Ajuste editorial sugerido

Use, após validar os números com a fonte institucional:

- `650 mil+ horas de capacidade produtiva`;
- `230+ implementações de ERP`;
- `35+ seguradoras atendidas`;
- `25+ implantações de soluções de sinistro`;
- nota discreta: `Dados institucionais atualizados em 2026.`

Não invente nem altere valores sem validação. Se o repositório tiver outra fonte oficial, mantenha-a e registre a divergência.

## Prioridade 3 — Mosaico com direção narrativa

Reduza de aproximadamente `205svh` para `160svh`–`180svh`.

- Classifique visualmente os cards em cases, capacidades e tecnologias.
- Mostre no máximo seis cards simultaneamente.
- Troque grupos conforme o scroll, em vez de acumular tudo na tela.
- Use profundidade moderada com translate, scale e opacity.
- Evite dispersão aleatória e parallax exagerado.
- No final, centralize um card; ele cresce e se torna a mídia inicial de Soluções.

O mosaico deve responder “o que entregamos?” e passar naturalmente para “como entregamos?”.

## Prioridade 4 — Luminna em capítulos

A trilha atual é longa para uma única legenda. Transforme-a em três capítulos sincronizados com o vídeo:

1. **Compreender** — transformar contexto complexo em visão acionável.
2. **Transformar** — converter conhecimento em fluxos e decisões.
3. **Validar e evoluir** — aprender com operação e resultados.

Analise o vídeo e alinhe cada capítulo a um beat visual real. Se o vídeo não sustentar três capítulos, reduza a seção a cerca de `180svh`–`220svh` e mantenha somente o conteúdo que faça sentido. Não prolongue a rolagem artificialmente.

## Prioridade 5 — Contato estável

Reduza a seção de aproximadamente `200svh` para fluxo normal ou `100vh`–`120vh`.

- A linha-sinal pode desenhar parcialmente o contorno do formulário na entrada.
- Faça um único reveal do título, texto e campos.
- Encerre toda rolagem controlada quando o formulário estiver disponível.
- Não desloque o formulário durante foco, digitação, validação ou envio.
- Preserve labels, mensagens de erro, estados do botão e integrações existentes.

## Infraestrutura de movimento

Centralize tokens:

```css
:root {
  --motion-fast: 180ms;
  --motion-base: 420ms;
  --motion-slow: 900ms;
  --ease-enter: cubic-bezier(.22, 1, .36, 1);
  --ease-exit: cubic-bezier(.4, 0, 1, 1);
  --ease-linear: linear;
  --scroll-scrub: 1;
}
```

Regras técnicas:

- Uma única instância Lenis.
- `lenis.on("scroll", ScrollTrigger.update)`.
- RAF do Lenis integrado ao ticker do GSAP, com cleanup correto.
- `gsap.context` para escopo por componente.
- `gsap.matchMedia` para desktop, mobile e movimento reduzido.
- `invalidateOnRefresh: true` quando medidas dependem do viewport.
- `ScrollTrigger.refresh()` somente depois de fontes e metadados essenciais de vídeo.
- Anime principalmente `transform` e `opacity`.
- Evite grandes áreas com blur/backdrop-filter animado.
- Destrua timelines, triggers, observers, listeners e RAFs no cleanup.
- Garanta que hot reload e navegação cliente não dupliquem triggers.

## Movimento reduzido e escolha de preferência

Mantenha a escolha de movimento, mas torne-a não bloqueante.

- O padrão deve respeitar `prefers-reduced-motion` do sistema.
- Salve uma escolha explícita em `localStorage`.
- Antes da escolha, hero deve renderizar poster, título e CTA.
- Não exiba mensagem dizendo que elementos podem ficar fora do lugar no modo reduzido.
- O modo reduzido deve ser um layout estático completo, sem grandes alturas artificiais, scrub, pin ou conteúdo invisível.
- Mantenha uma forma acessível de alterar a preferência depois.

## Mobile e tablet

Não comprima a timeline desktop em telas pequenas.

- Soluções: stepper vertical curto.
- Números: cards verticais ou carrossel horizontal com scroll snap nativo.
- Parceiros: grid ou marquee lento e pausável.
- Luminna: vídeo em fluxo normal com capítulos.
- Contato: totalmente estático.
- Use `svh`/`dvh` quando apropriado para barras dinâmicas do navegador.

Teste pelo menos:

- 360×800;
- 390×844;
- 768×1024;
- 1440×900;
- 1920×1080.

## Acessibilidade

- Preserve ordem semântica do DOM e níveis de heading.
- Conteúdo essencial não pode depender de animação para existir.
- Elementos decorativos usam `aria-hidden="true"`.
- Cópias duplicadas do marquee usam `aria-hidden="true"`.
- Marquee deve pausar em hover e foco.
- Preserve foco visível, navegação por teclado e labels do formulário.
- Garanta contraste adequado quando itens estiverem inativos.
- O layout deve degradar de forma útil caso JavaScript falhe.

## Performance

- Defina dimensões de mídia para evitar CLS.
- Use poster e carregamento adequado nos vídeos.
- Preserve a proporção dos logos; não os estique.
- Use `will-change` com parcimônia e remova-o quando não for necessário.
- Compare LCP, CLS e INP antes e depois em condições equivalentes.
- Verifique FPS em scroll rápido e em hardware intermediário.
- Se houver queda, remova primeiro blur, filtros, sombras animadas e camadas excessivas.

## Ordem de execução

Implemente em etapas pequenas e verificáveis:

1. Consolidar tokens e infraestrutura de movimento.
2. Criar a jornada-mestra Soluções → Números → Parceiros.
3. Refazer “Sistran em números”.
4. Ajustar mosaico e handoff para Soluções.
5. Dividir Luminna em capítulos.
6. Estabilizar contato.
7. Implementar mobile e movimento reduzido.
8. Validar build, lint, testes, console, responsividade e performance.

Não sacrifique funcionamento para concluir todos os efeitos de uma vez. Cada etapa deve deixar a página executável.

## Critérios de aceite

A entrega só está concluída quando:

- a narrativa entre seções é perceptivelmente contínua;
- Soluções, Números e Parceiros compartilham uma timeline desktop sem pins aninhados;
- a seção de números possui hierarquia editorial forte e progresso simplificado;
- não há grandes trechos vazios nem scroll excessivo para pouco conteúdo;
- o final de uma seção fornece o elemento inicial da próxima;
- o formulário permanece estável durante toda interação;
- mobile usa uma composição própria e legível;
- movimento reduzido apresenta todo o conteúdo sem aviso de incompatibilidade;
- links, CTAs, formulário, SEO, analytics e conteúdo continuam funcionando;
- build e lint passam, ou falhas preexistentes são separadas e documentadas;
- não há erros novos no console nem triggers duplicados após navegação/hot reload.

## Formato do relatório final

Ao concluir, responda com:

1. resumo da nova experiência;
2. arquivos alterados;
3. decisões técnicas importantes;
4. durações finais das trilhas por breakpoint;
5. testes executados e resultados;
6. impactos de acessibilidade e performance;
7. pendências, dados que precisam de validação e melhorias opcionais.

Se a skill `sistran-motion-orchestrator` estiver instalada no Claude Code, use-a durante esta tarefa e consulte suas referências de efeitos e checklist.
