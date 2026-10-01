import type { Solution } from './types';

/* Os 4 cards de "Soluções de Negócios" da home, tambem repetidos na pagina
   Soluções, Serviços e Consultoria (secao "Serviços — Diferenciais").
   Titulo e descricao verbatim; o card 2 nao tem ponto final no site.
   Fonte: .claude/conteudo-site/00-home.md e 04-solucoes-servicos-e-consultoria.md

   SIS-244 (01/10) — as quatro fotos trocadas pelas artes entregues pela área. O
   de-para, para quem precisar voltar atrás:

     1 apis-projetos       /images/home/escritoriosp.jpg    -> escritoriosp.png
     2 servicos-processos  /images/home/escritoriosp1.jpg   -> /images/escritoriosp/sp1-1.jpeg
     3 tipos-servico       /images/home/sistransphist2.jpg  -> escritoriosp1.png
     4 staff-augmentation  /images/home/sistransphist3.jpg  -> "Three professionals at an AWS event.png"

   ⚠️ Os dois primeiros caminhos antigos JÁ NÃO EXISTEM no disco: `escritoriosp.jpg`
   e `escritoriosp1.jpg` foram apagados na mesma leva em que os `.png` entraram, o
   que significa que os cards 1 e 2 estavam servindo 404 ANTES desta troca — não é
   uma regressão introduzida aqui, é o conserto dela. Voltar atrás nesses dois
   exige restaurar os arquivos, não só reescrever a string.

   ⚠️ A arte do card 2 é a ÚNICA em RETRATO (3000×4000, proporção 0,75) entre três
   paisagens, e isso a favorece. O quadro que consome as fotos é ALTO nas duas
   pontas — medido: painel `sticky` do desktop 684×780 (0,88) e figura do mobile
   359×490 (0,73) —, então num `object-fit: cover` quem sobra em largura é que cede.
   O recorte de cada uma, medido:

                        desktop (0,88)        mobile (0,73)
     1 escritoriosp.png  -64% largura         -70% largura
     2 sp1-1.jpeg        -14% altura          -2% largura
     3 escritoriosp1.png -53% largura         -60% largura
     4 AWS event.png     -31% largura         -42% largura

   ⚠️ O card 1 perder 70% da largura NÃO é regressão desta troca: a foto antiga
   tinha 2048×841 (proporção 2,44) contra 1957×804 (2,43) da nova — recorte idêntico
   até o ponto percentual. A foto é um grupo de ~30 pessoas em linha, e o quadro
   vertical mostra só o miolo dela nas duas pontas. Quem quiser a foto inteira legível
   precisa de outro quadro (ou de um corte 0,88 feito à mão), não de outro arquivo —
   e isso é redesenho do sticky, que é a SIS-196, não esta issue.

   Os cards 3 e 4 trocaram 1,50 por 1,85 e 1,27: o 4 ganhou (de -41%/-51% para
   -31%/-42%) e o 3 perdeu um pouco (para -53%/-60%). No conjunto a troca melhora o
   recorte, puxada pelo retrato do card 2.

   ⚠️⚠️ PESO: esta seção passou de 0,79 MB para 7,40 MB entregues (medido, 9,4×).
   Três das quatro artes são PNG de ~2,1–2,4 MB, e o `next.config.mjs` está com
   `images: { unoptimized: true }` (SIS-154, decisão de deploy em aberto) — então o
   `next/image` NÃO converte para WebP nem redimensiona: serve o arquivo cru, do
   tamanho que está no disco. Pior: o card 1 é `preload`/`eager` na home, logo os
   2,4 MB dele entram no caminho crítico.

   Medido por arquivo: escritoriosp.png 2448 kB · sp1-1.jpeg 870 kB ·
   escritoriosp1.png 2145 kB · AWS event.png 2117 kB.

   NÃO re-encodei as artes aqui, de propósito: são os arquivos como a área entregou,
   e recomprimir material de terceiro sem pedido é decidir no lugar de quem é dono.
   O conserto é derivar WebP e apontar estas quatro linhas para as derivadas — é
   exatamente o que `/contato` já fez (ver o comentário em `app/contato/page.tsx`:
   179 kB de JPG viraram 92 kB de `contato-hero.webp`), e há script de referência em
   `scripts/otimizar-tiles-mosaico.mjs`. PNG para fotografia é o erro de base: estas
   três não têm transparência (`alpha=false`, medido), então o PNG só paga o preço
   do sem-perdas sem usar o recurso dele.

   Os quatro `imageAlt` foram reescritos onde a CENA mudou de assunto (2 virou
   fachada de prédio, 3 virou open space em dia de trabalho, 4 virou evento da AWS).
   O do card 1 ficou como estava: é a mesma foto posada do time, só em resolução
   maior. Alt é conteúdo — descreve o que a foto mostra, não o que o card vende. */

export const SOLUTIONS: readonly Solution[] = [
  {
    id: 'apis-projetos',
    title: 'APIs, Projetos, Desenvolvimento, Sustentação e Migrações',
    description: 'Produção confiável, entregas de qualidade, ótima relação custo-benefício.',
    icon: 'Code2',
    // Claro o suficiente para contrastar com o fundo azul (#1273BC).
    // O antigo #0079CB era quase invisivel apos a paleta clarear.
    color: '#57B7EE',
    colorOnLight: '#0067AF',
    image: '/images/home/escritoriosp.png',
    imageAlt: 'Equipe Sistran no escritório de São Paulo, em frente aos monitores de desenvolvimento.',
  },
  {
    id: 'servicos-processos',
    title: 'Serviços e Processos',
    description: 'Amplo domínio de negócios e processos em Seguros em TODOS os ramos',
    icon: 'Workflow',
    color: '#0ed8f6',
    colorOnLight: '#0193B4',
    image: '/images/escritoriosp/sp1-1.jpeg',
    imageAlt: 'Fachada do edifício do escritório da Sistran em São Paulo, vista de baixo.',
  },
  {
    id: 'tipos-servico',
    title: 'Tipos de Serviço',
    description: 'Squads/vilas, Managed Services, alocações, projetos fechados.',
    icon: 'Boxes',
    // Paleta 100% azul da marca: o violeta/roxo antigo destoava dos cards.
    color: '#38BDF8',
    colorOnLight: '#0369A1',
    image: '/images/home/escritoriosp1.png',
    imageAlt: 'Open space da Sistran em dia de trabalho, com os times nas estações de desenvolvimento.',
  },
  {
    id: 'staff-augmentation',
    title: 'Staff Augmentation',
    description: 'A serviço do Delivery.',
    icon: 'UserPlus',
    color: '#7DD3FC',
    colorOnLight: '#075985',
    /* Espaços no nome do arquivo, mantidos literais: `next/image` recebe a string
       como `src` e o pedido sai com os espaços percent-encodados pelo navegador,
       que é o que o `/_next/image?url=` espera. Renomear o arquivo seria mais
       limpo, mas é a arte como a área entregou — e renomear sem pedido é mexer no
       que não foi pedido. Se algum dia o bundler reclamar, o conserto é renomear o
       arquivo E esta linha, nunca só uma das duas. */
    image: '/images/home/Three professionals at an AWS event.png',
    imageAlt: 'Três profissionais da Sistran em frente ao painel da AWS, durante evento do parceiro.',
  },
] as const;
