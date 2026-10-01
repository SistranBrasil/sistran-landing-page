Crie a seção “Nossa Essência” seguindo exatamente o layout da imagem de referência fornecida.

A seção deve ser implementada com componentes reais em HTML, CSS e React/Next.js. Não transforme toda a seção em uma imagem.

Antes de começar:

* Analise a estrutura e o design system já existentes no projeto.
* Reutilize tipografia, container, breakpoints, botões, cores e componentes já existentes.
* Não altere outras seções da página.
* Não crie um projeto novo.
* Use TypeScript.
* Use Framer Motion somente se ele já estiver instalado. Caso contrário, implemente as transições com CSS e IntersectionObserver.
* O comportamento principal deve ser um sticky scroll com três estados: Missão, Valores e Pilares.

Assets

Coloque e utilize estes arquivos:

* `/public/images/nossa-essencia/missao.png`
* `/public/images/nossa-essencia/valores.png`
* `/public/images/nossa-essencia/pilares.png`

Os arquivos possuem fundo transparente. Não adicione caixas, fundos brancos ou molduras ao redor deles.

## Estrutura geral

Crie um componente principal chamado `NossaEssenciaSection`.

Crie também componentes reutilizáveis:

* `EssenciaNavigation`
* `EssenciaPanel`
* `EssenciaContent`
* `EssenciaVisual`
* `EssenciaTags`
* `EssenciaPreviewTabs`

Armazene todo o conteúdo em um array de dados. Não repita manualmente a estrutura JSX para cada estado.

A seção deve ocupar aproximadamente `300vh` no desktop, permitindo que cada conteúdo permaneça em destaque durante cerca de uma viewport.

Dentro dela, crie um container sticky:

```css
position: sticky;
top: 0;
min-height: 100svh;
```

Quando o usuário rolar:

1. Missão aparece primeiro.
2. O conteúdo muda suavemente para Valores.
3. O conteúdo muda suavemente para Pilares.
4. Depois de Pilares, a seção é liberada e a página continua normalmente.

Não use scroll horizontal.

## Fundo da seção

Use fundo muito claro, próximo de branco azulado:

```css
background:
  radial-gradient(circle at 78% 20%, rgba(29, 199, 239, 0.09), transparent 30%),
  linear-gradient(180deg, #ffffff 0%, #f5fbff 100%);
```

Adicione detalhes técnicos muito discretos:

* grid pontilhado quase invisível;
* linhas finas azul-claras;
* pequenos pontos ciano;
* arcos geométricos nas extremidades;
* bastante espaço em branco.

Esses elementos não podem competir com o conteúdo.

## Layout desktop

Utilize container centralizado com largura máxima entre `1360px` e `1440px`.

Divida o conteúdo em duas colunas:

* Navegação lateral: aproximadamente 27%.
* Painel principal: aproximadamente 73%.

Espaçamento entre as colunas: entre `52px` e `72px`.

Centralize verticalmente o conjunto dentro da viewport.

## Navegação lateral

No alto da coluna esquerda, coloque somente a pequena identificação:

`NOSSA ESSÊNCIA`

Características:

* caixa alta;
* tamanho entre 11px e 13px;
* letter-spacing de aproximadamente `0.18em`;
* azul-ciano;
* pequeno traço ciano abaixo.

Não coloque título introdutório, subtítulo ou parágrafo nessa coluna.

Abaixo, crie uma linha vertical fina conectando três marcadores:

* Missão
* Valores
* Pilares

Não exiba números.

Não exiba:

* “01”, “02” ou “03”;
* porcentagem;
* barra de progresso horizontal;
* “EM DESTAQUE”;
* título “O que sustenta nossa forma de atuar”.

O item ativo deve ter:

* círculo maior preenchido com gradiente ciano;
* halo azul-claro;
* texto azul-marinho escuro;
* peso 700.

Os itens inativos devem ter:

* círculo menor;
* fundo azul muito claro;
* borda azul suave;
* texto azul acinzentado.

Os nomes devem funcionar como botões. Ao clicar, a página deve rolar suavemente até o trecho correspondente.

Na parte inferior da navegação, coloque:

* ícone simples de seta para baixo;
* texto `Continue rolando`.

Esse aviso deve desaparecer suavemente quando Pilares estiver ativo.

## Painel principal

Crie um único painel escuro fixo visualmente durante a rolagem.

Estilo:

```css
background:
  radial-gradient(circle at 70% 30%, rgba(18, 110, 196, 0.32), transparent 42%),
  linear-gradient(135deg, #061d41 0%, #072b58 58%, #051b3b 100%);
border: 1px solid rgba(61, 186, 235, 0.22);
border-radius: 26px;
box-shadow: 0 30px 75px rgba(4, 43, 86, 0.22);
overflow: hidden;
```

O painel deve ter aproximadamente:

* largura total disponível;
* altura entre `600px` e `680px`;
* padding entre `50px` e `64px`.

Adicione no centro da borda superior um pequeno brilho horizontal ciano, semelhante ao da referência.

Dentro do painel, divida o conteúdo em:

* texto à esquerda: aproximadamente 48%;
* componente visual à direita: aproximadamente 52%.

## Transição dos estados

Ao mudar de estado:

* o conteúdo textual atual reduz levemente a opacidade e sobe cerca de 12px;
* o novo conteúdo entra de baixo para cima;
* o componente visual faz crossfade;
* o componente visual pode mudar de escala de `0.94` para `1`;
* duração entre 500ms e 700ms;
* easing suave, semelhante a `cubic-bezier(0.22, 1, 0.36, 1)`.

Não utilize giros exagerados, partículas excessivas ou animações contínuas chamativas.

O painel não deve desaparecer entre os estados. Somente o conteúdo interno deve mudar.

## Conteúdo: Missão

Título:

`Missão`

Texto, sem alterar:

`Oferecer soluções de negócios escaláveis, de baixo TCO*, baseadas em tecnologia para companhias de Seguros, considerando suas necessidades atuais e futuras.`

Nota, sem alterar:

`*Total Cost of Ownership, uma estimativa financeira de custos diretos e indiretos de investimentos.`

Tags:

* Escalabilidade
* Tecnologia
* Visão de futuro

Visual:

`/images/nossa-essencia/missao.png`

## Conteúdo: Valores

Título:

`Valores`

Texto, sem alterar:

`Conhecimento em Seguros, Flexibilidade, Tecnologia, Solidez e permanência.`

Apresente os valores também como tags:

* Conhecimento em Seguros
* Flexibilidade
* Tecnologia
* Solidez
* Permanência

Visual:

`/images/nossa-essencia/valores.png`

## Conteúdo: Pilares

Título:

`Pilares`

Apresente os seis pilares em uma lista compacta e legível:

* Compromisso em ter a melhor relação custo benefício do mercado.
* Foco em minimizar o risco de insucesso do projeto.
* Busca pela eficiência e eficácia em gestão.
* Capacidade de entender os requisitos do cliente e agregar valor ao seu negócio, por meio dos nossos especialistas.
* Transparência e ética no relacionamento com clientes, fornecedores, parceiros, colaboradores e acionistas.
* Aprimoramento contínuo de visão de negócios de nossos consultores colaboradores.

Utilize pequenos marcadores ou ícones lineares em ciano. Não coloque cada item dentro de um card independente.

Visual:

`/images/nossa-essencia/pilares.png`

Como Pilares possui mais texto:

* diminua discretamente o tamanho da fonte da lista;
* use duas colunas somente se houver espaço suficiente;
* preserve boa legibilidade;
* não corte ou resuma os textos.

## Componentes visuais

Os três PNGs devem aparecer grandes no lado direito do painel.

