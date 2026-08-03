# Auditoria visual e plano de evolução — Site Sistran

**Site analisado:** https://calm-fudge-59b6aa.netlify.app/  
**Referência de dinamismo:** https://valientebrands.com/  
**Premissa do projeto:** preservar integralmente os textos atuais. As recomendações abaixo tratam apenas de direção de arte, composição, hierarquia, navegação, movimento e experiência de uso.

---

## 1. Resumo executivo

O site da Sistran já parte de uma base visual acima da média: tem uma identidade tecnológica clara, bom contraste entre azul profundo e áreas claras, grid de fundo, tipografia de grande escala, navegação fixa, animações de entrada e uma estrutura institucional coerente.

O próximo salto de qualidade não depende de adicionar efeitos em todos os elementos. A melhoria mais importante é criar uma **narrativa de movimento única**, na qual cada seção pareça um capítulo da mesma experiência. O vídeo inicial controlado pelo scroll deve ser o elemento principal; os demais efeitos precisam apoiá-lo, e não competir com ele.

A referência Valiente Brands funciona bem porque mantém uma direção de arte extremamente disciplinada:

- poucas cores;
- muito espaço negativo;
- tipografia em grande escala;
- conteúdo revelado em cenas;
- vídeos usados como capítulos;
- movimentos recorrentes e reconhecíveis;
- navegação discreta, porém sempre disponível.

Para a Sistran, essa lógica deve ser traduzida para um território mais corporativo, seguro e tecnológico. Não é recomendável copiar a estética vermelha, o estilo de agência criativa ou o cursor experimental da referência de forma literal.

### Direção recomendada

**“Tecnologia em movimento, com precisão e confiança.”**

O site deve parecer uma plataforma tecnológica viva: dados, linhas, conexões, luz e profundidade respondem ao scroll com suavidade. A experiência precisa transmitir inovação sem perder a credibilidade exigida pelo mercado de seguros.

---

## 2. Diagnóstico do site atual

### Pontos fortes que devem ser preservados

1. **Paleta coerente com tecnologia e confiança**  
   O azul profundo, o ciano e os pontos de violeta criam uma identidade adequada ao posicionamento da empresa.

2. **Hero com presença**  
   O título inicial possui boa escala, contraste e destaque seletivo de palavras.

3. **Alternância entre áreas escuras e claras**  
   Essa mudança ajuda a separar capítulos e evita monotonia em uma página institucional longa.

4. **Boa base para o scroll cinematográfico**  
   A abertura atual já utiliza uma área alta com comportamento sticky. Isso facilita a evolução para vídeo controlado pelo scroll sem exigir uma reconstrução completa da página.

5. **Números, diferenciais e clientes como prova de autoridade**  
   A estrutura de conteúdo está correta. O que precisa evoluir é a maneira como essas informações são encenadas.

6. **Identidade gráfica existente**  
   Grid, pontos, linhas, gradientes e ícones já formam um vocabulário visual que pode ser refinado.

### Pontos que reduzem o impacto

1. **Muitos efeitos de entrada com blur ao mesmo tempo**  
   Em alguns momentos do scroll, títulos, textos e cards permanecem borrados ou parcialmente invisíveis durante tempo demais. Isso cria sensação de atraso e pode prejudicar a leitura.

2. **As animações ainda parecem individuais, não narrativas**  
   Há bons efeitos isolados, mas falta uma conexão clara entre a saída de uma seção e a entrada da próxima.

3. **Cards com linguagem visual genérica**  
   As áreas “Diferenciais” e “Serviços” utilizam cartões funcionais, porém ainda próximos de layouts corporativos comuns. Elas podem se tornar momentos memoráveis da navegação.

4. **Header apertado em larguras intermediárias**  
   Em aproximadamente 1280 px, os itens centrais ficam muito próximos e começam a perder clareza. A navegação precisa mudar de configuração antes desse ponto.

5. **Navegação lateral disputando espaço com os títulos**  
   A régua lateral de seções é interessante em telas amplas, mas começa a sobrepor ou competir visualmente com os rótulos de seção em larguras intermediárias.

