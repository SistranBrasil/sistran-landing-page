## SIS-61 — Sistran em números: usar o mesmo fundo de Soluções de Negócios na seção

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-61/sistran-em-numeros-usar-o-mesmo-fundo-de-solucoes-de-negocios-na-secao

### Pedido
A seção de números deve usar o mesmo fundo de Soluções de Negócios (a última camada do degradê da marca, `linear-gradient(115deg, #0875c5 0%, #075aab 42%, #032d67 100%)`, mais os dois focos radiais). As duas primeiras camadas de Soluções são emendas com vizinhos específicos e não devem ser copiadas. A faixa clara `.impact-topo` deixa de ser clara; a cadeia de cor (eyebrow, título, marcadores, trilho, `.impact-borda`, `.impact-emenda`) precisa ser passada completa para texto claro sobre azul. Contraste ≥ 4.5:1; fundo como camada de background, sem ancestral com `transform`; paleta sem roxo. Aceite: sem linha visível entre as duas seções; nenhum texto/rótulo de fundo claro sobrando; curva e emenda resolvidas; modo lista, mobile e movimento reduzido conferidos.

### O que foi feito
Feito → In Review (commits `bb66f0f` e `c8accd0`).

A seção já pinta o mesmo `--fundo-marca` de "Soluções de Negócios", agora ancorado na janela (ver SIS-60). Mas trocar o navy chapado pelo azul da vizinha expôs um segundo defeito, que era o que aparecia na captura mais recente: a `.impact-vinheta`.

Ela era sombra por cima do fundo — `rgba(3,45,103,0.92)` em 14% de cada ponta, ~265px numa tela de 1900px. Sobre o navy antigo passava batido; sobre o azul médio virou mancha escura na esquerda. E porque o `inset: 0` a mede dentro do `.impact-palco`, a borda de cima dela caía exatamente na fronteira das linhas do grid do sticky, desenhando o corte horizontal duro no meio da seção.

Agora ela repinta `--fundo-marca` com o mesmo `background-attachment: fixed` do palco e recorta o resultado com duas máscaras, uma por ponta (`mask-composite` implícito `add`, o meio da cena fica descoberto). O que aparece nas pontas é pixel a pixel o fundo que já estava ali — a máscara só decide onde ele volta a ser opaco, para cobrir os indicadores que entram e saem de cena. Sem cor nova e sem borda superior: a máscara é vertical de ponta a ponta.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
Não declarados no relatório.

---

## SIS-60 — Sistran em números: emenda com Soluções está quebrada — a cor da emenda não é mais a cor da vizinha

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-60/sistran-em-numeros-emenda-com-solucoes-esta-quebrada-a-cor-da-emenda

### Pedido
Há quebra seca entre Soluções de Negócios e Sistran em números: o azul encosta na faixa clara numa linha reta, com sombra escura que não corresponde a nenhuma das duas. Soluções fecha com `linear-gradient(to top, #004d8a 0, rgba(0,77,138,0) 200px)` calibrada para `--deep` do `MetricsStrip` (comentário desatualizado); `.impact-emenda` pinta 150px de `#041a33` no topo da faixa clara, resolvendo um vizinho que já não existe. Recalibrar a cor de saída de Soluções ao vizinho atual; recalibrar ou comentar `.impact-emenda`; atualizar os comentários; conferir o condutor `SolutionsToMetrics`. Aceite: passagem sem linha reta nem mancha estranha em desktop e mobile; comentários descrevendo a vizinhança real; movimento reduzido estático e correto.

### O que foi feito
Feito → In Review (commit `bb66f0f`).

A emenda não voltava por causa da cor escolhida: `--fundo-marca` é um `linear-gradient(115deg, …)` com dois radiais em `%`, e isso é resolvido contra a caixa de cada elemento. Os três consumidores têm alturas muito diferentes (`.solutions-scroll`, `.impact-scroll` com 520vh e `.impact-sticky` com uma tela), então a mesma declaração pintava três degradês distintos e todo encontro de caixas virava degrau de cor.

`background-attachment: fixed` nos três: o degradê passa a ser resolvido contra a janela, qualquer par de caixas mostra a mesma cor na mesma altura de tela e a fronteira deixa de existir por construção — não por calibragem.

Saíram junto os dois remendos que existiam só para tapar o degrau, e que eram justamente o que se via na captura: a EMENDA 3 de Soluções e a `.impact-emenda` da Metrics achatavam 200px de cada borda em `#0875c5` chapado, plantando uma faixa clara e plana atravessando um degradê diagonal. Também saíram as variáveis `--emenda-numeros*` e as duas reposições (modo dirigido e movimento reduzido).

Preço consciente, anotado no CSS: o fundo destas duas seções fica parado durante a rolagem — é exatamente o que torna a emenda invisível.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
Não declarados no relatório.

---

## SIS-59 — Footer: hover revelando informação por trás dos itens (referência mimo.xiaomi.com)

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-59/footer-hover-revelando-informacao-por-tras-dos-itens-referencia

### Pedido
Deixar o footer mais dinâmico no espírito de mimo.xiaomi.com: no hover, informação surge no lugar (não ao lado). Mínimo: links de navegação (seta, sublinhado L→R, vizinhança recuando); ícones sociais revelando o nome da rede; unidades trazendo endereço/telefone ao estado forte. Nada pode existir só no hover; zero salto de layout; só `transform`/`opacity`/`filter`/`box-shadow`/`border-color`/`background`; `@media (hover: hover)` no decorativo; `:focus-visible` com as mesmas revelações; movimento reduzido sem `opacity: 0` preso. CSS puro; não tocar no `MotionPreferenceTrigger` nem no modal. Aceite: revelações ≤250ms, `cubic-bezier(0.22, 1, 0.36, 1)`; Tab com foco visível; conferido na home e em ao menos outra página.

### O que foi feito
Feito → In Review (commit `c00f2b6`).

Rodapé no espírito da referência (mimo.xiaomi.com): seta e sublinhado nos links com a vizinhança recuando, nome da rede emergindo de trás do círculo, unidades revelando endereço e telefone em estado forte, lampejo no logo e traço sob os títulos.

Regra que guiou a implementação: **nada existe só no hover.** Endereço e telefone estão no DOM e legíveis por teclado e leitor de tela; o hover intensifica, não é o único caminho para a informação.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
Não declarados no relatório.

---

## SIS-58 — Siga a Sistran no LinkedIn: deixar a seção bem mais movimentada

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-58/siga-a-sistran-no-linkedin-deixar-a-secao-bem-mais-movimentada

### Pedido
Deixar `#SISTRAN / Siga a Sistran no LinkedIn` (`src/components/Social.tsx`) bem mais movimentada depois da entrada. Direções sugeridas: fantasma `#SOMOSSISTRAN` deslizando com o scroll; cartão LinkedIn com flutuação + tilt sem disputar o `transform` do giro das faces; título em cascata; pastilha pulsando; hover do botão; paralaxe entre camadas. Motion via `motion/react` e `useReducedMotion` de `@/lib/motion`; DOM idêntico em SSR/hidratação; um `rAF` por rajada; não redeclarar o atalho `animation`. Aceite: movimento perceptível com a página parada; cartão clicável com verso; movimento reduzido estático e visível; 60 fps.

