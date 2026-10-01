/**
 * SIS-226 — Consentimento de cookies: estado, persistência e cópia.
 *
 * Por que um módulo próprio e não dentro do componente: a decisão gravada aqui é
 * o que UM DIA vai liberar (ou não) script de terceiro, e esse ponto de leitura
 * não pode morar dentro de um componente de UI que alguém desmonta ao redesenhar
 * o painel. Hoje o projeto não tem `gtag`, GTM nem pixel nenhum — conferido, e é
 * por isso que `aplicarConsentimento` abaixo é um gancho documentado e não uma
 * função que carrega algo.
 *
 * ⚠️ NÃO é o módulo da preferência de MOVIMENTO. `motionPreference.ts` é outra
 * peça, com outra chave de storage e outro diálogo, e o diálogo de lá se descreve
 * «como um aviso de cookies» sem ser consentimento de LGPD. Misturar os dois
 * significaria uma escolha de acessibilidade valendo como base legal de
 * tratamento de dado — são assuntos diferentes e ficam separados de propósito.
 */

/** As cinco categorias do padrão de mercado, na ordem em que o painel as mostra. */
export type CookieCategoryId =
  | 'necessary'
  | 'functional'
  | 'analytics'
  | 'performance'
  | 'advertisement';

export type CookieConsentState = Record<CookieCategoryId, boolean>;

export const COOKIE_CONSENT_STORAGE_KEY = 'sistran-cookie-consent';

/**
 * Versão do consentimento gravado. Existe para o dia em que uma categoria nova
 * entrar na lista: sem ela, quem já decidiu ficaria com a decisão antiga valendo
 * para uma categoria sobre a qual nunca foi perguntado — o que não é
 * consentimento. Subir este número faz o painel voltar a perguntar.
 */
export const COOKIE_CONSENT_VERSION = 1;

type ConsentRecord = {
  versao: number;
  estado: CookieConsentState;
  /** ISO. Prova de QUANDO a escolha foi feita, que é o que uma auditoria pede. */
  em: string;
};

/**
 * `necessary` nasce e MORRE em `true`: é a categoria sem a qual o site não
 * funciona, e por isso o painel a mostra como "Sempre ativo" sem interruptor. O
 * resto nasce desligado — opt-in, não opt-out. Esta é a diferença entre pedir
 * consentimento e presumi-lo, e é o default mesmo de quem só fecha o painel.
 */
export const CONSENTIMENTO_PADRAO: CookieConsentState = {
  necessary: true,
  functional: false,
  analytics: false,
  performance: false,
  advertisement: false,
};

/** Tudo ligado — o que o botão «Aceitar tudo» grava. */
export const CONSENTIMENTO_TOTAL: CookieConsentState = {
  necessary: true,
  functional: true,
  analytics: true,
  performance: true,
  advertisement: true,
};

/**
 * «Rejeitar tudo» grava exatamente o padrão: `necessary` segue ligado porque
 * recusá-lo seria recusar o próprio site, e é por isso que ele não tem
 * interruptor no painel. Não é um "tudo" com exceção escondida — o texto da
 * categoria diz, na cópia abaixo, que ela é essencial e não guarda dado pessoal.
 */
export const CONSENTIMENTO_MINIMO: CookieConsentState = CONSENTIMENTO_PADRAO;

function ehEstadoValido(valor: unknown): valor is CookieConsentState {
  if (typeof valor !== 'object' || valor === null) return false;
  const registro = valor as Record<string, unknown>;
  return (['necessary', 'functional', 'analytics', 'performance', 'advertisement'] as const).every(
    (chave) => typeof registro[chave] === 'boolean',
  );
}

/**
 * Devolve a escolha gravada, ou `null` quando AINDA NÃO HÁ ESCOLHA. O `null` é
 * significativo e não deve ser trocado por `CONSENTIMENTO_PADRAO`: é ele que
 * distingue "recusou tudo" de "nunca foi perguntado", e é a segunda que faz o
 * painel abrir na primeira visita.
 */