6. **Ritmo vertical pouco variado**  
   Várias seções seguem uma fórmula semelhante: rótulo, título, texto e cards. O conteúdo está correto, mas a composição deve variar para criar surpresa.

7. **Elementos importantes aparecem somente após a animação**  
   Os números iniciam visualmente em zero e alguns conteúdos dependem totalmente do gatilho de scroll. O valor final deve estar disponível mesmo se a animação não executar.

8. **A alternância escuro/claro ainda é abrupta**  
   As mudanças de fundo funcionam como separação, mas podem ganhar transições visuais mais orgânicas.

---

## 3. Conceito do novo hero com vídeo integrado ao scroll

### Estrutura recomendada

Criar uma abertura com **300 a 380vh de altura**, contendo uma cena sticky de **100svh**. O vídeo permanece fixo na tela enquanto o progresso do scroll controla seus frames.

O vídeo não deve apenas “tocar enquanto o usuário rola”. Ele deve funcionar como uma linha do tempo visual:

| Progresso do scroll | Comportamento visual |
|---|---|
| 0–15% | Primeiro frame, atmosfera escura, logo/grid e o texto institucional menor |
| 15–40% | Entrada do título principal por linhas, sem alterar nenhuma palavra |
| 40–65% | Evolução da cena do vídeo e destaque visual da palavra já enfatizada no layout |
| 65–82% | Entrada do parágrafo e dos CTAs |
| 82–100% | Surgimento dos indicadores institucionais e transição para “Quem somos” |

### Direção do vídeo

O vídeo deve comunicar tecnologia aplicada a seguros sem cair em imagens genéricas de banco de vídeos. Uma boa sequência pode combinar:

- arquitetura de dados;
- fluxos e conexões;
- ambientes corporativos reais;
- detalhes humanos e colaboração;
- interfaces abstratas;
- linhas que lembram apólices, redes e processos;
- passagem gradual do escuro para a luz.

O último frame deve se aproximar visualmente da primeira composição da seção “Quem somos”. Assim, o vídeo parece se transformar na página, em vez de simplesmente terminar.

### Camadas do hero

1. **Vídeo em tela cheia**  
   `object-fit: cover`, centralizado e com versões próprias para desktop e celular.

2. **Máscara de contraste**  
   Gradiente escuro lateral ou inferior para manter a leitura do texto em qualquer frame.

3. **Grid técnico sutil**  
   O grid existente pode permanecer com opacidade baixa e leve parallax.

4. **Texto em camada independente**  
   O título não deve fazer parte do vídeo. Deve continuar como HTML para manter nitidez, SEO e acessibilidade.

5. **Indicador de progresso**  
   Uma linha vertical ou horizontal discreta mostra que o scroll está conduzindo uma apresentação.

6. **Convite de scroll**  
   O indicador atual pode evoluir de uma seta pulsante para uma linha que se preenche conforme o vídeo avança.

### Requisitos técnicos do vídeo

- MP4/H.264 como base e WebM quando vantajoso;
- `muted` e `playsinline`;
- primeiro frame disponível como poster;
- arquivo com início rápido e intervalos curtos entre keyframes para scrub mais preciso;
- carregamento do vídeo depois dos recursos essenciais;
- versão vertical ou recorte específico para celular;
- imagem estática elegante para conexão lenta;
- sem áudio automático;
- opção de movimento reduzido;
- evitar vídeo pesado e canvas complexo atuando simultaneamente no hero.

### Comportamento em celular

No celular, a experiência deve ser mais curta e leve:

- hero entre 180 e 240vh;
- menos pontos de sincronização;
- poster imediato;
- vídeo menor ou sequência simplificada;
- texto sempre legível, independentemente do carregamento;
- movimento nativo, sem suavização excessiva;
- fallback estático para aparelhos de baixa potência ou modo de economia de dados.

---

## 4. Sistema de movimento recomendado

O site deve utilizar quatro famílias de movimento. Isso cria variedade sem perder consistência.

