Prompt para implementação do SDS no site institucional da Sistran

Objetivo

Analise o projeto existente do site institucional da Sistran e implemente a apresentação do SDS — Sistema Digital de Sinistros em dois pontos:

Na página de soluções: https://sistran-landing-page.vercel.app/solucoes;

Em uma nova página interna dedicada ao produto, preferencialmente na rota /solucoes/sds.

Use como fonte de conteúdo e referência funcional a página atual do SDS:

https://sds-landing-page-six.vercel.app/

A implementação deve respeitar o design system, a linguagem visual, a arquitetura de componentes, as animações, a responsividade e os padrões de acessibilidade já existentes no site institucional da Sistran.

Premissa obrigatória: SDS e Fast são soluções independentes

O Fast não faz parte do SDS. São soluções diferentes e devem continuar aparecendo separadamente.

Não apresente o Fast como módulo, etapa, tecnologia interna, evolução ou componente do SDS. Também não apresente o SDS como substituto do Fast.

Para evitar que as soluções pareçam duplicadas, preserve esta distinção editorial:

Fast: solução de automação e aceleração de processos específicos de sinistros, com foco em eficiência operacional, validações, redução de erros, conformidade, integração e monitoramento.

SDS: plataforma que estrutura e conduz a jornada completa do sinistro, do comunicado à regulação, combinando regras de negócio, agentes especializados, análise documental, apoio antifraude, rastreabilidade e governança humana.

Não altere a página ou o conteúdo do Fast nesta implementação, exceto se for indispensável para corrigir algum conflito visual causado pela inclusão do novo card. O card do SDS deve possuir identidade e mensagem próprias.

Diretrizes gerais de implementação

Antes de modificar o código, analise a estrutura atual da página /solucoes e das páginas internas existentes, especialmente /solucoes/fast.

Reutilize componentes, tokens, tipografia, espaçamentos, grid, botões, navegação, cabeçalho, rodapé e padrões de movimento existentes.

Não crie um design system paralelo.

Não copie literalmente o visual da landing page independente do SDS. Adapte seu conteúdo à identidade visual do site institucional da Sistran.

Preserve o funcionamento das soluções existentes.

Evite abreviações não explicadas. Na primeira ocorrência, escreva sempre SDS — Sistema Digital de Sinistros.

O termo “regulação agêntica” pode ser utilizado, mas deve ser acompanhado por uma explicação clara sobre agentes especializados de inteligência artificial.

Use linguagem corporativa, objetiva e adequada ao mercado segurador.

A inteligência artificial deve ser apresentada como apoio à operação. Não afirmar que o sistema toma decisões regulatórias ou determina fraude automaticamente.

A responsabilidade e a decisão humana devem estar visíveis ao longo da página.

1. Inclusão na página de Soluções

Posicionamento recomendado

O SDS possui escopo mais amplo do que os aceleradores apresentados na grade atual. Por isso, preferencialmente, crie um card horizontal em destaque antes da grade de soluções existentes.

Esse card pode ocupar toda a largura do container e utilizar uma composição visual que represente a jornada:

Comunicado → Documentos → Análise → Apoio antifraude → Regulação

Se a estrutura atual do projeto não permitir um card destacado sem prejudicar a consistência da seção, inclua o SDS como um novo card na grade, mantendo as mesmas dimensões, interações e comportamento responsivo dos demais cards.

Não remova nem substitua o card do Fast.

Conteúdo final do card

Categoria ou eyebrow

JORNADA INTELIGENTE DE SINISTROS

Título

SDS — Sistema Digital de Sinistros

Descrição principal

Conecta o comunicado, a análise documental, o apoio antifraude e a regulação em uma jornada rastreável, conduzida por agentes especializados e com a decisão humana preservada.

Destaques opcionais

Comunicado inteligente;

Regulação agêntica;

Apoio antifraude.

Chamada para ação

Conheça o SDS →

O link deve direcionar para /solucoes/sds.

Versão reduzida da descrição

Se o card existente não comportar a descrição principal sem prejudicar o layout, use:

Estrutura toda a jornada de sinistros, do primeiro relato ao parecer, combinando regras de negócio, agentes especializados e governança humana.

Direção visual do card

Representar uma jornada contínua, e não apenas uma automação isolada;

Utilizar uma sequência visual de documentos, dados, agentes e decisão;

Destacar “Decisão humana preservada” como selo ou microtexto;

Evitar excesso de textos pequenos;

Evitar ícones genéricos de robô, cérebro ou circuitos desconectados do contexto de seguros;

Utilizar movimento sutil e coerente com os demais componentes do site;

Garantir uma versão estática equivalente para usuários com redução de movimento.

2. Nova página /solucoes/sds

Estrutura de navegação interna

Quando for compatível com o padrão das páginas existentes, disponibilize navegação por âncoras:

Início;

O que é o SDS;

Como funciona;

Pilares;

Agentes;

Governança;

Benefícios;

Integração.

Seção 1 — Hero

Eyebrow

SISTRAN LABS · INTELIGÊNCIA APLICADA A SINISTROS

Título principal

Do comunicado à decisão, uma jornada de sinistros mais inteligente

Descrição

O SDS conecta segurados, documentos, equipes e agentes especializados em uma jornada contínua, rastreável e configurável. A solução estrutura o comunicado, apoia a análise documental, identifica indícios relevantes e prepara a regulação, mantendo as decisões críticas sob responsabilidade humana.

Chamadas para ação

Botão principal: Conheça a jornada — direcionar para a seção “Como funciona”;

Botão secundário: Fale com um especialista — utilizar o destino de contato já adotado no site.

Destaques rápidos

Rastreabilidade ponta a ponta;

Governança humana;

Agentes especializados;

Integração com o ecossistema da seguradora.

Direção visual do hero

Criar uma composição tecnológica e institucional que represente dados e documentos avançando por uma jornada, sendo analisados por diferentes agentes e chegando a uma etapa de decisão humana.

Evitar replicar literalmente o hero da landing page independente. A nova composição deve parecer parte do site institucional da Sistran.

Seção 2 — O que é o SDS?

Título

Uma plataforma para toda a jornada de sinistros

Texto

O Sistema Digital de Sinistros é uma solução da Sistran que combina regras de negócio, inteligência artificial e participação humana para organizar e conduzir o sinistro desde o primeiro relato até o parecer da regulação.

A plataforma transforma documentos e informações não estruturadas em um caso compreendido, preservando o contexto, a origem das evidências e o histórico de cada análise.

Seção 3 — Como funciona

Título

Do comunicado à regulação em oito etapas

Criar uma linha do tempo, fluxo progressivo ou componente de scrollytelling com as oito etapas abaixo. O conteúdo completo deve continuar acessível sem depender de animação.

01. Comunicado

Coleta o relato inicial e identifica a natureza do sinistro.

02. Documentos

Orienta o envio e classifica os documentos necessários.

03. Extração inteligente

Transforma documentos e conteúdos não estruturados em dados utilizáveis.

04. Validação

Cruza informações cadastrais, contratuais e relacionadas à ocorrência.

05. Apoio antifraude

Identifica anomalias e organiza indícios para revisão especializada.

06. Consolidação

Reúne dados, documentos, pendências, histórico e alertas.

07. Protocolo

Formaliza o caso e preserva a rastreabilidade das informações.

08. Regulação

Agentes especializados apoiam a análise e a elaboração do parecer, mantendo a decisão com o regulador.

Seção 4 — Três pilares

Criar três cards, painéis expansíveis ou cenas interativas. Não esconder informações essenciais exclusivamente em hover.

Comunicado inteligente

Conduz o segurado em uma coleta contextual e assistida, antecipando pendências e reduzindo o preenchimento manual e o retrabalho.

Destaques

Contexto da ocorrência preservado;

Documentos classificados;

Pendências identificadas antecipadamente;

Acompanhamento claro da jornada.

Regulação agêntica

Agentes especializados de inteligência artificial analisam contrato, cobertura, consistência, evidências e riscos para preparar um parecer estruturado e fundamentado.