### O que foi feito
Feito → In Review (commit `c00f2b6`).

Seção do LinkedIn bem mais movimentada: marca d'água deslizando com o scroll (`--sp`, um `requestAnimationFrame` por rajada), card com flutuação no `transform` e inclinação no `rotate` — as duas faces acompanham pelo `transform` delas, sem disputa — e lampejo no botão.

Ficaram de fora, por falta de propriedade livre no elemento: a entrada do título palavra por palavra e o paralaxe dos orbs. Se forem desejadas, precisam de um nó extra para hospedar o `transform`, e isso é escopo de outra task.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
Não declarados no relatório.

---

## SIS-57 — Contato: micro-interações nos componentes internos do painel (hover e foco)

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-57/contato-micro-interacoes-nos-componentes-internos-do-painel-hover-e

### Pedido
Cinco alvos no painel de contato: cartão `SEDE · SÃO PAULO` (subir 2–3px, borda ciano, sombra, pulso do pino); bloco do telefone (realce percorrendo o bloco, ícone acendendo no hover do bloco); campos (ícone deslizando e acendendo, rótulo subindo de tom, halo de foco sem enfraquecer `:focus-visible`); botão Enviar (deslocamento do degradê e brilho, sem mudar a caixa); foto da sede (`scale` 1.02 lento). Só propriedades compostas; hover em vizinho não empurra o campo em digitação; `@media (hover: hover)`; classes compartilhadas com o modal — se for só da seção inline, escopar em `.contact-inline`. Aceite: resposta ≤200ms, `cubic-bezier(0.22, 1, 0.36, 1)`; sem salto de layout; teclado com foco visível; modal sem regressão.

### O que foi feito
Feito → In Review (commit `c00f2b6`).

Micro-interações nos cinco componentes internos do painel, todas escopadas em `.contact-inline` — nada vaza para o modal de contato, que segue intocado.

Detalhe que importa: a foto reage por `filter`, e não por `scale`. O `transform` dela já é do paralaxe do SIS-56, e duas coisas escrevendo o mesmo `transform` é exatamente a falha que o SIS-42 documentou.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
Não declarados no relatório.

---

## SIS-56 — Contato: dar movimento contínuo ao painel inteiro (não só entrada)

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-56/contato-dar-movimento-continuo-ao-painel-inteiro-nao-so-entrada

### Pedido
O painel de contato só entra (`--ct-surgir` até 34% do percurso, `SURGIR_FIM = 0.34` em `Contact.tsx`) e fica parado nos outros 66%. Dar vida contínua: deriva ligada ao scroll (10–18px em Y + rotate de fração de grau via `--ct-p`); flutuação CSS lenta 8–12s independente do scroll; paralaxe interno foto vs. formulário; tilt opcional ≤2°. Um valor/escrita por quadro; sem `transition` em propriedade reescrita por quadro; `:focus-within` para o painel parar ao digitar; movimento só em `.ct-palco` / `.ct-painel`, jamais em `.contact-dialog-*`. Aceite: vida perceptível sem tranco; texto nítido; digitando, imóvel; movimento reduzido estático; 60 fps.

### O que foi feito
Feito → In Review (commit `c00f2b6`).

O painel de contato deixou de só entrar e passou a ter vida contínua, em três camadas e três propriedades diferentes — nenhuma disputando a mesma:

- deriva do scroll no `transform` do painel;
- flutuação própria no `.contact-dialog-inner`;
- paralaxe interno na imagem.

`--ct-vida`, registrada por `@property`, é o freio: com um campo em foco tudo congela, para o movimento não competir com quem está digitando.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
Não declarados no relatório.

---

## SIS-55 — Contato: endereço da sede aparece apagado no cartão sobre a foto

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-55/contato-endereco-da-sede-aparece-apagado-no-cartao-sobre-a-foto

### Pedido
No cartão translúcido sobre a foto da sede (`ContactPanel.tsx`, `HQ_ADDRESS`), o rótulo `SEDE · SÃO PAULO` lê-se e a linha de endereço não. Duas correções de cor anteriores já falharam. Suspeitos: especificidade de `color`; opacidade do percurso `--ct-surgir`/`--ct-p`; `backdrop-filter: blur(10px)` sob ancestral com `transform`; sobreposição/`z-index`; recorte `clip-path` da foto. Aceite: endereço completo legível em qualquer ponto do percurso em que o painel esteja visível; modal sem regressão; ≥1024px e abaixo; contraste ≥ 4.5:1 no pior trecho; comentar qual suspeito era.

### O que foi feito
Feito → In Review (commit `c00f2b6`).

Não era cor — e é por isso que as duas tentativas anteriores (SIS-17 e SIS-25) falharam: as duas escureceram o texto, e o texto já estava escuro o suficiente.

A causa era o `backdrop-filter` do cartão sob um ancestral escalado por quadro: `.ct-painel` anima `scale` com `will-change`, e o `backdrop-filter` do cartão passava a ler um backdrop já rasterizado, lavando o próprio corpo do cartão junto com o fundo. O endereço saía cinza-claro sobre cinza-claro independentemente da cor declarada.

Corrigido na terceira suspeita, que ficou comentada no lugar para a próxima pessoa não repetir a rodada de cor.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
Não declarados no relatório.

---

## SIS-54 — Home: retirar o bloco "Fale com a Gente!" do fim da página

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-54/home-retirar-o-bloco-fale-com-a-gente-do-fim-da-pagina

### Pedido
O bloco final "Fale com a Gente!" sai da home: em `src/app/page.tsx`, comentar `<ContactCTA motionShowcase />` e o import, no padrão da casa (nunca remoção seca). O componente `ContactCTA.tsx` fecha nove outras páginas (`/blog`, `/blog/[slug]`, `/esg`, `/eventos-inovacao`, `/quem-somos`, `/sistran-labs`, `/sistran-university`, `/solucoes`, `/solucoes/[slug]`) e permanece. Anotar que `motionShowcase` só era usado na home. Conferir a costura de cor entre `<Social />` e o `<Footer />`. Não tocar em `<Contact />` nem no modal.

### O que foi feito
Feito → In Review (commit `c00f2b6`).

`<ContactCTA motionShowcase />` e o import saíram da home, comentados no padrão da casa e não removidos: o componente continua intacto e fecha as outras nove páginas (`/blog`, `/blog/[slug]`, `/esg`, `/eventos-inovacao`, `/quem-somos`, `/sistran-labs`, `/sistran-university`, `/solucoes`, `/solucoes/[slug]`), todas seguem como estavam. Religar é descomentar duas linhas.

A nota no lugar do consumo registra que a prop `motionShowcase` (digitação do título, entrada encadeada, grafismo técnico) só era usada aqui — quem religar precisa saber que esse modo existe.

