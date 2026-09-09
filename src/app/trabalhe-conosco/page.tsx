import { Linkedin } from 'lucide-react';
import PageShell from '@/components/PageShell';
import PageHero from '@/components/PageHero';
import Social from '@/components/Social';
import HeroVideoBackdrop from '@/components/ui/HeroVideoBackdrop';
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
*/

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
          <PageHero
            eyebrow="Carreira"
            title="Venha fazer parte do nosso time!"
            highlight="#SomosSistraners"
            description={<p>Venha fazer parte de uma empresa que apoia seu desenvolvimento.</p>}
          />

          {/* SIS-100 — `id` para o item "Currículo" do navegador lateral. A seção já
              tinha nome acessível; o que faltava era âncora. O `id` fica onde está —
              agora dentro da abertura —, então qualquer link de fora para
              `#curriculo` continua chegando ao mesmo conteúdo.
              O que mudou é o ITEM do navegador lateral: com o cartão na abertura,
              "Currículo" e "Início" apontariam para praticamente o mesmo ponto da
              página, e dois itens que rolam para o mesmo lugar é pior que um só.
              O item saiu de `pageSections.ts` (comentado lá, com este motivo); o
              `id` e o `scroll-mt-32` ficam, porque âncora e item de menu são coisas
              diferentes. */}
          <section
            id="curriculo"
            aria-labelledby="curriculo-titulo"
            className="carreira-cartao scroll-mt-32"
          >
            <div className="glass-card p-7 md:p-8">
            {/* SIS-137 — a pílula `#sistran` saiu daqui, e o `mt-5` do título com
                ela: dentro da abertura ela ficaria a poucos centímetros da
                `eyebrow` "Carreira", dois rótulos da mesma família disputando o
                mesmo bloco. Ver o porquê inteiro no comentário acima do `Page`.
                | <span className="tag-section">#sistran</span> */}
            <h2 id="curriculo-titulo" className="font-display text-2xl text-white md:text-3xl">
              Como chegar até nós
            </h2>
            {/* Nenhuma vaga é afirmada e nenhuma é negada para sempre: o que se
                diz é o que se sabe — esta página não publica lista de vagas. */}
            <p className="mt-5 text-base leading-relaxed text-white/85">
              Não publicamos uma lista de vagas nesta página, e ainda não temos um canal próprio
              para receber currículos por aqui. Preferimos dizer isso a manter um formulário que
              não leva o seu currículo a ninguém.
            </p>
            <p className="mt-4 text-base leading-relaxed text-white/85">
              As oportunidades da Sistran são anunciadas no nosso LinkedIn, e é por lá que a
              conversa começa hoje — inclusive as candidaturas.
            </p>
            <div className="mt-8">
              <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="btn-primary">
                <Linkedin className="h-4 w-4" strokeWidth={1.8} aria-hidden />
                Ver oportunidades no LinkedIn
              </a>
            </div>
            {/* Aviso no ponto onde a coleta ACONTECERIA. Enquanto não há coleta,
                ele diz exatamente isso — é a informação que o candidato precisa
                para não deixar dado pessoal num canal sem destino. */}
            <p className="mt-6 text-xs leading-relaxed text-ink-faint">
              Não coletamos currículo, nome, telefone nem e-mail nesta página. Nada é enviado,
              armazenado ou compartilhado a partir daqui.
            </p>
            </div>
          </section>
        </div>
      </HeroVideoBackdrop>

      {/* SIS-107 — sem nenhuma das duas classes de emenda.
          A premissa original desta nota caiu com a SIS-137 e fica registrada em vez
          de reescrita por cima: ela dizia "acima há o bloco navy chapado do
          formulário". Não há mais formulário (SIS-117) e não há mais navy chapado —
          o que antecede a Social agora é a abertura com vídeo. A CONCLUSÃO continua
          valendo, e por um motivo mais forte que antes: o degradê da Social abre em
          `#0b4e86`, e o pé do véu do `hero-backdrop` já é navy escuro, então a
          emenda é uma diferença pequena entre dois azuis; e o respiro cheio
          (`py-24 md:py-32`) segue certo porque nenhuma convergência consome o topo
          da seção. */}
      <Social />
    </PageShell>
  );
}
