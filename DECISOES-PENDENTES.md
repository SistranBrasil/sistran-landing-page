# Decisões que dependem de você

Levantado pela conferência das issues do time SIS (Linear, `sistran-labs`). Última limpeza:
08/09/2026.

Tudo aqui é decisão de **produto, design, conteúdo ou board** — nenhuma é técnica, e nenhuma
eu posso tomar no papel de verificador.

**Regra deste arquivo, a seu pedido de 08/09:** o que foi finalizado **sai**. Este documento é
a lista do que está em aberto, não o histórico. O histórico das decisões já tomadas fica nas
próprias issues do Linear, que é onde ele vale de critério — cada uma delas recebeu comentário
com a decisão, o motivo e a medição, então nada do que saiu daqui se perdeu.

Ordem: as que travam código publicado primeiro.

---

## 1. Uma ratificação que é sua — SIS-169, item 1

A cena de escritórios entrega **duas faixas, não três**. A engenharia é boa e eu concordo com ela
(uma terceira faixa ficaria vazia num dos dois estados). Mas o agente já havia dito a você, por
escrito, que o trânsito *"é a grade mudando de duas para três colunas"* e que isso era *"o trabalho
real"* — e mudou de decisão sem reconciliar. Como isso **afasta a cena da referência
`mapasescritorio1.png`**, a chamada é sua: **duas faixas está bom?**

Se sim, a descrição da issue precisa ser editada para dizer duas, com a conta da faixa livre ao
lado. A issue está aprovada e em In Review; esta é a única coisa que sobrou dela.

---

## 1b. O corte da cena de escritórios em `/quem-somos` — medido, e a saída é sua

Você reportou de novo, com print. **Medi, e não é a cena presa que está cortando.**

A cena tem um piso de janela em `OfficesScene.tsx:467`:
`(min-width: 1280px) and (min-height: 760px)`. **Sua janela tem 748px de altura** — 12px abaixo
do piso. Então ela cai em **`modo lista`**, que é uma pilha alta de 4114px: os dois painéis estão
inteiros (1255px e 1230px), `overflow: visible`, nada recortado, tudo alcançável rolando. O que o
print mostra é um cartão **atravessado pela borda da janela**, que é o normal de uma pilha — mas
lê como corte. A 760px de altura a mesma janela entra em `modo scroll` e o palco fecha em 760px
com `overflow: clip`.

E o piso não é chute: no `modo scroll` a sobra abaixo da coluna é de **38px a 1366×768**, 52px a
1512×800, 86px a 1440×900, 176px a 1920×1080. Com 748px de altura a coluna **não caberia** —
por isso o piso está em 760. Cortar o cartão seria pior do que não ter percurso, que é o que o
próprio comentário da SIS-169 diz.

**As três saídas, e a escolha é de produto:**
1. **Encolher a cena** (foto/cartão em `svh`) até a coluna caber em ~700px de altura, e então
   baixar o piso. É a única que devolve o percurso à sua janela. ⚠️ `OfficesScene.tsx:467` e a
   `@media` do bloco `modo scroll` em `globals.css` são a **mesma** condição e têm de mudar juntas.
2. **Fazer o `modo lista` não ler como corte** — um painel por vez, ou fecho visual que não deixe
   cartão pendurado na borda. Mais barato, e resolve a percepção sem tocar no percurso.
3. **Deixar como está**, sabendo que uma janela maximizada de 1920 com abas e favoritos costuma
   dar ~748px — ou seja, a maioria das suas sessões nunca vê a cena.

Minha recomendação: **2**, agora, e **1** só se você quiser a cena de volta nessa altura.

---

## 2. Conteúdo que só você (ou quem responde pelo conteúdo) tem

Cada item abaixo está registrado como **ponto parado** na issue correspondente, com o código
comentado no lugar exato para quando a informação chegar. Nada disso bloqueia código.

| O que falta | Onde | Issue |
|---|---|---|
| As **três URLs dos vídeos** do ciclo de webinars (25/11, 02/12, 09/12) | `data/events.ts`, campo `youtube` | SIS-131 (em Backlog só por isso) |
| A **lista regional de marcas** da seção de aseguradoras LATAM | `latam/page.tsx` | SIS-121 |
| As **três URLs de notícias** da seção Noticias | `data/latam.ts` | SIS-121 |
| Se entra **CTA em espanhol** na página LATAM (recusei escrever texto novo) | `latam/page.tsx` | SIS-121 |
| A frase de abertura de **`/sistran-university`**, agramatical no site original | `sistran-university/page.tsx` | — |
| A **`description` de `/transformacao-legado`** promete "método em quatro movimentos" — seção **retirada a pedido**, que não existe mais na página. É texto de busca publicado: mentindo hoje para quem chega do Google | `transformacao-legado/page.tsx:12-16` | SIS-119 |
| O **relatório de transparência salarial** em si: PDF e período de referência, que só o MTE gera por CNPJ | `relatorio-de-transparencia-salarial/page.tsx` | SIS-124 (em Backlog só por isso) |

