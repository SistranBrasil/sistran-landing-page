/**
 * Registro da instância única do Lenis.
 *
 * Existe porque quem abre um modal precisa parar o scroll suave, e o Lenis
 * escuta a roda no `window`: sem `stop()` a página continua deslizando atrás do
 * diálogo. `SmoothScroll` registra a instância no mount e limpa no unmount;
 * quem consome só pausa e retoma.
 *
 * Sob movimento reduzido o Lenis nunca é criado e as funções viram no-op. Quem
 * chama fica então com o bloqueio que já implementa por conta própria — o
 * cancelamento de `wheel` e `touchmove`. Ninguém aqui usa `overflow: hidden`
 * para isso, e não deve: mudar o overflow do html torna a viewport não rolável
 * e o navegador grampeia o offset em zero.
 */

type Pausable = {
  stop: () => void;
  start: () => void;
  scrollTo: (target: number, options?: { immediate?: boolean; force?: boolean }) => void;
};

let instance: Pausable | null = null;

export function registerSmoothScroll(next: Pausable | null) {
  instance = next;
}

export function pauseSmoothScroll() {
  instance?.stop();
}

export function resumeSmoothScroll() {
  instance?.start();
}

/**
 * Reposiciona o Lenis numa altura já aplicada ao documento.
 *
 * O Lenis guarda a própria posição animada, e ela não acompanha um
 * `window.scrollTo` feito por fora. Sem esta sincronização, o primeiro giro de
 * roda depois de restaurar o scroll salta de volta para o valor antigo. O
 * `force` é necessário porque `scrollTo` é ignorado enquanto a instância está
 * parada, e `immediate` evita animar a distância inteira.
 */
export function syncSmoothScroll(top: number) {
  instance?.scrollTo(top, { immediate: true, force: true });
}
