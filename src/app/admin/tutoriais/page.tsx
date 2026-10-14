import type { Metadata } from 'next';
import { ExplicacaoModal } from './ExplicacaoModal';

/**
 * TUTORIAIS — a aba de vídeos de explicação do admin, pedida em 14/10.
 *
 * O problema que ela resolve: o admin tem duas ferramentas (Eventos e Carimbos), e cada
 * uma tem decisões que a tela não explica sozinha — o que «seguir a categoria» faz no
 * carimbo, por que a ordem dos cartões é a ordem do site, o que acontece ao salvar
 * quando há token de Blob e quando não há. Vídeo gravado por quem usa é o caminho mais
 * curto para isso, e ele não envelhece em silêncio como um texto: quando a tela muda, o
 * vídeo visivelmente mostra outra tela.
 *
 * ⚠️ `preload="metadata"` E NÃO `auto`, e a razão é aritmética: os três arquivos somam
 * 34,3 MB (11,3 + 5,4 + 17,6). Com `preload="auto"` o navegador começaria a baixar OS
 * TRÊS ao abrir a aba, mesmo que ninguém clique em play — 34,3 MB para quem entrou só
 * para conferir se o vídeo existe. Com `metadata` ele busca os primeiros bytes (duração e
 * dimensões, o que faz a barra de progresso nascer certa) e espera o play. A conta piora
 * a cada vídeo novo, e é por isso que ela está escrita aqui: um quarto arquivo não muda
 * nada neste desenho, mas mudaria tudo com `auto`.
 *
 * ⚠️ SEM `autoPlay`, e é decisão de uso, não de performance: são vídeos de instrução com
 * narração, e tocar sozinho ao abrir a aba atropela quem chegou aqui para ver o outro.
 *
 * ⚠️ AS LEGENDAS JÁ EXISTEM, MAS EMBUTIDAS NA IMAGEM — conferido nos quadros extraídos
 * dos três arquivos: cada passo aparece escrito numa faixa na base do vídeo («Para
 * começar, clique em "+ Novo evento"…»). Isso é bom e resolve o essencial: quem não ouve
 * o áudio acompanha. Por isso NÃO há `<track>` aqui — não haveria o que ele acrescentasse
 * hoje. O que legenda queimada não dá, e fica registrado: não se desliga, não é lida por
 * leitor de tela, não é pesquisável e não se traduz. Se um dia isso pesar, o caminho é
 * transcrever para um `.vtt` ao lado de cada vídeo na loja e acrescentar
 * `<track kind="captions" srcLang="pt-BR" default />` em cada `<video>`.
 *
 * ⚠️ OS ARQUIVOS NÃO ESTÃO NO REPOSITÓRIO — moram no Vercel Blob, a mesma loja do
 * catálogo de eventos (`src/lib/eventosLoja.ts`). A decisão é de 14/10, e o motivo é o
 * peso: 34 MB de binário em `public/` entrariam no histórico do git PARA SEMPRE, e vídeo
 * é o caso em que isso mais dói, porque regravar não substitui — cada versão soma. Quem
 * sobe arquivo novo usa `scripts/subir-tutoriais-blob.mjs`, que explica o processo inteiro.
 *
 * ⚠️ AS URLs SÃO ABSOLUTAS E ESTÃO ESCRITAS AQUI, em vez de consultadas na loja a cada
 * requisição. É possível porque o script sobe com `addRandomSuffix: false`, o que torna o
 * endereço previsível. A alternativa — `list()` em tempo de execução — custaria uma
 * chamada de rede por visita para descobrir o endereço de um arquivo que não muda, e
 * tornaria esta página dependente do token para RENDERIZAR. Do jeito que está, o token só
 * é necessário para PUBLICAR: a página serve URLs `https://` comuns e funciona em qualquer
 * ambiente, inclusive na máquina de quem clonou o repositório sem token nenhum.
 *
 * ⚠️ OS VÍDEOS NÃO ESTÃO ATRÁS DA SENHA, e sair de `public/` não mudou isso: o Blob é
 * `access: 'public'`, e o porteiro (`src/proxy.ts`) tem matcher `/admin/:path*`, que não
 * alcança outro domínio. Quem souber a URL exata assiste sem passar pelo login. Está
 * aceito porque o conteúdo é instrução de uso de uma ferramenta interna, não segredo; se
 * um vídeo futuro mostrar a senha legível, ou dados que não podem sair, ele precisa passar
 * a ser servido por uma rota do admin que confira o cookie e devolva os bytes — nem
 * `public/` nem Blob público têm como ser protegidos.
 *
 * O primeiro vídeo FOI CONFERIDO quadro a quadro nesse ponto, porque ele filma a tela de
 * login: a senha aparece MASCARADA (bolinhas), como qualquer `type="password"`. O que o
 * vídeo revela é o endereço do admin e o COMPRIMENTO da senha — aceito, e registrado para
 * quem gravar o próximo saber o que conferir antes de publicar.
 */
