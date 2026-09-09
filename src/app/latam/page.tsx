import Link from 'next/link';
import { ArrowUpRight, Mail, Phone } from 'lucide-react';
import PageShell from '@/components/PageShell';
import PageHero from '@/components/PageHero';
import { getIcon } from '@/lib/icons';
import { LINKEDIN_URL, YOUTUBE_URL } from '@/data/contact';
import {
  LATAM_CAPACIDADES,
  LATAM_NOTICIAS,
  LATAM_NUMEROS,
  LATAM_OFICINAS,
  LATAM_RRHH_EMAIL,
  LATAM_SOLUCIONES,
  telHref,
} from '@/data/latam';

export const metadata = {
  title: 'Sistran Latam · Sistran',
  description:
    'Soluciones de software para compañías de seguros. Más de 100 aseguradoras en LATAM confían en SISTRAN.',
};

/* Navegação regional do site LATAM (Compañía · Soluciones · Alianzas · Noticias
   · Contacto). Aqui ela vira uma âncora para as seções DESTA página, e não um
   segundo header: a página vive dentro do site brasileiro, que já tem o seu, e
   dois menus competindo na mesma tela é ruído. */
/* SIS-121 · item 1 — "ALIANZAS" VIROU "ASEGURADORAS", que é o que a seção é.
   O rótulo antigo prometia marcas de parceria e entregava um título com um
   parágrafo sobre as mais de 100 aseguradoras que confiam na SISTRAN. Duas
   saídas: dar conteúdo à seção ou dizer a verdade sobre ela — e a primeira não
   está disponível sem informação nova, pelo motivo abaixo.
   `src/data/clients.ts` NÃO serve aqui, e isso foi conferido antes de descartar:
   a lista de lá tem quinze parceiros de TECNOLOGIA (AWS, SAP, Pega, Sensedia...)
   com logo, e as seguradoras estão todas comentadas por falta de arquivo. É a
   lista brasileira — parceiros do Brasil, seguradoras do Brasil. Apresentá-la
   como o conjunto regional de aseguradoras seria informação errada em material
   comercial: nem os parceiros de tecnologia são "aseguradoras", nem as
   seguradoras brasileiras são as 100 da região.
   O rótulo aqui passa a ser o mesmo que a parada já tinha em
   `src/data/pageSections.ts` ("Aseguradoras") — antes as duas navegações da mesma
   página chamavam a mesma seção por nomes diferentes.
   A lista regional de marcas é informação que só quem responde pelo conteúdo
   tem; registrado como ponto parado na issue. */
const ANCLAS = [
  /* SIS-121 — "Compañía" virou "Experiencia", pelo mesmo motivo do item 1 acima:
     as duas navegações desta página chamavam a MESMA seção por nomes diferentes
     (`pageSections.ts` já dizia "Experiencia"), e quem troca de largura — a nav
     de âncoras é `xl:hidden`, o indicador lateral assume de 1280px — via o menu
     inteiro se renomear. O destino (`#latam-experiencia`) não muda. */
  { label: 'Experiencia', href: '#latam-experiencia' },
  { label: 'Soluciones', href: '#latam-soluciones' },
  { label: 'Aseguradoras', href: '#latam-aseguradoras' },
  { label: 'Noticias', href: '#latam-noticias' },
  { label: 'Contacto', href: '#latam-contacto' },
] as const;

/* Página da operação regional, em espanhol, fiel a https://www.sistran.com/latam/
   (SIS-82). O `lang="es"` no bloco todo não é detalhe: sem ele o leitor de tela
   segue lendo com a pronúncia de português e "compañías", "aseguradoras" e os
   nomes dos escritórios saem incompreensíveis. */