export function lerConsentimento(): CookieConsentState | null {
  try {
    const cru = localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
    if (!cru) return null;
    const registro = JSON.parse(cru) as Partial<ConsentRecord>;
    /* Versão diferente = pergunta nova pendente. Ver COOKIE_CONSENT_VERSION. */
    if (registro?.versao !== COOKIE_CONSENT_VERSION) return null;
    if (!ehEstadoValido(registro.estado)) return null;
    /* `necessary` é normalizado na leitura, e não só na escrita: um storage
       editado à mão (ou um registro de versão futura que volte atrás) não deve
       conseguir desligar o essencial. */
    return { ...registro.estado, necessary: true };
  } catch {
    /* storage é opcional — modo privativo, cookies bloqueados, cota cheia. Sem
       ele o site funciona; o que se perde é a memória da escolha, e o painel
       volta a perguntar. Melhor que quebrar. */
    return null;
  }
}

export function gravarConsentimento(estado: CookieConsentState): void {
  const normalizado: CookieConsentState = { ...estado, necessary: true };
  try {
    const registro: ConsentRecord = {
      versao: COOKIE_CONSENT_VERSION,
      estado: normalizado,
      em: new Date().toISOString(),
    };
    localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, JSON.stringify(registro));
  } catch {
    /* storage é opcional — ver `lerConsentimento`. */
  }
  aplicarConsentimento(normalizado);
}

/**
 * ⚠️ AQUI É O GANCHO, e ele está vazio de propósito.
 *
 * Hoje o site não carrega NENHUM script de terceiro: não há `gtag`, GTM, pixel
 * de anúncio nem mapa de calor em `src/`. Então gravar a escolha é tudo o que
 * existe para fazer, e qualquer código a mais aqui seria andaime para algo que
 * ninguém pediu.
 *
 * Quando entrar o primeiro script de terceiro, ele entra POR AQUI e não no
 * `layout` — a ordem certa é: nada é injetado antes de esta função ver o estado
 * e ver `true` na categoria correspondente. O mapa é:
 *
 *   • `analytics`      → Google Analytics / Plausible / similar
 *   • `performance`    → RUM, Web Vitals enviados para fora, mapa de calor
 *   • `advertisement`  → pixel de anúncio, remarketing
 *   • `functional`     → incorporação de rede social, widget de atendimento
 *
 * E o inverso importa igual: quem RETIRA o consentimento espera que o script
 * pare. Script já injetado não desaparece do documento — então a retirada de uma
 * categoria que já carregou algo precisa de `window.location.reload()` (é o
 * mesmo caminho honesto que o `MotionPreferenceDialog` usa quando a política de
 * movimento muda depois de GSAP e Lenis já terem medido a página).
 */
export function aplicarConsentimento(_estado: CookieConsentState): void {
  /* Sem terceiros no projeto: nada a ligar ou desligar. Ver o bloco acima. */
  void _estado;
}

export type CookieCategoryCopy = {
  id: CookieCategoryId;
  label: string;
  /** Texto da categoria, como a issue o traz. */
  texto: string;
  /** Só `necessary`: o rótulo que substitui o interruptor. */
  sempreAtivo?: string;
  /** Só `necessary`: a linha de inventário vazio. */
  inventario?: string;
};

/**
 * Cópia do painel. Mora aqui pelo mesmo motivo que a de `motionPreference.ts`: o
 * projeto não tem `@/content/site`.
 *
 * ⚠️ FONTE DA CÓPIA: as quatro linhas de abertura e quatro dos cinco textos de
 * categoria são os da issue, palavra por palavra — não parafraseados. O de
 * ANÚNCIO é a exceção declarada: o texto colado na issue repetia o de Desempenho,
 * e a própria issue manda usar o padrão Cookiebot PT-BR no lugar. É o único
 * parágrafo aqui que não veio do texto original, e está assinalado na linha dele.
 */
