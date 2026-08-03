# Plano objetivo e prompt de implementação — Redesign Sistran

**Site atual:** https://calm-fudge-59b6aa.netlify.app/  
**Referência de dinamismo:** https://valientebrands.com/  
**Documento complementar:** `auditoria-visual-sistran.md`

Este documento possui duas partes:

1. o que realmente deve ser alterado no site;
2. um prompt completo e reutilizável para executar as mudanças.

---

# Parte 1 — O que realmente deve ser alterado

## 1. Alteração principal: reconstruir a abertura

A abertura atual deve ser transformada em uma apresentação cinematográfica controlada pelo scroll.

### O que fazer

- manter todos os textos atuais do hero;
- substituir o protagonismo do fundo atual por um vídeo em tela cheia;
- manter o vídeo fixo enquanto o usuário percorre uma área de aproximadamente 300–380vh;
- sincronizar o tempo do vídeo com o progresso do scroll;
- revelar título, parágrafo, CTAs e indicadores em etapas;
- criar uma transição contínua entre o último frame do vídeo e a seção “Quem somos”;
- manter grid, luzes e conexões apenas como camadas secundárias;
- criar poster e fallback estático;
- criar uma versão simplificada para celular;
- respeitar a preferência de movimento reduzido.

### O que não fazer

- não colocar o texto dentro do arquivo de vídeo;
- não iniciar áudio automaticamente;
- não usar vídeo pesado, partículas e canvas complexo ao mesmo tempo;
- não impedir que o usuário role livremente;
- não criar uma abertura longa que atrase o acesso ao conteúdo;
- não esconder o título enquanto o vídeo carrega.

---

## 2. Corrigir o header

O header atual funciona em telas grandes, mas fica apertado em larguras próximas de 1280 px.

### Alterações necessárias

- manter todos os nomes e links atuais;
- criar um estado expandido no topo;
- criar um estado compacto após o primeiro scroll;
- reduzir altura, espaçamentos e sombra no estado compacto;
- transformar a navegação em menu overlay antes de ocorrer colisão;
- manter “Fale com a gente” como ação de maior destaque;
- garantir navegação por teclado;
- bloquear corretamente o scroll do fundo quando o menu estiver aberto;
- incluir foco visível e botão de fechar acessível.

### Breakpoints sugeridos

- acima de 1440 px: menu completo;
- entre 1024 e 1439 px: menu compacto ou overlay;
- abaixo de 1024 px: botão de menu;
- abaixo de 768 px: layout móvel simplificado.

Os breakpoints finais devem ser ajustados de acordo com o espaço real dos textos, e não apenas com valores arbitrários.

---

## 3. Ajustar a navegação lateral

A navegação lateral atual começa a competir com os títulos em larguras intermediárias.

### Alterações necessárias

- manter a navegação lateral somente quando houver espaço suficiente;
- ocultá-la abaixo de aproximadamente 1440 px;
- evitar qualquer sobreposição com rótulos e títulos;
- transformar os pontos em uma linha de progresso de capítulos;
- destacar a seção atual;
- atualizar o estado usando o progresso real do scroll;
- disponibilizar nome acessível para cada capítulo;
- não exibir essa navegação no celular.

---

## 4. Reduzir blur e demora nas entradas

Os efeitos atuais deixam alguns conteúdos borrados ou parcialmente invisíveis durante o scroll.

### Alterações necessárias

- limitar blur de entrada a aproximadamente 4–6 px;
- usar duração entre 450 e 750 ms na maioria das entradas;
- iniciar a revelação antes de o conteúdo chegar ao centro da tela;
- impedir que textos importantes permaneçam invisíveis;
- evitar animar cada palavra quando isso não acrescentar significado;
- usar revelação por linha nos grandes títulos;
- usar apenas deslocamento e opacidade em textos menores;
- manter o conteúdo final visível caso o JavaScript falhe;
- desativar movimentos não essenciais em `prefers-reduced-motion`.

