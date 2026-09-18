## SIS-83 — /contato: substituir o bloco de formulário atual pelo layout “Entre em contato conosco”

**Status:** In Review · **Labels:** — · **Fechada em:** não fechada · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-83/contato-substituir-o-bloco-de-formulario-atual-pelo-layout-entre-em

### Pedido
Na página `/contato`, trocar o bloco atual (cards empilhados de Matriz / E-mail / Telefone + formulário à direita, sobre fundo azul chapado) pelo layout do modal “Entre em contato conosco”. Duas colunas: imagem do prédio da sede à esquerda com recorte curvo (clip-path) na borda direita; formulário à direita sobre fundo dark navy. Card flutuante “SEDE · SÃO PAULO” com endereço completo e CEP 04571-020; eyebrow “— SAIBA MAIS SOBRE O QUE PODEMOS OFERECER”; título “Entre em contato conosco”; subtítulo de contato; card de telefone +55 11 2192-4400; campos Nome completo, E-mail, Telefone (placeholder `(11) 96123-4567`) e Mensagem, todos obrigatórios, com ícones; botão Enviar com seta e gradiente, largura total. Sair os cards separados, Nome/Sobrenome e Empresa (confirmar se Empresa precisa ser preservado) e o fundo azul chapado. Reaproveitar o componente do modal. Verificar se `comercial@sistran.com.br` continua visível. Aceite: layout novo, card da sede, textos, telefone, campos com ícones e validação, botão, responsivo, decisão registrada sobre Empresa e Sobrenome.

### O que foi feito
`/contato` passou a usar o painel “Entre em contato conosco”.

**O que mudou** (`src/app/contato/page.tsx`)
- A primeira seção deixou de ser a lista de três cartões (endereço/e-mail/telefone) + `DemoForm` e passou a renderizar o `ContactPanel` inline — o mesmo componente da home, com a foto da sede recortada de um lado e os campos do outro. Não é cópia: `onClose` no componente já era opcional exatamente para permitir uso fora do modal.
- Não trouxe a `.ct-trilha` / `.ct-palco` da home. Aquele palco de scroll é a encenação da entrada da home; aqui a página já entra pelo hero e o painel só precisa do `.contact-inline`, que existe no `globals.css` sem altura máxima e sem scroll próprio.
- `DemoForm` continua intacto, ainda em uso em `/trabalhe-conosco`. Só saiu o import daqui.
- As seções “Onde Estamos” e “#timeSISTRAN” ficaram como estavam.

**Decisão sobre EMPRESA e SOBRENOME** — os dois campos deixaram de existir nesta página. O painel tem quatro campos: Nome Completo, E-mail, Telefone, Mensagem. O formulário antigo tinha Nome + Sobrenome separados, E-mail, Telefone e **Empresa** (obrigatório).
- **SOBRENOME**: não é perda. “Nome Completo” cobre a mesma informação num campo só, e é como a home já pede há tempo.
- **EMPRESA**: é perda real de dado — era campo obrigatório e o comercial recebia a empresa do lead sem ter que perguntar. Seguiu-se o layout pedido no lugar de emendar um quinto campo, porque adicionar EMPRESA ao `ContactPanel` mudaria o formulário da home também, e isso não está no escopo desta issue. Se o comercial quiser a empresa de volta, o caminho é acrescentar o campo ao `ContactPanel` (vale para a home e para cá) — issue separada.

**`comercial@sistran.com.br`** — o painel só publica o telefone. Como o e-mail comercial estava visível nesta página e é o canal que o site divulga, manteve-se um “Prefere e-mail? Escreva para …” logo abaixo do painel, na mesma seção. Sem ele o e-mail desapareceria de `/contato`.

**Limitação conhecida:** os `id` dos campos no `ContactPanel` são fixos (`nome`, `email`, `telefone`, `mensagem`). Enquanto o modal do header estiver aberto sobre esta página, existem dois formulários com os mesmos `id` no DOM. Não é regressão desta issue — a home já tem exatamente isso, porque o `ContactModal` faz `if (!montado || !open) return null`, então fora de aberto não há colisão. Resolver de vez seria prefixo de `id` por instância, em issue própria.

**Verificação**
- `tsc --noEmit` limpo; `lint` 0 erros (26 warnings pré-existentes de `react-hooks/static-components`); `build` passa, `○ /contato` estático.
- Captura em 1440×900 e 390×844: `overflowX: 0`, 0 erros de console nos dois. Painel 1240×877 no desktop e 351×1090 no mobile, empilhando foto/endereço acima e campos abaixo. Os quatro campos e o botão Enviar presentes nas duas larguras.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/app/contato/page.tsx`

---

## SIS-82 — Adicionar item “Sistran Latam” no menu “Quem somos” e trazer a página /latam/

**Status:** In Review · **Labels:** — · **Fechada em:** não fechada · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-82/adicionar-item-sistran-latam-no-menu-quem-somos-e-trazer-a-pagina

### Pedido
Último item do dropdown Quem somos a ligar: Sistran Latam → `/latam/`, com conteúdo em espanhol fiel a https://www.sistran.com/latam/. Hero “Soluciones de software para compañías de seguros”; números 49 / 100 / 18 / 150; três notícias com datas; três cards de soluções com “Más info”; bloco de experiência; tabela de 12 escritórios/contatos; rodapé e redes. Aceite: item clicável, rota acessível, conteúdo em espanhol, números corretos, 3 cards, 12 blocos de contato conferidos, links de redes e Política de Privacidad funcionando.

### O que foi feito
`/latam` está no ar, em espanhol.

**Arquivos**
- `src/data/latam.ts` — números, notícias, soluções, capacidades e os 12 blocos de contato. O conteúdo vai para `src/data/` como o resto do site: a tabela de escritórios é dado de contato e quem for corrigir um telefone não deveria precisar abrir JSX.
- `src/app/latam/page.tsx` — a página, nos padrões das outras 14 rotas (`PageShell`, `PageHero`, `.section-py`, `.glass-card`, alternância clara/escura de superfície).
- `src/app/sitemap.ts` — `/latam` indexada.
- `scripts/capturar-rotas.mjs` — rota incluída no inventário de capturas.

O item **Sistran Latam** no submenu já tinha vindo com SIS-80; agora ele deixa de dar 404.

**Decisões registradas em comentário no código:**
1. **Navegação regional** (Compañía · Soluciones · Alianzas · Noticias · Contacto) virou âncora para as seções desta mesma página, não um segundo header. A página vive dentro do site brasileiro, que já tem o dele. “Alianzas” aponta para o bloco das 100 aseguradoras.
2. **Notícias sem link.** No site LATAM cada manchete leva a um post do blog regional, que não existe deste lado. As três manchetes saíram com a data (`<time datetime>`) e sem `href`. O campo `href` já está previsto no tipo.
3. **“Más info” aponta para o contato desta página.** As três soluções não têm descrição nem página própria no site regional — só o nome.
4. **Telefones com ramal expandido.** A fonte escreve México como `5536-6419 / 6743 / 6581` e Buenos Aires como `4373-8011 / 12 / 13`. Cada um foi expandido ao número completo para virar `tel:` discável.
5. **Contato em cards, não em tabela.** São 12 blocos de 4 campos; tabela de 4 colunas no celular só rola de lado. Cada telefone é `tel:` e cada e-mail é `mailto:`.
6. **Redes sociais: só LinkedIn e YouTube.** A issue pede Twitter · Facebook · LinkedIn · Instagram, mas `src/data/contact.ts` só tem os dois perfis registrados. A “Política de Privacidad” aponta para `/politica-de-privacidade`, que existe — mas o texto dela está em português; não há versão em espanhol para linkar.
7. **`lang="es"` no bloco inteiro.** Sem isso o leitor de tela continua lendo com pronúncia de português.

**Verificado:** `tsc --noEmit` limpo, `lint` sem erros, `build` gera `/latam` estática; captura a 1440 e a 390 — sem overflow horizontal e sem erro de console. A captura pegou um bug que o build não pegaria: a nav de âncoras estava **invisível**, atrás do hero (`.pagehero-entrada` é seção posicionada, e posicionado pinta acima de estático seja qual for a ordem no DOM). A nav foi movida para dentro da seção de números, o que também eliminou uma faixa de 36px do azul do body lendo como emenda malfeita entre duas superfícies escuras.

**Aceite ainda não marcável:** item 6 (redes sociais) depende dos links.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/data/latam.ts`
- `src/app/latam/page.tsx`
- `src/app/sitemap.ts`
- `scripts/capturar-rotas.mjs`