export const metadata: Metadata = {
  /* Mesma trava do resto do admin: sobrescreve o `index: true` do layout raiz. */
  robots: { index: false, follow: false, nocache: true },
  title: 'Admin · tutoriais',
};

/**
 * A pasta dos tutoriais na loja. Constante em UM lugar, e os itens abaixo guardam só o
 * nome do arquivo: a base aparece seis vezes se cada item trouxer a URL inteira, e seis
 * cópias de um endereço é onde nasce o quinto item apontando para a loja de outro projeto.
 *
 * ⚠️ NÃO VEM DE VARIÁVEL DE AMBIENTE de propósito. Seria tentador (`NEXT_PUBLIC_...`),
 * mas isto não é segredo — é um endereço público que já vai no HTML — e variável de
 * ambiente faltando quebraria a página em silêncio, com `src="undefined/..."`. Escrito no
 * código, o endereço é revisável no diff e não depende de configuração de host.
 */
const LOJA = 'https://7mxwtwirkgcpnolx.public.blob.vercel-storage.com/admin/tutoriais';

/**
 * Os vídeos, na ordem de quem está chegando agora: cadastrar um evento, editar um que já
 * existe, e criar carimbo. Lista e não três blocos escritos à mão porque um quarto vídeo é
 * questão de tempo, e um `.map` evita que o próximo nasça com medida ou espaçamento
 * diferente dos anteriores.
 */
