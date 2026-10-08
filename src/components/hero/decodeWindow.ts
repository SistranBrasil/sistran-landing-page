/**
 * DecodeWindow — mantém `ImageBitmap`s decodificados só ao redor do playhead.
 *
 * Por que não decodificar tudo: um quadro de 1440² decodificado ocupa ~8,3 MB; 365 deles seriam
 * ~3 GB. E por que não deixar o navegador decodificar na hora do `drawImage`: medido no Chrome
 * (07/10/2026), decodificar um quadro de 1440² custa ~30 ms (WebP ou AVIF) — o dobro do orçamento
 * de um frame. Então: `createImageBitmap(blob)` fora da thread principal, com antecedência, para
 * uma janela `[centro − atras, centro + frente]` virada para o sentido da rolagem; o que sai da
 * janela recebe `close()` na hora.
 *
 * O contrato com quem desenha é `pegar(i)` OU `maisProximoDecodificado(i)`: numa rolagem mais
 * rápida do que o decode consegue acompanhar, desenha-se o quadro decodificado mais próximo e a
 * cena fica um ou dois quadros atrás por alguns milissegundos — nunca em branco, nunca travada
 * num decode síncrono.
 */

export type DecodeWindowOpcoes = {
  total: number;
  atras: number;
  frente: number;
  /** Decodes simultâneos. 3 usa bem o pool de threads sem disputar com a rolagem. */
  paralelo: number;
  pegarBlob: (indice: number) => Blob | undefined;
  onPronto: (indice: number) => void;
  onErro?: (indice: number, erro: unknown) => void;
};

/* ⚠️ Testado e DESCARTADO em 08/10/2026: pedir o bitmap já no tamanho do canvas via
   `createImageBitmap(blob, { resizeWidth, resizeHeight, resizeQuality: 'high' })`. O decode em si
   roda fora da thread principal, mas no Chrome o RESIZE dessa opção roda (ao menos em parte) na
   principal: com 12 decodes em paralelo o rAF foi de p90 22 ms (sem resize) para p90 45 ms e
   máximo 62 ms (com resize), em build de produção. O blit 1:1 que isso compraria (0,36 ms contra
   3,3 ms do `drawImage` reduzindo) não paga esse bloqueio. */

/* Latência entre agendar um decode e poder desenhá-lo. Parte de ~20 ms de `createImageBitmap`
   (1152², medido com a máquina folgada) mais um tick de animação, e depois passa a ser MEDIDA: com a
   CPU disputada (medido em 08/10 com o antivírus corporativo varrendo) o mesmo decode leva 60–100 ms,
   e uma mira curta decodifica quadros que o playhead já passou quando o bitmap chega. */
const LATENCIA_INICIAL_MS = 40;
const LATENCIA_MIN_MS = 30;
const LATENCIA_MAX_MS = 400;

export class DecodeWindow {
  private readonly bitmaps = new Map<number, ImageBitmap>();
  private readonly decodificando = new Set<number>();
  private centro = 0;
  private direcao: 1 | -1 = 1;
  private encerrado = false;
  /* Velocidade do playhead em quadros/ms (média móvel), para mirar à frente. */
  private velocidade = 0;
  private ultimoCentro = 0;
  private ultimoInstante = 0;
  /* Duração média móvel de um decode, em ms. */
  private duracaoDecode = LATENCIA_INICIAL_MS;

  constructor(private readonly o: DecodeWindowOpcoes) {}

  private get latenciaMs(): number {
    /* 1,5× a duração média (a fila tem até `paralelo` em voo) + um tick de 60 Hz. */
    return Math.min(LATENCIA_MAX_MS, Math.max(LATENCIA_MIN_MS, this.duracaoDecode * 1.5 + 16));
  }

  pegar(indice: number): ImageBitmap | undefined {
    return this.bitmaps.get(indice);
  }

  maisProximoDecodificado(indice: number): number {
    if (this.bitmaps.has(indice)) return indice;
    let melhor = -1;
    let dist = Infinity;
    for (const i of this.bitmaps.keys()) {
      const d = Math.abs(i - indice);
      if (d < dist) {
        dist = d;
        melhor = i;
      }
    }
    return melhor;
  }

