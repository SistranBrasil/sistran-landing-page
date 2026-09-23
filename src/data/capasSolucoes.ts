/* SIS-286 — CAPAS DE ABERTURA POR SLUG.
   É um mapa, e não um `slug === 'smart-miner'` solto no meio do JSX, por dois
   motivos: a condição fica declarada num lugar só (o JSX do template continua
   sendo uma expressão sobre «esta slug tem capa ou não»), e cada arte nova entra
   como uma linha aqui em vez de como um `if` a mais no corpo do template. O
   escopo daquela issue foi ampliado de UMA para QUATRO capas em 18/09, depois
   para SEIS em 21/09 — o corpo daquele dia nomeia `match-ai` e `fast` —, e o mapa
   absorveu as cinco novas sem que o JSX mudasse uma letra: é para isso que ele
   existe.
   O mapa NÃO TEM a restante (`lumina-ai`) de propósito — item 4 daquela issue:
   ela segue sem capa de ABERTURA até haver arquivo, e ausência de chave é a forma
   de dizer isso sem escrever um `undefined`. (Capa de CARTÃO ela tem, em
   `src/data/accelerators.ts` → `capaCard`; são coisas diferentes.)
   O `className` é o par obrigatório do `src`: é por ele que o véu e o recorte de
   cada arte são escopados no `globals.css`. Uma capa sem classe herdaria o véu
   base, que é vertical e calibrado para um take escuro de ponta a ponta (SIS-94) —
   não é o caso de nenhuma destas seis, que têm o lado direito aceso e a metade
   esquerda escura, e é justamente isso que as torna utilizáveis atrás de texto.

   SIS-292 — O MAPA SAIU DE `src/app/solucoes/[slug]/page.tsx` PARA CÁ, e só por
   isso: passou a ter DOIS leitores. O template continua montando a abertura com
   ele, e a página do Match AI (`components/solucoes/MatchAiPagina.tsx`) usa a
   mesma entrada para a foto do hero dividido — sem o módulo, o caminho da arte
   estaria escrito duas vezes e divergiria na primeira troca de arquivo. Nada do
   conteúdo mudou na mudança de casa; um `export` a mais num arquivo de `page`
   também funcionaria, mas `page.tsx` tem contrato de exports com o Next e não é
   lugar de dado compartilhado.

   SIS-280 — A SÉTIMA SLUG SAIU DO TEMPLATE, E A AUSÊNCIA DELA AQUI CONTINUA — com
   motivo NOVO, e é por isso que a nota é acrescentada em vez de a de cima ser
   corrigida. Duas coisas mudaram: a slug passou a ser `luminna-ai` (dois n), então a
   grafia `lumina-ai` citada acima é histórica; e ela ganhou corpo próprio
   (`components/solucoes/LuminnaAiPagina.tsx`), logo NÃO É MAIS o template genérico
   quem monta a abertura dela. Entrada aqui, hoje, traria um `className`
   `hero-backdrop--luminna-ai` sem nenhuma regra do outro lado — gancho morto —, e o
   único leitor do `className` deste mapa é justamente o template que a slug deixou de
   usar. A arte do hero dela é declarada na própria página, a partir do `capaCard` que
   a nota de cima já distingue. Resumindo: o mapa segue com SEIS entradas, e o dia em
   que existir arte de ABERTURA para o Luminna a decisão é entre pôr a chave aqui (se o
   template voltar a servi-la) ou nomear o arquivo lá dentro. */
export const CAPAS_DE_ABERTURA: Record<string, { src: string; className: string }> = {
  'smart-miner': {
    src: '/images/solucoes/smart-miner-hero.webp',
    className: 'hero-backdrop--smart-miner',
  },
  'qa-integrado': {
    src: '/images/solucoes/qa-integrado-hero.webp',
    className: 'hero-backdrop--qa-integrado',
  },
  'connect-api': {
    src: '/images/solucoes/connect-api-hero.webp',
    className: 'hero-backdrop--connect-api',
  },
  'guru-de-seguros': {
    src: '/images/solucoes/guru-de-seguros-hero.webp',
    className: 'hero-backdrop--guru-de-seguros',
  },
  'match-ai': {
    src: '/images/solucoes/match-ai-hero.webp',
    className: 'hero-backdrop--match-ai',
  },
  fast: {
    src: '/images/solucoes/fast-hero.webp',
    className: 'hero-backdrop--fast',
  },
};
