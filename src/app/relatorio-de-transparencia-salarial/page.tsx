import PageShell from '@/components/PageShell';
import PageHero from '@/components/PageHero';

export const metadata = {
  title: 'Relatório de Transparência Salarial · Sistran',
};

/* Escrita verbatim de /relatorio-de-transparencia-salarial/.
   No site a pagina traz apenas este disclaimer — o relatorio em si (PDF, tabela
   ou periodo de referencia) nao existe na pagina, e nada foi inventado para
   preencher. Duas correcoes de grafia estao comentadas abaixo.
   Fonte: .claude/conteudo-site/11-legal.md (B) */

/* SIS-123/124 — SEGUE VERBATIM, E É POR ISSO QUE ESTE ARQUIVO NÃO MUDOU.
   O que falta aqui é o RELATÓRIO: PDF, período de referência, ou tabela. Nada
   disso pode sair de código — o documento é gerado exclusivamente pelo MTE, por
   CNPJ, e redigir qualquer número, percentual ou resumo por conta própria
   produziria documento divergente do oficial. É pedido de arquivo, não de
   implementação; parado na issue.

   Duas decisões secundárias, para não voltarem como dúvida:
   • SEM `ContactCTA` no fim, de propósito, como em `/politica-de-privacidade`.
     As duas rotas legais fecham sem convite comercial: "Fale com a Gente!" logo
     abaixo de uma ressalva sobre isonomia salarial lê como se a publicação
     obrigatória fosse peça de marketing.
   • FORA de `src/data/pageSections.ts`, pelo critério que já está escrito no
     cabeçalho daquele arquivo (rota com menos de 3 seções não entra): aqui há uma
     seção só. Se o relatório entrar e a página passar a ter períodos em lista,
     o critério passa a ser satisfeito e a rota entra — junto com a estrutura, não
     antes dela. */
export default function Page() {
  return (
    <PageShell>
      <PageHero
        title="Relatório de Transparência e Igualdade Salarial de"
        highlight="Mulheres e Homens"
      />

      <section className="section-py">
        <div className="container-lp">
          <div className="glass-card max-w-3xl space-y-6 p-8 md:p-12">
            <h2 className="font-display text-xl uppercase tracking-wide text-white">
              Relatório de Transparência Salarial e de Critérios Remuneratórios
            </h2>
            <p className="text-base leading-relaxed text-white/85">
              O Relatório de Transparência Salarial foi elaborado pelo Ministério do Trabalho e
              Emprego (MTE), por CNPJ e com base nas informações fornecidas pela Sistran Informática
              Ltda. por meio do e-Social e da Declaração de Igualdade Salarial preenchida no{' '}
              {/* SIS-172 — SÓ O PORTAL VIRA LINK; a Lei e o Decreto FICAM EM TEXTO, e a
                  decisão é registrada aqui para não voltar como dúvida.
                  MOTIVO: o portal é o único dos três que resolve algo para quem lê. A
                  página declara cumprir a obrigação de publicação e NÃO publica o
                  documento (o relatório é gerado exclusivamente pelo MTE, por CNPJ —
                  ver o bloco SIS-123/124 acima), então o portal é a única saída que
                  existe daqui até o documento. Já a Lei e o Decreto são citação
                  normativa: linká-los ao Planalto acrescenta duas navegações que não
                  aproximam ninguém do relatório, e três links num parágrafo de quatro
                  linhas de página legal transformam a ressalva em lista de referências.
                  Se um dia a página passar a publicar o documento, o argumento se
                  inverte e aí vale reabrir — os destinos seriam
                  `planalto.gov.br/ccivil_03/_ato2023-2026/2023/lei/l14611.htm` e
                  `.../decreto/d11795.htm`.

                  DESTINO, conferido no ar em 08/09 (dois candidatos recusados por
                  medição, não por gosto):
                  • `empregabrasil.mte.gov.br` — o nome de host mais óbvio, e ele NÃO
                    serve: em HTTPS dá `ERR_SSL_VERSION_OR_CIPHER_MISMATCH` (Chromium)
                    e `SEC_E_ILLEGAL_MESSAGE` (curl/schannel); em HTTP responde 403 do
                    CloudFront. Link legal quebrado é pior que texto sem link.
                  • `gov.br/trabalho-e-emprego/pt-br/servicos/empregador/portal-emprega-brasil`
                    — 404. O índice `/servicos/empregador` responde 200 mas não lista
                    Emprega Brasil nenhum (só CAGED, RAIS, eSocial, Mediação).
                  • `servicos.mte.gov.br/empregador/` — **200**, e é o certo pelo próprio
                    conteúdo: o `<h1>` renderizado é "Portal Emprega Brasil", com o
                    `<title>` "Portal do Empregador - Governo Federal". É a entrada de
                    empregador, que é onde a Declaração de Igualdade Salarial citada
                    nesta frase é preenchida. Conferido com navegador de verdade, e não
                    só por `curl`, porque a página é SPA: o HTML servido não contém o
                    texto, ele aparece depois do JS. */}
              <a
                href="https://servicos.mte.gov.br/empregador/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4"
              >
                Portal Emprega Brasil
                <span className="sr-only"> (abre o portal do MTE em nova aba)</span>
              </a>
              , nos termos da Lei nº 14.611/2023 e do Decreto nº 11.795/2023.
            </p>
            <p className="text-base leading-relaxed text-white/85">
              {/* Original: "Portaria do MTE nº 3.714/202" — ano truncado, corrigido para 2023. */}
              Ressalvamos que este relatório é publicado estritamente em observância ao quanto
              disposto no Decreto nº 11.795/2023 e na Portaria do MTE nº 3.714/2023, o qual foi
              gerado exclusivamente pelo MTE, cuja interpretação não pode desconsiderar os critérios
              remuneratórios que justifiquem eventuais diferenças, destacados no relatório e que, por
              isso, não refletem, necessariamente, a realidade salarial aplicada, bem como que a
              empresa preza pela isonomia salarial ou equidade de gênero, entre outros argumentos.
            </p>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
