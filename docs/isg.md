Implemente uma nova seção institucional “ISG Provider Lens” seguindo fielmente a imagem de referência anexada.

A seção deve ser construída com componentes reais em HTML/React e CSS, não como uma única imagem. Utilize a fotografia anexada apenas no painel visual esquerdo. Todos os títulos, textos, ícones, logo, selo e créditos devem continuar editáveis, responsivos e acessíveis.

## Diretriz de implementação

Antes de alterar o código:

1. Analise a stack, os componentes existentes e o design system do projeto.
2. Reaproveite os padrões atuais de container, tipografia, espaçamentos e animações.
3. Não crie outro projeto.
4. Não modifique outras seções da página.
5. Não use uma captura da seção como background.
6. Utilize a nova fotografia gerada como asset local.
7. Utilize o arquivo oficial do logo ISG Provider Lens, sem redesenhá-lo.

## Assets

Organize os arquivos com nomes semelhantes a:

```text
/public/images/isg/isg-provider-lens-profissional.png
/public/images/isg/isg-provider-lens-logo.png
/public/images/isg/isg-provider-lens-product-challenger.png
```

Use:

* `isg-provider-lens-profissional.png` para a fotografia principal;
* `isg-provider-lens-logo.png` para o logo oficial;
* o selo Product Challenger original, caso esteja disponível;
* se o selo estiver disponível apenas como imagem, preserve sua proporção e não altere seu conteúdo.

Não insira textos diretamente na fotografia.

## Estrutura visual

Crie uma seção de largura total, com fundo muito claro, seguindo a identidade visual da Sistran.

### Fundo

Utilize:

```css
background:
  radial-gradient(circle at 10% 10%, rgba(0, 183, 235, 0.08), transparent 30%),
  radial-gradient(circle at 92% 85%, rgba(48, 105, 220, 0.09), transparent 32%),
  #f7fbff;
```

Acrescente uma textura técnica muito discreta com pequenos pontos ou grid. Ela não pode prejudicar a leitura.

Inclua detalhes lineares ciano nos cantos superior direito e inferior esquerdo, com traço fino e baixa opacidade. Esses elementos devem ser decorativos e usar `aria-hidden="true"`.

### Container

```css
max-width: 1440px;
margin: 0 auto;
padding: 80px 64px;
```

No desktop, utilize grid com duas colunas:

```css
grid-template-columns: minmax(420px, 0.85fr) minmax(620px, 1.25fr);
gap: 48px;
align-items: stretch;
```

A fotografia deve ocupar aproximadamente 40% da composição e o conteúdo cerca de 60%.

## Coluna esquerda: fotografia

Crie um painel vertical com:

```css
position: relative;
min-height: 680px;
border-radius: 26px;
overflow: hidden;
```

A imagem deve preencher completamente o painel:

```css
width: 100%;
height: 100%;
object-fit: cover;
object-position: center;
```

Não aplique cantos arredondados diretamente no arquivo. O arredondamento deve pertencer ao container.

Acrescente uma borda suave:

```css
border: 1px solid rgba(0, 170, 230, 0.22);
box-shadow: 0 24px 60px rgba(8, 39, 86, 0.12);
```

### Selo Product Challenger

Posicione o selo sobre a parte inferior esquerda da fotografia.

```css
position: absolute;
left: 24px;
right: 24px;
bottom: 24px;
max-width: 420px;
```

O selo deve ter:

* fundo em gradiente roxo e azul;
* cantos de aproximadamente 16px;
* sombra suave;
* boa legibilidade;
* proporção original preservada.

Não recrie o conteúdo do selo se já existir um arquivo oficial. Nesse caso, use a imagem oficial completa.

## Coluna direita

Organize a coluna direita em quatro partes:

1. identificação da seção;
2. logo ISG Provider Lens;
3. dois diferenciais;
4. comentário do analista.

### Identificação superior

Apresente o texto:

```text
RECONHECIMENTO INTERNACIONAL
```

Estilo:

* caixa-alta;
* azul-ciano;
* tamanho entre 12px e 14px;
* peso 700;
* espaçamento entre letras de aproximadamente `0.28em`.

Depois do texto, coloque uma linha horizontal fina em ciano que se estenda pelo espaço restante.

### Logo

Abaixo da identificação, exiba o logo oficial ISG Provider Lens.

```css
width: min(100%, 620px);
height: auto;
object-fit: contain;
object-position: left center;
```

Não reproduza o nome com texto HTML e não altere cores, tipografia ou proporções do logo.

## Bloco de diferenciais

Abaixo do logo, crie uma área com duas colunas.

Não use dois cards pesados. Os conteúdos devem parecer partes de uma mesma composição editorial.

```css
display: grid;
grid-template-columns: 1fr 1fr;
gap: 0;
margin-top: 40px;
```

Separe as colunas com uma linha vertical fina:

```css
border-left: 1px solid rgba(9, 128, 196, 0.18);
```

A linha deve existir apenas no segundo item.

Cada diferencial deve possuir:

* ícone linear dentro de um pequeno quadrado claro;
* pequeno traço horizontal ciano;
* título em azul-marinho;
* texto em azul-acinzentado;
* espaçamento interno entre 24px e 40px.

Use ícones equivalentes aos do Lucide React:

