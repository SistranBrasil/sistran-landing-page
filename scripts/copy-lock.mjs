/**
 * Copy Lock — Regra Zero do relatorio de UX (p3).
 *
 * Trava a escrita do site em `copy-lock.json` com IDs estaveis, para que
 * qualquer alteracao de texto passe a ser visivel:
 * `node scripts/copy-lock.mjs --check` falha e mostra o que mudou.
 *
 *   node scripts/copy-lock.mjs           grava/atualiza o lock (uso deliberado)
 *   node scripts/copy-lock.mjs --check   verifica; sai com 1 se divergir
 *
 * Sem dependencia nova de proposito: o relatorio manda preservar a stack.
 *
 * DE ONDE ELE EXTRAI (SIS-171) — por POSICAO no codigo, nao "toda string do
 * arquivo", que era a promessa antiga de "todo o texto visivel":
 *
 *   1. `src/data/**`           todos os literais de string. Sao arquivos de
 *                              conteudo: a chave do objeto varia demais
 *                              (`highlight`, `destaque`, `resumo`) para valer
 *                              uma lista fechada.
 *   2. `src/app`/`components`  nos de texto do JSX e um conjunto DECLARADO de
 *                              props/chaves de texto (`PROPS_DE_TEXTO`). O
 *                              resto das strings desses arquivos é classe,
 *                              seletor, id de ancora, chave tecnica — nao é
 *                              copy, e antes entrava toda e era filtrada por
 *                              heuristica depois.
 *
 * O QUE ELE IGNORA, e este é o defeito que a SIS-171 corrigiu:
 *
 *   - COMENTARIOS, removidos do fonte ANTES de qualquer extracao
 *     (`tiraComentarios`). O projeto comenta o codigo que sai de cena, com o
 *     motivo, em portugues e por extenso — ou seja, gera de proposito prosa com
 *     a mesma FORMA da copy. Nenhuma heuristica por forma distingue prosa em
 *     `/* *\/` de prosa em `<p>`, e era isso que inflava o lock (458 entradas
 *     novas de ruido numa volta) até o diff ficar ilegivel e o portao deixar de
 *     ser portao: o unico sinal real de dezoito só apareceu por conferencia
 *     manual.
 *   - `pareceCodigo()` continua, agora como SEGUNDA rede sobre um material já
 *     muito mais limpo. Falso positivo dela é inofensivo (uma string tecnica a
 *     mais travada); falso negativo é o que precisa ser evitado.
 *
 * ID = `<caminho relativo>:<n>`, onde n é a ordem de aparicao no arquivo.
 * Mover um bloco dentro do arquivo renumera os IDs seguintes — o teste continua
 * apontando a diferenca, so com ID diferente. O que importa é o conjunto de
 * textos, e ele é comparado tambem por valor (ver `resumo`).
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const RAIZ = join(import.meta.dirname, '..');
const SRC = join(RAIZ, 'src');
const LOCK = join(RAIZ, 'copy-lock.json');

const EXTENSOES = ['.ts', '.tsx'];

function arquivos(dir, acc = []) {
  for (const nome of readdirSync(dir).sort()) {
    const caminho = join(dir, nome);
    if (statSync(caminho).isDirectory()) arquivos(caminho, acc);
    else if (EXTENSOES.some((e) => nome.endsWith(e))) acc.push(caminho);
  }
  return acc;
}

/**
 * Remove comentarios `/* *\/` e `// …` preservando tudo o mais, inclusive as
 * posicoes de linha (o conteudo removido vira espaco, e as quebras de linha
 * ficam) — assim nenhum outro passo precisa saber que isto aconteceu.
 *
 * É um scanner de caracteres com estado, e nao uma sequencia de `replace`, por
 * um motivo concreto: `//` aparece dentro de string e dentro de URL, e é ali
 * que a remocao ingenua estraga o arquivo. Os tres casos que derrubam a versao
 * ingenua, todos presentes neste repositorio:
 *
 *   'https://sistran.com.br'   `//` dentro de string  -> preservado pelo estado
 *   /^https?:\/\//             `\/\/` dentro de REGEX -> ver `podeSerRegex`
 *   href="https://…"           `//` em atributo JSX   -> string, mesmo caso
 *
 * O caso da regex é o mais traicoeiro: `\/\/` tem duas barras ADJACENTES no
 * meio (`\ / \ / /`), e um scanner que só conheca strings le isso como inicio
 * de comentario e apaga o resto da linha — apagando codigo, o que faz copy real
 * DESAPARECER do lock. Falso negativo é a direcao perigosa deste script.
 *
 * Nao é um parser de JS. É deliberado: o script nao tem dependencia, e o que
 * ele precisa distinguir é apenas "estou dentro de literal?".
 */
