# Uma por vez — protocolo de despacho e conferência (SIS)

**Mudou em 09/09/2026, a seu pedido.** A fila com ordem pré-combinada **não vale mais**.
Este arquivo passa a registrar o protocolo, não uma lista.

## A regra

1. **Uma issue por vez.** O agente implementador trabalha **só** a issue que eu enviar
   explicitamente. Ele não escolhe a próxima, não se serve de lista nenhuma, e não encadeia
   uma na outra por conta própria.
2. **Eu confiro essa uma**, fecho com `conferido` (ou devolvo com `conferir` removido e
   In Progress), e **paro**.
3. **A próxima é você quem nomeia.** Eu não despacho sozinha. Se eu achar que uma issue
   deveria vir antes, eu argumento — e espero.

O que isso troca: antes eu emendava conferência em despacho sem passar por você. Agora cada
troca de issue passa. O custo é um turno seu por issue; o ganho é que nada entra em
implementação sem você saber, e nunca há duas frentes abertas ao mesmo tempo.

## Conferidas nesta rodada

**SIS-173** — aprovada em 09/09 (`conferido`, In Review). Cinco frases trancadas, 21 casos de
autoteste, portões verdes. Dois reparos de texto pendentes e o achado das doze entradas técnicas
roteado para a SIS-175.

**SIS-179** — aprovada em 09/09 (`conferido`, In Review), comentário `3dbc30cd`. Grade montada
depois do hero, título centrado com folga igual até a primeira decimal em cinco larguras, malha
**exata por construção** (não por tolerância), hover azul com anel medido em `[0,121,203]`, emenda
com o hero de delta `(1,2,3)` no desktop e no celular. Portões: 24/0, `tsc` limpo, copy-lock OK.

Os dois consertos de acabamento que pedi foram feitos e **conferidos** no mesmo dia
(comentário `32d50cee`): `--malha-cruz` virou `#acb7c5` opaca e o empilhamento acabou — 2 e 4
camadas agora leem `172,183,197` exatamente, e a amplitude caiu de ~66 pontos para 12, os 12
para o lado claro (franja de antialiasing no canto externo, não acúmulo). A nota do
`.impact-percurso` marca as razões 1 e 2 como **INERTES** com o endereço de cada trava.
Nada pendente. Pode ir para Done.

## Em voo agora

**SIS-155** — trocar o sistema tipográfico do site pelo par Geist Sans 400/500 + Geist Mono 600.
Despachada em 09/09 depois de você nomeá-la, e **com quatro mudanças na issue antes de sair**
(comentário `2da3b693`):

1. **Seu aval de marca entrou por escrito no ponto 1.** Ele travava a retirada da serifa dos 76
   pontos de `font-display` até "aprovação de quem responde pela marca". Você aprovou retirar a
   serifa de todas as quatorze rotas. Está datado, e o implementador foi instruído a não reabrir.
2. **O bloqueio da SIS-174 caiu, e a ordem virou 155 → 174**, como você decidiu. O motivo ficou
   escrito nas duas issues: a tabela dos ~30 pontos da 174 lista tamanhos **declarados**, não
   medidos — `0.68rem` continua `0.68rem` depois da troca de família. O "pare e diga" da 174 está
   revogado por escrito.
3. **O conflito real foi consertado**: dois pontos da 155 permitiam texto abaixo do piso de 11px
   da 174 — o critério "rótulo mono entre 10 e 12px" e o `caption` a 10px do prompt. Os dois agora
   dizem 11px, com critério de aceite novo. Sem esse conserto o bloqueio seria legítimo, e vale
   dizer: a 155 primeiro *só* funciona porque isso foi corrigido.
4. **A 174 foi corrigida do outro lado** para as duas não se contradizerem — inclusive a nota de
   topo dela, que ainda afirmava que a serifa fica por decisão sua de 08/09. Ficou registrado que
   ela vai localizar os pontos **pelo seletor, não pela linha**, porque o diff da 155 desloca a
   numeração de `globals.css` inteira.

O que eu vou apertar na conferência: o **ponto 12** (a lista escrita de toda constante de layout
medida contra largura de texto, com o número antes e depois de cada uma), o itálico do
`essence-accordion.css` — que morre em silêncio, sem virar falso, e tem de ser decisão declarada —
e a manchete de 118 caracteres de `/solucoes`, que é o defeito que os dois degraus de manchete
longa existem para evitar.

## À sua escolha

Não é ordem, é o que existe pronto para ser chamado. A SIS-179 fechou, então a
**SIS-176 está desbloqueada** — o `blockedBy` dela era exatamente essa conferência.

