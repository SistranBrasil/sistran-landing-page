Quero que você altere diretamente a seção da premiação Celent na página `/quem-somos`.

Use:

- `image(6).png` como referência da implementação atual.
- `cele.png` como imagem principal da premiação.
- Os componentes, tokens, fontes, espaçamentos e animações já existentes no projeto.

## Problema atual

A imagem está sendo usada como fundo da seção e o conteúdo textual foi colocado por cima dela. Isso está causando:

- Conflito entre texto e troféu.
- Baixo contraste em algumas áreas.
- Excesso de informação no mesmo espaço.
- Dificuldade para perceber o que é conteúdo da página e o que faz parte da imagem.
- Perda de destaque tanto da manchete quanto da premiação.

## Objetivo

Transformar a seção em uma composição editorial dividida, com:

- Conteúdo textual em uma área própria à esquerda.
- Imagem da premiação em uma área própria à direita.
- Nenhum texto da página sobreposto à imagem.
- Maior destaque para o troféu e para a manchete.
- Aparência institucional, moderna e integrada ao padrão visual da Sistran.

## Estrutura principal

No desktop, utilizar duas colunas:

- Coluna esquerda: aproximadamente 38% a 42% da largura.
- Coluna direita: aproximadamente 58% a 62% da largura.
- Espaçamento entre as colunas entre `48px` e `72px`.
- Container central com a mesma largura máxima utilizada nas demais seções da página.

A imagem não deve mais ser utilizada como `background-image` da seção.

Renderize `cele.png` como um elemento visual independente, preferencialmente com `next/image` caso o projeto utilize Next.js.

## Coluna esquerda

Organizar o conteúdo nesta ordem:

1. Eyebrow pequeno:

“RECONHECIMENTO INTERNACIONAL”

2. Manchete principal:

“Seguradora americana Top 5 no mundo nos elege como Melhor Projeto nas Américas.”

3. Identificação da premiação:

“CELENT”

“Technology Standout 2023”

4. Texto em destaque:

“A Sistran foi reconhecida pela Celent com o Technology Standout 2023.”

5. Texto complementar:

“A mais alta categoria no quesito tecnologia.”

Não alterar a redação desses textos.

### Estilo da coluna esquerda

- Fundo azul-gelo muito claro ou transparente sobre o fundo claro da seção.
- Texto principal em azul-marinho institucional.
- Eyebrow em azul ou ciano.
- Manchete com peso entre `700` e `800`.
- Tamanho responsivo utilizando `clamp()`.
- Largura de leitura controlada para evitar linhas excessivamente longas.
- Adicionar uma linha vertical ciano ao lado do bloco “CELENT — Technology Standout 2023”.
- Utilizar bastante espaço entre manchete, selo e parágrafos.
- Não criar um card pesado envolvendo todo o conteúdo.

A manchete deve possuir quebras equilibradas, mas não force quebras com `<br>` se isso prejudicar a responsividade.

## Coluna direita

Colocar `cele.png` dentro de uma moldura independente.

Características da moldura:

- Cantos arredondados entre `24px` e `32px`.
- Borda fina em ciano com baixa opacidade.
- Fundo branco ou azul-gelo.
- Sombra azul muito suave.
- `overflow: hidden`.
- A imagem deve ocupar toda a área disponível.
- Preservar o troféu, a placa Celent e o balão lateral da composição.
- Evitar cortes nos elementos principais.
- Usar `object-fit: cover` somente se não cortar informações importantes.
- Caso o corte prejudique a imagem, utilizar `object-fit: contain`.

A imagem deve ser tratada como a peça visual principal da seção.

Não colocar títulos, parágrafos, logos adicionais, badges ou botões sobre a imagem.

## Marcador lateral

Preservar o marcador vertical existente com o texto:

“PREMIAÇÕES”

Ele deve continuar alinhado à lateral esquerda da viewport, seguindo o mesmo padrão das outras seções da página.

