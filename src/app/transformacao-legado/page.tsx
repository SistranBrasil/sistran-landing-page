import PageShell from '@/components/PageShell';
import PageHero from '@/components/PageHero';
import { StackScenes } from '@/components/legacy/StackScenes';
import { RoadmapTrail } from '@/components/legacy/RoadmapTrail';

/* SIS-119 — esta `description` continua anunciando "método em quatro
   movimentos", e a seção do Método está retirada a pedido (o bloco `#sistema`
   inteiro comentado em `legacy/StackScenes.tsx`, conferido que não chega ao DOM).
   NÃO foi alterada aqui: mexer em texto de busca publicado é decisão de quem
   responde pelo conteúdo, e a seção pode voltar. É também o motivo pelo qual ela
   não virou o parágrafo visível da abertura — ver o comentário do `PageHero`. */
export const metadata = {
  title: 'Transformação de Legado · Sistran',
  description:
    'Arquitetura, método em quatro movimentos e roadmap do processo de transformação de legado via Luminna AI.',
};

/* Seções portadas da apresentação de legado (`apresentação/site`). A ordem
   importa: o mosaico entrega a peça "microserviços" para o cartão de cena
   dentro de StackScenes, e o roadmap fecha a narrativa. Conteúdo em
   `src/data/legacy.ts` — não inventar número, tecnologia ou estágio. */
export default function Page() {
  return (
    <PageShell>
      {/* SIS-119 · item 1 — A ABERTURA ENTRA, e com ela a rota deixa de ser a
          única das quatorze que começa dentro de uma seção interna. O que entra
          junto: o `<h1>` (a página não tinha nenhum — só `<h2>`, o que fazia a
          hierarquia começar no segundo nível) e a âncora `#topo`, que é fixa no
          `PageHero` e é o que o navegador lateral usa como primeira parada.

          O título é "Transformação de Legado" porque é o NOME que o site dá a
          esta página: é o `metadata.title`, é o `<h2>` do bloco de `/solucoes` de
          onde vem o único link de entrada, e é o rótulo que passa a existir no
          menu. Não foi usado `scenesIntro.title` ("A transformação começa quando
          o legado se torna explicável.") de propósito: aquela abertura do Método
          está comentada dentro de `StackScenes` porque foi RETIRADA A PEDIDO, e
          republicá-la aqui como frase de abertura desfaria um pedido do cliente
          por via indireta.

          A abertura fica SEM `description`, e a escolha é medida, não desleixo.
          As três frases candidatas foram todas descartadas por um motivo cada:
          • `scenesIntro.text` e `mosaicIntro.text` já são publicados no cartão de
            `/solucoes`, de onde vem o único link de entrada — o leitor que clicou
            no botão releria o parágrafo que acabou de ler para clicar.
          • a `description` do `metadata` ("Arquitetura, MÉTODO EM QUATRO
            MOVIMENTOS e roadmap...") promete uma seção que esta página NÃO
            mostra: o bloco `#sistema` / "Método" está inteiro comentado dentro de
            `StackScenes`, retirado a pedido. Como texto de busca ela é problema de
            outra issue; trazê-la para a tela seria eu publicar uma promessa falsa.
          O que a issue pede — `<h1>`, âncora `#topo` e entrada normalizada — não
          depende de parágrafo nenhum. Mesmo caminho já tomado em `/sistran-labs`.

          A `eyebrow` nomeia o que a página DE FACTO tem hoje, arquitetura e
          roadmap, e não o que o `metadata` ainda anuncia. */}
      <PageHero
        eyebrow="Arquitetura e roadmap"
        title="Transformação de"
        highlight="Legado"
      />

      <div>
        {/* SIS-119 — `StackScenes` continua montada SEM `variante`, e é
            deliberado: é o atributo `data-variante` que troca a composição, e
            ausência dele mantém o texto centrado e o cartão dominante no meio,
            como o comentário dela registra. O que muda com a abertura acima é só
            que esta seção não é mais o primeiro elemento da página — e a
            composição centrada continua correta justamente por isso: centrada,
            ela não disputa alinhamento com a abertura, que é alinhada à esquerda.
            O pin é interno (seção alta + `position: sticky`, o padrão deste
            repositório), então não há `start` de ScrollTrigger a recalcular por
            causa de um elemento novo acima. */}
        <StackScenes />
        {/* A montagem (`ImpactSequence`) vive na home, emendada no hero: o mesmo
            texto em duas páginas faria o leitor achar que já leu e pular. */}
        <RoadmapTrail />
      </div>
    </PageShell>
  );
}
