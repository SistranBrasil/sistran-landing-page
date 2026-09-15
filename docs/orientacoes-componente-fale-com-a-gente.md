# Orientações para reproduzir o componente “Fale com a Gente”

## 1. Objetivo

Reproduzir o componente visual da referência com:

- painel de conteúdo claro à esquerda;
- forma orgânica azul à direita;
- símbolo da Sistran centralizado sobre a forma azul;
- órbitas luminosas em ciano;
- balões de conversa translúcidos;
- botão branco sobreposto à união entre o painel e a forma azul;
- comportamento responsivo sem deformar ou cortar os elementos.

## 2. Diagnóstico do componente atual

O problema principal não é a ausência de uma imagem atrás do símbolo. A diferença visual acontece por causa da forma, da proporção, das cores e do empilhamento das camadas.

No componente atual:

- a forma azul está quase circular e estreita;
- a região inferior está escura demais;
- a silhueta está irregular em relação à referência;
- as órbitas formam cruzamentos muito evidentes;
- o conjunto parece separado do painel esquerdo;
- o botão está muito deslocado para a esquerda;
- a relação entre o tamanho do símbolo e o fundo azul não acompanha a referência.

Na referência:

- a forma azul é mais larga do que alta;
- o contorno é orgânico, mas controlado;
- existe uma transição do azul luminoso no topo para um azul médio na base;
- o painel esquerdo sobrepõe parcialmente o fundo azul;
- o botão cobre exatamente a área de encontro entre os dois blocos;
- o símbolo, as órbitas e os balões funcionam como camadas independentes.

## 3. Decisão técnica recomendada

Não usar uma imagem rasterizada para a forma azul.

A solução recomendada é criar a forma com um SVG incorporado ao componente. Isso oferece:

- nitidez em qualquer resolução;
- controle preciso da silhueta;
- gradientes editáveis;
- melhor comportamento responsivo;
- possibilidade de animação;
- carregamento mais leve;
- ausência de bordas serrilhadas ou fundo indesejado.

Uma imagem PNG deve ser usada somente se o projeto não permitir SVG ou se toda a composição precisar ser totalmente estática.

## 4. Ordem correta das camadas

Utilizar esta hierarquia de profundidade:

1. fundo claro e linhas decorativas da seção;
2. forma orgânica azul;
3. órbitas em ciano;
4. símbolo branco da Sistran;
5. balões de conversa;
6. painel de conteúdo;
7. botão “Fale com a SISTRAN”.

O contêiner externo pode usar `overflow: hidden`, mas a área interna do componente visual deve usar `overflow: visible` para não cortar órbitas, sombras ou balões.

## 5. Estrutura React/Next.js

```tsx
export function ContactVisual() {
  return (
    <div className="contactVisual" aria-hidden="true">
      <svg
        className="contactBlob"
        viewBox="0 0 760 620"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient
            id="contactBlobGradient"
            x1="0"
            y1="0"
            x2="1"
            y2="1"
          >
            <stop offset="0%" stopColor="#129EEA" />
            <stop offset="48%" stopColor="#0878CC" />
            <stop offset="100%" stopColor="#064C98" />
          </linearGradient>

          <filter
            id="contactBlobShadow"
            x="-30%"
            y="-30%"
            width="160%"
            height="160%"
          >
            <feDropShadow
              dx="0"
              dy="18"
              stdDeviation="22"
              floodColor="#0878CC"
              floodOpacity="0.22"
            />
          </filter>
        </defs>

        <path
          filter="url(#contactBlobShadow)"
          fill="url(#contactBlobGradient)"
          d="
            M156 164
            C245 72 355 20 494 28
            C638 36 732 130 738 276
            C744 421 671 541 543 588
            C416 635 270 597 177 511
            C83 423 65 293 112 215
            C126 191 141 176 156 164
            Z
          "
        />
      </svg>

      <span className="contactOrbit contactOrbitOne" />
      <span className="contactOrbit contactOrbitTwo" />

      <img
        className="contactLogo"
        src="/images/sistran-symbol.svg"
        alt=""
      />

      <span className="contactMessage contactMessageTop">
        <span>•••</span>
      </span>

      <span className="contactMessage contactMessageBottom">
        <span>•••</span>
      </span>
    </div>
  );
}
```

