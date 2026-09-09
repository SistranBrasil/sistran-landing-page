# Prompt para o Claude Code — Sistran V2: correção real de proporção e composição

Refatore a landing page da Sistran para que a mudança seja visualmente evidente e proporcional às referências abaixo:

- https://vision.avatr.com/
- https://waabi.ai/
- https://titangatequity.com/
- https://oryzo.ai/
- https://fluid.glass/

Página publicada a ser corrigida:

- https://sistran-landing-page.vercel.app/

## Contexto: a primeira execução não resolveu o problema

A primeira refatoração alterou principalmente durações de scroll e acrescentou elementos pequenos:

- Hero: `320vh` → `260vh`.
- Mosaico: `205svh` → `172svh`.
- Números: `520vh` → `340vh`.
- Luminna: `320svh` → `216svh`.
- Contato: `200svh` → `110svh`.
- Foram adicionados capítulos na Luminna e um `mosaic-handoff`.

Apesar disso, a percepção visual permaneceu praticamente igual. A composição, a escala tipográfica, o tamanho dos componentes e a ocupação do viewport não foram reconstruídos. O `mosaic-handoff` atual é uma camada isolada e rápida; Soluções, Números e Parceiros continuam sendo palcos independentes.

Nesta execução, **não considere redução de altura, troca de copy ou adição de pequenos fades como refatoração suficiente**.

## O que diferencia as referências

As referências não são melhores apenas porque têm mais animação. Elas trabalham com:

1. Tipografia de impacto ocupando aproximadamente `7vw` a `15vw` nos momentos principais.
2. Uma mensagem dominante por viewport.
3. Imagens, vídeos ou objetos ocupando de 55% a 100% do palco.
4. Mudança clara de composição a cada beat narrativo.
5. Transições que reutilizam o elemento anterior, em vez de apagar uma seção e iniciar outra.
6. Contraste entre capítulos — escuro, claro, mídia e tipografia — evitando grandes áreas visualmente iguais.
7. Trilhas longas somente quando existem vários estados visuais reais dentro delas.

Como referência objetiva:

- Waabi usa títulos principais de até `min(14vw, 15rem)` e mídia em escala de viewport.
- TitanGate usa títulos entre aproximadamente `6.8vw` e `7.6vw` e hero com cerca de `100vh`.
- Oryzo possui momentos tipográficos de `15vw` combinados com objetos 3D/canvas.
- Fluid Glass usa mídia praticamente full-screen e mudanças de composição ao longo das trilhas.
- AVATR utiliza trilhas de `300lvh` a `500lvh`, mas cada trilha contém diversos estados visuais; não é uma tela estática prolongada.

Não copie identidade visual, conteúdo ou assets dessas marcas. Adote as proporções, hierarquia, densidade e continuidade.

## Regra obrigatória de execução

Antes de editar:

1. Inspecione os componentes e seletores reais.
2. Registre as medidas atuais dos principais elementos em viewport desktop de `1440×900`.
3. Tire capturas da versão atual nos pontos listados em “Validação visual”.
4. Identifique quais componentes precisam mudar de DOM, não apenas de CSS.

Depois implemente. Não pare em um plano e não aguarde nova confirmação, salvo bloqueio real.

## Mudança estrutural obrigatória

### Criar uma jornada única: Soluções → Handoff → Números → Parceiros

Soluções, Números e Parceiros devem compartilhar um único palco desktop e uma única timeline principal.

Crie um componente estrutural equivalente a:

```tsx
<ProofJourney>
  <StickyStage>
    <SolutionsLayer />
    <TransitionLayer />
    <MetricsLayer />
    <PartnersLayer />
    <SignalLine />
  </StickyStage>
</ProofJourney>
```

Use os nomes adequados ao projeto. O resultado obrigatório é:

- um único wrapper de scroll;
- um único sticky/pin no desktop;
- uma timeline-mestra;
- labels `solutions`, `handoff`, `metrics` e `partners`;
- sem pin aninhado;
- sem três seções independentes apenas colocadas em sequência.

Remova a dependência do `mosaic-handoff` atual como camada fixa independente. O elemento de transição deve existir dentro da jornada e permanecer visualmente conectado aos dois estados.

### Duração da jornada

