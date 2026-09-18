# Relatório de entregas — time SIS

Levantado em 15/09/2026 a partir do Linear (workspace `sistran-labs`, time `SIS`).
Cobre todas as issues que estavam em **Done** e em **In Review**, com o pedido original, o relatório de entrega
do executor e o veredito da conferência, quando houve.

## Panorama

| Coluna de origem | Issues |
|---|---|
| In Review | 228 |
| Done | 33 |
| **Total** | **261** |

## Ressalvas de leitura

Três coisas que o relatório não pode esconder, porque mudam o peso de cada seção:

**Sem relatório de entrega no Linear (9).** A issue mudou de coluna sem que ninguém escrevesse o que foi feito. Em parte dos casos o trabalho existe e só não foi documentado — a SIS-198 é o exemplo, e a seção dela traz a entrega reconstruída por leitura do código. Em outros, a issue saltou de `Backlog` direto para `In Review` sem passar por `In Progress`, o que indica migração de status em lote, não entrega. Cada seção diz qual é o caso.

> SIS-267, SIS-198, SIS-159, SIS-79, SIS-77, SIS-75, SIS-74, SIS-71, SIS-13

**Nunca entrou em conferência (148 das 228 em In Review).** Pela regra do ciclo SIS, `In Review` sem label `conferir` nem `conferido` significa que a issue nunca foi auditada. É o sinal mais importante do documento: são entregas que ninguém checou contra o código, e tratá-las como fechadas é uma decisão, não um fato.

**Sem comentário de conferência (188).** Recorte mais largo e mais frouxo que o anterior: inclui issues que têm a label mas cujo veredito não foi escrito na issue, e as `Done` fechadas deliberadamente sem auditoria. Serve para achar o rastro que falta, não para julgar a entrega.

## Índice

| Issue | Título | Origem | Labels | Ressalva |
|---|---|---|---|---|
| [SIS-278](#sis-278-site-barra-de-progresso-de-scroll-no-topo-ciano-acima-do-navbar) | Site · barra de progresso de scroll no topo (ciano, acima do navbar) | Done | — | sem comentário de conferência |
| [SIS-272](#sis-272-eventos-inovacao-reveal-on-scroll-docsscrollmd) | /eventos-inovacao · reveal on scroll (docs/scroll.md) | Done | — | sem comentário de conferência |
| [SIS-268](#sis-268-eventos-inovacao-aproximar-ainda-mais-as-previews-do-card-central) | /eventos-inovacao · aproximar ainda mais as previews do card central | Done | — | sem comentário de conferência |
| [SIS-267](#sis-267-arte-logo-picsel-em-alta-qualidade-png-transparente) | Arte · logo Picsel em alta qualidade (PNG + transparente) | Done | — | sem relatório · sem comentário de conferência |
| [SIS-254](#sis-254-esg-social-foguete-do-scroll-foguetepng-substitui-svg-atual) | /esg SOCIAL · foguete do scroll = foguete.png (substitui SVG atual) | Done | — | — |
| [SIS-245](#sis-245-contato-onde-estamos-endereço-pato-branco-sem-link-rj-mapa-azul-mais-claro) | /contato · Onde Estamos: endereço Pato Branco, sem link RJ, mapa azul mais claro | Done | conferir | sem comentário de conferência |
| [SIS-238](#sis-238-quem-somos-premiações-fundo-celepng-layout-escritaslogo-exemplcelent) | /quem-somos · Premiações: fundo cele.png + layout escritas/logo (exemplcelent) | Done | conferir | sem comentário de conferência |
| [SIS-165](#sis-165-números-refazer-a-seção-sistran-em-números-exatamente-como-numerospng) | Números: refazer a seção "Sistran em números" exatamente como numeros.png | Done | — | — |
| [SIS-161](#sis-161-quem-somos-deixar-a-seção-de-escritórios-exatamente-igual-à-referência-mapaescritoriopng) | /quem-somos — deixar a seção de escritórios exatamente igual à referência mapaescritorio.png | Done | — | — |
| [SIS-98](#sis-98-seção-nossa-essência-só-dá-para-ler-parte-da-missão-o-scroll-já-abre-o-próximo-item) | Seção “Nossa essência”: só dá para ler parte da Missão — o scroll já abre o próximo item | Done | — | sem comentário de conferência |
| [SIS-94](#sis-94-hero-de-soluções-serviços-e-consultoria-vídeo-de-fundo-controlado-pelo-scroll) | Hero de Soluções, Serviços e Consultoria: vídeo de fundo controlado pelo scroll | Done | — | sem comentário de conferência |
| [SIS-93](#sis-93-soluções-tecnologia-disruptiva-aplicar-o-mesmo-fundo-azul-claro-da-seção-consultoria) | Soluções / “Tecnologia Disruptiva”: aplicar o mesmo fundo azul claro da seção Consultoria | Done | — | sem comentário de conferência |
| [SIS-92](#sis-92-seção-desafios-no-desenvolvimento-de-software-textos-sobrepostos-entre-etapas) | Seção “Desafios no desenvolvimento de software”: textos sobrepostos entre etapas | Done | — | sem comentário de conferência |
| [SIS-91](#sis-91-faixa-de-logos-de-parceiros-reduzir-a-altura-está-muito-grossa) | Faixa de logos de parceiros: reduzir a altura (está muito grossa) | Done | — | sem comentário de conferência |
| [SIS-90](#sis-90-seção-alta-performance-e-comprometimento-mover-imagem-para-a-esquerda-do-texto-reduzir-o-texto-e-transicionar) | Seção “Alta Performance e Comprometimento”: mover imagem para a esquerda do texto, reduzir o texto e transicionar | Done | — | sem comentário de conferência |
| [SIS-89](#sis-89-tornar-mais-fluida-a-transição-de-staff-augmentation-para-a-seção-dos-números) | Tornar mais fluida a transição de “Staff Augmentation” para a seção dos números | Done | — | sem comentário de conferência |
| [SIS-88](#sis-88-seção-de-contato-na-home-layout-quebrado-título-cortado-pelo-header-bloco-estourando-a-seção) | Seção de contato na home: layout quebrado (título cortado pelo header, bloco estourando a seção) | Done | — | sem comentário de conferência |
| [SIS-87](#sis-87-menu-quem-somos-dropdown-desaparece-ao-tentar-clicar-nos-itens) | Menu “Quem somos”: dropdown desaparece ao tentar clicar nos itens | Done | — | sem comentário de conferência |
| [SIS-49](#sis-49-soluções-de-negócios-retirar-a-legenda-numerada-de-baixo-dos-nós-da-linha) | Soluções de Negócios: retirar a legenda numerada de baixo dos nós da linha | Done | — | sem comentário de conferência |
| [SIS-48](#sis-48-soluções-de-negócios-a-pílula-do-cabeçalho-fica-escondida-atrás-do-header-fixo) | Soluções de Negócios: a pílula do cabeçalho fica escondida atrás do header fixo | Done | — | sem comentário de conferência |
| [SIS-47](#sis-47-soluções-de-negócios-melhorar-o-remate-final-da-linha-de-processo) | Soluções de Negócios: melhorar o remate final da linha de processo | Done | — | sem comentário de conferência |
| [SIS-46](#sis-46-soluções-de-negócios-tirar-os-números-da-navegação-lateral-e-levá-los-para-os-nós-da-linha) | Soluções de Negócios: tirar os números da navegação lateral e levá-los para os nós da linha | Done | — | sem comentário de conferência |
| [SIS-45](#sis-45-soluções-de-negócios-a-linha-de-processo-passa-a-ter-4-nós-um-por-card-e-acende-o-da-etapa) | Soluções de Negócios: a linha de processo passa a ter 4 nós, um por card, e acende o da etapa | Done | — | sem comentário de conferência |
| [SIS-44](#sis-44-soluções-de-negócios-o-convite-ao-scroll-não-está-visível) | Soluções de Negócios: o convite ao scroll não está visível | Done | — | sem comentário de conferência |
| [SIS-43](#sis-43-soluções-de-negócios-retirar-o-botão-veja-mais-do-rodapé-da-seção) | Soluções de Negócios: retirar o botão "Veja mais" do rodapé da seção | Done | — | sem comentário de conferência |
| [SIS-42](#sis-42-soluções-de-negócios-tirar-os-pulinhos-na-troca-de-cena-durante-o-scroll) | Soluções de Negócios: tirar os "pulinhos" na troca de cena durante o scroll | Done | — | sem comentário de conferência |
| [SIS-41](#sis-41-soluções-de-negócios-linha-de-processo-mais-baixa-e-um-convite-ao-scroll-no-palco) | Soluções de Negócios: linha de processo mais baixa e um convite ao scroll no palco | Done | — | sem comentário de conferência |
| [SIS-40](#sis-40-soluções-de-negócios-limpar-o-cartão-tirar-o-selo-ativo-e-o-número-pequeno-acima-do-título) | Soluções de Negócios: limpar o cartão — tirar o selo "Ativo" e o número pequeno acima do título | Done | — | sem comentário de conferência |
| [SIS-39](#sis-39-soluções-de-negócios-diminuir-o-cartão-descritivo-sobre-a-foto) | Soluções de Negócios: diminuir o cartão descritivo sobre a foto | Done | — | sem comentário de conferência |
| [SIS-38](#sis-38-home-o-tile-arquitetura-modular-e-escalável-atravessa-o-scroll-até-virar-a-foto-do-card-01-de-soluções) | Home: o tile "Arquitetura modular e escalável" atravessa o scroll até virar a foto do card 01 de Soluções | Done | — | sem comentário de conferência |
| [SIS-37](#sis-37-soluções-de-negócios-aproximar-a-composição-da-referência-palco-linha-de-processo-e-cartão) | Soluções de Negócios: aproximar a composição da referência (palco, linha de processo e cartão) | Done | — | sem comentário de conferência |
| [SIS-36](#sis-36-soluções-de-negócios-plugar-as-quatro-fotos-e-emendar-com-o-mosaico) | Soluções de Negócios: plugar as quatro fotos e emendar com o mosaico | Done | — | sem comentário de conferência |
| [SIS-33](#sis-33-hero-nascer-do-fio-condutor-e-entregar-o-movimento-para-o-mosaico) | Hero: nascer do fio condutor e entregar o movimento para o mosaico | Done | — | sem comentário de conferência |
| [SIS-277](#sis-277-parceiros-tag-da-abertura-vira-carimbo-parceriaspng-efeito-ao-entrar) | /parceiros · tag da abertura vira carimbo-parcerias.png (efeito ao entrar) | In Review | conferir | sem comentário de conferência |
| [SIS-276](#sis-276-esg-fale-com-a-gente-grafismo-cortadobaixo-demais-no-rodapé) | /esg · Fale com a Gente!: grafismo cortado/baixo demais no rodapé | In Review | conferir | sem comentário de conferência |
| [SIS-275](#sis-275-home-reveal-on-scroll-em-toda-a-página-docsscrollmd) | Home · reveal on scroll em toda a página (docs/scroll.md) | In Review | — | nunca conferida |
| [SIS-274](#sis-274-routeloadgate-fundo-1273bc-logo-hd-no-lugar-de-sistran) | RouteLoadGate · fundo #1273bc + logo HD no lugar de SISTRAN | In Review | conferir | sem comentário de conferência |
| [SIS-273](#sis-273-solucoes-reveal-on-scroll-docsscrollmd) | /solucoes · reveal on scroll (docs/scroll.md) | In Review | — | nunca conferida |
| [SIS-271](#sis-271-esg-reveal-on-scroll-docsscrollmd) | /esg · reveal on scroll (docs/scroll.md) | In Review | — | nunca conferida |
| [SIS-270](#sis-270-trabalhe-conosco-reveal-on-scroll-docsscrollmd) | /trabalhe-conosco · reveal on scroll (docs/scroll.md) | In Review | conferir | sem comentário de conferência |
| [SIS-269](#sis-269-contato-reveal-deve-acompanhar-o-scroll-não-tudo-após-o-load) | /contato · reveal deve acompanhar o scroll (não tudo após o load) | In Review | — | nunca conferida |
| [SIS-266](#sis-266-footer-item-ativo-na-coluna-navegação-conforme-a-página) | Footer · item ativo na coluna Navegação conforme a página | In Review | conferir | sem comentário de conferência |
| [SIS-265](#sis-265-esg-fale-com-a-gente-logo-hd-logosistranaltadefinicaopng) | /esg · Fale com a Gente!: logo HD logosistranaltadefinicao.png | In Review | — | nunca conferida |
| [SIS-264](#sis-264-trabalhe-conosco-tipografia-maior-limpar-copy-do-form-e-faixas) | /trabalhe-conosco · tipografia maior + limpar copy do form e faixas | In Review | — | nunca conferida |
| [SIS-263](#sis-263-contato-reveal-on-scroll-em-toda-a-página-docsscrollmd) | /contato · reveal on scroll em toda a página (docs/scroll.md) | In Review | conferir | sem comentário de conferência |
| [SIS-262](#sis-262-esg-negrito-em-environment-social-governance-nos-títulos) | /esg · negrito em ENVIRONMENT: / SOCIAL: / GOVERNANCE: nos títulos | In Review | — | nunca conferida |
| [SIS-261](#sis-261-esg-seção-intro-layout-da-captura-arte-esg2png-sem-fundo) | /esg · seção intro: layout da captura + arte esg2.png (sem fundo) | In Review | conferir | sem comentário de conferência |
| [SIS-260](#sis-260-contato-números-grade-de-quadradinhos-discretos-igual-à-home) | /contato · números: grade de quadradinhos discretos igual à home | In Review | conferir | sem comentário de conferência |
| [SIS-259](#sis-259-contato-retirar-sombra-branca-entre-logos-e-saiba-mais) | /contato · retirar sombra branca entre logos e «SAIBA MAIS…» | In Review | conferir | sem comentário de conferência |
| [SIS-258](#sis-258-trabalhe-conosco-abertura-igual-a-exemplotrabalheconoscopng) | /trabalhe-conosco · abertura igual a exemplotrabalheconosco.png | In Review | — | nunca conferida |
| [SIS-257](#sis-257-esg-capa-esg---environment-social-governance-seção-intro-com-esg1png) | /esg · capa «ESG - Environment, Social & Governance» + seção intro com esg1.png | In Review | conferido | — |
| [SIS-256](#sis-256-contato-números-cards-mais-estreitos-e-sem-contador-01-07) | /contato · números: cards mais estreitos e sem contador 01 / 07 | In Review | conferir | sem comentário de conferência |
| [SIS-255](#sis-255-contato-onde-estamos-sombra-atrás-do-mapa-menos-escura-e-menos-quadrada) | /contato · Onde Estamos: sombra atrás do mapa menos escura e menos quadrada | In Review | — | nunca conferida |
| [SIS-253](#sis-253-esg-fale-com-a-gente-igual-à-referência-falecomagentepng-ponto-na-linha-hover-botão) | /esg · Fale com a Gente! igual à referência falecomagente.png (+ ponto na linha, hover botão) | In Review | conferir | — |
| [SIS-252](#sis-252-esg-environment-governance-cards-azul-bem-clarinho-no-repouso-troca-de-cor-no-hover) | /esg · ENVIRONMENT + GOVERNANCE: cards azul bem clarinho no repouso + troca de cor no hover | In Review | — | nunca conferida |
| [SIS-251](#sis-251-eventos-inovacao-mobile-carrossel-mais-intuitivo-swipe-auto) | /eventos-inovacao · mobile: carrossel mais intuitivo (swipe + auto) | In Review | conferir | sem comentário de conferência |
| [SIS-250](#sis-250-sistran-university-logo-university-no-navbar-só-nesta-página) | /sistran-university · logo University no navbar (só nesta página) | In Review | — | nunca conferida |
| [SIS-249](#sis-249-sistran-university-seção-formar-especialistas-arte-texto-sombreado) | /sistran-university · seção Formar especialistas: arte + texto sombreado | In Review | — | nunca conferida |
| [SIS-248](#sis-248-sistran-university-capa-universitycapapng-padrão-heroimagebackdrop) | /sistran-university · capa universitycapa.png (padrão HeroImageBackdrop) | In Review | — | nunca conferida |
| [SIS-247](#sis-247-esg-capa-de-abertura-esgcapapng) | /esg · capa de abertura = esgcapa.png | In Review | — | nunca conferida |
| [SIS-243](#sis-243--hero-vídeo-só-inicia-depois-do-carregamento-da-página) | / · hero: vídeo só inicia depois do carregamento da página | In Review | — | nunca conferida |
| [SIS-241](#sis-241--peso-da-home-24-mb-entregues-163-mb-bruto-em-public) | / · Peso da home: 24 MB entregues + ~163 MB bruto em public/ | In Review | — | nunca conferida |
| [SIS-240](#sis-240--brandgrid-logos-ilegíveis-em-repouso-715-31) | / · BrandGrid: logos ilegíveis em repouso (7/15 < 3:1) | In Review | — | nunca conferida |
| [SIS-239](#sis-239-eventos-inovacao-mobile-carrossel-horizontal-automático-dos-eventos) | /eventos-inovacao · mobile: carrossel horizontal automático dos eventos | In Review | — | nunca conferida |
| [SIS-237](#sis-237-esg-environment-governance-flutuação-e-hover-bem-perceptíveis) | /esg · ENVIRONMENT + GOVERNANCE: flutuação e hover bem perceptíveis | In Review | — | nunca conferida |
| [SIS-236](#sis-236-parceiros-e-implementacoes-tirar-tarja-azul-clara-da-capa-emenda) | /parceiros-e-implementacoes · tirar tarja azul clara da capa / emenda | In Review | conferir | sem comentário de conferência |
| [SIS-235](#sis-235-eventos-inovacao-tag-realizado-pela-sistran-vira-componente-carimbo) | /eventos-inovacao · tag «Realizado pela Sistran» vira componente carimbo | In Review | — | nunca conferida |
| [SIS-234](#sis-234-esg-social-foguete-do-scroll-colorido-e-3d-logo-gerando-talentos) | /esg SOCIAL · foguete do scroll colorido e 3D (logo Gerando Talentos) | In Review | conferir | sem comentário de conferência |
| [SIS-233](#sis-233-esg-título-e-descrição-da-abertura-iguais-a-contato) | /esg · título e descrição da abertura iguais a /contato | In Review | conferir | sem comentário de conferência |
| [SIS-232](#sis-232-eventos-inovacao-miniaturas-laterais-maiores-e-mais-perto-do-card-em-destaque) | /eventos-inovacao · miniaturas laterais maiores e mais perto do card em destaque | In Review | — | nunca conferida |
| [SIS-231](#sis-231-solucoes-remover-seção-transformação-de-legado-método-quatro-movimentos) | /solucoes · remover seção Transformação de Legado (método / quatro movimentos) | In Review | — | nunca conferida |
| [SIS-230](#sis-230-quem-somos-premiações-celent-troféu-logo-texto-e-arte-latam-abaixo) | /quem-somos · Premiações: Celent (troféu + logo + texto) e arte LATAM abaixo | In Review | conferir | sem comentário de conferência |
| [SIS-229](#sis-229-sistran-labs-principais-soluções-arte-principaissolucoes-bem-integrada-não-quadrado) | /sistran-labs · Principais Soluções: arte principaissolucoes bem integrada (não quadrado) | In Review | — | nunca conferida |
| [SIS-228](#sis-228-parceiros-e-implementacoes-sombra-atrás-do-título-e-da-descrição-na-abertura) | /parceiros-e-implementacoes · sombra atrás do título e da descrição na abertura | In Review | — | nunca conferida |
| [SIS-227](#sis-227-sistran-labs-capa-sistran-labs-no-fundo-do-título) | /sistran-labs · capa SISTRAN-LABS no fundo do título | In Review | — | nunca conferida |
| [SIS-226](#sis-226-home-hero-escritas-alternando-durante-o-vídeo-3-slides-pitch-final) | Home · hero: escritas alternando durante o vídeo (3 slides + pitch final) | In Review | conferir | sem comentário de conferência |
| [SIS-225](#sis-225-parceiros-e-implementacoes-capa-fundocapaparceiros-no-fundo-do-título-e-descrição) | /parceiros-e-implementacoes · capa fundocapaparceiros no fundo do título e descrição | In Review | conferir | sem comentário de conferência |
| [SIS-224](#sis-224-trabalhe-conosco-suavizar-véusombra-feia-da-abertura) | /trabalhe-conosco · suavizar véu/sombra feia da abertura | In Review | — | nunca conferida |
| [SIS-223](#sis-223-trabalhe-conosco-formulário-em-card-no-scroll-campos-envio-tipo-contato) | /trabalhe-conosco · formulário em card no scroll (campos + envio tipo Contato) | In Review | conferir | sem comentário de conferência |
| [SIS-222](#sis-222-contato-loading-até-a-página-e-o-mapa-estarem-prontos-a-cada-entrada) | /contato · loading até a página (e o mapa) estarem prontos a cada entrada | In Review | — | nunca conferida |
| [SIS-221](#sis-221-quem-somos-escritórios-brasil-marcador-do-2º-andar-sp-muito-alto-na-torre) | /quem-somos · Escritórios BRASIL: marcador do 2º andar SP muito alto na torre | In Review | conferir | sem comentário de conferência |
| [SIS-220](#sis-220-parceiros-e-implementacoes-linha-do-tempo-viajante-logo-luminna-de-transformacao-legado) | /parceiros-e-implementacoes · Linha do tempo: viajante = logo Luminna de /transformacao-legado | In Review | conferir | sem comentário de conferência |
| [SIS-219](#sis-219-parceiros-e-implementacoes-logos-dos-cards-bem-maiores-e-mais-destacadas) | /parceiros-e-implementacoes · logos dos cards bem maiores e mais destacadas | In Review | conferir | sem comentário de conferência |
| [SIS-218](#sis-218-parceiros-e-implementacoes-parceiros-seção-fixa-avanço-lateral-com-o-scroll-da-página) | /parceiros-e-implementacoes · Parceiros: seção fixa + avanço lateral com o scroll da página | In Review | — | nunca conferida |
| [SIS-217](#sis-217-solucoes-logos-dos-aceleradores-nos-cards-reação-no-hover) | /solucoes · logos dos aceleradores nos cards + reação no hover | In Review | — | nunca conferida |
| [SIS-216](#sis-216-esboço-admin-de-eventos-senha-sem-sessãoseção-pública) | Esboço · admin de eventos (senha, sem sessão/seção pública) | In Review | — | nunca conferida |
| [SIS-215](#sis-215-eventos-inovacao-retirar-ou-clarear-as-bandas-azuis-escuras-no-início-e-fim-do-scroll) | /eventos-inovacao — retirar ou clarear as bandas azuis escuras no início e fim do scroll | In Review | conferir | sem comentário de conferência |
| [SIS-214](#sis-214-home-sobre-o-luminna-ai-entre-números-e-desafios) | Home · Sobre o Luminna AI entre Números e Desafios | In Review | conferir | sem comentário de conferência |
| [SIS-213](#sis-213-home-números-retirar-a-sombrafaixa-branca-do-fundo) | Home · Números: retirar a sombra/faixa branca do fundo | In Review | — | nunca conferida |
| [SIS-212](#sis-212-contato-negrito-em-preencha-o-formulário-e-fale-com-a-gente) | /contato — negrito em «Preencha o formulário e fale com a gente!» | In Review | conferir | sem comentário de conferência |
| [SIS-211](#sis-211-contato-números-fundo-azul-claro-cards-tipo-implementações-seção-mais-baixa) | /contato — números: fundo azul claro, cards tipo Implementações, seção mais baixa | In Review | conferir | sem comentário de conferência |
| [SIS-210](#sis-210-esg-governance-cards-iguais-à-captura-environment-sombra-flutuação) | /esg — GOVERNANCE: cards iguais à captura ENVIRONMENT (sombra + flutuação) | In Review | — | nunca conferida |
| [SIS-209](#sis-209-esg-social-huerta-niño-e-aguas-do-mesmo-tamanho-flutuação-leve) | /esg — SOCIAL: Huerta Niño e Aguas do mesmo tamanho + flutuação leve | In Review | — | nunca conferida |
| [SIS-208](#sis-208-esg-environment-cards-da-captura-círculo-sombra-flutuação-superfície) | /esg — ENVIRONMENT: cards da captura (círculo, sombra, flutuação) + superfície | In Review | — | nunca conferida |
| [SIS-207](#sis-207-esg-social-foguete-silhueta-branca-e-trajeto-em-toda-a-seção) | /esg — SOCIAL: foguete silhueta branca e trajeto em toda a seção | In Review | conferir | sem comentário de conferência |
| [SIS-206](#sis-206-esg-reparo-título-da-abertura-quebrado-frase-esg) | /esg — reparo: título da abertura quebrado (frase ESG) | In Review | conferir | sem comentário de conferência |
| [SIS-205](#sis-205-eventos-inovacao-botão-youtube-só-em-web-summit-ai-e-suitability) | /eventos-inovacao — botão YouTube só em Web Summit AI e Suitability | In Review | conferir | sem comentário de conferência |
| [SIS-204](#sis-204-eventos-inovacao-título-único-com-scroll-sombra-azul-clara-rótulos-inteiros-nas-miniaturas) | /eventos-inovacao — título único com scroll + sombra azul clara + rótulos inteiros nas miniaturas | In Review | conferir | sem comentário de conferência |
| [SIS-203](#sis-203-home-números-hover-fluido-nas-células-menos-névoa-branca-bolinhas-sob-cada-métrica) | Home · números: hover fluido nas células, menos névoa branca, bolinhas sob cada métrica | In Review | — | nunca conferida |
| [SIS-202](#sis-202-parceiros-e-implementacoes-etapas-layout-roadmaptrail-textos-da-timeline-antiga) | /parceiros-e-implementacoes · etapas: layout RoadmapTrail + textos da timeline antiga | In Review | conferir | sem comentário de conferência |
| [SIS-201](#sis-201-parceiros-e-implementacoes-cards-horizontais-estilo-terminal-imagens-parceirosimplantações) | /parceiros-e-implementacoes · cards horizontais estilo Terminal + imagens parceirosimplantações | In Review | conferir | sem comentário de conferência |
| [SIS-200](#sis-200-home-sistran-em-números-sete-células-iguais-ícone-dinâmico-por-métrica) | Home · Sistran em números: sete células iguais + ícone dinâmico por métrica | In Review | conferir | sem comentário de conferência |
| [SIS-199](#sis-199-home-backdrop-inteiro-azul-claro-grade-leve-igual-soluções-de-negócios) | Home · backdrop inteiro = azul claro + grade leve (igual Soluções de Negócios) | In Review | conferir | sem comentário de conferência |
| [SIS-198](#sis-198-home-hero-tamanho-fixo-sem-scaledrop-contorno-ciano-melhorado-ref-card) | Home · hero: tamanho fixo (sem scale/drop) + contorno ciano melhorado — ref card | In Review | — | sem relatório · nunca conferida |
| [SIS-197](#sis-197-home-data-reveal-presets-fade-upfadescale-softline-up-nos-blocos-efeito-4-doc-terminal) | Home · data-reveal: presets fade-up/fade/scale-soft/line-up nos blocos (Efeito 4 — doc Terminal) | In Review | conferir | sem comentário de conferência |
| [SIS-196](#sis-196-home-soluções-de-negócios-redesenhar-no-sticky-storytelling-terminal-layout-inteiro) | Home · Soluções de Negócios: redesenhar no sticky storytelling Terminal (layout inteiro) | In Review | conferido | — |
| [SIS-195](#sis-195-home-brandgrid-cascata-fade-up-das-logos-no-scroll-efeito-1-doc-terminal) | Home · BrandGrid: cascata fade-up das logos no scroll (Efeito 1 — doc Terminal) | In Review | conferido | — |
| [SIS-194](#sis-194-home-títulos-revelação-por-linhapalavra-com-máscara-efeito-2-doc-terminal) | Home · títulos: revelação por linha/palavra com máscara (Efeito 2 — doc Terminal) | In Review | conferido | — |
| [SIS-193](#sis-193-home-motion-terminal-tokens-sistran-primitiva-reveal-base-do-doc-efeitos-scroll-terminal-industries) | Home · motion Terminal: tokens Sistran + primitiva Reveal (base do doc efeitos-scroll-terminal-industries) | In Review | conferido | — |
| [SIS-192](#sis-192-home-tirar-o-mosaico-e-levar-entrega-com-alta-performance-quatro-pilares-para-a-coluna-ao-lado-do-vídeo) | Home: tirar o mosaico e levar “Entrega com Alta Performance…” + quatro pilares para a coluna ao lado do vídeo | In Review | conferido | — |
| [SIS-191](#sis-191-quem-somos-escritórios-mapa-cortado-no-norte-e-vão-excessivo-até-a-seção-país-inteiro-e-emenda-justa) | /quem-somos · Escritórios: mapa cortado no norte e vão excessivo até a seção — país inteiro e emenda justa | In Review | conferido | — |
| [SIS-190](#sis-190-home-hero-bordamoldura-no-quadro-do-vídeo-ref-publicreferenciavideopng) | Home · hero: borda/moldura no quadro do vídeo — ref public/referenciavideo.png | In Review | conferir | sem comentário de conferência |
| [SIS-189](#sis-189-home-hero-vídeo-começa-automático-ao-entrar-e-a-rolagem-controla-ida-e-volta) | Home · hero: vídeo começa automático ao entrar, e a rolagem controla ida e volta | In Review | conferir | sem comentário de conferência |
| [SIS-188](#sis-188-higiene-inventariar-componentes-órfãos-hero-pillarscarousel-trustticker-companysignature-partnersgrid-eventsgrid-guardar-ou-declarar-rascunho) | Higiene: inventariar componentes órfãos (Hero, PillarsCarousel, TrustTicker, CompanySignature, PartnersGrid, EventsGrid) — guardar ou declarar rascunho | In Review | conferido | — |
| [SIS-187](#sis-187-home-emenda-visível-entre-o-claro-do-hero-f4f8fc-e-a-seção-seguinte-decidir-se-dissolve-unifica-ou-permanece) | Home: emenda visível entre o claro do hero (`#f4f8fc`) e a seção seguinte — decidir se dissolve, unifica ou permanece | In Review | conferir | sem comentário de conferência |
| [SIS-186](#sis-186-medição-de-contraste-o-pior-pixel-em-texto-miúdo-pega-franja-de-antialiasing-e-condena-o-que-passa) | Medição de contraste: o pior pixel em texto miúdo pega franja de antialiasing e condena o que passa | In Review | conferir | sem comentário de conferência |
| [SIS-185](#sis-185-escritórios-brasil-divisas-sppr-que-leem-fechadas-no-mapa-e-o-violeta-de-brasil-como-decisão-de-token) | Escritórios BRASIL: divisas SP/PR que leem fechadas no mapa, e o violeta de `BRASIL` como decisão de token | In Review | conferir | — |
| [SIS-184](#sis-184-esg-rolagem-lateral-de-7px-no-celular-390-e-3px-no-tablet-768) | /esg — rolagem lateral de 7px no celular (390) e 3px no tablet (768) | In Review | conferir | sem comentário de conferência |
| [SIS-183](#sis-183-movimento-auditar-o-espelho-prefers-reduced-motion-htmldata-motionreduce-em-toda-cena-que-decide-layout-pelos-dois-interruptores) | Movimento: auditar o espelho `prefers-reduced-motion` ↔ `html[data-motion="reduce"]` em toda cena que decide layout pelos dois interruptores | In Review | conferir | sem comentário de conferência |
| [SIS-182](#sis-182-lint-trocar-matchmedia-dentro-de-useeffect-por-usesyncexternalstore-nos-oito-componentes-que-ainda-disparam-set-state-in-effect) | Lint: trocar `matchMedia` dentro de `useEffect` por `useSyncExternalStore` nos oito componentes que ainda disparam `set-state-in-effect` | In Review | conferir | sem comentário de conferência |
| [SIS-181](#sis-181-indicador-lateral-de-seções-rótulo-invisível-quando-a-seção-ativa-é-clara-e-não-usa-section-light) | Indicador lateral de seções: rótulo invisível quando a seção ativa é clara e não usa `.section-light` | In Review | conferido | — |
| [SIS-180](#sis-180-seção-somossistraners-tirar-o-véu-escuro-atrás-do-texto-confinar-as-luzes-do-palco-e-ampliar-o-título) | Seção #SomosSistraners: tirar o véu escuro atrás do texto, confinar as luzes do palco e ampliar o título | In Review | conferido | — |
| [SIS-179](#sis-179-grade-de-marcas-subir-para-depois-do-hero-título-centrado-e-maior-malha-aberta-com-marcas-de-cruz-e-célula-em-destaque-azul) | Grade de marcas: subir para depois do hero, título centrado e maior, malha aberta com marcas de cruz e célula em destaque azul | In Review | conferido | — |
| [SIS-178](#sis-178-hero-vídeo-na-metade-direita-dissolvendo-no-branco-legendas-na-coluna-esquerda) | Hero: vídeo na metade direita dissolvendo no branco, legendas na coluna esquerda | In Review | conferido | — |
| [SIS-177](#sis-177-conteúdo-aprovar-o-parágrafo-de-apoio-e-a-marginália-de-sistran-em-números) | Conteúdo: aprovar o parágrafo de apoio e a marginália de “Sistran em números” | In Review | conferido | — |
| [SIS-176](#sis-176-sistran-em-números-fundo-de-imagem-divisórias-e-trilho-de-sete-pontos-que-acende-na-rolagem) | “Sistran em números”: fundo de imagem, divisórias e trilho de sete pontos que acende na rolagem | In Review | conferido | — |
| [SIS-175](#sis-175-copy-lock-o-extrator-trava-as-reactcssproperties-como-se-fosse-cópia-do-site) | copy-lock: o extrator trava `as React.CSSProperties` como se fosse cópia do site | In Review | conferir | sem comentário de conferência |
| [SIS-174](#sis-174-piso-de-tamanho-de-texto-subir-os-30-pontos-abaixo-de-11px-e-reescrever-o-documento-de-tipografia-que-caducou) | Piso de tamanho de texto: subir os 30 pontos abaixo de 11px, e reescrever o documento de tipografia que caducou | In Review | conferir | sem comentário de conferência |
| [SIS-173](#sis-173-copy-lock-o-filtro-parececodigo-descarta-texto-publicado-de-verdade-cinco-frases-estão-fora-da-tranca) | copy-lock — o filtro pareceCodigo() descarta texto publicado de verdade; cinco frases estão fora da tranca | In Review | conferido | — |
| [SIS-172](#sis-172-relatorio-de-transparencia-salarial-o-portal-emprega-brasil-é-citado-no-texto-e-não-é-link) | /relatorio-de-transparencia-salarial — o Portal Emprega Brasil é citado no texto e não é link | In Review | conferido | — |
| [SIS-171](#sis-171-copy-lock-o-extrator-confunde-comentário-de-código-com-texto-do-site-e-o-portão-parou-de-valer) | copy-lock — o extrator confunde comentário de código com texto do site, e o portão parou de valer | In Review | conferido | — |
| [SIS-170](#sis-170-scrollspy-a-coluna-lateral-fixa-cobre-o-texto-do-hero-entre-1280-e-1440px) | ScrollSpy — a coluna lateral fixa cobre o texto do hero entre 1280 e 1440px | In Review | conferido | — |
| [SIS-169](#sis-169-quem-somos-escritórios-brasil-a-rolagem-volta-a-dirigir-transição-de-pato-branco-para-são-paulo-entre-as-duas-referências) | Quem somos · Escritórios BRASIL: a rolagem volta a dirigir — transição de Pato Branco para São Paulo entre as duas referências | In Review | conferido | — |
| [SIS-168](#sis-168-contato-onde-estamos-o-mapa-deixa-de-ser-cartão-e-passa-a-ser-o-fundo-da-seção-com-título-e-painel-por-cima) | Contato · Onde Estamos: o mapa deixa de ser cartão e passa a ser o fundo da seção, com título e painel por cima | In Review | conferido | — |
| [SIS-167](#sis-167-eventos-espalhar-as-miniaturas-com-flutuação-como-transformacao-legado-e-aumentar-a-arte-do-cartão) | Eventos: espalhar as miniaturas com flutuação (como /transformacao-legado) e aumentar a arte do cartão | In Review | conferido | — |
| [SIS-166](#sis-166-eventos-inovacao-cena-única-de-destaque-cartão-central-que-troca-com-a-rolagem-duas-colunas-de-miniaturas-substitui-mosaico-e-palco) | /eventos-inovacao — cena única de destaque: cartão central que troca com a rolagem + duas colunas de miniaturas (substitui mosaico e palco) | In Review | — | nunca conferida |
| [SIS-163](#sis-163-quem-somos-trecho-de-são-paulo-de-escritórios-brasil-trocar-o-explorador-3d-pelo-render-da-torre-e-seguir-mapasescritorio1png) | /quem-somos — trecho de São Paulo de "Escritórios BRASIL": trocar o explorador 3D pelo render da torre e seguir mapasescritorio1.png | In Review | conferido | — |
| [SIS-160](#sis-160-eventos-inovacao-trazer-a-estrutura-de-mosaico-da-apresentação-de-transformação-de-legado-para-as-imagens-dos-eventos) | /eventos-inovacao — trazer a estrutura de mosaico da apresentação de Transformação de Legado para as imagens dos eventos | In Review | — | nunca conferida |
| [SIS-159](#sis-159-parceiros-trocar-a-grade-bento-de-16-cards-pela-trilha-horizontal-pinada-código-de-referência) | Parceiros — trocar a grade bento de 16 cards pela trilha horizontal pinada (código de referência) | In Review | conferido | sem relatório |
| [SIS-158](#sis-158-parceiros-o-card-da-nuclea-é-o-único-sem-logo-ligar-o-nuclea-logopng-que-já-está-no-repositório) | Parceiros — o card da Nuclea é o único sem logo; ligar o Nuclea-logo.png que já está no repositório | In Review | — | nunca conferida |
| [SIS-157](#sis-157-cta-fale-com-a-gente-o-parágrafo-do-cartão-mede-3331-nas-dez-telas-piso-é-451) | CTA "Fale com a Gente!" — o parágrafo do cartão mede 3,33:1 nas dez telas (piso é 4,5:1) | In Review | — | nunca conferida |
| [SIS-156](#sis-156-home-trocar-a-faixa-rolante-de-logos-por-uma-grade-estática-de-marcas-referência-terminal-industriescom) | Home — trocar a faixa rolante de logos por uma grade estática de marcas (referência: terminal-industries.com) | In Review | — | nunca conferida |
| [SIS-155](#sis-155-site-inteiro-trocar-o-sistema-tipográfico-pelo-par-geist-sans-geist-mono-referência-terminal-industriescom) | Site inteiro — trocar o sistema tipográfico pelo par Geist Sans + Geist Mono (referência: terminal-industries.com) | In Review | conferido | — |
| [SIS-153](#sis-153-eventos-inovacao-retirar-o-número-01-02-de-cima-do-título-de-todos-os-eventos) | /eventos-inovacao — retirar o número (01, 02, …) de cima do título de todos os eventos | In Review | — | nunca conferida |
| [SIS-152](#sis-152-eventos-inovacao-retirar-o-bloco-fale-com-a-gente-do-fim-da-página) | /eventos-inovacao — retirar o bloco "Fale com a Gente!" do fim da página | In Review | — | nunca conferida |
| [SIS-149](#sis-149-eventos-inovacao-a-explicação-volta-para-o-canto-inferior-esquerdo-da-foto) | /eventos-inovacao — a explicação volta para o canto inferior esquerdo da foto | In Review | — | nunca conferida |
| [SIS-147](#sis-147-eventos-inovacao-diminuir-a-altura-da-abertura-com-vídeo) | /eventos-inovacao — diminuir a altura da abertura com vídeo | In Review | conferido | — |
| [SIS-146](#sis-146-contato-bloco-timesistran-aumentar-a-escrita-do-cartão-de-carreira-e-tirar-o-travessão-do-parágrafo) | /contato — bloco #timeSISTRAN: aumentar a escrita do cartão de carreira e tirar o travessão do parágrafo | In Review | — | nunca conferida |
| [SIS-145](#sis-145-contato-encurtar-o-vão-entre-a-faixa-de-parceiros-e-o-painel-de-contato) | /contato — encurtar o vão entre a faixa de parceiros e o painel de contato | In Review | — | nunca conferida |
| [SIS-144](#sis-144-contato-a-faixa-de-indicadores-fixa-na-tela-e-os-cartões-correm-para-o-lado-com-o-scroll-e-depois-a-página-desce) | /contato — a faixa de indicadores fixa na tela e os cartões correm para o lado com o scroll, e depois a página desce | In Review | conferido | — |
| [SIS-143](#sis-143-contato-os-sete-indicadores-viram-cartões-número-maior-contagem-ao-entrar-na-tela-e-rótulo-ao-lado) | /contato — os sete indicadores viram cartões: número maior, contagem ao entrar na tela e rótulo ao lado | In Review | — | nunca conferida |
| [SIS-142](#sis-142-esg-cta-fale-com-a-gente-fundo-azul-claro-cartão-mais-inovador-reação-ao-mouse-e-o-botão-abrindo-o-modal-de-contato) | /esg — CTA “Fale com a Gente!”: fundo azul claro, cartão mais inovador, reação ao mouse e o botão abrindo o modal de contato | In Review | — | nunca conferida |
| [SIS-141](#sis-141-esg-governance-no-mesmo-formato-de-environment-seis-imagens-e-escritas-maiores) | /esg — GOVERNANCE no mesmo formato de ENVIRONMENT: seis imagens e escritas maiores | In Review | conferido | — |
| [SIS-140](#sis-140-esg-social-destaque-no-título-galeria-dinâmica-com-imagem-que-expande-foguete-no-scroll-e-cards-iguais) | /esg — SOCIAL: destaque no título, galeria dinâmica com imagem que expande, foguete no scroll e cards iguais | In Review | — | nunca conferida |
| [SIS-139](#sis-139-esg-environment-as-seis-práticas-ganham-imagem-cor-no-hover-movimento-contínuo-e-destaque-no-título) | /esg — ENVIRONMENT: as seis práticas ganham imagem, cor no hover, movimento contínuo e destaque no título | In Review | — | nunca conferida |
| [SIS-138](#sis-138-esg-abertura-título-quebrado-à-esquerda-e-a-continuação-ao-lado-na-mesma-fonte) | /esg — abertura: título quebrado à esquerda e a continuação ao lado, na mesma fonte | In Review | conferido | — |
| [SIS-137](#sis-137-trabalhe-conosco-abertura-com-vídeo-formulário-ao-lado-da-escrita-e-a-tag-revista) | /trabalhe-conosco — abertura com vídeo, formulário ao lado da escrita e a tag revista | In Review | — | nunca conferida |
| [SIS-136](#sis-136-contato-a-faixa-de-parceiros-sobe-para-entre-a-abertura-e-o-formulário) | /contato — a faixa de parceiros sobe para entre a abertura e o formulário | In Review | — | nunca conferida |
| [SIS-135](#sis-135-contato-onde-estamos-o-mapa-maior-dentro-da-seção) | /contato — “Onde Estamos”: o mapa maior dentro da seção | In Review | — | nunca conferida |
| [SIS-134](#sis-134-contato-faixa-com-os-sete-indicadores-antes-do-painel-de-contato) | /contato — faixa com os sete indicadores antes do painel de contato | In Review | — | nunca conferida |
| [SIS-133](#sis-133-contato-abertura-em-duas-colunas-título-à-esquerda-descrição-ao-lado-e-escrita-maior) | /contato — abertura em duas colunas: título à esquerda, descrição ao lado, e escrita maior | In Review | — | nunca conferida |
| [SIS-132](#sis-132-mapa-das-unidades-trocar-o-mosaico-osm-invertido-por-maplibre-tiles-vetoriais-sem-chave) | Mapa das unidades: trocar o mosaico OSM invertido por MapLibre + tiles vetoriais, sem chave | In Review | — | nunca conferida |
| [SIS-130](#sis-130-contato-venha-fazer-parte-do-timesistran-escrita-ampliada-palco-com-marca-dágua-atrás-e-venha-ser-sistran-como-cartão-dinâmico) | /contato — “Venha Fazer Parte do #timeSISTRAN!”: escrita ampliada, palco com marca d’água atrás e “Venha ser Sistran” como cartão dinâmico | In Review | — | nunca conferida |
| [SIS-129](#sis-129-contato-onde-estamos-o-mapa-passa-a-ser-o-cartão-inteiro-com-seletor-e-endereço-por-cima) | /contato — “Onde Estamos”: o mapa passa a ser o cartão inteiro, com seletor e endereço por cima | In Review | — | nunca conferida |
| [SIS-128](#sis-128-contato-o-fundo-atrás-do-painel-entre-em-contato-conosco-não-pode-ser-azul-chapado) | /contato: o fundo atrás do painel “Entre em contato conosco” não pode ser azul chapado | In Review | — | nunca conferida |
| [SIS-127](#sis-127-contato-mover-prefere-e-mail-para-dentro-do-destaque-do-telefone-só-nesta-tela) | /contato: mover “Prefere e-mail?” para dentro do destaque do telefone, só nesta tela | In Review | — | nunca conferida |
| [SIS-126](#sis-126-contato-foto-do-escritório-atrás-da-abertura-preencha-o-formulário-e-fale-com-a-gente) | /contato: foto do escritório atrás da abertura “Preencha o formulário e fale com a gente!” | In Review | — | nunca conferida |
| [SIS-125](#sis-125-varredura-por-tela-índice-das-alterações-pendentes-rota-por-rota) | Varredura por tela: índice das alterações pendentes, rota por rota | In Review | conferido | — |
| [SIS-122](#sis-122-sistran-labs-guru-de-seguros-e-smart-miner-aparecem-duas-vezes-na-mesma-página-e-a-abertura-tem-três-parágrafos-com-caixa-alta-no-meio-do-texto) | /sistran-labs: Guru de Seguros e Smart Miner aparecem duas vezes na mesma página, e a abertura tem três parágrafos com caixa alta no meio do texto | In Review | conferido | — |
| [SIS-121](#sis-121-latam-alianzas-sem-alianças-notícias-sem-destino-doze-escritórios-sem-mapa) | /latam: “Alianzas” sem alianças, notícias sem destino, doze escritórios sem mapa | In Review | conferido | — |
| [SIS-120](#sis-120-solucoesslug-as-sete-páginas-de-produto-são-texto-corrido-sem-imagem-sem-volta-e-sem-navegação-entre-elas) | /solucoes/[slug]: as sete páginas de produto são texto corrido, sem imagem, sem volta e sem navegação entre elas | In Review | conferido | — |
| [SIS-119](#sis-119-transformacao-legado-página-sem-abertura-sem-h1-e-fora-do-menu) | /transformacao-legado: página sem abertura, sem h1 e fora do menu | In Review | conferido | — |
| [SIS-118](#sis-118-blog-e-blogslug-a-seção-está-órfã-no-site-e-o-post-tem-três-links-mortos) | /blog e /blog/[slug]: a seção está órfã no site e o post tem três links mortos | In Review | conferido | — |
| [SIS-117](#sis-117-trabalhe-conosco-o-currículo-enviado-não-vai-a-lugar-nenhum-e-a-página-não-tem-vagas) | /trabalhe-conosco: o currículo enviado não vai a lugar nenhum, e a página não tem vagas | In Review | — | nunca conferida |
| [SIS-116](#sis-116-sistran-university-a-página-é-só-a-abertura-falta-a-página-inteira) | /sistran-university: a página é só a abertura — falta a página inteira | In Review | conferido | — |
| [SIS-115](#sis-115-eventos-inovacao-imagem-em-destaque-no-centro-da-tela-e-preview-reduzido-a-anteriorpróximo) | /eventos-inovacao: imagem em destaque no centro da tela e preview reduzido a anterior/próximo | In Review | — | nunca conferida |
| [SIS-114](#sis-114-esg-social-sombra-pulsante-atrás-dos-cards-de-fundación-huerta-niño-e-fundación-aguas) | /esg · SOCIAL: sombra pulsante atrás dos cards de Fundación Huerta Niño e Fundación Aguas | In Review | — | nunca conferida |
| [SIS-113](#sis-113-esg-imagem-de-fundo-atrás-do-título-da-abertura-com-sombra-leve-e-título-deslocado-para-a-esquerda) | /esg: imagem de fundo atrás do título da abertura, com sombra leve e título deslocado para a esquerda | In Review | — | nunca conferida |
| [SIS-112](#sis-112-solucoes-as-sombras-do-vídeo-de-abertura-estão-em-arestas-retas-deixar-a-passagem-sutil) | /solucoes: as sombras do vídeo de abertura estão em arestas retas — deixar a passagem sutil | In Review | — | nunca conferida |
| [SIS-111](#sis-111-eventos-inovacao-centralizar-e-proporcionar-o-texto-sobre-a-imagem-e-deixar-o-preview-lateral-mais-discreto) | /eventos-inovacao: centralizar e proporcionar o texto sobre a imagem, e deixar o preview lateral mais discreto | In Review | — | nunca conferida |
| [SIS-110](#sis-110-esg-social-colocar-as-imagens-de-fundación-huerta-niño-e-fundación-aguas-nos-cards) | /esg · SOCIAL: colocar as imagens de Fundación Huerta Niño e Fundación Aguas nos cards | In Review | — | nunca conferida |
| [SIS-109](#sis-109-esg-social-dar-ao-projeto-gerando-talentos-um-bloco-próprio-com-logo-e-as-fotos-das-três-turmas) | /esg · SOCIAL: dar ao “Projeto Gerando Talentos” um bloco próprio, com logo e as fotos das três turmas | In Review | — | nunca conferida |
| [SIS-108](#sis-108-parceiros-e-implementacoes-seção-implementações-remover-o-02-o-mosaico-de-cards-e-a-parede-de-logos-e-usar-a-faixa-clara-de-marcas) | /parceiros-e-implementacoes: seção “Implementações” — remover o “02”, o mosaico de cards e a parede de logos, e usar a faixa clara de marcas | In Review | — | nunca conferida |
| [SIS-107](#sis-107-eventos-inovacao-ajustar-a-transição-da-grade-de-eventos-para-a-seção-siga-a-sistran-no-linkedin) | /eventos-inovacao: ajustar a transição da grade de eventos para a seção “Siga a Sistran no LinkedIn” | In Review | — | nunca conferida |
| [SIS-106](#sis-106-eventos-inovacao-controle-lateral-com-preview-dos-eventos-cantos-arredondados-e-sombra-contínua) | /eventos-inovacao: controle lateral com preview dos eventos, cantos arredondados e sombra contínua | In Review | — | nunca conferida |
| [SIS-105](#sis-105-eventos-inovacao-vídeo-de-fundo-no-hero-eventos-inovação-no-mesmo-padrão-de-solucoes) | /eventos-inovacao: vídeo de fundo no hero “Eventos & Inovação”, no mesmo padrão de /solucoes | In Review | — | nunca conferida |
| [SIS-104](#sis-104-eventos-inovacao-substituir-as-imagens-dos-eventos-pelas-versões-de-alta-qualidade) | /eventos-inovacao: substituir as imagens dos eventos pelas versões de alta qualidade | In Review | — | nunca conferida |
| [SIS-103](#sis-103-transição-sobre-o-luminna-ai-contato-eliminar-a-quebra-e-encadear-o-card-do-luminna-com-a-entrada-do-card-de-contato) | Transição “Sobre o Luminna AI” → Contato: eliminar a quebra e encadear o card do Luminna com a entrada do card de contato | In Review | — | nunca conferida |
| [SIS-102](#sis-102-faixa-de-logos-adicionar-ponto-azul-separador-entre-as-logos) | Faixa de logos: adicionar ponto azul separador entre as logos | In Review | — | nunca conferida |
| [SIS-101](#sis-101-faixa-de-logos-remover-a-linha-azul-e-os-cantos-soltos-e-integrá-la-ao-rodapé-da-seção-escala-que-transforma-o-mercado-de-seguros) | Faixa de logos: remover a linha azul e os cantos soltos, e integrá-la ao rodapé da seção “Escala que transforma o mercado de seguros.” | In Review | — | nunca conferida |
| [SIS-100](#sis-100-navegador-lateral-de-seções-scrollspy-em-todas-as-páginas-mapa-de-seções-por-tela) | Navegador lateral de seções (ScrollSpy) em todas as páginas — mapa de seções por tela | In Review | — | nunca conferida |
| [SIS-99](#sis-99-desafios-no-desenvolvimento-de-software-remover-as-três-etapas-e-manter-só-o-bloco-sobre-o-luminna-ai) | “Desafios no desenvolvimento de software”: remover as três etapas e manter só o bloco sobre o Luminna AI | In Review | — | nunca conferida |
| [SIS-97](#sis-97-escritórios-brasil-unificar-o-fundo-do-mapa-com-o-fundo-claro-do-título) | “Escritórios BRASIL”: unificar o fundo do mapa com o fundo claro do título | In Review | — | nunca conferida |
| [SIS-96](#sis-96-seção-escritórios-brasil-revelar-o-mapa-progressivamente-com-efeitos-das-skills-de-scroll-motion) | Seção “Escritórios BRASIL”: revelar o mapa progressivamente com efeitos das skills de scroll motion | In Review | — | nunca conferida |
| [SIS-95](#sis-95-diagrama-onde-seguros-negócio-e-tecnologia-convergem-núcleo-mais-3d-logo-maior-e-fios-dinâmicos) | Diagrama “Onde seguros, negócio e tecnologia convergem”: núcleo mais 3D, logo maior e fios dinâmicos | In Review | — | nunca conferida |
| [SIS-86](#sis-86-preloader-fundo-da-tela-de-entrada-deve-ser-azul-logo-branca-desaparece-no-fundo-branco) | Preloader: fundo da tela de entrada deve ser azul (logo branca desaparece no fundo branco) | In Review | — | nunca conferida |
| [SIS-85](#sis-85-métricas-corrigir-alinhamento-e-transição-entre-os-números-deslocados-à-direita) | Métricas: corrigir alinhamento e transição entre os números (deslocados à direita) | In Review | — | nunca conferida |
| [SIS-84](#sis-84-contato-seção-onde-estamos-com-mapa-dinâmico-das-unidades) | /contato: seção “Onde Estamos” com mapa dinâmico das unidades | In Review | — | nunca conferida |
| [SIS-83](#sis-83-contato-substituir-o-bloco-de-formulário-atual-pelo-layout-entre-em-contato-conosco) | /contato: substituir o bloco de formulário atual pelo layout “Entre em contato conosco” | In Review | — | nunca conferida |
| [SIS-82](#sis-82-adicionar-item-sistran-latam-no-menu-quem-somos-e-trazer-a-página-latam) | Adicionar item “Sistran Latam” no menu “Quem somos” e trazer a página /latam/ | In Review | — | nunca conferida |
| [SIS-81](#sis-81-adicionar-item-sistran-university-no-menu-quem-somos-e-criar-página-sistran-university) | Adicionar item “Sistran University” no menu “Quem somos” e criar página /sistran-university/ | In Review | — | nunca conferida |
| [SIS-80](#sis-80-adicionar-item-sistran-labs-no-menu-quem-somos-e-criar-página-sistran-labs) | Adicionar item “Sistran Labs” no menu “Quem somos” e criar página /sistran-labs/ | In Review | — | nunca conferida |
| [SIS-79](#sis-79-nossa-essência-missão-valores-e-pilares-abrindo-conforme-a-rolagem-passa) | Nossa essência: Missão, Valores e Pilares abrindo conforme a rolagem passa | In Review | — | sem relatório · nunca conferida |
| [SIS-78](#sis-78-azul-quase-preto-clarear-o-mapa-dos-escritórios-brasil-e-as-demais-seções-que-usam-a-mesma-família) | Azul quase preto: clarear o mapa dos Escritórios BRASIL e as demais seções que usam a mesma família | In Review | — | nunca conferida |
| [SIS-77](#sis-77-sobreposição-entre-seções-e-revisão-dos-100vh-cartões-que-vazam-de-um-bloco-para-o-próximo) | Sobreposição entre seções e revisão dos 100vh: cartões que vazam de um bloco para o próximo | In Review | — | sem relatório · nunca conferida |
| [SIS-76](#sis-76-grade-técnica-contínua-no-site-inteiro-uma-só-camada-não-uma-por-seção) | Grade técnica contínua no site inteiro (uma só camada, não uma por seção) | In Review | — | nunca conferida |
| [SIS-75](#sis-75-fluidez-entre-seções-auditoria-dos-cortes-duros-e-do-que-já-existe-para-resolvê-los) | Fluidez entre seções: auditoria dos cortes duros e do que já existe para resolvê-los | In Review | — | sem relatório · nunca conferida |
| [SIS-74](#sis-74-sistran-em-números-auditoria-do-pedido-visual-o-que-já-existe-e-os-dois-ajustes-que-faltam) | Sistran em números: auditoria do pedido visual — o que já existe e os dois ajustes que faltam | In Review | — | sem relatório · nunca conferida |
| [SIS-73](#sis-73-sistran-em-números-navegação-clicável-dos-sete-indicadores-base-no-desktop-tabs-no-mobile) | Sistran em números: navegação clicável dos sete indicadores (base no desktop, tabs no mobile) | In Review | — | nunca conferida |
| [SIS-72](#sis-72-sistran-em-números-contagem-com-mola-spring-em-vez-de-curva-de-saída) | Sistran em números: contagem com mola (spring) em vez de curva de saída | In Review | — | nunca conferida |
| [SIS-71](#sis-71-efeitos-auditar-e-padronizar-as-cinco-animações-pedidas-já-existem-primitivas-no-projeto) | Efeitos: auditar e padronizar as cinco animações pedidas (já existem primitivas no projeto) | In Review | — | sem relatório · nunca conferida |
| [SIS-70](#sis-70-performance-o-site-está-lento-dieta-de-assets-e-code-splitting-com-dynamic) | Performance: o site está lento — dieta de assets e code splitting com dynamic | In Review | — | nunca conferida |
| [SIS-69](#sis-69-quem-somos-retirar-o-explorador-3d-360-torre-river-park-complexo-modular) | /quem-somos: retirar o explorador 3D 360° (Torre River Park / Complexo Modular) | In Review | — | nunca conferida |
| [SIS-68](#sis-68-arquitetura-virar-entrega-com-alta-performance-e-trazer-os-quatro-pilares) | Arquitetura: virar "Entrega com Alta Performance" e trazer os quatro pilares | In Review | — | nunca conferida |
| [SIS-67](#sis-67-impacto-vídeo-chega-na-seção-já-montado-deve-surgir-com-o-scroll) | Impacto: vídeo chega na seção já montado — deve surgir com o scroll | In Review | — | nunca conferida |
| [SIS-66](#sis-66-impacto-trocar-a-escrita-da-seção-para-sobre-o-luminna-ai) | Impacto: trocar a escrita da seção para "Sobre o Luminna AI" | In Review | — | nunca conferida |
| [SIS-65](#sis-65-header-padronizar-a-logo-da-sistran-no-tamanho-maior-hoje-ela-encolhe-no-scroll) | Header: padronizar a logo da Sistran no tamanho maior (hoje ela encolhe no scroll) | In Review | — | nunca conferida |
| [SIS-64](#sis-64-sistran-em-números-fronteira-em-curva-claroescuro-está-feia-manchas-nos-cantos) | Sistran em números: fronteira em curva claro/escuro está feia (manchas nos cantos) | In Review | — | nunca conferida |
| [SIS-63](#sis-63-sistran-em-números-melhorar-a-abertura-do-palco-primeiro-indicador-embaralhado) | Sistran em números: melhorar a abertura do palco (primeiro indicador embaralhado) | In Review | — | nunca conferida |
| [SIS-62](#sis-62-sistran-em-números-ligar-cada-indicador-ao-nó-da-onda-números-soltos-hoje) | Sistran em números: ligar cada indicador ao nó da onda (números soltos hoje) | In Review | — | nunca conferida |
| [SIS-61](#sis-61-sistran-em-números-usar-o-mesmo-fundo-de-soluções-de-negócios-na-seção) | Sistran em números: usar o mesmo fundo de Soluções de Negócios na seção | In Review | — | nunca conferida |
| [SIS-60](#sis-60-sistran-em-números-emenda-com-soluções-está-quebrada-a-cor-da-emenda-não-é-mais-a-cor-da-vizinha) | Sistran em números: emenda com Soluções está quebrada — a cor da emenda não é mais a cor da vizinha | In Review | — | nunca conferida |
| [SIS-59](#sis-59-footer-hover-revelando-informação-por-trás-dos-itens-referência-mimoxiaomicom) | Footer: hover revelando informação por trás dos itens (referência mimo.xiaomi.com) | In Review | — | nunca conferida |
| [SIS-58](#sis-58-siga-a-sistran-no-linkedin-deixar-a-seção-bem-mais-movimentada) | Siga a Sistran no LinkedIn: deixar a seção bem mais movimentada | In Review | — | nunca conferida |
| [SIS-57](#sis-57-contato-micro-interações-nos-componentes-internos-do-painel-hover-e-foco) | Contato: micro-interações nos componentes internos do painel (hover e foco) | In Review | — | nunca conferida |
| [SIS-56](#sis-56-contato-dar-movimento-contínuo-ao-painel-inteiro-não-só-entrada) | Contato: dar movimento contínuo ao painel inteiro (não só entrada) | In Review | — | nunca conferida |
| [SIS-55](#sis-55-contato-endereço-da-sede-aparece-apagado-no-cartão-sobre-a-foto) | Contato: endereço da sede aparece apagado no cartão sobre a foto | In Review | — | nunca conferida |
| [SIS-54](#sis-54-home-retirar-o-bloco-fale-com-a-gente-do-fim-da-página) | Home: retirar o bloco "Fale com a Gente!" do fim da página | In Review | — | nunca conferida |
| [SIS-53](#sis-53-sistran-em-números-a-lente-central-parece-travada-revisar-os-efeitos-do-palco) | Sistran em números: a lente central parece travada — revisar os efeitos do palco | In Review | — | nunca conferida |
| [SIS-52](#sis-52-sistran-em-números-layout-e-visual-conforme-a-referência-de-design) | Sistran em números: layout e visual conforme a referência de design | In Review | — | nunca conferida |
| [SIS-51](#sis-51-transição-componente-que-interliga-soluções-de-negócios-a-sistran-em-números) | Transição: componente que interliga Soluções de Negócios a Sistran em números | In Review | — | nunca conferida |
| [SIS-50](#sis-50-sistran-em-números-mover-a-seção-para-o-lugar-de-resultados-evidências-dos-casos) | Sistran em números: mover a seção para o lugar de "Resultados | evidências dos casos" | In Review | — | nunca conferida |
| [SIS-35](#sis-35-contato-fecha-o-percurso-e-auditoria-de-movimento-reduzido-e-performance-da-home) | Contato fecha o percurso, e auditoria de movimento reduzido e performance da home | In Review | — | nunca conferida |
| [SIS-34](#sis-34-seções-com-pin-soluções-impactsequence-metrics-entram-no-sistema-sem-quebrar-o-sticky) | Seções com pin (Soluções, ImpactSequence, Metrics) entram no sistema sem quebrar o sticky | In Review | — | nunca conferida |
| [SIS-32](#sis-32-emendas-entre-seções-nenhuma-troca-de-fundo-com-corte-seco) | Emendas entre seções: nenhuma troca de fundo com corte seco | In Review | — | nunca conferida |
| [SIS-31](#sis-31-revelação-encenada-componentes-de-cada-seção-surgindo-em-etapas-no-scroll) | Revelação encenada: componentes de cada seção surgindo em etapas no scroll | In Review | — | nunca conferida |
| [SIS-30](#sis-30-fio-condutor-componente-que-costura-hero-contato-desenhado-pelo-scroll) | Fio condutor: componente que costura hero → contato, desenhado pelo scroll | In Review | — | nunca conferida |
| [SIS-29](#sis-29-scroll-suave-afinar-o-lenis-como-relógio-único-do-percurso-hero-contato) | Scroll suave: afinar o Lenis como relógio único do percurso hero → contato | In Review | — | nunca conferida |
| [SIS-28](#sis-28-trazer-o-teatro-de-soluções-de-negócios-para-o-lugar-do-método) | Trazer o teatro de "Soluções de Negócios" para o lugar do Método | In Review | — | nunca conferida |
| [SIS-27](#sis-27-método-comentar-o-vídeo-e-neutralizar-o-tile-viajante-que-o-carrega) | Método: comentar o vídeo e neutralizar o tile viajante que o carrega | In Review | — | nunca conferida |
| [SIS-26](#sis-26-método-comentar-o-texto-de-abertura-e-os-quatro-movimentos) | Método: comentar o texto de abertura e os quatro movimentos | In Review | — | nunca conferida |
| [SIS-25](#sis-25-contato-endereço-da-sede-ainda-apagado-ajustar-o-tom-do-azul-do-cartão) | Contato: endereço da sede ainda apagado — ajustar o tom do azul do cartão | In Review | — | nunca conferida |
| [SIS-24](#sis-24-card-do-linkedin-aplicar-o-efeito-de-revelação-em-hover-das-duas-faces) | Card do LinkedIn: aplicar o efeito de revelação em hover das duas faces | In Review | nenhuma | nunca conferida |
| [SIS-23](#sis-23-siga-a-sistran-no-linkedin-fundo-dinâmico-e-componentes-reativos-ao-mouse) | Siga a Sistran no LinkedIn: fundo dinâmico e componentes reativos ao mouse | In Review | nenhuma | nunca conferida |
| [SIS-22](#sis-22-sistran-em-números-aumentar-o-dinamismo-e-aproximar-da-referência) | Sistran em números: aumentar o dinamismo e aproximar da referência | In Review | nenhuma | nunca conferida |
| [SIS-21](#sis-21-comentar-a-seção-entrega-com-alta-performance-e-comprometimento-na-home) | Comentar a seção Entrega com Alta Performance e Comprometimento na home | In Review | nenhuma | nunca conferida |
| [SIS-19](#sis-19-soluções-de-negócios-reconstruir-como-teatro-de-soluções-guiado-por-scroll) | Soluções de Negócios: reconstruir como teatro de soluções guiado por scroll | In Review | nenhuma | nunca conferida |
| [SIS-18](#sis-18-contato-tratar-o-fundo-por-trás-do-reveal-do-modal-fale-com-a-gente) | Contato: tratar o fundo por trás do reveal do modal "Fale com a gente" | In Review | nenhuma | nunca conferida |
| [SIS-17](#sis-17-contato-endereço-da-sede-ilegível-dentro-do-cartão-sede-são-paulo) | Contato: endereço da sede ilegível dentro do cartão "SEDE · SÃO PAULO" | In Review | nenhuma | nunca conferida |
| [SIS-16](#sis-16-sistran-em-números-corrigir-composição-gap-único-lente-central-mascarada-isolamento-da-seção-anterior) | Sistran em números: corrigir composição (gap único, lente central mascarada, isolamento da seção anterior) | In Review | nenhuma | nunca conferida |
| [SIS-15](#sis-15-home-faixa-de-sinais-deve-passar-as-logos-de-parceiros-de-parceiros-e-implementacoes) | Home: faixa de sinais deve passar as logos de parceiros de /parceiros-e-implementacoes | In Review | nenhuma | nunca conferida |
| [SIS-14](#sis-14-home-remover-a-seção-sobre-nós-a-sistran-o-texto-institucional-fica-só-em-quem-somos) | Home: remover a seção "Sobre nós / A Sistran" — o texto institucional fica só em /quem-somos | In Review | nenhuma | nunca conferida |
| [SIS-13](#sis-13-home-mover-indicadores-de-resultados-do-hero-para-depois-do-método-e-adicionar-faixa-de-sinais) | Home: mover indicadores de Resultados do hero para depois do Método e adicionar faixa de sinais | In Review | nenhuma | sem relatório · nunca conferida |
| [SIS-12](#sis-12-sistran-em-números-scrollytelling-horizontal-com-curva-data-lens-e-componentes-contextuais) | Sistran em números: scrollytelling horizontal com curva, data lens e componentes contextuais | In Review | nenhuma | nunca conferida |
| [SIS-11](#sis-11-abertura-da-home-saída-em-cortina-dividida-como-no-projeto-de-apresentação) | Abertura da home: saída em cortina dividida, como no projeto de apresentação | In Review | nenhuma | nunca conferida |
| [SIS-10](#sis-10-home-hero-indicadores-de-resultados-surgem-no-fim-do-percurso-do-hero) | Home · hero: indicadores de Resultados surgem no fim do percurso do hero | In Review | nenhuma | nunca conferida |
| [SIS-9](#sis-9-home-contato-textos-do-painel-ficam-invisíveis-navy-sobre-navy-dentro-de-section-light) | Home · contato: textos do painel ficam invisíveis (navy sobre navy) dentro de .section-light | In Review | nenhuma | nunca conferida |
| [SIS-8](#sis-8-quem-somos-escritórios-brasil-ao-chegar-em-sp-surgir-prédio-3d-com-escritório-marcado-no-2º-andar-e-fotos) | Quem somos / Escritórios BRASIL: ao chegar em SP, surgir prédio 3D com escritório marcado no 2º andar e fotos | In Review | nenhuma | nunca conferida |
| [SIS-7](#sis-7-quem-somos-escritórios-brasil-mapa-deve-aparecer-de-forma-mais-dinâmica-no-scroll) | Quem somos / Escritórios BRASIL: mapa deve aparecer de forma mais dinâmica no scroll | In Review | nenhuma | nunca conferida |
| [SIS-6](#sis-6-quem-somos-escritórios-brasil-remover-rio-de-janeiro-da-seção-por-enquanto) | Quem somos / Escritórios BRASIL: remover Rio de Janeiro da seção (por enquanto) | In Review | nenhuma | nunca conferida |
| [SIS-5](#sis-5-contato-substituir-seção-saiba-mais-sobre-o-que-podemos-oferecer-por-reveal-dinâmico-do-modal-fale-com-a-gente-no-scroll) | Contato: substituir seção "Saiba mais sobre o que podemos oferecer" por reveal dinâmico do modal Fale com a gente no scroll | In Review | nenhuma | nunca conferida |

---
## SIS-278 — Site · barra de progresso de scroll no topo (ciano, acima do navbar)

**Status:** Done · **Labels:** — · **Fechada em:** 15/09/2026 · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-278/site-barra-de-progresso-de-scroll-no-topo-ciano-acima-do-navbar

### Pedido
Colocar uma barra de acompanhamento do scroll no topo da viewport, acima do navbar, no espírito de raul-strombeck-lp.vercel.app (lá laranja; aqui ciano ou outra cor menos dominante da paleta Sistran). Faixa fina fixa em `top: 0`, preenchendo da esquerda para a direita. Preferência `#0ed8f6` / token de acento, não o azul `#1273bc` chapado. Uma barra global no layout, `position: fixed`, altura ~2–3px, z-index acima do header (`fixed` + `top-4` + `z-50`). Progresso `scrollY / (scrollHeight - innerHeight)` (ou Lenis, SIS-29); preferir `transform: scaleX`. Decorativa (`aria-hidden`) ou `role="progressbar"`. Reduce: barra pode continuar ou sumir — declarar. Fora de escopo: ScrollSpy/ScrollSpine, layout do navbar, laranja da referência. Aceite: qualquer rota 0→100%; acima do navbar; cor discreta em hero claro e escuro; capturas 1440 (topo + meio + fim); lint OK.

### O que foi feito
Relatório de entrega: fechada sem conferência, a pedido da usuária. Implementada uma única barra global de progresso no topo absoluto da viewport.

**Arquitetura**
- Novo componente estático `src/components/ui/ScrollProgressBar.tsx`, sem `'use client'`, estado, hook, listener, Motion ou GSAP.
- Montado diretamente no `RootLayout`, como irmão global, fora do `Header`, `PageTransition` e `RouteLoadGate`.
- Consome em CSS o `--scroll-p` que `SmoothScroll` já publica pelo relógio único do site.
- `transform-origin: left` + `scaleX(var(--scroll-p, 0))`; largura nunca é animada.
- Decorativa: `aria-hidden`, sem texto, foco ou eventos de ponteiro.

**Visual**
- Ciano Sistran `#0ed8f6`, altura 3px, `top: 0`, `z-index: 60` contra 50 do navbar.
- Halo/borda navy discreta dá contraste medido acima de 3:1 em heroes claros; o ciano fica perto de 10:1 nos heroes escuros.
- Sem trilho permanente: em progresso zero o topo fica limpo.

**Medidas reais — 1440×900**
- Topo: `--scroll-p: 0`, escala 0, largura pintada 0px.
- Meio: `--scroll-p: 0.5`, escala 0.5, largura pintada 720px.
- Fim: `--scroll-p: 1`, escala 1, largura pintada 1440px.

O mesmo casamento exato foi medido no mobile 390px: 0 / 195 / 390px. Uma rota sem curso (`scrollHeight <= innerHeight`) permanece em 0 sem NaN.

**Navegação e movimento reduzido**
Navegação client-side home longa → política curta → home reinicia a barra em 0 e volta a acompanhar normalmente; nenhum reparo em `SmoothScroll` ou `PageTransition` foi necessário. Em `data-motion="reduce"`, Lenis não é criado e a barra continua acompanhando o scroll nativo — deliberadamente, porque é indicador informativo e não ornamento. Não há transition nem animation própria.

**Portões**
- `npx tsc --noEmit`: verde.
- `npm run build`: verde, 28 páginas.
- `npx eslint src scripts`: 0 erros; 16 avisos preexistentes.
- Copy-lock segue vermelho somente pelos dois fragmentos técnicos preexistentes de `ContactCTA*` e `RevealScope`; não foi atualizado.

A auditoria pré-despacho registrou o contrato: zero novo listener de scroll, zero estado React, zero Motion/GSAP; elemento `aria-hidden`; consumo de `--scroll-p` já publicado por `SmoothScroll`; Header em `fixed`, `top: 1rem`, `z-index: 50`.

### Conferência
Sem registro de conferência no Linear. A entrega declara fechamento sem conferência, a pedido da usuária.

### Arquivos tocados
- `src/components/ui/ScrollProgressBar.tsx`
- `src/app/layout.tsx`
- `src/app/globals.css`
- `scripts/medir-barra-progresso-sis278.mjs`
- `docs/medidas/barra-progresso-sis278/`

---

## SIS-272 — /eventos-inovacao · reveal on scroll (docs/scroll.md)

**Status:** Done · **Labels:** — · **Fechada em:** 15/09/2026 · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-272/eventos-inovacao-reveal-on-scroll-docsscrollmd

### Pedido
Aplicar reveal on scroll (`docs/scroll.md` / `RevealScope` + `data-reveal`) em `/eventos-inovacao`, alinhado a `/contato`, com calibre por scroll (SIS-269). `EventsSpotlight` já é cena sticky/IO própria — não pôr `transform`/reveal no wrapper do palco sticky; revelar cabeçalho, CTA, blocos fora do percurso sticky, ou filhos que não quebrem o sticky. Mobile carrossel (SIS-239/251): não duplicar entrada. Calibre: não disparar tudo no load. Aceite: blocos estáticos revelam ao rolar; Spotlight sticky intacto (sem regressão SIS-166/232/268); capturas; lint OK.

### O que foi feito
Relatório de entrega: fechada sem conferência, a pedido da usuária. Implementação validada ponta a ponta na página real.

**Marcação aplicada**
- `EventsSpotlight.tsx`: três `RevealScope` e quatro alvos `[data-reveal]`.
- Régua ciano no topo da cena: `line-up`.
- Contador `01 / 15 · ROLE PARA EXPLORAR`: `fade-up`.
- Cabeçalho da versão estreita: dois filhos `fade-up` escalonados.
- Calibre isolado em `src/app/eventos-inovacao/reveal-calibre.ts`.

Ficaram deliberadamente fora: wrapper sticky, palco, previews, cartão central e faixa do carrossel mobile. Assim não há segundo dono de `transform` nem entrada duplicada.

**Evidência por scroll**
Em 1440×900:
- cortina liberada em 1611ms;
- régua acendeu em 1661ms, no `scrollY: 0`;
- contador permaneceu oculto no load e acendeu somente em `scrollY: 500`;
- palco ficou preso por 7200px de rolagem e percorreu `01` a `15` normalmente.

No mobile, os escopos desktop não têm caixa (`display: none`) e o carrossel segue autônomo: `scrollLeft` avançou de 0 para 331 em 8s, sem `[data-reveal]` dentro da faixa ou dos controles.

**Segurança**
- `position: sticky` preservado;
- zero ancestrais transformados;
- geometria da SIS-268 preservada, sem previews sobrepostas;
- `prefers-reduced-motion` e `html[data-motion="reduce"]`: opacidade 1 e `transform: none` em todos os alvos.

**Portões**
- `npx tsc --noEmit`: verde.
- `npm run build`: verde; rota continua estática.
- `npx eslint src scripts`: 0 erros (16 avisos preexistentes).
- O lint global continua encontrando 31 erros somente em `.claude/worktrees/.../.next/**`, artefatos de outra frente.
- Copy-lock continua vermelho por literais de `ContactCTA*.tsx` e `RevealScope.tsx`, de outras frentes; nenhum arquivo desta issue adicionou copy.

A auditoria pré-despacho corrigiu duas premissas: o bloqueio da SIS-269 já caiu (`src/app/contato/reveal-calibre.ts` com `rootMargin: 0px 0px -12% 0px`, limiar `0.15`); a rota não tem CTA estático ativo, então “revelar CTA” não se aplica. Contrato: jamais reveal/transform no wrapper sticky; não dar segunda entrada a previews, cartão central ou carrossel mobile; não revelar o hero/LCP de novo; comprovar cadência por `scrollY`.

### Conferência
Sem registro de conferência no Linear. A entrega declara fechamento sem conferência, a pedido da usuária.

### Arquivos tocados
- `src/components/EventsSpotlight.tsx`
- `src/app/eventos-inovacao/reveal-calibre.ts`
- `src/app/eventos-inovacao/page.tsx`
- `src/components/events-spotlight.css` (bloco aditivo)
- `scripts/medir-reveal-eventos-sis272.mjs`
- `docs/medidas/reveal-eventos-sis272.json`

---

## SIS-268 — /eventos-inovacao · aproximar ainda mais as previews do card central

**Status:** Done · **Labels:** — · **Fechada em:** 15/09/2026 · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-268/eventos-inovacao-aproximar-ainda-mais-as-previews-do-card-central

### Pedido
Em `/eventos-inovacao` (`EventsSpotlight`), aproximar ainda mais as miniaturas laterais da imagem/cartão principal. A SIS-232 estreitou a banda de recuo `left`/`right` das vagas (14–26%) sem mexer em `--evt-faixa-w` nem nos insets das colunas; esta issue é só o vão coluna ↔ card. Onde mexer: `src/components/events-spotlight.css` — `.eventos-destaque-coluna--esq` / `--dir` (`left`/`right: clamp(7.5rem, 8.5vw, 10rem)`), banda `%` das `.eventos-vaga`, eventualmente miolo do cartão. Revalidar com sonda: zero sobreposição vaga↔cartão / vaga↔vaga; fio ciano `--destaque` coerente; 1024 e 1366. Em 1440, o vão deve cair de forma óbvia vs. o print pós-232. Fora de escopo: copy/YouTube, bandas navy, carrossel mobile, reabrir “maiores” como meta. Aceite: previews claramente mais perto; sem sobreposição; rótulos inteiros; fio OK; capturas antes/depois 1440 (+ 1024 se mexer no piso); lint OK.

### O que foi feito
Várias passagens no Linear, todas em `src/components/events-spotlight.css`.

**Primeira entrega (fechada sem conferência, a pedido da usuária).** A aproximação não veio de estreitar mais a banda de recuo (a SIS-232 já tinha chegado ao fio dela), mas de inverter a âncora das vagas: as duas colunas passam a encostar na borda da faixa virada para o cartão, e o recuo do `nth-child` só sabe afastar. Com isso a largura da miniatura sai da conta da distância — antes a vaga ímpar (`--evt-prof: .86`, ~37px mais estreita em 1440) somava recuo maior com largura menor e ficava a 101px do cartão enquanto a par estava a 26px.

1. **Âncora invertida.** `margin-left: auto` saiu de `--dir` e foi para `--esq`; a banda passou de `left/right: 14–26%` (borda externa) para `right/left: 1–9%` (borda interna). O defeito da SIS-204 — recuo empurrando a miniatura para cima do cartão — deixa de ser aritmética e passa a ser impossível por construção.
2. **Faixa transladada, não alargada.** Inset `clamp(7.5rem, 8.5vw, 10rem)` → `clamp(7.5rem, 8.9vw, 10.5rem)`. A folga contra o `ScrollSpy` sobe de 30 para 36px em 1440. Em 1024 e 1280 nada se move — governa a perna mínima de 7,5rem.
3. **Piso da banda em 1% e não 2%**, porque em 1366 com 2% a vaga mais próxima ficava 2,5px mais longe do que antes da issue.
4. **Ritmo irregular preservado**, espelhado dentro de cada paridade (16/14/17/14 → 8/9/7/9 · 25/26/24/26 → 2/1/3/1). Amplitude do zigue-zague de ~69px para ~19px em 1440.

Medido pela sonda, seis janelas (1024 · 1280 · 1366 · 1440 · 1600 · 1670): em 1440 esq o vão da vaga mais distante 101,5 → **44,0** px; mais próxima em repouso 25,8 → 12,6; no pior quadro da flutuação 16,8 → **3,6**. 1440 dir: 99,9 → **41,9**; 29,3 → 18,8; 20,3 → **9,8**. 1024 esq: 75,2 → **35,0**; 27,6 → 11,5; 18,6 → **2,5**. 1366 esq: 98,8 → **55,5**; 26,9 → 26,4; 17,9 → 17,4. Zero `vagasCobrindoCartao`, `rotulosCortados` ou `paresApertados`. Transbordo externo negativo (folga) maior que antes (−34,5 → −64,3 em 1440). `tsc --noEmit` limpo. `eslint .` sem achado novo (79: 31 erros / 48 avisos pré-existentes). `npm run test:copy` falha por literal de `RevealScope.tsx:59` (`portao?.liberado ?? true`, commit `13224ec` / SIS-263), fora desta issue.

Sugestões não executadas na primeira passagem: folga mínima fina na flutuação (3,6px em 1440 e 2,5px em 1024); nota CSS com número velho (21,4px vs. 12,6 medidos); 1366 mal se moveu na vaga mais próxima.

**Reparo visual após retorno da usuária — sem conferência.** Pedido: manter previews horizontalmente próximas; espalhá-las mais verticalmente; zero sobreposição; validar 1024/1366/1440. Aplicado: colunas ancoradas na largura do cartão; faixa vertical ampliada; fio ciano corrigido para terminar antes da borda do cartão. Folga faixa↔cartão: **18,3–18,4px** em todas as janelas de 1024 a 1920 (antes 79,1px em 1600 e 95,7px em 1670). Vão vertical médio à esquerda: 1024 16,2 → **25,5px**; 1366 7,6 → **16,5px**; 1440 10,1 → **21,7px**; 1600 8,0 → **20,6px**; 1670 11,1 → **23,3px**. Sobreposição preview↔preview e preview↔cartão: **0**. No pior quadro da flutuação restam ~**11px** até o cartão. `npm run build` verde. Pasta `.tmp-sis268/` apagada a pedido da usuária.

**3º ajuste — afastar levemente e dar contraste perto/longe.** Pedido da usuária: “afaste levemente os preview mas levemente e deixe um mais perto um mais longe levemente”. `--evt-folga-cartao`: `1.15rem` → **`1.45rem`** (18,4 → 23,2px). Banda de recuo: pares (`--evt-prof: 1.06`) de `0.01–0.03` para `0.02–0.04`; ímpares (`0.86`) de `0.07–0.09` para `0.10–0.12`. `--evt-faixa-estiro` e `--evt-passo` intactos. Medido perto–longe / amplitude: 1024×768 20,0–32,6 → **26,3–42,1** (12,6 → **15,8**); 1366×768 20,8–40,1 → **28,0–52,2** (19,3 → **24,2**); 1440×900 21,1–42,8 → **28,6–55,7** (21,7 → **27,1**); 1600×900 21,1–43,1 → **28,7–56,1** (22,0 → **27,5**); 1670×940 21,3–44,2 → **28,9–57,6** (22,9 → **28,7**). Piso subiu 6,3–7,6px. Margem no pior quadro: 1024 10,1px → **16,5px**; 1440 11,0px → **18,5px**. Recuo máximo 0,12 contra teto 0,263 em 1366. Folga contra o `ScrollSpy`: 87,6px em 1440, 142px em 1366, 157,9px em 1600, 183,7px em 1670. Fio ciano continua morrendo 1px antes da borda do cartão. `npx tsc --noEmit` verde; `npm run build` verde; `npx eslint src scripts` 0 erros (16 avisos preexistentes). Evidência em `docs/medidas/sis268-calibre-{antes,depois}.json` e dez capturas `docs/capturas/sis268-calibre-*`.

### Conferência
Sem registro de conferência no Linear. As entregas declaram fechamento sem conferência, a pedido da usuária.

### Arquivos tocados
- `src/components/events-spotlight.css`
- `docs/medidas/sis268-calibre-antes.json`
- `docs/medidas/sis268-calibre-depois.json`
- `docs/capturas/sis268-calibre-*`

---

## SIS-267 — Arte · logo Picsel em alta qualidade (PNG + transparente)

**Status:** Done · **Labels:** — · **Fechada em:** 15/09/2026 · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-267/arte-logo-picsel-em-alta-qualidade-png-transparente

### Pedido
Backlog da Maria — conteúdo/arte. Não despachar ao executor até existirem PNGs HD no repo. Obter a logo Picsel em alta qualidade e substituir `public/images/Picsel-logo.png` (card parceiro, `src/data/partners.ts`) e `public/images/Picsel-logo-transparente.png` (BrandGrid / `src/data/clients.ts`, variante da SIS-91). Entregar PNG vetorial-nítido (ou export HD ≥2×), variante com fundo transparente de verdade, trocar os dois caminhos, conferir contraste no BrandGrid e no card. Os dois PNGs já existem mas estão pixelados; a transparente foi derivada do opaco, não é arte oficial HD. Fora de escopo: redesign do card / outras logos. Aceite: arquivos HD no lugar; transparente sem caixa de fundo; nítida a 1440; lint OK.

### O que foi feito
Sem relatório de entrega no Linear.
O histórico de estados só registra passagem de Backlog (desde 15/09/2026 13:32 UTC) direto para Done em 15/09/2026 18:39 UTC, sem In Progress, In Review nem comentários.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
Não declarados no relatório.

---

## SIS-254 — /esg SOCIAL · foguete do scroll = foguete.png (substitui SVG atual)

**Status:** Done · **Labels:** — · **Fechada em:** 14/09/2026 · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-254/esg-social-foguete-do-scroll-foguetepng-substitui-svg-atual

### Pedido
Na seção SOCIAL de `/esg`, o foguete que acompanha o scroll (`FogueteScroll`) deve substituir o SVG interno por `public/images/esg/foguete.png`. Manter trajeto, sticky/progresso e reduced-motion. Componente em `src/components/ui/FogueteScroll.tsx`; montado em `src/app/esg/page.tsx`. Preferir `next/image`; preservar wrapper de scroll, `aria-hidden`, `pointer-events-none`, z-index atrás do texto. Ajustar tamanho/aspecto; medir contraste AA do texto SOCIAL no pior ponto (390 / 1024 / 1440). Se 1,7 MB for pesado, servir WebP. Reduce: foguete parado e visível no meio do trajeto. Pedido extra (14/09/2026): movimentar-se mais pela seção (curso vertical e, se couber, lateral), ainda confinado a SOCIAL (SIS-207). Fora de escopo: selo Gerando Talentos, fotos/cards SOCIAL, ENVIRONMENT / GOVERNANCE. Aceite: arte visível é `foguete.png`; acompanha o scroll; trajeto no miolo; texto AA; reduce parado e visível; capturas; lint OK.

### O que foi feito
Comentário de entrega (sem heading `## Entrega`): SVG saiu. Scroll serve `public/images/esg/foguete-scroll.webp` (360×1044, 57.128 B, alfa). PNG fonte (~1,68 MB) não vai no request.

**Trajeto (pedido extra).** Curso `[-34, 28, -6]svh` → 6 pontos / 112svh: `[-60, -22, 52, 18, -18, 18]svh`. Lateral máx. 4% → 22vw. Presença medida 11/11 passos em 390/1024/1440 (começo, miolo, fim). Recorte `overflow-clip`; 0 px nas seções vizinhas.

**Contraste sob a arte.** 4,56:1 / 4,63:1 / 4,64:1. Opacidade 0,14 (PNG 3D opaco).

**Reduce.** Parado visível no miolo (`18svh`, `-12vw`).

**Portões.** tsc OK. Lint dos arquivos da issue OK. `npm run lint` vermelho por `scripts/medir-indicadores-sis256.mjs` (concorrente, fora de escopo). Build não rodado para não disputar `.next`.

Capturas: `docs/capturas/sis254-final-{390,1440}-p{2,5,8}.png`.

Após a conferência reprovada (arte ilegível em `opacity-[0.14]`), a usuária pediu opacidade maior em comentários sucessivos: camada de volume `0,08` → `0,28` (cor segue `0,95`); depois “levemente opaco” `0,28` → **`0,18`**; depois “subir um pouco” para **`0,24`**. Fechamento: WebP no scroll (não o SVG); trajeto pelo miolo da SOCIAL; reduce parado; camada de cor `0,95` + volume **`0,24`**. Contraste em `0,24` não foi re-medido nesta última passada.

### Conferência
**VEREDITO: REPROVADO** (rodada 1/3). A troca de arquivo está feita (WebP, sem SVG, curso no miolo, AA ≥ 4,5:1, reduce parado, sem vazamento). O que falha é a leitura da arte: em 0,14 o shuttle 3D some no miolo (capturas p5 390/1440: mancha pastel). Reparo pedido em `src/components/ui/FogueteScroll.tsx` (`opacity-[0.14]`): parecer o `foguete.png` (nariz laranja, boosters azuis, chamas) e manter ≥ 4,5:1 sob glifo. Prova: capturas 390/1440 no passo do miolo com arte reconhecível; script de contraste ainda ≥ 4,5:1 nas três larguras. Não é reparo: vaivém do `y` (3 inversões) atende o extra “mais curso”; lint global de `medir-indicadores-sis256.mjs`; 3,78:1 nos cards Huerta/Aguas. Não há segundo comentário de conferência após os ajustes de opacidade; a usuária validou o visual (“ficou bom”) e pediu para fechar, sem nova conferência.

### Arquivos tocados
- `src/components/ui/FogueteScroll.tsx`
- `public/images/esg/foguete-scroll.webp`
- `docs/capturas/sis254-final-{390,1440}-p{2,5,8}.png`

---

## SIS-245 — /contato · Onde Estamos: endereço Pato Branco, sem link RJ, mapa azul mais claro

**Status:** Done · **Labels:** conferir · **Fechada em:** 14/09/2026 · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-245/contato-onde-estamos-endereco-pato-branco-sem-link-rj-mapa-azul-mais

### Pedido
Em `/contato` → Onde Estamos (`UnitsMap` + lista): (1) Pato Branco com endereço «R. Tamôio, 1495 - Centro, Pato Branco - PR, 85501-031» e Maps (pin/centro/zoom) nesse local; (2) Rio de Janeiro: remover o link para o Maps no card (SP e PB podem manter o CTA); (3) estilo do mapa: azul um pouco mais claro e um pouco de branco (`UnitsMap` + `mapaEstiloEscuro.ts`). Dados em `src/data/contact.ts`. Copy-lock: endereço PB é pedido explícito da usuária. Fora de escopo: SIS-222, trocar provider, redesign. Aceite: PB com Tamôio e mapa apontando para lá; RJ sem link; mapa mais claro e ainda legível; SP inalterado no essencial; capturas; lint OK.

### O que foi feito
Relatório item por item (comentário de entrega).

**1. Pato Branco com endereço e pino no lugar** — `src/data/contact.ts`. Unidade `pr` recebeu `address: 'R. Tamôio, 1495 - Centro, Pato Branco - PR, 85501-031'` (circunflexo de «Tamôio», que o OSM grafa sem). Coordenadas medidas via Nominatim/Overpass: o 1495 não existe como ponto no OSM; interpolação entre 584 (−26.2287966, −52.6739046) e 1706 (−26.2200085, −52.6802556) → **lat −26.2217 / lon −52.6791**. `zoom: 12` → **`zoom: 16`**, o mesmo de São Paulo (zoom de rua, não de fachada). Valores antigos comentados. Cabeçalho do arquivo que dizia que PB e RJ ficam sem endereço foi comentado e anotado: o endereço de PB veio da Sistran nesta issue, não de `.claude/conteudo-site/09-contato.md:25`.

**2. Rio sem link de rota** — `src/components/UnitsMap.tsx`. O CTA passou a depender de `unidade.address`. Queda para a cidade permanece em `mapsHref` (função total). Medido por `getByRole('link')`: São Paulo 1 link; Pato Branco 1 link; Rio de Janeiro 0 links, texto «Endereço não divulgado. O mapa mostra a cidade, não o escritório.»

**3. Azul mais claro com toque de branco.** Degrau ativo é MapLibre + OpenFreeMap (não há `NEXT_PUBLIC_GOOGLE_MAPS_KEY`). Principal em `src/data/mapaEstiloEscuro.ts`; três degraus em sincronia. Valores: fundo `#0e1b2e` → `#16304d`; água `#062036` → `#0e3a5c`; via local `#17293f` → `#24425f`; arterial `#1d3350` → `#2e5175`; expressa `#25456b` → `#3d6b96`; limite `#1f3a5c` → `#325a85`; prédio `#16273e` → `#254a6e`; parque/mata `#102a24` → `#173d33`; rótulo `#8ab4d8` → `#c9def0`; rua `#7fa6c8` → `#aecbe2`; cidade `#a9cbe6` → `#e6f2fc`; rótulo d'água `#3d7ba8` → `#79aed6`; contorno do rótulo `#0a1526` → `#0b1b2c`. `ESTILO_ESCURO` em `UnitsMap.tsx` (Google, dormente): os mesmos treze valores. Mosaico raster: `brightness(0.85)` → `brightness(1)`. Toque de branco nos rótulos e no realce dos prédios, não no fundo.

**4. Extra: troca de unidade com gesto GSAP.** `gsap.from`, `stagger: 0.06`, 0.42s, sem `ScrollTrigger`/`pin`. Com movimento reduzido a animação não é criada; painel aparece pronto inclusive sem JS. `clearProps` no fim.

**Portões.** `npm run lint` → 22 problemas, 0 erros (avisos pré-existentes, nenhum nos arquivos desta issue). `npx tsc --noEmit` limpo. `npm run test:copy` acusou 2 textos novos (endereço de PB e ruído `opacity,transform` de `clearProps`); `npm run copy-lock` → 1654 textos travados; `test:copy` de novo → OK (1193 distintos).

**Capturas.** Script `scripts/capturar-onde-estamos-sis245.mjs`; imagens em `docs/capturas/sis245-{paulo,branco,janeiro}-1440.png` (1440×900). Espera do script subiu de 4,5s para 9s porque o `flyTo` para zoom 16 terminava antes dos tiles.

Fora de escopo: SIS-222, provedor, redesenho.

### Conferência
Sem registro de conferência no Linear. A issue permanece com a label `conferir`.

### Arquivos tocados
- `src/data/contact.ts`
- `src/components/UnitsMap.tsx`
- `src/data/mapaEstiloEscuro.ts`
- `scripts/capturar-onde-estamos-sis245.mjs`
- `docs/capturas/sis245-{paulo,branco,janeiro}-1440.png`

---

## SIS-238 — /quem-somos · Premiações: fundo cele.png + layout escritas/logo (exemplcelent)

**Status:** Done · **Labels:** conferir · **Fechada em:** 11/09/2026 · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-238/quem-somos-premiacoes-fundo-celepng-layout-escritaslogo-exemplcelent

### Pedido
Em `/quem-somos` → Premiações (`RecognitionTheater` / `#premiacoes`), retirar as imagens atuais do bloco Celent (troféu + arte LATAM da SIS-230) e montar: fundo `public/cele.png`; logo `public/logo-Celent.png`; formato das escritas como `public/exemplcelent.png`. Copy: «A Sistran foi reconhecida pela Celent com o Technology Standout 2023.» e «A mais alta categoria no quesito tecnologia». Derivar WebP; não publicar «TECNOLOGIA QUE IMPULSIONA O AMANHÃ» se só existir na mock. Teatro sticky dos quatro reconhecimentos continua; mobile legível; contraste e reduce OK. Fora de escopo: percurso 01–04; SIS-221. Aceite: bloco Celent com `cele.png` + logo + textos no formato da referência; troféu/LATAM da SIS-230 não aparecem; copy intacta; peso razoável; mobile + contraste; teatro intacto; capturas; lint OK.

### O que foi feito
Relatório item por item.

**1. Parar de montar `trofeu.webp` / `celentlatam.webp`.** Saíram do TSX os nós `.rec-celent-trofeu`, `.rec-latam`, `.rec-celent-texto`, `.rec-celent-chip` e o fundo navy `.rec-abertura-fundo`. Arquivos continuam no repo; `alt` comentados em `REC_CELENT`. Grep só devolve comentários.

**2. `cele.png` como fundo + WebP derivado.** `scripts/otimizar-capa-celent-sis238.mjs` (sharp, `quality: 80, smartSubsample`). `public/cele.png` → `public/images/quem-somos/celent-capa.webp`: 1672×941, **1460 kB → 79 kB (−95%)**. Capa `object-fit: cover` em toda a faixa a partir de 1024px.

**3. Arranjo de `exemplcelent.png`.** Coluna tipográfica à esquerda: eyebrow, h2, fio vertical + `logo-Celent.png`, as duas frases. Faixa invertida para clara, tinta navy (fatia 0–26% da largura mede rgb(222 240 253), luminância 0.85; texto branco ~1.2:1). Emenda com `.rec-capa-emenda`, degradê até `--palco-fundo`.

**4. `alt` da capa** descritivo. `logoAlt` de `'Celent'` para `'Celent — Technology Standout 2023'`.

**5. «TECNOLOGIA QUE IMPULSIONA O AMANHÃ»** não publicada — não está queimada em `cele.png` nem em conteúdo-site.

**6. Teatro, mobile, contraste, reduce.** Teatro intacto (captura 390: «NOSSA TRAJETÓRIA» e 01–04). Abaixo de 1024px a capa não cobre: tira no fluxo (`contain`, `aspect-ratio: 1672/941`). Contraste (`scripts/medir-contraste-celent-sis238.mjs`, Playwright `deviceScaleFactor: 2`): eyebrow 9.38:1 / 6.34:1; título 11.96:1 / 11.24:1; linha1 11.92:1 / 11.23:1; linha2 7.44:1 / 7.07:1 (1440 / 390). Oito medições OK. `scrollWidth == clientWidth` em 1440 e 390. Reduce: cinco nós da coluna com `opacity: 1` e `transform: none` nas duas fontes de preferência.

**7. Capturas e lint.** Capturas 1440 e 390, antes e depois, em `docs/capturas/`. `npm run lint`: 22 warnings, 0 errors. `npx tsc --noEmit` sem saída.

Bugs corrigidos no caminho: `inset: 0` em filho `absolute` de container `grid` não resolve contra a faixa — só `grid-row: auto` devolve os 806px; `padding-block` do desktop desceu para `.rec-wrap`. Altura da faixa derivada da arte: `min-height: clamp(540px, 56vw, 880px)`; `object-position: 62% 22%`.

Fora de escopo registrado: `ScrollSpy` com `tom` por seção não expressa faixa metade clara / teatro navy; sugerida issue própria.

### Conferência
Sem registro de conferência no Linear. A issue permanece com a label `conferir`.

### Arquivos tocados
- `src/components/RecognitionTheater.tsx` (implícito no relatório: nós `.rec-*` e `REC_CELENT`)
- `scripts/otimizar-capa-celent-sis238.mjs`
- `scripts/medir-contraste-celent-sis238.mjs`
- `public/images/quem-somos/celent-capa.webp`
- `docs/capturas/`

---

## SIS-165 — Números: refazer a seção "Sistran em números" exatamente como numeros.png

**Status:** Done · **Labels:** — · **Fechada em:** 07/09/2026 · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-165/numeros-refazer-a-secao-sistran-em-numeros-exatamente-como-numerospng

### Pedido
Refazer a seção dos sete indicadores exatamente como `public/imagensexemplo/numeros.png`: sobretítulo `SISTRAN EM NÚMEROS`; título serifado “Resultados que constroem nossa história” com `história` em ciano; parágrafo de apoio; sete indicadores numa linha com fios, número serifado, `+` ciano, halo, rótulo; eixo com sete pontos (seis acesos, último vazado); três microrrótulos; fundo navy com foto, curvas e malha. Onde: `Metrics.tsx`, `metrics.ts`, `globals.css`, `ProofJourney.tsx`. Pontos críticos: decidir se desliga o modo dirigido (340vh) em desktop; comentar o que sair; possível revelação vs. composição fixa; duplicata `23+23+` no DOM; conflito de serifa com SIS-155; remedir contraste vs. SIS-61; `caption` comentadas, não apagadas; textos novos precisam de origem (Regra Zero); layout 320–1670; reduce com valor final, nunca 0. Aceite inclui decisão do item 1 registrada; contraste anotado; `npm run build` limpo; o que sair comentado no lugar.

### O que foi feito
**Decisão do item 1 (registrada):** os sete indicadores ficam numa fileira única, sempre no mesmo lugar, e se acendem conforme a rolagem sobre essa linha estática (leitura (b) do item 3). O modo dirigido saiu de desktop: 340vh, interior `sticky`, trilha horizontal, lente, onda, nós, faixa de atalhos e marcador `03 / 07` — tudo comentado no lugar, com motivo e valores, no TSX e no CSS. O gate virou `const dirigindo: boolean = false;` em `Metrics.tsx`.

**Contraste** — medido com `docs/medidas/sis165/contraste.mjs`, sobre o navy `#041b3d`. Sobretítulo `SISTRAN EM NÚMEROS` **12,55:1** (piso 4,5); `seguros.` serifada ciano **8,77:1**; `ROLE PARA REVELAR` **9,24:1**; rótulo **11,52:1**; número **11,20:1** (piso 3,0); `+` ciano **11,93:1**; estado apagado (0.55) **5,69:1 / 4,59:1**. O piso de opacidade é 0.55 e não 0.45 — em 0.45 dá 4,21:1 / 3,58:1 e reprova. Armadilhas documentadas no CSS: `ROLE PARA REVELAR` lia 2,32:1 por causa de `.impact-role-fio` no rect; número e `+` liam 1,00:1 por `background-clip: text`.

**Layout** — `docs/medidas/sis165/probe.mjs`. Colunas **1 / 2 / 4 / 7 / 7 / 7** em 320 / 768 / 1024 / 1280 / 1440 / 1670. Sem rolagem horizontal. Rótulo nunca abaixo de **16px** (`0.95rem` → `1rem`). Em 1280+ quem cede é o número: `clamp(2rem, 4.2cqi + 1.4rem, 3rem)` via container query. Pior caso “Mil horas de Capacidade Produtiva no Brasil”: 4 linhas em 1280, 2 linhas em 320.

**Acessibilidade e movimento** — `docs/medidas/sis165/comportamento.mjs`. `data-observando` só é escrito depois da primeira conferência de rect; sem JS / reduce os sete ficam acesos com o valor final. O `Set` só cresce. Pulo por cima da seção: zero indicadores apagados e zero valores em 0. `IntersectionObserver` trocado por `getBoundingClientRect` no `scroll` (passivo; o ouvinte se remove quando o sétimo acende).

**Item 4.** Duplicação `23+23+` não é defeito: gabarito de largura. `textContent` dá `"919850"`, `innerText` dá `"850"`, gabarito em `visibility: hidden` + `aria-hidden`. AT anuncia um número.

**Item 12.** `geometria.ts` continua com consumidor vivo: `coord` usado por `ImpactVisuais.tsx` também no modo lista.

**Regra Zero (item 8).** Parágrafo de apoio e os três microrrótulos não entraram; lugar reservado em `Metrics.tsx:927-945`. Título segue “Escala que transforma o mercado de seguros.” com a última palavra em ciano. `ROLE PARA REVELAR` entrou como instrução de interface. Sete `caption` comentadas em `metrics.ts:32,40,48,56,64,72,80`. Sem foto de prédio: curvas e malha são CSS/SVG `aria-hidden`. Serifada peso real 400 e `font-synthesis: none` (`Instrument Serif`).

**Portões.** `tsc --noEmit` silencioso · `eslint` 18 avisos / 0 erros · `next build` exit 0 · dev `/` 200.

Decisões pré-despacho (comentários na issue): item 8 estacionado; item 11 sem foto do prédio; item 5 serifa fica por precedente da SIS-155 estacionada; `ATERRAR_INICIO` não existe mais (`ETAPAS_FIM_PADRAO = 0.94` + medição); rodapé da home é `BrandGrid`, não `SignalMarquee`.

### Conferência
Aprovada. Construção verificada na árvore. `conferir` removido, **Done**. Confere: captions comentadas; alcançabilidade por construção (`.impact-lista[data-observando]`); piso 0,55 justificado (5,69:1 / 4,59:1); colunas 1/2/4/7; item 4 encerrado; `geometria.ts` com consumidor. Adendos: `SmoothScroll.tsx:103-104` registra que `window.scrollY` fica atrasado no Lenis — `getBoundingClientRect` é imune; gabarito de 23 rende **25**, não 23. Nenhuma pendência funcional. Estacionado com quem pede: cinco escritas do item 8 e a decisão de o modo dirigido de 340vh ficar fora para sempre ou voltar.

### Arquivos tocados
- `src/components/Metrics.tsx`
- `src/data/metrics.ts`
- `src/app/globals.css`
- `src/components/ImpactVisuais.tsx`
- `docs/medidas/sis165/contraste.mjs`
- `docs/medidas/sis165/probe.mjs`
- `docs/medidas/sis165/comportamento.mjs`

---

## SIS-161 — /quem-somos — deixar a seção de escritórios exatamente igual à referência mapaescritorio.png

**Status:** Done · **Labels:** — · **Fechada em:** 07/09/2026 · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-161/quem-somos-deixar-a-secao-de-escritorios-exatamente-igual-a-referencia

### Pedido
A seção “Escritórios BRASIL” de `/quem-somos` deve ficar exatamente igual a `public/imagensexemplo/mapaescritorio.png`: coluna esquerda (olho, título, régua, abas em pílula, linha com ponto, cartão); direita mapa do Brasil com divisas, dois pinos, rota pontilhada, legenda `PATO BRANCO – PR / 26.229° S · 52.671° W`; fundo claro com curvas e anéis; sem prédio 3D. Onde: `OfficesScene.tsx`, `BrazilOfficesMap.tsx`, `globals.css` (`.bm-*`, `.os-*`), `quem-somos/page.tsx`. Decidir destino da partitura de rolagem e da torre 3D. Divisas no mesmo `viewBox="0 0 720 640"`. Abas com `role="tablist"`, `aria-selected`, alvo 44px. Abaixo de 1024px e reduce: seção completa. Contraste AA. O que sair comentado no lugar. Aceite: composição de uma tela em largo; divisas alinhadas; fundo decorativo `aria-hidden`; rota pontilhada; legenda junto ao pino sem regressão SIS-96; cartão à esquerda; teclado; `npm run build` e `npm run lint`.

### O que foi feito
Cena refeita em `OfficesScene.tsx` / `BrazilOfficesMap.tsx` / `globals.css`.

**Decisões (pontos 1, 2 e 9).** A partitura virou só a ENTRADA: `ENTRADA_DURACAO = 3.2` escreve `--os-contorno`, `--os-entrada`, `--os-divisas`, `--os-rota` e `--os-p`; termina em `escrever(1)` e a troca é por aba. Guarda: se a seção já está na tela, a entrada parte na hora (`escrever(0)` deixaria o mapa em branco). Torre 3D saiu, comentada. Rota pontilhada; pulso removido.

**Divisas (ponto 3).** `scripts/gerar-divisas-brasil.mjs`, mesmo `viewBox` 0 0 720 640 — `escalaX 12,45` / `escalaY 13,113`, caixa geográfica `lon −73,99…−34,79` / `lat −33,75…5,27`. Só fronteiras compartilhadas, nunca a costa. 65 polilinhas, 608 pontos, `d` de 7 050 caracteres (`TOLERANCIA = 0,9`, `MINIMO = 4`). Curvas de relevo comentadas (eram o substituto).

**Bugs de layout achados pela sonda.** (1) `.bm-palco` ainda `position: absolute; inset: 0` — `.os-mapa` colapsava para 806×0 e o mapa pintava 1642×730 a partir de x = −74; corrigido com `position: relative; inset: auto`. (2) Câmera vazava 42px para dentro do texto; `.os-mapa` passou a `overflow: clip`.

**Contraste AA** — `scripts/medir-contraste-escritorios.mjs`. Zero reprovações finais: 11 alvos × 4 larguras (1024/1366/1440/1728) × 2 abas. Aba ativa 5,01–5,16; inativa 10,30–10,38; olho 13,17–13,26; título `Escritórios` 13,24; `BRASIL` 3,24 (piso 3,0); nome no cartão 15,37–15,56; texto 9,30–9,43; rótulo PR / coordenada 10,87–11,29 / 5,26–5,86. Três reprovações reais corrigidas: rótulo PB a 1,02:1 (letras sobre navy; `H392` → `H412`, x=396 → x=416); `BRASIL` a 2,95:1 (máscara `linear-gradient(90deg, transparent 0 44%, #000 62%)`); etiqueta PR a 1,65:1 no trecho SP (recuo `g[data-cidade="pr"]:not(.bm-rotulo)`). SIS-96: rótulo não nasce atrás do cartão. Pinos: ativa tríade halo/anel/nucleo; inativa `bm-gota`. Abas `min-height: 44px`; `:focus-visible { outline: 2px solid #0ed8f6; outline-offset: 3px }`. Título mudou de casa sem mudar `id` (`aria-labelledby="escritorios"`). `.section-light .text-gradient-brand` termina em `#7c3aed` — não mexido (global).

**Portões da primeira entrega.** `npx tsc --noEmit` limpo · eslint 18 avisos / 0 erros · `npx next build` exit 0 · `/quem-somos` 200. Aviso: build passou com comentário CSS aninhado que fazia o `next dev` devolver 500.

**Adendo após conferência (padrão de abas).** Abas ganharam `id={`os-aba-${c.id}`}`; painéis `role="tabpanel"` + `aria-labelledby`. `inert` + `aria-hidden` no escondido, não `hidden` (mesma célula de grade, altura do mais alto). Medido 1440×900: ambos painéis 604px; 390×844 modo lista: zero `role="tab"`, cidades empilhadas 538 e 489.

**Reparo após devolução (mapa cortado).** Duas causas: (A) câmera na `transform` de `.bm-mapa` — passou para `<g class="bm-camera">` dentro do SVG; folga coluna 41 / 54,6 / 57,6 / 66,8px em 1024 / 1366 / 1440 / 1670. (B) `--os-foco-y`: `pr` −5% → −1%; `sp` −2% → +3%. `paisCortado: false` nas oito combinações; respiro topo 5,1–11,7px, embaixo 34,6–81,9px. Olho `ESCRITÓRIOS` passou a `aria-hidden`. Texto do `<title>` do SVG mudou para `<span id="bm-titulo" className="sr-only">` fora do SVG (tooltip nativa = 0). Reduce: `.bm-camera` não recebe `transform` porque a regra é `[data-modo="scroll"]`. Portões do reparo: tsc silencioso · eslint 18/0 · `next build` exit 0 · `/quem-somos` 200.

### Conferência
Primeira conferência: **APROVADA, com UM adendo** — padrão de abas incompleto (`tabpanel` ausente; inativo só com `opacity: 0`, as duas cidades anunciadas). Etiqueta `conferir` retirada; ficou In Review até o adendo. Adendo implementado (ver acima). Depois, devolução por quem pediu: mapa cortado em cima e embaixo (escala efetiva 1,14 / 1,22 em repouso + `overflow: clip`); olho duplicado; tooltip nativa — **não era a conferência completa**. Após o reparo: **aprovada, com um adendo de comentário** (`globals.css:5656-5658` ainda diz que o bloco zera a câmera, mas a câmera não mora mais em `.bm-mapa`; não é defeito funcional). `conferir` removido, **Done**. Folgas e portões citados são relato do agente; sondas em `docs/medidas/sis161/`.

### Arquivos tocados
- `src/components/ui/OfficesScene.tsx`
- `src/components/ui/BrazilOfficesMap.tsx`
- `src/app/globals.css`
- `src/app/quem-somos/page.tsx`
- `scripts/gerar-divisas-brasil.mjs`
- `scripts/medir-contraste-escritorios.mjs`
- `docs/medidas/sis161-contraste.json`
- `docs/medidas/sis161/` (`nome-acessivel.mjs`, `recorte.mjs`, `recorte-pais.mjs`)

---

## SIS-98 — Seção “Nossa essência”: só dá para ler parte da Missão — o scroll já abre o próximo item

**Status:** Done · **Labels:** — · **Fechada em:** 01/09/2026 · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-98/secao-nossa-essencia-so-da-para-ler-parte-da-missao-o-scroll-ja-abre-o

### Pedido
Na seção Nossa essência, o item Missão não pode ser lido por inteiro: o texto é cortado no rodapé e, ao rolar para continuar, o próximo item já abre (gesto de “ler mais” vira “avançar”). Comportamento desejado: ler o item do começo ao fim e só depois avançar; painel cabe na viewport ou rola internamente; alternativa: acordeão por clique. Título “Missão” duplicado (faixa + painel) — definir qual permanece. Testar 1366×768 e menores; repetir em Visão/Valores; reduce e teclado. Aceite: Missão inteira sem abrir o próximo; painel cabe ou rola; troca só após o fim; título não duplicado; 1920×1080, 1366×768 e mobile; reduce; teclado.

### O que foi feito
Resolvido em `src/components/EssenceAccordion.tsx` e `src/components/essence-accordion.css`.

**Causa raiz:** `ativa` tinha dois donos. Além do clique, um ScrollTrigger derivava a faixa aberta da posição de rolagem (SIS-79). Como a seção mede mais de uma tela, o painel aberto fica abaixo da dobra — e o gesto de “continuar lendo a Missão” era o mesmo que trocava para Valores. O avanço por rolagem saiu; o dono de `ativa` volta a ser só o clique/teclado.

**Causas secundárias:** `min-height: 430px` fixo + até 172px de padding passava de 600px de painel. Num 1366×768, com as três faixas (~350px) e o cabeçalho fixo, a Missão terminava cortada. Agora `min(430px, 43vh)`, mais `@media (min-width: 768px) and (max-height: 860px)` que encolhe só o respiro. O `h3` dentro do painel (título duplicado) foi removido.

Abrir uma faixa agora traz a faixa para a tela via `__lenis.scrollTo` (Lenis ignora `window.scrollTo` feito por fora — medido, a página não saía do lugar e os Pilares paravam em `top: -295`). A medição espera a transição de altura do CSS; num `requestAnimationFrame` o botão estava ~490px mais abaixo.

**Medido em build de produção, 1366×768:** Missão texto 230→324, nota termina em 415 (janela 768). Pilares após clique: painel 254→743, último pilar em 675. Faixa não troca sozinha em 10 passos de roda — em 1920×1080, 1366×768, 390×844 e 1366×768 com movimento reduzido. 0 `h3` nos painéis, ArrowDown abre Valores, os três conteúdos alcançáveis, 0 erro de console. `tsc --noEmit` limpo; lint 25 avisos / 0 erros (baseline).

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/EssenceAccordion.tsx`
- `src/components/essence-accordion.css`

---

## SIS-94 — Hero de Soluções, Serviços e Consultoria: vídeo de fundo controlado pelo scroll

**Status:** Done · **Labels:** — · **Fechada em:** 01/09/2026 · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-94/hero-de-solucoes-servicos-e-consultoria-video-de-fundo-controlado-pelo

### Pedido
Vídeo atrás do hero de Soluções, Serviços e Consultoria, controlado pelo scroll (`currentTime`, não autoplay em loop). Asset: `public/videos/Hands_typing_on_keyboard,_digita…_202609011608.mp4` (~6,3 MB); existe variação ~11,8 MB — escolher um, remover o outro, renomear para slug limpo. Overlay para legibilidade; reaproveitar padrão do `hero-scroll.mp4` da home; `muted`, `playsinline`, `preload="auto"`, poster WebP; seek só após metadados. Atenção a peso (CRF ~28, `-an`, `+faststart`), mobile, reduced-motion, z-index vs. header e barra “NESTA PÁGINA”. Aceite: vídeo avança/retrocede com o scroll; slug limpo e duplicado removido; comprimido com poster e faststart; título/lema/barra legíveis; fallback mobile e reduce; sem tela preta no primeiro paint.

### O que foi feito
**Asset.** Escolhido o take citado (6,6 MB) em vez da variação (11,8 MB) — ambos 1920×1080, 24 fps, 10 s. Reencodado all-intra a 1280 de largura, CRF 32, `-an`, `+faststart` → `public/videos/solucoes-hero-scroll.mp4`, **2,8 MB**. Pôster `solucoes-hero-scroll-poster.webp`, **48 KB**. Originais de nome longo removidos.

**Implementação.** Novo `src/components/ui/HeroVideoBackdrop.tsx`: envolve a abertura (hero + barra “NESTA PÁGINA” são irmãs). Relógio: `scrollYProgress` do wrapper (`start start` → `end start`); busca no `ScrollVideo`. Primeiro render (servidor e cliente) só pôster `<img>`; vídeo só depois de montar, só se janela larga e movimento permitido. Corte em 1024px (mesmo do `ProofJourney`). CSS `.hero-backdrop*` no `globals.css`: base navy, véu em duas camadas, `z-index` explícito.

**Correções na medição.** Véu inicial (82/62/88% + 46% chapado) deixava o take invisível → 66/34/74% + 16%. Camadas passam a subir atrás do header na distância do `pt` do `<main>` (`-7rem`, `-9rem` em md+).

**Medições (produção).** 1440×900 e 1366×768: `<video>` readyState 4, 10 s, `currentTime` 0 no topo e 9,95 após ~1000 px. 390×844 e reduced-motion 1440×900: `<img>` (pôster). Contraste do título branco contra fundo amostrado: **11,0:1** no topo e **8,9:1** no meio. Véu z-index 1, conteúdo 2. Primeiro paint: azul da página, sem retângulo preto. `tsc --noEmit` limpo; lint 25 avisos / 0 erros; build ok.

Ressalva: vídeo discreto de propósito — véu mais fraco cairia o contraste abaixo das outras aberturas.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/ui/HeroVideoBackdrop.tsx`
- `src/app/globals.css`
- `public/videos/solucoes-hero-scroll.mp4`
- `public/videos/solucoes-hero-scroll-poster.webp`

---

## SIS-93 — Soluções / “Tecnologia Disruptiva”: aplicar o mesmo fundo azul claro da seção Consultoria

**Status:** Done · **Labels:** — · **Fechada em:** 01/09/2026 · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-93/solucoes-tecnologia-disruptiva-aplicar-o-mesmo-fundo-azul-claro-da

### Pedido
Na seção Soluções — “Tecnologia Disruptiva”, trocar o fundo pelo mesmo azul claro da Consultoria (gradiente suave, quase branco no centro, saturado nas bordas, textura de grid). Extrair para token/classe compartilhada; reavaliar contraste AA; emendas sem linha dura. Aceite: mesmo gradiente e textura; fundo num único lugar; contraste verificado; emendas; desktop largo, notebook e mobile.

### O que foi feito
“Tecnologia Disruptiva” (`src/components/Accelerators.tsx`) passou a usar a mesma classe da Consultoria, `section-light section-light-blue`, já definida uma vez em `src/app/globals.css`. Textura de grade (`.section-light::before`, `--grade-modulo`) e pontilhado (`::after`) vêm de brinde. Computed style: `backgroundImage` idêntico ao de `#consultoria`.

O fundo sozinho quebraria a seção: `.section-light` pinta `h3`/`p`/`span` de navy. Cada card ganhou `on-dark`. Link “Conheça o …” com cor por `style` (a regra `.section-light .on-dark a` usa `!important`). Sombra dos cards de `rgba(3,26,52,0.5)` para azul da marca em opacidade menor. Cabeçalho `text-ink` / `text-ink-muted`; selo “7 aceleradores” com borda `#0079CB/22`, base branca, texto `#0060a8`. Orbs de `-z-10` para `z-0` com conteúdo em `z-10` (`isolation: isolate`). Violeta `#A78BFA` virou ciano da marca.

**Contraste** (fundo #e3f1fb): título “Soluções” 14,50:1 · lead 6,30:1 · selo 14,50:1. Dentro do card navy (#083156): h3 branco ≈ 12,6:1, corpo 88% ≈ 11:1, link `#A5F0FF` ≈ 10:1. Idêntico em 1440×900, 1366×768 e 390×844.

**Emendas.** `box-shadow: 0 0 54px 18px rgb(227 241 251 / 45%)` na variante azul-claro, para as duas seções. Emenda de cima suave; a de baixo melhorou menos (seção seguinte opaca pinta por cima). Efeito colateral: alternância de `/solucoes` deixou de ser escuro→escuro→claro→escuro.

`tsc --noEmit` limpo, `npm run build` ok, `npm run lint` no baseline (25 warnings, 0 erros).

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/Accelerators.tsx`
- `src/app/globals.css`

---

## SIS-92 — Seção “Desafios no desenvolvimento de software”: textos sobrepostos entre etapas

**Status:** Done · **Labels:** — · **Fechada em:** 01/09/2026 · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-92/secao-desafios-no-desenvolvimento-de-software-textos-sobrepostos-entre

### Pedido
Na seção “Desafios no desenvolvimento de software”, textos das etapas ficam sobrepostos. Em “Validar e evoluir”, o parágrafo embaralha com o da etapa anterior. Causa provável: crossfade com dois blocos `position: absolute` legíveis ao mesmo tempo. Garantir `opacity: 0` + `visibility: hidden` / `pointer-events: none` na etapa que sai; conferir todas as etapas e scroll reverso; linha divisória não deve atravessar o texto; reduce alcançável. Aceite: um texto legível por vez; sem resíduo; linha não atravessa; frente e verso; reduce.

### O que foi feito
Corrigido em `src/components/legacy/ImpactSequence.tsx`.

Causa: cada capítulo entrava em `[at - 0.07, at]` e saía em `[at + 0.24 - 0.07, at + 0.24]`. A janela de saída de um é idêntica à de entrada do próximo — no modo dirigido os três dividem `grid-area: cap` em `legacy.css`. Nesses 0.07 havia dois parágrafos meio opacos; o `border-top` do que saía cruzava o texto do que entrava. Acontecia nas duas transições; a última chamava mais atenção por ser o parágrafo mais longo.

A troca passou a ser encadeada: `fimSaida = at + CAP_PASSO - CAP_BORDA`. `0.24` virou `CAP_PASSO`. Capítulo fora de cena recebe `visibility: hidden` (`useVisibilityGate`). Em fluxo (sem JS, abaixo de 1024px, reduce) nada mudou: três colunas, piso de opacidade 0.28.

Validado no build de produção, `/` a 1600×900, 260 amostras em cada sentido: **0 quadros com dois capítulos legíveis ao mesmo tempo**; cada um chega a `opacity: 1`. Com reduce e 900px de largura, modo fluxo, os três legíveis. 0 erros de console. `tsc --noEmit` limpo, lint 0 erros.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/legacy/ImpactSequence.tsx`

---

## SIS-91 — Faixa de logos de parceiros: reduzir a altura (está muito grossa)

**Status:** Done · **Labels:** — · **Fechada em:** 01/09/2026 · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-91/faixa-de-logos-de-parceiros-reduzir-a-altura-esta-muito-grossa

### Pedido
A faixa clara de logos de parceiros está muito grossa. Reduzir padding vertical; padronizar altura dos logos (Picsel com caixa cinza — remover fundo); reavaliar espaçamento com seções vizinhas; emenda de cor com a seção azul; eyebrow “RESULTADOS” colado/cortado no rodapé da faixa — reposicionar. Aceite: altura proporcional; logos padronizados sem caixa; espaçamento consistente; emenda resolvida; eyebrow reposicionado; desktop largo e mobile.

### O que foi feito
Medições em produção (Chromium).

**1440×900.** `.lp-signals` altura **255px → 122px**; padding vertical **100.8px → 40.32px** por lado (`padding-block: clamp(1.5rem, 2.8vw, 2.75rem)`); logo **52px → 40.3px** (`clamp(2.25rem, 2.8vw, 3.5rem)`, `max-width: 11rem`).

**390×844.** Altura **162px → 85px**; padding **56px → 24px**; logo **48px → 36px**.

- **Vazio excessivo** — era 100.8px de padding para logos de 52px.
- **Caixa cinza do Picsel** — `Picsel-logo.png` sem canal alfa, retângulo `rgb(72,108,85)`. Gerado `Picsel-logo-transparente.png`; `src/data/clients.ts` aponta para o novo; original permanece como fonte.
- **Emenda** — `border-block` virou `border-bottom`; chanfro deixou `--deep` (SIS-75, fronteira escuro↔escuro) por `<NotchDivider cor="#f5faff" invertido />`.
- **Eyebrow “RESULTADOS”** — não é da faixa: chip do `ScrollSpy`, `fixed`, a partir de 1440px, sobre a seção escura seguinte (y≈421). Nada a reposicionar.

`tsc --noEmit` limpo, `npm run lint` baseline (25 warnings / 0 errors), `npm run build` ok.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/legacy/legacy.css`
- `src/app/page.tsx`
- `src/data/clients.ts`
- `public/images/Picsel-logo-transparente.png`

---

## SIS-90 — Seção “Alta Performance e Comprometimento”: mover imagem para a esquerda do texto, reduzir o texto e transicionar

**Status:** Done · **Labels:** — · **Fechada em:** 01/09/2026 · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-90/secao-alta-performance-e-comprometimento-mover-imagem-para-a-esquerda

### Pedido
Na seção “…Alta Performance e Comprometimento”, a foto do time está centralizada e sobreposta ao texto. Reposicionar à esquerda (duas colunas); reduzir título/texto; transicionar (entrada suave + troca ao longo do scroll); cards flutuantes sem colisão. Mobile: imagem acima do texto. Reduce: imagem visível, sem movimento. Aceite: imagem esquerda / texto direita, sem sobreposição; escala reduzida; transição; cards sem colisão; empilhamento mobile; estado final em reduce.

### O que foi feito
Diagnóstico: a foto era o tile dominante do mosaico (`left: 50%; top: 56%; width: clamp(18rem, 32vw, 34rem)`). `.mosaic-copy` é `sticky` e ficou mais alta depois da SIS-68.

**O que mudou.** `src/components/legacy/StackScenes.tsx`: linha `.mosaic-duo` (foto à esquerda, texto à direita). `sticky` saiu do texto e foi para a linha. Tile dominante escondido na home. Palco com três imagens no DOM (`sistransphist.jpg`, `sistransphist1.jpg`, `escritoriosp.jpg`), troca por `opacity` no mesmo relógio `data-grupo-ativo`. Entrada via keyframe CSS atrás de `data-em-cena`, só acima de 64rem e fora de reduce. `legacy.css`: título e lead menores; nove tiles periféricos encolhidos e fixados às goteiras (`12rem` de cada lado), por lista explícita (não `:nth-child`). `data-carrier-origem` migrou do tile para o palco (`escritoriosp.jpg` é o último quadro de propósito). `/transformacao-legado` sem `variante` permanece idêntico.

**Medições.** 1440×900: palco `left 224 / w 474`, texto `left 742 / w 474`; colisão foto↔texto **false**; tiles invadindo a linha **0**; h2 41,76px, lead 16,56px; `carrierOrigem: mosaic-palco`. Grupo 0 → 2 esq / 1 dir; grupo 1 → 1/2. 1366×768: palco `left 192 / w 471`, texto `left 703`, h2 39,6px. 390×844: coluna única 351px, `position: static`, foto acima. Reduce: `grupo: null`, `emCena: false`, três quadros `opacity: 1`.

`tsc --noEmit` limpo, `npm run build` ok, lint baseline (25 warnings, 0 erros).

Ressalva: em mobile os tiles periféricos ainda passam por trás do bloco foto+texto (pré-existente).

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/legacy/StackScenes.tsx`
- `src/components/legacy/legacy.css`

---

## SIS-89 — Tornar mais fluida a transição de “Staff Augmentation” para a seção dos números

**Status:** Done · **Labels:** — · **Fechada em:** 01/09/2026 · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-89/tornar-mais-fluida-a-transicao-de-staff-augmentation-para-a-secao-dos

### Pedido
A passagem de Staff Augmentation (trilha horizontal, “A serviço do Delivery.”) para a seção de números (“Escala que transforma o mercado de seguros.”) está abrupta. Suavizar: sobrepor saída e entrada; revisar `end` vs. `start`; pin/`pinSpacing`; elemento de continuidade; `anticipatePin: 1` se aplicável; `ease: none` em scrub. Relacionado: SIS-85. Aceite: transição contínua; sem flicker de pin; sem scroll morto; fluida em desktop/notebook; reduce legível.

### O que foi feito
Causa geométrica, medida em 1440×900, produção. Capítulos da mesma `ProofJourney` (`top top` → `bottom bottom`): Soluções 3888 → 5724; Números começa em 6624. Sobram **900px** entre 5724 e 6624. Nesse trecho `--sol-p` cravado em `1` e `--impact-p` em `0`.

**Correção.** (1) `ProofJourney` mede a fração de aproximação `--pj-chegada-<capítulo>` no segundo argumento de `aplicar`. (2) Aproximação começa dentro da saída do anterior: `SOBREPOSICAO = 0.35` de janela (315px a 900px de altura), cerca dos dois últimos terços de `--sol-saida` (~54vh). (3) `Metrics`: `--impact-entrada` veio da chegada, não de `p / ENTRADA_FIM`. Nenhum gatilho novo, pin nem altura alterada. `ease: none` implícito.

**Varredura da emenda (100px por amostra).** y 5330: `--sol-p` 0.785, chegada 0; 5432: 0.841 / 0.019; 5721: 0.998 / 0.257; 6027: 1.000 / 0.509; 6333: 1.000 / 0.761; 6622: 1.000 / 0.998; 6724: 1.000 / 1.000 (`--impact-p` 0.046). Nenhum y entre 5212 e 6826 com as duas frações saturadas ao mesmo tempo. Sem pin (é `sticky` por causa do Lenis). Reduce/mobile: `data-dirigindo` ausente, título com `opacity: 1`, `clip-path: none`, `transform: none`.

`tsc --noEmit` limpo, lint baseline, `npm run build` ok.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/ProofJourney.tsx`
- `src/components/Metrics.tsx`

---

## SIS-88 — Seção de contato na home: layout quebrado (título cortado pelo header, bloco estourando a seção)

**Status:** Done · **Labels:** — · **Fechada em:** 01/09/2026 · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-88/secao-de-contato-na-home-layout-quebrado-titulo-cortado-pelo-header

### Pedido
Na seção de contato da home, “Entre em contato conosco” está quebrado: título e eyebrow atrás do header; bloco estoura a seção; card “SEDE · SÃO PAULO” cortado na base; marcador “CONTATO” sobreposto. Reservar espaço do header; conter no grid; ajustar altura; revisar z-index. Relacionado: SIS-83. Aceite: título e eyebrow visíveis; bloco no grid; card completo; sem sobreposição do marcador; desktop, notebook e mobile.

### O que foi feito
Causa medida: modo dirigido com caixa `sticky` de `height: 100svh` e `overflow: clip`. (1) A caixa media a tela inteira, mas o topo fica atrás da pílula fixa (borda inferior a 104px). (2) Painel maior que a tela útil: **1000px** em 1920×1080, **877px** em 1440×900, **866px** em 1366×768.

`globals.css`: modo dirigido reserva o cabeçalho (`padding-top: calc(var(--header-h,88px) + 1.5rem)` + `padding-bottom: 1.5rem`); `.ct-trilha` ganhou `scroll-margin-top` (`#contato` é âncora). `Contact.tsx`: só dirige se `painelRef.offsetHeight + 136 <= innerHeight` (`offsetHeight` imune ao `scale()`). Não cabendo, modo lista. `ResizeObserver` + `resize`.

Consequência registrada: com painel 866–1000px, o modo dirigido só se ativa acima de ~1136px de altura de janela. Preferido a manter conteúdo cortado.

Validado em produção: 1920×1080, 1440×900, 1366×768 e 390×844, com e sem reduce. ScrollSpy (a partir de 1440px) a 12–20px da esquerda; borda do painel em 100px a 1440 e 340px a 1920. `tsc --noEmit` limpo, lint 0 erros, build ok.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/app/globals.css`
- `src/components/Contact.tsx`

---

## SIS-87 — Menu “Quem somos”: dropdown desaparece ao tentar clicar nos itens

**Status:** Done · **Labels:** — · **Fechada em:** 01/09/2026 · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-87/menu-quem-somos-dropdown-desaparece-ao-tentar-clicar-nos-itens

### Pedido
Ao abrir o dropdown Quem somos e mover o mouse para clicar (A Sistran, Sistran Labs, Sistran University, Sistran Latam), o menu fecha antes do clique. Causa provável: espaço morto entre trigger e painel (`mouseleave` no gap). Tratar trigger + painel como uma área de hover; delay de fechamento ~150–200ms; fechar em clique fora, Esc e outro item; teclado (Enter/Espaço, setas, Tab); touch por clique. Aceite: clique nos 4 itens; fecha fora e Esc; teclado com foco visível; touch; sem flicker.

### O que foi feito
Resolvido em `src/components/Header.tsx`.

**Causa:** painel em `top: calc(100% + 10px)`. Os 10px de vão não pertenciam nem ao invólucro nem à lista.

**O que mudou.** Afastamento virou `padding-top: 10px` de um invólucro em `top-full`. Fechamento com atraso de 180ms (`fecharSubmenuComAtraso`), cancelado ao reentrar. Clique/toque fora via `pointerdown` no documento (não `click`, para não fechar no mesmo toque que abre). Teclado: `ArrowDown` abre e foca o primeiro item; setas em ciclo; `Escape` fecha e devolve o foco ao botão; `Tab` não fecha (`onBlur` só quando o foco sai do invólucro).

**Medido em produção, 1600×900.** Os 4 itens permanecem visíveis no trajeto; cliques: A Sistran → `/quem-somos`, Sistran Labs → `/sistran-labs`, Sistran University → `/sistran-university`, Sistran Latam → `/latam`. Clique fora, Esc, ArrowDown, Tab e touch (`hasTouch`) conferidos. 0 erro de console. `tsc --noEmit` limpo; lint 25 avisos / 0 erros; build passa.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/Header.tsx`

---

## SIS-49 — Soluções de Negócios: retirar a legenda numerada de baixo dos nós da linha

**Status:** Done · **Labels:** — · **Fechada em:** 26/08/2026 · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-49/solucoes-de-negocios-retirar-a-legenda-numerada-de-baixo-dos-nos-da

### Pedido
Os `01`–`04` que ficaram como legenda sob cada nó da linha de processo saem. Remover `<span className="solutions-fio-no-num">` em `src/components/Solutions.tsx` e o bloco `.solutions-fio-no-num` (e `[data-estado="ativo"]`) do `globals.css`, com comentário de religação. Vieram da SIS-46; sob a foto ficaram ruído. A linha é `aria-hidden`; a etapa continua no `01 / 04` de `.solutions-progresso` e em `aria-current="step"`. Não reintroduzir números na navegação. Validação: lint, tipos, anel de pulso sem espaço sobrando.

### O que foi feito
Done — commit `96e0e67`. Saíram o `<span className="solutions-fio-no-num">` em `Solutions.tsx` e o bloco `.solutions-fio-no-num` (com `[data-estado="ativo"]`) no `globals.css`. Comentário de religação nos dois lugares; o do CSS guarda posicionamento, tamanho e os dois tons. Nós ficaram só com o ícone. Marcação da etapa: círculo aceso, borda `rgba(165,240,255,0.85)`, halo ciano e anel `::after` — nenhum tocado. O anel é `::after` com `inset: -10px`; o número era irmão absoluto fora dele — sair não mexeu na geometria. Acessibilidade intacta (SIS-46): linha `aria-hidden`; contador e `aria-current="step"`; números não voltaram à navegação. `tsc --noEmit` limpo, `eslint src/components/Solutions.tsx` limpo, nenhuma ocorrência de `solutions-fio-no-num` fora dos comentários, servidor 200.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/Solutions.tsx`
- `src/app/globals.css`

---

## SIS-48 — Soluções de Negócios: a pílula do cabeçalho fica escondida atrás do header fixo

**Status:** Done · **Labels:** — · **Fechada em:** 26/08/2026 · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-48/solucoes-de-negocios-a-pilula-do-cabecalho-fica-escondida-atras-do

### Pedido
No palco dirigido (≥ 1024px) a pílula “Veja como a Sistran pode ajudar…” nasce colada no topo e o header fixo passa por cima. `.solutions-scroll[data-dirigindo] .solutions-sticky` tem `position: sticky; top: 0; height: 100svh; justify-content: center`. Correção: `padding-top: var(--header-h)` (`globals.css:908`, 88px; Header compacta para 68px). Não usar `top: var(--header-h)`. Verificar pílula inteira com header normal e compacto; palco tela inteira sem salto; quatro etapas centradas; abaixo de 1024px nada muda.

### O que foi feito
Feito no commit `05b8c7b` — um único arquivo, `src/app/globals.css`. `padding-top: var(--header-h)` em `.solutions-scroll[data-dirigindo] .solutions-sticky`. Com `box-sizing: border-box` (preflight Tailwind) a altura do palco não cresceu; a trilha de 400vh e o `margin-top: -100svh` continuam válidos. Padding e não `top` para não abrir faixa do fundo do documento. Variável e não número: Header reescreve `--header-h` ao compactar (88px → 68px, `Header.tsx:55`). Nada abaixo de 1024px. Servidor 200. A entrega registra que faltava conferência no navegador: cápsula inteira nos dois estados do header e nenhum salto no sticky.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/app/globals.css`

---

## SIS-47 — Soluções de Negócios: melhorar o remate final da linha de processo

**Status:** Done · **Labels:** — · **Fechada em:** 26/08/2026 · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-47/solucoes-de-negocios-melhorar-o-remate-final-da-linha-de-processo

### Pedido
O fim da linha corta reto no meio da foto, sem remate; o último nó (check) fica com traço dos dois lados. Dar um fecho: terminar no último nó; ou dissolver com máscara/degradê; ou curva de saída simétrica à entrada. Caminho em `Solutions.tsx` (`caminho`) termina em `nos[5] + geo.pw * 0.05`. Depende de SIS-45 (quatro nós). Decoração `aria-hidden`; coordenadas medidas; paleta azuis e ciano. Validação nas quatro etapas, desktop largo e estreito: sem corte, sem invadir o cartão, sem passar no rosto da foto.

### O que foi feito
Done — commit `995ad2c`. Direção: dissolver, combinada com terminar no último nó. O caminho principal passou a terminar exactamente em `nos[nos.length - 1]` — sem a sobra de 5%. O cap redondo do `stroke-linecap` fica escondido debaixo do círculo (52px). Curva de saída simétrica descartada: sugeriria quinta etapa.

Remate: path próprio `.solutions-fio-remate`, sobe (`-7.5%` e depois `-11%` da altura da foto) até 99.5% da largura, `url(#solutions-fio-fim)` — degradê `#0ed8f6` a 0.55 de alfa na emenda, `#66caf4` a 0.22 no meio, alfa zero na ponta. `gradientUnits="userSpaceOnUse"`. Sem `stroke-linecap: round` neste traço. Path separado para o degradê não pintar o fio inteiro e o `stroke-dashoffset` / `pathLength={1}` não medir o remate como etapa. `opacity: 0.4`, acende em cheio quando `ativo === total - 1` via `data-fim` (520ms). Frações de `geo.pw`/`geo.ph`; dentro de `.solutions-fio` (`aria-hidden`, `pointer-events: none`). `tsc --noEmit` limpo, eslint limpo, servidor 200. A entrega registra que faltava passagem no navegador das quatro etapas.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/Solutions.tsx`
- `src/app/globals.css` (implícito no bloco do fio / remate)

---

## SIS-46 — Soluções de Negócios: tirar os números da navegação lateral e levá-los para os nós da linha

**Status:** Done · **Labels:** — · **Fechada em:** 26/08/2026 · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-46/solucoes-de-negocios-tirar-os-numeros-da-navegacao-lateral-e-leva-los

### Pedido
Os números `01`–`04` saem da lista lateral e passam a marcar os nós da linha. Remover `<span className="solutions-nav-num">` e a regra CSS; a lista fica com título e seta; o contador `03 / 04` do rodapé fica. Cada nó ganha o número da solução (dentro do círculo ou como legenda). Depende de SIS-45. A linha é `aria-hidden`; números nos nós não podem ser a única forma de saber a etapa. Validação: lint, tipos, títulos alinhados sem o número à esquerda.

### O que foi feito
Done — commit `8310c19`.

**Navegação.** `<span className="solutions-nav-num">` saiu de cada item e o bloco `.solutions-nav-num` (mais `[data-estado="ativo"]`) saiu do `globals.css`, substituído por comentário de religação. Item ficou com título + seta; barra ciano, placa de vidro e `min-height: 72px` continuam. Número era primeiro filho de flex com `gap: 1rem`; tirá-lo devolveu largura ao título.

**Nós.** Cada nó ganhou `.solutions-fio-no-num`, mesma tipografia da navegação (display, 700, `tabular-nums`, `rgba(165,240,255,0.62)` → `#0ed8f6` aceso, halo de 12px). Legenda 7px abaixo do círculo, não dentro (ícone nos 52px). Transição 380ms `cubic-bezier(0.22, 1, 0.36, 1)`. `left: 50%` + `translateX(-50%)` no filho; fora do anel (`inset: -10px`).

**Acessibilidade.** Linha `aria-hidden`. Canal real: contador `01 / 04` em `.solutions-progresso` e `aria-current="step"`. `tsc --noEmit` limpo, `eslint src/components/Solutions.tsx` limpo, nenhuma ocorrência órfã de `solutions-nav-num` fora do comentário, servidor 200. Conferência no navegador ficou para o fim da SIS-47.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/Solutions.tsx`
- `src/app/globals.css`

---

## SIS-45 — Soluções de Negócios: a linha de processo passa a ter 4 nós, um por card, e acende o da etapa

**Status:** Done · **Labels:** — · **Fechada em:** 26/08/2026 · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-45/solucoes-de-negocios-a-linha-de-processo-passa-a-ter-4-nos-um-por-card

### Pedido
A linha de processo tinha seis nós enquanto as soluções são quatro; o nó aceso usava `ativo + 1`, compensação porque a contagem não fechava. Pedido: reduzir para quatro nós (um por card), acender exatamente a etapa ativa (`i === ativo`) e marcar anteriores como percorridos. Em `src/components/Solutions.tsx`: `ICONES_NO` com os ícones das próprias soluções via `getIcon(s.icon)`; recalcular a distribuição `0.135 + i * 0.146` (feita para seis); eliminar `noAtivo`; vocabulário `ativo` / `feito` / `proximo`; ajustar o fim do caminho SVG a partir do último nó. Posições em % da caixa medida (`geo`), nunca px. Validação: nas quatro etapas, quatro nós, exatamente um aceso e correspondente ao cartão, em desktop largo e estreito.

### O que foi feito
Feito no commit `82670e4`.

A linha passou de seis nós para `total` (quatro), um por solução, e o nó aceso é o próprio `ativo`. A correção `noAtivo = ativo + 1` saiu — ela só existia porque com seis nós a cabeça do percurso caía no nó errado; com um nó por etapa não há índice a corrigir.

**Ícones:** cada nó carrega o ícone da **sua** solução, via `getIcon(s.icon)` — o mesmo que o cartão descritivo mostra. A lista `ICONES_NO` e os seis imports do lucide (`Boxes`, `Check`, `Code2`, `ShieldCheck`, `UserPlus`, `Workflow`) saíram. Enquanto os nós eram seis e decorativos, um ícone qualquer servia; agora que cada nó representa uma etapa nomeada, um ícone alheio confundiria.

**Distribuição:** de 0.14 a 0.86 da largura medida da foto, com o passo **derivado de `total`** em vez do `0.135 + i * 0.146` escrito na mão. As margens de 14% em cada ponta impedem que o primeiro e o último encostem na borda da janela. Se um dia entrar ou sair uma solução, a linha continua distribuída sozinha.

O fim do caminho passou de `nos[5]` para `nos[nos.length - 1]`, e a chave do `map` de índice para `SOLUTIONS[i].id`.

Segue `aria-hidden`: a informação de etapa continua no `01 / 04` da navegação e no `aria-current="step"`. `tsc` e `eslint` limpos, servidor em 200.

Destrava SIS-46 e SIS-47, que dependiam desta.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/Solutions.tsx`

---

## SIS-44 — Soluções de Negócios: o convite ao scroll não está visível

**Status:** Done · **Labels:** — · **Fechada em:** 26/08/2026 · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-44/solucoes-de-negocios-o-convite-ao-scroll-nao-esta-visivel

### Pedido
O convite ao scroll da SIS-41 não aparece. Hipóteses: posição no fim da `.solutions-caixa` (pode cair fora da viewport no palco preso); opacidade `opacity: clamp(0, calc(1 - var(--sol-p) * 8), 1)` que se apaga com 12% do percurso (se `--sol-p` já não é 0 na entrada); contraste `rgba(226, 245, 255, 0.62)` sobre o degradê. Descobrir a causa (valor computado de `--sol-p` e retângulo) e corrigir para o convite aparecer na entrada e se apagar ao rolar. Sem estado novo e sem listener novo; opacidade continua de `--sol-p`. Decorativo e `aria-hidden`. Validação: entrar rolando de cima, convite legível; ao rolar, desaparece; na volta, reaparece sem piscar.

### O que foi feito
Feito no commit `2bed7aa`. Era a primeira das três hipóteses da task, com a segunda somada por cima.

**Causa:** o convite era o último item da `.solutions-caixa`. A caixa é mais alta que a tela — a foto sozinha vai a 620px, mais cabeçalho e navegação — e o sticky recorta com `overflow: clip`. O convite caía na parte recortada. Nunca foi a opacidade: `clamp(0, calc(1 - var(--sol-p) * 8), 1)` vale 1 em `p = 0` e estava correto.

**Correção:** saiu de dentro da caixa e passou a ser irmão dela, absoluto no rodapé do próprio `.solutions-sticky`, que já é elemento posicionado. Fica sempre dentro do recorte, independente da altura do conteúdo. Também virou coluna em vez de linha: texto em cima, calha embaixo.

**Contraste (terceira hipótese, também real):** o texto estava em `rgba(226, 245, 255, 0.62)` sobre o azul do palco e não se lia. Subiu para alfa 0.92 e ganhou placa de vidro discreta (borda de 1px + fundo navy translúcido + blur), porque o degradê do fundo varia atrás dele ao longo do percurso.

Continua decorativo e `aria-hidden`, continua se apagando pelos primeiros ~12% do percurso via `--sol-p`, e continua renderizado só no palco dirigido — nenhum estado novo, nenhum listener novo. `tsc` e `eslint` limpos, servidor em 200.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
Não declarados no relatório.

---

## SIS-43 — Soluções de Negócios: retirar o botão "Veja mais" do rodapé da seção

**Status:** Done · **Labels:** — · **Fechada em:** 26/08/2026 · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-43/solucoes-de-negocios-retirar-o-botao-veja-mais-do-rodape-da-secao

### Pedido
Remover o botão **«Veja mais»** do rodapé da seção: o `.solutions-rodape` (`<Link href="/solucoes#servicos-diferenciais" className="btn-primary">`) de `src/components/Solutions.tsx` e as regras de `.solutions-rodape` em `src/app/globals.css`, inclusive a variação em `@media (min-width: 1024px)`. Comentar em vez de apagar só se reaproveitável; senão remover e deixar nota de religar. Atenção ao `import Link from 'next/link'` órfão. A página `/solucoes#servicos-diferenciais` continua pelo menu. Validação: lint (import não utilizado), tipos, e fim da seção emenda na próxima sem espaço vazio.

### O que foi feito
Feito no commit `d1cfded`.

Saíram os três pedaços que só existiam por causa do botão:

1. `.solutions-rodape` com o `<Link href="/solucoes#servicos-diferenciais">` no fim do JSX de `Solutions.tsx`;
2. o bloco de CSS que o alinhava (`globals.css`, ~7031) — sem o botão sobrava uma caixa vazia reservando altura no fim do palco;
3. a menção a `.solutions-rodape` na media query de 400px, que agora vale só para `.solutions-caixa`.

O import `import Link from 'next/link'` saiu junto: era o único consumo no arquivo. A rota continua alcançável pelo menu.

Comentário no lugar de cada bloco removido explicando como religar. `tsc --noEmit` e `eslint src/components/Solutions.tsx` limpos; um `grep` por `solutions-rodape` só encontra os comentários.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/Solutions.tsx`
- `src/app/globals.css`

---

## SIS-42 — Soluções de Negócios: tirar os "pulinhos" na troca de cena durante o scroll

**Status:** Done · **Labels:** — · **Fechada em:** 26/08/2026 · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-42/solucoes-de-negocios-tirar-os-pulinhos-na-troca-de-cena-durante-o

### Pedido
Rolando o palco, a cena/cartão «pula» em vez de trocar limpo. Suspeitos a confirmar: `key={ativo}` no fio (`.solutions-fio`) remontando animações; `transition` de layout (`.solution-viewport` 680ms) brigando com o scroll; `medir()`/`setGeo` no meio da transição. Investigar primeiro, registrar a causa real, depois corrigir. Scroll continua o relógio: um `ScrollTrigger`, sem segundo trigger nem `setInterval`, nenhuma dependência nova. Validação: rolar devagar e rápido, cima e baixo, nas quatro etapas, sem salto; exatamente um item ativo.

### O que foi feito
Feito no commit `8aa143d`. Investiguei antes de corrigir — **os três suspeitos eram reais**, somados. Nenhum deles era a transição de 680ms da `.solution-viewport`, que ficou como estava.

**1. O parallax era um dente de serra — causa principal.** `--sol-passo-p` era `(p * total) % 1`, caindo de 1 para 0 na fronteira de cada etapa. O parallax da foto consumia isso com amplitude de 14px, então a cada quarto do percurso a imagem levava um tranco de 14px — e a `transition: transform 850ms` transformava o tranco num balanço.

Agora a fase é por cena: `var(--sol-p) * var(--sol-total) - var(--sol-i)`. Para a cena da vez isso percorre 0..1 igual a antes, mas nunca retorna. A transição saiu: o relógio é o scroll, o valor é reescrito a cada quadro.

**2. `key={ativo}` estava no container do fio**, então remontava também os seis nós a cada etapa. Eles voltavam do zero com a cascata de entrada, até 785ms de atraso no último nó. A chave passou para o `<path className="solutions-fio-vivo">`. Os nós agora persistem e trocam de estado por `transition`.

**3. O pulso do nó ativo reiniciava a animação de entrada.** A regra do estado ativo redeclarava a shorthand `animation` com dois itens, reiniciando `solutions-no-entra` (360ms+ de atraso). O pulso foi para o anel `::after`. As keyframes perderam o `translate(-50%, -50%)`, que servia ao nó (centrado por translação) e não ao anel (`inset`).

**Bônus:** o parallax de 4px do `.solution-info` saiu. Além do dente de serra, disputava a **mesma** `transform` dos deslocamentos de estado (−10px ao sair, 22px ao entrar), transição de 460ms.

`--sol-passo-p` ficou sem consumidor e deixou de ser publicada; `--sol-total` entrou no lugar. `tsc` e `eslint` limpos, servidor em 200.

Falta a conferência no navegador: descer devagar pelas quatro etapas procurando tranco na fronteira, subir e descer rápido, e confirmar que a cascata dos nós roda uma vez só (ao entrar na seção).

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
Não declarados no relatório.

---

## SIS-41 — Soluções de Negócios: linha de processo mais baixa e um convite ao scroll no palco

**Status:** Done · **Labels:** — · **Fechada em:** 26/08/2026 · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-41/solucoes-de-negocios-linha-de-processo-mais-baixa-e-um-convite-ao

### Pedido
Duas coisas no palco preso: (1) a linha de processo desce de 44% para **56%** da altura da foto (fração medida, nunca px); (2) convite «Role para percorrer as 04 soluções» com ponto descendo numa calha, opacidade de `--sol-p` via `opacity: clamp(0, calc(1 - var(--sol-p) * 8), 1)`, sem estado novo. Só no palco dirigido (`dirigindo`); decorativo e `aria-hidden`. Sem dependência nova; não alterar textos nem o modal. Validação: lint, tipos, linha não encosta no cartão nas quatro etapas, convite desaparece ao rolar.

### O que foi feito
Movida de Backlog para **Done** no commit `1e6ed65`.

**1. Linha de processo mais baixa:** `linhaY` passou de `geo.ph * 0.44` para `geo.ph * 0.56` em `Solutions.tsx`. Continua fração da altura **medida**, nunca px. O teto é o cartão descritivo (terço inferior): abaixo de ~0.6 a linha começaria a passar por trás dele.

**2. Convite ao scroll:** novo `<p className="solutions-convite">` no fim da `.solutions-caixa` — «Role para percorrer as 04 soluções» com um ponto descendo numa calha fina.
- Opacidade por `clamp(0, calc(1 - var(--sol-p) * 8), 1)`: `--sol-p` é o progresso que o `ScrollTrigger` já escreve em `.solutions-sticky`. O convite se apaga nos primeiros ~12% do percurso. **Nenhum estado novo, nenhum listener novo, nenhum re-render.**
- O ponto anima apenas `transform` e `opacity` (`translate3d`), compositor.
- Renderizado só quando `dirigindo` é verdadeiro. Há um bloco `prefers-reduced-motion` que para o ponto no meio da calha.
- `aria-hidden` e `pointer-events: none`. O caminho real continua sendo a navegação lateral e as setas do teclado.

**Validação:** `tsc --noEmit` limpo (filtrando o `sistran-river-park-3d` vendorizado) e `eslint` limpo; home em 200. O convite não aparece no HTML servido — correto: `dirigindo` depende de `matchMedia`, só no cliente, evitando divergência de hidratação.

**Pendente de olho humano:** linha não encostar no cartão nas quatro etapas e convite desaparecer ao começar a rolar.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/Solutions.tsx`

---

## SIS-40 — Soluções de Negócios: limpar o cartão — tirar o selo "Ativo" e o número pequeno acima do título

**Status:** Done · **Labels:** — · **Fechada em:** 26/08/2026 · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-40/solucoes-de-negocios-limpar-o-cartao-tirar-o-selo-ativo-e-o-numero

### Pedido
Remover o selo **«ATIVO»** (`solution-info-estado`) e o número pequeno acima do título (`solution-info-indice`) em `src/components/Solutions.tsx` e o CSS correspondente em `src/app/globals.css`. A barrinha em degradê (`solution-info-linha`) fica. Compensar `margin-top` do título (0.45rem → 0.95rem). Reaproximar atrasos da cascata de entrada. Só esta seção; nenhum texto de conteúdo muda. Validação: lint, tipos, quatro cartões alinhados, cascata sem pausa.

### O que foi feito
Movida de Backlog para **Done** no commit `e90729d`.

- `src/components/Solutions.tsx`: fora `<span className="solution-info-indice">` e `<span className="solution-info-estado">Ativo</span>`.
- `src/app/globals.css`: as duas regras de tipografia saíram junto. No lugar, comentário do que foi removido, por quê e como religar.
- `margin-top` do título 0.45rem → **0.95rem**.
- Cascata de entrada: atrasos reaproximados — ícone 160ms, título 225ms, texto 290ms, remate 350ms. Antes o último degrau era em 380ms com dois vãos no meio.
- A barrinha em degradê (`solution-info-linha`) ficou como remate inferior e entrou na cascata no lugar do selo.

O cartão só é renderizado na cena ativa, então o selo «ATIVO» não informava estado; a etapa já é dita pelo número grande à direita e pelo «03 / 04» da navegação.

**Validação:** `tsc --noEmit` limpo (filtrando `sistran-river-park-3d`) e `eslint` limpo; home em 200. Grep: `solution-info-indice` e `solution-info-estado` não aparecem mais em seletor nem no markup — só na nota explicativa.

**Pendente de olho humano:** alinhamento dos quatro cartões e cascata sem pausa.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/Solutions.tsx`
- `src/app/globals.css`

---

## SIS-39 — Soluções de Negócios: diminuir o cartão descritivo sobre a foto

**Status:** Done · **Labels:** — · **Fechada em:** 26/08/2026 · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-39/solucoes-de-negocios-diminuir-o-cartao-descritivo-sobre-a-foto

### Pedido
Reduzir o cartão de vidro (estava em 78% da largura, 210px de altura mínima, até 40px de padding). Desktop: 78% → 62%, min-height 210px → 176px, padding até 32px, `left` −6% → −4%, `bottom` −24px → −20px. Tablet (1024–1279px): 88% → 76%, 190px → 168px, padding 22px. Internos: ícone 44px → 38px, título `clamp(1.05rem, 1.24vw, 1.34rem)`, texto 0.92rem, número `clamp(2.8rem, 5vw, 5.4rem)`. Título com `min(40ch, 72%)`. Só CSS, só esta seção. Validação: lint, tipos, quatro títulos cabem, número e texto não se sobrepõem.

### O que foi feito
Movida de Backlog para **Done** no commit `de793bb`. Só CSS, em `src/app/globals.css`.

**Desktop** (`.solutions-scroll[data-dirigindo] .solution-info`): largura 78% → **62%**, altura mínima 210px → **176px**, padding `clamp(32px, 2.4vw, 40px)` → **`clamp(24px, 1.9vw, 32px)`**, `left` −6% → **−4%**, `bottom` −24px → **−20px**.

**Tablet** (1024–1279px): 88% → **76%**, 190px → **168px**, padding 26px → **22px**. Deliberadamente mais largo que no desktop: a coluna do palco é mais estreita e em 62% o título do card 01 quebraria em quatro linhas — registrado em comentário no CSS, com os valores antigos.

**Internos:** ícone 44 → 38px (svg 22 → 19px), título `clamp(1.15rem, 1.5vw, 1.6rem)` → `clamp(1.05rem, 1.24vw, 1.34rem)` com `line-height` 1.24, texto 0.98 → 0.92rem (`line-height` 1.55), número decorativo `clamp(3.4rem, 7vw, 7.4rem)` → `clamp(2.8rem, 5vw, 5.4rem)`.

O título continua com largura máxima reservada (`min(40ch, 72%)`, texto `min(50ch, 76%)`).

**Validação:** `tsc --noEmit` limpo (filtrando `sistran-river-park-3d`) e `eslint` limpo; home em 200. Nenhum texto mudou, nenhuma outra seção tocada.

**Limitação:** conferência visual dos quatro títulos (caso mais longo: card 01) ainda pelo navegador, desktop e tablet.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/app/globals.css`

---

## SIS-38 — Home: o tile "Arquitetura modular e escalável" atravessa o scroll até virar a foto do card 01 de Soluções

**Status:** Done · **Labels:** — · **Fechada em:** 26/08/2026 · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-38/home-o-tile-arquitetura-modular-e-escalavel-atravessa-o-scroll-ate

### Pedido
O tile «Arquitetura modular e escalável» e a foto do card 01 já são a mesma imagem (`/images/home/escritoriosp.jpg`, SIS-36), mas a passagem é um corte. Fazer o tile descer com o scroll e pousar sobre a janela da foto do card 01. Novo `src/components/ui/MosaicHandoff.tsx` em `src/app/page.tsx` depois de `<Solutions />`. Elemento `position: fixed`, deslocado por `transform`, largura/altura em px (proporção muda; `scale` esmagaria). Origem/destino medidos: `data-carrier-origem` e `data-carrier-alvo`. Relógio = seção `#solucoes`. Sem biblioteca nova; só a partir de 1024px e com movimento permitido; `aria-hidden`. Validação: lint, tipos, tile sai do mosaico, desce e pousa alinhado, sem salto e sem passar por baixo do fundo de Soluções.

### O que foi feito
Movida de Backlog para **Done** no commit `e55649f`.

- `src/components/ui/MosaicHandoff.tsx` (novo): o viajante. `position: fixed`, deslocado por `translate3d`, com largura/altura em px — a proporção muda no caminho (tile retrato → janela 16/9); só a mudança real de caixa deixa o `object-fit: cover` reenquadrar.
- `src/app/page.tsx`: montado **depois** de `<Solutions />` e irmão direto das duas seções. `position: fixed` morre sob ancestral com `transform`/`filter`; ordem na árvore faz o viajante pintar por cima do fundo de Soluções (`z-index: 30`, abaixo do cabeçalho em `z-50`).
- Marcas: `data-carrier-origem` na face do tile (`legacy/StackScenes.tsx`) e `data-carrier-alvo` na janela do card 01 (`Solutions.tsx`). Nenhuma coordenada estimada.
- `src/app/globals.css`: bloco `.mosaic-handoff` / `-img` / `-rotulo`, mais `[data-carrier-origem] { opacity: var(--carrier-fonte, 1) }`.
- Relógio = seção de destino: foto dentro de `sticky`, topo final `alvo.top − max(secao.top, 0)`, progresso = quanto falta de `secao.top` para zero, janela de 1,25 tela.
- Troca no fim invisível porque é a mesma imagem (`escritoriosp.jpg`). Tratamento de cor viaja igual (`saturate(.88) contrast(1.04) brightness(.78)`).

**Restrições:** nenhuma dependência nova; um `requestAnimationFrame` por rajada de scroll, sem `setInterval`, sem re-render; decorativo e `aria-hidden`; desligado abaixo de 1024px e com `prefers-reduced-motion`.

**Validação:** `tsc --noEmit` limpo (filtrando `sistran-river-park-3d`), `eslint` limpo nos quatro arquivos, home em 200, HTML servido com exatamente uma marca `data-carrier-origem` e uma `data-carrier-alvo`.

**Limitação:** validação estática; conferência no navegador pendente. **Nota:** fotos em `public/images/home/` não estavam versionadas (fora de `9141420`) — corrigido em `bd30d61`.

**Ajuste posterior** (commit `48a2c42`, issue continua em Done): durante a descida a foto do card 01 já estava visível — a mesma imagem duas vezes. O efeito passou a escrever `--carrier-destino` no `<html>`. A foto de destino fica apagada durante o percurso e acende nos últimos 6%, no intervalo em que o viajante se apaga. Opacidade em `[data-carrier-alvo] .solution-image` e `.solution-veu`, **nunca** na `.solution-viewport`. `desligar()` devolve as duas pontas a 1. `tsc` e `eslint` limpos, home em 200.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/ui/MosaicHandoff.tsx`
- `src/app/page.tsx`
- `src/components/legacy/StackScenes.tsx`
- `src/components/Solutions.tsx`
- `src/app/globals.css`

---

## SIS-37 — Soluções de Negócios: aproximar a composição da referência (palco, linha de processo e cartão)

**Status:** Done · **Labels:** — · **Fechada em:** 26/08/2026 · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-37/solucoes-de-negocios-aproximar-a-composicao-da-referencia-palco-linha

### Pedido
Aproximar a seção da referência sem trocar conceito, texto ou outras seções. Correções descritas: caixa `min(92vw, 1640px)`, colunas 29/71 (34/66 no tablet), gap 48–72px; título `white-space: nowrap` a partir de 1280px; cartão `width: 78%; left: -6%; bottom: -24px; min-height: 210px`; conector único SVG medido (`ResizeObserver`), `preserveAspectRatio="none"` + `vector-effect="non-scaling-stroke"`; seis nós de 52px em %; fundo (focos radiais + degradê `115deg #0875c5 → #075aab → #032d67`, grade 64px opacidade 0.05); emendas SIS-32 preservadas; um `ScrollTrigger`, sticky 100svh sobre 400vh, índice `floor(progress * 4)`; acessibilidade (`<button>`, `aria-current="step"`, teclado, mobile trilho, reduced-motion).

### O que foi feito
Backlog → Done no commit `9398cae`.

**Arquivos:** `src/components/Solutions.tsx` (reescrito) e `src/app/globals.css` (bloco da seção, 704 linhas → 873).

- Composição: caixa `min(92vw, 1640px)`, colunas 29/71 (34/66 no tablet), gap `clamp(32px, 4vw, 72px)`, título com `white-space: nowrap` a partir de 1280px, cartão em 78% cobrindo só o terço inferior da foto, molduras recuadas 22px/42px só com borda.
- Linha de processo: as quatro ilustrações por índice (`CenaOverlay`) e o `.solution-conector` posicionado por `(indice - 1.5) * 63px` saíram. Agora é **um** caminho SVG com coordenadas medidas por `ResizeObserver` (guarda de 0.5px no `setState`, senão floats de `getBoundingClientRect` fazem render infinito) e seis nós. Nós são spans HTML em %: sob `preserveAspectRatio="none"` um `<circle>` viraria elipse.
- `key={ativo}` no invólucro do fio: desenho e cascata uma vez por etapa; mudança de geometria não remonta.
- Fundo, movimento e acessibilidade conforme a descrição. Nenhuma dependência nova — GSAP/ScrollTrigger já usado, um `ScrollTrigger` só, sticky sobre trilha de 400vh.

**Verificação**
- `tsc --noEmit` limpo e `eslint` limpo. Aviso `react-hooks/set-state-in-effect` no `setGeo(null)` do ramo `!dirigindo` — o reset saiu (a renderização já exige `dirigindo && geo`).
- `grep` confirma zero referências restantes a `solution-overlay`, `solution-conector`, `CenaOverlay` e `solution-pulso`.
- Home responde 200 e o HTML servido traz a composição nova.

**Limitações reais**
1. Validação até aqui é estática. As quatro etapas de scroll, scroll rápido, cliques, três tamanhos de tela e `prefers-reduced-motion` precisam de conferência no navegador.
2. A linha de processo só é desenhada no palco dirigido (`dirigindo && geo`). No mobile e em movimento reduzido ela está **ausente**, não «restrita ao interior da foto». É decoração `aria-hidden`.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/Solutions.tsx`
- `src/app/globals.css`

---

## SIS-36 — Soluções de Negócios: plugar as quatro fotos e emendar com o mosaico

**Status:** Done · **Labels:** — · **Fechada em:** 26/08/2026 · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-36/solucoes-de-negocios-plugar-as-quatro-fotos-e-emendar-com-o-mosaico

### Pedido
A janela de imagem das quatro soluções na home era um retângulo navy vazio: `Solutions.tsx` renderizava `<div className="solution-image" role="presentation" />`, nunca um elemento de imagem. Escopo: campos opcionais `image`/`imageAlt` em `Solution`; quatro fotos de `public/images/home/` (`escritoriosp.jpg`, `escritoriosp1.jpg`, `sistransphist2.jpg`, `sistransphist3.jpg`) com `alt`; `next/image` com `fill` em `.solution-viewport` + véu navy nas bordas; `escritoriosp.jpg` também no tile «Arquitetura modular e escalável» do mosaico. Nenhum texto visível muda; nenhuma imagem nova gerada. A SIS-20 nunca foi implementada.

### O que foi feito
Backlog → Done no commit `9141420` (dados) + `9398cae` (componente).

- `src/data/types.ts`: `image?`/`imageAlt?` no tipo `Solution`. Opcionais de propósito — `/solucoes` consome os mesmos dados sem palco de imagem.
- `src/data/solutions.ts`: `escritoriosp.jpg` no card 01, `escritoriosp1.jpg` no 02, `sistransphist2.jpg` no 03, `sistransphist3.jpg` no 04, cada uma com `alt` descritivo.
- `src/components/Solutions.tsx`: o `<div className="solution-image" role="presentation" />` deu lugar a `next/image` com `fill` dentro de `.solution-viewport` (`position: relative; overflow: hidden`), mais véu navy só nas bordas.
- `src/data/legacy.ts`: `escritoriosp.jpg` também no tile «Arquitetura modular e escalável». É a MESMA foto do card 01 de propósito. Comentário no arquivo registra que trocar uma sem a outra quebra a emenda.

**Verificação**
- `tsc --noEmit` limpo (ignorando `src/app/sistran-river-park-3d/`) e `eslint` limpo nos quatro arquivos.
- As quatro `/images/home/*.jpg` respondem 200; o HTML servido da home traz quatro `<img class="solution-image">` com `alt` real, e `escritoriosp.jpg` aparece duas vezes (tile + card 01).
- `next.config.mjs` tem `images: { unoptimized: true }`, então o `next/image` emite o `src` cru e `/_next/image?url=...` responde 404 por definição — não é defeito.

Causa confirmada: não era caminho nem carregamento — não existia elemento de imagem. A SIS-20 fica superada por esta.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/data/types.ts`
- `src/data/solutions.ts`
- `src/components/Solutions.tsx`
- `src/data/legacy.ts`

---

## SIS-33 — Hero: nascer do fio condutor e entregar o movimento para o mosaico

**Status:** Done · **Labels:** — · **Fechada em:** 26/08/2026 · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-33/hero-nascer-do-fio-condutor-e-entregar-o-movimento-para-o-mosaico

### Pedido
O `HeroCinematic` (`src/components/HeroCinematic.tsx`, `id="top"`) já encolhe e vira card; falta ser o início do fio condutor (SIS-30) e o convite a rolar. O fio ancora no hero e começa no primeiro gesto de scroll. Cue de rolagem irmã do bloco sticky, nunca filha do que anima em `scale` (`position: fixed` morre sob ancestral com `transform`). Conferir emenda hero → mosaico e que o fio atravessa (`overflow: hidden` corta; usar `clip`). Não redesenhar o hero nem mexer no modal/botão. Cue decorativo sob `prefers-reduced-motion`. Validação: sem rolar, título e cue visíveis; primeiro scroll desenha o fio e o cue sai; emenda sem piscar; `npx tsc --noEmit` (filtrando `sistran-river-park-3d`) e `npx eslint`.

### O que foi feito
**Sem alteração de código — verificada como já satisfeita.** Registro do que foi conferido, item por item:

- **O fio nasce no hero.** A primeira parada do `ScrollSpine` é `#top`, e a linha viva começa a ser desenhada a partir de `--scroll-p = 0` — do primeiro pixel de scroll, dentro do hero. Entregue em SIS-30 (`c2b1d63`).
- **A dica de scroll (`.hero-cue`) já está correta.** Ela é **irmã** da cena sticky, nunca filha do nó que sofre `scale`. Já desaparece sozinha, por `useScrollOpacity`.
- **A emenda hero → mosaico foi deixada intocada de propósito** em SIS-32: o hero encolhe em card sobre fundo claro e entrega a cor do mosaico por conta própria. Pôr camada de costura ali seria pintar por cima de uma emenda que já funciona.

Nada a implementar. Fechando para não deixar uma task aberta sugerindo trabalho pendente onde não há.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
Não declarados no relatório.

---

## SIS-277 — /parceiros · tag da abertura vira carimbo-parcerias.png (efeito ao entrar)

**Status:** In Review · **Labels:** conferir · **Fechada em:** — · **Responsável:** —
**Link:** https://linear.app/sistran-labs/issue/SIS-277/parceiros-tag-da-abertura-vira-carimbo-parceriaspng-efeito-ao-entrar

### Pedido
Em `/parceiros-e-implementacoes`, substituir o eyebrow «Parceiros e Implementações» do `PageHero` pelo carimbo `public/carimbo/carimbo-parcerias.png` com efeito de batida ao entrar (viewport/load), sem pin/ScrollTrigger. Manter o h1 salvo redundância demais (reportar, não apagar sem aval). Reusar o padrão de `CarimboRealizadoSistran` (SIS-235): GSAP batida + tombo; `animar` + reduce = estado final. Critérios: tag textual some e o carimbo aparece; efeito perceptível e reduce OK; h1 acessível; capturas 1440; lint OK. Fora de escopo: tags das seções abaixo, capa SIS-225/228, eventos.

### O que foi feito
Sonda: `scripts/medir-carimbo-parcerias-sis277.mjs [antes|depois]` → `docs/medidas/sis277-{antes,depois}.json`. Larguras 1440 e 1024, e os dois canais de movimento reduzido.

**1. Trocar o eyebrow textual pelo PNG do carimbo.** `eyebrow="Parceiros e Implementações"` saiu de `src/app/parceiros-e-implementacoes/page.tsx` e no lugar entra `<CarimboBatida>` pela prop nova `eyebrowArte` do `PageHero`.
- antes @1440: `tagTextual` = «Parceiros e Implementações», caixa **273×16**, `font-size: 12px`; `carimbo: null`.
- depois @1440: `tagTextual: null`, `textoDaTagForaDoH1: []` — a tag saiu do DOM. `carimbo` **273,6×85,5** em topo 240, `img.naturalWidth: 640`.
- depois @1024: carimbo **240×75**, `vaza: false` nas duas larguras.

Perfil de tinta do PNG (1524×476): «PARCEIROS E» ~11,8% da altura e «Implementações» ~22%. H=85px → 10,0px e «Implementações» com 18,8px. Daí `--carimbo-batida-w: clamp(15rem, 19vw, 17.5rem)`. A 1440 dá 273,6px — a mesma largura da tag que saiu (273px) e **55% da largura do `h1`** (500,4px, fonte 70,4px). Aritmética no cabeçalho de `src/components/carimbo-batida.css`.

**2. Efeito de carimbo ao entrar** — montagem, sem pin/ScrollTrigger. Amostrado por `requestAnimationFrame` em `DOMMatrixReadOnly`:

| | 1440 | 1024 |
|---|---|---|
| `liberadoEm` (portão) | 2678 ms | 2493 ms |
| 1º quadro em movimento | **2683 ms** (`liberado: "true"`) | **2497 ms** (`liberado: "true"`) |
| `escalaMax` → `escalaMin` → repouso | 1,85 → 0,919 → 1 | 1,85 → 0,915 → 1 |
| `opacidadeMin` | 0 | 0 |
| `giroMax` | 7° | 7° |
| `quadrosEmMovimento` | 3 | 7 |

O ricochete (0,919 abaixo de 1) é o `back.out(1.7)`. A batida espera o portão da rota (`RouteLoadGate`): `pronto = paginaCarregada && (portao === null || portao.liberado)` — precedente do `CountUp` / defeito da SIS-243.

**3. Acessível** — `alt="Parceiros e Implementações"`. `h1` intacto: «Parceiros e Implementações», caixa 500,4×135,2, `quantosH1NaPagina: 1`.

**4. Peso** — PNG tem alfa real (RGBA, extremos 0/255). Derivada: `scripts/gerar-carimbo-parcerias-sis277.mjs` gera `public/images/parceiros/carimbo-parcerias.webp` a 640px → **640×200, alfa preservado, 38 kB contra 189 kB (−80%)**. Com `images: { unoptimized: true }` (SIS-154) o arquivo do disco é o que chega. Achado: modo com perda é o mais pesado (q92+aq100 = 57 kB; lossless = 46 kB; `nearLossless(q80)` = **38 kB**).

**5. Reduce — nasce no estado final** — `prefers-reduced-motion: reduce` e `html[data-motion="reduce"]`: opacidade **1**, caixa 273,6×85,5, `transform: none`. Folha força estado final com `!important`.

**Console:** `erros: []` nas duas larguras. **Lint:** linha de base `✖ 79 problems (31 errors, 48 warnings)`, exit 0; depois igual. `npx tsc --noEmit` limpo.

**Pontos relatados, não resolvidos sozinhos:** redundância arte + `h1` continua (a tag textual já dizia a mesma frase; arte 85px vs 16px da tag). Unificar `CarimboBatida` com `CarimboRealizadoSistran` pede issue própria (caminho fixo, `alt` de `EVENT_KIND_META`, tombo −6°; cápsula daqui já vem tombada −3,05° no arquivo). Fora de escopo não tocado: tags das seções de baixo, capa SIS-225/228, carimbos de eventos.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/app/parceiros-e-implementacoes/page.tsx`
- `src/components/PageHero.tsx`
- `src/components/CarimboBatida.tsx`
- `src/components/carimbo-batida.css`
- `scripts/medir-carimbo-parcerias-sis277.mjs`
- `scripts/gerar-carimbo-parcerias-sis277.mjs`
- `public/images/parceiros/carimbo-parcerias.webp`
- `docs/medidas/sis277-antes.json`
- `docs/medidas/sis277-depois.json`

---

## SIS-276 — /esg · Fale com a Gente!: grafismo cortado/baixo demais no rodapé

**Status:** In Review · **Labels:** conferir · **Fechada em:** — · **Responsável:** —
**Link:** https://linear.app/sistran-labs/issue/SIS-276/esg-fale-com-a-gente-grafismo-cortadobaixo-demais-no-rodape

### Pedido
Em `/esg`, no bloco **Fale com a Gente!** (`ContactCTA` + `layoutReferencia`), o grafismo da direita (blob + logo + órbitas + botão) fica baixo demais e encosta/corta no rodapé. Medir a 1440 (bbox da arte vs fundo da seção vs topo do footer); subir o conjunto / aumentar respiro / overflow visível na arte sem vazar scroll horizontal. Não regressar motion SIS-253 nem logo HD SIS-265. Capturas 1440 (e 1024 se o piso mudar). Fora: redesign, outras rotas `ContactCTA`, reveal SIS-271.

### O que foi feito
**1. Medição a 1440: a causa não é nenhuma das três hipóteses da issue.** `docs/medidas/sis276-antes.json`, coordenadas de documento: seção `.cta-ref` 5174–**5716** (`overflow: hidden`, padding 128/128); `.cta-ref-palco` 5302–5588 (h 286); `.cta-ref-arte` 5445–**5786** (h 341); região de filtro do blob 5343–**5888**; `footer` em **5716**. `arteAlemDoFundoDaSecao: 70` · `filtroAlemDoFundoDaSecao: 172` · `arteAlemDoTopoDoRodape: 70`. A 1024: 27 e 120.

Não é `padding-bottom` insuficiente (128px; palco termina 128px antes do fim), não é «posição final baixa» de desenho; o `overflow: hidden` só transforma o deslocamento em **corte**. Causa medida: computado da arte **`transform: "none"`**, `top: "143.047px"`. A centragem `transform: translateY(-50%)` foi **cancelada pelo preset de reveal**: SIS-271 pôs `data-reveal="fade"` neste nó, e o estado final `[data-in='true'] [data-reveal] { opacity: 1; transform: none }` tem especificidade (0,2,0) contra (0,1,0) da classe. Sem a subida de 170px (metade de 341), a arte desce 170px. Os dois espelhos de reduced-motion declaram o mesmo `transform: none !important`. A arte precisa estar centrada: `aspect-ratio: 760/620` → 341px contra palco 286px (`arteMenosPalco: 55`).

**2. Correção: `transform` → `translate`, duas linhas.** `transform` e `translate` são independentes; o UA compõe `translate` antes de `transform`, então `transform: none` do reveal não apaga um `translate`. Nada de `!important`, nada no reveal da SIS-271, nada no SVG.
- `.cta-ref-arte` (desktop, `globals.css`): `transform: translateY(-50%)` → `translate: 0 -50%`.
- `.cta-ref-botao` (base): `transform: translate3d(var(--cta-ref-botao-x), var(--cta-ref-botao-y), 0)` → `translate: var(--cta-ref-botao-x) var(--cta-ref-botao-y)`; `transition` de `transform 420ms` para `translate 420ms`.

**3. «Botão afundado» — mesma causa.** Também tem `data-reveal="fade"`. Antes: terminava em `transform: none`, 24px abaixo (topo 5437 servido → 5461 no estado final); hover de 6px não acontecia. Depois: topo estável em 5437, hover 792 → 798 e volta.

**4. Depois (1440 / 1024).** Arte 5275→5616 a 1440: `arteAlemDoFundoDaSecao: -100`, `arteAlemDoTopoDoRodape: -100` (era +70). A 1024: −128 e −35. Região de filtro: excedente inferior 172px → 2px (no topo, `feDropShadow` `y="-30%" height="160%"`). `rolagemHorizontal.vaza: false`. `overflow-hidden` da seção **mantido**. Reduce nos dois canais: `translate: "0px -50%"`, `transform: "none"`, `opacity: 1`. SIS-253: `animation-name: cta-ref-flutua` / `cta-ref-orbita-pulsa`. SIS-265: `seloNaturalWidth: 640`. `pousoDoPonto` a 1440 `{dx: -7.6, dy: -3.5}` — o `dx: -7.6` é pré-existente (SIS-253), fora de escopo. `erros: []`; `tsc --noEmit` limpo.

**Portão de lint:** linha de base `✖ 79 problems (31 errors, 48 warnings)`; depois igual, exit 0.

**Artefatos:** `scripts/medir-cta-arte-sis276.mjs`, `docs/medidas/sis276-antes.json`, `docs/medidas/sis276-depois.json`. Capturas conferidas e apagadas neste turno.

**Observação:** qualquer nó que dependa de `transform` para posição de layout e receba `data-reveal` perde essa posição no estado final; remédio: declarar em `translate`.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/app/globals.css`
- `scripts/medir-cta-arte-sis276.mjs`
- `docs/medidas/sis276-antes.json`
- `docs/medidas/sis276-depois.json`

---

## SIS-275 — Home · reveal on scroll em toda a página (docs/scroll.md)

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** —
**Link:** https://linear.app/sistran-labs/issue/SIS-275/home-reveal-on-scroll-em-toda-a-pagina-docsscrollmd

### Pedido
Na home (`/`), aplicar o reveal on scroll de `docs/scroll.md` (`RevealScope` + `[data-reveal]`), blocos surgindo conforme a rolagem, não em massa após o load — padrão SIS-263 + calibre SIS-269. Não duplicar SIS-197/195/194/189. Sticky (`ProofJourney` etc.) sem wrapper com `transform`. Calibre canônico: `MARGEM = 0px 0px -12% 0px`, `LIMIAR = 0.15`. Sem `esperarRota` em massa. Ordem em `page.tsx` auditada no despacho (hero/BrandGrid/sticky/Contact/Social fora de segundo reveal). Critérios: blocos revelam na vez; sem massa no load; sticky intacto; reduce OK; capturas 1440; lint OK; nota vs SIS-197.

### O que foi feito
Calibre canônico `-12%` / `0.15` em `src/lib/reveal-calibre.ts`; Soluções + Impacto recalibrados. Medido 1440: acendem em scrollY 2480 e 6400, não no load. Sticky intacto. lint/tsc/build OK nos arquivos tocados.

### Conferência
Conferência dispensada a pedido da usuária («não confira»). Issue em In Review **sem** label `conferir` / **sem** `conferido`. Sem comentário de conferente com VEREDITO.

### Arquivos tocados
- `src/lib/reveal-calibre.ts`

---

## SIS-274 — RouteLoadGate · fundo #1273bc + logo HD no lugar de SISTRAN

**Status:** In Review · **Labels:** conferir · **Fechada em:** — · **Responsável:** —
**Link:** https://linear.app/sistran-labs/issue/SIS-274/routeloadgate-fundo-1273bc-logo-hd-no-lugar-de-sistran

### Pedido
No carregamento de troca de página (`RouteLoadGate`): fundo `#1273bc` (hoje degradê navy `#041b3d` → `#071d36` → `#0a3156` + glow ciano); no lugar de «SISTRAN» (`.wordmark`), a logo `/logosistranaltadefinicao.png`. Cuidado com fundo preto do PNG (mask/blend/alfa). Manter `.signal` se legível. `alt=""` + status «Carregando…». Reduce sem regressão. Fora: outros loaders, favicon, header/footer, SIS-265.

### O que foi feito
Portão: `scripts/medir-portao-sis274.mjs` → `docs/medidas/portao-sis274.json`. Asset: `scripts/gerar-logo-portao-sis274.mjs` → `docs/medidas/logo-portao-sis274.json`.

A premissa do «fundo preto» não se confirmou (mesma constatação da SIS-265). Medido em `public/logosistranaltadefinicao.png`: `hasAlpha` true; pixels em `alpha = 0` **80,6%**; cantos e centro `[0, 0, 0, 0]`; pixels opacos escuros **0**; luminância média dos opacos **254,8 / 255**. Aplicado: só reamostragem premultiplicada + WebP.

**1. Overlay = `#1273bc`.** Medido nos dois caminhos (`key={usePathname()}`): primeiro carregamento (`/`) e clique → `/trabalhe-conosco`: `backgroundColor` `rgb(18, 115, 188)`, `backgroundImage: none` (saiu degradê navy e `radial-gradient` ciano a 14%).

**2. Centro = logo HD, sem texto «SISTRAN».** `textoVisivelDoOverlay: "Carregando…"`. `<img src="/images/loading/logo-sistran-portao.webp">`, `naturalWidth: 320`. A regra `.wordmark` saiu inteira do CSS. O PNG HD é só o símbolo (anel + swoosh), sem letreiro.

**3. Sem caixa preta.** Arquivo derivado achatado sobre `#1273bc`: `cantosTodosIguaisAoFundo: true`, `perimetroForaDoFundo: 0`. Na tela, moldura de 12 px ao redor da caixa 128×128: `pixelMaisEscuroDaMoldura` **`[18, 115, 188]`**; `pixelsForaDoAzul` 144 (grade de 48 px); `piorDesvioPorCanal` 16 (todos clareando).

**4. Nitidez.** DPR 1: arquivo 320 / CSS 128 / razão **2,50**. DPR 2: 256 px de dispositivo, razão **1,25**. `clamp(4.5rem, 16vw, 8rem)`; teto 8 rem = 128 px → lado 320 do asset. Peso: **324.169 → 11.154 bytes (−96,6%)**. `<img>` cru com `eslint-disable` documentado, `width`/`height` intrínsecos. `images: { unoptimized: true }` (SIS-154).

**5. Sinal.** Contraste WCAG 1.4.11 (3:1): `#2ac4ff` **2,48:1** reprova; `#0ed8f6` **2,90:1** reprova; `#fff` **5,00:1** passa. Sinal virou branco: `corDaBarra: rgb(255, 255, 255)`, trilha `rgb(255 255 255 / 0.28)`, halo branco. Grade `::before` de ciano 6% para branco 8%.

**6. Acessível.** `altVazio: true`; `status: { texto: "Carregando…", ariaLive: "polite" }`; `marcaAriaHidden: true`. `backgroundColor: rgba(0,0,0,0)` e `mixBlendMode: normal` no `<img>`.

**7. Reduce.** Media query `reduce` e `html[data-motion="reduce"]`: `animationName` do sinal `none`; largura da barra **240 px**; `transitionDuration` do overlay `1e-05s`; logo 128 px visível. Capturas: `sis274-portao-1440-carregamento.png`, `-troca-de-rota.png`, `-reduce.png`.

**8. Lint.** `npm run lint` → **79 problemas (31 erros, 48 avisos)** — linha de base; zero problemas nos arquivos tocados.

Fora de escopo respeitado. Não resolve: erro TS pré-existente em `src/app/esg/page.tsx` (`TS17008: JSX element 'RevealScope' has no corresponding closing tag`, SIS-271).

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/loading/RouteLoadGate.tsx`
- `src/components/loading/RouteLoadGate.module.css`
- `scripts/medir-portao-sis274.mjs`
- `scripts/gerar-logo-portao-sis274.mjs`
- `docs/medidas/portao-sis274.json`
- `docs/medidas/logo-portao-sis274.json`
- `public/images/loading/logo-sistran-portao.webp`

---

## SIS-273 — /solucoes · reveal on scroll (docs/scroll.md)

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** —
**Link:** https://linear.app/sistran-labs/issue/SIS-273/solucoes-reveal-on-scroll-docsscrollmd

### Pedido
Aplicar reveal on scroll (`docs/scroll.md` / `RevealScope` + `data-reveal`) em `/solucoes`, alinhado a `/contato`, calibre por scroll (SIS-269). Proibido wrapper com `transform` em volta de sticky. Aplicar em blocos estáticos (hero, grades, CTA) sem orquestração. Subrotas `/solucoes/[slug]` fora, salvo se o pedido for só o índice — reportar. Critérios: índice revela ao rolar sem massa no load; sticky intacto; capturas; lint OK.

### O que foi feito
Tudo **medido** (`docs/medidas/sis273-depois.json`, Playwright 1440×900 e 390×844, `window.scrollY` por causa da interpolação do Lenis).

**Índice revela ao rolar, sem massa no load.** 6 nós marcados, em 3 escopos. `animaramForaDaTela: 0` · `piorDistancia: 0` · `semAcender: 0`. 1440×900: `servicos-abertura` acende em `scrollY 1797`, topo a **566px = 63%**; `servicos-cta` em `scrollY 4353`, topo a **757px = 84%**. Pior resíduo dos filhos: −25px. 390×844: `nav-ancoras` em `scrollY 0` (nasce na dobra → `esperarRota`); `servicos-abertura` em `scrollY 3638` (59%); `servicos-cta` em `scrollY 4477` (82%). `invisiveis: 0`.

**Sticky intacto.** 12 amostras: `.svc-journey-stage` e `.svc-journey-intro` presos em `top = 108` enquanto o card avança **0 → 1 → 2 → 3** (`scrollY` 2502 / 2975 / 3434 / 3922). `getComputedStyle().position` = `sticky` nas 12. Nenhum `RevealScope` / `[data-reveal]` é ancestral de um `sticky`. O escopo é o trilho (`.svc-journey-head`), só escreve `data-in`.

**Capturas; lint.** 7 capturas anexadas. `npm run lint` = **79 problems (31 errors, 48 warnings)** — linha de base. `npx eslint` nos três arquivos tocados → **0 problemas**. `npx tsc --noEmit` → exit 0. `npx next build` → exit 0.

**Os três escopos:** `nav-ancoras` (barra «Nesta página», `src/app/solucoes/page.tsx`, padrão + `esperarRota`); `servicos-abertura` (trilho sticky, `src/components/ui/ServicesJourneyStage.tsx`, par do trilho); `servicos-cta` («Quero um serviço exclusivo», padrão). Calibre: `src/app/solucoes/reveal-calibre.ts` — `MARGEM_REVEAL '0px 0px -12% 0px'` / `LIMIAR_REVEAL 0.15`, mais `LIMIAR_REVEAL_TRILHO 0` + `MARGEM_REVEAL_TRILHO '0px 0px -36% 0px'` (trilho ~2.200px; 15% viraria ponto arbitrário). 1ª volta −28% deixou 2º parágrafo 39px abaixo da dobra; −36% dá resíduo **0**.

**Não marcados:** `PageHero` (LCP, 14 rotas); `Accelerators` (`whileInView`); `Consulting` (`whileInView`); `ContactCTA` (`vFadeUp` + `whileInView`); os 4 cards da pilha (`sticky` / `is-active`). Subrotas `/solucoes/[slug]` (7) **fora**. Reduce: 6 marcados, **0 invisíveis**, pior opacidade **1**. Sem JS: idem.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/app/solucoes/reveal-calibre.ts`
- `src/app/solucoes/page.tsx`
- `src/components/ui/ServicesJourneyStage.tsx`

---

## SIS-271 — /esg · reveal on scroll (docs/scroll.md)

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** —
**Link:** https://linear.app/sistran-labs/issue/SIS-271/esg-reveal-on-scroll-docsscrollmd

### Pedido
Aplicar reveal on scroll em toda `/esg`, padrão `/contato` (SIS-263), calibre por scroll (SIS-269). Blocos típicos: hero/capa (LCP sem reveal longo), intro ESG, ENVIRONMENT / SOCIAL / GOVERNANCE (stagger leve; não quebrar SIS-237/252), Fale com a Gente!. Não envolver sticky/`fixed` com `transform`. Reduce OK. Critérios: revela conforme o scroll; sem regressão nos cards/foguete; capturas; lint OK.

### O que foi feito
Medido no Chromium 1440×900. JSON em `docs/medidas/sis271-depois.json`.

**Página revela conforme o scroll.** Oito escopos: Intro ESG `scrollY` 79 (332px); ENVIRONMENT parágrafo 787 (130px); ENVIRONMENT 6 cartões 1144 (598px); SOCIAL Gerando Talentos 2229 (552px); SOCIAL 2 projetos 2719 (512px); GOVERNANCE parágrafo 3514 (65px); GOVERNANCE 6 cartões 3848 (646px); Fale com a Gente! 4585 (286px). `semAcender: 0` (26 nós).

Dos 26 nós, **1** ainda TERMINA a animação abaixo da dobra, a **165px** (último parágrafo do Gerando Talentos). 1ª volta com limiar 0.15: **9 de 26**, pior caso 283px (segunda fileira das grades + cauda da coluna). Correção: `LIMIAR_REVEAL_BLOCO = 0.35` nos três escopos altos (desloca ignição 110–129px). Conta no docblock de `src/app/esg/reveal-calibre.ts`. Comparação: `/contato` pós-SIS-269 ficou em 2 de 15, pior 207px.

**Sem regressão nos cards / foguete.** Flutuação (SIS-252): seis amostras a 260ms, `translateY` 6.87 → 5.95 → 4.53 → 2.76 → 0.74 → −1.59px. Hover (SIS-237): `.esg-superficie` `transform: none` sem ponteiro e `matrix(1.02, 0, 0, 1.02, 0, -12)` com ele. `data-reveal` no WRAPPER, nunca na `.esg-superficie`; preset `fade`, nunca `fade-up`. Foguete SOCIAL irmão anterior do `.container-lp`, nunca descendente de `[data-reveal]`.

**Capturas; lint.** Três anexadas (ENVIRONMENT meio/fim + Fale com a Gente!). `npx tsc --noEmit` sem saída. `npx eslint src/app/esg src/components/ContactCTA.tsx src/components/ContactCTAReferencia.tsx` sem saída. `npm run lint` do projeto: **80 problemas (31 erros, 49 avisos)** — linha de base de antes; nenhum nos arquivos desta issue.

**Reduce / sem JS:** `prefers-reduced-motion: reduce` → 26 nós, **0 com `opacity < 0.99`**. JS desligado → 26 marcados, **0 invisíveis**.

**Não marcados:** capa (LCP); três `TituloAceso`; `GaleriaTurmas` + `FogueteScroll`. `ContactCTA` / `ContactCTAReferencia`: prop opt-in `revelar`.

**Ressalva fora de escopo:** `scripts/medir-intro-esg-sis261.mjs` mira nós que agora nascem com `opacity: 0` e espera 400ms enquanto o reveal leva 500ms + cascata.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/app/esg/reveal-calibre.ts`
- `src/app/esg/page.tsx`
- `src/components/ContactCTA.tsx`
- `src/components/ContactCTAReferencia.tsx`

---

## SIS-270 — /trabalhe-conosco · reveal on scroll (docs/scroll.md)

**Status:** In Review · **Labels:** conferir · **Fechada em:** — · **Responsável:** —
**Link:** https://linear.app/sistran-labs/issue/SIS-270/trabalhe-conosco-reveal-on-scroll-docsscrollmd

### Pedido
Aplicar `RevealScope` + `[data-reveal]` em toda `/trabalhe-conosco`, espírito da SIS-263. Não copiar o calibre quebrado da 2ª volta de `/contato` (`+12%` + limiar `0.08` + `esperarRota` em todos). Preferir calibre SIS-269. Auditar abertura (LCP), `CurriculoCard` (já tem cortina GSAP), `Social`. Marcar blocos, não palavras. Reduce / sem JS = visível. Critérios: seções revelam ao rolar, não em massa; sem colisão com form/hero; capturas; lint OK.

### O que foi feito
Portão: `scripts/medir-reveal-carreira-sis270.mjs` → `docs/medidas/reveal-carreira-sis270.json`. 1440×900.

A rota tem **1970px** (2,2 janelas). `.cv-secao` topo 240, altura 456, já tem cortina GSAP `clip-path` (`ScrollTrigger`, `top 82%`); `.carreira-beneficios` 577 / 55, **nenhuma** entrada; `.carreira-slogan` 671 / 18, **nenhuma**; `#social` 792 / 736, `whileInView`. Três dos quatro já animavam; os dois sem animação somam 73px, ambos na primeira dobra. §6 de `docs/scroll.md` proíbe marcar o resto.

Um único escopo, `RevealScope esperarRota data-reveal-nome="abertura"`, sobre a lista de benefícios (3 `<li>` em `fade-up`, `--reveal-i` 0–2) e o slogan (`fade-up` + `line-up`, `--reveal-i` 3). `esperarRota` porque o bloco está na primeira dobra (topo 577 numa janela de 900).

**Critérios:** `semSegundoReveal: { curriculo: 0, social: 0, tituloDoHero: 0 }`. `ordemCortina: { msCortinaLevantou: 2671, msEscopoAcendeu: 2796, acendeuDepoisDaCortina: true }`. Reduce: 5 nós em `opacity 1 / transform none` com `html[data-motion="reduce"]`; `semJsMarcados: 5`. `npm run lint` = **79 problems (31 errors, 48 warnings)**, linha de base. Capturas `docs/capturas/sis270-carreira-1440-topo.png` e `…-abertura.png`. «Seções revelam ao rolar»: `linhaDoTempo: [{ nome: 'abertura', scrollY: 0 }]` — o escopo marcado acende em `scrollY: 0` (primeira dobra). O fecho acende em `scrollY: 500` (não é obra desta issue). Não há bloco fora da dobra sem entrada própria.

Calibre da casa: `margem: '0px 0px -12% 0px'`, `limiar: 0.2`. `/contato` não tocado.

**Correções ao próprio rascunho:** (1) `VP_SCROLL` / `entradaPorScroll` em `Social`/`CartaoDuasFaces` removidos — hipótese falsa (`scrollYQuandoAcendeu` = 400 com e sem). (2) Defeito pré-existente: `reduceFecho: "0"` — com reduce, o `<h2>` do fecho fica invisível; medido com `git stash` igual; pede issue própria.

`npx tsc --noEmit`: um erro em `src/app/esg/page.tsx(550,12)` (`RevealScope` sem closing tag) — SIS-271, não tocado.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/app/trabalhe-conosco/page.tsx`
- `src/lib/motion.ts`
- `scripts/medir-reveal-carreira-sis270.mjs`
- `docs/medidas/reveal-carreira-sis270.json`

---

## SIS-269 — /contato · reveal deve acompanhar o scroll (não tudo após o load)

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** —
**Link:** https://linear.app/sistran-labs/issue/SIS-269/contato-reveal-deve-acompanhar-o-scroll-nao-tudo-apos-o-load

### Pedido
Em `/contato` o reveal (SIS-263) dispara quase tudo de uma vez após o load (cortina do `RouteLoadGate`). Desejado: cada bloco só surge quando a rolagem o aproxima. Diagnóstico: `MARGEM_REVEAL = '0px 0px 12% 0px'` positiva, `LIMIAR_REVEAL = 0.08`, `esperarRota` em todos. Recalibrar (margem negativa ~−8% a −12%, limiar ~0.15–0.2) ou `esperarRota` só no 1º bloco. Provar timeline. Atualizar `reveal-calibre.ts` + docblocks. Reduce + sem JS; LCP do hero sem segundo reveal. Fora: outras rotas, redesign.

### O que foi feito
Medido a **1440×900**, `MutationObserver` em `data-in` antes da cortina, `data-route-liberado="true"`, `mouse.wheel` em passos de **60px**. Rota 4280px; 5 escopos `RevealScope`, 15 nós `[data-reveal]`.

O diagnóstico da issue estava certo no mecanismo e errado no sintoma: não era cascata global no `liberado`. Escopos em `scrollY≈0`: **1** de 5 antes e depois. Nós que animam **abaixo da dobra**: **8** de 15 → **2** de 15. Pior distância: **450px** → **207px**. No load só a faixa de indicadores acendia (61% na tela). Com margem positiva 12% (raiz +108px abaixo da dobra) e limiar 0.08, oito nós terminavam a animação antes de entrar na tela.

`src/app/contato/reveal-calibre.ts`: `MARGEM_REVEAL` `'0px 0px 12% 0px'` → **`'0px 0px -12% 0px'`** (≈ `top 88%`). `LIMIAR_REVEAL` `0.08` → **`0.15`** (não 0.2). Cinco escopos acendem com o topo entre **72% e 84%** (963px→72%, 784px→75%, 480px→80%, 221px→84%). `esperarRota` só no 1º bloco da dobra (`MetricsBand`). Duração 820ms, curva expo-out e cascata de 95ms intactas.

Timeline depois: indicadores `scrollY` **0**; faixa de parceiros 257 (era 32); painel 584 (era 298); mapa **1650** (era 1387); `#timeSISTRAN` **2513** (era 2277).

Portões: 1 de 5 em `scrollY 0`; medidas em `docs/medidas/sis269-antes.json` e `sis269-depois.json`; reduce e sem JS: **0** de 15 com opacidade < 0.99; LCP do hero sem segundo reveal; `npx eslint src/app/contato src/components/MetricsBand.tsx` e `npx tsc --noEmit` limpos; `npm run lint` **79 problemas (31 erros, 48 avisos)** pré-existentes. Docblocks «3ª volta» em `page.tsx` e `MetricsBand.tsx`.

**Não resolvido:** 2 nós animando abaixo da dobra (79px e 207px) — 3º e 4º parágrafo de `#timeSISTRAN`, granularidade de escopo. Nenhuma outra rota tocada.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/app/contato/reveal-calibre.ts`
- `src/app/contato/page.tsx`
- `src/components/MetricsBand.tsx`
- `docs/medidas/sis269-antes.json`
- `docs/medidas/sis269-depois.json`

---

## SIS-266 — Footer · item ativo na coluna Navegação conforme a página

**Status:** In Review · **Labels:** conferir · **Fechada em:** — · **Responsável:** —
**Link:** https://linear.app/sistran-labs/issue/SIS-266/footer-item-ativo-na-coluna-navegacao-conforme-a-pagina

### Pedido
Na coluna **Navegação** do footer, o item da página atual deve aparecer selecionado. Hoje todos os `Link` em `Footer.tsx` usam a mesma classe, sem `usePathname` / `aria-current`. Match: pathname igual ao `href` ou prefixo (`/solucoes/...` acende Soluções; `/blog` não). Visual: contraste no azul (branco + `font-semibold` e/ou underline / ciano `#0ed8f6`). `aria-current="page"`. Preferir extrair `matchActive` compartilhado com o header. Home (`/`): nenhum item acende. Critérios: cada rota da lista com o link certo; subrotas de Soluções acendem «Soluções…»; contraste OK no `#1273BC`; capturas 1440 em ≥2 rotas; lint OK.

### O que foi feito
Portão: `scripts/medir-rodape-ativo-sis266.mjs` → `docs/medidas/rodape-ativo-sis266.json`. Sete rotas da lista + `/transformacao-legado`, `/sistran-labs`, `/`, `/blog` a 1440×900.

**1. Detectar e marcar.** `src/components/layout/RodapeNav.tsx` (`usePathname`). Em cada uma das sete rotas exatamente **1** item aceso e o certo (`confere: true` nas 11 rotas). `/transformacao-legado` acende Soluções sem `aria-current`; `/sistran-labs` acende Quem somos sem `aria-current`; `/` e `/blog` nenhum.

**2. Match.** `matchActive`: `pathname === href || pathname.startsWith(href + '/')`. `/` só por igualdade. `institucionalComEstado: 0` nas 11 rotas. Subrota `/transformacao-legado` é filha declarada em `data/nav.ts`, não prefixo de `/solucoes` — `ramoAtivo` resolve.

**3. Visual.** Estado de hover fixado: seta ciana `→` + sublinhado `#0ed8f6` (bloco SIS-59), mais branco + `font-semibold`. Fundo composto `rgb(18, 115, 188)`: **ativo 5,00:1**, inativo 4,27:1. Correção de estimativa: `--ink-muted` do rodapé é `#E2EFFA`; 5,00 vs 4,27 não se lê pela cor — quem carrega o estado é sublinhado + seta + peso. Exceção a `.lp-rodape-nav:hover li:not(:hover) a { opacity: .55 }` em 0.8 para o ativo.

**4. `aria-current="page"`** só no ativo das sete rotas da lista. Nas rotas-filhas o pai acende **sem** `aria-current` (mesma separação do header).

**5. Extração.** `src/lib/navAtivo.ts` com `matchActive` + `ramoAtivo`, lógica inalterada. `Header.tsx` importa daqui. Módulo sem `'use client'`. `Footer.tsx` **continua Server Component**; só a lista de sete links é cliente.

**Portões:** capturas `docs/capturas/sis266-rodape-1440-esg.png` e `…-contato.png`. `npx tsc --noEmit` limpo. `npx eslint` nos tocados: 0 erros (3 avisos pré-existentes em `Header.tsx`). `npm run lint`: **79 problemas (31 erros, 48 avisos)** — mesmo número da árvore limpa.

Fora de escopo: coluna Institucional, redesenho, logo HD, home.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/lib/navAtivo.ts`
- `src/components/layout/RodapeNav.tsx`
- `scripts/medir-rodape-ativo-sis266.mjs`
- `src/components/Footer.tsx`
- `src/components/Header.tsx`
- `src/app/globals.css`

---

## SIS-265 — /esg · Fale com a Gente!: logo HD logosistranaltadefinicao.png

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** —
**Link:** https://linear.app/sistran-labs/issue/SIS-265/esg-fale-com-a-gente-logo-hd-logosistranaltadefinicaopng

### Pedido
Em `/esg`, na seção **Fale com a Gente!** (`ContactCTA` com `layoutReferencia`), trocar `/images/sistran-logo.png` por `/logosistranaltadefinicao.png` em `ContactCTAReferencia.tsx`. Conferir `width`/`height` / fundo preto (não deixar caixa preta no cartão claro). Follow-up da SIS-253; não reabrir motion/layout. Fora: favicon, `CompanySignature`, BrandGrid, substituição global. Critérios: símbolo usa o HD; sem caixa/preto; nitidez melhor em 1440; demais rotas intactas; lint OK.

### O que foi feito
Entrega sem conferência (pedido explícito).

**Selo `/esg` Fale com a Gente!** `src` = `/images/esg/logo-sistran-cta.webp` (640×640, 27,8 KB). Fonte HD `public/logosistranaltadefinicao.png` (1254×1254) **já tem alfa** — o «fundo preto» é RGB 0,0,0 sob pixels transparentes. Sem threshold (estragaria antisserrilha). `width`/`height` 220×220.

Medido a 1440 no recorte do selo: 0% pixels escuros, símbolo branco no blob azul. Outras rotas seguem com `sistran-logo.png`.

**Portões.** tsc/build OK. lint/`test:copy` vermelhos por arquivos concorrentes (`RevealScope`, etc.); arquivos desta issue limpos. Não conferida.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/ContactCTAReferencia.tsx`

---

## SIS-264 — /trabalhe-conosco · tipografia maior + limpar copy do form e faixas

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** —
**Link:** https://linear.app/sistran-labs/issue/SIS-264/trabalhe-conosco-tipografia-maior-limpar-copy-do-form-e-faixas

### Pedido
Em `/trabalhe-conosco`: (1) aumentar tipografia da abertura (eyebrow Carreira, título/highlight, description, `.carreira-beneficios`, `.carreira-slogan`) em `page.tsx` + `.hero-backdrop--carreira` / `.carreira-*` em `globals.css`; (2) remover faixas verticais `.carreira-vertical--meio` e `--direita`; (3) no `CurriculoCard`: título «Trabalhe conosco» em negrito; tirar «Leva menos de 2 minutos»; tirar checkbox de Política de Privacidade; botão «Enviar». Formulário ainda envia (demo) sem o checkbox. Fora: SIS-258, redesign do card, Contato/Social. Critérios: escritas maiores em desktop e legíveis no mobile; faixas ausentes; copy do form conforme pedido; lint OK; captura 1440.

### O que foi feito
Entrega sem conferência (pedido explícito).

**Tipografia (1440).** Eyebrow 12→14px; h1 teto 48→55px; descrição 20→22px; benefícios 12→14px; slogan 10→12px. Escala só na rota (`.hero-backdrop--carreira` / `.carreira-*`); `PageHero` global intacto. Mobile: h1 42px, sem estouro da manchete.

**Faixas.** `.carreira-vertical*` removidas do JSX e CSS.

**Form.** Título «Trabalhe conosco» peso 700; sem «Leva menos de 2 minutos»; sem checkbox de Política; CTA «Enviar». `privacyNote` de demonstração no pé permanece. Envio demo não exige `privacidade`.

**Portões.** lint 0 erros, tsc/build/`test:copy` OK.

Captura: `docs/medidas/sis264/1440.png`.

Ressalva: a 1440 o botão Enviar pode nascer com opacity 0 no primeiro frame da timeline GSAP do card (SIS-223/258) — fora deste pedido. Não conferida.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/app/trabalhe-conosco/page.tsx`
- `src/app/globals.css`
- `src/components/CurriculoCard.tsx`

---

## SIS-263 — /contato · reveal on scroll em toda a página (docs/scroll.md)

**Status:** In Review · **Labels:** conferir · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-263/contato-reveal-on-scroll-em-toda-a-pagina-docsscrollmd

### Pedido
Em `/contato`, aplicar o reveal on scroll de `docs/scroll.md` na página inteira — todos os blocos relevantes revelam ao entrar no viewport. Usar primitivas da casa (`RevealScope` + `useRevealTrigger` + presets `[data-reveal]` em `globals.css`); não inventar segundo sistema nem Framer Motion. Calibrar gatilho (~top 85%), hero acima da dobra sem atraso longo (LCP), reduce e sem JS com conteúdo visível, sem `transform` em wrapper que quebre sticky/fixed. Fora de escopo: redesign, SIS-259/260/256, outras rotas, Lenis. Aceite: revelação da página inteira, stagger nos cards de números (e time se aplicável), hero sem atraso de LCP, reduce + sem JS legíveis, capturas e lint OK.

### O que foi feito
**1ª volta — primitivas da casa.** Mecanismo: `RevealScope` (`src/components/motion/RevealScope.tsx`) escrevendo `data-in` via `useRevealTrigger`, presets `[data-reveal]` da SIS-197 em `globals.css:21241-21306`. Nenhum `reveal.js` paralelo, nenhum `motion/react` novo, nenhum `SectionReveal`/GSAP. Portão permanente: `scripts/medir-reveal-contato-sis263.mjs` → `docs/medidas/reveal-contato-sis263.json`.

**15 nós marcados** (inventário): 1–7 `li.contato-indicador` preset `fade`, `--reveal-i` 0…6, escopo `div.container-lp` (`MetricsBand`); 8 `div.contato-faixa-parceiros` `fade`; 9 `div.contact-dialog-inner` `fade-up`; 10 `span.tag-section` (#sistran) `fade`; 11 `h2#onde-estamos` `fade-up` i=1; 12 `span.tag-section` (palco) `fade`; 13 `h2#time-sistran` `fade-up` i=1; 14 `p.mt-6.text-lg` `fade-up` i=2; 15 `p.mt-4.text-base` `fade-up` i=3. Cinco escopos; três substituem wrappers existentes. Motivo de `fade` nos sete `<li>`: cada um tem `animation-name: contato-indicador-onda` (infinita, dona do `transform`). Faixa de logos em `fade` para não abrir faixa navy nas emendas SIS-136/259. Não marcados de propósito: hero (`PageHero` / `motion/react`, LCP); superfície do mapa (conteúdo desde SIS-168; painel já tem `gsap.from` SIS-245 `UnitsMap.tsx:765-805`); `CartaoDuasFaces` (`whileInView`).

Calibre 1ª volta: `limiar: 0.2`, `margem: '0px 0px -12% 0px'`, `umaVez` (≈ top 85%). Stagger `--motion-stagger-reveal` 80 ms; sete × 80 = 560 ms. Hero com atraso zero de reveal.

Reduce: `@media (prefers-reduced-motion: reduce)` `{ marcados: 15, ruins: [] }`; `html[data-motion="reduce"]` idem. Sem JS: `{ marcados: 15, escoposComDataIn: 0, invisiveis: 0, textoDoPalco: true }`. Espera da sonda de reduce subiu para 1800 ms porque o espelho `!important` (`globals.css:3246-3280`) não zera `transition-duration` (até 980 ms no pior caso). Quatro `fixed` na rota (`a.skip-link`, `header.fixed`, `div.fixed.inset-0`, `nav.fixed.left-3`) com `dentroDeMarcado: false`. Portão SIS-128: `.contact-dialog-inner` `{ position: "relative", preset: "fade-up" }`.

Varredura 1440, degraus 450 px: y=0 todos invisíveis; y=450 10 invisíveis; y=900 6; y=1800 4; y=3417 `presosNoFim: []`. 390: `{ erros: [], scrollWidth: 390, presosNoFim: 0 }`. Capturas `docs/capturas/sis263-contato-1440-{indicadores,logos,painel,mapa,palco}.png` e `sis263-contato-1440-sem-js.png`. `npx tsc --noEmit` silencioso. Lint 1ª volta: 40 avisos / 0 erros (duplicação `.claude/worktrees/`). Tensão declarada: §9 de `scroll.md` desaconselha reveal em toda seção; o pedido foi seguido com marcação por bloco (15 nós).

**2ª volta — «mais fluido» e surgimento após o carregamento.** Correção: a faixa de indicadores começa em y=742 e o escopo vai até y=1000 (janela 900); 61% já na tela na abertura. Com margem −12% a raiz terminava em 792 e o bloco ficava preso em `data-in="false"`. `useRevealTrigger` ganhou `pronto` (padrão `true`); com `pronto: false` escreve `data-in="false"` e sai sem observar. `RevealScope` ganhou `esperarRota` e `style`; lê `useRouteLoadGate()`; fallback `portao?.liberado ?? true`. `globals.css`: `[data-reveal]` usa `var(--reveal-dur, var(--motion-reveal-base))` e `var(--reveal-ease, var(--motion-ease-out))`. Novo `src/app/contato/reveal-calibre.ts`. Calibre: `rootMargin` −12% → **+12%**; `threshold` 0.2 → **0.08**; duração 500 ms → **820 ms**; curva `cubic-bezier(.19,1,.22,1)`; passo da cascata dos indicadores 80 → **95 ms** (6 × 95 = 570 ms). Abertura medida: `tLiberou 3169ms · tAcendeu 3373ms · msDepoisDaCortina 204ms`; `acendeuSobCortina 0 · escondeuComCortinaJaFora 0 · presosNaDobra 0`. Cascata dos sete cartões 3373–4680 ms. Portão `normal1440`: 15 nós, `presosNoFim: []`, `scrollWidth: 1440`; reduce e sem JS 15/0; 390 sem presos. Lint 2ª volta: 79 problemas (31 errors, 48 warnings) idêntico com `git stash` das mudanças; `npx eslint` nos seis arquivos tocados limpo. Captura nova `sis263-contato-1440-abertura.png`.

### Conferência
Sem registro de conferência no Linear. Em 15/09 a usuária registrou que, após o load, o reveal dispara tudo de uma vez (queria surgimento conforme o scroll); reparação aberta em SIS-269 (irmãs SIS-270 a SIS-273).

### Arquivos tocados
- `src/app/contato/page.tsx`
- `src/components/MetricsBand.tsx`
- `src/components/motion/RevealScope.tsx` / `useRevealTrigger` (2ª volta)
- `src/app/contato/reveal-calibre.ts`
- `src/app/globals.css`
- `scripts/medir-reveal-contato-sis263.mjs`

---

## SIS-262 — /esg · negrito em ENVIRONMENT: / SOCIAL: / GOVERNANCE: nos títulos

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-262/esg-negrito-em-environment-social-governance-nos-titulos

### Pedido
Em `/esg`, negritar só os prefixos **ENVIRONMENT:**, **SOCIAL:** e **GOVERNANCE:** (incluindo o `:`); o restante do título permanece no peso atual. SOCIAL precisa separar o prefixo da lista de projetos, sem forçar `text-gradient-brand` no resto se isso mudar a leitura. Não alterar copy nem `TituloAceso` nas outras rotas salvo prop opt-in. Fora de escopo: cards (SIS-252), intro/capa (SIS-257/261), animação de acendimento. Aceite: os três prefixos em negrito; resto não artificialmente bold; SOCIAL só o prefixo; capturas; lint OK.

### O que foi feito
Entrega sem conferência (pedido explícito). Prop opt-in `negritoTexto` em `TituloAceso` (default false). Só os spans de `texto` ficam `font-bold` (peso 700 medido). `destaque` e `resto` seguem 400. ENVIRONMENT: prefixo 700; «Sustentabilidade Ambiental» 400 + ciano. SOCIAL: `texto="SOCIAL:"` + `resto` da lista de projetos — **sem** `text-gradient-brand`. Copy/aria-label intactos. GOVERNANCE: prefixo 700; «Ética e Transparência» 400 + ciano. Outras rotas não passam a prop. Portões: lint 0 erros, tsc OK, build OK, `test:copy` OK após lock do split SOCIAL. Capturas em `docs/medidas/sis262/`. Intro/cards/foguete não tocados.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
Não declarados no relatório. (O texto cita `TituloAceso` e o split SOCIAL no copy-lock; capturas em `docs/medidas/sis262/`.)

---

## SIS-261 — /esg · seção intro: layout da captura + arte esg2.png (sem fundo)

**Status:** In Review · **Labels:** conferir · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-261/esg-secao-intro-layout-da-captura-arte-esg2png-sem-fundo

### Pedido
Na seção intro de `/esg` (frase «A Sistran demonstra seu forte compromisso com o ESG…»), layout igual à captura: texto à esquerda + arte à direita, usando `public/images/esg/esg2.png` sem fundo (PNG com alfa; sem card branco). Eyebrow traço ciano + **ESG**; fundo claro + grade discreta; não usar mais `esg1` nesta seção. Reparo visual pós-SIS-257. Mobile texto → imagem; contraste AA; capturas 390/1440; lint OK. Fora de escopo: título da capa, ENVIRONMENT/SOCIAL/GOVERNANCE/CTA, redesign da capa `esgcapa`.

### O que foi feito
Portões: `tsc` 0 erros · `npm run lint` 0 erros / 22 avisos · `npm run test:copy` OK, 1207 textos. Medidas `docs/medidas/intro-esg-sis261.json`; sonda `scripts/medir-intro-esg-sis261.mjs`; capturas `docs/capturas/sis261-{390,1440}-{intro,pagina,sem-arte}.png`.

**Transparência de `esg2.png`:** medido com `sharp`: `channels: 3`, `hasAlpha: false` — o xadrez do editor achatado (tabuleiro ~9,2 px, tons ≈198 e ≈139, razão 1,42). Fonte PNG não alterada. Derivada `public/images/esg/esg2.webp` via `scripts/gerar-esg2-alfa.mjs` (`docs/medidas/esg2-alfa.json`): `channels: 4`, `hasAlpha: true`, 54,1% da área vaga, **124 KB** contra 2,1 MB. `src="/images/esg/esg2.webp"`, `width={1613} height={975}`. Prova por pixel (captura com/sem arte): 4 cantos da caixa delta **0, 0, 0, 0** (1440 e 390); centro 171/118; varredura 526 px na faixa vaga **0 transições** > 20, delta máx. 6. `background: rgba(0,0,0,0)`, `box-shadow: none`.

**Layout:** eyebrow «ESG» + traço `.eyebrow--traco` — traço **22×2 px**, gradiente `#0079cb → #0ed8f6 → #7fe6ff`, sem animação. Palavra «ESG» em `#024e86` (ciano como texto em faixa clara ~1,5:1, reprova AA). Superfície `section-light section-light-blue`; malha fina 64 px (período medido: 64 px exatos, 22 colunas a 1440 e 6 a 390). `camadasDeGrade: 1` (`::after` pontilhado 22 px desligado nesta seção — 64 e 22 não múltiplos, moiré). Alt: mosaico de cartões, mãos + globo ESG, folhagem, prédio, turbina, reunião; `altRepeteParagrafo: false`. Mobile: `umaColuna: true`, `textoAntesDaImagem: true`. Contraste: parágrafo `#0a1f44` **12,47** (1440) / **12,10** (390) piso 3,0; eyebrow `#024e86` **6,53** / **6,31** piso 4,5. `esg1NoDom: 0`.

Achados fora de escopo: ScrollSpy branco sobre faixa clara **1,13:1** a 1440 (intro sem âncora no mapa); radial violeta de `.section-light-blue` visível no canto transparente — em `.esg-intro` o violeta foi trocado pelo ciano da marca, mesma posição/alfa.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/app/esg/page.tsx`
- `src/app/globals.css`
- `scripts/gerar-esg2-alfa.mjs`
- `scripts/medir-intro-esg-sis261.mjs`
- `public/images/esg/esg2.webp`

---

## SIS-260 — /contato · números: grade de quadradinhos discretos igual à home

**Status:** In Review · **Labels:** conferir · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-260/contato-numeros-grade-de-quadradinhos-discretos-igual-a-home

### Pedido
Em `/contato`, atrás dos cards da `MetricsBand`, a mesma malha de quadradinhos discretos da home (grade leve 64 px): tokens `--grade-fina-modulo` (64 px), `--grade-fina-linha` (`rgba(4, 58, 99, 0.08)`), `--grade-fina-opacidade` (0.32); receita de `.home-canvas::before` / `.story-solucoes__grade`. Sem grade dupla com a malha técnica de `.section-light::before` (~96 px). Cards e tipografia legíveis. Capturas 1440; lint OK. Fora de escopo: SIS-256, SIS-259, home/Soluções.

### O que foi feito
Uma alteração de CSS em `src/app/globals.css`. Sem mudança em `MetricsBand.tsx`. A regra `.contato-indicadores.section-light::before` **reescreve** o `::before` herdado de `.section-light` (uma camada, `z-index: -1`, `isolation: isolate`). Tokens `--grade-fina-*` copiados de `.home-canvas::before`.

Estilo computado (1440 e 390): dois `repeating-linear-gradient` com `rgba(4, 58, 99, 0.08) 0 1px, transparent 1px 64px` (90deg e 0deg); `opacity: 0.32`; `background-attachment: fixed, fixed`; `position: absolute`; `z-index: -1`. Período medido por diferença de pixel: passos múltiplos de 64 (vãos 5×/9× onde cartão opaco cobre o fio). Tinta pico 11 níveis por canal (0,32 × 8% alfa). Pixels de malha dentro da superfície dos sete cartões: **0** nas duas larguras (`border-radius: 16 px` descontado). Contraste sobre `#1273bc`: número **5,00** piso 3,0; rótulo **5,00** piso 4,5; `+` **5,00** piso 3,0. Camadas de grade: **1**. `::after` pontilhado SIS-93 permanece (não é grade).

Máscara redimensionada: de `ellipse at 50% 50%, #000 0%, transparent 75%` para `ellipse 120% 130% at 50% 50%, #000 35%, transparent 96%` — a 390 a máscara antiga deixava 1.026 px de malha e um único fio (miolo coberto pelos cartões); depois 3.305 px a 390 e 10.126 a 1440. Capturas `docs/capturas/sis260-{1440,390}-{com,sem}-malha.png`. Portões: lint 0 erros / 22 avisos; tsc limpo. `test:copy` falha nos mesmos quatro deltas alheios. Medidas `docs/medidas/grade-sis260.json`; sonda `scripts/medir-grade-sis260.mjs`. Observação: radial violeta pré-existente em `.section-light-blue`, não mexido.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/app/globals.css`
- `scripts/medir-grade-sis260.mjs`

---

## SIS-259 — /contato · retirar sombra branca entre logos e «SAIBA MAIS…»

**Status:** In Review · **Labels:** conferir · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-259/contato-retirar-sombra-branca-entre-logos-e-saiba-mais

### Pedido
Retirar a rampa/sombra branca entre `SignalMarquee` e o bloco «SAIBA MAIS SOBRE O QUE PODEMOS OFERECER». Origem auditada: `.contato-emenda-clara` (`#f5faff` → transparente, ~140 px) e `padding-top` grande de `.fundo-contato-cena` (`clamp(9.5rem, 11vw, 10.5rem)`). Encurtar o vão após remover a rampa; conferir outras fontes de branco. Aceite: sem rampa; transição off-white → azul; cartão e eyebrow legíveis; capturas; lint OK.

### O que foi feito
Varredura de coluna 1 px fora do cartão, 200 px abaixo da faixa. 1ª linha abaixo da faixa (1440): antes `rgb(243,249,254)`, depois `rgb(0,91,157)`. Linhas claras abaixo da faixa (1440): **132** → 0 na emenda. Excesso máximo canal R (390): **243/255** → **0**. As 8 linhas claras residuais a 1440 estão a 178–185 px (glifos da pílula «CONTATO»), não rampa.

JSX: `<div className="contato-emenda-clara" />` comentado. CSS: regra `.contato-emenda-clara` comentada (não apagada). `.fundo-contato-cena { padding-top }`: `clamp(9.5rem, 11vw, 10.5rem)` → **`clamp(4.5rem, 5.5vw, 6rem)`**. Vão logo → cartão: 390 176 → **96 px** (`padding-top` 152 → 72); 1440 199 → **120 px** (158,4 → 79,2); 1745+ padding 168 → 96. `cenaTopo − faixaPe = 0`. Faixa: `border-bottom` 0, `box-shadow` none, `::before`/`::after` de `.lp-signals` sem conteúdo/imagem.

Portões: lint 22 problemas, 0 erros; console zero erros; capturas `docs/capturas/sis259-contato-emenda-{1440,390}-{antes,depois}.png`; medidas `docs/medidas/emenda-contato-sis259-{antes,depois}.json`; sonda `scripts/medir-emenda-contato-sis259.mjs`. Observação: emenda agora é aresta reta; dissolução curta (24–32 px) oferecida como opção.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/app/contato/page.tsx`
- `src/app/globals.css`
- `scripts/medir-emenda-contato-sis259.mjs`

---

## SIS-258 — /trabalhe-conosco · abertura igual a exemplotrabalheconosco.png

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-258/trabalhe-conosco-abertura-igual-a-exemplotrabalheconoscopng

### Pedido
Abertura de `/trabalhe-conosco` igual a `public/images/exemplotrabalheconosco.png`: esquerda (eyebrow CARREIRA, título branco + `#SomosSistraners` ciano, apoio, três linhas de valor, slogan «TECNOLOGIA QUE MOVE O AMANHÃ»); direita card branco «Envie seu currículo». Mover/reusar `CurriculoCard` na abertura; atualizar `08-trabalhe-conosco.md` + copy-lock; manter avisos demo SIS-117/223. Mobile empilhado; contraste AA; capturas 390/1440. Fora de escopo: ATS, portal de vagas, Social LinkedIn do rodapé.

### O que foi feito
Antes da issue (cartão ainda em Todo): `.carreira-cartao .glass-card` deixou de ser transparente — `background: #e6f2fd` opaco, `backdrop-filter: none`, `::before { opacity: 0 }`. Tintas: título `#06275f`, parágrafos `#3a5a7c` (letra miúda de `#4c6c8e` 4,04:1 para `#3a5a7c`). Opacidade: `maxDeltaCanal: 0` entre dois quadros de vídeo. Contraste 1440: título **12,64:1**, parágrafos **6,30/6,21:1**, miúda **4,84:1**. Sonda `scripts/medir-carreira-cartao.mjs`, `docs/medidas/carreira-cartao.json`.

Entrega do escopo: abertura recomposta no espírito da PNG — coluna esquerda (Carreira, manchete, `#SomosSistraners`, apoio, três benefícios, slogan) e `CurriculoCard` branco à direita (`id="curriculo"` no form, sem duplicar). «Como chegar até nós» saiu da abertura. LinkedIn no card; Social no rodapé. Copy extra + `08-trabalhe-conosco.md` e `copy-lock.json` atualizados. Avisos de envio-demonstração mantidos. Portões: lint 0 erros, tsc OK, build OK, `test:copy` OK. Capturas 1440/390 em `docs/capturas/sis224-sis258-final-*.png`.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
Não declarados de forma completa no relatório curto da entrega. Citados: abertura de `/trabalhe-conosco`, `CurriculoCard`, `.claude/conteudo-site/08-trabalhe-conosco.md`, `copy-lock.json`; na correção prévia, `src/app/trabalhe-conosco/page.tsx` e CSS `.carreira-cartao .glass-card`.

---

## SIS-257 — /esg · capa «ESG - Environment, Social & Governance» + seção intro com esg1.png

**Status:** In Review · **Labels:** conferido · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-257/esg-capa-esg-environment-social-and-governance-secao-intro-com-esg1png

### Pedido
Capa de `/esg`: título **ESG - Environment, Social & Governance** na mesma escala da manchete atual; a frase institucional longa sai da capa. Nova seção antes de ENVIRONMENT: esquerda a frase «A Sistran demonstra…»; direita `public/images/esg/esg1.png` (WebP otimizado). Atualizar `07-esg.md` e copy-lock. Mobile empilhado; emenda visual; contraste AA. Fora de escopo: trocar `esgcapa` (SIS-247), cards, foguete/SOCIAL/CTA, reabrir SIS-233 além do necessário.

### O que foi feito
**Capa.** `PageHero` `title="ESG -"` + highlight ciano no restante; sem `description`. Comprimento combinado 38, escala média (mesmo degrau da manchete anterior). Frase institucional saiu da abertura.

**Seção `#esg-introducao`** entre hero e ENVIRONMENT: texto canônico à esquerda; `esg1.webp` à direita (116.224 B, PNG fonte 1.911.417 B). Desktop 2 colunas; mobile texto → imagem. Alt descritivo. Emenda 0 px de gap; fundo contínuo. Contraste do parágrafo **4,77:1**. Docs: `07-esg.md` e entradas ESG do `copy-lock.json`. Sonda SIS-233 ajustada (`#fraseCompleta: true`). Portões: lint 0 erros, tsc OK, build OK. `test:copy` exit 1 por divergências concorrentes (`Sistran University`, `Fale com a SISTRAN`, `xMidYMid meet`). Capturas em `docs/capturas/sis257/`. Follow-up posterior da usuária: arte `esg2` e layout da captura → SIS-261; capa desta issue permanece.

### Conferência
**APROVADO** (rodada 1/3). Capa concatena exatamente «ESG - Environment, Social & Governance». Frase longa só em `#esg-introducao`, à esquerda, verbatim. WebP 116 224 B; seção antes de ENVIRONMENT; mobile texto→imagem; emenda 0 px; parágrafo 4,77:1 (texto grande AA). Copy-lock ESG bate. `esgcapa` e foguete intactos. Sugestões não bloqueantes: hero ainda em grade de 2 colunas da SIS-233 com um filho; `esg1.png` (~1,9 MB) continua em `public/`; `test:copy` vermelho por concorrência; working copy mistura SIS-247/253/254; comentários CSS SIS-138/206 ainda falam da frase partida na capa. Permanece In Review + `conferido`. Done só pela dona do conteúdo.

### Arquivos tocados
Não listados como bloco no relatório. Citados: `src/app/esg/page.tsx` (`PageHero`, `#esg-introducao`, `esg1.webp`), `.claude/conteudo-site/07-esg.md`, `copy-lock.json`, sonda SIS-233.

---

## SIS-256 — /contato · números: cards mais estreitos e sem contador 01 / 07

**Status:** In Review · **Labels:** conferir · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-256/contato-numeros-cards-mais-estreitos-e-sem-contador-01-07

### Pedido
Na `MetricsBand` de `/contato`: diminuir a largura de cada card e retirar o contador «01 / 07» e o grafismo de etapa (nó + fio) nos sete cards. Números e rótulos permanecem. Home `Metrics` / `METRICS` intocados. Follow-up da SIS-211 (que havia pedido o contador). Aceite: nenhum «01 / 07»; largura visual menor que o baseline a 1440; sete pares legíveis AA; capturas; lint OK. Pedidos posteriores da usuária (voltas 2–4) alteraram cor, hover, layout mobile em toda largura, tamanho igual e contagem só após o load.

### O que foi feito
Sonda `scripts/medir-indicadores-sis256.mjs`; JSON `docs/medidas/indicadores-sis256-{antes,depois}.json`; viewports 1440×900 e 390×844.

**1ª volta.** DOM: `.contato-indicador-etapa` / `-no` / `-fio` 7 → **0**; padrão `NN / NN` `true` → **`false`**. Bloco comentado em `MetricsBand.tsx` e CSS morto comentado. Larguras 1440: antes 142,3 × 7; depois `133,8 · 133,8 · 119,3 · 133,8 · 133,8 · 133,8 · 133,8` (todas < 142,3). 390: 350 → `227,6 · 210,8 · 164 · …`. Seção 292 → 288 (1440), 882 → 670 (390). Contraste cartão claro: número **15,93** / **15,8**; rótulo **11,14**. Lint 0 erros / 22 avisos. `test:copy` falha por deltas alheios. Decisão aberta: lado a lado a 1440 estouraria o teto de largura.

**2ª volta — cartão já escuro, hover só para frente.** Só CSS. Superfície `linear-gradient(135deg, rgb(10,31,68), rgb(4,27,61))`; número branco; `+` `#0ed8f6`; rótulo `rgba(255,255,255,0.88)`. Hover: `scale` 1,03 (propriedade individual, porque a onda anima `transform`); largura 133,77 → **137,78 px**; reduce nas duas vias `scale: 1`. Contraste número **16,25**; rótulo **12,92–12,93**. Etapas continuam 0.

**3ª volta — layout da referência em toda largura.** Número à esquerda + rótulo ao lado também a 1440; `@media (min-width: 1280px)` empilhado comentado. Critério «menor que 142,3 px» **deixou de ser cumprido de propósito**. Grade `grid-auto-rows: 1fr`; 1440 `264 × 7` / altura 100,6, fileiras `[4, 3]`; 390 `350 × 7` / 86,6, delta 0. Bug `grid-column: span 2` no 5º cartão (122 vs 264) corrigido para `grid-column: 2 / span 2`. `CountUp.tsx`: contagem só após `window.load` **e** portão da rota; sob o véu só `850`; depois nove intermediários; `passa: true`. Seção 288 → **349** (1440), 670 → **782** (390). Consumidores reais de `CountUp`: `MetricsBand` e `legacy/MetricsStrip` (não montado). Contraste número 16,25; rótulo 12,93.

**4ª volta — cartões `#1273bc` chapado.** Degradê navy comentado. Sombra `rgb(9 71 117 / …)`; borda alfa 34% (58% hover). Rótulo 4,25 ❌ → branco cheio **5,00**. `+` ciano 2,90 ❌ → branco **5,00** (perda do acento declarada). `+` virou terceiro alvo permanente da sonda. Geometria idêntica à 3ª volta. Lint 0 erros / 22 avisos; tsc limpo. Capturas `docs/capturas/sis256-depois-{1440,390}.png`.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/MetricsBand.tsx`
- `src/app/globals.css`
- `src/components/primitives/CountUp.tsx` (3ª volta)
- `scripts/medir-indicadores-sis256.mjs`

---

## SIS-255 — /contato · Onde Estamos: sombra atrás do mapa menos escura e menos quadrada

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-255/contato-onde-estamos-sombra-atras-do-mapa-menos-escura-e-menos

### Pedido
Na seção Onde Estamos, suavizar o véu/sombra atrás do mapa: menos escuro/opaco e arestas menos retas. Origem: `.mapa-veu` com `rgb(3 18 40 / …)` até 96–98%. Manter AA do texto do painel e pino legível. Não redesenhar layout nem dados. Capturas 1024/1440; lint OK. Fora de escopo: SIS-245, SIS-222, faixa de números.

### O que foi feito
Entrega sem conferência (pedido explícito). Véu: navy `rgb(3 18 40)` → `#003D70`. Alfas do painel: 97,6% → 91,4% (1440/1024); 96,4% → 90,6% (390). Rampa horizontal 91 px → 138 px, queda rápida após o painel e cauda longa (pino 18,3% → 14,5% a 1024). Máscara vertical: rampa 4 rem → 5,6 rem, perfil não-linear. Contraste: link ciano 14 px 11,40 → **5,46:1** (piso 4,5); título 16,85 → **8,07:1**. Portões: lint 0 erros, tsc OK, build OK. `test:copy` vermelho por concorrência. Ressalva: a 390 o pino aparece um pouco mais como fantasma (90,6% vs 96%). `docs/mapa-unidades.md` ainda descreve o véu antigo.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/app/globals.css` (`.mapa-veu`)
- `scripts/medir-veu-mapa-sis255.mjs`

---

## SIS-253 — /esg · Fale com a Gente! igual à referência falecomagente.png (+ ponto na linha, hover botão)

**Status:** In Review · **Labels:** conferir · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-253/esg-fale-com-a-gente-igual-a-referencia-falecomagentepng-ponto-na

### Pedido
Seção Fale com a Gente! em `/esg` igual a `public/imagensexemplo/falecomagente.png`: vidro, linha ciano com ponto luminoso no scroll, hover do botão com avanço em X e giro do círculo ciano, blob/logo/órbitas/balões. Opt-in só em `/esg`; copy-lock intacto; `contatoNoModal` permanece; reduce estático. Outras rotas com `ContactCTA` não mudam. Aceite visual + motion + reduce + modal + capturas + lint.

### O que foi feito
**1ª volta.** Prop `layoutReferencia` em `ContactCTA.tsx` (default off); módulo `src/components/ContactCTAReferencia.tsx`. Montagem só em `src/app/esg/page.tsx`. Conferido em `/solucoes`, `/quem-somos`, `/blog`: sem `.cta-ref`, cartão navy intacto. Composição 1440: cartão 826×320; título 49 px; fio 700×105, 58 px acima do título; botão 227×56 meia-altura; círculo 45×45; arte 446×446. Percurso do ponto: 0 px no nó → 698 px; pouso `dx −1, dy 0` (antes `dx −16` por bases de % diferentes — palco sem padding do `container-lp`). Hover: +6 px X, brilho 180°. Reduce duas vias: avanço 0. Contraste título **12,63** piso 3,0; parágrafo **5,47** piso 4,5. Lint 0 erros / 22 avisos. `test:copy` falha (`Fale com a SISTRAN` 2→3 nesta issue). Modal `dialog.contact-dialog` `open: true`. Capturas `sis253-depois-1440-{repouso,hover,percurso,reduce}.png` e `-390.png`. Sonda `scripts/medir-cta-referencia-sis253.mjs`.

**2ª volta — reprovada por fidelidade ao PNG e refeita.** Fundo: SVG `.cta-ref-ondas` (cinco faixas, viewBox 1440×576). Vidro 60%→40%, `blur(22px)`. Blob `#2fa6f2 → #0d78cc → #06508f → #032f60`. Órbitas 2 px / alfa 95%; ponto 16 px. Balões com bico; selo 48%; sombra preta → halo ciano. Pouso `dx −1, dy 0`. Contraste título **16,25:1**, parágrafo **6,68:1**, rótulo (moldura) **5,75:1**, disco ciano **2,41:1** (seta branca deliberada; WCAG 1.4.11 não se aplica). Hover `matrix(1,0,0,1,6,-28)` e 180°. Reduce duas vias. Lint 22/0. Pendência: pouso no círculo vs nó acima do botão no PNG.

**3ª volta A — `docs/orientacoes-componente-fale-com-a-gente.md`.** Forma azul virou `<path>` Bézier (viewBox 760×620), não `border-radius`. Checklist §12: razão 1,121; base `#064C98`; sobreposição 89 px; selo 38%; órbitas 94%; balões 18%; `scrollWidth` 1440/390. Camadas: ondas 0, arte 1, forma 2, órbitas 3, selo 4, balões 5, cartão 2, botão 4. Símbolo `sistran-logo.png` (SVG pedido não existe). Flutuação CSS 6 s / órbitas 4,5 s; reduce `none`. Rótulo por glifos **16,25:1** (método anterior media a pílula inteira). Disco **2,39:1**.

**3ª volta B — override de escala.** Painel `67vw` (1016,6 a 1440); arte `37vw`; botão `left: calc(52.3vw − 50vw + 50%)`, `top: 56%` (753→1048). `botaoSobreEncontro` cumprido. Pouso `dx: -2, dy: 0`. Título `font-weight: 700`, `clamp(3.25rem, 3.9vw, 5rem)`. Chanfro `clip-path` saiu (cortaria o fio). Sobreposição 153 px (3 px acima da faixa 80–150). Órbitas 97,9%. Mobile 390: arte `position: relative` 266×217.

**4ª volta — diminuir tudo.** Margens cresceram para manter sobreposição: `--cta-ref-cartao-w` `min(58vw, 1180px)`; arte `clamp(420px, 32vw, 640px)`; botão `55vw` / `clamp(250px, 18vw, 350px)`; título `clamp(2.625rem, 3.1vw, 3.875rem)`. Sobreposição 86 px a 1440 (dentro de 80–150). Pouso `dx: -2, dy: 0`. Contraste título 13,64; parágrafo 6,68; glifos 16,25; disco 2,41. Lint 23/0.

**5ª volta.** `FIO_ALTURA` 150 → **105**; caminho `M 13 9 H 904 L 1000 105`. Folga fio×título 20–34 px. Botão em px `--cta-ref-botao-y-topo: clamp(150px, 11vw, 175px)`. Ponto em laço `repeat: -1`, `repeatDelay: 0.8`; 8 posições distintas; reduce parado em x 994. Escala menor: cartão `min(52vw, 1060px)`; arte `clamp(380px, 29vw, 600px)`; título `clamp(2.25rem, 2.7vw, 3.25rem)`. Sobreposição 147/89/90/120 px. Painel **opaco** com camadas do hover ESG; `backdropFilter: none`; base `linear-gradient(135deg, rgb(242,247,252), rgb(228,237,247))`. Contraste título **14,35:1**, parágrafo **4,85:1**, rótulo **16,25:1**. Fio `#0079cb` (ciano sobre ciano anulava a bolinha). Hover +6 px; reduce sem avanço; brilho 180°. Lint 22/0. Medidas `docs/medidas/cta-referencia-sis253-depois.json`.

Feedback 15/09: blob/logo baixo e corta no rodapé → SIS-276.

### Conferência
Sem comentário formal de conferente com `VEREDITO: APROVADO` ou `REPROVADO`. A 1ª volta foi **reprovada pela usuária** por fidelidade ao PNG («a parte de trás do card também»); o executor refez nas voltas 2–5. Permanecem perguntas abertas no Linear: seta branca ~2,4:1 vs navy `#04263f`; pouso do fio no disco vs nó acima do botão.

### Arquivos tocados
- `src/components/ContactCTA.tsx`
- `src/components/ContactCTAReferencia.tsx`
- `src/app/esg/page.tsx`
- `src/app/globals.css`
- `scripts/medir-cta-referencia-sis253.mjs` / `scripts/medir-cta-sis253.mjs`

---

## SIS-252 — /esg · ENVIRONMENT + GOVERNANCE: cards azul bem clarinho no repouso + troca de cor no hover

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-252/esg-environment-governance-cards-azul-bem-clarinho-no-repouso-troca-de

### Pedido
Os 6 cards ENVIRONMENT e os 6 GOVERNANCE: repouso azul bem clarinho (não navy); hover com troca de cor perceptível, mantendo levantamento/sombra da SIS-237. Texto em tinta escura para AA. Classe compartilhada `.esg-superficie`. Não mexer em copy, fotos, flutuação, SOCIAL, hero. Capturas 1440 rest + hover nas duas grades; lint OK.

### O que foi feito
Sonda `scripts/medir-esg-cartoes-sis252.mjs`; JSON `docs/medidas/esg-cartoes-sis252/`. Os doze em `.esg-superficie` (`globals.css`). Navy saiu; família `#f2f7fc` 96% → `#e4edf7` 90%; borda `#0079cb` 28%. Superfície ENV topo `rgb(9,77,129)` → `rgb(218,235,246)`; vs faixa **1,26–1,45:1** → **4,69–5,77:1**. Hover: gelo `#a5f0ff` 90% + ciano `#0ed8f6`; ΔRGB topo 34,7–37,5 → **75,1–76,2**; base 11,8–13,7 → **70,1–72,2**. Transform hover `matrix(1.02,0,0,1.02,0,-12)` nos doze. Tinta `--esg-tinta: #0a1f44` / `--esg-tinta-suave: #0f2b4a`. Legendas ENV 8,95–9,06:1 rest / 6,46–8,05:1 hover; termos GOV 10,35–10,55 / 7,74–9,05; detalhes 8,81–9,04 / 6,03–7,46. Todos ≥ 4,5:1. Reduce: hover ainda troca fundo/borda; transform `matrix(1,0,0,1,0,-3)`. Capturas `docs/capturas/sis252-{environment,governance}-1440-{repouso,hover}-{antes,depois}.png`. Lint 0 erros / 22 avisos. `test:copy` reprova por outras frentes; SIS-252 não mexeu em string.

Achados: `text-ink` no Tailwind é quase branco (`#f8fafc`); `#3d5a80` reprovou (hover 3,42–3,89:1 com `scale(1.02)`); radiais roxos de `.esg-superficie` e `.glass-card::before` comentados/overridden. Inverte de propósito a conclusão da SIS-237 («branco sobre claro reprova») porque superfície e tinta mudaram juntas.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
Não listados como bloco. Citados: `src/app/globals.css` (`.esg-superficie`), classes `.esg-tinta` / `.esg-tinta-suave` em `src/app/esg/page.tsx`, `scripts/medir-esg-cartoes-sis252.mjs`.

---

## SIS-251 — /eventos-inovacao · mobile: carrossel mais intuitivo (swipe + auto)

**Status:** In Review · **Labels:** conferir · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-251/eventos-inovacao-mobile-carrossel-mais-intuitivo-swipe-auto

### Pedido
No mobile de `/eventos-inovacao`, o carrossel da SIS-239 precisa ficar óbvio (swipe e/ou autoplay). Reforçar affordances <1024 (peek, setas, hint, dots); calibrar autoplay; pause + reduce; desktop ≥1024 inalterado. Capturas 390; lint OK.

### O que foi feito
Diagnóstico (`scripts/diagnostico-carrossel-sis251.mjs`): espiada **40 px** já existia; marcas em quadro; passo autoplay 0 → 331 px; nenhuma palavra sobre deslizar. Intervalo de 6 s **não** encurtado (descrições até 485 caracteres). Barra `[◀] [quinze marcas] [▶]` + dica «deslize para ver os 15 eventos» (`aria-hidden`); setas **44×44 px**; «anterior» no 1º leva a `scrollLeft 4598`. Marcas 0,45 rem / alfa 0,45; ativa pista 2 rem. Relógio `animation-name: eventos-lista-relogio`, `duration: 6s` via `--evt-autoplay` = `AUTOPLAY_MS`. Preenchimento 16 → 26 → 4 px. Swipe toque: 0 → 245 (dedo) → 331 (snap); `dicaSumiu: true`. Dedo: `data-andando="nao"`, relógio `paused`; retomada após 7 s. Reduce duas vias: animações `none`, autoplay parado, marca ativa **32/32 px** (corrigido `width: 100%` — antes preenchido 0). Desktop 1024/1440: faixa e barra altura **0**. `test:copy` + `copy-lock` (1657 textos; reconferência OK 1194 distintos) com «Evento anterior», «Próximo evento», «deslize para ver os 15 eventos». Lint 22/0; tsc limpo. Capturas `docs/capturas/sis251-*.png`. Ressalvas: WCAG 2.2.2 não fechada (sem botão de pausa dedicado); folga morta dentro dos cartões não tocada.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/EventsSpotlight.tsx`
- `src/components/events-spotlight.css`
- `scripts/medir-carrossel-sis251.mjs`
- `scripts/diagnostico-carrossel-sis251.mjs`
- `copy-lock.json`

---

## SIS-250 — /sistran-university · logo University no navbar (só nesta página)

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-250/sistran-university-logo-university-no-navbar-so-nesta-pagina

### Pedido
Em `/sistran-university` (e subrotas), o navbar mostra `public/images/university/logouniversity.png`; demais rotas seguem a logo corporativa. WebP/PNG enxuto; caber na pílula (88 px); `alt` adequado; link documentado (preferência `/`); mesmo no menu mobile. Capturas 390/1440 vs outra rota; lint OK. Fora de escopo: capas University, redesign do Header, logo no footer.

### O que foi feito
Entrega sem conferência, a pedido. Único nó de logo em `Header.tsx` deriva do `pathname`. Em `/sistran-university` e subrotas: `/images/university/logo-university-header.webp`, `alt="Sistran University"`. Demais: `/images/sistran-corp-logo.png`, `alt="Sistran"`. Link permanece `/`. Variante University `object-contain`, largura 128/132 px; início do menu desktop no mesmo x (`264,64 px`). PNG fonte 2032×774, 1.746.700 B; derivada recortada da grade, 264×101, **13.698 B** (−99,2%). Confirmado 390 e 1440 na rota University e logo corporativa em `/contato`. `npx tsc --noEmit` OK; ESLint 0 erros no arquivo; `git diff --check` OK. Follow-up 15/09: duas logos + linha vertical (padrão Luminna|Sistran) → SIS-279.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/Header.tsx`
- `public/images/university/logo-university-header.webp`

---

## SIS-249 — /sistran-university · seção Formar especialistas: arte + texto sombreado

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-249/sistran-university-secao-formar-especialistas-arte-texto-sombreado

### Pedido
Em `#university-programa`, usar `public/images/university/1-Sistran-university.png` como visual de fundo e o texto por cima com sombreado para legibilidade. Copy e h2 intactos. WebP; contraste AA nos piores pixels; mobile com `object-position` se preciso. Fora de escopo: capa (SIS-248), Unidep/números/galeria, reescrever a frase agramatical.

### O que foi feito
Entrega sem conferência. `#university-programa` virou fundo composto: WebP `university-programa.webp` (1672×941, 114 kB; PNG fonte intacto) + véu + pluma + `h2`/`p` por cima. `alt=""`. Copy e título intactos (frase agramatical inclusive). Contraste do parágrafo 8,2–10,2:1 (antes ~3,5:1). h2: 5,8:1 no pior caso (1024–1279, título numa linha cruzando as pessoas) até 14,2:1. Mobile: `object-position` 100%. Emendas com capa (SIS-248) e Unidep: 0 px. Portões: lint 0 erros, `tsc --noEmit` OK. `test:copy` vermelho por SIS-250 e CTA. Capturas `docs/capturas/sis249-programa/`.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
Não declarados no relatório. Citados: seção `#university-programa`, WebP `university-programa.webp`.

---

## SIS-248 — /sistran-university · capa universitycapa.png (padrão HeroImageBackdrop)

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-248/sistran-university-capa-universitycapapng-padrao-heroimagebackdrop

### Pedido
Abertura de `/sistran-university` com `universitycapa.png` full-bleed via `HeroImageBackdrop` + WebP + véu escopado, no padrão de `/contato`, parceiros, labs, esg. Copy intacta; `alt=""`; emenda OK; capturas 390/1440; lint OK.

### O que foi feito
Entrega sem conferência. `PageHero` envolvido por `HeroImageBackdrop`, `alt=""`, `.hero-backdrop--university`. PNG fonte 1672×941, 1.993.933 B. LCP: `university-hero.webp` q72 `smartSubsample`, **136.436 B** (6,8% do PNG), via `sharp` transitivo. Desktop: foco `50% 46%`, véu assimétrico; sobreposição h1×assunto **0 px²** em 1440. Mobile: foco `34% 46%`. Copy idêntica. Emenda Programa: degrau de cor 57 níveis → 1 por canal. Contraste: 390 h1 **8,30:1**, descrição **4,99:1**; 1440 h1 **10,62:1**, descrição **7,40:1**. `tsc` limpo; lint sem apontamentos nos tocados; `git diff --check` OK. `test:copy` vermelho por arquivo não rastreado (`CarimboRealizadoSistran.tsx`). `priority` no backdrop deprecado no Next 16 (`preload`); mudança no componente compartilhado ficou fora.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/app/sistran-university/page.tsx`
- `src/app/globals.css`
- `public/images/university/university-hero.webp`
- `scripts/medir-abertura-university-sis248.mjs`

---

## SIS-247 — /esg · capa de abertura = esgcapa.png

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-247/esg-capa-de-abertura-esgcapapng

### Pedido
Trocar o fundo da abertura de `/esg` de `esg-hero.webp` para capa derivada de `public/images/esg/esgcapa.png` (WebP; PNG não crua no LCP). Ajustar `object-position`/véu `.hero-backdrop--esg`; copy intacta; emenda OK; capturas 390/1440; lint OK. Fora de escopo: reescrever copy, seções internas, regressão da SIS-233.

### O que foi feito
Entrega sem conferência. PNG fonte preservada (1672×941, 2.235.833 B). Derivada `esgcapa.webp` q82, **224.148 B** (~−90%). `HeroImageBackdrop` aponta para `/images/esg/esgcapa.webp`, `alt=""`, foco `74% 50%`. Véu `.hero-backdrop--esg` assimétrico (fecha tipografia à esquerda, abre assunto, navy no rodapé). Copy/tipografia SIS-233 intactas. Contraste: 390 título **5,54:1** (piso 3), descrição **6,83:1** (piso 4,5); 1440 título **10,44:1**, descrição **5,06:1**. Capturas `docs/capturas/sis247-esg/{antes,depois}-{390,1440}.png` e `medicoes-sis247.json`. TypeScript OK; lint 0 erros, nenhum aviso novo; `git diff --check` OK. `docs/capturas/` ignorada pelo Git.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/app/esg/page.tsx`
- `src/app/globals.css`
- `public/images/esg/esgcapa.webp`

---

## SIS-243 — / · hero: vídeo só inicia depois do carregamento da página

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-243/hero-video-so-inicia-depois-do-carregamento-da-pagina

### Pedido
Na home, o vídeo do hero só inicia depois do carregamento da página (Fase A / autoplay de entrada). Não dar `play` enquanto o `RouteLoadGate` estiver visível; preferir adiar a rede de `hero-scroll-v2.mp4` até o gate liberar. Reduce e abertura no meio sem regressão; timeout de 10 s libera o vídeo. Scrub Fase B intacto. Fora de escopo: peso (SIS-241), BrandGrid (SIS-240), gate de `/contato`, legendas SIS-226.

### O que foi feito
Entrega sem conferência. `RouteLoadGate` expõe `liberado = !visible` (depois do overlay e fade de 240 ms). `HeroCinematic` só decide Fase A com esse sinal. `ScrollVideo` ganhou `carregar` (default `true`); no hero recebe `liberado`: durante o gate, `<video>` sem `src`, `preload="none"`, pôster 58 KB; depois `src`, `preload="auto"` e `play()` se topo e sem reduce. Timeout 10 s libera o MP4. Memoriza se a página esteve fora do topo durante o gate (evita Fase A falsa pelo trinco `scrollY=0`).

Sete cenas: hard load com/sem intro, soft nav `/`, reduce sistema, reduce botão, `#contato`, timeout. Em todas: `srcComPortaoDePe: 0`, `playComPortaoDePe: 0`, `mp4PedidoComPortaoDePe: false`. MP4 pedido 6–61 ms depois da última amostra com gate visível. Fase B bidirecional: `currentTime 5,27` → `14,99` → `0,01`. `tsc` limpo; lint 0 erros nos tocados; `npm run build` compilou. Ressalva: o trinco do gate ainda destrói posição de âncora (página termina no topo) — pré-existente; SIS-243 só impede disparar o vídeo.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/loading/RouteLoadGate.tsx`
- `src/components/primitives/ScrollVideo.tsx`
- `src/components/HeroCinematic.tsx`
- `scripts/medir-portao-hero-sis243.mjs`

---

## SIS-241 — / · Peso da home: 24 MB entregues + ~163 MB bruto em public/

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-241/peso-da-home-24-mb-entregues-163-mb-bruto-em-public

### Pedido
Home entrega ~24 MB (~21,6 MB nos dois vídeos de scroll: `hero-scroll-v2.mp4` ~14,7 MB e `impacto-assembly-scroll.mp4` ~6,9 MB). `public/` tem ~163 MB de fonte bruta não referenciada no código (ex. `videohero.mp4` 93,5 MB). Tirar fontes sem consumidor do deploy (`.vercelignore` / `docs/fontes/`); reencode dos dois scroll-videos sem quebrar scrub; documentar ffmpeg; medir MB antes/depois. Não apagar derivados em uso. Lint/build OK.

### O que foi feito
Entrega sem conferência. Dez fontes sem consumidor em `src/` saíram de `public/` para `docs/fontes/videos/` (~170,76 MiB). `docs/fontes` entrou no `.vercelignore`. Derivados em uso ficaram. Vídeos de scroll: 21,59 → **12,65 MiB** (−8,93 MiB, −41,4%). Home estimada ~24 → **~15,05 MiB**. `hero-scroll-v2.mp4`: 14,69 → **10,43 MiB** — 1440×1440, 24 fps, all-intra (361/361 keyframes), `Content-Length` 10.936.383. `impacto-assembly-scroll.mp4`: 6,90 → **2,22 MiB** — 1280×720, 24 fps, all-intra (225/225), `Content-Length` 2.332.360. FFmpeg all-intra `-g 1`: CRF 35 (hero a partir de `docs/fontes/videos/videohero.mp4`) e CRF 32 (impacto); `scale` lanczos, `yuv420p`, `+faststart`. Comandos também nos comentários de `HeroCinematic.tsx` e `legacy.ts`. Lint 0 erros (22 warnings); tsc OK; build OK. `test:copy` vermelho por copy concorrente.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
Não listados como bloco único. Citados: movimentação para `docs/fontes/videos/`, `.vercelignore`, `public/videos/hero-scroll-v2.mp4`, `public/videos/impacto-assembly-scroll.mp4`, comentários em `HeroCinematic.tsx` e `legacy.ts`.

---

## SIS-240 — / · BrandGrid: logos ilegíveis em repouso (7/15 < 3:1)

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-240/brandgrid-logos-ilegiveis-em-repouso-715-andlt-31

### Pedido
Na home, `BrandGrid` deixa 7 de 15 logos com contraste de repouso < 3:1 (método p5 tinta × p95 fundo): addactis 1,79; dacadoo 2,09; sys4b 2,34; microsoft-azure 2,41; earnix 2,47; sap 2,95; itg 2,95. Causa: `grayscale(1)` + `opacity: 0.62` sobre campo quase branco. Subir opacidade e/ou aliviar grayscale; remedir as 15; alvo ≥ 3:1; hover continua a devolver cor; reduce sem regressão. Não trocar arquivos de logo. Capturas 1440; lint OK.

### O que foi feito
Sonda `scripts/medir-brandgrid-sis240.mjs`; baseline `docs/medidas/brandgrid-sis240/antes.json` (bate com a issue ±0,03). Tetos sem véu: addactis **2,62:1** e dacadoo **2,83:1** — arquivos não passam de 3:1 só com opacidade. Entrou `brightness(<1)` (não toca alfa). Calibração `scripts/calibrar-brandgrid-sis240.mjs`. CSS: `filter: grayscale(1) brightness(0.8); opacity: 0.85;` (era grayscale 1 + opacity 0,62); exceções `[data-marca='addactis']` brightness 0,6 e `dacadoo` 0,7.

Depois, **0 abaixo de 3:1**; pior sys4b **4,14:1**. Addactis 1,81 → **4,44**; dacadoo 2,10 → **4,53**; azure 2,38 → **4,65**; earnix 2,45 → **4,79**; sap 2,97 → **5,90**; itg 2,92 → **6,09**. Hover das claras piorava (addactis 2,41) — corrigido com brightness 0,7 / 0,75 no hover colorido. Hover final todas ≥ 3:1 (earnix 3,09 o mais apertado). Reduce: `[data-logo]` zera filter da cascata, não da `img` do véu — véu sobrevive. Docblock do peso do hero 10,43 MiB conferido (SIS-241). Lint 22/0. Capturas `docs/capturas/sis240-brandgrid-1440-repouso-{antes,depois}.png` e hover addactis. Correção de instrumento: tetos medidos no meio da `transition: filter` 400 ms; espera pelo `filter: none` real. `test:copy` falhava antes (Celent).

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
Não listados como bloco. Citados: CSS da BrandGrid (`brand-grid.css` / regras `[data-marca]`), `scripts/medir-brandgrid-sis240.mjs`, `scripts/calibrar-brandgrid-sis240.mjs`.

---

## SIS-239 — /eventos-inovacao · mobile: carrossel horizontal automático dos eventos

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-239/eventos-inovacao-mobile-carrossel-horizontal-automatico-dos-eventos

### Pedido
Em `/eventos-inovacao` no mobile, a lista de 15 eventos deve ser carrossel horizontal com avanço automático. Desktop ≥1024 inalterado. Pause em reduce e interação; conteúdo completo; YouTube só onde há gravação (SIS-205). Capturas 390 (+768); lint OK. Feedback 14/09 de intuitividade tratado em SIS-251.

### O que foi feito
Entrega sem conferência, a pedido. <1024: carrossel horizontal, um cartão + espiada (319 px / 40 px em 390). Estado no `scrollLeft` da faixa (não índice React). Laço `% 15`. Intervalo **6 s**. Seis pausas: fora de 1024, reduce, faixa fora de quadro, aba em segundo plano, hover/foco/dedo, rastro 7 s após gesto. Reduce: `useReducedMotion()` + CSS `@media` e `html[data-motion='reduce']`. Conteúdo nó a nó; YouTube só em dois; 15 marcas decorativas. Sonda: 10 asserções reprovam no «antes» e passam no «depois». Percurso 4.988 px (390); altura da faixa 594 px (era 6.413). Autoplay 0 → 331 px; laço 4.598 → 0; parado em reduce e ponteiro. 1024/1440: lista `display: none`, palco intacto. `tsc` limpo; lint sem aviso novo. `test:copy` já reprovava (SIS-238); lock não regenerado. Ressalvas: sem botão de pausa WCAG 2.2.2; volta do laço é rebobinagem; sobra vertical nos cartões curtos; artes `loading="lazy"`.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/EventsSpotlight.tsx`
- `src/components/events-spotlight.css`
- `scripts/medir-carrossel-eventos-sis239.mjs`

---

## SIS-237 — /esg · ENVIRONMENT + GOVERNANCE: flutuação e hover bem perceptíveis

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-237/esg-environment-governance-flutuacao-e-hover-bem-perceptiveis

### Pedido
Nos 12 cards ENVIRONMENT + GOVERNANCE de `/esg`: superfície/texto/imagem claros e legíveis; flutuar leve cima↔baixo; hover perceptível (levantar/cor/sombra). Mesmo tratamento nas duas seções. Reparo de percepção sobre SIS-208/210. Reduce parado. Capturas 1440; lint OK. Follow-up de cor de repouso: SIS-252.

### O que foi feito
Entrega concluída sem conferência, conforme solicitado. Nos 12 cards: flutuação compartilhada mais perceptível, percurso de **14 px** e fases distintas; hover compartilhado com levantamento de **12 px**, escala, banho ciano, borda e sombra reforçados; superfície mais escura para separar os cards da faixa. Reduce validado em `prefers-reduced-motion` e `data-motion` (parados, hover suave). Evidências `docs/medidas/sis237/`: contraste mínimo **6,40:1** em repouso e **5,56:1** no hover; 1440, 390 e estados reduzidos. Portões: lint, TypeScript, build e diff-check escopado passaram. `test:copy` vermelho por SIS-238 em `src/data/reconhecimentos.ts`. Issue em In Review sem `conferir` e sem `conferido`.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
Não declarados no relatório.

---

## SIS-236 — /parceiros-e-implementacoes · tirar tarja azul clara da capa / emenda

**Status:** In Review · **Labels:** conferir · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-236/parceiros-e-implementacoes-tirar-tarja-azul-clara-da-capa-emenda

### Pedido
Na capa/abertura de `/parceiros-e-implementacoes`, remover a tarja azul clara entre o bloco escuro e o claro. Identificar origem (vão `mt-14`, véu, `section-light-blue`, emenda linha do tempo, etc.). Sem regressão de contraste do título (SIS-228). Capturas antes/depois 1440 (e 390 se existir); lint OK. Fora de escopo: arte da capa, cards SIS-218/219, viajante SIS-220.

### O que foi feito
Origem: **`mt-14` de `#parceiros`**, não o véu. Varredura x=8 a 1440: pé do hero 0→665 `#012045`→`#092347`; tarja **666→721 (56 px)** `#1b81c7`→`#4d9bd2` (body `#1273bc` + sombra SIS-93 `0 0 54px 18px rgb(227 241 251 / 45%)`); `#parceiros` 722+ `#dfeffa`. Conserto: `mt-14` sai de `#parceiros` em `src/app/parceiros-e-implementacoes/page.tsx`. `pt-16 md:pt-20` e `scroll-mt-32` (128 px) permanecem.

Auditoria APROVADO, 0 falhas (`docs/medidas/sis236/auditar.mjs`). Vão/tarja 56 → **0** em 1440 e 390. Contraste idêntico antes/depois: eyebrow 10,73 / 6,11; título branco 13,11 / 7,28; destaque ciano 10,45 / 5,72; descrição p1 6,80 / 6,16; p2 6,14 / 8,81. Emendas `#implementacoes` / logos / `#linha-do-tempo` sem listra nova (a 390 as mesmas 121/103/19 px, deslocadas 56 px). Capturas `docs/medidas/sis236/{antes,depois}-{emenda,capa}-{1440,390}.png`. Lint 0 erros (22 avisos SIS-182); tsc limpo; `test:copy` falha por textos Celent (SIS-230). Sonda de pixel-a-pixel da capa descartada (animação perpétua do destaque). Guarda geométrico −8 px a 390 na ponta da sombra não veta (contraste idêntico).

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/app/parceiros-e-implementacoes/page.tsx`
- `docs/medidas/sis236/diagnostico.mjs`
- `docs/medidas/sis236/auditar.mjs`

---

## SIS-235 — /eventos-inovacao · tag «Realizado pela Sistran» vira componente carimbo

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-235/eventos-inovacao-tag-realizado-pela-sistran-vira-componente-carimbo

### Pedido
Em `/eventos-inovacao`, no lugar da tag «Realizado pela Sistran» (`kind: proprio`), criar um componente de carimbo no formato visual de `public/images/carimbo.png`: oval inclinado, logo S no topo, «REALIZADO» + «PELA SISTRAN», textura azul/ciano. Converter o PNG (~2,5 MB) para WebP com alfa em tamanho de uso. Substituir o chip em Grid + Spotlight nos eventos próprios; manter o significado acessível via `alt` ou sr-only; filtros/admin podem permanecer texto. Outros kinds não viram carimbo. Aceite: tag textual some e o carimbo aparece no mesmo lugar hierárquico; visual alinhado à arte; Spotlight e Grid (desktop sticky + mobile) cobertos; leitor de tela anuncia o sentido; lint OK.

### O que foi feito
Relatório do executor («SIS-235 — implementado, item por item»).

**Portões:** `npm run lint` — 22 problemas · 0 erros · 22 avisos (nenhum nos arquivos novos; preexistentes em `MorphingHeadline`, `PillarsCarousel`, `EventsSpotlight:213`). `npm run test:copy` — OK, 1194 textos distintos, nada mudou. Movimento reduzido (sonda `reducedMotion: "reduce"`): carimbo nasce no estado final (`opacity: 1`, sem `transform` do GSAP), caixa idêntica em duas leituras a 500 ms.

**Item 1 — componente reutilizável.** `src/components/CarimboRealizadoSistran.tsx` + `src/components/carimbo-realizado-sistran.css`. Arte: `public/images/carimbo-realizado-sistran.webp` · 520×399 · alfa real · 96,8 KB (era 2,39 MB, 96,0% menor), gerada por `scripts/gerar-carimbo-webp.mjs`. `alt` e rotação leve conforme pedido.

**Item 2 — troca nos cartões `proprio`.** Em `EventsSpotlight.tsx` o chip textual dá lugar ao carimbo quando `kind === "proprio"`, nos dois markups: cartão do palco (~linha 699, com batida de entrada) e item do carrossel estreito (~linha 931, sem animação). O markup do chip permanece para `global`, `nacional` e `parceiro`. Ressalva: `EventsGrid` e `EventsMosaic` saíram da rota na SIS-166 — em `src/app/eventos-inovacao/page.tsx` os imports estão comentados; não existe `.evento-selo` pintado. O que a issue chama de «Grid + Spotlight» está coberto pelo par palco (desktop, `position: sticky`) + carrossel (mobile).

**Item 3 — escala, evento Web Summit AI (`proprio`, índice 0), sonda `scripts/medir-carimbo-sis235.mjs`.**

- 390×844: selo chip 183×23,9 → carimbo 111,8×90,2; razão selo/título (alturas) 0,6 → 2,1; arte h 160,8 (igual); cartão 319×568,4 → 319×624,3; sem transbordo (622/622).
- 1440×900: chip 186,5×24,3 → carimbo 142,4×114,9; razão 0,4 → 2,0; selo/largura do cartão 0,2; arte h 316,4 (igual); cartão 604,8×593,4 → 604,8×670,8; cabe no palco.
A foto não pagou o carimbo: altura da arte idêntica; o cartão cresceu +77,4 px em 1440 e +55,9 px em 390 e continua dentro do palco.

**Item 4 — filtros e admin.** `EVENT_KIND_META.proprio.label` continua texto. O `alt` do carimbo sai dessa constante.

**Leitor de tela.** «Realizado pela Sistran» em 390 e 1440, medido como `innerText` + `aria-label` + `alt`. Sentido no `alt`, sem `.sr-only` irmão.

**Três premissas que não se sustentaram.** (1) `carimbo.png` não é transparente: 1374×1145 · png · 3 canais · `hasAlpha=false`; xadrez achatado nos pixels. Alfa reconstruído por chave de croma (fundo neutro croma 0–6; tinta azul ~190) com o S resgatado pelo brilho (limiar 235). Inundação a partir da borda reprovada (anel contínuo deixava o xadrez interno opaco). O script relê o arquivo e reprova sozinho (`hasAlpha`, alfa dos cantos, % transparente, contagem do S). (2) O chip vive na área de texto do cartão, placa `rgba(255,255,255,0.96)`, nunca sobre a foto — carimbo sem sombra. (3) A arte não traz rotação (oval reto); ramo da issue: **−6°** (em −10° o canto cruzava o título em 1440).

**Defeito corrigido.** A propriedade CSS `rotate` não compõe com o `transform` do GSAP na prática (CSSPlugin grava `translate: none; rotate: none; scale: none;`). Palco assentava reto (caixa 132,5×101,6 vs 142,4×114,9 com movimento reduzido). Tween passa a terminar no tombo de repouso (−6°).

**Animação.** Batida de montagem: `scale 1.9 → 1`, `rotation −19° → −6°`, `back.out(1.7)`, 0,42 s — só no cartão do palco. Sem `ScrollTrigger`. Com movimento reduzido a timeline não monta.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/CarimboRealizadoSistran.tsx` (novo)
- `src/components/carimbo-realizado-sistran.css` (novo)
- `public/images/carimbo-realizado-sistran.webp` (novo)
- `scripts/gerar-carimbo-webp.mjs` (novo)
- `scripts/medir-carimbo-sis235.mjs` (novo)
- `src/components/EventsSpotlight.tsx`
- `public/images/carimbo.png` permanece como entrada da conversão (não no caminho crítico)

---

## SIS-234 — /esg SOCIAL · foguete do scroll colorido e 3D (logo Gerando Talentos)

**Status:** In Review · **Labels:** conferir · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-234/esg-social-foguete-do-scroll-colorido-e-3d-logo-gerando-talentos

### Pedido
Na seção SOCIAL de `/esg`, o foguete de scroll (`FogueteScroll`) deve ganhar cores e leitura 3D a partir do logo `public/images/esg/logo-Gerando-Talentos.webp`. Manter sticky, trajetória e reduced-motion parado visível. Contraste AA do texto (`text-ink` / `text-ink-muted`) no pior ponto do trajeto. Não substituir o selo estático. Capturas 390 / 1024 / 1440; lint OK.

### O que foi feito
Relatório do executor («SIS-234 — foguete de SOCIAL colorido e com leitura 3D»). Arquivos: `src/components/ui/FogueteScroll.tsx` (arte), `scripts/medir-foguete-social-sis234.mjs`.

**Item 1 — paleta medida no WebP (sharp), não a olho:** navy `#001849`, laranja `#f88633`/`#f38835`, azul `#0d8ac4`/`#2087ad`, prata `#d6dce3`, branco `#fefdff`. Cada peça com degradê em `<defs>`: tanque (prata → branco → aresta azul); auxiliares (moldura laranja, pico `#f88633` alfa 0,26); orbitador (branco no nariz → teal, `radialGradient`); três chamas (laranja → azul); rastro em esteira; anéis das tubeiras (traço 1 un. azul lavado). Continua `<svg viewBox="0 0 120 300">` com os mesmos `path`. Navy do selo ficou de fora: em qualquer alfa visível o fundo cai abaixo de AA.

**Item 2 — mecânica intocada:** `sticky top-0`, âncora de altura zero, `overflow-clip`, `useScroll`/`useTransform` em MotionValue, `-z-10`, `aria-hidden`, `pointer-events-none`. Diff só `fill`/`defs` + atenuação mobile. Reduced motion 1440: em `p=0,45` e `p=0,75` o SVG no mesmo lugar — `top: 95`, `transform: matrix(0.990268, 0.139173, -0.139173, 0.990268, 0, 108)`, `opacity: 1`. Foto: `sis234-depois-reduce-1440.png`.

**Item 3 — contraste com máscara de glifos, 9 passos, 390/1024/1440, vs `SEM_FOGUETE=1`.** Pior ponto sob o foguete (`text-ink-muted` `#3d5a80`, piso 4,5:1): 390 **4,96:1** (sem foguete 3,74:1); 1024 **4,81:1** (5,06:1); 1440 **5,39:1** (5,39:1). A 390 a camada entra a 60% (`opacity-60 md:opacity-100`). JSDoc: `text-ink-muted` L=0,0986 → fundo precisa L ≥ 0,619; fundo da seção ~0,75. Achado fora de escopo (não mexido): parágrafos em `glass-card` a 1024/1440 dão 4,33:1 e 4,28:1 com e sem foguete.

**Item 4.** `GERANDO_TALENTOS.logo` / `.esg-selo` / `.esg-apoio` intocados.

**Capturas.** `docs/capturas/`: `sis234-antes-{390,1024,1440}-p{4,6}.png` e `sis234-depois-…`; o «antes» usa `ANTES_BRANCO=1` (código já estava mudado).

**Portões:** `npx tsc --noEmit` limpo; `npm run lint` 22 problemas / 0 erros; `npm run test:copy` OK (1183 textos); `npm run build` OK.

Comentário posterior: a usuária trouxe arte nova `public/images/esg/foguete.png`; follow-up **SIS-254**. Esta issue (SVG 3D) fica como histórico.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/ui/FogueteScroll.tsx`
- `scripts/medir-foguete-social-sis234.mjs`

---

## SIS-233 — /esg · título e descrição da abertura iguais a /contato

**Status:** In Review · **Labels:** conferir · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-233/esg-titulo-e-descricao-da-abertura-iguais-a-contato

### Pedido
Na abertura de `/esg`, título e descrição devem ficar visualmente iguais ao padrão de `/contato` (manchete title+highlight + parágrafo de apoio), sem copiar o texto de contato. Alinhar tipografia/layout a `.hero-backdrop--contato` via CSS escopado em `.hero-backdrop--esg`; remover regras que forçam a descrição a ser continuação do h1. Preservar foto/véu e globo. Capturas 390 / 1024 / 1440; contraste OK; lint OK.

### O que foi feito
Relatório do executor («Feito — item por item»).

**1. Papel manchete + descrição.** `src/app/esg/page.tsx:295-300`. Recorte: `title` «A Sistran demonstra seu forte»; `highlight` «compromisso com o ESG.»; `description` «Integrando práticas sustentáveis em suas operações e cultura corporativa.» Ciano no fecho da manchete, como «fale com a gente!». Nota em `page.tsx:265-294`.

**2. Tipografia alinhada a `.hero-backdrop--contato` (sonda `scripts/medir-abertura-esg-sis233.mjs`).** Em 1440: h1 47,52 px → **80 px** (contato 80); peso 400 → **700**; descrição 36 px → **20 px**; família `--font-editorial` → corpo do componente; `line-height` 39,6 px (1,1) → **32,5 px (1,625)**; medida `max-width: none` → **672 px (`max-w-2xl`)**; `white-space` nowrap → normal; colunas 533,7/671,2 → **568,3/636,5** (contato 506,0/566,8); `gap` 43,2 px (igual); `align-items` end → start; padding-top da descrição 1 rem. Linhas em `globals.css:17806` (`clamp(2.6rem, 5.9vw, 5rem)` + weight 700), `:17855` (1,25 rem), `:17912`, `:17957`, `:17976`.

Divergência deliberada: descrição `#fff` em vez de `text-white/85`. Com 85%: 390 7,30:1 passa; **1024 4,37:1 REPROVA** (pior pixel `rgb(73,111,140)`); 1440 4,85:1. Com branco opaco o mesmo pixel 5,34:1.

**3. Regras de continuação comentadas (não apagadas):** editorial + clamp display; `line-height: 1.1`; `max-width: none` / `nowrap`; grid `max-content` → `minmax(min(100%, 30rem), 1.12fr)` e `align-items: start`; clamp do h1 da SIS-206.

**4. Foto/véu/globo.** `foco="50% 42%"`, src e recuo 10 rem da SIS-113 intocados. Sobreposição h1×globo a 1024: 21.455 px² → **0**; a 390: 22.356 → 11.586.

**5. Grade.** Limiar 1280 → **64 rem (1024)**. Colunas: 390/768 uma; 1024 430,8/482,5; 1280 495,1/554,5; 1440 568,3/636,5; 1920 794,3/889,7. Sem rolagem lateral.

**Contraste descrição (branco opaco):** 390 8,64:1; 1024 5,30:1; 1440 5,88:1. h1 (piso 3:1): 5,86 / 6,24 / 5,82.

**Portões:** tsc 0 erros; lint 22 problems (0 errors); copy-lock regravado (recorte da frase); `npm run build` ok. `PageHero.tsx` não tocado.

Capturas em `docs/capturas/sis233-esg/` (esg e contato, 390/1024/1440).

Comentário posterior: usuária redefine abertura («ESG - Environment, Social & Governance»); escopo em **SIS-257**.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/app/esg/page.tsx`
- `src/app/globals.css`
- `scripts/medir-abertura-esg-sis233.mjs`

---

## SIS-232 — /eventos-inovacao · miniaturas laterais maiores e mais perto do card em destaque

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-232/eventos-inovacao-miniaturas-laterais-maiores-e-mais-perto-do-card-em

### Pedido
Em `EventsSpotlight`, aumentar as miniaturas laterais e aproximá-las do card central. Subir `--evt-vaga-w`; reduzir inset entre coluna e centro; sem sobreposição vaga↔cartão/vaga↔vaga; rótulos inteiros; capturas 1440 (+1024 se mexer no piso); lint OK.

### O que foi feito
Relatório («Relatório SIS-232 — item por item»). Sonda `scripts/medir-vagas-eventos-sis232.mjs`; `docs/medidas/vagas-eventos-sis232/{antes,depois}.json`. Janelas: 1024×768, 1280×800, 1366×768, 1440×900, 1600×900, 1670×940.

**O caminho prescrito (reduzir inset/`left`/`right`) não passou.** O inset externo não é margem morta: caixa do ScrollSpy em x=103 a 1440; `left: clamp(7.5rem, 8.5vw, 10rem)` põe a coluna em 122,4 — 17 px de folga. Interno: cartão x=417,6, vaga mais avançada 400,8 → 16,8 px brutos, 7,8 px após `--evt-float-x`. Faixa 270,7 px contra 270,6 exigidos por `--evt-faixa-w >= --evt-vaga-w × 1,606`.

**Alavanca:** banda de espalhamento `4–34%` → `14–26%`; fator 1,606 → 1,432 (~12% de largura de vaga). Amplitude do zig-zag 30% → 12% (~81 px → ~32 px em 1440).

**Aumento de vagas (área de arte):** 1280 +37% (122,9 → 136,7 px); 1366 +39%; **1440 +31%** (146,8 → 159,8 px); 1600 +26%; 1670 +27%. 1024 inalterado (−1%).

**Aproximação em 1440 esq:** distância média ao cartão 81,2 → **60,4 px (−26%)**. Ímpares +40 a +42 px mais perto; seis das oito mais perto; duas recuaram (6,4 px e 1 px). A vaga mais avançada ficou 6,4 px mais longe (subir recuo a 28% estouraria o cartão).

**Sobreposição:** zero `⛔ VAGA SOBRE O CARTÃO`; zero pares apertados (vão < 3,4 px); zero rótulos cortados. Pior vão: 1366 esq 5,4 px.

**Mobile:** não aplicado. SIS-239 já trocou `.eventos-lista` por carrossel; nada abaixo de 1024. Reduced motion: medidas melhoram (flutuação para); zero cortes.

**Lint:** 22 problemas (0 errors). CSS only: `events-spotlight.css` (379 inserções / 22 remoções).

**Correções:** `--evt-arte-fr` 0,44 em 1280 estourou 1366 (vão 1,4 px) → **0,38**. Degrau topo 0,54 estourou 1600/1670 → **0,46**, teto 21,3 svh → 20,5 svh. Padding `.eventos-vaga` 0,3 rem → 0,18 rem; coluna `padding-block` 1,25 rem → 1 rem.

Capturas: `docs/capturas/sis232-vagas-1440x900-{antes,depois}.png` e `sis232-vagas-1024x768-…`.

Follow-up (15/09): vão ainda grande; **SIS-268**. Esta 232 é a 1ª aproximação (banda 14–26%).

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/events-spotlight.css`
- `scripts/medir-vagas-eventos-sis232.mjs`

---

## SIS-231 — /solucoes · remover seção Transformação de Legado (método / quatro movimentos)

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-231/solucoes-remover-secao-transformacao-de-legado-metodo-quatro

### Pedido
Em `/solucoes`, remover a seção `#transformacao-legado` (título, `scenesIntro`/`mosaicIntro`, CTA «Ver o método, a arquitetura e o roadmap»), o AnchorPill e a entrada no spy. A rota `/transformacao-legado` não é apagada. Lint / tsc / build / test:copy OK.

### O que foi feito
Em `/solucoes` saíram o bloco `#transformacao-legado`, o `AnchorPill` da barra «Nesta página» e a entrada `{ id: 'transformacao-legado', label: 'Legado' }` no spy. A página fecha em Consultoria → `ContactCTA`. Preservados: rota `/transformacao-legado`; item do menu global (`nav.ts`); `sitemap.ts`; dados `scenesIntro`/`mosaicIntro` em `legacy.ts`. O CTA não era o único acesso.

Copy-lock: `Transformação de Legado` 4→1, CTA 1→0, label `Legado` 2→1. Depois: OK (1177 textos distintos, nada mudou).

**Portões:** `npm run lint` OK, 22 warnings preexistentes; `npx tsc --noEmit` OK; `npm run build` OK; `npm run test:copy` OK; `git diff --check` do escopo OK.

Entregue em In Review, sem `conferir`/`conferido`; Done permanece decisão da usuária.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
Não declarados no relatório.

---

## SIS-230 — /quem-somos · Premiações: Celent (troféu + logo + texto) e arte LATAM abaixo

**Status:** In Review · **Labels:** conferir · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-230/quem-somos-premiacoes-celent-trofeu-logo-texto-e-arte-latam-abaixo

### Pedido
Na seção Premiações (`RecognitionTheater` / `#premiacoes`), logo abaixo do eyebrow e do título, inserir destaque Celent: `public/trofeu.png`, `public/logo-Celent.png` e as duas frases do conteúdo-site. Abaixo, arte `public/celentlatam.png`. Não inventar copy; teatro existente continua. Mobile, contraste, WebP; capturas 1440; portões OK. (Atualização 11/09 aponta follow-up SIS-238 para fundo `cele.png`.)

### O que foi feito
Faixa `.rec-abertura` em fluxo normal, antes do percurso fixo: eyebrow + `h2#premiacoes` (movidos), bloco Celent, arte LATAM. Ordem DOM: `.rec-header` → `.rec-celent` (`.rec-celent-trofeu`, `.rec-celent-chip`, `.rec-celent-linha1`, `.rec-celent-linha2`) → `.rec-latam`.

Copy: «A Sistran foi reconhecida pela Celent com o Technology Standout 2023.» e «A mais alta categoria no quesito tecnologia» (espaços duplos normalizados). Texto já existia em `PREMIACOES_NOTAS[1]` — movido, não duplicado; entrada antiga comentada em `aSistran.ts`.

Teatro: `.rec-cena` = 4, `.rec-nav-item` = 4; 10% → Gaivotas de Ouro; 60% → Certificações. Mobile: coluna até 767 px; `scrollWidth=clientWidth` em 390 e 1440.

Contraste: linha1 branco sobre `rgb(6 42 92)` **14,03:1**; linha2 `rgba(211 235 250 / .9)` **11,62:1**.

Peso: `trofeu.png` 1 690 395 B → `trofeu.webp` **72 928 B** (760×950, q82), −95,7%; `celentlatam.png` 1 785 360 B → **124 734 B** (1600×900, q80), −93,0%.

A11y: alt descritivo no troféu, `alt="Celent"`, LATAM com alt do quadrante. Logo em chip branco (tinta `rgb(68 118 117)` ilegível no navy). Máscara de duas linear-gradients (`mask-composite: intersect`); troféu com brilho ciano.

Reduce: `[data-rec-entra]` com `opacity: "1"`, `transform: "none"`. Checa `prefersReducedMotion()` e `html[data-motion="reduce"]`.

**Desvio:** cabeçalho saiu do palco sticky (`overflow: clip` apararia o bloco). Emenda medida: degradê fecha em `#032658` (0,0229 → 0,0211, ≈1,02:1).

Movimento: `gsap.context()` + `ScrollTrigger` `once: true`, `start: 'top 82%'`, `stagger: 0.09`, `ease: 'expo.out'`. IntersectionObserver 1,2 s de rede de segurança.

**Portões:** tsc limpo; lint 22/0; copy-lock 1632 travados; test:copy OK (1181); test:extrator 41 casos; build OK.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/RecognitionTheater.tsx`
- `src/components/recognition-theater.css`
- `src/data/reconhecimentos.ts`
- `src/data/aSistran.ts`
- `public/trofeu.webp`
- `public/celentlatam.webp`

---

## SIS-229 — /sistran-labs · Principais Soluções: arte principaissolucoes bem integrada (não quadrado)

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-229/sistran-labs-principais-solucoes-arte-principaissolucoes-bem-integrada

### Pedido
Na seção `#labs-principais`, integrar `public/principaissolucoes.png` de forma bonita (full-bleed/largura generosa, bordas moles, fundo que deixe o neon respirar, WebP). Nomes alcançáveis por texto/links (preferência: arte + cards ACCELERATORS abaixo). Mobile sem crop dos nós; capturas; portões OK.

### O que foi feito
A arte `principaissolucoes` passou a peça principal de `#labs-principais`: largura generosa, palco navy, pluma no azul-claro, sombra difusa ciano/navy, cantos suaves — sem moldura retangular dura. Grade `ACCELERATORS` abaixo.

Medido: 1440 arte 1116 × 628 px; 390 366 × 206 px; `object-fit: contain`, sem crop/overflow; seis nós visíveis.

PNG matriz preservado. Página usa `public/images/sistran-labs/principais-solucoes.webp`: 2.227.691 → 264.998 bytes (−88,1%). `alt` curto da topologia; nomes nos cards.

Capturas: `docs/capturas/sis-229/` em 1440 e 390.

**Portões:** lint 22 warnings; tsc OK; build OK; test:copy OK; git diff --check do escopo OK (whitespace preexistente em `scripts/gerar-divisas-brasil.mjs:337` fora do escopo).

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
Não declarados no relatório.

---

## SIS-228 — /parceiros-e-implementacoes · sombra atrás do título e da descrição na abertura

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-228/parceiros-e-implementacoes-sombra-atras-do-titulo-e-da-descricao-na

### Pedido
Na abertura de `/parceiros-e-implementacoes`, sombra atrás do bloco de escrita (eyebrow + título + dois parágrafos) para contraste sobre a capa, sem navy chapado. Medir WCAG 390–1920. Escopo só `--parceiros`. Copy intacta.

### O que foi feito
Baseline com véu anulado (pior pixel, `scripts/medir-contraste-abertura-parceiros-sis225.mjs`): descrição reprovava em todas as larguras; a 390 reprovava tudo. Pior pixel 1440 `rgb(17,182,233)`; 390 `rgb(219,244,254)`.

**O que entrou:** `radial-gradient` no véu full-bleed, centro 20% × 58% a partir de 1024, + eixo vertical leve. Elipse (não linear) para não criar aresta tipo SIS-224. Sem `filter: blur()` em `.pagehero-entrada` (`overflow: hidden` recortaria). Abaixo de 1024: centro 42% × 46%, semi-eixos 140%/86%. Véu comentado da SIS-225 permanece comentado.

**Contraste depois:** 390 eyebrow 6,11 / título 7,28 / destaque 5,72 / p1 6,16 / p2 8,81; 1024 p1 **5,06** (margem mais apertada vs 4,5); 1440 todos ≥ 6,14. Todos OK nas cinco larguras.

**Portões:** tsc limpo; lint 22/0; test:copy OK (1178); test:extrator 41.

Capturas: `docs/capturas/sis228-{antes,depois}-{390,1440,1920}.png`.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/app/globals.css`
- `scripts/capturar-abertura-parceiros-sis228.mjs`

---

## SIS-227 — /sistran-labs · capa SISTRAN-LABS no fundo do título

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-227/sistran-labs-capa-sistran-labs-no-fundo-do-titulo

### Pedido
Abertura de `/sistran-labs` com `public/SISTRAN-LABS.png` como capa full-bleed atrás do título «Sistran Labs: Laboratório de Inovação», via `HeroImageBackdrop`. Manter h1 HTML; não colidir com texto da arte; WebP; véu `--labs` suave; emenda com `#labs-o-que-e`; `alt=""`; capturas 1440; portões OK.

### O que foi feito
Abertura usa `HeroImageBackdrop` com a arte SISTRAN Labs. Derivada `public/images/sistran-labs/labs-hero.webp`; PNG 1.778.802 B → WebP 125.624 B (−92,9%). Título HTML e copy intactos; «Technology First!» não duplicado no DOM. Recorte e véu posicionam título à esquerda e arte à direita. Contraste medido entre 7,20:1 e 10,33:1. Emenda com `#labs-o-que-e` por gradiente. Provas `docs/capturas/sis227-*.png` (1440 e 390). Portões: lint sem erros, tsc limpo, build OK, copy-lock 1177 textos inalterado.

Ajuste posterior: sombra leve na manchete. `.hero-backdrop--labs .pagehero-entrada h1` com `text-shadow` em duas camadas (`0 1px 2px` alfa 45%; `0 6px 26px` alfa 32%) — receita de `.hero-caption` com alfas menores. `text-shadow` e não `filter: drop-shadow` (`webkitBackgroundClip` é `border-box`). Medido em `docs/medidas/sis227-sombra/`. Título já tinha 7,2:1 a 10,3:1 antes da sombra.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
Não declarados no relatório.

---

## SIS-226 — Home · hero: escritas alternando durante o vídeo (3 slides + pitch final)

**Status:** In Review · **Labels:** conferir · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-226/home-hero-escritas-alternando-durante-o-video-3-slides-pitch-final

### Pedido
No hero da home, a coluna de escrita alterna em sequência alinhada ao vídeo: 3 slides de `HERO_SLIDES` + pitch final (`HeroPitch` / `mosaicIntroHome`) que permanece. Reveal da 1ª escrita na entrada; sync por progresso/scroll, não timer infinito; um só h1; reduce legível; copy verbatim; capturas; portões OK.

### O que foi feito
**1. Ciclo por rolagem.** `HeroCaptions` de volta; `JANELAS = [[0.01,0.08,0.15,0.2],[0.24,0.31,0.36,0.41],[0.44,0.5,0.54,0.58]]` em `HeroCaptions.tsx:78-82`. Sonda `scripts/medir-sequencia-hero-sis226.mjs`: em patamares 1 legível / 3 apagadas (1440 e 390).

**2. Reveal da 1ª escrita.** `animate` 1,1 s, easeOut, delay 0,12. 1440: 0 ms 0/0 · 250 ms 0,464/0,234 · 600 ms 1,000/0,800 · 1600 ms 1/1. Reduce: quatro escritas empilhadas em fluxo (`display: block !important` nos dois interruptores); 4 legíveis / 0 apagadas em 8 posições.

**3. Bloco 4.** `HeroPitch` entra em `[0.575, 0.65]`; sem rampa de saída. Medido opacity 1,000 em 0,70 / 0,85 / 0,99.

**4. Um h1.** `["Entrega com Alta Performance e Comprometimento"]`; legendas em `<p className="hero-caption-title">`.

**5. CTAs omitidos** (justificativa em `HeroCaptions.tsx:41`); copy de `hero.ts` intacta.

**6–7.** Classes `.hero-caption*` reusadas; nota SIS-226 em `.claude/conteudo-site/00-home.md:97` e `:144-146`. copy-lock OK (1178, nada mudou).

**Contraste:** 30 alvos aprovados (`scripts/medir-contraste-legendas-sis226.mjs`). 390: razões 7,18–13,82; 1024 6,36–14,46; 1440 6,14–14,45. `#tintaTeimosa: 0`.

**Defeitos corrigidos.** (a) `useTransform` em array fazia o pitch decair (`opacity: 0` no fim) — ViewTimeline vs sticky; corrigido com `useScrollOpacity` (`src/lib/motion.ts:199`). (b) Título cortado <1024: `clamp(4.5rem)` 72 px vs caixa 265 px; `globals.css:2472-2475` `clamp(1.9rem, 8.6vw, 4.6rem)` até 1023,98 px. (c) Regime C a 390 reprovava (~1,00–2,86:1); tarja `rgb(3 17 38 / 70%)` em `:3019-3026` (70% e não 64% por causa do sobretítulo 11,2 px). (d) Sonda sincroniza `currentTime` e patamar; `CENTROS` `[0.125, 0.345, 0.53]`.

**Portões:** tsc sem erros; lint 22/0; test:copy OK; build OK. Capturas `docs/capturas/sis226-hero/`.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
Não declarados no relatório. (O texto cita `HeroCaptions.tsx`, `HeroCinematic.tsx`, `HeroPitch.tsx`, `src/lib/motion.ts`, `globals.css`, `00-home.md` e os scripts de medida.)

---

## SIS-225 — /parceiros-e-implementacoes · capa fundocapaparceiros no fundo do título e descrição

**Status:** In Review · **Labels:** conferir · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-225/parceiros-e-implementacoes-capa-fundocapaparceiros-no-fundo-do-titulo

### Pedido
Abertura com `public/fundocapaparceiros.png` full-bleed via `HeroImageBackdrop`. Copy intacta; WebP; véu só `--parceiros`; texto esquerda / arte direita; emenda com `#parceiros`; `alt=""`; contraste medido; capturas 1440; portões OK.

### O que foi feito
**Entrega inicial (seis tarefas).** (1) `PageHero` em `HeroImageBackdrop` — `page.tsx:57-78`. (2) `scripts/otimizar-capa-parceiros-sis225.mjs` gera `public/images/parceiros/parceiros-hero.webp`: 1672×941, 1681 kB → 123 kB (−93%), `quality: 78`, `smartSubsample`. (3) Véu `.hero-backdrop--parceiros .hero-backdrop-veu` com eixo horizontal 100deg (luminância terços 0,025 / 0,041 / 0,082). (4) Sem prop `foco`; `object-position` 62% 50% no mobile; teto do h1 a 46 vw (título x 162–662,4 = 46,0% da janela a 1440). (5) Emenda `#parceiros` idêntica ao gradiente `section-light-blue`. (6) `alt=""`.

Contraste inicial (20/20): 390 destaque 4,83:1 (piso 3); demais ≥ 5,12. Portões na 1ª entrega: lint 0 erros 0 avisos (depois corrigido para 22 avisos preexistentes); tsc limpo; build OK.

**Pedido posterior: «retire as tarjas e deixe só a imagem».** Véu `background: none`; `::before` `content: none`; variante mobile comentada. **11 das 20 medições reprovam AA** (1,0:1 em vários trechos). Causa: fios de luz da arte (pior pixel 1440 `rgb(17,182,233)`) e, a 390, escrita sobre o globo.

Feedback seguinte abriu **SIS-228** (sombra atrás do texto).

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
Não declarados no relatório. (O texto cita `src/app/parceiros-e-implementacoes/page.tsx`, `src/app/globals.css`, `scripts/otimizar-capa-parceiros-sis225.mjs`, `public/images/parceiros/parceiros-hero.webp`.)

---

## SIS-224 — /trabalhe-conosco · suavizar véu/sombra feia da abertura

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-224/trabalhe-conosco-suavizar-veusombra-feia-da-abertura

### Pedido
Na abertura de `/trabalhe-conosco` (`hero-backdrop--carreira`), suavizar o véu/sombra que lê como bloco azul de bordas duras. Manter contraste WCAG; não piorar emenda com Social; só CSS `--carreira`; capturas; lint OK.

### O que foi feito
Duas causas: (1) véu 70% no meio + 22% chapado, só vertical; (2) orbs `blur(130px)` de `PageHero` recortados por `.pagehero-entrada { overflow: hidden }` — caixa medida a 1440 **x=162–736, y=240–575**.

Mudanças em `.hero-backdrop--carreira`: orbs `display: none`; véu eixo horizontal **96deg**; rampa vertical quatro paradas (meio 70% → **44%**, degrau 72%); chapado 22% → **12%**. Abaixo de 1024: meio 56% (com valores desktop a descrição a 390 dava **4,13:1**).

**Contraste** (`scripts/medir-contraste-abertura-carreira-sis224.mjs`, três instantes 0/2/5 s): eyebrow 7,46–12,76; h1 4,15–7,88; destaque 3,78–6,20; descrição 4,64–6,19; cartão h2 ≥ 6,14; parágrafo ≥ 4,99; nota ≥ 5,05. Todos OK. Emenda Social a 1440: pé `8,33,67` → `6,33,66`; Social `10,78,135` nas duas.

**Portões:** tsc limpo; lint 22/0; test:copy OK (1177); test:extrator 41. Capturas `docs/capturas/sis224-{antes,depois}-{390,1440,1920}.png`. Scripts: `medir-contraste-abertura-carreira-sis224.mjs`, `capturar-abertura-carreira-sis224.mjs`.

Follow-up visual da abertura inteira: **SIS-258**.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/app/globals.css`
- `scripts/medir-contraste-abertura-carreira-sis224.mjs`
- `scripts/capturar-abertura-carreira-sis224.mjs`

---

## SIS-223 — /trabalhe-conosco · formulário em card no scroll (campos + envio tipo Contato)

**Status:** In Review · **Labels:** conferir · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-223/trabalhe-conosco-formulario-em-card-no-scroll-campos-envio-tipo

### Pedido
Ao rolar `/trabalhe-conosco`, card de formulário no espírito de Contato: Nome Completo*, E-mail*, Telefone* (placeholder `(11) 96123-4567`), envio de arquivo*, Enviar e estado de sucesso. Sem campo «Layout». Reveal no scroll; POST via server action; aviso de privacidade honesto (backend demo). Persistência real continua aberta. Portões OK.

### O que foi feito
Caminho: `DemoForm` evoluído (não fork de `ContactPanel`).

**Arquivos:** `CurriculoCard.tsx` (novo, `#curriculo` + GSAP); `curriculo-card.css`; `DemoForm.tsx` (`kind: 'row'`, dropzone); `demo-form.css`; `trabalhe-conosco/page.tsx`; `pageSections.ts` (item Currículo descomentado); `copy-lock.json`.

Campos: um Nome Completo; E-mail+Telefone na linha; dropzone com a frase do conteúdo-site; sem Layout. Telefone `required` (copy-lock); objeção SIS-117 registrada no docblock.

Reveal: GSAP + ScrollTrigger `start: 'top 82%'`, sem pin; clip-path do card, linha ciano, stagger 0,07. `gsap.context` + `ctx.revert()`. Reduce: timeline não criada. IntersectionObserver 600 ms se o gatilho falhar.

POST: `<form action={enviar}>` + `useActionState(enviarFormulario)`. Avisos: pé «demonstração… nada é armazenado»; sucesso «não foi encaminhado ao RH»; cartão LinkedIn deixou de dizer «Não coletamos…».

**Portões:** tsc limpo; lint 22/0; build `/trabalhe-conosco` ○ Static; test:copy OK — 1192 textos (lock 1652).

Ressalvas: lock absorveu texto Celent não commitado; `#curriculo` migrou do LinkedIn para o form (`#como-chegar` no cartão); mobile/teclado por construção, sem sonda de contraste; bloqueio de produto aberto.

Comentário seguinte: bloqueio virou **SIS-246**. Follow-up de layout da abertura: **SIS-258**.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/CurriculoCard.tsx`
- `src/components/curriculo-card.css`
- `src/components/forms/DemoForm.tsx`
- `src/components/forms/demo-form.css`
- `src/app/trabalhe-conosco/page.tsx`
- `src/data/pageSections.ts`
- `copy-lock.json`

---

## SIS-222 — /contato · loading até a página (e o mapa) estarem prontos a cada entrada

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-222/contato-loading-ate-a-pagina-e-o-mapa-estarem-prontos-a-cada-entrada

### Pedido
Em `/contato`, overlay/gate a cada entrada (soft e hard) até o essencial — incluindo o mapa — estar pronto. Timeout 8–12 s; reduce sem animação ruidosa; a11y `aria-busy`; não aplicar a outras rotas. Capturas/vídeo; portões OK.

### O que foi feito
Gate exclusivo da rota, HTML inicial navy/ciano. Toda entrada começa `aria-busy` + `inert`, scroll bloqueado, status «Carregando…». Liberação após hero e mapa prontos, ou timeout **10 s**. Fade 240 ms; reduce imediato.

Arquitetura: `ContactLoadGate` provider client envolvendo children server; pré-carga de `/images/contato/contato-hero.webp`; contexto força `UnitsMap` a montar abaixo da dobra (evita deadlock com IntersectionObserver); overlay sai do DOM após reveal.

Sinais: Google `idle` one-shot; MapLibre `load` + `idle`; mosaico OSM ≥ 24 tiles resolvidos e 12 carregados.

Sonda `docs/medidas/sis222/`: hard load, soft nav, saída/retorno, timeout, reduce, isolamento — **nenhuma falha**. Caminho normal sem timeout. Bloqueado: overlay saiu em 11.040 ms. Outras rotas: zero overlays. Capturas `hard-inicio-1440.png`, `hard-mapa-pronto-1440.png`.

**Portões:** lint 22 avisos; tsc OK; build OK; copy-lock 1183; diff-check OK.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
Não declarados no relatório.

---

## SIS-221 — /quem-somos · Escritórios BRASIL: marcador do 2º andar SP muito alto na torre

**Status:** In Review · **Labels:** conferir · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-221/quem-somos-escritorios-brasil-marcador-do-2o-andar-sp-muito-alto-na

### Pedido
Em `OfficesScene`, o balão «2º andar · escritório São Paulo» e o ponto na fachada estão ~meio do prédio (`top: 30%`). Descer para o 2º andar real da ilustração, ancorado em %. Não alterar copy. Capturas; lint OK.

### O que foi feito
CSS-only em `.os-torre .os-torre-balao` (~6448) e `::before`/`::after`. Régua em `torre-sp-1200.webp` (`scripts/regua-torre-sis221.mjs`): 2º andar centro em **76%**.

`top: 30%` → `top: 55%`. Ponto: 1440 **44,8% → 76,0%**; 390 **44,9% → 76,1%** (`docs/medidas/torre-sis221.json`). Ângulo do fio 30° → **70°** (a 30° pousava a 67% da largura, na copa; agora 59,7%/60,0% sobre o vidro). Comprimento 3,1 rem inalterado.

Modos: 1440 `scroll`, 390 `lista`; overrides não reescrevem `top`. Rótulo intacto. Feixe `.os-feixe` não tocado.

**Portões:** lint 22/0. test:copy falha na árvore por «Sistran University» em `HeroCinematic.tsx` (alheio); lock não reescrito.

Capturas `docs/capturas/sis221-*-torre.png`. Sondas: `regua-torre-sis221.mjs`, `medir-torre-sis221.mjs`.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/app/globals.css`
- `scripts/regua-torre-sis221.mjs`
- `scripts/medir-torre-sis221.mjs`

---

## SIS-220 — /parceiros-e-implementacoes · Linha do tempo: viajante = logo Luminna de /transformacao-legado

**Status:** In Review · **Labels:** conferir · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-220/parceiros-e-implementacoes-linha-do-tempo-viajante-logo-luminna-de

### Pedido
O `.roadmap-traveler` deve exibir a mesma logo de `/transformacao-legado` (`/imagens/luminna-latam.png`). Remover `traveler={null}`. Copy Luminna nos cards continua proibida. Paridade visual; mobile oculto como no legado; portões OK.

### O que foi feito
`traveler={null}` removido em `parceiros-e-implementacoes/page.tsx` (default do `RoadmapTrail` já é o PNG). Comentário SIS-202 reescrito: arte volta; proibição de copy permanece. JSDoc atualizado. `.roadmap-traveler` não tocado.

**Paridade 1440:** `<img>` sim nas duas rotas; src `/imagens/luminna-latam.png`; natural 889×760; caixa 70×60; círculo 94×94; borda `rgb(14 216 246)`; glow `drop-shadow(rgba(14,216,246,.55) 0 0 26px)`.

Copy dos cards inalterada. Mobile 390: `display: none`, caixa 0×0, `scrollWidth=390`; fronteira 1023 none / 1030 grid.

**Portões:** tsc limpo; lint 22/0; test:copy OK (1183, nada mudou); build OK.

Capturas `docs/capturas/sis220-depois-*-1440.png` e `*-390.png`.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/app/parceiros-e-implementacoes/page.tsx`
- JSDoc de `RoadmapTrail` (componente citado, sem path no relatório)

---

## SIS-219 — /parceiros-e-implementacoes · logos dos cards bem maiores e mais destacadas

**Status:** In Review · **Labels:** conferir · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-219/parceiros-e-implementacoes-logos-dos-cards-bem-maiores-e-mais

### Pedido
Em `PartnerTerminalCards`, placas bem maiores (~1,5×–2× altura). Recalibrar eco de hover; contraste navy/branco; mobile sem estourar ~34 rem; reduce estático. Capturas idle+hover; portões OK. Medir preferencialmente após/junto da SIS-218.

### O que foi feito
Oito valores em `partner-terminal-cards.css` + `sizes` da img em `PartnerTerminalCards.tsx`. Copy intocada. Card altura idêntica (642 px a 1440, 546 px a 390).

Idle: `min-height` 4,25 → **7,5 rem**; `min-width` 7,5 → **12 rem**; img `max-height` 3,25 → **6 rem**, `max-width` 13 → **20 rem**. `sizes` 200 px → **320 px**. ITG 164,2×52 → **303,2×96** (1,85×); ST IT 185,7×52 → **320×89,6** (1,72×).

Contraste (`medir-logos-parceiros-sis201.mjs`): tabela byte-idêntica. Pior chip branco Microsoft Azure 3,41:1; navy addactis 5,98:1.

Eco: `eco-img max-height` 6 → **9 rem**; escala hover 1,45 → **1,34**; largura `min(28rem, 62%)`. Folga eco→texto min 69 px a 1440, 58 px a 390. Folga placa→texto 184 → 128 px (1440), 96 → 68 px (390).

Mobile: placa 3,5 → **5,25 rem**; img 2,25 → **3,5 rem**; `min-height: 34 rem` intocado.

Capturas `docs/capturas/sis219-placas/` (16 arquivos). Script `capturar-placas-sis219.mjs`.

**Portões:** tsc limpo; lint 0 erros 22 avisos; build 5,2 s.

Nota: SIS-218 ainda estava em Todo na entrega; números no enquadramento carrossel.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/partner-terminal-cards.css`
- `src/components/PartnerTerminalCards.tsx`

---

## SIS-218 — /parceiros-e-implementacoes · Parceiros: seção fixa + avanço lateral com o scroll da página

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-218/parceiros-e-implementacoes-parceiros-secao-fixa-avanco-lateral-com-o

### Pedido
Em `#parceiros` / `PartnerTerminalCards`, pin no desktop e scroll vertical empurra a trilha na horizontal. Filtros e setas permanecem. Mobile/reduce sem pin. Copy intacta. Capturas 1440; portões OK.

### O que foi feito
Desktop ≥1024: palco `position: sticky` (não GSAP `pin: true`, para não reparentar e ficar com Lenis). Altura da cena = `100svh + percurso horizontal`; percurso = `offsetLeft(último) - offsetLeft(primeiro)`; ResizeObserver; cleanup de observers/frames/CSS vars.

Medido 1440: início primeiro card 719,98 px (centro 720), transform 0; meio −7.554,17 px; final −15.108 px, último card 719,8 px; 400 px depois palco liberado. Filtro Cloud: 16→2 cards, percurso 15.108→1.008 px. Anúncio ativo debounce 350 ms.

Mobile / reduce / `data-motion=reduce`: sem pin, overflow horizontal nativo. Fronteira: estático 1023 / sticky 1024. Copy, overlay, fundos, RoadmapTrail e SIS-219 preservados.

Evidências: `docs/medidas/sis218/` (`falhas: []`); `docs/capturas/sis218/`.

**Portões:** lint 22 warnings; tsc OK; build OK; copy-lock 1178; diff-check do escopo OK.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
Não declarados no relatório.

---

## SIS-217 — /solucoes · logos dos aceleradores nos cards + reação no hover

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-217/solucoes-logos-dos-aceleradores-nos-cards-reacao-no-hover

### Pedido
Nos sete cards de Tecnologia Disruptiva, substituir ícones Lucide pelas logos de `public/images/logos` (de-para Match AI, Lumina AI, Fast, QA Integrado, Connect API, Smart Miner, Guru de Seguros). Hover com scale/eco/sombra ciano; reduce estático; `alt=""` se o h3 já nomeia; copy intacta.

### O que foi feito
Sete logos substituem Lucide; placa preserva proporção; hover/foco com escala, `translateY` leve e eco ciano; reduce estático; imagens `alt=""` + `aria-hidden`; nome no `<h3>`; copy e rotas internas intactas. Portões: lint sem erros, tsc limpo, copy-lock inalterado, build OK. Ressalva: outro processo editava os mesmos arquivos durante a execução.

Ajuste posterior: `<h3>` virou `sr-only` (esqueleto de cabeçalhos + logo decorativa, WCAG H67, copy-lock intacto). Placa 52→72 px, teto largura 14→18 rem, arte 28→44 px, teto 68%→76%. Medido a 1440 (`docs/medidas/sis217-logo-destaque/`): placa 72 px nos sete; folga mínima até ordinal 36 px (Match AI); hover `scale(1.06)`, placa `translateY(-2px)`, eco 0,55. Portões: tsc limpo, eslint sem erros, copy-lock 1177.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
Não declarados no relatório.

---

## SIS-216 — Esboço · admin de eventos (senha, sem sessão/seção pública)

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-216/esboco-admin-de-eventos-senha-sem-sessaosecao-publica

### Pedido
Natureza original: esboço de admin de `/eventos-inovacao` com senha, sem sessão de usuário e sem seção pública. Opções A (HTTP Basic), B (cookie HMAC), C (host). Depois o time pediu implementar: acesso A, persistência v0 (JSON), zero link público, senha só em env.

### O que foi feito
**Primeira entrega — A + v0.** Decisões: implementar (não só esboço), acesso A, JSON versionado. Catálogo `src/data/events.ts` → `src/data/events.json` (15 eventos verbatim); `.ts` confere `kind`/`icon`. Proxy `src/proxy.ts` (Next 16.3: não `middleware.ts`): sem credencial 401 `WWW-Authenticate: Basic realm="Sistran · admin de eventos"`; senha errada 401; certa 200; sem env 503. Superfície `GET /admin/eventos` e `/admin/eventos/<id>` (`force-dynamic`). Sem link público: `Disallow: /admin` em robots, meta noindex, `x-robots-tag`. Senha `EVENTOS_ADMIN_PASSWORD` com `timingSafeEqual`. Defesa dupla: proxy + Server Action (POST sem credencial 401, arquivo intacto). Extrator do copy-lock passou a ler `.json` sob `src/data/` e ignora `src/app/admin/**`. Formulário controlado (React 19 resetava `defaultValue` após recusa). Limites: FS gravável; publicar = commit; sem upload nesta versão; `id` não editável.

**Portões (1ª):** lint 23/0; test:copy 1177; extrator 41; tsc limpo; build `/admin/*` ƒ, `/eventos-inovacao` ○.

**Ampliação.** (1) Login próprio A→B: cookie `src/lib/adminSessao.ts`, token `<expiraEm>.<HMAC-SHA256>`, 8 h, httpOnly, sameSite=lax, path=/admin; Basic antigo 307 para `/admin/entrar`. (2) Fundo claro opaco no `admin/layout.tsx`; diálogo de movimento suprimido em `/admin`. (3) Upload: cliente recorta 16:9 e gera dois webp (1672×941 e 240×135); servidor ≤2 MB e assinatura `RIFF….WEBP`; nome `id`+timestamp. Sonda: login fundo `rgb(244, 245, 247)`; upload 225 kB / 15,9 kB. Aberto: Vercel FS read-only.

**Portões (2ª):** tsc limpo; lint 22/0 (nenhum em `src/app/admin/**`); test:copy 1177; extrator 41; build OK.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/proxy.ts` (novo)
- `src/lib/adminGate.ts` (novo)
- `src/lib/eventosArquivo.ts` (novo)
- `src/data/events.json` (novo)
- `src/app/admin/layout.tsx` (novo)
- `src/app/admin/eventos/page.tsx` (novo)
- `src/app/admin/eventos/acoes.ts` (novo)
- `src/app/admin/eventos/[id]/page.tsx` (novo)
- `src/app/admin/eventos/[id]/FormularioEvento.tsx` (novo)
- `docs/admin-eventos.md` (novo)
- `src/data/events.ts`
- `scripts/copy-lock.mjs`
- `src/app/robots.ts`
- (ampliação:) `src/lib/adminSessao.ts`, `src/app/admin/eventos/arte.ts`

---

## SIS-215 — /eventos-inovacao — retirar ou clarear as bandas azuis escuras no início e fim do scroll

**Status:** In Review · **Labels:** conferir · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-215/eventos-inovacao-retirar-ou-clarear-as-bandas-azuis-escuras-no-inicio

### Pedido
Em `EventsSpotlight`, retirar ou clarear as bandas navy no começo e fim do scroll (hero→cena e cena→Social). Alvo `#eaf2fb` / `#cfe7f7`; desktop e `.eventos-lista`; fio ciano pode ficar; contraste AA; capturas 1440 início+fim; portões OK.

### O que foi feito
Antes (`scripts/medir-bandas-eventos-sis215.mjs`): ponta×miolo 1440 **15,65:1**; 390 **15,89:1**; ~324 px navy no topo de 8.100 px; base a partir de f=0,80 (~1.300 px).

Degradês: paradas navy saíram; ficou `#eaf2fb 0% → #f6fafd 45% → #eef5fc → #cfe7f7 100%` (`.eventos-lista:75` e `.eventos-destaque:99`). Depois ponta×miolo 1440 topo 1,63 / base 1,21; 390 1,03 / 1,16.

Emenda eventos→social: degrauRGB 0 (390) / 1 (1440). `<Social>` de `palco-de-cena-escura` para **`palco-emenda-de-claro-curta`** (`page.tsx:201`). Hero→cena: aresta navy/`#eaf2fb` de propósito (precedente parceiros). `.evento-veu-topo` é do EventsGrid (fora da rota).

Fio `.eventos-destaque-fio` intacto (`#0ed8f6`, 1,58:1 vs `#eaf2fb`).

Contraste: `#0b7fa8` reprovava (4,03 / **3,56** sobre `#cfe7f7`); trocado por **`#0a6788`** em :1137, :1233, :952. Piores 1440: sobretítulo 5,48; título 14,13; «/ 15» 5,08; texto cartão 11,57 (todos em f=0,97). 390: sobretítulo 5,62.

Capturas `docs/capturas/sis215-eventos/`. Sonda de scroll em 10 degraus (IntersectionObserver não via `scrollTo` instantâneo).

**Portões:** tsc 0; lint 22/0; copy-lock 1632; build OK, 30 rotas.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/events-spotlight.css`
- `src/app/eventos-inovacao/page.tsx`
- `scripts/medir-bandas-eventos-sis215.mjs`
- `scripts/medir-contraste-cena-eventos-sis215.mjs`

---

## SIS-214 — Home · Sobre o Luminna AI entre Números e Desafios

**Status:** In Review · **Labels:** conferir · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-214/home-sobre-o-luminna-ai-entre-numeros-e-desafios

### Pedido
Na home, entre Números (`Metrics`) e «Desafios no desenvolvimento de software», o capítulo «Sobre o Luminna AI» + parágrafo verbatim de `legacy.ts`. Ordem: Números → Luminna → Desafios. Sem inventar etapas; sem pin; spy coerente; capturas 1440; portões OK.

### O que foi feito
Os dois títulos estavam na mesma `.sequence-copy` com Desafios acima. Inversão em `ImpactSequence.tsx:222-246`: h2 «Sobre o Luminna AI» → `lp-lead` → eyebrow «Desafios…». `--reveal-i` 0/1/2. CSS: `.sequence-copy .lp-lead + .lp-eyebrow { margin: 1.6rem 0 0 }`.

Sonda `scripts/medir-sequencia-luminna-sis214.mjs`: `luminnaAntesDeDesafios: true` em 1440/390, f0.04/0.3/0.55, com e sem reduce. 1440 depois: h2 y=566 → lead 687 → chip 773. Verbatim `{title, text, kicker}: true`. `pageSections.ts` sem mudança (`impacto` nunca esteve no spy). Sem `pin: true`.

Emenda Números→sequência (`medir-emenda-numeros-sis214.mjs`): 1440 `#002248 → #032143`, degrau 5; 390 `#013060 → #041b3c`, degrau 36 — sem branco. Sombra de Números continua SIS-213.

**Portões:** tsc 0; lint 22/0; copy-lock 1634; build concluído. Capturas `docs/capturas/sis214-luminna/`.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/legacy/ImpactSequence.tsx`
- `src/components/legacy/legacy.css`
- `scripts/medir-sequencia-luminna-sis214.mjs`
- `scripts/medir-emenda-numeros-sis214.mjs`

---

## SIS-213 — Home · Números: retirar a sombra/faixa branca do fundo

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-213/home-numeros-retirar-a-sombrafaixa-branca-do-fundo

### Pedido
Na home, na seção Números (`Metrics` / `#resultados` / rótulo ScrollSpy «NÚMEROS»), retirar a faixa/sombra branca forte no meio do fundo (halo horizontal claro sobre o navy + malha) — não só atenuar. Identificar a camada (imagem `atrasnumeros.webp` vs CSS `.impact-*`) e eliminar o flare; manter legibilidade do sobretítulo/números e da malha; se a causa for o asset, ajustar overlay sem inventar arte nova. Fora de escopo: hover/bolinhas da SIS-203, salvo overlap documentado. Aceite: faixa ausente ou residual imperceptível; números e chrome legíveis; capturas 1440 antes/depois + portões OK.

### O que foi feito
A faixa **não** é a arte `atrasnumeros.webp` nem a névoa das células (SIS-203). São dois véus brancos somados na fronteira Números → montagem, herdados de vizinhança que já não existe:

- `.impact-saida` (`globals.css`, SIS-176) — 96px a 1440, `transparent → var(--paper)`, dentro da seção;
- `.sequence::after` (`legacy.css`) — 120px, `var(--paper) → transparent`, no topo da `ImpactSequence`.

Juntos: ~216px de quase branco full-bleed entre o navy dos números e o quadro escuro do vídeo. Isolamento por eliminação (`scripts/isolar-camadas-numeros-sis213.mjs`), perfil de luminância média por linha, 1440:

- trecho 0 %: completo 0,907; sem `::before` 0,907; sem `.impact-saida` 0,037; sem arte 0,907
- 5 %: completo 0,111; sem `::before` **0,038**; sem `.impact-saida` 0,035; sem arte 0,071
- 95 %: ~0,050 em todas as colunas

Emenda medida (`scripts/medir-emenda-numeros-sequencia-sis213.mjs`, coluna central, 1440): a −6px o antes era **rgb(240 243 245)** e o depois **rgb(1 43 92)**; a +6px o antes era **rgb(244 245 246)** e o depois **rgb(7 30 62)**.

**Correção:** `.impact-saida` perde a tinta (continua ocupando 96px e mostra `.impact-fundo` sobre `#041b3d`); `.sequence::after` fica e troca de tinta para `#041b3d → transparent`; em `forced-colors`, `.impact-saida { background: Canvas }` foi comentado. A arte não foi tocada. Sem overlap com SIS-203 (camadas `.impact-track` / névoa das células).

Segundo consumidor: `/quem-somos` também monta `<Metrics />`. Lá o `--paper` era pior (rgb(240 243 245) direto no navy do Teatro, rgb(1 32 75)). Com a correção: rgb(1 43 90) → rgb(1 32 75).

**Critérios:** perfil final no trecho caiu de 0,313 / 0,487 / 0,703 / 0,944 para 0,020 / 0,025 / 0,022 / 0,017; máximos de 0,43 restantes são curvas cianas da arte. Capturas: `docs/capturas/sis213-{antes,depois}-1440.png`, `sis213-{antes,depois}-emenda-base-1440.png`, `sis213-quemsomos-{antes,depois}-1440.png` e série `sis213-camadas/`. Portões: `tsc --noEmit` limpo; `npm run lint` 22 problemas / 0 erros; `npm run test:copy` OK (1178 textos); `npm run test:extrator` OK (41 casos). A emenda de cima (`.impact-scroll::before`, 150px, `--fundo-claro-secao`) **não** foi tocada: a vizinha de cima é Soluções, clara de fato.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/app/globals.css` (`.impact-saida`)
- `src/components/legacy/legacy.css` (`.sequence::after`)
- `scripts/isolar-camadas-numeros-sis213.mjs`
- `scripts/medir-emenda-numeros-sequencia-sis213.mjs`
- `scripts/medir-emenda-numeros-quemsomos-sis213.mjs`

---

## SIS-212 — /contato — negrito em «Preencha o formulário e fale com a gente!»

**Status:** In Review · **Labels:** conferir · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-212/contato-negrito-em-preencha-o-formulario-e-fale-com-a-gente

### Pedido
Na abertura de `/contato`, a frase «Preencha o formulário e fale com a gente!» deve aparecer em negrito (peso forte em toda a manchete — título + highlight). Escopo só `/contato` (`.hero-backdrop--contato` ou classe no `PageHero` desta rota); não engrossar as outras 13 rotas. Aceite: frase inteira em negrito (incluindo «fale com a gente!»); copy intacta; outras rotas `PageHero` sem mudança de peso; captura 1440 + portões OK.

### O que foi feito
Uma regra escopada na rota, em `src/app/globals.css`, no bloco já existente desta abertura:

```css
.hero-backdrop--contato .pagehero-entrada h1 {
  font-size: clamp(2.6rem, 5.9vw, 5rem);
  font-weight: 700;
}
```

`PageHero.tsx` e `contato/page.tsx` ficaram com zero diff. Peso **700** (não 600): `layout.tsx` carrega Geist com `weight: ['400','500','600','700']`; a 80px, 600 lê como 400 mais escuro. O `span` do highlight herda o peso (`text-[#A5F0FF]` sem peso próprio). Desvio declarado da SIS-155 (tipo de exibição em 400).

Peso computado do `h1` a 1440: `700`. `node scripts/copy-lock.mjs` → **1631 textos travados**, trava não regerada. Peso nas quatorze rotas com `PageHero`: só `/contato` em **700**; as outras treze em 400 (`/certificacoes` não usa `PageHero`).

Portões: `npx tsc --noEmit` → 0 erros; `npm run lint` → 23 problemas, 0 erros (avisos `react-hooks/static-components` pré-existentes); `npm run build` → sucesso, 14 rotas estáticas + 7 de `/solucoes/[slug]`.

Medição extra (`scripts/medir-negrito-contato-sis212.mjs`): a 1024 a quebra passou de 3 → 4 linhas (`h1` 185px → 247px); 390, 1280, 1440 e 1920 mantêm o número de linhas. `scrollWidth` igual à janela nas cinco larguras. Contraste remedido (`scripts/medir-contraste-negrito-contato-sis212.mjs`, método de `docs/medidas/COMO-MEDIR-CONTRASTE.md`): 390 6,31:1 / 8,70:1; 1024 8,44:1 / 7,21:1; 1280 7,64:1 / 6,97:1; 1440 7,33:1 / 7,18:1; 1920 7,39:1 / 8,20:1 — todas ≥ 4,5:1.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/app/globals.css`
- `scripts/medir-negrito-contato-sis212.mjs`
- `scripts/medir-contraste-negrito-contato-sis212.mjs`

---

## SIS-211 — /contato — números: fundo azul claro, cards tipo Implementações, seção mais baixa

**Status:** In Review · **Labels:** conferir · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-211/contato-numeros-fundo-azul-claro-cards-tipo-implementacoes-secao-mais

### Pedido
Na faixa de números de `/contato` (`MetricsBand` — 850+ Membros, 23+ Prêmios, 130+ Clientes, 650+ Mil horas, 230+ ERPs e demais de `METRICS`): (1) fundo azul bem clarinho (`--fundo-claro-secao` / `section-light-blue` / `#f2f9fe`→`#cfe7f7`, não o navy `#0f2b4a`→`#071d36`); (2) layout dinâmico dos cards no espírito de Implementações (`RoadmapTrail`: etapa/trilha — referência visual, não copy); números e rótulos 100% de `src/data/metrics.ts`; (3) diminuir altura/scroll do percurso sticky (SIS-144 / `PercursoIndicadores` + `metrics-band-track.css`). Tipografia navy/`text-ink` no claro; sticky OK, sem `pin: true`; reduce = sete indicadores alcançáveis; home `Metrics` intocada. Aceite: fundo clarinho com contraste AA; cards tipo etapa/trilha; altura/scroll menor (número no relatório); emenda com hero e parceiros sem listra; reduce/JS off; capturas + portões OK.

### O que foi feito
Medido no Playwright (`next dev` :3999, `deviceScaleFactor: 1`). Sondas: `scripts/medir-banda-indicadores-sis211.mjs`, `scripts/medir-contraste-indicadores-sis211.mjs`, `scripts/medir-estados-indicadores-sis211.mjs`.

**Fundo:** `MetricsBand` passou a `section-light section-light-blue`. Navy `#0f2b4a → #071d36` comentado em `metrics-band-track.css` e `globals.css`. Cartão: superfície branca, número `#0a1f44`, `+` `#024e86`, rótulo navy a 88%.

**Leitura de etapa (sem montar `RoadmapTrail`):** cada cartão ganhou `NN / 07` com nó e fio; acendimento em CSS sobre `--mb-t`: `alc = clamp(0, t × (N−1) − i + 1, 1)`. Sem `useState` por cartão; `MetricsBand` continua Server Component. Copy só de `METRICS`; a palavra «Etapa» ficou de fora.

**Altura:** `PASSO_SVH` em `PercursoIndicadores.tsx` de **30 → 18**. A 1440×900: seção 2520px (2,80×) → **1872px (2,08×)**; espaçador 1620px → **972px**; palco 900px; rolagem presa 1600px → **960px**; documento 6530px → **5882px (−648px)**. Fim do percurso: y=1652, `--mb-t` **1,0000**, `--mb-alc` do 7º **1,0000**, trilha **−1214,4px de 1214,4px**. Sem `pin: true` / sem ScrollTrigger.

**Contraste (máscara de miolo):** número **15,38:1** (tinta rgb(14,35,71)), franja 8,17:1; sufixo `+` 8,23 / 7,46 / 7,78:1; rótulo 10,32–10,41:1; contador aceso 7,75–7,92:1 (franja 4,85:1); não alcançado **8,84–9,17:1** (piso de alfa 55% → 82%). Correção: `.section-light span:not(…)×4` pintava o `CountUp` de `#024e86`. Emenda faixa→logos: 16,16:1 → **1,19–1,20:1**; abertura→faixa **5,25 / 5,80 / 5,26:1**. Reduce/JS-off: espaçador 0px, seção 564px, **7/7** cartões inteiros; sem JS os números saem do servidor `850+ | 23+ | 130+ | 650+ | 230+ | 35+ | 25+`.

Portões: lint 23/0; `test:copy` OK (1177 textos); `tsc --noEmit` limpo.

**Ajuste posterior (menos espaço em cima/embaixo):** palco de `100svh` → `PALCO_SVH = 40` em `PercursoIndicadores.tsx` (`--mb-palco`). A 1024/1440/1920 × 900: palco 900px → **360px**; seção 1872px → **1332px (1,48×)**; documento a 1440 5882px → **5342px (−540px)**. `ESCALA` 1,5556 → 1,9259 → **1,3704**. Cartões ~145px da emenda (antes ~420px) e ~140px das logos (antes ~350px). Emendas reconferidas 5,24 / 5,75 / 5,22:1 e faixa→logos **1,19:1**. Follow-up da usuária (tirar «01 / 07» e estreitar cards) aberto em **SIS-256**, não reabre o fundo claro.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/MetricsBand.tsx`
- `src/components/PercursoIndicadores.tsx`
- `src/components/metrics-band-track.css`
- `src/app/globals.css`
- `scripts/medir-banda-indicadores-sis211.mjs`
- `scripts/medir-contraste-indicadores-sis211.mjs`
- `scripts/medir-estados-indicadores-sis211.mjs`

---

## SIS-210 — /esg — GOVERNANCE: cards iguais à captura ENVIRONMENT (sombra + flutuação)

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-210/esg-governance-cards-iguais-a-captura-environment-sombra-flutuacao

### Pedido
A seção GOVERNANCE: Ética e Transparência (lead + seis itens) deve usar o mesmo desenho de cards da captura ENVIRONMENT: vidro arredondado, imagem circular + termo/detalhe (copy atual), sombra atrás, flutuação leve cima/baixo defasada entre os seis. Mesma família visual que ENVIRONMENT após SIS-208 (classe compartilhada). Manter `<dl>`/`<dt>`/`<dd>`; reduce parado; TODO do Canal de Denúncia permanece. Aceite: seis cards no vocabulário ENVIRONMENT; sombra + flutuação; copy e `<dl>` intactos; capturas 1440 + portões OK.

### O que foi feito
Entrega implementada sem conferência e sem verificação visual, conforme pedido.

- GOVERNANCE reutiliza o padrão da SIS-208: faixa azul com grade, vidro, retrato circular, pluma e flutuação defasada.
- Nenhuma nova declaração CSS visual foi duplicada.
- Os seis termos, detalhes, imagens e o TODO do Canal de Denúncia foram preservados.
- Para HTML válido com wrapper de dois níveis, cada cartão usa sua própria `<dl>` com um par `<dt>`/`<dd>`, dentro da lista dos seis.
- Reduced motion herdado dos dois canais da SIS-208.
- ESLint direcionado e TypeScript passaram.

Não foram rodados screenshots, Playwright, servidor dev, build ou copy-lock. A issue segue em In Review sem `conferir` e sem `conferido`.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
Não declarados no relatório.

---

## SIS-209 — /esg — SOCIAL: Huerta Niño e Aguas do mesmo tamanho + flutuação leve

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-209/esg-social-huerta-nino-e-aguas-do-mesmo-tamanho-flutuacao-leve

### Pedido
Nos dois cards da SOCIAL (Fundación Huerta Niño e Fundación Aguas): mesmo tamanho (altura e largura na grade de duas colunas) e movimento leve cima/baixo contínuo. Desktop ≥768: foto com altura fixa/`aspect-ratio` + `items-stretch` / `h-full`. Flutuação em `translateY` (±4–8px sugeridos), ciclo lento, defasada (`--esg-fase`); só `transform`/`opacity`. Hover da SIS-140 não pode brigar com a flutuação. Reduce parado; sem scroll-x (SIS-184). Aceite: mesma caixa em 768+; flutuação defasada; captura 1440 lado a lado + portões OK.

### O que foi feito
Despacho e entrega **sem conferência**. Auditoria: a foto já era igual (`h-52`, 208px); a desigualdade vinha do corpo de texto sem `h-full`. Flutuação no wrapper (não no `<article>`), senão o `scale(1.03)` da SIS-140 seria silenciado. Classe própria só nos dois wrappers de SOCIAL (`.esg-apoio` também embala selo e turmas).

**Mesmo tamanho:** os dois cartões medem **512 × 546px**, delta **0px**, em 1366 e 1440. Grade com `items-stretch`; wrapper e `<article>` com `h-full` (card `flex flex-col`); foto `shrink-0`; texto `flex-1`. Mobile empilhado.

**Flutuação inicial:** classe `esg-social-flutua`, `translateY` ±6px, ciclo 7s `alternate` (ida e volta 14s), fase via `--esg-fase` (segundo cartão 3,5s adiante). Hover: flutuação no wrapper, escala no filho; `animation-play-state: paused` no hover. Reduce (sistema e `html[data-motion='reduce']`): `transform: none`, `animation-name: none`; pluma em opacidade **1**. Sem rolagem lateral: `scrollWidth` 390/390 e 768/768. Evidências em `docs/medidas/sis209/` (`auditar.mjs`, `resultado.json`, `social-1440x900.png`). Portões: lint 0 erros / 23 avisos; `tsc --noEmit` OK; `build` OK; `test:copy` não rodado (copy intacta).

**Ajuste posterior (amplitude aumentada a pedido):** `translateY(±6px)` → `translateY(±12px)`; ciclo 7s → 5s `alternate` (ida e volta 10s); velocidade média ~0,9px/s → ~2,4px/s. **Sai da faixa sugerida na issue (±4–8px).** Teto: `.esg-apoio::before` tem `inset: -24px`. Defasagem `--esg-fase-onda` (`-2.5s`); `--esg-fase` permanece `-3.5s` (pluma 7s / turmas 11s). Remediado: tamanhos 512×546 intactos; em 1440 um cartão +10,82px → +5,38px enquanto o outro −5,27px → −10,77px.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/app/esg/page.tsx`
- `docs/medidas/sis209/auditar.mjs`
- `docs/medidas/sis209/resultado.json`
- `docs/medidas/sis209/social-1440x900.png`

---

## SIS-208 — /esg — ENVIRONMENT: cards da captura (círculo, sombra, flutuação) + superfície

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-208/esg-environment-cards-da-captura-circulo-sombra-flutuacao-superficie

### Pedido
O bloco ENVIRONMENT: Sustentabilidade Ambiental deve ter a linguagem visual da captura (10/09): fundo azul médio + grade leve, lead branco, cards vidro com imagem circular e legenda branca, grade 3 colunas desktop, sombra atrás, flutuação do card inteiro. Copy em `page.tsx` não muda. Padrão compartilhado pensado para SIS-210 (GOVERNANCE). Foguete não é obrigatório. Aceite: superfície + lead batem com a captura; seis cards vidro/círculo/sombra/flutuação, reduce parado; copy intacta; capturas 1440 + portões OK.

### O que foi feito
Entrega implementada sem conferência e sem verificação visual, conforme pedido.

- ENVIRONMENT ganhou faixa azul média com a grade técnica já existente.
- Os seis cards usam vidro, retrato circular, legenda branca, pluma estática e flutuação defasada do card inteiro.
- Padrão extraído em classes compartilháveis para GOVERNANCE: `esg-faixa-azul`, `esg-cartao-pluma`, `esg-cartao-flutua` e `esg-cartao-retrato`.
- Copy e grade de três colunas preservadas.
- Reduced motion coberto por `prefers-reduced-motion` e `html[data-motion='reduce']`.
- ESLint direcionado, TypeScript e parse do CSS passaram.

Não foram rodados screenshots, Playwright, servidor dev, build ou copy-lock. A issue segue em In Review sem `conferir` e sem `conferido`.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
Não declarados no relatório.

---

## SIS-207 — /esg — SOCIAL: foguete silhueta branca e trajeto em toda a seção

**Status:** In Review · **Labels:** conferir · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-207/esg-social-foguete-silhueta-branca-e-trajeto-em-toda-a-secao

### Pedido
Na SOCIAL, a silhueta de scroll deve ser branca translúcida discreta (não o foguete colorido do selo Gerando Talentos) e seguir a rolagem por toda a seção (Gerando Talentos → turmas → Huerta Niño / Aguas). Recalibrar `offset`/`y`; `aria-hidden`, `pointer-events: none`; progresso sem `setState` por quadro (MotionValue); reduce parado e visível no meio do caminho. Aceite: silhueta visível; acompanha topo→fim; contraste do lead ≥ piso AA no pior ponto; reduce visível; capturas 1440 início/meio/fim + portões OK.

### O que foi feito
Arquivos: `src/components/ui/FogueteScroll.tsx` e `scripts/medir-foguete-social-sis207.mjs`. A sonda varre `offset: ['start end','end start']` em 1440×900, 1366×768, 390×844 e 1440 reduce; mede presença, visibilidade real (diff raster com `display:none` em `[data-foguete]`), confinamento e transforms distintos.

| Medida | antes | depois |
|---|---|---|
| 1440 — passos sem caixa em quadro | 5 / 11 | **0 / 11** |
| 1440 — silhueta invisível (<200px alterados) | 5 | **0** |
| 1366 — sem caixa / invisível | 6 / 6 de 12 | **0 / 0** |
| 390 — sem caixa / invisível | 11 / 12 de 17 | **0 / 0** |
| 1440 reduce — sem caixa / invisível | 4 / 4 de 11 | **0 / 0** |
| pixels fora da seção | 0 | **0** |
| transforms distintos (1440/1366/390) | 12 / 13 / 18 | 12 / 13 / 18 |
| transforms (`reduce`) | 1 | **1** |

Estilo: `fill=rgb(255, 255, 255)`, `fill-opacity=0.78`, rastro `0.46`. Conserto geométrico: `sticky top-0` (âncora altura zero); `overflow-hidden` saiu; `overflow-clip` nos dois eixos (com só `overflow-x-clip` a silhueta pintava acima da seção em 6/11 passos, 178px no ENVIRONMENT). Contraste (`docs/medidas/COMO-MEDIR-CONTRASTE.md`): lead `text-ink-muted` (#3d5a80) **5,45:1 / 5,48:1 / 5,49:1** (1440/1366/390); `h3` `text-ink` (#0a1f44) **12,84:1** a 1440. Reduce: constantes `y=12svh`, `x=0%`, `rotate=8`. Sem `setState` por quadro. Capturas anexas `sis207-depois-{inicio,meio,fim,reduce}-1440.png` e `sis207-antes-meio-1440.png`.

Portões: `tsc --noEmit` OK; lint 23/0 (nenhum aviso em `FogueteScroll.tsx`); `npx next build` compiled successfully in 5.4s.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/ui/FogueteScroll.tsx`
- `scripts/medir-foguete-social-sis207.mjs`

---

## SIS-206 — /esg — reparo: título da abertura quebrado (frase ESG)

**Status:** In Review · **Labels:** conferir · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-206/esg-reparo-titulo-da-abertura-quebrado-frase-esg

### Pedido
A abertura de `/esg` com «A Sistran demonstra seu forte compromisso com o ESG, integrando práticas sustentáveis em suas operações e cultura corporativa» está quebrada de novo. Não reabrir o escopo da SIS-138 (duas colunas). Olhar `esg/page.tsx` (`PageHero` + `hero-backdrop--esg`) e `globals.css` (~L17600–17780). Copy travada em `.claude/conteudo-site/07-esg.md`. Aceite: frase legível 390→1440; duas colunas ≥1280; um `h1`; contraste ≥ 4,5:1; outras rotas `PageHero` intactas; capturas + lint/tsc/build OK.

### O que foi feito
Só CSS em `.hero-backdrop--esg` (`src/app/globals.css`). `scrollWidth == innerWidth` a 1280–1920: nada cortado; o defeito era ordem de leitura. A grade da SIS-138 dava esquerda `minmax(0, 52vw)` e a continuação recebia 456px a 1440, fechando em duas linhas **acima** da última linha do título (continuação y=491, título y=509). Causa: SIS-155 trocou `--font-editorial` para Geist, mais larga (manchete 2 → 3 linhas).

**Mudanças:** (1) grade `minmax(0, 1fr) max-content`; continuação com `white-space: nowrap` + `max-width: none` (derruba `max-w-2xl` 672px) em **uma** linha, `align-items: end`; (2) corpo do título `clamp(2rem, 3.6vw, 3.2rem)` → `clamp(2rem, 3.3vw, 3rem)` (`scripts/varrer-titulo-esg-sis206.mjs`; 3,1vw e 2,9vw recusados); (3) véu da rota fechado; (4) regra SIS-113 `h1 { max-width: min(46ch, 52vw) }` substituída por comentário.

Medido (`scripts/medir-abertura-esg-sis206.mjs`): 1440 título 47,52px, caixa 534×205 em (160,365); continuação 1 linha 671×40 em (737, **530**); última linha do título y=513 (Δ 17px). 1280: 42,24px, 453×182; continuação 597×35. 390: bloco abaixo, 24px. Um `h1` nas três larguras. Continuação `clamp(1.5rem, 2.5vw, 2.25rem)` da SIS-138: 36px / 32px / 24px.

Contraste (máscara de miolo). Véu C **74/60/84+28** escolhido (`scripts/varrer-veu-esg-sis206.mjs`): 1280 **7,05:1**, 1440 **6,10:1**, 1920 **8,33:1**, 390 **5,75:1**. Degraus B recusado por margem; D recusado porque apaga a foto. `copy-lock.json` não regerado (1631 textos). Portões: tsc 0 erros; lint 23/0; build compiled successfully, `/esg` estática.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/app/globals.css`
- `scripts/medir-abertura-esg-sis206.mjs`
- `scripts/varrer-titulo-esg-sis206.mjs`
- `scripts/varrer-veu-esg-sis206.mjs`

---

## SIS-205 — /eventos-inovacao — botão YouTube só em Web Summit AI e Suitability

**Status:** In Review · **Labels:** conferir · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-205/eventos-inovacao-botao-youtube-so-em-web-summit-ai-e-suitability

### Pedido
Na cena `EventsSpotlight` de `/eventos-inovacao`, o botão `ASSISTA NO YOUTUBE` só em `web-summit-ai` e `suitability-ai` (`src/data/events.ts`); os outros treze (ex. ITC Vegas) sem botão. Condicionar nos dois layouts (desktop sticky + lista estreita); preferir flag no data. Enquanto não houver URL de vídeo, os dois continuam no canal (`YOUTUBE_URL`). Atualizar nota do cabeçalho (~L97–102). Aceite: botão só nos dois; teclado/`rel` intactos; sem inventar URL; captura 1440 com/sem botão; lint/tsc/build OK.

### O que foi feito
Flag `youtube?: boolean` em `SistranEvent` (`src/data/events.ts`), `true` só em `web-summit-ai` e `suitability-ai`. Os dois blocos de `EventsSpotlight.tsx` renderizam `<a className="eventos-destaque-botao">` sob `{evento.youtube && …}` / `{e.youtube && …}`. Boolean, não `true | string` (URL por vídeo inexistente; literal em `src/data/` entra no copy-lock). Não reaproveitou `featured`.

Sonda `scripts/capturar-botao-youtube-sis205.mjs` (`next dev` 3999): palco 1440 em 15 passos — botão em 2 eventos (Web Summit AI e Suitability), não montou em 12 (FENACOR não caiu no centro: 2+12=14 amostrados). Lista estreita 390: 15 itens, **2** botões, `no-preference` e `reduce`. `href` único: `https://www.youtube.com/channel/UC-4NqY5lFD3e1cNwlUemj2g` (`YOUTUBE_URL`). Nota ~L97 reescrita. `scripts/medir-cena-eventos.mjs` asserção `"13-quinzeBotoes"` → `"13-doisBotoes"` (`=== 2`). `rel="noopener noreferrer"`, `target="_blank"`, `<span class="sr-only">` preservados.

Portões: tsc 0 erros; lint 22/0; build compiled successfully in 8.7s, 20 rotas. `test:copy` não estava na lista e não foi rodado.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/data/events.ts`
- `src/components/EventsSpotlight.tsx`
- `scripts/capturar-botao-youtube-sis205.mjs`
- `scripts/medir-cena-eventos.mjs`

---

## SIS-204 — /eventos-inovacao — título único com scroll + sombra azul clara + rótulos inteiros nas miniaturas

**Status:** In Review · **Labels:** conferir · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-204/eventos-inovacao-titulo-unico-com-scroll-sombra-azul-clara-rotulos

### Pedido
Polish da `EventsSpotlight` (não reabrir SIS-166): (1) um só «Eventos & Inovação» no scroll hero→cena (fade/translate; reduce sem duplicata; sem `pin: true`); (2) sombra azul mais clara no cartão e nas miniaturas (família `#0ed8f6`, não navy `rgba(4, 32, 62, …)`); (3) título inteiro em cada miniatura (sem ellipsis de 1 linha), palco ainda cabe em 1366/1440. Aceite: transição documentada; sombras ciano; rótulos completos; capturas 1440; lint/tsc/build OK.

### O que foi feito
Onde: `src/components/EventsSpotlight.tsx`, `src/components/events-spotlight.css` e `scripts/`. `page.tsx`/`PageHero` não mudaram.

**Título único:** `IntersectionObserver` no `#topo h1` escreve `data-titulo="cedido" | "assumido"` em `<section id="eventos">`. Hero em quadro: cabeçalho da cena `opacity: 0` + `translateY(0.75rem)`; hero sai: cena assume em 0,45s. Hierarquia `h1` + `h2` permanece. Medido (opacity efetiva > 0,05): 1440/1366/1024 passaram de **2** títulos em quadro para **1**. Reduce: cessão continua, só a transição morre (`transition: none`, `transform: none`); espelho `html[data-motion="reduce"]`. Fallback sem JS: `data-titulo` null.

**Sombra** (só `box-shadow`, `#0ed8f6`):

- `.eventos-destaque-cartao`: `rgba(4,32,62,.55) 0 30px 60px -40px` → `rgba(14,216,246,.6) 0 18px 44px -28px, rgba(11,127,168,.3) 0 3px 12px -6px`
- `.eventos-vaga-arte`: `rgba(8,33,63,.6) 0 8px 20px -14px` → `rgba(14,216,246,.6) 0 5px 14px -8px, rgba(11,127,168,.28) 0 1px 4px -2px`
- `.eventos-vaga-rotulo`: `none` → `rgba(14,216,246,.55) 0 3px 10px -6px, rgba(11,127,168,.24) 0 1px 3px -2px`
- `.eventos-lista-item` (mobile): navy → `rgba(14,216,246,.6) 0 16px 40px -28px, rgba(11,127,168,.3) 0 3px 12px -6px`

**Rótulos:** elipse de 1 linha saiu; vaga virou linha (`flex-direction: row`); `--evt-vaga-h` passou a PISO (`min-height`). Rótulos cortados: 1440 9→**0**/15; 1366 10→**0**/15; 1024 12→**0**/15. Teto `--evt-rotulo-linhas` **12**. Palco: 1440 soma vagas 448/627 · 463/627, folga faixa→cartão 123px; 1366 454/502 · 470/502, folga 112px; 1024 469/552 · 512/552, folga 19px. Correção 1024: coluna pintava sobre o cartão (contraste descrição **1,02:1**); `.eventos-destaque-coluna--dir .eventos-vaga { margin-left: auto }` + `--evt-prof: 1.06` e `faixa >= vaga × 1,606`; arte 0,34 → 0,30. Contraste descrição depois: **11,60:1** nas cinco larguras. Reaplicou asserção SIS-205 `quinzeBotoes` → `doisBotoes`.

Portões: tsc 0 erros; lint 23/0; next build OK; `medir-cena-eventos.mjs` **77 asserções, 0 falsas**; `medir-cena-eventos-sis204.mjs` verde em 1440/1366/1024.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/EventsSpotlight.tsx`
- `src/components/events-spotlight.css`
- `scripts/medir-cena-eventos.mjs`
- `scripts/medir-cena-eventos-sis204.mjs`

---

## SIS-203 — Home · números: hover fluido nas células, menos névoa branca, bolinhas sob cada métrica

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-203/home-numeros-hover-fluido-nas-celulas-menos-nevoa-branca-bolinhas-sob

### Pedido
Na faixa Sistran em números (sete métricas, `#resultados` / `Metrics.tsx`), depois da SIS-200: hover mais fluido (lift `translateY`/scale; reduce sem hover motion); faixa navy arredondada permanece; diminuir névoa/sombra branca do retângulo; reposicionar o trilho de sete pontos cianos — uma bolinha sob o eixo de cada célula. Copy/valores intactos; sem `pin: true`; não desfazer ícones da SIS-200. Aceite: hover perceptível; retângulo único; névoa mais fraca; 7 pontos sob células em 1440 (± tolerância); capturas 1440; lint/tsc/build/`test:copy` OK.

### O que foi feito
Entrega **sem conferência**. Resultado:

- Painel único navy, 1360px em viewport 1440, raio de 24px, divisórias internas preservadas.
- Hover via `transform`: célula acesa `0 → -6px`; célula apagada `12 → -6px`, opacidade 0,56.
- Reduce: `transform: none` (`prefers-reduced-motion` e `html[data-motion='reduce']`).
- Névoa superior reduzida para 150px e opacidade 0,28; sombra do painel curta e escura.
- Sete bolinhas ligadas por linha; desvio máximo centro da célula ↔ centro do ponto em 1440: **0,01px**.
- Mobile 390: painel 358px, documento 390px/viewport 390px, sem overflow; métricas em coluna; trilho no rodapé do painel.

Evidências: `docs/medidas/sis203/baseline-1440x900.png`, `depois-1440x900.png`, `depois-390x844.png`, `baseline.json`, `depois.json`. Portões: lint 0 erros (22 avisos); TypeScript OK; build OK; `test:copy` mantém 10 divergências concorrentes; `copy-lock.json` não absorvido. Captura baseline com modal de preferência de movimento cobrindo parte da cena; geometria no JSON. Comentário 11/09: banda branca full-bleed segue em SIS-213.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/Metrics.tsx`
- `src/app/globals.css`
- `docs/medidas/sis203/baseline.json`
- `docs/medidas/sis203/depois.json`

---

## SIS-202 — /parceiros-e-implementacoes · etapas: layout RoadmapTrail + textos da timeline antiga

**Status:** In Review · **Labels:** conferir · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-202/parceiros-e-implementacoes-etapas-layout-roadmaptrail-textos-da

### Pedido
Em `/parceiros-e-implementacoes`, a seção de etapas (`PartnersTrail` / `#linha-do-tempo`) deve ficar visualmente igual ao `RoadmapTrail` de `/transformacao-legado`. A usuária **reprovou** o default opção 1 (copy Luminna: `roadmapIntro` + `roadmapStops`). Pedido real: **só o layout**; textos dos cards voltam a `TIMELINE_EVENTS` (`timeline.ts` — gerações, Castelo Costa · Zurich, detail, categorias). Cabeçalho da seção **sem** `roadmapIntro`. Preferir reusar `RoadmapTrail`; `/transformacao-legado` sem regressão; `PartnersTrail` preservado e desmontado. Sem `pin: true`. Aceite: layout alinhado (capturas 1440 lado a lado); zero copy de legado/Luminna; cards com company/detail/generation; mobile + reduce; lint/tsc/build/`test:copy` OK.

### O que foi feito
Primeira entrega montou opção 1 (mesmo `roadmapIntro`/`roadmapStops`; palco `.roadmap-stage` **3502px** nas duas rotas a 1440 e **6989px** a 390; `PartnersTrail` desmontada; correção mobile `@media (max-width: 63.99rem)` — a regra de linha vertical **não existia** em `legacy.css`). Portões da 1ª rodada: tsc limpo; build 27/27; lint 22/0; `test:copy` já falhava na linha de base. A usuária devolveu para In Progress (10/09).

**Refeita — opção 2:** `RoadmapTrail` passou a receber `id`, `intro`, `stops` e `traveler` por prop (padrões = legado). Contrato `TrailStop`: `stage` e `detail` opcionais; campos ausentes não renderizam. Paradas em `src/lib/partnersRoadmapStops.ts` derivadas de `TIMELINE_EVENTS`: `generation` → linha de cima; `company` → título; `detail` → apoio; `category` + `TIMELINE_CATEGORY_META` → pílula/cor; iniciais do primeiro nome → monograma (`Castelo Costa · …` → `CC`). `timeline.ts` intocado. Cabeçalho `{ kicker: 'Implementações', title: 'Linha do tempo' }`. `traveler={null}` (logo Luminna só no legado). Geometria `useMemo(() => buildTrail(stops.length))` (24 paradas ≠ palco de 10). Sem chips/checklist/«VER DETALHES»/status CONCLUÍDO. Legado `.roadmap-stage` **3502px** em todas as passagens. Mobile 390: palco 6989px, todas as paradas alcançáveis. Reduce: rota pintada até o fim, paradas 23 e 24 legíveis. Ajustes: `legacy.css` `:has(.roadmap-topics)` para não esconder `.roadmap-text` sem checklist; `NEUTRAL_GRADIENT` exportado. Imperfeição declarada: «ETAPA 12 / 24» quebra em duas linhas (pílula «EMPRESAS GRANDES»). Follow-up viajante: **SIS-220**.

Portões da 2ª rodada: lint 22/0; tsc limpo nos arquivos da issue, **5 erros pré-existentes em `UnitsMap.tsx`**; build bloqueado pelo mesmo arquivo (com só `UnitsMap` em stash, build compila); `test:copy` falha na linha de base. Correção copy-lock: `palavras[0][0] + palavras[1][0]` virou `slice(0,2).map(p => p[0]).join('')`.

### Conferência
Sem registro de conferência no Linear. A primeira entrega foi reprovada pela usuária (copy Luminna indevida) e refeita na opção 2; não há comentário de conferente com VEREDITO.

### Arquivos tocados
- `src/components/legacy/RoadmapTrail.tsx`
- `src/components/legacy/legacy.css`
- `src/app/parceiros-e-implementacoes/page.tsx`
- `src/lib/partnersRoadmapStops.ts`
- `src/data/pageSections.ts` (tom da parada; 1ª rodada)
- `scripts/capturar-etapas-sis202.mjs`

---

## SIS-201 — /parceiros-e-implementacoes · cards horizontais estilo Terminal + imagens parceirosimplantações

**Status:** In Review · **Labels:** conferir · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-201/parceiros-e-implementacoes-cards-horizontais-estilo-terminal-imagens

### Pedido
Redesenhar a seção Parceiros no estilo Platform do Terminal Industries: cards grandes horizontais + pills de categoria + setas prev/next. Fundos em `public/parceirosimplantações/` (renomear para ASCII `public/parceiros-implementacoes/`). Copy de `partners.ts` / `05-parceiros-e-implementacoes.md`. `PartnersTrack` sai do mount (arquivo preservado). Reparo 10/09: manter `p.logo` / `p.logoAlt` nos cards; logo em destaque; hover com eco da mesma logo atrás + sombra azul (`#0ed8f6`); reduce sem eco. Sem `pin: true`. Aceite: 16 cards + abas + setas; 01/02 documentados (Samplemed/Pega); duplicata SAP e PNG ChatGPT fora; mobile/reduce; lint/tsc/build/`test:copy` OK.

### O que foi feito
**Base (sem conferência):** `PartnersTrack` desmontado, arquivo preservado; 16 cards com scroll-snap, pills de filtro e setas; `next/image`, overlay navy, copy existente; Addactis sem description inventada; pasta ASCII `public/parceiros-implementacoes/` com 16 imagens; `01.png` → Samplemed, `02.png` → Pega; duplicata SAP e ChatGPT excluídos; Playwright 1440×900 / 390×844 / 390 reduce: HTTP 200, 16 cards, setas 48×48. Portões: lint 0 erros; tsc OK; build OK; `test:copy` bloqueado por Home concorrente.

**Reparo 1 — placas:** `PartnerTerminalCards.tsx` + `partner-terminal-cards.css`. Placa via `p.logo`, `margin-bottom: auto`. 16/16 no DOM (1440, 390, 390 reduce). Quatro logos de tinta clara (ST IT, Addactis, SAP, dacadoo) somem no chip branco (2,31 / 2,84 / 1,80 / 2,10:1) e passam no navy (7,36 / 5,98 / 9,42 / 8,08:1); as outras doze o inverso. Duas variantes, mesma geometria. Render 1440: **16/16 passam de 3:1 no núcleo do traço**; mínimo Earnix **3,67:1**. `alt=""` + `aria-hidden` (nome no `<h3>`). Lista `LOGOS_DE_TINTA_CLARA` no componente, não em `partners.ts`. Layout: 1440 card 642px folga 192–332px; 390 card 546px folga 96–335px.

**Reparo 2 — destaque + eco:** placa `max-width: 13rem / max-height: 3.25rem` (imagem 35–52px a 1440, 23–36px a 390). Eco: mesma `partner.logo`, idle `opacity: 0 / scale(0.92)` → hover `opacity: 0.34 / scale(1.45)`, `transform-origin: top left`; `drop-shadow(0 0 1.25rem rgba(14,216,246,.78))` + `drop-shadow(0 0 3rem rgba(9,107,173,.62))`. Reduce: `display: none` no eco (sistema e `html[data-motion='reduce']`). Folga eco→texto 1440 **122–273px**; 390 **80–332px** (`scale(1.28)`). Contraste re-medido: 16/16 > 3:1; mínimo Earnix **3,63:1**. Sonda do eco intermitente corrigida (pausa 400ms após `scrollIntoViewIfNeeded`). Portões dos reparos: tsc limpo; lint 22/0; build OK; `test:copy` falha fora do diff. Follow-up: **SIS-218** (pin + scrub) e **SIS-219** (escala da placa).

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/PartnerTerminalCards.tsx`
- `src/components/partner-terminal-cards.css`
- `src/app/parceiros-e-implementacoes/page.tsx`
- `public/parceiros-implementacoes/`
- `scripts/medir-logos-parceiros-sis201.mjs`
- `scripts/medir-placas-render-sis201.mjs`
- `scripts/medir-layout-placas-sis201.mjs`
- `scripts/capturar-placas-sis201.mjs`
- `scripts/medir-eco-hover-sis201.mjs`

---

## SIS-200 — Home · Sistran em números: sete células iguais + ícone dinâmico por métrica

**Status:** In Review · **Labels:** conferir · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-200/home-sistran-em-numeros-sete-celulas-iguais-icone-dinamico-por-metrica

### Pedido
Na home, seção Sistran em números (`#resultados` / `Metrics.tsx`): todas as células com a mesma largura/altura; um ícone dinâmico distinto por métrica (não sete iguais). Copy/valores de `metrics.ts` travados. Opção A: reusar `ImpactVisuais` ~40–56px; opção B: Lucide/`getIcon`. Desktop ≥1280: larguras iguais (≤1px). Aceite: células iguais medidas; ícones distintos; ativo com movimento; labels longos não desigualizam; capturas 1440; lint/tsc/build/`test:copy` OK; relatório com opção A ou B.

### O que foi feito
Opção **B** (catálogo da casa). A: desenhos 200×200 com traço 0,8–1 caem abaixo de meio pixel a 52px; vocabulário `.iv*` vive no `@media (min-width: 1024px)` inerte (`dirigindo = false`). Mapa `Record<ImpactVisual, …>` completo em `src/components/ui/impact/ImpactIcones.ts` (não em `src/data/metrics.ts`: `icon: 'Users'` reprovaria o copy-lock). Catálogo não cresceu: Users, Award, Handshake, Clock, Layers, ShieldCheck, Workflow.

Diagnóstico: `1fr` × 7 já era 169,42px; a 1ª célula tinha conteúdo 148,42 vs 128,42 (20px = `1.25rem` de `padding-left` só nela); `.impact-lista` em `align-items: start` desigualizava alturas/fios. Correção: mesmo padding nas sete; `border-left-color: transparent` na primeira (não `width: 0`); `align-items: stretch`.

Medição (`scripts/medir-celulas-numeros-sis200.mjs`): **1440** `169.42px × 7`, conteúdo 148,42, altura **173,58**, 7 ícones; **1280** `149.58 × 7`, conteúdo 128,58, altura 197,58. Espalhamento **0,00px**. Mobile: 390 1 col 350px; 768 2 col 342px; 1024 4 col 223,11px (espalhamento 0,02px); 1279 4 col 282,66px; `scrollWidth == clientWidth`. `hyphens: auto` tentado e retirado («Capa-cidade»); `overflow-wrap: anywhere` fica.

Dinâmico: carona em `data-aceso` e `--impact-i`; entrada `translate3d(0,4px) scale(0.86)` + delay `calc(var(--impact-i) * 60ms + 80ms)`; idle `impact-icone-respira` 6s no anel. Na fileira estática `data-aceso` acumula (sete `sim`). `aria-hidden` no wrapper `.impact-icone`; `strokeWidth={1.6}`. Observação: rótulo ScrollSpy «NÚMEROS» cobre o ícone da 1ª célula a 1440.

Portões: tsc 0; lint 22/0; build OK; `test:copy` reprova por frentes concorrentes (nomes de ícone não aparecem no relatório).

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/ui/impact/ImpactIcones.ts`
- `src/components/Metrics.tsx`
- `src/app/globals.css`
- `src/data/types.ts` (comentário)
- `src/data/metrics.ts` (comentário)
- `scripts/medir-celulas-numeros-sis200.mjs`

---

## SIS-199 — Home · backdrop inteiro = azul claro + grade leve (igual Soluções de Negócios)

**Status:** In Review · **Labels:** conferir · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-199/home-backdrop-inteiro-azul-claro-grade-leve-igual-solucoes-de-negocios

### Pedido
Na home inteira (`src/app/page.tsx`), o backdrop deve ser a mesma superfície de Soluções de Negócios (`SolutionsStory`): `--fundo-claro-secao` + grades leves (`.story-solucoes__grade`, linhas `rgba(4, 58, 99, 0.08)` ~64px, opacidade ~0,32). Isolar em classe no `<main>` (não pintar o site). Relatório obrigatório: opção 1 (canvas claro + palcos navy por cima) ou 2 (home toda clara). Aceite: sem `#1273bc` vazando entre seções (exceto palco declarado); tipografia ink; outras rotas sem regressão; capturas 1440 topo/Soluções/Números/rodapé; lint/tsc/build/`test:copy` OK.

### O que foi feito
**Opção 1.** Raster `scripts/medir-canvas-home-sis199.mjs`, coluna `x=8`: Metrics 525px navy; ImpactSequence 1025px; Social+Footer 1166px — **2716px de 10991px = 24,7%**. Palcos declarados; Social/Footer são chrome de 10+ rotas. Degraus de emenda (média 4px de cada lado): hero→BrandGrid 1→**1**; BrandGrid→Soluções **23→0**; Soluções→Números 6→**4**; Montagem→Contato 0→0; Contato→Social 24→24 (pré-existente).

Mecanismo: `--fundo-claro-secao` + tokens `--grade-fina-linha/modulo/opacidade` (64px); `background-attachment: fixed` (um radial para a página). Nenhum ancestral de `#conteudo` pode ganhar `transform`/`filter`/`perspective`. `.marcas-grade::after`: grade fina repetida na seção opaca (747px sem malha). `.home-canvas .impact-scroll::before`: rampa da Metrics pintava `#e4edf7` à mão (degrau 6→13); corrigida com token `fixed` + `mask-image` (degrau **4**). `.section-light::before` e `.story-solucoes__grade` em `display: none` dentro de `.home-canvas`. Classe `.home-canvas` no `<main>`; 14 rotas conferidas; `body` segue `rgb(18, 115, 188)`.

Contraste (`medir-contraste-hero-pitch.mjs`): 1440 título 14,45 / apoio 9,97 / pilares 15,01–15,31 / realce 3,36; 1024 semelhante; 390 sobre vídeo 6,32 / 5,59 / 5,77–6,28 / 5,55. Portões: lint 22/0; tsc exit 0; build 8.5s 27/27; `test:copy` OK (1189 textos).

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/app/page.tsx` (`.home-canvas` no `<main>`)
- `src/app/globals.css`
- `src/components/solutions-story.css` (tokens de grade)
- `scripts/medir-canvas-home-sis199.mjs`

---

## SIS-198 — Home · hero: tamanho fixo (sem scale/drop) + contorno ciano melhorado — ref card

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-198/home-hero-tamanho-fixo-sem-scaledrop-contorno-ciano-melhorado-ref-card

### Pedido
No hero da home, parar de diminuir no scroll (`scale` 1→0,54 em `[0.62, 0.96]`, `drop` 0→20svh em `[0.84, 1]`). Manter tamanho padrão igual a `public/referencia-hero-card-tamanho.png` (card largo, cantos arredondados, margem, moldura ciano). Melhorar o contorno ciano da SIS-190 (glow/peso; skills GSAP/filters/svg-stroke, sem `pin: true`). Preservar layout SIS-178, pitch SIS-192, vídeo SIS-189. Medir emenda com BrandGrid. Aceite: sem scale/drop de recolhimento; tamanho ≈ PNG (valores no relatório); contorno melhor; skills citadas; capturas 1440; lint/tsc/build/`test:copy` OK.

### O que foi feito
Sem relatório de entrega no Linear. O histórico de estados mostra In Progress em 10/09/2026 das 13h28 às 16h52, e In Review desde então; os únicos comentários são de despacho, sobre a PNG de referência (`public/referencia-hero-card-tamanho.png`, gravada no repo em 10/09).

**A entrega existe no código, apenas não foi relatada.** Conferido em `src/components/HeroCinematic.tsx`, onde o próprio diff se documenta:

- Os três valores de recolhimento foram removidos e ficaram comentados com o motivo de cada um, marcados como SIS-198: `scale` `[0.62, 0.96] → [1, 0.54]` (o fechamento a 54% no fim do percurso), `radius` `[0, 30]` (só existia para acompanhar o `scale`, já que raio em sangria não se vê) e `drop` `[0.84, 1] → ['0svh', '20svh']` (a descida que levava o card fechado até o bloco seguinte).
- No lugar dos três entrou **geometria estática** em `globals.css` (`.hero-scene`, bloco `>= 1024px`): recuo, altura e raio medidos na referência por `scripts/medir-referencia-card-hero.mjs`. A justificativa registrada é que card parado é layout, não animação — como CSS, vale antes da hidratação, sem JS e com movimento reduzido, sem exigir um segundo caminho.
- O raio dos cantos da direita do quadro de vídeo (herdado da SIS-190) deixou de ser interpolado de 20 para 30 e virou fixo, confirmado pela mesma medição da referência do card.
- A `.hero-sheet` permanece e passa a ser o que se vê em volta do card o tempo todo, não só no fim do percurso.

Não há, em lugar nenhum, as medidas contra a referência, as capturas 1440 antes/depois, as skills citadas nem o resultado dos portões que os critérios de aceite exigiam.

### Conferência
Sem registro de conferência no Linear. É o caso mais frágil do lote: `In Review` sem `conferir` nem `conferido`, sem relatório e sem as evidências pedidas no aceite — a entrega só é verificável lendo o código.

### Arquivos tocados
Não declarados no relatório. Identificados por leitura do código:
- `src/components/HeroCinematic.tsx`
- `src/app/globals.css` (`.hero-scene`)
- `scripts/medir-referencia-card-hero.mjs`

---

## SIS-197 — Home · data-reveal: presets fade-up/fade/scale-soft/line-up nos blocos (Efeito 4 — doc Terminal)

**Status:** In Review · **Labels:** conferir · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-197/home-data-reveal-presets-fade-upfadescale-softline-up-nos-blocos

### Pedido
Aplicar na home os presets `data-reveal` do Efeito 4 (`docs/efeitos-scroll-terminal-industries.md`): `fade-up`, `fade`, `scale-soft`, `line-up`; stagger ~80ms. Fora: wrappers em volta de ProofJourney/sticky, hero video (SIS-189), BrandGrid (SIS-195), títulos da SIS-194. Gatilho típico `top 85%`; reduce no primeiro paint. Sem segunda lib / sem `framer-motion`. Ligar à SIS-71 sem reabrir auditoria. Aceite: presets consistentes; sem `transform` em ancestral sticky; lint/tsc/build OK.

### O que foi feito
Fundação SIS-193 (`useRevealTrigger.ts`, `RevealScope.tsx`) já `conferido`. CSS anima, JS só marca `data-in`. Token `--motion-stagger-reveal: 80ms`. Presets: `fade-up` → opacity 0 + `translate3d(0, var(--motion-distance-sm), 0)`; `fade` → opacity 0; `scale-soft` → opacity 0 + `scale(0.96)`; `line-up` → opacity 0 + `scaleX(0)`, `transform-origin: left center`, duração `--motion-reveal-slow`. Estado escondido exige ancestral `[data-in="false"]`.

Onde entrou: (1) `SolutionsStory.tsx` — header: eyebrow `fade-up` i=0; `h2#solucoes-titulo` i=1; rótulo Diferenciais `fade` i=2; régua `line-up` mesmo índice; escopo no próprio `<header>`. (2) `ImpactSequence.tsx` — kicker / `h2#impacto-title` / `.lp-lead` `fade-up` 0–2; escopo em `.sequence-sticky`. Fora: Hero, BrandGrid, corpo SolutionsStory/ProofJourney/Metrics, Contact, Social/CartaoDuasFaces, Footer.

Desvios: `line-up` desenha da esquerda (`scaleX`), não sobe; stagger via `--reveal-i` × token, não `data-stagger`. Reduce: regras SIS-193 com `!important`. Sonda `docs/medidas/sis197/sonda-presets.mjs`: ao entrar 0,008 / 0,037 / 0,121 / 0,386 no header; depois do percurso 7 nós opacity 1; reduce (sistema e `data-motion`) 7 nós prontos com escopo ainda `data-in="false"`; nenhum ancestral sticky com `transform`/`filter`/`perspective`. Correção lint: `ref={legenda.ref}` → `const { ref: legendaRef } = useRevealTrigger()`. Relatório também em `docs/ENTREGA-EFEITOS-HOME.md`. Portões: tsc 0; lint 22/0; next build 0; `test:copy` OK (1189). Follow-up 15/09: cobertura tipo `docs/scroll.md` em **SIS-275**.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/app/globals.css`
- `src/components/SolutionsStory.tsx`
- `src/components/legacy/ImpactSequence.tsx`
- `docs/medidas/sis197/sonda-presets.mjs`
- `docs/ENTREGA-EFEITOS-HOME.md`

---

## SIS-196 — Home · Soluções de Negócios: redesenhar no sticky storytelling Terminal (layout inteiro)

**Status:** In Review · **Labels:** conferido · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-196/home-solucoes-de-negocios-redesenhar-no-sticky-storytelling-terminal

### Pedido
Trocar o layout inteiro do bloco Soluções de Negócios pelo modelo de `docs/secao-sticky-storytelling-terminal.md` (duas colunas, mídia sticky, frases progressivas, recorte, mobile sem sticky longo). Copy das quatro etapas de `solutions.ts`. Reparos 10/09: texto não pode passar atrás da imagem; fundo azul claro (`.section-light` / `#f2f9fe`→`#cfe7f7`); sombra atrás das imagens via `filter: drop-shadow` (não `box-shadow` no clip-path). Sem `pin: true`. Relatório com decisão ProofJourney (1 ou 2). Aceite: checklist do doc §18 + emenda; `test:copy`/lint/tsc/build OK.

### O que foi feito
Primeira fatia (09/09) acendeu texto caractere a caractere no teatro antigo (sonda 222 caracteres; pico 66 a 1440 / 48 a 1024; reduce 0 partidos). Escopo ampliado: layout inteiro.

**Opção 2 — desacoplar** da `ProofJourney`: `<SolutionsStory />` irmã, montada antes da jornada. Correções em `ProofJourney.tsx`: `chegadaDe` do 1º capítulo = `topo - SOBREPOSICAO * vh`; capítulo inicial = primeiro inscrito. Arquivos novos: `SolutionsStory.tsx`, `solutions-story.css`. `Solutions.tsx` e `.solutions-*` comentados, não apagados. Grade 46/54; sticky; IO `rootMargin: -45% 0 -45%`; frase por caractere em rAF (estado React só `activeIndex`/`isDesktop`); contador `01 / 04`; mobile scroll-snap-x; reduce nas duas chaves. 1ª implementação: superfície ainda navy (emendas BrandGrid/Metrics). Após reparos da usuária: fundo claro, overlap 0px² em 1440/1280/1024; sticky top 100px; crossfade 500ms; contraste ink 13,36–16,07:1; muted 4,27–5,13:1; ciano transitório 1,35–1,62:1; emenda gap 0; CLS 0,032–0,073.

**Reparo no-JS:** `solutions-story.css` passou a ser servido no HTML inicial; quatro figures 1324,8×522px; painel desktop `display:none` 0×0.

**Sombra (3ª rodada):** desktop `drop-shadow` no wrapper sticky externo; clip/overflow no `.story-solucoes__midia-recorte`; mobile/no-JS/reduce `drop-shadow` nas quatro figures. Computed: navy rgba(...,0.14) 0 10px 22px + azul rgba(...,0.10) 0 2px 6px; figures 0.13 0 8px 12px + 0.09 0 1px 4px. Folga até clips: 35,6px (1440), 19px (1024), 3,6px (390). Raster: escurecimento 16,4 na aresta reta vs 3,4 na baía recortada. Sem `box-shadow`, sem filter em `.story-media__item`, sem `will-change` permanente. Portões finais: lint 0 erros, tsc, `test:copy`, build e `test:solutions-story` verdes.

### Conferência
**VEREDITO: REPROVADO** (1ª conferência): fallback sem JS na build de produção — CSS estrutural ausente do HTML inicial; figures ~1304×0. Reparo do CSS no entry point servidor atendido.

**VEREDITO: REPROVADO** (2ª): no-JS corrigido, mas sem `filter: drop-shadow(...)` no painel (critério novo de sombra). Reparo da 3ª rodada atendido.

**VEREDITO: APROVADO** (3ª e última): sombra navy+ciano via `drop-shadow`; clip no nó interno; raster 16,4 vs 3,4; folgas positivas; grid 46/54; overlap 0; opção 2; emenda gap 0 e CLS 0; portões verdes. Permanece In Review com `conferido`. Sugestões não bloqueantes: folga 3,6px em 390; wrapper interno no mobile se Safari/Firefox recortarem sombra; comentário obsoleto em `page.tsx`; monitorar stacking do filter.

### Arquivos tocados
- `src/components/SolutionsStory.tsx`
- `src/components/solutions-story.css`
- `src/app/page.tsx`
- `src/components/ProofJourney.tsx`
- `copy-lock.json` (regenerado na 1ª montagem da opção 2)

---

## SIS-195 — Home · BrandGrid: cascata fade-up das logos no scroll (Efeito 1 — doc Terminal)

**Status:** In Review · **Labels:** conferido · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-195/home-brandgrid-cascata-fade-up-das-logos-no-scroll-efeito-1-doc

### Pedido
Efeito 1 de `docs/efeitos-scroll-terminal-industries.md` na `BrandGrid`: cascata fade-up das logos. Estado inicial `opacity: 0; translate3d(0, 24px, 0)` (mobile 16px); duração ~2,4s (`--motion-logo`); stagger 0,10s; gatilho ~20% da seção; `toggleActions: play none none reverse`. Geometria SIS-179 intacta (15 marcas 5×3 / 3×5 — não forçar 10 colunas). Reduce: estado final no primeiro paint. Aceite: cascata na ordem de leitura; reverter ao voltar acima; título antes das logos; object-fit; cleanup GSAP/ST; lint/tsc/build/`test:copy` OK.

### O que foi feito
`BrandGrid.tsx`: campo em `RevealScope umaVez={false}`; cada `<img>` com `data-logo` e `--logo-i`. Movimento (2400ms, expo, 100ms, 24px; ≤640px 1100ms e 60ms) no bloco SIS-193. Recusas: 10 colunas do doc; `scaleX/scaleY` nas linhas (são `background-image`); movimento não é infinito. Sonda `scripts/medir-efeitos-rolagem-home.mjs` (`next start`): 15 logos, 1440/1024/390 × 3 regimes — normal parte de 0 e chega a 1; reduce já 1 antes de rolar. Armadilhas: medir no rodapé dava 0 (reverte ao sair); trava de duas leituras iguais falhava no stagger 1400ms (piso 4200ms).

**2ª implementação (após reprovação):** animação no wrapper (não disputa com `.marcas-grade-celula img`); `RevealScope` com semântica `play none none reverse`. Runtime 1440: translate 24→0px, 2400ms, última delay 1400ms, diferença 1408ms; 390: 16→0, 1100ms, delay 840ms, diferença 835ms; rodapé `data-in=true`, opacidade mín. 1; reverse ao voltar acima (inclusive salto ao topo); hover grayscale(0) + azul preservado.

Portões (ambas as rodadas de entrega): tsc limpo; lint 24/0 depois 0 erros; build e `test:copy` verdes.

### Conferência
**VEREDITO: REPROVADO:** (1) cascata perdia para `img` (runtime só `filter, opacity` 400ms, delay 0, transform saltava); (2) `umaVez={false}` revertia no rodapé e as logos sumiam; (3) sonda insuficiente. Reparos da 2ª rodada atendidos.

**VEREDITO: APROVADO** (2ª): wrapper 2,4s / delay 1,4s / Y 24→0 a 1440; mobile 1,1s / 0,84s / 16→0; hover e geometria SIS-179; reverse só acima; 15 logos; SSR/no-JS e reduces; portões verdes. Permanece In Review com `conferido`.

### Arquivos tocados
- `src/components/BrandGrid.tsx`
- `src/components/motion/RevealScope.tsx`
- `src/app/globals.css` (bloco SIS-193)
- `scripts/medir-efeitos-rolagem-home.mjs`

---

## SIS-194 — Home · títulos: revelação por linha/palavra com máscara (Efeito 2 — doc Terminal)

**Status:** In Review · **Labels:** conferido · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-194/home-titulos-revelacao-por-linhapalavra-com-mascara-efeito-2-doc

### Pedido
Efeito 2: revelação de títulos da home por linha/palavra com máscara `overflow: clip`. Candidatos: título da BrandGrid, Soluções/Números e demais pós-hero. Fora: parágrafos longos; hero «Alta Performance» se o split quebrar o gradiente (SIS-192). Inicial `opacity: 0; translateY(1.05em)`; 900–1100ms; stagger linhas ~80ms / palavras 45–60ms; gatilho `top 82%`; uma vez; `aria-label` completo; reduce visível no primeiro paint. Aceite: títulos listados no relatório; sem split em parágrafos; leitor de tela ouve o título uma vez; lint/tsc/build/`test:copy` OK.

### O que foi feito
`src/components/motion/RevealText.tsx` + regras `.reveal-line` / `.reveal-line__inner` no bloco SIS-193. Aplicado ao título da parede de marcas (`marcas-grade-titulo`). Palavra, não linha: `text-wrap: balance` muda a contagem de linhas entre 1440 e 320 (nota SIS-155); split de linha medido errado corta o título. `aria-label` no pai; máscaras `aria-hidden`. Exceção: manchete do hero (`Alta Performance`) de fora — `background-clip: text` + `inline-block` vira listras. Correção de lint: contador mutável no `map` → `reduce` puro. Sonda (rodada conjunta das quatro issues de movimento): 10 palavras mascaradas; opacity mín. 0 em repouso e 1 com a seção em cena nas três larguras; 1 já em repouso nos dois reduces. Portões: tsc limpo; lint 24/0; next build verde; `test:copy` OK.

### Conferência
**VEREDITO: APROVADO.** `RevealText` no título da BrandGrid: 10 palavras, máscara `overflow: clip`, 1000ms, stagger 55ms, gatilho equivalente a 82%, frase completa acessível, spans ocultos, no-JS/reduce visíveis. Hero excluído para preservar o gradiente; Soluções já tem movimento próprio; Números não tem mais h2 visível. Permanece In Review com `conferido`. Sugestões: ids dos títulos fora do efeito; não empilhar `data-reveal` da SIS-197 no mesmo h2; sr-only único adicional.

### Arquivos tocados
- `src/components/motion/RevealText.tsx`
- `src/app/globals.css`
- `src/components/BrandGrid.tsx`

---

## SIS-193 — Home · motion Terminal: tokens Sistran + primitiva Reveal (base do doc efeitos-scroll-terminal-industries)

**Status:** In Review · **Labels:** conferido · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-193/home-motion-terminal-tokens-sistran-primitiva-reveal-base-do-doc

### Pedido
Base da linguagem de movimento na home (`docs/efeitos-scroll-terminal-industries.md`): tokens CSS com cores Sistran (não lime Terminal) e uma primitiva Reveal única para os efeitos 1–4. `--motion-signal` = ciano `#0ed8f6`; `--motion-ink` = navy da casa; durações 300/500/1000 ms (ou alinhar easing a `easeExpo`); primitiva `fade-up`/`fade`/`scale-soft`/`line-up` estendendo `motion.ts`/`SectionReveal`, sem `framer-motion`. Reduce nos dois interruptores. Só fundação — não animar BrandGrid/títulos/Soluções. Aceite: tokens + mapeamento; um caminho Reveal/`data-reveal`; lint/tsc/`next build` OK; doc citado nos arquivos novos.

### O que foi feito
`src/app/globals.css`: tokens `--motion-reveal-*`, `--motion-stagger-*`, `--motion-distance-*`, `--motion-signal/ink/muted` no `:root` + bloco «SIS-193 · fundação dos efeitos de rolagem». `src/components/motion/useRevealTrigger.ts` — IntersectionObserver escreve `data-in`. `src/components/motion/RevealScope.tsx` — envelope cliente para server components.

Desvios: durações como `--motion-reveal-fast/base/slow` (não sobrescrever `--motion-fast/base/slow` já usados: 180/`var(--dur-base)`/900ms e 180/420/650ms). Cores: lime/`#dddddd` → `--color-sky` e cinza `#5a6b80`; tinta `#041b3d`. Mecanismo: JS só marca `data-in`; CSS anula nas duas chaves de reduce; conteúdo visível sem JS (escondido exige `[data-in="false"]`). Sem `pin`. Sonda compartilhada com SIS-195. Ressalva: regeneração de `copy-lock.json` absorveu trabalho alheio (`HeroCinematic.tsx`, `Metrics.tsx`). Portões: tsc limpo; lint 24/0; next build verde; `test:copy` OK (1193 textos).

### Conferência
**VEREDITO: APROVADO.** Tokens Sistran, gatilho único via `data-in`, SSR/no-JS visível, cleanup do IntersectionObserver, ambos os reduces, sem dependências paralelas novas. Portões: tsc, build e `test:copy` verdes; lint 24 avisos / 0 erros. Permanece In Review com `conferido`. Sugestões: consolidar `SectionReveal`/`data-reveal` e `data-in` antes da SIS-197; esconder `.story-media__item` só sob ancestral `data-in="false"`; ciano só como passagem, não texto estático sobre claro.

### Arquivos tocados
- `src/app/globals.css`
- `src/components/motion/useRevealTrigger.ts`
- `src/components/motion/RevealScope.tsx`

---

## SIS-192 — Home: tirar o mosaico e levar “Entrega com Alta Performance…” + quatro pilares para a coluna ao lado do vídeo

**Status:** In Review · **Labels:** conferido · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-192/home-tirar-o-mosaico-e-levar-entrega-com-alta-performance-quatro

### Pedido
Na home: tirar a seção do mosaico (`StackScenes variante="home"`) e colocar ao lado do vídeo do hero (layout SIS-178) o título «Entrega com Alta Performance e Comprometimento» (`Alta Performance` em destaque), o apoio «Empresas que aderem a tecnologia…» e os quatro rótulos (Conhecimento em Seguros, Flexibilidade, Tecnologia, Solidez e permanência) — copy de `mosaicIntroHome` + `DIFFERENTIALS[].title`. Comentar mosaico/`MosaicHandoff` (não apagar); `/transformacao-legado` intacta; `HERO_SLIDES` saem da home; um único heading; sem âncora morta `#sinais`; contraste medido; `test:copy`/lint/tsc/build OK.

### O que foi feito
`page.tsx`: `StackScenes variante="home"`, `MosaicHandoff` e imports órfãos comentados com motivo. Novo `src/components/ui/HeroPitch.tsx`: bloco fixo da coluna, dados de `mosaicIntroHome` e `DIFFERENTIALS` + `getIcon`. `HeroCinematic.tsx`: `HERO_SLIDES`/`HeroCaptions` comentados; notas de mosaico reescritas (vizinha = BrandGrid). `globals.css`: `.hero-pitch-*` reaproveitando `.hero-caption*`; `max-width: 14ch` antigo (legenda 14 caracteres) recalibrado para título de 45; tarja do regime C. Rolagem só governa saída (`opacity` 1→0 entre 0,52 e 0,66). Um único `h1` visível; `h1` sr-only retirado (registrado em `.claude/conteudo-site/00-home.md`). Mobile (<1024): mesmo bloco sobre o vídeo (regime C).

Contraste (`scripts/medir-contraste-hero-pitch.mjs`, letra por diferença): regime A 1440/1024 título **16,01:1**, realce **3,72:1**, apoio **11,36:1**, pilares **16,01:1**. Regime C 390: título corpo **11,34:1**, realce **7,73:1**, apoio **7,17:1**, pilares 8,65–9,80:1. Remediação C: tarja `rgb(3 17 38 / 64%)` (elipses da SIS-178 centradas numa caixa de duas linhas; bloco ~3× mais alto). Realce C é `#a8e0ff` chapado (degradê + fill transparente deixa `text-shadow` passar). Reduce nos dois interruptores: opacity 1 em 1440 e 390. Soluções abre sem handoff (`--carrier-destino` default 1). Sem `#sinais` no ScrollSpy da home. Ressalvas: lock absorveu Metrics alheio; ScrollSpy x=12..104 sobrepõe coluna x=86 (~6px) — pré-existente. Follow-up: **SIS-226** (alternar `HERO_SLIDES` durante o vídeo e manter o bloco no fim).

Portões: `test:copy` OK (1193); tsc OK; lint 24/0 (`HeroPitch` sem avisos); next build OK.

### Conferência
**VEREDITO: APROVADO.** Home sem `StackScenes variante="home"`, sem `MosaicHandoff` e sem `#sinais` morto; BrandGrid irmão de `#top`; um h1 visível com realce, apoio e quatro pilares; mobile sobre a vinheta; sem `HERO_SLIDES`; ícones via `getIcon`; vídeo autoplay muted; `/transformacao-legado` intacta. Contraste conferente: desktop título/pilares 16,01:1, realce 4,28:1; mobile tarja título 5,72:1, realce 4,03:1. Portões: `test:copy` 1193, tsc e build OK. Lint da árvore com 4 erros em `ScrollVideo.tsx` atribuídos à SIS-189. Permanece In Review com `conferido`.

### Arquivos tocados
- `src/app/page.tsx`
- `src/components/ui/HeroPitch.tsx`
- `src/components/HeroCinematic.tsx`
- `src/app/globals.css`
- `scripts/medir-contraste-hero-pitch.mjs`
- `.claude/conteudo-site/00-home.md`

---

## SIS-191 — /quem-somos · Escritórios: mapa cortado no norte e vão excessivo até a seção — país inteiro e emenda justa

**Status:** In Review · **Labels:** conferido · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-191/quem-somos-escritorios-mapa-cortado-no-norte-e-vao-excessivo-ate-a

### Pedido
Em `/quem-somos`, seção Escritórios BRASIL: o mapa do Brasil estava cortado no topo (norte / Amapá–Roraima) e havia um vão enorme entre a seção anterior e esta. Aceite: silhueta inteira no pouso de Pato Branco (modo scroll, ≥1280×760); medição de recorte país vs SVG em 1280 / 1366 / 1440 com folga ≥ 0 no topo; pouso de São Paulo sem regressão; vão visivelmente reduzido com números antes/depois; header sem cobrir título nem abas; modo lista intacto; capturas; lint / tsc / build / test:copy OK. Fora de escopo: modo lista por min-height 760px, divisas SP/PR (SIS-185) e a transição PB→SP em si (SIS-169).

### O que foi feito
**Rodada 1.** A correção removeu o padding duplicado apenas do modo scroll e preservou o modo lista. Câmera, percurso de 300svh e `overflow: clip` não foram alterados: a medição mostrou folga superior positiva em PR.

- `src/app/quem-somos/page.tsx`: `section-py` do wrapper de Escritórios substituído por `offices-section`.
- `src/app/globals.css`: espaçamento original de 5/7/8rem preservado no modo lista; zerado somente com `data-modo="scroll"`.
- `docs/medidas/sis191/`: sondas, JSONs e capturas.

**Recorte do Brasil — folgas país vs SVG (rodada 1):** PR 1280×760 topo 6,3px / direita 130,2 / base 69,9 / esquerda 89,4; PR 1366×900 topo 7,6px; PR 1440×900 topo 7,6px. SP 1280 topo 194,7px, faixa livre do cartão 15px; SP 1366 recorte lateral esquerdo preexistente de 13,5px (sem regressão); SP 1440 faixa livre 102,7px.

**Emenda antes → depois:** 1280 254,2 → 126px; 1366 289,6 → 161,6px; 1440 287,1 → 159,1px. Header termina em 104px; título 166,3–201,9px; abas 319,7–365,6px. Lista 1279px / altura 759px / reduced motion: duas cidades visíveis, mapa com folga superior 90,8px; CLS 0. Portões rodada 1: lint 24 avisos / 0 erros; tsc, build (27 páginas), test:copy 1193 textos.

**Rodada 2 (após rejeição visual da usuária).** Causa: medição na borda externa do SVG (padding reduz o viewport; ~10px de corte no norte); fill da América do Sul formando aresta reta; ScrollSpy ativo (x≈140–149px) sobre a coluna (x≈72–80px). Ajustes em `globals.css`: corredor esquerdo no palco largo; máscara limitada à caixa de conteúdo; `--os-foco-y` de PB de `-1%` para `3.4%`; deslocamento de SP em tela larga de `-34%` para `-28%`. Medições: topo do país 34,1px (1440), 32,8px (1512), 37,5px (1920); SP folga esquerda 15,9px (1440), 28,8px (1470), 248px (1920). Portões: lint, tsc, test:copy 1193, build OK.

### Conferência
Rodada 1: **VEREDITO: APROVADO** (depois revogado pela usuária: corte percebido + rótulo `ESCRITÓRIOS` sobre o título). Rodada 2: **VEREDITO: APROVADO**. Conferência independente: PB folga superior real 13,8–16,1px, Brasil inteiro; SP folga esquerda 5,1–248px; máscara só no continente decorativo; ScrollSpy não invade, folga 11,4–19,4px acima de 1440; 1280×760, 1366×768, 1440×900, 1512×860, 1920×1080, lista e reduce OK. Permanece In Review com `conferido`.

### Arquivos tocados
- `src/app/quem-somos/page.tsx`
- `src/app/globals.css`
- `docs/medidas/sis191/`

---

## SIS-190 — Home · hero: borda/moldura no quadro do vídeo — ref public/referenciavideo.png

**Status:** In Review · **Labels:** conferir · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-190/home-hero-bordamoldura-no-quadro-do-video-ref-publicreferenciavideopng

### Pedido
Colocar uma borda no quadro do vídeo do hero (`.hero-media` / `hero-scroll-v2.mp4`), alinhada a `public/referenciavideo.png`: cantos arredondados, traço ciano fino com glow, borda em topo/direita/base, esquerda dissolvendo no branco (SIS-178). Aceite: valores medidos; caminho A/B/C escrito; moldura no desktop ≥1024; dissolução esquerda preservada; comportamento <1024 registrado; capturas 1440 e 390; portões OK. Em 10/09 o item de acompanhar scale/drop foi supersedido pela SIS-198.

### O que foi feito
Caminho **C**: `.hero-frame` é `<span>` irmão de `.hero-media` (não borda na camada do vídeo, não `.hero-scene`, não `#top`), com a mesma máscara `linear-gradient(90deg, transparent 0%, rgb(0 0 0 / 35%) 26%, #000 62%)`. Não B (`border-left: 0` deixa aresta seca). Não A (retângulo completo sobre a folha). Traço: anel de **2px** por `padding: 2px` + `mask-composite: exclude`, degradê `#0079CB → #0ed8f6`. Fallback `@supports not (mask-composite…)`: borda sólida `#0ed8f6`. Brilho interno (`inset 0 0 3px / 0 0 26px`).

**Referência** (`public/referenciavideo.png`, 1799×874, script `scripts/medir-referencia-moldura-hero.mjs`): direita pico `#00defe`, núcleo ~2px; esquerda sem traço; cantos dir. arco 19–20px; tokens `#0079CB` e `#0ed8f6`; raio inicial 20px. Recuo de ~51px da ref não adotado (mudaria geometria SIS-178).

**Três `t` a 1440×900** (`scripts/medir-moldura-hero.mjs`): `molduraRaio = useTransform(scrollYProgress, [0.62, 0.96], [20, 30])`. t=0 raio 20px, traço direita 218 `#0cd7f5`; t=0,7 raio 22,35px; t=1 raio 30px. Lado que dissolve ciano ≤15. **<1024:** `.hero-frame { display: none }`; a 390×844 sem caixa. Reduced motion: traço 218 `#0cd7f5`, raio 20px. `opacity: 0.9999` de `.hero-video` intocado.

Portões: tsc limpo; lint 24 / 0 erros; next build OK; test:copy 1193.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/app/globals.css`
- `src/components/HeroCinematic.tsx`
- `scripts/medir-referencia-moldura-hero.mjs`
- `scripts/medir-moldura-hero.mjs`

---

## SIS-189 — Home · hero: vídeo começa automático ao entrar, e a rolagem controla ida e volta

**Status:** In Review · **Labels:** conferir · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-189/home-hero-video-comeca-automatico-ao-entrar-e-a-rolagem-controla-ida-e

### Pedido
Na home, o vídeo do hero deve começar sozinho na entrada e a rolagem deve controlar ida e volta (rebobinar). Modelo: um eixo `t ∈ [0, 1]` com Fase A (play + sync de scroll via Lenis) e Fase B (seek no primeiro gesto). Aceite: automático no topo com movimento permitido; legendas acompanham `t`; primeiro scroll assume; rebobinar contínuo; âncora no meio do hero sem automático; reduce sem play; muted + playsInline; lint / tsc / build / test:copy.

### O que foi feito
Um escritor de `currentTime` por vez.

**`src/components/primitives/ScrollVideo.tsx`:** props `reproduzir`, `tetoReproducao`, `onFracao`, `onEntradaEncerrada`. Fase A: `play()`; `buscar()` sai antes de escrever `currentTime`. Relógio em `requestAnimationFrame` (não `timeupdate`, ~4 Hz). Fração com o mesmo `duration - 0.05` do seek. `play()` recusado = Fase A não acontece.

**`src/components/HeroCinematic.tsx`:** `fase` nasce em `'rolagem'` e é promovida num rAF após montar (hidratação). Teto da entrada = **0.58**. Posicionamento por `syncSmoothScroll` (Lenis). Saída da Fase A: gesto (`wheel`/`touchstart`/`keydown`/`pointerdown`, `once`), divergência de 24px contra o último alvo, teto, recusa do `play()`. Reduce lido por `matchMedia` + `data-motion`.

**Medição** (`scripts/medir-entrada-hero.mjs`, Chromium 1440×900): topo 3,5s `t 0 → 2,88`, `y 0 → 272`; um `wheel` pausa em `t 4,29` e não retoma; rolar ao topo `t → 0`; reduce sistema e `data-motion` pausados; âncora fora do topo pausado.

Portões: tsc limpo; lint 24 / 0 erros (refs de Fase A saíram do render para `useEffect`); next build exit 0; test:copy 1193.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/primitives/ScrollVideo.tsx`
- `src/components/HeroCinematic.tsx`
- `scripts/medir-entrada-hero.mjs`

---

## SIS-188 — Higiene: inventariar componentes órfãos (Hero, PillarsCarousel, TrustTicker, CompanySignature, PartnersGrid, EventsGrid) — guardar ou declarar rascunho

**Status:** In Review · **Labels:** conferido · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-188/higiene-inventariar-componentes-orfaos-hero-pillarscarousel

### Pedido
Issue de decisão + higiene (item 3b-c de `DECISOES-PENDENTES.md`): classificar cada órfão como peça guardada, rascunho ou ainda vivo; cabeçalho com substituto; nenhum import morto em `page.tsx`; portões OK; nenhuma rota muda visualmente. `UnitsMap` não é órfão se ainda montado em `/contato`.

### O que foi feito
Mudança exclusivamente documental, sem alteração de runtime. Cabeçalhos GUARDADO/RASCUNHO nos arquivos; nenhum arquivo/export apagado, movido ou comentado.

Tabela final (reparo da rodada 1):

- `src/components/Hero.tsx` — GUARDADO: nenhum import; home monta `HeroCinematic`.
- `src/components/ui/PillarsCarousel.tsx` — GUARDADO: único importador é o `Hero.tsx` órfão.
- `src/components/ui/TrustTicker.tsx` — GUARDADO: idem.
- `src/components/ui/CompanySignature.tsx` — RASCUNHO: zero importadores.
- `src/components/PartnersGrid.tsx` — GUARDADO: rota monta `PartnerTerminalCards`.
- `src/components/EventsGrid.tsx` — GUARDADO: import comentado; rota monta `EventsSpotlight`.
- `src/components/UnitsMap.tsx` — VIVO: `/contato` importa como `MapaUnidades` em `#onde-estamos`.

Portões: lint 0 erros / 22 warnings; tsc OK; build 27 páginas; diff-check OK; test:copy bloqueado por divergências concorrentes Home/Parceiros (lock não alterado).

### Conferência
Rodada 1: **VEREDITO: REPROVADO** — faltava a tabela `arquivo → vivo / guardado / rascunho` no comentário da issue. Rodada 2: **VEREDITO: APROVADO** após a tabela. Falha de `test:copy` externa à SIS-188.

### Arquivos tocados
- `src/components/Hero.tsx`
- `src/components/ui/PillarsCarousel.tsx`
- `src/components/ui/TrustTicker.tsx`
- `src/components/ui/CompanySignature.tsx`
- `src/components/PartnersGrid.tsx`
- `src/components/EventsGrid.tsx`
- (`UnitsMap.tsx` vivo, intocado)

---

## SIS-187 — Home: emenda visível entre o claro do hero (`#f4f8fc`) e a seção seguinte — decidir se dissolve, unifica ou permanece

**Status:** In Review · **Labels:** conferir · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-187/home-emenda-visivel-entre-o-claro-do-hero-f4f8fc-e-a-secao-seguinte

### Pedido
Consequência da SIS-178: aresta visível entre `.hero-sheet` `#f4f8fc` e a grade de marcas `#f5faff` (`#top + *`). Três saídas; portão: decisão registrada **antes** do diff. Aceite: raster 390 e 1440; notas de `page.tsx` e `brand-grid.css` alinhadas; sem regressão no `drop` nem no empilhamento; portões OK.

### O que foi feito
**Decisão (antes do diff):** saída 2, aval da dona do produto. Unificar `#f4f8fc` transformaria o claro do hero na cor da página; deixar manteria degrau de largura cheia.

A emenda é espacial, não de contraste. Antes: 1440 e 390 acima `244,248,252` / abaixo `245,250,255`, maior degrau **3** em `dy = 0` (razão ≈ 1,02). Depois: degradê `#f4f8fc → rgba(244,248,252,0)` em `clamp(56px, 7svh, 96px)` na borda de cima de `.marcas-grade`; maior degrau **1** em `dy = 7` nas duas larguras.

`.marcas-grade` continua `#f5faff`; a rampa é `background-image`. Fade para transparente (não para `#f5faff`) para o navegador misturar com o fundo real. Notas de `page.tsx` e CSS marcadas `ERA:` e refutadas com os números. Sonda `scripts/medir-emenda-hero-grade.mjs` (armadilhas: amostrar no meio atravessa o cartão; clip Playwright em coords de documento). Nada toca geometria do `drop` nem `#top + *`.

Portões: tsc limpo; lint 24 / 0; next build exit 0; test:copy 1193.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/brand-grid.css`
- `src/app/page.tsx`
- `scripts/medir-emenda-hero-grade.mjs`

---

## SIS-186 — Medição de contraste: o pior pixel em texto miúdo pega franja de antialiasing e condena o que passa

**Status:** In Review · **Labels:** conferir · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-186/medicao-de-contraste-o-pior-pixel-em-texto-miudo-pega-franja-de

### Pedido
O instrumento de contraste por raster subestima texto pequeno (SIS-178: traço ~11px 4,20:1 vs cálculo 7,23:1). Documentar o artefato em `COMO-MEDIR-CONTRASTE.md`; instrumentar o par raster + cálculo; não suavizar o pior pixel; nota cruzada na SIS-176; nenhum CSS/TSX de produção.

### O que foi feito
Nenhum CSS/TSX de produção mudou.

- `docs/medidas/COMO-MEDIR-CONTRASTE.md` — §7: artefato, regra do par, limiar, consertos errados.
- `scripts/medir-contraste-hero-pitch.mjs` — emite `razao`, `rasterPior`, `delta`, `miudo`, `veredito`.
- `scripts/medir-contraste-escritorios.mjs` e `scripts/medir-cena-eventos.mjs` — nota: o par **não** se aplica (apagam tinta antes de capturar).
- `docs/medidas/sis186/` — evidência e `regra-de-veredito.mjs`.

**Premissa contradita:** em fundo chapado Δ = 0 de 14,72px a 41,76px; em vídeo, título de 30,4px Δ **4,92**. Causa: fundo variável, não letra pequena. Corte de **16px** é gatilho de relatório.

Regra: raster não condena sozinho; calculada (cobertura ≥ 0,85) é o veredito; Δ > **1,0** assina franja. Vereditos: `reprovado` / `artefato-aa` / `raster-condenaria` / `aprovado`. Pisos WCAG 4,5:1 / 3:1 intactos. Caminho `razao(comA, bg)` descartado (pior saturava em 1,00).

Regressão: `SIS-178, traço 11px: calc 7,23 · raster 4,20 → artefato-aa` (7/7 no script). Nota cruzada na SIS-176.

Portões: tsc limpo; lint 24 / 0; test:copy 1193; `regra-de-veredito.mjs` 7/7. `next build` não rodado (sem alteração em `src/`).

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `docs/medidas/COMO-MEDIR-CONTRASTE.md`
- `scripts/medir-contraste-hero-pitch.mjs`
- `scripts/medir-contraste-escritorios.mjs`
- `scripts/medir-cena-eventos.mjs`
- `docs/medidas/sis186/`

---

## SIS-185 — Escritórios BRASIL: divisas SP/PR que leem fechadas no mapa, e o violeta de `BRASIL` como decisão de token

**Status:** In Review · **Labels:** conferir · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-185/escritorios-brasil-divisas-sppr-que-leem-fechadas-no-mapa-e-o-violeta

### Pedido
Dois restos no mapa de escritórios: (1) divisas SP/PR que leem como laço — corrigir no gerador `gerar-divisas-brasil.mjs` + `DIVISAS_BRASIL`; pinos PR (347,448) e SP (422,411) sobre terra. (2) violeta `#7c3aed` em `.section-light .text-gradient-brand` — decisão de token **antes** de pintar (manter / trocar global / classe escopada); se 2 ou 3, contraste `BRASIL` ≥ 3:1. Copy-lock OK; lint/tsc/build.

### O que foi feito
**Item 1.** Causa: gerador encadeava arestas sem preservar o par de UFs; 33 polilinhas híbridas. Correção: agrupamento por par de UFs; término em bifurcações; validações topológicas. `DIVISAS_BRASIL` 65/608 → **95 polilinhas / 644 pontos**. Sonda: 0 subpaths fechados, 0 Z, 0 vértices repetidos, 0 arestas duplicadas; pinos sobre terra. PB/SP em 1440×900.

**Item 2 (após aval opção 3).** Classe escopada `.titulo-escritorios-brasil .text-gradient-brand`, última parada `#1479ec` (não `#7c3aed`). `.section-light .text-gradient-brand` intocada. `OfficesScene.tsx` acrescenta a classe no `TituloAceso`. `#0ed8f6` reprova 1,63:1; `#0079CB` apagaria o degradê. Contraste 1440×1200: BRA `#0079cb` 4,24:1; SI `#1885ce` 3,71:1; IL `#1479ec` **3,99:1** nas pontas `pr` e `sp`. Piso 3:1 (65,6px). test:copy **não** cumprido por trabalho concorrente (nenhum delta desta issue). lint 22 / 0; tsc; next build OK.

### Conferência
**ITEM 1 — VEREDITO: APROVADO** (geração por par, 95/644, 0 Z, linhas abertas, pinos, portões). Issue voltou a Todo porque o item 2 pedia decisão de marca. Item 2 implementado após aval da opção 3; **não há comentário de conferência do item 2** no Linear.

### Arquivos tocados
- `scripts/gerar-divisas-brasil.mjs`
- `src/components/ui/BrazilOfficesMap.tsx` (`DIVISAS_BRASIL`)
- `src/app/globals.css`
- `src/components/ui/OfficesScene.tsx`
- `scripts/medir-contraste-brasil-sis185.mjs`

---

## SIS-184 — /esg — rolagem lateral de 7px no celular (390) e 3px no tablet (768)

**Status:** In Review · **Labels:** conferir · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-184/esg-rolagem-lateral-de-7px-no-celular-390-e-3px-no-tablet-768

### Pedido
Achado da SIS-138: `scrollWidth − innerWidth` = **7px** em 390, **3px** em 768, **0** em ≥1024. Achar o ofensor por medição; corrigir a causa (não `overflow-x: hidden` no `body`); alvo 0 nas três larguras; conteúdo alcançável; portões.

### O que foi feito
Ofensor: `.esg-apoio::before` em `src/app/globals.css` — pluma com `inset: -24px` e `scale` animado, aumentando `scrollWidth` nos cards da coluna direita da seção Social.

Correção: `overflow-x-clip` **somente na seção Social** em `src/app/esg/page.tsx`. Sem overflow global em `html`/`body`/`main`, nem clip no card/pluma.

Medição (`document.documentElement.scrollWidth - innerWidth`): 390 antes 6–8px (fase da animação) → **0px**; 768 3px → **0px**; 1024 0 → **0px**. Foco dos 5 controles visível; modal da galeria em top layer; sem erros de console.

Portões: lint 0 erros; tsc OK; build OK; diff-check OK; test:copy bloqueado por Home/Soluções (nenhuma string ESG no delta).

### Conferência
Sem registro de conferência no Linear. O relatório de entrega declara explicitamente que **não foi realizada conferência independente**; a issue ficou em In Review com `conferir`.

### Arquivos tocados
- `src/app/esg/page.tsx`
- (`src/app/globals.css` citado como origem do ofensor; clip aplicado na page)

---

## SIS-183 — Movimento: auditar o espelho `prefers-reduced-motion` ↔ `html[data-motion="reduce"]` em toda cena que decide layout pelos dois interruptores

**Status:** In Review · **Labels:** conferir · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-183/movimento-auditar-o-espelho-prefers-reduced-motion-htmldata

### Pedido
Inventariar todas as `@media (prefers-reduced-motion` em `src/**/*.css`; classificar A/B/C; espelhar regras B/C com `html[data-motion="reduce"]` e `html:not([data-motion='reduce'])` nas positivas; sonda com botão (SO em no-preference); tabela no comentário; portões. Não alargar o reset global; não tocar em `layout.tsx`.

### O que foi feito
Ferramentas: `scripts/auditar-espelho-reduce-sis183.mjs`, `scripts/medir-espelho-reduce-sis183.mjs`.

Inventário: **54** blocos, **196** regras, **137** de layout. 114 já tinham espelho; 23 sem (9 falso positivo); **14 buracos reais**, todos corrigidos.

Buracos (entre outros): `globals.css` `.fundo-contato-laje` / `--longe` / `--perto` ganharam `html:not([data-motion='reduce'])` (animation-timeline); `.esg-apoio::before`, `.esg-selo`, `.esg-turma-foto`, `.esg-pratica-foto img` (medido: selo `matrix(0.999985…)`, fotos 3% ampliadas pelo botão); `.degrau-2/.degrau-3`; mosaico de eventos; `.evento-navegador`; `.pagehero-partida`/`.pagehero-fio`; `.solutions-convite-ponto`; `legacy.css` `.lp-partner:last-child::after` (classe C) e `.lp-partner img`; `events-spotlight.css` duas linhas no espelho existente (`filter` de hover). `partners-track` e `metrics-band-track` conferidos, não reescritos.

Sonda 1440×900, botão via `localStorage` `sistran-motion-preference` (atributo direto é removido por `layout.tsx`): `/esg` 3 divergências → **0**; demais rotas 0. Portões: lint 22 / 0; tsc limpo; build exit 0; test:copy falha baseline SIS-202 (8 perdidos / 3 novos), nada desta issue.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/app/globals.css`
- `src/components/legacy/legacy.css`
- `src/components/events-spotlight.css`
- `scripts/auditar-espelho-reduce-sis183.mjs`
- `scripts/medir-espelho-reduce-sis183.mjs`

---

## SIS-182 — Lint: trocar `matchMedia` dentro de `useEffect` por `useSyncExternalStore` nos oito componentes que ainda disparam `set-state-in-effect`

**Status:** In Review · **Labels:** conferir · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-182/lint-trocar-matchmedia-dentro-de-useeffect-por-usesyncexternalstore

### Pedido
Trocar `matchMedia` + `setState` em `useEffect` por `useSyncExternalStore` (molde de `motion.ts`); string byte a byte igual à `@media`; snapshot de servidor `false`; varredura `rg matchMedia`; lint caindo na família `set-state-in-effect`; tsc/build/copy; visual acima e abaixo de cada limiar.

### O que foi feito
`src/lib/mediaStore.ts` — fábrica `criarConsultaDeMedia(consulta)` com `useSyncExternalStore`; `matchMedia` chamado tarde (`pegarLista`); `getServerSnapshot` → `false`. Desvio declarado: molde uma vez, string literal em cada arquivo.

Dez arquivos (oito + quatro da varredura): `Solutions.tsx`, `ProofJourney.tsx`, `SolutionsStory.tsx`, `BuildingShowcase.tsx`, `Contact.tsx`, `ImpactSequence.tsx`, `ScrollSpy.tsx` `(min-width: 1280px)`, `OfficesScene.tsx` `(min-width: 1280px) and (min-height: 760px)`, `TechnologyShowcase.tsx` `(max-width: 767px)`, `ScrollCue.tsx` `(hover: hover) and (pointer: fine)`. `Metrics.tsx` não reativado (SIS-165). `RecognitionTheater` / `MosaicHandoff` / etc. deixados com motivo.

`Contact.tsx`: só a media foi ao store; `dirigindo = largo && !rm && cabe`; altura no efeito via ResizeObserver.

Lint: **24 → 22**. Saíram dois `set-state-in-effect`: `ImpactSequence.tsx:77` e `ScrollCue.tsx:43`. Premissa da issue desatualizada: os oito originais roteavam por função nomeada e escapavam do aviso. test:copy 1193. Sonda `docs/medidas/sis182/sonda-sis182.mjs` e hidratação 12/12 sem ruído.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/lib/mediaStore.ts`
- `Solutions.tsx`, `ProofJourney.tsx`, `SolutionsStory.tsx`, `Contact.tsx`, `TechnologyShowcase.tsx`
- `ui/ScrollSpy.tsx`, `ui/BuildingShowcase.tsx`, `ui/OfficesScene.tsx`
- `legacy/ImpactSequence.tsx`, `primitives/ScrollCue.tsx`
- `docs/medidas/sis182/sonda-sis182.mjs`, `docs/medidas/sis182/sonda-hidratacao.mjs`

---

## SIS-181 — Indicador lateral de seções: rótulo invisível quando a seção ativa é clara e não usa `.section-light`

**Status:** In Review · **Labels:** conferido · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-181/indicador-lateral-de-secoes-rotulo-invisivel-quando-a-secao-ativa-e

### Pedido
Rótulo do `ScrollSpy` branco sobre fundo claro (ex.: hero `#f4f8fc`, contraste ≈ 1,05:1). Detector só conhecia `.section-light`. Caminho: campo `tom` em `pageSections.ts` (margem esquerda); `onLight` = `tom === 'claro' || closest('.section-light')`; varrer rotas; contraste rótulo ativo ≥ 4,5:1, traço ativo ≥ 3:1; anel de foco; sem aplicar `.section-light`; 1440 e 1366; portões. Não resolver pintando seções com `.section-light`.

### O que foi feito
Terceiro estado `tom: 'medio'` (decisão de design após bloqueio: navy/branco não fechavam 4,5:1 em azuis intermediários, pior `rgb(22,129,201)` branco 4,19:1 / navy 3,88:1). Sem backplate.

Classificação: claro `/#top`, `/transformacao-legado#sinais`, `#roadmap`. Médio: várias seções (quem-somos, parceiros, esg, labs, university e derivadas de slug). Ausente = escuro + fallback `.section-light`.

Medições: fundos médios RGB(21,124,194) etc., tinta `#02070e`, 4,52–4,70:1. `/#top` RGB(244,248,252): ativo 15,23; hover 5,95; traço 4,28. `#sinais` ativo 16,08. `#roadmap` ativo 14,88. Escuro RGB(17,42,79): ativo 14,31; traço 8,29. Varredura raster; 1440 e 1366 nas rotas obrigatórias.

Portões: lint 24 / 0; tsc; build; test:copy 1194.

### Conferência
**VEREDITO: APROVADO.** Tons escuro/claro/médio; `tom` precede `.section-light`; observer intacto; nenhuma seção ganhou `.section-light`. Claros 13,52–16,08:1 e traço 3,80–4,52:1; médios `#02070e` 4,52–4,70:1. In Review com `conferido`.

### Arquivos tocados
- `src/data/pageSections.ts`
- `src/components/ui/ScrollSpy.tsx`

---

## SIS-180 — Seção #SomosSistraners: tirar o véu escuro atrás do texto, confinar as luzes do palco e ampliar o título

**Status:** In Review · **Labels:** conferido · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-180/secao-somossistraners-tirar-o-veu-escuro-atras-do-texto-confinar-as

### Pedido
Retirar o fundo azul escuro atrás da escrita na seção LinkedIn (véu `.palco-copy::before` da SIS-130), texto branco maior; confinar luzes; contraste parágrafo ≥ 4,5:1 e título ≥ 3:1 em 1440/1024/390 na home e em `/contato` `#timeSISTRAN`; token de título próprio; copy intacta; quatro rotas; portões.

### O que foi feito
Véu comentado; tabela SIS-130 preservada. Confinar luzes sozinho **não** fechava 4,5:1: `text-white/85` sobre `#1273bc` dá **4,08:1** com luzes apagadas. Parágrafos foram a branco cheio; em `/contato` o segundo estava `white/75` (3,52:1). Marca d'água contorno 0,20 → **0,08**. Faixa clara da emenda abaixo de 1024: pior pixel 390 `rgb(116,159,191)` 2,82:1 — faixa 130px vs respiro 11rem. Confinamento por posição ≥1024 (`left: 96%`, teto 52rem) e por intensidade abaixo. Quatro cópias do radial ciano movidas para `88%`.

Token `text-palco` em `tailwind.config.ts`: **83,2px** a 1440 vs 65,6px `section` e 92,8px hero. `/contato` não subiu de degrau.

**Contraste (pior pixel sob linhas):** home `#social` 1440 **5,28:1** rgb(26,112,175); 1024 5,22:1; 390 5,40:1. `/contato` `#timeSISTRAN` 1440 5,10:1; 1024 5,21:1; 390 **4,74:1**.

Portões: lint 24 / 0; tsc 0; next build exit 0; forced-colors CanvasText; reduce = posição de repouso medida.

### Conferência
**Aprovada.** Véu comentado, quatro radiais, máscara 150px sem colisão, isolation órfão comentado, token com os três números. Conferente mediu `#SomosSistraners` `#a5f3fc` contra rgb(26,112,175) = **4,18:1**. Pedido de correção de registro em `contato/page.tsx:366-368` (nota do véu obsoleta) — não bloqueante. Label `conferido`.

### Arquivos tocados
- `src/app/globals.css`
- `src/components/Social.tsx`
- `src/app/contato/page.tsx`
- `src/components/ui/PalcoReativo.tsx`
- `tailwind.config.ts`

---

## SIS-179 — Grade de marcas: subir para depois do hero, título centrado e maior, malha aberta com marcas de cruz e célula em destaque azul

**Status:** In Review · **Labels:** conferido · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-179/grade-de-marcas-subir-para-depois-do-hero-titulo-centrado-e-maior

### Pedido
Quatro mudanças em `BrandGrid` + `brand-grid.css`: (1) grade imediatamente após o hero; (2) título centrado e maior, `max-width: 34ch` permanece; (3) malha aberta com cruzes; (4) hover em azul da marca. Notas invertidas reescritas, não apagadas. Alinhamento em três larguras; forced-colors; indicadores de números sem regressão; portões.

### O que foi feito
Mount em `page.tsx` irmã direta de `<HeroCinematic />` (`#top + *`). Import/mount em `Metrics.tsx` comentados. `pageSections.ts` sem linha (combinado). Título `clamp(1.75rem, 3.6vw, 3.5rem)`: 51,84px @1440; folgas iguais. Malha: calha de meia célula; desvio pior **0,0169px**. Hover `rgb(0 121 203 / 8%)`, `box-shadow 0 0 0 1px var(--signal-deep)`. Emenda raster delta (1,2,3). LCP 1440 2236ms VIDEO 15,4MB. Sete indicadores 7/7 acesos. `ETAPAS_FIM_PADRAO` 0,94 intacto.

**Consertos pós-conferência:** `--malha-cruz` de `rgb(0 26 61 / 30%)` para tinta opaca `#acb7c5`; cruzamentos 2 e 4 camadas leem `172,183,197`. Nota `.impact-percurso`: razões 1 e 2 **INERTES**.

Portões: tsc 0; lint 24 / 0; build OK; test:copy 1196.

### Conferência
Primeira conferência: **conferido** com dois consertos de acabamento (tinta das cruzes; nota inertes). Após consertos: **os dois estão feitos; SIS-179 pode ir para Done.** Não movida para Done no Linear (permanece In Review com `conferido`).

### Arquivos tocados
- `src/app/page.tsx`
- `src/components/Metrics.tsx`
- `src/components/BrandGrid.tsx`
- `src/components/brand-grid.css`

---

## SIS-178 — Hero: vídeo na metade direita dissolvendo no branco, legendas na coluna esquerda

**Status:** In Review · **Labels:** conferido · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-178/hero-video-na-metade-direita-dissolvendo-no-branco-legendas-na-coluna

### Pedido
Layout do hero: vídeo na metade direita dissolvendo à esquerda; legendas escuras à esquerda. Percurso de rolagem inteiro (sticky, ScrollVideo, três legendas, HERO_SLIDES). Mobile em sangria. Contraste medido; vinheta confinada; reduce com legendas visíveis; h1 sr-only; portões. Ponto de quebra a nomear.

### O que foi feito
Ponto de quebra **1024**. `.hero-media` `width: 58%`, máscara `linear-gradient(90deg, transparent 0%, rgb(0 0 0 / 35%) 26%, #000 62%)`. Cores desktop: título `#041b3d`, sobretítulo `#0f5590`, parágrafo `rgb(4 27 61 / 88%)`. Vídeo all-intra `hero-scroll-v2.mp4`: 361 keyframes / 361 quadros, 15,4 MB, raspagem `currentTime` 3,165 → 14,971.

Defeitos achados: reduce deixava legendas em `opacity: 0` (repouso explícito); header cortava a 390 (somar `--header-h`). Dois interruptores iguais (`rmSistema1440` = `rmBotao1440`).

**Rodada 2:** fundo `#f4f8fc` em `.hero-sheet` e `#top` (não `#e2effa`, rejeitado). Contraste sobre `#f4f8fc`: título 16,01; parágrafo 10,15; sobretítulo raster 6,28 @1440 / **4,20** @1024 vs calculado 7,23 (antialiasing). Enquadramento: `quadroScale` beat 2 1,18 → 1,08; `quadroX` `+4%` → `-1.5%`. Pior folga direita **50,2px** (piso 16) em 1024.

Portões: tsc 0; lint 24 / 0; build OK; copy 1196.

### Conferência
**Aprovada**, com correção de método: 4,20 não passa o piso — é artefato de instrumento; o contraste que governa é **7,23**. Achado da emenda `#top + *` (gerou SIS-187). Corte a 390 fora de escopo. Portões conferidos.

### Arquivos tocados
- `src/components/HeroCinematic.tsx`
- `src/components/ui/HeroCaptions.tsx`
- `src/app/globals.css`
- `public/videos/hero-scroll-v2.mp4`
- `public/videos/hero-scroll-v2-poster.webp`

---

## SIS-177 — Conteúdo: aprovar o parágrafo de apoio e a marginália de “Sistran em números”

**Status:** In Review · **Labels:** conferido · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-177/conteudo-aprovar-o-paragrafo-de-apoio-e-a-marginalia-de-sistran-em

### Pedido
Issue de conteúdo: decidir, para quatro blocos da referência `numeros.png` (título, apoio, duas marginálias), aprovar / substituir / dispensar. Se aprovado, texto em `00-home.md` e `copy-lock.json` antes do TSX. O título travado era “Escala que transforma o mercado de seguros .”.

### O que foi feito
Decisão mais larga: os quatro blocos **dispensados** e o texto visível da faixa **retirado**. Só os sete números.

Retirados do lock: “Escala que transforma o mercado de seguros .” (`Metrics.tsx:1`); “Sistran em números” visível (`:0`); “ROLE PARA REVELAR” (`:2`). “Sistran em números” permanece como `aria-label` da `<section>`.

Código: sobretítulo, fio, `<h2>` e ROLE comentados em `Metrics.tsx`. `.impact-topo` `padding-block: 0`. CSS das classes permanece para religar. Nenhuma issue de montagem aberta (nada a montar).

Portões: tsc limpo; test:copy OK 1194 após regenerar lock (8 ins / 9 rem); lint **não executável** no momento (plugin `react-hooks` ausente na config) — declarado não cumprido.

### Conferência
**VEREDITO: APROVADO.** Quatro blocos dispensados; título travado retirado; `.impact-topo` altura 0 em 1440/1024/390; lint 24 / 0 na conferência; tsc; test:copy 1194. Sem issue de montagem.

### Arquivos tocados
- `src/components/Metrics.tsx`
- `src/app/globals.css`
- `.claude/conteudo-site/00-home.md`
- `copy-lock.json`

---

## SIS-176 — “Sistran em números”: fundo de imagem, divisórias e trilho de sete pontos que acende na rolagem

**Status:** In Review · **Labels:** conferido · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-176/sistran-em-numeros-fundo-de-imagem-divisorias-e-trilho-de-sete-pontos

### Pedido
Alinhar `#resultados` a `numeros.png` no desenho: arte `atrasnumeros` no lugar do navy chapado; divisórias sem fio na primeira célula dos quatro layouts; trilho de sete nós ligado a `acesos`; ordinais fora; remedir rótulo apagado ≥ 4,5:1; notas; emenda de rodapé após SIS-179; portões. Texto novo é da SIS-177.

### O que foi feito
**Rodada 1.** Fundo via `next/image` (`fill`, `sizes="100vw"`, sem `priority`); WebP **38.484 bytes**; PNG preservado; fallback `#041b3d`. Divisórias: 390 `0/0/0/0/0/0/0`; 800 `0/1/0/1/0/1/0`; 1024 `0/1/1/1/0/1/1`; 1440 `0/1/1/1/1/1/1`. Trilho em `acesos`; ordinais comentados. Rótulo apagado 0,56; cálculo **4,51:1** @1440 sobre `rgb(2,61,99)`; **4,65:1** @1024; **4,61:1** @390. Sobretítulo 11,49 / 10,96 / 5,83:1; ROLE 8,63 / 7,85 / 6,84:1. `ETAPAS_FIM_PADRAO` 0,94.

**Rodada 2 (provas).** Alinhamento X título/célula: 390 `20/20/20`; 1440 `162/162/32` (containers, não padding). Emenda 260px: médias RGB contínuas `(0,62,114)` → `(1,36,79)`. Emenda inferior: `rgb(254,254,254)` gap 0; véu até `(0,1,3)` aos 220px.

Portões: lint 24 / 0; tsc; build; copy 1196.

### Conferência
Rodada 1: **VEREDITO: REPROVADO** (faltavam provas de alinhamento e emendas). Rodada 2: **VEREDITO: APROVADO**. Nota cruzada SIS-186 apontando `COMO-MEDIR-CONTRASTE.md` §7.

### Arquivos tocados
- `src/components/Metrics.tsx`
- `src/app/globals.css`
- `src/components/legacy/legacy.css`
- `public/imagens/atrasnumeros.webp`

---

## SIS-175 — copy-lock: o extrator trava `as React.CSSProperties` como se fosse cópia do site

**Status:** In Review · **Labels:** conferir · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-175/copy-lock-o-extrator-trava-as-reactcssproperties-como-se-fosse-copia

### Pedido
`pareceCodigo()` deve descartar casts TypeScript (não exceção nomeada). Acrescentado na conferência da SIS-173: doze entradas técnicas (hex maiúsculo, token único, membro com três segmentos). Autotestes; nenhum texto publicado sai; test:copy OK.

### O que foi feito
Regras gerais em `scripts/copy-lock.mjs`: casts (`as React.CSSProperties`, `as CSSProperties`, `as HTMLElement`, `as const`); Tailwind com hex maiúsculo; utilitário único (`max-w-[22ch]`, `!text-white`); membro qualificado (`labels.text.fill`, `m.RoadmapStopDialog`). Autotestes 21 → **41**, com contraexemplos (`as Sistran`).

Lock: 1678 / 1201 distintos → 1635 / **1184**; 43 registros / 17 valores removidos, todos técnicos; casts 25 → **0**. test:copy ainda exit 1 só pelas 7 perdas / 3 entradas concorrentes Home/Parceiros.

Portões: test:extrator 41; lint 22 / 0; tsc; build 27 páginas; diff-check OK.

### Conferência
Sem registro de conferência no Linear. Entrega declara **não conferência independente**; In Review com `conferir`.

### Arquivos tocados
- `scripts/copy-lock.mjs`
- `copy-lock.json`

---

## SIS-174 — Piso de tamanho de texto: subir os 30 pontos abaixo de 11px, e reescrever o documento de tipografia que caducou

**Status:** In Review · **Labels:** conferir · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-174/piso-de-tamanho-de-texto-subir-os-30-pontos-abaixo-de-11px-e

### Pedido
Piso 12px corrido / 11px label caixa-alta com tracking. Só sobe o que está abaixo. Reescrever `docs/fontes/tipografia.md` para o estado real (após SIS-155: Geist). Não mexer em família. Exceção `.bm-rotulo .bm-coord`. 16 pontos fora de rota intocados. Portões.

### O que foi feito
19 aumentos em `globals.css` por seletor (valor antigo conferido antes de gravar). 12 labels → `0.6875rem`; `.evento-selo` 10px → 11px; 5 corridos → `0.75rem`; botão filtros 11px → 12px. Zero tracking/weight/family; sem conversão px↔rem.

SIS-176 comentou `.impact-indice` dirigido: linha caiu, regra ficou `0.66rem` com nota. `.bm-rotulo .bm-coord` em **7px** / 9px (SVG). `UnitsMap` voltou à rota (SIS-168): `text-[10px]` → `text-xs`. `PartnersTrail` `0.66rem` → `11px`. `PartnersTrack` saiu da rota (SIS-201): quatro `text-[10px]` da tabela intocados.

`docs/fontes/tipografia.md` reescrito (Geist Sans/Mono; histórico 08/09 e 09/09). Linha de filtros: **imensurável** — `.evento-filtros` ausente (SIS-166). test:copy vermelho por concorrência; lock não atualizado.

Portões: tsc limpo; build exit 0; lint **22 / 0**.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/app/globals.css`
- `src/components/UnitsMap.tsx`
- `src/components/PartnersTrail.tsx`
- `docs/fontes/tipografia.md`
- `scripts/medir-linha-filtros-sis174.mjs`

---

## SIS-173 — copy-lock — o filtro pareceCodigo() descarta texto publicado de verdade; cinco frases estão fora da tranca

**Status:** In Review · **Labels:** conferido · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-173/copy-lock-o-filtro-parececodigo-descarta-texto-publicado-de-verdade

### Pedido
Apertar `;` e a regra de tokens Tailwind em `pareceCodigo()` para trancar cinco frases publicadas; autoteste nos dois sentidos; contagem antes/depois; nenhum token técnico novo; build/lint.

### O que foi feito
`;` entre letras + espaço + minúscula vira pontuação. Cadeia de classes exige token utilitário real. Cinco frases trancadas: `legacy.ts:567` (`;`); `acceleratorPages.ts:197`; `esg/page.tsx:116`; `contato/page.tsx:57`; `sistran-university/page.tsx:59`. Cada uma, apagada em memória, faz `test:copy` falhar.

Autoteste 11 → **21**. Lock **1649 → 1654** entradas, **1180 → 1196** distintos; 30 entraram (cópia), 14 saíram (código). Tentativas `+`/`-` espaçados e `:` final descartadas (28 textos reais).

Portões: extrator 21; copy 1196; lint 24 / 0; tsc; build.

### Conferência
**Aprovada.** Conferente: chaves reais **1655** (não 1654); frase sobre `NOMES_TECNICOS` falsa — vai para SIS-175 com 12 entradas técnicas. Critério “entrou” cumprido. Label `conferido`.

### Arquivos tocados
- `scripts/copy-lock.mjs`
- `copy-lock.json`

---

## SIS-172 — /relatorio-de-transparencia-salarial — o Portal Emprega Brasil é citado no texto e não é link

**Status:** In Review · **Labels:** conferido · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-172/relatorio-de-transparencia-salarial-o-portal-emprega-brasil-e-citado

### Pedido
“Portal Emprega Brasil” vira link com URL verificada no ar; `target`/`rel`; contraste ≥ 4,5:1; decisão Lei/Decreto escrita; texto intacto (ano 2023); 390/768/1440; portões.

### O que foi feito
Arquivo `src/app/relatorio-de-transparencia-salarial/page.tsx`. Destinos: `empregabrasil.mte.gov.br` TLS falha; gov.br 404; **`https://servicos.mte.gov.br/empregador/` 200**, h1 “Portal Emprega Brasil”.

Contraste (raster, `.glass-card` escuro, `text-white/85`): 390 **5,73:1**; 768 **5,61:1**; 1440 **5,53:1**. Lei e Decreto em texto (motivo no arquivo). `identico: true`. copy-lock regenerado por quebra de nó (1195 → 1196).

Portões: lint 24 / 0; tsc; build; test:copy OK.

### Conferência
**APROVADA.** curl confirma 200 / TLS 000 / 404. Premissa de fundo claro da issue estava errada; medição raster correta. Achado `as React.CSSProperties` no copy-lock gerou SIS-175. Label `conferido`.

### Arquivos tocados
- `src/app/relatorio-de-transparencia-salarial/page.tsx`
- `copy-lock.json`

---

## SIS-171 — copy-lock — o extrator confunde comentário de código com texto do site, e o portão parou de valer

**Status:** In Review · **Labels:** conferido · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-171/copy-lock-o-extrator-confunde-comentario-de-codigo-com-texto-do-site-e

### Pedido
Extrator deve descartar comentários e extrair por posição (dados, JSX, props de texto). `--check` verde na árvore limpa e vermelho se palavra de página muda. Cabeçalho reescrito. Lock regravado. Frases partidas por `{' '}` entram inteiras.

### O que foi feito
`tiraComentarios` com scanner de estado (`//` em string/regex). Posições: nó JSX, array, propriedade, ternário, atribuição, return; fora: argumentos de chamada e import. Costura `{' '}` / `<br>` / tags inline. Entidades `&ldquo;` resolvidas.

`test:extrator` 11 casos. `--conferir-perdas`: 52 não alcançados, todos técnicos. Lock 2108 → **1649** entradas; copy **1180** distintos. Demonstração: alterar “Ver oportunidades no LinkedIn” falha o portão.

Portões: lint 24 / 0; tsc 0; next build; test:copy 1180; extrator 11.

### Conferência
**Aprovada.** Perdas técnicas conferidas; cobertura no navegador. Achado: cinco frases fora da tranca (`;` e tokens) — vira SIS-173, não devolve. Label `conferido`.

### Arquivos tocados
- `scripts/copy-lock.mjs`
- `copy-lock.json`
- `package.json` (`test:extrator`)

---

## SIS-170 — ScrollSpy — a coluna lateral fixa cobre o texto do hero entre 1280 e 1440px

**Status:** In Review · **Labels:** conferido · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-170/scrollspy-a-coluna-lateral-fixa-cobre-o-texto-do-hero-entre-1280-e

### Pedido
`ScrollSpy` `fixed` cobre texto entre 1280 e ~1424 (depois corrigido para 1440). Decisão: recolher para traços (saída 2), não esconder. Aceite: 1280, 1366, 1423, 1439 sem sobreposição; 1440 igual a hoje; container centrado; teclado/leitor; um lugar só para limiares; portões.

### O que foi feito
Rótulo `position: absolute; left: 100%` fora de `@layer` (`globals.css`); classe `scrollspy-rotulo`. Limiar **1440** (`max-width: 1439.98px`): caixa de `/quem-somos` 150px → borda 162. Após recolhimento, borda do nav ≈36px; invasão negativa (folga) nas oito larguras.

**Rodada 2 (devolução):** o ativo era `opacity-100` sempre. Acrescentado `.scrollspy-rotulo { opacity: 0 }` no mesmo media, retorno em `a:hover >` e `a:focus-visible >`. 371 amostras, 0 colisões. Nav 24px em repouso e hover. `pageSections.ts` aviso junto de `sectionsForPath`.

Segunda conferência: 766 amostras, 0 colisões; ativo `opacity: 0` vence `opacity-100` da marcação. Sugestão não bloqueante: limiar de tinta **1475**.

Portões: tsc; lint 24 / 0; next build 27 páginas; test:copy 1180.

### Conferência
Rodada 1: **devolvida** — rótulo ativo ainda visível em repouso. Rodada 2: **aprovada**. Label `conferido`. In Review.

### Arquivos tocados
- `src/app/globals.css`
- `src/components/ui/ScrollSpy.tsx`
- `src/data/pageSections.ts`

---

## SIS-169 — Quem somos · Escritórios BRASIL: a rolagem volta a dirigir — transição de Pato Branco para São Paulo entre as duas referências

**Status:** In Review · **Labels:** conferido · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-169/quem-somos-escritorios-brasil-a-rolagem-volta-a-dirigir-transicao-de

### Pedido
Na seção Escritórios BRASIL de `/quem-somos`, os dois estados deixam de ser só destinos de aba e passam a ser percurso de rolagem: a cena entra como `mapaescritorio.png` (Pato Branco) e, ao rolar, transiciona até `mapasescritorio1.png` (São Paulo, render da torre no lugar do 3D). É só a transição; depende da SIS-161 (estado PB) e da SIS-163 (estado SP). Reverte a decisão da SIS-161 de que a aba é dona do estado e a rolagem não opina. Critérios: trânsito reversível; um escritor de `ativa`; `position: sticky` sem `pin: true`; trilha e sticky na mesma caixa; grade/`width`/`left` não animados; contraste em cinco frações incluindo `BRASIL`; comprimento do percurso com conta por trecho; as duas cidades alcançáveis com movimento reduzido e abaixo de 1024; `npm run build` e `npm run lint` limpos.

### O que foi feito
**Percurso e conta (item 11).** `PERCURSO_SVH = 300`, em três trechos: pouso em Pato Branco 0 → 0,25; trânsito esfregado 0,25 → 0,75; pouso em São Paulo 0,75 → 1. Constantes derivadas em `OfficesScene.tsx` (`TRANSITO_INICIO`, `TRANSITO_FIM`, `TROCA = 0,5`, `POUSO = 0,125 / 0,875`).

**Dono do estado (item 3):** opção (a) — a rolagem, sozinha. `ativa` tem um escritor: o `onUpdate` do gatilho. A aba voltou a ser atalho (o clique leva a janela até a fração da cidade). Quem clica é transportado de novo; o cartão não troca no lugar.

**Sticky (item 4).** Sem `pin: true`. `.os-inner` cola em `top: 0` dentro de `.os-trilha`; o `end` do gatilho é `trilha.offsetHeight - inner.offsetHeight`. A folga do cabeçalho virou padding do palco para `top` poder ser zero (armadilha da SIS-156).

**Dois eixos de tempo (item 5).** Entrada continua `once` (montagem do mapa). Trânsito é esfregado e reversível. `data-ativa` e `data-revelado` não colapsaram: `revelado` vem da entrada e `ativa` do trânsito.

**Grade não animada (item 2).** Nada de `grid-template-columns`, `width` ou `left`. Medido no build de produção, 90 passos: mediana 71,1 ms no percurso vs 66,0 ms no controle; `LayoutDuration` 0,24 ms no total contra 7,67 ms de recálculo de estilo.

**Contraste em cinco frações (itens 8 e 9), 1440×900, pior pixel:** `BRASIL` 3,99:1 (piso 3,0); olho 6,66:1; aba acesa 4,59:1; aba apagada 10,40:1; nome da cidade 14,19:1; texto da ficha 12,51:1; balão 15,19:1. Máscara `44%/62%` do `.os-fundo` continua servindo. Gradiente de `BRASIL` com stop roxo `#7c3aed` anotado como fora de escopo.

**Torre (item 10).** WebP em duas larguras da SIS-163. Fica no DOM e some por `opacity` (nunca `display`); `inert`/`aria-hidden` para leitor de tela.

**Defeitos medidos e corrigidos.** (1) Cartão passava 80px além da borda interna a 1800: sistemas de coordenadas misturados (`offsetLeft` vs caixa errada). Corrigido com `getBoundingClientRect().right` de `.os-baixo`. Depois: 1024 → 489,61px, 1366 → 797,40px, 1440 → 864px, 1800 → 1208px. (2) Percurso escondia o mapa: recuo da câmera insuficiente e medida em `.bm-mapa` em vez de `.bm-pais`. Com `-34%`, faixa livre vs país desenhado anotados em 1280/1366/1440/1800. `--os-foco-escala` de SP de 1,22 para 1. Coluna de leitura cortada pelo `overflow: clip` corrigida (`min-height: 760px`, fotos em `svh`, três fotos em uma fileira no modo scroll). Balão em 3,20:1 no meio do trânsito: entrada confinada à cauda `clamp(0, (transito − 0,7) / 0,3, 1)`.

**Piso de largura do percurso:** 1024 → 1280px + `min-height: 760px`. De 1024 a 1279, janela baixa e `prefers-reduced-motion`: modo lista completo. Espelhos `@media` e `html[data-motion="reduce"]`.

**Item 7 — inversão do país não feita:** `DIVISAS_BRASIL` são 65 polilinhas abertas; sem caminhos fechados de SP/PR no `viewBox="0 0 720 640"`. País recua enquanto o cartão de SP chega.

**Composição: duas faixas, não três.** Faixa livre (`cartão.left − fachada.right`): 328 · 328 · 406 · 472 · 816 · 1576px nas seis larguras. `mapasescritorio1.png` não seguida ao pé da letra: mapa não é terceira coluna de grade; arte diz 8º andar, dado confirmado é 2º.

**Feixe pino→torre (segunda volta, após devolução).** Quando SP pousa, o pino cai entre fachada e cartão. Folga `cartão.left − pino.centro`: 90 / 81 / 120 / 180 / 343 / 723px. Primeira versão acendia numa rampa 0,92→1 e media na entrada: feixe 12,9px adiante do núcleo (`--os-desliza = transito * -34%` ainda movia o pino). Correção: limiar `transito = 1` (saída 0,995, histerese), atributo `data-pousado="sp"`, `opacity` 0,35s. `setTimeout` 1200ms remede; `onRefresh` zera (`feixeMedidoRef`). `.os-feixe` desligado por padrão, ligado só em `[data-modo="scroll"][data-pousado="sp"]`, desligado em janela estreita e `html[data-motion="reduce"]`. Sonda passo 0,02, 1400ms de assentamento: `erroNoPino = 0` e `cruzaCartao = false` em toda amostra.

**Portões (entrega + feixe):** `npx tsc --noEmit` limpo; `npm run lint` = `eslint .` → 24 avisos / 0 erros; `npm run test:copy` OK (1195 textos); `npm run build` Compiled successfully.

### Conferência
Primeira volta **DEVOLVIDA** pelo feixe pino→torre, que a SIS-163 transferiu e esta não mencionava; resto aprovado (percurso, dono do estado, sticky, eixos de tempo, grade, contraste, torre, modo lista). Pediu ratificar duas faixas na descrição da issue. Segunda volta **APROVADA**: feixe gateado certo, tabela aritmética fecha nas seis larguras, rampa trocada por `data-pousado` discreto; `feixeMedidoRef.current = false` no `onRefresh` e `clearTimeout` na limpeza. `conferir` → `conferido`. Pendência de produto: desvio das duas faixas ainda no `DECISOES-PENDENTES.md`. Verificação que não bloqueia: ponta esquerda do fio ancorada em `left: 100%` da caixa da torre, não medida contra a fachada pintada.

### Arquivos tocados
- `src/components/ui/OfficesScene.tsx`
- `src/app/globals.css`
- `src/app/quem-somos/page.tsx`

---

## SIS-168 — Contato · Onde Estamos: o mapa deixa de ser cartão e passa a ser o fundo da seção, com título e painel por cima

**Status:** In Review · **Labels:** conferido · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-168/contato-onde-estamos-o-mapa-deixa-de-ser-cartao-e-passa-a-ser-o-fundo

### Pedido
Na seção `#sistran` / Onde Estamos de `/contato`, o mapa deixa de ser cartão escuro arredondado dentro de `container-lp` e passa a ser a superfície da seção: sangra de borda a borda; pílula, título, três seletores e endereço ficam por cima, à esquerda, com navy dissolvendo para a direita. Reverte duas decisões da SIS-129 (não sangrar; pílula e título fora do cartão) — os comentários têm de ser reescritos. Critérios: emenda com `#timeSISTRAN` decidida; destino de `section-light`; rampa do véu refeita; máscara vertical em rem; contraste medido com branco forçado e painel oculto; `min-height` justificado; mosaico `COLUNAS`/`LINHAS` recalculados; atribuição visível; zoom e `cooperativeGestures` intactos; estreito decidido; `npm run build` e `npm run lint` limpos.

### O que foi feito
Números de linha da issue vencidos: bloco citado como `globals.css:6474-6755` estava em **6843-7124**. Trabalho por seletor.

**Saiu (comentado no lugar):** `section-light section-light-blue`, `section-py`, `container-lp`, `border-radius: 1.5rem` + `border: 1px solid rgb(255 255 255 / 12%)`, `max-width: 42%` do `.mapa-painel` (a 2560 pedia 1090px e 42% davam 1075px), `on-dark` + `mt-10`, `palco-emenda-de-claro-curta` (quem toca `#timeSISTRAN` agora é navy). `overflow: hidden` ficou para os 3072×1536px de tiles não empurrarem scroll; `scrollWidth === innerWidth` nas sete larguras.

**Eixo `--mapa-eixo`:** `max(2rem, calc((100% - 73.75rem) / 2 + 2rem))` — 1180px = 73,75rem, `lg:px-8` = 2rem, piso 32px. Cabeçalho em x=402 a 1920 e x=722 a 2560.

**Rampa horizontal:** de `%` para rem. Opaco até `eixo + 24rem`, dissolvendo em 7rem (112px da SIS-135). Quatro paradas preservadas.

**Máscara vertical:** banda 30rem → **38rem** (`50%±19rem` opaca + 4rem de rampa). Painel cresceu com pílula e título.

**Contraste** (branco forçado, painel não pintado, `nav.fixed` escondido — senão 1,00:1 no texto do nav): pior pixel sob o painel **17,11:1** (390/768) e **17,46:1** (1024–2560). Banda opaca real y=88 a y=696 (609px vs 608px de projeto). Atribuição OSM **8,68 a 9,73:1**. Pino a 1024 na cauda (~18% de véu, 208/255); custo real **5/255** — rampa não encurtada.

**Estreito:** paradas em rem preservadoras a 390 (26% = 173px, 38% = 253px ≈ 16rem do `padding-top`).

**Mosaico:** 8×6 → **12×6**. `(12/2−1)×256 = 1280` cobre janela até 2560px; `(6/2−1)×256 = 512` cobre 784px. **72 tiles por unidade** (era 48). `min-height: 34rem` estreito / **49rem** em `@media (min-width: 64rem)`. Zoom `top-right` e `cooperativeGestures` / `gestureHandling: 'cooperative'` intactos. `.mapa-cartao-mapa` sem `z-index`.

**Captura do degrau 3 (após devolução).** Folgas positivas nas quatro bordas: 390 (quadro 390×782,8, mosaico 3072×1536); 1440 (1440×784); 2560 (2560×784, dir **+71,1px**). 72/72 tiles carregadas. Receita: regex `/openfreemap/` (glob `**/openfreemap**` não casa `tiles.openfreemap.org`); rolagem via `window.__lenis.scrollTo`, não `scrollIntoView`. Limite 2560 dito, não coberto. Densidade de POI estilo Google não entrou (item herdado da SIS-162). Altura em rem/`svh`, não `100vh`.

**Portões:** `npm run lint` 24/0; `npx tsc --noEmit` silencioso; `npm run build` 14 rotas estáticas + `/solucoes/[slug]` SSG; `npm run test:copy` OK (1195).

### Conferência
Devolvida por **um** ponto: mosaico não capturado com vetorial abortado. Restante conferido no código (sangramento, fronteiras, emenda `#timeSISTRAN`, `on-dark`, rampa, banda, 12×6, atribuição, zoom, gestos, comentários). Conferente mediu o item 12: **APROVADA**; `conferido` aplicado. Correção posterior da receita de sonda (glob vs regex; Lenis) registrada na própria issue e na SIS-169.

### Arquivos tocados
- `src/app/contato/page.tsx`
- `src/components/UnitsMap.tsx`
- `src/app/globals.css`

---

## SIS-167 — Eventos: espalhar as miniaturas com flutuação (como /transformacao-legado) e aumentar a arte do cartão

**Status:** In Review · **Labels:** conferido · **Fechada em:** — · **Responsável:** —
**Link:** https://linear.app/sistran-labs/issue/SIS-167/eventos-espalhar-as-miniaturas-com-flutuacao-como-transformacao-legado

### Pedido
Três ajustes na cena de destaque de `/eventos-inovacao` (SIS-166): espalhar as miniaturas (hoje duas colunas coladas com `gap: 0.4rem`); fazê-las flutuar no modelo de `/transformacao-legado` (`.mosaic-float`, um `@keyframes` de três paradas); aumentar a arte do cartão central. Critérios: divisão do palco escrita antes do CSS; um keyframes; duas profundidades; sonda `scripts/medir-cena-eventos.mjs` de novo incluindo amplitude de `--float-x`; nada cortado por `overflow: clip`; fio e vaga em destaque definidos; rótulo sem transbordo; palco `100svh`; `prefers-reduced-motion` para flutuação; Performance; lista abaixo de 1024; lint/build. Divergência declarada depois: `top` revertido para `space-between`.

### O que foi feito
**Divisão do palco (item 1), medida em 1440×900 antes do CSS.** Coluna antiga 122→217; cartão 38vw = 547px em 446→993; **229px de vazio morto de cada lado**. Miniaturas espalham em faixa `clamp(7rem, 10vw, 12rem)` (era `clamp(5.5rem, 6.6vw, 8rem)`), vaga `clamp(4.5rem, 6vw, 7rem)`. Arte: `min(38vw, 36rem)` → `min(42vw, 38rem)`: cartão 547→605px, arte ~292→~347px (+19% linear, +42% de área). Depois, em 1440: faixa 122→266, cartão 417→1022, folga 151px; em 1024: folga 65px.

**Fio (item 5).** Nunca encostou no cartão: toco `clamp(2rem, 5vw, 5.5rem)` com nó, `left: 100%`. Fica como está.

**Vaga em destaque (item 6).** Não flutua; as catorze flutuam.

**Colisão (item 3).** Amplitude própria menor que o mosaico: `--evt-float-x: 9px`, `--evt-float-rot: 2deg`, `--evt-float-y` zerado depois (folga vertical ~1,6px em 1366). Recuo mínimo do `nth-child` **4%**.

**Profundidade (divergência declarada).** Sem `useScroll`/`slow`/`fast` da origem (um só IntersectionObserver; palco sticky em `overflow: clip`). Duas camadas `--evt-camada--perto` / `--evt-camada--longe` (0,86 / 1,06; 9,5s / 7s; 6px / 9px de X).

**Sonda 21/21 verdes** em 1670×940, 1440×900, 1366×768, 1280×800, 1024×768, mais 390 e reduced-motion. Contraste pior pixel: título 16,39:1, descrição 11,60:1, placa 11,57:1.

**Três defeitos achados pela sonda.** (1) `top: %` cobria vagas em 1366; quinze `top` comentados; vertical por `space-between`. (2) Altura do destaque ≠ botão com `flex: 1 1 0`; agora `flex: 0 0 var(--evt-vaga-h)`; placa do destaque em uma linha. (3) Item 10: Next 16 apaga `display: -webkit-box` quando `line-clamp` padrão está presente; teto `max-height` em linhas inteiras + `flex-shrink: 0` na placa.

**Performance (item 8), 1440×900, 4s:** com flutuação médio ~22–24 ms; sem ~21 ms; p95 33,4 ms nos dois. Custo ~2 ms/quadro; Chromium headless sem GPU.

**Um `@keyframes eventos-flutua`**, três paradas, paradas 2 e 3 por `calc()`. Espelho `html[data-motion="reduce"]`. Palco `100svh`. Comentário de `EventsSpotlight.tsx` reescrito (item 4).

**Portões:** `npx tsc --noEmit` limpo; `npx eslint src` 18/0 (relato); conferente: `npm run lint` **25 avisos / 0 erros**; `npx next build` exit 0.

### Conferência
**APROVADO.** Portões e sonda 21/21 reproduzidos. Correção factual: com `space-between` as faixas **não** distribuem no mesmo passo (8 vagas vs 7). Desvio de `top` tinha de aparecer na issue (entrou na nota de divergência). Follow-up: `padding-block` assimétrico na faixa direita. `conferido` aplicado.

### Arquivos tocados
- `src/components/EventsSpotlight.tsx`
- `src/components/events-spotlight.css`
- `scripts/medir-cena-eventos.mjs`

---

## SIS-166 — /eventos-inovacao — cena única de destaque: cartão central que troca com a rolagem + duas colunas de miniaturas (substitui mosaico e palco)

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** —
**Link:** https://linear.app/sistran-labs/issue/SIS-166/eventos-inovacao-cena-unica-de-destaque-cartao-central-que-troca-com-a

### Pedido
Cena nova (não ajuste do `EventsMosaic`): sobretítulo EVENTOS, título Eventos & Inovação, cartão central (chip, title, description verbatim de `events.ts`, botão YouTube, arte), duas colunas de miniaturas, vaga do destaque vazia, fios ciano, contador `01 / 15`, rolagem troca o destaque. Quinze eventos, sem logos de patrocinador, botão para o canal. Substitui `<EventsMosaic />` e `<EventsGrid />` (comentados). Sem `aria-hidden` no conteúdo; mobile com lista; clique nas miniaturas para reduced-motion. Sem filtro nesta issue. Contraste pelo método de `docs/medidas/COMO-MEDIR-CONTRASTE.md`. Miniaturas usam `thumb`, não `image`.

### O que foi feito
Arquivos novos `EventsSpotlight.tsx` e `events-spotlight.css`; troca dos dois blocos em `eventos-inovacao/page.tsx`. Componentes antigos, CSS no `globals.css` e `events.ts` intactos. SIS-160 citada no comentário de saída, não reaberta.

**Mecânica.** Quinze sentinelas; `IntersectionObserver` com `rootMargin: -50% 0 -50%`, `threshold: 0`. Palco `position: sticky`, sem `pin: true`. Trilha `margin-top: -100svh` + `padding-bottom: 60svh`: sticky e trilha são a mesma caixa. Altura = soma das sentinelas (`EVENTS.length`).

**Sonda** `scripts/medir-cena-eventos.mjs`. **1440×900:** seção 8100px; 15º em y=7275 com `palcoTopo: 0`. Contraste: título 16,39:1, descrição 11,60:1, rótulo 10,67:1. **1366×768:** seção 6912px; 15º em y=6205. **390:** cena `display: none`, lista com quinze itens.

**Folga ScrollSpy.** Primeira versão `clamp(5.5rem, 7vw, 9rem)` = x=100 vs caixa do ScrollSpy em x=103 (3px dentro). Subiu para `clamp(7.5rem, 8.5vw, 10rem)` = 120px, ~17px de folga.

**Acessibilidade.** Nada `aria-hidden` além das sentinelas vazias. Cartão `aria-live="polite"` + `aria-atomic`. Miniaturas `<button>`. Mobile: lista empilhada, `display: none` na versão escondida. Pulo com `window.scrollTo` (não `scrollIntoView`), `behavior: 'auto'` se reduced-motion. Botão YouTube: `YOUTUBE_URL` de `contact.ts`, constante única; `<a>` com `rel="noopener noreferrer"`.

**Layout.** Pares à esquerda (8), ímpares à direita (7), por índice do catálogo. Fio em CSS a partir da vaga. Superfície navy; `hero → eventos` por linha; `eventos → social` fecha em `#041d37`. Filtros saíram com o `EventsGrid`.

**Adendos de conferência aplicados:** comentários contraditórios de folga fundidos; `aria-current` deixou de ser prometido (vaga em destaque é `<div>`).

**Portões:** `npx tsc --noEmit` silencioso; eslint src 18/0; `npx next build` 0; rota 200.

### Conferência
**Aprovado**, com três adendos de comentário (folga 5,5rem falsa no CSS e no TSX; `aria-current` prometido e inexistente) — aplicados na mesma passada. SIS-131 (YouTube clicável) morre aqui. Custo de conteúdo: quinze botões para o mesmo canal. Label `conferir` retirada; segue In Review. Sem label `conferido` na issue.

### Arquivos tocados
- `src/components/EventsSpotlight.tsx`
- `src/components/events-spotlight.css`
- `src/app/eventos-inovacao/page.tsx`
- `scripts/medir-cena-eventos.mjs`

---

## SIS-163 — /quem-somos — trecho de São Paulo de "Escritórios BRASIL": trocar o explorador 3D pelo render da torre e seguir mapasescritorio1.png

**Status:** In Review · **Labels:** conferido · **Fechada em:** — · **Responsável:** —
**Link:** https://linear.app/sistran-labs/issue/SIS-163/quem-somos-trecho-de-sao-paulo-de-escritorios-brasil-trocar-o

### Pedido
Trecho de São Paulo igual a `mapasescritorio1.png`; explorador 3D WebGL sai, comentado, no lugar do render `substituiçãodo3d.png`. Composição: abas, torre com base/anel, balão do andar, mapa claro com SP aceso, legenda com `·`, feixe, cartão à direita. Critérios: `three` fora do bundle da rota; WebP duas larguras, nome ASCII fora de `imagensexemplo/`; rótulo 360° só se o arraste existir; andar confirmado; texto de `aSistran.ts`; SP aceso via divisas da SIS-161; feixe `aria-hidden`; alt na torre estática; build e lint.

### O que foi feito
**Asset.** `scripts/preparar-render-torre.mjs`: PNG com xadrez pintado (`channels: 3, hasAlpha: false`); alfa por flood fill da borda. Saída: `public/images/escritorios/torre-sp-720.webp` 720×725, 97 kB; `torre-sp-1200.webp` 1200×1209, 178 kB (conferente: 99.128 B e 182.238 B).

**Torre.** `TorreSaoPaulo()` em `OfficesScene.tsx`, no painel de SP, antes do `<h3>`. `<img>` com `srcSet`/`sizes` à mão, `loading="lazy"`, alt do prédio.

**Decisões:** render estático, sem `ARRASTE PARA GIRAR 360°`. Andar **2º** (referência 8º errada), comentado. Texto em `aSistran.ts` com “inovação” e “São Paulo”; `copy-lock.json` atualizado junto.

**`three`:** `grep WebGLRenderer .next/static/chunks` → 0 chunks. `BuildingExplorer`/`BuildingShowcase` intactos sem consumidor.

**Defeitos.** Balão vazio: `.section-light p` (0,1,1) vencia a classe; reescopado `.os-torre .os-torre-balao`. Cartão de PB inflou 354px: `align-self: start` nos dois `grid-area: 1/1`.

**Não entregues nesta issue.** Estado de SP aceso: polilinhas abertas. Feixe e cartão à direita transferidos para a SIS-169 (layout de 2 colunas atravessaria o texto).

**Portões:** tsc limpo; eslint src 18/0; next build 0; curl `/quem-somos` 200. Conferente: lint 24/0.

### Conferência
**APROVADA**, com feixe órfão cobrado na SIS-169 (depois entregue lá). Asset de SP aceso não reprova. `conferido` aplicado.

### Arquivos tocados
- `scripts/preparar-render-torre.mjs`
- `src/components/ui/OfficesScene.tsx`
- `src/app/globals.css`
- `src/data/aSistran.ts`
- `copy-lock.json`
- `src/app/quem-somos/page.tsx`
- `public/images/escritorios/torre-sp-720.webp`
- `public/images/escritorios/torre-sp-1200.webp`

---

## SIS-160 — /eventos-inovacao — trazer a estrutura de mosaico da apresentação de Transformação de Legado para as imagens dos eventos

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** —
**Link:** https://linear.app/sistran-labs/issue/SIS-160/eventos-inovacao-trazer-a-estrutura-de-mosaico-da-apresentacao-de

### Pedido
Trazer o mosaico de Transformação de Legado (`StackScenes`, `.mosaic`) para os quinze eventos: três camadas (tile/float/face), parallax slow/fast, `perspective()` local, `overflow: clip`. Decidir se substitui o palco ou abre antes. Cartões usam `thumb` (240px), nunca `image`. Filtros sem rearranjo por `:nth-child`. Contraste AA. Palco e classes `.evento-*` comentados se saírem. Depois o usuário pediu título sticky “Eventos & Inovação”, fundo claro e legenda por cartão.

### O que foi feito
**Abertura, palco intacto.** `EventsMosaic.tsx` entre `HeroVideoBackdrop` e `<EventsGrid />`. CSS em bloco novo do `globals.css`. Nenhuma linha de `EventsGrid.tsx` mudou.

**Decisões:** (a) mosaico antes do palco; (b) filtros só no palco — posição por índice do catálogo, quinze pares `[x, y]`; (c) face 16:9 com `thumb`; (d) quinze cartões; (e) fundo inicialmente navy, depois revertido para claro com degradê navy nas pontas.

**Três camadas:** `.eventos-mosaico-tile` / `-flutua` / `-face`. `perspective(900px)` local. `overflow: clip`. `aria-hidden` no cartão. `thumb`: 164 KB vs 2508 KB de `image`. Medido 1024–1920: 15 cartões, 0 cortados nas bordas, palco sticky. `min-height: 108svh`. Mobile `display: none` abaixo de `lg`.

**Primeira conferência DEVOLVIDA:** flutuação de dois tempos/um eixo; sem tilt de repouso; sombra estática; hover sem pausa. Segunda entrega: `@keyframes mosaico-flutua` quatro tempos (0/30/62/84%) e cinco eixos; `RITMOS` com período 4,6s–7,5s; `--tilt-y` 7–11° / `--tilt-x` 3–5°; sombra no `::before` da flutuação `blur(30px)`; hover pausa + `translateZ(46px)`.

**Título sticky, fundo claro, legendas.** `h2` “Eventos & Inovação” (`aria-labelledby`). Fundo nasce navy, clareia, fecha `#041d37`. Legenda irmã da face, fora da inclinação. Geometria: colunas A 2/36/70 e B 18/52/84; teto de `y` 80%→76%; amplitude lateral 16→12px; `line-clamp` 3→4; altura fixa da placa removida. Colisões 0 nas quatro larguras (gapMin 14–83px). Reduced-motion: percurso de função, zero residual (`tituloPctFluxo: 0`).

**Contraste (piso 4,5:1).** Título 14,82:1 (placa branca opaca — sem ela 1,00:1). Legendas 10,78–11,50:1. `h2` ganhou placa porque sticky cruzava fotos.

**Portões:** tsc silencioso; eslint src 18/0; next build 0.

### Conferência
Devolvida (mecânica ≠ origem). Após ajustes + título/fundo/legenda: **APROVADO**. Atenção: quinze `blur(30px)` + `will-change` permanente; cinco cartões no corredor central (item da SIS-164). Sem label `conferido`.

### Arquivos tocados
- `src/components/EventsMosaic.tsx`
- `src/app/globals.css`
- `src/app/eventos-inovacao/page.tsx`

---

## SIS-159 — Parceiros — trocar a grade bento de 16 cards pela trilha horizontal pinada (código de referência)

**Status:** In Review · **Labels:** conferido · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-159/parceiros-trocar-a-grade-bento-de-16-cards-pela-trilha-horizontal

### Pedido
Em `/parceiros-e-implementacoes`, a seção Parceiros deixa a grade bento de 16 cards com filtros e passa a trilha horizontal presa: painéis deslizam no scroll, contador `01 / 16`, barra, foco no ativo (vizinhos `.42` / `scale(.88)`), detalhe dentro do painel. Código de referência veio no pedido; encaixa mal (altura 520vh, CSS Modules, `--font-mono` indefinida, pin GSAP vs sticky da casa, `short`/`tags` inexistentes). Critérios: altura derivada da contagem; botão real; fallback &lt;1024 e reduced-motion; sem `*.module.css`; filtros como atalhos (saída b).

### O que foi feito
Sem relatório de entrega no Linear. O `stateHistory` mostra passagem por In Progress (06/09/2026, depois devolução ao Todo em 07/09 e retomada) e permanência em In Review após as voltas de conferência; `completedAt` continua nulo. A apuração da execução e a segunda volta estão na **descrição** da issue, não em comentário `## Entrega`.

`PartnersTrack.tsx` + `partners-track.css`, montados em `parceiros-e-implementacoes/page.tsx`. Sem `pin: true`: seção alta + `sticky`. Altura `H = (N-1) × passo + 100` → **550svh** (4950px a 1440). Primeira cauda a olho (60svh) deixava o 16º painel 406px fora do centro (`--par-t` 0,943); derivado das sentinelas. Contador e barra com `scaleX(var(--par-t))`. Detalhe `absolute; inset: 0` (track 9756px aberto e fechado). Sem ScrollTrigger, sem motion/GSAP: CSS `transform` em custom property. Painel `clamp(21rem, 44vw, 36rem)` (não 62vw); gap `clamp(1.25rem, 2.5vw, 2.5rem)`. `MONO` com fallback. Filtros = atalhos `PARTNERS.findIndex` + `window.scrollTo`. Sem inventar `short`/`tags`. `PartnersGrid.tsx` intacto, import comentado.

**Acessibilidade na lista:** gatilho só com `naTrilha`; `line-clamp-4` só na trilha.

**Segunda volta (defeitos da conferência).** Espelho `html[data-motion='reduce'] .parceiros-trilha { display: none }` / lista `display: grid` — cenário B (botão da interface) ia de 2/16 para 16/16. `onFocus={() => irPara(i)}` no gatilho (foco em x=2939/5387). `aria-live` espera 350ms. Overlay do detalhe `tabIndex={0}` quando aberto.

**Portões:** tsc limpo; `npm run lint` 24/0; next build 0. Passo de amostragem 60px (300px dava falso 14/16). Aval de produto 08/09: trilha fica, 550svh aceitos.

### Conferência
**DEVOLVIDA** (interruptor da interface congelava no painel 01; Tab focava fora da janela). Reconferência **APROVADA** tecnicamente; aval do item 1 depois **concedido**. `conferido` aplicado.

### Arquivos tocados
- `src/components/PartnersTrack.tsx`
- `src/components/partners-track.css`
- `src/app/parceiros-e-implementacoes/page.tsx`

---

## SIS-158 — Parceiros — o card da Nuclea é o único sem logo; ligar o Nuclea-logo.png que já está no repositório

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** —
**Link:** https://linear.app/sistran-labs/issue/SIS-158/parceiros-o-card-da-nuclea-e-o-unico-sem-logo-ligar-o-nuclea-logopng

### Pedido
Card da Nuclea (Dados e integrações) é o único dos 16 sem logo. Arquivo já em `public/images/Nuclea-logo.png` (25,8 kB). Ligar `logo` e `logoAlt` em `partners.ts:148-156`. Sem entrada nova; textos intactos; filtro continua contando 2; placa branca; PNG não como retângulo na placa; `logoAlt: 'Nuclea'`; decisão do acento em `title` e `logoAlt` juntos ou em nenhum.

### O que foi feito
Dois campos na entrada existente: `logo: '/images/Nuclea-logo.png'`, `logoAlt: 'Nuclea'`. HTML: 16 cards, 16 placas, `category: 'dados'` = 2. PNG: 715×120, 74,7% transparente, 0% branco opaco, margem estreita. Render ~251×42 a 1440 (logo 5,96:1; largura da placa limita).

**Acento (segunda passada):** decisão **Núclea**. Quatro lugares: `title` e `logoAlt` em `partners.ts`; `copy-lock.json` chave `src/data/partners.ts:44` casada por valor; `.claude/conteudo-site/05-parceiros-e-implementacoes.md`. Arquivo `Nuclea-logo.png` não renomeado. `timeline.ts:30` já tinha acento, não tocada. Comentário de premissa falsa substituído.

**Portões:** tsc limpo; eslint src 18/0; rota 200; next build 0.

### Conferência
Primeira volta **APROVADO** (logo); adendo: site já escrevia Núclea na timeline. Após acento: **Conferido e aprovado** nos quatro lugares. Item visual “retângulo na placa” fica para olho no navegador. Sem label `conferido`.

### Arquivos tocados
- `src/data/partners.ts`
- `copy-lock.json`
- `.claude/conteudo-site/05-parceiros-e-implementacoes.md`

---

## SIS-157 — CTA "Fale com a Gente!" — o parágrafo do cartão mede 3,33:1 nas dez telas (piso é 4,5:1)

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** —
**Link:** https://linear.app/sistran-labs/issue/SIS-157/cta-fale-com-a-gente-o-paragrafo-do-cartao-mede-3331-nas-dez-telas

### Pedido
Parágrafo do `ContactCTA` mede 3,33:1 no pior pixel (piso AA 4,5:1 para 16px). Culpado: terceira parada `rgba(14,216,246,0.5)`. Branco puro chega ~3,8:1 — o degradê tem de mudar. Bloco fecha várias rotas; paleta branco + azuis. Critérios: parágrafo ≥ 4,5:1 a 1440; h2 ≥ 3,0:1 e não piora; conferido nas telas que montam o bloco; números no comentário com o método de `docs/medidas/COMO-MEDIR-CONTRASTE.md`.

### O que foi feito
Caminho 1: baixar o clareamento da terceira parada. Degradê: `rgba(0,62,118,0.95)` / `rgba(0,88,155,0.9)` / `rgba(14,160,220,0.35)`. Antigo comentado verbatim.

**Medido** (1440×900, header escondido, tinta `color: transparent`, pior pixel, mínimo de 6 quadros após 3,5s): sete rotas 3,30 → **4,80** (`rgb(7,102,171)`), h2 4,20 → 6,43; `/esg` 3,97 → **5,45** (`rgb(5,93,157)`), h2 4,66 → 6,26.

**Contagem:** oito telas montam o bloco (home e `/eventos-inovacao` comentadas, SIS-54 e SIS-152).

**Portões:** tsc limpo; eslint src 18/0; next build 0.

### Conferência
**APROVADA.** Contraste recalculado por WCAG a partir do RGB relatado (4,805 e 5,442). Adendos: sonda `p157.mjs` não está na árvore; “dez telas” era premissa errada (oito). Sem label `conferido`.

### Arquivos tocados
- `src/components/ContactCTA.tsx`

---

## SIS-156 — Home — trocar a faixa rolante de logos por uma grade estática de marcas (referência: terminal-industries.com)

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** —
**Link:** https://linear.app/sistran-labs/issue/SIS-156/home-trocar-a-faixa-rolante-de-logos-por-uma-grade-estatica-de-marcas

### Pedido
Na home, no lugar do `SignalMarquee` (rodapé de “Sistran em números”), grade estática no formato terminal-industries.com: título editorial + malha com linhas finas, logos parados. Título não inventado. Sem fileira incompleta. Percurso pinado de Metrics reconferido (caixa 340vh + altura da faixa). Emenda com palco escuro. `/contato` e `/parceiros` continuam rolantes. Marquee comentado, não deletado.

### O que foi feito
`BrandGrid.tsx` (Server Component) + `brand-grid.css` (malha `gap: 1px` sobre `var(--line)`). **15 marcas** (`CLIENTS.filter(c => c.logo)`), não 16: **5×3** ≥1024 e **3×5** abaixo. Título “Impulsionando as operações por trás das marcas que você conhece” no `copy-lock.json`. Tetos ópticos `max-height: 46%` e `max-width: 68%`.

**Defeito silencioso.** `ETAPAS_FIM = 0.94` era a aritmética da faixa (~130px): `(3060−900)/(3190−900) = 0.943`. Com a grade (~690px) a razão cai a 0,758 e a 7ª etapa vinha **527px** depois de o palco sair (`p: 0.9428, palcoTopo: -527` a 1440). Corrigido: `etapasFimRef` + `ResizeObserver` nas duas caixas. Sonda `scripts/medir-percurso-marcas.mjs`: 1440 seção 3750px, 7ª em p=0,758, palcoTopo −1px; 1366 3286px, p=0,731, 0px.

`SignalMarquee` comentado em `Metrics.tsx`; vivo em duas telas. `forced-colors` nas células.

**Portões:** tsc limpo; eslint 18/0; next build 0; home 200.

### Conferência
**Aprovada** (árvore). Adendo posterior: título é redação nova, **não** está em `.claude/conteudo-site/` — critério de texto aprovado pendente de produto; frase fica provisória. Contagens da issue (16 marcas, três telas do marquee) corrigidas para 15 e duas. Sem label `conferido`.

### Arquivos tocados
- `src/components/BrandGrid.tsx`
- `src/components/brand-grid.css`
- `src/components/Metrics.tsx`
- `src/app/page.tsx`
- `src/components/legacy/SignalMarquee.tsx`
- `copy-lock.json`

---

## SIS-155 — Site inteiro — trocar o sistema tipográfico pelo par Geist Sans + Geist Mono (referência: terminal-industries.com)

**Status:** In Review · **Labels:** conferido · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-155/site-inteiro-trocar-o-sistema-tipografico-pelo-par-geist-sans-geist

### Pedido
Trocar Instrument Serif + Inter por Geist Sans 400/500 + Geist Mono 600, só tipografia, segundo `docs/terminal-typography-prompt.md`. Serifa sai dos 76 `font-display` (aval de marca 09/09). `--font-proportional` e `--font-mono`; oito papéis sobre os cinco degraus (`pagehero-medio`/`longo` preservados); caption 10px do prompt **proibido** (piso SIS-174: 11px rótulo / 12px corrido). Varredura de constantes medidas em px com ANTES/DEPOIS. Carregamento antigo comentado. Geist é alternativa livre, não a fonte da Terminal Industries.

### O que foi feito
**Declaração:** Geist = alternativa livre SIL OFL via `next/font/google`; não é a fonte da referência.

**Carregamento.** `Geist({ weight: ['400','500','600','700'], style: ['normal','italic'] })` + `Geist_Mono({ weight: '600' })`, `display: 'swap'`. Desvio: sonda achou **285 pontos** acima de 500 (600 em 178, 700 em 95); com `font-synthesis: none` a ênfase sumiria. Itálico de Geist é corte real nesta versão do Next (`essence-accordion.css:311` mantido). `Instrument_Serif`/`Inter` comentados.

**Ponto 12 — `ch`:** Instrument 0,460 · Inter 0,600 · Geist 0,6631 · Geist Mono 0,6000. Caixas `Nch` na serifa cresceram ≈44%; no Inter ≈10%. Tabela-mestra em `globals.css:82`. ScrollSpy: tinta “Conheça também” 131,53→127,08px; mínimo W≥1430,16; limiar **1439,98px preservado** (+4,45px de folga). Cartão contato 358,7px **inalterado** (é `17.5rem`). Manchete `/solucoes` não voltou a 7 linhas no desktop; em 320px 6→9 linhas, sem overflow.

**Brindes.** Última serifa viva em `globals.css:16103` (cauda Georgia) removida. Oito `font-mono` sem peso → `font-semibold`. `.rec-contagem` 780→600. `--font-mono` definida. Quatro rótulos PartnersTrack 10→11px.

**Piso 11px:** na Mono, só `.solutions-coord` a 9,6px (exceção pré-declarada). 24 rótulos proporcionais sub-piso reportados para SIS-174.

**Copy-lock:** `fontFeatureSettings`/`fontVariantNumeric` em `NOMES_TECNICOS` (precedente SIS-173) — 11× `"tnum" 1` não entram como texto.

**Portões:** `npm run lint` 24/0; tsc 0; `test:copy` 1196 OK; build 0.

**Reparo da conferência 1:** notas de `pageSections.ts` e `ScrollSpy.tsx` atualizadas (sem 150px vigente); ordinal `01–04` de `ServicesJourneyStage` em Geist Mono 600 + `tnum`.

### Conferência
Rodada 1 **REPROVADA** (comentários ScrollSpy; 13º tabular ainda proporcional). Rodada 2 **APROVADA**. VEREDITO: APROVADO. `conferido` aplicado.

### Arquivos tocados
- `src/app/layout.tsx`
- `src/app/globals.css`
- `src/data/pageSections.ts`
- `src/components/ui/ScrollSpy.tsx`
- `src/components/ui/ServicesJourneyStage.tsx`
- `TIPOGRAFIA.md`
- (demais consumidores de `font-mono` / tokens listados no relatório de entrega)

---

## SIS-153 — /eventos-inovacao — retirar o número (01, 02, …) de cima do título de todos os eventos

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** —
**Link:** https://linear.app/sistran-labs/issue/SIS-153/eventos-inovacao-retirar-o-numero-01-02-de-cima-do-titulo-de-todos-os

### Pedido
O número acima do título sobre a foto sai nos quinze eventos. Selo, título, descrição e chip YouTube ficam. Só o número sobre a foto — `ordemNoCatalogo` continua no painel e nas miniaturas. Sai do JSX, não `display: none`. Comentário de `globals.css` que justificava o número pela régua (já removida na SIS-106) corrigido. JSX e `.evento-ordem` comentados.

### O que foi feito
`<span className="evento-ordem">` comentado; `<h3>` só `{e.title}`. Prop `ordem` saiu da fatia. `ordemNoCatalogo` permanece para miniaturas. `.evento-ordem` comentado; justificativa reescrita (posição = contador do painel). HTML servido: 0 `evento-ordem`; títulos começam pelo nome. Respiro selo→título **19,9px** nas três larguras (não dependia do rótulo). Contador `08 / 15` ok. FENACOR 2 linhas com `text-wrap: balance`. Contraste pior 9,25:1 a 1366 (melhor que 8,93:1). Armadilha: delimitador `*/` em nota CSS derrubou `next dev` com 500.

**Retrabalho:** referências de linha trocadas por nomes (`ordemNoCatalogo(alvo)`, `activeIdx + 1`, `.evento-posicao-total`).

**Portões:** tsc limpo; eslint src 18/0.

### Conferência
Devolvida pelas linhas 565-566/~607 erradas (~16 linhas pelo bloco comentado). Conserto **aprovado**. Sem label `conferido`.

### Arquivos tocados
- `src/components/EventsGrid.tsx`
- `src/app/globals.css`

---

## SIS-152 — /eventos-inovacao — retirar o bloco "Fale com a Gente!" do fim da página

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** —
**Link:** https://linear.app/sistran-labs/issue/SIS-152/eventos-inovacao-retirar-o-bloco-fale-com-a-gente-do-fim-da-pagina

### Pedido
Cartão de fechamento de `/eventos-inovacao` sai da rota (não é ajustado ao ESG). Só a chamada em `page.tsx`; `ContactCTA` intacto nas outras rotas. Risco: emenda Social→CTA vira Social→rodapé. Comentário de quatro capítulos/três passagens atualizado. Linha comentada, não deletada.

### O que foi feito
`<ContactCTA className="emenda-de-azul-medio" />` e import comentados. Rodapé `bg-[#1273BC]/85` vs última parada `#1273bc` de `.palco-de-cena-escura` — mesma junção da SIS-54 na home. Sonda 40px na fronteira a 1440: degrau real ≤7/255 (descontada a `brand-line`). `ctaPresente: false` em 1440 e 390. Home e `/esg` seguem com o bloco. Cabeçalho: três capítulos, duas passagens; `social -> contato` extinta. Sem substituto de CTA.

**Retrabalho de conferência:** contagem em `ContactCTA.tsx` num lugar só (dez chamadas, duas comentadas, oito montam, sete usam `<Link>`); `page.tsx` “OUTRAS OITO páginas”; título do bloco em `globals.css` “Passagem 3 … SEM CONSUMIDOR DESDE A SIS-152”.

**Portões:** tsc limpo; eslint src 18/0.

### Conferência
Devolvida (comentário da home “nove páginas” incluindo eventos; folha ainda falava Passagem 3 no presente). Retrabalho **aprovado**. Sem label `conferido`.

### Arquivos tocados
- `src/app/eventos-inovacao/page.tsx`
- `src/components/ContactCTA.tsx`
- `src/app/page.tsx`
- `src/app/globals.css`

---

## SIS-149 — /eventos-inovacao — a explicação volta para o canto inferior esquerdo da foto

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** —
**Link:** https://linear.app/sistran-labs/issue/SIS-149/eventos-inovacao-a-explicacao-volta-para-o-canto-inferior-esquerdo-da

### Pedido
Selo, número, título, descrição e chip voltam do centro para o canto inferior esquerdo da foto. Reverte alinhamento da SIS-111, **não** a geometria compartilhada texto/foto (`.evento-quadro` intacto). Escrim volta a horizontal-à-esquerda, laterais zero, sem `%` de −6/−8. Contraste AA nas quinze. Mobile inalterado. Regras de centralização comentadas.

### O que foi feito
Só `globals.css` no `@media (min-width: 1024px)`. `.evento-texto`: `margin-inline: 2.5rem 0` (centralização comentada). Descrição `margin-inline: 0`. Chip centralizado comentado. Escrim horizontal, `inset: -3rem 0 -2rem 0`.

**Geometria 1440:** foto 157,5–1282,5; texto 197,5–823,3 (+40px = 2,5rem); base −40px (acima da foto). `scrollWidth` = innerWidth em 1024–1180. Contraste título 14,39–17,08:1; descrição 12,87–18,08:1; evento 02 14,81 / 15,96. Controle sem escrim: pixel `254,253,248` (~1,05:1).

**Retrabalho:** platô 58% documentado — `62ch` vence o `min()`; tinta do título a 1366 chega a **65,5%** (já na rampa); pior contraste 8,93:1. Span `data-rm` morto comentado; prop `rm` da fatia saiu.

**Portões:** tsc limpo; eslint 18/0; next build 0.

### Conferência
Devolvida (platô justificado pelo parágrafo vs título; `data-rm` sem consumidor). Retrabalho **aprovado** (medição com Range). Sem label `conferido`.

### Arquivos tocados
- `src/app/globals.css`
- `src/components/EventsGrid.tsx`

---

## SIS-147 — /eventos-inovacao — diminuir a altura da abertura com vídeo

**Status:** In Review · **Labels:** conferido · **Fechada em:** — · **Responsável:** —
**Link:** https://linear.app/sistran-labs/issue/SIS-147/eventos-inovacao-diminuir-a-altura-da-abertura-com-video

### Pedido
Abertura com vídeo alta demais (título ~500px do topo a 1920×648). Reduzir para o título subir e a cena aparecer mais cedo. **Não** mexer no `.pagehero-entrada` base das 14 rotas — escopo em `.hero-backdrop--eventos`. Título inteiro sem encostar no header; emenda sem listra; telão de LED no quadro; mobile 46svh conferido; valor antigo comentado.

### O que foi feito
```css
@media (min-width: 1024px) {
  .hero-backdrop--eventos .pagehero-entrada { min-height: 46svh; }
}
```
`58svh` permanece na regra base. Sonda `scripts/medir-abertura-eventos.mjs`, header visível:

| | 1920×1080 | 1366×768 | 390×844 |
| entrada agora | 497 (46%) | 353 (46%) | 388 (46%) |
| topo do título | 459 | 317 | 396 |
| folga título↔header | 355 | 213 | 308 |
| topo `#eventos` | 641 | 497 | 500 |
| vídeo visível | 59% | 65% | 100% |

Controle 1366: `/solucoes` 445, `/quem-somos` 445, `/contato` 453 — irmãs intactas. `h1` ancorado na **base** da entrada (banda vazia estava acima). Telão: `object-position: 50% 62%`, janela [0,252…0,845] a 1920. Véu `rgb(4 27 61 / 78%)` vs cena `#041b3d` — mesmo RGB.

**Portões:** tsc 0; eslint src 18/0; next build 0.

### Conferência
**APROVADO.** Números batem. Follow-up: correção não ataca a ancoragem (ainda 355px de vídeo vazio a 1920); janela 1920×648 da queixa não foi medida. `conferido` aplicado.

### Arquivos tocados
- `src/app/globals.css`
- `scripts/medir-abertura-eventos.mjs`

---

## SIS-146 — /contato — bloco #timeSISTRAN: aumentar a escrita do cartão de carreira e tirar o travessão do parágrafo

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** —
**Link:** https://linear.app/sistran-labs/issue/SIS-146/contato-bloco-timesistran-aumentar-a-escrita-do-cartao-de-carreira-e

### Pedido
No `#timeSISTRAN` de `/contato`: aumentar a escrita do cartão duas faces; tirar o travessão do parágrafo (“…todos os dias — e de gente…”), repontuando. `height` e `--lc-passo` juntos (`passo = height/4`). Escopo nas telas do `CartaoDuasFaces` ou via `className`. Contraste verso ≥ 4,5:1. Reduced-motion nasce aberto. Travessão do verso do cartão só se a decisão estiver escrita.

### O que foi feito
| classe | antes | depois |
| frente-rotulo | 1,05rem | 1,2rem |
| frente-destino | 0,72rem | 0,8rem |
| verso-titulo | 1,15rem | 1,3rem |
| verso-texto | 0,86rem | 1rem |
| verso-cta | 0,78rem | 0,88rem |
| height | 26rem | 30rem |
| `--lc-passo` | 6,5rem | 7,5rem |

Face antiga 208px / 160px úteis / 132,2px de conteúdo; tipo novo 172,3px — não cabia. 30rem → 240px / 192px úteis / 19,7px de folga. Destino 248,9px em uma linha. 390/1024/1440: cartão 320px; transbordo 0; metades coincidem. Reduced-motion: `matrix(1,0,0,1,0,0)`, aberto. Contraste `#3c5a7a` sobre branco **7,15:1**.

**Travessão:** vírgula (“…todos os dias, e de gente…”). Verso do cartão mantém travessão (orações independentes; escrita SIS-130).

**Alcance:** quatro telas (`contato/page.tsx` + `Social.tsx` em home, eventos, trabalhe-conosco). +64px de altura de seção; cartão 5px dentro da grade, 133px acima do pé.

**Portões:** tsc limpo; eslint 18/0; next build 0.

### Conferência
Devolvida pela contagem (duas telas vs quatro). Correção **APROVADA** (Social.tsx:80 tem 80 caracteres, não 81). Sem label `conferido`.

### Arquivos tocados
- `src/app/globals.css`
- `src/app/contato/page.tsx`

---

## SIS-145 — /contato — encurtar o vão entre a faixa de parceiros e o painel de contato

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** —
**Link:** https://linear.app/sistran-labs/issue/SIS-145/contato-encurtar-o-vao-entre-a-faixa-de-parceiros-e-o-painel-de

### Pedido
~230px de degradê vazio entre a faixa de logos e o cartão “Entre em contato conosco” (captura ~1629px). Linha: `.fundo-contato-cena { padding-top: clamp(13rem, 16vw, 16rem) }` e rampa `.contato-emenda-clara` 200px. Os dois andam juntos; `padding-top` ≥ altura da rampa. Sem listra nas quatro colunas do painel. Valores antigos comentados.

### O que foi feito
Vão = `padding-top` (base da faixa e topo da seção no mesmo pixel). `clamp(13rem, 16vw, 16rem)` → `clamp(9.5rem, 11vw, 10.5rem)`; rampa 200→**140px**.

| largura | padding antes | depois | sobra acima do cartão |
| 390 | 208px | 152px | 12px |
| 1440 | 230,4px | 158,4px | 18,4px |
| 1629/1920 | 256px | 168px | 28px |

Encurtar a rampa deixou cauda íngreme (R=15 a 10px do fim). Parada 22% em 55%; resíduo voltou a 7–8. Emenda nas quatro colunas a 1440/1629/1920 sem salto. Fio da faixa ausente; borda de cima reta.

**Portões:** tsc limpo; eslint 18/0; rota 200; next build 0.

### Conferência
**Conferida no código e aprovada.** Aritmética do clamp e regra rampa ≤ padding mínimo conferidas; pixels são relato do par. Sem label `conferido`.

### Arquivos tocados
- `src/app/globals.css`

---

## SIS-144 — /contato — a faixa de indicadores fixa na tela e os cartões correm para o lado com o scroll, e depois a página desce

**Status:** In Review · **Labels:** conferido · **Fechada em:** — · **Responsável:** —
**Link:** https://linear.app/sistran-labs/issue/SIS-144/contato-a-faixa-de-indicadores-fixa-na-tela-e-os-cartoes-correm-para-o

### Pedido
Faixa dos sete indicadores em `/contato`: seção presa, cartões correm na horizontal, depois a página desce. Mecanismo `sticky`, nunca `pin: true`. Transbordo já medido na SIS-143: 2630,9px vs trilho 1116px = 1514,9px. Reduced-motion **e** `html[data-motion="reduce"]`; overflow clip; svh; só transform; grade comentada; lint 24/0.

### O que foi feito
`PercursoIndicadores.tsx` + `metrics-band-track.css`; `MetricsBand.tsx` envolve. Sem ScrollTrigger: distância em CSS; `useProgressoDeSecao` relê rect e resize. Palco `sticky` + `overflow: clip` + `100svh`.

**Medido (produção):** 1024 cartão 280, deslocamento −1116,2, 7/7; 1440 345,6 / −1214,4 / 7/7; 1920 360 / −848 / 7/7. Escala a 1024: −1115,6 de −1116,2 no último quadro preso.

**Três desligamentos a 1440 idênticos:** grid, espaçador 0, 7/7 — sistema, botão da interface, JS off. Correção: regras impedidas com `html:not([data-motion='reduce'])` (espelho que desfazia deixava espaçador de 1620px).

**390/768:** grade, não percurso nem overflow-x nativo (uma coluna a 390). Focáveis na trilha: 0. Degradê da SIS-136 no palco 100svh; seção alta `#071d36` plano.

**Portões:** lint 24/0; tsc 0; build ok; copy-lock 1196 intacto.

### Conferência
**Aprovada.** Portões e geometria reproduzidos; dois interruptores byte a byte iguais; emenda logos limpa (`rgb(7,29,54)` / `rgb(245,250,255)`). `conferido` implícito na label da issue.

### Arquivos tocados
- `src/components/ui/PercursoIndicadores.tsx`
- `src/components/ui/metrics-band-track.css`
- `src/components/MetricsBand.tsx`
- `src/app/globals.css`

---

## SIS-143 — /contato — os sete indicadores viram cartões: número maior, contagem ao entrar na tela e rótulo ao lado

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** —
**Link:** https://linear.app/sistran-labs/issue/SIS-143/contato-os-sete-indicadores-viram-cartoes-numero-maior-contagem-ao

### Pedido
Faixa de números de `/contato`: número maior; CountUp ao entrar; cartão com número à esquerda e rótulo ao lado. Reverter a decisão de não contar (HTML servido com zeros). `metrics.ts` e `Metrics.tsx` da home intocados. Sem roxo. Pé `#071d36` (contrato SIS-136). Cartão fluido (decisão da usuária: não fabricar transbordo para a SIS-144).

### O que foi feito
**CountUp (b):** MotionValue nasce em `target`; efeito zera e anima. HTML servido: `850` visível, não `0`. Um quadro (~16ms) com valor certo na hidratação. Sem `once`. `srText={`${m.value}${m.suffix}`}`; `+` `aria-hidden`. MetricsBand continua Server Component; CountUp é filho client.

**Grade:** `repeat(auto-fit, minmax(17.5rem, 1fr))`; 4+3 comentado. Por fileira: 390 = 1; 768 = 2+2+2+1; 1024/1440/1920 = 3+3+1. Cartão 350 / 352 / 309,1 / 358,7 / 358,7px. Rótulos no máximo 2 linhas. Sem glass-card (roxo `rgba(124,58,237,0.1)` + sete blurs). Superfície branco 7%→3%.

**Contraste no cartão:** pior 9,67:1 (rótulo, canto claro do 1º). Pé `7,29,54` = `#071d36`. Número `clamp(2.5rem, 4.2vw, 3.5rem)` vs 7,5rem da home.

**Portões:** tsc limpo; eslint 18/0.

### Conferência
**APROVADA.** Adendo: nota de alcance do CountUp errada (só `MetricsStrip` e `MetricsBand` importam o primitivo; About/CompanySignature/Metrics têm contador próprio). Sem label `conferido`.

### Arquivos tocados
- `src/components/MetricsBand.tsx`
- `src/components/primitives/CountUp.tsx`
- `src/app/globals.css`

---

## SIS-142 — /esg — CTA “Fale com a Gente!”: fundo azul claro, cartão mais inovador, reação ao mouse e o botão abrindo o modal de contato

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** —
**Link:** https://linear.app/sistran-labs/issue/SIS-142/esg-cta-fale-com-a-gente-fundo-azul-claro-cartao-mais-inovador-reacao

### Pedido
No fim de `/esg`: azul claro atrás do bloco; cartão mais inovador; reação ao mouse; botão abre o `ContactModal` existente em vez de `/#contato`. ContactCTA fecha várias páginas — props opt-in. Só transform/opacity; `:focus-visible`; reduced-motion visível; ContactPanel intocado; copy-lock; Link comentado/ramo.

### O que foi feito
Props `haloClaro`, `reativo`, `contatoNoModal` default false; só `/esg` liga as três. Halo: `.cta-halo-claro::before` acima e abaixo do cartão (halo centrado caía h2 a 2,1:1). Reativo: invólucro (não o `motion.div` — `transform` inline do `vFadeUp` vencia a classe). Hover: `matrix(1.006, 0, 0, 1.006, 0, -6)`; calha 32px não levanta; Tab igual. Espelhos `@media` e `html[data-motion="reduce"]`. Botão abre o mesmo `ContactModal` do Header; Esc/clique fora devolvem foco. `<Link href="/#contato">` no outro ramo do ternário.

**Contraste 1440:** `/esg` h2 4,66:1, parágrafo 3,98:1 (melhor que `/solucoes` intocada 4,09 / 3,33). Parágrafo 3,33:1 nas telas irmãs → SIS-157.

**Portões:** tsc limpo; eslint 18/0.

Follow-up visual (igual `falecomagente.png`) aberto em **SIS-253**, não reabre esta.

### Conferência
**Aprovada.** Quatro mudanças opt-in; ContactPanel diff é SIS-127; seletor `:has(:focus-visible)`; SIS-157 reconhecida para o piso 4,5:1 do parágrafo. Sem label `conferido`.

### Arquivos tocados
- `src/components/ContactCTA.tsx`
- `src/app/esg/page.tsx`
- `src/app/globals.css`

---

## SIS-141 — /esg — GOVERNANCE no mesmo formato de ENVIRONMENT: seis imagens e escritas maiores

**Status:** In Review · **Labels:** conferido · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-141/esg-governance-no-mesmo-formato-de-environment-seis-imagens-e-escritas

### Pedido
GOVERNANCE no mesmo desenho de ENVIRONMENT (SIS-139): imagem em cada card, hover, movimento, destaque no título; arquivos de `public/images/governance/`; escritas maiores. Manter `<dl>`/`<dt>`/`<dd>`. WebP, PNG fora de `public/`. TODO Canal de Denúncia permanece. Par imagem↔item conferido.

### O que foi feito
Par no array (ordem arquivos ≠ ordem dos itens: 1,4,2,3,5,6). Nomes por prática: `gov-transparencia`, `gov-isencao-autonomia`, `gov-formalidade`, `gov-codigo-etica`, `gov-comite-interno`, `gov-canal-denuncia`. Foto **dentro do `<dt>`**. Mesmas classes `esg-pratica` / `esg-pratica-foto` — **nenhum CSS novo**. Compasso 1,3s (não 1,7s). Parágrafo `text-lg`→`text-xl` nas duas gêmeas; termo 16→18px; descrição 14→16px. `h2` `text-section` não subiu. PNG `docs/fontes/governance/`; **2.157 KB → 176 KB (−92%)**. Canal de Denúncia: pictograma de megafone, não UI de canal.

**1024:** termo “Código de Ética…” em 1 linha (coluna 309,3px, útil 259,3px); alturas 445,3 / 471,3px entre fileiras.

**Contestação aceita (na descrição):** arquivos de Comitê Interno e Código de Ética trocados no disco; só os dois `alt` mudaram no `page.tsx`.

**Portões:** tsc 0; lint 24/0; build 0.

### Conferência
**APROVADA** com contestação dos dois pares (depois atendida na descrição). Ponto 5 fechado por medição. `conferido` aplicado.

### Arquivos tocados
- `src/app/esg/page.tsx`
- `src/app/globals.css` (superfície / reduced-motion já de ENVIRONMENT)
- `public/images/governance/*.webp`
- `docs/fontes/governance/` (PNG)

---

## SIS-140 — /esg — SOCIAL: destaque no título, galeria dinâmica com imagem que expande, foguete no scroll e cards iguais

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** —
**Link:** https://linear.app/sistran-labs/issue/SIS-140/esg-social-destaque-no-titulo-galeria-dinamica-com-imagem-que-expande

### Pedido
SOCIAL de `/esg`: mesmo destaque de título da SIS-139; logo Gerando Talentos dinâmica; foguete discreto no scroll atrás das escritas; três turmas em movimento e clique que expande; letras maiores em Huerta Niño/Aguas; sombra azul, hover scale, cards do mesmo tamanho. Lightbox com teclado. Reduced-motion visível. Contraste do foguete medido.

### O que foi feito
**TituloAceso:** pontuação colada (`SO_PONTUACAO`); SOCIAL 11→9 passos; outros nove títulos com a mesma contagem de tokens.

**Selo:** `.esg-selo` 9s, `translateY(±3px) rotate(±0.5deg)`, sem scale/skew/filter.

**Foguete:** `FogueteScroll.tsx`, silhueta do selo (webp). Branco translúcido. `useTransform` no DOM, zero setState/quadro. Contraste parágrafos 5,09:1; h3 12,08:1; Δ com/sem foguete 0,03. Links `#1273BC` 3,79:1 — pré-existente, issue à parte. Header fixo lia 1,00:1 (armadilha de sonda).

**GaleriaTurmas:** `<dialog>` + `showModal()`; rótulos distintos; Esc/clique fora; foto não fecha o modal. Deriva `scale(1.03)`, delays 0 / −3,67 / −7,33s.

**Apoio:** `text-sm`→`text-base` + `leading-relaxed`; h3 `text-xl`→`text-2xl`. Pluma `--esg-fase`. Hover `scale` + `z-index: 2`, `:not(.esg-selo)`. `col-span-2` da 1ª turma mantido (sequência cronológica); 2ª/3ª 259,0×186,6; apoio 546×512.

**Reparo conferência:** `will-change` saiu de `.esg-apoio::before` (6 wrappers, mesma condição da SIS-139).

**Portões:** tsc limpo; eslint 18/0; next build 0.

Follow-up do foguete em **SIS-207** (10/09), não reabre esta.

### Conferência
Devolvida pelo `will-change`. Após remoção: **SIS-140 aprovada**. Ressalvas: `sizes`/`unoptimized` (SIS-154); “mesmo tamanho” não nas três turmas, decisão escrita. Sem label `conferido`.

### Arquivos tocados
- `src/components/ui/TituloAceso.tsx`
- `src/components/ui/FogueteScroll.tsx`
- `src/components/ui/GaleriaTurmas.tsx`
- `src/app/esg/page.tsx`
- `src/app/globals.css`

---

## SIS-139 — /esg — ENVIRONMENT: as seis práticas ganham imagem, cor no hover, movimento contínuo e destaque no título

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-139/esg-environment-as-seis-praticas-ganham-imagem-cor-no-hover-movimento

### Pedido
Na seção ENVIRONMENT de `/esg`, cada uma das seis práticas ganha imagem (`public/images/esg/esg-1.png` a `esg-6.png`), os cards mudam de cor no hover, ficam em movimento contínuo e o título ganha destaque. Critérios: par imagem↔prática conferido; imagens em WebP com PNG fora de `public/` e peso antes/depois no comentário; `width`/`height` e `sizes` casados; `alt` descritivo; hover e `:focus-visible` com a mesma cor; movimento só com `transform`/`opacity`, pausa em `:hover`/`:focus-within`; com `prefers-reduced-motion` os seis visíveis; texto legível no ciclo; destaque do título e decisão sobre SOCIAL/GOVERNANCE; GOVERNANCE só muda se a decisão do hover disser; o que sair fica comentado.

### O que foi feito
Relatório inicial (## Feito) e rework após devolução.

**Imagens.** Seis PNGs convertidos para WebP 595×595, q82, alfa preservado (`hasAlpha: true`, `alphaMin: 0`). 1528 KB → 139 KB. Originais em `docs/fontes/esg/`. O pareamento não seguia a numeração: ordem correta contra o array é `esg-1, esg-4, esg-2, esg-5, esg-3, esg-6`. Arquivos renomeados pela prática: `env-coleta-seletiva`, `env-agua-energia`, `env-borra-cafe`, `env-lixo-eletronico`, `env-descartaveis`, `env-papeis`. Primeira versão usou `aspect-[4/3]` + `object-cover` e decapitava o círculo; ficou `aspect-square`.

**Movimento.** Classificado como decorativo. Para sob `prefers-reduced-motion`; pausa em `:hover`/`:focus-within`. Defasagem `--esg-fase: -${i * 1.7}s`. Bug: animar `.esg-pratica-foto` (com `overflow: hidden`) escalava o recorte e a foto cobria a legenda (contraste 2,85:1 a 390px, fundo `rgb(115,145,172)`). Animação, pausa e reduced-motion foram para `.esg-pratica-foto img`.

**Títulos.** As três `h2` passaram a `TituloAceso`. `esg-social` ficou sem `destaque`. Custo de três observers registrado.

**Contraste preexistente.** `glass-card` em `rgba(17,95,160,0.55)` com fundo `rgb(30,125,195)` levantava a superfície a `rgb(57,126,196)`; `text-white/85` a 14px dava 3,54:1. Criada `.esg-superficie` nas duas seções escuras. Hover reescreve todas as camadas do `background` (shorthand).

**Medições (pior pixel, 390/768/1024/1440/1920).** Legenda ENV 5,02:1; `<dd>` GOVERNANCE 4,96–4,99:1; `h2` ENVIRONMENT branco 4,11–4,53 e destaque 3,33–3,75 (piso 3,0); GOVERNANCE branco ~4,94–5 e destaque ~3,96–4; `#esg-social` 12,37–12,51:1. Primeira leitura de social deu 1,2:1 por sondar branco em título `text-ink`. Alturas de linha 365 em 1440/1920. Reduced motion: `animationName: none`, `transform: matrix(1,0,0,1,0,0)`, seis visíveis. Hover: `animationPlayState: paused`.

**Rework.** Parágrafo das três camadas reancorado junto de `.esg-superficie:hover` (alfa 0,94/0,8). `sizes` corrigido para `min(31vw, 359px)` (content box 359,33px a 1440/1920, 307,33px a 1024). Achado: `images: { unoptimized: true }` em `next.config.mjs` — `srcset` vazio, `sizes` inerte em 19 atributos do repo; os 139 KB vieram da conversão WebP. `sizes` mantido com ressalva. `:focus-visible` documentado como não disparando em `<li>` sem `tabindex`. `will-change: transform` removido.

**Portões (após edições):** `npx tsc --noEmit` limpo · `npx eslint src --ext .ts,.tsx` 18 warnings / 0 errors · `npx next build` exit 0, 27/27 páginas. Comentários CSS 928/928. `TODO` do Canal de Denúncia intacto.

### Conferência
Primeira rodada: volta para In Progress por comentário órfão em `globals.css:13836-13847` e `sizes` 356px vs conta 361,3px. Segunda: os dois pontos fechados; `sizes` 359px conferido; `unoptimized` confirmado; veredito **SIS-139 aprovada**, etiqueta `conferir` retirada, fica em In Review.

### Arquivos tocados
Não declarados no relatório em lista fechada. O relato cita `src/app/esg/page.tsx`, `src/app/globals.css`, `docs/fontes/esg/`, WebPs em `public/images/esg/`, e `next.config.mjs` (não alterado).

---

## SIS-138 — /esg — abertura: título quebrado à esquerda e a continuação ao lado, na mesma fonte

**Status:** In Review · **Labels:** conferido · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-138/esg-abertura-titulo-quebrado-a-esquerda-e-a-continuacao-ao-lado-na

### Pedido
Na abertura de `/esg`, quebrar a frase: à esquerda “A Sistran demonstra seu forte compromisso com o ESG, integrando práticas sustentáveis”; à direita “em suas operações e cultura corporativa.” na fonte do título, a partir de 1280px. Abaixo de 1280, bloco único. Um único `h1`; contraste ≥ 4,5:1 contra a foto; globo ESG legível ou decisão registrada; sem `<br />`; corpo fixado em CSS escopado por `.hero-backdrop--esg`; as outras 13 rotas do `PageHero` não mudam.

### O que foi feito
**Primeira entrega.** Grade a partir de 1280; bases do `h1` e da continuação em 570/570 em 1280, 1440 e 1920. Contraste da continuação 7,78:1 (1440) e 6,62:1 (1920) na primeira tabela; depois 5,43:1 citado na conferência intermediária. Abaixo de 1280 empilhado. `PageHero.tsx` intocado. Armadilha: medir durante a animação de entrada (588 vs 604); após 4s, `transform: none` e pés em 570. Desvio: continuação em `var(--font-editorial)` (Instrument Serif). Portões: `tsc` limpo, eslint 18/0, `next build` 0. Captura `docs/capturas/sis138-depois.png`.

**Item que faltava.** `font-size: clamp(2rem, 3.6vw, 3.2rem)` em `.hero-backdrop--esg .pagehero-entrada h1`. Aritmética: `title` + `highlight` = 85 caracteres, faixa `longo`, teto 51,2px. Medido: 46,08px a 1280, 51,2px de ~1422. Comentário do `max-w-2xl` corrigido: a 1920 a coluna abre 685px e trava em 672px (continuação em 1 linha). Overflow-x 6px/4px a 390/768 não é desta issue. Curl 200 em `/`, `/esg`, `/contato`, `/quem-somos`.

### Conferência
Primeira: critério de `font-size` escopado não cumprido; volta In Progress. Segunda: **aprovada**. Conferente mediu sete larguras; limiar 1280 exato; pés 570/570; contraste pior pixel 5,83:1 (1440) e 6,62:1 (1920). Label `conferido`. Sugestões: `line-height` ainda vem da faixa; transbordo 7px a 390 (issue própria); lint deve ser `npm run lint` (24/0).

### Arquivos tocados
- `src/app/globals.css` (bloco `.hero-backdrop--esg`)
- Captura `docs/capturas/sis138-depois.png`

---

## SIS-137 — /trabalhe-conosco — abertura com vídeo, formulário ao lado da escrita e a tag revista

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-137/trabalhe-conosco-abertura-com-video-formulario-ao-lado-da-escrita-e-a

### Pedido
Refazer a abertura de `/trabalhe-conosco`: vídeo `trabalheconosco.mp4` via `HeroVideoBackdrop`; formulário ao lado da escrita a partir de 1024px; escrita maior; tag “Carreira” ajustada; aparência do formulário. Critérios: poster, reencode sem áudio/`+faststart`; título sem linha nova a 1024 e 1440; decisão da tag; borda de campo ≥ 3:1; texto ≥ 4,5:1; `#curriculo`; reduced-motion com pôster; `PageHero` das outras 13 rotas intacto.

### O que foi feito
**Impedimento:** SIS-117 tirou o `DemoForm` (`enviarFormulario` sem destino). A segunda coluna é o cartão `#curriculo` com a verdade sobre vagas e LinkedIn. Critérios de campo/foco/rótulos Nome ficam pendentes, sem marcação.

**Vídeo.** 7,68 MB, AAC, marca “Veo”. ffmpeg: `-an`, crop 1824×1026, scale 1920×1080, CRF 30, `+faststart` → `trabalhe-conosco-hero-loop.mp4` **1.899.837 bytes (1,90 MB)**; poster WebP 1280 **43.200 bytes**. `foco="50% 55%"`. Original preservado.

**Véu.** Fechado em 70% no meio. YAVG 82,2 no quadro, 68,9 à esquerda, 102,7 à direita. Erro: medir `text-white/85` declarado (5,16:1) em vez de composto (3,93:1). Após conserto do recuo, contraste remedido: `h1` 6,58/5,75/5,37; destaque 5,35/4,52/4,22 (piso 3:1); descrição 4,83/4,62/4,65; eyebrow 10,88–11,69.

**Geometria.** `.carreira-abertura` envolve `PageHero` + `#curriculo` em grid. `PageHero` intocado. Devolução: `max-width: 1116px` + clamp cobrava recuo duas vezes (desvio 48px a 1440). Conserto: `max-width: 1180px` e padding `1.25rem` / `1.5rem` @640 / `2rem` @1024. Delta caixa vs `container-lp` = 0. Título: 2 linhas em 390–1920 após o conserto (antes 3 linhas a 1440 com coluna de 522px). Tag: “Carreira” continua `eyebrow`; pílula `#sistran` saiu do cartão. Item “Currículo” comentado em `pageSections.ts`. Reduced-motion: `paused`, `currentTime: 0`, poster no lugar.

**Portões:** `tsc` limpo · eslint src 18/0 · `next build` 0.

### Conferência
Não conferida enquanto Backlog + tags cruzadas. Devolvida pelo desalinhamento 1116 vs 1180. Após conserto: **Aprovada.** Cinco itens do formulário seguem desmarcados até SIS-117. `conferir` removido.

### Arquivos tocados
- `src/app/trabalhe-conosco/page.tsx`
- `src/app/globals.css` (bloco SIS-137)
- `src/data/pageSections.ts`
- `public/videos/trabalhe-conosco-hero-loop.mp4`
- `public/videos/trabalhe-conosco-hero-loop-poster.webp`

---

## SIS-136 — /contato — a faixa de parceiros sobe para entre a abertura e o formulário

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-136/contato-a-faixa-de-parceiros-sobe-para-entre-a-abertura-e-o-formulario

### Pedido
Mover `SignalMarquee` para entre a abertura e o painel de contato. Emendas nas duas bordas com recurso existente; LCP sem regressão; sem salto de layout; loop sem salto; reduced-motion com lista rolável sem sequestro vertical; cópia `aria-hidden`; emenda do `#timeSISTRAN`; comentário antigo reescrito, não apagado.

### O que foi feito
Mesmo `legacy/SignalMarquee` e `clients.ts`; só posição no JSX. Classes `.contato-faixa-parceiros` / `.contato-emenda-clara`.

**Bordas.** Cima: sem rampa; banda SIS-134 entrega `#071d36` plano (amostra `7,29,54`). Baixo: emenda de claro 200px (não `NotchDivider`). Tentativas erradas registradas (fundo da seção, camada de `.fundo-contato`, `::after` com `z-index: -1` que não pinta). `padding-top` de `.fundo-contato-cena` → `clamp(13rem, 16vw, 16rem)`. Fio de baixo do `.lp-signals` removido neste escopo.

**Rework LCP.** Faixa em y=1017 a 1440×900, dentro do limiar lazy. 17–18 requisições, ~1,22 MB, `repeats` = 1. `fetchPriority="low"` em `SignalMarquee.tsx:183`. Hero 76ms vs 1ª logo 100ms (antes 390/396ms). CLS = 0,0000. Loop a 1440: trilha 5459,34px, cópia 2729,67px. Reduced-motion: roda 600px, página desce 600, `scrollLeft` = 0. Cópia `aria-hidden`; `display: none` não tira do DOM. `#timeSISTRAN`: branco 5,57:1. Comentário “fora do DOM” corrigido.

**Portões:** tsc limpo · eslint 18/0 (eslint-disable reposicionado junto do `<img>`) · next build 0.

Follow-up 14/09/2026: usuária pede retirar `.contato-emenda-clara` → SIS-259, sem reabrir a posição.

### Conferência
Dois pontos (LCP invertido; “fora do DOM”). Após rework: **aprovada**; único ponto da rodada que mudou código (`fetchPriority`). Fica In Review.

### Arquivos tocados
- `src/app/contato/page.tsx`
- `src/app/globals.css`
- `src/components/legacy/SignalMarquee.tsx` (no rework)

---

## SIS-135 — /contato — “Onde Estamos”: o mapa maior dentro da seção

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-135/contato-onde-estamos-o-mapa-maior-dentro-da-secao

### Pedido
Aumentar o mapa em “Onde Estamos”. Critérios: cartão visivelmente maior que 512px; título+pílula+cartão visíveis juntos em janela 793px; área limpa cresce; contraste do painel ≥ 4,5:1 se o véu mudar; pino na área limpa nos três degraus; mobile ganha mapa; atribuição visível; tiles vetoriais conferidos.

### O que foi feito
Só CSS. `UnitsMap.tsx` intocado.

| Onde | Antes | Depois (1ª passagem) |
|---|---|---|
| `.mapa-cartao` `padding-top` móvel | 13rem | 16rem |
| `min-height` @64rem | 32rem (512px) | 38rem (608px) |
| `.mapa-veu` rampa | 34% → 66% | 40% / 44% / 47% → 50% |

Ponto 5 (mapa vazio): 8 requisições `tiles.openfreemap.org` HTTP 200, 796 cores; consertado pela SIS-132 (`setWorkerUrl`). Teto: H ≤ 644; 38rem deixa 36px. Mobile: janela mapa 208→256px, painel 409px inalterado. Pino: rampa termina em 50%; primeiro pixel limpo em 49,9%. Área limpa +75% vs caixa +19%. Contraste painel (branco forçado): 12,20:1. Atribuição 11,51:1 / 13,49:1.

**2ª passagem (escopo novo):** máscara vertical em `.mapa-veu` no largo — banda opaca 30rem (480px) centrada, rampa 4rem. `min-height` → 40rem (640px); 149+640=789, sobra zero. Área quase sem véu +10,7% (1440) / +11,3% (1024). Contraste remedido 17,46:1 / 17,63:1. Pino branco puro em (50%, 50%). `padding-top` estreito permanece 16rem.

**Portões:** tsc limpo · eslint 18/0 · next build 0.

### Conferência
Várias voltas por registro (números em presente vs código) e depois por escopo novo da captura. 2ª passagem **aprovada**, com dívidas: margem de 17px é o caso mais alto (só SP tem `address`); contraste 12,20 vs 17,46 inexplicado (método). Label `conferir` removida.

### Arquivos tocados
- `src/app/globals.css`

---

## SIS-134 — /contato — faixa com os sete indicadores antes do painel de contato

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-134/contato-faixa-com-os-sete-indicadores-antes-do-painel-de-contato

### Pedido
Faixa com os sete indicadores de `METRICS` (`src/data/metrics.ts`) antes do painel, número em cima e descrição abaixo. Sem literais novos; alinhamento 1920/1366/390; mobile 2 ou 3 colunas; números no HTML; reduced-motion no valor final; par anunciado; contraste ≥ 4,5:1; home `Metrics.tsx` intocada.

### O que foi feito
Componente `src/components/MetricsBand.tsx`, CSS `.contato-indicadores*`, inserção em `contato/page.tsx`. Sem `CountUp` (Server Component; HTML serve `850+ 23+ 130+ 650+ 230+ 35+ 25+`). Arranjo **4+3** em grade de 8 colunas, 5º com `grid-column-start: 2`. Mobile 2 colunas. Overflow-x 0. Marcação `<ul>`/`<li>`, não `<dl>`. Fundo `#0f2b4a` → `#071d36`. Contraste número 14,52:1; rótulo ~11,5:1.

**Rework.** Comentário de `align-content: start` (declaração inexistente) reescrito: alinhamento pelo primeiro filho + stretch. `tabular-nums`: ganho é o 1 não ser mais estreito que o 8 *dentro* do mesmo número. `#0f2b4a` remedido após SIS-133: altura hero 522px (58svh) inalterada; erro 2–4 por canal; degrau mediano 7/255, máximo 21/255. Armadilha: `.motion-banner` do `next dev` falseava degrau para 200/255.

**Portões:** tsc limpo · eslint 18/0 · next build 0.

### Conferência
Três pontos de registro. Após rework: **aprovada**.

### Arquivos tocados
- `src/components/MetricsBand.tsx`
- `src/app/globals.css`
- `src/app/contato/page.tsx`

---

## SIS-133 — /contato — abertura em duas colunas: título à esquerda, descrição ao lado, e escrita maior

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-133/contato-abertura-em-duas-colunas-titulo-a-esquerda-descricao-ao-lado-e

### Pedido
A partir de 1024px, título e descrição lado a lado em `/contato`; abaixo empilha. Corpos maiores que 70,4px @1920 e 18px, registrados. Linhas do título sem órfã; linha da descrição 45–75 caracteres; contraste descrição ≥ 4,5:1; outras treze rotas intactas.

### O que foi feito
Tudo em CSS escopado por `.hero-backdrop--contato`; `PageHero.tsx` intocado. Título 80px de 1366 a 1920, 3 linhas; corpo 20px travado (clamp a 22px piorava a linha porque `container-lp` trava em 1116px). Vão teto 2,75rem. Contraste descrição 6,09:1 (pior pixel `rgb(54,86,117)`). Grade `minmax(0, 1fr) minmax(min(100%, 30rem), 1.12fr)` — descrição é a coluna maior. `padding-top` da coluna da descrição 1rem (delta 0 a 1366/1440/1920). Varredura caracteres: 44/47 a 1024 (caixa ~49ch), 56/44 de 1200+. Ressalva de 38ch caiu após o teto do vão. Faixa `min-height: 58svh` = 522px; conteúdo 426px.

**Portões:** tsc limpo · eslint 18/0 · next build 0.

### Conferência
Voltas por comentário obsoleto (`1.15fr` vs `1.12fr`), 85px recusado usado na conta, critério 45ch. 2ª passagem **aprovada**. Recomendação: citar por seletor, não por número de linha.

### Arquivos tocados
- `src/app/globals.css`

---

## SIS-132 — Mapa das unidades: trocar o mosaico OSM invertido por MapLibre + tiles vetoriais, sem chave

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-132/mapa-das-unidades-trocar-o-mosaico-osm-invertido-por-maplibre-tiles

### Pedido
Trocar o provedor por MapLibre GL + tiles vetoriais sem chave (OpenFreeMap), portando `ESTILO_ESCURO`. Três degraus: Google → vetorial → mosaico. Import dinâmico; sem WebGL cai no mosaico; sem sequestro de scroll; `jumpTo` com reduced-motion; pino da marca; atribuição visível; HTML de endereço/telefone/rota de pé sem JS.

### O que foi feito
`provedor: 'google' | 'vetorial' | 'mosaico'`. Estilo em `src/data/mapaEstiloEscuro.ts` (não o style hospedado). Source aponta para TileJSON `/planet`, não `{z}/{x}/{y}.pbf` com data de build.

**Armadilhas.** (1) Worker MapLibre 6 com `import.meta.url` vazio → `setWorkerUrl('/maplibre/maplibre-gl-worker.mjs')`, cópia via `scripts/copiar-worker-maplibre.mjs` em `predev`/`prebuild`. (2) `.maplibregl-map { position: relative }` zerava altura; corrigido com `h-full w-full`.

**Medições 1440×900.** Canvas 1114×510; atribuição no topo; zoom em x=1238; 1 canvas na troca de unidade; `cooperativeGestures: true`; sem WebGL → 48 tiles raster; reduced-motion `jumpTo`. Produção: biblioteca ~997 kB só após IntersectionObserver; chunk inicial 22 kB.

**Portões:** tsc limpo · eslint 18/0 · next build verde. Custo: OpenFreeMap sem SLA — degrau 3 permanece.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
Não há lista fechada no relatório. O texto cita `src/components/UnitsMap.tsx`, `src/data/mapaEstiloEscuro.ts`, `package.json` (`maplibre-gl`), `scripts/copiar-worker-maplibre.mjs`, worker em `/maplibre/`.

---

## SIS-130 — /contato — “Venha Fazer Parte do #timeSISTRAN!”: escrita ampliada, palco com marca d’água atrás e “Venha ser Sistran” como cartão dinâmico

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-130/contato-venha-fazer-parte-do-timesistran-escrita-ampliada-palco-com

### Pedido
Ampliar a escrita do fechamento de `/contato`; palco compartilhado com `#SomosSistraners` (marca d’água `#timeSISTRAN`); “Venha ser Sistran” como cartão de duas faces, link único para `/trabalhe-conosco`; essencial visível sem hover; reduced-motion; SIS-42 (`transform` vs `translate`); AA; performance com o mapa na mesma janela.

### O que foi feito
Palco extraído para `src/components/ui/PalcoReativo.tsx`; cartão para `src/components/ui/CartaoDuasFaces.tsx`. CSS `.social-*` → `.palco-*`, `.linkedin-card*` → `.cartao-duas-faces*` (zero `social-` em `globals.css`). `grade-tecnica` saiu. Geometria 1440: colunas `732px 320px`; cartão 320×416. Destino na frente: `Carreira · enviar currículo`. Reduced-motion: parado e visível. SIS-42 medido: `transform` no scroll, `translate` no ponteiro.

**AA.** Título sobre emenda clara 1,43:1 → variante `.palco-emenda-de-claro-curta` (150px, partida `#cfe7f7`). Corpo 3,19:1 sobre luz → véu `.palco-copy::before`. Após véu: branco 9,74/9,62/9,51.

**Performance produção:** mapa→palco mediana 116,7ms (igual ao `#social` da home); topo `/contato` 83,3ms. Custo ~33ms do palco, anterior a esta issue.

**Adendo.** Véu subiu para `.palco-copy` (home também falhava: 3,20/3,14/3,10 branco). Blur 28px no `::before`; inset `-2rem -3rem`. Contraste pós-blur home 10,62/8,56 a 1440.

Critérios de RH (`[~]`): escrita sem benefícios inventados; portal de vagas aberto.

**Portões:** tsc limpo · eslint 18/0 · next build ok.

### Conferência
Devolvida: véu só em `/contato`. Após medir a home e subir o véu: reconferência **corrigido**, In Review. Aprovação de RH e vagas seguem abertas.

### Arquivos tocados
- `src/components/ui/PalcoReativo.tsx`
- `src/components/ui/CartaoDuasFaces.tsx`
- `src/components/Social.tsx`
- `src/app/contato/page.tsx`
- `src/app/globals.css`
- Consumidores: home e `eventos-inovacao/page.tsx`

---

## SIS-129 — /contato — “Onde Estamos”: o mapa passa a ser o cartão inteiro, com seletor e endereço por cima

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-129/contato-onde-estamos-o-mapa-passa-a-ser-o-cartao-inteiro-com-seletor-e

### Pedido
Um único cartão escuro cujo fundo é o mapa; seletor e endereço sobrepostos à esquerda com véu; pílula e título fora, em `container-lp`. Endereço/telefone/rota em HTML. Provedor: Google, vetorial ou fallback OSM aceito. AA do véu no pior caso; sem paleta clara; atribuição visível; reduced-motion seco.

### O que foi feito
Arquivos: `UnitsMap.tsx`, `globals.css` (bloco SIS-129). `contato/page.tsx` não mudou. Grid de duas colunas saiu. Painel em fluxo, não `absolute`. `padding-top: 13rem` no estreito (209px de mapa a 390). Contraste com `#fff` forçado no mapa: branco 17,46 / 15,44 / 16,93:1. Véu 97–98% até 34% (depois corrigido na conferência). `pointer-events: none` no véu/painel, `auto` só em `button, a`. Defeitos: `.section-light h3/p/span` vencendo `text-white` → `on-dark`; `z-index: 0` no mapa soterrava ODbL. Mosaico 6×4 → 8×6. Sem JS: painel no HTML, piso `#0e1b2e`. Zoom Google: `RIGHT_CENTER` (`[~]`). Fallback OSM aceito (`[~]` chave). Comentário posterior: caminho MapLibre recomendado (viraria SIS-132).

**Rework conferência:** aritmética do véu — cartão 1116px, painel 33,0% a 1440 (folga 1 ponto), 38,3% a 1024 (borda na rampa). AA pela rampa lenta: `rgb(23,37,57)` = 15,44:1.

**Portões:** tsc limpo · eslint 18/0. Capturas `docs/capturas/tmp-129-*.png` (não versionadas).

### Conferência
Volta por comentário da folga de 4% falsa. Reconferência: aritmética corrigida, **In Review**. Provedor vetorial ficou para SIS-132.

### Arquivos tocados
- `src/components/UnitsMap.tsx`
- `src/app/globals.css`

---

## SIS-128 — /contato: o fundo atrás do painel “Entre em contato conosco” não pode ser azul chapado

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-128/contato-o-fundo-atras-do-painel-entre-em-contato-conosco-nao-pode-ser

### Pedido
Tratamento dinâmico atrás do painel só em `/contato`. Só `transform`/`opacity`; sem blur full-bleed; reduced-motion para visível; borda do painel legível; sem inset negativo na seção; verificado em 1920, 1366 e 390.

### O que foi feito
Camadas estáticas + malha reforçada; movimento por `animation-timeline: view()`. Zero JS novo. `.fundo-contato` `inset: 0`, `z-index: -1`, lajes `--longe` / `--perto`. Sem `blur`. Reduced-motion: `animationName: none`, `opacity: 1`. Amplitude de luminância 238,5 (1920) / 236,7 (1366) / 41,1 (390); cores distintas 11977 / 3779 / 1020. Malha: módulo `/ 2` = 48px, traço 20%, máscara radial, escopo `.fundo-contato-cena`. Chanfro `[~]`: `/contato` nunca teve `NotchDivider`; pico do escuro em 88%. Performance A/B headless: camadas não adicionaram custo mensurável (ruído do ambiente).

### Conferência
Devolvida: comentário afirmava `NotchDivider` na rota. Após reescrita: **corrigido**, In Review. Conta do conferente sobre consumidores do Notch também foi corrigida pelo executor (`/quem-somos` 10, `/parceiros` 2).

### Arquivos tocados
- `src/app/contato/page.tsx`
- `src/app/globals.css`

---

## SIS-127 — /contato: mover “Prefere e-mail?” para dentro do destaque do telefone, só nesta tela

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-127/contato-mover-prefere-e-mail-para-dentro-do-destaque-do-telefone-so

### Pedido
O e-mail comercial entra no destaque do telefone só em `/contato`. Home e modal sem e-mail; `mailto:` e AA; telefone continua o maior peso; texto do bloco relido; comentário de `contato/page.tsx` atualizado; 1920/1366/mobile.

### O que foi feito
Prop `mostrarEmail?: boolean`, padrão `false`, ligada só em `/contato`. E-mail abaixo do telefone (`.contact-dialog-fone-email`): 15,2px / peso 600 / sublinhado permanente vs telefone 16,8px / 800. Contraste e-mail: 8,28 / 5,18 / 8,27. Token `--contact-cyan` `rgb(20,200,245)`. Notas: sem prop “Ou se preferir, deixe uma mensagem abaixo…”; com prop “Prefere não ligar nem escrever?…”. Parágrafo solto removido; import `CONTACT_EMAIL` saiu da página. `overflow-wrap: anywhere`. Ressalva SIS-83.

### Conferência
**Passa**, In Review. Leitura de código, sem navegador (quebra do endereço em estreito não conferida em captura).

### Arquivos tocados
- `src/components/ContactPanel.tsx`
- `src/app/contato/page.tsx`
- `src/app/globals.css` ( degrau `.contact-dialog-fone-email`)

---

## SIS-126 — /contato: foto do escritório atrás da abertura “Preencha o formulário e fale com a gente!”

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-126/contato-foto-do-escritorio-atras-da-abertura-preencha-o-formulario-e

### Pedido
Foto do escritório cobrindo a faixa da abertura. Critérios: WebP e peso; `foco` próprio; AA do ciano; header e ScrollSpy legíveis; `alt=""`; reduced-motion idêntico (imagem).

### O que foi feito
`HeroImageBackdrop` + `.hero-backdrop--contato`. Foto **`escritoriosp1.jpg`**, não `escritoriosp.jpg` (já em 3 lugares; posada vira assunto). 179 kB JPG → `public/images/contato/contato-hero.webp` q72 **92 kB** (arquivo 94.374 bytes na conferência). Original permanece em `public/` porque `solutions.ts:28` consome o JPG. `foco="50% 55%"`. Véu 74/70/84% + 32%. Contraste: título 9,22/7,30/6,22; ciano 9,13/5,76/**4,88** (390; véu 34% dava 4,17); descrição 11,66/9,17/8,18. `alt=""`. `#topo` `ancoraTop = 144`.

### Conferência
**Confere.** Desvio da foto aceito. Critério `docs/fontes/` tratado como cumprido pela razão do consumidor em `solutions.ts`. Contraste/header/viewports não verificados pelo conferente (só declaração).

### Arquivos tocados
- `src/app/contato/page.tsx`
- `src/app/globals.css`
- `public/images/contato/contato-hero.webp`

---

## SIS-125 — Varredura por tela: índice das alterações pendentes, rota por rota

**Status:** In Review · **Labels:** conferido · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-125/varredura-por-tela-indice-das-alteracoes-pendentes-rota-por-rota

### Pedido
Índice das nove telas sem issue própria (university, trabalhe-conosco, blog, legado, solucoes/[slug], latam, labs, privacidade, transparência salarial). Não é issue de execução. Critérios: filhas com estado/bloqueio/próximo passo; padrões com tratamento; rotas indexáveis na navegação; ScrollSpy com `label`.

### O que foi feito
**## Entrega — rodada 2.** Nenhum código. Nove filhas com estado; SIS-117 pendente de conferência; SIS-123/124 Backlog jurídico. `/latam` textual até ativos regionais (SIS-121). ScrollSpy: 54 estáticas + 20 derivadas = 74 com `label`; 24 candidatas antes do limiar; QA Integrado e Connect API suprimidas (2 entradas). Critérios reescritos para não concluir filhas. Portões: `npm run lint` 24/0; tsc/build/copy-lock não repetidos. Arquivos: nenhum.

Rodada 1 do índice (09/09) atualizou a descrição Linear: padrões de description, pageSections, imagens, links mortos, sitemap/menu. `copy-lock --check` OK (1194). Lint então falhava por plugin `react-hooks` (SIS-182), declarado não cumprido.

### Conferência
Rodada 1: **VEREDITO: REPROVADO** (latam sem decisão de imagem; critérios de índice; cifra 58/58). Rodada 2: **VEREDITO: APROVADO**. Mantida In Review + `conferido`, não Done.

### Arquivos tocados
Nenhum (só descrições/comentários no Linear).

---

## SIS-122 — /sistran-labs: Guru de Seguros e Smart Miner aparecem duas vezes na mesma página, e a abertura tem três parágrafos com caixa alta no meio do texto

**Status:** In Review · **Labels:** conferido · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-122/sistran-labs-guru-de-seguros-e-smart-miner-aparecem-duas-vezes-na

### Pedido
Resolver sobreposição `SOLUCOES` × `ACCELERATORS`; tirar corpo da abertura; caixa alta só via CSS; decidir CTA de e-mail do meio; ids em `pageSections.ts`; 1920/1366/mobile.

### O que foi feito
Filtro derivado: `NOMES_COM_PAGINA_PROPRIA` de `ACCELERATORS`; `SOLUCOES_SO_AQUI` no DOM. Guru/Smart 1× cada; Churn e Fast Claims publicados. Corpo em `#labs-o-que-e`; abertura sem `description`. `h1` 70,4px @1920 (faixa média). Caixa mista no DOM + `uppercase` no CSS; highlight do h1 em caixa mista (prop `string`). E-mail do meio **fica** (`mailto:` único endereço escrito; `ContactCTA` vai a `/#contato`). `pageSections.ts`: `{ id: 'labs-o-que-e', label: 'O Labs' }`. Quatro paradas. `h2` `sr-only`. copy-lock não regenerado (já falhava).

**Portões:** tsc limpo · eslint src 18/0 · curl 200 · next build 0 · overflow-x 0.

### Conferência
**Aprovada.** Sete critérios. Sugestões: comentário “41 caracteres” é 37; colisão ScrollSpy 27px a 1280 (SIS-170); usar `npm run lint`; copy-lock pendente; Fast vs Fast Claims.

### Arquivos tocados
- `src/app/sistran-labs/page.tsx`
- `src/data/pageSections.ts`

---

## SIS-121 — /latam: “Alianzas” sem alianças, notícias sem destino, doze escritórios sem mapa

**Status:** In Review · **Labels:** conferido · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-121/latam-alianzas-sem-aliancas-noticias-sem-destino-doze-escritorios-sem

### Pedido
Alianzas com conteúdo ou rótulo honesto; notícias com destino ou sem aparência de clique; “Más info” distinguíveis; decisão de mapa e de fechamento; uma navegação por largura; tudo em `lang="es"`; 1920/1366/mobile.

### O que foi feito
Parada **Aseguradoras** (não inventar marcas; `clients.ts` é lista BR de tecnologia). Notícias: `glass-card` estático. `sr-only` com nome do produto nos três “Más info”. Mapa não entra (espera SIS-132). Fecha no card RRHH, sem `ContactCTA` em português. Nav âncoras `xl:hidden` vs ScrollSpy ≥1280. Overflow-x 0.

**2ª volta.** `navIdiomaForPath` em `pageSections.ts`; `ScrollSpy` `lang={idioma.lang}` e `aria-label`. `/latam`: `{ lang: 'es', rotulo: 'Secciones de esta página' }`. Compañía → Experiencia. Comentário mentiroso de `latam.ts` reescrito. `npm run lint` 24/0; tsc; build; copy-lock 1195 após as duas trocas.

**09/09:** decisão complementar — `/latam` permanece textual sem ativos regionais.

### Conferência
**DEVOLVIDA** por `lang` da nav lateral fora de `es`. Correção do conferente: troca Alianzas→Aseguradoras estava declarada. Conferência 2: **APROVADA**. `conferido`. Pontos parados: marcas, URLs, mapa, CTA em espanhol.

### Arquivos tocados
- `src/app/latam/page.tsx`
- `src/data/latam.ts`
- `src/data/pageSections.ts`
- `src/components/ui/ScrollSpy.tsx`

---

## SIS-120 — /solucoes/[slug]: as sete páginas de produto são texto corrido, sem imagem, sem volta e sem navegação entre elas

**Status:** In Review · **Labels:** conferido · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-120/solucoesslug-as-sete-paginas-de-produto-sao-texto-corrido-sem-imagem

### Pedido
Sem duplicar `page.lead`/`accel.description`; parágrafo órfão em seção; decisão de imagem; volta a `/solucoes` e nav entre os sete com `aria-current`; ids + `pageSections.ts`; `key` estável; sete páginas em 1920/1366/mobile.

### O que foi feito
`page.lead` fica; `accel.description` sai (continua na vitrine). Páginas **textuais** (sem asset por slug). Nav fichas + link “Ver todas as soluções e serviços”. Atual é `<span aria-current="page">`. `idDoBloco()` compartilhado com `pageSections.ts` (`SECOES_DE_ACELERADOR`). qa-integrado e connect-api: 0 paradas (regra &lt;3). `chaveDoBloco`; `startIndex` removido. Eyebrow igual nas sete. 21 medições overflow 0. copy-lock não regenerado.

**Portões:** tsc 0 · eslint src 18/0 · curl 200 nas sete · next build 0 SSG.

### Conferência
**APROVADO.** Achado: ScrollSpy sobre o hero a 1280–1366 (geometria pré-existente, issue própria). Resíduo posterior: cabeçalho de `pageSections.ts` ainda diz que `/solucoes/[slug]` não tem chave.

### Arquivos tocados
- `src/app/solucoes/[slug]/page.tsx`
- `src/data/acceleratorPages.ts`
- `src/data/pageSections.ts`

---

## SIS-119 — /transformacao-legado: página sem abertura, sem h1 e fora do menu

**Status:** In Review · **Labels:** conferido · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-119/transformacao-legado-pagina-sem-abertura-sem-h1-e-fora-do-menu

### Pedido
`PageHero` com h1 e `#topo`; decisão de menu; reavaliar exclusão do ScrollSpy; `StackScenes` após a mudança; sem texto da home; 1920/1366/mobile.

### O que foi feito
`PageHero` título “Transformação de Legado”; **sem `description`** (metadata promete “método em quatro movimentos” e `#sistema` está comentado no DOM). Eyebrow “Arquitetura e roadmap”. Menu: filha de Soluções (`nav.ts`), 7 itens de primeiro nível, overflow header 0. ScrollSpy: 3 paradas `#topo` / `#sinais` / `#roadmap`; `#sistema` comentado. `StackScenes` sem `variante`, sticky (sem ScrollTrigger). ImpactSequence só na home.

**Portões:** tsc limpo · eslint src 18/0 · curl 200 · next build 0.

### Conferência
**APROVADA.** Recuos da description e de `#sistema` aceitos. Sugestão: comentário “quatro seções” vs três paradas; rota entra na SIS-170; metadata.description mentindo; usar `npm run lint`.

### Arquivos tocados
- `src/app/transformacao-legado/page.tsx`
- `src/data/nav.ts`
- `src/data/pageSections.ts`

---

## SIS-118 — /blog e /blog/[slug]: a seção está órfã no site e o post tem três links mortos

**Status:** In Review · **Labels:** conferido · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-118/blog-e-blogslug-a-secao-esta-orfa-no-site-e-o-post-tem-tres-links

### Pedido
Cada slug com o próprio corpo em `blog.ts`; decisão de navegação; rótulos de sessão viram link ou saem; grade sem coluna vazia; pageSections se ganharem seções.

### O que foi feito
Premissa corrigida: **1 post**, não 2. `Post.body` em blocos tipados (não HTML string/MDX); `default: never`. Aspas curvas no dado. “ASSISTA…” comentado no lugar. Blog no rodapé Institucional; sitemap intacto. Grade deriva de `POSTS.length` (`max-w-md` com 1). `pageSections.ts` sem alteração (critério dos 3). Title “Blog · Sistran”.

**Portões:** tsc limpo · eslint src 18/0 · next build 0 · curl 200 · overflow 0 · 1 h1.

### Conferência
**Aprovado.** Conferente rodou `npm run lint` 24/0. `/blog/nao-existe` 404. Sugestões: link voltar do post; comentário pageSections (resíduo SIS-120); nota da sidebar em `blog/page.tsx`. URLs dos webinars paradas.

### Arquivos tocados
Não listados em bloco único no relatório. O texto cita `src/data/blog.ts`, `src/app/blog/[slug]/page.tsx`, `src/app/blog/page.tsx`, `src/components/Footer.tsx`.

---

## SIS-117 — /trabalhe-conosco: o currículo enviado não vai a lugar nenhum, e a página não tem vagas

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-117/trabalhe-conosco-o-curriculo-enviado-nao-vai-a-lugar-nenhum-e-a-pagina

### Pedido
Destino do formulário ligado e verificado; confirmação ao candidato; `accept`/limite/validação; aviso de privacidade; verdade sobre vagas; anúncios a11y; seções em `pageSections.ts`.

### O que foi feito
Auditoria: `actions/contato.ts:70-87` devolve sucesso sem e-mail/storage/ATS. Formulário **comentado no lugar** (FIELDS completo). No `#curriculo`: verdade sobre vagas, LinkedIn (`LINKEDIN_URL`), aviso de que não há coleta (sem link para política só de cookies). `CampoArquivo`: `accept=".pdf,.doc,.docx"`, 5 MB, validação por extensão, `role="alert"`. Destino real **não atendido** (`[~]`). 11/09: pedido da usuária para voltar o form → SIS-223.

### Conferência
Devolvida: tags cruzadas (junto SIS-137). 2ª passagem: **tecnicamente aprovada**; fica parada por decisão de produto (RH), sem `conferir`. Destino do currículo bloqueia Done.

### Arquivos tocados
- `src/app/trabalhe-conosco/page.tsx`
- `src/components/forms/DemoForm.tsx` (`CampoArquivo`)

---

## SIS-116 — /sistran-university: a página é só a abertura — falta a página inteira

**Status:** In Review · **Labels:** conferido · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-116/sistran-university-a-pagina-e-so-a-abertura-falta-a-pagina-inteira

### Pedido
Abertura com título + uma frase; ≥3 seções com id; rota em `pageSections.ts`; números 60/17/2022 como indicadores; ≥1 imagem WebP com alt desta página; nenhum texto novo da fonte; 1920/1366/mobile.

### O que foi feito
Description = última frase do 1º parágrafo (154 caracteres). Seções `#university-programa`, `#university-unidep`, `#university-numeros` com títulos literais da fonte. “2022” no h2, não em cartão (desvio declarado). Fotos `1/2/3-turma-Gerando-Talentos.webp` 41/67/56 KB (SIS-109); alt desta rota. Galeria estática. Link `/esg#esg-social`. Frase agramatical da fonte não reescrita.

**Portões:** tsc limpo · eslint src 18/0 · next build 0 · overflow 0.

### Conferência
**APROVADA.** Fidelidade frase a frase contra `03-sistran-university.md`. Conferente usou `npm run lint` 24/0. Sugestão: “em ESG” no link é texto novo não declarado; metadata sem description.

### Arquivos tocados
Não listados em bloco. O relatório opera em `src/app/sistran-university/page.tsx` e `src/data/pageSections.ts`.

---

## SIS-115 — /eventos-inovacao: imagem em destaque no centro da tela e preview reduzido a anterior/próximo

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-115/eventos-inovacao-imagem-em-destaque-no-centro-da-tela-e-preview

### Pedido
Imagem centralizada e inteira; preview só anterior/próximo; posição 01/15; controles reais; pontas com `aria-disabled`; 15 eventos alcançáveis; preview discreto com contraste/alvo; AA nas 15 fotos; 1920/1366/mobile.

### O que foi feito
Redesenho: tokens `--evento-painel` / `--evento-caixa` e grade de duas colunas removidos. Controles em barra `position: fixed` na base (`IntersectionObserver` `data-visivel`). ResizeObserver publica `--evento-barra`. Centro @1920: 961 (desvio 1px); @1366 desvio 0; `dentro: true`. Foto @1366 987×555; @1920 1125×633. Folga foto–barra +20px (antes −75px). Posição `.evento-posicao` tabular-nums. Botões nomeiam o destino; pontas `aria-disabled` focáveis, sem wrap. Opacidade 0.78; alvo 44–46px. AA pior caso evento 01: 5,94 título / 5,33 descrição. A 390 controles `display: none`. Tokens migrados de `:root` para `.evento-cena`. Filtros: seletor `.evento-navegador .evento-filtros`.

**Portões:** next build verde 27 rotas · tsc limpo · eslint src 19 avisos / 0 erros (baseline da época).

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
Não declarados em lista. O relatório aponta `src/components/EventsGrid.tsx` e `src/app/globals.css`.

---

## SIS-114 — /esg · SOCIAL: sombra pulsante atrás dos cards de Fundación Huerta Niño e Fundación Aguas

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-114/esg-social-sombra-pulsante-atras-dos-cards-de-fundacion-huerta-nino-e

### Pedido
Nos dois cards da seção SOCIAL de `/esg` (Fundación Huerta Niño e Fundación Aguas, já com as imagens da SIS-110), colocar sombra atrás do card e deixá-la pulsante, para soltá-los do fundo azul claro. Onde: `src/app/esg/page.tsx`, cards do `.map()` de `SOCIAL` (`glass-card relative overflow-hidden` + `.corner-accent`). Não animar `box-shadow` (pseudo atrás do card, `opacity`/`transform`); a sombra não pode ser cortada pelo `overflow: hidden`; com `prefers-reduced-motion: reduce` a pulsação para e a sombra permanece visível; pausa em `hover`/`focus-within` ou amplitude baixa (WCAG 2.2.2); sem `backdrop-filter` nem blur grande; mesmos ritmo/sombra nos dois cards, sem invadir Gerando Talentos nem o rodapé; `corner-accent` preservado. Verificado em 1920×1080, 1366×768 e mobile.

### O que foi feito
Implementado: `.esg-apoio` no `globals.css` + um wrapper por cartão em `src/app/esg/page.tsx`.

**Três decisões que não são cosméticas.**
1. A sombra mora num wrapper, não no `<article>`: o `overflow: hidden` dele — que é o que faz a foto sangrar até a borda arredondada — recortaria uma camada de `inset` negativo em nada. Mesmo arranjo da pluma do `.evento-cartao`.
2. Só `opacity` e `transform: scale` animam, nunca `box-shadow`: sombra de verdade não é escalável pela GPU. Daí a sombra ser um `radial-gradient` num `::before` de `inset: -24px`, com `border-radius: calc(var(--radius-card) + 24px)`.
3. Amplitude deliberadamente pequena (opacidade 0,55→1, escala 0,97→1,02, ciclo de 7s `cubic-bezier(0.37,0,0.63,1)`), na convenção do `social-card-flutuar` que já existe. O segundo cartão tem `animation-delay: -3.5s` — negativo, metade do ciclo, para ele já começar no meio da volta; um valor positivo o deixaria parado até lá.

**Acessibilidade.** `animation-play-state: paused` em `:hover` e `:focus-within` é a resposta ao WCAG 2.2.2 (movimento infinito acima de 5s). Em `prefers-reduced-motion: reduce` a animação para em estado visível (`opacity: 1; transform: none`) — sem isso o reset global (`animation-iteration-count: 1`) congelaria no frame 0, a 55% de opacidade. `isolation: isolate` no wrapper porque sem ele o `z-index: -1` da camada a jogaria para trás do fundo da seção.

Verificado a 1920 na seção SOCIAL: halo suave em volta dos dois cartões, defasados entre si, sem invadir o bloco Gerando Talentos acima nem a fronteira com GOVERNANCE abaixo, e o `corner-accent` segue legível sobre o vidro.

Gate: `tsc --noEmit` limpo, `next build` OK, `eslint` 19 warnings / 0 errors (baseline).

### Conferência
**Aprovada.** Conferido na árvore: `.esg-apoio` no `globals.css` e o wrapper em `esg/page.tsx:268`. Os nove critérios batem. Nada anima `box-shadow`; a camada mora no wrapper, não no `<article>`; `prefers-reduced-motion: reduce` para em estado visível; `animation-play-state: paused` em `:hover` e `:focus-within`; `animation-delay: -3.5s` no `:nth-child(2)`; `inset: -24px` contra o `mt-14` (56px) que separa do Gerando Talentos. Observação não bloqueante: os dois cartões ficam a `gap-6` (24px) e cada pluma avança 24px — as camadas se superpõem no vão, em fases opostas; o conferente não abriu navegador e pediu só confirmação visual a 1920 e 768.

### Arquivos tocados
- `src/app/globals.css`
- `src/app/esg/page.tsx`

---

## SIS-113 — /esg: imagem de fundo atrás do título da abertura, com sombra leve e título deslocado para a esquerda

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-113/esg-imagem-de-fundo-atras-do-titulo-da-abertura-com-sombra-leve-e

### Pedido
Na abertura de `/esg`: colocar `public/images/esg/esg.jpg` (348 KB) como fundo atrás do título; aplicar sombra leve dissolvida (sem aresta reta, risco da SIS-112); deslocar o título mais para a esquerda. Texto inalterado (compromisso ESG / highlight “práticas sustentáveis”). Escopar em `/esg` sem mudar as outras 13 aberturas do `PageHero` compartilhado; reaproveitar o padrão do `HeroVideoBackdrop`. Contraste AA do título, highlight e descrição sobre a foto; `next/image` com `priority` e `sizes` de largura cheia; `id="topo"` preservado; com `prefers-reduced-motion` tudo visível. Verificado em 1920×1080, 1366×768 e mobile.

### O que foi feito
Implementado com um componente novo, `src/components/ui/HeroImageBackdrop.tsx`, e uma linha de uso em `src/app/esg/page.tsx`.

**Por que componente novo e não prop no `HeroVideoBackdrop`.** Ele reaproveita as mesmas classes `.hero-backdrop*`, então o empilhamento fechado, o `-7rem/-9rem` que faz a mídia subir por trás do header, o véu calibrado na SIS-94 e a pluma da SIS-112 vêm de graça. A diferença é só a mídia (`next/image` em vez de `<video>`) — e por ser imagem não há laço, autoplay nem nada a pausar, então o componente é de servidor, sem `'use client'`. Uma prop `tipo` seria dois corpos dentro de um `if` e obrigaria a rota estática a virar cliente sem precisar.

**Peso.** O `esg.jpg` que já estava na pasta (1031×690, JPEG de 348 KB) virou `.webp` de 48 KB nas mesmas medidas, sem redimensionar; o original foi para `docs/fontes/esg/`, fora de `public/`. A foto é pequena para uma faixa de 1920 e o navegador amplia — aceitável porque ela vive sob o véu pesado; os 348 KB não seriam.

**Enquadramento e acessibilidade.** `object-position: 50% 42%` — o `cover` corta em cima e embaixo, e 42% preserva os rótulos e o globo em vez de sobrar a mesa desfocada. `alt=""` de propósito: nada na foto é informação, e os três eixos que ela rotula são exatamente os três títulos de seção logo abaixo.

Verificado a 1920×1080, 1366×768 e 390×844: título e `highlight` em ciano legíveis sobre a terça parte escura da imagem, globo/ESG/mão intactos à direita, sem aresta na pílula do header, ScrollSpy “INÍCIO” no lugar. `id="topo"` e as outras 13 aberturas intocados. Sem movimento novo.

Gate: `tsc --noEmit` limpo, `next build` OK, `eslint` 19 warnings / 0 errors (baseline).

### Conferência
**Aprovada.** Conferido na árvore: `HeroImageBackdrop.tsx` (70 linhas) e uso em `esg/page.tsx:136-150`. Componente de servidor de fato; reaproveita `.hero-backdrop*`; `fill` + `sizes="100vw"` + `priority`; `esg-hero.webp` = 47.962 B; original 348.203 B em `docs/fontes/esg/`. O deslocamento do título a partir de 1280px (`padding-left: 10rem`) casa com o `matchMedia('(min-width: 1280px)')` do `ScrollSpy`; abaixo de 1280 o recuo cai para o `clamp`. `max-width: none` no `container-lp` desta abertura não solta a medida de leitura (`max-w-[46ch]` / `max-w-2xl`). Portões e as três larguras: relato do executor, não verificação do conferente.

### Arquivos tocados
- `src/components/ui/HeroImageBackdrop.tsx`
- `src/app/esg/page.tsx`
- `public/images/esg/esg-hero.webp`
- `docs/fontes/esg/esg.jpg`

---

## SIS-112 — /solucoes: as sombras do vídeo de abertura estão em arestas retas — deixar a passagem sutil

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-112/solucoes-as-sombras-do-video-de-abertura-estao-em-arestas-retas-deixar

### Pedido
No bloco de abertura de `/solucoes` (`HeroVideoBackdrop`), as sombras terminam em linha reta (laterais e encontro com a barra azul do topo). Fazer as sombras dissolverem, sem aresta perceptível, sem perder o contraste AA do título e do eyebrow (opacidades da SIS-94). Investigar `.hero-backdrop-veu`, `.hero-backdrop-midia`, `.hero-backdrop-video` e o próprio arquivo de vídeo. Conferir `/quem-somos` e `/eventos-inovacao`. Sem `backdrop-filter` nem blur em área grande. Verificado em 1920×1080, 1366×768 e mobile.

### O que foi feito
Implementado: a pluma do topo das aberturas com vídeo/foto passou a ser `.hero-backdrop-veu::before` — quatro `linear-gradient` de `rgba(3,20,40,0.5–0.55)` dissolvendo em 56px, mesmo arranjo do `.evento-cartao::after`, que é a “pluma” canônica do projeto. A camada vive fora do nó com `overflow: hidden`, senão seria recortada em nada.

Verificado a 1920×1080 nas quatro aberturas com mídia: a mídia sobe por trás do cabeçalho fixo e some sem aresta — não há mais a linha reta onde a pílula do header cruzava o vídeo. Conferido também a 1366×768 e 390×844 (na largura de celular o header é a pílula compacta e a pluma cobre a mesma faixa). Sem movimento novo, portanto nada a fazer em `prefers-reduced-motion`.

Gate: `tsc --noEmit` limpo, `next build` OK, `eslint` 19 warnings / 0 errors (baseline).

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/app/globals.css`

---

## SIS-111 — /eventos-inovacao: centralizar e proporcionar o texto sobre a imagem, e deixar o preview lateral mais discreto

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-111/eventos-inovacao-centralizar-e-proporcionar-o-texto-sobre-a-imagem-e

### Pedido
Depois do layout da SIS-106: conter o bloco de texto (eyebrow, número, título, descrição, botão) dentro da imagem, centralizado, com escala proporcional, sem vazar nem cobrir o card seguinte; reduzir o peso visual do preview lateral sem perder acessibilidade. Critérios reescritos em 03/09/2026 após a SIS-115 (barra flutuante na base no lugar do preview lateral). O chip do YouTube saiu para a SIS-131. Aceite de texto: `.evento-texto` com `width: min(62ch, --evento-largura * 0.72)`, `margin-inline: auto`, `text-align: center`; `font-size` ancorado em `--evento-largura`; fatias de `92svh` com `sticky bottom`; contraste AA medido na SIS-115 (pior caso 5.94 / 5.33, evento 01). Pendente: anúncio de estado à tecnologia assistiva e reverificação visual nas três larguras após a SIS-115.

### O que foi feito
Implementado (CSS em `src/app/globals.css`, sem mudança de componente).

**Causa raiz medida, não inspecionada.** A foto (`.evento-cartao`) se posiciona contra a viewport, dentro do palco full-bleed; o quadro de texto (`.evento-quadro`) se posiciona dentro da coluna de grid do `.container-lp`. Dois sistemas de coordenadas. Medido a 1920: foto em x=60..1185, texto em x=402..1198 (vazava 13px à direita e sobrava 342px à esquerda); o quadro terminava 136px abaixo da base da foto, porque o `sticky bottom: 5.5rem` prende à viewport enquanto a base da foto está 224px acima.

**Correção.** Foto e texto passaram a derivar das mesmas variáveis (`--evento-caixa`, `--evento-largura`, `--evento-foto-esq`, `--evento-foto-base`). O texto ficou centralizado na largura da foto (72% dela, `min(62ch, …)`), com título e descrição em `clamp()` proporcional à caixa.

**Verificado com Playwright.** Horizontal, contenção exata: 1920 → foto `[37,1162]` == quadro `[37,1162]`; 1366 → `[27,927]` == `[27,927]`. Vertical (foto t=224 b=856 a 1920): quadros pinados em `[383,767]`, `[558,760]`, `[470,754]` — todos dentro da foto; o quadro seguinte entra em 851–864, folga de 97px. A 1366 (foto t=131 b=637): `[168,524]` e `[242,431]`, folgas de 72px.

**Escrim recalibrado em duas camadas.** Núcleo estreito e forte (44%/122%, 0.95) + queda larga e fraca (72%/150%, 0.5), com máscara vertical. Calibrado no evento 02 (ITC Vegas).

**Painel de navegação** com hierarquia real: itens inativos a 50% de opacidade e miniatura em `saturate(0.35)`; alvo de 44px; `saturate` sem transição em `prefers-reduced-motion`.

**Mobile intocado** — tudo atrás de `@media (min-width: 1024px)`; conferido a 390×844.

Gate: `tsc --noEmit` limpo, `next build` OK, `eslint` 19 warnings / 0 errors (baseline), `copy-lock` 2105 textos.

### Conferência
Não há `VEREDITO: APROVADO`. Há **reavaliação após a SIS-115** (leitura estática, sem navegador): texto sobre a imagem preservado (contenção, escala, sticky, contraste AA). Preview lateral caducou (virou barra na base; espírito atendido com opacidade 0.78 e alvo 44–46px). Foco visível feito (`:focus-visible`, anel de 2px); `aria-current` sem objeto. Achado fora da SIS-115: o chip “Assista no YouTube” é `<span>` sem `href`/`onClick` e `events.ts` não tem URL de vídeo — recomendação de issue própria (depois SIS-131). Verificação nas três larguras precisa ser refeita. Nada alterado no código nem no status.

### Arquivos tocados
- `src/app/globals.css`

---

## SIS-110 — /esg · SOCIAL: colocar as imagens de Fundación Huerta Niño e Fundación Aguas nos cards

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-110/esg-social-colocar-as-imagens-de-fundacion-huerta-nino-e-fundacion

### Pedido
Na seção SOCIAL de `/esg`, os dois cards só-texto ganham imagem: Huerta Niño → `public/images/esg/Huerta-Nino.jpg` (228 KB); Aguas → `public/images/esg/Aguas.jpg` (179 KB). Textos e links inalterados. Array `SOCIAL` com campo de imagem; `.map()` desenha os cards. Coordenar com SIS-109 (Gerando Talentos sai do grid); ajustar `lg:grid-cols-3` para duas colunas; `alt` descritivo; grafia exata dos arquivos; `next/image` com `sizes` coerente; mesma forma nos dois; `corner-accent` visível. Verificado em 1920×1080, 1366×768 e mobile.

### O que foi feito
Feito na mesma passada da SIS-109.

**As duas fotos entraram** como campo `image` (`src` + `alt`) no array `SOCIAL`, só estes dois itens:
- Huerta Niño → `/images/esg/Huerta-Nino.jpg` — “Crianças e voluntários em uma horta agroecológica construída pela Fundación Huerta Niño”
- Aguas → `/images/esg/Aguas.jpg` — “Comunidade atendida pelo projeto Fundación Aguas com acesso a água potável”

Sem conversão: já eram JPG 1247×832 de 223 KB e 175 KB; `next/image` serve WebP redimensionado.

**Mesma forma:** foto no topo (`h-52 object-cover`), texto e link abaixo; cartão `p-0`, respiro `p-7` no bloco de texto.

**Grid:** `md:grid-cols-2` em vez de `lg:grid-cols-3`.

**`corner-accent`:** desceu para o bloco de texto (`relative`). No canto do `<article>` cairia em cima da foto.

**`sizes`:** `(max-width: 767px) 92vw, (max-width: 1279px) 46vw, 560px` — medido em 1920: 544px de caixa em cada card.

Grafia exata (`Huerta-Nino.jpg`, `Aguas.jpg`). Textos e os dois links externos inalterados (rótulos “Saiba mais sobre a Fundación Huerta Niño” / “Conheça melhor o projeto Fundación Aguas”).

**Verificação** — 1920×1080, 1366×768 e 390×844: imagens `complete && naturalWidth > 0`, dois `<article>` sem buraco, `overflow-x` 0, 0 erro de console. `tsc --noEmit` limpo, `next build` compila, `eslint src` 0 erros. Capturas em `docs/capturas/sis109-110-esg-social-1920.png` e `-mobile.png`.

### Conferência
**Aprovada.** Conferido na árvore contra `src/app/esg/page.tsx:261-308`. Arquivos no disco 228.261 B e 179.047 B; `md:grid-cols-2`; conta de `sizes` refeita (`container-lp` 1180px → 546px por coluna, degrau 560px correto). Três larguras e gates: relato do executor, não verificação do conferente.

### Arquivos tocados
- `src/app/esg/page.tsx`
- `public/images/esg/Huerta-Nino.jpg`
- `public/images/esg/Aguas.jpg`

---

## SIS-109 — /esg · SOCIAL: dar ao “Projeto Gerando Talentos” um bloco próprio, com logo e as fotos das três turmas

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-109/esg-social-dar-ao-projeto-gerando-talentos-um-bloco-proprio-com-logo-e

### Pedido
Na seção SOCIAL de `/esg`, Gerando Talentos deixa de ser um dos três cards iguais e ganha bloco de destaque com logo (`logo-Gerando-Talentos.png`) e fotos das três turmas. Texto dos dois parágrafos inalterado. Sair do array `SOCIAL` ou campos opcionais; fundo claro vs. escuro (seção `section-light-blue`); otimizar assets (~2 MB); grafia exata dos arquivos; `next/image` + `alt` descritivo; fotos alcançáveis com reduced-motion e teclado; Huerta Niño e Aguas preservados sem mídia neste pedido. Verificado em 1920×1080, 1366×768 e mobile.

### O que foi feito
**Bloco próprio, fora do array.** `GERANDO_TALENTOS` em `src/app/esg/page.tsx`. Layout em duas colunas: logo + título + dois parágrafos à esquerda; três turmas à direita (1ª grande, 2ª e 3ª lado a lado).

**Fundo: claro.** Referências pretas abririam duas fronteiras claro/escuro (dois `NotchDivider`). Contraste escuro veio da logo (placa navy com moldura laranja).

**Galeria estática, não carrossel.** Três fotos no DOM ao mesmo tempo. Cada foto é `<figure>` com `<figcaption>` (`1ª/2ª/3ª TURMA`) e `alt` descritivo.

**Assets: 2,3 MB → 197 KB.** WebP sem redimensionar (turmas 750×422): logo 815 KB → 33 KB (alfa); 1ª turma 163 KB → 41 KB; 2ª 569 KB → 67 KB; 3ª 560 KB → 56 KB. Originais em `docs/fontes/esg/`, fora de `public/`. `public/images/esg` inteira 612 KB (contando os JPG da SIS-110).

**`next/image` com `sizes`:** medido em 1920: logo 240px, 1ª turma 532px, 2ª/3ª 257px. `width`/`height` nas medidas do arquivo.

**ScrollSpy:** o bloco não virou entrada própria. `/esg` segue com os quatro itens da SIS-100.

**Verificação** — 1920×1080, 1366×768 (com `prefers-reduced-motion: reduce`) e 390×844: 3 `<figcaption>`, imagens completas, `overflow-x` 0, 0 erro de console. `tsc --noEmit` limpo, `next build` compila, `eslint src` 0 erros (19 avisos). Capturas: `docs/capturas/sis109-110-esg-social-1920.png` e `-mobile.png`. Texto idêntico; Huerta Niño e Aguas mantidos (mídia na SIS-110).

### Conferência
**Aprovada** na árvore: constante própria, galeria estática, `sizes` 560px/272px, originais 2,40 MB em `docs/fontes/esg/`, WebP 41.938 / 68.448 / 57.666 B e logo 33.714 B. Ponto de atenção (não bloqueia): seis PNG `esg-1.png`…`esg-6.png` em `public/` (~1,56 MB) sem referência — depois **corrigido** pelo conferente: são insumos da SIS-139, mais seis em `public/images/governance/` da SIS-141; condição de fechamento daquelas issues é mover os PNG originais para `docs/fontes/esg/` após conversão. Portões e larguras: relato do executor.

### Arquivos tocados
- `src/app/esg/page.tsx`
- `public/images/esg/` (WebP da logo e das três turmas)
- `docs/fontes/esg/` (originais)

---

## SIS-108 — /parceiros-e-implementacoes: seção “Implementações” — remover o “02”, o mosaico de cards e a parede de logos, e usar a faixa clara de marcas

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-108/parceiros-e-implementacoes-secao-implementacoes-remover-o-02-o-mosaico

### Pedido
Na seção Implementações de `/parceiros-e-implementacoes`: remover “02 ·” do eyebrow; remover `ImplementationsMosaic` e `ClientWall`; colocar a faixa clara de marcas (`SignalMarquee`, mesma da home). Resolver fronteira claro/escuro; sem componente órfão; reduced-motion com marcas alcançáveis; `id="implementacoes"` preservado. Verificado em 1920×1080, 1366×768 e mobile.

### O que foi feito
`src/app/parceiros-e-implementacoes/page.tsx`: eyebrow `Implementações`; a seção 01 também perdeu o número (`Parceiros`). `ImplementationsMosaic` e `ClientWall` fora; `SignalMarquee` entre dois chanfros. Arquivos removidos: `src/components/ClientWall.tsx`, `src/components/ImplementationsMosaic.tsx` (únicas montagens). O `id="clientes"` do `ClientWall` não era destino de link.

Mosaico e parede liam a mesma lista `CLIENTS` — troca 1-por-1 com duplicata removida. `SignalMarquee` filtra por `c.logo`; as 15 entradas ativas têm logo: Samplemed, Virtusa, ITG, Microsoft Azure, Pega, AWS, ST-IT, Addactis, Sys4B, FRISS, Sensedia, SAP, Picsel, Earnix, Dacadoo.

Fronteira: `NotchDivider cor="#f5faff"` (invertido acima, normal abaixo). CSS: `.implementacoes-faixa .lp-signals { border-bottom: 0 }` (fio de 1px da home seria terceira linha sobre navy). Eyebrow “PARCEIROS” e linha ciano da base já não existem (SIS-101). Observação: sem o `02 ·`, eyebrow e H2 ficaram idênticos.

Verificações em 1920×1080, 1366×768 e 390×844: `id="implementacoes"`; mosaico/parede ausentes; faixa `background: rgb(245,250,255)` e `border-bottom: 0px`; 15 marcas; 0 overflow; com `prefers-reduced-motion: reduce`, `animation-name: none`, viewport `overflow-x: auto` e `scrollWidth > clientWidth`. `tsc --noEmit` limpo, build compila, lint 25 warnings / 0 erros. Capturas `docs/capturas/sis108-faixa-1440.png` e `sis108-faixa-390.png`.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/app/parceiros-e-implementacoes/page.tsx`
- `src/components/legacy/SignalMarquee.tsx` (uso)
- `src/components/ClientWall.tsx` (removido)
- `src/components/ImplementationsMosaic.tsx` (removido)
- `src/app/globals.css` (`.implementacoes-faixa`)

---

## SIS-107 — /eventos-inovacao: ajustar a transição da grade de eventos para a seção “Siga a Sistran no LinkedIn”

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-107/eventos-inovacao-ajustar-a-transicao-da-grade-de-eventos-para-a-secao

### Pedido
A passagem da grade de eventos para `#sistran` / “Siga a Sistran no LinkedIn” tem corte abrupto, segunda emenda no degradê e vazio acima do título. Uma única transição navy→azul (chanfro/degradê), sem segunda emenda, fechar a grade de propósito, coerente com SIS-103; reduced-motion com tudo visível. Verificado em 1920×1080, 1366×768 e mobile.

### O que foi feito
**Causa raiz medida.** Os “dois cortes” eram dois degradês empilhados nos mesmos ~200px: (1) `.eventos-emenda-base` sem `top`/`bottom` pintava fora da seção (a 1440×900, `#eventos` terminava em y=13086 e a faixa ia de 13086 a 13266, 180px da Social); (2) a Social pintava a EMENDA 6 em todas as rotas (`linear-gradient(#d2e5ed 0, transparent 220px)` na regra base de `.social-palco`), só faz sentido na home.

**Correções.** `.eventos-emenda-base` ganhou `bottom: 0`; altura `clamp(140px, 24vh, 280px)`; degradê a partir de `#06304f`. EMENDA 6 virou `.social-emenda-de-claro`, só na home; `Social` ganhou prop `className`. `/eventos-inovacao` recebe `.social-de-cena-escura` (respiro de cima 4rem / 5.5rem ≥768px; seletor `.social-palco.social-de-cena-escura` porque `md:py-32` ganhava por ordem — medido 128px). `/trabalhe-conosco` sem nenhuma das duas.

**Degrau residual.** Radial ciano `at 20% 20%` da Social no primeiro pixel; centro descido para `45%` e máscara de entrada de 300px nas luzes e no orb. Degrau amostrado 4px acima/abaixo: 1920 pior 1/6/9; 1440 0/6/10; 1366 1/7/5; 390 0/1/2. ≤ 4% no pior ponto.

**Verificações.** `emBot === socTop` nas quatro larguras; 0 overflow; reduced-motion: eyebrow e H1 `opacity: 1`, `transform: none`, vídeo do hero pausado em `currentTime: 0`; home com EMENDA 6. `tsc --noEmit` limpo, `npm run build` passa, `npm run lint` 25 warnings / 0 erros. Captura `docs/capturas/sis107-emenda-1440.png`.

### Conferência
Não há `VEREDITO: APROVADO`. **Reavaliação após a SIS-115:** `FATIA` continua `92svh`; `.eventos-emenda-base` em `bottom: 0`. Risco novo: barra flutuante `position: fixed` com `IntersectionObserver` em `isIntersecting` cru sobre a seção inteira (quinze telas) — a pílula pode pairar sobre a emenda na saída. Deduzido do código, precisa de confirmação visual. Os oito critérios da transição em si não foram reinspecionados visualmente. Nada alterado no código nem no status.

### Arquivos tocados
- `src/app/globals.css`
- `src/components/EventsGrid.tsx` (comentários)
- componente `Social` (prop `className`; classes `.social-emenda-de-claro`, `.social-de-cena-escura`)
- `src/app/eventos-inovacao/page.tsx`
- `src/app/trabalhe-conosco/page.tsx` (ausência da emenda de claro)

---

## SIS-106 — /eventos-inovacao: controle lateral com preview dos eventos, cantos arredondados e sombra contínua

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-106/eventos-inovacao-controle-lateral-com-preview-dos-eventos-cantos

### Pedido
Ajustes no `EventsGrid` de `/eventos-inovacao`: (1) controle na lateral com preview (miniatura, número, título), filtros com contagens; (2) `border-radius` do card na imagem (token, overflow no container); (3) sombra contínua além da imagem, sem linha de corte. Mobile: controle horizontal. Miniaturas com `sizes` próprio; teclado/`aria-current`; reduced-motion. Critérios reescritos após SIS-115: lista vertical de quinze caducou (barra anterior/próximo); arredondamento, sombra, thumbs e remoção da régua 01…15 permanecem. Aberto: anúncio de estado (`aria-current` / `aria-live`) e reverificação visual.

### O que foi feito
`src/components/EventsGrid.tsx`, `src/app/globals.css`, `src/data/events.ts`, `public/images/EVENTOS/thumb/`.

**Controle na lateral.** Painel à direita (`.evento-navegador`), `position: sticky`: filtros + lista de quinze (miniatura, número, título). Direita porque o texto vive no canto inferior esquerdo. Painel filho do `container-lp`/`z-10` da trilha, não do palco (palco interceptava clique). Régua 01…15 removida.

**Arredondamento.** `.evento-cartao` sem recorte (sombra/pluma); `.evento-moldura` `inset: 0`, `overflow: hidden`, raio e fio de 1px. Token `--radius-card` (24px), inclusive no mobile (antes `rounded-2xl` 16px).

**“Quebra na sombra”.** Não era `box-shadow` (`0 40px 120px -40px`, spread negativo). Linha vertical = degrau de luminância (foto nítida 1125px × mesma foto `brightness(0.42)`). Pluma `.evento-cartao::after` `inset: -28px`, quatro degradês laterais em 56px; sombra em duas camadas com spread positivo (`0 40px 110px -10px` + `0 0 90px 30px`). Sem `filter`/`drop-shadow`. `.evento-cartao` desconta largura do painel e goteira do `.container-lp` (`width: auto` + `max-width`). Medido 1920: descontar só o painel deixava a foto até 1346 com painel a partir de 1214.

**Miniaturas.** 15 × 240px WebP q74, 124 KB no total, campo `thumb?`. `next.config` tem `images: { unoptimized: true }` — `sizes` sozinho não encolheria; reaproveitar `image` puxaria ~2,7 MB.

**Numeração sob filtro:** preserva `ordemNoCatalogo(e) = EVENTS.indexOf(e) + 1` (Insurtech Brasil continua 05).

**Acessibilidade.** `<button type="button">` em `<ol>`; `aria-current="true"` no ativo; `:focus-visible` anel 2px; inativos `opacity: 0.62`; miniatura `aria-hidden`.

**Mobile.** `.evento-preview` `display: none` abaixo de 1024px; filtros horizontais com `flex-wrap`.

**`prefers-reduced-motion`.** `.evento-preview-item` e `.evento-preview-fio` com `transition: none`; acompanhamento `behavior: 'auto'`.

**Outros.** `scrollTop` manual no `<ol>` (não `scrollIntoView`); padding da fatia `clamp(4.5rem,9vh,7rem)`; quadro `bottom` 5.5rem; `margin-top` do painel 1.5rem (com o valor grande, bottom 1160 numa tela de 1080).

**Validação.** `tsc --noEmit` limpo; `npm run build` ok; lint 25 problemas (0 erros). Playwright 1920×1080, 1366×768, 390×844: 0 overflow; painel sticky (eventos 01, 06, 10, 15); `clientHeight` 664 / `scrollHeight` 842; 1920 foto até 1162, painel a partir de 1214; 1366: 927 / 968.

### Conferência
Não há `VEREDITO: APROVADO`. **Reavaliação após a SIS-115:** a entrega de arredondamento, sombra, thumbs e remoção da régua sobreviveu; o artefato central (lista vertical de 15) foi substituído por `.evento-navegador` `position: fixed` com anterior/próximo. `aria-current` desapareceu do componente; o contador `03 / 15` é `aria-hidden`. Recomendação: backlog com critérios reescritos, rotulada como escopo substituído pela SIS-115, não como “não entregue”. Nada alterado no código nem no status.

### Arquivos tocados
- `src/components/EventsGrid.tsx`
- `src/app/globals.css`
- `src/data/events.ts`
- `public/images/EVENTOS/thumb/`

---

## SIS-105 — /eventos-inovacao: vídeo de fundo no hero “Eventos & Inovação”, no mesmo padrão de /solucoes

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-105/eventos-inovacao-video-de-fundo-no-hero-eventos-andamp-inovacao-no

### Pedido
Colocar `public/videos/evento.mp4` (4,8 MB) como fundo do hero de `/eventos-inovacao` via `HeroVideoBackdrop`, só em volta do hero. Gerar poster `.webp`; renomear no padrão do projeto; `-an` e `faststart`; loop sem salto; texto legível; reduced-motion mostra poster; vídeo não vaza no header nem no chanfro. Desktop e mobile, atenção ao peso.

### O que foi feito
Vídeo em laço com o `HeroVideoBackdrop` existente — lógica de reduced-motion não duplicada.

**Arquivos.** `public/videos/eventos-hero-loop.mp4` — 1,2 MB (take 4,8 MB); `public/videos/eventos-hero-loop-poster.webp` — 36 KB, primeiro quadro do laço; `evento.mp4` removido.

**Loop.** SSIM último vs. primeiro = 0,46 (corte no meio 0,50). Cauda de 1,2 s dissolvida no começo: emenda 0,91 (controle 0,63). Duração 6,83 s.

**Marca d’água “Veo”.** Recorte 1824×1026 a partir do canto superior esquerdo, de volta a 1920×1080.

**Encode.** `-an`, `-movflags +faststart` (`moov` estava no fim), CRF 28, `preset slow`, `yuv420p`.

Wrapper só no hero. DOM: `.hero-backdrop--eventos .pagehero-entrada` existe; `.hero-backdrop--eventos .evento-sangria` não.

**Componente.** Prop `foco` (`object-position`): esta rota `50% 50%` (padrão 50% 62% cortaria o palco). Classe `.hero-backdrop--eventos`: meio do véu 34% → 56%, chapado 16% → 22% (telão de LED atrás do título).

**Playwright.** 1920×1080 e 390×844: `currentSrc` = `eventos-hero-loop.mp4`, poster correto, `paused: false`, `objectPosition: 50% 50%`, 0 erros, 0 overflow. Reduced-motion 1440×900: `paused: true`, `currentTime: 0`, sem `autoplay`. `#social` e `ContactCTA` no lugar. `tsc --noEmit` limpo, `npm run build` ok, lint 25 avisos / 0 erros.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `public/videos/eventos-hero-loop.mp4`
- `public/videos/eventos-hero-loop-poster.webp`
- `public/videos/evento.mp4` (removido)
- `src/components/ui/HeroVideoBackdrop.tsx`
- `src/app/eventos-inovacao/page.tsx`
- `src/app/globals.css` (`.hero-backdrop--eventos`)

---

## SIS-104 — /eventos-inovacao: substituir as imagens dos eventos pelas versões de alta qualidade

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-104/eventos-inovacao-substituir-as-imagens-dos-eventos-pelas-versoes-de

### Pedido
Atualizar imagens de `/eventos-inovacao` (`src/data/events.ts`, `EventsGrid`) da pasta `EVENTOS/` (~1,2 MB JPG) para `Eventosaltaqualidade/` (PNG ~2 MB). Web Summit AI e SPIW sem PNG novo. Converter para WebP; sem órfãs; caixa exata dos nomes; sem recorte por proporção; sem regressão de LCP. Desktop e mobile.

### O que foi feito
**13 das 15 artes** em WebP q82, 1672×941: 28 MB → 2,28 MB (111–223 KB por arte). Arquivos em `public/images/EVENTOS/`; pasta `Eventosaltaqualidade/` removida. Nomes atuais mantidos, só extensão `.jpg` → `.webp`. Validação byte-a-byte vs. `readdir`: 15/15. Proporção 1,777 vs. 1,779.

`sizes="1125px"` passou de upscale 1,25× (fontes 900px) para downscale 0,67×; comentário do `EventsGrid` corrigido. `alt=""` nas duas camadas desktop; mobile `alt={e.title}`.

**Web Summit AI e SPIW:** inconsistência aceita — seguem `.jpg`; nota no array de `events.ts` + comentários inline. LCP: `images: { unoptimized: true }`; primeiro card (priority) não mudou (JPG 77 KB); demais ~80 KB → ~180 KB fora do caminho crítico.

`npx tsc --noEmit` limpo · `npm run build` ok · `npm run lint` 25 problems (0 errors, 25 warnings).

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `public/images/EVENTOS/` (13 `.webp` novos, 13 `.jpg` antigos removidos)
- `public/images/Eventosaltaqualidade/` (removida)
- `src/data/events.ts`
- `src/components/EventsGrid.tsx`

---

## SIS-103 — Transição “Sobre o Luminna AI” → Contato: eliminar a quebra e encadear o card do Luminna com a entrada do card de contato

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-103/transicao-sobre-o-luminna-ai-contato-eliminar-a-quebra-e-encadear-o

### Pedido
Eliminar faixa clara vazia e linha dura entre Luminna e Contato; linha-sinal ciano ligando os cards; card do Luminna evolui no scroll (`scrub`); card de contato entra sobrepondo a saída; timeline única sem pin aninhado; formulário intacto; FPS; reduced-motion; mobile sem comprimir a timeline. Verificado em 1920×1080, 1366×768 e mobile.

### O que foi feito
**Arquivos.** `src/components/Contact.tsx`; `src/app/globals.css` (`.ct-trilha[data-modo="scroll"]::before`, contorno do painel, `.section-light.emenda-luminna`); `src/app/page.tsx` (`emenda-luminna`).

A faixa vazia era o gatilho `start: 'top top'` com painel em `opacity: 0` e 12vh abaixo. Agora `start: 'top 60%'`. Trilha 110svh; `SURGIR_FIM = 0.34` consome ~24% do curso.

Linha dura = `inset 0 1px 0 rgba(255,255,255,0.75)` de `.section-light`. `.emenda-luminna` remove o fio e traz `--cream` (`#e2effa`) dissolvido em 26svh.

Linha-sinal: pseudo da trilha, nasce 18svh acima, desce 34svh, `scaleY` em `--ct-surgir`. Sem `z-index` (pseudo atrás do painel). Anel do card de `rgba(20,200,245,0.06)` para 0.34 + halo estático.

Item 2 já atendido: `ScrollVideo` + `enquadramento` 1.04 → 1.10 e `SHRINK` 0.72–0.97. Formulário: `--ct-p` satura em `SURGIR_FIM`; `travadoRef` no `focusin`; `--ct-vida` zera em `:focus-within`. Sem pin. Reduced-motion: reset da linha em `@media` e `html[data-motion="reduce"]`. Mobile: abaixo de 1024px modo lista; linha só em `[data-modo="scroll"]`.

`tsc --noEmit` limpo, `next build` compila, lint 0 erros (25 avisos).

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/Contact.tsx`
- `src/app/globals.css`
- `src/app/page.tsx`

---

## SIS-102 — Faixa de logos: adicionar ponto azul separador entre as logos

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-102/faixa-de-logos-adicionar-ponto-azul-separador-entre-as-logos

### Pedido
Inserir bullet azul claro entre logos na faixa de parceiros (mesmo ponto do site), sem sobrar no início/fim, presente na emenda do loop, largura remedida, `aria-hidden`, espaçamento consistente. Desktop e mobile.

### O que foi feito
**Arquivos.** `src/components/legacy/legacy.css` (`.lp-partner::after`); `src/components/legacy/SignalMarquee.tsx` (documentação).

O separador é `::after` absoluto de cada `.lp-partner`, não um nó: não entra na largura medida da cópia (`translate3d(-50%)`); o ponto do último item cai no vão da emenda; `content: ''` não é anunciado; escondido em `:last-child` no modo reduced-motion.

`filter: grayscale(1)` saiu de `.lp-partner` para `.lp-partner img` (não dessaturar o ponto nem criar containing block). Vão `--lp-signals-vao: clamp(3rem, 5.5vw, 5.5rem)`; ponto `margin-left: calc(var(--lp-signals-vao) / 2 - 3px)`.

Cor: token `#0ed8f6` (`.solutions-eyebrow-ponto`, 6px) rende ~2:1 sobre `#f5faff`; usado `color-mix(in srgb, #0ed8f6 55%, #003f73)`. Mobile: ponto permanece. `forced-colors`: ponto escondido.

`tsc --noEmit` limpo, `next build` compila, lint sem novos erros.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/legacy/legacy.css`
- `src/components/legacy/SignalMarquee.tsx`

---

## SIS-101 — Faixa de logos: remover a linha azul e os cantos soltos, e integrá-la ao rodapé da seção “Escala que transforma o mercado de seguros.”

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-101/faixa-de-logos-remover-a-linha-azul-e-os-cantos-soltos-e-integra-la-ao

### Pedido
Remover linha ciano sobre as logos, cantos/chanfros soltos, e mover a faixa para dentro da seção de métricas como rodapé. Contraste das logos; loop sem salto; reduced-motion alcançável; pin/altura recalculados. Desktop largo, notebook e mobile.

### O que foi feito
**Arquivos.** `SignalMarquee.tsx` (`<span className="lp-signals-base" />` removido); `legacy.css` (`.lp-signals-base` removido); `Metrics.tsx` (faixa último filho após `.impact-percurso`); `globals.css` (`min-height: 340vh` saiu da seção para `.impact-percurso`); `page.tsx` (consumo da faixa e `NotchDivider` saíram).

Linha ciano = `lp-signals-base` (2px, `top: -1px`). Cantos = `NotchDivider` (sem dois blocos). Caixa `.impact-percurso` dona dos 340vh, faixa depois; palco solta nos últimos ~130px onde `ATERRAR_INICIO = 0.94`. ScrollTrigger inalterado (`start: 'top top'` / `end: 'bottom bottom'`). Faixa mantém `#f5faff` próprio. Reduced-motion: viewport vira lista rolável. Faixa some do inventário da home (SIS-100).

`tsc --noEmit` limpo, `next build` compila, lint sem novos erros.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/legacy/SignalMarquee.tsx`
- `src/components/legacy/legacy.css`
- `src/components/Metrics.tsx`
- `src/app/globals.css`
- `src/app/page.tsx`

---

## SIS-100 — Navegador lateral de seções (ScrollSpy) em todas as páginas — mapa de seções por tela

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-100/navegador-lateral-de-secoes-scrollspy-em-todas-as-paginas-mapa-de

### Pedido
Estender o ScrollSpy (`src/components/ui/ScrollSpy.tsx`) para todas as páginas, configurável (`id` + rótulo), mapa centralizado, ids no DOM, detecção claro/escuro, breakpoint ~1280px. Decidir `ProgressoLateral` em `/quem-somos` e nav “NESTA PÁGINA” em `/solucoes`. Acessibilidade, Lenis, reduced-motion instantâneo. Verificado em 1920px, 1440px, 1280px e mobile.

### O que foi feito
`src/data/pageSections.ts`: `PAGE_SECTIONS` e `sectionsForPath(pathname)`. Dez rotas, 44 itens: `/` 5 · `/quem-somos` 8 · `/solucoes` 5 · `/parceiros-e-implementacoes` 4 · `/latam` 8 (espanhol) · `/contato` 4 · `/esg` 4 · `/sistran-labs` 3 · `/eventos-inovacao` 3 · `/trabalhe-conosco` 3. Fora (<3): `/transformacao-legado`, `/blog`, `/sistran-university`, páginas legais e dinâmicas. `ContactCTA` nunca entra.

Ids existentes no `<h2>` não foram movidos; o componente sobe para `el.closest('section')`. Criados: `PageHero` → `id="topo"`; `/trabalhe-conosco` → `id="curriculo"`. 44/44 no DOM.

Observer: conjunto de quem cruza + ordem de documento (não “último `entry`”). Breakpoint 1280px.

`ProgressoLateral`: consumo removido. Nav “NESTA PÁGINA” e lista de `/latam`: `xl:hidden`. `aria-label` da barra de `/solucoes` → “Nesta página”.

`<nav aria-label="Seções desta página">`, `aria-current="true"`, alvo 44px, clique via `window.__lenis.scrollTo` descontando `--header-h + 24px`, reduced-motion `duration: 0`, foco na seção com `preventScroll`.

**Verificações.** Visível 1920 / 1440 / 1280; oculto 1279 / 1024 / 390. Contraste claro `#0079CB`, escuro `#0ed8f6`. Clique: topo a 104px (header 88 + 24). Reduced-motion: scrollY 0 → 2415 em 120ms. `tsc --noEmit` limpo, `next build` ok, lint 19 avisos / 0 erros (eram 25). Capturas `docs/capturas/sis100-scrollspy-1440.png` e `sis100-scrollspy-1280.png`.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/data/pageSections.ts`
- `src/components/ui/ScrollSpy.tsx`
- `src/components/PageHero.tsx`
- consumo de `ProgressoLateral` em `/quem-somos`
- nav “NESTA PÁGINA” em `/solucoes` e lista equivalente em `/latam`

---

## SIS-99 — “Desafios no desenvolvimento de software”: remover as três etapas e manter só o bloco sobre o Luminna AI

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-99/desafios-no-desenvolvimento-de-software-remover-as-tres-etapas-e

### Pedido
Remover as etapas Compreender, Transformar e Validar e evoluir (dados, indicadores, pin, animações, ícones). Manter o título da seção e o bloco “Sobre o Luminna AI”. Recalcular pin/altura; sem órfãos; hierarquia de títulos. Desktop e mobile.

### O que foi feito
**Arquivos.** `src/data/legacy.ts` (`chapters` removido de `impactSequence`); `ImpactSequence.tsx` (`SequenceChapter`, `CAP_PASSO`/`CAP_BORDA`, `clipPath`, portão de opacidade, `.sequence-chapters`); `legacy.css` (dez blocos `.sequence-chapter*`; altura reajustada).

Altura 216svh → 200svh (piso do seek do vídeo da montagem, não respiro). `data-dirigindo` permanece (portão da escala do título). Enquadramento: aproximação 1.04 → 1.10, sem `quadroX` de 3%. Removido, não comentado. Sem salto h2→h4 (capítulos eram os únicos h3). Sem assets órfãos. SIS-92 fica obsoleta (sobreposição na troca de capítulos).

`tsc --noEmit` limpo, `next build` compila, lint sem novos erros.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/data/legacy.ts`
- `src/components/legacy/ImpactSequence.tsx`
- `src/components/legacy/legacy.css`

---

## SIS-97 — “Escritórios BRASIL”: unificar o fundo do mapa com o fundo claro do título

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-97/escritorios-brasil-unificar-o-fundo-do-mapa-com-o-fundo-claro-do

### Pedido
Estender o fundo claro da faixa do título por toda a seção do mapa, sem emenda. Reajustar contorno, preenchimento, chips, pins e legenda para contraste AA sobre claro. Token compartilhado. Desktop largo, notebook e mobile.

### O que foi feito
Três camadas extraídas para `--fundo-claro-secao` no `:root` (`--claro-brilho-a/b`, `--claro-base`); `.section-light` e `.os-palco[data-modo="scroll"]` consomem o token.

Arte invertida (entre outros): `.bm-pais` `rgba(2,29,67,.85)`; `.bm-pais-contorno` `rgba(2,29,67,.88)`; `.bm-pais-cabeca` `#0079cb`; América do Sul navy `.10`/`.24`/`.22`; `.bm-pais-brilho` `rgba(3,45,103,.22)`; linhas `rgba(0,121,203,.6)`; rótulos `#032d67` (~13:1); coordenadas `#3d6285` (~6:1). Preenchimento `#0a4489/#135fae/#073a76` já calibrado na SIS-78.

Chips invertidos: `rgba(255,255,255,.82)`, borda `rgba(0,121,203,.32)`, texto `#0b3f75` (~11:1); ativo azul chapado (~4.7:1). Painéis de cidade seguem vidro escuro.

Bug: chips atrás do header a 1440×900. `top: calc(var(--header-h) + clamp(.75rem, 2vh, 1.5rem))`. Medido: chips 196.5px, header 104px.

Playwright 1440 / 1366 / 390, `mouse.wheel`. Reduced-motion: modo `lista`; `stroke-dashoffset: 0`; `.bm-halo` / `.bm-rota-pulso` `animation-name: none`. `tsc --noEmit` limpo · `npm run build` ok · `npm run lint` 25 warnings / 0 errors.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/app/globals.css`
- mapa / cena de escritórios (classes `.bm-*`, `.os-palco`; chips)

---

## SIS-96 — Seção “Escritórios BRASIL”: revelar o mapa progressivamente com efeitos das skills de scroll motion

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-96/secao-escritorios-brasil-revelar-o-mapa-progressivamente-com-efeitos

### Pedido
Revelar o mapa com o scroll: contorno (`stroke-dashoffset`) → preenchimento → divisas em stagger → pins → legenda tipo SplitText; emenda com a faixa do título; título sem passar sob o header; 60fps; reduced-motion com mapa completo; estratégia mobile. Skills titan-editorial e sistran-cinematic.

### O que foi feito
Boa parte da revelação já existia. Lacunas:

1. Preenchimento depois do contorno (`OfficesScene.tsx`): `PREENCHE_INICIO = ENTRADA_FIM` (0.20), `PREENCHE_FIM = 0.34`. Em 0.2 o contorno vale 1 e o preenchimento ainda 0.34.
2. Divisas: um único `path` quebrado nos `M` (`DIVISAS`, 19 peças), `--os-divisas` 0.30 → 0.52.
3. Legenda: `clip-path: inset`, nome 0.42s, coordenada 0.62s; ordem pin → linha → nome → coordenada. Não por caractere (leitor de tela / `text-anchor: end`).
4. Título sob o header: palco `top: calc(var(--header-h) + 1rem)`; `innerTop = headerBottom = 104`. Chips perderam a soma extra da SIS-97.

Defeitos expostos: chamada de Pato Branco (`L152 162`, rótulo y=156/179); SP recuada para x=596. Reduced-motion a 1440: `scrollWidth` 1483; reset de `left`/`right` nas regras `[data-cidade="pr"]`; depois `scrollWidth = 1440`.

Verificação: partitura a 1440×900; mobile 390 modo lista; 60fps **não medido** (rAF headless p95 ≈100ms). Propriedades: `transform`, `opacity`, `stroke-dashoffset`, `clip-path`. `tsc --noEmit` limpo · build ok · lint 25 avisos / 0 erros.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/OfficesScene.tsx` (ou equivalente da cena; relatório cita `OfficesScene.tsx`)
- CSS das classes `--os-*` / `.bm-*` / palco sticky

---

## SIS-95 — Diagrama “Onde seguros, negócio e tecnologia convergem”: núcleo mais 3D, logo maior e fios dinâmicos

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-95/diagrama-onde-seguros-negocio-e-tecnologia-convergem-nucleo-mais-3d

### Pedido
Núcleo “Falamos segurês!” com volume 3D (luz, inset, sombra, anéis); logo maior; fios com pulso (`stroke-dashoffset`), nós que acendem, hover destacando o ramo; 60fps; reduced-motion com fios completos; legível em desktop, notebook e mobile. Verificar recorte “CON…” à direita.

### O que foi feito
`src/components/PositioningEcosystem.tsx` e `src/components/positioning-ecosystem.css`.

Núcleo: luz em `34% 24%`; terceiro anel; órbitas `rotateX`/`rotateZ` 26s e 38s; `perspective: 760px`; tilt 5°/4° em `.eco-nucleo-tilt` (não no `.eco-nucleo`, colisão SIS-42 / `key={pulso}`).

Logo: `.eco-simbolo` era 42%/42% → caixa 84×36 (~35px num disco de 199px). Agora largura 40% + `aspect-ratio`. Medido: 1440 núcleo 263×263, símbolo 80×82 (antes 84×36); 1366 79×81; 390 54×56.

Fios: dash 14+620 no trilho, 12+128 nos ramos; atrasos 0 / 0,9 / 1,8s e 0,45 / 1,35s; sentido sempre ao núcleo. Hover `:has()`: fio ativo `opacity: 1` `rgb(32,215,242)`, outros 0.26, ramo esmaecido ainda desenhado.

Reduced-motion (`@media` e `html[data-motion="reduce"]`): fluxos `animation: none` e `opacity: 0`; base `stroke-dashoffset: 0`; nós `opacity: 1`. “CON…”: `estouraDireita: false`, `scrollWidth ===` janela. 60fps não medido de forma confiável. `tsc --noEmit` limpo; lint 25 avisos / 0 erros; `npm run build` ok. Mobile ≤767px: SVGs do trilho ocultos.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/PositioningEcosystem.tsx`
- `src/components/positioning-ecosystem.css`

---

## SIS-86 — Preloader: fundo da tela de entrada deve ser azul (logo branca desaparece no fundo branco)

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-86/preloader-fundo-da-tela-de-entrada-deve-ser-azul-logo-branca

### Pedido
Trocar o fundo do preloader para o azul da marca (logo branca), desde o primeiro frame (html/body/`theme-color`), sem flash branco nem branco na saída para o hero. Desktop e mobile, throttling de rede.

### O que foi feito
Diagnóstico: o `body` já era `#1273bc` e `.mmi-painel::before` já era `var(--palco-marca)` `#032d67`. O branco estava só em `.mmi-cartao` (`#f4f8fc`) com `sistran-corp-logo.png` branco. Decisão: fundo azul + logo branca (não há PNG azul da marca).

`.mmi-cartao`: `linear-gradient(158deg, #1273bc, #0e5893 58%, #073f6e)` + `inset 0 0 0 1px rgba(255,255,255,.16)`. `.mmi-leitura`: `rgba(255,255,255,.86)`. `.mmi-peca`: `rgba(255,255,255,.2)`. Morfagem já zerava `background` e `box-shadow`.

Verificação (produção, sessão limpa): 1440×900, 390×844, reduced-motion; rede 1,5 Mbps / 150ms, quadros 100ms a 6s: nenhum quadro branco; `theme-color` já `#004D8A`. Saída: cartão dissolve sobre cena azul. 0 erros de console; `tsc --noEmit` limpo; build ok; lint 26 advertências pré-existentes / 0 erros.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/app/globals.css`

---

## SIS-85 — Métricas: corrigir alinhamento e transição entre os números (deslocados à direita)

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-85/metricas-corrigir-alinhamento-e-transicao-entre-os-numeros-deslocados

### Pedido
Na seção “Escala que transforma o mercado de seguros.”, recentrar o número em foco nos 7 estados, alinhar número/rótulo/descrição, métrica que sai sem corte seco, transições mais ágeis, reduced-motion. Desktop largo, notebook e mobile.

### O que foi feito
Três defeitos independentes (produção): (1) `justify-content: center` em `.impact-valor` — a 1440, rótulo x=110 e glifo x=220; passou a `flex-start`. (2) Reserva em `ch` com `text-align: right` (~45px): `ch` ~145px vs. dígito ~87px; gabarito `visibility: hidden` + `aria-hidden` na mesma célula, `justify-self: start`. (3) `opacity: 0.52` chapada nos vizinhos anulava `data-dist` (0.14 / 0.1); item ativo saltava de ~0 para 0.52 e era decepado pelo `overflow: clip`. Regra removida.

`translateX` de 20% para ±10%. `mask-image` em `.impact-cena`, largura `(100% - --impact-lente) * 0.4`.

Verificação produção: 1440 estados 0, ~4.24 e 6 — `indice.left == rotulo.left == caption.left == glifo.left` (130 em repouso, 128 em transição); 1920 estado 6 os quatro em x=296. Reduced-motion e mobile 390: modo lista, `numLeft == rotLeft`. Eixo: rótulo 110 → 130, número 220 → 130. `tsc --noEmit` limpo, build ok, lint 26 advertências / 0 erros.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/Metrics.tsx`
- `src/app/globals.css`

---

## SIS-84 — /contato: seção “Onde Estamos” com mapa dinâmico das unidades

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-84/contato-secao-onde-estamos-com-mapa-dinamico-das-unidades

### Pedido
Reformular “Onde Estamos” em `/contato` com mapa dinâmico das três unidades (SP com endereço e telefone; PR e RJ não divulgados). Seleção recentra o mapa sem recarregar iframe; `tel:` e rota; tema escuro; lazy load; reduced-motion. Corrigir no site antigo: erro de carregamento, mapa estourando, ícone Waze.

### O que foi feito
Duas entregas no Linear.

**Primeira (mosaico OSM).** A LP não tinha mapa (só três cartões); os bugs do site antigo não existiam neste código. `src/components/UnitsMap.tsx`: tiles raster Web Mercator 6×4, sem biblioteca. CARTO `dark_all` devolvia “API KEY REQUIRED”; ficou OSM + filtro `invert` + `hue-rotate(180deg)`. Env `NEXT_PUBLIC_MAP_TILES` / `NEXT_PUBLIC_MAP_TILES_DARK`. Coordenadas em `src/data/contact.ts` (Nominatim): SP `-23.6013, -46.6934` zoom 16 (nº 240 não mapeado no OSM); Pato Branco `-26.2296, -52.6712` zoom 12; Rio `-22.9110, -43.2094` zoom 11. Seleção só clique/teclado (`aria-pressed`). Lazy: IntersectionObserver 200px; `loading="lazy"` nos tiles saiu (bordas em branco). Playwright 1440 e 390: 24/24 tiles; reduced-motion troca seca. `tsc --noEmit` limpo; lint 26 warnings / 0 erros; `○ /contato` estático.

**Segunda (substitui a anterior): Maps JavaScript API.** Script único (`v=weekly`, `loading=async`, `language=pt-BR`, `region=BR`). Uma instância; `panTo` + `setZoom`. Tema escuro: 13 regras em `styles` (não `mapId`). `google.maps.Marker` clássico, pino ciano. `gestureHandling: 'cooperative'`. Reduced-motion: `setCenter`. Observer mantido. Tipagem manual (5 membros). Sem `NEXT_PUBLIC_GOOGLE_MAPS_KEY` (ou falha do script): fallback no mosaico OSM. **Bloqueio go-live:** faturamento Google Cloud, chave restrita ao domínio, variável no Vercel/`.env.local`. Verificação com dublê da API: Map 1× após trocar unidade; 3 marcadores; `panTo` Pato Branco e zoom 16→12; reduced-motion só `setCenter`; script abortado → 24 tiles OSM. `tsc --noEmit` limpo, build ok, lint 26 warnings / 0 erros.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/UnitsMap.tsx`
- `src/data/contact.ts`

---

## SIS-83 — /contato: substituir o bloco de formulário atual pelo layout “Entre em contato conosco”

**Status:** In Review · **Labels:** — · **Fechada em:** não fechada · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-83/contato-substituir-o-bloco-de-formulario-atual-pelo-layout-entre-em

### Pedido
Na página `/contato`, trocar o bloco atual (cards empilhados de Matriz / E-mail / Telefone + formulário à direita, sobre fundo azul chapado) pelo layout do modal “Entre em contato conosco”. Duas colunas: imagem do prédio da sede à esquerda com recorte curvo (clip-path) na borda direita; formulário à direita sobre fundo dark navy. Card flutuante “SEDE · SÃO PAULO” com endereço completo e CEP 04571-020; eyebrow “— SAIBA MAIS SOBRE O QUE PODEMOS OFERECER”; título “Entre em contato conosco”; subtítulo de contato; card de telefone +55 11 2192-4400; campos Nome completo, E-mail, Telefone (placeholder `(11) 96123-4567`) e Mensagem, todos obrigatórios, com ícones; botão Enviar com seta e gradiente, largura total. Sair os cards separados, Nome/Sobrenome e Empresa (confirmar se Empresa precisa ser preservado) e o fundo azul chapado. Reaproveitar o componente do modal. Verificar se `comercial@sistran.com.br` continua visível. Aceite: layout novo, card da sede, textos, telefone, campos com ícones e validação, botão, responsivo, decisão registrada sobre Empresa e Sobrenome.

### O que foi feito
`/contato` passou a usar o painel “Entre em contato conosco”.

**O que mudou** (`src/app/contato/page.tsx`)
- A primeira seção deixou de ser a lista de três cartões (endereço/e-mail/telefone) + `DemoForm` e passou a renderizar o `ContactPanel` inline — o mesmo componente da home, com a foto da sede recortada de um lado e os campos do outro. Não é cópia: `onClose` no componente já era opcional exatamente para permitir uso fora do modal.
- Não trouxe a `.ct-trilha` / `.ct-palco` da home. Aquele palco de scroll é a encenação da entrada da home; aqui a página já entra pelo hero e o painel só precisa do `.contact-inline`, que existe no `globals.css` sem altura máxima e sem scroll próprio.
- `DemoForm` continua intacto, ainda em uso em `/trabalhe-conosco`. Só saiu o import daqui.
- As seções “Onde Estamos” e “#timeSISTRAN” ficaram como estavam.

**Decisão sobre EMPRESA e SOBRENOME** — os dois campos deixaram de existir nesta página. O painel tem quatro campos: Nome Completo, E-mail, Telefone, Mensagem. O formulário antigo tinha Nome + Sobrenome separados, E-mail, Telefone e **Empresa** (obrigatório).
- **SOBRENOME**: não é perda. “Nome Completo” cobre a mesma informação num campo só, e é como a home já pede há tempo.
- **EMPRESA**: é perda real de dado — era campo obrigatório e o comercial recebia a empresa do lead sem ter que perguntar. Seguiu-se o layout pedido no lugar de emendar um quinto campo, porque adicionar EMPRESA ao `ContactPanel` mudaria o formulário da home também, e isso não está no escopo desta issue. Se o comercial quiser a empresa de volta, o caminho é acrescentar o campo ao `ContactPanel` (vale para a home e para cá) — issue separada.

**`comercial@sistran.com.br`** — o painel só publica o telefone. Como o e-mail comercial estava visível nesta página e é o canal que o site divulga, manteve-se um “Prefere e-mail? Escreva para …” logo abaixo do painel, na mesma seção. Sem ele o e-mail desapareceria de `/contato`.

**Limitação conhecida:** os `id` dos campos no `ContactPanel` são fixos (`nome`, `email`, `telefone`, `mensagem`). Enquanto o modal do header estiver aberto sobre esta página, existem dois formulários com os mesmos `id` no DOM. Não é regressão desta issue — a home já tem exatamente isso, porque o `ContactModal` faz `if (!montado || !open) return null`, então fora de aberto não há colisão. Resolver de vez seria prefixo de `id` por instância, em issue própria.

**Verificação**
- `tsc --noEmit` limpo; `lint` 0 erros (26 warnings pré-existentes de `react-hooks/static-components`); `build` passa, `○ /contato` estático.
- Captura em 1440×900 e 390×844: `overflowX: 0`, 0 erros de console nos dois. Painel 1240×877 no desktop e 351×1090 no mobile, empilhando foto/endereço acima e campos abaixo. Os quatro campos e o botão Enviar presentes nas duas larguras.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/app/contato/page.tsx`

---

## SIS-82 — Adicionar item “Sistran Latam” no menu “Quem somos” e trazer a página /latam/

**Status:** In Review · **Labels:** — · **Fechada em:** não fechada · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-82/adicionar-item-sistran-latam-no-menu-quem-somos-e-trazer-a-pagina

### Pedido
Último item do dropdown Quem somos a ligar: Sistran Latam → `/latam/`, com conteúdo em espanhol fiel a https://www.sistran.com/latam/. Hero “Soluciones de software para compañías de seguros”; números 49 / 100 / 18 / 150; três notícias com datas; três cards de soluções com “Más info”; bloco de experiência; tabela de 12 escritórios/contatos; rodapé e redes. Aceite: item clicável, rota acessível, conteúdo em espanhol, números corretos, 3 cards, 12 blocos de contato conferidos, links de redes e Política de Privacidad funcionando.

### O que foi feito
`/latam` está no ar, em espanhol.

**Arquivos**
- `src/data/latam.ts` — números, notícias, soluções, capacidades e os 12 blocos de contato. O conteúdo vai para `src/data/` como o resto do site: a tabela de escritórios é dado de contato e quem for corrigir um telefone não deveria precisar abrir JSX.
- `src/app/latam/page.tsx` — a página, nos padrões das outras 14 rotas (`PageShell`, `PageHero`, `.section-py`, `.glass-card`, alternância clara/escura de superfície).
- `src/app/sitemap.ts` — `/latam` indexada.
- `scripts/capturar-rotas.mjs` — rota incluída no inventário de capturas.

O item **Sistran Latam** no submenu já tinha vindo com SIS-80; agora ele deixa de dar 404.

**Decisões registradas em comentário no código:**
1. **Navegação regional** (Compañía · Soluciones · Alianzas · Noticias · Contacto) virou âncora para as seções desta mesma página, não um segundo header. A página vive dentro do site brasileiro, que já tem o dele. “Alianzas” aponta para o bloco das 100 aseguradoras.
2. **Notícias sem link.** No site LATAM cada manchete leva a um post do blog regional, que não existe deste lado. As três manchetes saíram com a data (`<time datetime>`) e sem `href`. O campo `href` já está previsto no tipo.
3. **“Más info” aponta para o contato desta página.** As três soluções não têm descrição nem página própria no site regional — só o nome.
4. **Telefones com ramal expandido.** A fonte escreve México como `5536-6419 / 6743 / 6581` e Buenos Aires como `4373-8011 / 12 / 13`. Cada um foi expandido ao número completo para virar `tel:` discável.
5. **Contato em cards, não em tabela.** São 12 blocos de 4 campos; tabela de 4 colunas no celular só rola de lado. Cada telefone é `tel:` e cada e-mail é `mailto:`.
6. **Redes sociais: só LinkedIn e YouTube.** A issue pede Twitter · Facebook · LinkedIn · Instagram, mas `src/data/contact.ts` só tem os dois perfis registrados. A “Política de Privacidad” aponta para `/politica-de-privacidade`, que existe — mas o texto dela está em português; não há versão em espanhol para linkar.
7. **`lang="es"` no bloco inteiro.** Sem isso o leitor de tela continua lendo com pronúncia de português.

**Verificado:** `tsc --noEmit` limpo, `lint` sem erros, `build` gera `/latam` estática; captura a 1440 e a 390 — sem overflow horizontal e sem erro de console. A captura pegou um bug que o build não pegaria: a nav de âncoras estava **invisível**, atrás do hero (`.pagehero-entrada` é seção posicionada, e posicionado pinta acima de estático seja qual for a ordem no DOM). A nav foi movida para dentro da seção de números, o que também eliminou uma faixa de 36px do azul do body lendo como emenda malfeita entre duas superfícies escuras.

**Aceite ainda não marcável:** item 6 (redes sociais) depende dos links.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/data/latam.ts`
- `src/app/latam/page.tsx`
- `src/app/sitemap.ts`
- `scripts/capturar-rotas.mjs`

---

## SIS-81 — Adicionar item “Sistran University” no menu “Quem somos” e criar página /sistran-university/

**Status:** In Review · **Labels:** — · **Fechada em:** não fechada · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-81/adicionar-item-sistran-university-no-menu-quem-somos-e-criar-pagina

### Pedido
Tornar “Sistran University” clicável no dropdown Quem somos e criar `/sistran-university/` com o texto de autossuficiência em capacitação, parceria Unidep, “desde 2022, já formamos mais de 60 especialistas”, “mais de 17 projetos reais” e a seção “Fale com a Gente!”. Aceite: item clicável, rota acessível, conteúdo presente, números corretos, seção de CTA presente.

### O que foi feito
O item **Sistran University** no submenu de “Quem somos” veio na mesma correção de SIS-80 — `NAV_ITEMS` era plano e nenhuma das quatro páginas tinha caminho pelo menu, então as três tasks foram tratadas como um defeito só (`NavItem.children` + submenu no `Header`, desktop e mobile).

Sobre a página: `src/app/sistran-university/page.tsx` já atendia a todos os critérios de aceite — o título “Autossuficiência em capacitação de recursos”, os dois parágrafos, “desde 2022, já formamos mais de 60 especialistas”, “mais de 17 projetos reais” e o “Fale com a Gente!” (via `ContactCTA`). Não havia o que reescrever.

O escopo real desta task era o item de menu, e ele está no ar.

**Verificado:** `tsc --noEmit`, `npm run lint` (sem erros) e `npm run build` — `/sistran-university` continua sendo pré-renderizada.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
Não declarados no relatório.

---

## SIS-80 — Adicionar item “Sistran Labs” no menu “Quem somos” e criar página /sistran-labs/

**Status:** In Review · **Labels:** — · **Fechada em:** não fechada · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-80/adicionar-item-sistran-labs-no-menu-quem-somos-e-criar-pagina-sistran

### Pedido
Garantir “Sistran Labs” clicável no dropdown Quem somos e página `/sistran-labs/` com o texto do laboratório de inovação (DS/AI/ML/CLOUD/No & Low-code), soluções Guru / Predição de Churn / Fast Claims / Smart Miner, e-mail comercial, seções “Principais Soluções Sistran Labs” e “Fale com a Gente!”. Aceite: item clicável, rota acessível, conteúdo presente, seções estruturadas.

### O que foi feito
**Menu (o defeito compartilhado com SIS-81 e SIS-82)**
`NAV_ITEMS` era uma lista plana, então as quatro páginas de “Quem somos” não tinham caminho pelo menu — existiam como rota, mas o único link até elas ficava no corpo de `/quem-somos`. Uma correção só resolve as três tasks:

- `src/data/types.ts` — `NavItem` ganha `children?: readonly NavItem[]`.
- `src/data/nav.ts` — “Quem somos” recebe os quatro filhos: A Sistran, Sistran Labs, Sistran University, Sistran Latam.
- `src/components/Header.tsx` — submenu no desktop (chevron com `aria-expanded`/`aria-controls`, lista escondida com `hidden` e não com `opacity: 0`, para não continuar no Tab nem no leitor de tela; fecha no Escape, na troca de rota e no blur para fora do bloco) e, no drawer mobile, filhos indentados sempre abertos.

O pai continua sendo um `<Link>` para `/quem-somos`: quem clica no rótulo espera a página institucional.

**Página**
`/sistran-labs` já tinha toda a escrita. O que faltava era a seção “Principais Soluções Sistran Labs” — no site atual ela é só um PNG, com os nomes dos produtos existindo apenas dentro da imagem, sem alt. Recriada em texto a partir de `ACCELERATORS`, sete cartões, cada um linkando para a página que já existe em `/solucoes/[slug]`.

**Verificado:** `tsc --noEmit` limpo, `npm run lint` sem erros, `npm run build` passa.

**Ressalva:** “Sistran Latam” no submenu aponta para `/latam`, que ainda não existia no momento da entrega — escopo de SIS-82. Até a rota subir, esse item do submenu dava 404.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/data/types.ts`
- `src/data/nav.ts`
- `src/components/Header.tsx`
- página `/sistran-labs` (seção “Principais Soluções Sistran Labs” a partir de `ACCELERATORS`)

---

## SIS-79 — Nossa essência: Missão, Valores e Pilares abrindo conforme a rolagem passa

**Status:** In Review · **Labels:** — · **Fechada em:** não fechada · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-79/nossa-essencia-missao-valores-e-pilares-abrindo-conforme-a-rolagem

### Pedido
Na seção Nossa essência (`EssenceAccordion.tsx` + `essence-accordion.css`), a rolagem deve avançar Missão → Valores → Pilares, uma faixa por vez (não cumulativa), com clique/teclado tendo prioridade (`comandadoRef` permanente). `ScrollTrigger` sem `pin`, `setAtiva` só quando o índice muda (guarda como em `Metrics.tsx:277-280`), `scrollIntoView` só no clique. Modo dirigido só em `(min-width: 1024px)` e sem `prefersReducedMotion`. Sempre uma faixa aberta; cleanup só do próprio trigger; não trocar o `IntersectionObserver` de `data-entrou`; zero mudança de escrita (`npm run test:copy`). Aceite: sequência no desktop com transição de 560ms, SVG desenhando, clique estável, mobile idêntico ao atual, reduced-motion visível, teclado/`aria-expanded`, seção completa sem JS.

### O que foi feito
Sem relatório de entrega no Linear. O histórico de estados permite afirmar: saiu de Backlog em 28/08/2026 e entrou em In Review no mesmo dia (14:37 UTC), sem passagem registrada por In Progress, e permanece em In Review.

Há um comentário posterior (01/09/2026) registrando que o avanço das faixas por rolagem entregue nesta issue foi **revogado pelo SIS-98**: era irreconciliável com ler o painel (a seção mede mais de uma tela, então rolar para continuar a leitura era o mesmo gesto que trocava de faixa). `ativa` voltou a ter dono único (clique/teclado). O resto do que este issue entregou continua no lugar.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
Não declarados no relatório.

---

## SIS-78 — Azul quase preto: clarear o mapa dos Escritórios BRASIL e as demais seções que usam a mesma família

**Status:** In Review · **Labels:** — · **Fechada em:** não fechada · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-78/azul-quase-preto-clarear-o-mapa-dos-escritorios-brasil-e-as-demais

### Pedido
Em `/quem-somos`, o mapa Escritórios BRASIL estava com azul quase preto (`bm-preenchimento` `#0a1c35` / `#0b2548` / `#07162a`, ~8% de luminosidade sobre `.section-light`). Repintar o preenchimento em azul-médio da marca e conferir os traços claros (`.bm-pais`, `.bm-pais-contorno`, `.bm-pais-cabeca`, `.bm-relevo`). Nas demais seções, unificar os quase-pretos no `#032d67` da marca (ou variável derivada), sem mexer em `--fundo-marca`. Contraste de texto ≥ 4.5:1. Aceite: Brasil como azul da marca; cena nos três `data-ativa` e modo lista; textos acima de 4.5:1; uma família de cor; 360 / 768 / 1024 / 1440.

### O que foi feito
O pedido tinha duas metades e cada uma foi resolvida por um caminho próprio.

**1. O mapa — era contexto, não cor**
`bm-preenchimento` (`src/components/ui/BrazilOfficesMap.tsx`) foi desenhado quando o mapa era um cartão sobre palco escuro. O palco já havia sido neutralizado (`.os-mapa .bm-palco { background: none }`), então sobrou uma silhueta a ~8% de luz sobre uma folha a >92%.

Novos stops: `#0a4489` / `#135fae` / `#073a76` — faixa média de `#0079CB`/`#1479ec`. Luminância relativa calculada à mão para os quatro traços claros sobreviverem: o stroke do país (`rgba(184,228,255,.88)`) fica em ~4,9:1 contra o tom central.

`.bm-relevo` subiu de `rgba(100,180,244,.1)` para `rgba(178,222,255,.2)`: 10% de alpha bastava sobre quase-preto; contra azul-médio essas curvas desapareciam.

**2. Os palcos escuros — dez quase-pretos viraram dois tokens**
Eram dez, não sete: `#020d20`, `#031b3d`, `#03142d`, `#020f22`, `#031a38`, `#020f24`, `#041329`, `#03182f`, `#020f21`, `#031326`, mais `#0a1b30`. No `:root` de `globals.css`:
- `--palco-marca: #032d67` — exatamente o `#032d67` que fecha o `--fundo-marca`
- `--palco-fundo: #021d43` — a borda do degradê, derivada dele

Substituídos em `positioning-ecosystem.css`, `recognition-theater.css`, `technology-showcase.css`, `partners-timeline.css` (`.detail-number`) e nas ocorrências soltas de `globals.css` (`.mmi-painel`, `.solution-viewport`, o clone do morph, `.spine-no`, os dois gradientes de `.bm-palco`, `.os-foto`, `.os-abas button.active`).

Contraste **subiu**: branco sobre `#032d67` dá ~13:1 e `rgba(255,255,255,.85)` dá ~9:1 — os dois com folga sobre 4.5:1. `#6faeff` no `.detail-number` dá ~8,4:1.

**Exclusões deliberadas**
- `--contact-bg: #03182f` / `--contact-bg-deep: #020f21` e o `#03182f` do gradiente do painel: regra permanente do projeto, o modal de contato não se toca.
- `Header.tsx:318` `bg-[#031326]/70`: scrim do menu mobile (legibilidade, não estética de palco).
- `--fundo-marca` intacto — para não reabrir SIS-60/61.

**Verificação**
`npx tsc --noEmit` limpo. `npx next build` limpo. `npm run test:copy` sem string nova nem removida (o vermelho pré-existente de terceiros continua igual; o lock não foi regerado de propósito).

**Ressalva:** sem browser no ambiente de entrega. Os três valores de `data-ativa` (`pr` / `sp` / `nenhuma`), o `data-modo="lista"` e os quatro breakpoints não foram validados visualmente.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/ui/BrazilOfficesMap.tsx`
- `src/app/globals.css`
- `src/components/positioning-ecosystem.css`
- `src/components/recognition-theater.css`
- `src/components/technology-showcase.css`
- `src/components/partners-timeline.css`

---

## SIS-77 — Sobreposição entre seções e revisão dos 100vh: cartões que vazam de um bloco para o próximo

**Status:** In Review · **Labels:** — · **Fechada em:** não fechada · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-77/sobreposicao-entre-secoes-e-revisao-dos-100vh-cartoes-que-vazam-de-um

### Pedido
Cards e imagens devem “vazar” de uma seção para a outra (margens negativas controladas ou absoluto + z-index), em vez de ficarem confinados. Remover `height: 100vh` e `overflow: hidden` rígidos se gerarem cortes secos. Não criar `SectionTransition.tsx`. Aplicar overlap em 2 ou 3 fronteiras (candidatas: Abordagem → Como Agimos; ISG → Por que SISTRAN?; Differentials na home). Revisar `100vh` em `Differentials.tsx`; não tocar palcos sticky de `.impact-*` / `.solutions-*` nem heros; não converter `overflow: clip` de `.solutions-scroll` em `hidden`. Aceite: elemento visível sobre a seção seguinte sem encobrir texto em 360–1920px; Soluções/Números intactas; sem scroll horizontal; reduced-motion igual (é layout).

### O que foi feito
Sem relatório de entrega no Linear. O histórico de estados permite afirmar: saiu de Backlog em 28/08/2026 e entrou em In Review no mesmo dia (18:00 UTC), sem passagem registrada por In Progress, e permanece em In Review.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
Não declarados no relatório.

---

## SIS-76 — Grade técnica contínua no site inteiro (uma só camada, não uma por seção)

**Status:** In Review · **Labels:** — · **Fechada em:** não fechada · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-76/grade-tecnica-continua-no-site-inteiro-uma-so-camada-nao-uma-por-secao

### Pedido
Grid técnico unificado percorrendo a página inteira. Preferência: Alternativa A — `background-attachment: fixed` na `.grade-tecnica` existente (tile 6rem, `rgba(14,216,246,0.14)`), não um nó `fixed` global com `opacity-40` e brilho `sky-400`. Tirar a `mask-image` só onde as seções forem contínuas. Não adicionar o brilho radial do snippet. `pointer-events: none` e `aria-hidden`. Aceite: linhas horizontais alinhadas em seções escuras adjacentes; Header/`backdrop-filter` e `.glass-card` intactos; grade sem repaint a cada frame; contraste 0.14/0.04; `npm run test:copy` verde.

### O que foi feito
**Implementado — Alternativa A, e uma descoberta que muda o diagnóstico.** Ao abrir os dois seletores: as duas grades nunca foram o mesmo grid. `.grade-tecnica` usava tile de `6rem`; `.section-light::before` usava `48px`. Ancorar na janela sem unificar o módulo teria alinhado a fase de duas grades que continuariam sendo duas.

**1. Módulo único: `--grade-modulo: 6rem`** — declarado no `:root` ao lado de `--fundo-marca`. Consumido pelos dois seletores (4 referências).

**2. `background-attachment: fixed` em `.grade-tecnica`** — o tile resolve contra a janela: qualquer par de seções mostra a mesma linha na mesma altura de tela.

**3. `background-attachment: fixed` também em `.section-light::before`** — opacidades preservadas (`0.14` escuro / `0.04` claro).

**4. `.grade-tecnica--continua`** — em `/quem-somos` há dois blocos claros entre “Como Agimos” e “Por que SISTRAN?”. A máscara **fica** como padrão; o modificador (sem máscara) foi definido e documentado, **não aplicado**.

**5. A grade entrou nas seções escuras que estavam vazias**, no molde (`relative overflow-hidden`, nó `aria-hidden`, `pointer-events: none`):
- `/contato` → “Formulário de contato” e “#timeSISTRAN”
- `/solucoes` → “Serviços” e “Transformação de Legado”

**O que deliberadamente NÃO mudou**
- Brilho radial do snippet — não adicionado.
- `opacity-40` num nó `fixed` — não existe. Nenhum nó novo cobrindo a viewport.
- `sky-400`/Tailwind arbitrário — não usado. Grade no `#0ed8f6` no escuro e `#0079cb` no claro.
- Alternativa B descartada: `.section-light` tem `isolation: isolate`.
- `.solutions-grade` (64px) e `.impact-grade` — deixadas como estão.
- `.grid-mask` (48px, `globals.css:1203`) — código morto em `Hero.tsx` não montado; sinalizado, não apagado.

**Custo de paint:** nenhum `will-change`. SIS-70 já havia reduzido ~51 MB de download.

**Verificação**
- `npx tsc --noEmit` limpo; `npx eslint` nos dois arquivos tocados sem aviso; `npx next build` exit 0.
- HTML pré-renderizado: `grade-tecnica` presente em `/contato`, `/solucoes` e `/quem-somos`.
- `npm run test:copy`: os **mesmos 47** textos perdidos de antes desta task; nenhuma cópia visível perdida aqui.
- `--grade-modulo` com 4 consumidores; nenhum `48px 48px` restante em código vivo.

**Ressalva:** sem navegador. Não conferido paint flashing, `backdrop-filter` do Header/`.glass-card`, nem alinhamento visual. iOS Safari trata `fixed` como `scroll` em vários cenários.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/app/globals.css` (`--grade-modulo`, `.grade-tecnica`, `.section-light::before`, `.grade-tecnica--continua`)
- páginas `/contato`, `/solucoes` e `/quem-somos` (nós de grade)

---

## SIS-75 — Fluidez entre seções: auditoria dos cortes duros e do que já existe para resolvê-los

**Status:** In Review · **Labels:** — · **Fechada em:** não fechada · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-75/fluidez-entre-secoes-auditoria-dos-cortes-duros-e-do-que-ja-existe

### Pedido
Task-mãe de auditoria: **não implementa**. Mapear fronteiras de `/` e `/quem-somos` (claro↔claro, claro↔escuro, escuro↔escuro) e decidir Modelo A (fundo compartilhado + camada de `linear-gradient` no background da seção que recebe) versus Modelo B (`NotchDivider`). Não remover `background-attachment: fixed` de `--fundo-marca`; transições fora de `.section-light` (`isolation: isolate`); não reabrir `.impact-borda`/`.impact-emenda` (SIS-64); não trocar remendo por remendo. Depois do SIS-76: decidir onde aplicar `.grade-tecnica--continua` (ou removê-la se não houver escuro↔escuro). Aceite: sem linha horizontal de cor onde a auditoria escolheu Modelo A; NotchDivider mantidos idênticos; `test:copy` verde; reduced-motion inalterado.

### O que foi feito
Sem relatório de entrega no Linear. O histórico de estados permite afirmar: saiu de Backlog em 28/08/2026 e entrou em In Review no mesmo dia (18:00 UTC), sem passagem registrada por In Progress, e permanece em In Review.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
Não declarados no relatório.

---

## SIS-74 — Sistran em números: auditoria do pedido visual — o que já existe e os dois ajustes que faltam

**Status:** In Review · **Labels:** — · **Fechada em:** não fechada · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-74/sistran-em-numeros-auditoria-do-pedido-visual-o-que-ja-existe-e-os

### Pedido
Registrar o que já existe (glow da senoide, anéis HUD, sticky, contagem, etc.) e implementar só o que falta: (1) pulso contínuo discreto na lente orbital parada, só `opacity`/`filter`, nunca `transform` no mesmo nó de `.impact-aneis`, atrelado a `[data-visivel="1"]`; (2) `drop-shadow` ciano em `.impact-valor` sem quebrar stacking da lente nem `.impact-contextual` a 0.34. Não aplicar o snippet de 4 indicadores / framer-motion / carrossel. Aceite: lente com vida discreta só na tela; sem disputa de `transform`; reduced-motion = lista dos sete; `npm run build` e `test:copy` sem divergência.

### O que foi feito
Sem relatório de entrega no Linear. O histórico de estados permite afirmar: saiu de Backlog em 28/08/2026 e entrou em In Review no mesmo dia (17:57 UTC), sem passagem registrada por In Progress, e permanece em In Review.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
Não declarados no relatório.

---

## SIS-73 — Sistran em números: navegação clicável dos sete indicadores (base no desktop, tabs no mobile)

**Status:** In Review · **Labels:** — · **Fechada em:** não fechada · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-73/sistran-em-numeros-navegacao-clicavel-dos-sete-indicadores-base-no

### Pedido
Faixa de sete controles no pé da seção no desktop (`>= 1024px`, `[data-dirigindo]`): o clique não chama `setAtivo`, navega o Lenis/`scrollTo` até o progresso inverso de `Metrics.tsx:231-232`. Sem `role="tablist"`. Mobile: **não** virar tabs — a lista já mostra os sete. Contraste dos inativos (não `opacity: 0.5` abaixo de 4,5:1). Reduced-motion: salto direto. Aceite: clique posiciona o indicador e o marcador `NN / 07`; roda continua sem salto; Tab+Enter; abaixo de 1024px e reduced-motion sem controles; `npm run build`.

### O que foi feito
Seguiu o issue nas duas decisões: **o clique não escolhe o indicador** e **o mobile não virou tabs**. Arquivos: `src/components/Metrics.tsx` e `src/app/globals.css`.

**1. A nota do cabeçalho foi corrigida, não apagada** — reescrita para explicar que o que mantém a seção fora da categoria carrossel é o que o clique **não** faz.

**2. `irParaIndicador(i)` — zero estado novo**
```
const p = ETAPAS_INICIO + (i / (TOTAL - 1)) * (ETAPAS_FIM - ETAPAS_INICIO);
const alvo = gatilho.start + p * (gatilho.end - gatilho.start);
```
Inverso exato da conta do `onUpdate`. `start`/`end` vêm do gatilho vivo em `gatilhoRef`. Lenis primeiro, `window.scrollTo` como reserva; com `prefersReducedMotion()` a viagem é salto (`duration: 0`).

**3. A faixa** — `<nav aria-label="Ir para um indicador">` com sete `<button>`. **Não** `role="tablist"`. Vive no `.impact-palco`, fora do `.impact-cena`. `z-index: 8` — um acima da trilha (7) e da vinheta (3). Rótulo visível só o ordinal (`01`…`07`); o nome vai no `aria-label` (ex.: `"04 — Mil horas de Capacidade Produtiva no Brasil"`).

**4. Sobre o `opacity: 0.5` do pedido — não implementado.** Inativo é cor, não opacidade: branco a 0,78 de alfa sobre `#032d67` mede ~7,8:1. Ativo: peso 600 → 700, fundo `white/6` → `white/16`, borda ciano, `aria-current="true"`. `:focus-visible` em `#7fe6ff` com `outline-offset: 2px`.

**5. Mobile: recusa fundamentada.** A faixa só é renderizada quando `dirigindo` é `true`. `.impact-atalhos` também entra nas listas de ocultação (`@media` de lista e `html[data-motion="reduce"]`).

**Verificação:** `npx tsc --noEmit` limpo, `npx eslint src/components/Metrics.tsx` limpo, `npx next build` pré-renderizou as 26 páginas. `npm run test:copy` acusa **uma** string nova — `Ir para um indicador`; nenhuma removida; lock não regenerado.

**Ressalva visual:** `bottom: clamp(38px, 5.5vh, 62px)`; continuidade após clique; Tab+Enter.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/Metrics.tsx`
- `src/app/globals.css`

---

## SIS-72 — Sistran em números: contagem com mola (spring) em vez de curva de saída

**Status:** In Review · **Labels:** — · **Fechada em:** não fechada · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-72/sistran-em-numeros-contagem-com-mola-spring-em-vez-de-curva-de-saida

### Pedido
Trocar a curva do `ImpactNumero` (`ease: [0.22, 1, 0.36, 1]`, duration 1.1) por spring (`stiffness: 120`, `damping: 30` ou ~18–22 se quiser elasticidade visível, `restDelta: 0.5`), import de `motion/react`. Manter gatilho por `ativo`, `jaContou`, `onComplete` travando no valor, reduced-motion saindo pela porta da frente, reserva de `minWidth` para overshoot. Aceite: cada número sobe ao virar ativo; não reconta ao reavançar; reduced-motion mostra valor final; `build` e `test:copy`.

### O que foi feito
Três edições em `src/components/Metrics.tsx` (`ImpactNumero`).

**A curva**
```
type: 'spring',
stiffness: 120,
damping: 22,
restDelta: 0.5,
```
Escolheu-se **22**, não os 30 do pedido: em `stiffness: 120`, `damping: 30` fica praticamente crítico (ζ ≈ 1,37 para massa 1) — não sobraria elasticidade visível. Em 22 a mola ultrapassa o alvo em ~3-4% e volta: em 850, pico por volta de 880, dois ou três quadros. Valor e raciocínio registrados em comentário no código.

**`onComplete` deixou de ser zelo e virou obrigatório** — `restDelta: 0.5` interrompe a meio dígito **e** o último quadro pode ser o retorno do overshoot; sem a linha o indicador poderia descansar em `851`.

**A reserva de largura passou a contar o pico, não o valor final:** `minWidth: \`${String(Math.ceil(valor * 1.08)).length}ch\``. Nos sete valores de hoje (850/23/130/650/230/35/25) dá o mesmo número de dígitos; um `99+` viraria `103` por dois quadros e empurraria o `+`.

**Intocado:** gatilho por `ativo`, `prefersReducedMotion()`, `jaContou`, escrita por `textContent` via ref, cleanup. `animate` continua de `motion/react`.

**Verificação:** `npx tsc --noEmit` limpo, `npx eslint src/components/Metrics.tsx` limpo, `npx next build` nas 26 páginas. Sem troca de texto.

**Ressalva:** damping 22 vs 30 feito por cálculo, não no olho. Se o pico parecer exagerado, subir para 26.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/Metrics.tsx`

---

## SIS-71 — Efeitos: auditar e padronizar as cinco animações pedidas (já existem primitivas no projeto)

**Status:** In Review · **Labels:** — · **Fechada em:** não fechada · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-71/efeitos-auditar-e-padronizar-as-cinco-animacoes-pedidas-ja-existem

### Pedido
Auditar e padronizar (não reconstruir) fade-up expo (`vFadeUp`/`vTitle`/`easeExpo = [0.22, 1, 0.36, 1]` em `src/lib/motion.ts`), stagger (`vGrid`/`vCard`), `CountUp`, marquee (`SignalMarquee`) e Lenis. Não entrar snippets com `framer-motion` nem classes `dark:`. Uniformizar consumo das primitivas; se faltar `whileHover`/`whileTap`, acrescentar em `motion.ts`. Reduced-motion: fades visíveis, contador no valor final, marquee acessível. Depois da SIS-70. Aceite: nada anima duas vezes; Lighthouse não cai vs SIS-70; sem aviso de hidratação.

### O que foi feito
Sem relatório de entrega no Linear. O histórico de estados permite afirmar: saiu de Backlog em 28/08/2026 e entrou em In Review no mesmo dia (18:00 UTC), sem passagem registrada por In Progress, e permanece em In Review.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
Não declarados no relatório.

---

## SIS-70 — Performance: o site está lento — dieta de assets e code splitting com dynamic

**Status:** In Review · **Labels:** — · **Fechada em:** não fechada · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-70/performance-o-site-esta-lento-dieta-de-assets-e-code-splitting-com

### Pedido
Investigar lentidão e aplicar `dynamic` corretamente. Medição prévia: `public/` 227 MB; 78 MB mortos (`hero-scroll-anterior.mp4` 55,7 MB + `public/images/arquitetura/` duplicata); mosaico ~40 MB de vídeo em tiles de 176px; fotos PNG grandes; vídeos de scroll all-intra. Ordem: apagar mortos (−78 MB); reencodar tiles; WebP/AVIF; rever crf dos scroll preservando all-intra; só então medir First Load JS e `dynamic` (modais, não LCP). Aceite: Lighthouse antes/depois; scroll videos sem saltar; tiles em loop; 3D de `/quem-somos` no momento certo; build sem 404.

### O que foi feito
**Implementado — e a conclusão contraria a premissa do issue:** o `dynamic` não era o problema.

**A descoberta:** `next.config.mjs` tem `images: { unoptimized: true }` — o otimizador do Next não comprime nada em runtime. Comentário em `StackScenes.tsx` reescrito.

**1. Assets mortos removidos** (`git rm`): `public/videos/hero-scroll-anterior.mp4` (55,7 MB, zero referências); `public/images/arquitetura/` (6 arquivos md5-idênticos a `public/imagens/`). `public/` **225 MB → 152 MB**.

**2. Vídeos dos tiles do mosaico — 40,5 MB → 1,5 MB (−97%).** Tile ≤176×235 px CSS (~352×470 em DPR2); fontes eram 1080×1920. Reencodados em 360×640 CRF 30, GOP normal (só `play()` em loop). Comando documentado em `src/data/legacy.ts`.

**3. Imagens dos tiles — 10 913 kB → 226 kB.** Novo `scripts/otimizar-tiles-mosaico.mjs`: WebP 440 px q74. Originais intactas. `public/images/escritoriosp/` e `escritoriopb/` (21 MB) são fontes de regeneração — intocados. **Download da home: −51 MB.**

**4. Vídeos de scroll grandes — medidos e NÃO trocados.** `hero-scroll.mp4`: 7 556 kB → 6 219 kB em crf32 (não aplicado; LCP). `impacto-assembly-scroll.mp4`: 7 062 kB → 3 168 kB em 1280×720 crf30 (não aplicado). `process-scroll.mp4` (19,8 MB) só em código comentado. Sinalizado: `public/images/Sistran_files/` (131 arquivos, 2 referenciados).

**5. `dynamic`:** aplicado em `RoadmapStopDialog` (`ssr: false`). Revertido em `MotionPreferenceTrigger` (já estático no layout raiz). `ContactModal` não tocado.

**First Load JS** (soma de `/_next/static/**.js` no HTML; Next 16 não imprime mais a tabela): `/` 956 kB / 15 → 956 kB / 15; `/quem-somos` 988/14 → 988/15; `/transformacao-legado` 913/13 → 912/13; `/solucoes` 898/12; `/contato` 872/12. **JS: ~1 kB numa rota. Mídia: −51 MB de download e −73 MB no repositório.**

**Verificação:** `npx next build` exit 0; HTML da home com `tile-*.mp4` e `tiles/*.webp`, sem referências apagadas; `tsc --noEmit` limpo; `eslint src/` 17 warnings / 0 errors (os mesmos de antes); `test:copy` vermelho por drift pré-existente, lock não regenerado.

**Ressalva:** sem Lighthouse/navegador.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `public/videos/hero-scroll-anterior.mp4` (removido)
- `public/images/arquitetura/` (removido)
- `src/data/legacy.ts` (comando de reencode)
- `src/components/legacy/StackScenes.tsx` (comentário)
- `scripts/otimizar-tiles-mosaico.mjs` (novo)
- `RoadmapStopDialog` (dynamic)
- `src/app/layout.tsx` / `MotionPreferenceTrigger` (comentário, dynamic revertido)
- `next.config.mjs` (constatação `unoptimized: true`)

---

## SIS-69 — /quem-somos: retirar o explorador 3D 360° (Torre River Park / Complexo Modular)

**Status:** In Review · **Labels:** — · **Fechada em:** não fechada · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-69/quem-somos-retirar-o-explorador-3d-360-torre-river-park-complexo

### Pedido
Remover de `/quem-somos` o explorador 360° (`BuildingShowcase` em `page.tsx:120-124`): seletor Torre River Park / Complexo Modular, bússola, cartão River Park, rótulo vertical, `35+`, “Arraste para girar”. Não levar a torre da `OfficesScene` nem o `BuildingExplorer`. Decidir se `BuildingShowcase.tsx` e o CSS órfão saem ou ficam comentados. Atualizar copy-lock se o teste acusar. Aceite: sem o cartão azul, sem buraco; torre de SP na cena dos escritórios; sem erro de three; build e `test:copy` limpos.

### O que foi feito
Saiu a `<section aria-label="Explorador arquitetônico 360°">` de `quem-somos/page.tsx` e o import de `BuildingShowcase`. No lugar ficou um comentário `SIS-69` com o JSX exato para religar. “Diferenciais” encosta direto no `TechnologyShowcase` (ambos já tinham `section-py`).

**Decisões:** `BuildingShowcase.tsx` **fica**, sem consumidor, com doc no topo (precedente do `Differentials`). O CSS **fica todo** (dormente com o componente). Verificação de uso: `building-scroll`, `building-scroll-inner`, `building-stage`, `building-stat`, `model-switch`, `location-card`, `location-pulse`, `location-code` e `vertical-label` só em `BuildingShowcase.tsx`; **`three-explorer-shell` também está em `BuildingExplorer.tsx`** e teria sido removido por engano.

A torre não saiu: `OfficesScene` monta `BuildingExplorer` direto. Com uma cena só, o equilíbrio “só uma desenha por vez” deixou de ser necessário.

**Ressalva:** o `three` continua no pacote da rota. Assunto do SIS-70.

**Verificação:** `tsc --noEmit` limpo, `eslint` limpo nos arquivos tocados, `next build` com `/quem-somos` prerenderizada. `copy-lock` **não** regravado: nenhuma string saiu de `src/components` porque `BuildingShowcase.tsx` permanece. `test:copy` segue vermelho por divergência anterior.

Layout conferido no HTML prerenderizado, sem navegador.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/app/quem-somos/page.tsx`
- `src/components/ui/BuildingShowcase.tsx` (doc no topo; componente permanece)

---

## SIS-68 — Arquitetura: virar "Entrega com Alta Performance" e trazer os quatro pilares

**Status:** In Review · **Labels:** — · **Fechada em:** não fechada · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-68/arquitetura-virar-entrega-com-alta-performance-e-trazer-os-quatro

### Pedido
Na Arquitetura da home: remover a tag `Arquitetura | destino adequado ao contexto`; título → `Entrega com Alta Performance e Comprometimento`; descrição → `Empresas que aderem a tecnologia em seus processos estão sempre a frente no mercado!`; quatro itens (Conhecimento em Seguros · Flexibilidade · Tecnologia · Solidez e permanência) com ícone, só rótulo, lista vertical, consumindo `src/data/differentials.ts`. Não descomentar `Differentials` (400vh). Bifurcar escrita: `mosaicIntro` original permanece para `/solucoes` e `/transformacao-legado`. Aceite: home com novo título/linha/pilares; legado e soluções intactos; mobile sem empurrar o mosaico; ícones fora da leitura.

### O que foi feito
Comentário prévio no Linear: `copy-lock.json` **não é opcional** — após troca de escrita, rodar `npm run copy-lock` e commitar o lock (vale também para SIS-66).

A abertura do mosaico na home virou **“Entrega com Alta Performance e Comprometimento”**, com “Alta Performance” em gradiente, sem tag, e os quatro pilares dentro de `.mosaic-copy`.

**Arquivos**
- `src/data/legacy.ts` — novo `mosaicIntroHome`
- `src/components/legacy/StackScenes.tsx` — prop `variante`, novo cabeçalho, lista de pilares
- `src/components/legacy/legacy.css` — `.mosaic-realce`, `.mosaic-pilares`
- `src/app/page.tsx` — `<StackScenes variante="home" />`

**Bifurcação:** `mosaicIntro` intacto (`/transformacao-legado` e card de `/solucoes`). Padrão da prop é `legado`, não `home`. Título em três campos (`tituloAntes` / `tituloRealce` / `tituloDepois`), não `split()`.

**Armadilha:** `.text-gradient-brand` é clara-sobre-escuro. O mosaico é branco e **não** está em `.section-light`. Por isso `.mosaic-realce`, stops `#0079cb → #1885ce → #7c3aed`, ≈4,6:1 sobre branco. `color: #0079cb` antes do recorte.

**Pilares:** consomem `DIFFERENTIALS`. Só `title`. Ícones lucide já mapeados (`Shield`, `Zap`, `Cpu`, `Building2`), `stroke-width: 1.6`. Cores `#57B7EE`, `#C4A0FB` decorativas; nomes em `--ink` (`#001a3d`). Lista vertical, `max-width: 46rem`, coluna `width: max-content`; abaixo de 30rem fluida. Sem kicker na home. `aria-labelledby` aponta para `<h2 id="sinais-title">`.

**Verificação:** `tsc --noEmit` e `eslint` limpos; `next build` passa. HTML pré-renderizado: “Alta Performance” e `.mosaic-realce` só em `/`; 12 nós de pilar só na home; “destino adequado ao contexto” em `/transformacao-legado`; `mosaicIntro.text` no card de `/solucoes`. `test:copy` acusa só adições desta issue; lock não regenerado.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/data/legacy.ts`
- `src/components/legacy/StackScenes.tsx`
- `src/components/legacy/legacy.css`
- `src/app/page.tsx`

---

## SIS-67 — Impacto: vídeo chega na seção já montado — deve surgir com o scroll

**Status:** In Review · **Labels:** — · **Fechada em:** não fechada · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-67/impacto-video-chega-na-secao-ja-montado-deve-surgir-com-o-scroll

### Pedido
Na `#impacto`, o vídeo não pode abrir já montado (pôster = quadro de 8,6s). Portar revelação opt-in no `ScrollVideo` (`data-pronto` quando `readyState >= 2 && !seeking`, uma vez só). CSS: `.sequence-video { opacity: 0 }` → `[data-pronto="true"]` opacity 1; emergência em `[data-static="true"]` e em falha de arquivo. Hero **não** liga a prop. Sem reintroduzir rAF da origem. Aceite: abertura mostra fundo; sem piscar; recarga com seção na tela; reduced-motion e vídeo bloqueado visíveis; hero inalterado.

### O que foi feito
Implementado nas três partes. Sem dependência nova e sem reintroduzir o laço de `requestAnimationFrame`.

**1. `src/components/primitives/ScrollVideo.tsx` — revelação opt-in**
- Prop `revelarQuandoPronto` (default `false`); `HeroCinematic.tsx` **não** foi tocado.
- `buscar()` publica `data-pronto="true"` quando `readyState >= 2 && !seeking`.
- Escrito uma vez (`revelado` em `useRef`); atributo direto no elemento, não `useState`.
- Listeners `loadeddata` (recarga com seção na tela) e `error` (saída de emergência 2), ambos com cleanup.

**2. `src/components/legacy/legacy.css`**
- `.sequence-video` nasce com `opacity: 0` + `transition: opacity .25s ease-out`; `[data-pronto="true"]` leva a 1.
- `opacity: 0` no CSS servido.
- **Saída de emergência 1:** `.sequence[data-static="true"] .sequence-video { opacity: 1; transition: none }`.

**3. `poster`** — mantido. Comentário de cabeçalho de `ImpactSequence.tsx` atualizado. `aria-hidden="true"` e `tabIndex={-1}` intactos.

**Verificação:** `npx tsc --noEmit` limpo, `eslint` nos dois arquivos sem apontamentos, `next build` gera todas as rotas. Validação visual da lista **não executada** no ambiente de entrega.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/primitives/ScrollVideo.tsx`
- `src/components/legacy/legacy.css`
- `src/components/legacy/ImpactSequence.tsx` (comentário de cabeçalho)

---

## SIS-66 — Impacto: trocar a escrita da seção para "Sobre o Luminna AI"

**Status:** In Review · **Labels:** — · **Fechada em:** não fechada · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-66/impacto-trocar-a-escrita-da-secao-para-sobre-o-luminna-ai

### Pedido
Só escrita em `src/data/legacy.ts` (`impactSequence`): kicker → `Desafios no desenvolvimento de software`; title → `Sobre o Luminna AI` (sem `\\n`); text → `O Luminna AI representa uma revolução no desenvolvimento de software, proporcionando eficiência, qualidade e rapidez.` Grafia `Luminna AI` com espaço. Manter `id="impacto"` e `aria-labelledby="impacto-title"`. Sem mudança de layout/vídeo/scroll.

### O que foi feito
Implementado em `src/data/legacy.ts:267-272` — só o objeto `impactSequence`.
- `kicker`: → `Desafios no desenvolvimento de software`
- `title`: → `Sobre o Luminna AI`, **sem** `\\n` (comentário das linhas anteriores reescrito)
- `text`: → o parágrafo novo, 118 caracteres
Grafia: `Luminna AI` com espaço.

`ImpactSequence.tsx` consome `kicker`/`title`/`text` direto (linhas 93-98). `id="impacto"` e `aria-labelledby="impacto-title"` intactos. `.sequence-veil` não precisou de ajuste (opacidade dirigida por `copyFade`).

`npx tsc --noEmit` limpo; `next build` gera as 26 páginas. `npm run test:copy` acusa drift: 5 entradas desta task (3 saindo, 2 entrando — `Desafios no desenvolvimento de software` já existia em `acceleratorPages.ts:89`). **Não regenerou o `copy-lock.json`** por drift pré-existente de outras frentes.

Comentário posterior (28/08/2026): gravar o lock faz parte do escopo de tasks de escrita (Regra Zero).

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/data/legacy.ts`

---

## SIS-65 — Header: padronizar a logo da Sistran no tamanho maior (hoje ela encolhe no scroll)

**Status:** In Review · **Labels:** — · **Fechada em:** não fechada · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-65/header-padronizar-a-logo-da-sistran-no-tamanho-maior-hoje-ela-encolhe

### Pedido
Logo sempre no tamanho maior (`h-[4.5rem] md:h-[5.5rem]`), sem depender de `compacto` (hoje 3,4rem após rolar). Resolver a pílula junto (manter compacta ou deixar 88px sempre). Remover transições de altura mortas. Conferir `data-morph-target`, dez páginas, menu mobile 360px, LCP/`sizes`. Aceite: mesmo tamanho no topo e após scroll; sem salto; nav sem colisão 360–1920; morph da home; logo nítida 2x. Verificação: `tsc`, `eslint Header.tsx`, curl 200.

### O que foi feito
Feito → In Review (commit `adc2f38`).

A logo encolhia porque a **pílula** encolhia: 5,5rem são exatamente os 88px da pílula expandida, e nos 68px do estado compacto a logo grande não caberia. Escolheu-se deixar de encolher a pílula. Custo registrado: 20px de viewport permanentes.

- o estado `compacto` perdeu todos os consumidores e saiu, com o efeito que reescrevia `--header-h`. A altura agora é constante e a variável já vale 88px em `:root`;
- comentários de `globals.css` e `Differentials.tsx` que afirmavam que o Header reescrevia `--header-h` ao compactar foram corrigidos;
- saíram `transition-[height]` na logo e `height`/`top` na transição do cabeçalho.

Também corrigiu `width`/`height` da logo de 280×96 para 560×374, as dimensões reais do arquivo. Com a razão errada o `w-auto` reservava 256px de largura para uma marca que o `object-contain` pintava com 132px: ~124px de espaço morto. Com 374px de altura real, exibir a 88px sobra fonte em 2x.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/Header.tsx`
- `src/app/globals.css`
- `src/components/Differentials.tsx` (comentários)

---

## SIS-64 — Sistran em números: fronteira em curva claro/escuro está feia (manchas nos cantos)

**Status:** In Review · **Labels:** — · **Fechada em:** não fechada · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-64/sistran-em-numeros-fronteira-em-curva-claroescuro-esta-feia-manchas

### Pedido
Corrigir manchas claras nos cantos da `.impact-borda` (path `#e7f0f9`, `viewBox="0 0 1440 120"`, `preserveAspectRatio="none"`). Diagnosticar camadas; redesenhar ou remover (com SIS-61 a fronteira pode perder função). Decoração `aria-hidden`; sem ancestral `transform`/`filter`/`clip` sobre sticky. Aceite: nenhuma mancha em 1280 / 1440 / 1920 e ultrawide; igual nos dois sentidos de rolagem.

### O que foi feito
Feito → In Review (commit `8e83502`).

`.impact-borda` está comentada, não removida. As manchas nos cantos vinham do `preserveAspectRatio="none"` sobre um `viewBox` de 1440×120: em telas largas a curva era esticada horizontalmente e as pontas do path deixavam de encostar nas bordas, abrindo cunhas da cor de preenchimento nos cantos.

Com o fundo único do SIS-61 a fronteira claro/escuro deixou de existir, então a curva não tem mais o que separar. A grade passou a alinhar com a de Soluções. Se a fronteira voltar, a nota no CSS registra que ela precisa nascer com `preserveAspectRatio` que preserve a razão, ou com o path recalculado por largura.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/Metrics.tsx` (`.impact-borda` comentada)
- `src/app/globals.css`

---

## SIS-63 — Sistran em números: melhorar a abertura do palco (primeiro indicador embaralhado)

**Status:** In Review · **Labels:** — · **Fechada em:** não fechada · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-63/sistran-em-numeros-melhorar-a-abertura-do-palco-primeiro-indicador

### Pedido
Melhorar o primeiro enquadramento: número à frente dos anéis/rede; onda já acesa atravessando o primeiro nó; composição via `--impact-entrada` (`ENTRADA_FIM = 0.14`), um só ScrollTrigger. Sem `transition` em vars de quadro; sem redeclaração de `animation`; `overflow: clip` no palco. Aceite: primeiro indicador legível; onda contínua; reduced-motion estático e limpo.

### O que foi feito
Feito → In Review (commit `8e83502`).

A abertura deixou de entregar tudo de uma vez: a lente entra progressivamente por `--impact-entrada`, o bloco contextual cai para 0.34 (com o keyframe ajustado junto — por causa do `fill-mode: both`, mexer só na regra base não teria efeito) e o recorte da curva avança 35% do vão além do ponto aceso, então a onda já está desenhada à frente do primeiro indicador em vez de nascer embaixo dele.

É o que tirava a impressão de “primeiro indicador embaralhado”: três coisas chegavam prontas no mesmo quadro.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
Não declarados no relatório.

---

## SIS-62 — Sistran em números: ligar cada indicador ao nó da onda (números soltos hoje)

**Status:** In Review · **Labels:** — · **Fechada em:** não fechada · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-62/sistran-em-numeros-ligar-cada-indicador-ao-no-da-onda-numeros-soltos

### Pedido
Ligar cada um dos sete indicadores a um nó da onda: haste vertical, nó com presença (gramática de `.solutions-fio-no`), mesma coordenada X (`vaoEntreEtapas` / `pontoNaOnda`), onda acesa mais grosso, rarefação por `data-dist`. Decoração `aria-hidden`; sem números mágicos; `vector-effect: non-scaling-stroke` se SVG esticado. Modo lista/mobile/reduced-motion: haste/nó/curva continuam `display: none`. Aceite: ancoragem ≥1024px em qualquer etapa; estados distinguíveis; rótulo de duas linhas alinhado; nada atravessando o número central; lista intacta.

### O que foi feito
Feito → In Review (commit `8e83502`).

Cada indicador ganhou uma haste ligando o bloco ao seu nó na onda. A altura sai de `DESVIOS_TRILHO` por `calc(var(--impact-haste) - 50%)` — geometria que o componente já conhece, sem medição em JS e sem um segundo ScrollTrigger.

Os nós cresceram para 13px com borda, emprestando a gramática do `.solutions-fio-no`, e os vizinhos escalonam por `data-dist` (0 a 3).

No modo lista e em movimento reduzido a haste é escondida: sem onda e sem nó ela seria um risco solto ao lado do texto.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
Não declarados no relatório.

---

## SIS-61 — Sistran em números: usar o mesmo fundo de Soluções de Negócios na seção

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-61/sistran-em-numeros-usar-o-mesmo-fundo-de-solucoes-de-negocios-na-secao

### Pedido
A seção de números deve usar o mesmo fundo de Soluções de Negócios (a última camada do degradê da marca, `linear-gradient(115deg, #0875c5 0%, #075aab 42%, #032d67 100%)`, mais os dois focos radiais). As duas primeiras camadas de Soluções são emendas com vizinhos específicos e não devem ser copiadas. A faixa clara `.impact-topo` deixa de ser clara; a cadeia de cor (eyebrow, título, marcadores, trilho, `.impact-borda`, `.impact-emenda`) precisa ser passada completa para texto claro sobre azul. Contraste ≥ 4.5:1; fundo como camada de background, sem ancestral com `transform`; paleta sem roxo. Aceite: sem linha visível entre as duas seções; nenhum texto/rótulo de fundo claro sobrando; curva e emenda resolvidas; modo lista, mobile e movimento reduzido conferidos.

### O que foi feito
Feito → In Review (commits `bb66f0f` e `c8accd0`).

A seção já pinta o mesmo `--fundo-marca` de "Soluções de Negócios", agora ancorado na janela (ver SIS-60). Mas trocar o navy chapado pelo azul da vizinha expôs um segundo defeito, que era o que aparecia na captura mais recente: a `.impact-vinheta`.

Ela era sombra por cima do fundo — `rgba(3,45,103,0.92)` em 14% de cada ponta, ~265px numa tela de 1900px. Sobre o navy antigo passava batido; sobre o azul médio virou mancha escura na esquerda. E porque o `inset: 0` a mede dentro do `.impact-palco`, a borda de cima dela caía exatamente na fronteira das linhas do grid do sticky, desenhando o corte horizontal duro no meio da seção.

Agora ela repinta `--fundo-marca` com o mesmo `background-attachment: fixed` do palco e recorta o resultado com duas máscaras, uma por ponta (`mask-composite` implícito `add`, o meio da cena fica descoberto). O que aparece nas pontas é pixel a pixel o fundo que já estava ali — a máscara só decide onde ele volta a ser opaco, para cobrir os indicadores que entram e saem de cena. Sem cor nova e sem borda superior: a máscara é vertical de ponta a ponta.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
Não declarados no relatório.

---

## SIS-60 — Sistran em números: emenda com Soluções está quebrada — a cor da emenda não é mais a cor da vizinha

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-60/sistran-em-numeros-emenda-com-solucoes-esta-quebrada-a-cor-da-emenda

### Pedido
Há quebra seca entre Soluções de Negócios e Sistran em números: o azul encosta na faixa clara numa linha reta, com sombra escura que não corresponde a nenhuma das duas. Soluções fecha com `linear-gradient(to top, #004d8a 0, rgba(0,77,138,0) 200px)` calibrada para `--deep` do `MetricsStrip` (comentário desatualizado); `.impact-emenda` pinta 150px de `#041a33` no topo da faixa clara, resolvendo um vizinho que já não existe. Recalibrar a cor de saída de Soluções ao vizinho atual; recalibrar ou comentar `.impact-emenda`; atualizar os comentários; conferir o condutor `SolutionsToMetrics`. Aceite: passagem sem linha reta nem mancha estranha em desktop e mobile; comentários descrevendo a vizinhança real; movimento reduzido estático e correto.

### O que foi feito
Feito → In Review (commit `bb66f0f`).

A emenda não voltava por causa da cor escolhida: `--fundo-marca` é um `linear-gradient(115deg, …)` com dois radiais em `%`, e isso é resolvido contra a caixa de cada elemento. Os três consumidores têm alturas muito diferentes (`.solutions-scroll`, `.impact-scroll` com 520vh e `.impact-sticky` com uma tela), então a mesma declaração pintava três degradês distintos e todo encontro de caixas virava degrau de cor.

`background-attachment: fixed` nos três: o degradê passa a ser resolvido contra a janela, qualquer par de caixas mostra a mesma cor na mesma altura de tela e a fronteira deixa de existir por construção — não por calibragem.

Saíram junto os dois remendos que existiam só para tapar o degrau, e que eram justamente o que se via na captura: a EMENDA 3 de Soluções e a `.impact-emenda` da Metrics achatavam 200px de cada borda em `#0875c5` chapado, plantando uma faixa clara e plana atravessando um degradê diagonal. Também saíram as variáveis `--emenda-numeros*` e as duas reposições (modo dirigido e movimento reduzido).

Preço consciente, anotado no CSS: o fundo destas duas seções fica parado durante a rolagem — é exatamente o que torna a emenda invisível.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
Não declarados no relatório.

---

## SIS-59 — Footer: hover revelando informação por trás dos itens (referência mimo.xiaomi.com)

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-59/footer-hover-revelando-informacao-por-tras-dos-itens-referencia

### Pedido
Deixar o footer mais dinâmico no espírito de mimo.xiaomi.com: no hover, informação surge no lugar (não ao lado). Mínimo: links de navegação (seta, sublinhado L→R, vizinhança recuando); ícones sociais revelando o nome da rede; unidades trazendo endereço/telefone ao estado forte. Nada pode existir só no hover; zero salto de layout; só `transform`/`opacity`/`filter`/`box-shadow`/`border-color`/`background`; `@media (hover: hover)` no decorativo; `:focus-visible` com as mesmas revelações; movimento reduzido sem `opacity: 0` preso. CSS puro; não tocar no `MotionPreferenceTrigger` nem no modal. Aceite: revelações ≤250ms, `cubic-bezier(0.22, 1, 0.36, 1)`; Tab com foco visível; conferido na home e em ao menos outra página.

### O que foi feito
Feito → In Review (commit `c00f2b6`).

Rodapé no espírito da referência (mimo.xiaomi.com): seta e sublinhado nos links com a vizinhança recuando, nome da rede emergindo de trás do círculo, unidades revelando endereço e telefone em estado forte, lampejo no logo e traço sob os títulos.

Regra que guiou a implementação: **nada existe só no hover.** Endereço e telefone estão no DOM e legíveis por teclado e leitor de tela; o hover intensifica, não é o único caminho para a informação.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
Não declarados no relatório.

---

## SIS-58 — Siga a Sistran no LinkedIn: deixar a seção bem mais movimentada

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-58/siga-a-sistran-no-linkedin-deixar-a-secao-bem-mais-movimentada

### Pedido
Deixar `#SISTRAN / Siga a Sistran no LinkedIn` (`src/components/Social.tsx`) bem mais movimentada depois da entrada. Direções sugeridas: fantasma `#SOMOSSISTRAN` deslizando com o scroll; cartão LinkedIn com flutuação + tilt sem disputar o `transform` do giro das faces; título em cascata; pastilha pulsando; hover do botão; paralaxe entre camadas. Motion via `motion/react` e `useReducedMotion` de `@/lib/motion`; DOM idêntico em SSR/hidratação; um `rAF` por rajada; não redeclarar o atalho `animation`. Aceite: movimento perceptível com a página parada; cartão clicável com verso; movimento reduzido estático e visível; 60 fps.

### O que foi feito
Feito → In Review (commit `c00f2b6`).

Seção do LinkedIn bem mais movimentada: marca d'água deslizando com o scroll (`--sp`, um `requestAnimationFrame` por rajada), card com flutuação no `transform` e inclinação no `rotate` — as duas faces acompanham pelo `transform` delas, sem disputa — e lampejo no botão.

Ficaram de fora, por falta de propriedade livre no elemento: a entrada do título palavra por palavra e o paralaxe dos orbs. Se forem desejadas, precisam de um nó extra para hospedar o `transform`, e isso é escopo de outra task.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
Não declarados no relatório.

---

## SIS-57 — Contato: micro-interações nos componentes internos do painel (hover e foco)

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-57/contato-micro-interacoes-nos-componentes-internos-do-painel-hover-e

### Pedido
Cinco alvos no painel de contato: cartão `SEDE · SÃO PAULO` (subir 2–3px, borda ciano, sombra, pulso do pino); bloco do telefone (realce percorrendo o bloco, ícone acendendo no hover do bloco); campos (ícone deslizando e acendendo, rótulo subindo de tom, halo de foco sem enfraquecer `:focus-visible`); botão Enviar (deslocamento do degradê e brilho, sem mudar a caixa); foto da sede (`scale` 1.02 lento). Só propriedades compostas; hover em vizinho não empurra o campo em digitação; `@media (hover: hover)`; classes compartilhadas com o modal — se for só da seção inline, escopar em `.contact-inline`. Aceite: resposta ≤200ms, `cubic-bezier(0.22, 1, 0.36, 1)`; sem salto de layout; teclado com foco visível; modal sem regressão.

### O que foi feito
Feito → In Review (commit `c00f2b6`).

Micro-interações nos cinco componentes internos do painel, todas escopadas em `.contact-inline` — nada vaza para o modal de contato, que segue intocado.

Detalhe que importa: a foto reage por `filter`, e não por `scale`. O `transform` dela já é do paralaxe do SIS-56, e duas coisas escrevendo o mesmo `transform` é exatamente a falha que o SIS-42 documentou.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
Não declarados no relatório.

---

## SIS-56 — Contato: dar movimento contínuo ao painel inteiro (não só entrada)

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-56/contato-dar-movimento-continuo-ao-painel-inteiro-nao-so-entrada

### Pedido
O painel de contato só entra (`--ct-surgir` até 34% do percurso, `SURGIR_FIM = 0.34` em `Contact.tsx`) e fica parado nos outros 66%. Dar vida contínua: deriva ligada ao scroll (10–18px em Y + rotate de fração de grau via `--ct-p`); flutuação CSS lenta 8–12s independente do scroll; paralaxe interno foto vs. formulário; tilt opcional ≤2°. Um valor/escrita por quadro; sem `transition` em propriedade reescrita por quadro; `:focus-within` para o painel parar ao digitar; movimento só em `.ct-palco` / `.ct-painel`, jamais em `.contact-dialog-*`. Aceite: vida perceptível sem tranco; texto nítido; digitando, imóvel; movimento reduzido estático; 60 fps.

### O que foi feito
Feito → In Review (commit `c00f2b6`).

O painel de contato deixou de só entrar e passou a ter vida contínua, em três camadas e três propriedades diferentes — nenhuma disputando a mesma:

- deriva do scroll no `transform` do painel;
- flutuação própria no `.contact-dialog-inner`;
- paralaxe interno na imagem.

`--ct-vida`, registrada por `@property`, é o freio: com um campo em foco tudo congela, para o movimento não competir com quem está digitando.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
Não declarados no relatório.

---

## SIS-55 — Contato: endereço da sede aparece apagado no cartão sobre a foto

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-55/contato-endereco-da-sede-aparece-apagado-no-cartao-sobre-a-foto

### Pedido
No cartão translúcido sobre a foto da sede (`ContactPanel.tsx`, `HQ_ADDRESS`), o rótulo `SEDE · SÃO PAULO` lê-se e a linha de endereço não. Duas correções de cor anteriores já falharam. Suspeitos: especificidade de `color`; opacidade do percurso `--ct-surgir`/`--ct-p`; `backdrop-filter: blur(10px)` sob ancestral com `transform`; sobreposição/`z-index`; recorte `clip-path` da foto. Aceite: endereço completo legível em qualquer ponto do percurso em que o painel esteja visível; modal sem regressão; ≥1024px e abaixo; contraste ≥ 4.5:1 no pior trecho; comentar qual suspeito era.

### O que foi feito
Feito → In Review (commit `c00f2b6`).

Não era cor — e é por isso que as duas tentativas anteriores (SIS-17 e SIS-25) falharam: as duas escureceram o texto, e o texto já estava escuro o suficiente.

A causa era o `backdrop-filter` do cartão sob um ancestral escalado por quadro: `.ct-painel` anima `scale` com `will-change`, e o `backdrop-filter` do cartão passava a ler um backdrop já rasterizado, lavando o próprio corpo do cartão junto com o fundo. O endereço saía cinza-claro sobre cinza-claro independentemente da cor declarada.

Corrigido na terceira suspeita, que ficou comentada no lugar para a próxima pessoa não repetir a rodada de cor.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
Não declarados no relatório.

---

## SIS-54 — Home: retirar o bloco "Fale com a Gente!" do fim da página

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-54/home-retirar-o-bloco-fale-com-a-gente-do-fim-da-pagina

### Pedido
O bloco final "Fale com a Gente!" sai da home: em `src/app/page.tsx`, comentar `<ContactCTA motionShowcase />` e o import, no padrão da casa (nunca remoção seca). O componente `ContactCTA.tsx` fecha nove outras páginas (`/blog`, `/blog/[slug]`, `/esg`, `/eventos-inovacao`, `/quem-somos`, `/sistran-labs`, `/sistran-university`, `/solucoes`, `/solucoes/[slug]`) e permanece. Anotar que `motionShowcase` só era usado na home. Conferir a costura de cor entre `<Social />` e o `<Footer />`. Não tocar em `<Contact />` nem no modal.

### O que foi feito
Feito → In Review (commit `c00f2b6`).

`<ContactCTA motionShowcase />` e o import saíram da home, comentados no padrão da casa e não removidos: o componente continua intacto e fecha as outras nove páginas (`/blog`, `/blog/[slug]`, `/esg`, `/eventos-inovacao`, `/quem-somos`, `/sistran-labs`, `/sistran-university`, `/solucoes`, `/solucoes/[slug]`), todas seguem como estavam. Religar é descomentar duas linhas.

A nota no lugar do consumo registra que a prop `motionShowcase` (digitação do título, entrada encadeada, grafismo técnico) só era usada aqui — quem religar precisa saber que esse modo existe.

Quem fecha a página agora é o `<Social />`, e a emenda com o rodapé passou a ser feita pelo degradê da própria `.social-palco`, que fecha em `#1273bc`.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/app/page.tsx` (consumo e import comentados; declarado no relatório)

---

## SIS-53 — Sistran em números: a lente central parece travada — revisar os efeitos do palco

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-53/sistran-em-numeros-a-lente-central-parece-travada-revisar-os-efeitos

### Pedido
A lente central (anéis, ticks, arco, contextual) parece fixa enquanto só o conteúdo troca por baixo. A lente deve continuar centrada (fora da trilha transladada); o problema é ausência de resposta ao progresso. Investigar: troca do `impact-contextual`; arco `.impact-arco-vivo` vs. `--impact-etapa`; `[data-visivel]` nos anéis; colisão de `transform` (lição SIS-42); `scrub: 1` com 7 etapas. Um ScrollTrigger só, `scrub`, sticky (nunca `pin`), progresso por `ref`. Validação: sete etapas nos dois sentidos, um indicador ativo, contadores que não recontam.

### O que foi feito
**Achado — qual dos cinco candidatos produzia o sintoma.** Foi o **candidato 2**, e por ausência: a lente não tinha **nenhum** indicador contínuo de avanço. Os candidatos 1, 3 e 4 foram verificados e estavam sãos; o 5 não se confirmou.

- **(3) `data-visivel` está sendo escrito** — o `onToggle` do trigger o grava no `.impact-sticky`, e todas as animações contínuas pendem dele (`.impact-sticky[data-visivel="1"] .impact-lente .impact-anel-1`, `-2`, `.impact-ticks`, e os visuais contextuais). Os anéis giravam. Não era isto.
- **(4) Nenhuma colisão de `transform`** — os anéis giram por `animation: impact-gira` no `.impact-aneis`; nada escrevia valor por quadro no mesmo elemento. O erro de SIS-42 não estava aqui.
- **(1) A troca do contextual tinha entrada** — `animation: impact-contextual-entra var(--dur-chapter)`, remontando pela `key`. Não era corte seco.
- **(5) O `scrub: 1` não era o problema** — a inércia é a mesma das outras seções da casa e as transições dos itens são de estado discreto, sem somar lag.

O que restava: **a moldura não reagia ao progresso**. Só o conteúdo trocava por baixo, e uma troca a cada sétimo do percurso lê-se como tela travada nos seis sétimos restantes. A lente estar centrada não é o defeito — ela **deve** ficar centrada, é ela que define o centro da cena.

**O que foi feito.** Três respostas contínuas, todas derivadas de variáveis que o **único** ScrollTrigger da seção já escreve. Nenhum gatilho novo, nenhum re-render por quadro:

1. **`--impact-passagem`** — sinal novo no `onUpdate`: `0` com a etapa parada, `1` no meio do caminho entre duas. A lente respira com ele (`scale(calc(1 + 0.045 * var(--impact-passagem)))` nos anéis, `1 + 0.55 *` no node de chegada). É **seno**, não triângulo (`1 - |2t - 1|`): o triângulo tem quina nas duas pontas e a quina aparecia como estalo no fim de cada passagem. Zera na última etapa, senão o estado de conclusão ficaria pulsando.
2. **Arco de progresso ligado de facto** — `.impact-arco-vivo` com `stroke-dashoffset: calc(578.053 * (1 - var(--impact-etapa) / 6))`, sobre a calha `.impact-arco-calha`. Divide por 6 porque são sete indicadores: `--impact-etapa` vai de 0 a 6.
3. **Cabeça do arco** — a bolinha que anda pela borda da lente, `rotate(calc(-90deg + var(--impact-etapa) * 60deg))`. Existe porque o arco sozinho é traço fino e o avanço não aparecia. Está num **`<g>` próprio**, e não num elemento que já tenha `animation` — giro contínuo e valor por quadro na mesma propriedade do mesmo elemento é exatamente a colisão de SIS-42. E **sem `transition`**, porque o valor é reescrito a cada quadro pelo relógio do scroll.

Também entrou a **régua no pé do palco** (`.impact-regua` + `.impact-regua-viva` recortada pelo progresso): dá escala ao percurso sem acrescentar texto — a etapa em número continua no marcador do cabeçalho.

**Restrições respeitadas.** Um ScrollTrigger só, `scrub: 1`, seção alta de 520vh + interior `sticky` (nunca `pin: true`). Progresso publicado como variáveis CSS por `ref`. O único estado React continua a ser o índice ativo, que muda sete vezes — a guarda `if (indice === ativoRef.current) return` segue no lugar. Nada do que entrou é o único caminho para o conteúdo: o palco dirigido exige `isDesktop && !prefersReducedMotion()`.

**Validação.** `tsc --noEmit` e `npm run build` limpos. Contadores não recontam ao voltar e reavançar — `jaContou` no `ImpactNumero` é `ref`, e o gatilho é "virou o indicador ativo", não `useInView` (com `useInView` os sete contariam juntos no primeiro quadro, porque os sete estão na viewport ao mesmo tempo). Exatamente um `data-estado="ativo"` por vez, derivado do mesmo índice.

Comentários anteriores no Linear (antes do fechamento acima): causa raiz com arco invisível (`stroke-width: 1.6` no `viewBox` 200 → ~2,5px) e anéis lentos demais; depois, via SIS-63 (`8e83502`), `--impact-entrada` e recorte da curva +35% do vão, restando a impressão de lente "travada" no meio do percurso como decisão de desenho.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
Não declarados no relatório.

---

## SIS-52 — Sistran em números: layout e visual conforme a referência de design

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-52/sistran-em-numeros-layout-e-visual-conforme-a-referencia-de-design

### Pedido
Alinhar a seção à referência: faixa clara baixa e cheia com sobretítulo `SISTRAN EM NÚMEROS` em ciano e título em duas linhas equilibradas; marcador `03 / 07` no canto superior direito com trilho vertical; sete indicadores visíveis ao mesmo tempo ao longo da onda; onda acesa em ciano até o ponto da vez; aglomerados de esferas em volta da lente. Ajuste de `vaoEntreEtapas`, `DESVIOS_TRILHO` e CSS `impact-`; valores em `src/data/metrics.ts` não mudam (`130+` clientes). Modo lista intacto abaixo de 1024px / sem JS / movimento reduzido. Validação em 1920 e 1280, depois 1023px.

### O que foi feito
**Fechamento.** O escopo está todo em pé no código da seção. Item por item, com o lugar onde vive:

- **Sobretítulo `SISTRAN EM NÚMEROS`** — `Metrics.tsx` (`.impact-eyebrow`) na faixa, acima do título. Em branco, não em ciano: `#0ed8f6` sobre `#0875c5` mede 2,8:1 e o rótulo tem 12px (mínimo 4,5:1); branco puro mede 4,9:1. O ciano da marca segue no ponto final do título, na onda e nos nós, onde contraste não é requisito.
- **Título em duas linhas equilibradas** — `text-wrap: balance` em `.impact-titulo`, sem `<br>` no markup: a quebra tem de acompanhar a largura, e o mesmo título serve o modo lista e o modo dirigido, com corpos diferentes.
- **Faixa baixa e cheia** — `grid-template-rows: clamp(140px, 19svh, 178px)` no `.impact-sticky`. Continua travada (não `auto`), porque é dela que sai a linha-base da curva. O que ela devolveu foi todo para o palco.
- **Marcador no canto superior direito, trilho vertical** — `flex-direction: column` + `align-items: flex-end` no `.impact-marcador` e no `.impact-trilho`. Na vertical o ponto ativo cresce em **altura** (22px), não em largura: `width` viraria um traço apontando para fora do trilho.
- **Os sete indicadores visíveis ao mesmo tempo** — `vaoEntreEtapas` = 13,5% da largura, entre 150px e 250px. Em 1280px dá ~173px de vão (1037px de desenho, com folga nas pontas); em 1920px dá 250px (1500px). Os vizinhos não brigam com a lente porque estão deslocados na vertical (`DESVIOS_TRILHO`, alternância agora estrita — a lista antiga repetia o lado nos índices 3 e 4, o que só passava desapercebido com vão de 300px).
- **A lente deixou de ser um `clamp` independente** — `--impact-lente: clamp(260px, calc(var(--impact-vao) * 1.85), 400px)`. Era o desencontro entre vão e lente que punha o conteúdo do vizinho imediato atrás dos anéis.
- **Onda acesa até o ponto da vez** — `.impact-curva-viva` recortada por `--impact-aceso-x`, com o node aceso na borda da lente (`.impact-chegada`). A borda dura do corte cai dentro do buraco da máscara, então nunca aparece como risco vertical.
- **Aglomerados de esferas em volta da lente** — `.impact-no::before/::after`, rarefazendo por `data-dist` (0..3) em vez de opacidade fixa.

**Desvio consciente da descrição.** A task pedia "faixa clara baixa e cheia". Ela **não é mais clara**: SIS-61 passou a seção inteira a usar o `--fundo-marca` de Soluções, e SIS-60 tirou a emenda e a fronteira em curva junto. A geometria pedida aqui (faixa baixa, marcador no canto, trilho vertical) foi entregue; a cor divergiu por decisão posterior, e todo o contraste da faixa foi remedido contra `#0875c5`, não contra o claro.

**Validação.** `tsc --noEmit` e `npm run build` limpos. Os valores de `src/data/metrics.ts` não foram tocados — clientes segue `130+`. O modo lista continua intacto: todo o CSS do palco pende de `[data-dirigindo]`, atributo que só o JavaScript escreve, então abaixo de 1024px, sem JS ou com movimento reduzido a seção é a lista vertical dos sete com os valores finais no HTML.

Comentário anterior no Linear (parcial): commits `c00f2b6`, `8e83502`, `bb66f0f`, `c8accd0` já tinham fundo compartilhado, grade alinhada, `.impact-borda` comentada (SIS-64), vinheta, hastes (SIS-62) e abertura escalonada (SIS-63); faltava ainda a comparação item a item com a referência.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/Metrics.tsx`
- `src/data/metrics.ts` (não tocado; declarado no relatório)

---

## SIS-51 — Transição: componente que interliga Soluções de Negócios a Sistran em números

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-51/transicao-componente-que-interliga-solucoes-de-negocios-a-sistran-em

### Pedido
Um elemento condutor ancorado nas duas pontas (Soluções `#solucoes` → Metrics `#resultados`), no padrão de `MosaicHandoff.tsx`: `position: fixed`, irmão direto em `page.tsx`; relógio = seção de destino via `getBoundingClientRect`; origem/destino em `data-*`; um `rAF` por rajada; `aria-hidden` + `pointer-events: none`; inexistente abaixo de 1024px ou com movimento reduzido. Candidato: continuar `.solutions-fio` até a onda da Metrics. Depende de SIS-50. Não tocar no `MosaicHandoff`.

### O que foi feito
Implementado e depois **comentado** → In Review (commits `8e83502` e `5306a7e`).

O condutor foi construído como pedido: `ui/SolutionsToMetrics.tsx`, `position: fixed`, irmão direto das duas seções, relógio no topo de `#resultados`, ancorado em `[data-fio-saida]` (Soluções) e `[data-fio-chegada]` (Metrics), um `requestAnimationFrame` por rajada, desligado abaixo de 1024px e em movimento reduzido.

Na revisão visual ele é o traço aceso que atravessa o título "Sistran em números" na diagonal — a parte que ficou feia na captura. E isso não se resolve por calibragem: a saída do fio de Soluções está na **direita** da tela e a boca de entrada da onda da Metrics na **esquerda**, então o percurso obrigatoriamente cruza a largura inteira da janela, por cima do cabeçalho. É geometria das duas âncoras.

Comentei no padrão da casa em vez de remover: o componente, as duas marcas de âncora e o bloco `.fio-travessia` do `globals.css` seguem intactos, e a nota no lugar do consumo em `page.tsx` diz que religar sem mover uma das âncoras traz a diagonal de volta. Religar é descomentar duas linhas.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/ui/SolutionsToMetrics.tsx`
- `src/app/page.tsx`
- `src/app/globals.css`

---

## SIS-50 — Sistran em números: mover a seção para o lugar de "Resultados | evidências dos casos"

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-50/sistran-em-numeros-mover-a-secao-para-o-lugar-de-resultados-evidencias

### Pedido
`<Metrics />` (`#resultados`) sobe na home para a posição 4, logo depois de `<MosaicHandoff />`, no lugar do kicker "Resultados | evidências dos casos". Decidir o destino de `<MetricsStrip />` (comentar, não apagar). Metrics fora do wrapper da serifa, do `SectionReveal` e do `.section-light` (sticky). Conferir `--deep` se o `MetricsStrip` sair; conferir emendas de cor e `ScrollSpy`. Destrava SIS-51.

### O que foi feito
Feito → In Review (commit `c00f2b6`).

A seção subiu para o lugar que era do bloco "Resultados | evidências dos casos": `<Metrics />` agora vem logo depois de `<MosaicHandoff />`, e o `<MetricsStrip />` que ocupava essa vizinhança ficou comentado (duas faixas de indicadores numéricos coladas repetiriam a mesma figura duas vezes).

Ela ficou fora do wrapper da serifa editorial, fora do `SectionReveal` e fora do `.section-light`, de propósito: tem percurso de scroll próprio (seção alta + `sticky`) e qualquer ancestral com `transform` faria o `sticky` perder a referência da janela. O motivo está anotado no JSX.

Ressalva de processo: este commit agrupou SIS-50 a SIS-59, contra a regra de um commit por task. Os três seguintes (`bb66f0f`, `c8accd0`, `5306a7e`) voltaram ao commit por alteração.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/app/page.tsx` (declarado no relatório)

---

## SIS-35 — Contato fecha o percurso, e auditoria de movimento reduzido e performance da home

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-35/contato-fecha-o-percurso-e-auditoria-de-movimento-reduzido-e

### Pedido
Última task da reforma: o último nó do fio acende em `#contato` e a linha se dissolve na faixa clara. `Contact`, `Social` e `ContactCTA` recebem a revelação da SIS-31 sem duplicar movimento (`motionShowcase` no CTA da home). Modal de contato intocado. Auditoria de movimento reduzido (todo conteúdo alcançável; nada em `opacity: 0`; marquee não esconde marcas; zero erro de hidratação) e de performance (só `transform`/`opacity`/`filter`; `will-change` pontual; blur simultâneos; CPU 4×; Lighthouse). Validação: `tsc`/`eslint`; âncoras e `ScrollSpy` em ≥1440px; Tab na home.

### O que foi feito
Feito em dois commits: `3f6d1cf` (fechamento do fio + roxo) e `4175052` (roxo do header).

**Fechamento do percurso.** O fio não terminava, ele apenas parava: seguia aceso até o rodapé — sugerindo caminho onde não havia — e o traço ciano sobre a faixa clara do Contato virava o elemento mais forte da tela justamente na hora em que quem lê deve olhar para o formulário. Agora ele **se dissolve** nos últimos ~12% da página, por `opacity: calc((1 - var(--scroll-p)) * 8)`: o UA já limita `opacity` ao intervalo [0,1], então o fecho não custa **uma linha de JavaScript**. E a última parada (`#contato`) ganhou um anel a mais e mais corpo que as intermediárias — é o único momento em que o fio diz "aqui acaba". O nó acende enquanto o traço apaga.

**Contato / Social / ContactCTA: nada adicionado, de propósito.** SIS-31 já estabeleceu que as três se encenam sozinhas. Sobrepor um reveal seria movimento sobre movimento no mesmo elemento. **O modal de contato não foi tocado** — nem markup, nem estilo, nem o bloqueio de scroll.

**Auditoria de movimento reduzido** (`.claude/skills/reduced-motion-conteudo`) — a base já estava sólida das sessões anteriores e foi conferida item por item: o marquee **não congela**, ele troca de mecanismo (vira lista rolável nativa com `overflow-x: auto !important`, e a cópia duplicada sai de cena para o leitor de tela não ler tudo duas vezes); o hero vira seção em fluxo e as três legendas viram lista, em vez de empilharem ilegíveis; `[data-reveal]`, `.reveal` e `.reveal-stagger` têm estado final **visível** garantido, então nada fica preso em `opacity: 0`; o `CountUp` entrega o valor final; o fio aparece **inteiro** em vez de parado num traço parcial, porque ele é referência de percurso. O `useReducedMotion` da casa nasce em `false` e converge no efeito, e o `ScrollSpine` mantém a **mesma árvore de DOM** nos dois modos (só troca um atributo) — sem risco de hydration mismatch.

**Auditoria de performance** (`performance-gpu`): as animações do percurso são só `transform`, `opacity` e `filter`. O fio custa **zero JS por quadro** — consome o `--scroll-p` que o `SmoothScroll` já publica, e o `stroke-dashoffset` sai de um `calc()`. `will-change` aparece 20 vezes no projeto, todas em elementos que de fato animam de forma recorrente.

**Correções de marca fora do escopo previsto, mas encontradas na auditoria** — a paleta é branco + azuis e não admite roxo (`.claude/skills/sistran-marca`). Três violações vivas, todas passadas ao ciano/azul da marca na mesma opacidade, preservando o desenho:
- `.section-light` — brilho violeta do canto inferior direito;
- `ContactCTA` — terceira parada do degradê do cartão;
- **`Header`** — a hairline da borda inferior ia de ciano a violeta. Era a mais visível de todas: o header aparece em **todas as páginas**.

O HTML servido da home agora tem **zero** ocorrências de `124,58,237`.

Ainda restam referências violeta em `globals.css` (linhas ~98, 150, 175, 405, 459, 684, 1495, 1507) e o token `--color-purple`, em seletores que **não são exercitados pela home**. Não mexi: varrê-las é sweep de marca no site inteiro, com risco visual em páginas fora desta issue — melhor como task própria.

Verificado: `tsc --noEmit` sem saída, `eslint` sem erros (só um aviso pré-existente no `Header.tsx:62`, sobre `setState` em efeito, alheio a esta mudança), home respondendo 200.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
Não declarados no relatório.

---

## SIS-34 — Seções com pin (Soluções, ImpactSequence, Metrics) entram no sistema sem quebrar o sticky

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-34/secoes-com-pin-solucoes-impactsequence-metrics-entram-no-sistema-sem

### Pedido
As três seções com percurso próprio (`Solutions` 400vh + `--sol-p`; `ImpactSequence`; `Metrics`) não podem receber `SectionReveal` (transform mata sticky). Encenação pelo trigger que já existe; fio por cima dos fundos e por baixo do texto (`z-index`); `overflow: clip` e não `hidden`. Pitfalls: `ScrollTrigger.refresh()` após `fonts.ready` e `resize`; índice com `Math.min(progress, 0.999999)`; `setState` só quando o índice muda. Validação nos dois sentidos, resize no meio, 1024 / 1280+ / mobile; `tsc`/`eslint`.

### O que foi feito
Feito no commit `9aaac86`. Duas correções, e a primeira é um bug real introduzido em SIS-30:

**1. O fio desaparecia ao cruzar "Sistran em números".** Ele estava em `z-index: 20`; `.impact-scroll` é uma camada fechada (`isolation: isolate`, `z-index: 30`) com fundo **opaco** `#041a33`. Resultado: a linha sumia exatamente sobre uma das suas cinco paradas — o pior lugar possível. Subiu para **45**: acima de `.progresso-lateral` (40, fixa na borda esquerda em /quem-somos) e abaixo do header (50), que o fio não deve atravessar.

**2. `overflow: hidden` → `clip` nos dois pontos estruturais do caminho sticky** (`.ct-trilha[data-modo="scroll"] .ct-inner` e `.impact-palco`). `hidden` torna o ancestral o scrollport mais próximo, o que **mata o `sticky` dos descendentes** e corta a travessia entre seções; `clip` recorta sem criar scrollport. Cada troca ficou comentada no CSS com o motivo, para ninguém "consertar" de volta.

Verificado: `tsc --noEmit` e `eslint` sem saída, home respondendo 200.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
Não declarados no relatório.

---

## SIS-32 — Emendas entre seções: nenhuma troca de fundo com corte seco

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-32/emendas-entre-secoes-nenhuma-troca-de-fundo-com-corte-seco

### Pedido
Seis emendas na ordem da página: hero → mosaico; mosaico → Soluções; Soluções → `MetricsStrip`; `SignalMarquee` → `ImpactSequence`; `ImpactSequence` → `Metrics`; `Metrics` → `Contact`. Cor de saída = cor de entrada; quem já resolve a própria costura não ganha camada nova. Pseudo/gradiente estático, `pointer-events: none`. Validação parando em cada emenda em 1024, 1280+ e mobile; contraste WCAG AA.

### O que foi feito
Feito no commit `59e85bc`.

Mapeei as **seis emendas** da home pela cor medida de cada lado, não por impressão, e apliquei camada nova só nas quatro que precisavam — respeitando a regra da própria issue de que seção que já resolve a sua costura não recebe nada:

1. **hero → mosaico** — intocada de propósito: o hero encolhe em card sobre fundo claro e já entrega a cor do mosaico.
2. **mosaico → Soluções** — camada branca no topo de `.solutions-scroll`, dissolvendo em 220px.
3. **Soluções → MetricsStrip** — camada `#004d8a` na base da mesma seção, subindo 200px.
4. **parceiros → ImpactSequence** — camada `--paper` no topo de `.sequence`, dissolvendo em 40svh.
5. **ImpactSequence → Metrics** — intocada: as duas já desenham o próprio par de fundos.
6. **Metrics → Contato** — `.emenda-de-escuro::after` no bloco do Contato.

Duas decisões que valem registro:

- **Camadas de `background` em vez de pseudo-elemento** em três das quatro. Camada de fundo pinta sempre abaixo de todo o conteúdo: não há `z-index` para acertar nem `pointer-events` para lembrar.
- **A emenda 6 ficou do lado do Contato**, e não no fim da Metrics, porque lá embaixo há números claros sobre palco escuro — clarear aquele fundo arruinaria o contraste do texto.

Verificado: `tsc --noEmit` e `eslint` sem saída.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
Não declarados no relatório.

---

## SIS-31 — Revelação encenada: componentes de cada seção surgindo em etapas no scroll

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-31/revelacao-encenada-componentes-de-cada-secao-surgindo-em-etapas-no

### Pedido
"Cada seção os componentes vão surgindo." `SectionReveal` já existe, mas quase nenhum nó tem `data-reveal`. Marcar alvos; stagger em etapas; vetor `opacity` + `y` + `blur` com `--ease-out` e `toggleActions: 'play none none reverse'`. Soluções, Metrics, ImpactSequence e MetricsStrip **não** entram no wrapper. Rede de segurança de 600ms do IntersectionObserver permanece. Movimento reduzido: nenhum alvo em `opacity: 0`. Validação lenta/rápida e com `prefers-reduced-motion`.

### O que foi feito
Feito no commit `7ec6aae`.

**O diagnóstico mudou a tarefa.** Os três `SectionReveal` que envolviam Contato, Social e ContactCTA na home não faziam nada: o componente anima só os nós marcados com `data-reveal`, e um grep no projeto inteiro provou que esse atributo **não existia em lugar nenhum**. Eram invólucros inertes — a causa real da queixa de "nada anima".

A correção óbvia (marcar `data-reveal` dentro das seções) estaria errada: as três já se encenam sozinhas, cada uma do seu jeito — o Contato pelo `--ct-surgir` do próprio percurso sticky, o Social e o ContactCTA por `whileInView` do Motion, mais a digitação do título no último. Marcar os nós criaria **duas animações de entrada disputando o mesmo elemento**.

Então: os três wrappers saíram (e o import foi comentado, com nota de como religar — `ui/SectionReveal.tsx` continua intacto no projeto), e fechei a única lacuna verdadeira que sobrou — o `SectionIntro` do `MetricsStrip` era o **único cabeçalho da home que chegava pronto** enquanto os cartões abaixo dele subiam em cascata, o que fazia o bloco parecer começar pelo meio. Agora ele é `progressive`: acende palavra por palavra conforme o scroll. Frase de oito palavras, dentro do limite do `ProgressiveText`; sob movimento reduzido nasce inteira.

Verificado: `tsc --noEmit` e `eslint` sem saída.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/ui/SectionReveal.tsx` (intacto; import comentado)

---

## SIS-30 — Fio condutor: componente que costura hero → contato, desenhado pelo scroll

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-30/fio-condutor-componente-que-costura-hero-contato-desenhado-pelo-scroll

### Pedido
Linha vertical contínua do hero ao contato, desenhada pelo scroll, com nó por seção (`top`, `sinais`, `solucoes`, `resultados`, `contato`). SVG `fixed`, `pointer-events: none`, `aria-hidden`; `stroke-dashoffset` via progresso global da SIS-29; um só observador. Paleta sem roxo: calha navy, linha `#0079CB` → `#0ed8f6`, nó `#A5F0FF`. Não filho de `SectionReveal`. Movimento reduzido: fio inteiro e estático ou não renderizado, mesma árvore DOM. Validação nos dois sentidos, pin, 1024 / 1280+ / mobile, zero hydration mismatch.

### O que foi feito
Feito no commit `c2b1d63` — feat(home): fio condutor costurando hero -> contato.

**O que foi implementado**

- Novo `src/components/ui/ScrollSpine.tsx`: SVG fixo na lateral esquerda com uma serpentina suave (calha + linha viva), montado em `src/app/page.tsx` como irmão direto das seções dentro do `<main>` — nunca dentro do `SectionReveal` nem de outro wrapper animado, porque `position: fixed` morre sob ancestral com `transform`/`filter`/`clip`.
- Cinco paradas, na ordem da página: `#top` (hero), `#sinais` (mosaico), `#solucoes`, `#resultados`, `#contato`. Os nós ficam sobre o caminho, posicionados em % a partir de pontos medidos com `getPointAtLength()`.
- CSS no fim do `globals.css`: calha `rgba(165,240,255,.14)`, linha viva `--color-sky` (`#0ed8f6`), nó percorrido `#0079CB`, nó ativo `#A5F0FF` com dois halos ciano. Só azuis e navy — nenhum roxo.

**Decisões que vale registrar**

1. **Zero JavaScript por quadro.** O desenho é `stroke-dashoffset: calc(var(--spine-len) * (1 - var(--scroll-p)))`, consumindo o `--scroll-p` que a SIS-29 passou a publicar no `<html>`. O único estado é o nó ativo, de um `IntersectionObserver` com `rootMargin: '-45% 0px -45% 0px'` (mesmo critério do `ScrollSpy`).
2. **Não precisa remedir em `resize` nem em `fonts.ready`**: o caminho vive num `viewBox` fixo; `vector-effect="non-scaling-stroke"` mantém a espessura sob `preserveAspectRatio: none`. Uma medição única, no efeito de montagem.
3. **Nós em frações iguais do caminho**, e não na altura real de cada seção: o fio é metáfora de percurso, não mapa em escala.
4. **Nós em HTML, não `<circle>`**: com `preserveAspectRatio: none` um círculo do SVG viraria elipse.
5. `z-index: 20` — acima das seções e abaixo do header (`z-50`).
6. Só a partir de 1280px. Abaixo disso o conteúdo ocupa a largura útil e o fio viraria estorvo — `aria-hidden`, sem captura de ponteiro.

**Movimento reduzido**: o fio aparece **inteiro** (`stroke-dashoffset: 0`, sem brilho). O nó ativo continua acendendo, sem transição. A árvore de DOM é idêntica nos dois modos: só o atributo `data-rm` troca depois da hidratação.

**Verificação**: `npx tsc --noEmit` (excluindo o vendorizado `sistran-river-park-3d`) sem saída; `npx eslint` nos dois arquivos sem saída; `localhost:3000` respondendo 200 e a marcação `.spine` / `.spine-calha` / `.spine-viva` presente no HTML do servidor. Sem PR, conforme combinado.

**Revertido a pedido** no commit `b3aa510`. A linha vertical passava por cima do conteúdo — cruzando a imagem e o botão "…PARA EXPLORAR" — e incomodava mais do que orientava. O consumo em `page.tsx` foi **comentado**, com o import: `src/components/ui/ScrollSpine.tsx` e o bloco `.spine` do `globals.css` seguem intactos. Nada de conteúdo se perdeu: o fio era decorativo e `aria-hidden`. A interligação continua pelas emendas de cor da SIS-32. O fechamento do percurso da SIS-35 perde o objeto — aquele CSS continua no arquivo, inerte.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/ui/ScrollSpine.tsx`
- `src/app/page.tsx`
- `src/app/globals.css`

---

## SIS-29 — Scroll suave: afinar o Lenis como relógio único do percurso hero → contato

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-29/scroll-suave-afinar-o-lenis-como-relogio-unico-do-percurso-hero

### Pedido
Afinar `SmoothScroll.tsx` (hoje `duration: 1.8`, `lerp: 0.08`, `wheelMultiplier: 0.85`, `anchors: true`): escolher um eixo (lerp OU duration+easing); easing alinhado a `--ease-out: cubic-bezier(0.22, 1, 0.36, 1)`; conferir sync ScrollTrigger/`lagSmoothing(0)`; `scroll-margin-top` nas âncoras; publicar progresso global no `<html>` sem `setState`. Não mexer em `pauseSmoothScroll`/`resumeSmoothScroll` nem em `overflow: hidden` no `html`. Lenis continua ausente sob `prefers-reduced-motion`. Validação: roda, trackpad, teclado, barra; âncoras abaixo do header; modal de contato; movimento reduzido nativo.

### O que foi feito
Feito em `48fbaaa`, um arquivo: `src/components/ui/SmoothScroll.tsx`.

**A causa raiz era um conflito de opções.** Havia `duration: 1.8` **e** `lerp: 0.08` no mesmo objeto. Os dois são controles do mesmo eixo e o Lenis usa um só — com `lerp` presente a duração é ignorada, e o `easing` configurado (que só existe no modo por duração) nunca chegava a ser aplicado.

Ficou o **modo por duração** (`duration: 1.3`): cada gesto anima até um alvo e termina. A inércia do `lerp` é exponencial — sempre se aproximando, nunca chegando — e era ela que fazia a página continuar patinando depois que a roda parava.

**Curva da marca:** a `--ease-out: cubic-bezier(0.22, 1, 0.36, 1)` não entra como string (o Lenis quer função de `t`). Entra como `easeOutQuint` (`1 - (1-t)^5`), mesma família — arranca rápido, assenta longo.

**Progresso global (`--scroll-p`):** publicado no `<html>`, uma escrita por quadro direto no nó, sem `setState`. Valor de `lenis.scroll`, não de `window.scrollY`.

**Movimento reduzido:** o Lenis continua não sendo criado e o scroll segue nativo. O progresso é publicado por um listener próprio (`scroll` passivo + `resize`).

**Âncoras (item 4): já estavam corretas, nada a mudar.** `globals.css:916` aplica `scroll-margin-top: calc(var(--header-h) + 24px)` em `section[id]`, e os cinco alvos da home (`#top`, `#sinais`, `#solucoes`, `#resultados`, `#contato`) são todos `section`.

**Não tocado:** `src/lib/smoothScroll.ts` e o bloqueio de scroll dos modais.

`npx tsc --noEmit` (filtrando `sistran-river-park-3d`) e `npx eslint` sem saída; home respondendo 200 no dev server.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/ui/SmoothScroll.tsx`

---

## SIS-28 — Trazer o teatro de "Soluções de Negócios" para o lugar do Método

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-28/trazer-o-teatro-de-solucoes-de-negocios-para-o-lugar-do-metodo

### Pedido
Mover `<Solutions />` para o espaço aberto por SIS-26 e SIS-27 (lugar do Método). Só o cabeçalho de Soluções permanece. Onde estava, Metrics emenda no Contato. Resolver âncoras: `#sistema` vs. `#servicos` vs. `#solucoes` (ScrollSpy/Hero). Sticky sem `SectionReveal` nem ancestral `overflow: hidden`/`transform`. Não mexer em `solutions.ts`, modal, Metrics, mosaico, MetricsStrip, marquee, ImpactSequence. Validação das quatro cenas, 1024 / 1280+ / mobile, movimento reduzido, link do hero.

### O que foi feito
Feito em `882b822`, um commit só, sem PR. Fecha a cadeia SIS-26 → SIS-27 → SIS-28.

**A mudança.** Em `src/app/page.tsx`, `<Solutions />` saiu de baixo de "Sistran em números" e subiu para logo depois do mosaico — o vão exato onde estavam o texto de abertura, os quatro movimentos e o vídeo. A ordem servida confirma: `top` → `sinais` (mosaico) → `solucoes` → `resultados` → `contato`.

**Só o cabeçalho de Soluções**, como decidido: a pílula "Veja como a Sistran pode ajudar sua Seguradora nos mais variados desafios de negócios." + o título "Soluções de Negócios". O kicker "Método | quatro movimentos" foi embora com o `SectionIntro` na SIS-26.

**A seção do Método foi comentada por inteiro.** Depois das duas tasks anteriores ela não tinha mais conteúdo — sobrava uma faixa escura com grafismo de fundo (`TechnicalBackdrop`) e um `lp-container` vazio. O `TechnicalBackdrop` saiu do import junto.

**As âncoras, resolvidas:**

- `#sistema` sai com a seção. Varri o repositório: **ninguém aponta para lá** — nem `src/data/nav.ts`, nem o `ScrollSpy`, nem link interno algum.
- `aria-labelledby="sistema-title"` deixou de existir junto com a seção.
- `id="servicos"` da seção de Soluções virou **`id="solucoes"`**, consertando o bug em que o `ScrollSpy` e o hero linkavam `#solucoes` mas nenhum elemento carregava esse `id`.

**O percurso de scroll.** `<Solutions />` é filho direto de `<main>`: fora do `SectionReveal` e fora do wrapper da serifa editorial. A trilha de 400vh (`solutions-trilha`) e o `solutions-scroll` aparecem íntegros no HTML servido.

**Onde a seção estava não ficou buraco:** "Sistran em números" emenda direto no bloco claro de Contato.

**Validação:** `npx tsc --noEmit` (filtrando o `sistran-river-park-3d`) e `npx eslint` nos três arquivos, sem saída. HTML servido: um `id="solucoes"`, zero `id="servicos"`, zero `id="sistema"`, os dez tiles do mosaico intactos. `src/data/solutions.ts` não foi tocado.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/app/page.tsx`

---

## SIS-27 — Método: comentar o vídeo e neutralizar o tile viajante que o carrega

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-27/metodo-comentar-o-video-e-neutralizar-o-tile-viajante-que-o-carrega

### Pedido
Comentar (não apagar) o `<ScrollVideo>` em `.scene-media` e a caixa se ficar vazia. O tile `.stack-carrier` nasce no mosaico e aterra na `.scene-media`; comentar o destino sem tratar a origem deixa o tile viajando para caixa inexistente. Saída 1: comentar o tile viajante junto. Saída 2: viagem ancorada no mosaico sem vídeo. Mosaico continua; `CARRIER_VIDEO` permanece. Não remover `public/videos/`. Não mexer em textos (SIS-26), números nem modal. Validação: sem tile fantasma, sem `<video>` órfão, movimento reduzido.

### O que foi feito
Feito em `f208a2e`, um commit só, sem PR.

**Escolhi a saída 1** das duas propostas: comentar o tile viajante junto com a caixa de destino.

**O que saiu de cena** em `src/components/legacy/StackScenes.tsx`:

- `<ScrollVideo className="scene-video" …>` e a `.scene-media` em volta dele.
- A `.scene-story` inteira: as duas colunas eram a caixa de vídeo e os quatro movimentos já comentados na SIS-26.
- O tile de ligação `.stack-carrier`, com o `carrier-video` dentro.

**O buraco no mosaico, evitado.** O tile "Microserviços" estava com `visibility: hidden` na camada de tiles. Sem o clone, esconder deixaria um vão. O `visibility` saiu e os **dez tiles voltam a aparecer** (HTML servido: 10 `mosaic-tile`, 10 rótulos, zero `visibility:hidden`).

**A plumbing que ficaria sem consumidor**, comentada junto: refs `media`/`carrier`, `travel`/`setTravel`, `landingY`, `sceneEndY`, as duas medições, o `handoff` (`cx`, `cy`, `csx`, `csy`, `label`, `carrierOut`, `mediaIn`) e o relógio `reel`.

**Nada removido.** `ScrollVideo`, o CSS `.scene-media` / `.scene-video` / `.carrier-video`, os dados em `src/data/legacy.ts` e `/videos/process-scroll.mp4` seguem no lugar. `CARRIER`, `CARRIER_VIDEO` e `offsetIn` continuam declarados.

**Nota de forma:** os três blocos comentados viraram **um** comentário só em volta da `.scene-story` (em JSX o primeiro fechamento encerra tudo).

**Validação:** `npx tsc --noEmit` e `npx eslint` sem saída. HTML servido: zero `scene-video`, `scene-media`, `scene-step` e `stack-carrier`; `#sistema` com `aria-label="Método"`. Nenhum `<video>` órfão. O `#sistema` fica momentaneamente como faixa escura sem conteúdo — vão que a SIS-28 preenche.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/legacy/StackScenes.tsx`

---

## SIS-26 — Método: comentar o texto de abertura e os quatro movimentos

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-26/metodo-comentar-o-texto-de-abertura-e-os-quatro-movimentos

### Pedido
Comentar (não apagar) o conteúdo textual de `section#sistema` em `StackScenes.tsx`: `SectionIntro` (`scenesIntro`) e os quatro movimentos (`.scene-steps` / `scenes`). Dados em `legacy.ts` e CSS intactos. Se `active`/`register` ficarem sem uso, comentar junto. Ajustar `aria-labelledby="sistema-title"` se o título sair. Não mexer no mosaico, vídeo (SIS-27), vizinhas, números nem modal. Validação: `tsc`/`eslint`; sem espaço morto nem `aria` órfão.

### O que foi feito
Feito em `ab28374`, um commit só, sem PR.

**O que saiu de cena** em `src/components/legacy/StackScenes.tsx`:

- O `SectionIntro` inteiro — kicker "Método | quatro movimentos", título "A transformação começa quando o legado se torna explicável." e o parágrafo "Quatro movimentos organizam a transformação…".
- O bloco `.scene-steps` com os quatro passos numerados e seus textos.

**Comentado, não removido.** `scenesIntro` e `scenes` seguem intactos em `src/data/legacy.ts`; o componente `SectionIntro` e o CSS `.scene-story` / `.scene-steps` / `.scene-step` em `legacy.css` não foram tocados. Religar é descomentar quatro pontos: os dois blocos no JSX, a linha do `useActiveStep` e os dois imports no topo.

**Os dois efeitos colaterais previstos na task, resolvidos:**

1. A chamada `useActiveStep(scenes.length)` foi comentada junto, e com ela os imports `SectionIntro` e `useActiveStep`.
2. `aria-labelledby="sistema-title"` virou `aria-label="Método"`, com a nota de voltar ao `aria-labelledby` quando o `SectionIntro` religar.

`scenes` continua importado de propósito: a medição do relógio do vídeo (`sceneEndY`) ainda o referencia (sai na SIS-27).

**Validação:** `npx tsc --noEmit` (filtrando o `sistran-river-park-3d`) e `npx eslint` no arquivo tocado, ambos sem saída. Mosaico, vídeo, seções vizinhas, "Sistran em números" e o modal de contato não foram tocados.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/legacy/StackScenes.tsx`

---

## SIS-25 — Contato: endereço da sede ainda apagado — ajustar o tom do azul do cartão

**Status:** In Review · **Labels:** — · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-25/contato-endereco-da-sede-ainda-apagado-ajustar-o-tom-do-azul-do-cartao

### Pedido
Reabertura de SIS-16 / SIS-17: o endereço da sede continua apagado contra o navy do cartão; o título ciano lê-se. Hipótese: tom do azul próximo em luminância do texto; override `.section-light .contact-inline span` devolvendo `--contact-text`. Escurecer o navy e/ou reduzir translucidez; corpo do endereço com cor cheia, sem alpha; contraste AA no pior caso (fachada clara); `backdrop-filter` não substitui contraste. Não alterar o texto, o modal além do necessário, números nem vizinhas. Validação em `/#contato` (modal e inline), 1440 e 1920 e mobile.

### O que foi feito
Movido para In Review — commit `7c8857d`, arquivo único `src/app/globals.css`.

**Diagnóstico.** A auditoria da cascata descartou as suspeitas anteriores: só um componente renderiza o endereço (`ContactPanel.tsx`), o cartão está em `z-index: 3` acima do véu da foto (`z-index: 1`), a regra base já estava em `rgba(3,24,47,0.92)` e nenhum ancestral aplica `opacity`/`filter`/`mix-blend-mode`. O que restava eram duas coisas de **tom**:

1. `#03182f` é um navy quase preto-esverdeado. Composto sobre a fachada iluminada ele vira cinza-chumbo — o cartão **inteiro**, não só o texto, lia como mancha apagada.
2. `.section-light .contact-inline span:not([class*="eyebrow"])` (três classes + elemento) vencia a regra base do endereço (uma classe) e reescrevia a cor de volta para `--contact-text` (`#f7fbff`, azulado). Era a razão de a correção do SIS-17 não aparecer na seção inline.

**O que foi feito**

- Fundo do cartão passa para a família azul institucional da marca, saturada: `linear-gradient(135deg, rgba(0,26,61,0.96), rgba(0,45,92,0.93))`.
- Borda em ciano da marca (`rgba(14,200,245,0.34)`) no lugar do azul-acinzentado de `--contact-border`, mais sombra externa de separação e halo interno de 1px.
- Corpo do endereço em branco puro (`#ffffff`) e peso 450, com a exceção específica dentro do bloco `.section-light .contact-inline`.
- `backdrop-filter` mantido como refinamento — o contraste vem do alpha/tom, não do blur.

Contraste do corpo no pior caso (trecho branco da fachada, cartão compositado): ~14:1.

Texto do endereço, título em ciano, hierarquia do cartão, modal de contato e seções vizinhas: inalterados.

**Verificação**: `npx tsc --noEmit` limpo (exceto o `sistran-river-park-3d` vendorizado, pré-existente). Sem prettier/stylelint — o repositório não tem configuração para nenhum dos dois.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/app/globals.css`

---

## SIS-24 — Card do LinkedIn: aplicar o efeito de revelação em hover das duas faces

**Status:** In Review · **Labels:** nenhuma · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-24/card-do-linkedin-aplicar-o-efeito-de-revelacao-em-hover-das-duas-faces

### Pedido
Aplicar ao card do LinkedIn o efeito de duas faces da referência: `face1` (ícone colorido) visível no repouso, deslocada para baixo cobrindo `face2` (painel branco com título e descrição); no hover, `face1` sobe à posição neutra e `face2` desliza para cima. Paleta da referência (`#333` → `#ff0057`) não entra: azul da marca no repouso e realce ciano no hover; tipografia, ícone e tokens de sombra/raio do projeto. Só `transform` e `opacity`. O card é um link: conteúdo essencial acessível a leitor de tela e link operável no repouso; o efeito dispara também em `:focus-visible`; sem efeito em toque (`@media (hover: hover) and (pointer: fine)`); em `prefers-reduced-motion` as duas faces ficam legíveis sem movimento; nada cortado nem overflow horizontal. Não alterar texto, link, “Sistran em números”, modal de contato nem seções vizinhas. Validar repouso, hover, teclado, toque, reduced-motion, lint e tipos.

### O que foi feito
Movido para In Review — commit `0a906d3` (`src/app/globals.css`, `src/components/Social.tsx`).

**Onde entrou.** A seção `#SomosSistraners` só tinha copy e botão — não havia card no código. O card foi construído ali, como o link para o LinkedIn, à direita do texto num grid de duas colunas em `lg` (embaixo em telas menores).

**Paleta traduzida.** `#333` → `#ff0057` da referência não entrou. Repouso no azul institucional (`#004D8A` → `#0079CB`), realce no hover em ciano (`#0079CB` → `#0ed8f6`) com o glow ciano da marca (`0 0 60px -18px #0ed8f655`). Verso em branco com navy `#0a1f44` / `#3C5A7A`. Easing `cubic-bezier(0.22, 1, 0.36, 1)`, 620ms.

**Geometria.** Duas linhas de mesma altura; no repouso a frente desce meia linha (`translateY(6.5rem)`) e o verso sobe meia linha. As duas faces ocupam exatamente a mesma faixa central e a frente cobre o verso pelo `z-index` — o card lê como peça única. No hover cada face volta para a sua linha e o card se abre em duas metades. Os deslocamentos são para dentro da caixa, então não há overflow para clipar e nada aparece cortado.

**Restrições atendidas**
- Gesto em CSS, não em Motion: hover e `:focus-visible` são estados do próprio elemento. Só `transform`, `background` e `box-shadow` — nada de layout.
- Dispara também em `:focus-visible`, com o `outline` desenhado nas faces e não na caixa do grid.
- Sem gesto em toque: `@media not all and (hover: hover) and (pointer: fine)` deixa o card aberto.
- Movimento reduzido (`html[data-motion="reduce"]` e `prefers-reduced-motion`): card nasce aberto e imóvel. Sem forçar esse estado final, o reset global mataria a transição e o verso ficaria escondido.
- Destino claro no repouso (“LinkedIn da Sistran”), link operável sem hover.
- Nome acessível vem do conteúdo, sem `aria-label`. Só o ícone é `aria-hidden`.

Texto e link existentes, seção “Sistran em números”, modal de contato e vizinhas: inalterados.

**Verificação:** `npx tsc --noEmit` limpo, `npx eslint src/components/Social.tsx` sem apontamentos; o chunk servido pelo dev server confirma as 17 regras compiladas, inclusive a media query negada de toque.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/app/globals.css`
- `src/components/Social.tsx`

---

## SIS-23 — Siga a Sistran no LinkedIn: fundo dinâmico e componentes reativos ao mouse

**Status:** In Review · **Labels:** nenhuma · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-23/siga-a-sistran-no-linkedin-fundo-dinamico-e-componentes-reativos-ao

### Pedido
Na seção `#SomosSistraners` / “Siga a Sistran no LinkedIn”, o fundo era degradê azul estático com marca-d’água `#SOMOSSISTRANERS` parada. Pedido: fundo dinâmico (luzes que derivam, malha técnica, grafismo da paleta, sem HUD/neon) e componentes reativos ao mouse (marca-d’água, eyebrow, título, parágrafo e botão) com deslocamento em camadas e brilho no cursor, amplitudes contidas. Reação é enriquecimento, não requisito de acesso. Sem reação em toque (`@media (hover: hover) and (pointer: fine)`); respeitar `prefers-reduced-motion`. Posição do ponteiro via CSS custom properties escritas por ref + `requestAnimationFrame`, sem `setState` por evento; cleanup do listener. Animar só `transform`, `opacity` e `filter` leve; sem Canvas/WebGL. Não alterar textos, link do LinkedIn, “Sistran em números”, modal nem vizinhas; sem overflow horizontal.

### O que foi feito
Movido para In Review — commit `c2c9c49` (`src/app/globals.css`, `src/components/Social.tsx`).

**Fundo dinâmico.** Duas camadas de luz novas (`.social-luz-a` / `.social-luz-b`) por gradiente radial — sem `filter: blur()`, o borrão sai do próprio gradiente, então não há custo de filtro numa camada de 68vw. Elas se movem em sentidos opostos e com tempos diferentes. Os dois orbs mantêm a deriva contínua própria (`drift`).

**Reação ao ponteiro, em camadas.** Amplitude decrescente do fundo para o texto: luzes (26vw / 16vw) → orbs (70px / 58px) → marca-d’água (22px) → card (16px) → bloco de copy (10px / 6px).

**Como está implementado**
- `--sx`/`--sy` (0..1) publicadas na própria seção, escritas por `ref` num único `requestAnimationFrame` coalescido — nunca `setState` por evento. Cleanup remove os dois listeners e cancela o quadro pendente.
- `pointerleave` devolve as variáveis ao centro.
- O acompanhamento é `transition` no CSS; o rAF publica o alvo e o CSS suaviza.
- `translate` (a propriedade), não `transform`: os orbs já carregam a animação `drift` e os blocos de conteúdo recebem `transform` inline do Motion na entrada. O `-50%` da marca-d’água saiu do `-translate-y-1/2` do Tailwind e virou parte do `translate`.
- Só `translate` e `transform` são animados. Sem Canvas/WebGL, sem blur pesado.

**Preferências.** Em toque (`(hover: hover) and (pointer: fine)` verificado antes de registrar) e em movimento reduzido o listener nem é criado; o estado neutro também está declarado em CSS (`html[data-motion="reduce"]` e `prefers-reduced-motion`). Todo o conteúdo permanece legível e o link clicável sem mover o cursor.

**De passagem:** o violeta saiu da seção — `rgba(124,58,237,0.30)` no fundo e `orb-violet` no segundo orb não são da marca, viraram azul institucional e ciano.

Textos, link do LinkedIn, “Sistran em números”, modal de contato e vizinhas: inalterados.

**Verificação:** `npx tsc --noEmit` limpo, `npx eslint` sem apontamentos, chunk servido confirma as regras compiladas.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/app/globals.css`
- `src/components/Social.tsx`

---

## SIS-22 — Sistran em números: aumentar o dinamismo e aproximar da referência

**Status:** In Review · **Labels:** nenhuma · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-22/sistran-em-numeros-aumentar-o-dinamismo-e-aproximar-da-referencia

### Pedido
A seção “Escala que transforma o mercado de seguros.” estava funcionalmente correta após SIS-16, mas visualmente distante da referência: curva como fio simples, nodes pequenos, indicadores laterais quase desaparecendo, lente como anel discreto. Pedido de riqueza visual: nodes como cluster (esfera + satélites), curva ativa com glow ciano/azul e inativa cinza fina, lente com anéis concêntricos, arco de progresso e ticks, indicadores laterais legíveis, régua de ticks na base, movimento sutil de permanência (respiração/deriva). Não alterar a lógica do contador nem os números (SIS-16); `geometria.ts` só se necessário e sem medição de DOM por quadro; não reduzir mais indicadores laterais, não aumentar largura do track, não esconder cortados, sem margens negativas, sem Canvas/WebGL, um único ScrollTrigger. `prefers-reduced-motion`: sem respiração/deriva, números legíveis.

### O que foi feito
Implementado no commit `d4d8e12` (sem PR, como combinado). Arquivos: `src/app/globals.css` e `src/components/Metrics.tsx`.

- **Nodes viraram aglomerados.** `.impact-no` deixou de ser um ponto: agora é a esfera principal (o próprio elemento), um anel de órbita no `::before` e satélites no `::after` — os satélites são as `box-shadow` do pseudo (quatro pontos ao custo de um único nó de layout). A densidade cai com um novo `data-dist` (distância em etapas até o indicador da vez, saturada em 3): perto o aglomerado é completo, longe sobra só a esfera, mais apagada. O atributo vem do render, não do ScrollTrigger — só muda quando a etapa muda.
- **Curva percorrida vs. futura.** A base ficou fina e quase cinza (`rgba(196,216,238,0.16)`, 1.2px); o trecho aceso engrossou para 3px e ganhou dois halos (`drop-shadow` curto para definir a borda + longo para espalhar a luz). Continua um `filter` numa camada só, um path só.
- **Lente.** Terceiro anel contínuo para profundidade, e arco de progresso feito de dois círculos (calha apagada + vivo recortado por `stroke-dashoffset`). O recorte é `calc(578.053 * (1 - var(--impact-etapa) / 6))` — 578.053 é o perímetro de r=92 na caixa 200×200 do `viewBox`. Nenhum ScrollTrigger novo: consome a mesma variável que o trigger único da seção já escrevia.
- **Régua de base.** `repeating-linear-gradient` (um elemento, nenhum nó por traço) com a versão acesa por cima, recortada por `clip-path` em `--impact-p`. Fica no rodapé da cena, com máscara nas pontas.
- **Legibilidade lateral.** Vizinhos de `0.42` para `0.52`, ordinal menor e mais marcado, e sombra separando número e rótulo dos anéis. No número a sombra é `filter: drop-shadow` e não `text-shadow`: o valor é gradiente recortado no texto (`background-clip: text`) e a sombra ficaria atrás do recorte. Nada encolheu, a trilha não ficou mais larga e nenhum indicador cortado foi escondido.
- **Movimento de permanência.** Respiro do anel de órbita e órbita lenta dos satélites, só em `.impact-sticky[data-visivel="1"]` e só em `transform`/`opacity`.

**Restrições respeitadas.** `ImpactNumero` e a lógica do contador não foram tocados (SIS-16). `geometria.ts` não foi alterado. Sem margens negativas novas, sem deslocamento independente por etapa, sem Canvas/WebGL, um único ScrollTrigger. `.impact-regua` entrou nas duas listas de reset de movimento reduzido (`@media` e `html[data-motion="reduce"]`).

**Verificação.** `npx tsc --noEmit` (filtrando o `sistran-river-park-3d` vendorizado) e `npx eslint src/components/Metrics.tsx` limpos. CSS conferido no chunk compilado servido pelo dev server: as regras novas (`.impact-arco-vivo`, `.impact-regua-viva`, `--no-sats`, `@keyframes impact-orbita`) aparecem com os `calc()` preservados.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/app/globals.css`
- `src/components/Metrics.tsx`

---

## SIS-21 — Comentar a seção Entrega com Alta Performance e Comprometimento na home

**Status:** In Review · **Labels:** nenhuma · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-21/comentar-a-secao-entrega-com-alta-performance-e-comprometimento-na

### Pedido
Comentar (não apagar) a seção de cards “Entrega com Alta Performance e Comprometimento” na home — cabeçalho, navegação, painel e dados (`conhecimento-seguros` e os quatro temas: Conhecimento em Seguros, Flexibilidade, Tecnologia, Solidez e permanência). Comentar o consumo, não remover componente/dados do repositório; deixar comentário explicando por que saiu e como reativar, no estilo do bloco “Sobre nós / A Sistran” em `src/app/page.tsx`. Conferir efeitos colaterais: separadores/chanfros, seletores de irmãos no `globals.css`, alternância de fundo, `ScrollSpy` e âncoras. Sem seção órfã, espaço em branco duplicado nem duas faixas da mesma cor emendadas. Não alterar “Sistran em números”, modal de contato nem vizinhas além do necessário para fechar a emenda.

### O que foi feito
Movido para In Review — commit `9f36664`.

- `src/app/page.tsx`: o bloco `<div className="section-light"><SectionReveal><Differentials /></SectionReveal></div>` virou comentário JSX, com nota explicando o que saiu (título, a linha “Empresas que aderem a tecnologia…” e os quatro cards numerados) e como religar. Estilo copiado do comentário de “Sobre nós / A Sistran” já existente no arquivo.
- O `import Differentials` também foi comentado: ativo, quebraria o lint por import não utilizado; apagado, apagaria a pista de como reativar.
- `src/components/ui/ScrollSpy.tsx`: a entrada `{ id: 'diferenciais', label: 'Diferenciais' }` saiu, pela mesma razão documentada ali para `quem-somos` — sem a seção, o indicador apontava para âncora inexistente. Nada mais no projeto linka `#diferenciais` (verificado por grep).

**Efeitos colaterais verificados**
- Componente e dados preservados: `src/components/Differentials.tsx` e `src/data/differentials.ts` intactos.
- Emenda de fundos: antes era `ImpactSequence` (escuro) → faixa `.section-light` → `Metrics`. Sem o bloco, é `ImpactSequence` (escuro) → `Metrics`, que já desenha a própria faixa clara no topo. Nenhuma faixa da mesma cor emendada, nenhum espaço em branco duplicado, nenhuma seção órfã.
- `ScrollSpy` é exclusivo da home (grep), então a remoção não afeta outras páginas.
- Nenhum seletor de irmãos no `globals.css` dependia do bloco.

Seção “Sistran em números”, modal de contato e demais vizinhas: inalteradas.

**Verificação:** `npx tsc --noEmit` limpo e `npx eslint` sem apontamentos nos dois arquivos.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/app/page.tsx`
- `src/components/ui/ScrollSpy.tsx`

---

## SIS-19 — Soluções de Negócios: reconstruir como teatro de soluções guiado por scroll

**Status:** In Review · **Labels:** nenhuma · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-19/solucoes-de-negocios-reconstruir-como-teatro-de-solucoes-guiado-por

### Pedido
Substituir o grid da seção “Soluções de Negócios” por uma cena única guiada por scroll (teatro): navegação editorial à esquerda (label `DIFERENCIAIS`), janela fotográfica à direita em branco (placeholder; `object-fit: cover; object-position: center` em `.solution-image`), fluxo tecnológico sobre a janela, painel translúcido na base, conector luminoso, progresso `01 / 04` a `04 / 04`, identidade azul/branco/ciano. Não voltar ao grid de quatro cards. Dados (títulos e descrições) não alterar. Sticky: `.solutions-scroll` `min-height: 400vh`, `.solutions-sticky` `100svh`. Um único ScrollTrigger; intervalos 0.00–0.25 / 0.25–0.50 / 0.50–0.75 / 0.75–1.00. Em movimento reduzido: sem pin de 400vh, quatro soluções em fluxo natural. Desktop >1024px sticky; tablet grid ~32/68; mobile fluxo natural sem pin/conector. Acessibilidade: `aria-labelledby`, `aria-current="step"`, teclado. Não alterar “Sistran em números” nem o modal de contato.

### O que foi feito
Implementado no commit `d446211`.

**Arquivos alterados**
- `src/components/Solutions.tsx` — reescrito por completo (o baralho de cards brancos saiu).
- `src/app/globals.css` — bloco novo no fim do arquivo, ~690 linhas, com o palco, o fluxo natural e as duas saídas de movimento reduzido.
- `src/app/page.tsx` — `<Solutions />` saiu do `SectionReveal`.

**Estrutura criada.** `section.solutions-scroll[data-dirigindo]` → `.solutions-fundo` (grade, brilho, linhas) + `.solutions-sticky` → `.solutions-caixa` → `.solutions-cabecalho` + `.solutions-layout` (`.solutions-nav` | `.solution-teatro`) + `.solutions-lateral`; irmã do sticky, a `.solutions-trilha` com quatro `.solutions-passo`. Cada solução é uma `.solution-cena` com `.solution-viewport` (janela + overlay) e `.solution-info`.

**Como o scroll controla as etapas.** Um único `ScrollTrigger` na seção (`start: top top`, `end: bottom bottom`). Publica por `ref` duas custom properties em `.solutions-sticky` — `--sol-p` (progresso da seção) e `--sol-passo-p` (progresso dentro da etapa da vez) — e chama `setAtivo` só quando o índice muda de fato. O índice vem de `Math.floor(Math.min(progress, 0.999999) * 4)`. Não há `pin: true`: quem congela é `position: sticky` e a altura vem da trilha, com `margin-top: -100svh` devolvendo a tela consumida — a seção fica com exatamente 400vh. Clique na navegação rola até a fatia correspondente, sem criar estado paralelo.

**Conector.** SVG de 120×40 à esquerda do teatro, com calha estática, linha viva ciano, pulso e nó de destino. Segue o item ativo por `top: calc(50% - 20px + (var(--sol-ativo) - 1.5) * 63px)`. O pulso só corre com `[data-visivel="1"]`.

**Overlays.** Quatro variantes em `CenaOverlay`: esteira de entrega (seis nós em degraus), processo de negócio (seis etapas em arco com guias), módulos de serviço (linha mestra + quatro blocos) e rede de pessoas (constelação em volta de um nó central). Linhas de 1–1.5px, nós circulares, brilho apenas no nó ativo. Todos `aria-hidden`.

**Janelas em branco.** `.solution-image` já está com o enquadramento final (`width/height: 100%`, `object-fit: cover`, `object-position: center`) e um fundo navy neutro. As fotos entram na SIS-20.

**Responsivo.** ≥1280px: colunas 0.36 / 0.64, janela 16/8.7, painel transbordando. 1024–1279px: 0.32 / 0.68 e caixa mais estreita. <1024px ou movimento reduzido: `data-dirigindo` não é aplicado, a trilha some, as cenas viram blocos empilhados com janela 4/3 e painel abaixo dela, e a caixa cai para 20px de margem em telas ≤400px. Sem overflow horizontal.

**Movimento reduzido.** O `useReducedMotion` já desliga o palco (a árvore é a mesma nos dois casos — nenhum `return` antecipado, nenhum mismatch de hidratação). As duas saídas (`html[data-motion="reduce"]` e `@media (prefers-reduced-motion: reduce)`) forçam `animation: none`, `opacity: 1`, `clip-path: none` e `transform: none` nas camadas animadas.

**Comandos**
- `npx tsc --noEmit` (filtrando `sistran-river-park-3d`): sem erros.
- `npx eslint src/components/Solutions.tsx src/app/page.tsx`: sem avisos.
- Chunk CSS servido pelo dev server (`__0gsb2sy._.css`): 27 ocorrências de `solutions-scroll`, `--sol-passo-p` e `solution-conector-pulso` presentes; HTML servido traz as quatro cenas, os quatro passos da trilha e os quatro itens de navegação.

Sem PR, como combinado.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/Solutions.tsx`
- `src/app/globals.css`
- `src/app/page.tsx`

---

## SIS-18 — Contato: tratar o fundo por trás do reveal do modal "Fale com a gente"

**Status:** In Review · **Labels:** nenhuma · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-18/contato-tratar-o-fundo-por-tras-do-reveal-do-modal-fale-com-a-gente

### Pedido
Deixar mais bonito o fundo contra o qual o painel de contato surge no scroll (reveal do SIS-5). Enquanto o cartão da foto entra, a área em volta era cinza-azulado liso com o chip `CONTATO` solto à esquerda e metade esquerda vazia. Escopo só do plano de fundo: painel, cartão e modal continuam como estão. Usar grafismo técnico / régua da marca / degradê da paleta já usados na home — sem hex novo e sem asset novo. Ocupar a metade esquerda sem disputar com o cartão. Não alterar o modal nem o comportamento do reveal. Movimento aqui é decoração e deve parar em estado visível. Aceite: profundidade em toda a extensão do reveal, contraste do chip `CONTATO` preservado, sem custo de rolagem perceptível (nada de `blur` grande animado nem repaint por frame).

### O que foi feito
Feito no commit `a4ca260` — só `src/app/globals.css`.

**Abordagem.** Nada de elemento novo, nada de asset e nenhuma linha de `Contact.tsx`: tudo em três regras no bloco `.ct-*`, penduradas no próprio `.ct-inner` — a caixa de `100svh` que fica presa na tela durante todo o percurso. Como o componente não foi tocado, o gatilho, a ordem e o tempo do reveal são os mesmos. O grafismo é estático de propósito: não lê `--ct-surgir`, não entra, não escala.

**O que entrou**
- **Atmosfera (no próprio `.ct-inner`)** — duas luzes largas da paleta: fria, `rgba(14, 216, 246, 0.18)` em `10% 40%` (enche a metade esquerda vazia); azul da marca, `rgba(0, 121, 203, 0.16)` em `66% 60%` (chão sob o ponto onde o cartão pousa). Ficou na regra do elemento e não num pseudo porque os pseudos levam máscara, e `mask-image` vale para o background inteiro.
- **Malha técnica (`::before`)** — grade de 6rem em `rgba(0, 121, 203, 0.1)`, a mesma linguagem de `.grade-tecnica` e do próprio `.section-light`, com máscara elíptica ancorada em `22%` da largura: nasce à esquerda e morre antes do cartão.
- **Régua da marca (`::after`)** — trilho de 1px com marcas curtas a cada `1.5rem` e longas a cada `6rem`, as três camadas saindo do mesmo `x`.

**O chip `CONTATO`.** O chip é o `ScrollSpy` — `fixed left-3 top-1/2`, só a partir de 1440px. A máscara da régua abre um vão entre 40% e 60% da altura: a régua vira dois segmentos que emolduram o chip. O painel continua em `z-index: 1`.

**Ordem de pintura.** Os pseudos são `z-index: 0`, e não `-1`, porque o véu do reveal também é `0`. Com valores iguais a ordem é a do DOM: `::before` fica sob o véu; `::after` fica sobre o véu.

**Custo de rolagem.** Zero. Nenhuma das três regras muda por frame, nenhum `filter: blur()`, nenhum RAF. O `ScrollTrigger` continua escrevendo só `--ct-surgir` e `--ct-p`.

**Movimento reduzido.** Nada aqui se move. Os três seletores exigem `[data-modo="scroll"]`, que o componente só liga com `min-width: 1024px` e sem preferência por menos movimento.

**Validação.** `npx tsc --noEmit | grep -v sistran-river-park-3d` → limpo. CSS servido pelo dev server contém as três regras compiladas (`.ct-inner`, `.ct-inner:before`, `.ct-inner:after`). `curl http://localhost:3000/` → 200. Sem hex novo (só `#0079cb` e `#0ed8f6`) e sem asset novo. Não foram tocados: `Contact.tsx`, `ContactPanel`, o modal, o véu, o painel e o cartão. Falta a conferência visual da composição com rolagem lenta e rápida em 1440px e 1920px — o executor registrou que não conseguiu fazer captura de tela.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/app/globals.css`

---

## SIS-17 — Contato: endereço da sede ilegível dentro do cartão "SEDE · SÃO PAULO"

**Status:** In Review · **Labels:** nenhuma · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-17/contato-endereco-da-sede-ilegivel-dentro-do-cartao-sede-sao-paulo

### Pedido
No cartão “SEDE · SÃO PAULO” da seção de contato, a linha do endereço (R. Dr. Geraldo Campos Moreira, 240 - 2º andar | Cidade Monções | São Paulo - SP | CEP 04571-020) estava praticamente invisível. O rótulo ciano lia; o endereço, navy sobre foto escura/movimentada, não. Mesma classe de defeito do SIS-9, em outro elemento. Escopo: dar contraste ao endereço sobre o cartão translúcido em cima da fotografia; mínimo 4.5:1, sem depender da região da foto; nenhum hex novo fora da paleta. Não alterar o modal de contato nem as demais seções. Aceite: endereço legível em toda a extensão do reveal (trechos claros e escuros da foto) e nas larguras em que o cartão encolhe.

### O que foi feito
Corrigido no commit `0e39884` (`src/app/globals.css`).

**Causa.** Não era navy sobre navy como no SIS-9 — eram três atenuações somadas no mesmo texto: (1) `.contact-dialog-endereco-texto { color: rgba(247, 251, 255, 0.86) }` — branco a 86%; (2) `font-size: 0.7rem` (0.66rem abaixo de 60rem); (3) `.contact-dialog-endereco { background: rgba(3, 24, 47, 0.62) }` — cartão navy a 62% sobre a fachada iluminada. O terceiro item é o principal: o cartão tem `backdrop-filter: blur(10px)`, que desfoca a foto mas não escurece o que passa por baixo. Havia ainda `.section-light .contact-inline .contact-dialog-endereco-texto` repetindo o branco a 86%, então corrigir só a regra base não teria efeito na seção inline da home.

**Correção**
- cartão: `rgba(3, 24, 47, 0.62)` → **`0.92`**. Mesmo navy de `--contact-bg` (`#03182f`), só mais denso.
- texto: `var(--contact-text)` cheio em vez de branco a 86%; `0.78rem` / `line-height: 1.55` (e `0.72rem` em tela estreita, era `0.66rem`).
- removido o override de `.section-light`: a exceção genérica logo acima (`span:not([class*="eyebrow"])`) já devolve `--contact-text`.

**Contraste.** Pior caso: foto branca pura por baixo. Composição = `0.92 × (3, 24, 47) + 0.08 × 255` = `(23, 42, 63)`. Contra `#f7fbff` isso dá **≈ 13:1** — acima de 4.5:1. O rótulo ciano `#14c8f5` sobre o mesmo fundo fica em ≈ 7:1.

**Validação.** `npx tsc --noEmit | grep -v sistran-river-park-3d` → limpo. `curl http://localhost:3000/` → 200. Nenhum hex novo. Não foram tocados: modal de contato, `ContactPanel`, demais seções.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/app/globals.css`

---

## SIS-16 — Sistran em números: corrigir composição (gap único, lente central mascarada, isolamento da seção anterior)

**Status:** In Review · **Labels:** nenhuma · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-16/sistran-em-numeros-corrigir-composicao-gap-unico-lente-central

### Pedido
Continuação do SIS-12: layout, posicionamento, curva, isolamento e proporções — a lógica do contador não deve ser alterada. Problemas: indicadores laterais cortados, espaçamento excessivo, curva atravessando número e lente, lente pequena/alta, vazamento de `DIFERENCIAIS` e barra azul da seção anterior, linha vertical ciano à direita, referências de posicionamento divergentes. Correções pedidas: `calculateStepGap` com `Math.min(360, Math.max(280, viewportWidth * 0.22))` (~338px em 1536px); path e nodes na mesma referência (`pathCenterY = stageHeight * 0.55`); lente fixa fora do track (`left: 50%; top: 55%`, `clamp(380px, 30vw, 460px)`); máscara circular para a curva não atravessar o número; grid vertical `clamp(170px, 24svh, 220px) minmax(0, 1fr)`; `railOffsets`; isolamento da seção anterior; remover linha ciano. Validar etapas 02/03 em ~1536×768 e 1920×1080; lint e tipos.

### O que foi feito
Implementado no commit `4d11816`. Contador **não** foi tocado.

**Causa do espaçamento excessivo.** Três referências de posicionamento na mesma cena: o path numa caixa de `700 × 200` unidades esticada com `preserveAspectRatio="none"` + `non-scaling-stroke`; os indicadores em `%` da trilha (`posicaoDoIndicador` → `(i + 0.5) / 7`); a lente em `%` do próprio `<li>`. O espaçamento era `--impact-w / 7`, com `--impact-w: clamp(3500px, 380vw, 5600px)` — **500 a 800px** entre indicadores.

**Valor final do vão.** `vaoEntreEtapas(largura) = Math.min(360, Math.max(280, largura * 0.22))` → **337,92px em 1536px**. Uma unidade só (pixel do palco) alimentando posição do conteúdo, nodes, largura do SVG, deslocamento das duas trilhas e o `d` do path.

**Como a trilha foi centralizada.** Item `i` mora em `left: calc(var(--impact-centro) + i * var(--impact-vao))`, com `--impact-centro = larguraTela / 2`. As duas trilhas andam com o mesmo `translate3d(calc(-1 * var(--impact-etapa) * var(--impact-vao)), 0, 0)`. Em etapa inteira o ativo cai no centro ao pixel. `--impact-etapa` é contínua (scrub). O recuo de meia largura é `transform`, não margem negativa.

**Como a curva foi mascarada.** Desvio deliberado da spec: em vez do disco opaco `#03142d`, o `.impact-caminho` leva um `mask-image: radial-gradient(circle at var(--impact-centro) 55%, transparent R, #000 calc(R + 1px))`, com `R = clamp(380px, 30vw, 460px) / 2 + 21px`. Razão: o palco tem degradê radial próprio, e um disco de cor fixa apareceria como mancha. O node de chegada (12×12, halo ciano) ficou na borda esquerda da lente.

**Como a lente foi reposicionada.** Saiu do `<li>` ativo e virou elemento estacionário irmão, em `left: var(--impact-centro); top: 55%`, `clamp(380px, 30vw, 460px)`, `z-index: 6`. Segundo desvio deliberado: número, rótulo e legenda continuam no `<li>` — duplicá-los dentro da lente faria o leitor de tela ler cada indicador duas vezes e obrigaria a reescrever o contador. Curva e nodes compartilham a linha-base `alturaDoPalco * 0.55`; cada trecho da onda tem os dois pontos de controle do mesmo lado (`vão * 0.34`, amplitude 70). O pulso é resolvido analiticamente (`pontoNaOnda`).

**Proporção vertical.** `grid-template-rows: clamp(170px, 24svh, 220px) minmax(0, 1fr)`. Número `clamp(5.5rem, 7.5vw, 8rem)` / `line-height: .84` / `letter-spacing: -.045em`, sufixo `.45em`, rótulo `290px`, legenda `320px`. Vizinhos alternam por `DESVIOS_TRILHO = [-135, 125, -140, 135, 125, -135, 130]`.

**Vazamento da seção anterior e linha ciano à direita — mesma causa.** Não há pin envolvido: `SectionReveal` usa só `toggleActions` e `Metrics` usa seção alta + interior `sticky`. O que aparecia era a seção `Differentials` por baixo. A “linha vertical ciano à direita” é `.corner-accent::after` (`globals.css:1279`), um traço de `1.5px × 32px` com `linear-gradient(135deg, #0ed8f6, transparent)`. Correção: `.impact-scroll { z-index: 30; isolation: isolate; background: #041a33 }`, `.impact-sticky { z-index: 1; overflow: clip; background: #041a33 }`. Usei `#041a33` em vez do `#f4f8fc`/`#03142d` da issue para não introduzir hex novo. Removido o `overflow: visible` do `.impact-curva`. Header e `ScrollSpy` continuam (chrome do site, não vazamento).

**Validação.** `npx tsc --noEmit | grep -v sistran-river-park-3d` → limpo. `npx eslint src/components/Metrics.tsx src/components/ui/impact/geometria.ts` → limpo. `curl http://localhost:3000/` → 200, com `impact-cena`/`impact-caminho`/`impact-lente`/`impact-chegada` no HTML (uma ocorrência cada).

**Estados 02 e 03** validados aritmeticamente em 1536px (vão 337,92 · centro 768): etapa 02 — `850+` em 430 · `23+` em 768 · `130+` em 1106 · `650+` em 1444; etapa 03 — `850+` em 92 · `23+` em 430 · `130+` em 768 · `650+` em 1106 · `230+` em 1444. Falta conferência visual em 1536×768 e 1920×1080. Não foram tocados: contador (`ImpactNumero`), modal de contato, `Differentials`, `Solutions`, `SectionReveal`.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/Metrics.tsx`
- `src/components/ui/impact/geometria.ts`
- `src/app/globals.css`

---

## SIS-15 — Home: faixa de sinais deve passar as logos de parceiros de /parceiros-e-implementacoes

**Status:** In Review · **Labels:** nenhuma · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-15/home-faixa-de-sinais-deve-passar-as-logos-de-parceiros-de-parceiros-e

### Pedido
A faixa depois dos Resultados (`src/components/legacy/SignalMarquee.tsx`, criada no SIS-13) mostrava os seis sinais do método em texto. No lugar devem passar as logos de parceiros de `/parceiros-e-implementacoes` (`CLIENTS` em `src/data/clients.ts`, via `ClientWall` — 15 parceiros em `/public/images`). Manter pausa em hover/foco, cópia duplicada com `aria-hidden`, medição de repetições para telas largas e, em movimento reduzido, lista rolável nativa. Nomear parceiros para leitor de tela. Não alterar `/parceiros-e-implementacoes`. Decidir o destino de `marquee` em `src/data/legacy.ts`. Aceite: mesmas logos da página de parceiros, altura uniforme; loop sem salto; com movimento reduzido todas as logos alcançáveis.

### O que foi feito
Implementado — commit `feat(home): faixa em loop passa as logos de parceiros`.

- `src/components/legacy/SignalMarquee.tsx` — passa a consumir `CLIENTS` de `src/data/clients.ts`, a mesma fonte de `/parceiros-e-implementacoes`, filtrando quem tem arquivo de logo (`CLIENTS.filter(c => c.logo)`). Hoje isso dá os 15 parceiros.
- Acessibilidade: o nome da marca vai no `alt`; a faixa ganhou `role="region"` + `aria-label="Parceiros e tecnologias"`. A cópia duplicada segue `aria-hidden`.
- `legacy.css` — `.lp-signal` / `.lp-signal::after` / `.lp-signal-logo` dão lugar a `.lp-partner`. Sem placa branca: a faixa é `--paper` e todas as marcas de `clients.ts` são desenhadas para fundo claro (incluindo `st-it-sombra-branca.png`, navy sobre branco).
- Repouso dessaturado (`grayscale(1)`, `opacity .62`), cor cheia no hover — só em `(hover: hover) and (pointer: fine)`.
- Vão entre itens de `0.75rem` → `clamp(2.4rem, 4.5vw, 4rem)`. O `padding-right` acompanha o `gap`, que é o que mantém o `translate3d(-50%)` valendo uma cópia exata.
- `src/data/legacy.ts` — `marquee` e `type Signal` removidos (ninguém mais consumia), com comentário no lugar apontando a nova fonte. Os arquivos `-trim` seguem em `public/imagens/`.

**Movimento reduzido.** A mecânica de `globals.css` está intacta: a viewport vira lista rolável nativa, a trilha congela e a cópia `aria-hidden` sai de cena. Bloco `@media (prefers-reduced-motion: reduce)` devolve as logos em cor cheia.

**O que NÃO foi tocado.** `/parceiros-e-implementacoes`, `ClientWall`, `PartnersGrid` e as keyframes/`.marquee-*` do `globals.css`.

**Verificação.** `npx tsc --noEmit` limpo (fora do diretório 3D vendorizado) e `npx eslint` limpo nos três arquivos.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/legacy/SignalMarquee.tsx`
- `legacy.css`
- `src/data/legacy.ts`

---

## SIS-14 — Home: remover a seção "Sobre nós / A Sistran" — o texto institucional fica só em /quem-somos

**Status:** In Review · **Labels:** nenhuma · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-14/home-remover-a-secao-sobre-nos-a-sistran-o-texto-institucional-fica-so

### Pedido
O bloco “Sobre nós | A Sistran” deve existir apenas em `/quem-somos`; sai da home. O mesmo texto estava em `src/app/quem-somos/page.tsx:28` (já com `130 clientes`) e em `src/components/About.tsx:177-208` (com `mais de 150 clientes`, número errado frente à fonte e a `src/data/metrics.ts` `130+`). A régua `1988` / `150+` / `18` no `About` da home repetia “Sistran em números”. Escopo: remover `<About />` em `src/app/page.tsx`; repontar `ScrollSpy` (`quem-somos` → `#quem-somos`); não mexer em `/quem-somos`. Aceite: home sem a seção; `/quem-somos` igual; nenhum link/indicador para âncora inexistente; o `150+` sai do projeto junto com o bloco.

### O que foi feito
Implementado — commit `refactor(home): manter "Sobre nos" apenas em /quem-somos`.

- `src/app/page.tsx` — removido o `<About />` (e o `import`) do bloco `.section-light` entre a faixa de sinais e o `ImpactSequence`. O `SectionReveal` e o `<div className="section-light">` que só embalavam essa seção saíram com ela. Comentário no lugar registrando o motivo.
- `src/components/ui/ScrollSpy.tsx` — removida a entrada `{ id: 'quem-somos', label: 'Quem somos' }`. A página continua alcançável pelo menu do header (`src/data/nav.ts`, `/quem-somos`).

**O que NÃO foi tocado.** `src/components/About.tsx` segue intacto — é o mesmo componente que `/quem-somos` monta (`src/app/quem-somos/page.tsx:4`). O `150+` sai da home junto com o bloco. Ele ainda existe dentro do `About.tsx` (portanto em `/quem-somos`) e em `src/data/aSistran.ts` / `src/data/differentials.ts` — correção de número é outra issue, não estava no escopo desta.

**Verificação.** `npx tsc --noEmit` (sem erros fora do diretório 3D vendorizado) e `npx eslint src/app/page.tsx src/components/ui/ScrollSpy.tsx` — ambos limpos. Nenhuma referência pendente a `#quem-somos` na home.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/app/page.tsx`
- `src/components/ui/ScrollSpy.tsx`

---

## SIS-13 — Home: mover indicadores de Resultados do hero para depois do Método e adicionar faixa de sinais

**Status:** In Review · **Labels:** nenhuma · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-13/home-mover-indicadores-de-resultados-do-hero-para-depois-do-metodo-e

### Pedido
Substitui a colocação do SIS-10: os indicadores de “Resultados” fechavam o percurso do hero, presos na faixa que o card de vídeo desocupava, e o bloco claro disputava atenção com o vídeo. Pedido: levar os indicadores para depois da seção “Método | quatro movimentos”, com o desenho da apresentação de transformação de legado, e adicionar a faixa de logos passando logo abaixo. A description no Linear já documenta a implementação prevista (`MetricsStrip`, `SignalMarquee`, remoção de `HeroResults`), mas isso não substitui um comentário de entrega.

### O que foi feito
Sem relatório de entrega no Linear. O histórico de estados registra a issue criada já em In Review em 25/08/2026 (19:31 UTC), sem passagem por Backlog nem In Progress no `stateHistory`; `completedAt` permanece vazio.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
Não declarados no relatório.

---

## SIS-12 — Sistran em números: scrollytelling horizontal com curva, data lens e componentes contextuais

**Status:** In Review · **Labels:** nenhuma · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-12/sistran-em-numeros-scrollytelling-horizontal-com-curva-data-lens-e

### Pedido
Refazer a seção de indicadores como scrollytelling horizontal dirigido por rolagem, no código real (não protótipo). Independente do modal de contato (SIS-5/6/7/8/9). Padrão da casa: seção alta + interior `sticky`, nunca `pin: true`; variáveis CSS por ref; default CSS = estado final; espelhar `prefers-reduced-motion` e `html[data-motion="reduce"]`. Corrigir clientes 150 → **130+**; captions são escrita nova (Copy Lock). Sete indicadores com visual contextual SVG. Sem Canvas/WebGL. Validar eslint, tsc (filtrando river-park), `test:copy` (relatar, já vermelho), 7 etapas, reduced-motion, overflow.

### O que foi feito
Implementado no commit `42ee388` (“SIS-12: reconstruir 'Sistran em numeros' como percurso horizontal”).

**Arquivos.** `src/components/Metrics.tsx` reescrito (seção alta + `.impact-sticky`, um ScrollTrigger, contador próprio); `src/components/ui/impact/geometria.ts` novo (curva e posições, matemática pura); `src/components/ui/impact/ImpactVisuais.tsx` novo (7 contextuais em SVG estático); `src/data/metrics.ts` (130 em Clientes, `caption` e `visual` nos 7 itens); `src/data/types.ts` (`Metric` estendido + união `ImpactVisual`); `src/app/globals.css` (família `.impact-*` / `.iv-*` + os dois espelhos de movimento reduzido); `src/app/page.tsx` (seção fora de `SectionReveal` e de `.section-light`); `src/app/quem-somos/page.tsx` (description de SEO: 150 → 130 clientes).

**Progresso.** Um `ScrollTrigger` (`start: 'top top'`, `end: 'bottom bottom'`, `scrub: 1`), seção `min-height: 520vh`, interior `sticky` — nunca `pin: true`. Dele sai uma grandeza, `etapa` (índice contínuo 0…6). Variáveis (`--impact-p`, `--impact-entrada`, `--impact-pos`, `--impact-aceso`, `--impact-pulso-x/y/op`) escritas no nó do palco; o único estado React é o índice ativo. Cleanup: `kill()`, `removeProperty` de cada variável, listener de resize removido.

**Onde me afastei do spec, e por quê**
1. `clip-path: inset()` em vez de `stroke-dasharray` — com `preserveAspectRatio="none"` e `non-scaling-stroke` o comprimento do dash não corresponde ao desenhado.
2. Tabela de 240 amostras em vez de `getPointAtLength()` — zero medição de DOM, resultado idêntico no servidor e no cliente.
3. O `<li>` ativo *é* a lente — não há cópia do número.
4. Contador próprio, não `CountUp` — o `CountUp` dispara por `useInView` e os 7 números estão todos na viewport ao mesmo tempo. O MotionValue nasce no valor final (SSR / sem JS).
5. Trilha em `clamp(3500px, 380vw, 5600px)`, não `clamp(2200px, 230vw, 3400px)`: na largura do spec os vizinhos encostavam na lente.

**Contextuais.** Sete em SVG estático, caixa 200×200: `people-network`, `award-facets`, `client-network` (14 esferas), `capacity-pulse` (24 barras radiais), `erp-layers`, `insurer-network` (anel de 10), `claims-flow`. Movimento só no item ativo e com `[data-visivel="1"]`. Cascata via `--iv-i` no markup. Nada de `setInterval`/RAF.

**Três tamanhos e movimento reduzido.** O CSS nasce no estado final. O scrollytelling pende de `.impact-scroll[data-dirigindo]` dentro de `@media (min-width: 1024px)`, e `data-dirigindo` só aparece quando `matchMedia('(min-width: 1024px)') && !prefersReducedMotion()`. Resets em `@media (prefers-reduced-motion: reduce)` e `html[data-motion="reduce"]`.

**Dados.** `clientes` 150 → **130**. As 7 `caption` são escrita nova, marcadas com comentário `⚠️` em `src/data/metrics.ts`.

**Validação.** `npx tsc --noEmit` (filtrando `src/app/sistran-river-park-3d/`): limpo. `npx eslint` nos 7 arquivos tocados: limpo. `globals.css` processado com PostCSS + Tailwind: sem erro.

**Limitações reais:** (1) não há build de produção verde — `src/app/sistran-river-park-3d/` quebra `npm run build` desde antes; (2) `npm run test:copy` está vermelho por dívida anterior e não foi regenerado; (3) não houve verificação em navegador. PR não aberto, por instrução.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/Metrics.tsx`
- `src/components/ui/impact/geometria.ts`
- `src/components/ui/impact/ImpactVisuais.tsx`
- `src/data/metrics.ts`
- `src/data/types.ts`
- `src/app/globals.css`
- `src/app/page.tsx`
- `src/app/quem-somos/page.tsx`

---

## SIS-11 — Abertura da home: saída em cortina dividida, como no projeto de apresentação

**Status:** In Review · **Labels:** nenhuma · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-11/abertura-da-home-saida-em-cortina-dividida-como-no-projeto-de

### Pedido
A abertura da apresentação sai como cortina dividida (dois painéis, emenda luminosa). A home já tem `OptionalMorphIntro.tsx`; duas aberturas não podem coexistir. Fica a atual e troca-se só a saída: substituir a dissolução final de 420ms pela cortina. Morph para a marca do header continua, antes da cortina. Duração alinhada à apresentação (`--intro-exit: 820ms`, `cubic-bezier(0.76, 0, 0.24, 1)`). Cortina esperada (`transitionend` + timeout). Só `transform` nos painéis. Reduced-motion: dissolução ≤500ms, sem cortina. Sem JS: overlay nunca pintado. Uma vez por sessão (`sistran:intro-visto`). Overlay sempre sai, inclusive se a aba perder o foco. Nenhuma escrita nova.

### O que foi feito
Implementado no commit `8b30cbb` (“SIS-11: trocar a saida da abertura por cortina dividida”).

**Arquivos:** `src/app/globals.css` (bloco `.mmi-*`) e `src/components/intro/OptionalMorphIntro.tsx`. Só a saída mudou — progresso honesto, `minimoMs`/`maximoMs`, uma vez por sessão (`sistran:intro-visto`) e o morph para a marca do header seguem como estavam; o morph continua acontecendo **antes** da cortina.

**Duração em um só lugar:** o número vive no CSS (`--mmi-saida: 820ms`, `--mmi-saida-ease: cubic-bezier(0.76, 0, 0.24, 1)`) e o JS o lê com `getComputedStyle` (`lerDuracaoSaida`, com fallback 820ms). O override de movimento reduzido (400ms) encurta automaticamente a rede de segurança do JS.

**A cortina é esperada, não cronometrada:** `transitionend` no `.mmi-painel--topo`, filtrado por `target` e `propertyName`, com timeout de `saidaMs + 160` como rede. `finalizar()` é idempotente (flag `concluido`); o listener entra num array `limpezas`.

**Detalhe visual:** o gradiente full-bleed foi dividido em dois painéis de meia altura (`calc(50% + 1px)`), cada um renderizando uma cópia de `100svh` alinhada pela própria borda; o fade de `.mmi-cena` no estado `morphing` saiu. Os painéis saem só por `transform` (∓101%), com a emenda `.mmi-costura` na linha do corte.

**Preservado:** com movimento reduzido não há cortina (dissolução, `transform: none`, emenda em `display: none`), espelhado nos dois escopos; sem JS o overlay nunca é pintado.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/app/globals.css`
- `src/components/intro/OptionalMorphIntro.tsx`

---

## SIS-10 — Home · hero: indicadores de Resultados surgem no fim do percurso do hero

**Status:** In Review · **Labels:** nenhuma · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-10/home-hero-indicadores-de-resultados-surgem-no-fim-do-percurso-do-hero

### Pedido
Portar o bloco “Resultados | evidências dos casos” da apresentação para a home, ligado ao percurso de rolagem do hero: enquanto o vídeo encolhe em card, os quatro indicadores surgem ainda dentro da seção (não como seção separada). Valores certos 10 / 1 / 2 / 6 (não 100 / 10 / 20 / 60). Só `transform` e `opacity`; hero usa `framer-motion` (`useScroll`/`useTransform`), não GSAP. CSS default = estado final; espelhar reduced-motion nos dois escopos. `h2` para o título (home já tem `h1` sr-only). Copy Lock: escrita nova visível; lock já desatualizado. Aceite: quatro indicadores no fim do percurso com o card reduzido; escrita idêntica à fonte; bloco visível sem JS / tela estreita / movimento reduzido.

### O que foi feito
Implementado no commit `05e22c2` (“SIS-10: fechar o percurso do hero com os indicadores de Resultados”).

**Arquivos:** `src/data/heroResults.ts` (novo, escrita portada de `site.ts` — valores 10 / 1 / 2 / 6, com as quatro notas), `src/components/ui/HeroResults.tsx` (novo), `src/components/HeroCinematic.tsx`, `src/app/globals.css`.

**Como ficou:** o bloco recebe o mesmo `scrollYProgress` do hero (nada de GSAP na seção) e entra em 0.86–0.95, na faixa que o card do vídeo desocupa no alto da tela ao encolher. A partitura foi recalibrada: `cueFade` 0.55→0.78, `scale` 0.62→0.96 (1 → 0.54), `drop` 0.84→1. Só `transform` e `opacity`. O `.hero-results` usa o mesmo truque de `margin-bottom: -100svh` do `.hero-sheet`.

**Acessibilidade:** o CSS nasce no estado final — sem JS, em tela estreita ou com movimento reduzido os quatro indicadores e as quatro notas estão visíveis, espelhado em `@media (prefers-reduced-motion: reduce)` e em `html[data-motion="reduce"]`. Títulos: `h2` para “Resultados que conectam…”, nenhum `h1` novo.

**Limitação:** `npm run test:copy` está vermelho, mas já estava antes desta task — o lock não foi regenerado. A escrita nova desta seção é fiel à fonte.

Comentário posterior no Linear (25/08/2026): **superado pelo SIS-13**. A colocação entregue aqui foi desfeita a pedido. Saíram do repositório `src/components/ui/HeroResults.tsx`, `src/data/heroResults.ts` e as ~150 linhas de `.hero-results*` / `.hero-metric*` do `globals.css`. O conteúdo dos quatro indicadores foi preservado em `src/data/legacy.ts`. Detalhes e commit no SIS-13.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/data/heroResults.ts`
- `src/components/ui/HeroResults.tsx`
- `src/components/HeroCinematic.tsx`
- `src/app/globals.css`

---

## SIS-9 — Home · contato: textos do painel ficam invisíveis (navy sobre navy) dentro de .section-light

**Status:** In Review · **Labels:** nenhuma · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-9/home-contato-textos-do-painel-ficam-invisiveis-navy-sobre-navy-dentro

### Pedido
Na seção de contato da home (SIS-5), boa parte da escrita ficava escura sobre o fundo navy do painel. Invisíveis: título “Entre em contato conosco”, parágrafo, rótulo/nota do cartão de telefone, “SEDE · SÃO PAULO” e endereço, sobretítulo “SAIBA MAIS…”. Causa: `<Contact />` dentro de `.section-light` em `page.tsx`; `.section-light h3`/`p`/`span`/`label` pintam `#0a1f44` e vencem `.contact-dialog-titulo` (especificidade 0,1,1 vs 0,1,0). Correção sugerida: exceção em `globals.css` para `.section-light .contact-inline`. Não usar `.on-dark` no painel nem tirar `.section-light`. Aceite: textos legíveis como no modal do header; ciano preservado; correção escopada em `.contact-inline` (modal do header não muda); sucesso/erros de campo; contraste AA 4.5:1.

### O que foi feito
Implementado no commit `31f752c`, na branch `feat/escritorios-dinamicos-e-contato`.

Exceção escopada em `src/app/globals.css` para `.section-light .contact-inline`, devolvendo os tokens do painel (`--contact-text`, `--contact-muted`) ao título, à descrição, aos parágrafos, aos `span`, aos `label` e ao cartão de endereço. O `.section-light` continua em volta e o modal do header não foi tocado — nenhuma regra usa `.contact-dialog`.

**Detalhe que quase virou bug:** a regra de `span` precisou de exceções explícitas para `.contact-dialog-enviar-seta` e `.contact-dialog-fone-icone`. Sem elas, os dois ícones ficariam brancos sobre fundo branco.

Também cobertos o estado de sucesso e as mensagens de erro de campo. PR não aberto nesta rodada, por instrução.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/app/globals.css`

---

## SIS-8 — Quem somos / Escritórios BRASIL: ao chegar em SP, surgir prédio 3D com escritório marcado no 2º andar e fotos

**Status:** In Review · **Labels:** nenhuma · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-8/quem-somos-escritorios-brasil-ao-chegar-em-sp-surgir-predio-3d-com

### Pedido
Em `/quem-somos`, seção “Escritórios BRASIL” (`OfficesScene.tsx`): quando o scroll chega em São Paulo, surgir o modelo 3D do prédio, marcar o escritório no segundo andar e, a partir dessa marcação, mostrar as fotos. Continuação da sequência de scroll do mapa — seção alta + `sticky`, não `pin: true`. 3D em Three.js scroll-linked. Não precisa de GLB: `BuildingExplorer.tsx` já constrói a torre proceduralmente com `ExplorerApi.setProgress`. Fotos já existem (`sp-1-1`, `sp-6`, `sp-4`). Performance: cap de `devicePixelRatio`, fallback leve em mobile. `prefers-reduced-motion`: fotos e informação alcançáveis sem a animação 3D.

### O que foi feito
**Feito** — commit `fa0c5da` no branch `feat/escritorios-dinamicos-e-contato`. Também há comentário apontando o PR #1 cobrindo SIS-5, SIS-6, SIS-7 e SIS-8.

O trecho de São Paulo (última fatia da trilha, a partir de ~61% do progresso) deixou de ser só mapa:
1. A torre surge de baixo e de longe (`translate3d` + `scale`, via `--os-predio`) no primeiro terço do trecho, à esquerda — o painel de SP com as fotos fica à direita.
2. O mapa recua para 38% de opacidade enquanto a torre está em cena.
3. O prédio se monta com a rolagem (montagem nos primeiros 55%, órbita depois).
4. O 2º andar acende marcado a partir de 56% do trecho — faixa sobre a laje, contorno, haste em cotovelo e rótulo “2º andar · escritório São Paulo”.
5. As fotos são as que a cena já tinha (`sp-1-1`, `sp-6`, `sp-4`).

**`BuildingExplorer.tsx`.** Novo marcador de andar. Altura das mesmas constantes das esquadrias (`PISO_BASE = 1.45`, `PISO_ALTURA = 0.335`). Entra na fachada frontal e na traseira (`clone()` girado 180°, materiais compartilhados). Rótulo é um `Sprite` com textura de canvas, teste de profundidade ligado. `ExplorerApi` ganhou `setDestaque(0..1)`, separado de `setProgress`. Props novos: `andarDestacado`, `rotuloDestaque`, `mostrarControles`. Limpeza: `Sprite` sai do dispose de geometria compartilhada; `LineSegments` virou `Line` na condição, para a haste entrar.

**`OfficesScene.tsx`.** Explorador entra por `dynamic(..., { ssr: false })` e só é montado quando a rolagem chega perto de SP (6% antes do trecho). Uma vez montado, fica. Progresso por chamada imperativa (`predioApiRef.current?.setProgress`), nunca por estado. `SP_INICIO` calculado da mesma divisão que escolhe a cidade ativa.

**Decisões.** Sem controles próprios no prédio da cena (`mostrarControles={false}`, `controls.enabled = false`, `pointer-events: none`). O explorador 360° continua existindo logo abaixo. Texto novo na tela: “2º andar · escritório São Paulo” — vale Copy Lock quando for regenerado.

**Verificação.** `npx tsc --noEmit` limpo (fora erros pré-existentes de `sistran-river-park-3d`). `npx eslint` limpo nos três arquivos tocados. CSS parseado com PostCSS + Tailwind: OK. `npm run build` continua falhando por `src/app/sistran-river-park-3d/`; Copy Lock também já estava desatualizado (ver SIS-5).

**Acessibilidade.** Sem JS, abaixo de 1024px ou com menos movimento a cena não é montada e o mapa chega inteiro, com as duas cidades acesas e todas as fotos visíveis. Os dois espelhos devolvem a torre ao fluxo, o mapa à opacidade cheia e o andar já marcado.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/ui/BuildingExplorer.tsx`
- `src/components/ui/OfficesScene.tsx`

---

## SIS-7 — Quem somos / Escritórios BRASIL: mapa deve aparecer de forma mais dinâmica no scroll

**Status:** In Review · **Labels:** nenhuma · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-7/quem-somos-escritorios-brasil-mapa-deve-aparecer-de-forma-mais

### Pedido
Em `/quem-somos`, seção “Escritórios BRASIL” (`BrazilOfficesMap.tsx`, `OfficesScene.tsx`), deixar a entrada do mapa mais dinâmica, guiada pelo scroll. Direção: reveal orquestrado (desenho do contorno / traçado da rota entre cidades, pins em stagger); o avanço do scroll conduz até São Paulo (gancho para o 3D). `prefers-reduced-motion`: mapa e nomes visíveis sem animação. Manter abas/`role="tablist"` funcionais (`OfficesScene.tsx:268`).

### O que foi feito
**Feito** — commit `f587735` (branch `feat/escritorios-dinamicos-e-contato`).

A coreografia foi construída em cima das variáveis que a cena já escrevia (`--os-contorno`, `--os-entrada`, `--os-rota`, `--os-p`), sem novo JavaScript por quadro.

1. **Ponta acesa no contorno** — novo `path.bm-pais-cabeca` (`BrazilOfficesMap.tsx`) com `pathLength="1"` e tracejado de 1,2%, levado pela mesma fração do desenho. Opacidade é a parábola `4p(1-p)`.
2. **Movimento de câmera** — `--os-foco-escala/-x/-y` registrados com `@property`. Quem transiciona é o palco (1,1s), não a `transform`. Pato Branco aproxima 1,14×; São Paulo, 1,22×.
3. **Marcadores pousam com estalo** — anel e núcleo entram de 45% ao tamanho cheio com sobra de mola (`cubic-bezier(0.34, 1.4, 0.64, 1)`). Escala nos círculos (não no `g`) com `transform-box: fill-box`. O halo pulsa animando o próprio `r`.
4. **Linha de chamada se desenha** — os dois `path` de `.bm-chamadas` ganharam `pathLength="1"` e correm do pino até o rótulo, 0,18s depois do pino pousar.
5. **Cascata do relevo** — as 4 curvas entram escalonadas na fração de entrada.
6. **Parallax do continente** — camadas da América do Sul andam ~14px a menos que o país.
7. **Ritmo** — a trilha caiu de `420svh` para `340svh` (três trechos desde a saída do Rio, SIS-6).

Tudo é `transform`/`opacity`. As abas `role="tablist"` seguem intactas — `irPara()` continua levando ao meio do trecho da cidade.

**Movimento reduzido / tela estreita / sem JS:** valores padrão continuam sendo o estado final. Resets nos dois blocos: câmera e parallax zerados, marcadores em escala 1, chamadas com `stroke-dashoffset: 0`, relevo em opacidade 1 e a ponta acesa com `display: none`.

Verificado: `tsc --noEmit` limpo (fora erros pré-existentes de `sistran-river-park-3d`) e `globals.css` compilando pelo PostCSS/Tailwind. `npm run build` continua falhando por `sistran-river-park-3d`.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/ui/BrazilOfficesMap.tsx`
- `src/app/globals.css`

---

## SIS-6 — Quem somos / Escritórios BRASIL: remover Rio de Janeiro da seção (por enquanto)

**Status:** In Review · **Labels:** nenhuma · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-6/quem-somos-escritorios-brasil-remover-rio-de-janeiro-da-secao-por

### Pedido
Retirar o Rio de Janeiro da seção “Escritórios BRASIL” em `/quem-somos`, por enquanto — ficam Pato Branco e São Paulo. Onde mexer: `OfficesScene.tsx:85` (item `{ id: 'rj', ... }` e trilha/rota); `BrazilOfficesMap.tsx:53` (copy “São Paulo e Rio de Janeiro”); `src/data/aSistran.ts`. Fora de escopo: Footer, `/contato` e `src/data/contact.ts` continuam listando o RJ.

### O que foi feito
**Feito** — commit `c88c37e` (branch `feat/escritorios-dinamicos-e-contato`).

O Rio saiu da cena inteira, não só da lista de cidades:
- `src/components/ui/OfficesScene.tsx` — removido o item `rj` de `CIDADES` (era o único sem fotos).
- `src/components/ui/BrazilOfficesMap.tsx` — removidos o ponto `rj` de `PONTOS`, a linha de chamada e o grupo de rótulo do Rio; a rota agora vai só de Pato Branco a São Paulo (`M347 448C372 430 394 417 422 411`, antes seguia até o RJ). O `<desc>` e o cabeçalho do arquivo foram atualizados.
- `src/app/globals.css` — retiradas as regras de estado (`data-ativa="rj"`) que acendiam/apagavam o pino do Rio.
- `src/data/aSistran.ts` e `src/app/quem-somos/page.tsx` — comentários atualizados registrando que a saída é **por enquanto**.

Mantido de propósito: o Rio continua no rodapé, em `/contato` e em `src/data/contact.ts`.

Verificado com `tsc --noEmit` (limpo, fora erros pré-existentes de `sistran-river-park-3d`) e busca por `rj`/`Rio` nos arquivos da seção.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/ui/OfficesScene.tsx`
- `src/components/ui/BrazilOfficesMap.tsx`
- `src/app/globals.css`
- `src/data/aSistran.ts`
- `src/app/quem-somos/page.tsx`

---

## SIS-5 — Contato: substituir seção "Saiba mais sobre o que podemos oferecer" por reveal dinâmico do modal Fale com a gente no scroll

**Status:** In Review · **Labels:** nenhuma · **Fechada em:** — · **Responsável:** Maria Eduarda M Camargo
**Link:** https://linear.app/sistran-labs/issue/SIS-5/contato-substituir-secao-saiba-mais-sobre-o-que-podemos-oferecer-por

### Pedido
Em `src/components/Contact.tsx` (headline “Saiba mais sobre o que podemos oferecer”), remover o conteúdo atual da seção e, no lugar, fazer o modal “Fale com a gente” (`ContactModal.tsx`) surgir de forma dinâmica conforme o scroll chega — a aparição do modal passa a ser a própria seção. Animação orquestrada por scroll (ScrollTrigger/pin ou equivalente), não um simples fade. Não quebrar a abertura do modal pelos outros gatilhos (Header / CTAs). `prefers-reduced-motion`: formulário alcançável sem depender da animação. Verificar `copy-lock.json:297`, que registra a copy removida.

### O que foi feito
Feito — commit `6859a35` no branch `feat/escritorios-dinamicos-e-contato`.

1. **`src/components/Contact.tsx` foi reescrito do zero.** Saiu o sobretítulo, o `<h2>`, o parágrafo do telefone, o botão magnético, o botão `tel:` e a grade `md:grid-cols-3` de unidades (`UNITS`). No lugar, a seção **é** o painel de “Fale com a gente”.
2. **O painel saiu de dentro do modal para `src/components/ContactPanel.tsx`.** Foto da sede com recorte em arco (máscara SVG + fio ciano + rede), bloco do telefone e formulário completo (`useActionState` + server action). `ContactModal.tsx` agora é só o comportamento de `<dialog>` e renderiza `<PainelContato />`.
3. **Inline, e não o `<dialog>` abrindo sozinho no scroll.** Decisão registrada: um `<dialog>` aberto por rolagem prende o foco e trava o scroll. O painel surge inline, com o gesto visual de modal abrindo (chega de baixo, de longe e menor, com véu). O modal de verdade continua sendo aberto pelo “Fale com a gente” do header.
4. **Coreografia no padrão da casa:** seção alta (`200svh`) com interior `sticky`, não `pin: true`. `ScrollTrigger` com `scrub: 1` escreve `--ct-surgir` e `--ct-p` num ref.
5. **Só `transform` e `opacity`** no painel. `filter: blur()` descartado (performance).
6. **CSS em `globals.css`:** tokens `--contact-*`/`--cd-*` passaram a valer para `.contact-dialog` e `.contact-inline`; `.contact-inline` zera a moldura com `--cd-altura: none`. Bloco novo `.ct-trilha`/`.ct-inner`/`.ct-palco`/`.ct-veu`/`.ct-painel`.
7. **Acessibilidade — default CSS = estado final.** Sem JS, abaixo de 1024px ou com `prefers-reduced-motion` o painel aparece pronto. Resets nos dois lugares. Botão “Fechar” da tela de sucesso só existe quando há modal (`onClose` opcional).

**Verificação:** `npx tsc --noEmit` limpo (fora erros pré-existentes de `sistran-river-park-3d`) e o CSS passa pelo PostCSS + Tailwind sem erro.

**Dois pontos para o dono do conteúdo.** A copy da seção continua no painel; o que saiu de fato foi a grade de unidades. `npm run test:copy` falha, mas já falhava antes (lock desatualizado); o lock não foi regenerado de propósito.

### Conferência
Sem registro de conferência no Linear.

### Arquivos tocados
- `src/components/Contact.tsx`
- `src/components/ContactPanel.tsx`
- `src/components/ContactModal.tsx`
- `src/app/globals.css`
