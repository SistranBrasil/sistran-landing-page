import type { CSSProperties } from 'react';
import { ChartNoAxesCombined, Linkedin, Sparkles, UsersRound } from 'lucide-react';
import PageShell from '@/components/PageShell';
import PageHero from '@/components/PageHero';
import Social from '@/components/Social';
import CurriculoCard from '@/components/CurriculoCard';
import HeroVideoBackdrop from '@/components/ui/HeroVideoBackdrop';
import RevealScope from '@/components/motion/RevealScope';
import { LINKEDIN_URL } from '@/data/contact';

export const metadata = {
  title: 'Trabalhe conosco · Sistran',
};

/* SIS-117 — o formulário de currículo SAIU DE CENA, e isto é o oposto de um
   atalho: é a única saída que não mente para o candidato.

   O que foi auditado, e não deduzido. `DemoForm` submetia por
   `action={enviarFormulario}`, e `src/app/actions/contato.ts:70-87` é a action
   inteira: ela confere que algum campo veio preenchido e devolve
   `{ status: 'sucesso', mensagem: 'Mensagem recebida.' }`. Não há e-mail, não há
   storage, não há ATS, não há persistência de espécie alguma — o próprio
   cabeçalho do arquivo (linhas 15-23) registra que isso é deliberado enquanto não
   houver revisão de LGPD. Ou seja: o candidato anexava currículo, via "Mensagem
   recebida" e não havia se candidatado a nada.

   Por que remover em vez de consertar a mensagem:
   1. O arquivo ia para o servidor de todo jeito. Currículo é dado pessoal em
      volume (nome, telefone, e-mail, histórico, às vezes CPF e foto) e sem
      destino definido não há base legal para trafegá-lo. Um formulário honesto
      que ainda assim transmite o PDF para o nada é menos enganoso e igualmente
      irregular.
   2. Enquanto o campo existir, alguém preenche. Aviso de privacidade e texto de
      confirmação corrigem a percepção, não o tratamento.

   O que fica NO LUGAR: a verdade sobre vagas e o canal que realmente funciona.
   O LinkedIn não é substituto inventado — é onde a Sistran publica de fato, é o
   mesmo `LINKEDIN_URL` que a seção de fecho desta página já usa, e o verso do
   cartão de lá já promete "tendências, vagas e o dia a dia".

   FICA ABERTO para quem responde por RH/carreira (registrado na issue, não
   decidido aqui): para onde vai o currículo (caixa de RH, storage, ATS), quem
   recebe, qual a base legal e o prazo de guarda, e se a página passa a ter lista
   de vagas ou portal. Respondido isso, o formulário volta descomentando o bloco
   abaixo — `DemoForm` continua no repositório e já ganhou nesta issue o `accept`,
   o limite de tamanho e a validação antes do envio que faltavam ao campo de
   arquivo.

   | import DemoForm, { type DemoField } from '@/components/forms/DemoForm';
   |
   | // Mesmos campos do formulario de /trabalhe-conosco/ (aqui Telefone é
   | // obrigatorio, ao contrario do formulario de Contato).
   | //
   | // SIS-117 deixa uma pergunta pendente sobre estes campos: telefone
   | // obrigatório aqui e opcional em /contato. Nada no site justifica a
   | // diferença, e exigir telefone reduz candidatura. Quando o formulário
   | // voltar, `required` do telefone deve cair salvo decisão contrária de RH.
   | const FIELDS: readonly DemoField[] = [
   |   { kind: 'name-pair', id: 'nome', label: 'Nome Completo', required: true },
   |   { kind: 'input', id: 'email', label: 'E-mail', type: 'email', autoComplete: 'email', required: true },
   |   { kind: 'input', id: 'telefone', label: 'Telefone', type: 'tel', autoComplete: 'tel', required: true },
   |   {
   |     kind: 'file',
   |     id: 'curriculo',
   |     label: 'Envio de arquivo',
   |     hint: 'Clique ou arraste um arquivo para esta área para fazer upload.',
   |     required: true,
   |   },
   | ];
   |
   | <section id="curriculo" aria-label="Envie seu currículo" className="section-py scroll-mt-32">
   |   <div className="container-lp max-w-2xl">
   |     <DemoForm fields={FIELDS} />
   |   </div>
   | </section>

   SIS-223 — LEIA ISTO ANTES DE USAR O BLOCO ACIMA. O formulário voltou, mas não
   descomentando este bloco: ele está em `@/components/CurriculoCard`, montado mais
   abaixo. O bloco fica como registro do que a SIS-117 removeu, e as diferenças são
   deliberadas — «Nome Completo» é UM campo e não o `name-pair`, e-mail e telefone
   dividem a linha, e o campo de arquivo é uma área que aceita arrastar. Cada uma
   está justificada em `CurriculoCard.tsx`.
   O que a SIS-223 NÃO resolveu é o que está em "FICA ABERTO" acima: destino do
   currículo, quem recebe, base legal, prazo de guarda. Continua sendo decisão de
   RH. Enquanto não vier, a página diz que o envio é demonstração — é essa a
   condição para o campo de arquivo poder existir. */

