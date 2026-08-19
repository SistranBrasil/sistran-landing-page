import PageShell from '@/components/PageShell';
import PageHero from '@/components/PageHero';

export const metadata = {
  title: 'Política de cookies · Sistran',
};

/* Escrita verbatim de /politica-de-privacidade/. O titulo da pagina no site é
   "Política de cookies" (o link do rodape diz "Privacidade") e o conteudo é
   somente a politica de cookies — nao ha politica de privacidade/LGPD escrita
   em lugar nenhum do site, entao nada foi acrescentado aqui.
   Fonte: .claude/conteudo-site/11-legal.md (A) */
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
              <h2 className="font-display text-2xl font-bold text-white">O que são cookies?</h2>
              <p className="text-base leading-relaxed text-white/85">
                Cookies são arquivos digitais contendo pequenos fragmentos de dados (geralmente com
                um identificador único) armazenados em seu dispositivo através do navegador ou
                aplicativo, guardando informações relacionadas às suas preferências.
              </p>
            </article>

            <article className="space-y-3">
              <h2 className="font-display text-2xl font-bold text-white">
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
              <h2 className="font-display text-2xl font-bold text-white">
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

            <article className="space-y-3">
              <h2 className="font-display text-2xl font-bold text-white">Google Analytics</h2>
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

            <article className="space-y-3">
              <h2 className="font-display text-2xl font-bold text-white">
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
