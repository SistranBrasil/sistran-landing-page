import Image from 'next/image';
import Link from 'next/link';
import PageShell from '@/components/PageShell';
import PageHero from '@/components/PageHero';
import ContactCTA from '@/components/ContactCTA';

export const metadata = {
  title: 'Sistran University · Sistran',
};

/* SIS-116 — A PÁGINA DEIXA DE SER SÓ A ABERTURA, e nenhuma palavra foi escrita
   para isso. A fonte (`.claude/conteudo-site/03-sistran-university.md`) publica
   dois parágrafos e uma galeria, e é a página mais curta do site. O que estava
   feito era o texto inteiro — os dois parágrafos, dez linhas de corpo — enfiado
   dentro da `description` da abertura, onde cabe uma frase.

   O que mudou é DISTRIBUIÇÃO, não conteúdo. As quatro frases do primeiro
   parágrafo e a do segundo continuam aqui, na íntegra, e cada uma foi para um
   lugar:
   • a abertura fica com a última frase do 1º parágrafo ("Somos um verdadeiro
     banco de talentos..."), que é a única que se sustenta sozinha como apoio do
     título — é afirmação de posição, não descrição de programa;
   • as três primeiras frases descem para duas seções;
   • o 2º parágrafo virou indicadores, porque é onde estão os três dados.
   Nada foi repetido em dois lugares: a frase que subiu para a abertura NÃO
   aparece de novo nas seções (foi o defeito medido na SIS-120).

   OS TÍTULOS DAS SEÇÕES SAEM DO TEXTO QUE EXISTE, como o ponto de atenção da
   issue exige — são trechos contíguos e literais dos parágrafos, com só a
   primeira letra em maiúscula:
   • "Formar especialistas em tecnologia de ponta" — de "...dedicado a FORMAR
     ESPECIALISTAS EM TECNOLOGIA DE PONTA e desenvolvimento de sistemas."
   • "Em parceria com o Unidep" — abre a 2ª frase, literal.
   • "Desde 2022, já formamos" — abre o 2º parágrafo, literal.
   Nenhum deles é headline nova; se um dia a fonte mudar, o título muda com ela.

   A FRASE AGRAMATICAL NÃO FOI CORRIGIDA. "O Sistran University, programa de
   capacitação intensiva da Sistran, dedicado a formar..." não tem verbo
   principal, a própria fonte marca isso, e agora ela abre uma seção em vez de
   ficar escondida no meio de dez linhas — quer dizer que fica MAIS visível.
   Ainda assim é texto publicado: reescrevê-la é decisão de quem responde pelo
   conteúdo, não minha. Registrado na issue como ponto parado.

   Fonte: .claude/conteudo-site/03-sistran-university.md */

/* SIS-116 · item 3 — os três dados do 2º parágrafo como INDICADOR. O `valor` e o
   `texto` de cada um são a mesma frase da fonte partida em dois pedaços
   contíguos: "já formamos MAIS DE 60 | ESPECIALISTAS COM MENTALIDADE INOVADORA,
   QUE APRENDEM NA PRÁTICA e acumulam experiência em MAIS DE 17 | PROJETOS REAIS
   PARA O MERCADO DE SEGUROS". Só o conectivo ("e acumulam experiência em") ficou
   de fora, e ele não carrega informação nenhuma.
   O ano NÃO virou cartão, e é decisão, não esquecimento: "2022" é data, não
   quantidade, e um cartão com o número grande "2022" e o rótulo "Desde" embaixo
   lê pior que a frase. Ele fica no `<h2>` da seção — "Desde 2022, já formamos" —,
   que é o lugar de maior destaque tipográfico da seção inteira, então o dado
   continua legível como indicador. */
const NUMEROS = [
  { valor: 'mais de 60', texto: 'especialistas com mentalidade inovadora, que aprendem na prática' },
  { valor: 'mais de 17', texto: 'projetos reais para o mercado de seguros' },
] as const;

/* SIS-116 · item 4 — AS FOTOS SÃO AS DO GERANDO TALENTOS, reaproveitadas. É o
   mesmo programa: a página de ESG o publica como "Projeto Gerando
   Talentos/Sistran University", e a observação da fonte é exatamente que as duas
   páginas contam a mesma iniciativa sem se referenciarem. Pedir asset próprio
   seria pedir foto nova das mesmas turmas.
   Os arquivos já são `.webp` convertidos na SIS-109 (41/67/56 KB nos 750×422
   nativos, originais guardados em `docs/fontes/esg/`, fora de `public/`), então
   esta rota não acrescenta um byte ao que o site já baixa — e não há conversão a
   fazer.
   O `alt` foi REESCRITO para esta página, e não copiado de `/esg`: lá a foto
   prova um projeto social, aqui ela mostra quem o programa de capacitação
   formou. O mesmo `alt` em duas rotas descreveria o contexto errado numa delas —
   é o ponto de atenção da issue. */
