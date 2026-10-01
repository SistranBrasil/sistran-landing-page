import Image from 'next/image';
import { ChartNoAxesColumnIncreasing, UsersRound } from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { ISG, ISG_CREDITOS, ISG_EYEBROW, ISG_SELO } from '@/data/aSistran';
import './isg-provider-lens.css';

/**
 * SIS-87 — «ISG Provider Lens» de `/quem-somos`, a composição da mock
 * `public/isg.png` feita em HTML/CSS, segundo `docs/isg.md`.
 *
 * O QUE ESTA SEÇÃO ERA, e por que deixou de ser: três `blockquote.glass-card`
 * lado a lado, um por item de `ISG`, sob um `TituloAceso` escrito «ISG Provider
 * Lens». O JSX antigo ficou comentado em `src/app/quem-somos/page.tsx`, onde
 * vivia. Três coisas o condenaram, todas no critério de aceite da issue:
 *   · «não 3 cards glass» — os dois primeiros itens são DIFERENCIAIS (composição
 *     editorial de duas colunas com um fio entre elas) e o terceiro é o
 *     «Comentário do Analista», que é o destaque, não o terceiro de uma fila;
 *   · o título era tipografia HTML, e o documento proíbe reproduzir o logotipo
 *     com texto — existe arquivo oficial e é ele que deve aparecer;
 *   · a fotografia e o selo não existiam.
 * NENHUMA frase foi reescrita: os três textos vêm de `ISG` como sempre, o único
 * ajuste é o `:` final de `term`, que a mock não mostra (ver `semDoisPontos`).
 *
 * O TÍTULO SUMIU DA TELA MAS NÃO DA ÁRVORE. A seção é rotulada por
 * `aria-labelledby="isg"`, e o `#isg` continua sendo um `<h2>` — só que o
 * conteúdo dele é o logo com `alt="ISG Provider Lens"`. O texto acessível do
 * heading é o `alt`, então o rótulo da seção continua resolvendo para a mesma
 * frase de antes, e o índice de cabeçalhos da página não perde um nível. Foi por
 * isso que `TituloAceso` saiu daqui (e SÓ daqui — ele segue nas outras seis
 * chamadas): o efeito de acender letra por letra pressupõe texto, e aqui não há.
 */

/* A mock escreve «Conhecimento e experiência» e «Portfólio robusto» sem os dois
   pontos que `ISG[n].term` carrega — lá eles faziam sentido, porque o termo
   abria a frase dentro do mesmo parágrafo; aqui o termo é título e a citação é
   parágrafo à parte. Corta-se na renderização e não no dado, para o texto
   travado em `copy-lock.json` seguir igual e para as duas formas continuarem
   disponíveis a quem consumir `ISG` depois. */
const semDoisPontos = (termo: string) => termo.replace(/:\s*$/, '');

const DIFERENCIAIS = [
  { dado: ISG[0], Icone: UsersRound },
  { dado: ISG[1], Icone: ChartNoAxesColumnIncreasing },
] as const;

/* Medidas do arquivo, para o `<Image>` reservar a caixa e não haver salto de
   layout enquanto ele baixa. Lidas com `sharp`, não estimadas. */
const FOTO = { largura: 1122, altura: 1402 };
const LOGO = { largura: 2560, altura: 868 };

