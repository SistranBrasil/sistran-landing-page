Implemente a seção “Consultoria” no projeto existente em Next.js/React, respeitando a identidade visual atual da Sistran. Reproduza fielmente a composição da imagem de referência fornecida, utilizando a nova fotografia da equipe de consultoria como imagem principal.

Não redesenhe a seção e não transforme os conteúdos em cards.

## Estrutura geral

Crie uma seção clara, sofisticada e institucional, ocupando toda a largura da página.

* Fundo azul-gelo muito claro: `#EFF8FE`.
* Adicione um grid técnico extremamente discreto, com linhas azuis de aproximadamente `4%` de opacidade.
* Utilize detalhes geométricos abstratos quase imperceptíveis no fundo.
* Não use linhas curvas passando entre os conteúdos.
* Não use cards, números, setas, paginação ou caixas com sombra.
* Conteúdo centralizado em um container com `max-width: 1440px`.
* Padding horizontal desktop: entre `72px` e `96px`.
* Padding vertical: aproximadamente `64px 0 88px`.

## Bloco superior

Monte um grid de duas colunas:

```css
grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.15fr);
gap: 56px;
align-items: center;
```

### Coluna esquerda

No topo, utilize o arquivo do carimbo:

`carimbo-consultoria-ticket-outline-0757c7.png`

Configuração aproximada:

* Largura desktop: `340px`.
* Altura automática.
* Não recrie o carimbo como texto comum.
* Preserve a transparência do PNG.
* Exiba o carimbo levemente inclinado, conforme o próprio arquivo.

Abaixo do carimbo, apresente o título:

```text
Consultoria
```

Estilo:

* Fonte sans-serif moderna usada no projeto.
* Peso entre `500` e `600`.
* Tamanho desktop: `clamp(64px, 6vw, 100px)`.
* Line-height: `0.95`.
* Letter-spacing: `-0.055em`.
* Gradiente horizontal:

```css
background: linear-gradient(
  90deg,
  #167fd7 0%,
  #2569df 48%,
  #7138ef 100%
);
```

Aplique o gradiente diretamente no texto com `background-clip: text`.

Abaixo do título, mantenha exatamente estes dois parágrafos:

“Nossa expertise abrange consultoria personalizada, projetada para impulsionar o crescimento e a eficiência de sua empresa:

Nosso time de consultores está preparado para entender as necessidades e desafios do seu negócio, para oferecer soluções personalizadas que impulsionam a inovação, a eficiência e o crescimento da sua empresa.”

Estilo dos parágrafos:

* Cor: `#4E709B`.
* Tamanho desktop: `19px`.
* Line-height: `1.55`.
* Largura máxima: `610px`.
* Espaçamento de aproximadamente `20px` entre os parágrafos.
* Não resumir, reescrever ou retirar partes do texto.

### Coluna direita

Use a nova fotografia realista da equipe de consultoria fornecida junto com este prompt.

Configuração:

* Imagem horizontal.
* Proporção aproximada: `16 / 9`.
* `width: 100%`.
* `object-fit: cover`.
* `object-position: center`.
* Border-radius entre `28px` e `32px`.
* Borda branca translúcida de `1px`.
* Sombra muito suave, sem efeito flutuante exagerado.
* Não aplique filtros azuis fortes sobre a fotografia.
* Preserve os tons naturais de pele e a iluminação realista.

Na parte inferior esquerda da fotografia, adicione uma pequena identificação branca:

```text
Estratégia sob medida
```

A identificação deve ter:

* Fundo branco com aproximadamente `96%` de opacidade.
* Formato de cápsula.
* Ícone de alvo em azul-escuro.
* Texto em azul-marinho.
* Altura aproximada: `58px`.
* Padding horizontal: `24px`.
* Posicionamento parcialmente sobreposto à borda inferior da imagem.

## Divisor da seção

Abaixo do bloco superior, adicione uma margem de aproximadamente `34px`.

Na mesma linha, apresente:

```text
Frentes de atuação
```

Estilo:

* Cor: `#082B64`.
* Peso: `700`.
* Tamanho: `28px` a `32px`.

Após o título, desenhe somente uma linha horizontal fina até o final do container:

```css
height: 1px;
background: rgba(20, 142, 211, 0.35);
```

Esta é a única linha decorativa permitida nessa área.