Não duplicar o marcador dentro do conteúdo principal.

## Fundo

Manter o fundo claro e tecnológico da página, utilizando apenas elementos sutis:

- Azul-gelo.
- Gradiente radial muito suave.
- Linhas técnicas finas.
- Arcos grandes com baixa opacidade.
- Grid quase imperceptível.

O fundo não deve competir com o texto ou com a imagem.

Não utilizar fundo azul-escuro nesta seção.

Não aplicar efeitos fortes de neon ou excesso de glassmorphism.

## Animação de entrada

Quando a seção entrar na tela:

- Coluna textual: `opacity: 0` para `1` e pequeno deslocamento horizontal da esquerda.
- Imagem: revelar da direita para a esquerda utilizando máscara, `clip-path` ou o componente de reveal já existente.
- Duração entre `600ms` e `900ms`.
- Easing suave.
- Pequeno atraso entre texto e imagem.
- Executar apenas uma vez.
- Não controlar nem travar o scroll.
- Respeitar `prefers-reduced-motion`.

No hover da imagem:

- Aplicar no máximo uma escala de `1.01`.
- Intensificar discretamente a borda ciano.
- Não inclinar a imagem.
- Não aplicar rotação 3D.

## Responsividade

### Desktop

- Duas colunas.
- Texto à esquerda.
- Imagem à direita.
- Imagem com maior largura visual que o texto.

### Tablet

- Manter duas colunas enquanto houver espaço suficiente.
- Reduzir o espaçamento entre as colunas.
- Diminuir a manchete progressivamente.
- Se a leitura ficar comprimida, mudar para uma coluna antes de ocorrer sobreposição.

### Mobile

Utilizar uma única coluna nesta ordem:

1. Eyebrow.
2. Manchete.
3. Bloco Celent.
4. Texto descritivo.
5. Imagem completa.

No mobile:

- Não colocar o texto por cima da imagem.
- A imagem deve ocupar `100%` da largura disponível.
- Manter proporção original.
- Utilizar cantos arredondados entre `18px` e `22px`.
- Manter pelo menos `20px` de espaçamento lateral.
- Evitar scroll horizontal.
- Se o balão lateral da própria arte ficar ilegível, usar `object-fit: contain` em vez de cortar a imagem.

## Acessibilidade

- Adicionar um texto alternativo descritivo à imagem.
- Sugestão: “Premiação Celent Technology Standout 2023 recebida pela Sistran”.
- Garantir contraste adequado nos textos.
- Não transformar a imagem em botão ou link se não houver interação.
- Respeitar redução de movimento.
- Manter a estrutura semântica correta da seção.

## Restrições

- Não modificar o header.
- Não modificar as outras premiações.
- Não alterar o menu lateral da página.
- Não alterar os textos fornecidos.
- Não recriar a arte `cele.png`.
- Não inserir texto da página sobre a imagem.
- Não adicionar carrossel.
- Não adicionar setas ou paginação.
- Não adicionar números decorativos.
- Não adicionar novas dependências sem necessidade.
- Não duplicar a logo Celent fora do bloco previsto.
- Não utilizar a imagem como fundo de toda a seção.

## Resultado esperado

A seção deve parecer uma matéria editorial premium:

- Manchete forte e legível à esquerda.
- Premiação apresentada integralmente à direita.
- Separação clara entre informação e imagem.
- Mais espaço em branco.
- Melhor hierarquia.
- Nenhuma sobreposição.
- Integração visual com o restante da página `/quem-somos`.

Implemente as alterações diretamente no código existente.

Antes de finalizar:

1. Verifique a seção em desktop, tablet e mobile.
2. Confirme que não existe texto sobre a imagem.
3. Confirme que os elementos importantes de `cele.png` não foram cortados.
4. Confirme que não há scroll horizontal.
5. Execute lint e build.
6. Corrija os erros introduzidos pela alteração.
7. Informe quais arquivos foram modificados.