function tiraComentarios(codigo) {
  /* `/` inicia regex ou é divisao? A decisao depende do ultimo caractere
     significativo antes dele — a heuristica classica. Em TSX `<div />` e
     `</div>` tambem trazem `/`: ali o anterior é `<` ou espaco, que NAO estao
     na lista, entao sao lidos como divisao e simplesmente atravessam intactos,
     que é o resultado certo. */
  const podeSerRegex = (anterior) => anterior === '' || '(,=:[!&|?{};+-*%~^\n'.includes(anterior);

  let fora = '';
  let i = 0;
  let ultimoSignificativo = '';
  while (i < codigo.length) {
    const c = codigo[i];
    const prox = codigo[i + 1];

    /* Comentario de bloco: some, virando espaco, e as quebras de linha de
       dentro sao mantidas para nao mover as linhas do arquivo. */
    if (c === '/' && prox === '*') {
      const fim = codigo.indexOf('*/', i + 2);
      const corpo = fim === -1 ? codigo.slice(i) : codigo.slice(i, fim + 2);
      fora += corpo.replace(/[^\n]/g, ' ');
      i += corpo.length;
      continue;
    }

    /* Comentario de linha. O `:` antes é a guarda do protocolo (`https://`)
       para o caso de a URL aparecer como TEXTO de JSX, fora de qualquer string
       — ali nao existe estado de literal que a proteja. */
    if (c === '/' && prox === '/' && ultimoSignificativo !== ':') {
      const fim = codigo.indexOf('\n', i);
      i = fim === -1 ? codigo.length : fim;
      continue;
    }

    /* Literais: copiados inteiros, com escapes, sem olhar o conteudo. Template
       com interpolacao é copiado do mesmo jeito; quem decide o que fazer com
       `${}` é `literais()`, mais adiante. */
    if (c === '"' || c === "'" || c === '`') {
      let j = i + 1;
      while (j < codigo.length) {
        if (codigo[j] === '\\') j += 2;
        else if (codigo[j] === c) break;
        /* String simples nao cruza linha: se cruzou, quem abriu nao era
           delimitador de string (apostrofo em texto de JSX, por exemplo) e
           insistir engoliria o arquivo inteiro. */
        else if (codigo[j] === '\n' && c !== '`') break;
        else j += 1;
      }
      if (codigo[j] !== c) {
        /* Nao fechou: trata como caractere comum e segue. */
        fora += c;
        ultimoSignificativo = c;
        i += 1;
        continue;
      }
      fora += codigo.slice(i, j + 1);
      ultimoSignificativo = c;
      i = j + 1;
      continue;
    }

    if (c === '/' && podeSerRegex(ultimoSignificativo)) {
      /* Regex: consumir até a barra final, respeitando escape e classe
         `[...]` (dentro dela uma `/` crua nao termina o literal). */
      let j = i + 1;
      let emClasse = false;
      while (j < codigo.length && codigo[j] !== '\n') {
        if (codigo[j] === '\\') j += 2;
        else if (codigo[j] === '[') (emClasse = true), (j += 1);
        else if (codigo[j] === ']') (emClasse = false), (j += 1);
        else if (codigo[j] === '/' && !emClasse) break;
        else j += 1;
      }
      if (codigo[j] === '/') {
        fora += codigo.slice(i, j + 1);
        ultimoSignificativo = '/';
        i = j + 1;
        continue;
      }
      /* Nao era regex (divisao mesmo): cai no caminho comum. */
    }

    fora += c;
    if (!/\s/.test(c) || c === '\n') ultimoSignificativo = c;
    i += 1;
  }
  return fora;
}

/**
 * Entidade HTML -> o caractere que o visitante ve de fato.
 *
 * Nao é enfeite: entidade tem `;`, e o filtro `pareceCodigo()` descarta qualquer
 * string com `;` como fragmento de codigo. Efeito medido: o paragrafo de
 * "Cookies de estatisticas" da politica de privacidade nao entrava no lock, por
 * conta dos `&ldquo;` no meio dele. Travar o texto RENDERIZADO é ainda o
 * comportamento certo: é ele que a pessoa le.
 */
const ENTIDADES = {
  '&ldquo;': '“',
  '&rdquo;': '”',
  '&lsquo;': '‘',
  '&rsquo;': '’',
  '&mdash;': '—',
  '&ndash;': '–',
  '&hellip;': '…',
  '&nbsp;': ' ',
  '&middot;': '·',
  '&times;': '×',
  '&quot;': '"',
  '&apos;': "'",
  '&amp;': '&',
};

function comEntidadesResolvidas(texto) {
  return texto.replace(/&(?:ldquo|rdquo|lsquo|rsquo|mdash|ndash|hellip|nbsp|middot|times|quot|apos|amp);/g, (e) => ENTIDADES[e]);
}

