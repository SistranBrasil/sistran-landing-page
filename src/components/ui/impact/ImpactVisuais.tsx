import type { CSSProperties, ReactElement } from 'react';
import type { ImpactVisual } from '@/data/types';

/**
 * Os sete componentes contextuais da secao "Sistran em numeros".
 *
 * Regras que valem para todos, e é por elas que os sete parecem da mesma
 * familia: SVG (nenhuma imagem rasterizada), mesma caixa de 200x200, mesma
 * espessura de traco (`--iv-traco`), mesma paleta (azul, ciano, apagado) e
 * densidade BAIXA. O numero é o que se le; o contextual é o que sugere. Nenhum
 * deles é icone literal — sem usuario, sem trofeu, sem mapa, sem velocimetro,
 * sem cubo, sem escudo, sem checkmark.
 *
 * Sao markup ESTATICO: quem se move é o CSS, e so no indicador ativo e so
 * enquanto a secao esta na tela (ver `.impact-item[data-estado='ativo']` e
 * `[data-visivel]` em globals.css). Nada aqui roda `setInterval` nem RAF.
 *
 * Todos sao decorativos: `aria-hidden` no `<svg>`, nenhum foco, nenhum texto.
 */

const CAIXA = { viewBox: '0 0 200 200', 'aria-hidden': true, focusable: 'false' } as const;

/** 1. Constelacao abstrata de pessoas: pares de nos e ligacoes curtas. */
function PeopleNetwork() {
  const nos = [
    [46, 62, 7],
    [78, 44, 4.5],
    [112, 58, 9],
    [148, 46, 5],
    [58, 116, 5.5],
    [92, 100, 6.5],
    [128, 122, 8],
    [158, 104, 4],
    [76, 152, 6],
    [124, 160, 4.5],
  ];
  return (
    <svg {...CAIXA} className="iv">
      <g className="iv-linhas">
        {[
          [46, 62, 78, 44],
          [78, 44, 112, 58],
          [112, 58, 148, 46],
          [46, 62, 58, 116],
          [58, 116, 92, 100],
          [92, 100, 112, 58],
          [92, 100, 128, 122],
          [128, 122, 158, 104],
          [58, 116, 76, 152],
          [128, 122, 124, 160],
        ].map(([x1, y1, x2, y2], i) => (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />
        ))}
      </g>
      <g className="iv-nos">
        {nos.map(([cx, cy, r], i) => (
          <circle key={i} cx={cx} cy={cy} r={r} style={{ '--iv-i': i } as CSSProperties} />
        ))}
      </g>
    </svg>
  );
}

/** 2. Facetas: fragmentos finos e arcos formando uma coroa abstrata. */
function AwardFacets() {
  return (
    <svg {...CAIXA} className="iv">
      <g className="iv-linhas">
        <path d="M100 40 L128 96 L100 152 L72 96 Z" />
        <path d="M100 62 L142 100 L100 138 L58 100 Z" />
        <path d="M62 74 L138 126" />
        <path d="M138 74 L62 126" />
      </g>
      <g className="iv-arcos">
        <path d="M44 116 A 58 58 0 0 1 156 116" />
        <path d="M56 132 A 46 46 0 0 0 144 132" />
      </g>
      <g className="iv-nos">
        <circle cx="100" cy="40" r="5" />
        <circle cx="100" cy="100" r="3.5" />
      </g>
    </svg>
  );
}

/** 3. Esferas translucidas ao redor da lente, com ligacoes curtas. */
function ClientNetwork() {
  const esferas = [
    [40, 74, 11],
    [66, 46, 6],
    [98, 34, 8.5],
    [134, 50, 5],
    [162, 78, 10],
    [172, 118, 6],
    [146, 148, 9],
    [110, 166, 5.5],
    [74, 160, 7.5],
    [40, 134, 6],
    [28, 104, 4.5],
    [124, 96, 5],
    [80, 108, 4],
    [152, 104, 3.5],
  ];
  return (
    <svg {...CAIXA} className="iv">
      <g className="iv-linhas">
        {[
          [40, 74, 66, 46],
          [66, 46, 98, 34],
          [98, 34, 134, 50],
          [134, 50, 162, 78],
          [162, 78, 172, 118],
          [172, 118, 146, 148],
          [146, 148, 110, 166],
          [110, 166, 74, 160],
          [74, 160, 40, 134],
          [40, 134, 28, 104],
          [28, 104, 40, 74],
          [80, 108, 124, 96],
        ].map(([x1, y1, x2, y2], i) => (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />
        ))}
      </g>
      <g className="iv-esferas">
        {esferas.map(([cx, cy, r], i) => (
          <circle key={i} cx={cx} cy={cy} r={r} style={{ '--iv-i': i } as CSSProperties} />
        ))}
      </g>
    </svg>
  );
}

