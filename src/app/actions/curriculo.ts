'use server';

/**
 * SIS-246 — o DESTINO do currículo de `/trabalhe-conosco`.
 *
 * Antes desta action o formulário submetia para `enviarFormulario`, que conferia
 * se algum campo veio preenchido e devolvia `sucesso`. O candidato lia «Mensagem
 * recebida» e o PDF era descartado pelo processo Node. Isto é o que substitui
 * aquilo.
 *
 * ── As decisões, que esta action só EXECUTA ──────────────────────────────────
 * Estão escritas em `docs/sis-246-destino-curriculo.md`, decididas em 01/10/2026,
 * e não se reabrem em código:
 *
 * • destino e canal de direitos: a caixa em `CURRICULO_DESTINO`;
 * • base legal: legítimo interesse (LGPD, Art. 7º, IX) — o que ela cobra em troca
 *   é o aviso visível no ponto da coleta, que é o `privacyNote` do card;
 * • prazo de guarda: 6 meses, descarte manual (o destino é uma caixa de e-mail);
 * • action PRÓPRIA, e não um ramo em `enviarFormulario`: currículo e «quero falar
 *   com um especialista» têm base legal, prazo, destinatário e limite de corpo
 *   diferentes, e um `if` faria o primeiro que precisasse de anexo maior aplicar o
 *   limite aos dois.
 *
 * ── Por que `fetch` e não o pacote `resend` ──────────────────────────────────
 * A Resend é uma API HTTP. O pacote é um invólucro em volta de um POST com JSON, e
 * `fetch` é global no runtime do Next — então a dependência não compraria nada e
 * custaria uma entrada no `package.json`, uma no lockfile e uma superfície a
 * auditar. Se um dia o envio precisar de lote, agendamento ou webhook, aí o pacote
 * passa a valer; hoje não.
 *
 * ── O que NÃO está aqui ──────────────────────────────────────────────────────
 * Varredura de malware no anexo, e nem vai estar nesta issue: a assinatura de
 * arquivo (`assinaturaConfere`) barra executável renomeado, não conteúdo
 * malicioso dentro de um PDF legítimo. Quem abrir o anexo abre arquivo de origem
 * não confiável.
 */

import type { EstadoContato } from './contato-estado';
import {
  EMAIL_CURRICULO,
  LIMITE_CURRICULO,
  assinaturaConfere,
  extensoesCurriculo,
} from '@/lib/curriculo-regras';

/* Caixa de destino e remetente ficam em ambiente, não no código: trocar o RH que
   recebe é mudança de configuração, não de deploy. O destino tem padrão — a
   decisão de 01/10/2026 — para o envio não morrer calado se a variável faltar; a
   CHAVE não tem padrão nenhum, de propósito (ver `semTransporte`). */
const DESTINO = process.env.CURRICULO_DESTINO ?? EMAIL_CURRICULO;
/**
 * O remetente. O padrão é o endereço de TESTE da Resend, que funciona sem
 * verificar domínio no DNS — assim o envio passa a existir com só a
 * `RESEND_API_KEY` configurada, e a verificação do domínio deixa de ser
 * pré-requisito para a página funcionar.
 *
 * ⚠️ O QUE ESSE PADRÃO CUSTA, e por que ele é provisório:
 *
 * 1. `onboarding@resend.dev` só entrega para o e-mail da PRÓPRIA conta Resend.
 *    Funciona para o currículo (o destino é essa caixa) e NÃO funciona para o
 *    recibo ao candidato, que vai para endereço arbitrário — a Resend recusa, e
 *    o recibo é silenciosamente perdido. De propósito: a falha do recibo já é
 *    ignorada (ver o envio dele, no fim desta action), porque a candidatura em si
 *    chegou e mandar a pessoa reenviar seria pior.
 * 2. O candidato recebe um e-mail de `resend.dev`, não da Sistran.
 *
 * ⚠️ 01/10/2026 — ISTO DEIXOU DE SER «MELHORIA». A especificação dizia que
 * verificar o domínio era opcional porque o currículo chegaria à caixa da própria
 * conta Resend. Mas o destino OFICIAL é uma caixa do RH, de terceiro: para ela, o
 * remetente de teste **não entrega**. Então:
 *
 * • destino = a caixa de quem criou a conta Resend → funciona sem DNS (é o cenário
 *   de TESTE, e é como validar o envio hoje);
 * • destino = a caixa do RH → **exige** `sistran.com.br` verificado na Resend e
 *   `CURRICULO_REMETENTE` apontado para um endereço nosso.
 *
 * A verificação do domínio virou pré-requisito do destino oficial, não um polimento
 * posterior. Sem ela a Resend recusa o envio — e a action devolve `erro`, que é o
 * comportamento certo: melhor a candidatura falhar na cara do candidato do que ele
 * ler «recebido» e o e-mail nunca sair.
 */
