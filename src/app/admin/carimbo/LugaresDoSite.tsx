'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useTransition } from 'react';
import { aplicarCarimbo, excluirCarimbo, type EstadoCarimbo } from './acoes';
import type { LugarCarimbo } from '@/data/carimboLugares';
import type { CarimboBruto } from '@/lib/carimbosTipos';

/**
 * A ABA «LUGARES DO SITE» — o inventário com o controle de troca.
 *
 * ⚠️ `useTransition` E NÃO `useActionState`, seguindo o que `AcoesDoEvento` já
 * faz: estas ações recebem ARGUMENTOS (`lugarId`, `carimboId`), não um `FormData`.
 * `useActionState` serve o caso do `<form action={fn}>`, e forçá-lo aqui
 * significaria montar um formulário por linha da tabela só para carregar dois
 * valores que já estão em mão.
 *
 * ⚠️ A TROCA É IMEDIATA no `onChange`, sem botão «salvar» por linha. É um campo
 * só, com valor vindo de uma lista fechada — um botão de confirmação por linha
 * daria dezoito botões numa tela cujo objetivo é dar visão do conjunto. O que
 * fica no lugar da confirmação é o recado nomeando lugar e carimbo («Quem somos ·
 * Sobre nós agora usa o carimbo X»), para que um clique na linha errada seja
 * visível na hora.
 */
/**
 * O FUNDO DA PRÉVIA, escolhido pela cor da arte.
 *
 * ⚠️ POR QUE NÃO É SEMPRE O XADREZ, que é a convenção para imagem transparente:
 * porque metade das artes é BRANCA — carimbo branco sobre xadrez claro
 * desaparece, e a lista mostrava dez caixas aparentemente vazias. O xadrez só
 * cumpre o papel dele quando há contraste com a tinta.
 *
 * Então: tinta clara ganha fundo NAVY (o `#001A3D` da casa, que é o fundo real
 * onde essas artes brancas vivem no site — ou seja, a prévia passa a mostrar a
 * peça no contexto em que ela existe); tinta escura mantém o xadrez, que ali
 * ainda informa a transparência.
 *
 * A luminância é a fórmula de percepção (coeficientes 0.299/0.587/0.114), e não
 * a média dos canais: num amarelo os dois discordam, e é a percepção que decide
 * se o carimbo vai ser visto.
 */
const XADREZ = 'repeating-conic-gradient(#e7ebf0 0% 25%, #ffffff 0% 50%) 0 0 / 14px 14px';

function fundoDaPrevia(cor: string): string {
  const hex = cor.replace('#', '');
  if (hex.length !== 6) return XADREZ;   // cor fora do formato: não arrisca, usa o xadrez
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  const luminancia = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminancia > 0.65 ? '#001A3D' : XADREZ;
}