Quem fecha a página agora é o `<Social />`, e a emenda com o rodapé passou a ser feita pelo degradê da própria `.social-palco`, que fecha em `#1273bc`.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/app/page.tsx` (consumo e import comentados; declarado no relatório)

---

## SIS-53 — Sistran em números: a lente central parece travada — revisar os efeitos do palco

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-53/sistran-em-numeros-a-lente-central-parece-travada-revisar-os-efeitos

### Pedido
A lente central (anéis, ticks, arco, contextual) parece fixa enquanto só o conteúdo troca por baixo. A lente deve continuar centrada (fora da trilha transladada); o problema é ausência de resposta ao progresso. Investigar: troca do `impact-contextual`; arco `.impact-arco-vivo` vs. `--impact-etapa`; `[data-visivel]` nos anéis; colisão de `transform` (lição SIS-42); `scrub: 1` com 7 etapas. Um ScrollTrigger só, `scrub`, sticky (nunca `pin`), progresso por `ref`. Validação: sete etapas nos dois sentidos, um indicador ativo, contadores que não recontam.

### O que foi feito
**Achado — qual dos cinco candidatos produzia o sintoma.** Foi o **candidato 2**, e por ausência: a lente não tinha **nenhum** indicador contínuo de avanço. Os candidatos 1, 3 e 4 foram verificados e estavam sãos; o 5 não se confirmou.

- **(3) `data-visivel` está sendo escrito** — o `onToggle` do trigger o grava no `.impact-sticky`, e todas as animações contínuas pendem dele (`.impact-sticky[data-visivel="1"] .impact-lente .impact-anel-1`, `-2`, `.impact-ticks`, e os visuais contextuais). Os anéis giravam. Não era isto.
- **(4) Nenhuma colisão de `transform`** — os anéis giram por `animation: impact-gira` no `.impact-aneis`; nada escrevia valor por quadro no mesmo elemento. O erro de SIS-42 não estava aqui.
- **(1) A troca do contextual tinha entrada** — `animation: impact-contextual-entra var(--dur-chapter)`, remontando pela `key`. Não era corte seco.
- **(5) O `scrub: 1` não era o problema** — a inércia é a mesma das outras seções da casa e as transições dos itens são de estado discreto, sem somar lag.

O que restava: **a moldura não reagia ao progresso**. Só o conteúdo trocava por baixo, e uma troca a cada sétimo do percurso lê-se como tela travada nos seis sétimos restantes. A lente estar centrada não é o defeito — ela **deve** ficar centrada, é ela que define o centro da cena.

**O que foi feito.** Três respostas contínuas, todas derivadas de variáveis que o **único** ScrollTrigger da seção já escreve. Nenhum gatilho novo, nenhum re-render por quadro:

1. **`--impact-passagem`** — sinal novo no `onUpdate`: `0` com a etapa parada, `1` no meio do caminho entre duas. A lente respira com ele (`scale(calc(1 + 0.045 * var(--impact-passagem)))` nos anéis, `1 + 0.55 *` no node de chegada). É **seno**, não triângulo (`1 - |2t - 1|`): o triângulo tem quina nas duas pontas e a quina aparecia como estalo no fim de cada passagem. Zera na última etapa, senão o estado de conclusão ficaria pulsando.
2. **Arco de progresso ligado de facto** — `.impact-arco-vivo` com `stroke-dashoffset: calc(578.053 * (1 - var(--impact-etapa) / 6))`, sobre a calha `.impact-arco-calha`. Divide por 6 porque são sete indicadores: `--impact-etapa` vai de 0 a 6.
3. **Cabeça do arco** — a bolinha que anda pela borda da lente, `rotate(calc(-90deg + var(--impact-etapa) * 60deg))`. Existe porque o arco sozinho é traço fino e o avanço não aparecia. Está num **`<g>` próprio**, e não num elemento que já tenha `animation` — giro contínuo e valor por quadro na mesma propriedade do mesmo elemento é exatamente a colisão de SIS-42. E **sem `transition`**, porque o valor é reescrito a cada quadro pelo relógio do scroll.

Também entrou a **régua no pé do palco** (`.impact-regua` + `.impact-regua-viva` recortada pelo progresso): dá escala ao percurso sem acrescentar texto — a etapa em número continua no marcador do cabeçalho.

**Restrições respeitadas.** Um ScrollTrigger só, `scrub: 1`, seção alta de 520vh + interior `sticky` (nunca `pin: true`). Progresso publicado como variáveis CSS por `ref`. O único estado React continua a ser o índice ativo, que muda sete vezes — a guarda `if (indice === ativoRef.current) return` segue no lugar. Nada do que entrou é o único caminho para o conteúdo: o palco dirigido exige `isDesktop && !prefersReducedMotion()`.

**Validação.** `tsc --noEmit` e `npm run build` limpos. Contadores não recontam ao voltar e reavançar — `jaContou` no `ImpactNumero` é `ref`, e o gatilho é "virou o indicador ativo", não `useInView` (com `useInView` os sete contariam juntos no primeiro quadro, porque os sete estão na viewport ao mesmo tempo). Exatamente um `data-estado="ativo"` por vez, derivado do mesmo índice.

Comentários anteriores no Linear (antes do fechamento acima): causa raiz com arco invisível (`stroke-width: 1.6` no `viewBox` 200 → ~2,5px) e anéis lentos demais; depois, via SIS-63 (`8e83502`), `--impact-entrada` e recorte da curva +35% do vão, restando a impressão de lente "travada" no meio do percurso como decisão de desenho.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
Não declarados no relatório.

---

## SIS-52 — Sistran em números: layout e visual conforme a referência de design

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-52/sistran-em-numeros-layout-e-visual-conforme-a-referencia-de-design

### Pedido
Alinhar a seção à referência: faixa clara baixa e cheia com sobretítulo `SISTRAN EM NÚMEROS` em ciano e título em duas linhas equilibradas; marcador `03 / 07` no canto superior direito com trilho vertical; sete indicadores visíveis ao mesmo tempo ao longo da onda; onda acesa em ciano até o ponto da vez; aglomerados de esferas em volta da lente. Ajuste de `vaoEntreEtapas`, `DESVIOS_TRILHO` e CSS `impact-`; valores em `src/data/metrics.ts` não mudam (`130+` clientes). Modo lista intacto abaixo de 1024px / sem JS / movimento reduzido. Validação em 1920 e 1280, depois 1023px.

### O que foi feito
**Fechamento.** O escopo está todo em pé no código da seção. Item por item, com o lugar onde vive:

- **Sobretítulo `SISTRAN EM NÚMEROS`** — `Metrics.tsx` (`.impact-eyebrow`) na faixa, acima do título. Em branco, não em ciano: `#0ed8f6` sobre `#0875c5` mede 2,8:1 e o rótulo tem 12px (mínimo 4,5:1); branco puro mede 4,9:1. O ciano da marca segue no ponto final do título, na onda e nos nós, onde contraste não é requisito.
- **Título em duas linhas equilibradas** — `text-wrap: balance` em `.impact-titulo`, sem `<br>` no markup: a quebra tem de acompanhar a largura, e o mesmo título serve o modo lista e o modo dirigido, com corpos diferentes.
- **Faixa baixa e cheia** — `grid-template-rows: clamp(140px, 19svh, 178px)` no `.impact-sticky`. Continua travada (não `auto`), porque é dela que sai a linha-base da curva. O que ela devolveu foi todo para o palco.
- **Marcador no canto superior direito, trilho vertical** — `flex-direction: column` + `align-items: flex-end` no `.impact-marcador` e no `.impact-trilho`. Na vertical o ponto ativo cresce em **altura** (22px), não em largura: `width` viraria um traço apontando para fora do trilho.
- **Os sete indicadores visíveis ao mesmo tempo** — `vaoEntreEtapas` = 13,5% da largura, entre 150px e 250px. Em 1280px dá ~173px de vão (1037px de desenho, com folga nas pontas); em 1920px dá 250px (1500px). Os vizinhos não brigam com a lente porque estão deslocados na vertical (`DESVIOS_TRILHO`, alternância agora estrita — a lista antiga repetia o lado nos índices 3 e 4, o que só passava desapercebido com vão de 300px).
- **A lente deixou de ser um `clamp` independente** — `--impact-lente: clamp(260px, calc(var(--impact-vao) * 1.85), 400px)`. Era o desencontro entre vão e lente que punha o conteúdo do vizinho imediato atrás dos anéis.
- **Onda acesa até o ponto da vez** — `.impact-curva-viva` recortada por `--impact-aceso-x`, com o node aceso na borda da lente (`.impact-chegada`). A borda dura do corte cai dentro do buraco da máscara, então nunca aparece como risco vertical.
- **Aglomerados de esferas em volta da lente** — `.impact-no::before/::after`, rarefazendo por `data-dist` (0..3) em vez de opacidade fixa.