### 2b. Um rótulo trocado que vale confirmar — SIS-121

A seção LATAM que o site regional chama **"Alianzas"** passou a se chamar **"Aseguradoras"**.
A troca **está declarada** com raciocínio no código (`latam/page.tsx:27-43`) e o motivo é bom —
o rótulo antigo prometia marcas de parceria e a seção entrega um parágrafo sobre as mais de 100
aseguradoras. Não é defeito, e retirei da devolução.

Mas: os dois nomes não são sinônimos (parceria ≠ cliente), o rótulo publicado em
`sistran.com/latam` é "Alianzas", e a lista de marcas dessa mesma seção está esperando o item
acima. **Se a lista chegar e for de parceiros, o rótulo tem de voltar.** Vale decidir junto.

---

## 3. Uma escolha pequena que sobrou da SIS-170

A SIS-170 está **aprovada**: entre 1280 e 1439 o rótulo sai de vista e da caixa, e a colisão
acabou — 766 amostras de rolagem em cinco rotas, **zero**.

Só que o limiar de 1440 fecha a conta da **caixa do indicador**, não a do **rótulo aceso**. Medi:
o rótulo mais largo em cena ("Conheça também", em `/quem-somos`) termina em **179,5px**, e a
primeira tinta do conteúdo a 1440 está em **162** → **17,5px** de rótulo por dentro da coluna de
texto. A 1459 são 8px, a 1460 ainda **7,5px**, e zera só em **1475**.

Não é o defeito que abriu a issue (naquela faixa não passa tinta de texto nessa altura — as 384
amostras de 1440/1459/1460 deram zero colisão). É a mesma invasão, menor, na faixa de cima.

**A escolha:** estender o recolhimento de 1440 para **1475**, ou deixar como está.
Custo de estender: entre 1440 e 1474 o rótulo também só aparece em hover/foco — o que a faixa de
baixo já faz. Ganho: o indicador nunca mais entra na coluna de texto, em nenhuma largura.

---

## 3b. Três escolhas pequenas, das auditorias de 08/09 à noite

Nenhuma bloqueia trabalho: para as três eu já disse ao implementador o que fazer **até você
decidir**, e nenhuma dessas instruções provisórias é difícil de reverter. Estão aqui porque em
todas a decisão é de produto, não técnica.

**a. A grade de marcas entra no indicador lateral? — SIS-179**

Quando a grade subir para debaixo do hero, ela passa a ser a segunda coisa da home. O `<h2>` já
tem `id="marcas-grade-titulo"`, e o ScrollSpy alcança âncora no `<h2>` sozinho — então **não falta
nada no código**, falta só decidir se entra uma linha em `src/data/pageSections.ts`.

Hoje a home tem cinco itens: Início, Soluções, Números, Contato, Social. A grade seria o **sexto**,
entre Início e Soluções, com rótulo curto (ex. "Marcas"). Contra: a grade é rodapé de
credibilidade, não seção de conteúdo — e o arquivo já barra o "Fale com a Gente!" por esse mesmo
critério. A favor: fora da lista, o salto de Início para Soluções pula uma tela cheia.
*Enquanto você não disser: não entra, e fica anotado que a ausência é decisão pendente.*

**b. O rótulo de campo de formulário fica em 11px ou 12px? — SIS-174**

`globals.css:3090`. O piso novo da SIS-174 é 12px para texto corrido e 11px só para rótulo
caixa-alta com tracking. Esse rótulo é caixa-alta, então cabe na exceção — mas é **rótulo de
campo**, que a pessoa lê para saber o que digitar, não etiqueta decorativa. *Minha recomendação:
12px.* Rótulo que orienta preenchimento não é ornamento.

**c. Os sete componentes mortos merecem issue própria?**

`Hero`, `PillarsCarousel`, `TrustTicker`, `UnitsMap`, `CompanySignature`, `PartnersGrid`,
`EventsGrid` não são montados por rota nenhuma. Pela regra da casa, código que sai de cena fica
comentado com o motivo — só que estes nunca foram "retirados", ficaram para trás. *Vale uma issue
só para decidir, um por um, o que é rascunho e o que é peça guardada de propósito.*

---

## 3c. Duas coisas que o hero novo criou, e as duas são de olho — SIS-178 (aprovada)

A issue está **aprovada e conferida**; isto não é defeito de execução, é consequência do desenho
que você escolheu. Mas uma delas **está visível na home agora**.

**a. A emenda entre o claro do hero e o branco da seção seguinte** ⚠️ *aparece hoje*

Localizei o mecanismo: `globals.css:585`, a regra `#top + *` põe a seção seguinte **por cima** do
hero enquanto ele afunda — de propósito, é o que faz a travessia. A borda de cima dela é a aresta.
Antes não se via porque os dois lados eram branco; agora é `#f4f8fc` de um lado e `#fff` do outro.
Degrau de largura cheia, ~20px abaixo do card: **y536 a 390px, y450 a 1440px**.