O símbolo da Sistran deve estar em SVG ou PNG com transparência real. Não utilizar uma imagem com fundo branco ou quadriculado incorporado.

## 6. CSS da forma azul e dos elementos flutuantes

```css
.contactVisual {
  position: absolute;
  z-index: 2;
  top: 50%;
  right: clamp(-70px, -2vw, 0px);

  width: clamp(560px, 42vw, 760px);
  aspect-ratio: 760 / 620;

  transform: translateY(-50%);
  overflow: visible;
  pointer-events: none;
}

.contactBlob {
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
  overflow: visible;
}

.contactLogo {
  position: absolute;
  z-index: 4;
  top: 50%;
  left: 57%;

  width: 38%;
  height: auto;

  transform: translate(-50%, -50%);
  filter: drop-shadow(0 8px 10px rgba(0, 38, 95, 0.16));
}

.contactOrbit {
  position: absolute;
  z-index: 3;
  top: 50%;
  left: 55%;

  width: 94%;
  height: 50%;

  border: 2px solid rgba(22, 222, 249, 0.8);
  border-radius: 50%;

  box-shadow:
    0 0 8px rgba(14, 216, 246, 0.4),
    inset 0 0 8px rgba(14, 216, 246, 0.12);
}

.contactOrbitOne {
  transform: translate(-50%, -50%) rotate(-8deg);
}

.contactOrbitTwo {
  opacity: 0.55;
  transform: translate(-50%, -50%) rotate(20deg);
}

.contactMessage {
  position: absolute;
  z-index: 5;

  display: grid;
  place-items: center;

  width: 138px;
  height: 78px;

  color: #ffffff;
  font-size: 25px;
  letter-spacing: 7px;

  background: linear-gradient(
    145deg,
    rgba(166, 222, 255, 0.7),
    rgba(52, 143, 214, 0.36)
  );

  border: 2px solid rgba(255, 255, 255, 0.8);
  border-radius: 20px;
  backdrop-filter: blur(10px);

  box-shadow:
    inset 0 1px 8px rgba(255, 255, 255, 0.55),
    0 12px 30px rgba(0, 73, 145, 0.18);
}

.contactMessage::after {
  content: "";
  position: absolute;
  bottom: -15px;
  left: 30px;

  border-top: 18px solid rgba(94, 171, 225, 0.55);
  border-right: 18px solid transparent;
}

.contactMessageTop {
  top: 19%;
  left: 32%;
}

.contactMessageBottom {
  right: 1%;
  bottom: 20%;
}
```

## 7. Sobreposição do painel e do botão

O painel esquerdo deve avançar parcialmente sobre a forma azul. O botão deve ficar acima de ambos.

```css
.contactSection {
  position: relative;
  min-height: 620px;
  overflow: hidden;
  isolation: isolate;
}

.contactPanel {
  position: relative;
  z-index: 6;
  width: min(72%, 1380px);
  min-height: 430px;
  margin-left: clamp(24px, 4vw, 80px);
  padding: clamp(48px, 6vw, 92px);

  border: 2px solid rgba(255, 255, 255, 0.86);
  border-radius: 92px 190px 190px 92px;

  background: rgba(245, 251, 255, 0.7);
  backdrop-filter: blur(18px);
}

.contactCta {
  position: absolute;
  z-index: 8;
  top: 50%;
  right: clamp(390px, 29vw, 540px);

  transform: translateY(-50%);
}
```

