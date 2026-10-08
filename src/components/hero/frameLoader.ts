/**
 * FrameLoader — baixa os quadros da sequência do hero com fila de prioridade e teto de
 * downloads simultâneos. Guarda o `Blob` comprimido de cada quadro (quem decodifica é o
 * `DecodeWindow`); nunca cria `Image`/`ImageBitmap` aqui.
 *
 * ORDEM ESTÁTICA (decidida uma vez, em `montarOrdem`):
 *   fase 1  os primeiros `janelaInicial` quadros, em ordem — o começo da cena tem de existir
 *           antes de qualquer gesto;
 *   fase 2  amostras distribuídas pela linha do tempo em passos decrescentes (16, 8, 4, 2) —
 *           para que uma rolagem rápida nunca encontre uma região inteira vazia; a cada passo a
 *           cobertura dobra de forma uniforme;
 *   fase 3  o restante, em ordem.
 *
 * ORDEM DINÂMICA (`focar`): a cada mudança de quadro, os quadros ao redor do playhead
 * (`atras` para trás, `frente` para a frente, no sentido da rolagem) passam na frente de tudo.
 * É isso que faz o scroll reverso funcionar tão bem quanto o direto.
 *
 * Falha de rede não derruba a sequência: o quadro volta para o fim da fila até `TENTATIVAS`
 * vezes; quem desenha usa o quadro carregado mais próximo enquanto isso.
 */

export type FrameLoaderOpcoes = {
  total: number;
  url: (indice: number) => string;
  /** Downloads simultâneos. 6 é um bom ponto para HTTP/2 sem afogar o resto da página. */
  concorrencia: number;
  /** Quantos quadros do começo entram na fase 1. */
  janelaInicial: number;
  /** Quadros priorizados atrás/à frente do playhead a cada `focar`. */
  atras: number;
  frente: number;
  onQuadro: (indice: number) => void;
  onErro?: (indice: number, erro: unknown) => void;
};

const TENTATIVAS = 3;

export class FrameLoader {
  private readonly blobs: (Blob | undefined)[];
  private readonly pendentes = new Set<number>();
  private readonly tentativas = new Map<number, number>();
  private readonly ordem: number[];
  private cursor = 0;
  private foco = 0;
  private direcao: 1 | -1 = 1;
  private emVoo = 0;
  private ativo = false;
  private controlador = new AbortController();
  private carregados = 0;

  constructor(private readonly o: FrameLoaderOpcoes) {
    this.blobs = new Array<Blob | undefined>(o.total);
    this.ordem = montarOrdem(o.total, o.janelaInicial);
  }

  iniciar(): void {
    if (this.ativo) return;
    this.ativo = true;
    this.controlador = new AbortController();
    this.bombear();
  }

  parar(): void {
    this.ativo = false;
    this.controlador.abort();
    this.pendentes.clear();
    this.emVoo = 0;
  }

  /** Novo centro de interesse. Barato: só grava; a fila consulta na próxima vaga. */
  focar(indice: number, direcao: 1 | -1): void {
    this.foco = indice;
    this.direcao = direcao;
    if (this.ativo) this.bombear();
  }

  blob(indice: number): Blob | undefined {
    return this.blobs[indice];
  }

  temQuadro(indice: number): boolean {
    return this.blobs[indice] !== undefined;
  }

  progresso(): { carregados: number; total: number } {
    return { carregados: this.carregados, total: this.o.total };
  }

  /** Quadro carregado mais próximo de `indice`, ou -1 se nenhum chegou ainda. */
  maisProximoCarregado(indice: number): number {
    if (this.blobs[indice]) return indice;
    for (let d = 1; d < this.o.total; d++) {
      if (indice - d >= 0 && this.blobs[indice - d]) return indice - d;
      if (indice + d < this.o.total && this.blobs[indice + d]) return indice + d;
    }
    return -1;
  }

  private precisa(indice: number): boolean {
    return indice >= 0 && indice < this.o.total && !this.blobs[indice] && !this.pendentes.has(indice);
  }

  /** Próximo índice a baixar: primeiro a janela ao redor do playhead, depois a ordem estática. */
  private proximo(): number {
    const { atras, frente } = this.o;
    /* No sentido da rolagem primeiro: quem rola para baixo precisa de N+1 antes de N−1. */
    for (let d = 0; d <= frente; d++) {
      const i = this.foco + d * this.direcao;
      if (this.precisa(i)) return i;
    }
    for (let d = 1; d <= atras; d++) {
      const i = this.foco - d * this.direcao;
      if (this.precisa(i)) return i;
    }
    while (this.cursor < this.ordem.length) {
      const i = this.ordem[this.cursor];
      if (this.precisa(i)) return i;
      this.cursor++;
    }
    return -1;
  }

  private bombear(): void {
    while (this.ativo && this.emVoo < this.o.concorrencia) {
      const i = this.proximo();
      if (i < 0) return;
      this.pendentes.add(i);
      this.emVoo++;
      void this.baixar(i);
    }
  }

  private async baixar(indice: number): Promise<void> {
    const { signal } = this.controlador;
    try {
      /* Cache padrão do navegador: em produção os quadros vêm com `immutable` (ver
         `next.config.mjs`), então revisita não bate na rede; em desenvolvimento, regenerar a
         sequência continua sendo visto. */
      const resposta = await fetch(this.o.url(indice), { signal });
      if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
      const blob = await resposta.blob();
      if (signal.aborted) return;
      this.blobs[indice] = blob;
      this.carregados++;
      this.pendentes.delete(indice);
      this.o.onQuadro(indice);
    } catch (erro) {
      if (signal.aborted) return;
      this.pendentes.delete(indice);
      const n = (this.tentativas.get(indice) ?? 0) + 1;
      this.tentativas.set(indice, n);
      if (n < TENTATIVAS) {
        /* Volta para o fim da fila estática; se o playhead estiver perto, `proximo` o pega antes. */
        this.ordem.push(indice);
      } else {
        this.o.onErro?.(indice, erro);
      }
    } finally {
      if (!signal.aborted) {
        this.emVoo--;
        this.bombear();
      }
    }
  }
}

/** Fase 1 + fase 2 (passos 16, 8, 4, 2) + fase 3, sem repetições. Exportada para teste. */
export function montarOrdem(total: number, janelaInicial: number): number[] {
  const vistos = new Set<number>();
  const ordem: number[] = [];
  const poe = (i: number) => {
    if (i < 0 || i >= total || vistos.has(i)) return;
    vistos.add(i);
    ordem.push(i);
  };
  for (let i = 0; i < Math.min(janelaInicial, total); i++) poe(i);
  for (const passo of [16, 8, 4, 2]) for (let i = 0; i < total; i += passo) poe(i);
  for (let i = 0; i < total; i++) poe(i);
  return ordem;
}
