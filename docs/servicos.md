Implemente a seção “Serviços” seguindo fielmente a imagem de referência anexada.

Antes de alterar o código, analise a estrutura, os componentes, o sistema de estilos e a responsividade existentes. Não recrie a página inteira e não altere outras seções.

## Estrutura geral

A seção deve ocupar toda a largura da viewport e possuir um vídeo tecnológico como fundo.

No desktop, organize o conteúdo em duas áreas:

* Coluna esquerda: aproximadamente 42% da largura.
* Coluna direita: aproximadamente 58% da largura.
* Container central com `max-width` entre `1440px` e `1520px`.
* Espaçamento lateral responsivo.
* Altura suficiente para exibir todo o conteúdo sem áreas vazias excessivas.

## Vídeo de fundo

Use o vídeo existente como background de toda a seção.

Configuração obrigatória:

* Reprodução automática.
* Sem controles.
* Sem botão de play.
* Sem barra de progresso.
* Sem volume, menu ou botão de tela cheia.
* `autoPlay`
* `muted`
* `loop`
* `playsInline`
* `preload="metadata"`
* `object-fit: cover`
* Ocupando toda a seção com `position: absolute` e `inset: 0`.

Não renderize nenhuma interface de player.

Adicione sobre o vídeo:

* Overlay azul-marinho escuro.
* Gradiente mais forte atrás dos textos e cards.
* Opacidade suficiente para garantir boa leitura.
* Leve vinheta nas bordas.
* O vídeo precisa continuar visível, mas não pode competir com o conteúdo.

## Coluna esquerda

Utilize o arquivo:

`/images/carimbo-diferenciais-ticket-outline-ffffff.png`

O carimbo deve:

* Substituir completamente a antiga tag “Diferenciais”.
* Ter aproximadamente `260px` de largura no desktop.
* Manter sua proporção original.
* Não receber fundo, cápsula ou borda adicional.
* Ter rotação discreta de aproximadamente `-3deg`.
* Ficar acima do título.
* Permanecer branco.

Abaixo do carimbo, inserir:

### Título

`Serviços`

Características:

* Cor branca.
* Peso entre 700 e 800.
* Tamanho responsivo com `clamp(3rem, 5vw, 5rem)`.
* Line-height próximo de `0.95`.

### Texto institucional

Use exatamente:

“Dedicada ao mercado segurador, com experiência em todos os ramos, a Sistran atua como integradora de sistemas para clientes com grandes carteiras.

Somos uma empresa de TI 100% focada no segmento de Seguros no Brasil, com experiência acumulada em mais de 30 implementações de ERP bem-sucedidas.”

Características:

* Cor branca com leve redução de opacidade.
* Tamanho entre `17px` e `20px`.
* Line-height entre `1.5` e `1.65`.
* Largura máxima aproximada de `560px`.
* Separar os dois parágrafos visualmente.

### Indicadores

Abaixo do texto, criar dois indicadores horizontais:

1. `30+`
   `implementações`

2. `100%`
   `Seguros`

Utilizar ícones lineares em ciano:

* Banco de dados ou servidor para “30+ implementações”.
* Escudo com check para “100% Seguros”.

Os números devem ser grandes, brancos e destacados. As legendas devem ser menores e em azul-claro.

## Grade de serviços

Na coluna direita, criar uma grade 2 × 2 com quatro cards claros.

Não exibir:

* Numeração `01`, `02`, `03` ou `04`.
* Setas.
* Botões circulares.
* Links aparentes.
* Ícones de expansão.

Cada card deve ter:

* Fundo branco ou branco-gelo.
* Borda azul muito clara.
* `border-radius` entre `22px` e `26px`.
* Sombra azul-marinho suave.
* `overflow: hidden`.
* Imagem ocupando aproximadamente 42% da altura.
* Área textual ocupando o restante.
* Alturas equivalentes entre os quatro cards.

## Imagens dos cards

Usar:

### APIs e integrações

`/images/servicos-apis-integracoes.webp`

