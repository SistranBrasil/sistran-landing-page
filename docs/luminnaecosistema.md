Atue como um desenvolvedor front-end sênior especializado em Next.js, React, TypeScript, UX/UI e motion design.

Implemente a seção **“Ecossistema”** exatamente conforme a imagem de referência anexada.

Antes de alterar qualquer arquivo, analise:

- A stack atual do projeto.
- A estrutura da página em que a seção está inserida.
- Os componentes compartilhados.
- Os tokens de cores e espaçamento.
- A fonte existente.
- A biblioteca de ícones.
- A biblioteca de animação já instalada.

Não altere outras seções, o header, o footer ou o comportamento geral da página.

## Correção obrigatória de nomenclatura

O nome da seção deve ser:

`Ecossistema`

Não utilizar `Luminna AI` como título da seção.

Os nomes individuais dos produtos devem continuar com “Luminna”, pois representam os nomes das soluções.

## Estrutura do cabeçalho

Adicionar no topo da seção:

Eyebrow:

`ECOSSISTEMA`

Título:

`Tecnologia aplicada em todo o ciclo`

Descrição:

`Soluções especializadas que apoiam planejamento, desenvolvimento, qualidade e conhecimento.`

Do lado direito, adicionar uma orientação discreta:

`Selecione um card para visualizar os resultados.`

Usar um pequeno ícone de cursor ou clique antes do texto.

## Fundo da seção

Utilizar um fundo azul-gelo muito claro, integrado à identidade visual da página.

Referência de cores:

```css
--ecosystem-background: #eaf7ff;
--ecosystem-surface: #f4fbff;
--ecosystem-surface-strong: #dff1fc;
--ecosystem-navy: #071f4a;
--ecosystem-blue: #0b3c78;
--ecosystem-cyan: #16c7f3;
--ecosystem-border: rgba(41, 135, 194, 0.25);
--ecosystem-text-secondary: #54749c;
```

Adicionar ao fundo:

- Grid técnico muito sutil.
- Linhas curvas finas em azul-claro.
- Pequenas cruzes ou pontos técnicos com baixa opacidade.
- Nenhuma imagem fotográfica.
- Nenhum fundo branco puro.
- Nenhum glow exagerado.

O fundo deve ser construído preferencialmente com CSS e pseudo-elementos.

## Filtros

Abaixo do título, criar os filtros:

- Todos
- Planejamento
- Engenharia
- Qualidade
- Conhecimento

O filtro ativo deve possuir:

- Fundo azul-marinho.
- Leve gradiente azul-ciano.
- Texto branco.
- Pequena sombra azul.
- Borda arredondada em formato pill.

Os filtros inativos devem possuir:

- Fundo azul muito claro.
- Borda azul fina.
- Texto azul-marinho.
- Hover com fundo ligeiramente mais intenso.

Os filtros precisam funcionar de verdade, exibindo somente os cards correspondentes.

## Organização visual dos cards

Não utilizar novamente um grid rígido de oito cards brancos iguais.

Criar uma composição bento com quatro colunas no desktop:

```text
Coluna 1
- Luminna Story AI
- Luminna Doc AI

Coluna 2
- Luminna Estimate AI
- Luminna Test AI

Coluna 3
- Luminna Code AI
- Luminna Case AI

Coluna 4
- Luminna Fix AI
- Luminna Prompt AI
```

A terceira coluna deve ganhar maior destaque quando o `Luminna Code AI` estiver selecionado.

O card ativo deve ser mais alto e começar aproximadamente `60px` acima dos demais cards, reproduzindo a composição da imagem.

Sugestão estrutural:

```tsx
<div className="ecosystem-grid">
  <div className="ecosystem-column">{/* Story e Doc */}</div>
  <div className="ecosystem-column">{/* Estimate e Test */}</div>
  <div className="ecosystem-column ecosystem-column-featured">
    {/* Code e Case */}
  </div>
  <div className="ecosystem-column">{/* Fix e Prompt */}</div>
</div>
```

No desktop:

```css
.ecosystem-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  align-items: start;
}

.ecosystem-column {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.ecosystem-column-featured {
  transform: translateY(-64px);
}
```

Ajustar as medidas conforme a largura real do projeto, preservando a composição visual da referência.

## Aparência dos cards fechados

Os cards fechados devem possuir:

- Fundo azul muito claro.
- Nunca utilizar branco puro.
- Borda azul fina e translúcida.
- Cantos arredondados entre `20px` e `24px`.
- Sombra suave.
- Padding entre `26px` e `32px`.
- Altura mínima consistente.
- Conteúdo alinhado à esquerda.
- Linha curva decorativa discreta no canto inferior direito.
- Transição suave no hover.

Estrutura:

1. Ícone circular.
2. Chip da categoria.
3. Nome da solução.
4. Descrição curta.
5. Espaço flexível.
6. Botão de ação.

Os ícones devem ser lineares, finos e azuis, dentro de um círculo azul-claro.

Não utilizar:

- Ícones 3D.
- Emojis.
- Ilustrações genéricas de IA.
- Robôs.
- Imagens fotográficas.
- Numeração nos cards.

## Botão “Ver resultados”

Cards que possuem métricas devem apresentar:

`Ver resultados  +`

O botão deve ter:

- Formato pill.
- Fundo transparente ou azul quase branco.
- Borda azul.
- Texto azul-marinho.
- Símbolo `+` no lado direito.
- Altura aproximada de `50px`.
- Área de clique adequada.
- Hover com fundo azul-marinho e texto branco.

