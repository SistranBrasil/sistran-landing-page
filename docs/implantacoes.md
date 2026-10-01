Atue como um especialista sênior em UX/UI, motion design e desenvolvimento front-end com Next.js/React.

Preciso reconstruir a seção “Nossa trajetória” da página `/quem-somos` do site da Sistran Brasil.

Antes de implementar, analise os componentes, estilos, tokens, fontes, breakpoints, animações e bibliotecas que já existem no projeto. Reutilize a estrutura atual e preserve o padrão visual das demais páginas. Não modifique header, footer ou outras seções.

## Objetivo

Transformar a linha do tempo atual em uma experiência narrativa dividida em duas partes:

1. Uma preview compacta apresentando toda a trajetória de 1988 até o presente.
2. Uma linha do tempo detalhada controlada pelo scroll natural da página.

A experiência deve começar obrigatoriamente em 1988.

A preview deve ajudar o visitante a compreender rapidamente a dimensão da trajetória antes de entrar no fluxo detalhado.

Não utilizar a imagem do infográfico antigo como background. Todas as estruturas devem ser construídas com HTML, CSS, React e SVG. Somente os quatro ícones fornecidos devem ser usados como imagens.

---

# 1. Preview geral da trajetória

Criar uma nova seção imediatamente antes da linha do tempo detalhada.

## Estrutura

Em desktop, utilizar uma composição de duas áreas:

- Área principal, ocupando aproximadamente 65% da largura.
- Painel de indicadores, ocupando aproximadamente 35%.

Configurações sugeridas:

- `max-width: 1440px`
- Centralizado horizontalmente.
- `min-height` entre `680px` e `820px`.
- Padding horizontal responsivo.
- Fundo azul-gelo muito claro.
- Grid técnico extremamente discreto.
- Linhas curvas arquitetônicas quase transparentes.
- Muito espaço em branco.

O fundo não deve parecer futurista, espacial ou excessivamente tecnológico.

## Cabeçalho da preview

Adicionar:

Eyebrow:

`NOSSA TRAJETÓRIA`

Título:

`De 1988 ao presente`

Texto:

`Uma história construída junto ao mercado segurador.`

O título deve ter bastante destaque, usando azul-marinho e tipografia editorial limpa.

## Miniatura da linha do tempo

Abaixo do título, criar uma representação resumida da trajetória.

Características:

- Linha contínua em ciano.
- Formato horizontal com uma única curva suave.
- Começar claramente em um selo azul-marinho com `1988`.
- Terminar em um selo azul-marinho com o ano atual.
- Usar entre cinco e sete pontos principais.
- Não exibir todos os clientes nessa preview.
- Não colocar textos pequenos ou difíceis de ler.
- Não numerar os pontos.
- Não utilizar setas de navegação.
- A linha deve parecer uma síntese do fluxo detalhado.

Usar as categorias:

- Azul-claro: Empresas Grandes.
- Laranja: Empresas PME.
- Verde: Soluções.

Abaixo da linha, exibir uma legenda discreta em formato de chips:

- `Empresas Grandes`
- `Empresas PME`
- `Soluções`

Os chips devem funcionar apenas como identificação visual. Não precisam atuar como filtros nesta primeira versão.

## Painel de indicadores

Ao lado direito, criar um painel azul-claro levemente destacado.

Não usar fundo branco puro.

Na parte superior do painel, exibir:

- `40` — `Seguradoras`
- `26` — `Implantações de Sinistros`

Os números devem ser grandes, mas não competir com o título principal.

Separar os dois indicadores com uma linha vertical fina.

Abaixo dos indicadores, apresentar as quatro competências:

- Expertise em Seguros
- Aceleradores Escaláveis
- Transformação Digital e TI
- Governança, Metodologia e Gestão

Cada competência deve conter:

- Ícone próprio.
- Título.
- Separador horizontal muito sutil.
- Alinhamento consistente.
- Área de toque adequada no mobile.

Utilizar os quatro arquivos de ícone disponibilizados:

- `expertise-seguros.png`
- `aceleradores-escalaveis.png`
- `transformacao-digital-ti.png`
- `governanca-metodologia-gestao.png`

Sugestão de destino:

`/public/images/timeline/competencias/`

Não redesenhar, recolorir, aplicar filtros ou adicionar sombras aos ícones.

Tamanho sugerido:

- Desktop: entre `64px` e `80px`.
- Mobile: entre `52px` e `64px`.

No final da preview, inserir:

`Role para explorar a trajetória`

Adicionar uma seta fina apontando para baixo.

A seta pode realizar uma pequena animação vertical, mas o movimento deve ser sutil.

---

# 2. Transição entre preview e fluxo detalhado

A transição deve transmitir a sensação de que a pequena linha da preview está se expandindo e revelando os detalhes.

Não é necessário realizar um morph complexo entre SVGs caso isso comprometa a estabilidade.

A continuidade pode ser construída por meio de:

- Mesma cor ciano.
- Mesma espessura de linha.
- Movimento de desenho do traçado.
- Pequeno deslocamento vertical.
- Fade entre as duas estruturas.
- Continuidade da posição visual do ponto inicial.

Quando o usuário entra no fluxo detalhado, o primeiro estado visível deve ser 1988.

Não começar no primeiro cliente sem contextualização.

---

# 3. Linha do tempo detalhada

Criar uma experiência de scrollytelling.

O usuário continua rolando a página normalmente enquanto o palco visual permanece fixo temporariamente.

## Comportamento

Utilizar uma estrutura semelhante a:

```tsx
<section className="trajectory-scroll">
  <div className="trajectory-sticky">
    {/* conteúdo visual controlado pelo progresso */}
  </div>
</section>
```

O container externo controla a duração da experiência.

O elemento interno pode utilizar:

```css
position: sticky;
top: 0;
height: 100svh;
```

O progresso deve ser calculado com base na posição real da seção.

Não utilizar:

- Scroll automático forçado.
- `window.scrollTo()` para controlar o usuário.
- Bloqueio da roda do mouse.
- Bloqueio do touch.
- Navegação obrigatória por setas.
- Movimento contínuo sem relação com o scroll.

O usuário deve manter controle completo da página.

## Estado inicial

O primeiro estado precisa apresentar:

Ano:

`1988`

Título:

`O início da nossa trajetória`

Texto:

`Começamos uma história construída ao lado do mercado segurador.`

O ano deve aparecer grande e destacado na lateral esquerda.

A linha ciano deve nascer visualmente ao lado do ano e seguir em direção aos primeiros cards.

---

# 4. Barra superior de progresso

No topo do palco sticky, criar uma barra de progresso com os capítulos:

- `1988`
- `Expansão`
- `Transformação`
- `Hoje`

O capítulo ativo deve apresentar:

- Ponto preenchido.
- Glow ciano extremamente leve.
- Texto azul-marinho com maior peso.
- Parte percorrida da linha em ciano.

Os demais capítulos permanecem em azul acinzentado.

A barra serve para orientação. Não deve parecer um menu principal.

---

# 5. Cards de clientes e projetos

Reutilizar os dados reais que já existem na linha do tempo atual.

Não inventar clientes, datas ou projetos.

Criar um componente reutilizável:

```tsx
<MilestoneCard />
```

Cada card deve aceitar:

```ts
type MilestoneCategory = "large-company" | "sme" | "solution";

interface MilestoneCardData {
  id: string;
  year?: number;
  title: string;
  description?: string;
  category: MilestoneCategory;
  tags?: string[];
}
```

## Visual dos cards

- Fundo azul-marinho.
- Cantos arredondados entre `14px` e `18px`.
- Borda fina azul.
- Texto branco.
- Informações secundárias em azul muito claro.
- Chip da categoria no topo.
- Sombra suave.
- Sem numeração.
- Sem grandes áreas de glow.
- Sem fotos.
- Sem logos obrigatórios.
- Sem efeitos 3D.

Largura sugerida em desktop:

- Entre `300px` e `360px`.

Estados:

### Card ativo

- Opacidade `1`.
- Escala `1`.
- Borda ciano.
- Sombra ciano extremamente discreta.
- Texto completamente legível.

### Card anterior ou próximo

- Opacidade entre `0.35` e `0.55`.
- Escala aproximada de `0.96`.
- Sem glow.

### Cards distantes

- Opacidade máxima de `0.15`.
- Não devem competir com o card ativo.

Os cards devem entrar com:

- Fade.
- Deslocamento de aproximadamente `20px`.
- Leve mudança de escala.
- Duração entre `450ms` e `700ms`.
- Easing suave.

