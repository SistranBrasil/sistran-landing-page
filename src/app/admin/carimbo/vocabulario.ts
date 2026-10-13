import type { Acabamento, Formato } from '@/app/admin/carimbo/desenhar';

/**
 * O VOCABULÁRIO VÁLIDO DA RECEITA, para a validação do servidor.
 *
 * ⚠️ POR QUE AS LISTAS SÃO LITERAIS AQUI, e não importadas de `desenhar.ts`.
 * Porque `acoes.ts` roda no servidor (`'use server'`), e importar o motor de
 * desenho de lá colocaria as 763 linhas dele no grafo do servidor — um módulo
 * escrito inteiro em cima de `CanvasRenderingContext2D`, que só existe no
 * navegador. O `import type` acima é APAGADO na compilação: não sobra import
 * nenhum em tempo de execução.
 *
 * ⚠️ E O QUE IMPEDE AS DUAS LISTAS DE SAIR DE SINCRONIA com o motor: a
 * verificação de tipo logo abaixo. Formato novo em `desenhar.ts` que não for
 * acrescentado aqui QUEBRA O BUILD, com erro apontando para esta linha. É de
 * propósito que seja erro de compilação e não aviso: uma lista de validação
 * incompleta recusa silenciosamente um formato legítimo, e o operador leria
 * «Formato desconhecido» sobre um botão que a própria tela mostrou.
 */
const FORMATOS = [
  'site',
  'capsule',
  'seal',
  'split',
  'ticket',
  'signature',
  'orbit',
  'monogram',
  'certificate',
] as const;

const ACABAMENTOS = ['outline', 'solid'] as const;

/* As duas pontas da conferência: toda string daqui é um valor do tipo (seta para
   dentro), e todo valor do tipo está aqui (seta para fora, pelo `Exclude` ser
   `never`). Só a segunda pega o caso que importa — formato criado no motor e
   esquecido aqui. */
type FaltandoFormato = Exclude<Formato, (typeof FORMATOS)[number]>;
type FaltandoAcabamento = Exclude<Acabamento, (typeof ACABAMENTOS)[number]>;
const _conferencia: [FaltandoFormato, FaltandoAcabamento] = [
  undefined as never,
  undefined as never,
];
void _conferencia;

export const FORMATOS_VALIDOS: readonly string[] = FORMATOS;
export const ACABAMENTOS_VALIDOS: readonly string[] = ACABAMENTOS;
