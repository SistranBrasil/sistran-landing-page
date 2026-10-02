'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useActionState, useCallback, useEffect, useState } from 'react';
import { criarEvento, eventoPublicado, salvarEvento, type EstadoSalvamento } from '../acoes';
import type { EventoBruto } from '@/lib/eventosArquivo';
import CampoArte from './CampoArte';
import PreviaEvento from './PreviaEvento';

/**
 * SIS-216 — o editor de um evento: campos, imagem e prévia.
 *
 * É componente de CLIENTE por um motivo só, e é de conteúdo: manter o que foi
 * digitado na tela quando a validação recusa. A alternativa toda-servidor (action
 * que redireciona com `?erro=`) seria menos código e apagaria a descrição que a
 * pessoa acabou de escrever — num campo de 400 caracteres, uma vez basta para
 * nunca mais confiarem na ferramenta.
 *
 * O mesmo estado que segura o texto na recusa é o que alimenta a prévia enquanto
 * se digita: por isso ela mora aqui, e não na página de servidor.
 *
 * ⚠️ CAMPOS CONTROLADOS, e não `defaultValue`, e isto foi MEDIDO e não deduzido:
 * com `<form action={fn}>` o React 19 RESETA o formulário quando a action
 * termina — inclusive quando ela recusa. A primeira versão deste arquivo usava
 * `defaultValue` e uma sonda de navegador mostrou o campo de descrição voltando
 * ao texto original depois da recusa, ou seja exatamente a perda que o
 * componente de cliente existia para evitar. Trocar por estado controlado é o
 * que faz o valor sobreviver, porque aí o `value` do React vence o reset.
 *
 * A action continua rodando no servidor: o que atravessa a fronteira é a
 * referência, e a conferência de senha está dentro dela.
 *
 * ⚠️ O MESMO FORMULÁRIO SERVE EDITAR E CRIAR — 01/10, quando criar evento passou a
 * existir. Não é economia de arquivo: eram os MESMOS onze campos com as mesmas regras, e
 * duas cópias divergem na primeira vez que alguém acrescentar um campo num lado só. O que
 * `modo` muda é pequeno e está marcado em cada lugar — o `id` (escondido ao editar,
 * digitável ao criar), a action, e a ausência do envio de arte na criação.
 */
/**
 * O `id` do formulário de cadastro, para os `<input type="file">` de `CampoArte` poderem
 * apontar para ele com `form=` morando fora dele.
 *
 * Constante, e não gerado por `useId()`: `useId` devolve texto com `:` nas pontas, que é
 * válido em atributo mas não em seletor CSS — e já houve confusão o bastante nesta tela.
 * Há um editor por página, então não há dois destes no documento.
 */
const ID_CADASTRO = 'cadastro-do-evento';

