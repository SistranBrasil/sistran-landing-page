Implemente uma nova seção de “Tecnologias” seguindo com máxima fidelidade a imagem de referência anexada.

A seção ficará logo abaixo de “Onde seguros, negócio e tecnologia convergem” e deverá respeitar o design system já utilizado no projeto. Antes de implementar, examine a estrutura atual, os componentes existentes, os tokens de cores, a tipografia, os breakpoints e os assets disponíveis.

## Objetivo

Criar uma vitrine clara e dinâmica das tecnologias utilizadas pela Sistran. As tecnologias deverão se movimentar automaticamente e a plataforma em destaque deverá ser trocada periodicamente.

Não crie uma grade estática de cards.

## Estrutura visual

### 1. Fundo

* Fundo claro, predominantemente branco e azul-gelo.
* Aplicar um degradê muito suave entre:

  * `#F8FCFF`
  * `#EEF8FF`
  * `#E5F4FF`
* Inserir uma grade técnica extremamente discreta.
* Acrescentar círculos, órbitas e linhas técnicas em azul-claro com baixa opacidade.
* Criar um brilho radial azul suave atrás da tecnologia central.
* Não usar fundo azul-marinho ou áreas escuras.
* A seção deve ter aproximadamente `850px` de altura no desktop.
* Evitar excesso de efeitos futuristas, partículas ou ilustrações genéricas de inteligência artificial.

### 2. Carimbo

Não inserir o título textual “Tecnologias”.

No canto superior esquerdo do container, utilizar o arquivo oficial do carimbo:

`SISTRAN Tecnologias`

Regras:

* Utilizar o PNG/SVG fornecido no projeto.
* Não redesenhar o carimbo com texto HTML.
* Não modificar proporção, símbolo, tipografia ou cor.
* Largura aproximada no desktop: `370px`.
* Largura no tablet: `300px`.
* Largura no mobile: entre `230px` e `260px`.
* Manter bastante respiro ao redor.
* Alinhar o carimbo ao mesmo container horizontal das tecnologias.

### 3. Primeira faixa automática

Logo abaixo do carimbo, criar uma faixa horizontal contínua com:

* React
* MongoDB
* Redis
* Python
* Angular
* Java

Cada tecnologia deve aparecer em uma cápsula branca com:

* Altura aproximada de `78px`.
* Cantos arredondados entre `18px` e `22px`.
* Sombra azul muito suave.
* Borda praticamente imperceptível.
* Logo oficial centralizada.
* Espaçamento horizontal confortável.
* Nenhum texto adicional.

A faixa deve se movimentar continuamente da direita para a esquerda.

O movimento deve ser lento, uniforme e infinito, sem saltos quando a sequência reiniciar.

Duplicar internamente os itens apenas para construir o loop, mas evitar tecnologias duplicadas visíveis lado a lado.

Aplicar máscaras de transparência nas duas extremidades para que os elementos apareçam e desapareçam suavemente.

### 4. Destaque central

No centro da seção, criar um carrossel automático com três plataformas principais:

* Pega
* AWS
* Salesforce

O item ativo deverá aparecer em um painel central maior.

Exemplo inicial:

* AWS ativa no centro.
* Pega como prévia à esquerda.
* Salesforce como prévia à direita.

Painel central:

* Aproximadamente `390px × 245px` no desktop.
* Fundo branco com leve transparência.
* Borda ciano de `2px`.
* Cantos arredondados de aproximadamente `24px`.
* Sombra azul-ciano suave.
* Logo oficial grande e centralizada.
* Pequena linha ciano abaixo da logo.
* Categoria abaixo da linha.

Categorias:

* Pega: `Automação & Processos`
* AWS: `Cloud & Infraestrutura`
* Salesforce: `CRM & Relacionamento`

As tecnologias laterais devem:

* Ser menores que o painel central.
* Ter menor opacidade.
* Aparecer parcialmente suavizadas.
* Não possuir borda ciano ativa.
* Servir como indicação visual da tecnologia anterior e da próxima.

### 5. Troca automática

A tecnologia central deverá mudar automaticamente a cada `4 segundos`.

Sequência:

1. Pega
2. AWS
3. Salesforce
4. Recomeçar em Pega

A transição deve combinar:

* Deslocamento horizontal curto.
* Crossfade.
* Pequena alteração de escala.
* Duração entre `550ms` e `750ms`.
* Easing suave, semelhante a `cubic-bezier(0.22, 1, 0.36, 1)`.

Quando uma nova tecnologia entrar:

* A tecnologia da direita passa para o centro.
* A tecnologia central passa para a esquerda.
* A próxima tecnologia surge pela direita.
* As legendas devem mudar junto com a logo.

Pausar a troca automática quando o usuário mantiver o mouse sobre a área central.

Retomar automaticamente quando o mouse sair.