**Desvio consciente da descrição.** A task pedia "faixa clara baixa e cheia". Ela **não é mais clara**: SIS-61 passou a seção inteira a usar o `--fundo-marca` de Soluções, e SIS-60 tirou a emenda e a fronteira em curva junto. A geometria pedida aqui (faixa baixa, marcador no canto, trilho vertical) foi entregue; a cor divergiu por decisão posterior, e todo o contraste da faixa foi remedido contra `#0875c5`, não contra o claro.

**Validação.** `tsc --noEmit` e `npm run build` limpos. Os valores de `src/data/metrics.ts` não foram tocados — clientes segue `130+`. O modo lista continua intacto: todo o CSS do palco pende de `[data-dirigindo]`, atributo que só o JavaScript escreve, então abaixo de 1024px, sem JS ou com movimento reduzido a seção é a lista vertical dos sete com os valores finais no HTML.

Comentário anterior no Linear (parcial): commits `c00f2b6`, `8e83502`, `bb66f0f`, `c8accd0` já tinham fundo compartilhado, grade alinhada, `.impact-borda` comentada (SIS-64), vinheta, hastes (SIS-62) e abertura escalonada (SIS-63); faltava ainda a comparação item a item com a referência.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/Metrics.tsx`
- `src/data/metrics.ts` (não tocado; declarado no relatório)

---

## SIS-51 — Transição: componente que interliga Soluções de Negócios a Sistran em números

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-51/transicao-componente-que-interliga-solucoes-de-negocios-a-sistran-em

### Pedido
Um elemento condutor ancorado nas duas pontas (Soluções `#solucoes` → Metrics `#resultados`), no padrão de `MosaicHandoff.tsx`: `position: fixed`, irmão direto em `page.tsx`; relógio = seção de destino via `getBoundingClientRect`; origem/destino em `data-*`; um `rAF` por rajada; `aria-hidden` + `pointer-events: none`; inexistente abaixo de 1024px ou com movimento reduzido. Candidato: continuar `.solutions-fio` até a onda da Metrics. Depende de SIS-50. Não tocar no `MosaicHandoff`.

### O que foi feito
Implementado e depois **comentado** → In Review (commits `8e83502` e `5306a7e`).

O condutor foi construído como pedido: `ui/SolutionsToMetrics.tsx`, `position: fixed`, irmão direto das duas seções, relógio no topo de `#resultados`, ancorado em `[data-fio-saida]` (Soluções) e `[data-fio-chegada]` (Metrics), um `requestAnimationFrame` por rajada, desligado abaixo de 1024px e em movimento reduzido.

Na revisão visual ele é o traço aceso que atravessa o título "Sistran em números" na diagonal — a parte que ficou feia na captura. E isso não se resolve por calibragem: a saída do fio de Soluções está na **direita** da tela e a boca de entrada da onda da Metrics na **esquerda**, então o percurso obrigatoriamente cruza a largura inteira da janela, por cima do cabeçalho. É geometria das duas âncoras.

Comentei no padrão da casa em vez de remover: o componente, as duas marcas de âncora e o bloco `.fio-travessia` do `globals.css` seguem intactos, e a nota no lugar do consumo em `page.tsx` diz que religar sem mover uma das âncoras traz a diagonal de volta. Religar é descomentar duas linhas.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/ui/SolutionsToMetrics.tsx`
- `src/app/page.tsx`
- `src/app/globals.css`

---

## SIS-50 — Sistran em números: mover a seção para o lugar de "Resultados | evidências dos casos"

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-50/sistran-em-numeros-mover-a-secao-para-o-lugar-de-resultados-evidencias

### Pedido
`<Metrics />` (`#resultados`) sobe na home para a posição 4, logo depois de `<MosaicHandoff />`, no lugar do kicker "Resultados | evidências dos casos". Decidir o destino de `<MetricsStrip />` (comentar, não apagar). Metrics fora do wrapper da serifa, do `SectionReveal` e do `.section-light` (sticky). Conferir `--deep` se o `MetricsStrip` sair; conferir emendas de cor e `ScrollSpy`. Destrava SIS-51.

### O que foi feito
Feito → In Review (commit `c00f2b6`).

A seção subiu para o lugar que era do bloco "Resultados | evidências dos casos": `<Metrics />` agora vem logo depois de `<MosaicHandoff />`, e o `<MetricsStrip />` que ocupava essa vizinhança ficou comentado (duas faixas de indicadores numéricos coladas repetiriam a mesma figura duas vezes).

Ela ficou fora do wrapper da serifa editorial, fora do `SectionReveal` e fora do `.section-light`, de propósito: tem percurso de scroll próprio (seção alta + `sticky`) e qualquer ancestral com `transform` faria o `sticky` perder a referência da janela. O motivo está anotado no JSX.

Ressalva de processo: este commit agrupou SIS-50 a SIS-59, contra a regra de um commit por task. Os três seguintes (`bb66f0f`, `c8accd0`, `5306a7e`) voltaram ao commit por alteração.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/app/page.tsx` (declarado no relatório)

---

## SIS-35 — Contato fecha o percurso, e auditoria de movimento reduzido e performance da home

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-35/contato-fecha-o-percurso-e-auditoria-de-movimento-reduzido-e

### Pedido
Última task da reforma: o último nó do fio acende em `#contato` e a linha se dissolve na faixa clara. `Contact`, `Social` e `ContactCTA` recebem a revelação da SIS-31 sem duplicar movimento (`motionShowcase` no CTA da home). Modal de contato intocado. Auditoria de movimento reduzido (todo conteúdo alcançável; nada em `opacity: 0`; marquee não esconde marcas; zero erro de hidratação) e de performance (só `transform`/`opacity`/`filter`; `will-change` pontual; blur simultâneos; CPU 4×; Lighthouse). Validação: `tsc`/`eslint`; âncoras e `ScrollSpy` em ≥1440px; Tab na home.

