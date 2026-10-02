'use client';

import Image from 'next/image';
import { useActionState, useCallback, useEffect, useRef, useState } from 'react';
import { enviarArte, type EstadoArte } from '../acoes';
import {
  ARTE_ALTURA,
  ARTE_LARGURA,
  ONDE_APARECE,
  PROPORCAO,
  THUMB_ALTURA,
  THUMB_LARGURA,
} from '../arte';

/**
 * SIS-216 — o campo de trocar a foto do evento.
 *
 * ── Por que o corte é feito AQUI, no navegador ────────────────────────────────
 * `EventsSpotlight` desenha a arte em 1672×941 e a miniatura em 240×135: 16:9. A
 * foto que a pessoa tem na mão vem do celular, quase sempre 4:3 ou 3:4. Sem corte
 * explícito, o `object-fit` do CSS decidiria sozinho o que sai do quadro — e o que
 * sai da parte de cima de uma foto vertical é a cabeça de quem está no palco.
 *
 * Cortando aqui, o recorte é MOSTRADO antes de enviar: a moldura da prévia é o
 * arquivo que vai ser gravado, não uma aproximação dele.
 *
 * O redimensionamento usa `canvas` porque `sharp` não é dependência declarada
 * deste projeto (a razão longa está em `gravarArte`). De quebra, o que sobe pela
 * rede são ~100 kB em vez dos 6 MB do original.
 *
 * ── Por que, AO EDITAR, é um <form> separado do formulário do evento ──────────
 * HTML não permite formulário dentro de formulário, e juntar os dois numa submissão
 * só significaria que um título mal digitado impediria a foto de subir, e vice-versa.
 * Trocar a foto e revisar o texto são dois trabalhos; cada um tem seu botão.
 *
 * ── E por que, AO CRIAR, é o contrário ────────────────────────────────────────
 * 02/10, a pedido. Na criação não há o que separar: antes de o evento existir não há
 * foto a trocar nem texto a revisar — há um cadastro só, que nasce inteiro ou não nasce.
 * Então aqui os dois `<input type="file">` escondidos viajam NA SUBMISSÃO DO CADASTRO,
 * e quem recebe é `criarEvento`.
 *
 * ⚠️ O MECANISMO É O ATRIBUTO `form=`, e não aninhar nada: um `<input form="id-do-outro">`
 * é enviado com AQUELE formulário mesmo morando fora dele. É HTML de sempre e é o que
 * permite manter este bloco como componente irmão — com prévia, aviso de origem pequena e
 * moldura 16:9 — sem duplicar uma linha dele para a tela de criar.
 */
