# Prompt para Claude Code

Copie o conteúdo abaixo e substitua apenas o campo final de contexto, se necessário.

---

Analise o projeto atual e implemente um sistema tipográfico inspirado especificamente no estilo de escrita de https://waabi.ai/. Restrinja a alteração à tipografia: não copie a identidade visual da Waabi e não altere textos, cores, layout, sistema de espaçamento, componentes, imagens, ícones ou animações, exceto por um ajuste mínimo necessário para evitar corte ou transbordamento do texto.

A referência usa dois papéis tipográficos contrastantes:

1. Display/editorial: F37 Zagma Regular 400 para hero, títulos de seção e frases editoriais curtas. O resultado deve parecer expressivo, escultural e compacto.
2. Corpo/interface: Neue Haas Grotesk 400 e 500 para parágrafos, navegação, botões, formulários, labels, legendas e metadados. O resultado deve parecer neutro, preciso e muito legível.

Regra de licença:

- Não extraia, baixe, copie, faça hotlink ou reutilize arquivos de fonte do site waabi.ai nem de sites não oficiais.
- Procure no repositório por arquivos webfont de F37 Zagma e Neue Haas Grotesk fornecidos legalmente e por eventuais registros de licença.
- Se as duas famílias licenciadas já estiverem disponíveis, carregue-as localmente e use somente os pesos necessários: 400 para F37 Zagma; 400 e 500 para Neue Haas Grotesk.
- Se esses arquivos licenciados não existirem, use Instrument Serif 400 como alternativa display e Inter 400/500 como alternativa de corpo/interface. No relatório final, diga claramente que são alternativas open source visualmente compatíveis, não as fontes exatas da Waabi.
- Não converta arquivos proprietários para outro formato sem permissão expressa da licença.

Antes de editar:

- Identifique framework e versão, root layout, estilos globais, versão do Tailwind se houver, carregador atual de fontes, tokens tipográficos e componentes compartilhados de texto.
- Liste os arquivos que pretende alterar e explique brevemente por quê.
- Preserve as convenções existentes e não adicione dependência se o framework já possuir um carregador nativo de fontes.

Implemente de forma centralizada com variáveis CSS ou com o sistema de tokens existente:

- `--font-display`: F37 Zagma licenciada; na ausência dela, Instrument Serif; fallbacks Georgia e serif.
- `--font-sans`: Neue Haas Grotesk licenciada; na ausência dela, Inter; fallbacks Helvetica Neue, Arial e sans-serif.

Crie papéis semânticos com os seguintes parâmetros:

- `display-xl`: display 400; `clamp(4rem, 10.4vw, 9.375rem)`; line-height `.85`; letter-spacing `-.048em`; largura aproximada `10ch`.
- `display`: display 400; `clamp(3.5rem, 7vw, 5rem)`; line-height `.9`; letter-spacing `-.04em`; largura aproximada `12ch`.
- `heading-lg`: display 400; `clamp(2.75rem, 5vw, 3.75rem)`; line-height `1.05`; letter-spacing `-.03em`.
- `heading`: display 400; `clamp(2rem, 3.5vw, 2.5rem)`; line-height `1.1`; letter-spacing `-.02em`.
- `heading-sm`: display 400; mínimo de 24px; line-height `1.2`; letter-spacing `-.015em`.
- `body-lg`: sans 400; `clamp(1.125rem, 1.5vw, 1.5rem)`; line-height `1.45`.
- `body`: sans 400; 16px; line-height `1.6`; letter-spacing `.005em`; largura aproximada `65ch`.
- `label`: sans 500; 12px; line-height `1.4`; letter-spacing `.02em`.
- `caption`: sans 400; 10–12px; line-height `1.4`; letter-spacing `.01em`.

Regras de aplicação:

- Use a fonte display somente em textos grandes e intencionais, normalmente `h1` a `h3` e frases editoriais selecionadas. Não aplique automaticamente em todo título ou controle.
- Use a sans em todo texto de leitura e interação.
- Mantenha o peso da display em 400; não tente simular o estilo com 600/700.
- Use `text-wrap: balance` nos títulos e `text-wrap: pretty` nos parágrafos quando suportado.
- Use `font-display: swap` ou equivalente nativo, carregue apenas pesos e subsets necessários e aplique `font-synthesis: none` para evitar pesos artificiais.
- Abaixo de 768px, permita que `clamp()` reduza os títulos. Relaxe o tracking de `display-xl` para aproximadamente `-.035em` somente se houver colisão entre glifos.
- Não force no mobile ou em traduções as mesmas quebras de linha do desktop.
- Preserve HTML semântico e zoom acessível; não coloque alturas fixas em contêineres de títulos.

Orientação por framework:

- Next.js: prefira `next/font/local` para `.woff2` licenciados e locais; use `next/font/google` para Instrument Serif e Inter. Aplique as classes de variável geradas no root layout.
- Tailwind v4: exponha as variáveis de fonte em `@theme inline`; no Tailwind v3, estenda `theme.fontFamily` no `tailwind.config`.
- CSS puro: use `@font-face` somente para arquivos locais licenciados e nunca aponte para recursos hospedados pela Waabi.

Validação:

- Execute lint, type-check, testes e build já existentes e relevantes.
- Inspecione desktop e mobile com 320px de largura.
- Confirme a fonte computada em hero, corpo, navegação e botões.
- Verifique `ã á é í ó ú ç`, pontuação, números e palavras longas.
- Procure corte, overflow, pesos artificiais, layout shift excessivo e corpo de texto pequeno demais.
- Se não for possível testar visualmente, declare essa limitação; não afirme que a aparência foi validada.

Ao concluir, informe: modo escolhido (exato licenciado ou open source), arquivos alterados, fontes e pesos carregados, papéis semânticos criados, validações executadas e qualquer etapa manual restante de licença ou revisão visual.

Contexto específico do projeto: [adicione aqui, se necessário]
