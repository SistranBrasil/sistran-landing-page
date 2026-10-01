import PageShell from '@/components/PageShell';
import AtmosferaQuadrados from '@/components/ui/AtmosferaQuadrados';
/* SIS-123 — O `PageHero` SAI DESTA ROTA, e o import sai com ele.
   A issue pede a página «só com o texto do paste: sem PageHero, sem imagem, sem
   vídeo, sem abertura decorativa». O hero desta rota não era ilustração
   acessória: era manchete em `text-pagehero` sobre dois borrões ciano de 480px e
   400px com `blur(130px)`, e é justamente a «abertura decorativa» que a issue
   nomeia. Sem import, esta rota também deixa de carregar o `motion/react` e o
   `useProgressoDeSecao` que vinham por ele.

   ⚠️ E O `<h1>` VINHA DE LÁ. `PageShell` não emite título nenhum (só
   `Header`/`<main>`/`Footer`), então remover o hero sem repor o `<h1>` deixaria a
   página sem nível 1 e os `<h2>` do texto pendurados em nada — o oposto do
   «estrutura de headings» que o critério de aceite cobra. O título passou a ser
   escrito aqui, abaixo, no primeiro bloco da página.
   import PageHero from '@/components/PageHero'; */

export const metadata = {
  title: 'Política de cookies · Sistran',
};

/* Escrita verbatim de /politica-de-privacidade/.
   O titulo da pagina no site é "Política de cookies" (o link do rodape diz
   "Privacidade") e o conteudo é somente a politica de cookies — nao ha politica
   de privacidade/LGPD escrita em lugar nenhum do site, entao nada foi
   acrescentado aqui.
   Fonte: .claude/conteudo-site/11-legal.md (A)

   SIS-123 — «COM UMA EXCEÇÃO» SAIU DESTA ABERTURA, e é a notícia do arquivo: a
   exceção era a seção "Google Analytics", que estava comentada, e ela VOLTOU à
   tela. O arquivo é espelho fiel da fonte de novo, com as seis seções numeradas
   dela na ordem em que ela as lista. As duas únicas divergências que restam são
   de grafia, e cada uma está anotada no ponto onde acontece. */

/* SIS-123 — O QUE ESTA VOLTA FEZ, E O QUE ELA DELIBERADAMENTE NÃO FEZ.

   TRÊS MUDANÇAS, todas pedidas pela issue:
   • "Google Analytics" restaurada, com o texto da fonte, na posição 5 — entre
     "Que tipo de cookies utilizamos?" e "Como Desabilitar Cookies?";
   • heading "Introdução" acrescentado. O primeiro bloco era um parágrafo solto,
     sem título: na fonte ele é a seção «1. Introdução», e sem o heading a página
     abria com texto corrido que nenhum sumário de leitor de tela alcançava;
   • o `PageHero` e o `glass-card` saíram. Restou tipografia — o texto é o
     conteúdo inteiro da rota, e era o que a issue pedia.

   ── POR QUE O TEXTO VOLTA ANTES DO SCRIPT, E POR QUE ISSO ESTÁ CERTO ──────────
   A varredura que motivou a remoção CONTINUA VALENDO, e é preciso dizer isso aqui
   para ninguém ler a restauração como notícia de que a medição entrou:
   • nenhum cookie. Não existe `document.cookie` no projeto, nem `gtag`,
     `googletagmanager` ou qualquer script de medição;
   • um único item de `localStorage`, escrito em `src/app/layout.tsx`: a
     preferência de movimento da primeira visita. Não é cookie, não sai do
     navegador e não identifica ninguém.
   Ou seja: a página agora declara mais do que o site faz — Analytics, cookies
   necessários e cookies de estatística, e não há cookie nenhum. A DECISÃO É DA
   ISSUE, por escrito: «o paste declara Google Analytics; o site ainda pode não ter
   o script. Publicar o texto pedido é escopo desta volta; alinhar script ↔
   política fica para quando a medição entrar (junto com SIS-226).» Publicar o
   texto oficial é decisão de quem responde pelo documento; apagar seção de
   documento legal por conta própria é que não era.

   QUANDO O ANALYTICS ENTRAR, ele entra com o banner de consentimento (SIS-226) —
   cookie de estatística NÃO é o cookie tecnicamente necessário que dispensa
   consentimento, e é o próprio texto abaixo que diz isso. Script sem banner é o
   mesmo problema pelo outro lado.

   O RÓTULO DO RODAPÉ ("Privacidade") E O `<h1>` ("Política de cookies")
   CONTINUAM DIVERGINDO, e segue sendo decisão consciente não escolher agora: o
   rótulo está certo para onde a rota VAI (é aqui que a política de privacidade
   deve morar, e a URL já diz isso), e o `<h1>` está certo para o que a rota TEM.
   Alinhar pelo lado errado — renomear a URL para cookies, com redirect — seria
   desfazer trabalho no dia em que o texto de privacidade chegar. Quem decide qual
   dos dois lados vale é quem escreve o texto.

   ── SIS-123, VOLTA 2 · SÓ LAYOUT. NENHUMA PALAVRA MUDOU ───────────────────────
   A volta 1 entregou o texto e deixou a página no navy do `body` com tinta clara,
   bloco encostado à esquerda e tipografia de 16px. O pedido novo é paridade visual
   com `/solucoes`. Quatro mudanças, todas de apresentação:
   • `classeDoMain="cookies-canvas"` + `AtmosferaQuadrados` → plano claro contínuo
     ancorado na janela, receita e VALORES de `.solucoes-canvas` /
     `.transparencia-canvas`, em bloco próprio no fim do `globals.css` (o motivo do
     bloco próprio está escrito lá);
   • `section-light` na seção — pelas regras de TINTA, não pelo fundo;
   • bloco de leitura `mx-auto`, teto de 768px mantido;
   • tipografia: `h2` 24px → 30px com peso e risco ciano (`.cookies-secao-titulo`),
     `p` 16px → 18px, e as tintas trocadas de `text-white`/`text-white/85` por
     `text-ink`/`text-ink-muted`.

   ⚠️ As tintas tinham de ser TROCADAS, e não deixadas por conta da cascata.
   `.section-light [class*="text-white"]` pinta navy, então `text-white/85` até
   RENDERIZARIA certo aqui — e é exatamente por isso que ficar era pior: o arquivo
   diria «branco» onde a tela mostra navy, e a rede de segurança de `.section-light`
   existe para salvar rota mal migrada, não para virar o jeito normal de escrever.
   Quem lesse depois não saberia qual das duas é a intenção. */