const TURMAS = [
  {
    src: '/images/esg/1-turma-Gerando-Talentos.webp',
    alt: 'Formandos da 1ª turma do Sistran University reunidos na formatura',
    legenda: '1ª turma',
  },
  {
    src: '/images/esg/2-turma-Gerando-Talentos.webp',
    alt: 'Formandos da 2ª turma do Sistran University reunidos na formatura',
    legenda: '2ª turma',
  },
  {
    src: '/images/esg/3-turma-Gerando-Talentos.webp',
    alt: 'Formandos da 3ª turma do Sistran University reunidos na formatura',
    legenda: '3ª turma',
  },
] as const;

export default function Page() {
  return (
    <PageShell>
      <PageHero
        title="Autossuficiência em"
        highlight="capacitação de recursos"
        description={
          <p>
            Somos um verdadeiro banco de talentos de primeira linha, prontos para atender às demandas
            específicas da sua seguradora com as mais avançadas tecnologias.
          </p>
        }
      />

      <section id="university-programa" aria-labelledby="university-programa-titulo" className="section-py">
        <div className="container-lp">
          <h2
            id="university-programa-titulo"
            className="font-display text-section text-white"
          >
            Formar especialistas em tecnologia de ponta
          </h2>
          {/* Frase sem verbo principal no original; mantida como escrita — ver o
              comentário no alto do arquivo. */}
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-white/85">
            O <strong className="font-bold text-white">Sistran University</strong>, programa de
            capacitação intensiva da Sistran, dedicado a formar especialistas em tecnologia de ponta
            e desenvolvimento de sistemas.
          </p>
        </div>
      </section>

      <section id="university-unidep" aria-labelledby="university-unidep-titulo" className="section-py">
        <div className="container-lp">
          <h2 id="university-unidep-titulo" className="font-display text-section text-white">
            Em parceria com o Unidep
          </h2>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-white/85">
            Em parceria com o Unidep (Centro Universitário de Pato Branco), treinamos nossos próprios
            talentos, alinhados com as últimas tendências e exigências do setor tecnológico. Com
            isso, contamos com um time de profissionais nativos digitais, altamente qualificados e
            com excelente custo-benefício para o mercado.
          </p>

          {/* Galeria estática, e não carrossel: as três fotos existem ao mesmo
              tempo no DOM, sempre. Nada depende de autoplay (logo nada se perde
              com `prefers-reduced-motion: reduce`) e não há controle de navegação
              a alcançar por teclado, porque não há o que navegar. Mesmo critério
              já adotado no bloco do Gerando Talentos em `/esg`.
              A ordem é cronológica, como no projeto. */}
          <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {TURMAS.map((t) => (
              <li key={t.src}>
                <figure className="glass-card overflow-hidden">
                  <Image
                    src={t.src}
                    alt={t.alt}
                    /* Medidas nativas do arquivo convertido, para o navegador
                       reservar a caixa antes do download — sem isso a legenda
                       abaixo salta quando a imagem chega. */
                    width={750}
                    height={422}
                    sizes="(max-width: 639px) 92vw, (max-width: 1023px) 46vw, 30vw"
                    className="h-auto w-full"
                  />
                  <figcaption className="px-5 py-4 text-sm font-semibold text-white/85">
                    {t.legenda}
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>

          {/* O elo que a própria fonte aponta como ausente: as duas páginas
              contam a mesma iniciativa e nenhuma cita a outra. É LINK, não
              escrita nova — o nome do destino é o nome que `/esg` já dá ao
              projeto. */}
          <Link
            href="/esg#esg-social"
            className="mt-8 inline-block text-sm font-bold text-[#A5F0FF] underline underline-offset-4"
          >
            Projeto Gerando Talentos, em ESG
          </Link>
        </div>
      </section>

      <section id="university-numeros" aria-labelledby="university-numeros-titulo" className="section-py">
        <div className="container-lp">
          <h2 id="university-numeros-titulo" className="font-display text-section text-white">
            Desde 2022, já formamos
          </h2>
          <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {NUMEROS.map((n) => (
              <li key={n.valor} className="glass-card-hover relative overflow-hidden p-7">
                <span aria-hidden className="corner-accent" />
                <p className="font-display text-3xl leading-none text-[#A5F0FF] md:text-4xl">
                  {n.valor}
                </p>
                <p className="mt-3 text-base leading-relaxed text-white/85">{n.texto}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <ContactCTA />
    </PageShell>
  );
}
