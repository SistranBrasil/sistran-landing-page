Prompt para Claude Code — Obter arquivos e implementar o redesign da Sistran

## Antes de usar

Preencha, no próprio prompt, pelo menos o campo `REPO_URL`.

O endereço publicado no Netlify não contém necessariamente o código-fonte editável. Para o Claude obter os arquivos corretos, forneça:

- URL do repositório Git; ou
- pasta local em que o projeto já está salvo; ou
- acesso ao projeto original do Netlify/Git conectado.

Se os vídeos ainda não existirem, o Claude deverá preparar toda a integração usando poster e placeholder, sem inventar um vídeo genérico.

---

## Informações do projeto

Substitua os campos entre `< >` antes de enviar:

```text
REPO_URL=<COLE_AQUI_A_URL_DO_REPOSITORIO>
BRANCH_ORIGEM=<main_ou_nome_da_branch>
PASTA_LOCAL=<DEIXE_VAZIO_SE_O_PROJETO_AINDA_NAO_ESTIVER_BAIXADO>

VIDEO_DESKTOP=<CAMINHO_OU_URL_DO_VIDEO_16_9_OU_DEIXE_VAZIO>
VIDEO_MOBILE=<CAMINHO_OU_URL_DO_VIDEO_VERTICAL_OU_DEIXE_VAZIO>
POSTER_DESKTOP=<CAMINHO_OU_URL_DO_POSTER_OU_DEIXE_VAZIO>
POSTER_MOBILE=<CAMINHO_OU_URL_DO_POSTER_OU_DEIXE_VAZIO>

SITE_ATUAL=https://calm-fudge-59b6aa.netlify.app/
SITE_REFERENCIA=https://valientebrands.com/
```

---

## Prompt pronto para colar no Claude Code