Destaques

Cobertura e vigência verificadas;

Evidências relacionadas ao caso;

Exceções sinalizadas;

Histórico auditável;

Decisão humana preservada.

Apoio antifraude

Analisa documentos em diferentes camadas e apresenta sinais priorizados para apoiar a investigação especializada, sem classificar automaticamente uma ocorrência como fraude.

Destaques

Metadados e estrutura dos arquivos;

Indícios de manipulação;

Inconsistências visuais e tipográficas;

Mapa de calor das regiões suspeitas;

Critérios e evidências registrados.

Seção 5 — Inteligência especializada

Título

Um agente especializado para cada momento da jornada

Texto

Os agentes do SDS possuem responsabilidades definidas e trabalham de forma coordenada. Eles classificam documentos, extraem informações, verificam consistência, identificam lacunas e organizam evidências para que a equipe concentre sua capacidade técnica nos casos que realmente exigem análise e julgamento.

Componente recomendado

Criar uma visualização com o Agente Orquestrador conectado às seguintes capacidades:

Extração de documentos;

Revisão documental;

Validação de informações;

Elegibilidade;

Análise contratual;

Apoio antifraude;

Especialistas da regulação.

A representação deve deixar claro que os agentes apoiam o fluxo e não substituem os profissionais responsáveis.

Seção 6 — Governança humana

Esta seção deve possuir destaque visual e não pode ser tratada como uma observação secundária.

Título

A inteligência artificial apoia. A decisão permanece humana.

Texto

O SDS não substitui o julgamento técnico do regulador. A plataforma organiza informações, executa verificações e apresenta recomendações fundamentadas, permitindo que profissionais avaliem exceções, consultem evidências e assumam a responsabilidade pelas decisões.

Destaques

Evidências vinculadas às conclusões;

Origem dos dados preservada;

Critérios aplicados registrados;

Histórico completo das análises;

Revisão humana nos pontos críticos.

Seção 7 — Benefícios

Título

Impacto em toda a operação de sinistros

Menos esforço operacional

Reduz atividades manuais e repetitivas ao longo da jornada.

Mais velocidade

Acelera o comunicado e antecipa o início da regulação.

Maior qualidade dos dados

Extrai, valida e organiza informações com consistência.

Menos retrabalho

Identifica documentos ausentes e divergências antecipadamente.

Mais segurança

Mantém evidências, critérios e decisões em uma trilha rastreável.

Melhor experiência do segurado

Oferece orientação clara e acompanhamento durante o processo.

Escalabilidade operacional

Permite processar mais casos sem crescimento proporcional da equipe.

Regulação mais consistente

Padroniza verificações e prepara pareceres fundamentados para revisão.

Seção 8 — Integração

Título

Integração com o ecossistema da seguradora

Texto

O SDS pode se conectar aos sistemas já utilizados pela seguradora, incluindo plataformas de apólices, gestão de sinistros, documentos, pagamentos, comunicação e sistemas corporativos.

A arquitetura configurável permite adaptar regras, documentos e etapas de acordo com o produto, a cobertura e o modelo operacional de cada organização.

Não invente nomes de integrações, APIs, certificações ou sistemas que não estejam documentados no projeto.

Seção 9 — Chamada final

Título

Sinistros mais inteligentes começam com uma jornada melhor estruturada

Texto

Conheça como o SDS pode conectar pessoas, documentos, inteligência e decisões em uma operação mais ágil, segura e rastreável.

Botões

Fale com nosso time;

Explore a demonstração do SDS — direcionar para https://sds-landing-page-six.vercel.app/ e abrir de acordo com o padrão de links externos do projeto.

3. Métricas e afirmações quantitativas

A página independente do SDS apresenta indicadores como 70%, 95%, 90% e ganho de produtividade de 3x.

Não publique esses números automaticamente no site institucional.

Somente inclua métricas se houver no repositório ou na documentação do projeto uma fonte aprovada que identifique:

Contexto do resultado;

Ambiente ou projeto em que foi medido;