Use aproximadamente `600vh` a `660vh` no desktop:

| Intervalo | Conteúdo |
| --- | --- |
| 0–38% | quatro soluções |
| 38–46% | transformação Soluções → Números |
| 46–91% | sete métricas |
| 91–100% | parceiros |

Cada solução deve receber aproximadamente `55vh` a `65vh`. Cada métrica deve receber aproximadamente `38vh` a `46vh`.

## Direção visual por capítulo

### 1. Hero

O hero precisa ter impacto semelhante às referências, preservando o vídeo e a identidade Sistran.

- Manter três beats, mas fazer cada mensagem dominar o viewport.
- Título visual: `font-size: clamp(4.5rem, 7.8vw, 9rem)`.
- Largura do título: `max-width: 12ch` a `15ch`, conforme a frase.
- Linha: `0.88` a `0.98`.
- O título deve ocupar aproximadamente 55% a 70% da largura útil.
- Texto de apoio: `clamp(1.05rem, 1.35vw, 1.35rem)` e máximo de 38ch.
- O vídeo deve ocupar 100% do viewport, sem grandes áreas azuis vazias.
- Cada beat deve alterar enquadramento, máscara ou escala do vídeo, não apenas trocar a frase.
- A passagem final deve criar a linha-sinal ciano que entra no Mosaico.

Não mantenha o título principal visual limitado ao atual `clamp(2rem, 4.4vw, 3.7rem)`.

### 2. Mosaico

O mosaico ainda usa cards pequenos — aproximadamente `clamp(6rem, 11vw, 11rem)` — distribuídos em uma área muito grande.

Refaça a proporção:

- Mostrar no máximo cinco cards simultaneamente.
- Cards secundários: largura entre `clamp(10rem, 15vw, 15rem)`.
- Card dominante: entre `28vw` e `38vw`, preservando aspect ratio.
- Ocupação visual total dos cards: pelo menos 65% do viewport.
- Reduzir o excesso de vazio central.
- Dividir a progressão em três grupos: capacidade, tecnologia e entrega.
- O card dominante final deve mover, escalar e se tornar a mídia da primeira solução.
- A transformação deve durar pelo menos `30vh` de scroll para ser percebida.

Não adicionar mais cards. Aumente hierarquia, escala e foco.

### 3. Soluções

Transforme cada solução em um quadro editorial de viewport:

- Palco com largura entre 92vw e 96vw.
- Mídia principal ocupando entre 58% e 68% da largura.
- Altura visual da mídia entre 62svh e 74svh.
- Título da solução: `clamp(2.8rem, 4.8vw, 5.8rem)`.
- Texto: máximo 34ch.
- Navegação lateral com baixa interferência; não competir com a mídia.
- Usar assimetria e sobreposição controlada, não um card pequeno centralizado.
- Cada mudança de solução deve alterar mídia, título, posição da linha-sinal e cor de acento.

Use fundo azul-marinho profundo para Soluções, por exemplo próximo de `#001A3D`, e não o mesmo azul saturado usado em toda a jornada.

### 4. Handoff Soluções → Números

O handoff precisa ser claramente visível.

1. A mídia da última solução ocupa inicialmente entre 60% e 65% do viewport.
2. Ela centraliza e perde conteúdo fotográfico por máscara.
3. Sua moldura se expande até entre 82vw e 90vw.
4. O conector da solução vira a curva dos números.
5. “Soluções de Negócios” sai por máscara.
6. “Escala que transforma o mercado de seguros” entra no mesmo eixo.
7. O primeiro número aparece dentro da moldura transformada.

Duração mínima: `45vh` a `55vh` de scroll.

Não use um fade de poucos frames. Não faça o card desaparecer e a próxima seção surgir.

### 5. Reconstrução completa de “Sistran em números”

A seção atual é desproporcional porque limita o item a cerca de `210px`, usa uma lente de no máximo `400px` e mantém o título em apenas `clamp(1.6rem, 2.6vw, 2.4rem)` dentro do modo dirigido.

Remova essas limitações.

#### Novo quadro ativo

```text
┌─────────────────────────────────────────────────────────────┐
│ SISTRAN EM NÚMEROS                              01 / 07      │
│                                                             │
│ 850+                         microvisual contextual           │
│ Membros do Grupo Sistran    rede de pessoas e conexões       │
│ Um time que combina...                                      │
│                                                             │
│ ─────────── linha-sinal / progresso ─────────────────────── │
└─────────────────────────────────────────────────────────────┘
```