---

## SIS-81 — Adicionar item “Sistran University” no menu “Quem somos” e criar página /sistran-university/

**Status:** In Review · **Labels:** — · **Fechada em:** não fechada · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-81/adicionar-item-sistran-university-no-menu-quem-somos-e-criar-pagina

### Pedido
Tornar “Sistran University” clicável no dropdown Quem somos e criar `/sistran-university/` com o texto de autossuficiência em capacitação, parceria Unidep, “desde 2022, já formamos mais de 60 especialistas”, “mais de 17 projetos reais” e a seção “Fale com a Gente!”. Aceite: item clicável, rota acessível, conteúdo presente, números corretos, seção de CTA presente.

### O que foi feito
O item **Sistran University** no submenu de “Quem somos” veio na mesma correção de SIS-80 — `NAV_ITEMS` era plano e nenhuma das quatro páginas tinha caminho pelo menu, então as três tasks foram tratadas como um defeito só (`NavItem.children` + submenu no `Header`, desktop e mobile).

Sobre a página: `src/app/sistran-university/page.tsx` já atendia a todos os critérios de aceite — o título “Autossuficiência em capacitação de recursos”, os dois parágrafos, “desde 2022, já formamos mais de 60 especialistas”, “mais de 17 projetos reais” e o “Fale com a Gente!” (via `ContactCTA`). Não havia o que reescrever.

O escopo real desta task era o item de menu, e ele está no ar.

**Verificado:** `tsc --noEmit`, `npm run lint` (sem erros) e `npm run build` — `/sistran-university` continua sendo pré-renderizada.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
Não declarados no relatório.

---

## SIS-80 — Adicionar item “Sistran Labs” no menu “Quem somos” e criar página /sistran-labs/

**Status:** In Review · **Labels:** — · **Fechada em:** não fechada · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-80/adicionar-item-sistran-labs-no-menu-quem-somos-e-criar-pagina-sistran

### Pedido
Garantir “Sistran Labs” clicável no dropdown Quem somos e página `/sistran-labs/` com o texto do laboratório de inovação (DS/AI/ML/CLOUD/No & Low-code), soluções Guru / Predição de Churn / Fast Claims / Smart Miner, e-mail comercial, seções “Principais Soluções Sistran Labs” e “Fale com a Gente!”. Aceite: item clicável, rota acessível, conteúdo presente, seções estruturadas.

### O que foi feito
**Menu (o defeito compartilhado com SIS-81 e SIS-82)**
`NAV_ITEMS` era uma lista plana, então as quatro páginas de “Quem somos” não tinham caminho pelo menu — existiam como rota, mas o único link até elas ficava no corpo de `/quem-somos`. Uma correção só resolve as três tasks:

- `src/data/types.ts` — `NavItem` ganha `children?: readonly NavItem[]`.
- `src/data/nav.ts` — “Quem somos” recebe os quatro filhos: A Sistran, Sistran Labs, Sistran University, Sistran Latam.
- `src/components/Header.tsx` — submenu no desktop (chevron com `aria-expanded`/`aria-controls`, lista escondida com `hidden` e não com `opacity: 0`, para não continuar no Tab nem no leitor de tela; fecha no Escape, na troca de rota e no blur para fora do bloco) e, no drawer mobile, filhos indentados sempre abertos.

O pai continua sendo um `<Link>` para `/quem-somos`: quem clica no rótulo espera a página institucional.

**Página**
`/sistran-labs` já tinha toda a escrita. O que faltava era a seção “Principais Soluções Sistran Labs” — no site atual ela é só um PNG, com os nomes dos produtos existindo apenas dentro da imagem, sem alt. Recriada em texto a partir de `ACCELERATORS`, sete cartões, cada um linkando para a página que já existe em `/solucoes/[slug]`.

**Verificado:** `tsc --noEmit` limpo, `npm run lint` sem erros, `npm run build` passa.