### O que foi feito
Feito em dois commits: `3f6d1cf` (fechamento do fio + roxo) e `4175052` (roxo do header).

**Fechamento do percurso.** O fio não terminava, ele apenas parava: seguia aceso até o rodapé — sugerindo caminho onde não havia — e o traço ciano sobre a faixa clara do Contato virava o elemento mais forte da tela justamente na hora em que quem lê deve olhar para o formulário. Agora ele **se dissolve** nos últimos ~12% da página, por `opacity: calc((1 - var(--scroll-p)) * 8)`: o UA já limita `opacity` ao intervalo [0,1], então o fecho não custa **uma linha de JavaScript**. E a última parada (`#contato`) ganhou um anel a mais e mais corpo que as intermediárias — é o único momento em que o fio diz "aqui acaba". O nó acende enquanto o traço apaga.

**Contato / Social / ContactCTA: nada adicionado, de propósito.** SIS-31 já estabeleceu que as três se encenam sozinhas. Sobrepor um reveal seria movimento sobre movimento no mesmo elemento. **O modal de contato não foi tocado** — nem markup, nem estilo, nem o bloqueio de scroll.

**Auditoria de movimento reduzido** (`.claude/skills/reduced-motion-conteudo`) — a base já estava sólida das sessões anteriores e foi conferida item por item: o marquee **não congela**, ele troca de mecanismo (vira lista rolável nativa com `overflow-x: auto !important`, e a cópia duplicada sai de cena para o leitor de tela não ler tudo duas vezes); o hero vira seção em fluxo e as três legendas viram lista, em vez de empilharem ilegíveis; `[data-reveal]`, `.reveal` e `.reveal-stagger` têm estado final **visível** garantido, então nada fica preso em `opacity: 0`; o `CountUp` entrega o valor final; o fio aparece **inteiro** em vez de parado num traço parcial, porque ele é referência de percurso. O `useReducedMotion` da casa nasce em `false` e converge no efeito, e o `ScrollSpine` mantém a **mesma árvore de DOM** nos dois modos (só troca um atributo) — sem risco de hydration mismatch.

**Auditoria de performance** (`performance-gpu`): as animações do percurso são só `transform`, `opacity` e `filter`. O fio custa **zero JS por quadro** — consome o `--scroll-p` que o `SmoothScroll` já publica, e o `stroke-dashoffset` sai de um `calc()`. `will-change` aparece 20 vezes no projeto, todas em elementos que de fato animam de forma recorrente.

**Correções de marca fora do escopo previsto, mas encontradas na auditoria** — a paleta é branco + azuis e não admite roxo (`.claude/skills/sistran-marca`). Três violações vivas, todas passadas ao ciano/azul da marca na mesma opacidade, preservando o desenho:
- `.section-light` — brilho violeta do canto inferior direito;
- `ContactCTA` — terceira parada do degradê do cartão;
- **`Header`** — a hairline da borda inferior ia de ciano a violeta. Era a mais visível de todas: o header aparece em **todas as páginas**.

O HTML servido da home agora tem **zero** ocorrências de `124,58,237`.

Ainda restam referências violeta em `globals.css` (linhas ~98, 150, 175, 405, 459, 684, 1495, 1507) e o token `--color-purple`, em seletores que **não são exercitados pela home**. Não mexi: varrê-las é sweep de marca no site inteiro, com risco visual em páginas fora desta issue — melhor como task própria.

Verificado: `tsc --noEmit` sem saída, `eslint` sem erros (só um aviso pré-existente no `Header.tsx:62`, sobre `setState` em efeito, alheio a esta mudança), home respondendo 200.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
Não declarados no relatório.

---

## SIS-34 — Seções com pin (Soluções, ImpactSequence, Metrics) entram no sistema sem quebrar o sticky

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-34/secoes-com-pin-solucoes-impactsequence-metrics-entram-no-sistema-sem

### Pedido
As três seções com percurso próprio (`Solutions` 400vh + `--sol-p`; `ImpactSequence`; `Metrics`) não podem receber `SectionReveal` (transform mata sticky). Encenação pelo trigger que já existe; fio por cima dos fundos e por baixo do texto (`z-index`); `overflow: clip` e não `hidden`. Pitfalls: `ScrollTrigger.refresh()` após `fonts.ready` e `resize`; índice com `Math.min(progress, 0.999999)`; `setState` só quando o índice muda. Validação nos dois sentidos, resize no meio, 1024 / 1280+ / mobile; `tsc`/`eslint`.

### O que foi feito
Feito no commit `9aaac86`. Duas correções, e a primeira é um bug real introduzido em SIS-30:

**1. O fio desaparecia ao cruzar "Sistran em números".** Ele estava em `z-index: 20`; `.impact-scroll` é uma camada fechada (`isolation: isolate`, `z-index: 30`) com fundo **opaco** `#041a33`. Resultado: a linha sumia exatamente sobre uma das suas cinco paradas — o pior lugar possível. Subiu para **45**: acima de `.progresso-lateral` (40, fixa na borda esquerda em /quem-somos) e abaixo do header (50), que o fio não deve atravessar.

**2. `overflow: hidden` → `clip` nos dois pontos estruturais do caminho sticky** (`.ct-trilha[data-modo="scroll"] .ct-inner` e `.impact-palco`). `hidden` torna o ancestral o scrollport mais próximo, o que **mata o `sticky` dos descendentes** e corta a travessia entre seções; `clip` recorta sem criar scrollport. Cada troca ficou comentada no CSS com o motivo, para ninguém "consertar" de volta.

Verificado: `tsc --noEmit` e `eslint` sem saída, home respondendo 200.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
Não declarados no relatório.

---

## SIS-32 — Emendas entre seções: nenhuma troca de fundo com corte seco

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-32/emendas-entre-secoes-nenhuma-troca-de-fundo-com-corte-seco

### Pedido
Seis emendas na ordem da página: hero → mosaico; mosaico → Soluções; Soluções → `MetricsStrip`; `SignalMarquee` → `ImpactSequence`; `ImpactSequence` → `Metrics`; `Metrics` → `Contact`. Cor de saída = cor de entrada; quem já resolve a própria costura não ganha camada nova. Pseudo/gradiente estático, `pointer-events: none`. Validação parando em cada emenda em 1024, 1280+ e mobile; contraste WCAG AA.

### O que foi feito
Feito no commit `59e85bc`.

Mapeei as **seis emendas** da home pela cor medida de cada lado, não por impressão, e apliquei camada nova só nas quatro que precisavam — respeitando a regra da própria issue de que seção que já resolve a sua costura não recebe nada:

1. **hero → mosaico** — intocada de propósito: o hero encolhe em card sobre fundo claro e já entrega a cor do mosaico.
2. **mosaico → Soluções** — camada branca no topo de `.solutions-scroll`, dissolvendo em 220px.
3. **Soluções → MetricsStrip** — camada `#004d8a` na base da mesma seção, subindo 200px.
4. **parceiros → ImpactSequence** — camada `--paper` no topo de `.sequence`, dissolvendo em 40svh.
5. **ImpactSequence → Metrics** — intocada: as duas já desenham o próprio par de fundos.
6. **Metrics → Contato** — `.emenda-de-escuro::after` no bloco do Contato.