Período analisado;

Amostra utilizada;

Responsável pela validação.

Se não houver comprovação suficiente, mantenha apenas os benefícios qualitativos descritos neste documento. Não invente percentuais e não transforme projeções em resultados comprovados.

4. Padronização de nomenclatura

Utilize em todo o site:

SDS — Sistema Digital de Sinistros

Não alternar entre “Sistema Digital de Sinistros” e “Solução Digital de Sinistros”.

Depois da primeira ocorrência completa em cada página, a sigla SDS pode ser utilizada isoladamente.

Utilize “inteligência artificial” por extenso na primeira ocorrência relevante. Não presuma que todos os visitantes conhecem os termos “agente”, “agêntico” ou “orquestrador”.

5. SEO e metadados

Título sugerido

SDS — Sistema Digital de Sinistros · Sistran

Meta description sugerida

Conheça o SDS, plataforma da Sistran que conecta comunicado, documentos, apoio antifraude e regulação em uma jornada rastreável, com inteligência artificial e decisão humana.

Estrutura semântica

Apenas um h1;

Títulos de seção em h2;

Cards e capacidades em h3;

Links com textos descritivos;

Imagens e ilustrações com texto alternativo adequado;

Dados estruturados apenas se já houver padrão equivalente no projeto.

6. Responsividade, movimento e acessibilidade

Garantir funcionamento completo em desktop, tablet e dispositivos móveis;

Evitar texto ilegível sobre vídeo ou fundos complexos;

Preservar contraste adequado;

Não depender exclusivamente de cor para indicar estado ou etapa;

Garantir navegação por teclado e foco visível;

Respeitar o mecanismo de preferências de movimento já existente no site;

Em movimento reduzido, mostrar todas as informações em uma composição estática e compreensível;

Não esconder conteúdo essencial em animações, hover ou canvas sem alternativa semântica;

Evitar carrosséis automáticos sem controles de pausa e navegação acessíveis.

7. Requisitos técnicos

Seguir a stack e os padrões já utilizados no repositório;

Preferir componentes existentes a novas dependências;

Não instalar bibliotecas sem necessidade comprovada;

Manter componentes separados por responsabilidade;

Evitar textos duplicados espalhados em vários arquivos quando o projeto possuir uma camada de conteúdo ou configuração;

Otimizar imagens e vídeos conforme o padrão existente;

Fazer carregamento progressivo de mídias pesadas;

Não bloquear a renderização inicial por causa de animações;

Preservar as rotas, links e páginas atuais;

Garantir que o link externo para a demonstração do SDS siga as práticas de segurança do projeto;

Verificar se o projeto possui testes, lint e build configurados e executá-los após a implementação.

8. Critérios de aceite

A implementação será considerada concluída quando:

O SDS estiver visível na página /solucoes;

O card apresentar título, descrição e chamada para ação corretos;

O Fast continuar presente como solução independente;

Nenhum texto sugerir que o Fast faz parte do SDS;

A rota /solucoes/sds estiver implementada e acessível;

A página seguir o design system existente da Sistran;

As oito etapas da jornada estiverem apresentadas;

Comunicado inteligente, regulação agêntica e apoio antifraude estiverem explicados;

A governança e a decisão humana possuírem destaque visual;

A diferença de posicionamento entre SDS e Fast estiver clara;

Não houver métricas sem comprovação;

O conteúdo estiver responsivo e acessível;

O modo de movimento reduzido continuar funcionando;

Cabeçalho, navegação, rodapé e links seguirem o padrão do site;

Não houver regressões nas páginas de soluções existentes;

Lint, testes aplicáveis e build finalizarem com sucesso.

9. Entrega esperada do Claude

Ao concluir:

Informe os arquivos criados e alterados;

Resuma as decisões de layout e os componentes reutilizados;

Explique como o SDS foi diferenciado do Fast;

Liste os testes e verificações executados;

Informe qualquer conteúdo, imagem, métrica ou integração que ainda dependa de validação humana;

Não encerre apenas com recomendações: implemente efetivamente as alterações no código do projeto.