const VIDEOS = [
  {
    arquivo: 'tutorial-eventos-sistran-explicado.mp4',
    /* ⚠️ TÍTULO E RESUMO CONFERIDOS CONTRA O VÍDEO, quadro por quadro (ffmpeg, aos 8s,
       30s, 60s, 95s, 130s e 155s) — e não deduzidos do nome do arquivo, que foi a
       primeira versão desta lista e estava ERRADA: o arquivo se chama
       `tutorial-eventos-...-explicado`, mas a cartela de abertura do próprio vídeo diz
       «Como cadastrar um evento», que é outro assunto. Quem trocar um vídeo aqui tem de
       abrir o arquivo: nome de arquivo não é fonte. */
    capa: 'capa-cadastrar-evento.jpg',
    titulo: 'Como cadastrar um evento',
    resumo:
      'Do começo: entrar no painel, clicar em «+ Novo evento», preencher o identificador, o texto e a classificação, escolher a imagem, criar e esperar a publicação — e conferir o evento já no site. Fecha com um aviso sobre excluir.',
    duracao: '2:40',
    peso: '11,3 MB',
    /**
     * ⚠️ OS PASSOS SÃO TRANSCRIÇÃO DAS LEGENDAS DO PRÓPRIO VÍDEO, não um roteiro escrito
     * por fora: as faixas de legenda foram extraídas com ffmpeg (`fps=1/8` + `crop` da
     * base + `tile`) e lidas uma a uma. É o que garante que o texto e o vídeo não digam
     * coisas diferentes — e é o que tem de ser refeito se o vídeo for regravado.
     */
    passos: [
      'Acesse o endereço do admin e abra a tela de entrada.',
      'Digite a senha de acesso e clique em «Entrar».',
      'Na lista de Eventos, o botão «+ Novo evento» fica no canto superior direito.',
      'Clique em «+ Novo evento» para abrir o formulário.',
      'Crie um identificador curto, em minúsculas e sem acentos. Ele fará parte do endereço do evento.',
      'Preencha o título e uma descrição clara. Confira o resultado na prévia.',
      'Escolha a categoria e confira o carimbo. Se disponíveis, selecione também a arte e a miniatura.',
      'Adicione a imagem principal e confira o enquadramento na prévia.',
      'Ative as opções complementares (destaque editorial, gravação no YouTube) somente quando se aplicarem ao evento.',
      'Revise os dados e clique em «Criar evento». Aguarde o salvamento.',
      'Salvo o cadastro, volte à lista para conferir o cartão do evento.',
      'Abra o evento recém-criado e confira se o título, a descrição e a imagem aparecem corretamente.',
    ],
    atencao:
      'Antes de excluir, leia a confirmação com atenção: a exclusão remove o evento do catálogo.',
  },
  {
    arquivo: 'tutorial-editar-evento-sistran.mp4',
    capa: 'capa-editar-evento.jpg',
    titulo: 'Como editar um evento que já existe',
    resumo:
      'Abrir um evento da lista, ajustar o título com a prévia ao lado acompanhando a mudança, salvar, e conferir título, descrição e imagem atualizados em /eventos-inovacao.',
    duracao: '0:51',
    peso: '5,4 MB',
    passos: [
      'Na lista de Eventos, clique no cartão do evento que quer mudar.',
      'A imagem atual é exibida junto da prévia, à direita.',
      'No campo «Título», ajuste o nome do evento — a prévia acompanha a alteração.',
      'Clique em «Salvar texto».',
      'Abra «Eventos & Inovação» no site e aguarde o carregamento.',
      'Confira o título, a descrição e a imagem do evento atualizados.',
      'Confirme que a alteração aparece corretamente na página pública.',
    ],
  },
  {
    arquivo: 'tutorial-carimbos-eventos-sistran.mp4',
    capa: 'capa-carimbos.jpg',
    /* Título conferido na cartela do próprio vídeo, pela mesma razão do primeiro item:
       «Como ajustar os carimbos dos eventos». A primeira versão desta linha dizia «Como
       criar e aplicar um carimbo» — era fiel ao conteúdo, mas divergia do que a pessoa lê
       dois segundos depois de dar play, e dois nomes para a mesma coisa é o começo de
       alguém procurar um quarto vídeo que não existe. */
    titulo: 'Como ajustar os carimbos dos eventos',
    resumo:
      'A aba Carimbo: criar um carimbo do zero (nome, linha de cima, marca, selo pequeno, cor e acabamento), julgar o resultado na prévia trocando o fundo entre xadrez, claro e escuro, e depois usar Editar ou Excluir na lista dos carimbos já criados.',
    duracao: '2:42',
    peso: '17,6 MB',
    passos: [
      'No painel administrativo, clique em «Carimbo» no menu superior para abrir a área de gestão.',
      'A tela tem três abas: «Lugares do site», «Carimbos de evento» e «Criar carimbo». Cada uma controla uma etapa diferente.',
      'Em «Carimbos de evento», escolha um selo para cada categoria. Ele vale para todos os eventos daquela categoria.',
      'Para montar um modelo novo, abra «Criar carimbo». A prévia mostra o resultado enquanto você configura.',
      'Dê um nome para localizar o carimbo depois e preencha os campos de texto que vão compor a arte.',
      'Escolha a cor e o acabamento na paleta. Acompanhe a prévia para conferir contraste e estilo.',
      'Ajuste tamanho, inclinação e densidade do PNG até chegar ao visual desejado.',
      'Revise o texto e o desenho na prévia — o fundo xadrez, claro ou escuro ajuda a avaliar o resultado.',
      'Clique em «Salvar carimbo». O modelo passa a aparecer na lista para reutilização.',
      'Na aba «Lugares do site», confira os modelos criados e em quantos pontos cada um está sendo usado.',
      'Na lista de lugares, use o campo «Carimbo» para escolher um modelo ou voltar à arte original.',
    ],
    atencao:
      'Use «Editar» para ajustar um modelo existente. Use «Excluir» somente depois de conferir qual carimbo está selecionado.',
  },
] as const;

