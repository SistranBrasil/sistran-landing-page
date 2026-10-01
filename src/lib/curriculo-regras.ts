/**
 * SIS-246 — a regra do arquivo de currículo, em UM lugar.
 *
 * Ela existia duas vezes e com dois valores: o campo anunciava «até 5 MB»
 * (`LIMITE_PADRAO` em `DemoForm.tsx`) e o servidor recusava a partir de 1 MB (o
 * padrão de `serverActions.bodySizeLimit`, que o `next.config.mjs` não definia).
 * Um PDF de 2 MB passava pela validação do navegador, era anunciado como aceito e
 * morria na requisição da action.
 *
 * Por isso este módulo não é `DemoForm.tsx`: o campo o lê para DESENHAR a regra e
 * a action o lê para IMPÔ-LA, e nenhum dos dois é dono dela. Mudar o limite aqui
 * muda o texto que o candidato vê e o que o servidor aceita no mesmo commit — era
 * a divergência entre os dois números que produzia o defeito.
 *
 * Não é um arquivo de servidor: `src/app/actions/` é `'use server'` e só pode
 * exportar funções async, então constante compartilhada entre cliente e servidor
 * tem de morar fora de lá. É o mesmo motivo de `contato-estado.ts` existir.
 */

/**
 * O endereço que o site ANUNCIA como canal de direitos do candidato (decisão de
 * 01/10/2026: o mesmo e-mail do destino).
 *
 * Ele mora aqui, e não só na action, porque é texto VISÍVEL: aparece no aviso de
 * privacidade e no cartão de sucesso do card de currículo. Escrito à mão nos dois
 * textos, divergiria do destino real no primeiro dia em que o RH trocasse de caixa
 * — e o site passaria a publicar um canal de direitos que não responde.
 *
 * É também o padrão de `CURRICULO_DESTINO` na action. Se a variável de ambiente
 * apontar para outra caixa, o destino do e-mail muda e este texto NÃO: são dois
 * papéis diferentes (quem recebe o currículo × quem atende pedido de exclusão), e
 * fundi-los exporia a caixa interna do RH na página. Quando divergirem de
 * propósito, é `NEXT_PUBLIC_CURRICULO_EMAIL` que define o endereço público.
 *
 * ── 01/10/2026, a dívida chegou antes do previsto ────────────────────────────
 * A dívida registrada na SIS-246 era «endereço PESSOAL, não institucional: se a
 * pessoa sair da empresa, o canal de direitos morre». O que apareceu primeiro foi
 * outra face do mesmo problema: o destino OFICIAL é uma caixa do RH à qual a
 * decisora NÃO TEM ACESSO. Com a decisão «canal publicado = destino» mantida, o
 * endereço aqui tem de poder mudar sem mudar código — senão o site publica um
 * canal de direitos que ninguém lê, que é pior que não publicar.
 *
 * Daí a variável de ambiente. O literal continua como PADRÃO, e não como valor
 * único, porque um texto visível não pode cair para vazio se a variável faltar.
 *
 * ⚠️ `NEXT_PUBLIC_` é inlinado na CONSTRUÇÃO, não lido em tempo de execução:
 * trocar o endereço exige **novo deploy**, não só salvar a variável na Vercel. É o
 * preço de o endereço aparecer em texto renderizado no cliente.
 */
/* SIS-246 — o endereço saiu do literal para o ambiente quando se descobriu que a
   caixa oficial do RH não é acessível a quem decidiu.
   | export const EMAIL_CURRICULO = 'maria.martinelli@sistran.com.br'; */
export const EMAIL_CURRICULO =
  process.env.NEXT_PUBLIC_CURRICULO_EMAIL ?? 'maria.martinelli@sistran.com.br';

/* Documento, não imagem e não executável. `.doc` entra porque currículo antigo
   ainda circula nesse formato. Era `ACEITE_PADRAO`, privado do `DemoForm`. */
export const ACEITE_CURRICULO = '.pdf,.doc,.docx';

/** Era `LIMITE_PADRAO`, privado do `DemoForm`. */
export const LIMITE_CURRICULO = 5 * 1024 * 1024;

/**
 * Assinatura de arquivo (os «magic bytes»), conferida no servidor.
 *
 * A extensão é escolha de quem envia: renomear `x.exe` para `x.pdf` passa pelo
 * `accept`, pelo `setCustomValidity` e por qualquer conferência de nome. Já estes
 * bytes são escritos pelo programa que gerou o arquivo, no começo dele.
 *
 * • `%PDF-` — PDF.
 * • `PK\x03\x04` — ZIP, e `.docx` é um ZIP (é também o que um `.zip` renomeado
 *   para `.docx` traria; o que se barra aqui é executável, não engenhosidade).
 * • `D0 CF 11 E0 A1 B1 1A E1` — o contêiner OLE2 do `.doc` antigo.
 *
 * Isto NÃO é varredura de malware, e não substitui uma. Quem abrir o anexo abre
 * arquivo de origem não confiável — está dito na issue e fica dito aqui.
 */
const ASSINATURAS: readonly { ext: readonly string[]; bytes: readonly number[] }[] = [
  { ext: ['.pdf'], bytes: [0x25, 0x50, 0x44, 0x46, 0x2d] },
  { ext: ['.docx'], bytes: [0x50, 0x4b, 0x03, 0x04] },
  { ext: ['.doc'], bytes: [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1] },
];

/** As extensões aceitas, já normalizadas — o campo e a action leem a mesma lista. */
export const extensoesCurriculo = () =>
  ACEITE_CURRICULO.split(',').map((e) => e.trim().toLowerCase());

/**
 * O conteúdo casa com a extensão que o nome anuncia?
 *
 * Recebe os bytes já lidos, e não o `File`: quem chama já precisou do `ArrayBuffer`
 * para montar o anexo do e-mail, e ler o arquivo duas vezes dobraria a memória do
 * processo por envio.
 */
export function assinaturaConfere(nome: string, bytes: Uint8Array): boolean {
  const minusculo = nome.toLowerCase();
  const regra = ASSINATURAS.find((a) => a.ext.some((e) => minusculo.endsWith(e)));
  /* Extensão fora da lista não chega aqui (a conferência de extensão vem antes),
     mas se chegasse, "sem assinatura conhecida" é reprovação e não aprovação. */
  if (!regra) return false;
  if (bytes.length < regra.bytes.length) return false;
  return regra.bytes.every((b, i) => bytes[i] === b);
}
