# Apresentação da home — o que foi feito, por quê, e na ordem em que se vê

Roteiro para apresentar a home ao vivo, rolando a página. Cada seção traz **o que aparece na
tela**, **o mecanismo** (o que dizer se perguntarem "como isso é feito?") e **a intenção** (por
que existe). Ao fim há a lista de tecnologias, as decisões transversais que valem repetir e um
bloco de perguntas prováveis.

Os números e mecanismos aqui vêm do código: `src/app/page.tsx` é a ordem, e cada componente
carrega no cabeçalho a justificativa da própria escolha.

---

## A ideia central, em uma frase

**A home é um percurso, não uma pilha de blocos.** A rolagem é o único controle: ela avança um
vídeo, sobe um texto, acende um número, monta uma cena. Quem rola conduz — nada acontece por
cronômetro, nada acontece sem o gesto de quem está lendo.

Se a apresentação tiver de caber em três frases, são estas:

1. **A rolagem é o roteiro.** O visitante dita o ritmo; a página responde.
2. **Cada seção entrega uma prova.** Vídeo (o que fazemos), marcas (quem confia), soluções
   (como fazemos), números (em que escala), montagem (o legado que transformamos), contato.
3. **O efeito nunca é a única via para a informação.** Desligue o JavaScript, ligue "reduzir
   movimento", entre por um celular antigo: o conteúdo continua todo lá, legível, sem
   movimento nenhum. Isso é decisão de projeto, medida e conferida — não sorte.

---

## A sequência, na ordem da rolagem

### 0. Abertura opcional — a marca se monta e sai de cortina

- **Na tela:** cena escura, um bloco modular claro que troca de geometria enquanto a página
  carrega, um percentual subindo. No fim o bloco **se transforma na marca do cabeçalho** e a
  cena se abre em duas metades — uma sai pelo topo, outra pela base.
- **Mecanismo:** o percentual é **progresso real** (DOM pronto, `load`, fontes carregadas), não
  um cronômetro fingindo carregamento. Os sinais reais somam 88%; os 12 finais só saem quando
  tudo resolve — e há teto de tempo para a abertura nunca segurar a página.
- **Intenção:** dar um instante de marca antes do conteúdo, sem pedágio. **Uma vez por sessão**
  — na segunda visita na mesma aba ela não aparece. A home já está pronta por baixo desde o
  primeiro quadro: a abertura é uma camada decorativa por cima, invisível para leitores de tela,
  e se o JavaScript falhar ela simplesmente nunca aparece.
- **Para dizer:** "o carregamento vira o primeiro gesto da marca, e ele é honesto — o número na
  tela é o carregamento de verdade."

### 1. Hero — a rolagem avança o vídeo quadro a quadro

- **Na tela:** vídeo à direita, dissolvendo no branco pela esquerda; ao lado, na coluna
  esquerda, a manchete. Rolando, **o vídeo avança**. Rolando para trás, ele volta.
- **Mecanismo:** a seção é alta (300vh no desktop, 200vh no mobile) com a cena **presa em
  100svh** (`position: sticky`). A posição da rolagem é convertida no `currentTime` do vídeo —
  é o efeito "scroll-driven video" que o site da Apple popularizou. A partitura é explícita:
  `0.00–0.58` o vídeo avança; `0.52–0.66` a manchete sai; `0.55–0.78` a pastilha "role para
  explorar" sai. Ao entrar na home o vídeo **começa a andar sozinho** até 0.58 — que é
  exatamente onde ele deixa de ser o assunto.
- **Detalhe que vale mostrar:** a **moldura ciana** em volta do quadro do vídeo, a partir de
  1024px, com o raio abrindo de 20 para 30px no fim do percurso. Ela existe para o olho ler onde
  o vídeo começa e termina, e some no lado em que o vídeo dissolve, para não deixar aresta seca.
- **Intenção:** o vídeo é o argumento de abertura, e quem controla é o visitante. Abaixo de
  1024px o layout é outro (vídeo em sangria, texto claro por cima) porque a divisão em duas
  colunas não caberia — são dois arranjos deliberados, não um responsivo improvisado.
- **Para dizer:** "não é um vídeo tocando: é a rolagem *sendo* o vídeo."

### 2. Parede de marcas — prova social logo no começo

- **Na tela:** título editorial centrado e, abaixo, quinze logos em células de uma malha de
  linhas finas com cruzes nos cruzamentos. O título **se revela palavra por palavra**, sob
  máscara; as logos entram em **cascata**, uma atrás da outra.