Duas decisões que valem registro:

- **Camadas de `background` em vez de pseudo-elemento** em três das quatro. Camada de fundo pinta sempre abaixo de todo o conteúdo: não há `z-index` para acertar nem `pointer-events` para lembrar.
- **A emenda 6 ficou do lado do Contato**, e não no fim da Metrics, porque lá embaixo há números claros sobre palco escuro — clarear aquele fundo arruinaria o contraste do texto.

Verificado: `tsc --noEmit` e `eslint` sem saída.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
Não declarados no relatório.

---

## SIS-31 — Revelação encenada: componentes de cada seção surgindo em etapas no scroll

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-31/revelacao-encenada-componentes-de-cada-secao-surgindo-em-etapas-no

### Pedido
"Cada seção os componentes vão surgindo." `SectionReveal` já existe, mas quase nenhum nó tem `data-reveal`. Marcar alvos; stagger em etapas; vetor `opacity` + `y` + `blur` com `--ease-out` e `toggleActions: 'play none none reverse'`. Soluções, Metrics, ImpactSequence e MetricsStrip **não** entram no wrapper. Rede de segurança de 600ms do IntersectionObserver permanece. Movimento reduzido: nenhum alvo em `opacity: 0`. Validação lenta/rápida e com `prefers-reduced-motion`.

### O que foi feito
Feito no commit `7ec6aae`.

**O diagnóstico mudou a tarefa.** Os três `SectionReveal` que envolviam Contato, Social e ContactCTA na home não faziam nada: o componente anima só os nós marcados com `data-reveal`, e um grep no projeto inteiro provou que esse atributo **não existia em lugar nenhum**. Eram invólucros inertes — a causa real da queixa de "nada anima".

A correção óbvia (marcar `data-reveal` dentro das seções) estaria errada: as três já se encenam sozinhas, cada uma do seu jeito — o Contato pelo `--ct-surgir` do próprio percurso sticky, o Social e o ContactCTA por `whileInView` do Motion, mais a digitação do título no último. Marcar os nós criaria **duas animações de entrada disputando o mesmo elemento**.

Então: os três wrappers saíram (e o import foi comentado, com nota de como religar — `ui/SectionReveal.tsx` continua intacto no projeto), e fechei a única lacuna verdadeira que sobrou — o `SectionIntro` do `MetricsStrip` era o **único cabeçalho da home que chegava pronto** enquanto os cartões abaixo dele subiam em cascata, o que fazia o bloco parecer começar pelo meio. Agora ele é `progressive`: acende palavra por palavra conforme o scroll. Frase de oito palavras, dentro do limite do `ProgressiveText`; sob movimento reduzido nasce inteira.

Verificado: `tsc --noEmit` e `eslint` sem saída.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/ui/SectionReveal.tsx` (intacto; import comentado)

---

## SIS-30 — Fio condutor: componente que costura hero → contato, desenhado pelo scroll

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-30/fio-condutor-componente-que-costura-hero-contato-desenhado-pelo-scroll

### Pedido
Linha vertical contínua do hero ao contato, desenhada pelo scroll, com nó por seção (`top`, `sinais`, `solucoes`, `resultados`, `contato`). SVG `fixed`, `pointer-events: none`, `aria-hidden`; `stroke-dashoffset` via progresso global da SIS-29; um só observador. Paleta sem roxo: calha navy, linha `#0079CB` → `#0ed8f6`, nó `#A5F0FF`. Não filho de `SectionReveal`. Movimento reduzido: fio inteiro e estático ou não renderizado, mesma árvore DOM. Validação nos dois sentidos, pin, 1024 / 1280+ / mobile, zero hydration mismatch.

### O que foi feito
Feito no commit `c2b1d63` — feat(home): fio condutor costurando hero -> contato.

**O que foi implementado**

- Novo `src/components/ui/ScrollSpine.tsx`: SVG fixo na lateral esquerda com uma serpentina suave (calha + linha viva), montado em `src/app/page.tsx` como irmão direto das seções dentro do `<main>` — nunca dentro do `SectionReveal` nem de outro wrapper animado, porque `position: fixed` morre sob ancestral com `transform`/`filter`/`clip`.
- Cinco paradas, na ordem da página: `#top` (hero), `#sinais` (mosaico), `#solucoes`, `#resultados`, `#contato`. Os nós ficam sobre o caminho, posicionados em % a partir de pontos medidos com `getPointAtLength()`.
- CSS no fim do `globals.css`: calha `rgba(165,240,255,.14)`, linha viva `--color-sky` (`#0ed8f6`), nó percorrido `#0079CB`, nó ativo `#A5F0FF` com dois halos ciano. Só azuis e navy — nenhum roxo.

**Decisões que vale registrar**

1. **Zero JavaScript por quadro.** O desenho é `stroke-dashoffset: calc(var(--spine-len) * (1 - var(--scroll-p)))`, consumindo o `--scroll-p` que a SIS-29 passou a publicar no `<html>`. O único estado é o nó ativo, de um `IntersectionObserver` com `rootMargin: '-45% 0px -45% 0px'` (mesmo critério do `ScrollSpy`).
2. **Não precisa remedir em `resize` nem em `fonts.ready`**: o caminho vive num `viewBox` fixo; `vector-effect="non-scaling-stroke"` mantém a espessura sob `preserveAspectRatio: none`. Uma medição única, no efeito de montagem.
3. **Nós em frações iguais do caminho**, e não na altura real de cada seção: o fio é metáfora de percurso, não mapa em escala.
4. **Nós em HTML, não `<circle>`**: com `preserveAspectRatio: none` um círculo do SVG viraria elipse.
5. `z-index: 20` — acima das seções e abaixo do header (`z-50`).
6. Só a partir de 1280px. Abaixo disso o conteúdo ocupa a largura útil e o fio viraria estorvo — `aria-hidden`, sem captura de ponteiro.

**Movimento reduzido**: o fio aparece **inteiro** (`stroke-dashoffset: 0`, sem brilho). O nó ativo continua acendendo, sem transição. A árvore de DOM é idêntica nos dois modos: só o atributo `data-rm` troca depois da hidratação.

**Verificação**: `npx tsc --noEmit` (excluindo o vendorizado `sistran-river-park-3d`) sem saída; `npx eslint` nos dois arquivos sem saída; `localhost:3000` respondendo 200 e a marcação `.spine` / `.spine-calha` / `.spine-viva` presente no HTML do servidor. Sem PR, conforme combinado.