O valor de `right` do botão pode precisar de um ajuste pequeno conforme a largura real da seção. O objetivo é colocar o botão sobre a área de encontro entre o painel claro e a forma azul.

## 8. Proporções importantes

Para aproximar o resultado da referência:

| Elemento | Proporção recomendada |
| --- | --- |
| Forma azul | `760 / 620` |
| Símbolo | aproximadamente `38%` da largura do visual |
| Órbitas | entre `90%` e `96%` da largura do visual |
| Balão superior | próximo de `18%` da largura do visual |
| Balão inferior | próximo de `18%` da largura do visual |
| Sobreposição com o painel | entre `80px` e `150px` no desktop |

Não utilizar `border-radius` aleatório para construir a forma principal. Isso tende a produzir o volume irregular visto no componente atual.

## 9. Responsividade

No desktop, o visual pode permanecer absoluto e alinhado à direita. Em telas menores, deve voltar ao fluxo do documento.

```css
@media (max-width: 900px) {
  .contactSection {
    min-height: auto;
    padding-bottom: 40px;
  }

  .contactPanel {
    width: calc(100% - 32px);
    min-height: auto;
    margin: 16px;
    padding: 48px 28px 150px;
    border-radius: 40px;
  }

  .contactVisual {
    position: relative;
    top: auto;
    right: auto;

    width: min(620px, 112vw);
    margin: -120px auto -80px;

    transform: none;
  }

  .contactCta {
    position: relative;
    top: auto;
    right: auto;
    z-index: 8;

    width: max-content;
    margin: -20px auto 0;
    transform: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .contactVisual,
  .contactOrbit,
  .contactMessage {
    animation: none !important;
    transition: none !important;
  }
}
```

## 10. Animações opcionais

As animações devem ser lentas e discretas.

```css
@keyframes contactFloat {
  0%,
  100% {
    transform: translate(-50%, -50%) translateY(0);
  }

  50% {
    transform: translate(-50%, -50%) translateY(-10px);
  }
}

@keyframes orbitPulse {
  0%,
  100% {
    opacity: 0.55;
  }

  50% {
    opacity: 0.9;
  }
}

.contactLogo {
  animation: contactFloat 6s ease-in-out infinite;
}

.contactOrbit {
  animation: orbitPulse 4.5s ease-in-out infinite;
}
```

Não aplicar rotações rápidas ou movimentos amplos. O componente deve parecer sofisticado, não lúdico.

## 11. Alternativa com PNG

Se for obrigatório utilizar uma imagem, gerar somente a forma azul com:

- fundo transparente real;
- resolução mínima de `1600 × 1305 px`;
- proporção aproximada de `760 / 620`;
- gradiente do azul claro no topo para azul médio na base;
- sem símbolo, órbitas, balões, sombras ou textos;
- margem transparente ao redor da forma.

Mesmo nesse cenário, o símbolo, os balões, as órbitas e o botão devem continuar como elementos independentes em HTML/CSS.

## 12. Checklist de validação

- [ ] A forma azul está mais larga do que alta.
- [ ] A forma não parece um círculo perfeito.
- [ ] O azul inferior não está excessivamente escuro.
- [ ] O painel esquerdo sobrepõe parcialmente a forma azul.
- [ ] O botão cobre a área de encontro entre os dois blocos.
- [ ] O símbolo está centralizado visualmente, não apenas matematicamente.
- [ ] As órbitas não formam um “X” muito evidente.
- [ ] Os balões não são cortados pelo contêiner.
- [ ] O componente permanece nítido em telas grandes.
- [ ] A versão mobile não cria rolagem horizontal.
- [ ] As animações respeitam `prefers-reduced-motion`.
- [ ] O símbolo utilizado possui transparência real.

## 13. Resultado esperado

O componente final deve transmitir uma composição única e integrada: o painel claro avança sobre o fundo azul, o botão funciona como elo entre conteúdo e marca, e os elementos flutuantes criam profundidade sem competir com a chamada principal.
