'use client';

import { createContext, useContext } from 'react';
import { SEM_CARIMBOS, type ArteCarimbo, type CarimbosEmUso } from '@/lib/carimbosTipos';

/**
 * O CONTEXTO DOS CARIMBOS TROCADOS PELO ADMIN.
 *
 * ⚠️ POR QUE CONTEXTO, e não prop descendo da página. Porque dos vinte pontos do
 * inventário, a maioria vive em COMPONENTE DE CLIENTE (`About`, `Accelerators`,
 * `ServicosPalco`, `TechnologiesSection`, `PartnerTerminalCards`, as páginas de
 * solução…). Componente de cliente não pode ser `async` nem ler a loja, e não
 * pode receber um componente de servidor por dentro. As duas saídas eram:
 *
 *   a) passar a arte resolvida como prop da página até cada seção — o que
 *      obrigaria a mexer na assinatura de uma dúzia de componentes e a atravessar
 *      níveis que nada têm a ver com carimbo;
 *   b) um provedor no layout raiz, que resolve UMA vez no servidor e publica o
 *      resultado para quem quiser ler.
 *
 * (b) toca dois arquivos em vez de doze e não muda a interface de ninguém.
 *
 * O valor é pequeno por desenho (só as exceções — ver `carimbosEmUso`), então
 * isto não é um contexto «grande» serializado em toda página: com zero trocas
 * ele é `{porLugar:{},porId:{}}`.
 */
const Contexto = createContext<CarimbosEmUso>(SEM_CARIMBOS);

export function CarimbosEmUsoProvider({
  valor,
  children,
}: {
  valor: CarimbosEmUso;
  children: React.ReactNode;
}) {
  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}

/**
 * A arte atribuída a um lugar, ou `undefined` se ninguém trocou.
 *
 * O `undefined` é o caminho NORMAL e não uma falha: ele significa «este lugar
 * está na arte original», que é o estado de todo o site antes da primeira
 * atribuição.
 */
export function useCarimboDoLugar(lugar: string): ArteCarimbo | undefined {
  return useContext(Contexto).porLugar[lugar];
}

/** A arte de um carimbo pelo id — o caminho do carimbo escolhido num evento. */
export function useCarimboPorId(id?: string): ArteCarimbo | undefined {
  const { porId } = useContext(Contexto);
  return id ? porId[id] : undefined;
}