Vale dizer: **a sua foto de referência tem essa mesma aresta** — faixa azulada em cima, branco
puro embaixo. Então pode ser que ela seja o desenho, não o defeito. As três saídas:

1. **O mosaico também vira `#f4f8fc`.** Some a emenda de vez. Custo: o claro do hero deixa de ser
   um momento e passa a ser a cor da página — e aí vale checar as seções seguintes, que foram
   compostas contra branco.
2. **Degradê de `#f4f8fc` a `#fff`** na borda de cima do mosaico. Mantém o hero como momento e
   dissolve a aresta. É o mais barato e o que menos mexe no resto.
3. **Deixar.** Se a aresta é o desenho da referência, ela não é defeito — mas então precisa estar
   escrita como decisão, senão volta como bug na próxima conferência.

*Minha recomendação: **2**.* Entrega o efeito sem transformar a cor da home inteira.

⚠️ Seja qual for, uma nota tem de ser reescrita junto: `src/app/page.tsx:82` diz *"o hero encolhe
em card sobre fundo claro e já entrega a cor do mosaico"* — era verdade, deixou de ser nesta issue,
e agora **argumenta que a emenda não existe**.

**b. A 390px a marca `SISTRAN` sai cortada dos dois lados**

E é aritmeticamente insolúvel por enquadramento: a marca ocupa 56,9% da largura do quadro 1:1, e
uma janela de 390×844 mostra 46,2% dele com `cover`. Não há zoom nem deslocamento que resolva.
As saídas reais são duas: `contain` com tarja (aparece barra), ou **um corte de origem diferente
no próprio vídeo** para o celular. A segunda é mais trabalho e melhor resultado.

Fora do critério de aceite (que é ≥1024), mas é a mesma reclamação do logo cortado, no celular.

---

## 4. Duas varreduras que eu abriria como issue, se você quiser

Não são urgentes — são trabalho que vale existir como issue em vez de virar achado solto na
próxima conferência.

- **`matchMedia` dentro de `useEffect` em oito componentes.** É a origem da maior parte dos 24
  avisos de lint da linha de base. A forma da casa é `useSyncExternalStore` com o
  `MediaQueryList` em cache de módulo.
- **Auditoria dos "dois interruptores de movimento".** Toda cena que decide layout por
  `@media (prefers-reduced-motion)` **e** por hook precisa espelhar a regra em
  `html[data-motion="reduce"]`, senão o botão da interface mente. Foi exatamente o defeito da
  SIS-159 (quatorze parceiros desapareciam), e `events-spotlight.css` e `legacy.css` já tiveram
  o mesmo. Ninguém garantiu que não há um terceiro caso.

---

## 5. Achados de conferência esperando virar issue

Não cabem nas issues onde apareceram — e achado registrado em issue aprovada é achado morto.

- **Rolagem lateral em `/esg` no celular.** Medi `scrollWidth − innerWidth` = **7px a 390** e
  **3px a 768**; zero de 1024 para cima. É anterior à SIS-138, então aprovei a issue sem isso.
  Ninguém reporta 7px; todo mundo sente.
- **Caminhos SP/PR fechados** no `viewBox="0 0 720 640"` da cena de escritórios, e o **roxo de
  `BRASIL`** como decisão de token — os dois sobraram da conferência da SIS-169.

---

## 6. Aviso que vale ouro quando a SIS-155 andar

Trocar a tipografia **muda a largura de todo texto do site**, e este board acumulou limiares
medidos em pixel a partir da largura de um texto específico — o `1439.98px` da SIS-170 (medido
contra 131,5px de tinta de "Conheça também"), o contraste da SIS-138, o eixo do mapa da SIS-168,
os 358,7px do cartão da SIS-144. Já pedi na issue que a troca venha com **esses números
remedidos, antes e depois**, como critério de aceite. Sem isso ela reabre em silêncio defeitos
que custaram medição para fechar.

A SIS-155 é a **última da fila e isolada**, ratificado por você.

---

## Estado da fila — só o que não está fechado

| Issue | Estado |
|---|---|
| SIS-174 | Todo — piso de tamanho de texto (30 pontos abaixo de 11px); ainda não conferi |
| SIS-175 | Todo — o `copy-lock` trava `as React.CSSProperties` como se fosse cópia do site (aberta por mim na conferência da SIS-172) |
| SIS-173 | Todo — o `pareceCodigo()` descartando cinco frases publicadas de verdade |
| SIS-155 | Todo — última da fila, isolada (ver item 6) |
| SIS-131 | Backlog — espera as três URLs de vídeo (item 2) |
| SIS-123 | Backlog — o que sobrou é texto jurídico, que nenhum agente escreve |
| SIS-124 | Backlog — espera o documento do MTE (item 2) |
| SIS-154 | Backlog — `images: unoptimized`: **decisão sua**, deploy ou resíduo |
| SIS-125 | Backlog — índice da varredura; índice não tem "pronto". Virar documento, se quiser |

Todas as issues com label `conferido` e em In Review estão aprovadas e saíram deste arquivo.