```text
Você está atuando como engenheiro front-end sênior, especialista em UX/UI, direção de arte digital, motion design, acessibilidade e desempenho.

Sua missão é obter os arquivos-fonte do site da Sistran, preservar o trabalho existente e implementar o redesign visual e dinâmico especificado neste prompt.



DOCUMENTOS DE ESPECIFICAÇÃO
Procure os arquivos pelos nomes:

- auditoria-visual-sistran.md
- prompt-implementacao-redesign-sistran.md

Se ainda assim não encontrá-los, avise que os dois documentos precisam ser copiados para o repositório antes da implementação. Não finja que os leu.

RESULTADO ESPERADO

Entregar o site funcionando com:

- hero cinematográfico controlado pelo scroll;
- suporte para vídeo desktop e móvel;
- poster e fallback quando o vídeo não estiver disponível;
- textos atuais integralmente preservados;
- header responsivo sem colisões;
- navegação lateral sem sobreposição;
- sistema consistente de animações;
- seção “Quem somos” editorial;
- “Diferenciais” em cards sticky empilhados;
- “Resultados” com números em grande escala;
- “Serviços” com apresentação sticky;
- clientes em faixas refinadas;
- áreas “Em breve” compactadas;
- LinkedIn e contato com maior impacto;
- rodapé simplificado;
- acessibilidade;
- movimento reduzido;
- bom desempenho;
- experiência móvel simplificada.

REGRA INEGOCIÁVEL

Não altere, reescreva, resuma, traduza, corrija ou remova nenhum texto existente.

Preserve também:

- links;
- rotas;
- telefones;
- endereços;
- números;
- nomes de clientes;
- dados institucionais;
- nomes de seções;
- destinos dos CTAs;
- textos alternativos;
- metadados importantes;
- comportamento funcional existente que não faça parte do redesign.

Você pode alterar apenas a apresentação:

- layout;
- hierarquia;
- espaçamento;
- tipografia;
- escalas;
- cores dentro da identidade;
- componentes visuais;
- fundos;
- animações;
- transições;
- comportamento responsivo;
- navegação visual;
- ícones;
- composição das seções.

FASE 1 — LOCALIZAR OU OBTER O CÓDIGO

1. Verifique o diretório atual.
2. Procure por:
   - .git;
   - package.json;
   - arquivos de lock;
   - arquivos de configuração;
   - diretórios src, app, pages ou components.
3. Se PASTA_LOCAL estiver preenchida, abra e inspecione essa pasta.
4. Se já existir um repositório Git válido, não faça um novo clone.
5. Se não existir um projeto local e REPO_URL estiver preenchido, clone o repositório em uma pasta chamada sistran-site.
6. Se não existir projeto local e REPO_URL estiver vazio, pare e faça uma única pergunta: “Qual é a URL do repositório ou a pasta local que contém o código-fonte do site?”
7. Não tente reconstruir o projeto copiando o HTML compilado do Netlify.
8. Não trate o JavaScript minificado do site publicado como código-fonte.
9. Não baixe assets de terceiros sem confirmar licenças e propriedade.

FASE 2 — PROTEGER O TRABALHO EXISTENTE

Antes de atualizar ou editar:

1. Execute git status.
2. Identifique branch e remote atuais.
3. Liste alterações locais.
4. Não descarte, sobrescreva, reverta ou faça stash automático de alterações existentes.
5. Não use git reset --hard.
6. Não use checkout para apagar arquivos alterados.
7. Se o repositório estiver limpo:
   - faça fetch do remote;
   - atualize BRANCH_ORIGEM usando somente fast-forward;
   - crie uma nova branch chamada redesign/scroll-video-sistran.
8. Se o repositório estiver sujo:
   - preserve todas as alterações;
   - analise se elas conflitam com o trabalho;
   - se houver conflito material, pare e explique exatamente quais arquivos impedem a atualização;
   - não tome uma decisão destrutiva.
9. Não faça push, merge, deploy ou publicação sem autorização explícita.

FASE 3 — ENTENDER O PROJETO

Antes de modificar:

1. Identifique framework e versão.
2. Identifique gerenciador de pacotes pelo lockfile.
3. Identifique biblioteca de estilos.
4. Identifique biblioteca de animação já instalada.
5. Identifique roteamento.
6. Identifique componentes reutilizáveis.
7. Identifique estrutura do hero atual.
8. Identifique canvas, partículas e animações contínuas.
9. Identifique breakpoints.
10. Identifique como o site é construído e publicado.
11. Execute o projeto atual.
12. Faça uma inspeção visual antes de editar.
13. Registre erros existentes separadamente.

Não presuma que o site usa React, Next.js, Tailwind ou GSAP. Confirme no código.

Não adicione uma segunda biblioteca para resolver algo que a biblioteca existente já faz.

FASE 4 — PROTEGER OS TEXTOS

Antes das alterações:

1. Faça um inventário de todos os textos visíveis.
2. Faça um inventário de links, hrefs, rotas e CTAs.
3. Salve esse inventário em um arquivo de verificação dentro de work, temp ou diretório equivalente que não seja publicado.
4. Use o inventário ao final para confirmar igualdade.
5. Não inclua textos duplicados de carrosséis infinitos como alterações de conteúdo.

FASE 5 — CRIAR UM PLANO CURTO

Depois da inspeção, apresente:

- estrutura encontrada;
- arquivos principais;
- biblioteca de animação;
- estratégia do hero;
- estratégia responsiva;
- riscos;
- ordem de implementação.

O plano deve ser curto e acionável.

Depois de apresentar o plano, comece a implementação. Não espere nova confirmação para alterações locais normais dentro do escopo.

FASE 6 — IMPLEMENTAR O SISTEMA VISUAL

Mantenha:

- azul profundo;
- branco;
- ciano;
- violeta em uso controlado;
- grid técnico;
- linguagem tecnológica;
- sensação de confiança e precisão.

Crie tokens ou constantes para:

- duração rápida;
- duração padrão;
- duração de capítulos;
- curva de aceleração;
- stagger;
- deslocamentos;
- blur máximo;
- intensidade de parallax;
- cores de superfícies;
- contraste de overlays.

Regras:

- uma animação principal por viewport;
- no máximo duas animações secundárias;
- não animar todos os elementos;
- não usar blur forte;
- não usar cursor customizado global;
- não copiar a identidade vermelha e creme da referência;
- não transformar o site em portfólio de agência;
- manter aparência corporativa e especializada em seguros.

FASE 7 — IMPLEMENTAR O HERO COM VÍDEO

Crie um componente isolado para o hero.

No desktop:

- wrapper com aproximadamente 300–380vh;
- cena sticky com 100svh;
- vídeo em tela cheia;
- object-fit cover;
- progresso do scroll controlando currentTime;
- interpolação suave;
- funcionamento no scroll reverso;
- poster imediato;
- overlay que garanta contraste;
- texto em HTML;
- indicador de progresso;
- transição para “Quem somos”.

Sequência:

- 0–15%: atmosfera, grid e identificação institucional;
- 15–40%: título atual revelado por linhas;
- 40–65%: evolução visual do vídeo;
- 65–82%: parágrafo e CTAs atuais;
- 82–100%: indicadores atuais e transição para a próxima seção.

No celular:

- reduzir a duração;
- usar aproximadamente 180–240vh;
- usar VIDEO_MOBILE quando fornecido;
- utilizar POSTER_MOBILE como fallback;
- diminuir efeitos;
- usar rolagem nativa;
- não bloquear o usuário;
- priorizar carregamento e leitura.

Se os vídeos não forem fornecidos:

- não use vídeo de banco genérico;
- não baixe um vídeo aleatório;
- implemente toda a estrutura;
- use poster ou placeholder abstrato dentro da identidade;
- deixe propriedades e documentação para inserir MP4/WebM;
- mantenha o hero funcional e visualmente correto;
- informe exatamente onde colocar os arquivos.

O texto não pode ser incorporado ao vídeo.

Não iniciar áudio automaticamente.

Use muted e playsinline.

Implemente prefers-reduced-motion:

- sem scrub;
- poster estático;
- textos visíveis;
- transição simples.

FASE 8 — IMPLEMENTAR AS SEÇÕES

HEADER

- estado expandido;
- estado compacto após scroll;
- CTA preservado;
- nenhuma colisão em 1280 px;
- menu overlay quando necessário;
- foco visível;
- Escape fecha o menu;
- fundo não rola com menu aberto;
- ARIA correto.

NAVEGAÇÃO LATERAL

- somente em telas amplas;
- ocultar abaixo de aproximadamente 1440 px;
- indicar seção atual;
- não sobrepor títulos;
- não exibir no celular.

QUEM SOMOS

- layout editorial assimétrico;
- textos preservados;
- números em painel ou régua;
- linha conectando indicadores;
- espaço negativo;
- transição contínua do hero.

DIFERENCIAIS

- quatro cards sticky empilhados;
- textos e ordem preservados;
- números 01–04;
- progresso visível;
- variação ciano, azul e violeta;
- mobile em lista vertical;
- sem travar a rolagem.

RESULTADOS

- números grandes;
- uma métrica por etapa;
- valor final existente no HTML;
- nenhum zero permanente;
- fallback sem animação;
- linhas técnicas conectando dados.

SERVIÇOS

- lista numerada à esquerda;
- conteúdo ativo à direita;
- controle pelo scroll;
- progresso;
- foco e teclado;
- mobile em acordeão acessível ou blocos verticais.

CLIENTES

- duas faixas lentas;
- velocidades diferentes;
- pausa no hover e foco;
- degradês laterais;
- nomes acessíveis;
- reduzir movimento;
- não duplicar conteúdo para leitores de tela.

EM BREVE

- régua compacta de roadmap;
- textos preservados;
- linha;
- marcadores;
- altura reduzida.

LINKEDIN

- capítulo azul ou escuro;
- #SomosSistraners como elemento de fundo;
- CTA atual em destaque;
- movimento ambiente lento.

CONTATO

- título em maior escala;
- CTA principal com magnetismo sutil;
- telefone, endereço e unidades em grid;
- fechamento visual conectado ao hero.

RODAPÉ

- simplificar;
- manter todos os links;
- organizar logo, navegação, institucional e dados legais;
- reduzir bordas e efeitos.

FASE 9 — ACESSIBILIDADE E DESEMPENHO

Implemente:

- prefers-reduced-motion;
- foco visível;
- navegação por teclado;
- contraste adequado;
- fallback sem vídeo;
- conteúdo independente de JavaScript;
- nenhum áudio automático;
- lazy loading;
- poster;
- pausa de vídeo fora da viewport;
- prevenção de overflow horizontal;
- prevenção de layout shift;
- animação preferencial de transform e opacity;
- listeners de scroll eficientes;
- limpeza de timelines e listeners;
- pausa de animações quando a aba estiver inativa, quando aplicável.

Não execute simultaneamente:

- vídeo pesado;
- canvas complexo;
- partículas densas;
- vários filtros de blur;
- múltiplas timelines concorrendo pelo mesmo elemento.

FASE 10 — TESTAR

Execute:

- instalação de dependências pelo gerenciador correto;
- lint;
- testes existentes;
- build de produção;
- verificação visual real.

Teste no mínimo:

- 1440 × 900;
- 1280 × 720;
- 1024 × 768;
- 768 × 1024;
- 390 × 844.

Teste também:

- scroll lento;
- scroll rápido;
- scroll reverso;
- resize;
- teclado;
- menu;
- prefers-reduced-motion;
- vídeo ausente;
- vídeo com carregamento lento;
- links e CTAs;
- rotas;
- overflow horizontal;
- números sem animação.

Compare o inventário final com o inicial.

Se algum texto, link ou rota tiver sido alterado acidentalmente, corrija antes de concluir.

FASE 11 — DOCUMENTAR

Crie uma documentação curta contendo:

- arquivos alterados;
- componentes criados;
- biblioteca de animação utilizada;
- como inserir o vídeo desktop;
- como inserir o vídeo móvel;
- como inserir posters;
- formato recomendado dos arquivos;
- fallbacks;
- breakpoints;
- comportamento de movimento reduzido;
- testes executados;
- resultados do build;
- limitações restantes.

NÃO EXECUTAR SEM AUTORIZAÇÃO

- push;
- merge;
- deploy;
- publicação no Netlify;
- alteração de DNS;
- mudança de variáveis de produção;
- remoção de arquivos do usuário;
- descarte de alterações existentes.

CRITÉRIOS PARA CONSIDERAR O TRABALHO CONCLUÍDO

- código-fonte correto foi obtido;
- alterações existentes foram preservadas;
- branch de trabalho foi criada;
- todos os textos permanecem idênticos;
- links e rotas continuam funcionando;
- hero funciona com scroll direto e reverso;
- fallback funciona sem vídeo;
- header não colide em 1280 px;
- navegação lateral não sobrepõe conteúdo;
- celular possui versão mais leve;
- prefers-reduced-motion funciona;
- números finais aparecem sem depender da animação;
- não existe overflow horizontal;
- build é concluído;
- testes relevantes são concluídos;
- inspeção visual é feita;
- documentação é entregue.

COMECE AGORA

Primeiro localize ou obtenha o código com segurança. Depois leia os dois documentos, inventarie o conteúdo, apresente o plano curto e implemente o redesign completo.
```