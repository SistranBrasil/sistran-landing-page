Implemente no projeto existente a seção “Perfil & posicionamento” reproduzindo fielmente a imagem de referência fornecida.

Antes de implementar:

1. Identifique a stack, os componentes, fontes, tokens e biblioteca de animações existentes.
2. Localize a seção atual “Onde seguros, negócio e tecnologia convergem”.
3. Substitua apenas essa seção.
4. Não modifique a seção “Sobre nós” posicionada acima.
5. Reutilize componentes e tokens existentes quando forem compatíveis.
6. Execute lint, typecheck e build ao finalizar.

## Assets

Salve os seis ícones transparentes fornecidos nestes caminhos:

```text
/public/images/perfil/icon-plataformas-erp.png
/public/images/perfil/icon-aceleradores.png
/public/images/perfil/icon-portais.png
/public/images/perfil/icon-seguros.png
/public/images/perfil/icon-negocio.png
/public/images/perfil/icon-tecnologia.png
```

Para o centro, utilize o símbolo oficial da Sistran já existente no projeto. Não tente recriar a marca.

Os ícones devem ser exibidos sem fundo branco e sem caixas ao redor.

## Estrutura da seção

```tsx
<section id="perfil-posicionamento">
  <header className="profileHeader" />

  <div className="solutionsRow" />

  <div className="convergenceStage">
    <aside className="valueStatement" />
    <div className="convergenceDiagram" />
    <aside className="knowledgeStatement" />
  </div>

  <div className="expertisePanel">
    <div className="expertiseColumn" />
    <div className="expertiseDivider" />
    <div className="expertiseColumn" />
  </div>
</section>
```

A seção deve parecer um ecossistema integrado, não um dashboard.

Não utilizar:

* Cards individuais.
* Caixas em volta de cada serviço.
* Setas.
* Paginação `01/02`.
* Carrossel.
* Linhas atravessando textos.
* Glassmorphism.
* Esferas 3D.
* Brilhos pulsantes.
* Miniaturas semelhantes a campos de formulário.

## Fundo

Use um fundo azul-marinho profundo:

```css
background:
  radial-gradient(
    circle at 50% 48%,
    rgba(7, 108, 188, 0.34) 0%,
    rgba(5, 53, 105, 0.18) 34%,
    transparent 65%
  ),
  linear-gradient(
    135deg,
    #031a3d 0%,
    #052d5c 52%,
    #031a3d 100%
  );
```

Adicione um grid técnico discreto:

```css
background-image:
  linear-gradient(rgba(42, 182, 238, 0.055) 1px, transparent 1px),
  linear-gradient(90deg, rgba(42, 182, 238, 0.055) 1px, transparent 1px);
background-size: 48px 48px;
```

Adicione dois arcos técnicos grandes nas extremidades usando pseudo-elementos:

```css
border: 1px solid rgba(8, 210, 241, 0.16);
border-radius: 50%;
```

Eles devem ser apenas decorativos e usar `pointer-events: none`.

## Dimensões gerais

```css
position: relative;
overflow: hidden;
min-height: 1000px;
padding: 40px 48px 64px;
color: #f7fbff;
```

Container:

```css
max-width: 1500px;
margin: 0 auto;
```

## Cabeçalho

Eyebrow:

```text
PERFIL & POSICIONAMENTO
```

Estilo:

```css
font-size: 12px;
font-weight: 700;
letter-spacing: 0.32em;
color: #08d2f1;
text-transform: uppercase;
text-align: center;
```

Adicione uma linha fina de cada lado do eyebrow.

Título:

```text
Onde seguros, negócio
e tecnologia convergem
```

O título deve ficar centralizado em duas linhas.

```css
font-size: clamp(54px, 5vw, 82px);
font-weight: 750;
line-height: 0.98;
letter-spacing: -0.05em;
color: #f8fbff;
max-width: 950px;
margin: 28px auto 0;
text-align: center;
```

Apenas a palavra `convergem` deve utilizar:

```css
background: linear-gradient(90deg, #08d2f1 0%, #03aee8 55%, #1689e8 100%);
-webkit-background-clip: text;
color: transparent;
```

Subtítulo:

```text
Da estratégia à operação, geramos valor em cada etapa da cadeia de seguros.
```

```css
font-size: 19px;
line-height: 1.5;
color: #bad3e7;
text-align: center;
margin-top: 16px;
```

## Linha de soluções

Crie três soluções alinhadas horizontalmente e centralizadas.

```css
display: grid;
grid-template-columns: repeat(3, minmax(0, 1fr));
gap: 72px;
max-width: 900px;
margin: 40px auto 0;
```

Cada solução:

```css
display: grid;
grid-template-columns: 72px minmax(0, 1fr);
gap: 18px;
align-items: center;
```

Não coloque fundo ou borda no item.

Os ícones devem ficar dentro de um halo circular criado por CSS:

```css
width: 68px;
height: 68px;
border-radius: 50%;
display: grid;
place-items: center;
background: rgba(5, 62, 118, 0.42);
border: 1px solid rgba(8, 210, 241, 0.58);
box-shadow:
  0 0 0 6px rgba(8, 210, 241, 0.025),
  0 0 24px rgba(8, 210, 241, 0.14);
```

A imagem interna:

```css
width: 42px;
height: 42px;
object-fit: contain;
```

### Solução 1

Ícone:

```text
/images/perfil/icon-plataformas-erp.png
```

Título:

```text
Plataformas de ERP
```

Descrição:

```text
Apólice e Sinistros
```

### Solução 2

Ícone:

```text
/images/perfil/icon-aceleradores.png
```

Título:

```text
Aceleradores
```

Descrição:

```text
Connect API, Guru de Seguros, Smart Miner, Fast Claims
```

### Solução 3

Ícone:

```text
/images/perfil/icon-portais.png
```

Título:

```text
Portais
```

Descrição:

```text
Jornadas de Vendas, Serviços e Sinistros
```

Títulos:

```css
font-size: 17px;
font-weight: 700;
color: #ffffff;
```

Descrições:

```css
font-size: 14px;
line-height: 1.4;
color: #b6d1e5;
margin-top: 5px;
```

## Palco central

Abaixo das soluções:

```css
display: grid;
grid-template-columns: minmax(220px, 0.72fr) minmax(600px, 2fr) minmax(220px, 0.72fr);
gap: 30px;
align-items: center;
max-width: 1450px;
margin: 12px auto 0;
```

## Diagrama de convergência

O diagrama deve ser feito em HTML, CSS e SVG. Não renderize o diagrama como uma única imagem.

Dimensão:

```css
position: relative;
width: min(100%, 760px);
aspect-ratio: 760 / 390;
margin: 0 auto;
```

Adicione ao fundo:

* Um círculo técnico tracejado.
* Dois arcos concêntricos discretos.
* Glow radial apenas no centro.
* Opacidade baixa.

### Elipses

Crie três elipses sobrepostas.

#### Seguros

Posição superior central:

```css
left: 25%;
top: 4%;
width: 50%;
height: 49%;
```

Estilo:

```css
border: 2px solid #1689e8;
background: linear-gradient(
  180deg,
  rgba(22, 137, 232, 0.32),
  rgba(7, 87, 199, 0.08)
);
```

Conteúdo:

* Ícone `/images/perfil/icon-seguros.png`.
* Texto `SEGUROS`.

#### Negócio

Posição inferior esquerda:

```css
left: 5%;
top: 34%;
width: 51%;
height: 57%;
```

Estilo:

```css
border: 2px solid #08d2f1;
background: linear-gradient(
  135deg,
  rgba(8, 210, 241, 0.28),
  rgba(5, 95, 170, 0.06)
);
```

Conteúdo:

* Ícone `/images/perfil/icon-negocio.png`.
* Texto `NEGÓCIO`.

#### Tecnologia

Posição inferior direita:

```css
right: 5%;
top: 34%;
width: 51%;
height: 57%;
```

Estilo:

```css
border: 2px solid #7568f8;
background: linear-gradient(
  225deg,
  rgba(107, 90, 245, 0.30),
  rgba(18, 102, 194, 0.07)
);
```

Conteúdo:

* Ícone `/images/perfil/icon-tecnologia.png`.
* Texto `TECNOLOGIA`.

Configuração geral das elipses:

```css
position: absolute;
border-radius: 50%;
display: flex;
align-items: center;
justify-content: center;
```

Não aplique blur sobre os textos.

Os ícones dentro das elipses devem ter aproximadamente `36px`.

Textos:

```css
font-size: 14px;
font-weight: 750;
letter-spacing: 0.28em;
color: #bfeeff;
```

## Núcleo “Falamos segurês!”

Posicione no centro exato da interseção:

```css
position: absolute;
left: 50%;
top: 58%;
transform: translate(-50%, -50%);
width: 154px;
height: 154px;
border-radius: 50%;
z-index: 5;
```

Estilo:

```css
background:
  radial-gradient(circle at 35% 25%, #ffffff 0%, #eefaff 68%, #cbeafb 100%);
border: 7px solid rgba(4, 38, 78, 0.88);
box-shadow:
  0 0 0 2px rgba(8, 210, 241, 0.7),
  0 0 0 14px rgba(8, 210, 241, 0.08),
  0 18px 42px rgba(0, 0, 0, 0.32);
```

Adicione dois anéis finos ao redor:

```css
border: 1px solid rgba(8, 210, 241, 0.35);
```

No centro, use o símbolo oficial da Sistran e abaixo:

```text
Falamos segurês!
```

Texto:

```css
font-size: 14px;
font-weight: 750;
color: #082653;
```

O logo não pode ser recriado por CSS ou por IA.

## Conectores das soluções

Crie um SVG absoluto entre a linha das soluções e as elipses.