Não inserir:

* Setas.
* Bolinhas de paginação.
* Barra de progresso.
* Contador como “04 / 16”.
* Botão de play ou pause.
* Controles visíveis do carrossel.

### 6. Segunda faixa automática

Abaixo do destaque central, criar outra faixa contínua com:

* REST API
* Spring Boot
* Node.js
* .NET
* Inteligência Artificial

Essa faixa deve seguir o mesmo padrão visual da primeira, mas se movimentar no sentido contrário: da esquerda para a direita.

As duas faixas precisam ter velocidades levemente diferentes para que o movimento pareça natural e não mecanicamente sincronizado.

Sugestão:

* Faixa superior: ciclo completo entre `28s` e `34s`.
* Faixa inferior: ciclo completo entre `32s` e `38s`.

### 7. Logos

Utilize exclusivamente:

1. Assets oficiais já existentes no projeto.
2. Arquivos SVG ou PNG fornecidos.
3. Uma biblioteca confiável, como Simple Icons, apenas se o asset não existir.

Não desenhe logos manualmente.

Não utilize imagens geradas por IA para representar marcas.

Preservar:

* Proporções originais.
* Cores oficiais.
* Áreas de respiro.
* Nitidez em telas Retina.

Adicionar `alt` apropriado em todas as imagens.

### 8. Responsividade

#### Desktop

* Carimbo no canto superior esquerdo.
* Duas faixas horizontais completas.
* Três tecnologias visíveis na área central.
* Tecnologia ativa maior.
* Container com largura máxima entre `1440px` e `1520px`.

#### Tablet

* Reduzir proporcionalmente o painel central.
* Manter as duas tecnologias laterais parcialmente visíveis.
* Diminuir o espaçamento entre as cápsulas.
* Preservar o movimento automático.

#### Mobile

* Carimbo centralizado ou alinhado à esquerda, conforme o padrão existente da página.
* Painel ativo ocupando aproximadamente `82%` da largura.
* Tecnologias laterais aparecendo apenas parcialmente.
* Faixas horizontais continuando além das bordas da tela.
* Não criar rolagem horizontal na página.
* Altura mínima confortável, sem sobreposição.
* Diminuir a quantidade de elementos simultaneamente visíveis, sem remover tecnologias da sequência.

### 9. Animação e acessibilidade

* Priorizar animações feitas em CSS.
* Se o projeto já utilizar Framer Motion ou Motion, reutilizar a biblioteca existente.
* Não instalar uma nova dependência apenas para essa seção.
* Utilizar `transform` e `opacity` para manter boa performance.
* Evitar animar propriedades que provoquem reflow constante.
* Pausar animações quando a aba do navegador não estiver ativa.
* Respeitar `prefers-reduced-motion`:

  * interromper o marquee contínuo;
  * manter as tecnologias visíveis;
  * substituir a troca deslizante por um crossfade discreto.
* Elementos apenas decorativos devem utilizar `aria-hidden="true"`.

### 10. Organização do código

Criar componentes reutilizáveis, por exemplo:

* `TechnologiesSection`
* `TechnologyMarquee`
* `TechnologySpotlight`
* `TechnologyLogo`

Manter os dados separados da apresentação:

* nome;
* logo;
* categoria;
* texto alternativo;
* grupo;
* cor opcional.

Evitar repetir manualmente o mesmo JSX para cada tecnologia.

Não alterar outras seções da página.

Não modificar header, footer, navegação ou componentes globais sem necessidade.

### 11. Resultado visual obrigatório

A seção final deve transmitir:

* Tecnologia corporativa.
* Clareza.
* Movimento contínuo.
* Integração entre diferentes plataformas.
* Sofisticação sem aparência exageradamente futurista.
* Identidade visual Sistran.

A composição precisa permanecer muito próxima da imagem de referência:

* carimbo no alto à esquerda;
* faixa superior com tecnologias;
* AWS inicialmente em destaque;
* Pega à esquerda;
* Salesforce à direita;
* faixa inferior com outras tecnologias;
* fundo azul-gelo;
* linhas técnicas discretas;
* nenhum controle de navegação visível.

## Critérios de aceite

A implementação estará concluída somente quando:

* O título “Tecnologias” não existir.
* O carimbo oficial estiver sendo utilizado.
* O fundo estiver claro.
* As duas faixas se moverem continuamente em sentidos opostos.
* O loop não apresentar saltos.
* Pega, AWS e Salesforce alternarem automaticamente no centro.
* Não existir barra de progresso, contador, setas ou botão de pausa.
* Não houver rolagem horizontal indesejada.
* A seção funcionar corretamente em desktop, tablet e mobile.
* Todas as logos estiverem nítidas e proporcionais.
* O restante da página permanecer inalterado.

Implemente diretamente no projeto, execute lint e build e corrija qualquer erro introduzido.
