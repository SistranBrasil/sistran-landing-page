import Image from 'next/image';
import { TRAJECTORY_CAPABILITIES } from '@/data/trajectory';

/**
 * SIS-202 — as quatro competências no painel de indicadores da preview (§1).
 *
 * `next/image` com `width`/`height` declarados, como o §12 pede: os arquivos de
 * origem são PNG de 1254×1254 e ~700 KB cada. Servi-los crus nesta caixa
 * seria 2,8 MB para alguns px² de tela. Com `sizes` o Next entrega a variante do
 * tamanho certo, e as medidas explícitas reservam a caixa antes do byte chegar —
 * que é o «ausência de layout shift» do mesmo parágrafo.
 *
 * SIS-205 — A ARTE CRESCEU DE 36px PARA 56px, e por isso os números aqui mudaram
 * de 72 para 112: `width`/`height` do `next/image` são o pedido de RESOLUÇÃO, não a
 * medida na tela (essa é do CSS, `.trajetoria-competencia-icone img`). Com 56 CSS px
 * numa tela de densidade 2 o navegador precisa de 112 px reais; deixar 72 declarado
 * junto do CSS novo entregaria arte menor que a caixa e o PNG apareceria mole. O
 * `sizes` continua dizendo a medida de TELA, que é o que o navegador usa para
 * escolher no srcset — daí `56px`, e não `112px`.
 *
 * Sem filtro, sem recolorir, sem sombra NO ARQUIVO: o §1 proíbe mexer no PNG, e o
 * disco azul-claro atrás é do CSS, não do arquivo. A sombra que a SIS-205 pede é do
 * PAINEL (caixa CSS), não deste `<img>` — ver `.trajetoria-painel`.
 *
 * `alt=""` nos ícones e o nome da competência no texto ao lado: o ícone é redundante
 * em relação ao título que ele acompanha, e um `alt` repetindo «Expertise em
 * Seguros» faria o leitor de tela dizer duas vezes a mesma coisa. É o caso de
 * imagem decorativa do §11 — o texto alternativo existe, e é o próprio título.
 */
export function CapabilityList() {
  return (
    <ul className="trajetoria-competencias">
      {TRAJECTORY_CAPABILITIES.map((competencia) => (
        <li key={competencia.id} className="trajetoria-competencia">
          <span className="trajetoria-competencia-icone">
            <Image
              src={competencia.icon}
              alt=""
              width={112}
              height={112}
              sizes="56px"
              aria-hidden
            />
          </span>
          <span className="trajetoria-competencia-titulo">{competencia.title}</span>
        </li>
      ))}
    </ul>
  );
}
