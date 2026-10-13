'use client';

import { useActionState, useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { salvarCarimbo, type EstadoCarimbo } from './acoes';
import type { CarimboBruto } from '@/lib/carimbosTipos';
/* `XADREZ` passou a vir do módulo compartilhado: ele era literal aqui e na
   lista de lugares, e duas cópias do mesmo xadrez divergem na primeira troca de
   tom. */
import { fundoDaPrevia, XADREZ } from './fundoDaPrevia';
import {
  ARTE_REFERENCIA,
  FORMATOS,
  ROTULO_FORMATO,
  renderizar,
  type Acabamento,
  type Formato,
  type Opcoes,
} from './desenhar';

/**
 * As cores da paleta. Branco e grafite existem porque um carimbo exportado sem
 * fundo quase sempre vai POR CIMA de alguma coisa: sobre foto ou seção escura o
 * azul de marca perde contraste, e sobre PDF em preto-e-branco ele vira cinza.
 */
const CORES = [
  { valor: '#0757C7', nome: 'Azul Sistran' },
  { valor: '#FFFFFF', nome: 'Branco' },
  { valor: '#111827', nome: 'Grafite' },
  { valor: '#0ED8F6', nome: 'Ciano' },
  { valor: '#7139E8', nome: 'Violeta' },
  { valor: '#ED5B2A', nome: 'Coral' },
] as const;

const ACABAMENTOS: { valor: Acabamento; nome: string }[] = [
  { valor: 'outline', nome: 'Traço' },
  { valor: 'solid', nome: 'Sólido' },
];

/**
 * ⚠️ «AUTOMÁTICO» É O PADRÃO, e entrou em 13/10 por uma pergunta certeira: «toda
 * vez que criar um novo branco vai ficar azul atrás, até quando escolhe a cor na
 * criação?». Na LISTA já ficava, porque lá o fundo segue a tinta; aqui não — esta
 * tela abria sempre no xadrez, e escolher branco mostrava uma prévia vazia.
 *
 * Os três fundos manuais FICAM: eles existem para conferir a mesma arte sobre
 * claro e sobre escuro antes de salvar, que é uso legítimo e diferente de «quero
 * ver o que estou desenhando». O automático só decide o ponto de partida.
 */
const FUNDOS = [
  { valor: 'auto', nome: 'Automático' },
  { valor: 'xadrez', nome: 'Xadrez' },
  { valor: 'claro', nome: 'Claro' },
  { valor: 'escuro', nome: 'Escuro' },
] as const;


function nomeArquivo(o: Opcoes) {
  const cor = o.cor.replace('#', '').toLowerCase();
  const marca = o.marca
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return `carimbo-${marca || 'sistran'}-${o.formato}-${o.acabamento}-${cor}.png`;
}

/**
 * ⚠️ O GERADOR GANHOU PERSISTÊNCIA, e o motor de desenho não foi tocado.
 *
 * Até aqui ele só exportava arquivo: desenhava no canvas e disparava um
 * `<a download>`. Agora ele também SALVA — e o que é salvo são duas coisas
 * juntas: o PNG (que é o que o site pinta) e a RECEITA (que é o que torna o
 * carimbo reeditável; ver `ReceitaCarimbo`).
 *
 * `emEdicao` chega quando a URL traz `?editar=<id>`: os controles nascem com os
 * valores daquele carimbo em vez dos padrões, e o `idOriginal` viaja escondido no
 * formulário para que renomear não troque a chave — id trocado é toda referência
 * ao carimbo apontando para o vazio.
 *
 * O botão «Baixar PNG» FICA. Ele continua sendo o caminho para quem precisa do
 * arquivo fora do site (apresentação, documento, arte de terceiro), e era o único
 * uso da ferramenta até agora.
 */
export function GeradorCarimbo({ emEdicao }: { emEdicao?: CarimboBruto }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const router = useRouter();

  const [nome, setNome] = useState(emEdicao?.nome ?? '');
  const [prefixo, setPrefixo] = useState(emEdicao?.receita.prefixo ?? 'Realizado pela');
  const [marca, setMarca] = useState(emEdicao?.receita.marca ?? 'Sistran');
  const [serial, setSerial] = useState(emEdicao?.receita.serial ?? 'SIS • 2026');
  const [cor, setCor] = useState<string>(emEdicao?.receita.cor ?? CORES[0].valor);
  /* «Site» é o padrão desde 08/10: é a estrutura do carimbo em uso
     (`public/images/carimbo site novo.png`), e abrir a ferramenta já nela é o que
     evita exportar no formato antigo por inércia. */
  const [formato, setFormato] = useState<Formato>((emEdicao?.receita.formato as Formato) ?? 'site');
  const [acabamento, setAcabamento] = useState<Acabamento>(
    (emEdicao?.receita.acabamento as Acabamento) ?? 'outline',
  );
  /* Sem inclinação por padrão: a referência é reta, e o `-3deg` dos outros
     formatos deixaria a réplica torta no primeiro quadro. */
  const [rotacao, setRotacao] = useState(emEdicao?.receita.rotacao ?? 0);
  const [textura, setTextura] = useState(emEdicao?.receita.textura ?? true);
  const [base, setBase] = useState(emEdicao?.receita.base ?? 24);
  const [escala, setEscala] = useState(3);
  const [fundo, setFundo] = useState<(typeof FUNDOS)[number]['valor']>('auto');

  /**
   * A fonte só vale como estado quando ela TERMINA de carregar: medir com a
   * fonte de fallback dimensiona a arte errado e o texto estoura a borda. O
   * booleano existe só para redesenhar uma vez quando `document.fonts` avisa.
   */
  const [fonteCarregada, setFonteCarregada] = useState(false);

  useEffect(() => {
    let vivo = true;
    document.fonts?.ready.then(() => vivo && setFonteCarregada(true));
    return () => {
      vivo = false;
    };
  }, []);

  /**
   * A ARTE DE REFERÊNCIA, de onde o formato «site» tira o símbolo.
   *
   * Em estado, e não em `ref`: é a chegada dela que tem de disparar um redesenho —
   * guardada em `ref` a prévia ficaria com o símbolo vetorial até o próximo
   * toque num controle. Até carregar, o desenho usa o vetor, então nunca há um
   * quadro com o carimbo sem marca.
   */
  const [arte, setArte] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    let vivo = true;
    const img = new Image();
    /* A arte é do mesmo domínio (`public/`), mas o canvas que a recolore é lido de
       volta com `source-in` e depois exportado: sem o `crossOrigin` explícito,
       qualquer movimentação futura dela para um CDN sujaria o canvas e o
       `toBlob` passaria a falhar com erro de segurança. */
    img.crossOrigin = 'anonymous';
    img.src = ARTE_REFERENCIA;
    img
      .decode()
      .then(() => vivo && setArte(img))
      .catch(() => undefined);
    return () => {
      vivo = false;
    };
  }, []);

  /**
   * O canvas precisa do NOME da família, não da `var(--font-geist-sans)`: a
   * string do `ctx.font` é resolvida pelo canvas, que não conhece as variáveis
   * CSS do documento. Ler do `body` na hora de desenhar — em vez de guardar em
   * estado — mantém o carimbo na tipografia do site sem fixar um nome que o
   * `next/font` pode trocar no próximo build, e sem um `setState` em efeito.
   */
  const montarOpcoes = useCallback(
    (patch?: Partial<Opcoes>): Opcoes => ({
      prefixo,
      marca,
      serial,
      cor,
      formato,
      acabamento,
      rotacao,
      textura,
      base,
      arte,
      familia:
        typeof window === 'undefined'
          ? 'system-ui, sans-serif'
          : getComputedStyle(document.body).fontFamily || 'system-ui, sans-serif',
      ...patch,
    }),
    [prefixo, marca, serial, cor, formato, acabamento, rotacao, textura, base, arte],
  );

  const [medidas, setMedidas] = useState({ largura: 0, altura: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const montado = renderizar(canvas, montarOpcoes(), escala);
    setMedidas({ largura: canvas.width, altura: canvas.height });
    // O CSS mantém o canvas no tamanho lógico; a escala só engorda o bitmap.
    canvas.style.width = `${montado.larguraCaixa}px`;
    canvas.style.height = `${montado.alturaCaixa}px`;
  }, [montarOpcoes, escala, fonteCarregada]);

  /** Um canvas descartável por arquivo: baixar não deve mexer na prévia. */
  const baixar = useCallback(
    async (o: Opcoes) => {
      const canvas = document.createElement('canvas');
      renderizar(canvas, o, escala);
      const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, 'image/png'));
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = nomeArquivo(o);
      a.click();
      URL.revokeObjectURL(url);
    },
    [escala],
  );

  const baixarLote = useCallback(async () => {
    // Sem zip: são oito downloads em sequência. O intervalo existe porque o
    // navegador descarta cliques sintéticos disparados no mesmo tique.
    for (const f of FORMATOS) {
      await baixar(montarOpcoes({ formato: f }));
      await new Promise((r) => setTimeout(r, 220));
    }
  }, [baixar, montarOpcoes]);

  /**
   * O SALVAMENTO. O `FormData` é montado à mão em vez de vir de campos `name=`
   * do formulário, e é deliberado: o PNG não é um campo que o operador preenche
   * — ele é desenhado no instante do clique, num canvas descartável, com as
   * mesmas opções da prévia. Montar aqui é o que garante que o arquivo salvo é
   * byte a byte o que está na tela.
   *
   * ⚠️ A DENSIDADE DO SALVAMENTO É A ESCOLHIDA no controle, igual ao download.
   * As medidas que vão para o catálogo são as do BITMAP (`canvas.width/height`),
   * não as da caixa lógica: é o par largura/altura que `CarimboBatida` usa para
   * montar o `aspect-ratio`, e a razão é a mesma nos dois (3× mantém a razão).
   */
  const [estadoSalvar, acaoSalvar, salvando] = useActionState<EstadoCarimbo, FormData>(
    salvarCarimbo,
    { estado: 'inicial' },
  );

  const salvar = useCallback(async () => {
    const canvas = document.createElement('canvas');
    const o = montarOpcoes();
    renderizar(canvas, o, escala);
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, 'image/png'));
    if (!blob) return;

    const dados = new FormData();
    dados.set('nome', nome);
    if (emEdicao) dados.set('idOriginal', emEdicao.id);
    dados.set('prefixo', o.prefixo);
    dados.set('marca', o.marca);
    dados.set('serial', o.serial);
    dados.set('cor', o.cor);
    dados.set('formato', o.formato);
    dados.set('acabamento', o.acabamento);
    dados.set('rotacao', String(o.rotacao));
    if (o.textura) dados.set('textura', 'on');
    dados.set('base', String(o.base));
    dados.set('largura', String(canvas.width));
    dados.set('altura', String(canvas.height));
    dados.set('png', new File([blob], 'carimbo.png', { type: 'image/png' }));
    acaoSalvar(dados);
  }, [acaoSalvar, emEdicao, escala, montarOpcoes, nome]);

  /* Depois de criar, volta para a aba dos lugares — é lá que o carimbo novo
     serve para alguma coisa, e deixar o operador na tela de criação faria
     parecer que nada aconteceu. Na EDIÇÃO não há navegação: quem está acertando
     um texto costuma salvar duas ou três vezes seguidas. */
  useEffect(() => {
    if (estadoSalvar.estado === 'ok' && !emEdicao) {
      const t = setTimeout(() => router.push('/admin/carimbo'), 1200);
      return () => clearTimeout(t);
    }
  }, [emEdicao, estadoSalvar, router]);

  const campo =
    'w-full rounded-lg border border-black/[0.12] bg-white px-3 py-2 text-sm text-[#0f172a] outline-none transition-colors focus:border-[#0079cb]';
  const rotulo = 'mb-1.5 block font-mono text-[11px] uppercase tracking-[0.16em] text-[#667085]';
  const chip =
    'rounded-lg border px-2.5 py-1.5 text-[12px] font-medium transition-colors cursor-pointer';
  const chipOn = 'border-[#0079cb] bg-[#0079cb] text-white';
  const chipOff = 'border-black/[0.12] bg-white text-[#475467] hover:border-[#0079cb]/50';

  return (
    <div className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
      {/* ── prévia ──────────────────────────────────────────────────────────── */}
      <div className="overflow-hidden rounded-2xl border border-black/[0.07] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
        <div
          className="grid min-h-[380px] place-items-center overflow-auto p-8"
          style={{
            background:
              fundo === 'auto'
                ? /* segue a tinta: clara vai para o navy, escura fica no xadrez */
                  fundoDaPrevia(cor)
                : fundo === 'xadrez'
                  ? XADREZ
                  : fundo === 'escuro'
                    ? '#0b1220'
                    : '#ffffff',
          }}
        >
          {/* `block` remove o espaço de linha-base que o canvas herda como inline
              e que deslocava o desenho para cima do centro. */}
          <canvas ref={canvasRef} className="block max-w-full" />
        </div>

        <div className="flex flex-wrap items-center gap-3 border-t border-black/[0.07] px-4 py-3">
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#667085]">
            Fundo da prévia
          </span>
          <div className="flex gap-1.5">
            {FUNDOS.map((f) => (
              <button
                key={f.valor}
                type="button"
                onClick={() => setFundo(f.valor)}
                className={`${chip} ${fundo === f.valor ? chipOn : chipOff}`}
              >
                {f.nome}
              </button>
            ))}
          </div>
          <span className="ml-auto font-mono text-[11px] text-[#98a2b3]">
            PNG {medidas.largura} × {medidas.altura} px · fundo transparente
          </span>
        </div>
      </div>

      {/* ── controles ───────────────────────────────────────────────────────── */}
      <aside className="grid gap-4 self-start rounded-2xl border border-black/[0.07] bg-white p-4 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
        {/* ── O NOME, primeiro campo: é a identidade do carimbo no catálogo ──── */}
        <div>
          <label className={rotulo} htmlFor="nome">
            Nome do carimbo
          </label>
          <input
            id="nome"
            className={campo}
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="ex.: Realizado pela Sistran 2026"
          />
          <p className="mt-1.5 text-[11px] leading-snug text-[#98a2b3]">
            É por este nome que você vai achá-lo na lista de lugares e dentro de um evento. Não
            aparece no site.
          </p>
        </div>

        <div>
          <label className={rotulo} htmlFor="prefixo">
            Linha de cima
          </label>
          <input
            id="prefixo"
            className={campo}
            value={prefixo}
            onChange={(e) => setPrefixo(e.target.value)}
          />
        </div>

        <div>
          <label className={rotulo} htmlFor="marca">
            Marca
          </label>
          <input
            id="marca"
            className={campo}
            value={marca}
            onChange={(e) => setMarca(e.target.value)}
          />
        </div>

        <div>
          <label className={rotulo} htmlFor="serial">
            Selo pequeno
          </label>
          <input
            id="serial"
            className={campo}
            value={serial}
            onChange={(e) => setSerial(e.target.value)}
            placeholder="vazio esconde a linha"
          />
          <p className="mt-1.5 text-[11px] leading-snug text-[#98a2b3]">
            Só aparece em selo, monograma e certificado — nos outros formatos não
            há lugar para ela sem apertar a marca.
          </p>
        </div>

        <div>
          <span className={rotulo}>Cor</span>
          <div className="flex flex-wrap items-center gap-2">
            {CORES.map((c) => (
              <button
                key={c.valor}
                type="button"
                title={c.nome}
                aria-label={c.nome}
                aria-pressed={cor.toLowerCase() === c.valor.toLowerCase()}
                onClick={() => setCor(c.valor)}
                style={{ background: c.valor }}
                className={`h-8 w-8 cursor-pointer rounded-full border border-black/15 transition-transform ${
                  cor.toLowerCase() === c.valor.toLowerCase()
                    ? 'scale-110 ring-2 ring-[#0079cb] ring-offset-2'
                    : ''
                }`}
              />
            ))}
            <input
              type="color"
              value={/^#[0-9a-f]{6}$/i.test(cor) ? cor : '#0757C7'}
              onChange={(e) => setCor(e.target.value)}
              aria-label="Cor livre"
              className="h-8 w-8 cursor-pointer rounded-full border border-black/15 bg-white p-0.5"
            />
          </div>
        </div>

        <div>
          <span className={rotulo}>Formato</span>
          <div className="flex flex-wrap gap-1.5">
            {FORMATOS.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFormato(f)}
                className={`${chip} ${formato === f ? chipOn : chipOff}`}
              >
                {ROTULO_FORMATO[f]}
              </button>
            ))}
          </div>
        </div>

        <div>
          <span className={rotulo}>Acabamento</span>
          <div className="flex flex-wrap gap-1.5">
            {ACABAMENTOS.map((a) => (
              <button
                key={a.valor}
                type="button"
                onClick={() => setAcabamento(a.valor)}
                className={`${chip} ${acabamento === a.valor ? chipOn : chipOff}`}
              >
                {a.nome}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setTextura((t) => !t)}
              className={`${chip} ${textura && acabamento === 'outline' ? chipOn : chipOff}`}
              disabled={acabamento === 'solid'}
              title={
                acabamento === 'solid'
                  ? 'A textura é multiplicada sobre o traço; no sólido ela não aparece'
                  : undefined
              }
            >
              Textura
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={rotulo} htmlFor="base">
              Tamanho {base}px
            </label>
            <input
              id="base"
              type="range"
              min={14}
              max={64}
              value={base}
              onChange={(e) => setBase(Number(e.target.value))}
              className="w-full accent-[#0079cb]"
            />
          </div>
          <div>
            <label className={rotulo} htmlFor="rotacao">
              Inclinação {rotacao}°
            </label>
            <input
              id="rotacao"
              type="range"
              min={-15}
              max={15}
              value={rotacao}
              onChange={(e) => setRotacao(Number(e.target.value))}
              className="w-full accent-[#0079cb]"
            />
          </div>
        </div>

        <div>
          <span className={rotulo}>Densidade do PNG</span>
          <div className="flex gap-1.5">
            {[1, 2, 3, 4].map((e) => (
              <button
                key={e}
                type="button"
                onClick={() => setEscala(e)}
                className={`${chip} ${escala === e ? chipOn : chipOff}`}
              >
                {e}×
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-2 border-t border-black/[0.07] pt-4">
          {/* SALVAR vem antes de BAIXAR e é o botão sólido: depois deste pedido, o
              caminho principal da ferramenta é aplicar no site, não exportar
              arquivo para copiar à mão. */}
          <button
            type="button"
            onClick={salvar}
            disabled={salvando || nome.trim().length === 0}
            className="cursor-pointer rounded-xl bg-[#0f172a] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1d2939] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {salvando
              ? 'Salvando…'
              : emEdicao
                ? 'Salvar alterações'
                : 'Salvar carimbo'}
          </button>

          <div aria-live="polite">
            {estadoSalvar.estado === 'ok' && (
              <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
                {estadoSalvar.recado}
              </p>
            )}
            {estadoSalvar.estado === 'erro' && (
              <ul role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                {estadoSalvar.problemas.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            )}
          </div>

          <button
            type="button"
            onClick={() => baixar(montarOpcoes())}
            /* Era o botão sólido azul; virou secundário quando «salvar» passou a
               ser a ação principal. Dois botões cheios lado a lado não dizem qual
               é o caminho esperado. */
            className="cursor-pointer rounded-xl border border-black/[0.12] bg-white px-4 py-2.5 text-sm font-semibold text-[#0f172a] transition-colors hover:border-[#0079cb]/50"
          >
            Baixar PNG
          </button>
          <button
            type="button"
            onClick={baixarLote}
            className="cursor-pointer rounded-xl border border-black/[0.12] bg-white px-4 py-2.5 text-sm font-semibold text-[#0f172a] transition-colors hover:border-[#0079cb]/50"
          >
            Baixar os {FORMATOS.length} formatos
          </button>
        </div>
      </aside>
    </div>
  );
}
