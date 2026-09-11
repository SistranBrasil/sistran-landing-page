'use client';

import Link from 'next/link';
import { useActionState, useCallback, useState } from 'react';
import { salvarEvento, type EstadoSalvamento } from '../acoes';
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
 */
export default function FormularioEvento({
  evento,
  categorias,
  icones,
  imagens,
  miniaturas,
}: {
  evento: EventoBruto;
  categorias: { valor: string; rotulo: string }[];
  icones: string[];
  imagens: string[];
  miniaturas: string[];
}) {
  const [estado, acao, pendente] = useActionState<EstadoSalvamento, FormData>(salvarEvento, {
    estado: 'inicial',
  });
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
      <div className="space-y-6">
        <CampoArte
          id={evento.id}
          image={valores.image}
          thumb={valores.thumb}
          onPublicado={aoPublicarArte}
        />

        <form action={acao} className="rounded-2xl border border-black/[0.07] bg-white p-5">
          {/* O id viaja escondido porque é a CHAVE da linha no catálogo, não um dado
              editável: trocá-lo seria criar outro evento e perder o de origem. */}
          <input type="hidden" name="id" value={evento.id} />

          <h2 className="text-lg font-medium text-[#0f172a]">Texto e classificação</h2>

          {estado.estado === 'ok' && (
            <p className="mt-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm leading-relaxed text-emerald-800">
              Salvo em src/data/events.json. Faça commit do arquivo para publicar.
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
              {pendente ? 'Salvando…' : 'Salvar texto'}
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
