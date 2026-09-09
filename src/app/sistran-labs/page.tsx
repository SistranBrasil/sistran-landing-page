import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import PageShell from '@/components/PageShell';
import PageHero from '@/components/PageHero';
import ContactCTA from '@/components/ContactCTA';
import { CONTACT_EMAIL } from '@/data/contact';
import { ACCELERATORS } from '@/data/accelerators';
import { getIcon } from '@/lib/icons';

export const metadata = {
  title: 'Sistran Labs · Sistran',
};

/* Soluções já desenvolvidas, como escritas no site: nome em caixa alta seguido
   da lista de tecnologias. Predição de Churn e Fast Claims aparecem só aqui —
   nao tem pagina propria em /service/. */
const SOLUCOES = [
  {
    name: 'Guru de Seguros',
    description: 'AI, Comandos de voz, Assistente Conversacional (Alexa).',
  },
  {
    name: 'Predição de Churn',
    description: 'Data Science, com ações de Retenção e aumento da renovação.',
  },
  {
    name: 'Fast Claims',
    description: 'Robots (linguagem natural) para otimizar Regulação.',
  },
  {
    name: 'Smart Miner',
    description: 'AI na leitura e tipificação de documentos (inclusive não padrão/formatados).',
  },
] as const;

/* SIS-122 — quem TEM página própria não é republicado aqui.
   Guru de Seguros e Smart Miner estavam saindo duas vezes na mesma rota: uma
   nesta lista, sem link e com uma descrição, outra na vitrine de baixo, clicável
   e com outra descrição. Das duas saídas que a issue oferece — fundir as duas
   seções, ou esta ficar só com o que não tem página — foi tomada a segunda, que é
   a que o comentário do próprio array já anunciava ("Predição de Churn e Fast
   Claims aparecem só aqui").
   O filtro é DERIVADO de `ACCELERATORS`, e não uma lista curta reescrita à mão:
   os quatro itens continuam no dado, com o texto travado do site, e no dia em que
   um deles ganhar página em `/solucoes/[slug]` ele sai desta seção sozinho — que é
   o defeito voltando pela porta de trás se a filtragem fosse manual.
   Casa por NOME porque é o que as duas fontes têm em comum: `SOLUCOES` não guarda
   slug. Conferido que a grafia bate exatamente ('Guru de Seguros', 'Smart Miner'
   em `src/data/accelerators.ts`); nome que divergir por um acento volta a duplicar,
   e é por isso que este comentário existe. */
const NOMES_COM_PAGINA_PROPRIA = new Set(ACCELERATORS.map((a) => a.name));
const SOLUCOES_SO_AQUI = SOLUCOES.filter((s) => !NOMES_COM_PAGINA_PROPRIA.has(s.name));

/* Toda a escrita desta pagina vem de /sistran-labs/.
   Fonte: .claude/conteudo-site/02-sistran-labs.md

   SIS-80 — "Principais Soluções Sistran Labs" entra. O comentário anterior aqui
   dizia que a seção não fora recriada porque no site ela é só um PNG sem alt e
   sem escrita, e isso continua verdade: o que ela lista não estava perdido, mas
   sim publicado em OUTRO lugar do site, como texto, na vitrine de aceleradores
   de `/solucoes-servicos-e-consultoria/` — que é o que `ACCELERATORS` guarda.
   Então a seção não inventa conteúdo: ela nomeia em texto os sete produtos que a
   imagem mostrava como logos, e cada um leva à sua própria página, que já existe
   em `/solucoes/[slug]`. É a correção do defeito de origem (nome de produto só
   dentro de imagem, invisível para busca e para leitor de tela), não um enfeite.

   Sem `Accelerators.tsx`, o componente que já desenha esses cards: a escrita dele
   é a de `/solucoes` ("Tecnologia Disruptiva" / "Conheça nossos aceleradores") e
   trazê-la para cá colaria o cabeçalho de outra página no meio desta. */