/** Heuristica: a string é codigo, nao escrita para o visitante? */
function pareceCodigo(s) {
  if (!/[A-Za-zÀ-ÿ]/.test(s)) return true; // sem letra: numero, simbolo, espaco
  if (s.length < 2) return true;
  if (/^[@./#]/.test(s)) return true; // import, rota, ancora, cor hex
  if (/^https?:\/\//.test(s)) return true; // URL nao é copy
  if (/^[a-z0-9_-]+$/.test(s)) return true; // id kebab/snake
  if (/^[a-z]+(?:[A-Z][a-z0-9]*)+$/.test(s)) return true; // camelCase
  if (/^[A-Z][A-Z0-9_]*$/.test(s)) return true; // CONSTANTE
  if (/(rgba?\(|linear-gradient|cubic-bezier|\d+px|\d+vh|\d+svh|\d+rem)/.test(s)) return true;
  if (/^(?:image|video|font|application)\//.test(s)) return true; // mime
  /* Dado de path SVG. A string TODA precisa ser comando + coordenada: exigir
     apenas o inicio derrubava frase real, porque "A Sistran ..." tambem comeca
     com um comando valido (`A`) seguido de espaco. */
  if (/^[MmLlHhVvCcSsQqTtAaZz][\s\d.,-]/.test(s) && /^[MmLlHhVvCcSsQqTtAaZz\s\d.,-]+$/.test(s))
    return true;
  if (/^[a-z]{2,3}-[A-Z]{2}$/.test(s)) return true; // locale BCP47 ("pt-BR")
  if (/<\/?[a-z]/i.test(s)) return true; // tag citada em comentario
  // Especificador de modulo ("next/navigation", "motion/react").
  if (!/\s/.test(s) && s.includes('/') && /^[a-z@][a-z0-9._/-]*$/i.test(s)) return true;
  /* Fragmentos que o `textoJsx` mais permissivo passou a alcancar: assinatura
     de funcao, chamada, especificador de import e resto de template.
     As fronteiras de palavra sao obrigatorias: sem elas "constante" e "novas"
     seriam lidos como `const` e `new`, e escrita real cairia fora do lock.
     Nao existe regra por pontuacao inicial: frase que continua depois de um
     trecho em destaque comeca com virgula e é escrita legitima. */
  /* Fronteira propria, nao `\b`: para o JS `const` termina antes do `a` de
     "constancia" acentuada, e "constância" seria descartada como codigo. */
  /* SIS-173 — `declare`, `catch`, `throw`, `class` e `interface` entraram nesta
     lista junto com o afrouxamento das duas regras seguintes: `catch (e)` e
     `declare global` eram descartados de raspao pela regra de token (duas
     palavras minusculas), e essa passagem deixou de existir. */
  if (/(?<![A-Za-zÀ-ÿ])(?:export|function|const|let|var|return|import|typeof|async|await|new|declare|catch|throw|class|interface)(?![A-Za-zÀ-ÿ])/.test(s))
    return true;
  if (/\bfrom\s+["']/.test(s)) return true;
  if (/\w\(|\$\{|\$$/.test(s)) return true;
  /* Restos de objeto/tipo colhidos entre `}` e `{`: `, contactPoint:`,
     `: Props)`, `], keywords: [`. Escrita para o visitante nao comeca com dois
     pontos nem termina em nome de propriedade seguido de dois pontos. */
  if (/^\s*[:[\]]/.test(s)) return true;
  if (/\/\*|\*\//.test(s)) return true; // comentario de bloco vazado
  if (/(?:^|\s)\/\//.test(s)) return true; // comentario de linha vazado
  if (/^,\s*(?:[A-Za-z_$][\w$]*:\s*$|[[\]{}])/.test(s)) return true; // resto de objeto/array
  if (/^(?:if|for|while|switch)\s*\(/.test(s)) return true; // condicao vazada
  /* Fragmento de codigo que escapou do regex de JSX (`>` ... `<` com logica).
     SIS-173 — o `;` sozinho NAO é sinal de codigo: em portugues corrido ele
     separa oracao, e `src/data/legacy.ts:567` ("Planos tracados e apresentados
     ao cliente; aguardando negociacao…") ficava fora da tranca por causa dele.
     Ponto-e-virgula ENTRE LETRAS, seguido de espaco, é pontuacao de frase e sai
     da conta; o que sobrar de `;` (fim de declaracao, `;}` , `a;b`) continua
     valendo, junto de `=`, `{}` e `=>`. */
  /* A oracao seguinte comeca MINUSCULA — é continuacao de frase. Com maiuscula
     depois do `;` o trecho é resto de tipo (`GMarker; ControlPosition: Record`)
     e continua sendo codigo. */
  const semPontoEVirgulaDeFrase = s.replace(/(?<=[A-Za-zÀ-ÿ]);(?=\s+[a-zà-ÿ])/g, ',');
  if (/[;={}]|=>/.test(semPontoEVirgulaDeFrase)) return true;
  /* Cadeia de classes utilitarias.
     SIS-173 — "varios tokens, todos minusculos e sem acento" era largo demais:
     é tambem a forma de qualquer frase curta sem acento, e descartava quatro
     textos publicados ("450 horas economizadas para cada 1.000 processos.",
     "cumpridos pelos colaboradores", "fale com a gente!", "projetos reais para
     o mercado de seguros"). Agora a cadeia precisa exibir pelo menos UM token
     com cara de utilitario de verdade, e nenhuma pontuacao de fim de frase.
     Nenhum dos dois sinais existe em portugues corrido; os dois existem em toda
     cadeia real do projeto. */
  const tokens = s.trim().split(/\s+/);
  const utilitario = (t) =>
    /[:[\]/]/.test(t) || // variante (`hover:`), valor arbitrario (`[12px]`), opacidade (`/18`)
    /^!/.test(t) || // `!text-white`
    /^-?\d*\.?\d+(?:px|rem|em|%|vh|vw|svh)$/.test(t) || // numero com unidade
    /^[a-z]+(?:-[a-z0-9.]+)+$/.test(t); // `items-center`, `gap-2`, `bg-white`
  if (
    tokens.length >= 2 &&
    tokens.every((t) => /^[a-z0-9:[\]/#().,%_!*-]+$/.test(t) && !/[À-ÿ]/.test(t)) &&
    tokens.some(utilitario) &&
    !/[.!?]$/.test(s.trim())
  ) {
    return true;
  }
  /* SIS-173 — o que a regra de token barrava POR ACIDENTE, e que agora precisa
     de motivo declarado. Cada linha nasceu de um resto medido no lock recem
     gerado, e nenhuma delas ocorre em portugues corrido:
       `r * e` → multiplicacao. Só o `*`: `+` e `-` espacados EXISTEM na escrita
         publicada ("AI + ML + Analytics", "ERP - Enterprise Resource Planning",
         o endereco com "240 - 2º andar"), e barrá-los custou 28 textos reais na
         medicao;
       `, document.body,`, `agora - p.nascimento` → acesso a membro. A lista de
         TLD é obrigatoria: sem ela `descubra.luminna.sistran.com.br`, que é
         escrita visivel, cairia como codigo;
       `void; scrollTo:` → nome de propriedade no fim. O teste é o token final
         ser camelCase, e nao só terminar em dois pontos: rotulo de secao termina
         assim de proposito ("Sistran Labs:", "Portfólio robusto:") e barrar
         todos custou nove desses. */
  if (/\s\*\s/.test(s)) return true;
  if (
    /(?<![\w.])[a-z][\w$]*\.[a-z][\w$]*(?![\w.])/.test(s) &&
    !/\.(?:com|br|net|org|io|app|ai|dev)\b/i.test(s)
  )
    return true;
  if (/(?:^|\s)[a-z]+[A-Z][\w$]*:$/.test(s.trim())) return true;
  /* `}, passo)` → ultimo argumento de chamada: virgula, um identificador, fim.
     Trecho de frase que continua depois de um destaque tem mais de uma palavra
     (", por iniciativa da"), entao a contagem separa os dois casos. */
  if (/^,\s*[a-z][\w$]*$/.test(s.trim())) return true;
  /* Valor de `transition` escrito por extenso (`transform 240ms ease`). Chega
     sem nome porque nasce em ramo de ternario com `${…}` no outro ramo, o que
     cega a leitura de nome em `literaisDeDados`. */
  if (/^(?:transform|opacity|color|background|filter|width|height|all)\s+[\d.]+m?s\b/.test(s.trim()))
    return true;
  return false;
}

/** Literais entre quotes, incluindo template sem interpolacao. */
function literais(codigo) {
  const achados = [];
  const re = /(['"`])((?:\\.|(?!\1)[^\\\r\n])*)\1/g;
  let m;
  while ((m = re.exec(codigo))) {
    if (m[1] === '`' && m[2].includes('${')) continue; // template dinamico
    achados.push(m[2].replace(/\\'/g, "'").replace(/\\"/g, '"'));
  }
  return achados;
}

/**
 * Literais que estao dentro de ESTRUTURA DE DADOS — item de array ou valor de
 * propriedade de objeto.
 *
 * Esta é a terceira posicao onde copy mora, e ela nao é opcional: metade do
 * conteudo do site nasce em `const PRATICAS = [ … ]` e em
 * `{ titulo: '…', corpo: '…' }` declarados DENTRO do proprio componente, nao em
 * `src/data`. Medido: sem esta regra, 330 textos sumiam do lock contra o `HEAD`,
 * e entre eles estava conteudo real e sensivel — as praticas ambientais da
 * `/esg`, os tres projetos sociais inteiros, o texto de cookies da politica de
 * privacidade, os rotulos do formulario de contato e a `description` do
 * `metadata`. Apagar isso do lock seria trocar um portao ruidoso por um portao
 * cego, que é pior.
 *
 * O que ela NAO alcanca, de proposito: argumento de chamada de funcao
 * (`querySelector('…')`, `clsx('…')`, `matchMedia('…')`) e valor de `className`,
 * que sao os dois lugares de onde vinha a maior parte do lixo tecnico.
 */
/**
 * Nomes de atributo/propriedade cujo valor NUNCA é texto que o visitante le.
 * Lista declarada, e nao heuristica, pelo mesmo motivo da SIS-171: `className`
 * cheio de classe do Tailwind tem exatamente a forma de uma frase curta.
 * `id`/`href`/`src` ficam de fora do lock de proposito — mudar destino de link
 * ou nome de arquivo é mudanca de codigo, e o portao de copy nao é o lugar de
 * travar isso (quem trava rota é o build).
 */
const NOMES_TECNICOS = new Set([
  /* SIS-173 — estes cinco entraram com o afrouxamento das regras de forma em
     `pareceCodigo()`: `start: 'top top'`, `end: 'bottom bottom'`,
     `toggleActions: 'play none none reverse'`, `transition: 'opacity 300ms
     ease'` e `willChange: 'transform, opacity, filter'` sao valores de
     ScrollTrigger e de CSS que tem a MESMA forma de frase curta minuscula.
     Filtrar pelo nome, e nao pela forma, é o mesmo remedio da SIS-171. */
  'start',
  'end',
  'offset',
  'toggleActions',
  'transition',
  'willChange',
  /* SIS-155 — mesmo remédio da SIS-173 acima, agora por causa da tipografia
     terminal: onze pontos passaram a declarar `fontFeatureSettings: '"tnum" 1'`
     em `style` inline (numeral tabular na camada Mono, pedido da issue). O valor
     `"tnum" 1` tem a forma de frase curta e o portão o leu como TEXTO NOVO do
     site — `npm run test:copy` reprovou com `+ "tnum" 1 (0x -> 11x)`. Não é
     escrita: é ajuste de fonte OpenType. Filtrar pelo NOME da propriedade, e não
     pela forma do valor, é a regra já estabelecida aqui.
     `fontVariantNumeric` entra junto por prevenção: hoje seu valor
     (`tabular-nums`) é recusado pela forma, mas é a propriedade irmã desta e
     qualquer valor composto futuro cairia no mesmo buraco. */
  'fontFeatureSettings',
  'fontVariantNumeric',
  'className',
  'class',
  'classList',
  'style',
  'href',
  'src',
  'srcSet',
  'id',
  'key',
  'ref',
  'type',
  'role',
  'target',
  'rel',
  'htmlFor',
  'viewBox',
  'fill',
  'stroke',
  'd',
  'path',
  'poster',
  'preload',
  'loading',
  'decoding',
  'sizes',
  'ease',
  'behavior',
  'as',
  'font',
  'letterSpacing',
  'transform',
  'display',
  'position',
  'width',
  'height',
  'duration',
  'delay',
  'selector',
]);

function literaisDeDados(codigo) {
  const achados = [];
  /* Pilha de delimitadores: o de cima diz em que contexto o literal esta. */
  const pilha = [];
  let anterior = '';
  let i = 0;
  while (i < codigo.length) {
    const c = codigo[i];
    if (c === '[' || c === '{' || c === '(') {
      pilha.push(c);
      anterior = c;
      i += 1;
      continue;
    }
    if (c === ']' || c === '}' || c === ')') {
      pilha.pop();
      anterior = c;
      i += 1;
      continue;
    }
    if (c === '"' || c === "'" || c === '`') {
      let j = i + 1;
      while (j < codigo.length) {
        if (codigo[j] === '\\') j += 2;
        else if (codigo[j] === c) break;
        else if (codigo[j] === '\n' && c !== '`') break;
        else j += 1;
      }
      if (codigo[j] !== c) {
        anterior = c;
        i += 1;
        continue;
      }
      const bruto = codigo.slice(i + 1, j);
      const dentroDeArray = pilha[pilha.length - 1] === '[';
      /* Texto DEVOLVIDO por funcao, e texto de reserva atras de `??`/`||`:
         `if (normalized < 135) return "Direita";` em `BuildingExplorer` é o
         rotulo que o visitante le, e é escrito assim. */
      const antes = codigo.slice(Math.max(0, i - 40), i);
      const devolvido = /(?:^|[^\w$])(?:return|\?\?|\|\|)\s*$/.test(antes);
      /* Valor de propriedade: o que vem imediatamente antes é `:`. Cobre
         `titulo: '…'` e `'chave': '…'`, e nao cobre `a ? 'x' : 'y'` — ternario
         em codigo tecnico cai aqui como falso positivo e é filtrado depois por
         `pareceCodigo()`, que é o papel dela. */
      /* `?` junto de `:` cobre o texto escolhido por ternario, que é como
         metade dos `aria-label` do site é escrita:
         `aria-label={pausado ? 'Reproduzir carrossel' : 'Pausar carrossel'}`.
         Sem os dois lados, o rotulo acessivel de todo controle de carrossel
         ficava fora do lock. */
      const valorDeProp = anterior === ':' || anterior === '?';
      /* Lado direito de atribuicao — e isto inclui ATRIBUTO DE JSX, que é
         `nome="valor"`. Medido: sem esta posicao ficavam de fora o
         `const SITE_TITLE = 'Sistran · Beyond Technology'` do `layout.tsx`, o
         `const LINK_LABEL_FALLBACK` do `RoadmapStopDialog` e todo prop de texto
         com nome proprio do projeto (`rotulo=`, `destaque=`, `eyebrow=`), que
         nenhuma lista declarada de props ia adivinhar por completo. Prop
         tecnica entra junto (`className=`, `href=`, `type=`) e é justamente o
         que `pareceCodigo()` sabe descartar. */
      const valorAtribuido = anterior === '=';
      /* ... com uma excecao DECLARADA: nome tecnico de atributo/propriedade.
         O comentario acima dizia que `className=` "é justamente o que
         `pareceCodigo()` sabe descartar", e a auditoria dos novos mostrou que
         nao: `transition-colors hover:text-[#A5F0FF]` e
         `h-3.5 w-3.5 shrink-0 text-[#1273BC]` nao tem `;`, `=` nem `{}`, e
         entravam no lock como se fossem frase. Filtrar por NOME em vez de por
         forma é o mesmo remedio da SIS-171 inteira: o nome do atributo esta
         escrito ao lado do valor, entao nao ha o que adivinhar. */
      /* Alem do nome imediatamente atras, o nome do ATRIBUTO cujo `{…}` ainda
         esta aberto: `className={ativo ? 'bg-white/10' : 'x'}` chega aqui com
         `anterior === '?'`, e sem esta segunda leitura a classe entrava. */
      const nomeAntes =
        (antes.match(/([\w$-]+)\s*[=:]\s*$/) ?? [])[1] ??
        (antes.match(/([\w$-]+)\s*=\s*\{[^{}]*$/) ?? [])[1] ??
        /* SIS-173 — o nome da propriedade cujo ARRAY ainda esta aberto
           (`offset: ['start end', 'end start']`, do Motion) e o nome da
           propriedade cujo TERNARIO ainda esta aberto (`transition:\n cond ?
           \`…\` : 'transform 240ms ease'`). Sem estas duas leituras o segundo
           item do array e o ramo do ternario chegavam sem nome, e valor de
           ScrollTrigger/CSS entrava no lock como se fosse frase. */
        (antes.match(/([\w$-]+)\s*[=:]\s*\[[^\][]*$/) ?? [])[1] ??
        (antes.match(/([\w$-]+)\s*[=:][^,;{}[\]]*$/) ?? [])[1] ??
        '';
      const nomeTecnico = NOMES_TECNICOS.has(nomeAntes);
      if (
        !nomeTecnico &&
        (dentroDeArray || valorDeProp || valorAtribuido || devolvido) &&
        !(c === '`' && bruto.includes('${'))
      ) {
        achados.push(bruto.replace(/\\'/g, "'").replace(/\\"/g, '"'));
      }
      anterior = c;
      i = j + 1;
      continue;
    }
    if (!/\s/.test(c)) anterior = c;
    i += 1;
  }
  return achados;
}

/**
 * Nos de texto do JSX.
 *
 * A versao anterior exigia `>texto<`: o no tinha de terminar numa tag. Titulo
 * partido em duas partes — `Siga a Sistran no LinkedIn{' '}<span>...` — nao
 * entrava no lock, porque o que vem depois do texto e `{`, nao `<`. Ou seja: os
 * titulos mais visiveis do site, que quase sempre tem um trecho em destaque,
 * estavam fora da Regra Zero.
 *
 * Agora um no comeca depois de `>` ou de `}` e termina antes de `<` ou de `{`.
 * O lookahead evita consumir o delimitador final, para que dois trechos
 * vizinhos (`}texto{`) sejam ambos capturados.
 *
 * SIS-171 — e capturar os dois vizinhos separadamente era METADE do problema.
 * Uma frase unica na tela entrava no lock partida em pedacos sempre que tinha um
 * trecho em enfase ou um `{' '}` no meio:
 *
 *   Escala que transforma <strong>numeros</strong> em decisao
 *      -> "Escala que transforma" + "numeros" + "em decisao"
 *
 * Cada pedaco desses é um falso alarme por conta propria: mexer numa palavra
 * acende tres linhas de diff, e mover a enfase de lugar acende seis sem que uma
 * letra da frase tenha mudado. É o alarme que ensina quem le a ignorar o
 * arquivo inteiro — e os dois casos conhecidos (`quem-somos/page.tsx:463`,
 * `Metrics.tsx:920`) sao exatamente isto.
 *
 * O conserto é COSTURAR antes de capturar: `{' '}` vira espaco e as tags de
 * enfase EM LINHA somem, de modo que o que era um no só na tela volte a ser um
 * no só aqui. Tag de bloco (`<p>`, `<li>`, `<h2>`) continua cortando — ali sao
 * frases diferentes de verdade. Expressao que nao seja espaco (`{nome}`)
 * tambem corta, e deve: conteudo dinamico nao é travavel.
 */

/** Tags que nao interrompem uma frase — enfase, link, quebra dentro do texto. */
const TAGS_EM_LINHA = ['span', 'strong', 'em', 'b', 'i', 'a', 'sup', 'sub', 'mark', 'small', 'u'];

function textoJsx(codigo) {
  const costurado = codigo
    /* `{' '}` / `{" "}` / `{` `}`: o espaco que o JSX exige quando a frase
       continua na linha seguinte. Vira o espaco que ele representa. */
    .replace(/\{\s*(['"])\s\1\s*\}/g, ' ')
    .replace(/<br\s*\/?>/g, ' ')
    /* Abertura com ou sem atributos, e fechamento. `[^>]*` para na primeira
       `>`, que é o fim da tag. */
    .replace(new RegExp(`</?(?:${TAGS_EM_LINHA.join('|')})(?:\\s[^>]*?)?/?>`, 'g'), '')
    /* Fronteira de nó reposta. Tirar a tag em linha resolve a costura e cria
       outro problema: quando o texto abria logo depois de `<span …>`, o `>` que
       o marcava como INICIO de nó ia embora com a tag, e o que sobra antes dele
       é o `(` do bloco condicional (`{tile.href ? (<span…>Abrir a
       apresentação</span>) : null}`) — que nao é fronteira. Repor um `>` depois
       do parentese de estrutura devolve o nó. */
    .replace(/((?:\?|&&|\|\||=>|\breturn)\s*)\(/g, '$1(>');

  const achados = [];
  /* O `}` no lookahead é o no que termina fechando a expressao que o embrulha —
     `{visivel && (<span>Assista no YouTube</span>)}`. Sem ele, todo texto que
     mora dentro de um `&&` ou de um ternario com parenteses ficava fora do
     lock, e é um jeito comum de escrever bloco condicional aqui. */
  const re = /[>}]([^<>{}]+)(?=[<{}])/g;
  let m;
  while ((m = re.exec(costurado))) {
    /* O `}` que abre o trecho tambem existe em codigo que NAO é JSX, e ai o
       "texto" capturado é o resto da expressao. Medido em
       `src/app/blog/[slug]/page.tsx:14`
       (`title: post ? \`${post.title} · Sistran\` : 'Blog · Sistran'`): o `}` do
       `${post.title}` abria a captura e ela ia até a chave seguinte, entrando no
       lock como `· Sistran\` : 'Blog · Sistran'`. `pareceCodigo()` nao pega isto
       porque a sobra nao tem `;` nem `=`.
       O sinal que separa os dois casos é a ASPA: texto de JSX neste projeto usa
       aspa curva (“ ” ’), nunca a reta nem o acento grave — esses só aparecem
       quando o que se capturou é fonte. O literal em si nao se perde: ele entra
       pelo caminho certo, `literaisDeDados`, como valor de `title:`. */
    if (/['"`]/.test(m[1])) continue;
    achados.push(semParenteseEstrutural(m[1]));
  }
  return achados;
}

/**
 * Tira o parentese de ESTRUTURA que sobra na ponta do no de texto — o `(` de
 * `&& (` e o `)` de `)}`. Sinal de que é estrutura e nao escrita: ele esta
 * desbalanceado. Parentese de conteudo ("(vs alumínio e vidro)") vem em par e
 * fica onde esta.
 */
function semParenteseEstrutural(texto) {
  /* O `)` que fecha sem ter aberto é o fim do no: dali para a frente é
     estrutura, e vem junto porque o lookahead para no `}` que fecha a expressao
     (`…apresentação</span>) : null}` -> o `) : null` sobrava colado no texto).
     Parentese de conteudo vem em par e nunca zera o contador. */
  let profundidade = 0;
  for (let i = 0; i < texto.length; i += 1) {
    if (texto[i] === '(') profundidade += 1;
    else if (texto[i] === ')') {
      if (profundidade === 0) return texto.slice(0, i);
      profundidade -= 1;
    }
  }
  /* Sobrou `(` aberto no fim: é o `(` da estrutura, nao do conteudo. */
  return profundidade > 0 ? texto.replace(/\s*\([^()]*$/, '') : texto;
}

/**
 * Props e chaves de objeto que carregam texto do site. Lista DECLARADA: a troca
 * da SIS-171 é justamente deixar de varrer toda string do arquivo e passar a
 * dizer onde a copy mora.
 *
 * `title`/`description` estao aqui pelo `export const metadata` das paginas —
 * é texto que o visitante le no resultado de busca e na aba, e sairia do lock se
 * a regra fosse só "no de texto do JSX".
 */
const PROPS_DE_TEXTO = [
  'alt',
  'title',
  'description',
  'label',
  'placeholder',
  'aria-label',
  'ariaLabel',
  'aria-description',
  'caption',
  'legenda',
  'texto',
  'titulo',
  'subtitulo',
];

/** `alt="…"`, `alt={'…'}` e `alt: '…'` — atributo de JSX e chave de objeto. */
function propsDeTexto(codigo) {
  const nomes = PROPS_DE_TEXTO.map((p) => p.replace('-', '\\-')).join('|');
  const re = new RegExp(`(?:^|[\\s{,])(?:${nomes})\\s*[=:]\\s*\\{?\\s*(['"\`])((?:\\\\.|(?!\\1)[^\\\\\r\n])*)\\1`, 'g');
  const achados = [];
  let m;
  while ((m = re.exec(codigo))) {
    if (m[1] === '`' && m[2].includes('${')) continue;
    achados.push(m[2].replace(/\\'/g, "'").replace(/\\"/g, '"'));
  }
  /* O mesmo texto acessivel escrito pela API do DOM, e nao por JSX:
     `renderer.domElement.setAttribute("aria-label", "Modelo tridimensional…")`
     em `BuildingExplorer.tsx`. É argumento de chamada — a unica posicao de
     argumento que este extrator olha, e olha porque ali o NOME do atributo esta
     escrito ao lado, o que torna a posicao declarada como qualquer outra. */
  const reDom = new RegExp(`setAttribute\\(\\s*(['"])(?:${nomes})\\1\\s*,\\s*(['"])(.*?)\\2`, 'gs');
  while ((m = reDom.exec(codigo))) achados.push(m[3]);
  return achados;
}

function extrair() {
  const mapa = {};
  for (const caminho of arquivos(SRC)) {
    const rel = relative(RAIZ, caminho).split(sep).join('/');
    /* Comentario fora ANTES de tudo (SIS-171). Nenhum passo abaixo consegue
       distinguir prosa de comentario de prosa de pagina, e nao é para tentar. */
    const codigo = tiraComentarios(readFileSync(caminho, 'utf8'));
    /* A regra por POSICAO. `src/data` é conteudo, e ali todo literal conta; nos
       outros arquivos a copy mora em no de texto do JSX e nas props declaradas,
       e o resto das strings é classe, seletor e chave tecnica. */
    const ehDado = rel.startsWith('src/data/');
    const brutos = ehDado
      ? literais(codigo)
      : [...textoJsx(codigo), ...propsDeTexto(codigo), ...literaisDeDados(codigo)];
    let n = 0;
    for (const bruto of brutos) {
      /* Espaco de renderizacao (indentacao do JSX, quebras de linha) nao é
         conteudo: o relatorio abre excecao justamente para isso. */
      const texto = comEntidadesResolvidas(bruto.replace(/\s+/g, ' ').trim());
      if (!texto || pareceCodigo(texto)) continue;
      mapa[`${rel}:${n++}`] = texto;
    }
  }
  return mapa;
}

/**
 * `--autoteste` — os casos que derrubam a remocao ingenua de comentario
 * (SIS-171). Ficam no proprio script, e nao num arquivo de teste, porque o
 * projeto nao tem runner e a issue proibe dependencia nova: `npm run
 * test:extrator` é o portao.
 */
function autoteste() {
  const casos = [
    // [rotulo, fonte, deve conter, nao deve conter]
    ['// dentro de string', `const u = 'https://sistran.com.br/a';\n`, ['https://sistran.com.br/a'], []],
    ['// em atributo JSX', `<a href="https://x.com/y">Fale com a Sistran</a>\n`, ['https://x.com/y'], []],
    ['\\/\\/ dentro de regex', `if (/^https?:\\/\\//.test(s)) return 'Fale conosco';\n`, ['Fale conosco'], []],
    ['comentario de linha', `const a = 1; // prosa que nao é do site\n`, [], ['prosa que nao é do site']],
    ['comentario de bloco', `/* prosa longa\n   em duas linhas */\nconst a = 1;\n`, ['const a = 1'], ['prosa longa']],
    ['apostrofo em texto de JSX', `<p>a d'agua</p>\n<p>Frase seguinte</p>\n`, ['Frase seguinte'], []],
    ['divisao nao é regex', `const r = a / b; const t = 'Texto vivo';\n`, ['Texto vivo'], []],
    ['fechamento de tag nao é regex', `<div />\n<span>Texto vivo</span>\n`, ['Texto vivo'], []],
  ];
  const falhas = [];
  for (const [rotulo, fonte, contem, naoContem] of casos) {
    const saida = tiraComentarios(fonte);
    for (const t of contem) if (!saida.includes(t)) falhas.push(`${rotulo}: perdeu ${JSON.stringify(t)}`);
    for (const t of naoContem) if (saida.includes(t)) falhas.push(`${rotulo}: manteve ${JSON.stringify(t)}`);
  }

  /* Costura: frase partida por enfase e por `{' '}` volta a ser UMA frase. */
  const costura = [
    ['enfase', `<p>Escala que transforma <strong>numeros</strong> em decisao</p>`, 'Escala que transforma numeros em decisao'],
    ['{\' \'}', `<p>Siga a Sistran no LinkedIn{' '}<span>e no site</span></p>`, 'Siga a Sistran no LinkedIn e no site'],
  ];
  for (const [rotulo, fonte, esperado] of costura) {
    const achados = textoJsx(fonte).map((s) => s.replace(/\s+/g, ' ').trim());
    if (!achados.includes(esperado)) {
      falhas.push(`costura ${rotulo}: esperava ${JSON.stringify(esperado)}, veio ${JSON.stringify(achados)}`);
    }
  }

  /* Texto que abre dentro de bloco condicional, depois de `? (` ou `&& (`: a
     tag em linha removida levava embora o `>` que marcava o inicio do no. */
  const condicional = textoJsx(
    `{tile.href ? (<span className="mosaic-tip" aria-hidden="true">Abrir a apresentação</span>) : null}`,
  ).map((s) => s.replace(/\s+/g, ' ').trim());
  if (!condicional.includes('Abrir a apresentação')) {
    falhas.push(`condicional: esperava o no, veio ${JSON.stringify(condicional)}`);
  }

  /* Entidade HTML: o `;` dela fazia `pareceCodigo()` descartar a frase toda. */
  const comEntidade = comEntidadesResolvidas('Chamados de &ldquo;cookies&rdquo; por aqui.');
  if (pareceCodigo(comEntidade)) falhas.push(`entidade: "${comEntidade}" foi lida como codigo`);

  /* Tag de BLOCO continua cortando: sao frases diferentes de verdade. */
  const doisParagrafos = textoJsx(`<p>Primeira frase</p><p>Segunda frase</p>`).map((s) => s.trim());
  if (!doisParagrafos.includes('Primeira frase') || !doisParagrafos.includes('Segunda frase')) {
    falhas.push(`bloco: esperava duas frases separadas, veio ${JSON.stringify(doisParagrafos)}`);
  }

  /* SIS-173 — as duas regras de `pareceCodigo()` que descartavam texto
     publicado, nos DOIS sentidos: o que precisa passar e o que precisa
     continuar sendo barrado. */
  const codigo = [
    // [rotulo, texto, é codigo?]
    ['; de frase', 'Planos traçados e apresentados ao cliente; aguardando negociação para implementação.', false],
    ['; de declaracao', "const a = 'x';", true],
    ['; entre simbolos', 'a();b()', true],
    ['frase de duas palavras', 'cumpridos pelos colaboradores', false],
    ['frase com numero', '450 horas economizadas para cada 1.000 processos.', false],
    ['frase com exclamacao', 'fale com a gente!', false],
    ['frase de cinco palavras', 'projetos reais para o mercado de seguros', false],
    /* Minusculo de proposito: a regra exige todos os tokens sem maiuscula e sem
       acento, então `hover:text-[#A5F0FF]` (hex maiusculo) NUNCA passou por
       aqui — quem barra aquela cadeia é o `NOMES_TECNICOS` de `className`. */
    ['cadeia com variante', 'transition-colors hover:text-white', true],
    ['cadeia simples', 'flex items-center gap-3', true],
    ['cadeia com opacidade', 'bg-white/10 text-white', true],
  ];
  for (const [rotulo, texto, esperado] of codigo) {
    if (pareceCodigo(texto) !== esperado) {
      falhas.push(
        `pareceCodigo ${rotulo}: ${JSON.stringify(texto)} deveria ser ${esperado ? 'codigo' : 'texto'}`,
      );
    }
  }

  if (falhas.length) {
    console.error(`autoteste do extrator: ${falhas.length} falha(s)`);
    for (const f of falhas) console.error(`  - ${f}`);
    process.exit(1);
  }
  console.log(
    `autoteste do extrator: OK (${casos.length + costura.length + codigo.length + 1} casos)`,
  );
  process.exit(0);
}

/* Os passos ficam exportados para que uma auditoria (`--conferir-perdas`, ou um
   script de uma volta) use as MESMAS funcoes do extrator, e nao uma reimplemen-
   tacao que erra de outro jeito. */
export { tiraComentarios, textoJsx, literais, literaisDeDados, propsDeTexto, pareceCodigo, extrair };

/**
 * `--conferir-perdas <lock-antigo.json>` — a conferencia item a item que a
 * troca de extrator exige (SIS-171).
 *
 * Trocar o extrator REESCREVE o lock, e por isso o `--check` nao protege contra
 * o risco desta mudanca: copy real que o novo extrator nao alcance desaparece
 * calada. Este modo classifica cada texto que saiu, com evidencia e nao com
 * olhometro:
 *
 *   costurado    virou parte de um texto maior (a frase que estava em pedacos)
 *   comentario   só existe em comentario -> tinha de sair, é o defeito corrigido
 *   ausente      nao existe mais em fonte nenhum -> saiu do site antes disto
 *   NAO ALCANCADO ainda esta em codigo vivo -> regressao, tem de ser consertada
 *
 * Só a ultima categoria é problema, e a saida termina com a contagem dela.
 */
function conferirPerdas(caminhoAntigo, novo) {
  const antigo = JSON.parse(readFileSync(caminhoAntigo, 'utf8'));
  const norma = (s) => s.replace(/\s+/g, ' ').trim();
  const valores = new Set(Object.values(novo).map(norma));

  /* Fonte com e sem comentario, para dizer QUAL das duas ainda tem o texto. */
  let comComentario = '';
  let semComentario = '';
  for (const caminho of arquivos(SRC)) {
    const cru = readFileSync(caminho, 'utf8');
    comComentario += `\n${norma(cru)}`;
    semComentario += `\n${norma(tiraComentarios(cru))}`;
  }

  const grupos = { costurado: [], comentario: [], ausente: [], naoAlcancado: [] };
  for (const bruto of new Set(Object.values(antigo))) {
    const t = norma(bruto);
    if (valores.has(t)) continue;
    if ([...valores].some((v) => v !== t && v.includes(t))) grupos.costurado.push(t);
    else if (semComentario.includes(t)) grupos.naoAlcancado.push(t);
    else if (comComentario.includes(t)) grupos.comentario.push(t);
    else grupos.ausente.push(t);
  }

  for (const [nome, lista] of Object.entries(grupos)) {
    console.log(`\n== ${nome} (${lista.length})`);
    for (const t of lista) console.log(`  ${t.length > 110 ? `${t.slice(0, 110)}…` : t}`);
  }
  console.log(`\nnao alcancado: ${grupos.naoAlcancado.length}`);
  process.exit(grupos.naoAlcancado.length ? 1 : 0);
}

/* Só a execucao direta roda o CLI: assim uma auditoria pode importar os passos
   sem reescrever o lock como efeito colateral do `import`. */
const executadoDireto = import.meta.filename === process.argv[1];

if (executadoDireto) {
  if (process.argv.includes('--autoteste')) autoteste();

  const atual = extrair();
  const iPerdas = process.argv.indexOf('--conferir-perdas');
  if (iPerdas !== -1) conferirPerdas(process.argv[iPerdas + 1], atual);

  const modoCheck = process.argv.includes('--check');

  if (!modoCheck) {
    writeFileSync(LOCK, `${JSON.stringify(atual, null, 2)}\n`, 'utf8');
    console.log(`copy-lock.json: ${Object.keys(atual).length} textos travados`);
    process.exit(0);
  }

  let lock;
  try {
    lock = JSON.parse(readFileSync(LOCK, 'utf8'));
  } catch {
    console.error('copy-lock.json ausente. Rode: node scripts/copy-lock.mjs');
    process.exit(1);
  }

  /* Compara por VALOR, nao por ID: mover texto de arquivo/posicao é refatoracao
     permitida; mudar, resumir ou apagar escrita nao é. */
  const conta = (mapa) => {
    const m = new Map();
    for (const v of Object.values(mapa)) m.set(v, (m.get(v) ?? 0) + 1);
    return m;
  };
  const antes = conta(lock);
  const depois = conta(atual);

  const removidos = [];
  const adicionados = [];
  for (const [texto, q] of antes) {
    const d = depois.get(texto) ?? 0;
    if (d < q) removidos.push(`${texto}  (${q}x -> ${d}x)`);
  }
  for (const [texto, q] of depois) {
    const a = antes.get(texto) ?? 0;
    if (a < q) adicionados.push(`${texto}  (${a}x -> ${q}x)`);
  }

  if (!removidos.length && !adicionados.length) {
    console.log(`copy-lock: OK (${antes.size} textos distintos, nada mudou)`);
    process.exit(0);
  }

  console.error('copy-lock: a escrita do site mudou.\n');
  if (removidos.length) {
    console.error(`Textos perdidos ou alterados (${removidos.length}):`);
    for (const l of removidos) console.error(`  - ${l}`);
  }
  if (adicionados.length) {
    console.error(`\nTextos novos (${adicionados.length}):`);
    for (const l of adicionados) console.error(`  + ${l}`);
  }
  console.error(
    '\nSe a mudanca foi deliberada e aprovada pelo dono do conteudo, atualize o' +
      ' lock: node scripts/copy-lock.mjs',
  );
  process.exit(1);
}