### 4.1. Movimento de narrativa

Usado nas grandes transições:

- vídeo controlado pelo scroll;
- seções sticky;
- mudança gradual de fundo;
- expansão de imagens ou painéis;
- passagem entre capítulos.

### 4.2. Movimento de leitura

Usado para organizar a informação:

- títulos revelados por linha;
- pequenos deslocamentos verticais;
- máscaras de recorte;
- contadores;
- progresso numerado;
- entrada sequencial de listas.

Evitar blur forte. Quando usado, limitar a aproximadamente 4–6 px e desaparecer rapidamente.

### 4.3. Microinterações

Usadas em ações:

- botões com deslocamento magnético muito sutil;
- seta que avança no hover;
- borda luminosa que percorre o CTA;
- cards com profundidade de 2–4 px;
- ícones que respondem à aproximação do cursor;
- pausa de carrossel ao passar o mouse.

### 4.4. Movimento ambiente

Usado para dar vida sem chamar atenção:

- grid com parallax mínimo;
- pontos de conexão em baixa velocidade;
- gradiente luminoso em movimento lento;
- linha de dados percorrendo divisões;
- ruído visual sutil para evitar superfícies excessivamente digitais.

### Regra geral

Em cada tela, escolher **um movimento principal e no máximo dois movimentos secundários**. Se tudo se move, nada parece importante.

---

## 5. Recomendações por área do site

### 5.1. Header e navegação

- Manter o header flutuante, mas reduzir sua densidade visual após o primeiro scroll.
- Criar dois estados: expandido no topo e compacto durante a navegação.
- Em larguras intermediárias, mover os itens para um menu overlay antes que comecem a se apertar.
- Preservar os mesmos nomes e destinos; apenas reorganizar sua apresentação.
- Manter “Fale com a gente” como ação de maior contraste.
- Transformar a navegação lateral em um indicador de capítulos mais fino.
- Ocultar a navegação lateral abaixo de aproximadamente 1440 px ou levá-la para a borda direita.
- Ao abrir o menu, usar uma composição em tela cheia com os mesmos textos, numeração e progresso da página.

### 5.2. “Quem somos”

- Adotar uma composição editorial assimétrica.
- Manter o título e os parágrafos, mas distribuir o conteúdo em duas colunas com ritmos diferentes.
- Deixar os números institucionais em um painel sticky ou em uma régua que entra progressivamente.
- Usar uma grande linha ou forma gráfica que atravesse a seção e conecte os três números.
- Fazer a transição do último frame do vídeo para o fundo claro por meio de uma máscara ou expansão de luz.

### 5.3. “Diferenciais”

Substituir a grade convencional por uma sequência de quatro painéis progressivos.

**Opção recomendada:** cards empilhados com sticky scroll.

- cada diferencial ocupa a maior parte da tela;
- o próximo card sobe e cobre parcialmente o anterior;
- o número 01–04 permanece visível como sistema de progresso;
- a cor de destaque muda entre ciano, azul e violeta;
- o ícone responde levemente ao movimento;
- título e descrição permanecem exatamente iguais;
- no celular, os painéis viram uma pilha vertical normal.

Esse formato torna “Conhecimento em Seguros”, “Flexibilidade”, “Tecnologia” e “Solidez e permanência” capítulos, não apenas caixas.

### 5.4. “Resultados”

- Aumentar muito a escala dos números.
- Revelar uma métrica por vez conforme o scroll, em vez de animar todos os contadores simultaneamente.
- Exibir o valor final no HTML desde o início; a animação apenas representa sua chegada.
- Usar linhas técnicas que conectem os números, sugerindo dados e capacidade operacional.
- Criar contraste mais forte entre o painel azul e os blocos brancos.
- Evitar deixar a seção vazia por muito tempo antes dos números entrarem.

### 5.5. “Serviços”

Transformar a lista em um **sistema de navegação sticky**:

- títulos numerados à esquerda;
- conteúdo ativo à direita;
- uma linha de progresso indica qual serviço está em foco;
- ao rolar, o próximo serviço assume a área principal;
- pequenos diagramas abstratos diferenciam cada item;
- no hover, o item selecionado ganha luz e deslocamento discreto.