## Frentes de atuação

Organize os quatro conteúdos em uma grade aberta de duas colunas e duas linhas.

```css
display: grid;
grid-template-columns: repeat(2, minmax(0, 1fr));
column-gap: 100px;
row-gap: 72px;
margin-top: 40px;
```

Os conteúdos devem ficar diretamente sobre o fundo da seção.

Não utilizar:

* Cards.
* Fundos brancos individuais.
* Bordas ao redor dos textos.
* Sombras.
* Linhas conectando os itens.
* Números.
* Setas.
* Animações que desloquem o layout.

Cada item deve ter:

* Ícone circular à esquerda.
* Título e descrição à direita.
* Alinhamento pelo topo.
* Ícone com aproximadamente `64px × 64px`.
* Contorno ciano de `1.5px`.
* Fundo transparente ou azul quase branco.
* Ícone interno azul `#087FE2`.

Utilize ícones lineares consistentes, preferencialmente Lucide:

1. `UsersRound` ou equivalente para Bancassurance e Embedded Insurance.
2. `Cog` para Excelência Operacional e Tecnológica.
3. `ShieldCheck` para Política de IA.
4. `BriefcaseBusiness` ou `ChartNoAxesCombined` para Estudos Econômicos.

Estrutura interna:

```css
display: grid;
grid-template-columns: 72px minmax(0, 1fr);
gap: 22px;
align-items: start;
```

Título:

* Cor: `#062963`.
* Peso: `700`.
* Tamanho: `20px`.
* Line-height: `1.2`.

Descrição:

* Cor: `#52729C`.
* Tamanho: `16px`.
* Line-height: `1.45`.
* Margem superior: `10px`.

Use exatamente estes conteúdos:

### Bancassurance: Benchmarking e Embedded Insurance / Digital

Exploramos as melhores práticas do mercado e as adaptamos à sua realidade, identificando oportunidades para o crescimento do seu negócio. Ajudamos a implementar soluções de embedded insurance e digitais, otimizando a experiência do cliente e expandindo seus canais de distribuição.

### Bancassurance: Excelência Operacional e Tecnológica

Oferecemos consultoria especializada para otimizar seus processos, implementar tecnologias de ponta e garantir a máxima eficiência em suas operações.

### Política de IA (Governança/Gestão)

Auxiliamos na formulação e implementação de políticas de inteligência artificial (IA) robustas e eficazes, garantindo a governança adequada e a gestão responsável dessa tecnologia em sua empresa.

### Análises e Estudos Econômicos para o Mercado Segurador

Fornecemos análises e estudos econômicos detalhados, que permitem a você tomar decisões estratégicas embasadas em dados e informações precisas sobre o mercado segurador.

## Responsividade

### Tablet

Abaixo de `1024px`:

* Transforme o bloco superior em uma coluna.
* Texto primeiro e fotografia depois.
* Mantenha as frentes em duas colunas quando houver espaço.
* Reduza o título principal para aproximadamente `68px`.
* Reduza o carimbo para aproximadamente `280px`.

### Mobile

Abaixo de `720px`:

* Uma única coluna em toda a seção.
* Padding lateral: `24px`.
* Carimbo com largura entre `210px` e `240px`.
* Título principal com `clamp(48px, 15vw, 64px)`.
* Fotografia abaixo dos textos.
* Proporção da fotografia próxima de `4 / 3`.
* Frentes de atuação em uma única coluna.
* Espaçamento vertical entre itens: `42px`.
* Ícones com `52px × 52px`.
* Não esconder nem resumir os textos.
* Não permitir rolagem horizontal.

## Acessibilidade e acabamento

* Defina um texto alternativo descritivo para a fotografia.
* Garanta contraste WCAG AA.
* Ícones decorativos devem usar `aria-hidden="true"`.
* Respeite `prefers-reduced-motion`.
* Se houver animação de entrada, utilize somente fade e deslocamento vertical máximo de `16px`.
* Não aplique animação contínua.
* Preserve os acentos e a escrita em português brasileiro.
* Não invente novos textos.
* Não use aparência futurista exagerada, hologramas ou elementos com aspecto de imagem gerada por IA.

O resultado deve parecer uma seção editorial corporativa premium: humana, clara, espaçosa e integrada ao design da Sistran.
