# Admin de eventos (SIS-216)

Editor interno dos quinze eventos de `/eventos-inovacao`: título, descrição,
categoria, ícone, arte e miniatura. Atrás de senha, sem link em lugar nenhum do
site.

## Onde fica

| | |
|---|---|
| Login | `/admin/entrar` |
| Lista | `/admin/eventos` |
| Edição | `/admin/eventos/<id>` |

O endereço não aparece no menu, no rodapé, na home nem no `sitemap`. Três camadas
o mantêm fora de busca: `disallow: '/admin'` em `src/app/robots.ts`,
`robots: { index: false }` em `src/app/admin/layout.tsx` e o cabeçalho
`X-Robots-Tag: noindex, nofollow` posto pelo proxy.

## A senha

Uma senha compartilhada, digitada na tela de login `/admin/entrar` (opção **B** da
issue). Não há usuário, cadastro, papel nem conta: quem acerta a senha recebe um
cookie assinado que vale **8 horas**, e é só isso que o porteiro confere.

```
EVENTOS_ADMIN_PASSWORD=<a senha>
```

Quem entra em qualquer endereço do `/admin` sem passe válido é levado para o
login; quem já tem passe e volta ao login é levado para a lista. O botão **Sair**
na lista apaga o cookie. **Trocar a senha no host derruba todos os cookies já
emitidos** — é o jeito de expulsar todo mundo de uma vez, já que não há sessão
guardada no servidor.

O cookie é `httpOnly` (nenhum script da página o lê), `secure` em produção,
`sameSite: lax`, escopo `/admin` — o site público não recebe nada dele. O prazo
vai **dentro** da assinatura, então um cookie remendado para durar mais deixa de
conferir.

A opção **A** (HTTP Basic, diálogo nativo do navegador) foi o primeiro corte e
está preservada comentada em `src/proxy.ts` e `src/lib/adminGate.ts`. Voltar para
ela é trocar qual bloco está ativo.

- **Local**: em `.env.local`. Esse arquivo **não vai para o repositório** —
  `.gitignore` ignora `.env*`, e é assim que deve ficar.
- **No host**: nas variáveis de ambiente do serviço.

Sem a variável definida, o admin responde **503** e não abre. É deliberado: uma
configuração esquecida aparece na primeira tentativa de uso, em vez de publicar o
editor do site aberto na internet.

A senha nunca chega ao navegador: o nome não começa com `NEXT_PUBLIC_`, o
formulário de login só manda o que foi digitado, e a conferência acontece no
servidor — no proxy (`src/proxy.ts`), na action de login
(`src/app/admin/entrar/acoes.ts`) e dentro da Server Action que grava
(`src/app/admin/eventos/acoes.ts`).

Toda senha recusada custa **500 ms** fixos. Não é rate limiting de verdade (isso
exigiria estado compartilhado, que esta versão não tem); é o piso barato que tira
a força bruta em laço da mesa.

## O que acontece ao salvar

O admin grava `src/data/events.json` no próprio repositório, com a mesma
formatação de quem escreve à mão (2 espaços) — o diff do commit mostra só o texto
que mudou.

**Publicar é fazer commit e deploy desse arquivo.** O visitante não vê a edição
antes disso, porque `EventsSpotlight` importa o catálogo estaticamente e o texto
publicado é o do build.

## A imagem do evento

Um arquivo só é escolhido no campo **Imagem do evento**. O navegador recorta em
16:9 (corte central, o mesmo que `object-fit: cover` faria) e gera **dois** webp,
que o servidor apenas grava:

| Arquivo | Medida | Onde aparece no site |
|---|---|---|
| `public/images/EVENTOS/<id>-<carimbo>.webp` | 1672×941 | palco central da cena de `/eventos-inovacao` em desktop, e cartão único no celular |
| `public/images/EVENTOS/thumb/<id>-<carimbo>.webp` | 240×135 | miniaturas das colunas laterais da mesma cena — o botão que leva ao palco |

As medidas vivem em `src/app/admin/eventos/arte.ts`, que é a única fonte delas
para o recorte, a conferência e a prévia. Elas vêm de `EventsSpotlight` (`width`/
`height` passados ao `next/image`) e das artes já publicadas — 1676×938 e
1672×940 em disco.

Três decisões que valem registro:

- **Quem redimensiona é o navegador**, com `canvas`. `sharp` está em
  `node_modules` (o Next o traz), mas **não** é dependência declarada deste
  projeto; usá-la em código de produção seria depender de uma versão que ninguém
  prometeu manter. De quebra, sobem ~100 kB em vez dos 6 MB do original.
- **O nome do arquivo é montado no servidor** a partir do `id` e de um carimbo de
  tempo, nunca do nome que veio do navegador (`../../` escapa da pasta; acento e
  espaço quebram depois do deploy). O carimbo também evita que CloudFront e
  navegador sirvam a foto velha: arquivo novo, URL nova.
- **O upload conclui sozinho**: grava os dois binários *e* aponta o JSON para
  eles. Deixar o JSON para o botão "Salvar" deixaria binário órfão em `public/`
  cada vez que alguém trocasse a foto e fechasse a aba.

O servidor confere tamanho (≤ 2 MB) e a assinatura `RIFF….WEBP` do conteúdo — não
o `type` declarado pelo cliente, que é texto que veio de fora. Os bytes vão para
`public/`, de onde são servidos de volta; aceitar conteúdo arbitrário aí seria
hospedagem aberta.

Os `<select>` de arte e miniatura já existentes continuam: reaproveitar a arte de
outro ano é trabalho legítimo.

Ao lado do formulário há uma **prévia**, declarada na tela como aproximação. Ela
acerta o recorte, o fundo escuro sobre o qual a arte aparece no site e quanto
texto cabe; a cena real (`EventsSpotlight`) tem rolagem e colunas animadas, e uma
cópia parada dela seria mais mentirosa que uma maquete assumida.

### Limites desta versão (v0)

1. **Grava só onde o repositório está em disco e é gravável** — ambiente de
   desenvolvimento (`npm run dev`) ou servidor com o checkout. Em host
   serverless o sistema de arquivos da aplicação é somente-leitura; em export
   estático não há servidor. Nesses casos o formulário mostra a falha em texto
   legível, dizendo que o problema é o host.
2. **A decisão de deploy ainda está aberta** (`docs/images-unoptimized.md`). Se o
   site for para S3 como export estático, o admin não roda lá — ele continua
   servindo como ferramenta local de atualização, e o commit segue sendo a
   publicação.
3. **O `id` não é editável.** É a chave da linha no catálogo; trocá-lo é operação
   de código.

## Regra Zero continua valendo

Os 43 textos dos eventos seguem travados em `copy-lock.json`. O extrator
(`scripts/copy-lock.mjs`) passou a ler `.json` sob `src/data/` justamente para
isso — sem essa mudança, mover o catálogo de `.ts` para `.json` tiraria a escrita
publicada do lock e toda edição feita aqui seria invisível para
`npm run test:copy`.

A interface do admin (`src/app/admin/**`) fica **fora** do lock: rótulo de
formulário interno não é escrita publicada, e travá-lo faria o portão gritar por
um botão renomeado numa ferramenta.