export default function AdminTutoriaisPage() {
  return (
    <>
      <h1 className="text-3xl font-medium tracking-tight text-[#0f172a]">Tutoriais</h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#667085]">
        Vídeos de explicação de como cada parte do admin funciona. {VIDEOS.length} no
        momento: dois sobre Eventos e um sobre Carimbos.
      </p>

      {/* Uma coluna, e não duas lado a lado: vídeo de instrução quer largura — em
          `sm:grid-cols-2` cada quadro ficaria com ~520 px no `max-w-6xl` do admin, e
          texto de interface gravado em tela cheia fica ilegível reduzido a meia largura. */}
      <ul className="mt-8 flex flex-col gap-8">
        {VIDEOS.map((video) => (
          <li
            key={video.arquivo}
            className="overflow-hidden rounded-2xl border border-black/[0.07] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04)]"
          >
            {/* O fundo escuro é do QUADRO e não do vídeo: enquanto o arquivo não carrega,
                e nas faixas laterais se a proporção gravada não for exatamente 16:9, o que
                aparece é esta cor — preto fica mais perto do que o player desenha do que o
                cinza do admin, que piscaria claro→escuro ao dar play. */}
            <div className="bg-[#0f172a]">
              <video
                /* `controls` é o que torna o vídeo utilizável: sem ele não há play, barra
                   de progresso, volume nem tela cheia — e tela cheia é o que salva a
                   leitura do texto pequeno gravado na tela. */
                controls
                /* ⚠️ A CAPA É NECESSÁRIA POR CAUSA DO `preload="metadata"`, e não é
                   enfeite: sem baixar o vídeo, o navegador não tem quadro para pintar e
                   mostra um RETÂNGULO PRETO — capturado nos dois vídeos cujo primeiro
                   quadro é escuro, que ficavam indistinguíveis de um player quebrado. Os
                   arquivos são quadros extraídos dos próprios vídeos com ffmpeg, num
                   instante em que a tela mostra o assunto (e não a cartela de abertura ou
                   um fundo vazio), e pesam 40–116 kB contra os 5–18 MB do vídeo. */
                poster={`${LOJA}/${video.capa}`}
                preload="metadata"
                /* `w-full` + `aspect-video` reserva o espaço antes de o arquivo responder,
                   para a página não dar um salto de layout quando os metadados chegam. */
                className="aspect-video h-auto w-full"
              >
                <source src={`${LOJA}/${video.arquivo}`} type="video/mp4" />
                {/* O texto só aparece em navegador sem suporte a `<video>`, e mesmo assim
                    o link resolve: baixar e abrir no player do sistema. */}
                <a href={`${LOJA}/${video.arquivo}`}>Baixar o vídeo {video.titulo}</a>
              </video>
            </div>

            <div className="px-5 py-4">
              <h2 className="text-[17px] font-medium leading-snug text-[#0f172a]">
                {video.titulo}
              </h2>
              <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-[#475467]">
                {video.resumo}
              </p>
              {/* O botão da explicação escrita vem ANTES da linha técnica, e a ordem é
                  deliberada: ele é uma ação (e a segunda mais provável de quem chega
                  aqui, depois do play), enquanto duração/peso/baixar é informação de
                  rodapé. Enterrá-lo embaixo de «mp4 · 17,6 MB» o faria parecer parte da
                  ficha do arquivo. */}
              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-3">
                <ExplicacaoModal
                  explicacao={{
                    titulo: video.titulo,
                    duracao: video.duracao,
                    passos: video.passos,
                    atencao: 'atencao' in video ? video.atencao : undefined,
                  }}
                />
                {/* O peso do arquivo fica à vista porque quem abre isto num 4G decide
                    diferente de quem está no escritório. */}
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#98a2b3]">
                  {video.duracao} · mp4 · {video.peso} ·{' '}
                  <a href={`${LOJA}/${video.arquivo}`} download className="text-[#0079cb]">
                    baixar
                  </a>
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* ⚠️ O RECADO QUE MANDAVA PARA `docs/ADMIN.md` SAIU DAQUI — 14/10, a pedido, e a
          razão do pedido é correta: quem usa o admin não abre o repositório, então
          apontar para um arquivo `.md` era empurrar o leitor para um lugar onde ele não
          vai. A explicação escrita passou a morar no próprio cartão, no botão «passo a
          passo escrito» (ver `ExplicacaoModal.tsx`).

          O DOCUMENTO CONTINUA EXISTINDO e continua sendo o texto mais completo — ele
          cobre o que nenhum vídeo cobre (a senha, as duas fontes do catálogo, o mapa dos
          arquivos). O que mudou é quem ele atende: manutenção, não operação. Por isso o
          apontamento foi retirado da tela e não o arquivo do repositório.
      <p className="mt-10 max-w-2xl rounded-xl border border-black/[0.07] bg-white px-4 py-3 text-sm leading-relaxed text-[#475467]">
        A versão escrita de tudo isto — incluindo o que os vídeos não cobrem, como a senha,
        os carimbos e o que acontece ao salvar — está em{' '}
        <code className="font-mono text-[#0f172a]">docs/ADMIN.md</code>, no repositório.
      </p> */}
    </>
  );
}