- **Mecanismo:** a revelação é **CSS**; o JavaScript só marca `data-in` no elemento quando ele
  entra em cena (um `IntersectionObserver`, um só, compartilhado). A cascata é índice por logo
  × um token de cadência.
- **Intenção:** duas decisões de conteúdo aqui. Primeira: as marcas **subiram** para o começo da
  página — prova de credibilidade serve mais na abertura que no rodapé. Segunda: a grade é
  **parada**, e substituiu uma faixa rolante infinita. Isso resolve três problemas de graça —
  nada a pausar, nada de conteúdo fora da tela inalcançável quando alguém pede menos movimento,
  e uma cópia só da lista (a faixa duplicava tudo, e a duplicata é ruído para leitor de tela).
- **Para dizer:** "trocamos o carrossel infinito por uma grade que mostra as quinze marcas de
  uma vez. Menos movimento, mais informação."

### 3. Soluções de Negócios — o texto sobe, a mídia fica

- **Na tela:** à esquerda, as quatro etapas em coluna, subindo com a rolagem normal; à direita,
  um painel de mídia **parado** que troca de imagem por dissolução conforme a etapa muda. A
  frase de cada etapa **acende caractere a caractere** enquanto ela é a ativa.
- **Mecanismo:** *sticky storytelling*. A coluna de texto tem altura real de documento (é ela
  que dá o percurso); o painel é `position: sticky` e se solta no rodapé da própria seção.
- **Acessibilidade:** a frase acesa letra por letra carrega o texto inteiro em `aria-label`, e a
  divisão em caracteres é invisível ao leitor de tela — **ele lê uma frase, não sessenta
  letras**.
- **Intenção:** é a seção que explica *como* trabalhamos, e o formato faz o trabalho: o texto
  avança, a imagem de apoio permanece no campo de visão em vez de passar voando.
- **Para dizer:** "o painel fica, o texto passa — é o que deixa a imagem ainda no olho quando
  você lê a linha seguinte."

### 4. Sistran em números — scrollytelling horizontal

- **Na tela:** faixa clara com o título e um marcador `03 / 07`; abaixo, um palco escuro
  separado por **uma curva larga**, não por um corte reto. Dentro do palco, uma curva única
  passando pelos sete indicadores; o ativo é a lente — anéis incompletos, número monumental,
  gráfico contextual. **A rolagem é vertical, e o que anda na horizontal é a trilha.**
- **Mecanismo:** um único gatilho de rolagem (`ScrollTrigger`, `scrub`) escreve variáveis CSS no
  nó do palco. Os números contam para cima ao entrar. **Nunca existe barra de rolagem
  horizontal.**
- **Não é carrossel, e a distinção importa:** há uma faixa de atalhos no pé do palco, mas o
  clique **não escolhe** o indicador — ele leva a *rolagem* até a altura em que aquele indicador
  é o da vez. O índice ativo sai de um lugar só, o progresso da rolagem. O botão existe porque
  sem ele o quarto número exigia rolar várias telas, e por teclado a cena era inalcançável.
- **Intenção:** sete números institucionais que precisam ser *lidos*, um a um, e não varridos.
- **Para dizer:** "a página rola como qualquer outra; a cena é que se move de lado. E os atalhos
  no pé existem por teclado, não por decoração."

### 5. Montagem presa ao scroll — o legado que se transforma

- **Na tela:** cena presa, e o gesto da rolagem controla um vídeo de montagem, **nos dois
  sentidos**. No fim do trecho a cena encolhe e vira um card centrado.
- **Mecanismo:** mesmo princípio do hero, com um cuidado a mais — o progresso passa por uma
  **mola** antes de virar tempo de vídeo. Ligado direto, o seek copia a granularidade do
  dispositivo: roda de mouse anda em degraus de dezenas de pixels e a montagem sai aos saltos.
- **Detalhe honesto:** enquanto não há quadro decodificado, o vídeo fica invisível e o que se vê
  é o fundo da seção — **não** o pôster, porque o pôster é a montagem já concluída e faria a
  sequência começar pelo fim. O pôster fica reservado para o modo de movimento reduzido.
- **Intenção:** mostrar transformação como processo, e não como antes-e-depois.
- **Para dizer:** "esse é o mesmo mecanismo do hero, aplicado a uma narrativa de legado — e a
  suavidade vem de uma mola, não do vídeo."

### 6. Contato — o painel surge com a rolagem

- **Na tela:** foto da sede, telefone e formulário chegam de baixo e de longe durante o primeiro
  terço da seção; depois **param e ficam legíveis** pelo resto do percurso.