Aplicação recomendada:

```css
width: min(100%, 520px);
height: auto;
object-fit: contain;
filter: drop-shadow(0 0 28px rgba(22, 213, 255, 0.16));
```

Não coloque os componentes dentro de círculos ou cards adicionais. Eles já possuem sua própria construção circular.

Use `next/image` quando o projeto utilizar Next.js:

* `priority` somente para o componente Missão;
* `loading="lazy"` nos demais;
* `alt=""` e `aria-hidden="true"` porque são elementos decorativos.

## Abas de pré-visualização

Atrás da parte inferior do painel principal, crie duas abas finas e claras, como na referência.

Quando Missão estiver ativa:

* mostrar abas `Valores` e `Pilares`.

Quando Valores estiver ativo:

* mostrar abas `Missão` e `Pilares`.

Quando Pilares estiver ativo:

* mostrar abas `Missão` e `Valores`.

As abas devem:

* aparecer parcialmente atrás do painel;
* ter fundo branco translúcido;
* borda azul muito clara;
* sombra suave;
* cantos arredondados;
* não exibir números;
* ser clicáveis para navegar ao estado correspondente.

## Tipografia

Utilize a fonte já configurada no projeto.

Referência de escala:

* título do estado: `clamp(3rem, 5vw, 5.25rem)`;
* corpo principal: entre 20px e 26px;
* nota: entre 14px e 17px;
* navegação lateral: entre 22px e 28px;
* tags: entre 14px e 16px.

Cores:

* título: branco;
* texto principal: `rgba(255,255,255,.90)`;
* texto secundário: `rgba(255,255,255,.68)`;
* ciano: `#17d5ef`;
* azul vivo: `#168ef2`;
* azul-marinho: `#082654`.

## Comportamento responsivo

Desktop:

* manter sticky scroll;
* duas colunas;
* painel grande;
* componente visual no lado direito.

Tablet:

* reduzir o tamanho do painel e das fontes;
* manter texto e imagem lado a lado enquanto houver espaço;
* reduzir os elementos decorativos.

Mobile:

* não utilizar uma seção com `300vh`;
* desativar o sticky scroll;
* mostrar Missão, Valores e Pilares em sequência vertical;
* cada estado deve ter seu próprio painel escuro;
* colocar o componente visual abaixo do texto;
* transformar a navegação lateral em três botões horizontais ou ocultá-la;
* manter todo o conteúdo acessível sem depender de animação;
* não permitir overflow horizontal.

## Acessibilidade e desempenho

* Respeite `prefers-reduced-motion`.
* Use elementos semânticos.
* Permita navegação pelos botões usando teclado.
* Adicione foco visível.
* Mantenha contraste adequado.
* Não bloqueie o scroll natural.
* Não carregue bibliotecas novas sem necessidade.
* Evite listeners de scroll executando alterações de estado em cada pixel; utilize `requestAnimationFrame`, `useScroll` ou IntersectionObserver.
* Evite layout shift.
* Depois de Pilares, a próxima seção da página deve aparecer normalmente.

## Restrições finais

Não adicionar:

* fotografias;
* pessoas;
* um título geral grande;
* números nos estados;
* contador “01/03”;
* barra horizontal de progresso;
* botão de play;
* setas dentro do painel;
* cards separados para Missão, Valores e Pilares;
* fundo escuro em toda a seção;
* textos diferentes dos fornecidos;
* ícones genéricos de bibliotecas no lugar dos três assets entregues.

O resultado precisa reproduzir a composição da referência: fundo claro, navegação vertical à esquerda, um painel tecnológico azul-marinho à direita, conteúdo mudando conforme a rolagem e um componente visual diferente para cada estado.

Ao terminar:

1. Execute lint e build.
2. Corrija erros introduzidos.
3. Informe os arquivos criados ou modificados.
4. Explique brevemente como o índice ativo é calculado durante a rolagem.