Os quatro textos permanecem inalterados. A mudança é apenas na forma de apresentação.

### 5.6. Clientes e parceiros

- Utilizar duas faixas horizontais em velocidades diferentes.
- Preferir logos reais em versão monocromática, quando disponíveis, mantendo os nomes como texto acessível.
- No hover, passar de monocromático para cor ou aumentar contraste.
- Pausar o movimento quando o usuário interagir.
- Incluir degradês laterais para que a faixa entre e saia suavemente.
- Evitar repetição visual excessiva na mesma linha.

### 5.7. Áreas “Em breve”

Como o texto não será removido, transformar esse bloco em uma régua compacta de roadmap:

- faixa horizontal;
- três itens distribuídos;
- linha animada conectando os temas;
- pequenos marcadores de status;
- altura reduzida para não interromper a narrativa principal.

### 5.8. LinkedIn

- Criar um capítulo escuro ou azul intenso de alto contraste.
- Usar um grande `#SomosSistraners` como elemento de fundo.
- Inserir uma composição dinâmica de linhas, retratos ou cards sociais, caso existam imagens autorizadas.
- Fazer o CTA reagir ao cursor.
- Manter todos os textos atuais.

### 5.9. Contato

- Tratar a seção como o encerramento cinematográfico da experiência.
- Usar o título em escala maior.
- Colocar o botão principal como elemento magnético central.
- Exibir telefone, endereço e unidades em uma grade limpa.
- Fazer o background retomar o azul do hero, fechando o ciclo visual.
- Usar uma linha luminosa que percorre o layout até o rodapé.

### 5.10. Rodapé

- Reduzir ruído visual.
- Organizar em uma grade com logo, frase institucional, navegação e dados legais.
- Manter os links, mas diminuir a quantidade de bordas e efeitos.
- Encerrar com um detalhe visual ligado ao grid ou às conexões do hero.

---

## 6. Como adaptar a inspiração do Valiente Brands

### Vale incorporar

- capítulos com forte contraste;
- uso generoso de espaço;
- tipografia em escala;
- revelação de texto por linha;
- vídeos como momentos narrativos;
- menu simples e sempre acessível;
- movimento sincronizado ao scroll;
- variação de composição entre seções;
- indicadores de progresso;
- projetos ou conteúdos apresentados como cenas.

### Não vale copiar literalmente

- paleta vermelha e creme;
- tipografia excessivamente experimental;
- cursor customizado em toda a página;
- distorções que reduzam legibilidade;
- animações longas que escondem conteúdo;
- navegação incomum em celular;
- densidade de vídeos da referência;
- tom visual de estúdio criativo.

### Tradução correta para a Sistran

| Referência | Adaptação para a Sistran |
|---|---|
| Vermelho de alto impacto | Ciano, azul elétrico e violeta controlado |
| Tipografia experimental | Tipografia tecnológica, precisa e altamente legível |
| Distorsão e recortes | Máscaras, linhas de dados e grids |
| Cursor expressivo | Feedback sutil somente em CTAs e cards |
| Vídeos artísticos | Tecnologia, pessoas, processos e dados |
| Layout de portfólio | Narrativa institucional e prova de capacidade |

---

## 7. Acessibilidade e desempenho

Uma experiência dinâmica de alta qualidade precisa continuar utilizável quando os efeitos não estão disponíveis.

### Acessibilidade

- respeitar `prefers-reduced-motion`;
- permitir que todo conteúdo seja lido sem animação;
- nunca depender apenas de cor para indicar estado;
- manter contraste alto sobre o vídeo;
- preservar foco de teclado visível;
- impedir que menus e painéis sticky prendam a navegação;
- não iniciar áudio automaticamente;
- fornecer controles caso exista versão do vídeo com som;
- usar títulos e textos como HTML, não incorporados ao vídeo;
- evitar flashes e mudanças bruscas.

### Desempenho

