import Link from 'next/link';
import PageShell from '@/components/PageShell';
import PageHero from '@/components/PageHero';
import About from '@/components/About';
import Differentials from '@/components/Differentials';
import Metrics from '@/components/Metrics';
import ContactCTA from '@/components/ContactCTA';
import BuildingShowcase from '@/components/ui/BuildingShowcase';
import OfficesScene from '@/components/ui/OfficesScene';
import ScrollReveal from '@/components/ui/ScrollReveal';
import TituloAceso from '@/components/ui/TituloAceso';
import ProgressoLateral from '@/components/ui/ProgressoLateral';
import NotchDivider from '@/components/ui/NotchDivider';
import {
  ABORDAGEM,
  COMO_AGIMOS,
  DIFERENCIAIS_6,
  ISG,
  PILARES,
  POR_QUE_SISTRAN,
  PREMIACOES,
  PREMIACOES_NOTAS,
} from '@/data/aSistran';

export const metadata = {
  title: 'Quem somos · Sistran',
  description:
    'Com ampla presença na América do Sul, contando com mais de 130 clientes e 850 colaboradores, a Sistran é referência em soluções tecnológicas para o setor de Seguros.',
};

/* Esta pagina reune toda a escrita de /a-sistran/. O sobretitulo e o titulo sao
   os do site ("Sobre nós" / "A Sistran"); as secoes seguem a ordem da origem:
   escritorios, diferenciais, missao/valores/pilares, abordagem, como agimos,
   numeros, premiacoes, ISG e "Por que SISTRAN?". As secoes que no site sao
   apenas imagem (Tecnologias, carrosseis dos escritorios) nao foram recriadas.
   Os links para Sistran Labs e Sistran University estao aqui porque é por dentro
   de Quem somos que o menu do site chega nelas.
   Fonte: .claude/conteudo-site/01-a-sistran.md

   A dinamica de rolagem da pagina segue as skills de scroll: cada grade entra em
   cascata com `ScrollReveal` (entrada por `whileInView` com `once`, so opacidade e
   deslocamento), os cartoes usam o chanfro `.notch-card` e a barra de sinal
   `.barra-sinal`, e duas secoes escuras recebem a grade tecnica de fundo. Nada
   disso mexe na escrita: os textos, a ordem e as tags de titulo continuam os
   mesmos, e sem JavaScript ou com movimento reduzido a pagina é a lista
   completa que ja era. */
/* Degraus da grade de quatro colunas: cada coluna comeca um pouco mais abaixo
   que a vizinha, o que quebra a linha reta e faz a cascata de entrada ser
   percebida. É `transform`, entao nao move layout, e o CSS zera tudo abaixo de
   1024px e com movimento reduzido. */
const DEGRAU = ['', 'degrau-2', 'degrau-3', 'degrau-2'] as const;