---

## 5. Criar um único sistema de movimento

O site deve parar de parecer uma coleção de efeitos independentes.

### Linguagem recomendada

- linhas de dados;
- grid técnico;
- conexões;
- luz ciano;
- profundidade em azul;
- máscaras de recorte;
- progressos numerados;
- pequenas mudanças de escala;
- parallax discreto.

### Regras

- uma animação principal por tela;
- no máximo duas animações secundárias;
- movimentos entre 4 e 24 px para elementos de interface;
- movimentos maiores somente em transições de capítulos;
- usar a mesma curva de aceleração em todo o site;
- não adicionar cursor customizado global;
- aplicar efeitos magnéticos somente em CTAs importantes;
- não usar animação puramente decorativa em todos os cards.

---

## 6. Alterar “Quem somos”

### Alterações necessárias

- preservar título, parágrafos e números;
- substituir a composição centralizada por um layout editorial assimétrico;
- dividir texto e números em duas áreas;
- manter uma das áreas sticky durante parte do scroll;
- conectar os indicadores institucionais por uma linha gráfica;
- usar a chegada da luz do hero como transição para o fundo claro;
- aumentar o espaço negativo;
- limitar a largura dos parágrafos para melhorar a leitura.

---

## 7. Alterar “Diferenciais”

A grade de quatro cards deve ser substituída por uma experiência mais marcante.

### Solução recomendada

Criar quatro cards sticky empilhados.

### Comportamento

- cada card ocupa grande parte da viewport;
- o card seguinte sobe sobre o anterior;
- os números 01–04 permanecem visíveis;
- cada card utiliza uma variação controlada entre ciano, azul e violeta;
- título, descrição e ordem permanecem iguais;
- o ícone reage levemente ao scroll ou hover;
- o progresso da seção fica visível;
- no celular, os cards voltam a ser uma lista vertical sem sticky complexo.

---

## 8. Alterar “Resultados”

### Alterações necessárias

- aumentar a escala visual dos números;
- revelar uma métrica por vez;
- manter os valores finais no HTML;
- usar a animação somente como apresentação;
- não começar todos os valores em zero se isso ocultar a informação;
- organizar as métricas em linhas ou painéis de leitura clara;
- conectar números com linhas técnicas;
- criar contraste mais forte entre superfícies;
- evitar grandes áreas vazias antes da entrada dos dados.

---

## 9. Alterar “Serviços”

### Solução recomendada

Transformar os quatro serviços em uma apresentação sticky.

### Comportamento

- lista numerada na coluna esquerda;
- conteúdo ativo na coluna direita;
- mudança do item ativo conforme o scroll;
- linha de progresso da seção;
- pequeno gráfico abstrato ou ícone para cada serviço;
- hover e foco sincronizados com o estado ativo;
- textos integralmente preservados;
- no celular, usar acordeão acessível ou blocos verticais.

---

## 10. Alterar a área de clientes

### Alterações necessárias

- criar duas faixas horizontais;
- usar velocidades diferentes e lentas;
- pausar no hover e no foco;
- aplicar degradês nas laterais;
- usar logos monocromáticos quando os arquivos estiverem disponíveis;
- manter o nome como texto alternativo ou texto acessível;
- evitar repetição visual excessiva;
- desativar movimento automático quando o usuário preferir movimento reduzido.

---

## 11. Compactar as áreas “Em breve”

### Alterações necessárias

- preservar todos os textos;
- reduzir a altura total do bloco;
- apresentar os itens como uma régua de roadmap;
- conectar os três temas por uma linha;
- usar marcadores de status;
- evitar que esse conteúdo interrompa o fluxo entre clientes e LinkedIn.

---

## 12. Reforçar LinkedIn, contato e rodapé

### LinkedIn

- criar capítulo azul ou escuro;
- usar `#SomosSistraners` como elemento tipográfico de fundo;
- destacar o CTA;
- adicionar movimento ambiente discreto.

