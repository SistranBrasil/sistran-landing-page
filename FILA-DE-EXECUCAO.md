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