### Serviços e processos

`/images/servicos-processos.webp`

### Tipos de serviço

`/images/servicos-squads.webp`

### Staff Augmentation

`/images/servicos-staff-augmentation.webp`

Configurar todas as imagens com:

* `width: 100%`
* `height: 100%`
* `object-fit: cover`
* `object-position: center`
* Sem textos ou gradientes pesados incorporados.
* Se o projeto for Next.js, usar `next/image` com `fill`, `sizes` e otimização adequada.

## Ícones sobrepostos

Manter os ícones como componentes SVG separados das fotografias.

Posicionar cada ícone em um selo branco que se sobrepõe à divisão entre a imagem e o conteúdo do card.

Configuração:

* Aproximadamente `64px × 64px`.
* Fundo branco.
* Borda azul muito clara.
* Sombra discreta.
* Ícone linear em ciano.
* Stroke entre `1.5` e `2`.
* Não incorporar o ícone diretamente na fotografia.

Sugestões utilizando `lucide-react`:

* APIs: `Network` ou `CodeXml`.
* Serviços e Processos: `Workflow`.
* Tipos de Serviço: `Layers3`.
* Staff Augmentation: `UsersRound`.

## Conteúdo dos cards

### APIs, Projetos, Desenvolvimento, Sustentação e Migrações

“Produção confiável, entregas de qualidade e ótima relação custo-benefício.”

Este é o card de maior destaque. Aplicar nele:

* Borda ciano.
* Glow ciano muito discreto.
* Sem aumentar excessivamente seu tamanho.

### Serviços e Processos

“Domínio de negócios e processos de seguros em todos os ramos.”

### Tipos de Serviço

“Squads, vilas, Managed Services, alocações e projetos fechados.”

### Staff Augmentation

“Especialistas integrados ao seu delivery.”

## Tipografia dos cards

Títulos:

* Azul-marinho escuro.
* Peso 700.
* Tamanho responsivo entre `18px` e `24px`.
* Line-height entre `1.15` e `1.25`.

Descrições:

* Azul acinzentado.
* Tamanho entre `15px` e `18px`.
* Line-height entre `1.45` e `1.6`.

Garanta que nenhum texto seja cortado.

## Interações

No hover do card:

* Elevação máxima de `4px`.
* Sombra ligeiramente mais intensa.
* Imagem pode aumentar até `scale(1.03)`.
* Ícone pode receber um brilho ciano discreto.
* Transição entre `250ms` e `350ms`.

Não adicionar botões ou setas no hover.

## Responsividade

### Tablet

* Manter duas colunas quando houver espaço.
* A área textual pode ocupar toda a largura acima dos cards.
* Grade dos cards permanece com duas colunas.

### Mobile

* Empilhar todo o conteúdo.
* Primeiro: carimbo, título, texto e indicadores.
* Depois: cards em uma única coluna.
* Carimbo com largura entre `190px` e `220px`.
* Título entre `44px` e `56px`.
* Imagens dos cards com altura entre `150px` e `190px`.
* Overlay do vídeo mais escuro para preservar o contraste.
* Sem overflow horizontal.
* Cards ocupando `width: 100%`.

## Requisitos técnicos

* Criar componentes reutilizáveis.
* Não colocar textos dentro das imagens.
* Não transformar a seção inteira em uma imagem.
* Preservar a stack e o padrão de estilização existentes.
* Não alterar header, footer ou outras seções.
* Garantir contraste adequado.
* Adicionar textos alternativos às imagens.
* Evitar mudanças cumulativas de layout.
* Não usar valores fixos que prejudiquem telas menores.
* Verificar desktop, tablet e mobile.
* Executar build e lint após a implementação.
* Corrigir qualquer erro introduzido.

O resultado final deve reproduzir visualmente a referência: vídeo tecnológico em tela cheia ao fundo, carimbo branco e conteúdo institucional à esquerda, quatro cards claros com fotografias naturais e ícones ciano à direita.