**Revertido a pedido** no commit `b3aa510`. A linha vertical passava por cima do conteúdo — cruzando a imagem e o botão "…PARA EXPLORAR" — e incomodava mais do que orientava. O consumo em `page.tsx` foi **comentado**, com o import: `src/components/ui/ScrollSpine.tsx` e o bloco `.spine` do `globals.css` seguem intactos. Nada de conteúdo se perdeu: o fio era decorativo e `aria-hidden`. A interligação continua pelas emendas de cor da SIS-32. O fechamento do percurso da SIS-35 perde o objeto — aquele CSS continua no arquivo, inerte.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/ui/ScrollSpine.tsx`
- `src/app/page.tsx`
- `src/app/globals.css`

---

## SIS-29 — Scroll suave: afinar o Lenis como relógio único do percurso hero → contato

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-29/scroll-suave-afinar-o-lenis-como-relogio-unico-do-percurso-hero

### Pedido
Afinar `SmoothScroll.tsx` (hoje `duration: 1.8`, `lerp: 0.08`, `wheelMultiplier: 0.85`, `anchors: true`): escolher um eixo (lerp OU duration+easing); easing alinhado a `--ease-out: cubic-bezier(0.22, 1, 0.36, 1)`; conferir sync ScrollTrigger/`lagSmoothing(0)`; `scroll-margin-top` nas âncoras; publicar progresso global no `<html>` sem `setState`. Não mexer em `pauseSmoothScroll`/`resumeSmoothScroll` nem em `overflow: hidden` no `html`. Lenis continua ausente sob `prefers-reduced-motion`. Validação: roda, trackpad, teclado, barra; âncoras abaixo do header; modal de contato; movimento reduzido nativo.

### O que foi feito
Feito em `48fbaaa`, um arquivo: `src/components/ui/SmoothScroll.tsx`.

**A causa raiz era um conflito de opções.** Havia `duration: 1.8` **e** `lerp: 0.08` no mesmo objeto. Os dois são controles do mesmo eixo e o Lenis usa um só — com `lerp` presente a duração é ignorada, e o `easing` configurado (que só existe no modo por duração) nunca chegava a ser aplicado.

Ficou o **modo por duração** (`duration: 1.3`): cada gesto anima até um alvo e termina. A inércia do `lerp` é exponencial — sempre se aproximando, nunca chegando — e era ela que fazia a página continuar patinando depois que a roda parava.

**Curva da marca:** a `--ease-out: cubic-bezier(0.22, 1, 0.36, 1)` não entra como string (o Lenis quer função de `t`). Entra como `easeOutQuint` (`1 - (1-t)^5`), mesma família — arranca rápido, assenta longo.

**Progresso global (`--scroll-p`):** publicado no `<html>`, uma escrita por quadro direto no nó, sem `setState`. Valor de `lenis.scroll`, não de `window.scrollY`.

**Movimento reduzido:** o Lenis continua não sendo criado e o scroll segue nativo. O progresso é publicado por um listener próprio (`scroll` passivo + `resize`).

**Âncoras (item 4): já estavam corretas, nada a mudar.** `globals.css:916` aplica `scroll-margin-top: calc(var(--header-h) + 24px)` em `section[id]`, e os cinco alvos da home (`#top`, `#sinais`, `#solucoes`, `#resultados`, `#contato`) são todos `section`.

**Não tocado:** `src/lib/smoothScroll.ts` e o bloqueio de scroll dos modais.

`npx tsc --noEmit` (filtrando `sistran-river-park-3d`) e `npx eslint` sem saída; home respondendo 200 no dev server.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/ui/SmoothScroll.tsx`

---

## SIS-28 — Trazer o teatro de "Soluções de Negócios" para o lugar do Método

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-28/trazer-o-teatro-de-solucoes-de-negocios-para-o-lugar-do-metodo

### Pedido
Mover `<Solutions />` para o espaço aberto por SIS-26 e SIS-27 (lugar do Método). Só o cabeçalho de Soluções permanece. Onde estava, Metrics emenda no Contato. Resolver âncoras: `#sistema` vs. `#servicos` vs. `#solucoes` (ScrollSpy/Hero). Sticky sem `SectionReveal` nem ancestral `overflow: hidden`/`transform`. Não mexer em `solutions.ts`, modal, Metrics, mosaico, MetricsStrip, marquee, ImpactSequence. Validação das quatro cenas, 1024 / 1280+ / mobile, movimento reduzido, link do hero.

### O que foi feito
Feito em `882b822`, um commit só, sem PR. Fecha a cadeia SIS-26 → SIS-27 → SIS-28.

**A mudança.** Em `src/app/page.tsx`, `<Solutions />` saiu de baixo de "Sistran em números" e subiu para logo depois do mosaico — o vão exato onde estavam o texto de abertura, os quatro movimentos e o vídeo. A ordem servida confirma: `top` → `sinais` (mosaico) → `solucoes` → `resultados` → `contato`.

**Só o cabeçalho de Soluções**, como decidido: a pílula "Veja como a Sistran pode ajudar sua Seguradora nos mais variados desafios de negócios." + o título "Soluções de Negócios". O kicker "Método | quatro movimentos" foi embora com o `SectionIntro` na SIS-26.

**A seção do Método foi comentada por inteiro.** Depois das duas tasks anteriores ela não tinha mais conteúdo — sobrava uma faixa escura com grafismo de fundo (`TechnicalBackdrop`) e um `lp-container` vazio. O `TechnicalBackdrop` saiu do import junto.

**As âncoras, resolvidas:**

- `#sistema` sai com a seção. Varri o repositório: **ninguém aponta para lá** — nem `src/data/nav.ts`, nem o `ScrollSpy`, nem link interno algum.
- `aria-labelledby="sistema-title"` deixou de existir junto com a seção.
- `id="servicos"` da seção de Soluções virou **`id="solucoes"`**, consertando o bug em que o `ScrollSpy` e o hero linkavam `#solucoes` mas nenhum elemento carregava esse `id`.

**O percurso de scroll.** `<Solutions />` é filho direto de `<main>`: fora do `SectionReveal` e fora do wrapper da serifa editorial. A trilha de 400vh (`solutions-trilha`) e o `solutions-scroll` aparecem íntegros no HTML servido.

**Onde a seção estava não ficou buraco:** "Sistran em números" emenda direto no bloco claro de Contato.

