# Prompt — tipografia inspirada no Terminal Industries

Use este prompt no Claude Code:

---

Analise o projeto atual e implemente um sistema tipográfico inspirado especificamente no estilo de escrita de https://terminal-industries.com/. Restrinja a alteração à tipografia: não copie a identidade visual da Terminal Industries e não altere textos, cores, layout, espaçamentos, componentes, imagens, ícones ou animações, exceto por ajustes mínimos indispensáveis para impedir corte ou overflow do texto.

A referência utiliza duas camadas tipográficas:

1. Camada proporcional: Geist Sans 400 para hero, títulos, subtítulos, navegação e parágrafos; peso 500 somente para navegação e ênfases intencionais. O resultado deve parecer suíço, industrial, neutro, direto e preciso. A hierarquia deve ser construída principalmente por tamanho e espaçamento, não por títulos excessivamente pesados.
2. Camada técnica: Geist Mono 600 para botões, labels curtas, categorias, metadados, valores, códigos, estados, timestamps e interfaces orientadas por dados. A fonte monoespaçada não deve ser utilizada em parágrafos ou títulos longos.

Regra das fontes:

- Use obrigatoriamente a dupla gratuita Geist Sans 400/500 e Geist Mono 600, distribuída oficialmente pela Vercel sob a SIL Open Font License.
- Prefira `next/font/google` quando as fontes estiverem disponíveis no Next.js; alternativamente use o pacote oficial `geist`, Google Fonts ou o ZIP oficial da Vercel.
- Não procure nem use Suisse Int'l, mesmo que o projeto ainda não tenha fontes configuradas. Ela é apenas a referência visual paga que está sendo substituída.
- Não extraia, baixe, copie, faça hotlink ou reutilize arquivos de fonte do site terminal-industries.com nem de repositórios e sites de download não oficiais.
- Informe no relatório final que Geist Sans é uma alternativa gratuita visualmente compatível, não a fonte exata da Terminal Industries.

Antes de editar:

- Identifique framework e versão, root layout ou entrypoint, estilos globais, versão do Tailwind se houver, carregador de fontes atual, design tokens e componentes compartilhados de texto.
- Localize métricas, contadores, tabelas, preços, durações, campos e labels que se beneficiem da camada monoespaçada.
- Liste os arquivos que pretende alterar e explique brevemente por quê.
- Preserve convenções existentes e prefira o carregador nativo do framework.

Implemente de maneira centralizada com variáveis CSS ou com o sistema de tokens existente:

- `--font-proportional`: Geist Sans; fallbacks Helvetica Neue, Arial e sans-serif.
- `--font-mono`: Geist Mono; fallbacks SFMono-Regular, Consolas e monospace.

Crie papéis semânticos com estes parâmetros:

- `display`: proporcional 400; `clamp(3rem, 6vw, 4.375rem)`; alvo desktop 70px; line-height `1.10`; letter-spacing `-.020em`; largura aproximada entre `14ch` e `18ch`.
- `headline-lg`: proporcional 400; `clamp(2.5rem, 4.5vw, 3rem)`; alvo 48px; line-height `1.16`; letter-spacing `-.015em`.
- `headline-md`: proporcional 400; `clamp(2rem, 3.4vw, 2.25rem)`; alvo 36px; line-height `1.22`; letter-spacing `-.010em`.
- `title-lg`: proporcional 400; `clamp(1.375rem, 2.2vw, 1.5rem)`; alvo 24px; line-height `1.33`.
- `body-lg`: proporcional 400; 18px; line-height `1.56`; largura máxima aproximada de `60ch`.
- `body`: proporcional 400; 16px; line-height `1.50`; largura máxima aproximada de `65ch`.
- `label`: Geist Mono 600; 11px; line-height `1.45`; letter-spacing `.050em`; uppercase somente em rótulos curtos.
- `caption`: Geist Mono 600; 10px; line-height `1.40`; letter-spacing `.080em`; apenas metadados muito compactos.

Regras de aplicação:

- Use a fonte proporcional em títulos, navegação e leitura. Não transforme automaticamente títulos em 600/700; mantenha 400 como assinatura principal.
- Use Geist Mono somente em linguagem funcional curta: botão, status, ID, categoria, código, timestamp, valor, input ou métrica.
- Não misture a fonte proporcional e a monoespaçada dentro do mesmo bloco de leitura.
- Use `text-wrap: balance` em títulos curtos e `text-wrap: pretty` em parágrafos quando suportado.
- Aplique `font-variant-numeric: tabular-nums` e `font-feature-settings: "tnum" 1` a valores que mudam, como métricas, preços, percentuais, horários, contadores e dashboards.
- Use `font-display: swap` ou equivalente nativo, carregue apenas os pesos e subsets utilizados e aplique `font-synthesis: none` para impedir pesos artificiais.
- Não anime parágrafos caractere por caractere. Reveals tipográficos devem ficar limitados a frases curtas e manter o texto integral e acessível no DOM.
- Não force uppercase em frases longas em português.

Responsividade e acessibilidade:

- Use os valores `clamp()` e valide em 320px, 768px, 1024px e desktop amplo.
- Não use altura fixa em contêineres de títulos.
- Não diminua o corpo abaixo de 16px para preservar uma quebra de linha do desktop.
- Labels monoespaçadas podem ter 10–12px, mas botões e controles devem manter área interativa mínima de 44px.
- Permita que labels longas em português quebrem ou que o controle cresça; não comprima o texto a tamanhos ilegíveis.

Orientação por framework:

- Next.js: use `Geist` e `Geist_Mono` por `next/font/google`, carregando somente 400/500 na Sans e 600 na Mono. Aplique as classes de variável geradas no root layout.
- Nuxt/Vue: preserve o módulo de fontes existente se houver; caso contrário, registre os arquivos uma única vez no CSS global com `@font-face` e exponha variáveis semânticas.
- Tailwind v4: mapeie as variáveis em `@theme inline`; Tailwind v3: estenda `theme.fontFamily` no `tailwind.config`.
- CSS puro: use `@font-face` apenas para arquivos locais licenciados e nunca aponte para ativos hospedados pela Terminal Industries.

Validação:

- Execute lint, type-check, testes e build existentes e relevantes.
- Confirme em DevTools a fonte computada no hero, título, parágrafo, navegação, botão e métrica.
- Verifique caracteres `ã á é í ó ú ç`, números, moeda brasileira, percentuais, vírgulas decimais, datas e horários.
- Procure clipping, overflow, pesos artificiais, layout shift excessivo e números desalinhados.
- Confirme que a alteração não importou textos, verde característico, logotipo, fotografias, composição ou animações da Terminal Industries.
- Se não for possível testar visualmente, declare essa limitação em vez de afirmar que o resultado foi validado.

Ao concluir, informe: arquivos alterados, Geist Sans e Geist Mono com os pesos carregados, papéis semânticos criados, elementos que receberam Geist Mono, validações executadas e qualquer revisão visual restante.

Contexto específico do projeto: [adicione aqui, se necessário]