  /** Recalcula a janela e agenda decodes (mais perto do centro primeiro). Idempotente. */
  atualizar(centro: number, direcao: 1 | -1): void {
    if (this.encerrado) return;
    const agora = performance.now();
    if (this.ultimoInstante) {
      const dt = agora - this.ultimoInstante;
      if (dt > 0) {
        const v = (centro - this.ultimoCentro) / dt;
        /* Média móvel curta: reage a uma arrancada em dois ticks e não treme a cada um. */
        this.velocidade = this.velocidade * 0.5 + v * 0.5;
      }
    }
    this.ultimoCentro = centro;
    this.ultimoInstante = agora;
    this.centro = centro;
    this.direcao = direcao;
    const [ini, fim] = this.limites();

    for (const [i, bm] of this.bitmaps) {
      if (i < ini || i > fim) {
        bm.close();
        this.bitmaps.delete(i);
      }
    }
    this.agendar();
  }

  /** Chamado quando um blob novo chega: se está na janela, entra na fila de decode. */
  chegou(indice: number): void {
    const [ini, fim] = this.limites();
    if (indice >= ini && indice <= fim) this.agendar();
  }

  limpar(): void {
    this.encerrado = true;
    for (const bm of this.bitmaps.values()) bm.close();
    this.bitmaps.clear();
    this.decodificando.clear();
  }

  private limites(): [number, number] {
    const { atras, frente, total } = this.o;
    const a = this.direcao === 1 ? atras : frente;
    const f = this.direcao === 1 ? frente : atras;
    return [Math.max(0, this.centro - a), Math.min(total - 1, this.centro + f)];
  }

  private agendar(): void {
    const [ini, fim] = this.limites();
    /* MIRA À FRENTE. Ordenar pela distância ao centro ATUAL fazia a janela perseguir o playhead:
       decodificávamos sempre o quadro seguinte, que já tinha sido ultrapassado quando o bitmap
       chegava, e a cena congelava e saltava numa rolagem contínua (medido em 08/10/2026: atraso de
       decode p90 de 147–200 quadros a ~112 quadros/s). A ordem passa a ser pela distância ao
       ponto onde o playhead ESTARÁ quando o decode terminar (`centro + velocidade × latência`),
       limitado à janela. Parado, a mira é o próprio centro. */
    const mira = Math.min(fim, Math.max(ini, Math.round(this.centro + this.velocidade * this.latenciaMs)));
    const candidatos: number[] = [];
    for (let i = ini; i <= fim; i++) {
      if (this.bitmaps.has(i) || this.decodificando.has(i)) continue;
      if (!this.o.pegarBlob(i)) continue;
      candidatos.push(i);
    }
    candidatos.sort((a, b) => {
      const da = Math.abs(a - mira);
      const db = Math.abs(b - mira);
      if (da !== db) return da - db;
      return (a - mira) * this.direcao > 0 ? -1 : 1;
    });
    for (const i of candidatos) {
      if (this.decodificando.size >= this.o.paralelo) break;
      void this.decodificar(i);
    }
  }

  private async decodificar(indice: number): Promise<void> {
    const blob = this.o.pegarBlob(indice);
    if (!blob) return;
    this.decodificando.add(indice);
    const t0 = performance.now();
    try {
      const bm = await createImageBitmap(blob);
      this.duracaoDecode = this.duracaoDecode * 0.7 + (performance.now() - t0) * 0.3;
      if (this.encerrado) {
        bm.close();
        return;
      }
      const [ini, fim] = this.limites();
      if (indice < ini || indice > fim) {
        /* A janela andou enquanto decodificava: não vale guardar. */
        bm.close();
      } else {
        this.bitmaps.set(indice, bm);
        this.o.onPronto(indice);
      }
    } catch (erro) {
      this.o.onErro?.(indice, erro);
    } finally {
      this.decodificando.delete(indice);
      if (!this.encerrado) this.agendar();
    }
  }
}
