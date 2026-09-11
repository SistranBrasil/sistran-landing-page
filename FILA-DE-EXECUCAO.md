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
| **SIS-188** | Backlog | Componentes órfãos |

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
| **SIS-211** | Todo | contato | Números: fundo azul claro + cards tipo Implementações + seção mais baixa |
| **SIS-212** | Todo | contato | Negrito em «Preencha o formulário e fale com a gente!» |
| **SIS-213** | Todo | home | Números: retirar sombra/faixa branca do fundo |
| **SIS-214** | Todo | home | Sobre o Luminna AI entre Números e Desafios |
| **SIS-215** | Todo | eventos | Retirar/clarear bandas azuis escuras no início e fim do scroll |
| **SIS-216** | Backlog | eventos | Esboço: admin com senha (sem sessão/seção pública) — não implementar ainda |
| **SIS-217** | Todo | solucoes | Cards aceleradores: logos `public/images/logos` + reação no hover |
| **SIS-221** | Todo | quem-somos | Escritórios BRASIL: baixar marcador do 2º andar SP na torre |
| **SIS-222** | Todo | contato | Loading a cada entrada até página + mapa prontos |
| **SIS-223** | Todo | trabalhe-conosco | Formulário em card no scroll (envio tipo Contato) |
| **SIS-224** | Todo | trabalhe-conosco | Suavizar véu/sombra feia da abertura |
| **SIS-225** | Todo | parceiros | Capa `fundocapaparceiros` no fundo do título + descrição |
| **SIS-226** | Todo | home | Hero: escritas alternando no vídeo (3 slides + pitch final) |
| **SIS-227** | Todo | sistran-labs | Capa `SISTRAN-LABS.png` no fundo do título |
| **SIS-228** | Todo | parceiros | Sombra atrás do título + descrição na abertura (pós-225) |
| **SIS-229** | Todo | sistran-labs | Principais Soluções: arte `principaissolucoes` bem integrada |
| **SIS-230** | In Review | quem-somos | Premiações Celent (montagem 230) — supersedida visualmente por SIS-238 |
| **SIS-231** | Todo | solucoes | Remover seção Transformação de Legado (método / quatro movimentos) |
| **SIS-232** | Todo | eventos | Miniaturas laterais maiores e mais perto do card em destaque |
| **SIS-233** | Todo | esg | Título e descrição da abertura iguais ao padrão de /contato |
| **SIS-234** | Todo | esg | SOCIAL: foguete do scroll colorido e 3D (logo Gerando Talentos) |
| **SIS-235** | Todo | eventos | Tag «Realizado pela Sistran» vira componente carimbo |
| **SIS-236** | Todo | parceiros | Tirar tarja azul clara da capa / emenda |
| **SIS-237** | Todo | esg | ENVIRONMENT + GOVERNANCE: flutuação e hover bem perceptíveis |
| **SIS-238** | Todo | quem-somos | Premiações: fundo cele.png + layout escritas/logo (exemplcelent) |