### Contato

- aumentar a escala do título;
- destacar o botão principal;
- reorganizar telefone, endereço e unidades em uma grade;
- retomar o azul profundo do hero;
- criar sensação de encerramento da narrativa.

### Rodapé

- simplificar superfícies e bordas;
- manter todos os links atuais;
- organizar logo, navegação, institucional e dados legais;
- utilizar uma última linha gráfica conectada ao sistema visual do site.

---

## 13. Alterações de desempenho e acessibilidade

### Obrigatórias

- manter conteúdo funcional sem animação;
- implementar `prefers-reduced-motion`;
- garantir foco de teclado visível;
- manter contraste sobre todos os frames do vídeo;
- usar `muted` e `playsinline`;
- não iniciar áudio automaticamente;
- fornecer poster;
- carregar mídias abaixo da dobra sob demanda;
- pausar vídeos fora da viewport;
- evitar múltiplos loops de animação;
- animar preferencialmente `transform` e `opacity`;
- evitar mudanças de layout durante o carregamento;
- validar rolagem rápida, lenta e reversa;
- testar celular intermediário e notebook comum.

---

## 14. Ordem real de execução

1. Inventariar e proteger todos os textos, links e rotas.
2. Corrigir header e navegação lateral.
3. Criar tokens e regras globais de movimento.
4. Implementar o novo hero com um poster provisório.
5. Integrar o vídeo definitivo.
6. Construir a transição para “Quem somos”.
7. Refazer “Diferenciais”.
8. Refazer “Resultados”.
9. Refazer “Serviços”.
10. Refinar clientes, “Em breve”, LinkedIn e contato.
11. Simplificar o rodapé.
12. Implementar movimento reduzido e fallbacks.
13. Fazer testes responsivos e de desempenho.
14. Comparar todos os textos e links com a versão original.

---

# Parte 2 — Prompt mestre para executar as alterações

Copie a partir do bloco abaixo e use como instrução para a IA ou equipe responsável pela implementação.