/* Escrita de /trabalhe-conosco/: sobretitulo "Carreira", o titulo em duas
   linhas e a frase de apoio. O site fecha esta pagina com o CTA comercial
   ("Quer conversar com um de nossos especialistas?") e publica o texto de
   carreira na pagina de Contato — aqui a pagina fecha com o bloco de LinkedIn,
   que é o que ela realmente tem escrito, sem CTA de publico errado.
   O site tambem nao lista vaga alguma nem link para portal de vagas; nada foi
   inventado para preencher.
   Fonte: .claude/conteudo-site/08-trabalhe-conosco.md */
/* SIS-137 — a abertura passou a ser UM bloco: vídeo de fundo, a escrita à
   esquerda e o cartão do `#curriculo` ao lado dela.

   O pedido original desta issue põe o FORMULÁRIO ao lado da escrita, e o
   formulário não existe mais — a SIS-117 o tirou de cena porque `enviarFormulario`
   não tem destino (o motivo inteiro está no comentário no topo deste arquivo).
   Então o que sobe para o lado da escrita é o que ficou no lugar dele: o cartão
   que diz a verdade sobre vagas e leva ao LinkedIn. É o arranjo pedido — abertura
   em duas colunas, com o caminho de candidatura ao lado da manchete — aplicado ao
   conteúdo que a página realmente tem. Os pontos da issue que só faziam sentido
   com campos de formulário (contraste de borda de campo, foco de teclado sobre
   vídeo, os três rótulos de "Nome Completo", segurar o vídeo enquanto um campo tem
   foco) ficam para quando o formulário voltar; estão registrados na issue como não
   atendíveis hoje, e não marcados como feitos.

   O VÍDEO não é o arquivo entregue. `trabalheconosco.mp4` tinha 7,68 MB, trilha
   AAC de 377 quadros que nunca toca (`muted` é obrigatório para o autoplay) e a
   marca d'água "Veo" no canto inferior direito. A derivada segue o mesmo
   tratamento da SIS-105 em `/eventos-inovacao`: recorte de 1824×1026 a partir do
   canto superior esquerdo (16:9 exato, sem distorção) de volta para 1920×1080,
   `-an`, CRF 30 e `+faststart`. Resultado: 1,90 MB, na mesma ordem dos outros
   laços (1,2 / 2,5 / 3,2 MB), com pôster do primeiro quadro DO LAÇO em WebP de
   43 KB. O arquivo original fica no repositório como fonte.

   `foco="50% 55%"`: o assunto do take é a mesa de vidro com o cubo no centro,
   ligeiramente abaixo da metade do quadro. Centrar em 50% cortaria a mesa nas
   faixas mais baixas; descer mais que isso decapitaria as pessoas em volta.

   A TAG "Carreira" continua sendo a `eyebrow` do `PageHero`, e isso é decisão
   registrada, não omissão: `eyebrow` e `tag-section` são recursos diferentes — a
   primeira nomeia a PÁGINA na abertura, a segunda abre uma SEÇÃO interna. As
   catorze aberturas do site usam `eyebrow`; trocar só esta por `tag-section` é que
   quebraria a uniformidade que a issue pede. A pílula `#sistran` do cartão saiu por
   consequência: dentro da abertura ela ficaria a centímetros da `eyebrow`, dois
   rótulos de mesma família disputando o mesmo bloco. */
