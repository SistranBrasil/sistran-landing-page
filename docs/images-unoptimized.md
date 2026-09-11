# `images.unoptimized` — o `sizes` do projeto hoje é decorativo

Origem: [SIS-154](https://linear.app/sistran-labs/issue/SIS-154/images-unoptimized-true-torna-todo-sizes-do-projeto-decorativo-decidir) (cancelada; o texto ficou aqui para o dia em que a hospedagem mudar).

## O que está no ar

`next.config.mjs` declara:

```js
images: { unoptimized: true }
```

Com isso o `next/image` **serve o arquivo exatamente como está no disco**. Não gera derivadas e **não emite `srcset`**. Sem candidatos, o navegador não tem o que escolher: o atributo `sizes` é descartado. Ele só existe para ponderar um `srcset`.

Conferido no DOM (relato da SIS-139, rota `/esg`): `srcset` vazio, `sizes` sequer no elemento renderizado, `currentSrc` apontando para o arquivo cru.

Ganho de bytes medido nas issues de foto veio da **conversão de formato** (PNG → WebP), não da seleção de candidato.

## Por que não é sprint agora

Isso não é defeito de seção. É propriedade do repositório. Tirar ou manter a flag toca **todas as rotas**.

A pergunta que decide o trabalho:

> `unoptimized: true` é **decisão de deploy** ou **resíduo**?

Não adivinhar. Quem sabe como esta LP é publicada responde.

A hipótese mais provável nesta empresa: publicação estática em **S3 + CloudFront + OAC**. O otimizador do `next/image` precisa de runtime Node. Sem servidor, a flag está certa; sem ela o export quebra ou as imagens falham em produção.

O `next.config.mjs` atual **não** declara `output: 'export'`. Isso não fecha a pergunta: o deploy pode ser estático por outro caminho, ou pode ser `next start`. Confirmar na infra, não no arquivo.

## Os dois desfechos

### A — É decisão de deploy (export / estático)

Nada muda em `next.config.mjs` além, se quiser, de um comentário apontando para este arquivo.

- `sizes` pode ficar no JSX (já escrito, e passa a valer no dia em que a flag sair) **com a ressalva** de que hoje não baixa menos bytes. Modelo: comentário em `src/app/esg/page.tsx` junto das seis práticas.
- Nenhum comentário novo pode atribuir ganho de bytes a `sizes`.
- Responsividade de verdade, nesse modo, é **derivada no build**: vários arquivos + `srcset` à mão, ou `<picture>`. Trabalho próprio, não ajuste de atributo. Avaliar só para heros grandes, ou para nenhuma foto.

### B — É resíduo (há Node em produção)

Aí sim ligar o otimizador. **Antes** de tirar a flag:

1. Conferir cada `sizes` contra a **caixa medida**, não contra conta de cabeça. Errar para baixo é o lado ruim: o navegador serve candidato menor que a caixa (precedente SIS-139: a trilha da grade não era a caixa da foto).
2. Confirmar runtime do otimizador, ou `loader` apontando para serviço externo.
3. Medir peso e LCP em **`next start`**, nunca em `next dev` (a compilação sob demanda distorce o número; SIS-136 já registrou isso).

Tirar a flag faz todos os `sizes` valerem de imediato. Valor errado vira foto borrada ou byte desperdiçado em produção, sem ninguém ter mexido naquela linha.

## Onde olhar quando for usar

| O quê | Onde |
| -- | -- |
| A flag | `next.config.mjs` |
| Modelo de ressalva ao lado de `sizes` | `src/app/esg/page.tsx` (bloco ENVIRONMENT) |
| Heros `sizes="100vw"` (valor trivial; impacto A/B maior) | `src/components/ui/HeroImageBackdrop.tsx` e afins |
| Lista dos `sizes` | `grep -rn "sizes=" src --include=*.tsx` |

## Critério para reabrir o assunto

Só reabrir (issue nova, se precisar) quando existir resposta explícita de publicação:

- estático / sem otimizador → desfecho A, documentação no config se ainda faltar;
- `next start` ou CDN com loader → desfecho B, medição em produção local (`next start`) e varredura dos `sizes`.