/** 4. Arcos concentricos e barras radiais: vazao, nao velocimetro. */
function CapacityPulse() {
  const barras = Array.from({ length: 24 }, (_, i) => i);
  return (
    <svg {...CAIXA} className="iv">
      <g className="iv-arcos">
        <circle cx="100" cy="100" r="38" />
        <circle cx="100" cy="100" r="58" />
        <path d="M22 100 A 78 78 0 0 1 100 22" />
        <path d="M178 100 A 78 78 0 0 1 100 178" />
      </g>
      <g className="iv-barras">
        {barras.map((i) => {
          const a = (i / barras.length) * Math.PI * 2;
          const r1 = 66;
          const r2 = 66 + (i % 3 === 0 ? 14 : 7);
          return (
            <line
              key={i}
              x1={100 + Math.cos(a) * r1}
              y1={100 + Math.sin(a) * r1}
              x2={100 + Math.cos(a) * r2}
              y2={100 + Math.sin(a) * r2}
              style={{ '--iv-i': i } as CSSProperties}
            />
          );
        })}
      </g>
      <g className="iv-ondas">
        <circle cx="100" cy="100" r="20" />
      </g>
    </svg>
  );
}

/** 5. Planos translucidos em camadas, com pontos de integracao. */
function ErpLayers() {
  const camadas = [0, 1, 2, 3];
  return (
    <svg {...CAIXA} className="iv">
      <g className="iv-planos">
        {camadas.map((i) => {
          const y = 56 + i * 30;
          return (
            <g key={i} style={{ '--iv-i': i } as CSSProperties}>
              <path d={`M100 ${y - 18} L166 ${y} L100 ${y + 18} L34 ${y} Z`} />
            </g>
          );
        })}
      </g>
      <g className="iv-linhas">
        <line x1="100" y1="38" x2="100" y2="164" />
        <line x1="34" y1="56" x2="34" y2="146" />
        <line x1="166" y1="56" x2="166" y2="146" />
      </g>
      <g className="iv-nos">
        {camadas.map((i) => (
          <circle key={i} cx="100" cy={56 + i * 30} r="3.5" />
        ))}
      </g>
    </svg>
  );
}

/** 6. Nos em anel em volta de um nucleo, com contornos protetivos abstratos. */
function InsurerNetwork() {
  const nos = Array.from({ length: 10 }, (_, i) => i);
  return (
    <svg {...CAIXA} className="iv">
      <g className="iv-arcos">
        <circle cx="100" cy="100" r="62" />
        <path d="M100 26 A 74 74 0 0 1 174 100" />
        <path d="M100 174 A 74 74 0 0 1 26 100" />
      </g>
      <g className="iv-linhas">
        {nos.map((i) => {
          const a = (i / nos.length) * Math.PI * 2 - Math.PI / 2;
          return (
            <line
              key={i}
              x1={100 + Math.cos(a) * 18}
              y1={100 + Math.sin(a) * 18}
              x2={100 + Math.cos(a) * 62}
              y2={100 + Math.sin(a) * 62}
            />
          );
        })}
      </g>
      <g className="iv-nos">
        {nos.map((i) => {
          const a = (i / nos.length) * Math.PI * 2 - Math.PI / 2;
          return (
            <circle
              key={i}
              cx={100 + Math.cos(a) * 62}
              cy={100 + Math.sin(a) * 62}
              r={i % 2 === 0 ? 5.5 : 3.5}
              style={{ '--iv-i': i } as CSSProperties}
            />
          );
        })}
        <circle cx="100" cy="100" r="9" />
      </g>
    </svg>
  );
}

/** 7. Sequencia que converge para um nucleo, com halo maior no fim. */
function ClaimsFlow() {
  const etapas = [
    [34, 150],
    [62, 128],
    [88, 138],
    [114, 112],
    [138, 120],
  ];
  return (
    <svg {...CAIXA} className="iv">
      <g className="iv-linhas">
        <path d="M34 150 Q 62 118 88 138 T 138 120 T 166 84" />
        {etapas.map(([x, y], i) => (
          <line key={i} x1={x} y1={y} x2={166} y2={84} />
        ))}
      </g>
      <g className="iv-arcos">
        <circle cx="166" cy="84" r="22" />
        <circle cx="166" cy="84" r="34" />
      </g>
      <g className="iv-nos">
        {etapas.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="4.5" style={{ '--iv-i': i } as CSSProperties} />
        ))}
        <circle cx="166" cy="84" r="8" />
      </g>
    </svg>
  );
}

const VISUAIS: Record<ImpactVisual, () => ReactElement> = {
  'people-network': PeopleNetwork,
  'award-facets': AwardFacets,
  'client-network': ClientNetwork,
  'capacity-pulse': CapacityPulse,
  'erp-layers': ErpLayers,
  'insurer-network': InsurerNetwork,
  'claims-flow': ClaimsFlow,
};

export default function ImpactVisual({ nome }: { nome: ImpactVisual }) {
  const Componente = VISUAIS[nome];
  return <Componente />;
}
