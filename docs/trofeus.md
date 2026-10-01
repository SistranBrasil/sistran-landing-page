Quero substituir completamente a seção atual de premiações da página `/quem-somos`.

Use a imagem de referência anexada como especificação visual da nova seção. Implemente a composição com máxima fidelidade, respeitando o design system, os componentes, a stack e os padrões já existentes no projeto.

## Antes de implementar

1. Analise a estrutura atual da página `/quem-somos`.
2. Localize o componente da seção de premiações.
3. Identifique os assets já utilizados:

   * Troféu Gaivotas de Ouro.
   * Logo do Prêmio Cobertura Performance.
   * Logo do reconhecimento internacional.
   * Logo da certificação de qualidade.
4. Reutilize esses arquivos originais. Não redesenhe, não gere e não substitua os logos.
5. Preserve o header, o footer e todas as outras seções da página.
6. Não altere outras rotas.
7. Preserve a stack, as bibliotecas, os tokens e os padrões arquiteturais existentes.

## Objetivo

Criar uma galeria editorial expansível para apresentar os reconhecimentos da Sistran.

A nova seção deve ser 100% diferente da estrutura anterior.

Remover completamente:

* Menu lateral de premiações.
* Numeração dos itens.
* Número gigante “12”.
* Linhas conectando o menu ao conteúdo.
* Grande cartão central arredondado.
* Cartões empilhados ao fundo.
* Coluna lateral de miniaturas.
* Setas de navegação.
* Indicadores numerados.
* Paginação inferior.
* Aparência de dashboard ou painel técnico.

Não reaproveitar a estrutura HTML ou visual anterior. Reutilizar apenas os dados e assets reais.

# Conteúdo

Usar exatamente os textos abaixo:

Eyebrow:

`RECONHECIMENTOS`

Título:

`Reconhecimentos que marcam nossa trajetória`

Texto de apoio:

`Prêmios e certificações apresentados em uma galeria viva.`

Categorias:

* `Gaivotas de Ouro`
* `Prêmios Cobertura Performance`
* `Reconhecimentos internacionais`
* `Certificações de qualidade e métricas`

Texto de interação:

`Passe o cursor ou continue rolando`

Texto decorativo de fundo:

`NOSSA TRAJETÓRIA`

Não inventar métricas, datas, quantidades, prêmios, certificações ou textos adicionais.

# Estrutura visual

## Fundo da seção

A seção deve usar predominantemente superfícies claras:

* Fundo principal: branco ou azul-gelo muito claro.
* Textos principais: azul-marinho.
* Azul institucional como cor secundária.
* Ciano somente como cor de destaque.
* Dourado deve aparecer apenas nos próprios assets dos prêmios.

Sugestão de tokens:

```css
--recognition-paper: #f7fbfe;
--recognition-white: #ffffff;
--recognition-ink: #06183b;
--recognition-navy: #051b3a;
--recognition-blue: #0b5f9f;
--recognition-signal: #16c8f4;
--recognition-muted: #667c99;
--recognition-line: rgba(19, 98, 151, 0.16);
--recognition-ease: cubic-bezier(0.19, 1, 0.22, 1);
```

Não aplicar gradiente nos textos.

## Cabeçalho da seção

Criar um bloco editorial acima da galeria.

Alinhamento à esquerda:

```text
RECONHECIMENTOS

Reconhecimentos que
marcam nossa trajetória

Prêmios e certificações apresentados em uma galeria viva.
```

Diretrizes:

* Eyebrow em caixa alta, ciano, com tracking amplo.
* Título grande, azul-marinho, peso entre 600 e 700.
* Usar aproximadamente duas linhas no desktop.
* Line-height entre `0.95` e `1.02`.
* Texto de apoio menor, com largura controlada.
* Manter bastante espaço em branco.

No lado direito, inserir o texto decorativo:

```text
NOSSA
TRAJETÓRIA
```

Esse texto deve:

* Ter escala monumental.
* Usar apenas contorno.
* Não possuir preenchimento.
* Ter azul muito claro e baixa opacidade.
* Ficar parcialmente recortado pelas bordas.
* Ser decorativo e receber `aria-hidden="true"`.
* Não prejudicar a leitura do conteúdo principal.

## Galeria expansível

Abaixo do cabeçalho editorial, criar uma faixa horizontal com quatro painéis verticais encostados.

Os painéis não devem parecer quatro cards separados. Eles devem formar uma única composição arquitetônica contínua.

Estrutura conceitual:

```text
| painel ativo e expandido | painel fechado | painel fechado | painel fechado |
```

### Painel ativo

O primeiro estado deve apresentar `Gaivotas de Ouro` como ativo.

Características:

* O painel ativo ocupa aproximadamente 48% a 52% da largura total.
* Fundo azul-marinho.
* Título em branco, grande e alinhado próximo ao canto inferior esquerdo.
* Troféu centralizado e apresentado em grande escala.
* Usar o PNG original do troféu com `object-fit: contain`.
* Colocar o troféu sobre uma base elíptica discreta.
* A base pode ter um brilho ciano muito controlado.
* Adicionar apenas um ou dois círculos técnicos finos atrás do troféu.
* Não adicionar card interno.
* Não adicionar borda arredondada ao conteúdo.
* Não exibir números, datas ou contadores.

Adicionar uma pequena linha ciano abaixo do título, funcionando como sinal visual do painel ativo.

### Painéis inativos

Os outros três painéis devem dividir igualmente o espaço restante.

Cada painel deve conter:

* Fundo branco ou azul-gelo.
* Linha divisória vertical muito fina.
* Logo correspondente centralizado.
* Logo usando `object-fit: contain`.
* Nome da categoria próximo à parte inferior.
* Pequena linha ciano horizontal abaixo do título.
* Muito espaço livre ao redor do logo.

Não utilizar caixas internas em volta dos logos.

Não adicionar sombras pesadas.

Não transformar os painéis em cards independentes com cantos arredondados.

# Interação no desktop

A galeria deve funcionar como um `ExpandableCarousel` controlado por scroll, teclado, clique e hover.

## Scroll

Criar uma experiência sticky no desktop:

* Wrapper externo com aproximadamente `320svh`.
* Conteúdo visual com `position: sticky`.
* Altura visual próxima de `100svh`.
* Considerar a altura do header existente.
* Não interceptar nem bloquear o scroll nativo.
* Não usar `preventDefault()` no evento de roda.
* Dividir o progresso do scroll em quatro etapas.
* Cada etapa ativa um dos quatro painéis.

Sequência:

1. Gaivotas de Ouro.
2. Prêmios Cobertura Performance.
3. Reconhecimentos internacionais.
4. Certificações de qualidade e métricas.

Quando um novo painel for ativado:

* O painel anterior deve contrair.
* O novo painel deve expandir.
* A largura deve animar em aproximadamente `600ms`.
* Usar `cubic-bezier(0.19, 1, 0.22, 1)`.
* O logo deve subir levemente por uma máscara com `overflow: hidden`.
* O título deve mudar de uma apresentação compacta para uma apresentação maior.
* O fundo do painel deve transicionar de claro para azul-marinho.
* O texto deve mudar de azul-marinho para branco.
* A linha ciano inferior deve crescer da esquerda para a direita.

Não usar animações elásticas, bounce, tilt ou movimento magnético.

## Hover e clique

No desktop:

* Hover pode antecipar visualmente a expansão do painel.
* Clique deve fixar o painel selecionado.
* O hover não pode ser o único meio de interação.
* Quando o usuário voltar a rolar, o estado volta a acompanhar o progresso do scroll.

## Teclado

Os painéis devem ser navegáveis por teclado.

Implementar:

* `Tab` para acessar a galeria.
* `ArrowLeft` e `ArrowRight` para alterar o painel.
* `Home` para selecionar o primeiro.
* `End` para selecionar o último.
* `Enter` ou `Space` para ativar.
* Foco visível tanto no painel claro quanto no escuro.

Usar botões semânticos ou cabeçalhos com botões reais.

Aplicar `aria-expanded`, `aria-controls` e rótulos acessíveis quando apropriado.

# Movimento dos elementos

## Painel ativo

Ao ativar um painel:

```text
largura: fechada → expandida
background: claro → azul-marinho
título: compacto → ampliado
logo: translateY(24px) → translateY(0)
logo: opacity 0.3 → opacity 1
linha ciano: scaleX(0) → scaleX(1)
```

O movimento deve parecer elegante e contínuo.

## Texto decorativo

O texto `NOSSA TRAJETÓRIA` pode realizar um deslocamento horizontal muito discreto conforme o progresso geral da seção.

Limitar o movimento a aproximadamente 30 ou 40 pixels.

Não usar parallax excessivo.

## Entrada da seção

Quando a seção entrar na viewport:

* Eyebrow aparece primeiro.
* Título aparece com leve deslocamento vertical.
* Texto de apoio aparece por último.
* Não dividir parágrafos em letras.
* A animação total deve ficar abaixo de 900ms.

# Mobile e tablet

Abaixo de `64rem`, remover o sticky longo.

No mobile:

* O conteúdo deve seguir o fluxo normal da página.
* Cabeçalho editorial ocupa a largura disponível.
* Esconder ou reduzir bastante o texto decorativo `NOSSA TRAJETÓRIA`.
* Transformar a galeria em um carrossel horizontal com scroll nativo.
* Usar `scroll-snap-type: x mandatory`.
* Cada painel deve ocupar aproximadamente `82vw`.
* Usar `scroll-snap-align: start`.
* Permitir gesto de arrastar naturalmente.
* Não criar autoplay.
* Não bloquear o scroll vertical.
* Não depender de hover.
* Manter os quatro painéis legíveis.
* Garantir alvos de toque com pelo menos `44 × 44px`.
* Manter uma parte do próximo painel visível para comunicar continuidade.

