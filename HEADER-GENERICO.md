# Header Pill Flutuante — Guia Genérico

Padrão de header usado no SDS: barra flutuante com fundo escuro translúcido, blur, logos à esquerda, navegação central com underline ativo e CTA branco à direita. Reusável em qualquer projeto Next.js + Tailwind.

---

## 1. Anatomia visual

```
┌──────────────────────────────────────────────────────────────────┐
│  [LOGO A] │ [LOGO B]     link  link  link  link      [ CTA → ]  │
└──────────────────────────────────────────────────────────────────┘
   ▲ pill flutuante fixed top-4, blur 20px, borda 1px, sombra
```

- **Position**: `fixed` no topo, com `top-4` (respiro do topo da viewport).
- **Largura**: `min(1240px, calc(100% - 32px))` — máximo 1240 e sempre com 16px de margem lateral.
- **Altura**: 88px fixa.
- **Fundo**: `rgba(4,20,42,0.76)` + `backdrop-filter: blur(20px)`.
- **Borda**: `1px solid rgba(255,255,255,0.13)`.
- **Sombra**: `0 18px 50px rgba(1,12,28,0.25)`.
- **Cantos**: `rounded-[20px]`.

---

## 2. Estrutura do componente

```tsx
'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';

const LINKS: [string, string][] = [
  ['#section-1', 'Item 1'],
  ['#section-2', 'Item 2'],
  ['#section-3', 'Item 3'],
];

export default function Header() {
  const [activeHash, setActiveHash] = useState('');

  // Highlight do link ativo conforme a seção correspondente entra na viewport
  useEffect(() => {
    const ids = LINKS.map(([href]) => href.slice(1));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveHash(`#${entry.target.id}`);
        });
      },
      { rootMargin: '-38% 0px -52% 0px', threshold: 0.01 },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className="fixed inset-x-0 top-4 z-50 mx-auto flex h-[88px] w-[min(1240px,calc(100%-32px))] items-center justify-between rounded-[20px] px-3 pl-5 text-white"
      style={{
        border: '1px solid rgba(255,255,255,0.13)',
        background: 'rgba(4,20,42,0.76)',
        boxShadow: '0 18px 50px rgba(1,12,28,0.25)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      {/* LOGOS */}
      <a href="#top" className="inline-flex flex-shrink-0 items-center gap-5">
        <Image src="/logo-a.png" alt="Marca A" width={210} height={84} priority className="h-16 w-auto object-contain" />
        <span className="h-12 w-px flex-shrink-0" style={{ background: 'rgba(255,255,255,0.16)' }} />
        <Image src="/logo-b.png" alt="Marca B" width={224} height={80} priority className="hidden h-16 w-auto object-contain sm:block" />
      </a>

      {/* NAV */}
      <nav aria-label="Navegação principal" className="ml-auto mr-3 hidden items-center gap-0.5 lg:flex">
        {LINKS.map(([href, label]) => {
          const isActive = activeHash === href;
          return (
            <a
              key={href}
              href={href}
              className="relative whitespace-nowrap px-2.5 py-2.5 text-[0.75rem] font-semibold transition-colors duration-200"
              style={{ color: isActive ? '#fff' : 'rgba(255,255,255,0.68)' }}
            >
              {label}
              <span
                className="absolute bottom-[3px] left-1/2 h-[2px] w-3.5 -translate-x-1/2 rounded-full transition-transform duration-200"
                style={{ background: '#20c8e8', transform: `translateX(-50%) scaleX(${isActive ? 1 : 0})` }}
              />
            </a>
          );
        })}
      </nav>

      {/* CTA */}
      <a
        href="#contato"
        className="hidden h-11 flex-shrink-0 items-center gap-3 rounded-[13px] bg-white px-4 text-[0.78rem] font-bold md:inline-flex"
        style={{ color: '#0b2550', boxShadow: '0 8px 24px rgba(0,0,0,0.16)' }}
      >
        Fale com a gente
        <ArrowUpRight className="h-3.5 w-3.5" style={{ color: '#087fc4' }} strokeWidth={2.4} />
      </a>
    </header>
  );
}
```

---

## 3. Tokens de cor (recomendados)

| Token           | Valor                        | Uso                              |
|-----------------|------------------------------|----------------------------------|
| bg-header       | `rgba(4,20,42,0.76)`         | fundo do pill                    |
| border-header   | `rgba(255,255,255,0.13)`     | borda sutil do pill              |
| shadow-header   | `0 18px 50px rgba(1,12,28,0.25)` | sombra do pill               |
| link-idle       | `rgba(255,255,255,0.68)`     | link não ativo                   |
| link-active     | `#ffffff`                    | link ativo                       |
| accent          | `#20c8e8`                    | underline do link ativo          |
| cta-bg          | `#ffffff`                    | fundo do botão                   |
| cta-text        | `#0b2550`                    | texto do botão                   |
| cta-icon        | `#087fc4`                    | ícone do botão                   |