- **Mecanismo:** seção alta com interior `sticky`; o que muda por quadro é variável CSS escrita
  direto no nó.
- **Intenção:** o formulário estava atrás de um clique em "Deixe uma mensagem" e agora é a
  própria seção. E é o **mesmo componente** do modal, mostrado inline — não um `<dialog>`
  abrindo sozinho, porque um modal sem clique prenderia o foco e travaria a rolagem de quem só
  estava passando. O modal continua existindo, aberto pelo botão do cabeçalho.
- **Para dizer:** "a conversão deixou de custar um clique. E o painel para de se mover na hora
  em que você precisa ler o telefone."

### 7. LinkedIn — o fechamento

- **Na tela:** palco reativo (marca d'água, luzes que respondem ao ponteiro, deslize por
  rolagem) e um cartão de duas faces.
- **Intenção:** fechar com o canal vivo da marca. A borda de cima desta seção é ajustada por
  classe porque **o que vem acima dela muda de página para página** — na home o contato fecha em
  azul-claríssimo, em outras rotas o vizinho de cima é escuro. A emenda é opcional em vez de
  recalibrada.

**Constantes ao longo de tudo:** cabeçalho fixo, uma coluna lateral de navegação por seção que
acende a seção da vez (a partir de 1280px) e o botão de voltar ao topo.

---

## As decisões transversais — o que sustenta a apresentação

Vale dizer estas em voz alta, porque são o que diferencia "site com animação" de "site
projetado".

**1. Rolagem suave, com uma curva só.** A página desliza (Lenis) na mesma família de curva que
as transições dos componentes usam — arranca rápido, assenta longo. É por isso que o deslize da
página "combina" com o resto: é a mesma assinatura de movimento, não duas.

**2. Um relógio compartilhado.** O progresso do documento é publicado uma vez por quadro como
variável CSS no `<html>`. Quem precisa saber "quanto da página já passou" lê essa variável, em
vez de abrir um segundo observador de rolagem. Um site com sete efeitos e um só observador.

**3. Nada re-renderiza a 60 Hz.** O que muda por quadro vai direto para o nó do DOM (variável
CSS ou transform), nunca para o estado do React. Em "Sistran em números", o único estado é o
índice ativo — que muda sete vezes no percurso inteiro.

**4. `sticky`, nunca `pin`.** Todas as cenas presas usam `position: sticky`. A alternativa
comum (`pin: true` do GSAP) remonta o nó no DOM e desalinha com a rolagem suave. É a mesma
escolha em todas as seções, o que faz o comportamento ser previsível.

**5. Estado em CSS, marca em JavaScript.** As entradas de bloco funcionam assim: o JavaScript só
escreve "isto entrou em cena"; todo o movimento é transição de CSS. Três ganhos concretos — as
preferências de movimento resolvem no CSS, sem um quadro de animação escapando antes; nenhuma
divergência entre o HTML do servidor e o do navegador; e **sem JavaScript o conteúdo aparece
pronto**, porque o estado escondido só existe depois que a página monta.

**6. Menos movimento é primeira classe, não uma nota de rodapé.** Há **duas** chaves — a
preferência do sistema operacional e um botão na própria interface — e as duas fazem a mesma
coisa. Com ela ligada, tudo já está visível antes de qualquer rolagem: os textos em posição
final, os números no valor final, o vídeo no pôster. E o critério que guiou cada caso foi
sempre o mesmo: *se isso parar para sempre, o visitante perde acesso a alguma informação?* Foi
por essa régua que a faixa rolante de logos virou grade parada — congelar um carrossel infinito
esconde o que estava fora da tela.

**7. Sem JavaScript, o site continua um site.** Abaixo de 1024px, com movimento reduzido, ou sem
JavaScript: as seções dirigidas viram listas completas em fluxo normal, com todos os valores no
HTML. O scrollytelling vive atrás de um atributo que só o JavaScript escreve — **não existe
estado em que a página fique presa sem quem a dirija.**

**8. As emendas entre seções são projetadas.** Cada fronteira de cor foi tratada: degradês que
dissolvem, uma curva larga em vez de corte reto, o navy de uma seção entrando na borda da
seguinte. Um detalhe que resume o cuidado: duas cores de branco vizinhas diferiam por 3 pontos,
e um degrau de 3 em um pixel de largura cheia **lê como um risco na tela** — foi medido em
raster e dissolvido em ~7% da altura da janela.