* Três conectores.
* Traço com `1.5px`.
* Cor `rgba(8, 210, 241, 0.75)`.
* Um pequeno círculo no início e no final.
* Linhas curtas e simétricas.
* Não atravessar textos.
* Não atravessar o núcleo.
* Sem animação infinita.

## Declaração lateral esquerda

Título:

```text
AGREGAMOS
VALOR
A TODA CADEIA
DE SEGUROS
```

Destaque `VALOR` em ciano.

Descrição:

```text
Da estratégia à operação, geramos valor em cada etapa da cadeia de seguros.
```

Estilo:

* Linha vertical ciano à esquerda.
* Título entre `29px` e `34px`.
* Peso `750`.
* Descrição entre `15px` e `17px`.
* Cor da descrição `#b6d1e5`.
* Não colocar dentro de card.

## Declaração lateral direita

Título:

```text
SÓLIDO
CONHECIMENTO
EM SEGUROS
```

Destaque `CONHECIMENTO` em ciano.

Descrição:

```text
Profundo domínio do mercado e das práticas que impulsionam resultados reais.
```

Repita a mesma estrutura da lateral esquerda.

## Área inferior de expertise

Crie uma única superfície arquitetônica compartilhada:

```css
max-width: 980px;
margin: 6px auto 0;
padding: 24px 40px 30px;
display: grid;
grid-template-columns: 1fr 1px 1fr;
gap: 56px;
background: linear-gradient(
  180deg,
  rgba(3, 27, 61, 0.08),
  rgba(3, 27, 61, 0.42)
);
border-top: 1px solid rgba(8, 210, 241, 0.30);
```

Não aplique border-radius, sombra ou bordas laterais.

Divisor:

```css
width: 1px;
height: 100%;
background: #08d2f1;
opacity: 0.85;
```

### Coluna esquerda

Número:

```text
01
```

Título:

```text
Negócio & Consultoria
```

Itens:

```text
Consultoria de Negócios
Design Thinking
Inovação / Arquitetura
Integrações de Soluções
Data Science / IA
```

### Coluna direita

Número:

```text
02
```

Título:

```text
Vilas Ágeis & Serviços
```

Itens:

```text
Desenvolvimento
Projetos
Análise Funcional
Quality Assurance
Migrações / Conversões
Sustentação
```

Números:

```css
font-size: 14px;
font-weight: 800;
color: #08d2f1;
```

Títulos:

```css
font-size: 27px;
font-weight: 750;
color: #ffffff;
letter-spacing: -0.025em;
```

Itens:

```css
display: flex;
align-items: center;
gap: 14px;
font-size: 15px;
line-height: 1.5;
color: #cae0ef;
```

Para os checks, utilize `CircleCheck` da biblioteca Lucide ou um SVG local:

```css
width: 22px;
height: 22px;
color: #08d2f1;
stroke-width: 1.8;
```

Não use imagens rasterizadas para os checks repetidos.

## Animação

Utilize animações discretas ao entrar na viewport:

1. Eyebrow e título: fade com deslocamento vertical de `14px`.
2. Soluções: stagger de `80ms`.
3. Elipses: desenho do contorno com `stroke-dashoffset`.
4. Núcleo: scale de `0.94` para `1`.
5. Listas inferiores: fade escalonado.
6. Executar somente uma vez.
7. Respeitar `prefers-reduced-motion`.

Não utilizar:

* Rotação contínua.
* Glow pulsando infinitamente.
* Partículas.
* Parallax exagerado.
* Linhas percorrendo o diagrama continuamente.

## Responsividade

### Abaixo de 1100px

* Esconder os textos laterais e mover suas descrições para abaixo do diagrama.
* Manter o diagrama centralizado.
* Reduzir o título para aproximadamente `58px`.
* Reduzir o diagrama para `680px`.

### Abaixo de 800px

* Soluções em uma coluna.
* Remover os conectores.
* Diagrama com largura `100%`.
* Área de expertise em uma coluna.
* Remover divisor vertical e usar divisor horizontal.
* Manter todas as informações visíveis.

### Abaixo de 560px

* Padding lateral de `22px`.
* Título entre `42px` e `50px`.
* Diagrama com altura entre `320px` e `360px`.
* Núcleo central com `112px`.
* Ícones das soluções com `52px`.
* Elipses com traços mais finos.
* Títulos da expertise com `24px`.
* Não permitir rolagem horizontal.
* Não reduzir os textos para menos de `15px`.

## Acessibilidade

* Ícones decorativos devem usar `aria-hidden="true"`.
* O diagrama precisa ter uma descrição acessível.
* Utilize títulos semânticos.
* Garanta contraste WCAG AA.
* Não comunique informação apenas pela cor.
* Preserve navegação e leitura com JavaScript desabilitado.
* Todas as informações devem continuar presentes como HTML real.

O resultado deve reproduzir a composição da referência: título central, três soluções superiores, diagrama de convergência no centro, mensagens institucionais nas laterais e duas frentes de expertise na parte inferior, sem aparência de dashboard ou coleção de cards.