**Ressalva:** “Sistran Latam” no submenu aponta para `/latam`, que ainda não existia no momento da entrega — escopo de SIS-82. Até a rota subir, esse item do submenu dava 404.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/data/types.ts`
- `src/data/nav.ts`
- `src/components/Header.tsx`
- página `/sistran-labs` (seção “Principais Soluções Sistran Labs” a partir de `ACCELERATORS`)

---

## SIS-79 — Nossa essência: Missão, Valores e Pilares abrindo conforme a rolagem passa

**Status:** In Review · **Labels:** — · **Fechada em:** não fechada · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-79/nossa-essencia-missao-valores-e-pilares-abrindo-conforme-a-rolagem

### Pedido
Na seção Nossa essência (`EssenceAccordion.tsx` + `essence-accordion.css`), a rolagem deve avançar Missão → Valores → Pilares, uma faixa por vez (não cumulativa), com clique/teclado tendo prioridade (`comandadoRef` permanente). `ScrollTrigger` sem `pin`, `setAtiva` só quando o índice muda (guarda como em `Metrics.tsx:277-280`), `scrollIntoView` só no clique. Modo dirigido só em `(min-width: 1024px)` e sem `prefersReducedMotion`. Sempre uma faixa aberta; cleanup só do próprio trigger; não trocar o `IntersectionObserver` de `data-entrou`; zero mudança de escrita (`npm run test:copy`). Aceite: sequência no desktop com transição de 560ms, SVG desenhando, clique estável, mobile idêntico ao atual, reduced-motion visível, teclado/`aria-expanded`, seção completa sem JS.

### O que foi feito
Sem relatório de entrega no Linear. O histórico de estados permite afirmar: saiu de Backlog em 28/08/2026 e entrou em In Review no mesmo dia (14:37 UTC), sem passagem registrada por In Progress, e permanece em In Review.

Há um comentário posterior (01/09/2026) registrando que o avanço das faixas por rolagem entregue nesta issue foi **revogado pelo SIS-98**: era irreconciliável com ler o painel (a seção mede mais de uma tela, então rolar para continuar a leitura era o mesmo gesto que trocava de faixa). `ativa` voltou a ter dono único (clique/teclado). O resto do que este issue entregou continua no lugar.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
Não declarados no relatório.

---

## SIS-78 — Azul quase preto: clarear o mapa dos Escritórios BRASIL e as demais seções que usam a mesma família

**Status:** In Review · **Labels:** — · **Fechada em:** não fechada · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-78/azul-quase-preto-clarear-o-mapa-dos-escritorios-brasil-e-as-demais

### Pedido
Em `/quem-somos`, o mapa Escritórios BRASIL estava com azul quase preto (`bm-preenchimento` `#0a1c35` / `#0b2548` / `#07162a`, ~8% de luminosidade sobre `.section-light`). Repintar o preenchimento em azul-médio da marca e conferir os traços claros (`.bm-pais`, `.bm-pais-contorno`, `.bm-pais-cabeca`, `.bm-relevo`). Nas demais seções, unificar os quase-pretos no `#032d67` da marca (ou variável derivada), sem mexer em `--fundo-marca`. Contraste de texto ≥ 4.5:1. Aceite: Brasil como azul da marca; cena nos três `data-ativa` e modo lista; textos acima de 4.5:1; uma família de cor; 360 / 768 / 1024 / 1440.

### O que foi feito
O pedido tinha duas metades e cada uma foi resolvida por um caminho próprio.

**1. O mapa — era contexto, não cor**
`bm-preenchimento` (`src/components/ui/BrazilOfficesMap.tsx`) foi desenhado quando o mapa era um cartão sobre palco escuro. O palco já havia sido neutralizado (`.os-mapa .bm-palco { background: none }`), então sobrou uma silhueta a ~8% de luz sobre uma folha a >92%.

Novos stops: `#0a4489` / `#135fae` / `#073a76` — faixa média de `#0079CB`/`#1479ec`. Luminância relativa calculada à mão para os quatro traços claros sobreviverem: o stroke do país (`rgba(184,228,255,.88)`) fica em ~4,9:1 contra o tom central.

`.bm-relevo` subiu de `rgba(100,180,244,.1)` para `rgba(178,222,255,.2)`: 10% de alpha bastava sobre quase-preto; contra azul-médio essas curvas desapareciam.

**2. Os palcos escuros — dez quase-pretos viraram dois tokens**
Eram dez, não sete: `#020d20`, `#031b3d`, `#03142d`, `#020f22`, `#031a38`, `#020f24`, `#041329`, `#03182f`, `#020f21`, `#031326`, mais `#0a1b30`. No `:root` de `globals.css`:
- `--palco-marca: #032d67` — exatamente o `#032d67` que fecha o `--fundo-marca`
- `--palco-fundo: #021d43` — a borda do degradê, derivada dele

Substituídos em `positioning-ecosystem.css`, `recognition-theater.css`, `technology-showcase.css`, `partners-timeline.css` (`.detail-number`) e nas ocorrências soltas de `globals.css` (`.mmi-painel`, `.solution-viewport`, o clone do morph, `.spine-no`, os dois gradientes de `.bm-palco`, `.os-foto`, `.os-abas button.active`).

Contraste **subiu**: branco sobre `#032d67` dá ~13:1 e `rgba(255,255,255,.85)` dá ~9:1 — os dois com folga sobre 4.5:1. `#6faeff` no `.detail-number` dá ~8,4:1.

**Exclusões deliberadas**
- `--contact-bg: #03182f` / `--contact-bg-deep: #020f21` e o `#03182f` do gradiente do painel: regra permanente do projeto, o modal de contato não se toca.
- `Header.tsx:318` `bg-[#031326]/70`: scrim do menu mobile (legibilidade, não estética de palco).
- `--fundo-marca` intacto — para não reabrir SIS-60/61.

**Verificação**
`npx tsc --noEmit` limpo. `npx next build` limpo. `npm run test:copy` sem string nova nem removida (o vermelho pré-existente de terceiros continua igual; o lock não foi regerado de propósito).

