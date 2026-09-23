Implemente no projeto existente a seção “Sobre nós — A Sistran” reproduzindo fielmente a imagem de referência fornecida.

Antes de alterar o código:

1. Identifique a stack, os componentes, tokens, fontes e padrões responsivos já utilizados.
2. Localize a seção atual “A Sistran”.
3. Preserve a identidade visual do restante da página.
4. Não altere outras seções.
5. Reutilize os componentes existentes quando forem compatíveis.

## Assets obrigatórios

Utilize estes dois arquivos reais:

```text
/public/images/sobre-nos-equipe.webp
/public/images/carimbo-sobre-nos.png
```

* `sobre-nos-equipe.webp`: fotografia horizontal da equipe reunida no escritório.
* `carimbo-sobre-nos.png`: carimbo azul transparente escrito “SISTRAN Sobre nós”.

Não recrie o carimbo com texto HTML.
Não coloque textos, filtros, gradientes ou interfaces sobre a fotografia.

## Estrutura geral

Crie uma seção sem cards individuais, dividida em:

1. Área editorial superior clara.
2. Faixa institucional azul-marinho com os três indicadores.

Estrutura sugerida:

```tsx
<section id="sobre-nos" className="aboutSection">
  <div className="aboutContent">
    <div className="aboutVisual">...</div>
    <div className="aboutCopy">...</div>
  </div>

  <div className="aboutMetrics">...</div>
</section>
```

## Fundo da área superior

Utilize um fundo azul-gelo muito claro:

```css
background:
  linear-gradient(
    135deg,
    #f7fcff 0%,
    #edf8fe 56%,
    #e4f4fc 100%
  );
```

Adicione um grid técnico extremamente discreto:

```css
background-image:
  linear-gradient(rgba(7, 87, 199, 0.035) 1px, transparent 1px),
  linear-gradient(90deg, rgba(7, 87, 199, 0.035) 1px, transparent 1px);
background-size: 40px 40px;
```

O grid não pode prejudicar a leitura.

## Container principal

```css
max-width: 1500px;
margin: 0 auto;
padding: 72px 48px 26px;
display: grid;
grid-template-columns: minmax(0, 1.08fr) minmax(0, 0.92fr);
gap: 48px;
align-items: center;
```

A imagem deve ocupar aproximadamente 52% da largura visual e o texto 48%.

## Fotografia

Apresente a fotografia do lado esquerdo.

```css
position: relative;
aspect-ratio: 1.16 / 1;
overflow: hidden;
```

Utilize um recorte arquitetônico com:

* Canto superior esquerdo arredondado em `64px`.
* Canto inferior esquerdo praticamente reto.
* Canto inferior direito arredondado em aproximadamente `90px`.
* Canto superior direito chanfrado.

O chanfro pode ser criado com `clip-path`:

```css
clip-path: polygon(
  0 0,
  calc(100% - 76px) 0,
  100% 76px,
  100% calc(100% - 82px),
  calc(100% - 82px) 100%,
  0 100%
);
```

Imagem:

```css
width: 100%;
height: 100%;
object-fit: cover;
object-position: center;
```

Use `next/image` se o projeto for Next.js:

```tsx
<Image
  src="/images/sobre-nos-equipe.webp"
  alt="Profissionais da Sistran analisando informações durante uma reunião"
  fill
  sizes="(max-width: 900px) 100vw, 52vw"
  className="object-cover"
/>
```

Não aplique filtro azul ou escurecimento forte.

## Carimbo “Sobre nós”

Posicione o carimbo parcialmente sobre a parte superior esquerda da fotografia:

```css
position: absolute;
top: -38px;
left: -20px;
width: clamp(230px, 24vw, 330px);
height: auto;
z-index: 3;
transform: rotate(-3deg);
```

O carimbo deve:

* Manter seu fundo transparente.
* Permanecer totalmente legível.