export default function Page() {
  return (
    <PageShell>
      <div lang="es">
        <PageHero
          eyebrow="SISTRAN LATAM"
          title="Soluciones de software para"
          highlight="compañías de seguros"
          description={
            <p>
              Poseemos oficinas internacionales en puntos estratégicos de América, desde donde
              operamos comercialmente para todos los países de la región.
            </p>
          }
        />

        {/* NÚMEROS */}
        <section aria-labelledby="latam-numeros" className="section-py">
          <div className="container-lp">
            {/* A nav de âncoras mora DENTRO desta seção, e não solta entre ela e a
                entrada: fora, ela caía sobre o azul do body e a faixa de 36px
                entre duas superfícies escuras lia como emenda malfeita. Antes
                disso ela também sumia atrás do hero — `.pagehero-entrada` é uma
                seção posicionada, e posicionado pinta acima de estático seja qual
                for a ordem no DOM. */}
            {/* SIS-100 — mesma regra de `/solucoes`: de 1280px para cima quem
                navega é o navegador lateral de seções, com os mesmos destinos (em
                espanhol, como esta rota inteira); abaixo disso esta lista fica,
                porque a coluna lateral não existe nessas larguras. Uma navegação
                por largura, nunca duas ao mesmo tempo. */}
            {/* SIS-121 · item 5 — conferido: o corte é o MESMO nos dois lados.
                Esta lista é `xl:hidden` (Tailwind `xl` = 1280px) e o
                `ui/ScrollSpy` só monta com `matchMedia('(min-width: 1280px)')`.
                Não há largura em que as duas apareçam nem largura em que nenhuma
                apareça. Quem mexer num dos dois números tem de mexer no outro. */}
            <nav aria-label="Secciones de esta página" className="mb-10 xl:hidden">
              <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-white/70">
                {ANCLAS.map((a) => (
                  <li key={a.href}>
                    <a href={a.href} className="transition-colors hover:text-[#A5F0FF]">
                      {a.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <h2 id="latam-numeros" className="sr-only">
              SISTRAN en números
            </h2>
            <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {LATAM_NUMEROS.map((n) => (
                <div key={n.label} className="glass-card-hover p-7">
                  <dt className="sr-only">{n.label}</dt>
                  <dd>
                    <span className="block font-display text-5xl leading-none text-white">
                      {n.value}
                    </span>
                    <span
                      aria-hidden
                      className="mt-3 block text-xs font-bold uppercase leading-snug tracking-wide text-[#A5F0FF]"
                    >
                      {n.label}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* SOLUCIONES */}
        <section
          id="latam-soluciones"
          aria-labelledby="latam-soluciones-titulo"
          className="section-py section-light section-light-blue"
        >
          <div className="container-lp">
            <span className="tag-section">Soluciones</span>
            <h2
              id="latam-soluciones-titulo"
              className="mt-4 font-display text-section text-ink"
            >
              Nuestras soluciones
            </h2>
            <ul className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
              {LATAM_SOLUCIONES.map((s) => {
                const Icono = getIcon(s.icon);
                return (
                  <li key={s.id} className="glass-card flex h-full flex-col p-7">
                    <span
                      aria-hidden
                      className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#1273BC]/30 bg-[#1273BC]/10"
                    >
                      <Icono className="h-5 w-5 text-[#1273BC]" strokeWidth={1.8} />
                    </span>
                    <h3 className="mt-5 flex-1 font-display text-xl leading-tight text-ink">
                      {s.name}
                    </h3>
                    {/* "Más info" leva ao contato regional, não a uma página de
                        produto: o site LATAM não publica nenhuma. */}
                    {/* SIS-121 · item 3 — OS TRÊS LINKS DEIXAM DE SER O MESMO
                        LINK. Eram três "Más info" com o mesmo destino
                        (`#latam-contacto`) e o mesmo nome acessível: numa lista de
                        links de leitor de tela apareciam como três entradas
                        idênticas, sem como saber de qual produto era cada uma.
                        O nome do produto entra por `sr-only` dentro da própria
                        âncora, e não por `aria-label`: assim o nome acessível é
                        "Más info sobre Plataforma Omnicanal Configurable" SEM
                        divergir do texto visível — `aria-label` substituiria o
                        texto, e nome acessível que não contém o rótulo visto na
                        tela quebra o comando por voz ("clicar em Más info").
                        Não foram removidos: o destino existe e é o certo (é ali
                        que está o contato de cada país); o defeito era só o nome
                        repetido. */}
                    <a
                      href="#latam-contacto"
                      className="group mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-[#1273BC]"
                    >
                      Más info<span className="sr-only"> sobre {s.name}</span>
                      <ArrowUpRight
                        aria-hidden
                        className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        strokeWidth={2.4}
                      />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* EXPERIENCIA */}
        <section id="latam-experiencia" aria-labelledby="latam-experiencia-titulo" className="section-py">
          <div className="container-lp">
            <h2
              id="latam-experiencia-titulo"
              className="max-w-3xl font-display text-section text-white"
            >
              La experiencia <span className="text-gradient-brand">al servicio de su empresa</span>
            </h2>
            <p className="mt-5 max-w-3xl text-lg leading-relaxed text-white/85">
              Nuestro equipo está compuesto por experimentados analistas de negocio, gerentes de
              proyectos, arquitectos de soluciones, programadores y especialistas en aplicación,
              totalmente orientados al sector de seguros.
            </p>
            <ul className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
              {LATAM_CAPACIDADES.map((c) => {
                const Icono = getIcon(c.icon);
                return (
                  <li key={c.id} className="glass-card-hover flex items-center gap-4 p-6">
                    <span
                      aria-hidden
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/5"
                    >
                      <Icono className="h-5 w-5 text-[#A5F0FF]" strokeWidth={1.8} />
                    </span>
                    <span className="font-display text-base text-white">{c.name}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* ALIANZAS / ASEGURADORAS */}
        <section
          id="latam-aseguradoras"
          aria-labelledby="latam-aseguradoras-titulo"
          className="section-py section-light section-light-blue"
        >
          <div className="container-lp">
            <h2
              id="latam-aseguradoras-titulo"
              className="max-w-3xl font-display text-section text-ink"
            >
              Más de 100 aseguradoras en LATAM confían en SISTRAN
            </h2>
            <p className="mt-5 max-w-3xl text-lg leading-relaxed text-ink-muted">
              Gracias a nuestra sólida experiencia y permanencia en el mercado, hemos logrado
              establecer una sociedad estratégica con más de 100 aseguradoras locales, regionales y
              multinacionales, colaborando con el crecimiento permanente de cada una de ellas.
            </p>
          </div>
        </section>

        {/* NOTICIAS */}
        <section id="latam-noticias" aria-labelledby="latam-noticias-titulo" className="section-py">
          <div className="container-lp">
            <h2
              id="latam-noticias-titulo"
              className="font-display text-section text-white"
            >
              Noticias
            </h2>
            {/* SIS-121 · item 2 — OS CARTÕES DEIXAM DE PARECER CLICÁVEIS.
                Continuam sendo data + manchete, sem corpo e sem destino (o site
                regional leva cada uma a um post do blog dele, que não existe deste
                lado — está escrito em `LATAM_NOTICIAS`). O que mudou é a
                aparência: `glass-card-hover` acendia a borda ao passar o mouse,
                que é o mesmo sinal que os cartões de solução e de post do blog
                usam para dizer "aqui se clica". Com `glass-card` o cartão fica
                estático e lê como o que é: um aviso de que a notícia existe.
                Não foram removidos, e é decisão: as três manchetes são o conteúdo
                que a fonte publica, e apagá-las tiraria da página a única prova de
                atividade recente da operação regional.
                Quando as três URLs chegarem, `LatamNoticia` ganha `href`, o `<li>`
                volta a `glass-card-hover` e a manchete vira link — nada além
                disso. */}
            <ul className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
              {LATAM_NOTICIAS.map((n) => (
                <li key={n.title} className="glass-card relative overflow-hidden p-7">
                  <span aria-hidden className="corner-accent" />
                  <time
                    dateTime={n.dateTime}
                    className="text-xs font-bold uppercase tracking-wide text-[#A5F0FF]"
                  >
                    {n.date}
                  </time>
                  <h3 className="mt-3 font-display text-lg leading-tight text-white">
                    {n.title}
                  </h3>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* CONTACTO */}
        <section
          id="latam-contacto"
          aria-labelledby="latam-contacto-titulo"
          className="section-py section-light section-light-blue"
        >
          <div className="container-lp">
            <span className="tag-section">Contacto</span>
            <h2
              id="latam-contacto-titulo"
              className="mt-4 font-display text-section text-ink"
            >
              Oficinas en la región
            </h2>
            <p className="mt-5 max-w-3xl text-lg leading-relaxed text-ink-muted">
              Poseemos oficinas internacionales en puntos estratégicos de América, desde donde
              operamos comercialmente para todos los países de la región.
            </p>

            {/* SIS-121 · item 4 — O MAPA NÃO ENTRA AGORA, e o motivo fica escrito
                aqui porque a ausência é o que se vê.
                A decisão não é "mapa é pesado demais": é que o site não pode
                ganhar uma TERCEIRA implementação de mapa. `/contato` (SIS-84) e
                `/quem-somos` (SIS-96/97) já têm as suas, e a troca do provedor
                delas está numa issue que está SEGURADA (SIS-132, mosaico OSM →
                MapLibre). Escolher um provedor aqui hoje é escolher o que talvez
                seja abandonado lá — e aí seriam dois provedores diferentes no mesmo
                site, cada um baixando o seu runtime.
                Quando a SIS-132 fechar, o mapa desta seção usa o MESMO componente
                que sair dela, com os doze registros de `LATAM_OFICINAS` como
                marcadores — as coordenadas são o único dado que falta, e não estão
                na fonte regional.
                Enquanto isso a informação não está inacessível: cada escritório
                tem país, cidade, telefone discável e e-mail. O mapa acrescentaria
                orientação geográfica, não dado. */}
            {/* Cards e não tabela: são doze blocos de quatro campos, e uma tabela
                de quatro colunas no celular só rola de lado. Cada telefone é um
                `tel:` e cada e-mail um `mailto:` — a lista existe para ser usada. */}
            <ul className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {LATAM_OFICINAS.map((o) => (
                <li key={o.id} className="glass-card flex h-full flex-col p-6">
                  <h3 className="font-display text-sm uppercase leading-snug tracking-wide text-ink">
                    {o.unit}
                  </h3>
                  <p className="mt-1 text-sm font-semibold text-ink-muted">{o.location}</p>

                  {o.phones && (
                    <ul className="mt-4 space-y-1.5">
                      {o.phones.map((p) => (
                        <li key={p} className="flex items-center gap-2">
                          <Phone aria-hidden className="h-3.5 w-3.5 shrink-0 text-[#1273BC]" strokeWidth={2} />
                          <a
                            href={telHref(p)}
                            className="text-sm text-ink-muted transition-colors hover:text-[#1273BC]"
                          >
                            {p}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}

                  <p className="mt-4 flex items-start gap-2">
                    <Mail aria-hidden className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#1273BC]" strokeWidth={2} />
                    <a
                      href={`mailto:${o.email}`}
                      className="break-all text-sm font-semibold text-[#1273BC] underline underline-offset-4"
                    >
                      {o.email}
                    </a>
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* SIS-121 · item 6 — COMO A PÁGINA FECHA, decidido e registrado.
            Ela é a ÚNICA rota do site que não termina em `ContactCTA`, e é de
            propósito: o `ContactCTA` está escrito em português ("Fale com a
            Gente!"), e dentro deste `lang="es"` um leitor de tela leria essas
            palavras com fonética espanhola. Traduzi-lo criaria uma segunda versão
            do componente para manter em paralelo, e usar o componente fora do
            `lang="es"` deixaria um bloco em português colado no fim de uma página
            em espanhol — pior que a ausência.
            A conversão comercial não fica sem lugar: ela é a seção `#latam-contacto`
            logo acima, com o e-mail e o telefone de cada país — que é MAIS
            específico que o CTA genérico, porque quem lê já escolhe por onde falar.
            O fim é este cartão de RRHH porque é assim que a fonte fecha a página
            regional, e é convite (não rodapé de conteúdo).
            Escrever um CTA comercial em espanhol seria escrever texto novo, e isso
            é de quem responde pelo conteúdo — parado na issue. */}
        {/* RRHH — o convite que o site regional traz no rodapé. As redes sociais e
            a Política de Privacidade continuam no rodapé do site, uma seção
            abaixo, então aqui só entram LinkedIn e YouTube, que são os perfis que
            temos registrados em `src/data/contact.ts`. */}
        <section aria-labelledby="latam-rrhh" className="section-py">
          <div className="container-lp">
            <div className="glass-card-hover relative overflow-hidden p-8 md:p-12">
              <span aria-hidden className="corner-accent" />
              <h2 id="latam-rrhh" className="font-display text-section text-white">
                ¿Quieres formar parte de nuestro equipo?
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-white/85">
                Escríbenos a{' '}
                <a
                  href={`mailto:${LATAM_RRHH_EMAIL}`}
                  className="font-bold text-[#A5F0FF] underline underline-offset-4"
                >
                  {LATAM_RRHH_EMAIL}
                </a>
              </p>
              <p className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-semibold text-white/70">
                <span>Síguenos en las redes:</span>
                <a
                  href={LINKEDIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-[#A5F0FF]"
                >
                  LinkedIn
                </a>
                <a
                  href={YOUTUBE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-[#A5F0FF]"
                >
                  YouTube
                </a>
                <Link
                  href="/politica-de-privacidade"
                  className="transition-colors hover:text-[#A5F0FF]"
                >
                  Política de Privacidad
                </Link>
              </p>
            </div>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