export default function IsgProviderLens() {
  return (
    /* `section-light-blue` SAIU daqui (e só daqui — segue nas outras seções).
         Medido: com ela, `getComputedStyle(secao).background` devolvia o
         `linear-gradient(160deg, rgb(242,249,254), rgb(227,241,251) 45%,
         rgb(207,231,247))` dela, e não o `#f7fbff` do documento — duas classes
         (0,2,0) vencem `.isg-secao` sozinha (0,1,0). E não bastava vencer por
         especificidade: a sombra de costura que a SIS-93 pôs nessa classe sangra
         `#e3f1fb` nas vizinhas, cor que deixou de existir aqui. `section-light`
         FICA: dela se quer a textura técnica do `::before` de 96px (a «textura
         discreta» do documento) e o navy padrão do texto. */
    <section
      aria-labelledby="isg"
      className="section-py section-light isg-secao isg-cantos"
    >
      {/* «no fundo da sessao coloque quadrados e linhas interativas como tem nos
          outros lugares» — é a grade técnica da casa (`globals.css`), a MESMA
          montagem de `#como-agimos` e `#por-que-sistran` nesta rota
          (`quem-somos/page.tsx`): dois gradientes de 1px cruzados em
          `--grade-modulo`, `background-attachment: fixed` (é daí que vem o
          «interativa» — a malha fica parada no vetor da janela e desliza sob a
          seção conforme se rola) e máscara nas bordas para morrer sem corte. Não se
          inventou malha nova: a seção é a quinta consumidora da mesma regra.

          NÃO HÁ OVERRIDE DE OPACIDADE, e isso foi medido antes de decidir. Esta é a
          primeira consumidora CLARA da grade (as outras quatro são seções escuras),
          então havia a dúvida de o ciano a 14% desaparecer sobre `#f7fbff`: no
          `1440×900`, a linha mede `rgb(211,244,253)` contra `rgb(244,250,255)` do
          vão, ΔL* 11,45 nos dois eixos — discreta e presente. Sem esta camada o Δ é
          0: a malha de `.section-light::before` usa 4% de `#0079cb`, que sobre este
          fundo não sobrevive à quantização de 8 bits. Era essa a malha que existia
          aqui, e é por isso que a seção parecia não ter quadrado nenhum.

          E as duas camadas NÃO brigam: mesmo módulo (`--grade-modulo`, 96px) e mesma
          âncora (`background-attachment: fixed`), portanto em fase — uma malha só,
          reforçada, e não o moiré de períodos primos que a SIS-260 proíbe. */}
      <div aria-hidden className="grade-tecnica" />
      <div className="container-lp isg-grade">
        {/* COLUNA ESQUERDA — a fotografia com o selo por cima. `cortina={false}`
            pela razão medida na SIS-262: `clip-path` recorta a sombra projetada
            também no estado final, e este painel tem sombra. */}
        <ScrollReveal cortina={false} className="isg-painel">
          <Image
            src="/isgprovider.png"
            alt="Profissional analisando indicadores do mercado de seguros em uma tela digital"
            width={FOTO.largura}
            height={FOTO.altura}
            sizes="(min-width: 68.75rem) 40vw, 100vw"
          />
          {/* O selo. Não há arquivo oficial dele no repositório, só do logo, e o
              documento manda compor quando falta o original; as duas linhas são
              transcrição da mock (ver o docblock de `ISG_SELO`). O asterisco é
              decorativo: o nome da marca está escrito ao lado, em texto. */}
          {/* `on-dark` é a saída sancionada da casa para ilha escura dentro de
              seção clara (`globals.css:1224-1255`; precedentes em `About.tsx`,
              `Accelerators.tsx`, `PartnersGrid.tsx`). Sem ela, o texto do selo
              computava `rgb(10, 31, 68)` sobre o roxo — contraste medido 1,99
              (título) e 1,94 (linha) — porque `.section-light p` e sobretudo
              `.section-light span:not(...)` (0,5,1) repintam navy, e nenhuma
              classe minha alcança essa especificidade. */}
          <div className="isg-selo on-dark">
            <span aria-hidden className="isg-selo__marca">
              ✳
            </span>
            <div>
              <p className="isg-selo__titulo">{ISG_SELO.title}</p>
              <p className="isg-selo__texto">{ISG_SELO.text}</p>
            </div>
          </div>
        </ScrollReveal>

        {/* COLUNA DIREITA. No mobile ela vira `display: contents` para que os
            filhos entrem na ordem que o documento fixa, com a foto no meio. */}
        <div className="isg-conteudo">
          <p className="isg-eyebrow">
            {/* A classe carrega «eyebrow» de propósito: é o que faz a casa tratar
                este texto como sobretítulo e não como corpo (razão medida no CSS). */}
            <span className="isg-eyebrow__rotulo">{ISG_EYEBROW}</span>
            <span aria-hidden className="isg-eyebrow__linha" />
          </p>

          {/* O heading que `aria-labelledby` aponta. O logo é o arquivo oficial,
              sem redesenho: a janela recorta o vazio transparente em volta da
              tinta (as contas estão no CSS), e a proporção fica intacta. */}
          <h2 id="isg" className="isg-logo">
            <Image
              src="/isg-provider-lens-HD-transparente.png"
              alt="ISG Provider Lens"
              width={LOGO.largura}
              height={LOGO.altura}
              sizes="(min-width: 68.75rem) 460px, 360px"
            />
          </h2>

          <div className="isg-diferenciais">
            {DIFERENCIAIS.map(({ dado, Icone }, ordem) => (
              <ScrollReveal
                key={dado.term}
                indice={ordem}
                cortina={false}
                className="isg-diferencial"
              >
                <span className="isg-diferencial__selo">
                  <Icone aria-hidden strokeWidth={1.75} />
                </span>
                <span aria-hidden className="isg-diferencial__traco" />
                <h3 className="isg-diferencial__titulo">{semDoisPontos(dado.term)}</h3>
                <p className="isg-diferencial__texto">{dado.quote}</p>
              </ScrollReveal>
            ))}
          </div>

          {/* A casca existe porque `ScrollReveal` não anima `blockquote` (a lista
              de tags dele é fechada de propósito) e porque o `<blockquote>` tem
              de ser o elemento semântico que o documento pede. A classe da ordem
              no mobile fica na casca, que é quem é filha de `.isg-conteudo`. */}
          <ScrollReveal as="section" cortina={false} className="isg-citacao-casca">
            <blockquote className="isg-citacao">
              {/* As aspas decorativas eram um `<span aria-hidden>` aqui; passaram
                  a ser o `::before` de `.isg-citacao`, por especificidade medida
                  (a conta está no CSS). */}
              <p className="isg-citacao__titulo">{semDoisPontos(ISG[2].term)}</p>
              <p className="isg-citacao__texto">{ISG[2].quote}</p>
            </blockquote>
          </ScrollReveal>

          <p className="isg-creditos">
            <span>{ISG_CREDITOS.fonte}</span>
            <span>
              <a href={ISG_CREDITOS.linkHref} target="_blank" rel="noopener noreferrer">
                {ISG_CREDITOS.linkRotulo}
              </a>
            </span>
            <span>{ISG_CREDITOS.reprint}</span>
          </p>
        </div>
      </div>
    </section>
  );
}