export default function FormularioEvento({
  evento,
  categorias,
  icones,
  imagens,
  miniaturas,
  modo = 'editar',
  naNuvem,
}: {
  evento: EventoBruto;
  categorias: { valor: string; rotulo: string }[];
  icones: string[];
  imagens: string[];
  miniaturas: string[];
  modo?: 'editar' | 'criar';
  /** Onde o salvamento vai cair, para a mensagem de sucesso não mentir. */
  naNuvem: boolean;
}) {
  const criando = modo === 'criar';
  const router = useRouter();
  const [estado, acao, pendente] = useActionState<EstadoSalvamento, FormData>(
    criando ? criarEvento : salvarEvento,
    { estado: 'inicial' },
  );

  /**
   * Criado, vai para a página do evento.
   *
   * ⚠️ O DESTINO É A PÁGINA DO EVENTO, e não a lista. A razão original era que o evento
   * nascia sem arte e era lá que o envio existia; desde 02/10 a arte pode subir já na
   * criação, e o destino continua certo por outro motivo — é onde se CONFERE o que acabou
   * de ser publicado, com a prévia e a moldura 16:9 ao lado do texto. A lista mostra
   * cartão pequeno e não deixa corrigir nada sem outro clique.
   *
   * O `push` fica num efeito, e não dentro da action, porque a action é compartilhada com
   * a edição — onde navegar embora seria errado — e porque `redirect()` no servidor
   * descartaria o estado de erro que este componente existe para preservar.
   */
  /**
   * ⚠️ A ESPERA ENTRE O «ok» E A NAVEGAÇÃO — 02/10, a pedido: «coloque uma tela de
   * carregamento em vez de eu precisar recarregar até aparecer».
   *
   * A linha que estava aqui era `router.push(...)` direto, e o problema dela não era
   * pressa: era navegar para uma página que pode responder 404. `criarEvento` devolve `ok`
   * depois de a loja aceitar a gravação, mas quem atende a navegação seguinte é outra
   * requisição — possivelmente outra instância — e a loja é consistente EVENTUALMENTE.
   * Chegar antes do documento propagar dá `notFound()`, que é terminal: não há o que
   * esperar numa tela de 404 a não ser recarregar na mão, que é exatamente a queixa.
   *
   * Então a navegação só acontece depois de `eventoPublicado` confirmar que o evento está
   * legível PELA MESMA função que a página vai usar para procurá-lo.
   *
   * ⚠️ E A ESPERA É LIMITADA, de propósito. Tela de carregamento infinita trocaria um
   * defeito visível por um invisível: se a produção não estiver conseguindo LER a loja —
   * outra falha possível, em que `lerDaNuvem` cai no `events.json` do pacote sem reclamar —
   * nenhuma quantidade de tentativas resolve, e um giro eterno esconderia isso. Passado o
   * limite, a tela diz o que aconteceu e oferece os dois caminhos reais.
   */
  /**
   * ⚠️ `esperando` É DERIVADO, e não `useState` com `setEsperando(true)` no efeito: a regra
   * `react-hooks/set-state-in-effect` marca o segundo, e com razão — não há nada a
   * sincronizar com o mundo de fora, a informação «a criação deu ok, logo estou esperando»
   * já está na mão. É o mesmo raciocínio que `CampoArte` registra em `previaPendente`.
   *
   * Fica verdadeiro no instante em que a ação devolve `ok` e só deixa de ser quando a
   * navegação desmonta este componente — que é exatamente a duração da espera.
   */
  const esperando = criando && estado.estado === 'ok';
  /* Este continua estado: ele nasce do TEMPO passando, que é mundo de fora, e quem o escreve
     é um callback assíncrono — não o corpo do efeito. */
  const [demorou, setDemorou] = useState(false);

  useEffect(() => {
    if (!criando || estado.estado !== 'ok') return;
    const alvo = estado.id;
    /* `cancelado` porque o componente pode sair de cena no meio (a própria navegação o
       desmonta) e aí `setDemorou` num componente morto é aviso de React e laço solto. */
    let cancelado = false;

    (async () => {
      /* 20 voltas de 1,5s ≈ 30s. O piso de cache do Blob é de um minuto, mas ele deixou de
         pesar aqui: a leitura passou a usar chave única (ver `lerDaNuvem`), então o que
         resta de espera é só a propagação dos metadados — segundos, não minutos. */
      for (let volta = 0; volta < 20; volta += 1) {
        if (cancelado) return;
        if (await eventoPublicado(alvo)) {
          if (!cancelado) router.push(`/admin/eventos/${alvo}`);
          return;
        }
        await new Promise((segue) => setTimeout(segue, 1500));
      }
      if (!cancelado) setDemorou(true);
    })();

    return () => {
      cancelado = true;
    };
  }, [criando, estado, router]);
  const [valores, setValores] = useState<EventoBruto>(evento);
  const trocar = <C extends keyof EventoBruto>(campo: C, valor: EventoBruto[C]) =>
    setValores((atual) => ({ ...atual, [campo]: valor }));

  /**
   * Quando o upload conclui, ele já gravou os caminhos no JSON. Refletir aqui é
   * o que impede a próxima gravação do formulário de reescrever o campo com o
   * caminho ANTIGO — que era o que o estado ainda guardava.
   *
   * `useCallback` porque o `CampoArte` chama isto dentro de um efeito: uma função
   * nova a cada render entraria no laço de dependências e o efeito rodaria sem parar.
   */
  const aoPublicarArte = useCallback((image: string, thumb: string) => {
    setValores((atual) => ({ ...atual, image, thumb }));
  }, []);

  /* Os caminhos recém-enviados podem ainda não estar na lista que veio do
     servidor (ela foi lida antes do upload) — sem isto, o `<select>` ficaria
     apontando para um valor que não existe entre as suas opções e o navegador
     mostraria a primeira opção, mentindo sobre o que está gravado. */
  const comAtual = (lista: string[], atual?: string) =>
    atual && !lista.includes(atual) ? [atual, ...lista] : lista;

  const rotulo = 'block font-mono text-[11px] uppercase tracking-[0.16em] text-[#667085]';
  const campo =
    'mt-2 w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-[#0f172a] outline-none transition-colors focus:border-[#0079cb] focus:ring-4 focus:ring-[#0079cb]/10';

  return (
    <div className="mt-8 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
      {/**
       * A TELA DE ESPERA da criação. `fixed inset-0` cobrindo tudo porque o formulário
       * abaixo não aceita mais nada de útil: o evento já foi gravado, e reenviar daria
       * «já existe um evento com este identificador». Cobrir é mais honesto que deixar
       * campos clicáveis que só produzem erro.
       */}
      {esperando && (
        <div
          role="status"
          aria-live="polite"
          className="fixed inset-0 z-50 grid place-items-center bg-[#0f172a]/55 px-4 backdrop-blur-sm"
        >
          <div className="w-[min(30rem,100%)] rounded-2xl bg-white p-7 text-center shadow-[0_24px_64px_rgba(16,24,40,0.28)]">
            {demorou ? (
              <>
                <h2 className="text-lg font-medium text-[#0f172a]">
                  O evento foi gravado, mas ainda não aparece
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-[#475467]">
                  A gravação foi aceita — o evento existe. O que não aconteceu em 30 segundos
                  foi ele voltar na leitura do catálogo, e isso não é coisa que mais espera
                  resolva.
                </p>
                <p className="mt-2 text-sm leading-relaxed text-[#475467]">
                  {/* Dito porque muda o que ela faz em seguida: se o catálogo publicado não
                      está sendo lido, criar de novo só vai bater em «já existe». */}
                  Abra a lista: se o evento estiver lá, foi só demora e está tudo certo. Se
                  não estiver, a leitura do catálogo está caindo no arquivo do pacote — e aí
                  é configuração do servidor, não algo a repetir aqui.
                </p>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                  <Link
                    href="/admin/eventos"
                    className="rounded-full bg-[#0079cb] px-4 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-white no-underline"
                  >
                    ver a lista
                  </Link>
                  <Link
                    href={`/admin/eventos/${estado.estado === 'ok' ? estado.id : ''}`}
                    className="rounded-full border border-black/10 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-[#344054] no-underline"
                  >
                    tentar abrir o evento
                  </Link>
                </div>
              </>
            ) : (
              <>
                {/* `animate-spin` do Tailwind; o `aria-hidden` evita o leitor de tela
                    anunciar um anel decorativo — quem fala é o texto abaixo, dentro do
                    `role="status"`. */}
                <div
                  aria-hidden
                  className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-[#0079cb]/25 border-t-[#0079cb]"
                />
                <h2 className="mt-5 text-lg font-medium text-[#0f172a]">Publicando o evento…</h2>
                <p className="mt-2 text-sm leading-relaxed text-[#475467]">
                  Já está gravado. Esperando ele aparecer no catálogo para abrir a página —
                  costuma levar poucos segundos.
                </p>
              </>
            )}
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* ⚠️ AGORA EXISTE NA CRIAÇÃO TAMBÉM — 02/10, a pedido. A nota anterior dizia que
            não podia existir, e o argumento era este: «`enviarArte` publica os binários E
            JÁ APONTA o catálogo para eles, o que exige uma linha de catálogo para apontar.
            Antes de o evento existir não há o que atualizar, e o upload deixaria dois
            arquivos órfãos na loja se a pessoa desistisse do formulário.»

            As duas metades continuam verdadeiras e nenhuma das duas foi ignorada: quem
            publica na criação não é `enviarArte`, é `criarEvento`, que grava a linha e os
            binários na MESMA submissão — e ele valida o cadastro inteiro antes de mandar
            byte nenhum, que é o que fecha a porta do órfão (ver o docblock de lá).

            `modo="criar"` desliga o botão próprio e manda os arquivos pelo `form=` abaixo. */}
        <CampoArte
          id={evento.id}
          image={valores.image}
          thumb={valores.thumb}
          naNuvem={naNuvem}
          onPublicado={aoPublicarArte}
          modo={modo}
          formId={ID_CADASTRO}
        />

        <form
          id={ID_CADASTRO}
          action={acao}
          className="rounded-2xl border border-black/[0.07] bg-white p-5"
        >
          {/* Ao EDITAR o id viaja escondido porque é a CHAVE da linha no catálogo, não um
              dado editável: trocá-lo seria criar outro evento e perder o de origem. Ao
              CRIAR ele é escolhido — uma vez, e nunca mais. */}
          {criando ? (
            <div className="mb-5">
              <label className={rotulo} htmlFor="id">
                Identificador
              </label>
              <input
                id="id"
                name="id"
                value={valores.id}
                onChange={(e) => trocar('id', e.target.value)}
                placeholder="web-summit-ai"
                className={`${campo} font-mono`}
              />
              <p className="mt-2 text-xs leading-relaxed text-[#667085]">
                Minúsculas sem acento, números e hífen. Vira o endereço do evento no admin e
                não pode ser trocado depois.
              </p>
            </div>
          ) : (
            <input type="hidden" name="id" value={evento.id} />
          )}

          <h2 className="text-lg font-medium text-[#0f172a]">Texto e classificação</h2>

          {estado.estado === 'ok' && (
            <p className="mt-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm leading-relaxed text-emerald-800">
              {/* ⚠️ A FRASE ANTIGA ERA «Salvo em src/data/events.json. Faça commit do arquivo
                  para publicar.» e virou mentira em produção: com a loja no Blob não há
                  arquivo para commitar, e o visitante já está vendo a mudança. Sem token o
                  texto antigo continua sendo o verdadeiro — daí os dois. */}
              {naNuvem
                ? criando
                  ? 'Evento criado e já publicado no site. Abrindo o evento…'
                  : 'Salvo e já publicado em /eventos-inovacao.'
                : 'Salvo em src/data/events.json. Faça commit do arquivo para publicar.'}
            </p>
          )}
          {estado.estado === 'erro' && (
            <ul
              role="alert"
              className="mt-4 space-y-1 rounded-lg bg-red-50 px-3 py-2 text-sm leading-relaxed text-red-700"
            >
              {estado.erros.map((erro) => (
                <li key={erro}>{erro}</li>
              ))}
            </ul>
          )}

          <div className="mt-5 space-y-5">
            <div>
              <label className={rotulo} htmlFor="title">
                Título
              </label>
              <input
                id="title"
                name="title"
                value={valores.title}
                onChange={(e) => trocar('title', e.target.value)}
                className={campo}
              />
            </div>

            <div>
              <label className={rotulo} htmlFor="description">
                Descrição
              </label>
              <textarea
                id="description"
                name="description"
                rows={7}
                value={valores.description}
                onChange={(e) => trocar('description', e.target.value)}
                className={campo}
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className={rotulo} htmlFor="kind">
                  Categoria
                </label>
                <select
                  id="kind"
                  name="kind"
                  value={valores.kind}
                  onChange={(e) => trocar('kind', e.target.value)}
                  className={campo}
                >
                  {categorias.map((c) => (
                    <option key={c.valor} value={c.valor}>
                      {c.rotulo}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={rotulo} htmlFor="icon">
                  Ícone
                </label>
                <select
                  id="icon"
                  name="icon"
                  value={valores.icon}
                  onChange={(e) => trocar('icon', e.target.value)}
                  className={campo}
                >
                  {icones.map((nome) => (
                    <option key={nome} value={nome}>
                      {nome}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Listas, e não campo de texto: o caminho existe por construção. Digitar à
                mão erra a caixa das letras, e caixa errada só quebra depois do deploy —
                Windows ignora, Linux e CloudFront não. Continuam aqui, ao lado do
                upload, porque reaproveitar uma arte de outro ano é trabalho legítimo. */}
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className={rotulo} htmlFor="image">
                  Arte já na pasta
                </label>
                <select
                  id="image"
                  name="image"
                  value={valores.image ?? ''}
                  onChange={(e) => trocar('image', e.target.value)}
                  className={campo}
                >
                  <option value="">— sem arte —</option>
                  {comAtual(imagens, valores.image).map((caminho) => (
                    <option key={caminho} value={caminho}>
                      {caminho.replace('/images/EVENTOS/', '')}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={rotulo} htmlFor="thumb">
                  Miniatura já na pasta
                </label>
                <select
                  id="thumb"
                  name="thumb"
                  value={valores.thumb ?? ''}
                  onChange={(e) => trocar('thumb', e.target.value)}
                  className={campo}
                >
                  <option value="">— sem miniatura —</option>
                  {comAtual(miniaturas, valores.thumb).map((caminho) => (
                    <option key={caminho} value={caminho}>
                      {caminho.replace('/images/EVENTOS/thumb/', '')}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-wrap gap-6">
              <label className="flex items-center gap-2 text-sm text-[#344054]">
                <input
                  type="checkbox"
                  name="featured"
                  checked={valores.featured === true}
                  onChange={(e) => trocar('featured', e.target.checked)}
                />
                Destaque editorial
              </label>
              <label className="flex items-center gap-2 text-sm text-[#344054]">
                <input
                  type="checkbox"
                  name="youtube"
                  checked={valores.youtube === true}
                  onChange={(e) => trocar('youtube', e.target.checked)}
                />
                Tem gravação no YouTube
              </label>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-5 border-t border-black/[0.07] pt-5">
            <button
              type="submit"
              disabled={pendente}
              className="rounded-full bg-[#0f172a] px-5 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-white transition-opacity disabled:opacity-40"
            >
              {pendente ? 'Salvando…' : criando ? 'Criar evento' : 'Salvar texto'}
            </button>
            <Link href="/admin/eventos" className="text-sm text-[#667085] no-underline hover:text-[#0079cb]">
              Voltar à lista
            </Link>
          </div>
        </form>
      </div>

      {/* Grudada: a prévia serve para ser olhada ENQUANTO se digita, e um painel
          que sobe com a rolagem obriga a rolar de volta a cada frase. */}
      <div className="lg:sticky lg:top-20">
        <PreviaEvento valores={valores} />
      </div>
    </div>
  );
}
