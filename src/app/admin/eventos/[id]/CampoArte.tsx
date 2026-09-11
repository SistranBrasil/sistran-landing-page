'use client';

import Image from 'next/image';
import { useActionState, useEffect, useRef, useState } from 'react';
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
 * ── Por que é um <form> separado do formulário do evento ──────────────────────
 * HTML não permite formulário dentro de formulário, e juntar os dois numa submissão
 * só significaria que um título mal digitado impediria a foto de subir, e vice-versa.
 * Trocar a foto e revisar o texto são dois trabalhos; cada um tem seu botão.
 */
export default function CampoArte({
  id,
  image,
  thumb,
  onPublicado,
}: {
  id: string;
  image?: string;
  thumb?: string;
  onPublicado: (image: string, thumb: string) => void;
}) {
  const [estado, acao, pendente] = useActionState<EstadoArte, FormData>(enviarArte, {
    estado: 'inicial',
  });
  const [previa, setPrevia] = useState<string | null>(null);
  const [jaEnviada, setJaEnviada] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);
  const arte = useRef<HTMLInputElement>(null);
  const miniatura = useRef<HTMLInputElement>(null);
  const escolher = useRef<HTMLInputElement>(null);

  /* Avisar o formulário vizinho para que a prévia e os `<select>` passem a apontar
     para o arquivo novo sem recarregar a página. */
  useEffect(() => {
    if (estado.estado === 'ok') onPublicado(estado.image, estado.thumb);
  }, [estado, onPublicado]);

  /* `URL.createObjectURL` reserva memória até alguém revogar. Sem isto, trocar de
     foto cinco vezes deixa cinco imagens presas no processo. */
  useEffect(() => () => { if (previa) URL.revokeObjectURL(previa); }, [previa]);

  /**
   * Redimensiona com CORTE CENTRAL (o mesmo que `object-fit: cover` faria), em
   * dois tamanhos. Devolve webp, que é o formato de todas as artes já publicadas.
   */
  async function reduzir(bitmap: ImageBitmap, largura: number, altura: number): Promise<Blob> {
    const tela = document.createElement('canvas');
    tela.width = largura;
    tela.height = altura;
    const pincel = tela.getContext('2d');
    if (!pincel) throw new Error('canvas 2d indisponível neste navegador');

    const escala = Math.max(largura / bitmap.width, altura / bitmap.height);
    const l = bitmap.width * escala;
    const a = bitmap.height * escala;
    pincel.drawImage(bitmap, (largura - l) / 2, (altura - a) / 2, l, a);

    const blob = await new Promise<Blob | null>((resolver) =>
      tela.toBlob(resolver, 'image/webp', 0.9),
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
      const [grande, pequena] = await Promise.all([
        reduzir(bitmap, ARTE_LARGURA, ARTE_ALTURA),
        reduzir(bitmap, THUMB_LARGURA, THUMB_ALTURA),
      ]);
      bitmap.close();

      /* Os dois blobs entram em `<input type="file">` escondidos via DataTransfer:
         é o que permite mandá-los pela mesma submissão de formulário da Server
         Function, sem inventar um endpoint de API só para isto. */
      const anexar = (campo: HTMLInputElement | null, blob: Blob, nome: string) => {
        if (!campo) return;
        const bolsa = new DataTransfer();
        bolsa.items.add(new File([blob], nome, { type: 'image/webp' }));
        campo.files = bolsa.files;
      };
      anexar(arte.current, grande, 'arte.webp');
      anexar(miniatura.current, pequena, 'miniatura.webp');

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

  return (
    <form
      action={acao}
      onSubmit={() => setJaEnviada(previa)}
      className="rounded-2xl border border-black/[0.07] bg-white p-5"
    >
      <input type="hidden" name="id" value={id} />
      {/* Os dois arquivos convertidos viajam por aqui; a pessoa nunca os vê. */}
      <input ref={arte} type="file" name="arte" accept="image/webp" hidden />
      <input ref={miniatura} type="file" name="miniatura" accept="image/webp" hidden />

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
        <button
          type="submit"
          disabled={pendente || !previaPendente}
          className="rounded-full bg-[#0079cb] px-4 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-white transition-opacity disabled:opacity-40"
        >
          {pendente ? 'Enviando…' : 'Publicar imagem'}
        </button>
      </div>

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
          Gravada como{' '}
          <code className="font-mono text-[12px]">{estado.image.replace('/images/EVENTOS/', '')}</code>. Faça
          commit de public/images/EVENTOS e de src/data/events.json para publicar.
        </p>
      )}
    </form>
  );
}
