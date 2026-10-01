import type { CSSProperties } from 'react';
import Image from 'next/image';
import PageShell from '@/components/PageShell';
import AtmosferaQuadrados from '@/components/ui/AtmosferaQuadrados';
import RevealScope from '@/components/motion/RevealScope';
/* O `PageHero` SAIU (pedido de 30/09: «nao precisa de capa»), e o import vai com
   ele porque import sem uso é erro de lint:

       import PageHero from '@/components/PageHero';                            */

export const metadata = {
  title: 'Relatório de Transparência Salarial · Sistran',
};

/* Escrita verbatim de /relatorio-de-transparencia-salarial/.
   No site a pagina traz apenas este disclaimer — o relatorio em si (PDF, tabela
   ou periodo de referencia) nao existe na pagina, e nada foi inventado para
   preencher. Duas correcoes de grafia estao comentadas abaixo.
   Fonte: .claude/conteudo-site/11-legal.md (B)

   SIS-124 — «apenas este disclaimer» descreve o SITE ANTIGO e deixou de descrever
   esta página: o documento oficial do MTE agora é publicado aqui, em imagem. O
   resto do parágrafo segue valendo — a escrita continua verbatim e nada foi
   redigido para preencher. Detalhes no bloco SIS-124 abaixo. */

/* SIS-123/124 — SEGUE VERBATIM, E É POR ISSO QUE ESTE ARQUIVO NÃO MUDOU.
   O que falta aqui é o RELATÓRIO: PDF, período de referência, ou tabela. Nada
   disso pode sair de código — o documento é gerado exclusivamente pelo MTE, por
   CNPJ, e redigir qualquer número, percentual ou resumo por conta própria
   produziria documento divergente do oficial. É pedido de arquivo, não de
   implementação; parado na issue.

   ── SIS-124 · O ARQUIVO CHEGOU, E ESTA PÁGINA DEIXA DE SER «SÓ O DISCLAIMER» ──
   O parágrafo acima descreve o estado até 30/09/2026 e fica como história, porque
   o diagnóstico dele continua certo: o relatório NÃO podia ser escrito em HTML. O
   que mudou é que agora existe o documento oficial em imagem
   (`public/Imagem-Relatorio-de-Transparencia-Salarial-1.jpg`, 411 kB), e a página
   passa a PUBLICAR o relatório, não só a ressalva sobre ele.

   MEDIDO, não estimado (sharp): 3511 × 2321 px, JPEG sRGB, proporção 1,513:1.
   Com `images: { unoptimized: true }` (SIS-154) é o arquivo do disco que vai ao ar,
   então o par `width`/`height` só reserva a caixa e preserva a proporção — e por
   isso tinha de ser medido em vez de deduzido do nome.

   A IMAGEM É CONTEÚDO, e três decisões saem disso:
   • Fica FORA do `max-w-3xl` do bloco de texto (768px é teto de LEITURA de
     parágrafo). O infográfico é uma folha paisagem com quatro painéis e rótulos de
     ~11px na escala original; a 768px nada ali se lê. Vai à largura do
     `container-lp`, dentro de cartão BRANCO — o documento é preto sobre branco e
     esta rota tem fundo escuro; sem o cartão, a folha recortaria um retângulo claro
     solto no meio da página.
   • NENHUMA TABELA FOI RECRIADA EM HTML, e nenhum número do relatório foi
     transcrito para cá — nem os dois percentuais do cabeçalho dele. É o que a issue
     proíbe, e a razão é a mesma que travava a página antes: número redigido por nós
     é número que pode divergir do oficial. Quem precisa dos valores lê o documento.
   • Mesmo à largura do container o texto miúdo continua apertado no telefone. A
     saída NÃO é rolagem horizontal (que esconde metade da folha sem avisar): a
     figura é um LINK para o próprio JPEG, que abre os 3511px e entrega o zoom
     nativo do navegador, com gesto de pinça no telefone. O link é o mecanismo de
     leitura, não um extra.
   • O `alt` nomeia o DOCUMENTO e diz o que há nele (autor, período, CNPJ, e os
     quatro blocos), sem recitar valores: alt que transcreve tabela é a transcrição
     que a issue veta, e alt vazio esconderia de leitor de tela justamente a peça
     que a página existe para publicar.
   • A `<figcaption>` repete a linha de fonte QUE ESTÁ IMPRESSA no pé do documento
     («Fonte: eSocial. Rais 2022 e Portal Emprega Brasil mar.2024»). Não é escrita
     nova — é texto do próprio relatório, trazido para fora da imagem porque a
     procedência do dado é a única coisa ali que precisa ser legível sem enxergar.

   Duas decisões secundárias, para não voltarem como dúvida:
   • SEM `ContactCTA` no fim, de propósito, como em `/politica-de-privacidade`.
     As duas rotas legais fecham sem convite comercial: "Fale com a Gente!" logo
     abaixo de uma ressalva sobre isonomia salarial lê como se a publicação
     obrigatória fosse peça de marketing.
   • FORA de `src/data/pageSections.ts`, pelo critério que já está escrito no
     cabeçalho daquele arquivo (rota com menos de 3 seções não entra): aqui há uma
     seção só. Se o relatório entrar e a página passar a ter períodos em lista,
     o critério passa a ser satisfeito e a rota entra — junto com a estrutura, não
     antes dela.
     SIS-124: o relatório entrou e ISSO AINDA NÃO BASTA. A condição escrita acima é
     «períodos em LISTA», e o que chegou foi UM semestre (1º/2024) dentro da mesma
     seção — a rota continua com uma seção só. Quando houver um segundo período,
     aí sim.

   ── 30/09, NO CHAT · A ROTA VIRA PLANO CLARO, E A CAPA SAI ─────────────────
   Pedido em cinco partes, verbatim: «quero que o fundo seja claro e siga como
   exemplo o fundo do /solucoes o backgrnd essa parte deixe bem no meio [print do
   cartão de texto] e aumente a escrita nao precisa de capa [print do hero] e deixe
   o titulo bem dinamico».

   1. FUNDO CLARO, receita de `/solucoes`: `transparencia-canvas` no `<main>` +
      `AtmosferaQuadrados`. O bloco de CSS é próprio (fim do `globals.css`) e o
      motivo de não montar a classe daquela rota está escrito lá.

   2. A CAPA SAI. Com ela sai o único `h1` da página, e o título do relatório
      passa a ser publicado no corpo — que é a condição que a própria SIS-124
      escreveu ao autorizar a simplificação («desde que o título do relatório fique
      claro»). A escrita é a MESMA, nas mesmas duas partes que eram `title` e
      `highlight`: nenhuma palavra nova, nenhuma palavra perdida.
      ⚠️ Isso MOVE a cópia de valor-de-prop para nó de texto no `copy-lock`: eram
      duas entradas («Relatório … Salarial de» e «Mulheres e Homens»), e o extrator
      costura `{' '}` e tag em linha, então passa a ser UMA frase. Declarado porque
      o portão do lock não foi rodado nesta passada.

   3. TÍTULO DINÂMICO acima da dobra, e é por isso que NÃO é o `TituloAceso`.
      Aquele componente acende por ROLAGEM (`offset: ['start 92%', 'end 55%']`) e
      aqui o título nasce a ~180px do topo: as duas bordas do intervalo já estão
      cumpridas no carregamento, o progresso nasce em 1 e o efeito não existe —
      seria mecânica ligada e nada na tela. Acima da dobra o que acende é ENTRADA,
      não rolagem: `RevealScope esperarRota` (contrato da SIS-269) com um
      `data-reveal="fade-up"` por palavra e `--reveal-i` crescente, que é a cascata
      da casa. O destaque continua em `.text-gradient-brand`, que já é um degradê em
      movimento perpétuo (`gradient-shift`, 8s) — e em faixa clara ele vem pelo
      `!important` de `.section-light`, com o `background-size: 200% 200%` intacto,
      então a animação segue valendo.
      Movimento reduzido está coberto sem linha nova: a fundação da SIS-193 zera as
      transições do reveal e o estado final é o texto opaco no lugar.

   4. ESCRITA MAIOR no corpo: `text-xl` → `text-2xl` no `h2`, `text-base` →
      `text-lg` nos dois parágrafos, `text-sm` → `text-base` na legenda.

   5. O CARTÃO «BEM NO MEIO»: era `max-w-3xl` encostado à esquerda, com a metade
      direita do container vazia — é o que o print mostra. Passa a `mx-auto`. O
      TETO DE 768px FICA: ele é medida de leitura de parágrafo, e alargá-lo para
      centralizar trocaria um problema de composição por um de legibilidade.
      Os parágrafos seguem alinhados à ESQUERDA de propósito: são quatro e sete
      linhas de prosa jurídica, e texto centrado nesse comprimento devolve o
      "rio" de bordas irregulares que obriga o olho a procurar o começo de cada
      linha. O que o pedido resolve é a POSIÇÃO do bloco, e é ela que mudou.

   ⚠️ PREMISSA VENCIDA, ACIMA: «o documento é preto sobre branco e esta rota tem
   fundo escuro» — a segunda metade caducou hoje. O CARTÃO BRANCO DA FIGURA FICA,
   e agora por outro motivo, que vale mais: o plano da rota é azul-claro com malha
   de pontos por baixo, e a folha do MTE é branca de ponta a ponta. Sem a moldura,
   a borda da imagem viraria um corte reto entre dois claros parecidos — pior de
   ler que sobre o navy, não melhor. As tintas de texto, essas, mudaram todas: era
   `text-white`, `text-white/85` e `text-white/70`, que sobre este plano são ~1,1:1.
   A rede de segurança de `.section-light` ([class*="text-white"] → navy) as
   salvaria, mas deixar a classe errada no JSX confiando na rede é escrever uma
   coisa e ver outra — foram trocadas por tinta declarada. */
