# SIS-246 — destino do currículo de `/trabalhe-conosco`: decisões e especificação de implementação

Documento linkado a partir da [SIS-246](https://linear.app/sistran-labs/issue/SIS-246/trabalhe-conosco-atencao-o-curriculo-enviado-nao-vai-a-lugar-nenhum),
que exige as decisões **escritas** — «nesta issue ou em documento linkado a partir
dela, não combinadas em conversa».

A parte 2 deste documento é o corpo da **issue de implementação**, pronta para ser
colada. Ela não foi aberta no Linear porque o workspace atingiu o limite de issues
do plano free (`invalid_request`, 01/10/2026). Enquanto ela não existir, este
arquivo é a fonte da verdade.

Data das decisões: **01/10/2026**. Decisora: Maria Eduarda M Camargo.

---

## Parte 1 — as decisões

| Item | Decisão |
|---|---|
| **Destino do currículo** | e-mail `maria.martinelli@sistran.com.br` |
| **Quem recebe e tem acesso** | o mesmo endereço |
| **Base legal LGPD** | **legítimo interesse** — Art. 7º, IX |
| **Prazo de guarda** | **6 meses**, descarte no vencimento, sem aviso ao candidato |
| **Canal de exercício de direitos** | o mesmo e-mail do destino |
| **`Telefone` obrigatório** | **não** — passa a opcional |
| **Lista de vagas / portal** | não entra; o envio segue **espontâneo** |
| **Arquitetura da action** | **action própria**, não um ramo em `enviarFormulario` |

### Por que legítimo interesse, e não consentimento

A pessoa enviou o currículo justamente para ser avaliada: a finalidade é evidente e
esperada, que é o teste do Art. 7º, IX. Consentimento exigiria caixa dedicada (não
aviso em letra miúda), registro do momento em que foi dado e via de revogação — e
consentimento revogável é base frágil para banco de talentos, porque a revogação
obriga a apagar no meio de um processo.

O preço do legítimo interesse é que o aviso de finalidade, prazo e canal de direitos
tem de estar **visível no ponto da coleta**. É o que o `privacyNote` da Parte 2
resolve — e ele **não existe hoje** (ver item 7).

### Por que 6 meses e não 12

O destino é uma caixa de e-mail, e o descarte é **manual**. Prazo que ninguém
cumpre é pior que prazo curto: 12 meses de currículos acumulados numa caixa pessoal
é exposição crescente de dado pessoal sem ganho real de recrutamento.

### A fragilidade conhecida do canal de direitos

`maria.martinelli@sistran.com.br` é endereço **pessoal**, não institucional. Se a
pessoa sair da empresa ou trocar de função, o canal de direitos do candidato morre
e o site continua anunciando um endereço que não responde. Fica registrado como
dívida: quando existir `privacidade@` ou `rh@` institucional, trocar nos dois
textos da Parte 2.

### Por que action própria

Currículo e «quero falar com um especialista» têm base legal, prazo de guarda,
destinatário e limite de corpo diferentes. Um `if` dentro de `enviarFormulario`
faria o primeiro que precisasse de upload maior aplicar o limite aos dois.

---

## Parte 2 — corpo da issue de implementação

> **Título:** `/trabalhe-conosco · implementar o destino do currículo: action própria, validação no servidor e envio por e-mail`
> **Pai:** SIS-246

### Estado de hoje

`enviarFormulario` (`src/app/actions/contato.ts:70-87`) confere que algum campo veio
preenchido e devolve `{ status: 'sucesso', mensagem: 'Mensagem recebida.' }`. É a
action inteira. O currículo trafega até o processo Node e é descartado.

As decisões da Parte 1 **não se reabrem** nesta issue.

### 1. Action própria — `src/app/actions/curriculo.ts`

Nova action `enviarCurriculo`, em arquivo próprio. `enviarFormulario` fica intacta.

`DemoForm` precisa aceitar a action por propriedade: hoje ela é importada direto e
cravada em `DemoForm.tsx:114`. Propriedade opcional com `enviarFormulario` como
padrão, para nenhum outro uso mudar de comportamento.

### 2. ⚠️ Defeito AO VIVO — o campo promete 5 MB, o servidor aceita 1 MB

Medido, não deduzido:

- `DemoForm.tsx:58` — `LIMITE_PADRAO = 5 * 1024 * 1024`, e a área anuncia
  «PDF, DOC, DOCX até 5 MB» ao candidato (`DemoForm.tsx:423-425`).
- `node_modules/next/dist/docs/01-app/02-guides/server-actions.md:83` —
  «Action requests are capped at 1MB by default.»
- `next.config.mjs` — **não** define `serverActions.bodySizeLimit`, então o padrão
  de 1 MB vale. (Next 16.3.0.)

Um PDF de 2 MB passa pela validação do navegador, é anunciado como aceito, e a
requisição da action é recusada pelo servidor. **Isso já acontece hoje** — currículo
com foto passa de 1 MB sem esforço.

**Fazer:** `serverActions: { bodySizeLimit: '6mb' }` no `next.config.mjs`. Seis e não
cinco porque o limite é do **corpo inteiro** — os quatro campos de texto mais o
envelope `multipart`, não só o arquivo.

### 3. Validação no servidor

O que existe em `CampoArquivo` é validação do usuário para fora: `accept` filtra o
seletor do sistema e `setCustomValidity` roda no navegador. Não é controle de
segurança.

- [ ] `curriculo` é `File` (não string) e tem tamanho > 0.
- [ ] Tamanho ≤ 5 MB, lido da **mesma** constante do campo — hoje `LIMITE_PADRAO` é
      privado do componente; vira export ou vai para `src/lib/`. Dois números soltos
      divergem no primeiro ajuste.
- [ ] Extensão em `.pdf`, `.doc`, `.docx` — mesma lista, mesma constante.
- [ ] **Assinatura do arquivo**, e não só a extensão: `%PDF-` para PDF,
      `PK\x03\x04` para `.docx`, `D0 CF 11 E0` para `.doc`. Um executável renomeado
      para `.pdf` passa por tudo o que existe hoje.
- [ ] `nome` e `email` obrigatórios, `email` com o mesmo formato de
      `enviarContato` (`contato.ts:44`).
- [ ] **Nenhum dado pessoal em log**, nem em caminho de erro. Um `console.error` com
      o `FormData` vaza currículo para o log da plataforma.

Não há varredura de malware, e não vai haver nesta issue. Fica dito: quem abrir o
anexo abre arquivo de origem não confiável.

### 4. Transporte do e-mail — não existe ainda

**Nenhuma dependência de e-mail no projeto.** Auditado: sem `resend`, `nodemailer`,
SES, SendGrid, Postmark. `.env.local` tem só `VERCEL_OIDC_TOKEN` e
`EVENTOS_ADMIN_PASSWORD` — nenhum segredo de SMTP ou de API de e-mail.

- [ ] Escolher o provedor. Resend é o de menor atrito num app Next; SMTP corporativo
      da Sistran via `nodemailer` mantém o dado dentro de casa. **Decisão de
      TI/segurança, não de front-end.**
- [ ] Domínio verificado para o remetente — sem isso, e-mail com anexo cai em spam
      silenciosamente e o candidato vê «Mensagem recebida» de todo jeito.
- [ ] Segredo em variável de ambiente, nunca no repositório.
- [ ] **Tratar falha de envio.** Hoje o sucesso é incondicional. Se o provedor
      recusar, o estado volta `erro` com texto que manda a pessoa ao LinkedIn.
      Devolver «Mensagem recebida» quando o e-mail não saiu é o defeito de hoje com
      outra causa.

#### ⚠️ Risco de deploy que pode matar esta issue inteira

`next.config.mjs` registra «SIS-154 — decisão de deploy em aberto». Se o alvo for
**S3 + CloudFront** (o padrão das LPs da casa), **não há servidor**: server action
não roda e o envio por e-mail é impossível por construção. Nesse cenário o caminho é
outro — API externa, Lambda, ou formulário de terceiro — e esta issue precisa ser
reescrita.

**Confirmar o alvo de deploy ANTES de escrever código.** O `VERCEL_OIDC_TOKEN`
sugere Vercel, o que funcionaria; sugestão não é confirmação.

### 5. Os textos, quando o destino existir

**`privacyNote`** (pé do formulário — ver item 7, ele não existe hoje):

> Seus dados e seu arquivo são enviados por e-mail à nossa equipe e usados apenas
> para avaliar sua candidatura, com base no legítimo interesse de recrutamento.
> Guardamos por até 6 meses e descartamos depois. Para acessar, corrigir ou excluir
> o que enviou, escreva para maria.martinelli@sistran.com.br.

**`successNote`** (cartão de sucesso):

> Recebemos seu currículo e ele já está com a nossa equipe. Se o seu perfil encaixar
> em alguma oportunidade, entramos em contato pelo e-mail que você informou.
> Guardamos seus dados por até 6 meses; para pedir acesso ou exclusão, escreva para
> maria.martinelli@sistran.com.br.

Ajustar também `trabalhe-conosco/page.tsx:285-289`, que hoje diz «ainda é uma
demonstração: enquanto não houver um destino definido, ele não entrega o seu
currículo a ninguém» — essa frase fica falsa no mesmo commit.

**Nenhum desses textos entra antes de o envio funcionar de ponta a ponta.** Trocá-los
primeiro é transformar a página em promessa falsa, que é o que a SIS-246 existe para
impedir.

### 6. `Telefone` passa a opcional

`CurriculoCard.tsx:78-86` — `required: true` sai. A obrigatoriedade vinha travada
pelo conteúdo-site (`.claude/conteudo-site/08-trabalhe-conosco.md`) e pelo
`copy-lock.json`; atualizar os dois junto, senão o portão de copy acusa.

### 7. O `privacyNote` nunca foi passado — corrigir aqui

Achado da auditoria da SIS-246, e é um furo real na honestidade atual.

`CurriculoCard.tsx:245-259` passa **só** `successNote`. O docblock do próprio arquivo
(linhas 33-40), o docblock do `DemoForm` (linha 80) e o relatório da SIS-223
(`docs/relatorio-entregas/parte-04.md:412`) afirmam que os **dois** textos declaram a
demonstração. O `privacyNote` não está lá.

Consequência: `successNote` só aparece **depois** do envio. No pé do formulário, onde
a pessoa anexa o PDF, **não há aviso nenhum**. O único aviso antes do envio está num
cartão **irmão** (`page.tsx:285-289`), que pode nem estar na tela quando o candidato
preenche.

Vale para o texto honesto de hoje e para o definitivo do item 5: o aviso de
privacidade tem de existir no ponto da coleta. O `DemoForm` já sabe renderizá-lo
(`DemoForm.tsx:248-250`) — falta passar.

### 8. E-mail de confirmação ao candidato

«Mensagem recebida» na tela não é comprovante. **Recomendado:** confirmação simples
ao e-mail informado, no mesmo transporte, repetindo prazo de guarda e canal de
direitos. Custo baixo depois que o item 4 existe. Se ficar de fora, ficar de fora
**por escrito**.

### Critérios de aceite

- [ ] Alvo de deploy confirmado como ambiente com servidor (item 4), antes de código.
- [ ] `enviarCurriculo` em `src/app/actions/curriculo.ts`; `enviarFormulario`
      inalterada; `DemoForm` recebe a action por propriedade com padrão compatível.
- [ ] `bodySizeLimit` elevado **e** limite de 5 MB conferido no servidor, lendo a
      mesma constante do campo.
- [ ] Extensão **e** assinatura de arquivo conferidas no servidor.
- [ ] Falha de envio devolve `erro`, não `sucesso`.
- [ ] Nenhum dado pessoal em log.
- [ ] `privacyNote` passado em `CurriculoCard` (item 7), com o texto do item 5.
- [ ] `successNote` e `page.tsx:285-289` atualizados **no mesmo commit** em que o
      envio passa a funcionar.
- [ ] `Telefone` opcional, com conteúdo-site e `copy-lock.json` atualizados.
- [ ] Decisão sobre o e-mail de confirmação registrada.
- [ ] Lint OK.

### Fora de escopo

- Varredura de malware no anexo.
- ATS, storage, portal ou listagem de vagas.
- Automatizar o descarte dos 6 meses — com destino em caixa de e-mail o cumprimento é
  manual. Se isso não for aceitável, o destino precisa mudar, e aí volta para a
  SIS-246.
- Redesenho do UI entregue pela SIS-223.

---

## Parte 3 — a implementação, feita em 01/10/2026

A Parte 2 foi **executada** no mesmo dia, depois de confirmados os dois
pré-requisitos que a travavam: **transporte = Resend** e **deploy = Vercel**
(ambiente com servidor, então server action roda).

### ⚠️ FALTA UMA COISA PARA FUNCIONAR: a credencial

O código está pronto e **não envia nada** até estas variáveis existirem no ambiente
(Vercel → Settings → Environment Variables, e `.env.local` para rodar local):

| Variável | Obrigatória | Padrão | Para quê |
|---|---|---|---|
| `RESEND_API_KEY` | **sim** | nenhum | chave da API da Resend |
| `CURRICULO_DESTINO` | não | `maria.martinelli@sistran.com.br` | caixa que recebe o currículo |
| `CURRICULO_REMETENTE` | não | `Sistran <onboarding@resend.dev>` | remetente |
| `NEXT_PUBLIC_CURRICULO_EMAIL` | não | `maria.martinelli@sistran.com.br` | endereço que o SITE publica como canal de direitos |

### Caminho curto: funciona com só a chave, sem tocar em DNS

O padrão de `CURRICULO_REMETENTE` é o endereço de **teste** da Resend, que não exige
verificar domínio. Três passos: criar conta na Resend **com o endereço de
`CURRICULO_DESTINO`**, copiar a API key, pôr `RESEND_API_KEY` no ambiente.

O que esse atalho custa:

- `onboarding@resend.dev` só entrega para o e-mail da própria conta Resend. O
  **currículo chega** (o destino é essa caixa); o **recibo ao candidato não**, porque
  vai para endereço arbitrário e a Resend recusa. A falha do recibo já é ignorada por
  construção, então a candidatura não é afetada.
- O candidato vê um remetente `resend.dev`, não `sistran.com.br`.

### ⚠️ 01/10/2026 — o atalho serve para TESTAR, e não para o destino oficial

Fato novo, reportado pela decisora: **o destino oficial é uma caixa do RH à qual ela
não tem acesso.** Isso reclassifica o parágrafo que esta seção dizia ser opcional.

| Destino | Precisa de DNS? | Para quê serve |
|---|---|---|
| a caixa de quem criou a conta Resend | **não** | validar o envio de ponta a ponta hoje |
| a caixa do RH (terceiro) | **sim**, domínio verificado | operação real da página |

O remetente de teste **não entrega para terceiros**. Logo, verificar `sistran.com.br`
na Resend e apontar `CURRICULO_REMETENTE` para `Site Sistran <nao-responda@sistran.com.br>`
**deixou de ser melhoria e passou a ser pré-requisito do destino oficial** — e
depende de acesso ao DNS do domínio, permissão de TI, não de front-end.

Enquanto o domínio não estiver verificado, a página **não deve ficar publicada
prometendo envio para o RH**: a Resend recusaria, a action devolveria `erro`, e o
candidato veria a falha. Falhar é melhor que mentir, mas não é um estado para
publicar.

#### O canal de direitos publicado

A decisão «canal publicado = o mesmo do destino» foi **mantida**. Como o destino
oficial não é acessível a quem decide, `EMAIL_CURRICULO`
(`src/lib/curriculo-regras.ts`) passou a ler `NEXT_PUBLIC_CURRICULO_EMAIL`, com o
literal antigo como padrão — trocar o endereço publicado virou configuração, não
edição de código. `NEXT_PUBLIC_` é inlinado na construção: a troca **exige novo
deploy**, não basta salvar a variável.

**A decisão que falta:** qual endereço o site publica para pedido de acesso e
exclusão. Se for a caixa do RH, alguém do RH tem de saber que recebe esses pedidos —
publicar o endereço não cria o processo de atendê-los.

### 01/10/2026 — a ponte escolhida: `maria.martinelli@sistran.com.br`, e encaminhamento

Sem acesso ao DNS, verificar o domínio está fora de alcance hoje. Decisão: o destino
**volta a ser** `maria.martinelli@sistran.com.br` — caixa que a decisora lê — e o
repasse ao RH é **encaminhamento de e-mail**, manual ou por regra do cliente de
e-mail.

Por que esta é a melhor ponte disponível:

- Funciona **sem DNS e sem permissão nova**: o remetente de teste da Resend entrega
  para o e-mail da própria conta, e a conta será criada nesse endereço.
- O canal de direitos publicado passa a ser **verdadeiro**: quem o site anuncia é
  quem lê a caixa. Era o furo aberto quando o destino era uma caixa inacessível.
- Reversível em uma variável no dia em que o domínio for verificado.

O custo, registrado: **o repasse ao RH é dependência de pessoa, não de sistema.**
Férias, troca de função ou saída da empresa interrompem a esteira sem nenhum sinal no
site. Regra de encaminhamento automático reduz, não elimina. Serve como ponte; não
serve como estado permanente — e é o mesmo argumento que já sustentava a guarda de 6
meses em vez de 12.

Alternativa avaliada e **não** adotada: provedor com verificação de **remetente
único** (SendGrid *Single Sender Verification*, Brevo equivalente) entrega direto ao
RH sem tocar em DNS. Recusada por ora porque sem SPF/DKIM alinhados ao domínio o
e-mail com anexo tem chance real de cair em spam — currículo em spam enquanto o
candidato lê «recebido» é o defeito desta issue com outra roupa. Fica como opção se o
encaminhamento não se sustentar.

Configuração declarada em `.env.local` (`CURRICULO_DESTINO`), e **não** herdada do
padrão do código: o padrão existe para o envio não morrer calado, não para ser a
configuração.

Sem `RESEND_API_KEY` a action devolve **`erro`** com «Não conseguimos enviar sua
candidatura agora… use o nosso LinkedIn», e registra no log que a chave falta. Ela
**não** devolve sucesso — era esse sucesso incondicional o defeito que abriu a
SIS-246, e ele não podia ser substituído por outro igual.

Sem domínio verificado a Resend **recusa** o envio. Isso é melhor que o alternativo:
e-mail com anexo caindo em spam em silêncio enquanto o candidato lê «recebido».

### O que foi escrito

- **`src/lib/curriculo-regras.ts`** (novo) — a regra do arquivo em um lugar só:
  extensões, limite de 5 MB, assinaturas de bytes (`%PDF-`, `PK\x03\x04`,
  `D0 CF 11 E0`) e `EMAIL_CURRICULO`, o endereço público do canal de direitos. Módulo
  neutro porque `src/app/actions/` é `'use server'` e só exporta funções async — o
  campo lê para **desenhar** a regra, a action lê para **impor**.
- **`src/app/actions/curriculo.ts`** (novo) — `enviarCurriculo`. Valida, confere
  assinatura, monta o anexo em base64 e chama a Resend por `fetch`. **Sem
  dependência nova**: a Resend é API HTTP e o pacote é um invólucro em volta de um
  POST com JSON. Falha de envio devolve `erro`. Nenhum dado pessoal em log — nem no
  caminho de erro, onde o objeto do `fetch` traria a URL e o cabeçalho com a chave.
  Manda também um **recibo ao candidato**, e o resultado dele é ignorado de
  propósito: a candidatura já chegou, e falhar por causa do recibo mandaria a pessoa
  reenviar um currículo entregue.
- **`next.config.mjs`** — `experimental.serverActions.bodySizeLimit: '6mb'`. Fecha o
  defeito ao vivo do item 2. 6 e não 5 porque o limite é do corpo inteiro.
- **`DemoForm.tsx`** — a action passou a ser **propriedade**, com
  `enviarFormulario` como padrão; `ACEITE_PADRAO`/`LIMITE_PADRAO` passaram a vir do
  módulo compartilhado (os valores antigos ficaram comentados no lugar).
- **`CurriculoCard.tsx`** — `action={enviarCurriculo}`, **`privacyNote` passado**
  (item 7: ele nunca tinha sido), `successNote` definitivo, telefone **opcional**.
- **`trabalhe-conosco/page.tsx`** — as duas frases de «demonstração» caíram, no
  mesmo commit em que o envio passou a existir; os textos anteriores ficaram
  comentados. O comentário que afirmava que o aviso de coleta vivia no `privacyNote`
  ganhou a correção de que isso era falso até agora.
- **`.claude/conteudo-site/08-trabalhe-conosco.md`** — divergências anotadas, sem
  apagar o registro do site legado.

### O que NÃO foi feito

- **A issue de implementação nunca foi aberta no Linear**: limite do plano free. A
  Parte 2 continua sendo o corpo dela, e a Parte 3 é o relatório.
- **`copy-lock.json` NÃO foi regenerado.** Medido: `npm run copy-lock` produz
  **+190 textos**, dos quais **169 vêm de `src/data/acceleratorPages.ts`** — arquivo
  que esta issue não toca. Ou seja, **o lock já estava desatualizado antes desta
  mudança**, e regenerá-lo misturaria ~185 strings alheias no diff e faria o portão
  de copy aprovar, de carona, trabalho que ninguém revisou. Fica revertido ao estado
  do commit. **`npm run test:copy` está vermelho — e já estava.** Regenerar é uma
  decisão à parte, de quem conhece a origem daquele drift.
- **Varredura de malware no anexo** — fora de escopo, como já estava.
- **Build e testes não foram rodados** (restrição do pedido: só lint). Lint medido
  na hora: **79 problemas / 31 erros / 48 avisos** no projeto, idêntico à linha de
  base da SIS-98; `npx eslint` nos seis arquivos tocados e no `next.config.mjs`
  devolve **zero**.
- **O envio não foi testado de ponta a ponta**, porque não há credencial. O primeiro
  teste real é obrigatório antes de considerar a página confiável.