export default function CampoArte({
  id,
  image,
  thumb,
  naNuvem,
  onPublicado,
  modo = 'editar',
  formId,
}: {
  id: string;
  image?: string;
  thumb?: string;
  /** Onde a arte caiu, para a mensagem de sucesso não pedir um commit que não existe. */
  naNuvem: boolean;
  onPublicado: (image: string, thumb: string) => void;
  modo?: 'editar' | 'criar';
  /** Ao CRIAR, o `id` do formulário de cadastro com que os arquivos devem ser enviados. */
  formId?: string;
}) {
  const criando = modo === 'criar';
  const [estado, acao, pendente] = useActionState<EstadoArte, FormData>(enviarArte, {
    estado: 'inicial',
  });
  const [previa, setPrevia] = useState<string | null>(null);
  const [jaEnviada, setJaEnviada] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);
  /** As medidas do arquivo escolhido, para dizer quando ele é pequeno demais. */
  const [origem, setOrigem] = useState<{ largura: number; altura: number } | null>(null);
  const arte = useRef<HTMLInputElement>(null);
  const miniatura = useRef<HTMLInputElement>(null);
  const escolher = useRef<HTMLInputElement>(null);
  /** Os dois webp já convertidos, para poder REANEXÁ-LOS — ver o efeito do reset. */
  const convertidos = useRef<{ grande: Blob; pequena: Blob } | null>(null);

  /**
   * Põe os dois blobs nos `<input type="file">` escondidos.
   *
   * `DataTransfer` é o único jeito de atribuir `files` por script, e é o que permite
   * mandá-los pela submissão de formulário da Server Function sem inventar um endpoint de
   * API só para isto.
   */
  const anexar = useCallback((par: { grande: Blob; pequena: Blob }) => {
    const por = (campo: HTMLInputElement | null, blob: Blob, nome: string) => {
      if (!campo) return;
      const bolsa = new DataTransfer();
      bolsa.items.add(new File([blob], nome, { type: 'image/webp' }));
      campo.files = bolsa.files;
    };
    por(arte.current, par.grande, 'arte.webp');
    por(miniatura.current, par.pequena, 'miniatura.webp');
  }, []);

  /**
   * ⚠️ REANEXAR DEPOIS DO RESET, e isto conserta PERDA SILENCIOSA DE ARQUIVO — 02/10,
   * encontrado no log de uma criação recusada e repetida.
   *
   * O que acontecia: com `<form action={fn}>` o React 19 reseta o formulário quando a
   * action termina, INCLUSIVE quando ela recusa — `FormularioEvento` já registra isso como
   * medido, e é por isso que os campos de texto dele são controlados. O que faltou ver é
   * que o reset do React é o NATIVO (`formElement.reset()`, conferido em
   * `react-dom-client`), e `HTMLFormElement.reset()` limpa todos os controles associados ao
   * formulário — os ligados por `form=` junto com os que moram dentro dele, e `files` de
   * `<input type="file">` volta a vazio.
   *
   * O estrago era o pior tipo: a PRÉVIA sobrevive, porque é estado de React e não campo de
   * formulário. Então a tela continuava mostrando a imagem escolhida com o selo «ainda não
   * enviada» enquanto os arquivos já não existiam mais — corrigir o erro recusado e clicar
   * de novo criava o evento SEM a arte, sem nada na tela indicando isso. A tela mentia.
   *
   * O ouvinte é do evento `reset` nativo e a reanexação é DEFERIDA de propósito: pelo
   * algoritmo da especificação o evento é disparado ANTES de os controles serem limpos, e
   * reanexar dentro do ouvinte seria escrever nos campos um instante antes de o navegador
   * apagá-los.
   */
  useEffect(() => {
    /* Ao criar, o formulário é o do cadastro, que mora fora deste componente; ao editar, é
       o pai dos próprios campos. `arte.current.form` resolve os dois, porque o navegador
       já aponta `form` para o formulário ASSOCIADO, inclusive via atributo `form=`. */
    const formulario = arte.current?.form;
    if (!formulario) return;
    const aoResetar = () => {
      const par = convertidos.current;
      if (par) setTimeout(() => anexar(par), 0);
    };
    formulario.addEventListener('reset', aoResetar);
    return () => formulario.removeEventListener('reset', aoResetar);
  }, [anexar]);

  /* Avisar o formulário vizinho para que a prévia e os `<select>` passem a apontar
     para o arquivo novo sem recarregar a página. */
  useEffect(() => {
    if (estado.estado === 'ok') onPublicado(estado.image, estado.thumb);
  }, [estado, onPublicado]);

  /* `URL.createObjectURL` reserva memória até alguém revogar. Sem isto, trocar de
     foto cinco vezes deixa cinco imagens presas no processo. */
  useEffect(() => () => { if (previa) URL.revokeObjectURL(previa); }, [previa]);

  /**
   * ⚠️ POR QUE ISTO VIROU UMA ESCADA — 01/10, depois de a imagem escolhida ser descrita
   * como «horrível».
   *
   * A versão anterior fazia o trabalho inteiro num `drawImage` só: pegava a foto como ela
   * veio — tipicamente 4000 px de largura, vinda de celular — e desenhava direto em
   * 1672 px, ou pior, em 240 px. São reduções de 2,4× e de 16,7× num passo, e é aí que o
   * canvas estraga a imagem: o `drawImage` amostra um punhado de pixels da origem e
   * DESCARTA o resto, então detalhe fino (texto do cartaz, grade de janelas, textura de
   * roupa) não fica suave — vira serrilha e cintilação. Não era o `0.9` do webp nem o
   * formato; era a reamostragem.
   *
   * Duas correções, as duas necessárias:
   *
   * 1. `imageSmoothingQuality = 'high'`. O padrão é `'low'`, e o nome não é exagero: é a
   *    diferença entre interpolar com os vizinhos imediatos e interpolar de verdade. Era a
   *    linha que faltava, e ela é de graça.
   *
   * 2. REDUZIR EM ETAPAS, nunca mais que a metade por passo. Com 2× por vez cada pixel de
   *    destino é a média de quatro da origem, que é o caso em que a interpolação tem o que
   *    interpolar. 4000 → 1672 vira 4000 → 2000 → 1672; 4000 → 240 vira cinco passos. Custa
   *    alguns canvas temporários num clique e é o que o `sharp` faria do lado do servidor,
   *    se ele fosse dependência deste projeto (a razão de não ser está em `gravarArte`).
   */
  function tela(largura: number, altura: number) {
    const quadro = document.createElement('canvas');
    quadro.width = largura;
    quadro.height = altura;
    const pincel = quadro.getContext('2d');
    if (!pincel) throw new Error('canvas 2d indisponível neste navegador');
    pincel.imageSmoothingEnabled = true;
    pincel.imageSmoothingQuality = 'high';
    return { quadro, pincel };
  }

  /**
   * Redimensiona com CORTE CENTRAL (o mesmo que `object-fit: cover` faria). Devolve webp,
   * que é o formato de todas as artes já publicadas.
   */
  async function reduzir(bitmap: ImageBitmap, largura: number, altura: number): Promise<Blob> {
    /* O recorte 16:9 medido em pixels DA ORIGEM: a maior área centrada que tem a
       proporção do destino. Recortar antes de escalar é o que evita escalar pixels que
       vão ser jogados fora de qualquer jeito. */
    const escala = Math.min(bitmap.width / largura, bitmap.height / altura);
    const recorteL = Math.round(largura * escala);
    const recorteA = Math.round(altura * escala);
    const recorteX = Math.round((bitmap.width - recorteL) / 2);
    const recorteY = Math.round((bitmap.height - recorteA) / 2);

    /* A escada de tamanhos, do recorte até o destino, sem nenhum passo acima de 2×. O
       primeiro passo é desenhado a partir do bitmap (já recortado); os seguintes, de um
       canvas para o outro. Quando a origem já é pequena, a lista tem um degrau só. */
    const degraus: [number, number][] = [];
    let l = recorteL;
    let a = recorteA;
    while (l > largura * 2) {
      l = Math.max(Math.round(l / 2), largura);
      a = Math.max(Math.round(a / 2), altura);
      degraus.push([l, a]);
    }
    degraus.push([largura, altura]);

    let anterior: HTMLCanvasElement | null = null;
    for (const [passoL, passoA] of degraus) {
      const { quadro, pincel } = tela(passoL, passoA);
      if (anterior) pincel.drawImage(anterior, 0, 0, passoL, passoA);
      else {
        pincel.drawImage(bitmap, recorteX, recorteY, recorteL, recorteA, 0, 0, passoL, passoA);
      }
      anterior = quadro;
    }

    /* `degraus` nunca é vazio — o destino é sempre o último degrau — mas afirmar isso com
       um `as` esconderia o dia em que alguém mexer na montagem da lista. */
    if (!anterior) throw new Error('nenhum degrau de redução foi gerado');

    const blob = await new Promise<Blob | null>((resolver) =>
      anterior.toBlob(resolver, 'image/webp', 0.9),
    );
    if (!blob) throw new Error('o navegador não conseguiu gerar o webp');
    return blob;
  }

  async function aoEscolher(evento: React.ChangeEvent<HTMLInputElement>) {
    const arquivo = evento.target.files?.[0];
    if (!arquivo) return;
    setAviso(null);
    try {
      const bitmap = await createImageBitmap(arquivo);
      setOrigem({ largura: bitmap.width, altura: bitmap.height });
      const [grande, pequena] = await Promise.all([
        reduzir(bitmap, ARTE_LARGURA, ARTE_ALTURA),
        reduzir(bitmap, THUMB_LARGURA, THUMB_ALTURA),
      ]);
      bitmap.close();

      /* Guardados ANTES de anexar: é desta cópia que o efeito de `reset` reanexa. */
      convertidos.current = { grande, pequena };
      anexar(convertidos.current);

      if (previa) URL.revokeObjectURL(previa);
      setPrevia(URL.createObjectURL(grande));
    } catch (causa) {
      setAviso(
        `Não foi possível preparar esta imagem: ${causa instanceof Error ? causa.message : String(causa)}`,
      );
    }
  }

  const atual = image ?? thumb;

  /**
   * A moldura só mostra o `blob:` local ENQUANTO ele for uma escolha pendente.
   * Depois de publicar, o arquivo existe em disco e é ele que tem de aparecer —
   * a primeira versão deixava o selo "ainda não enviada" em cima de uma imagem já
   * gravada, o que foi visto em captura de navegador.
   *
   * Isto é derivado do estado em vez de zerado num efeito, de propósito: o
   * `setState` dentro de efeito é o que a regra `react-hooks/set-state-in-effect`
   * marca, e aqui não há nada a sincronizar com o mundo de fora — a informação
   * "esta prévia já foi enviada" já está na mão.
   */
  const previaPendente =
    previa && !(previa === jaEnviada && estado.estado === 'ok') ? previa : null;

  /* Ao criar, os arquivos são enviados com o formulário de cadastro; ao editar, com o
     `<form>` logo abaixo, que é o pai deles. */
  const elo = criando && formId ? { form: formId } : {};

  /** Os dois arquivos convertidos; a pessoa nunca os vê. */
  const escondidos = (
    <>
      <input ref={arte} type="file" name="arte" accept="image/webp" hidden {...elo} />
      <input ref={miniatura} type="file" name="miniatura" accept="image/webp" hidden {...elo} />
    </>
  );

  const seletor = (
    <div className="mt-4 flex flex-wrap items-center gap-3">
      <input
        ref={escolher}
        id="arquivo"
        type="file"
        accept="image/*"
        onChange={aoEscolher}
        className="sr-only"
      />
      <label
        htmlFor="arquivo"
        className="cursor-pointer rounded-full border border-black/10 bg-white px-4 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-[#344054] transition-colors hover:border-[#0079cb]/40 hover:text-[#0079cb]"
      >
        Escolher imagem
      </label>
      {/* ⚠️ SEM BOTÃO PRÓPRIO AO CRIAR: quem publica é o «Criar evento» do cadastro. Um
          segundo botão aqui prometeria enviar a foto para um evento que ainda não tem
          linha no catálogo — e `criarEvento` recusaria, com razão. */}
      {criando ? (
        <p className="text-sm leading-relaxed text-[#667085]">
          Ela sobe junto com o botão <strong className="font-medium">Criar evento</strong>.
        </p>
      ) : (
        <button
          type="submit"
          disabled={pendente || !previaPendente}
          className="rounded-full bg-[#0079cb] px-4 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-white transition-opacity disabled:opacity-40"
        >
          {pendente ? 'Enviando…' : 'Publicar imagem'}
        </button>
      )}
    </div>
  );

  return (
    /* ⚠️ A MOLDURA EXTERNA É SEMPRE `<div>` — ela era o próprio `<form>` até 02/10. Na
       criação não pode haver formulário aqui: o `form=` dos arquivos aponta para o
       cadastro, e um `<form>` vazio em volta deles só acrescentaria um alvo de submissão
       que nunca deveria ser submetido. */
    <div className="rounded-2xl border border-black/[0.07] bg-white p-5">
      <h2 className="text-lg font-medium text-[#0f172a]">Imagem do evento</h2>
      <p className="mt-1 text-sm leading-relaxed text-[#667085]">
        Um arquivo só. Ele é recortado em 16:9 e gravado em dois tamanhos:
      </p>
      <ul className="mt-3 space-y-2 text-sm leading-relaxed text-[#475467]">
        <li>
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#0079cb]">
            {ARTE_LARGURA}×{ARTE_ALTURA}
          </span>{' '}
          — {ONDE_APARECE.arte}
        </li>
        <li>
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#0079cb]">
            {THUMB_LARGURA}×{THUMB_ALTURA}
          </span>{' '}
          — {ONDE_APARECE.thumb}
        </li>
      </ul>

      <div
        className="relative mt-5 overflow-hidden rounded-xl border border-dashed border-black/15 bg-[#f4f5f7]"
        style={{ aspectRatio: PROPORCAO }}
      >
        {previaPendente ? (
          /* `<img>` cru, e não `next/image`: a origem é um `blob:` que só existe
             nesta aba, então não há o que otimizar nem dimensão conhecida. */
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={previaPendente}
            alt="Recorte que será gravado"
            className="h-full w-full object-cover"
          />
        ) : atual ? (
          <Image src={atual} alt="Imagem publicada hoje" fill className="object-cover" />
        ) : (
          <p className="absolute inset-0 grid place-items-center font-mono text-[11px] uppercase tracking-[0.14em] text-[#98a2b3]">
            sem imagem
          </p>
        )}
        {previaPendente && (
          <span className="absolute left-2 top-2 rounded-md bg-[#0079cb] px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-white">
            ainda não enviada
          </span>
        )}
      </div>

      {criando ? (
        <>
          {escondidos}
          {seletor}
        </>
      ) : (
        <form action={acao} onSubmit={() => setJaEnviada(previa)}>
          <input type="hidden" name="id" value={id} />
          {escondidos}
          {seletor}
        </form>
      )}

      {/**
       * ⚠️ O AVISO DE ORIGEM PEQUENA, e por que ele é tela e não só um comentário: a escada
       * de redução acima conserta o que era estrago de reamostragem, mas não existe
       * algoritmo que conserte AMPLIAÇÃO — um arquivo de 800 px esticado para 1672 px fica
       * borrado por falta de informação, e fica borrado em qualquer ferramenta. Sem este
       * aviso, o operador vê a prévia ruim e conclui que o admin está quebrado, quando a
       * resposta é «peça o arquivo maior para quem fez a arte».
       *
       * Ele NÃO BLOQUEIA o envio: publicar uma arte fraca é às vezes a escolha certa — duas
       * das quinze artes de hoje estão em baixa de propósito, com a nota disso em
       * `src/data/events.ts`. Quem decide é quem está olhando.
       */}
      {origem && origem.largura < ARTE_LARGURA && (
        <p className="mt-4 rounded-lg border border-amber-300/70 bg-amber-50 px-3 py-2 text-sm leading-relaxed text-amber-800">
          Este arquivo tem {origem.largura}×{origem.altura} px, menor que os{' '}
          {ARTE_LARGURA}×{ARTE_ALTURA} em que a arte é servida — ele vai ser AMPLIADO e sai
          borrado. Nenhum ajuste resolve isso; o que resolve é o arquivo original maior. Dá
          para publicar assim mesmo, se for o que existe.
        </p>
      )}
      {aviso && (
        <p role="alert" className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {aviso}
        </p>
      )}
      {estado.estado === 'erro' && (
        <p role="alert" className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm leading-relaxed text-red-700">
          {estado.mensagem}
        </p>
      )}
      {estado.estado === 'ok' && (
        <p className="mt-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm leading-relaxed text-emerald-800">
          {/* ⚠️ `replace('/images/EVENTOS/', '')` cortava o caminho de disco e não serve para
              a loja, onde `image` é uma URL absoluta: o `replace` não casava nada e a frase
              saía com a URL inteira do Blob dentro. Pegar o último trecho do caminho funciona
              nos dois casos, que é o nome do arquivo — a única parte que interessa a quem
              acabou de enviar. */}
          Gravada como{' '}
          <code className="font-mono text-[12px]">
            {estado.image.split('?')[0].split('/').pop()}
          </code>
          {naNuvem
            ? '. Já está no ar em /eventos-inovacao.'
            : '. Faça commit de public/images/EVENTOS e de src/data/events.json para publicar.'}
        </p>
      )}
    </div>
  );
}