Proporções obrigatórias no desktop:

- Quadro ativo: largura entre `86vw` e `92vw`; altura entre `62svh` e `72svh`.
- Grid interno: aproximadamente 58% conteúdo e 42% microvisual.
- Número: `font-size: clamp(9rem, 15vw, 14rem)`.
- Título geral “Escala que transforma…”: `clamp(3.2rem, 5.2vw, 6.2rem)`.
- Rótulo da métrica: `clamp(1.5rem, 2.4vw, 2.6rem)`.
- Texto de apoio: `clamp(1rem, 1.2vw, 1.2rem)`, máximo 34ch.
- Contador `01 / 07`: `clamp(.85rem, 1vw, 1rem)`.
- Microvisual: largura mínima de 32vw e máxima próxima de 40vw.

Estados adjacentes:

- anterior em `x: -55vw`, `scale: .82`, `opacity: .10`;
- próximo em `x: 55vw`, `scale: .82`, `opacity: .14`;
- apenas partes deles podem aparecer nas bordas;
- não mostrar quatro métricas pequenas ao mesmo tempo.

Transição por métrica:

```ts
entrada: { xPercent: 42, scale: 0.86, autoAlpha: 0 }
ativa:   { xPercent: 0,  scale: 1,    autoAlpha: 1 }
saída:   { xPercent: -42, scale: 0.9, autoAlpha: 0 }
scrub: 0.9
```

Microvisuais:

- 850+: rede de pessoas e nós.
- 23+: selos em órbita.
- 130+: mapa da América do Sul.
- 650 mil+: curva de capacidade acumulada.
- 230+: módulos ERP se conectando.
- 35+: rede de seguradoras.
- 25+: comunicado → regulação → conclusão.

Os microvisuais devem ter movimento interno discreto e responder ao progresso do capítulo. Use SVG/CSS leve; não use ícones pequenos dentro de uma lente pequena.

Simplifique o progresso. Mantenha somente:

1. `01 / 07`;
2. linha-sinal com sete marcações.

Remova régua adicional, atalhos repetidos ou outros indicadores concorrentes.

### 6. Parceiros

Ao sair de `07 / 07`:

- a curva perde amplitude e vira uma linha horizontal;
- o quadro ativo se abre para fundo off-white;
- os logos surgem da linha em grupos, com deslocamento vertical curto;
- logos devem ter altura entre `3rem` e `4.5rem`, preservando proporção;
- manter no máximo oito logos visíveis por quadro;
- se houver marquee, ele deve ser lento, pausável e com duplicatas `aria-hidden`.

Essa mudança de azul profundo para off-white é obrigatória para criar um novo capítulo visual.

### 7. Luminna AI

A primeira execução adicionou três capítulos, mas os colocou simultaneamente em uma grid e com títulos de aproximadamente `1rem`. Isso não cria narrativa.

Refaça:

- Um capítulo ativo por vez.
- Título principal: `clamp(3.8rem, 7vw, 7.5rem)`.
- Título do capítulo: `clamp(1.7rem, 2.4vw, 2.5rem)`.
- Texto do capítulo: `clamp(1rem, 1.25vw, 1.2rem)` e máximo 38ch.
- Bloco ativo ocupando entre 35vw e 46vw.
- Inativos devem sair por máscara ou opacity; não ficar como três colunas pequenas.
- Sincronizar Compreender, Transformar e Validar e evoluir com três momentos reais do vídeo.
- O enquadramento do vídeo deve mudar levemente em cada capítulo.

Manter aproximadamente `210svh` a `240svh`, desde que existam os três estados visuais.

### 8. Contato

A altura atual próxima de `110svh` pode ser mantida. O trabalho necessário é de proporção:

- área principal entre 84vw e 90vw, máximo próximo de 1240px;
- altura visual entre 68svh e 78svh;
- título: `clamp(3rem, 5vw, 5.5rem)`;
- imagem aproximadamente 38% e formulário 62%;
- linha-sinal termina desenhando parte da borda do formulário;
- depois do reveal, formulário totalmente estável.

