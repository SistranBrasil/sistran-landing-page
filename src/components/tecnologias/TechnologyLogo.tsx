/**
 * A logo de uma tecnologia — o único lugar do módulo que renderiza `<Image>`.
 *
 * Existe para cumprir o item 10 do doc («evitar repetir manualmente o mesmo JSX
 * para cada tecnologia»): cápsula e painel do destaque desenham caixas
 * diferentes, mas a regra da IMAGEM é a mesma nos dois — `alt` sempre presente,
 * proporção preservada por `object-fit: contain`, e o teto de largura vindo do
 * dado (`larguraMax`) e não da folha.
 *
 * `larguraMax` viaja como a variável `--tec-logo-max`, e não como `style.maxWidth`
 * direto, porque a folha precisa de um PADRÃO quando o dado não traz valor —
 * `var(--tec-logo-max, 72%)` na cápsula e `70%` no painel. Com `maxWidth` inline
 * o padrão da folha perderia para o inline em todos os casos.
 */
import Image from 'next/image';
import type { Tecnologia } from '@/data/tecnologias';

export default function TechnologyLogo({
  tec,
  className,
  tamanhos,
  /**
   * `prioridade` só para o que nasce acima da dobra. A seção inteira vive bem
   * abaixo dela em `/quem-somos`, então o padrão é `false` — carregar catorze
   * logos com prioridade disputaria banda com o herói da rota.
   */
  prioridade = false,
}: {
  tec: Tecnologia;
  className: string;
  tamanhos: string;
  prioridade?: boolean;
}) {
  return (
    <Image
      className={className}
      src={tec.image}
      alt={tec.alt}
      /* Medidas INTRÍNSECAS de referência, não de exibição: o `next/image` as usa
         para reservar a proporção. A exibição real sai do CSS (`max-width` +
         `max-height` + `contain`), que é o que preserva a proporção de cada
         arquivo — as catorze logos vão de 3:1 (REST:API) a quadrada (.NET). */
      width={480}
      height={280}
      sizes={tamanhos}
      priority={prioridade}
      style={
        tec.larguraMax
          ? ({ '--tec-logo-max': tec.larguraMax } as React.CSSProperties)
          : undefined
      }
    />
  );
}