| Issue | O que é | Observação minha |
|---|---|---|
| **SIS-176** | "Sistran em números": fundo de imagem no palco, divisórias entre os sete, trilho de nós que acende na rolagem | Liberada. Monta no mesmo `src/app/page.tsx` da SIS-179 — se for a seguinte, o terreno está quente |
| **SIS-174** | Piso de tamanho de texto: subir os 30 pontos abaixo de 11px | **Agora vem DEPOIS da SIS-155**, por sua decisão de 09/09. Boa candidata a seguinte: ela mede na tipografia final, uma vez só |
| **SIS-175** | O `copy-lock` trava literal técnico como se fosse cópia | Ferramenta de portão: conserta ruído em toda issue seguinte. **Cresceu** na conferência da SIS-173 — doze entradas técnicas no lock e três buracos de regra |

## Fora disso, à espera de você

No `DECISOES-PENDENTES.md`, não aqui: SIS-131 (três URLs de vídeo), SIS-123 (texto jurídico),
SIS-124 (PDF do MTE), SIS-154 (`images: unoptimized`, decisão de deploy), SIS-125 (índice de
varredura). Decisões que travam issue já aberta: **SIS-187** (emenda hero, escolher 1/2/3) e o
item 2 da **SIS-185** (violeta de `BRASIL`).

## Abertas em 09/09 (itens 4–5 + 3c + órfãos)

| Issue | Status | O quê |
|---|---|---|
| **SIS-182** | Todo | `matchMedia` → `useSyncExternalStore` |
| **SIS-183** | Todo | Auditoria dos dois interruptores de movimento |
| **SIS-184** | Todo | `/esg` scroll lateral no celular |
| **SIS-186** | Todo | Contraste × antialiasing em texto miúdo |
| **SIS-185** | Backlog | Divisas SP/PR + token violeta `BRASIL` |
| **SIS-187** | Backlog | Emenda hero → grade (precisa do seu aval) |
| **SIS-188** | Todo | sistran-labs | Principais Soluções: tag → `carimbo-sistran-labs.png` + efeito batida |

## Doc Terminal Industries → home (09/09)

Spec: `docs/efeitos-scroll-terminal-industries.md`. Cores = Sistran (ciano, não verde-limão).
Ordem sugerida: **193 → 195 / 194 → 196 → 197**. As quatro efeitos bloqueiam em 193.