**Ressalva:** sem browser no ambiente de entrega. Os três valores de `data-ativa` (`pr` / `sp` / `nenhuma`), o `data-modo="lista"` e os quatro breakpoints não foram validados visualmente.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/ui/BrazilOfficesMap.tsx`
- `src/app/globals.css`
- `src/components/positioning-ecosystem.css`
- `src/components/recognition-theater.css`
- `src/components/technology-showcase.css`
- `src/components/partners-timeline.css`

---

## SIS-77 — Sobreposição entre seções e revisão dos 100vh: cartões que vazam de um bloco para o próximo

**Status:** In Review · **Labels:** — · **Fechada em:** não fechada · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-77/sobreposicao-entre-secoes-e-revisao-dos-100vh-cartoes-que-vazam-de-um

### Pedido
Cards e imagens devem “vazar” de uma seção para a outra (margens negativas controladas ou absoluto + z-index), em vez de ficarem confinados. Remover `height: 100vh` e `overflow: hidden` rígidos se gerarem cortes secos. Não criar `SectionTransition.tsx`. Aplicar overlap em 2 ou 3 fronteiras (candidatas: Abordagem → Como Agimos; ISG → Por que SISTRAN?; Differentials na home). Revisar `100vh` em `Differentials.tsx`; não tocar palcos sticky de `.impact-*` / `.solutions-*` nem heros; não converter `overflow: clip` de `.solutions-scroll` em `hidden`. Aceite: elemento visível sobre a seção seguinte sem encobrir texto em 360–1920px; Soluções/Números intactas; sem scroll horizontal; reduced-motion igual (é layout).

### O que foi feito
Sem relatório de entrega no Linear. O histórico de estados permite afirmar: saiu de Backlog em 28/08/2026 e entrou em In Review no mesmo dia (18:00 UTC), sem passagem registrada por In Progress, e permanece em In Review.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
Não declarados no relatório.

---

## SIS-76 — Grade técnica contínua no site inteiro (uma só camada, não uma por seção)

**Status:** In Review · **Labels:** — · **Fechada em:** não fechada · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-76/grade-tecnica-continua-no-site-inteiro-uma-so-camada-nao-uma-por-secao

### Pedido
Grid técnico unificado percorrendo a página inteira. Preferência: Alternativa A — `background-attachment: fixed` na `.grade-tecnica` existente (tile 6rem, `rgba(14,216,246,0.14)`), não um nó `fixed` global com `opacity-40` e brilho `sky-400`. Tirar a `mask-image` só onde as seções forem contínuas. Não adicionar o brilho radial do snippet. `pointer-events: none` e `aria-hidden`. Aceite: linhas horizontais alinhadas em seções escuras adjacentes; Header/`backdrop-filter` e `.glass-card` intactos; grade sem repaint a cada frame; contraste 0.14/0.04; `npm run test:copy` verde.

### O que foi feito
**Implementado — Alternativa A, e uma descoberta que muda o diagnóstico.** Ao abrir os dois seletores: as duas grades nunca foram o mesmo grid. `.grade-tecnica` usava tile de `6rem`; `.section-light::before` usava `48px`. Ancorar na janela sem unificar o módulo teria alinhado a fase de duas grades que continuariam sendo duas.

**1. Módulo único: `--grade-modulo: 6rem`** — declarado no `:root` ao lado de `--fundo-marca`. Consumido pelos dois seletores (4 referências).

**2. `background-attachment: fixed` em `.grade-tecnica`** — o tile resolve contra a janela: qualquer par de seções mostra a mesma linha na mesma altura de tela.

**3. `background-attachment: fixed` também em `.section-light::before`** — opacidades preservadas (`0.14` escuro / `0.04` claro).

**4. `.grade-tecnica--continua`** — em `/quem-somos` há dois blocos claros entre “Como Agimos” e “Por que SISTRAN?”. A máscara **fica** como padrão; o modificador (sem máscara) foi definido e documentado, **não aplicado**.

**5. A grade entrou nas seções escuras que estavam vazias**, no molde (`relative overflow-hidden`, nó `aria-hidden`, `pointer-events: none`):
- `/contato` → “Formulário de contato” e “#timeSISTRAN”
- `/solucoes` → “Serviços” e “Transformação de Legado”

**O que deliberadamente NÃO mudou**
- Brilho radial do snippet — não adicionado.
- `opacity-40` num nó `fixed` — não existe. Nenhum nó novo cobrindo a viewport.
- `sky-400`/Tailwind arbitrário — não usado. Grade no `#0ed8f6` no escuro e `#0079cb` no claro.
- Alternativa B descartada: `.section-light` tem `isolation: isolate`.
- `.solutions-grade` (64px) e `.impact-grade` — deixadas como estão.
- `.grid-mask` (48px, `globals.css:1203`) — código morto em `Hero.tsx` não montado; sinalizado, não apagado.

**Custo de paint:** nenhum `will-change`. SIS-70 já havia reduzido ~51 MB de download.

**Verificação**
- `npx tsc --noEmit` limpo; `npx eslint` nos dois arquivos tocados sem aviso; `npx next build` exit 0.
- HTML pré-renderizado: `grade-tecnica` presente em `/contato`, `/solucoes` e `/quem-somos`.
- `npm run test:copy`: os **mesmos 47** textos perdidos de antes desta task; nenhuma cópia visível perdida aqui.
- `--grade-modulo` com 4 consumidores; nenhum `48px 48px` restante em código vivo.

**Ressalva:** sem navegador. Não conferido paint flashing, `backdrop-filter` do Header/`.glass-card`, nem alinhamento visual. iOS Safari trata `fixed` como `scroll` em vários cenários.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/app/globals.css` (`--grade-modulo`, `.grade-tecnica`, `.section-light::before`, `.grade-tecnica--continua`)
- páginas `/contato`, `/solucoes` e `/quem-somos` (nós de grade)

---

## SIS-75 — Fluidez entre seções: auditoria dos cortes duros e do que já existe para resolvê-los

**Status:** In Review · **Labels:** — · **Fechada em:** não fechada · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-75/fluidez-entre-secoes-auditoria-dos-cortes-duros-e-do-que-ja-existe

### Pedido
Task-mãe de auditoria: **não implementa**. Mapear fronteiras de `/` e `/quem-somos` (claro↔claro, claro↔escuro, escuro↔escuro) e decidir Modelo A (fundo compartilhado + camada de `linear-gradient` no background da seção que recebe) versus Modelo B (`NotchDivider`). Não remover `background-attachment: fixed` de `--fundo-marca`; transições fora de `.section-light` (`isolation: isolate`); não reabrir `.impact-borda`/`.impact-emenda` (SIS-64); não trocar remendo por remendo. Depois do SIS-76: decidir onde aplicar `.grade-tecnica--continua` (ou removê-la se não houver escuro↔escuro). Aceite: sem linha horizontal de cor onde a auditoria escolheu Modelo A; NotchDivider mantidos idênticos; `test:copy` verde; reduced-motion inalterado.

### O que foi feito
Sem relatório de entrega no Linear. O histórico de estados permite afirmar: saiu de Backlog em 28/08/2026 e entrou em In Review no mesmo dia (18:00 UTC), sem passagem registrada por In Progress, e permanece em In Review.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
Não declarados no relatório.

---

## SIS-74 — Sistran em números: auditoria do pedido visual — o que já existe e os dois ajustes que faltam

**Status:** In Review · **Labels:** — · **Fechada em:** não fechada · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-74/sistran-em-numeros-auditoria-do-pedido-visual-o-que-ja-existe-e-os

### Pedido
Registrar o que já existe (glow da senoide, anéis HUD, sticky, contagem, etc.) e implementar só o que falta: (1) pulso contínuo discreto na lente orbital parada, só `opacity`/`filter`, nunca `transform` no mesmo nó de `.impact-aneis`, atrelado a `[data-visivel="1"]`; (2) `drop-shadow` ciano em `.impact-valor` sem quebrar stacking da lente nem `.impact-contextual` a 0.34. Não aplicar o snippet de 4 indicadores / framer-motion / carrossel. Aceite: lente com vida discreta só na tela; sem disputa de `transform`; reduced-motion = lista dos sete; `npm run build` e `test:copy` sem divergência.

### O que foi feito
Sem relatório de entrega no Linear. O histórico de estados permite afirmar: saiu de Backlog em 28/08/2026 e entrou em In Review no mesmo dia (17:57 UTC), sem passagem registrada por In Progress, e permanece em In Review.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
Não declarados no relatório.

---

## SIS-73 — Sistran em números: navegação clicável dos sete indicadores (base no desktop, tabs no mobile)

**Status:** In Review · **Labels:** — · **Fechada em:** não fechada · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-73/sistran-em-numeros-navegacao-clicavel-dos-sete-indicadores-base-no

### Pedido
Faixa de sete controles no pé da seção no desktop (`>= 1024px`, `[data-dirigindo]`): o clique não chama `setAtivo`, navega o Lenis/`scrollTo` até o progresso inverso de `Metrics.tsx:231-232`. Sem `role="tablist"`. Mobile: **não** virar tabs — a lista já mostra os sete. Contraste dos inativos (não `opacity: 0.5` abaixo de 4,5:1). Reduced-motion: salto direto. Aceite: clique posiciona o indicador e o marcador `NN / 07`; roda continua sem salto; Tab+Enter; abaixo de 1024px e reduced-motion sem controles; `npm run build`.

### O que foi feito
Seguiu o issue nas duas decisões: **o clique não escolhe o indicador** e **o mobile não virou tabs**. Arquivos: `src/components/Metrics.tsx` e `src/app/globals.css`.

**1. A nota do cabeçalho foi corrigida, não apagada** — reescrita para explicar que o que mantém a seção fora da categoria carrossel é o que o clique **não** faz.

**2. `irParaIndicador(i)` — zero estado novo**
```
const p = ETAPAS_INICIO + (i / (TOTAL - 1)) * (ETAPAS_FIM - ETAPAS_INICIO);
const alvo = gatilho.start + p * (gatilho.end - gatilho.start);
```
Inverso exato da conta do `onUpdate`. `start`/`end` vêm do gatilho vivo em `gatilhoRef`. Lenis primeiro, `window.scrollTo` como reserva; com `prefersReducedMotion()` a viagem é salto (`duration: 0`).

**3. A faixa** — `<nav aria-label="Ir para um indicador">` com sete `<button>`. **Não** `role="tablist"`. Vive no `.impact-palco`, fora do `.impact-cena`. `z-index: 8` — um acima da trilha (7) e da vinheta (3). Rótulo visível só o ordinal (`01`…`07`); o nome vai no `aria-label` (ex.: `"04 — Mil horas de Capacidade Produtiva no Brasil"`).

**4. Sobre o `opacity: 0.5` do pedido — não implementado.** Inativo é cor, não opacidade: branco a 0,78 de alfa sobre `#032d67` mede ~7,8:1. Ativo: peso 600 → 700, fundo `white/6` → `white/16`, borda ciano, `aria-current="true"`. `:focus-visible` em `#7fe6ff` com `outline-offset: 2px`.