Ao clicar:

- Fechar o card anteriormente aberto.
- Abrir o card selecionado.
- Alterar o texto para `Ocultar resultados`.
- Substituir o `+` por `−`.
- Revelar as métricas dentro do próprio card.
- Não abrir modal.
- Não abrir tooltip.
- Não navegar para outra página.
- Não deslocar bruscamente a seção.

Apenas um card pode ficar aberto por vez.

Para soluções sem métricas registradas, não inventar valores. Utilizar a ação:

`Conheça a solução  →`

## Estado do card ativo

Utilizar `LUMINNA CODE AI` como card inicialmente selecionado.

O card ativo deve possuir:

- Fundo azul-marinho profundo.
- Borda ciano luminosa, porém discreta.
- Texto branco.
- Descrição em azul-claro.
- Chip da categoria em azul-ciano.
- Ícone com linha ciano.
- Leve profundidade.
- Altura maior que os cards fechados.
- Sem glow exagerado.

Referência:

```css
.ecosystem-card[data-active="true"] {
  color: #f8fbff;
  background:
    radial-gradient(
      circle at 85% 10%,
      rgba(22, 199, 243, 0.14),
      transparent 36%
    ),
    linear-gradient(145deg, #0b3c78 0%, #071f4a 100%);
  border-color: rgba(22, 199, 243, 0.9);
  box-shadow:
    0 20px 45px rgba(7, 31, 74, 0.22),
    0 0 0 1px rgba(22, 199, 243, 0.12);
}
```

## Painel de resultados

O painel deve abrir dentro do card ativo, abaixo do botão.

Cabeçalho:

`RESULTADOS OBSERVADOS`

As métricas devem ser apresentadas em duas colunas.

Para `LUMINNA CODE AI`, exibir:

- `+84%` — `velocidade na revisão de código`
- `−57%` — `tempo para correção de bugs`

Separar as métricas com uma linha vertical fina.

Os números devem:

- Ser grandes.
- Utilizar ciano.
- Possuir peso forte.
- Não usar contorno.
- Não usar efeito 3D.
- Animar de zero até o valor quando o painel abrir.

Adicionar abaixo:

`Indicadores apresentados conforme resultados registrados.`

Usar um pequeno ícone informativo antes do texto.

## Conteúdo dos cards

### LUMINNA STORY AI

Categoria:

`Conhecimento`

Descrição:

`Criação ágil de histórias e priorização de tarefas.`

Métrica:

`+60% de aumento na velocidade de criação de histórias`

### LUMINNA ESTIMATE AI

Categoria:

`Planejamento`

Descrição:

`Estimativas de esforço, complexidade e tamanho funcional.`

Métricas:

- `+60% mais detalhes na criação de tarefas`
- `+95% mais rapidez na estimativa de esforços`

### LUMINNA CODE AI

Categoria:

`Engenharia`

Descrição:

`Automação de revisão de código e migração de tecnologias.`

Métricas:

- `+84% de aumento na velocidade de revisão de código`
- `−57% menos tempo para correção de bugs`

### LUMINNA FIX AI

Categoria:

`Engenharia`

Descrição:

`Correção automática de bugs e vulnerabilidades.`

Métrica:

`+84% mais rapidez na identificação de vulnerabilidades`

### LUMINNA DOC AI

Categoria:

`Conhecimento`

Descrição:

`Documentação clara, estruturada e rastreável.`

Métrica:

`+85% de ganho de tempo e qualidade na geração de documentação`

### LUMINNA TEST AI

Categoria:

`Qualidade`

Descrição:

`Geração de testes unitários abrangentes.`

Não inventar métrica caso ela não exista nos dados atuais.

### LUMINNA CASE AI

Categoria:

`Qualidade`

Descrição:

`Criação de cenários e testes funcionais detalhados.`

Métrica:

`+55% mais rapidez na criação de testes unitários`

Preservar esse texto enquanto não houver conteúdo oficial corrigido no projeto.

### LUMINNA PROMPT AI

Categoria:

`Conhecimento`

Descrição:

`Interações mais precisas e aderentes ao negócio.`

Não inventar métrica caso ela não exista nos dados atuais.

## Estrutura dos dados

Não escrever os oito cards manualmente no JSX.

Criar uma estrutura de dados semelhante a:

```ts
type EcosystemCategory =
  | "Planejamento"
  | "Engenharia"
  | "Qualidade"
  | "Conhecimento";

interface EcosystemMetric {
  value: string;
  label: string;
}

interface EcosystemSolution {
  id: string;
  name: string;
  category: EcosystemCategory;
  description: string;
  icon: React.ComponentType;
  metrics: EcosystemMetric[];
}
```

Renderizar os cards por meio de `map`.

## Estado e interação

Criar estados separados para:

```ts
const [activeCategory, setActiveCategory] = useState("Todos");
const [expandedSolutionId, setExpandedSolutionId] =
  useState<string | null>("code-ai");
```

Ao selecionar um filtro:

- Aplicar transição suave.
- Manter os cards filtrados centralizados.
- Se o card aberto deixar de existir no filtro escolhido, fechar o painel.
- Atualizar o contador de soluções.

O botão deve possuir:

```tsx
aria-expanded={isExpanded}
aria-controls={`results-${solution.id}`}
```

O painel deve possuir:

```tsx