export default function Page() {
  return (
    <PageShell classeDoMain="transparencia-canvas">
      {/* A terceira camada do plano: quadrados arredondados, linhas longas e o arco
          azul, que gradiente não desenha. Primeiro nó do `<main>` porque é fundo —
          e `position: fixed` com `z-index: -1`, então a posição na árvore não muda
          o que se vê; o que ela faz é deixar a leitura do arquivo na mesma ordem
          das camadas. A classe vem por prop: ver o docblock do componente. */}
      <AtmosferaQuadrados classe="transparencia-atmosfera" />

      <section id="topo" className="section-light section-py">
        <div className="container-lp">
          {/* ── O TÍTULO, QUE ERA A CAPA ────────────────────────────────────
              `esperarRota`: o bloco nasce acima da dobra, e sem o portão a cascata
              correria por baixo da cortina do `RouteLoadGate` — quando ela sobe,
              já estaria terminada. É o contrato da SIS-269.
              As palavras estão escritas UMA A UMA no JSX, e não vindas de um
              `split()`, por causa do `copy-lock`: `{palavra}` é expressão e CORTA o
              nó de texto, então a frase sairia do lock; `{' '}` entre `<span>`s em
              linha é costurado pelo extrator e devolve exatamente a mesma frase de
              antes. O `--reveal-i` é o índice da cascata, na cadência global. */}
          <RevealScope esperarRota className="mx-auto max-w-3xl" data-reveal-nome="transparencia-titulo">
            <h1 className="font-display text-pagehero-longo font-bold tracking-tight text-balance text-ink">
              <span data-reveal="fade-up" style={{ '--reveal-i': 0 } as CSSProperties}>Relatório</span>{' '}
              <span data-reveal="fade-up" style={{ '--reveal-i': 1 } as CSSProperties}>de</span>{' '}
              <span data-reveal="fade-up" style={{ '--reveal-i': 2 } as CSSProperties}>Transparência</span>{' '}
              <span data-reveal="fade-up" style={{ '--reveal-i': 3 } as CSSProperties}>e</span>{' '}
              <span data-reveal="fade-up" style={{ '--reveal-i': 4 } as CSSProperties}>Igualdade</span>{' '}
              <span data-reveal="fade-up" style={{ '--reveal-i': 5 } as CSSProperties}>Salarial</span>{' '}
              <span data-reveal="fade-up" style={{ '--reveal-i': 6 } as CSSProperties}>de</span>{' '}
              <span
                data-reveal="fade-up"
                style={{ '--reveal-i': 7 } as CSSProperties}
                className="text-gradient-brand"
              >
                Mulheres
              </span>{' '}
              <span
                data-reveal="fade-up"
                style={{ '--reveal-i': 8 } as CSSProperties}
                className="text-gradient-brand"
              >
                e
              </span>{' '}
              <span
                data-reveal="fade-up"
                style={{ '--reveal-i': 9 } as CSSProperties}
                className="text-gradient-brand"
              >
                Homens
              </span>
            </h1>
            {/* O risco de sinal da casa (`.titulo-risco`), aqui SEM `scaleX` por
                rolagem: ele entra na cascata, como décima-primeira unidade, pelo
                mesmo motivo que o título não usa `TituloAceso` — acima da dobra não
                há rolagem para desenhar nada. Decoração, então fora da árvore
                acessível. */}
            <span
              aria-hidden
              data-reveal="fade-up"
              style={{ '--reveal-i': 10 } as CSSProperties}
              className="titulo-risco"
            />
          </RevealScope>
        </div>

        <div className="container-lp mt-14">
          {/* `mx-auto` é o «bem no meio» do pedido; o teto de 768px é de LEITURA e
              fica — ver o item 5 do bloco de 30/09 no topo do arquivo. */}
          <div className="glass-card mx-auto max-w-3xl space-y-6 p-8 md:p-12">
            <h2 className="font-display text-2xl uppercase tracking-wide text-ink">
              Relatório de Transparência Salarial e de Critérios Remuneratórios
            </h2>
            <p className="text-lg leading-relaxed text-ink-muted">
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
            <p className="text-lg leading-relaxed text-ink-muted">
              {/* Original: "Portaria do MTE nº 3.714/202" — ano truncado, corrigido para 2023. */}
              Ressalvamos que este relatório é publicado estritamente em observância ao quanto
              disposto no Decreto nº 11.795/2023 e na Portaria do MTE nº 3.714/2023, o qual foi
              gerado exclusivamente pelo MTE, cuja interpretação não pode desconsiderar os critérios
              remuneratórios que justifiquem eventuais diferenças, destacados no relatório e que, por
              isso, não refletem, necessariamente, a realidade salarial aplicada, bem como que a
              empresa preza pela isonomia salarial ou equidade de gênero, entre outros argumentos.
            </p>
          </div>

          {/* ── O RELATÓRIO OFICIAL (SIS-124) ────────────────────────────────
              `mt-10` e não `space-y` do pai: a figura é irmã do cartão de texto,
              não parte dele — o cartão tem o teto de leitura e ela não.
              O `<a>` embrulha a figura INTEIRA (moldura branca inclusive) porque o
              alvo de toque tem de ser a folha, e não um rótulo de 14px embaixo
              dela; o texto do link fica em `sr-only` + na legenda visível.

              30/09 — A SOMBRA DA MOLDURA era `rgba(3,25,48,0.55)`: navy a 55%,
              calibrada para levantar o branco sobre o fundo ESCURO que a rota tinha.
              Sobre o plano claro ela lê como borrão sujo, então cai para 0,18 e
              entra um anel de 1px no azul da casa — é ele que separa a moldura
              branca do plano azul-claro agora que a diferença de cor entre os dois
              é pequena. O `mx-auto` não aparece aqui de propósito: a figura ocupa a
              largura do `container-lp` inteiro, que já é centrado. */}
          <figure className="mt-10">
            <a
              href="/Imagem-Relatorio-de-Transparencia-Salarial-1.jpg"
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-2xl border border-[#0079cb]/14 bg-white p-3 shadow-[0_1rem_2.5rem_-1rem_rgba(3,25,48,0.18)] md:p-5"
            >
              {/* `width`/`height` são as dimensões INTRÍNSECAS medidas do arquivo
                  (3511 × 2321). `h-auto w-full` deixa a folha acompanhar a largura
                  do container mantendo a proporção; `sizes` é a largura real que a
                  figura ocupa (o `container-lp` vai a ~1200px), verdadeira embora
                  inerte sob `unoptimized`.
                  `priority` NÃO: o documento nasce abaixo da dobra, depois da
                  ressalva — o que está na dobra é o texto. */}
              <Image
                src="/Imagem-Relatorio-de-Transparencia-Salarial-1.jpg"
                alt="Relatório de Transparência e Igualdade Salarial de Mulheres e Homens do 1º Semestre de 2024, emitido pelo Ministério do Trabalho e Emprego para o CNPJ 13.927.934/0001-15 da Sistran Informática. O documento reúne quatro blocos: a razão entre salário mediano e remuneração média de mulheres e homens; a diferença por grande grupo de ocupação; a composição do quadro de empregados por sexo, etnia e raça; e a relação de critérios remuneratórios e de ações para aumentar a diversidade. Os valores constam apenas do documento oficial — abra a imagem em tamanho original para lê-los."
                width={3511}
                height={2321}
                sizes="(min-width: 1280px) 1200px, 100vw"
                className="h-auto w-full rounded-lg"
              />
              <span className="sr-only">
                Abrir o relatório oficial em tamanho original, em nova aba
              </span>
            </a>
            <figcaption className="mt-4 text-base leading-relaxed text-ink-faint">
              {/* Linha impressa no pé do próprio documento, reproduzida como está. */}
              Fonte: eSocial. Rais 2022 e Portal Emprega Brasil mar.2024. Documento emitido pelo
              Ministério do Trabalho e Emprego.{' '}
              <span aria-hidden className="underline underline-offset-4">
                Toque ou clique na imagem para abri-la em tamanho original.
              </span>
            </figcaption>
          </figure>
        </div>
      </section>
    </PageShell>
  );
}
