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
            <h2 className="font-display text-xl font-bold uppercase tracking-wide text-white">
              Relatório de Transparência Salarial e de Critérios Remuneratórios
            </h2>
            <p className="text-base leading-relaxed text-white/85">
              O Relatório de Transparência Salarial foi elaborado pelo Ministério do Trabalho e
              Emprego (MTE), por CNPJ e com base nas informações fornecidas pela Sistran Informática
              Ltda. por meio do e-Social e da Declaração de Igualdade Salarial preenchida no Portal
              Emprega Brasil, nos termos da Lei nº 14.611/2023 e do Decreto nº 11.795/2023.
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