**9. Cada efeito foi medido, não inspecionado no olho.** Há sondas de navegador (Playwright) no
repositório que percorrem a página em vários viewports e afirmam números: contraste no pior
pixel de fundo, pixels efetivamente pintados na tela, quantos passos da rolagem têm o elemento
em quadro, se um elemento parado sob "menos movimento" continua visível. Quando um efeito é
entregue, ele vem com a tabela.

---

## Tecnologias — a resposta curta e a longa

**Curta:** Next.js com React, Tailwind, GSAP e Motion para o movimento, Lenis para a rolagem
suave, Three.js e MapLibre onde há 3D e mapa. Os efeitos são feitos com o que a plataforma dá —
`position: sticky`, transições de CSS, `IntersectionObserver` — e biblioteca só onde ela paga.

**Longa, por função:**

| Função | O que usamos | Por quê |
|---|---|---|
| Framework | **Next.js 16** (App Router) + **React 19** | renderização no servidor, rotas, otimização de imagem |
| Estilo | **Tailwind CSS** + folhas CSS por seção | utilitário para layout; CSS próprio onde a regra é longa e precisa de comentário |
| Rolagem suave | **Lenis** | uma curva só, alinhada com as transições da marca |
| Cenas presas à rolagem | **GSAP ScrollTrigger** | um gatilho por seção, com `scrub` (a animação segue a rolagem, não o tempo) |
| Movimento de componentes | **Motion** | valores de movimento escritos direto no DOM, sem re-render por quadro |
| Entradas de bloco | **CSS + IntersectionObserver** próprio | mais leve que biblioteca, e resolve preferência de movimento sem JavaScript |
| Vídeo dirigido por rolagem | `<video>` + controle de `currentTime` | um componente único no projeto, com mola onde a suavidade importa |
| 3D e mapa | **Three.js**, **MapLibre** | explorador de edifício e mapa de escritórios (outras rotas) |
| Ícones | **Lucide**, via catálogo interno | um só lugar de importação |
| Medição | **Playwright** | as sondas que geram as tabelas de aceite |

**O que deliberadamente *não* usamos:** `pin: true` (remonta o nó e desalinha com a rolagem
suave), carrossel infinito na home (esconde conteúdo quando congelado) e nenhuma biblioteca de
animação além das duas acima — o vocabulário de entrada é um só, para não haver cinco
mecanismos fazendo a mesma coisa.

---

## Perguntas prováveis, com resposta pronta

**"Isso não fica lento?"**
O que muda por quadro é `transform`, `opacity` e variável CSS — as propriedades que a GPU
compõe sem recalcular layout. Nada re-renderiza a interface a 60 Hz. Os vídeos são de fundo,
sem áudio, e as logos carregam com prioridade baixa para não disputar o primeiro quadro com o
hero.

**"E no celular?"**
Os percursos existem, mais curtos, e as cenas de duas colunas viram uma só. Onde a divisão não
cabe (o hero, por exemplo), o arranjo é outro por decisão — vídeo em sangria e texto claro por
cima —, não um layout de desktop encolhido.

**"E quem tem sensibilidade a movimento?"**
Duas chaves, a do sistema e uma na página. Com qualquer uma ligada, tudo aparece pronto e nada
se move — e nenhum conteúdo fica inalcançável, que é o erro comum de quem só desliga as
animações.

**"E se o JavaScript não carregar?"**
A página continua completa: textos, números finais, formulário, logos. Os efeitos são a camada
de cima.

**"Quanto disso é biblioteca pronta?"**
O layout e o movimento são nossos. As bibliotecas entram como motor (rolagem suave, gatilho de
rolagem), não como template — cada cena da home é desenhada para o conteúdo dela.

---

## Roteiro de 3 minutos (se o tempo for curto)

1. **Abre a home** — deixa a abertura rodar. *"O carregamento é a primeira coisa que fala da
   marca, e o número é real."*
2. **Rola devagar no hero** — mostra o vídeo indo e **voltando**. *"A rolagem é o vídeo."*
3. **Para na parede de marcas** — título por palavra, logos em cascata. *"Prova social na
   abertura, e parada de propósito: quinze marcas visíveis de uma vez."*
4. **Rola Soluções** — mostra o painel que fica enquanto o texto sobe.
5. **Entra em Números** — mostra a trilha andando de lado com a rolagem vertical, e clica um
   atalho. *"O clique move a rolagem, não escolhe o número."*
6. **Liga "reduzir movimento"** e rola de novo. *"Mesmo conteúdo, sem movimento nenhum, e nada
   escondido."* ← **é este o momento que impressiona quem entende do assunto.**
7. **Fecha no contato.** *"O formulário deixou de custar um clique."*
