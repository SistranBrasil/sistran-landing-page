import Link from 'next/link';
import { ICONS } from '@/lib/icons';
import { EVENT_KINDS, EVENT_KIND_META, type EventKind } from '@/data/events';
import { artesDisponiveis } from '@/lib/eventosArquivo';
import { naNuvem } from '@/lib/eventosLoja';
import FormularioEvento from '../[id]/FormularioEvento';

/**
 * CRIAR EVENTO — 01/10, a operação que não existia.
 *
 * ⚠️ `novo` CONVIVE COM `[id]` SEM CONFLITO, e vale dizer por que não é sorte: no App
 * Router o segmento ESTÁTICO vence o dinâmico, então `/admin/eventos/novo` cai aqui e
 * nunca em `[id]` tentando achar um evento chamado "novo". A consequência prática é que
 * `novo` fica RESERVADO — um evento com esse id existiria no catálogo e seria inalcançável
 * pelo admin. `criarEvento` não barra o nome porque o preço de errar é ter de renomear um
 * id, e a lista de palavras reservadas envelheceria pior que isso.
 *
 * ⚠️ O FORMULÁRIO É O MESMO DA EDIÇÃO, importado de `../[id]/FormularioEvento` — ver a
 * nota de `modo` lá. Importar de dentro de uma pasta `[id]` parece esquisito e é
 * deliberado: mover o arquivo para um lugar "neutro" seria um diff grande em código que
 * funciona, e a pasta dinâmica não tem significado nenhum para o bundler.
 *
 * `force-dynamic` pelo mesmo motivo das outras duas: a lista de artes e a conferência de
 * id unico dependem do estado de agora, não do build.
 */
export const dynamic = 'force-dynamic';

export default function AdminEventoNovoPage() {
  const { imagens, miniaturas } = artesDisponiveis();

  return (
    <>
      <Link
        href="/admin/eventos"
        className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#667085] no-underline hover:text-[#0079cb]"
      >
        ← todos os eventos
      </Link>
      <h1 className="mt-5 text-3xl font-medium tracking-tight text-[#0f172a]">Novo evento</h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#667085]">
        O evento entra no FIM da lista e aparece em{' '}
        <span className="font-mono text-[#0079cb]">/eventos-inovacao</span> assim que for
        criado — com a imagem, se você escolher uma aqui. A posição se ajusta depois, pelas
        setas da lista.
      </p>

      <FormularioEvento
        modo="criar"
        naNuvem={naNuvem()}
        /* O evento em branco. `kind` e `icon` já nascem com o primeiro valor válido de cada
           lista porque um `<select>` controlado com `value=""` mostraria a primeira opção
           enquanto o estado diz outra coisa — mentindo sobre o que vai ser gravado. */
        evento={{
          id: '',
          title: '',
          kind: EVENT_KINDS[0],
          icon: Object.keys(ICONS).sort()[0],
          description: '',
        }}
        categorias={EVENT_KINDS.map((valor) => ({
          valor,
          rotulo: EVENT_KIND_META[valor as EventKind].label,
        }))}
        icones={Object.keys(ICONS).sort()}
        imagens={imagens}
        miniaturas={miniaturas}
      />
    </>
  );
}