export default function Page() {
  return (
    <PageShell classeDoMain="cookies-canvas">
      {/* A terceira camada do plano claro: quadrados arredondados, linhas longas e
          o arco azul, que gradiente não desenha. Primeiro nó do `<main>` porque é
          fundo — e `position: fixed` com `z-index: -1`, então a posição na árvore
          não muda o que se vê; o que ela faz é deixar a leitura do arquivo na
          mesma ordem das camadas. A classe vem por prop, e o bloco de CSS desta
          rota é próprio: ver o docblock do componente. */}
      <AtmosferaQuadrados classe="cookies-atmosfera" />

      {/* UMA `<section>` só, como antes. Não é detalhe de organização: o
          `globals.css` pinta `main > section:nth-of-type(even)`, então dividir o
          texto em seções irmãs faria a página ganhar faixa alternada no meio da
          política. Os blocos do texto são `<article>`, que não entra nessa
          contagem.

          `section-light` NÃO está aqui pelo fundo — o fundo é do `<main>`, e o
          bloco `.cookies-canvas .section-light` zera o que esta classe pintaria.
          Ela está aqui pelas REGRAS DE TINTA: é `.section-light` que reescreve
          títulos, parágrafos e `strong` para o navy da casa. Sem ela, texto claro
          sobre plano claro. */}
      <section className="section-light section-py">
        <div className="container-lp">
          {/* `mx-auto` é o «bem no meio» do pedido; o teto de 768px é de LEITURA e
              fica. Os parágrafos seguem alinhados à esquerda DENTRO do bloco —
              centrar texto corrido de documento legal move a margem de início de
              cada linha e é o oposto de legível. */}
          <div className="mx-auto max-w-3xl space-y-12">
            {/* O `<h1>` que o `PageHero` fornecia, agora escrito na página. O
                texto é o título da fonte — antes ele chegava partido em duas
                props (`title="Política de"` + `highlight="cookies"`) só para o
                hero pintar a segunda palavra de ciano; sem o hero é uma frase.
                `text-ink` e não `text-white`: o plano da rota é claro agora. O
                `.text-gradient-brand` ficou de fora de propósito — os seis `h2`
                ganharam risco ciano, e gradiente no `h1` mais risco em tudo
                embaixo faria a página inteira competir por atenção. Quem destaca o
                nível 1 aqui é o TAMANHO (`text-pagehero`), que é o dobro dos
                `h2`. */}
            <h1 className="font-display text-pagehero font-bold tracking-tight text-balance text-ink">
              Política de cookies
            </h1>

            <article className="space-y-4">
              <h2 className="cookies-secao-titulo font-display text-3xl font-bold tracking-tight text-ink">Introdução</h2>
              <p className="text-lg leading-relaxed text-ink-muted">
                A Sistran utiliza cookies para aprimorar o desempenho e sua experiência ao utilizar
                nosso site. Buscamos explicar de maneira transparente como, quando e por que
                utilizamos cookies. Ao acessar nosso site, você autoriza o uso de cookies nos termos
                desta Política. Se não concordar com o uso de cookies dessa forma, você pode ajustar
                as configurações do seu navegador para não permitir o uso de cookies ou optar por não
                acessar nosso site. Lembre-se de que desabilitar o uso de cookies pode impactar sua
                experiência ao navegar em nosso site.
              </p>
            </article>

            <article className="space-y-4">
              <h2 className="cookies-secao-titulo font-display text-3xl font-bold tracking-tight text-ink">O que são cookies?</h2>
              <p className="text-lg leading-relaxed text-ink-muted">
                Cookies são arquivos digitais contendo pequenos fragmentos de dados (geralmente com
                um identificador único) armazenados em seu dispositivo através do navegador ou
                aplicativo, guardando informações relacionadas às suas preferências.
              </p>
            </article>

            <article className="space-y-4">
              <h2 className="cookies-secao-titulo font-display text-3xl font-bold tracking-tight text-ink">
                Para que servem os cookies?
              </h2>
              <p className="text-lg leading-relaxed text-ink-muted">
                Os cookies servem para aprimorar a sua experiência, tanto em termos de performance
                como em termos de usabilidade, uma vez que os conteúdos disponibilizados serão
                direcionados às suas necessidades e expectativas. Os cookies permitem que nosso site
                memorize informações sobre a sua visita, o seu idioma preferido, a sua localização, a
                recorrência das suas sessões e outras variáveis que nós consideramos relevantes para
                tornar sua experiência muito mais eficiente. Os cookies também poderão ser
                utilizados para compilar estatísticas anônimas e agregadas que permitem entender como
                os usuários utilizam e interagem com nosso site, bem como para aprimorar suas
                estruturas e conteúdo. Por serem estatísticas anônimas, não podemos identificá-lo
                pessoalmente por meio desses dados. A utilização de cookies é algo comum em qualquer
                site atualmente. O seu uso não prejudica de forma alguma os dispositivos
                (computadores, smartphones, tablets, etc.) em que são armazenados.
              </p>
            </article>

            <article className="space-y-4">
              <h2 className="cookies-secao-titulo font-display text-3xl font-bold tracking-tight text-ink">
                Que tipo de cookies utilizamos?
              </h2>
              <p className="text-lg leading-relaxed text-ink-muted">
                <strong className="font-bold text-ink">Cookies necessários:</strong> estes cookies
                são necessários para que o website funcione corretamente. Para este tipo de cookies o
                seu consentimento não é necessário já que são considerados tecnicamente necessários
                para fazer a conexão ao nosso website ou para fornecer o serviço de internet.
              </p>
              <p className="text-lg leading-relaxed text-ink-muted">
                {/* "anónima" no original (pt-PT) corrigido para "anônima". */}
                <strong className="font-bold text-ink">Cookies de estatísticas:</strong> também
                conhecidos como &ldquo;cookies de desempenho&rdquo;, estes cookies recolhem e
                analisam informação estatística anônima sobre a utilização do website.
              </p>
            </article>

            {/* SIS-123 — RESTAURADA. Estava comentada nesta posição desde a volta
                anterior, com o argumento de que declarava coleta inexistente. O
                argumento de fato continua verdadeiro (ver o bloco no topo do
                arquivo); o que mudou é de quem é a decisão: a issue determinou
                publicar o texto da fonte nesta volta e tratar o alinhamento
                script ↔ política junto com o banner de consentimento (SIS-226).
                Texto sem uma palavra alterada em relação a
                `.claude/conteudo-site/11-legal.md` (A, §5) — inclusive
                "utilizadores" e "nos mesmos", que são pt-PT do original. */}
            <article className="space-y-4">
              <h2 className="cookies-secao-titulo font-display text-3xl font-bold tracking-tight text-ink">Google Analytics</h2>
              <p className="text-lg leading-relaxed text-ink-muted">
                Nós utilizamos o serviço de análise web da Google Analytics da Google, para otimizar
                os nossos websites e os serviços fornecidos através deles. O serviço da Google
                Analytics utiliza cookies com a finalidade de avaliar a utilização dos nossos
                websites, de compilar relatórios sobre a interação dos utilizadores nos mesmos, assim
                como nos fornecer serviços da internet adicionais. Em particular, o serviço recolhe
                cookies primários, que contêm dados sobre o dispositivo ou navegador que utiliza, o
                seu endereço do Protocolo da Internet (IP) e as atividades que realiza nos nossos
                websites.
              </p>
            </article>

            <article className="space-y-4">
              {/* Caixa alta do original, restaurada: a fonte escreve «6. Como
                  Desabilitar Cookies?», e o arquivo vinha com "desabilitar
                  cookies" em minúsculas sem que nada registrasse a mudança. É
                  inconsistência do documento de origem (as outras cinco seções
                  são em caixa de sentença), mas normalizar grafia de documento
                  legal em silêncio é o que este arquivo não faz. */}
              <h2 className="cookies-secao-titulo font-display text-3xl font-bold tracking-tight text-ink">
                Como Desabilitar Cookies?
              </h2>
              <p className="text-lg leading-relaxed text-ink-muted">
                Você pode seguir as instruções fornecidas em seu navegador ou aparelho de celular
                (geralmente localizadas em &ldquo;Preferências&rdquo; ou
                &ldquo;Configurações&rdquo;) para alterar suas configurações de cookies. Você pode
                utilizar a página de navegação anônima, uma configuração opcional de navegação que
                permite que você desative o rastreamento por sites não visitados, incluindo serviços
                de análise estatística, redes de publicidade e plataformas sociais.
              </p>
            </article>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