| Issue | Status | Efeito | O quê |
|---|---|---|---|
| **SIS-193** | Todo | base | Tokens motion + primitiva Reveal |
| **SIS-195** | Todo | 1 | BrandGrid: cascata fade-up das logos |
| **SIS-194** | Todo | 2 | Títulos: revelação por linha/palavra |
| **SIS-196** | Todo | 3 + layout | Soluções de Negócios: **redesenho inteiro** sticky storytelling (`docs/secao-sticky-storytelling-terminal.md`) — não só efeito em cima do teatro atual |
| **SIS-197** | Todo | 4 | Presets `data-reveal` nos blocos estáticos |
| **SIS-198** | Todo | hero | Tamanho fixo (sem scale/drop) + contorno ciano melhorado — ref 2ª captura; skills `.claude/gsap-skills` |
| **SIS-199** | Todo | home | Backdrop inteiro = azul claro + grade leve (igual Soluções / `--fundo-claro-secao`) |
| **SIS-200** | In Review | números | Sete células iguais + ícone dinâmico por métrica |
| **SIS-203** | Todo | números | Hover fluido nas células, menos névoa branca, bolinhas sob cada número |
| **SIS-201** | In Review | parceiros | Cards horizontais Terminal + logos/eco (conferir) |
| **SIS-202** | In Review | parceiros | Etapas: **layout** RoadmapTrail + textos `TIMELINE_EVENTS` (reparo: sem copy Luminna) |
| **SIS-218** | Todo | parceiros | Parceiros: seção fixa + avanço lateral com scroll da página (irmã da 219) |
| **SIS-219** | Todo | parceiros | Logos dos cards bem maiores e mais destacadas (irmã da 218) |
| **SIS-220** | Todo | parceiros | Linha do tempo: viajante = logo Luminna igual `/transformacao-legado` |
| **SIS-204** | Todo | eventos | `/eventos-inovacao`: título único com scroll + sombra azul clara + rótulos inteiros nas miniaturas |
| **SIS-205** | Todo | eventos | Botão YouTube só em Web Summit AI + Suitability (demais cards sem botão) |
| **SIS-206** | Todo | esg | Reparo: título da abertura quebrado (frase ESG) |
| **SIS-207** | Todo | esg | SOCIAL: foguete silhueta branca + trajeto em toda a seção |
| **SIS-208** | Todo | esg | ENVIRONMENT: cards da captura (círculo, sombra, flutuação) |
| **SIS-209** | Todo | esg | SOCIAL: Huerta Niño + Aguas mesmo tamanho + flutuação leve |
| **SIS-210** | Todo | esg | GOVERNANCE: mesmos cards da captura (sombra + flutuação) |
| **SIS-211** | In Review | contato | Números: fundo azul claro + cards tipo Implementações + seção mais baixa |
| **SIS-256** | Todo | contato | Números: cards mais estreitos e sem contador 01 / 07 |
| **SIS-260** | Todo | contato | Números: grade de quadradinhos discretos igual à home |
| **SIS-212** | Todo | contato | Negrito em «Preencha o formulário e fale com a gente!» |
| **SIS-213** | Todo | home | Números: retirar sombra/faixa branca do fundo |
| **SIS-214** | Todo | home | Sobre o Luminna AI entre Números e Desafios |
| **SIS-215** | Todo | eventos | Retirar/clarear bandas azuis escuras no início e fim do scroll |
| **SIS-216** | Todo | sistran-labs | Negrito: capa, intro, Já desenvolvemos, Churn/Fast/Smart Miner, Principais Soluções |
| **SIS-244** | Backlog | home | Soluções: trocar imagens — **artes da usuária** (não despachar ao robô) |
| **SIS-267** | Backlog | arte | Logo Picsel HD (PNG + transparente) — **sua**; não despachar até o arquivo |
| **SIS-217** | Todo | solucoes | Cards aceleradores: logos `public/images/logos` + reação no hover |
| **SIS-221** | Todo | quem-somos | Escritórios BRASIL: baixar marcador do 2º andar SP na torre |
| **SIS-222** | Todo | contato | Loading a cada entrada até página + mapa prontos |
| **SIS-245** | Done | contato | Onde Estamos: endereço Pato Branco, sem link RJ, mapa azul mais claro |
| **SIS-255** | Todo | contato | Onde Estamos: sombra atrás do mapa menos escura e menos quadrada |
| **SIS-259** | Todo | contato | Retirar sombra branca entre logos e «SAIBA MAIS…» |
| **SIS-263** | In Review | contato | Reveal on scroll em toda a página (`docs/scroll.md` + RevealScope) |
| **SIS-269** | Todo | contato | Reveal deve acompanhar o scroll (não tudo após o load) — **antes das irmãs** |
| **SIS-270** | Todo | trabalhe-conosco | Reveal on scroll (`docs/scroll.md`) — após SIS-269 |
| **SIS-271** | Todo | esg | Reveal on scroll (`docs/scroll.md`) — após SIS-269 |
| **SIS-272** | Todo | eventos | Reveal on scroll (`docs/scroll.md`) — após SIS-269 |
| **SIS-273** | Todo | solucoes | Reveal on scroll (`docs/scroll.md`) — após SIS-269 |
| **SIS-275** | In Review | home | Reveal on scroll (`docs/scroll.md`) — entregue; conferência dispensada |
| **SIS-274** | Todo | loading | RouteLoadGate: fundo `#1273bc` + logo HD no lugar de SISTRAN |
| **SIS-278** | Todo | site | Barra de progresso de scroll no topo (ciano, acima do navbar) |
| **SIS-266** | Todo | footer | Item ativo na coluna Navegação conforme a página |
| **SIS-247** | In Review | esg | Capa de abertura = esgcapa.png |
| **SIS-257** | In Review | esg | Capa «ESG - Environment, Social & Governance» + seção intro com esg1.png |
| **SIS-261** | Todo | esg | Seção intro: layout da captura + arte esg2.png (sem fundo) |
| **SIS-262** | Todo | esg | Negrito em ENVIRONMENT: / SOCIAL: / GOVERNANCE: nos títulos |
| **SIS-248** | Todo | sistran-university | Capa universitycapa.png (padrão HeroImageBackdrop) |
| **SIS-249** | Todo | sistran-university | Seção Formar especialistas: arte + texto sombreado |
| **SIS-250** | In Review | sistran-university | Logo University no navbar (só nesta página) |
| **SIS-279** | Done | sistran-university | Navbar: duas logos + linha vertical (pós-250) — fechada em 15/09 **sem conferência** |
| **SIS-280** | Todo | menu / quem-somos | **Sistran Latam** → [https://www.sistran.com/latam/](https://www.sistran.com/latam/) (externo, nova aba) — slot reaproveitado 17/09 (cota); corpo antigo «O Programa» saiu |
| **SIS-281** | Todo | sistran-university | Capa «Sistran University» em negrito + Autossuficiência vira seção própria |
| **SIS-282** | Todo | sistran-university | Negrito em «Formar especialistas…» + «Em parceria com o Unidep» |
| **SIS-283** | Todo | sistran-university | Fale com a Gente! igual ao de `/esg` (`layoutReferencia`) |
| **SIS-284** | Todo | sistran-university | Desde 2022 / números igual a `university.png` |
| **SIS-285** | Todo | sistran-university | Unidep / turmas igual a `parceriauniversy.png` |
| **SIS-288** | Todo | sistran-university | O Programa: linhas de destaque do card Unidep no quadro (+ quadrado azul) |
| **SIS-289** | Todo | sistran-university | Reveal on scroll (`docs/scroll.md`, igual `/contato`) |
| **SIS-223** | In Review | trabalhe-conosco | Formulário em card no scroll (envio tipo Contato) |
| **SIS-224** | In Review | trabalhe-conosco | Suavizar véu/sombra feia da abertura |
| **SIS-258** | Todo | trabalhe-conosco | Abertura igual a exemplotrabalheconosco.png |
| **SIS-264** | Todo | trabalhe-conosco | Tipografia maior na abertura + limpar form/faixas |
| **SIS-225** | Todo | parceiros | Capa `fundocapaparceiros` no fundo do título + descrição |
| **SIS-226** | Todo | home | Hero: escritas alternando no vídeo (3 slides + pitch final) |
| **SIS-227** | Todo | sistran-labs | Capa `SISTRAN-LABS.png` no fundo do título |
| **SIS-286** | Todo | sistran-labs | Fale com a Gente! igual ao de `/sistran-university` (`layoutReferencia`) |
| **SIS-287** | Todo | labs + university | Navbar: **só** a logo da página (Labs / University) — sem par + corp; slot reaproveitado 17/09 |
| **SIS-290** | Done | sistran-labs | Intro «nativos digitais»: fundo `section-light` |
| **SIS-291** | Todo | sistran-labs | «Já desenvolvemos…» = `sistran-labs-5` + ícones (`guru1` / churn / fast / smart / email) |
| **SIS-292** | Done | sistran-labs | Principais Soluções: só arte `principais-solucoes1` (reta + dinâmica), sem cards |
| **SIS-293** | In Review | sistran-labs | 3 fotos (abas) surgindo de lado — **supersedida em parte por SIS-294** (pares texto+foto) |
| **SIS-294** | Todo | sistran-labs | Intro: 3 parágrafos + abas em zigzag (azul claro) |
| **SIS-228** | Todo | parceiros | Sombra atrás do título + descrição na abertura (pós-225) |
| **SIS-229** | In Review | sistran-labs | Principais Soluções (arte) — **cards desta seção supersedidos por SIS-292** |
| **SIS-230** | In Review | quem-somos | Premiações Celent (montagem 230) — supersedida visualmente por SIS-238 |
| **SIS-231** | Todo | solucoes | Remover seção Transformação de Legado (método / quatro movimentos) |
| **SIS-232** | In Review | eventos | Miniaturas laterais maiores e mais perto do card em destaque |
| **SIS-268** | Done | eventos | Aproximar **ainda mais** as previews do card central (pós-232) — fechada em 15/09 **sem conferência**, a seu pedido |
| **SIS-233** | Todo | esg | Título e descrição da abertura iguais ao padrão de /contato |
| **SIS-234** | In Review | esg | SOCIAL: foguete do scroll colorido e 3D (logo Gerando Talentos) |
| **SIS-254** | Todo | esg | SOCIAL: foguete do scroll = foguete.png (substitui SVG) |
| **SIS-235** | Todo | eventos | Tag «Realizado pela Sistran» vira componente carimbo |
| **SIS-236** | Todo | parceiros | Tirar tarja azul clara da capa / emenda |
| **SIS-277** | Todo | parceiros | Tag da abertura = `carimbo-parcerias.png` com efeito ao entrar |
| **SIS-237** | In Review | esg | ENVIRONMENT + GOVERNANCE: flutuação e hover bem perceptíveis |
| **SIS-252** | Todo | esg | ENVIRONMENT + GOVERNANCE: azul bem clarinho no repouso + troca de cor no hover |
| **SIS-253** | Todo | esg | Fale com a Gente! = falecomagente.png (+ ponto na linha, hover botão) |
| **SIS-265** | Todo | esg | Fale com a Gente!: logo HD `logosistranaltadefinicao.png` |
| **SIS-276** | Todo | esg | Fale com a Gente!: grafismo cortado/baixo demais no rodapé |
| **SIS-238** | Todo | quem-somos | Premiações: fundo cele.png + layout escritas/logo (exemplcelent) |
| **SIS-239** | In Review | eventos | Mobile: carrossel horizontal automático dos eventos |
| **SIS-251** | Todo | eventos | Mobile: carrossel mais intuitivo (swipe + auto) — pós SIS-239 |
| **SIS-240** | Todo | home | BrandGrid: logos ilegíveis em repouso (7/15 &lt; 3:1) |
| **SIS-241** | Todo | home | Peso: 24 MB entregues + ~163 MB bruto em public/ |
| **SIS-243** | Todo | home | Hero: vídeo só inicia depois do carregamento da página |