export const cookieConsentCopy = {
  title: 'Personalizar preferências de consentimento',
  paragrafos: [
    'Utilizamos cookies para ajudar você a navegar com eficiência e executar determinadas funções. Você encontrará informações detalhadas sobre todos os cookies em cada categoria de consentimento abaixo.',
    'Os cookies categorizados como "Necessários" são armazenados no seu navegador, pois são essenciais para habilitar as funcionalidades básicas do site.',
    'Também utilizamos cookies de terceiros que nos ajudam a analisar como você usa este site, armazenar suas preferências e fornecer conteúdo e anúncios relevantes para você.',
    'Esses cookies só serão armazenados no seu navegador com o seu consentimento prévio. Você pode optar por ativar ou desativar alguns ou todos esses cookies, mas desativar alguns deles pode afetar sua experiência de navegação.',
  ],
  categorias: [
    {
      id: 'necessary',
      label: 'Necessário',
      texto:
        'Os cookies necessários são essenciais para habilitar os recursos básicos deste site, como fornecer login seguro ou ajustar suas preferências de consentimento. Esses cookies não armazenam nenhum dado de identificação pessoal.',
      sempreAtivo: 'Sempre ativo',
      inventario: 'Nenhum cookie para exibir.',
    },
    {
      id: 'functional',
      label: 'Funcional',
      texto:
        'Os cookies funcionais ajudam a executar certas funcionalidades, como compartilhar o conteúdo do site em plataformas de mídia social, coletar feedback e outros recursos de terceiros.',
    },
    {
      id: 'analytics',
      label: 'Análise',
      texto:
        'Cookies analíticos são usados para entender como os visitantes interagem com o site. Esses cookies ajudam a fornecer informações sobre métricas como o número de visitantes, taxa de rejeição, fonte de tráfego, etc.',
    },
    {
      id: 'performance',
      label: 'Desempenho',
      texto:
        'Os cookies de desempenho são usados para entender e analisar os principais índices de desempenho do site, o que ajuda a oferecer uma melhor experiência do usuário para os visitantes.',
    },
    {
      id: 'advertisement',
      label: 'Anúncio',
      /* ⚠️ ÚNICO texto que NÃO é o da usuária: o colado na issue repetia o de
         Desempenho palavra por palavra, e a issue manda usar o padrão Cookiebot
         PT-BR aqui. Trocar por uma paráfrase do de Desempenho seria repetir o
         defeito. */
      texto:
        'Cookies de anúncio são usados para fornecer aos visitantes anúncios relevantes e campanhas de marketing. Esses cookies rastreiam visitantes em sites e coletam informações para fornecer anúncios personalizados.',
    },
  ] as CookieCategoryCopy[],
  acoes: {
    rejeitar: 'Rejeitar tudo',
    salvar: 'Salvar minhas preferências',
    aceitar: 'Aceitar tudo',
  },
  /** Rótulo do lançador flutuante — a pílula escura da captura de referência. */
  launcher: 'Preferências de consentimento',
  fechar: 'Fechar',

  /**
   * SIS-226 (2ª volta) — A FAIXA CURTA DA PRIMEIRA VISITA.
   *
   * POR QUE ELA EXISTE, e por que não reaproveita `title`/`paragrafos`: na 1ª
   * volta a primeira visita abria o PAINEL completo, com os quatro parágrafos e
   * os cinco interruptores. O pedido direto da 2ª volta é o contrário — a
   * primeira visita é uma faixa curta, e o painel só aparece por vontade de quem
   * navega. Os dois textos servem momentos diferentes: esta faixa tem de ser
   * lida em dois segundos, e `paragrafos` é o texto de quem PAROU para ajustar.
   * Encurtar `paragrafos` para caber aqui apagaria o texto do painel; usá-lo
   * inteiro aqui devolveria o painel que a volta pediu para tirar.
   *
   * ⚠️ TEXTO VERBATIM DA ISSUE — título, parágrafo e os TRÊS rótulos. As aspas
   * em «Aceitar todos» dentro do parágrafo são as curvas tipográficas (“ ”), que
   * é como a issue as escreve; e o parágrafo diz «Aceitar todos» enquanto o botão
   * diz «Aceitar tudo». Essa diferença está na fonte e NÃO é para ser
   * harmonizada aqui: uniformizar as duas seria reescrever cópia aprovada. Se a
   * usuária quiser as duas iguais, muda na issue e volta para cá.
   *
   * ⚠️ `banner.aceitar`/`banner.rejeitar` repetem por valor o que `acoes` já diz.
   * A repetição é deliberada: são duas superfícies, e o dia em que a faixa
   * precisar de «Aceitar» curto (a 390px os três botões dividem uma linha) o
   * painel não deve mudar junto. Um alias para `acoes` amarraria as duas.
   */
  banner: {
    titulo: 'Política de privacidade',
    texto:
      'Utilizamos cookies para melhorar sua experiência de navegação, veicular anúncios ou conteúdo personalizado e analisar nosso tráfego. Ao clicar em “Aceitar todos”, você concorda com o uso de cookies.',
    personalizar: 'Personalizar',
    rejeitar: 'Rejeitar tudo',
    aceitar: 'Aceitar tudo',
  },
};