## Contraste entre capítulos

Use esta progressão de superfícies como referência:

| Capítulo | Superfície |
| --- | --- |
| Hero | vídeo escuro em tela cheia |
| Mosaico | branco/off-white |
| Soluções | navy profundo `#001A3D` |
| Números | gradiente `#003F73` → `#005C9E` |
| Parceiros | off-white `#F5FAFF` |
| Luminna | navy quase preto com vídeo |
| Contato | ice blue / branco |

Preserve a paleta Sistran, mas pare de usar o mesmo azul saturado por milhares de pixels de altura.

## Mobile e tablet

Não reproduza a timeline desktop.

- Hero: um beat por viewport com vídeo/poster estável.
- Mosaico: cards de 72vw a 84vw com scroll snap.
- Soluções: stepper vertical; mídia acima e texto abaixo.
- Números: um card por vez, largura 88vw, snap horizontal ou fluxo vertical.
- Número mobile: `clamp(5.5rem, 28vw, 8rem)`.
- Luminna: vídeo e capítulos em fluxo vertical.
- Parceiros: grid de duas ou três colunas.
- Contato: coluna única.

## Regras técnicas

- Reutilize Next.js, GSAP, ScrollTrigger, Framer Motion e Lenis existentes conforme responsabilidade atual; não adicione outra biblioteca.
- Mantenha apenas uma instância Lenis.
- Use `gsap.context` e `gsap.matchMedia`.
- Não crie pin aninhado.
- Priorize `transform`, `opacity`, SVG e máscaras simples.
- Não anime layout continuamente.
- Faça cleanup de timeline, trigger, observers, RAFs e listeners.
- Preserve `prefers-reduced-motion` como layout completo.
- Preserve links, formulário, analytics, SEO e conteúdo.

## Validação visual obrigatória

Teste em `1440×900` e `390×844`.

Gere capturas depois da implementação nos seguintes pontos:

1. Hero beat 1.
2. Hero beat 3.
3. Mosaico no meio.
4. Mosaico no handoff.
5. Solução 01.
6. Solução 04.
7. Meio do handoff Soluções → Números.
8. Número `01 / 07`.
9. Número `04 / 07`.
10. Número `07 / 07`.
11. Entrada de Parceiros.
12. Luminna — Compreender.
13. Luminna — Transformar.
14. Luminna — Validar e evoluir.
15. Contato.

Compare com as capturas anteriores e verifique:

- nenhum conteúdo principal ocupa menos de 45% da largura útil;
- não existe mais de um viewport sem mudança visual relevante;
- cada `40vh` a `80vh` de scroll produz uma mudança de mensagem, mídia ou composição;
- títulos principais realmente dominam o quadro;
- o ativo de Números é editorial e grande, não um item de 210px;
- a transição entre Soluções, Números e Parceiros pode ser entendida em uma captura intermediária;
- não existem grandes blocos monocromáticos sem conteúdo em movimento.

Se as capturas parecerem visualmente iguais às anteriores, a tarefa não está concluída.

## Critérios de aceite no código

- Existe um wrapper real para a jornada Soluções → Números → Parceiros.
- Existe uma única timeline desktop controlando os três capítulos.
- O limite de `210px` do item de Números foi removido.
- A lente de no máximo `400px` deixou de ser o container principal.
- O título dirigido de Números não está mais limitado a `2.4rem`.
- Os três capítulos da Luminna não aparecem simultaneamente como cards pequenos.
- O hero possui escala tipográfica visivelmente maior.
- Mosaico possui menos cards simultâneos e cards maiores.
- Parceiros possui superfície clara que encerra visualmente a jornada azul.
- Mobile não herda o pin e as alturas do desktop.
- Build, lint e testes existentes passam.
- Não existem erros novos no console ou triggers duplicados.

## Entrega final

Ao terminar, informe:

1. componentes e arquivos realmente reestruturados;
2. seletores antigos removidos ou substituídos;
3. medidas anteriores e novas em `1440×900`;
4. duração final de cada capítulo;
5. caminhos das 15 capturas de validação;
6. resultado de build, lint e testes;
7. pendências reais.

Não responda apenas que “as animações foram aprimoradas”. Demonstre a mudança com medidas, estrutura de código e capturas.
