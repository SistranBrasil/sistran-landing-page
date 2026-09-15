# Carimbo dinâmico — “Realizado pela Sistran”

Componente vetorial, sem imagem raster. O texto continua selecionável e acessível, enquanto símbolo, borda e textura usam `currentColor`.

## Uso no React / Next.js

Copie `StampSistran.tsx` e `StampSistran.module.css` para a pasta de componentes:

```tsx
import { StampSistran } from "@/components/StampSistran";

export default function CasePage() {
  return (
    <StampSistran
      prefix="Realizado pela"
      brand="Sistran"
      color="#0757C7"
      shape="capsule"
      finish="glass"
      size="lg"
      rotation={-3}
      animated
    />
  );
}
```

## Propriedades

- `prefix` e `brand`: alteram o texto exibido sem recriar nenhum arquivo.
- `color`: qualquer cor CSS, como `#0757C7`, `rgb(...)` ou `var(--brand-color)`.
- `shape`: `capsule`, `seal`, `split`, `ticket`, `signature`, `orbit`, `monogram` ou `certificate`.
- `finish`: `outline`, `solid` ou `glass`.
- `size`: `sm`, `md` ou `lg`.
- `rotation`: inclinação do carimbo em graus.
- `animated`: ativa a entrada de impacto. A animação é automaticamente removida quando o usuário prefere movimento reduzido.

Abra `demo.html` no navegador para testar formatos, acabamentos, cores e a animação.

O símbolo é redesenhado em SVG com a mesma lógica visual da marca original: círculo externo e dois traços internos independentes com terminais arredondados. Nenhum PNG é necessário em produção.