No mobile, os painéis podem permanecer escuros individualmente ou usar alternância clara/escura, desde que o contraste permaneça correto.

# Estrutura de componentes

Separar responsabilidades.

Sugestão:

```text
RecognitionSection
├── RecognitionHeading
├── RecognitionBackdrop
├── ExpandableRecognitionGallery
│   └── RecognitionPanel
└── RecognitionScrollHint
```

Criar os dados em uma estrutura tipada, sem conteúdo preso ao JSX:

```ts
type RecognitionItem = {
  id: string;
  title: string;
  image: string;
  imageAlt: string;
};

const recognitions: RecognitionItem[] = [
  {
    id: "gaivotas-de-ouro",
    title: "Gaivotas de Ouro",
    image: "...",
    imageAlt: "Troféu Gaivotas de Ouro",
  },
  {
    id: "cobertura-performance",
    title: "Prêmios Cobertura Performance",
    image: "...",
    imageAlt: "Prêmio Cobertura Performance",
  },
  {
    id: "reconhecimentos-internacionais",
    title: "Reconhecimentos internacionais",
    image: "...",
    imageAlt: "Reconhecimento internacional",
  },
  {
    id: "certificacoes",
    title: "Certificações de qualidade e métricas",
    image: "...",
    imageAlt: "Certificação de qualidade",
  },
];
```

Ajuste os caminhos para os assets reais encontrados no projeto.

Não copie os caminhos de exemplo literalmente.

# Regras técnicas

* Preservar a stack atual do projeto.
* Se o projeto utiliza Next.js, React e TypeScript, permanecer nessa stack.
* Reutilizar o sistema de estilos existente.
* Não instalar biblioteca nova se CSS e APIs nativas forem suficientes.
* Se Motion/Framer Motion já estiver instalado, ele pode ser reutilizado.
* Para ativação por viewport, preferir `IntersectionObserver` ou progresso de scroll já disponível no projeto.
* Evitar listener de scroll sem `requestAnimationFrame`.
* Não causar re-render a cada pixel de rolagem.
* Imagens devem possuir dimensões definidas.
* Utilizar o componente de imagem já adotado no projeto.
* Os assets abaixo da primeira dobra podem usar carregamento tardio.
* Evitar `will-change` permanente.
* Não criar WebGL ou Three.js para esta seção.
* O efeito deve ser implementado com HTML, CSS, SVG decorativo e JavaScript mínimo.

# Acessibilidade

* Todo conteúdo deve existir no DOM, mesmo quando o painel estiver fechado.
* Não esconder informação essencial apenas por causa da animação.
* Logos informativos devem possuir `alt` adequado.
* Elementos puramente decorativos devem usar `aria-hidden="true"`.
* Garantir contraste mínimo WCAG AA.
* Garantir foco visível.
* Manter uma hierarquia correta de headings.
* Não usar `div` clicável sem semântica de botão.
* A seção deve ser utilizável sem mouse.

## Movimento reduzido

Em `prefers-reduced-motion: reduce`:

* Remover sticky prolongado.
* Exibir os quatro painéis no fluxo normal.
* Remover parallax.
* Remover animações de máscara.
* Reduzir as transições para no máximo `150ms`.
* Manter todos os conteúdos visíveis e acessíveis.

# Restrições visuais

Não criar:

* Menu lateral.
* Número “12”.
* Contadores.
* Numeração dos painéis.
* Paginação.
* Setas grandes de carrossel.
* Miniaturas laterais.
* Bolinhas de progresso.
* Linhas conectando componentes.
* Painel central com várias bordas.
* Cartões empilhados.
* Dashboard.
* Neon excessivo.
* Gradiente nos textos.
* Logos inventados.
* Prêmios inventados.
* Novos dados ou métricas.

# Critérios de aceite

A implementação será considerada concluída quando:

1. A estrutura anterior tiver sido completamente removida.
2. A nova seção estiver visualmente fiel à imagem de referência.
3. O primeiro painel abrir com `Gaivotas de Ouro`.
4. Os quatro painéis utilizarem os assets reais do projeto.
5. A expansão funcionar por scroll no desktop.
6. Hover, clique e teclado também funcionarem.
7. O mobile usar scroll-snap nativo.
8. A página não sofrer saltos de layout.
9. Nenhuma outra seção ou rota for modificada.
10. O conteúdo continuar acessível sem animação.
11. `prefers-reduced-motion` estiver implementado.
12. O build de produção passar sem erros.
13. Os testes existentes continuarem passando.

Ao finalizar:

* Informe os arquivos criados e alterados.
* Explique resumidamente como o progresso do scroll controla o painel ativo.
* Informe onde os dados dos reconhecimentos estão armazenados.
* Execute o build e os testes disponíveis.
* Corrija qualquer erro antes de concluir.