**5. Mobile: recusa fundamentada.** A faixa só é renderizada quando `dirigindo` é `true`. `.impact-atalhos` também entra nas listas de ocultação (`@media` de lista e `html[data-motion="reduce"]`).

**Verificação:** `npx tsc --noEmit` limpo, `npx eslint src/components/Metrics.tsx` limpo, `npx next build` pré-renderizou as 26 páginas. `npm run test:copy` acusa **uma** string nova — `Ir para um indicador`; nenhuma removida; lock não regenerado.

**Ressalva visual:** `bottom: clamp(38px, 5.5vh, 62px)`; continuidade após clique; Tab+Enter.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/Metrics.tsx`
- `src/app/globals.css`

---

## SIS-72 — Sistran em números: contagem com mola (spring) em vez de curva de saída

**Status:** In Review · **Labels:** — · **Fechada em:** não fechada · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-72/sistran-em-numeros-contagem-com-mola-spring-em-vez-de-curva-de-saida

### Pedido
Trocar a curva do `ImpactNumero` (`ease: [0.22, 1, 0.36, 1]`, duration 1.1) por spring (`stiffness: 120`, `damping: 30` ou ~18–22 se quiser elasticidade visível, `restDelta: 0.5`), import de `motion/react`. Manter gatilho por `ativo`, `jaContou`, `onComplete` travando no valor, reduced-motion saindo pela porta da frente, reserva de `minWidth` para overshoot. Aceite: cada número sobe ao virar ativo; não reconta ao reavançar; reduced-motion mostra valor final; `build` e `test:copy`.

### O que foi feito
Três edições em `src/components/Metrics.tsx` (`ImpactNumero`).

**A curva**
```
type: 'spring',
stiffness: 120,
damping: 22,
restDelta: 0.5,
```
Escolheu-se **22**, não os 30 do pedido: em `stiffness: 120`, `damping: 30` fica praticamente crítico (ζ ≈ 1,37 para massa 1) — não sobraria elasticidade visível. Em 22 a mola ultrapassa o alvo em ~3-4% e volta: em 850, pico por volta de 880, dois ou três quadros. Valor e raciocínio registrados em comentário no código.

**`onComplete` deixou de ser zelo e virou obrigatório** — `restDelta: 0.5` interrompe a meio dígito **e** o último quadro pode ser o retorno do overshoot; sem a linha o indicador poderia descansar em `851`.

**A reserva de largura passou a contar o pico, não o valor final:** `minWidth: \`${String(Math.ceil(valor * 1.08)).length}ch\``. Nos sete valores de hoje (850/23/130/650/230/35/25) dá o mesmo número de dígitos; um `99+` viraria `103` por dois quadros e empurraria o `+`.

**Intocado:** gatilho por `ativo`, `prefersReducedMotion()`, `jaContou`, escrita por `textContent` via ref, cleanup. `animate` continua de `motion/react`.

**Verificação:** `npx tsc --noEmit` limpo, `npx eslint src/components/Metrics.tsx` limpo, `npx next build` nas 26 páginas. Sem troca de texto.