const REMETENTE = process.env.CURRICULO_REMETENTE ?? 'Sistran <onboarding@resend.dev>';

const API = 'https://api.resend.com/emails';

const texto = (dados: FormData, campo: string) =>
  typeof dados.get(campo) === 'string' ? (dados.get(campo) as string).trim() : '';

const FORMATO_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Mensagem de falha. Ela manda a pessoa ao LinkedIn porque uma candidatura que não
 * saiu não pode terminar em beco sem saída — e é o mesmo caminho que o card já
 * oferece abaixo do formulário.
 *
 * O texto é o MESMO para «chave ausente», «Resend recusou» e «rede caiu», de
 * propósito: a causa é nossa e o candidato não tem o que fazer com ela.
 */
const FALHA =
  'Não conseguimos enviar sua candidatura agora. Tente novamente em alguns minutos ou use o nosso LinkedIn.';

const erro = (mensagem: string, invalidos: string[] = []): EstadoContato => ({
  status: 'erro',
  mensagem,
  invalidos,
});

/**
 * Um POST para a Resend. Devolve só se deu certo — o corpo da resposta não
 * interessa a ninguém aqui, e o `id` da mensagem é a única coisa dentro dele.
 *
 * NENHUM dado pessoal em log, nem no caminho de erro: um `console.error` com o
 * corpo da requisição publicaria o currículo inteiro no log da plataforma, que é
 * exatamente o vazamento que esta issue existe para não criar. O que se registra é
 * o status HTTP, que é da Resend e não do candidato.
 */