export function LugaresDoSite({
  lugares,
  carimbos,
  aplicacoes,
}: {
  lugares: LugarCarimbo[];
  carimbos: CarimboBruto[];
  aplicacoes: Record<string, string>;
}) {
  const [pendente, comTransicao] = useTransition();
  const [estado, setEstado] = useState<EstadoCarimbo>({ estado: 'inicial' });
  /* O `<select>` é controlado por este mapa, e não pelo valor que veio do
     servidor: entre o `onChange` e o fim da revalidação há um intervalo em que a
     prop ainda traz o valor antigo, e um campo não-controlado ali «pularia de
     volta» para a opção anterior na frente do operador. */
  const [escolhas, setEscolhas] = useState<Record<string, string>>(aplicacoes);

  const porId = new Map(carimbos.map((c) => [c.id, c]));

  const trocar = (lugar: LugarCarimbo, carimboId: string) => {
    setEscolhas((antes) => ({ ...antes, [lugar.id]: carimboId }));
    comTransicao(async () => setEstado(await aplicarCarimbo(lugar.id, carimboId)));
  };

  const rotulo = 'font-mono text-[11px] uppercase tracking-[0.16em] text-[#667085]';
  /* `disabled:` com fundo cinza, texto apagado e cursor barrado: `opacity-50`
     sozinho não comunica — num campo de fundo branco a diferença é sutil demais
     para quem não está comparando lado a lado. */
  const campo =
    'w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-[#0f172a] outline-none transition-colors focus:border-[#0079cb] focus:ring-4 focus:ring-[#0079cb]/10 disabled:cursor-not-allowed disabled:border-black/[0.06] disabled:bg-[#f2f4f7] disabled:text-[#98a2b3]';

  return (
    <div className="mt-8">
      {/* ── o recado das ações, no mesmo vocabulário do admin de eventos ─────── */}
      <div aria-live="polite" className="min-h-[2.75rem]">
        {estado.estado === 'ok' && (
          <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
            {estado.recado}{' '}
            {/* ⚠️ ESTE AVISO É MEDIDO, não cautela genérica: depois de gravar, a
                loja serviu o corpo anterior por ~90 s (13/10, com URL nova e sem
                cache). Sem dizer isso, quem recarrega a página do site em dez
                segundos conclui que a troca não funcionou — e clica de novo, que é
                justamente o que embaralha as gravações. */}
            <span className="text-emerald-700/80">
              No site, a troca aparece em até cerca de um minuto.
            </span>
          </p>
        )}
        {estado.estado === 'erro' && (
          <ul role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {estado.problemas.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        )}
      </div>

      {/* ── os carimbos disponíveis ─────────────────────────────────────────────
          ⚠️ `<div>` E NÃO `<section>`, e isto é defeito medido e corrigido. O
          `globals.css` tem, em `@layer base`,
          `:where(main > section:nth-of-type(even))` com
          `background: var(--fundo-marca)` — a ALTERNÂNCIA DE FAIXAS das rotas
          públicas. O `<main>` do admin é um `<main>` como qualquer outro, então as
          `<section>` pares desta tela ganhavam o azul navy da marca por trás dos
          cartões brancos: eram as faixas azuis que apareceram na tela.
          Escapar pela semântica errada seria ruim; o certo é que esta lista não é
          uma «faixa» do layout do site. O cabeçalho continua sendo `<h2>`, que é o
          que dá a estrutura para leitor de tela. */}
      <div className="mt-2">
        <h2 className="text-lg font-medium text-[#0f172a]">
          Carimbos criados{' '}
          <span className="font-mono text-[11px] tracking-[0.16em] text-[#98a2b3]">
            {carimbos.length}
          </span>
        </h2>

        {carimbos.length === 0 ? (
          /* ⚠️ ESTE BLOCO ERA UMA NOTA DISCRETA, e foi o defeito relatado: «não
             estou conseguindo fazer nada aqui». Com zero carimbos não há o que
             escolher, então os dezoito seletores nascem desabilitados — e um
             `<select>` desabilitado, com o visual de um habilitado, parece uma
             tela quebrada em vez de uma tela que está esperando um passo anterior.
             A correção tem duas pontas: esta chamada, que diz o que falta e leva
             ao lugar de fazer, e o estilo de desabilitado nos seletores (abaixo),
             que para de fingir que são clicáveis. */
          <div className="mt-3 max-w-2xl rounded-xl border border-amber-300/70 bg-amber-50 px-4 py-4">
            <p className="text-sm leading-relaxed text-amber-900">
              <strong>Comece criando um carimbo.</strong> Os {lugares.length} lugares abaixo estão
              todos na arte original — é o site exatamente como está hoje. Enquanto não houver
              nenhum carimbo criado, não há o que escolher, e por isso os campos de troca estão
              desligados.
            </p>
            <Link
              href="/admin/carimbo?aba=criar"
              className="mt-3 inline-block rounded-full bg-[#0f172a] px-5 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-white no-underline transition-colors hover:bg-[#1d2939]"
            >
              Criar o primeiro carimbo
            </Link>
          </div>
        ) : (
          <ul className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {carimbos.map((c) => {
              const usos = Object.values(escolhas).filter((v) => v === c.id).length;
              return (
                <li
                  key={c.id}
                  className="rounded-2xl border border-black/[0.07] bg-white p-4 shadow-[0_1px_2px_rgba(16,24,40,0.04)]"
                >
                  {/* O fundo vem de `fundoDaPrevia`: xadrez para tinta escura,
                      navy para tinta clara — senão o carimbo branco não aparece. */}
                  <div
                    className="grid min-h-[96px] place-items-center rounded-xl p-3"
                    style={{ background: fundoDaPrevia(c.receita.cor) }}
                  >
                    <Image
                      src={c.arquivo}
                      alt=""
                      width={c.largura}
                      height={c.altura}
                      className="h-auto w-full max-w-[200px]"
                      unoptimized
                    />
                  </div>
                  <p className="mt-3 text-sm font-medium text-[#0f172a]">{c.nome}</p>
                  <p className={`mt-1 ${rotulo}`}>
                    {c.receita.formato} · {c.receita.acabamento} · {usos === 0
                      ? 'sem uso'
                      : usos === 1
                        ? '1 lugar'
                        : `${usos} lugares`}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Link
                      href={`/admin/carimbo?aba=criar&editar=${c.id}`}
                      className="rounded-full border border-black/10 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-[#344054] no-underline hover:border-[#0079cb]/50"
                    >
                      Editar
                    </Link>
                    <button
                      type="button"
                      disabled={pendente}
                      onClick={() =>
                        comTransicao(async () => setEstado(await excluirCarimbo(c.id)))
                      }
                      className="cursor-pointer rounded-full border border-black/10 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-[#b42318] transition-colors hover:border-[#b42318]/40 disabled:opacity-40"
                    >
                      Excluir
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* ── o inventário (também `<div>`, pelo mesmo motivo) ──────────────────── */}
      <div className="mt-10">
        <h2 className="text-lg font-medium text-[#0f172a]">
          Lugares do site{' '}
          <span className="font-mono text-[11px] tracking-[0.16em] text-[#98a2b3]">
            {lugares.length}
          </span>
        </h2>

        <ul className="mt-3 grid gap-3">
          {lugares.map((lugar) => {
            const escolhido = escolhas[lugar.id] ?? '';
            const carimbo = porId.get(escolhido);
            /* A cor entra junto com a arte, do mesmo objeto: é ela que decide o
               fundo da prévia, e misturar a cor de uma com o arquivo da outra
               faria exatamente o caso que estamos corrigindo (carimbo branco
               sobre fundo claro). */
            const arte = carimbo
              ? {
                  src: carimbo.arquivo,
                  largura: carimbo.largura,
                  altura: carimbo.altura,
                  cor: carimbo.receita.cor,
                }
              : {
                  src: lugar.padrao.src,
                  largura: lugar.padrao.largura,
                  altura: lugar.padrao.altura,
                  cor: lugar.padrao.cor,
                };

            return (
              <li
                key={lugar.id}
                className="grid gap-4 rounded-2xl border border-black/[0.07] bg-white p-4 shadow-[0_1px_2px_rgba(16,24,40,0.04)] sm:grid-cols-[180px_minmax(0,1fr)_260px] sm:items-center"
              >
                <div
                  className="grid min-h-[72px] place-items-center rounded-xl p-2"
                  style={{ background: fundoDaPrevia(arte.cor) }}
                >
                  <Image
                    src={arte.src}
                    alt=""
                    width={arte.largura}
                    height={arte.altura}
                    className="h-auto w-full max-w-[150px]"
                    unoptimized
                  />
                </div>

                <div>
                  <p className="text-sm font-medium text-[#0f172a]">{lugar.rotulo}</p>
                  <p className="mt-1 text-sm text-[#667085]">{lugar.onde}</p>
                  <p className={`mt-2 ${rotulo}`}>
                    {lugar.rotas.join(' · ')}
                    {!carimbo && ' · arte original'}
                  </p>
                </div>

                <div>
                  <label className={`block ${rotulo}`} htmlFor={`carimbo-${lugar.id}`}>
                    Carimbo
                  </label>
                  <select
                    id={`carimbo-${lugar.id}`}
                    className={`mt-2 ${campo}`}
                    value={escolhido}
                    disabled={pendente || carimbos.length === 0}
                    /* O `title` é o socorro de quem passa o mouse no campo
                       desligado antes de ler a chamada do topo. */
                    title={
                      carimbos.length === 0
                        ? 'Crie um carimbo primeiro — não há nenhum para escolher.'
                        : undefined
                    }
                    onChange={(e) => trocar(lugar, e.target.value)}
                  >
                    {/* A opção vazia é «voltar ao original», e o texto diz isso em
                        palavras em vez de um travessão: é a ação mais provável de
                        alguém precisar e a que não pode parecer «nenhum carimbo». */}
                    <option value="">Arte original da página</option>
                    {carimbos.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nome}
                      </option>
                    ))}
                  </select>
                  {lugar.rotas.length > 1 && (
                    <p className="mt-2 text-[12px] leading-snug text-[#98a2b3]">
                      Este ponto aparece em mais de uma página — a troca vale para todas.
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* ── a nota do carimbo de evento, que NÃO é um lugar daqui ─────────────── */}
      <p className="mt-8 max-w-2xl rounded-xl border border-black/[0.07] bg-white px-4 py-3 text-sm leading-relaxed text-[#475467]">
        O carimbo de <strong>evento</strong> não está nesta lista porque não é um ponto fixo do
        layout: cada evento tem o seu. Por padrão ele segue a categoria do evento (as quatro artes
        de «Realizado pela Sistran», «Evento global» e companhia) e pode ser trocado por um destes
        carimbos dentro de{' '}
        <Link href="/admin/eventos" className="text-[#0079cb]">
          Eventos
        </Link>
        .
      </p>
    </div>
  );
}