export default function Page() {
  return (
    <PageShell>
      {/* SIS-122 — a abertura ficou SEM `description`, e não com uma descrição
          encurtada. Os três parágrafos desceram para a seção `#labs-o-que-e`,
          logo abaixo, PALAVRA POR PALAVRA: resumir aqui exigiria cortar no meio
          de frase travada em `copy-lock.json`, e repetir a primeira frase nos
          dois lugares publicaria o mesmo texto duas vezes — que é o defeito do
          item 1 desta issue, só com escrita em vez de produto.
          O degrau de fonte do título NÃO muda: `PageHero` mede
          `title + highlight` (37 caracteres, faixa `<= 64`) e nenhum dos dois
          mudou de tamanho — "Laboratório de INOVAÇÃO" e "Laboratório de
          Inovação" têm os mesmos 23 caracteres.
          A altura da abertura também não desaba: `pagehero-entrada` tem
          `min-height` própria (o comentário está em `PageHero.tsx`), e era
          justamente esta rota que ocupava 104% da janela a 1440 — o caso extremo
          que a normalização existe para conter. */}
      <PageHero
        title="Sistran Labs:"
        /* Caixa mista, das duas saídas que a issue oferece para o item 3 ("passar
           para CSS, ou reescrever em caixa mista"): aqui `highlight` é `string`
           tipada, não nó, então não há onde pendurar um `uppercase` sem trocar a
           forma da prop que as outras treze rotas usam. Nos dois trechos do corpo,
           onde é JSX, foi feita a outra saída — o texto volta a caixa mista e o
           `uppercase` vai para a classe, então a tela continua igual. */
        highlight="Laboratório de Inovação"
      />

      {/* `id` novo, registrado em `src/data/pageSections.ts` na mesma leva: o
          `ui/ScrollSpy` desta rota lista as âncoras dali, e seção com conteúdo
          fora do mapa é seção que o navegador lateral não alcança. */}
      <section aria-labelledby="labs-o-que-e" className="section-py">
        <div className="container-lp">
          {/* `sr-only`: o `aria-labelledby` precisa de um título de verdade para
              apontar, e um `<h2>` visível aqui abriria um capítulo que a escrita
              do site não tem — o primeiro parágrafo JÁ apresenta o Labs, e o
              título visível da rota é o `<h1>` logo acima. */}
          <h2 id="labs-o-que-e" className="sr-only">
            O Sistran Labs
          </h2>
          <div className="max-w-2xl space-y-4 text-lg leading-relaxed text-white/85">
            <p>
              Formado por uma equipe de nativos digitais, o Sistran Labs é o laboratório de inovações
              da Sistran. Aqui, as ideias se transformam em verdadeiras soluções assertivas que
              impulsionam o crescimento das Seguradoras. O Sistran Labs possui foco em{' '}
              {/* Caixa alta por CSS, não no conteúdo: leitor de tela lê
                  "inteligência de negócios em seguros" como palavras, e não
                  letra por letra, enquanto na tela o texto continua em
                  maiúsculas — a mesma solução que os nomes dos cards abaixo já
                  usavam (`uppercase` no `<h3>`). */}
              <span className="uppercase">Inteligência de Negócios em Seguros</span> 100% voltados ao
              estudo/aplicação das soluções mais eficientes para transformação digital,
              utilizando/criando tecnologia disruptiva (DS/AI/ML/
              {/* DS, AI e ML ficam como estão: são siglas, e sigla em maiúscula é
                  a grafia correta dela. "CLOUD" é palavra inteira em caixa alta
                  no meio de uma enumeração, então recebe o mesmo tratamento dos
                  dois trechos maiores. */}
              <span className="uppercase">cloud</span>/No &amp; Low-code).
            </p>
            <p>
              O Sistran Labs com sua expertise tecnológica, é a solução ideal para{' '}
              <span className="uppercase">testar, desenvolver e/ou homologar</span> as tecnologias e
              soluções de negócio mais adequadas com foco em automatizar processos, adicionar
              segurança, melhorar a experiência do usuário.
            </p>
            <p>
              Nosso time de experts, amplia a capacidade da Seguradora &ldquo;Staff
              Augmentation&rdquo;, com custos racionais, eventualmente interligando-se aos Labs de
              referência (da seguradora / internacional), validando e localizando soluções.
              Selecionamos, treinamos e capacitamos recursos para as seguradoras, recebendo
              colaboradores e devolvendo profissionais em outro patamar de competência. Estamos
              falando da excelência operacional certeira de um time especializado em Seguros.
              &ldquo;Innovation that matters!&rdquo;
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="labs-solucoes" className="section-py">
        <div className="container-lp">
          <h2
            id="labs-solucoes"
            className="max-w-2xl font-display text-section text-white"
          >
            Já desenvolvemos muitas soluções, entre elas:
          </h2>

          <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {SOLUCOES_SO_AQUI.map((s) => (
              <li key={s.name} className="glass-card-hover relative overflow-hidden p-7">
                <span aria-hidden className="corner-accent" />
                <h3 className="font-display text-xl uppercase leading-tight text-white">
                  {s.name}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-white/85">{s.description}</p>
              </li>
            ))}
          </ul>

          {/* SIS-122 · item 5 — O E-MAIL DO MEIO DA PÁGINA FICA, e o motivo é que
              ele não é a segunda chamada da mesma coisa. O `ContactCTA` que fecha
              a rota leva a `/#contato` (conferido em `ContactCTA.tsx`), ou seja a
              um FORMULÁRIO em outra tela; aqui o gesto é `mailto:` com o endereço
              legível, e é o único lugar da rota onde o endereço aparece escrito.
              Tirá-lo apagaria o único caminho por e-mail de uma página cuja
              escrita convida a escrever — e apagar convite publicado é decisão de
              quem responde pelo conteúdo, não desta issue.
              O que a issue mede (duas chamadas a 60% e 100% da rolagem) continua
              verdade, e é o custo aceito: dois caminhos diferentes para contato,
              não o mesmo botão repetido. */}
          <p className="mt-10 max-w-2xl text-lg leading-relaxed text-white/85">
            Entre em contato conosco através do e-mail:{' '}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="font-bold text-[#A5F0FF] underline underline-offset-4"
            >
              {CONTACT_EMAIL}
            </a>{' '}
            e saiba como podemos orientá-lo na busca pela inovação e transformação digital.
          </p>
        </div>
      </section>

      <section
        aria-labelledby="labs-principais"
        className="section-py section-light section-light-blue"
      >
        <div className="container-lp">
          <span className="tag-section">Sistran Labs</span>
          <h2
            id="labs-principais"
            className="mt-4 max-w-2xl font-display text-section text-ink"
          >
            Principais Soluções Sistran Labs
          </h2>

          <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {ACCELERATORS.map((a) => {
              const Icone = getIcon(a.icon);
              return (
                <li key={a.id}>
                  {/* O cartão inteiro é o link — alvo grande, um só destino, e o
                      nome do produto é o texto acessível do link. */}
                  <Link
                    href={`/solucoes/${a.id}`}
                    className="glass-card-hover group flex h-full flex-col p-7"
                  >
                    <span
                      aria-hidden
                      className="flex h-12 w-12 items-center justify-center rounded-2xl"
                      style={{
                        background: `linear-gradient(135deg, ${a.tone}2e, ${a.tone}0f)`,
                        border: `1px solid ${a.tone}66`,
                      }}
                    >
                      {/* O glifo NÃO usa `a.tone`: metade dos tons são cianos e
                          lilases claros, feitos para brilhar sobre o azul
                          escuro da vitrine, e sobre cartão claro eles somem. O
                          tom fica só na placa atrás, onde é fundo e não
                          conteúdo; o traço vai no azul da marca. */}
                      <Icone className="h-5 w-5 text-[#1273BC]" strokeWidth={1.8} />
                    </span>
                    <h3 className="mt-5 font-display text-xl text-ink">{a.name}</h3>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-muted">
                      {a.description}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-[#1273BC]">
                      Conhecer
                      <ArrowUpRight
                        className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        strokeWidth={2.4}
                        aria-hidden
                      />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <ContactCTA />
    </PageShell>
  );
}