- carregar primeiro frame e conteúdo principal antes do vídeo completo;
- usar lazy loading nas mídias abaixo da dobra;
- limitar simultaneamente vídeo, blur, partículas e sombras grandes;
- animar principalmente `transform`, `opacity` e máscaras simples;
- evitar vários efeitos de backdrop blur sobrepostos;
- pausar vídeos fora da área visível;
- reduzir a quantidade de partículas no celular;
- testar aparelhos intermediários, não apenas computadores de alto desempenho;
- garantir que o conteúdo final apareça mesmo se o JavaScript falhar.

---

## 8. Prioridades de implementação

### Prioridade 1 — impacto imediato

1. Hero com vídeo controlado pelo scroll.
2. Nova transição do hero para “Quem somos”.
3. Correção do header em larguras intermediárias.
4. Redução do blur e ajuste do tempo das animações atuais.
5. Reposicionamento ou ocultação responsiva da navegação lateral.

### Prioridade 2 — diferenciação

1. Diferenciais em cards sticky empilhados.
2. Serviços em narrativa sticky.
3. Resultados com números em grande escala.
4. Transições coerentes entre fundos escuros e claros.
5. Sistema único de linhas, grids e dados em movimento.

### Prioridade 3 — acabamento

1. Microinterações de botões e links.
2. Faixas de clientes refinadas.
3. LinkedIn com composição mais editorial.
4. Encerramento de contato mais cinematográfico.
5. Menu overlay e refinamento do rodapé.

---

## 9. Ordem recomendada do projeto

### Etapa 1 — direção de arte

- definir frames-chave do hero;
- definir regras de cor, luz, grid e profundidade;
- escolher o comportamento tipográfico;
- validar uma cena escura e uma cena clara.

### Etapa 2 — protótipo de movimento

- implementar somente hero, “Quem somos” e transição;
- testar scroll rápido, lento e reverso;
- validar desktop, notebook e celular;
- validar a versão com movimento reduzido.

### Etapa 3 — sistema das seções

- aplicar cards sticky em “Diferenciais”;
- aplicar navegação sticky em “Serviços”;
- reconstruir a apresentação de “Resultados”;
- padronizar tempos, curvas e distâncias.

### Etapa 4 — refinamento e otimização

- ajustar microinterações;
- otimizar vídeo e imagens;
- testar acessibilidade;
- medir fluidez em dispositivos intermediários;
- revisar o comportamento em conexões lentas.

---

## 10. Checklist de aprovação visual

- [ ] O texto permanece exatamente igual ao conteúdo atual.
- [ ] O hero comunica a empresa antes de impressionar com o efeito.
- [ ] O vídeo responde ao scroll sem travamentos.
- [ ] O primeiro frame aparece rapidamente.
- [ ] O título continua legível em todos os frames.
- [ ] A navegação funciona em 1280 px sem colisões.
- [ ] A navegação lateral não sobrepõe títulos.
- [ ] Cada tela possui apenas um movimento dominante.
- [ ] Nenhum conteúdo fica invisível por tempo excessivo.
- [ ] As seções claras e escuras parecem conectadas.
- [ ] Os números finais aparecem mesmo sem animação.
- [ ] O celular recebe uma versão mais leve.
- [ ] A experiência funciona com movimento reduzido.
- [ ] O site mantém aparência corporativa e confiável.
- [ ] A inspiração da referência foi adaptada, não copiada.

---

## 11. Resultado esperado

Com essas mudanças, o site deixará de ser apenas uma landing page institucional bem animada e passará a funcionar como uma **apresentação digital guiada pelo usuário**. O vídeo cria o primeiro momento memorável; os capítulos seguintes mantêm o ritmo por meio de tipografia, dados, painéis sticky e transições consistentes.

A identidade final deve transmitir três sensações:

1. **Solidez**, pela clareza e organização;
2. **Especialização**, pela linguagem de dados, processos e seguros;
3. **Inovação**, pelo movimento integrado ao conteúdo.

O efeito mais sofisticado será a coerência do conjunto — não a quantidade de animações.