export default function Page() {
  return (
    <PageShell>
      <ProgressoLateral />

      <PageHero eyebrow="Sobre nós" title="A" highlight="Sistran" />

      {/* Fronteiras claro/escuro em chanfro: o separador fica FORA do bloco
          claro, porque `.section-light` tem `isolation: isolate` e pintaria o
          proprio degrade sobre ele. A cor é a do bloco que avanca. */}
      <NotchDivider cor="#ffffff" invertido />

      <div className="section-light">
        <About />

        {/* Escritórios BRASIL */}
        <section aria-labelledby="escritorios" className="section-py">
          <div className="container-lp">
            <TituloAceso
              id="escritorios"
              texto="Escritórios"
              destaque="BRASIL"
              className="font-display text-section font-bold text-ink"
            />
          </div>
          {/* Mapa com as fotos dos escritorios: a rolagem percorre Pato Branco
              e Sao Paulo. As descricoes sao as mesmas de antes, agora sobre o
              mapa. O Rio de Janeiro saiu da cena por ora — continua no rodape e
              na pagina de contato.
              Fica fora do container de proposito: em telas largas o mapa toma a
              largura inteira da janela. Em tela estreita a cena volta a ser
              lista, e por isso ela mesma reaplica a margem lateral. */}
          <div className="mt-10">
            <OfficesScene />
          </div>
        </section>

        {/* Explorador 3D. Fica junto dos escritorios porque é do edificio que
            trata; entra sem titulo e sem texto novo — o pedido foi manter o
            componente 3D, nao acrescentar escrita.

            A torre tambem aparece DENTRO da cena acima, no trecho de Sao Paulo,
            com o 2º andar marcado — lá ela é dirigida pela rolagem e nao aceita
            o ponteiro. Este bloco continua sendo o explorador de verdade: gira
            com o arraste, tem bussola, vistas rapidas e o complexo modular.
            Cada cena pausa o proprio laco de render quando sai da tela, entao só
            uma delas desenha por vez. */}
        <section aria-label="Explorador arquitetônico 360°" className="section-py pt-0">
          <div className="container-lp">
            <BuildingShowcase />
          </div>
        </section>

        {/* Diferenciais — os 6 itens, so titulo, como no site */}
        <section aria-labelledby="diferenciais-6" className="section-py">
          <div className="container-lp">
            <TituloAceso
              id="diferenciais-6"
              texto="Diferenciais"
              className="font-display text-section font-bold text-ink"
            />
            <ul className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {DIFERENCIAIS_6.map((d, i) => (
                <ScrollReveal
                  as="li"
                  indice={i}
                  key={d}
                  className="glass-card notch-card barra-sinal p-6 font-display text-base font-bold leading-snug text-ink"
                >
                  {d}
                </ScrollReveal>
              ))}
            </ul>
          </div>
        </section>

        <Differentials />
      </div>

      <NotchDivider cor="#e4edf7" />

      {/* Missão · Valores · Pilares */}
      <section aria-labelledby="missao-valores-pilares" className="section-py">
        <div className="container-lp">
          <h2 id="missao-valores-pilares" className="sr-only">
            Missão, Valores e Pilares
          </h2>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <ScrollReveal as="article" indice={0} className="glass-card notch-card barra-sinal p-7">
              <h3 className="font-display text-xl font-bold text-white">Missão</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/85">
                Oferecer soluções de negócios escaláveis, de baixo TCO*, baseadas em tecnologia para
                companhias de Seguros, considerando suas necessidades atuais e futuras.
              </p>
              <p className="mt-3 text-xs italic leading-relaxed text-ink-faint">
                *Total Cost of Ownership, uma estimativa financeira de custos diretos e indiretos de
                investimentos.
              </p>
            </ScrollReveal>

            <ScrollReveal as="article" indice={1} className="glass-card notch-card barra-sinal p-7">
              <h3 className="font-display text-xl font-bold text-white">Valores</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/85">
                Conhecimento em Seguros, Flexibilidade, Tecnologia, Solidez e permanência.
              </p>
            </ScrollReveal>

            <ScrollReveal as="article" indice={2} className="glass-card notch-card barra-sinal p-7">
              <h3 className="font-display text-xl font-bold text-white">Pilares</h3>
              <ul className="mt-3 space-y-2">
                {PILARES.map((p) => (
                  <li key={p} className="text-sm leading-relaxed text-white/85">
                    {p}
                  </li>
                ))}
              </ul>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <NotchDivider cor="#f2f9fe" invertido />

      {/* Abordagem de projetos */}
      <section aria-labelledby="abordagem" className="section-py section-light section-light-blue">
        <div className="container-lp">
          <TituloAceso
            id="abordagem"
            texto="Temos uma abordagem completa de projetos para o mercado Segurador"
            className="max-w-3xl font-display text-section font-bold text-ink"
          />
          <ol className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ABORDAGEM.map((etapa, i) => (
              <ScrollReveal
                as="li"
                indice={i}
                key={etapa}
                className={`glass-card notch-card barra-sinal p-6 ${DEGRAU[i % 4]}`}
              >
                <span className="etapa-num num-monumental">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="mt-2 font-display text-lg font-bold text-ink">{etapa}</h3>
              </ScrollReveal>
            ))}
          </ol>
        </div>
      </section>

      <NotchDivider cor="#cfe7f7" />

      {/* Como Agimos */}
      <section aria-labelledby="como-agimos" className="section-py relative overflow-hidden">
        <div aria-hidden className="grade-tecnica" />
        <div className="container-lp">
          <TituloAceso
            id="como-agimos"
            texto="Como"
            destaque="Agimos"
            className="font-display text-section font-bold text-white"
          />
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/85">
            Nossos valores são a base da nossa cultura organizacional. Respeitando as
            individualidades, prezamos pela:
          </p>
          <ol className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
            {COMO_AGIMOS.map((v, i) => (
              <ScrollReveal
                as="li"
                indice={i}
                key={v}
                className={`glass-card-hover notch-card barra-sinal p-6 ${DEGRAU[i % 4]}`}
              >
                <span className="etapa-num num-monumental">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="mt-2 font-display text-base font-bold text-white">{v}</h3>
              </ScrollReveal>
            ))}
          </ol>
        </div>
      </section>

      <Metrics />

      {/* Premiações, Certificações e Reconhecimentos */}
      <section aria-labelledby="premiacoes" className="section-py">
        <div className="container-lp">
          <TituloAceso
            id="premiacoes"
            texto="Premiações, Certificações e"
            destaque="Reconhecimentos"
            className="font-display text-section font-bold text-white"
          />
          <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PREMIACOES.map((p, i) => (
              <ScrollReveal
                as="li"
                indice={i}
                key={p.label}
                className="glass-card-hover notch-card barra-sinal p-6"
              >
                <span className="num-monumental num-forte">{p.value}</span>
                <p className="mt-2 text-sm leading-relaxed text-white/85">{p.label}</p>
              </ScrollReveal>
            ))}
          </ul>
          <div className="mt-8 space-y-4">
            {PREMIACOES_NOTAS.map((n) => (
              <p key={n.slice(0, 24)} className="max-w-3xl text-lg leading-relaxed text-white/85">
                {n}
              </p>
            ))}
          </div>
        </div>
      </section>

      <NotchDivider cor="#f2f9fe" invertido />

      {/* ISG Provider Lens */}
      <section aria-labelledby="isg" className="section-py section-light section-light-blue">
        <div className="container-lp">
          <TituloAceso
            id="isg"
            texto="ISG Provider Lens"
            className="font-display text-section font-bold text-ink"
          />
          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* O `Reveal` envolve a citacao em vez de substituir a tag: o
                `blockquote` é semantica do conteudo e continua no lugar. */}
            {ISG.map((i, ordem) => (
              <ScrollReveal indice={ordem} key={i.term}>
                <blockquote className="glass-card notch-card barra-sinal h-full p-7">
                  <p className="font-display text-base font-bold text-ink">{i.term}</p>
                  <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                    &ldquo;{i.quote}&rdquo;
                  </p>
                </blockquote>
              </ScrollReveal>
            ))}
          </div>
          <p className="mt-8 text-xs leading-relaxed text-ink-faint">
            (*) ISG —{' '}
            <a
              href="https://isg-one.com/index/isg-index"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4"
            >
              Consultores Globais em Gestão de Outsourcing
            </a>
            . Reprint autorizado por ISG Provider Lens ©, Brasil.
          </p>
        </div>
      </section>

      <NotchDivider cor="#cfe7f7" />

      {/* Por que SISTRAN? */}
      <section aria-labelledby="por-que-sistran" className="section-py relative overflow-hidden">
        <div aria-hidden className="grade-tecnica" />
        <div className="container-lp">
          {/* No site o titulo termina com uma aspa dupla solta; removida. */}
          <TituloAceso
            id="por-que-sistran"
            texto="Por que"
            destaque="SISTRAN?"
            className="font-display text-section font-bold text-white"
          />
          <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
            {POR_QUE_SISTRAN.map((b, i) => (
              <ScrollReveal
                as="article"
                indice={i}
                key={b.title}
                className={`glass-card-hover notch-card barra-sinal relative overflow-hidden p-7 ${
                  i % 2 === 1 ? 'degrau-2' : ''
                }`}
              >
                <span aria-hidden className="corner-accent" />
                <h3 className="font-display text-lg font-bold leading-snug text-white">
                  {b.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-white/85">{b.text}</p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <NotchDivider cor="#f2f9fe" invertido />

      {/* Caminho para as outras duas paginas do submenu "Quem somos". */}
      <section
        aria-labelledby="mais-quem-somos"
        className="section-py section-light section-light-blue"
      >
        <div className="container-lp">
          <TituloAceso
            id="mais-quem-somos"
            texto="Conheça também"
            className="font-display text-section font-bold text-ink"
          />
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
            <ScrollReveal indice={0}>
              <Link
                href="/sistran-labs"
                className="glass-card notch-card barra-sinal block h-full p-7 transition-transform hover:-translate-y-1"
              >
                <h3 className="font-display text-xl font-bold text-ink">
                  Sistran Labs: Laboratório de INOVAÇÃO
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                  Formado por uma equipe de nativos digitais, o Sistran Labs é o laboratório de
                  inovações da Sistran.
                </p>
              </Link>
            </ScrollReveal>
            <ScrollReveal indice={1}>
              <Link
                href="/sistran-university"
                className="glass-card notch-card barra-sinal block h-full p-7 transition-transform hover:-translate-y-1"
              >
                <h3 className="font-display text-xl font-bold text-ink">Sistran University</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                  Autossuficiência em capacitação de recursos: programa de capacitação intensiva da
                  Sistran.
                </p>
              </Link>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <NotchDivider cor="#cfe7f7" />

      <ContactCTA />
    </PageShell>
  );
}