---

# 6. Linha ciano

Construir a linha com SVG responsivo.

Não utilizar uma imagem raster da linha.

A linha deve:

- Percorrer os cards.
- Criar curvas suaves.
- Evitar ângulos muito fechados.
- Ser desenhada progressivamente conforme o scroll.
- Apresentar pequenos nós circulares nos pontos de conexão.
- Manter a mesma linguagem da preview.

Utilizar `stroke-dasharray` e `stroke-dashoffset`, ou técnica equivalente, para revelar progressivamente o caminho.

Evitar recalcular layouts pesados em cada evento de scroll.

Aplicar atualizações visuais com `requestAnimationFrame` ou com a biblioteca de motion que já estiver instalada no projeto.

---

# 7. Componentes de passagem

As quatro competências não devem permanecer somente no painel inicial.

Elas também devem aparecer durante a linha do tempo como capítulos narrativos.

Criar um componente reutilizável:

```tsx
<CapabilityCheckpoint />
```

Estrutura de dados sugerida:

```ts
interface CapabilityCheckpointData {
  id: string;
  title: string;
  description: string;
  icon: string;
}
```

Cada componente deve ser integrado ao caminho ciano.

A linha precisa entrar pelo lado esquerdo do componente e continuar pelo lado direito, transmitindo a sensação de que aquela competência foi adquirida ao longo da trajetória.

Não apresentar o componente como sidebar ou modal.

## Aparência

- Card médio em azul-claro.
- Borda fina azul-ciano.
- Cantos arredondados.
- Ícone na parte superior ou lateral.
- Pequeno eyebrow: `COMPETÊNCIA CONQUISTADA`.
- Título forte em azul-marinho.
- Descrição curta.
- Muito espaço interno.
- Sem números.
- Sem imagens decorativas.
- Sem fundos escuros pesados.

## Ordem sugerida

Após o primeiro grupo de clientes:

### Expertise em Seguros

`Conhecimento construído em décadas de projetos e operações críticas.`

Durante a fase de expansão:

### Aceleradores Escaláveis

`Componentes e práticas que reduzem o tempo de implantação e ampliam a escala.`

Durante a modernização dos projetos:

### Transformação Digital e TI

`Tecnologia aplicada à evolução de jornadas, processos e integrações.`

Próximo da fase atual:

### Governança, Metodologia e Gestão

`Método, qualidade e gestão para sustentar evoluções com segurança.`

Os componentes devem entrar e sair da mesma forma que os cards, mas podem permanecer ativos por uma distância de scroll um pouco maior.

---

# 8. Encerramento

Ao final da trajetória, apresentar novamente os indicadores:

Título:

`Uma trajetória que se transforma em resultado`

Indicadores:

- `40 Seguradoras`
- `26 Implantações de Sinistros`

Os números podem realizar uma animação de contagem somente uma vez, quando entrarem na viewport.

Não repetir as quatro competências completas no encerramento.

Adicionar o marcador do ano atual ao final da linha.

A saída da seção deve ser suave e devolver naturalmente o scroll para o restante da página.

---

# 9. Paleta visual

Utilizar os tokens existentes do projeto sempre que disponíveis.

Caso ainda não existam, considerar os seguintes valores como referência:

```css
--trajectory-bg: #eaf7ff;
--trajectory-bg-soft: #f4fbff;
--trajectory-navy: #071f4a;
--trajectory-blue: #0b3c78;
--trajectory-cyan: #16c7f3;
--trajectory-border: rgba(35, 137, 197, 0.28);
--category-large: #8cc8ff;
--category-sme: #ff8a34;
--category-solution: #71c84b;
--trajectory-muted: #6f89a8;
```

Não criar uma paleta paralela caso o projeto já possua cores equivalentes.

---

# 10. Responsividade

## Desktop

- Preview em duas colunas.
- Linha do tempo com cards distribuídos horizontalmente.
- Palco sticky.
- Ano e contextualização na lateral esquerda.
- Competências integradas ao caminho.

## Tablet

- Reduzir o número de cards simultaneamente visíveis.
- Manter somente card anterior, ativo e próximo.
- Compactar o painel de indicadores.
- Manter a barra de progresso superior.

## Mobile

No mobile, não tentar reproduzir o zigue-zague horizontal do desktop.

Converter para uma timeline vertical natural:

- Linha vertical no lado esquerdo.
- Cards empilhados.
- Ano acima do conteúdo.
- Componentes de competência ocupando a largura disponível.
- Indicadores em duas colunas.
- Legenda em chips com quebra de linha.
- Sem palco sticky prolongado.
- Sem prender o usuário em uma seção muito alta.
- Sem rolagem horizontal obrigatória.

Utilizar `100svh` em vez de `100vh` quando necessário.

---

# 11. Acessibilidade

Implementar:

- Hierarquia correta de títulos.
- Textos alternativos nos quatro ícones.
- Contraste mínimo WCAG AA.
- Navegação completa sem depender de hover.
- Componentes legíveis com zoom.
- Foco visível caso algum elemento seja interativo.
- Conteúdo acessível mesmo com JavaScript desabilitado, quando possível.

Adicionar tratamento para:

```css
@media (prefers-reduced-motion: reduce)
```

Nesse modo:

- Desabilitar movimentos longos.
- Exibir todos os elementos sem animações complexas.
- Manter a linha e os cards totalmente compreensíveis.

---

# 12. Performance

- Utilizar `next/image` para os ícones PNG.
- Não carregar screenshots como background.
- Não usar vídeos.
- Não adicionar dependências novas sem necessidade.
- Reutilizar a biblioteca de animação existente.
- Evitar listeners de scroll sem throttle ou `requestAnimationFrame`.
- Evitar filtros e blur de grande área.
- Não criar dezenas de elementos animados simultaneamente.
- Garantir ausência de layout shift.

---

# 13. Organização dos componentes

Separar a implementação em componentes pequenos:

```text
TrajectorySection
├── TrajectoryOverview
│   ├── MiniTimeline
│   ├── TrajectoryMetrics
│   ├── CapabilityList
│   └── CategoryLegend
├── TrajectoryScrollytelling
│   ├── TimelineProgress
│   ├── TimelinePath
│   ├── TimelineYearIntro
│   ├── MilestoneCard
│   ├── CapabilityCheckpoint
│   └── TimelineClosing
```

Separar os dados da apresentação:

```text
data/
└── trajectory.ts
```

Modelar os elementos da narrativa como uma sequência:

```ts
type TrajectoryItem =
  | {
      type: "milestone";
      data: MilestoneCardData;
    }
  | {
      type: "capability";
      data: CapabilityCheckpointData;
    };
```

Isso deve permitir posicionar competências entre os projetos sem criar condições fixas espalhadas no JSX.

---

# 14. Restrições visuais

Não utilizar:

- Numeração sequencial nos cards.
- Fundo branco puro predominante.
- Fundo azul-marinho ocupando toda a seção.
- Texto sobre imagens.
- Fotos genéricas de executivos.
- Ilustrações de inteligência artificial.
- Neon excessivo.
- Glow forte.
- Gradientes chamativos.
- Cards excessivamente transparentes.
- Glassmorphism exagerado.
- Setas grandes.
- Carrossel convencional.
- Scroll automático.
- Infográfico antigo como imagem.
- Informações pequenas e ilegíveis.
- Efeitos que escondam o conteúdo.

A aparência precisa ser corporativa, tecnológica e inovadora, mas sóbria.

---

# 15. Critérios de aceite

A implementação estará correta quando:

1. A preview aparecer antes da linha do tempo detalhada.
2. O primeiro ano visível for 1988.
3. Os indicadores `40` e `26` estiverem presentes.
4. As três categorias estiverem identificadas pelas cores corretas.
5. As quatro competências aparecerem na preview.
6. As quatro competências também entrarem como passagens da narrativa.
7. Os cards não possuírem numeração.
8. A linha for desenhada conforme o avanço do scroll.
9. O usuário mantiver controle total da rolagem.
10. O componente funcionar em desktop, tablet e mobile.
11. A experiência continuar compreensível com movimento reduzido.
12. Os dados atuais da timeline forem preservados.
13. Nenhuma informação real for inventada.
14. Não houver overflow horizontal.
15. Não houver alteração no restante da página.

Antes de finalizar:

- Execute lint e build.
- Corrija erros de TypeScript.
- Verifique desktop e mobile.
- Informe todos os arquivos criados e modificados.
- Resuma brevemente como o progresso do scroll foi calculado.
- Não entregue pseudocódigo: implemente a solução completa.