Ajuste `accent` e `cta-*` conforme a marca.

---

## 4. Detalhes importantes

### Link ativo com IntersectionObserver
- `rootMargin: '-38% 0px -52% 0px'` cria uma faixa central de detecção (~10% da altura da viewport). Assim, o link só marca ativo quando a seção está próxima ao centro, evitando "flash" entre seções.

### Underline animado
- Uma `<span>` absoluta abaixo do texto com `scaleX(0)` idle e `scaleX(1)` ativo — transição no `transform` fica em GPU (60 fps).

### Responsividade
- `lg:flex` esconde os links em telas < 1024px.
- `md:inline-flex` esconde o CTA em telas < 768px.
- Logo B tem `hidden sm:block` — some em < 640px para não estourar largura.
- Em mobile, prever um botão hamburguer/menu (não incluído aqui).

### Performance
- `backdrop-filter: blur(20px)` é GPU-intensive; ok num único elemento fixed.
- `-webkit-backdrop-filter` incluído para Safari.

### Acessibilidade
- `aria-label="Navegação principal"` no `<nav>`.
- Cada link mantém foco visível via outline padrão (customize com `focus-visible:` se quiser).
- `alt` descritivo nas imagens (não vazio) se as logos comunicam marca.

---

## 5. Variações comuns

### 5.1 Fundo claro
Trocar apenas as cores:
```tsx
background: 'rgba(255,255,255,0.85)',
border: '1px solid rgba(11,37,80,0.08)',
color: '#0b2550',
// link idle: 'rgba(11,37,80,0.55)'
// link ativo: '#0b2550'
```

### 5.2 Sem CTA
Remover o `<a>` final; adicionar `justify-between` continua funcionando (nav ocupa o meio via `ml-auto`).

### 5.3 Header opaco após scroll
Adicionar `useEffect` com listener de `scroll` que troca opacity do fundo entre `0.35` (topo) e `0.85` (scrollado > 60px).

### 5.4 Underline em cima em vez de baixo
Trocar `bottom-[3px]` por `top-[3px]`.

### 5.5 Menu mobile
Adicionar botão hamburguer com `lg:hidden` que abre um `<Drawer>` ou `<Sheet>` — reutilizar o array `LINKS`.

---

## 6. Checklist de integração

- [ ] Renderizar `<Header />` no root layout, fora do fluxo (`main` recebe `pt-28` ou similar para compensar o topo fixo)
- [ ] Cada seção da página tem `id` correspondente ao `href` do link
- [ ] Logos disponíveis em `/public` (formato PNG/SVG transparente)
- [ ] Testar em Safari (backdrop-filter, transform)
- [ ] Testar acesso por teclado (Tab → Enter)
- [ ] Validar contraste do link idle (mín 4.5:1)

---

## 7. Referência

Este padrão é uma adaptação do "floating pill header" popular em landing pages executivas (Linear, Vercel, Stripe). O diferencial aqui é o **highlight ativo por scroll** integrado ao layout de LP de rolagem única.