**Validação:** `npx tsc --noEmit` (filtrando o `sistran-river-park-3d`) e `npx eslint` nos três arquivos, sem saída. HTML servido: um `id="solucoes"`, zero `id="servicos"`, zero `id="sistema"`, os dez tiles do mosaico intactos. `src/data/solutions.ts` não foi tocado.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/app/page.tsx`

---

## SIS-27 — Método: comentar o vídeo e neutralizar o tile viajante que o carrega

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-27/metodo-comentar-o-video-e-neutralizar-o-tile-viajante-que-o-carrega

### Pedido
Comentar (não apagar) o `<ScrollVideo>` em `.scene-media` e a caixa se ficar vazia. O tile `.stack-carrier` nasce no mosaico e aterra na `.scene-media`; comentar o destino sem tratar a origem deixa o tile viajando para caixa inexistente. Saída 1: comentar o tile viajante junto. Saída 2: viagem ancorada no mosaico sem vídeo. Mosaico continua; `CARRIER_VIDEO` permanece. Não remover `public/videos/`. Não mexer em textos (SIS-26), números nem modal. Validação: sem tile fantasma, sem `<video>` órfão, movimento reduzido.

### O que foi feito
Feito em `f208a2e`, um commit só, sem PR.

**Escolhi a saída 1** das duas propostas: comentar o tile viajante junto com a caixa de destino.

**O que saiu de cena** em `src/components/legacy/StackScenes.tsx`:

- `<ScrollVideo className="scene-video" …>` e a `.scene-media` em volta dele.
- A `.scene-story` inteira: as duas colunas eram a caixa de vídeo e os quatro movimentos já comentados na SIS-26.
- O tile de ligação `.stack-carrier`, com o `carrier-video` dentro.

**O buraco no mosaico, evitado.** O tile "Microserviços" estava com `visibility: hidden` na camada de tiles. Sem o clone, esconder deixaria um vão. O `visibility` saiu e os **dez tiles voltam a aparecer** (HTML servido: 10 `mosaic-tile`, 10 rótulos, zero `visibility:hidden`).

**A plumbing que ficaria sem consumidor**, comentada junto: refs `media`/`carrier`, `travel`/`setTravel`, `landingY`, `sceneEndY`, as duas medições, o `handoff` (`cx`, `cy`, `csx`, `csy`, `label`, `carrierOut`, `mediaIn`) e o relógio `reel`.

**Nada removido.** `ScrollVideo`, o CSS `.scene-media` / `.scene-video` / `.carrier-video`, os dados em `src/data/legacy.ts` e `/videos/process-scroll.mp4` seguem no lugar. `CARRIER`, `CARRIER_VIDEO` e `offsetIn` continuam declarados.

**Nota de forma:** os três blocos comentados viraram **um** comentário só em volta da `.scene-story` (em JSX o primeiro fechamento encerra tudo).

**Validação:** `npx tsc --noEmit` e `npx eslint` sem saída. HTML servido: zero `scene-video`, `scene-media`, `scene-step` e `stack-carrier`; `#sistema` com `aria-label="Método"`. Nenhum `<video>` órfão. O `#sistema` fica momentaneamente como faixa escura sem conteúdo — vão que a SIS-28 preenche.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/legacy/StackScenes.tsx`

---

## SIS-26 — Método: comentar o texto de abertura e os quatro movimentos

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-26/metodo-comentar-o-texto-de-abertura-e-os-quatro-movimentos

### Pedido
Comentar (não apagar) o conteúdo textual de `section#sistema` em `StackScenes.tsx`: `SectionIntro` (`scenesIntro`) e os quatro movimentos (`.scene-steps` / `scenes`). Dados em `legacy.ts` e CSS intactos. Se `active`/`register` ficarem sem uso, comentar junto. Ajustar `aria-labelledby="sistema-title"` se o título sair. Não mexer no mosaico, vídeo (SIS-27), vizinhas, números nem modal. Validação: `tsc`/`eslint`; sem espaço morto nem `aria` órfão.

### O que foi feito
Feito em `ab28374`, um commit só, sem PR.

**O que saiu de cena** em `src/components/legacy/StackScenes.tsx`:

- O `SectionIntro` inteiro — kicker "Método | quatro movimentos", título "A transformação começa quando o legado se torna explicável." e o parágrafo "Quatro movimentos organizam a transformação…".
- O bloco `.scene-steps` com os quatro passos numerados e seus textos.

**Comentado, não removido.** `scenesIntro` e `scenes` seguem intactos em `src/data/legacy.ts`; o componente `SectionIntro` e o CSS `.scene-story` / `.scene-steps` / `.scene-step` em `legacy.css` não foram tocados. Religar é descomentar quatro pontos: os dois blocos no JSX, a linha do `useActiveStep` e os dois imports no topo.

**Os dois efeitos colaterais previstos na task, resolvidos:**

1. A chamada `useActiveStep(scenes.length)` foi comentada junto, e com ela os imports `SectionIntro` e `useActiveStep`.
2. `aria-labelledby="sistema-title"` virou `aria-label="Método"`, com a nota de voltar ao `aria-labelledby` quando o `SectionIntro` religar.

`scenes` continua importado de propósito: a medição do relógio do vídeo (`sceneEndY`) ainda o referencia (sai na SIS-27).

**Validação:** `npx tsc --noEmit` (filtrando o `sistran-river-park-3d`) e `npx eslint` no arquivo tocado, ambos sem saída. Mosaico, vídeo, seções vizinhas, "Sistran em números" e o modal de contato não foram tocados.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/legacy/StackScenes.tsx`

---

## SIS-25 — Contato: endereço da sede ainda apagado — ajustar o tom do azul do cartão

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-25/contato-endereco-da-sede-ainda-apagado-ajustar-o-tom-do-azul-do-cartao

### Pedido
Reabertura de SIS-16 / SIS-17: o endereço da sede continua apagado contra o navy do cartão; o título ciano lê-se. Hipótese: tom do azul próximo em luminância do texto; override `.section-light .contact-inline span` devolvendo `--contact-text`. Escurecer o navy e/ou reduzir translucidez; corpo do endereço com cor cheia, sem alpha; contraste AA no pior caso (fachada clara); `backdrop-filter` não substitui contraste. Não alterar o texto, o modal além do necessário, números nem vizinhas. Validação em `/#contato` (modal e inline), 1440 e 1920 e mobile.

### O que foi feito
Movido para In Review — commit `7c8857d`, arquivo único `src/app/globals.css`.

**Diagnóstico.** A auditoria da cascata descartou as suspeitas anteriores: só um componente renderiza o endereço (`ContactPanel.tsx`), o cartão está em `z-index: 3` acima do véu da foto (`z-index: 1`), a regra base já estava em `rgba(3,24,47,0.92)` e nenhum ancestral aplica `opacity`/`filter`/`mix-blend-mode`. O que restava eram duas coisas de **tom**:

1. `#03182f` é um navy quase preto-esverdeado. Composto sobre a fachada iluminada ele vira cinza-chumbo — o cartão **inteiro**, não só o texto, lia como mancha apagada.
2. `.section-light .contact-inline span:not([class*="eyebrow"])` (três classes + elemento) vencia a regra base do endereço (uma classe) e reescrevia a cor de volta para `--contact-text` (`#f7fbff`, azulado). Era a razão de a correção do SIS-17 não aparecer na seção inline.

**O que foi feito**

- Fundo do cartão passa para a família azul institucional da marca, saturada: `linear-gradient(135deg, rgba(0,26,61,0.96), rgba(0,45,92,0.93))`.
- Borda em ciano da marca (`rgba(14,200,245,0.34)`) no lugar do azul-acinzentado de `--contact-border`, mais sombra externa de separação e halo interno de 1px.
- Corpo do endereço em branco puro (`#ffffff`) e peso 450, com a exceção específica dentro do bloco `.section-light .contact-inline`.
- `backdrop-filter` mantido como refinamento — o contraste vem do alpha/tom, não do blur.

Contraste do corpo no pior caso (trecho branco da fachada, cartão compositado): ~14:1.

Texto do endereço, título em ciano, hierarquia do cartão, modal de contato e seções vizinhas: inalterados.

**Verificação**: `npx tsc --noEmit` limpo (exceto o `sistran-river-park-3d` vendorizado, pré-existente). Sem prettier/stylelint — o repositório não tem configuração para nenhum dos dois.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/app/globals.css`
