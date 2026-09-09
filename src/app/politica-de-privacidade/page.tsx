import PageShell from '@/components/PageShell';
import PageHero from '@/components/PageHero';

export const metadata = {
  title: 'Política de cookies · Sistran',
};

/* Escrita verbatim de /politica-de-privacidade/, COM UMA EXCEÇÃO, registrada
   abaixo. O titulo da pagina no site é "Política de cookies" (o link do rodape
   diz "Privacidade") e o conteudo é somente a politica de cookies — nao ha
   politica de privacidade/LGPD escrita em lugar nenhum do site, entao nada foi
   acrescentado aqui.
   Fonte: .claude/conteudo-site/11-legal.md (A) */

/* SIS-123 — O QUE MUDOU E O QUE NÃO MUDOU NESTA PÁGINA.
   Mudou uma coisa só: a seção "Google Analytics" saiu, porque declarava uma
   coleta que não acontece. Está comentada mais abaixo, com o motivo no lugar.
   Isso quebra o "verbatim" do comentário acima, e é por isso que ele agora abre
   com "COM UMA EXCEÇÃO" — sem essa ressalva, a próxima pessoa trataria o arquivo
   como espelho fiel da fonte e reporia o trecho.

   O QUE O SITE REALMENTE ARMAZENA, conferido por varredura em `src/`:
   • nenhum cookie. Não existe `document.cookie` em lugar nenhum do projeto, nem
     script de medição (`gtag`, `googletagmanager`, `analytics`) — daí a remoção;
   • um único item de `localStorage`, escrito em `src/app/layout.tsx`: a
     preferência de movimento da primeira visita. Não é cookie, não sai do
     navegador e não identifica ninguém.
   Quer dizer que o texto que sobra ainda descreve mais do que o site faz (fala de
   cookies necessários e de estatística, e não há cookie nenhum). CORRIGIR ISSO É
   ESCREVER TEXTO LEGAL, e texto legal não é meu: fica parado na issue, junto com
   a política de privacidade/LGPD que a rota promete pelo nome e não tem (base
   legal, direitos do titular, prazo de retenção, canal do encarregado).

   O RÓTULO DO RODAPÉ ("Privacidade") E O `<h1>` ("Política de cookies")
   CONTINUAM DIVERGINDO, e é decisão consciente não escolher agora: o rótulo está
   certo para onde a rota VAI (é aqui que a política de privacidade deve morar,
   e a URL já diz isso), e o `<h1>` está certo para o que a rota TEM. Alinhar
   pelo lado errado — renomear a URL para cookies, com redirect — seria desfazer
   trabalho no dia em que o texto de privacidade chegar. Quem decide qual dos
   dois lados vale é quem escreve o texto. */
export default function Page() {
  return (
    <PageShell>
      <PageHero title="Política de" highlight="cookies" />

      <section className="section-py">
        <div className="container-lp">
          <div className="glass-card max-w-3xl space-y-10 p-8 md:p-12">
            <p className="text-base leading-relaxed text-white/85">
              A Sistran utiliza cookies para aprimorar o desempenho e sua experiência ao utilizar
              nosso site. Buscamos explicar de maneira transparente como, quando e por que
              utilizamos cookies. Ao acessar nosso site, você autoriza o uso de cookies nos termos
              desta Política. Se não concordar com o uso de cookies dessa forma, você pode ajustar as
              configurações do seu navegador para não permitir o uso de cookies ou optar por não
              acessar nosso site. Lembre-se de que desabilitar o uso de cookies pode impactar sua
              experiência ao navegar em nosso site.
            </p>

            <article className="space-y-3">
              <h2 className="font-display text-2xl text-white">O que são cookies?</h2>
              <p className="text-base leading-relaxed text-white/85">
                Cookies são arquivos digitais contendo pequenos fragmentos de dados (geralmente com
                um identificador único) armazenados em seu dispositivo através do navegador ou
                aplicativo, guardando informações relacionadas às suas preferências.
              </p>
            </article>

            <article className="space-y-3">
              <h2 className="font-display text-2xl text-white">
                Para que servem os cookies?
              </h2>
              <p className="text-base leading-relaxed text-white/85">
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

            <article className="space-y-3">
              <h2 className="font-display text-2xl text-white">
                Que tipo de cookies utilizamos?
              </h2>
              <p className="text-base leading-relaxed text-white/85">
                <strong className="font-bold text-white">Cookies necessários:</strong> estes cookies
                são necessários para que o website funcione corretamente. Para este tipo de cookies o
                seu consentimento não é necessário já que são considerados tecnicamente necessários
                para fazer a conexão ao nosso website ou para fornecer o serviço de internet.
              </p>
              <p className="text-base leading-relaxed text-white/85">
                {/* "anónima" no original (pt-PT) corrigido para "anônima". */}
                <strong className="font-bold text-white">Cookies de estatísticas:</strong> também
                conhecidos como &ldquo;cookies de desempenho&rdquo;, estes cookies recolhem e
                analisam informação estatística anônima sobre a utilização do website.
              </p>
            </article>

            {/* SIS-123 — A SEÇÃO "GOOGLE ANALYTICS" SAIU DA TELA, e o texto fica
                aqui inteiro para o dia em que a medição entrar.
                Ela declarava, em documento legal, a coleta do endereço IP, do
                dispositivo/navegador e das atividades do visitante. Nada disso
                acontece: não há `gtag`, `googletagmanager` nem qualquer script de
                medição em `src/` — conferido por varredura, e não por leitura de
                um arquivo só. Declarar coleta que não existe é informação
                incorreta onde ela pesa mais, e é a saída que a própria issue
                autoriza ("se não há medição, a seção de Google Analytics sai").
                COMENTADA, e não apagada, de propósito: no dia em que o Analytics
                entrar, o texto tem de voltar JUNTO com o script — e com o banner
                de consentimento, porque cookie de estatística não é o cookie
                tecnicamente necessário que dispensa consentimento. Descomentar
                sem o banner recria o problema do outro lado.

                <article className="space-y-3">
                  <h2 className="font-display text-2xl text-white">Google Analytics</h2>
                  <p className="text-base leading-relaxed text-white/85">
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
            */}

            <article className="space-y-3">
              <h2 className="font-display text-2xl text-white">
                Como desabilitar cookies?
              </h2>
              <p className="text-base leading-relaxed text-white/85">
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
