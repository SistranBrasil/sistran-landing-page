'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
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

const FUNDOS = [
  { valor: 'xadrez', nome: 'Xadrez' },
  { valor: 'claro', nome: 'Claro' },
  { valor: 'escuro', nome: 'Escuro' },
] as const;

/** Xadrez de transparência desenhado em CSS: nenhuma imagem para carregar. */
const XADREZ =
  'repeating-conic-gradient(#e7ebf0 0% 25%, #ffffff 0% 50%) 0 0 / 18px 18px';

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

export function GeradorCarimbo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [prefixo, setPrefixo] = useState('Realizado pela');
  const [marca, setMarca] = useState('Sistran');
  const [serial, setSerial] = useState('SIS • 2026');
  const [cor, setCor] = useState<string>(CORES[0].valor);
  const [formato, setFormato] = useState<Formato>('capsule');
  const [acabamento, setAcabamento] = useState<Acabamento>('outline');
  const [rotacao, setRotacao] = useState(-3);
  const [textura, setTextura] = useState(true);
  const [base, setBase] = useState(24);
  const [escala, setEscala] = useState(3);
  const [fundo, setFundo] = useState<(typeof FUNDOS)[number]['valor']>('xadrez');

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
      familia:
        typeof window === 'undefined'
          ? 'system-ui, sans-serif'
          : getComputedStyle(document.body).fontFamily || 'system-ui, sans-serif',
      ...patch,
    }),
    [prefixo, marca, serial, cor, formato, acabamento, rotacao, textura, base],
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
              fundo === 'xadrez' ? XADREZ : fundo === 'escuro' ? '#0b1220' : '#ffffff',
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
          <button
            type="button"
            onClick={() => baixar(montarOpcoes())}
            className="cursor-pointer rounded-xl bg-[#0079cb] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0668ab]"
          >
            Baixar PNG
          </button>
          <button
            type="button"
            onClick={baixarLote}
            className="cursor-pointer rounded-xl border border-black/[0.12] bg-white px-4 py-2.5 text-sm font-semibold text-[#0f172a] transition-colors hover:border-[#0079cb]/50"
          >
            Baixar os 8 formatos
          </button>
        </div>
      </aside>
    </div>
  );
}