```text
Você é um especialista sênior em direção de arte digital, UX/UI, front-end, motion design e otimização de experiências web.

Sua tarefa é redesenhar e implementar a evolução visual do site da Sistran, usando o projeto existente como base.

SITE ATUAL
https://calm-fudge-59b6aa.netlify.app/

REFERÊNCIA DE DINAMISMO
https://valientebrands.com/

OBJETIVO
Transformar o site atual em uma apresentação digital premium, dinâmica e guiada pelo scroll. A experiência deve transmitir tecnologia, precisão, especialização em seguros, solidez e inovação.

A referência deve ser estudada pelo uso de espaço, tipografia, vídeos, capítulos, transições e ritmo. Não copie sua identidade visual, paleta, tipografia experimental ou linguagem de agência criativa.

REGRA MAIS IMPORTANTE
Não altere, reescreva, resuma, traduza, corrija ou remova nenhum texto do site.

Também preserve:
- nomes das seções;
- ordem das informações;
- números e indicadores;
- links;
- telefones;
- endereços;
- rotas;
- textos alternativos existentes;
- destinos dos CTAs;
- dados institucionais.

Você pode alterar somente:
- layout;
- hierarquia visual;
- espaçamento;
- composição;
- cores dentro da identidade existente;
- tipografia e escalas;
- comportamento responsivo;
- animações;
- transições;
- ícones;
- fundos;
- forma de navegação;
- apresentação das seções.

ANTES DE ALTERAR O CÓDIGO
1. Inspecione a estrutura completa do projeto.
2. Identifique framework, build, roteamento, estilos e bibliotecas de animação já instaladas.
3. Não presuma que o projeto usa determinada tecnologia.
4. Reutilize a biblioteca de animação existente quando ela for adequada.
5. Não adicione duas bibliotecas que resolvam o mesmo problema.
6. Faça um inventário dos textos, links e rotas antes das mudanças.
7. Registre o estado responsivo atual.
8. Identifique componentes reutilizáveis.
9. Identifique canvas, partículas, animações contínuas e possíveis custos de desempenho.
10. Preserve o comportamento funcional existente.

NÃO ENTREGUE APENAS UMA PROPOSTA
Implemente as alterações no código, execute o projeto, valide visualmente e corrija os problemas encontrados.

DIREÇÃO DE ARTE
Mantenha a base de azul profundo, branco, ciano e violeta já existente.

A linguagem visual deve ser:
- tecnológica;
- precisa;
- corporativa;
- sofisticada;
- segura;
- humana;
- limpa;
- cinematográfica sem ser exagerada.

Use como elementos recorrentes:
- grid técnico;
- linhas de dados;
- conexões;
- luz ciano;
- profundidade em azul;
- máscaras;
- progressos numerados;
- grandes áreas de respiro;
- tipografia em escala;
- transições entre escuro e claro.

Evite:
- excesso de glassmorphism;
- muitos gradientes competindo;
- blur forte;
- partículas em excesso;
- animação em cada elemento;
- cursor customizado global;
- distorções que prejudiquem a leitura;
- efeitos que escondam conteúdo;
- aparência genérica de template corporativo;
- cópia visual direta do site de referência.

SISTEMA DE MOVIMENTO
Crie tokens ou constantes para:
- duração rápida;
- duração padrão;
- duração de capítulo;
- curva de aceleração;
- deslocamento curto;
- deslocamento médio;
- stagger;
- blur máximo;
- intensidade de parallax.

Use uma animação principal por viewport e no máximo duas secundárias.

Para textos:
- revele grandes títulos por linha ou máscara;
- use deslocamento e opacidade em parágrafos;
- limite blur de entrada a 4–6 px;
- use duração entre 450 e 750 ms na maioria dos elementos;
- nunca mantenha conteúdo importante invisível por tempo excessivo.

NOVO HERO COM VÍDEO CONTROLADO PELO SCROLL
Reconstrua a abertura como um componente isolado e reutilizável.

Requisitos:
- área total entre 300 e 380vh no desktop;
- cena interna sticky de 100svh;
- vídeo cobrindo a viewport;
- sincronização entre scroll e currentTime do vídeo;
- interpolação suave;
- suporte ao scroll reverso;
- poster exibido imediatamente;
- overlay de contraste;
- textos em HTML sobre o vídeo;
- grid e luzes como camadas secundárias;
- indicador de progresso;
- nenhum áudio automático;
- vídeo muted e playsinline;
- fallback estático;
- versão móvel simplificada;
- suporte a prefers-reduced-motion.

Linha narrativa:
- 0–15%: atmosfera inicial, grid e identificação institucional;
- 15–40%: entrada do título atual por linhas;
- 40–65%: evolução da cena e ênfase visual já existente;
- 65–82%: entrada do parágrafo e CTAs atuais;
- 82–100%: entrada dos indicadores e transição para “Quem somos”.

Não coloque textos dentro do vídeo.

Se o arquivo de vídeo definitivo não estiver disponível:
- não invente um vídeo genérico;
- crie o componente completo;
- utilize poster ou placeholder visual elegante;
- deixe uma propriedade clara para receber MP4/WebM;
- documente formato, proporção e tamanho esperados;
- garanta que o restante da implementação possa ser validado.

Evite executar simultaneamente vídeo pesado, canvas complexo, partículas densas e vários filtros de blur.

TRANSIÇÃO DO HERO
O último estado do hero deve se transformar visualmente na seção “Quem somos”.

Use:
- expansão de luz;
- máscara vertical ou diagonal suave;
- continuação de uma linha do grid;
- interpolação de cor;
- mudança progressiva de contraste.

Não use corte seco.

HEADER
Mantenha todos os textos e links.

Implemente:
- estado expandido no topo;
- estado compacto após scroll;
- fundo e sombra mais discretos no estado compacto;
- CTA “Fale com a gente” em destaque;
- menu overlay em larguras que não comportem todos os textos;
- botão de menu acessível;
- fechamento por botão e tecla Escape;
- foco de teclado;
- controle correto do scroll de fundo;
- navegação móvel clara.

Não permita colisão entre itens em 1280 px.

NAVEGAÇÃO DE CAPÍTULOS
Refine a navegação lateral:
- mostrar apenas em telas muito amplas;
- ocultar abaixo de aproximadamente 1440 px;
- destacar a seção atual;
- mostrar progresso;
- impedir sobreposição com títulos;
- não mostrar no celular.

SEÇÃO “QUEM SOMOS”
Preserve todos os textos.

Altere a apresentação para:
- layout editorial assimétrico;
- texto em coluna de leitura confortável;
- números institucionais em painel ou régua;
- elemento sticky somente quando houver espaço;
- linha gráfica conectando os indicadores;
- bastante espaço negativo;
- transição direta do hero.

SEÇÃO “DIFERENCIAIS”
Substitua a grade atual por quatro cards sticky empilhados.

Requisitos:
- ordem e textos preservados;
- um card dominante por etapa;
- números 01–04 visíveis;
- progressão entre ciano, azul e violeta;
- pequena resposta de ícone;
- progresso da seção;
- experiência móvel como lista vertical simples;
- nenhum sticky que prenda ou quebre a rolagem.

SEÇÃO “RESULTADOS”
Refaça a hierarquia visual:
- números em escala grande;
- uma métrica revelada por vez;
- valores finais presentes no HTML;
- contagem apenas como efeito;
- linhas técnicas conectando métricas;
- contraste claro;
- fallback sem animação;
- nenhuma métrica deve permanecer como zero por falha de gatilho.

SEÇÃO “SERVIÇOS”
Crie uma apresentação sticky:
- lista numerada à esquerda;
- conteúdo ativo à direita;
- item ativo atualizado pelo scroll;
- progresso visível;
- pequeno elemento gráfico por serviço;
- suporte a hover, foco e teclado;
- textos preservados;
- no celular, usar acordeão acessível ou blocos verticais.

CLIENTES E PARCEIROS
Implemente:
- duas faixas horizontais lentas;
- velocidades diferentes;
- pausa no hover e foco;
- degradês laterais;
- movimento reduzido;
- logos monocromáticos quando os assets existirem;
- nomes acessíveis;
- nenhuma duplicação confusa para leitores de tela.

ÁREAS “EM BREVE”
Preserve os textos e transforme o bloco em uma régua compacta de roadmap.

Use:
- linha horizontal;
- marcadores;
- três itens distribuídos;
- animação curta de progresso;
- altura reduzida.

LINKEDIN
Crie um capítulo escuro ou azul intenso.

Use:
- #SomosSistraners em escala de fundo;
- CTA em destaque;
- movimento ambiente lento;
- composição editorial;
- conteúdo atual preservado.

CONTATO
Crie um encerramento de alto impacto:
- título maior;
- botão principal com resposta magnética sutil;
- telefone, endereço e unidades em grade;
- retorno ao azul profundo;
- linha visual conectada ao rodapé;
- todos os dados atuais preservados.

RODAPÉ
Simplifique:
- menos bordas e superfícies;
- grade clara;
- logo;
- frase institucional;
- navegação;
- institucional;
- dados legais;
- links existentes preservados.

RESPONSIVIDADE
Valide no mínimo:
- 1440 × 900;
- 1280 × 720;
- 1024 × 768;
- 768 × 1024;
- 390 × 844.

Em telas menores:
- reduzir amplitude das animações;
- remover sticky complexo quando necessário;
- usar vídeo menor ou poster;
- manter texto imediatamente disponível;
- usar rolagem nativa;
- não aplicar smooth scroll agressivo;
- preservar áreas mínimas de toque;
- impedir overflow horizontal.

ACESSIBILIDADE
Implemente:
- prefers-reduced-motion;
- foco visível;
- navegação por teclado;
- contraste adequado;
- sem áudio automático;
- conteúdo independente das animações;
- sem flashes;
- nomes acessíveis;
- ordem de foco coerente;
- menus com estados ARIA apropriados;
- fallbacks quando JavaScript ou vídeo falharem.

DESEMPENHO
Otimize:
- poster e primeiro frame;
- carregamento de vídeo;
- lazy loading;
- pausa de mídia fora da viewport;
- quantidade de partículas;
- filtros;
- sombras;
- animações contínuas;
- tamanho de assets;
- mudanças de layout;
- listeners de scroll.

Use requestAnimationFrame ou a infraestrutura da biblioteca existente.
Não atualize o DOM desnecessariamente a cada evento de scroll.
Não mantenha múltiplas timelines concorrendo pelo mesmo elemento.

VALIDAÇÃO OBRIGATÓRIA
Depois de implementar:
1. Execute build, lint e testes existentes.
2. Abra o site e faça inspeção visual real.
3. Teste scroll lento, rápido e reverso.
4. Teste resize.
5. Teste teclado.
6. Teste prefers-reduced-motion.
7. Teste falha ou ausência do vídeo.
8. Teste as cinco resoluções informadas.
9. Verifique se há overflow horizontal.
10. Verifique se o header não colide em 1280 px.
11. Verifique se a navegação lateral não sobrepõe títulos.
12. Compare textos, links e rotas com o inventário inicial.
13. Confirme que nenhum texto foi alterado.
14. Corrija os problemas encontrados antes de concluir.

CRITÉRIOS DE ACEITAÇÃO
- O texto do site é idêntico ao original.
- Links e rotas continuam funcionando.
- O hero responde ao scroll em ambas as direções.
- O conteúdo aparece mesmo sem vídeo.
- O título permanece legível sobre todos os frames.
- Não há áudio automático.
- O header funciona sem colisão.
- Não há sobreposição da navegação lateral.
- Os números finais aparecem sem depender da animação.
- O celular recebe uma experiência mais leve.
- O site funciona com prefers-reduced-motion.
- Não existe overflow horizontal.
- As transições parecem parte de um único sistema.
- A identidade continua corporativa e ligada ao mercado de seguros.
- A referência foi interpretada, não copiada.

ENTREGÁVEIS
Ao finalizar, informe:
- arquivos alterados;
- componentes criados;
- bibliotecas reutilizadas ou adicionadas;
- como inserir ou substituir o vídeo;
- comportamento do fallback;
- decisões de responsividade;
- decisões de acessibilidade;
- testes executados;
- resultados de build e lint;
- limitações restantes;
- comparação confirmando que os textos foram preservados.

COMECE AGORA
Inspecione o projeto antes de editar, crie um plano curto, implemente em etapas, valide cada etapa e entregue o redesign funcional. Não pare em wireframes, recomendações ou pseudocódigo.
```

---

# Parte 3 — Informações que devem acompanhar o prompt

Para obter uma implementação completa, forneça também:

- repositório ou pasta com o código-fonte;
- arquivo de vídeo definitivo;
- poster do vídeo;
- versão móvel do vídeo, se existir;
- logos dos clientes em SVG ou PNG;
- fontes oficiais;
- guia de marca;
- credenciais ou variáveis de ambiente necessárias;
- instrução de build e deploy;
- confirmação de quais páginas internas também serão alteradas.

## Caso o vídeo ainda não exista

Solicite primeiro:

1. storyboard com 5–8 frames;
2. definição do último frame conectado a “Quem somos”;
3. vídeo desktop em 16:9;
4. vídeo móvel em 9:16 ou 4:5;
5. poster desktop;
6. poster móvel;
7. versões comprimidas;
8. arquivo master para futuras conversões.

O desenvolvimento do componente pode começar com poster e placeholder, mas a validação final do ritmo só deve acontecer com o vídeo definitivo.