async function enviarEmail(chave: string, corpo: Record<string, unknown>): Promise<boolean> {
  try {
    const resposta = await fetch(API, {
      method: 'POST',
      headers: { Authorization: `Bearer ${chave}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(corpo),
    });
    if (!resposta.ok) {
      console.error(`[curriculo] Resend recusou o envio: HTTP ${resposta.status}`);
      return false;
    }
    return true;
  } catch {
    /* Sem o objeto do erro: a mensagem de falha de `fetch` pode trazer a URL e os
       cabeçalhos da requisição, e o cabeçalho carrega a chave da API. */
    console.error('[curriculo] falha de rede ao chamar a Resend');
    return false;
  }
}

export async function enviarCurriculo(
  _anterior: EstadoContato,
  dados: FormData,
): Promise<EstadoContato> {
  /* A chave é lida AQUI e não no módulo: lida no topo, ela seria capturada na
     construção e um deploy que só acrescenta a variável não passaria a funcionar. */
  const chave = process.env.RESEND_API_KEY;
  if (!chave) {
    /* O ponto da issue: antes o sucesso era incondicional. Sem transporte
       configurado NÃO existe envio, então o estado é `erro` — devolver «Mensagem
       recebida» aqui seria o defeito de hoje com outra causa. */
    console.error('[curriculo] RESEND_API_KEY ausente: envio não configurado.');
    return erro(FALHA);
  }

  const nome = texto(dados, 'nome');
  const email = texto(dados, 'email');
  /* `telefone` virou OPCIONAL (decisão de 01/10/2026): entra no e-mail se vier e
      não reprova se faltar. */
  const telefone = texto(dados, 'telefone');

  const invalidos: string[] = [];
  if (!nome) invalidos.push('nome');
  if (!email || !FORMATO_EMAIL.test(email)) invalidos.push('email');

  /* O arquivo: `FormData` devolve string quando o campo veio vazio, então a
     conferência é de TIPO antes de tamanho. */
  const arquivo = dados.get('curriculo');
  const temArquivo = arquivo instanceof File && arquivo.size > 0;
  if (!temArquivo) invalidos.push('curriculo');

  if (invalidos.length) {
    return erro(
      'Não foi possível enviar. Verifique os campos obrigatórios e tente novamente.',
      invalidos,
    );
  }
  /* O estreitamento de `arquivo` não sobrevive ao `if` acima para o compilador —
     `temArquivo` é um booleano, não um type guard sobre a variável. */
  if (!(arquivo instanceof File)) return erro(FALHA);

  const limiteMb = Math.round(LIMITE_CURRICULO / (1024 * 1024));
  if (arquivo.size > LIMITE_CURRICULO) {
    /* Mesma constante que o campo usa para anunciar o limite — era a divergência
       entre os dois números que fazia um PDF de 2 MB ser aceito na tela e recusado
       no servidor. */
    return erro(`O arquivo passa de ${limiteMb} MB. Envie um arquivo menor.`, ['curriculo']);
  }

  const nomeArquivo = arquivo.name;
  const extensaoOk = extensoesCurriculo().some((e) => nomeArquivo.toLowerCase().endsWith(e));
  if (!extensaoOk) {
    const lista = extensoesCurriculo()
      .map((e) => e.replace(/^\./, '').toUpperCase())
      .join(', ');
    return erro(`Formato não aceito. Envie um arquivo ${lista}.`, ['curriculo']);
  }

  const bytes = new Uint8Array(await arquivo.arrayBuffer());
  if (!assinaturaConfere(nomeArquivo, bytes)) {
    /* O nome dizia `.pdf` e o conteúdo não é um PDF. Mensagem sem acusação: o caso
       comum é alguém ter renomeado um arquivo à mão, não um ataque. */
    return erro(
      'O conteúdo do arquivo não corresponde à extensão. Gere o arquivo novamente e reenvie.',
      ['curriculo'],
    );
  }

  const anexo = Buffer.from(bytes).toString('base64');

  const linhas = [
    `Nome: ${nome}`,
    `E-mail: ${email}`,
    telefone ? `Telefone: ${telefone}` : 'Telefone: não informado',
    '',
    `Arquivo: ${nomeArquivo} (${(arquivo.size / (1024 * 1024)).toFixed(1)} MB)`,
    '',
    'Enviado pelo formulário de /trabalhe-conosco.',
    `Base legal: legítimo interesse de recrutamento (LGPD, Art. 7º, IX).`,
    `Prazo de guarda: ${6} meses a partir desta data — o descarte é manual.`,
  ];

  const enviou = await enviarEmail(chave, {
    from: REMETENTE,
    to: [DESTINO],
    /* `reply_to` no candidato: responder no cliente de e-mail vai para ele, e não
       para a caixa de `nao-responda`. */
    reply_to: email,
    subject: `Currículo — ${nome}`,
    text: linhas.join('\n'),
    attachments: [{ filename: nomeArquivo, content: anexo }],
  });

  if (!enviou) return erro(FALHA);

  /* Confirmação ao candidato (item 8 da especificação). Vai DEPOIS e o resultado
     dela é ignorado de propósito: a candidatura já chegou ao RH, e dizer «não
     conseguimos enviar» porque o recibo falhou mandaria a pessoa reenviar um
     currículo que está entregue. A falha fica no log. */
  void enviarEmail(chave, {
    from: REMETENTE,
    to: [email],
    subject: 'Recebemos seu currículo — Sistran',
    text: [
      `Olá, ${nome}.`,
      '',
      'Recebemos seu currículo e ele já está com a nossa equipe. Se o seu perfil encaixar em alguma oportunidade, entramos em contato por este e-mail.',
      '',
      /* `EMAIL_CURRICULO` e não `DESTINO`: o recibo tem de repetir o MESMO canal de
         direitos que o site anuncia no aviso de privacidade. Se `CURRICULO_DESTINO`
         apontar para uma caixa interna do RH, ela não é endereço público. */
      `Guardamos seus dados por até 6 meses e depois os descartamos. Para acessar, corrigir ou excluir o que você enviou, escreva para ${EMAIL_CURRICULO}.`,
      '',
      'Sistran',
    ].join('\n'),
  });

  return {
    status: 'sucesso',
    mensagem: 'Mensagem recebida.',
    invalidos: [],
  };
}