* `UsersRound` para “Conhecimento e experiência”;
* `ChartNoAxesColumnIncreasing` para “Portfólio robusto”.

Os ícones devem ser decorativos, com `aria-hidden="true"`.

### Diferencial 1

Título:

```text
Conhecimento e experiência
```

Texto, sem alterar nenhuma palavra:

```text
“expertise é inquestionável, possuindo mais de 40 implementações, migrações e modernizações de aplicações no Brasil; fornece serviço de consultoria em práticas de negócio de seguros e soluções “end-to-end”, para seguradoras relevantes no mercado brasileiro”.
```

### Diferencial 2

Título:

```text
Portfólio robusto
```

Texto, sem alterar nenhuma palavra:

```text
“Possui aceleradores para melhorar o “time to market” dos clientes. Essas soluções e aceleradores atendem às regulações brasileiras e às melhores práticas de negócio em seguros”.
```

## Comentário do analista

Abaixo dos diferenciais, crie um bloco de citação ocupando toda a largura da coluna direita.

Características:

```css
position: relative;
margin-top: 32px;
padding: 36px 42px 36px 150px;
background: rgba(255, 255, 255, 0.86);
border: 1px solid rgba(0, 153, 220, 0.25);
border-radius: 24px;
box-shadow: 0 18px 45px rgba(8, 39, 86, 0.08);
```

Adicione aspas grandes e decorativas no lado esquerdo, em azul muito claro. As aspas não podem competir com o texto e devem usar `aria-hidden="true"`.

Título:

```text
Comentário do Analista
```

Texto exato:

```text
“A parceria única da Sistran com Pegasystems permite que ela oriente seus clientes companhias de seguros através da desafiadora transformação digital em seus negócios.”
```

Use o elemento semântico `<blockquote>`.

## Créditos e referência legal

Na parte inferior da coluna direita, exiba uma linha discreta com três informações:

```text
(*) ISG — Consultores Globais em Gestão de Outsourcing
```

```text
isg-one.com/index/isg-index
```

```text
Reprint autorizado por ISG Provider Lens ©, Brasil
```

Transforme o endereço em link real:

```text
https://isg-one.com/index/isg-index
```

O link deve abrir em nova aba e conter:

```html
target="_blank"
rel="noopener noreferrer"
```

No desktop, separe os três elementos com linhas verticais finas. No mobile, apresente-os empilhados e sem separadores.

## Tipografia

Utilize a fonte já configurada no projeto. Caso não exista uma fonte institucional definida, use `Inter`.

Referências:

* títulos: `#082756`;
* textos: `#355782`;
* detalhes: `#05bde8`;
* fundo: `#f7fbff`;
* bordas: azul com baixa opacidade.

Tamanhos aproximados:

```css
título dos diferenciais: clamp(1.25rem, 1.6vw, 1.75rem);
texto: clamp(1rem, 1.05vw, 1.16rem);
line-height: 1.55;
```

## Responsividade

### Desktop acima de 1100px

* duas colunas;
* fotografia à esquerda;
* conteúdo à direita;
* diferenciais lado a lado;
* painel com altura aproximada de 680px.

### Tablet entre 768px e 1099px

* manter duas colunas enquanto houver espaço;
* reduzir paddings;
* logo com largura máxima de 480px;
* diferenciais podem ficar empilhados;
* remover a linha divisória vertical quando forem empilhados.

### Mobile abaixo de 768px

Organizar nesta ordem:

1. reconhecimento internacional;
2. logo ISG;
3. fotografia;
4. conhecimento e experiência;
5. portfólio robusto;
6. comentário do analista;
7. créditos legais.

No mobile:

* padding lateral de 20px;
* imagem com proporção próxima de `4 / 5`;
* selo com `left: 12px`, `right: 12px` e `bottom: 12px`;
* bloco de citação com padding menor;
* aspas decorativas reduzidas;
* nenhuma rolagem horizontal.

## Interações e movimento

Adicione somente animações discretas:

* entrada com `opacity` e `translateY`;
* duração entre 500ms e 700ms;
* fotografia pode entrar com `scale(0.98)` para `scale(1)`;
* diferenciais podem aparecer com pequeno atraso entre eles;
* não use parallax agressivo;
* não anime permanentemente o logo;
* respeite `prefers-reduced-motion`.

## Acessibilidade

* forneça `alt` descritivo para a fotografia;
* o logo deve ter `alt="ISG Provider Lens"`;
* elementos decorativos devem usar `aria-hidden="true"`;
* preserve contraste WCAG AA;
* mantenha foco visível no link;
* não use texto importante dentro de backgrounds.

Sugestão de `alt` para a fotografia:

```text
Profissional analisando indicadores do mercado de seguros em uma tela digital
```

## Critérios de aceite

A implementação estará correta quando:

* reproduzir a composição da referência;
* usar a fotografia gerada como asset separado;
* preservar o logo oficial;
* apresentar todos os textos integralmente;
* não criar três cards genéricos;
* manter o comentário do analista como destaque editorial;
* manter o selo sobre a fotografia;
* funcionar corretamente em desktop, tablet e celular;
* não apresentar textos cortados ou rolagem horizontal;
* não alterar outras seções;
* não utilizar a imagem completa da referência como substituta do componente.

Ao finalizar, informe quais arquivos foram criados ou alterados e onde os três assets devem ser colocados.