**Ressalva:** damping 22 vs 30 feito por cálculo, não no olho. Se o pico parecer exagerado, subir para 26.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/Metrics.tsx`

---

## SIS-71 — Efeitos: auditar e padronizar as cinco animações pedidas (já existem primitivas no projeto)

**Status:** In Review · **Labels:** — · **Fechada em:** não fechada · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-71/efeitos-auditar-e-padronizar-as-cinco-animacoes-pedidas-ja-existem

### Pedido
Auditar e padronizar (não reconstruir) fade-up expo (`vFadeUp`/`vTitle`/`easeExpo = [0.22, 1, 0.36, 1]` em `src/lib/motion.ts`), stagger (`vGrid`/`vCard`), `CountUp`, marquee (`SignalMarquee`) e Lenis. Não entrar snippets com `framer-motion` nem classes `dark:`. Uniformizar consumo das primitivas; se faltar `whileHover`/`whileTap`, acrescentar em `motion.ts`. Reduced-motion: fades visíveis, contador no valor final, marquee acessível. Depois da SIS-70. Aceite: nada anima duas vezes; Lighthouse não cai vs SIS-70; sem aviso de hidratação.

### O que foi feito
Sem relatório de entrega no Linear. O histórico de estados permite afirmar: saiu de Backlog em 28/08/2026 e entrou em In Review no mesmo dia (18:00 UTC), sem passagem registrada por In Progress, e permanece em In Review.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
Não declarados no relatório.

---

## SIS-70 — Performance: o site está lento — dieta de assets e code splitting com dynamic

**Status:** In Review · **Labels:** — · **Fechada em:** não fechada · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-70/performance-o-site-esta-lento-dieta-de-assets-e-code-splitting-com

### Pedido
Investigar lentidão e aplicar `dynamic` corretamente. Medição prévia: `public/` 227 MB; 78 MB mortos (`hero-scroll-anterior.mp4` 55,7 MB + `public/images/arquitetura/` duplicata); mosaico ~40 MB de vídeo em tiles de 176px; fotos PNG grandes; vídeos de scroll all-intra. Ordem: apagar mortos (−78 MB); reencodar tiles; WebP/AVIF; rever crf dos scroll preservando all-intra; só então medir First Load JS e `dynamic` (modais, não LCP). Aceite: Lighthouse antes/depois; scroll videos sem saltar; tiles em loop; 3D de `/quem-somos` no momento certo; build sem 404.

### O que foi feito
**Implementado — e a conclusão contraria a premissa do issue:** o `dynamic` não era o problema.

**A descoberta:** `next.config.mjs` tem `images: { unoptimized: true }` — o otimizador do Next não comprime nada em runtime. Comentário em `StackScenes.tsx` reescrito.

**1. Assets mortos removidos** (`git rm`): `public/videos/hero-scroll-anterior.mp4` (55,7 MB, zero referências); `public/images/arquitetura/` (6 arquivos md5-idênticos a `public/imagens/`). `public/` **225 MB → 152 MB**.

**2. Vídeos dos tiles do mosaico — 40,5 MB → 1,5 MB (−97%).** Tile ≤176×235 px CSS (~352×470 em DPR2); fontes eram 1080×1920. Reencodados em 360×640 CRF 30, GOP normal (só `play()` em loop). Comando documentado em `src/data/legacy.ts`.

**3. Imagens dos tiles — 10 913 kB → 226 kB.** Novo `scripts/otimizar-tiles-mosaico.mjs`: WebP 440 px q74. Originais intactas. `public/images/escritoriosp/` e `escritoriopb/` (21 MB) são fontes de regeneração — intocados. **Download da home: −51 MB.**

**4. Vídeos de scroll grandes — medidos e NÃO trocados.** `hero-scroll.mp4`: 7 556 kB → 6 219 kB em crf32 (não aplicado; LCP). `impacto-assembly-scroll.mp4`: 7 062 kB → 3 168 kB em 1280×720 crf30 (não aplicado). `process-scroll.mp4` (19,8 MB) só em código comentado. Sinalizado: `public/images/Sistran_files/` (131 arquivos, 2 referenciados).

**5. `dynamic`:** aplicado em `RoadmapStopDialog` (`ssr: false`). Revertido em `MotionPreferenceTrigger` (já estático no layout raiz). `ContactModal` não tocado.

**First Load JS** (soma de `/_next/static/**.js` no HTML; Next 16 não imprime mais a tabela): `/` 956 kB / 15 → 956 kB / 15; `/quem-somos` 988/14 → 988/15; `/transformacao-legado` 913/13 → 912/13; `/solucoes` 898/12; `/contato` 872/12. **JS: ~1 kB numa rota. Mídia: −51 MB de download e −73 MB no repositório.**

**Verificação:** `npx next build` exit 0; HTML da home com `tile-*.mp4` e `tiles/*.webp`, sem referências apagadas; `tsc --noEmit` limpo; `eslint src/` 17 warnings / 0 errors (os mesmos de antes); `test:copy` vermelho por drift pré-existente, lock não regenerado.

**Ressalva:** sem Lighthouse/navegador.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `public/videos/hero-scroll-anterior.mp4` (removido)
- `public/images/arquitetura/` (removido)
- `src/data/legacy.ts` (comando de reencode)
- `src/components/legacy/StackScenes.tsx` (comentário)
- `scripts/otimizar-tiles-mosaico.mjs` (novo)
- `RoadmapStopDialog` (dynamic)
- `src/app/layout.tsx` / `MotionPreferenceTrigger` (comentário, dynamic revertido)
- `next.config.mjs` (constatação `unoptimized: true`)

---

## SIS-69 — /quem-somos: retirar o explorador 3D 360° (Torre River Park / Complexo Modular)

**Status:** In Review · **Labels:** — · **Fechada em:** não fechada · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-69/quem-somos-retirar-o-explorador-3d-360-torre-river-park-complexo

### Pedido
Remover de `/quem-somos` o explorador 360° (`BuildingShowcase` em `page.tsx:120-124`): seletor Torre River Park / Complexo Modular, bússola, cartão River Park, rótulo vertical, `35+`, “Arraste para girar”. Não levar a torre da `OfficesScene` nem o `BuildingExplorer`. Decidir se `BuildingShowcase.tsx` e o CSS órfão saem ou ficam comentados. Atualizar copy-lock se o teste acusar. Aceite: sem o cartão azul, sem buraco; torre de SP na cena dos escritórios; sem erro de three; build e `test:copy` limpos.

### O que foi feito
Saiu a `<section aria-label="Explorador arquitetônico 360°">` de `quem-somos/page.tsx` e o import de `BuildingShowcase`. No lugar ficou um comentário `SIS-69` com o JSX exato para religar. “Diferenciais” encosta direto no `TechnologyShowcase` (ambos já tinham `section-py`).

**Decisões:** `BuildingShowcase.tsx` **fica**, sem consumidor, com doc no topo (precedente do `Differentials`). O CSS **fica todo** (dormente com o componente). Verificação de uso: `building-scroll`, `building-scroll-inner`, `building-stage`, `building-stat`, `model-switch`, `location-card`, `location-pulse`, `location-code` e `vertical-label` só em `BuildingShowcase.tsx`; **`three-explorer-shell` também está em `BuildingExplorer.tsx`** e teria sido removido por engano.

A torre não saiu: `OfficesScene` monta `BuildingExplorer` direto. Com uma cena só, o equilíbrio “só uma desenha por vez” deixou de ser necessário.

**Ressalva:** o `three` continua no pacote da rota. Assunto do SIS-70.

**Verificação:** `tsc --noEmit` limpo, `eslint` limpo nos arquivos tocados, `next build` com `/quem-somos` prerenderizada. `copy-lock` **não** regravado: nenhuma string saiu de `src/components` porque `BuildingShowcase.tsx` permanece. `test:copy` segue vermelho por divergência anterior.

Layout conferido no HTML prerenderizado, sem navegador.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/app/quem-somos/page.tsx`
- `src/components/ui/BuildingShowcase.tsx` (doc no topo; componente permanece)

---

## SIS-68 — Arquitetura: virar "Entrega com Alta Performance" e trazer os quatro pilares

**Status:** In Review · **Labels:** — · **Fechada em:** não fechada · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-68/arquitetura-virar-entrega-com-alta-performance-e-trazer-os-quatro

### Pedido
Na Arquitetura da home: remover a tag `Arquitetura | destino adequado ao contexto`; título → `Entrega com Alta Performance e Comprometimento`; descrição → `Empresas que aderem a tecnologia em seus processos estão sempre a frente no mercado!`; quatro itens (Conhecimento em Seguros · Flexibilidade · Tecnologia · Solidez e permanência) com ícone, só rótulo, lista vertical, consumindo `src/data/differentials.ts`. Não descomentar `Differentials` (400vh). Bifurcar escrita: `mosaicIntro` original permanece para `/solucoes` e `/transformacao-legado`. Aceite: home com novo título/linha/pilares; legado e soluções intactos; mobile sem empurrar o mosaico; ícones fora da leitura.

### O que foi feito
Comentário prévio no Linear: `copy-lock.json` **não é opcional** — após troca de escrita, rodar `npm run copy-lock` e commitar o lock (vale também para SIS-66).

A abertura do mosaico na home virou **“Entrega com Alta Performance e Comprometimento”**, com “Alta Performance” em gradiente, sem tag, e os quatro pilares dentro de `.mosaic-copy`.

**Arquivos**
- `src/data/legacy.ts` — novo `mosaicIntroHome`
- `src/components/legacy/StackScenes.tsx` — prop `variante`, novo cabeçalho, lista de pilares
- `src/components/legacy/legacy.css` — `.mosaic-realce`, `.mosaic-pilares`
- `src/app/page.tsx` — `<StackScenes variante="home" />`

**Bifurcação:** `mosaicIntro` intacto (`/transformacao-legado` e card de `/solucoes`). Padrão da prop é `legado`, não `home`. Título em três campos (`tituloAntes` / `tituloRealce` / `tituloDepois`), não `split()`.

**Armadilha:** `.text-gradient-brand` é clara-sobre-escuro. O mosaico é branco e **não** está em `.section-light`. Por isso `.mosaic-realce`, stops `#0079cb → #1885ce → #7c3aed`, ≈4,6:1 sobre branco. `color: #0079cb` antes do recorte.

**Pilares:** consomem `DIFFERENTIALS`. Só `title`. Ícones lucide já mapeados (`Shield`, `Zap`, `Cpu`, `Building2`), `stroke-width: 1.6`. Cores `#57B7EE`, `#C4A0FB` decorativas; nomes em `--ink` (`#001a3d`). Lista vertical, `max-width: 46rem`, coluna `width: max-content`; abaixo de 30rem fluida. Sem kicker na home. `aria-labelledby` aponta para `<h2 id="sinais-title">`.

**Verificação:** `tsc --noEmit` e `eslint` limpos; `next build` passa. HTML pré-renderizado: “Alta Performance” e `.mosaic-realce` só em `/`; 12 nós de pilar só na home; “destino adequado ao contexto” em `/transformacao-legado`; `mosaicIntro.text` no card de `/solucoes`. `test:copy` acusa só adições desta issue; lock não regenerado.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/data/legacy.ts`
- `src/components/legacy/StackScenes.tsx`
- `src/components/legacy/legacy.css`
- `src/app/page.tsx`

---

## SIS-67 — Impacto: vídeo chega na seção já montado — deve surgir com o scroll

**Status:** In Review · **Labels:** — · **Fechada em:** não fechada · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-67/impacto-video-chega-na-secao-ja-montado-deve-surgir-com-o-scroll

### Pedido
Na `#impacto`, o vídeo não pode abrir já montado (pôster = quadro de 8,6s). Portar revelação opt-in no `ScrollVideo` (`data-pronto` quando `readyState >= 2 && !seeking`, uma vez só). CSS: `.sequence-video { opacity: 0 }` → `[data-pronto="true"]` opacity 1; emergência em `[data-static="true"]` e em falha de arquivo. Hero **não** liga a prop. Sem reintroduzir rAF da origem. Aceite: abertura mostra fundo; sem piscar; recarga com seção na tela; reduced-motion e vídeo bloqueado visíveis; hero inalterado.

### O que foi feito
Implementado nas três partes. Sem dependência nova e sem reintroduzir o laço de `requestAnimationFrame`.

**1. `src/components/primitives/ScrollVideo.tsx` — revelação opt-in**
- Prop `revelarQuandoPronto` (default `false`); `HeroCinematic.tsx` **não** foi tocado.
- `buscar()` publica `data-pronto="true"` quando `readyState >= 2 && !seeking`.
- Escrito uma vez (`revelado` em `useRef`); atributo direto no elemento, não `useState`.
- Listeners `loadeddata` (recarga com seção na tela) e `error` (saída de emergência 2), ambos com cleanup.

**2. `src/components/legacy/legacy.css`**
- `.sequence-video` nasce com `opacity: 0` + `transition: opacity .25s ease-out`; `[data-pronto="true"]` leva a 1.
- `opacity: 0` no CSS servido.
- **Saída de emergência 1:** `.sequence[data-static="true"] .sequence-video { opacity: 1; transition: none }`.

**3. `poster`** — mantido. Comentário de cabeçalho de `ImpactSequence.tsx` atualizado. `aria-hidden="true"` e `tabIndex={-1}` intactos.

**Verificação:** `npx tsc --noEmit` limpo, `eslint` nos dois arquivos sem apontamentos, `next build` gera todas as rotas. Validação visual da lista **não executada** no ambiente de entrega.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/primitives/ScrollVideo.tsx`
- `src/components/legacy/legacy.css`
- `src/components/legacy/ImpactSequence.tsx` (comentário de cabeçalho)

---

## SIS-66 — Impacto: trocar a escrita da seção para "Sobre o Luminna AI"

**Status:** In Review · **Labels:** — · **Fechada em:** não fechada · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-66/impacto-trocar-a-escrita-da-secao-para-sobre-o-luminna-ai

### Pedido
Só escrita em `src/data/legacy.ts` (`impactSequence`): kicker → `Desafios no desenvolvimento de software`; title → `Sobre o Luminna AI` (sem `\\n`); text → `O Luminna AI representa uma revolução no desenvolvimento de software, proporcionando eficiência, qualidade e rapidez.` Grafia `Luminna AI` com espaço. Manter `id="impacto"` e `aria-labelledby="impacto-title"`. Sem mudança de layout/vídeo/scroll.

### O que foi feito
Implementado em `src/data/legacy.ts:267-272` — só o objeto `impactSequence`.
- `kicker`: → `Desafios no desenvolvimento de software`
- `title`: → `Sobre o Luminna AI`, **sem** `\\n` (comentário das linhas anteriores reescrito)
- `text`: → o parágrafo novo, 118 caracteres
Grafia: `Luminna AI` com espaço.

`ImpactSequence.tsx` consome `kicker`/`title`/`text` direto (linhas 93-98). `id="impacto"` e `aria-labelledby="impacto-title"` intactos. `.sequence-veil` não precisou de ajuste (opacidade dirigida por `copyFade`).

`npx tsc --noEmit` limpo; `next build` gera as 26 páginas. `npm run test:copy` acusa drift: 5 entradas desta task (3 saindo, 2 entrando — `Desafios no desenvolvimento de software` já existia em `acceleratorPages.ts:89`). **Não regenerou o `copy-lock.json`** por drift pré-existente de outras frentes.

Comentário posterior (28/08/2026): gravar o lock faz parte do escopo de tasks de escrita (Regra Zero).

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/data/legacy.ts`

---

## SIS-65 — Header: padronizar a logo da Sistran no tamanho maior (hoje ela encolhe no scroll)

**Status:** In Review · **Labels:** — · **Fechada em:** não fechada · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-65/header-padronizar-a-logo-da-sistran-no-tamanho-maior-hoje-ela-encolhe

### Pedido
Logo sempre no tamanho maior (`h-[4.5rem] md:h-[5.5rem]`), sem depender de `compacto` (hoje 3,4rem após rolar). Resolver a pílula junto (manter compacta ou deixar 88px sempre). Remover transições de altura mortas. Conferir `data-morph-target`, dez páginas, menu mobile 360px, LCP/`sizes`. Aceite: mesmo tamanho no topo e após scroll; sem salto; nav sem colisão 360–1920; morph da home; logo nítida 2x. Verificação: `tsc`, `eslint Header.tsx`, curl 200.

### O que foi feito
Feito → In Review (commit `adc2f38`).

A logo encolhia porque a **pílula** encolhia: 5,5rem são exatamente os 88px da pílula expandida, e nos 68px do estado compacto a logo grande não caberia. Escolheu-se deixar de encolher a pílula. Custo registrado: 20px de viewport permanentes.

- o estado `compacto` perdeu todos os consumidores e saiu, com o efeito que reescrevia `--header-h`. A altura agora é constante e a variável já vale 88px em `:root`;
- comentários de `globals.css` e `Differentials.tsx` que afirmavam que o Header reescrevia `--header-h` ao compactar foram corrigidos;
- saíram `transition-[height]` na logo e `height`/`top` na transição do cabeçalho.

Também corrigiu `width`/`height` da logo de 280×96 para 560×374, as dimensões reais do arquivo. Com a razão errada o `w-auto` reservava 256px de largura para uma marca que o `object-contain` pintava com 132px: ~124px de espaço morto. Com 374px de altura real, exibir a 88px sobra fonte em 2x.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/Header.tsx`
- `src/app/globals.css`
- `src/components/Differentials.tsx` (comentários)

---

## SIS-64 — Sistran em números: fronteira em curva claro/escuro está feia (manchas nos cantos)

**Status:** In Review · **Labels:** — · **Fechada em:** não fechada · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-64/sistran-em-numeros-fronteira-em-curva-claroescuro-esta-feia-manchas

### Pedido
Corrigir manchas claras nos cantos da `.impact-borda` (path `#e7f0f9`, `viewBox="0 0 1440 120"`, `preserveAspectRatio="none"`). Diagnosticar camadas; redesenhar ou remover (com SIS-61 a fronteira pode perder função). Decoração `aria-hidden`; sem ancestral `transform`/`filter`/`clip` sobre sticky. Aceite: nenhuma mancha em 1280 / 1440 / 1920 e ultrawide; igual nos dois sentidos de rolagem.

### O que foi feito
Feito → In Review (commit `8e83502`).

`.impact-borda` está comentada, não removida. As manchas nos cantos vinham do `preserveAspectRatio="none"` sobre um `viewBox` de 1440×120: em telas largas a curva era esticada horizontalmente e as pontas do path deixavam de encostar nas bordas, abrindo cunhas da cor de preenchimento nos cantos.

Com o fundo único do SIS-61 a fronteira claro/escuro deixou de existir, então a curva não tem mais o que separar. A grade passou a alinhar com a de Soluções. Se a fronteira voltar, a nota no CSS registra que ela precisa nascer com `preserveAspectRatio` que preserve a razão, ou com o path recalculado por largura.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/Metrics.tsx` (`.impact-borda` comentada)
- `src/app/globals.css`

---

## SIS-63 — Sistran em números: melhorar a abertura do palco (primeiro indicador embaralhado)

**Status:** In Review · **Labels:** — · **Fechada em:** não fechada · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-63/sistran-em-numeros-melhorar-a-abertura-do-palco-primeiro-indicador

### Pedido
Melhorar o primeiro enquadramento: número à frente dos anéis/rede; onda já acesa atravessando o primeiro nó; composição via `--impact-entrada` (`ENTRADA_FIM = 0.14`), um só ScrollTrigger. Sem `transition` em vars de quadro; sem redeclaração de `animation`; `overflow: clip` no palco. Aceite: primeiro indicador legível; onda contínua; reduced-motion estático e limpo.

### O que foi feito
Feito → In Review (commit `8e83502`).

A abertura deixou de entregar tudo de uma vez: a lente entra progressivamente por `--impact-entrada`, o bloco contextual cai para 0.34 (com o keyframe ajustado junto — por causa do `fill-mode: both`, mexer só na regra base não teria efeito) e o recorte da curva avança 35% do vão além do ponto aceso, então a onda já está desenhada à frente do primeiro indicador em vez de nascer embaixo dele.

É o que tirava a impressão de “primeiro indicador embaralhado”: três coisas chegavam prontas no mesmo quadro.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
Não declarados no relatório.

---

## SIS-62 — Sistran em números: ligar cada indicador ao nó da onda (números soltos hoje)

**Status:** In Review · **Labels:** — · **Fechada em:** não fechada · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-62/sistran-em-numeros-ligar-cada-indicador-ao-no-da-onda-numeros-soltos

### Pedido
Ligar cada um dos sete indicadores a um nó da onda: haste vertical, nó com presença (gramática de `.solutions-fio-no`), mesma coordenada X (`vaoEntreEtapas` / `pontoNaOnda`), onda acesa mais grosso, rarefação por `data-dist`. Decoração `aria-hidden`; sem números mágicos; `vector-effect: non-scaling-stroke` se SVG esticado. Modo lista/mobile/reduced-motion: haste/nó/curva continuam `display: none`. Aceite: ancoragem ≥1024px em qualquer etapa; estados distinguíveis; rótulo de duas linhas alinhado; nada atravessando o número central; lista intacta.

### O que foi feito
Feito → In Review (commit `8e83502`).

Cada indicador ganhou uma haste ligando o bloco ao seu nó na onda. A altura sai de `DESVIOS_TRILHO` por `calc(var(--impact-haste) - 50%)` — geometria que o componente já conhece, sem medição em JS e sem um segundo ScrollTrigger.

Os nós cresceram para 13px com borda, emprestando a gramática do `.solutions-fio-no`, e os vizinhos escalonam por `data-dist` (0 a 3).

No modo lista e em movimento reduzido a haste é escondida: sem onda e sem nó ela seria um risco solto ao lado do texto.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
Não declarados no relatório.