export default function Page() {
  return (
    <PageShell>
      <HeroVideoBackdrop
        src="/videos/trabalhe-conosco-hero-loop.mp4"
        poster="/videos/trabalhe-conosco-hero-loop-poster.webp"
        className="hero-backdrop--carreira"
        foco="50% 55%"
      >
        <div className="carreira-abertura">
          <div className="carreira-conteudo">
            <PageHero
              eyebrow="Carreira"
              title="Venha fazer parte do nosso time!"
              highlight="#SomosSistraners"
              description={<p>Venha fazer parte de uma empresa que apoia seu desenvolvimento.</p>}
            />
            {/* ── SIS-270 · O REVEAL DESTA ROTA ────────────────────────────────
                A issue pede o sistema de `docs/scroll.md` («em toda a página»).
                O que ela recebe é UM escopo, e o motivo é medido, não preferência:
                dos quatro blocos da rota, TRÊS já têm entrada própria, e o §6 do
                guia proíbe somar reveal por CSS a quem já é timeline («não misture
                os dois no mesmo elemento»).

                • `PageHero` (`#topo`) entra por variants de montagem em
                  `motion/react` — e o `<h1>` dele é candidato a LCP. Marcá-lo
                  somaria um segundo dono ao mesmo `transform` (a colisão do
                  SIS-42) e atrasaria a maior pintura.
                • `CurriculoCard` (`.cv-secao`) tem a cortina GSAP por `clip-path`
                  descrita no docblock dele, com `ScrollTrigger` em `top 82%`.
                • `Social` (`#social`) entra por `whileInView`, que já é reveal por
                  rolagem — ele começa em 792px numa janela de 900, logo é o único
                  bloco desta rota que a pessoa alcança ROLANDO.

                Sobram estes dois — a fileira de benefícios e o slogan —, e é neles
                que o sistema entra. Marcam-se BLOCOS: a fileira e o parágrafo,
                nunca palavras.

                ── O calibre, que é o ponto onde esta issue podia repetir a SIS-269
                Nenhum número é passado, e isso é a resposta e não uma omissão. O
                calibre quebrado da 2ª volta de `/contato` era o OVERRIDE
                (`margem: +12%` com `limiar: 0.08`, antecipando o disparo e
                afrouxando a fração exigida em todo bloco alto). O padrão da casa
                — `margem: '0px 0px -12% 0px'`, `limiar: 0.2` — é justamente a
                direção que a SIS-269 prescreve: negativo, dispara depois de
                entrar. Então o certo aqui é NÃO declarar nada, e não escolher um
                terceiro calibre que a SIS-269 teria de reescrever depois.

                `esperarRota` fica, e só porque este bloco está NA PRIMEIRA DOBRA
                (topo medido em 577px numa janela de 900). Sem ele o observador
                acende atrás da cortina do `RouteLoadGate`, a transição termina no
                escuro e quando a cortina levanta o bloco já está parado — a
                entrada existe e ninguém vê. É exatamente o único uso que a
                SIS-269 preserva («manter `esperarRota` só no bloco da primeira
                dobra»). Não há nesta rota um bloco abaixo da dobra esperando a
                rota, que é o que fazia `/contato` acender tudo de uma vez.

                `data-reveal-nome` não é usado por CSS nenhum: é o rótulo que o
                portão (`scripts/medir-reveal-carreira-sis270.mjs`) lê para montar
                a linha do tempo `data-in` × `scrollY`. */}
            <RevealScope esperarRota data-reveal-nome="abertura">
              <ul className="carreira-beneficios" aria-label="Benefícios de trabalhar na Sistran">
                {/* `--reveal-i` é o índice da cascata; a cadência é o token
                    `--motion-stagger-reveal` (80ms), dentro da faixa de 70–120ms
                    do §4.3. Quatro passos = 320ms, longe do 1s que o guia aponta
                    como o ponto em que quem rola rápido vê a página se montando
                    atrasada. */}
                <li data-reveal="fade-up" style={{ '--reveal-i': 0 } as CSSProperties}>
                  <UsersRound aria-hidden />
                  <span>Pessoas que evoluem juntas</span>
                </li>
                <li data-reveal="fade-up" style={{ '--reveal-i': 1 } as CSSProperties}>
                  <ChartNoAxesCombined aria-hidden />
                  <span>Desafios que geram impacto</span>
                </li>
                <li data-reveal="fade-up" style={{ '--reveal-i': 2 } as CSSProperties}>
                  <Sparkles aria-hidden />
                  <span>Um futuro com mais possibilidades</span>
                </li>
              </ul>
              {/* O slogan é `fade-up` no parágrafo, e o fio ciano de 1px dentro
                  dele é `line-up` — que DESENHA da esquerda em vez de subir,
                  porque numa régua de 1px de altura um deslocamento vertical é
                  maior que o próprio traço e lê como salto (é o que a regra
                  `[data-reveal='line-up']` do `globals.css` registra). Os dois
                  compartilham o mesmo `data-in`, então entram no mesmo gesto. */}
              <p
                className="carreira-slogan"
                data-reveal="fade-up"
                style={{ '--reveal-i': 3 } as CSSProperties}
              >
                <span aria-hidden data-reveal="line-up" />
                TECNOLOGIA QUE MOVE O AMANHÃ
              </p>
            </RevealScope>
          </div>

          {/* SIS-100 — `id` para o item "Currículo" do navegador lateral. A seção já
              tinha nome acessível; o que faltava era âncora. O `id` fica onde está —
              agora dentro da abertura —, então qualquer link de fora para
              `#curriculo` continua chegando ao mesmo conteúdo.
              O que mudou é o ITEM do navegador lateral: com o cartão na abertura,
              "Currículo" e "Início" apontariam para praticamente o mesmo ponto da
              página, e dois itens que rolam para o mesmo lugar é pior que um só.
              O item saiu de `pageSections.ts` (comentado lá, com este motivo); o
              `id` e o `scroll-mt-32` ficam, porque âncora e item de menu são coisas
              diferentes.
              | <section
              |   id="curriculo"
              |   aria-labelledby="curriculo-titulo"

              SIS-223 — o `id="curriculo"` SAIU DAQUI e foi para a seção do
              formulário (`CurriculoCard`, mais abaixo). Não é preferência de nome:
              o formulário voltou, `#curriculo` só pode existir uma vez no
              documento, e o destino honesto da âncora "Currículo" é o lugar onde se
              envia o currículo — não o cartão que explica o caminho alternativo.
              Este cartão fica com `#como-chegar`, que é o próprio título dele. */}
          <section
            id="como-chegar"
            aria-labelledby="como-chegar-titulo"
            className="hidden"
          >
            <div className="glass-card p-7 md:p-8">
            {/* SIS-137 — a pílula `#sistran` saiu daqui, e o `mt-5` do título com
                ela: dentro da abertura ela ficaria a poucos centímetros da
                `eyebrow` "Carreira", dois rótulos da mesma família disputando o
                mesmo bloco. Ver o porquê inteiro no comentário acima do `Page`.
                | <span className="tag-section">#sistran</span> */}
            {/* AS TINTAS DESTE CARTÃO VIRARAM ESCURAS, e não é escolha estética
                separada: o fundo dele passou a ser azul claro opaco
                (`.carreira-cartao .glass-card`, `globals.css`). Texto branco sobre
                `#e6f2fd` daria 1,1:1 — o cartão ficaria em branco. Os dois lados da
                troca precisam andar juntos, então este comentário fica dos dois
                lados. As cores são as mesmas do «Fale com a Gente!» sobre vidro
                claro: `#06275f` no título, `#3a5a7c` no corpo. */}
            <h2 id="como-chegar-titulo" className="font-display text-2xl text-[#06275f] md:text-3xl">
              Como chegar até nós
            </h2>
            {/* Nenhuma vaga é afirmada e nenhuma é negada para sempre: o que se
                diz é o que se sabe — esta página não publica lista de vagas.

                SIS-223 — as duas frases FORAM REESCRITAS, e não por estilo. Elas
                diziam "ainda não temos um canal próprio para receber currículos por
                aqui" e "preferimos dizer isso a manter um formulário que não leva o
                seu currículo a ninguém". Com o formulário de volta logo abaixo, a
                primeira virou informação errada e a segunda contradiz o que a
                própria página passou a fazer. O texto antigo fica registrado:
                | Não publicamos uma lista de vagas nesta página, e ainda não temos
                | um canal próprio para receber currículos por aqui. Preferimos
                | dizer isso a manter um formulário que não leva o seu currículo a
                | ninguém.
                O que NÃO mudou é a honestidade: continua dito que o caminho que
                chega a alguém hoje é o LinkedIn, porque o formulário abaixo ainda
                não tem destino (ver `src/app/actions/contato.ts`). */}
            <p className="mt-5 text-base leading-relaxed text-[#3a5a7c]">
              Não publicamos uma lista de vagas nesta página. O formulário abaixo já recebe seus
              dados e o seu arquivo, mas ainda é uma demonstração: enquanto não houver um destino
              definido, ele não entrega o seu currículo a ninguém.
            </p>
            <p className="mt-4 text-base leading-relaxed text-[#3a5a7c]">
              As oportunidades da Sistran são anunciadas no nosso LinkedIn, e é por lá que a
              conversa começa hoje — inclusive as candidaturas.
            </p>
            <div className="mt-8">
              <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="btn-primary">
                <Linkedin className="h-4 w-4" strokeWidth={1.8} aria-hidden />
                Ver oportunidades no LinkedIn
              </a>
            </div>
            {/* SIS-223 — o aviso de privacidade DESTE cartão foi refeito porque a
                afirmação dele deixou de ser verdadeira: o formulário abaixo coleta
                nome, e-mail, telefone e arquivo. A frase antiga fica registrada:
                | Não coletamos currículo, nome, telefone nem e-mail nesta página.
                | Nada é enviado, armazenado ou compartilhado a partir daqui.
                O aviso PRÓPRIO da coleta não vive mais aqui: ele fica no pé do
                formulário, no ponto onde a coleta acontece (`privacyNote` em
                `CurriculoCard.tsx`). Aqui sobra só o que este cartão precisa dizer —
                que o caminho ao lado não passa por formulário nenhum. */}
            {/* A LETRA MIÚDA USA A MESMA TINTA DO CORPO, e não um cinza-azul mais
                claro. `#4c6c8e` foi a primeira escolha — hierarquia por cor, como
                era com `text-ink-faint` sobre o vidro escuro — e ela MEDIU 4,04:1
                sobre `#e6f2fd` a 1440. Texto de 12px é "texto normal" pela régua do
                WCAG, então o piso é 4,5:1: passaria a ser o único texto reprovado do
                cartão, e justamente o aviso de privacidade. A hierarquia continua
                existindo pelo tamanho (12px contra 16px), que é o que ela já fazia. */}
            <p className="mt-6 text-xs leading-relaxed text-[#3a5a7c]">
              Este cartão não coleta dado algum: o link acima leva ao LinkedIn e nada é enviado a
              partir dele.
            </p>
            </div>
          </section>
          <CurriculoCard />
        </div>
      </HeroVideoBackdrop>

      {/* SIS-223 — o formulário de currículo volta a existir, aqui, FORA da
          abertura: ele é a segunda parada da página, entra na rolagem com o gesto
          descrito em `CurriculoCard.tsx` e leva consigo o `id="curriculo"`. O
          bloqueio de produto da SIS-117 (destino, base legal, prazo de guarda)
          continua aberto — o que esta issue faz é devolver o formulário DIZENDO
          isso, no cartão de sucesso e no pé do próprio formulário. */}
      {/* SIS-107 — sem nenhuma das duas classes de emenda.
          A premissa original desta nota caiu com a SIS-137 e fica registrada em vez
          de reescrita por cima: ela dizia "acima há o bloco navy chapado do
          formulário". Não há mais formulário (SIS-117) e não há mais navy chapado —
          o que antecede a Social agora é a abertura com vídeo. A CONCLUSÃO continua
          valendo, e por um motivo mais forte que antes: o degradê da Social abre em
          `#0b4e86`, e o pé do véu do `hero-backdrop` já é navy escuro, então a
          emenda é uma diferença pequena entre dois azuis; e o respiro cheio
          (`py-24 md:py-32`) segue certo porque nenhuma convergência consome o topo
          da seção.
          SIS-223 — quem antecede a Social passou a ser a seção do currículo, e não
          mais a abertura com vídeo. A conclusão não muda: `.cv-secao` não pinta
          fundo próprio (só um halo com `filter: blur`), então o que encosta na
          Social continua sendo o fundo da página, e continua sendo um azul perto do
          `#0b4e86` em que o degradê da Social abre. */}
      {/* SIS-270 — esta seção fica como está, e isso é medido, não omissão. Ela já
          entra por `whileInView` de `motion/react`, e com o `VP` da casa o `<h2>`
          está em `opacity: 0` no topo da rota, passando de 0,9 só em `scrollY: 400`
          — ou seja, o fecho JÁ é entrada por rolagem. Houve aqui um
          `<Social entradaPorScroll />` com calibre próprio (`amount: 0.35`), escrito
          sob a leitura errada do `.palco-copy` (`vHeader` é variant de orquestração,
          `hidden: {}`, e devolve opacidade `1` sempre); medido no `<h2>` certo, o
          calibre novo dava o MESMO 400. Foi removido: segundo calibre que reproduz o
          primeiro é só superfície a manter. Ver o comentário em `src/lib/motion.ts`,
          onde o `VP_SCROLL` viveu. */}
      <Social />
    </PageShell>
  );
}
