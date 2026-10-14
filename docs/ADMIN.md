# Como funciona o admin

Guia de uso e de funcionamento da área interna do site (`/admin`). Escrito para quem vai
**usar** — a primeira metade não exige saber programar. A partir de «Por dentro» o texto
fala de arquivos e de código, para quem for dar manutenção.

Há também os **vídeos** em `/admin/tutoriais`, dentro do próprio admin — três, cobrindo
cadastrar evento, editar evento e criar carimbo. Vídeo e documento cobrem o mesmo assunto
por caminhos diferentes; o documento é mais completo (os vídeos não tratam da senha, da
reordenação nem do que acontece ao salvar em cada ambiente).

> Este arquivo substitui `docs/admin-eventos.md`, que descreve a primeira versão
> (SIS-216, gravação em disco) e ficou desatualizado em 01/10, quando o catálogo passou a
> ser publicado no Vercel Blob. Aquele texto fica como histórico.

---

## 1. Entrar

O endereço é **`/admin`**, e ele redireciona para a lista de eventos. Não existe link
para o admin em nenhum lugar do site: a navegação institucional não aponta para cá, de
propósito. Chega-se digitando o endereço.

Pede-se **uma senha**, igual para todos. Não há cadastro, nem usuário, nem «esqueci minha
senha» — não existem contas, existe uma senha compartilhada guardada no servidor.

Depois de acertar, você fica logado por **8 horas**. Passado o prazo, pede de novo. O
botão **Sair** no canto direito da barra encerra antes disso.

Três coisas que valem saber:

- A senha vive na variável de ambiente `EVENTOS_ADMIN_PASSWORD`, configurada no host
  (Vercel). Não está no código nem no repositório.
- **Trocar a senha desconecta todo mundo na hora.** É o jeito de «expulsar todos» se a
  senha vazar.
- O admin não é indexado pelo Google — três travas independentes garantem isso.

## 2. As três abas

A barra azul do topo tem três:

| Aba | Para quê |
|---|---|
| **Eventos** | Criar, editar, excluir e reordenar os eventos de `/eventos-inovacao` |
| **Carimbo** | Criar carimbos e escolher onde eles aparecem no site |
| **Tutoriais** | Os vídeos de explicação |

---

## 3. Aba Eventos

### A lista

Mostra todos os eventos publicados, cada um num cartão com **a arte grande** — e não a
miniatura, porque o trabalho aqui é julgar imagem, e para isso a foto precisa estar
grande o suficiente para se decidir.

Cada cartão traz o número da posição, o título e a categoria. Clicar abre a edição.

**A ordem dos cartões é a ordem da cena no site.** O primeiro cartão é o primeiro evento
que o visitante encontra. As setas de reordenar ficam abaixo de cada cartão, fora da área
clicável do cartão.

No topo aparece, quando é o caso, um aviso do tipo «**3 sem arte completa**» — eventos
sem a arte grande ou sem a miniatura. O aviso só existe quando há o que avisar.

### Criar e excluir

- **+ novo evento**, no topo à direita.
- Excluir fica embaixo do cartão, na própria lista.

### O formulário de um evento

| Campo | O que é | Obrigatório |
|---|---|---|
| **Identificador** (`id`) | O nome interno do evento, usado no endereço da edição. Só em evento novo — não muda depois | Sim |
| **Título** | O que o visitante lê | Sim |
| **Descrição** | O texto do evento | Sim |
| **Categoria** | Uma das quatro (abaixo) | Sim |
| **Carimbo** | Vazio = usa a arte da categoria. Escolher um troca só o deste evento | Não |
| **Arte** | A imagem grande, **1672 × 941** (16:9) | Não, mas o site fica pobre sem |
| **Miniatura** | A versão pequena, **240 × 135** | Não |
| **Destaque editorial** | Marca o evento como destaque | Não |
| **Tem gravação no YouTube** | Sinaliza que existe vídeo do evento | Não |

As quatro categorias, com o rótulo que o visitante vê:

| Valor | Rótulo no site |
|---|---|
| `proprio` | Realizado pela Sistran |
| `global` | Evento global |
| `nacional` | Evento nacional |
| `parceiro` | Evento de parceiro |

**Enviar imagem:** o campo aceita **apenas arquivos `.webp`**. Outros formatos são
recusados pelo próprio seletor de arquivos. Também é possível reaproveitar uma arte que já
está no site, escolhendo-a na lista ao lado do envio.

**A prévia** mostra uma aproximação de como fica — e o rótulo na tela diz isso. A cena
real no site é outro componente, com outro tamanho e outro fundo; a prévia serve para
pegar erro grosseiro (foto trocada, texto cortado), não para aprovar enquadramento fino.

### Um campo que saiu

Havia um campo **«Ícone»**, com uma lista de nomes (`Sparkles`, `Globe`, `Shield`…). Ele
foi **removido da tela em 14/10**, porque não mudava nada: o componente que desenhava esse
ícone saiu de cena e o que renderiza a página hoje não lê esse valor. O dado continua
sendo gravado nos bastidores, porque a validação do catálogo exige que ele exista.

### O que acontece quando você salva

Depende de o site ter a loja de arquivos configurada (`BLOB_READ_WRITE_TOKEN`):

- **Com a loja (produção):** salvar **já muda o site na hora**. Não depende de deploy nem
  de ninguém commitar nada. O próprio texto no topo da lista diz isso.
- **Sem a loja (máquina de desenvolvimento):** salvar grava o arquivo
  `src/data/events.json` e as imagens em `public/images/EVENTOS/`. Aí é preciso **commitar
  esses arquivos** para publicar.

O aviso no topo da lista muda conforme o caso, então ele nunca mente sobre onde a sua
edição foi parar.

### Se der erro ao salvar

As mensagens são frases em português e dizem o que falta — título vazio, descrição vazia,
categoria inválida, arte não encontrada, identificador já em uso. Erro de **host** (não
consegui gravar) é mostrado como tal, para não parecer que o problema foi o que você
digitou.

---

## 4. Aba Carimbo

Carimbo é o selo gráfico que aparece sobre as artes. A aba tem três sub-abas, e elas são
**endereços** (`?aba=`) — ou seja, dá para mandar o link de uma sub-aba para alguém, e ela
sobrevive ao recarregar a página depois de salvar.

1. **Lugares do site** — a sub-aba inicial, de leitura: os **20 pontos** do site que
   mostram carimbo (a lista vive em `src/data/carimboLugares.ts`). Em cada um, é possível
   trocar pelo carimbo que você criou ou voltar à arte original. É também onde ficam os
   **carimbos já criados**, cada um com **Editar** e **Excluir**.
2. **Carimbos de evento** — as quatro categorias de evento. O carimbo escolhido aqui vale
   para **todos** os eventos daquela categoria.
3. **Criar carimbo** — o desenho propriamente dito. Os campos: **nome do carimbo** (só
   para você localizá-lo depois), **linha de cima**, **marca**, **selo pequeno**, **cor**,
   **acabamento** (traço, sólido ou textura) e os ajustes finos de tamanho, inclinação e
   densidade. A prévia à esquerda mostra o resultado, e o **fundo da prévia** troca entre
   xadrez, claro e escuro — é assim que se confere se o carimbo funciona sobre foto clara
   e sobre foto escura. O carimbo salvo fica disponível para aplicar em qualquer um dos
   lugares acima.

A hierarquia, do mais específico para o mais geral: **carimbo do evento** (campo no
formulário) vence o **carimbo da categoria**, que por sua vez substitui a arte original.
Deixar o campo do evento vazio é o que faz ele «seguir a categoria».

---

## 5. Aba Tutoriais

Os vídeos de explicação, em `/admin/tutoriais`. Hoje são três:

| Vídeo | Duração | Cobre |
|---|---|---|
| **Como cadastrar um evento** | 2:40 | Entrar no painel, «+ Novo evento», preencher o formulário, escolher imagem, criar, esperar a publicação e conferir no site. Fecha com um aviso sobre excluir |
| **Como editar um evento que já existe** | 0:51 | Abrir um evento da lista, ajustar o título com a prévia acompanhando, salvar e conferir em `/eventos-inovacao` |
| **Como ajustar os carimbos dos eventos** | 2:42 | A aba Carimbo: criar do zero, julgar na prévia trocando o fundo, e Editar/Excluir na lista |

Os três têm **legendas embutidas na imagem** (cada passo escrito numa faixa na base). Isso
resolve o essencial para quem não ouve o áudio; o que legenda queimada não dá é desligar,
ser lida por leitor de tela, ser pesquisável ou traduzida.

### Onde os arquivos ficam

**Não no repositório.** Os três vídeos somam 34 MB, e binário em `public/` entra no
histórico do git para sempre — com vídeo isso é pior, porque regravar não substitui: cada
versão soma. Eles moram no **Vercel Blob**, a mesma loja do catálogo de eventos, sob
`admin/tutoriais/`.

Para acrescentar um vídeo:

1. gere a capa com `ffmpeg` (um instante que mostre o assunto, não a cartela nem um fundo
   escuro — é o que se vê antes do play);
2. acrescente o par ao `ARQUIVOS` de **`scripts/subir-tutoriais-blob.mjs`** e rode o
   script, passando a pasta onde os arquivos estão;
3. cole o nome dos dois arquivos na lista `VIDEOS` de
   `src/app/admin/tutoriais/page.tsx`.

O script sobe com endereço previsível (sem sufixo aleatório), e é por isso que a página
pode ter as URLs escritas no código em vez de consultar a loja a cada visita — ela não
depende do token para renderizar, só para publicar.

**Confira o título na cartela do próprio vídeo, não no nome do arquivo.** Já houve
divergência: o arquivo `tutorial-eventos-...-explicado.mp4` abre dizendo «Como cadastrar um
evento».

### Uma ressalva de acesso

Os vídeos **não estão atrás da senha**, e mudá-los para o Blob não alterou isso: a loja é
pública e o porteiro só cobre `/admin/*`, que não alcança outro domínio. Quem souber a URL
assiste sem logar. Aceitável para instrução de uso.

O vídeo de cadastro filma a tela de login, e isso foi conferido quadro a quadro: a senha
aparece **mascarada**. O que ele revela é o endereço do admin e o comprimento da senha.
**É essa conferência que vale fazer antes de publicar um vídeo novo** — se algum mostrar
senha legível ou dado que não pode sair, ele precisa ser servido por uma rota do admin que
confira o cookie e devolva os bytes; nem `public/` nem Blob público têm como ser
protegidos.

---

## Por dentro — para manutenção

### Mapa dos arquivos

```
src/proxy.ts                      porteiro: barra /admin/* sem cookie válido
src/lib/adminGate.ts              conferência da senha (tempo constante)
src/lib/adminSessao.ts            o cookie assinado (HMAC) e seu prazo de 8h

src/app/admin/layout.tsx          a casca: barra azul, as três abas, Sair
src/app/admin/page.tsx            /admin → redireciona para /admin/eventos
src/app/admin/entrar/             tela de login
src/app/admin/eventos/            lista, criar, editar, excluir, reordenar
src/app/admin/eventos/acoes.ts    AS ESCRITAS (cinco), todas reconferindo a senha
src/app/admin/carimbo/            as três sub-abas de carimbo
src/app/admin/tutoriais/          os vídeos

src/lib/eventosLoja.ts            decide o destino: Blob (com token) ou disco
src/lib/eventosArquivo.ts         caminho de disco + `problemas()`, a validação
src/lib/carimbosLoja.ts           o mesmo para carimbos
src/data/events.ts                o tipo, as categorias e `conferirCatalogo`
src/data/events.json              o catálogo do pacote — o chão quando a loja está vazia
```

### A senha é conferida duas vezes, e isso não é redundância

No `proxy.ts` (antes de a página existir) **e** dentro de cada escrita em `acoes.ts`. A
documentação do Next 16 é explícita: Server Functions são alcançáveis por POST direto,
fora da interface. A conferência que realmente protege é a que está colada na escrita —
são **cinco** portas POST (editar, criar, excluir, reordenar, enviar arte), e cada uma
reconfere.

### Duas fontes para o catálogo, uma valendo por vez

1. **Blob**, quando existe `BLOB_READ_WRITE_TOKEN` *e* já há catálogo gravado lá.
2. **`src/data/events.json`** do pacote, em qualquer outro caso.

O item 2 **não é código morto**: é o que faz a loja vazia mostrar os eventos de hoje em
vez de página em branco, o que mantém funcionando a máquina de quem clonou o repositório
sem token, e o que dá um chão para o primeiro salvamento — que grava o catálogo **inteiro**,
não um delta. Apagar o JSON depois da primeira publicação pareceria limpeza e seria perder
o fundo do poço.

### O que se perde com o catálogo no Blob

O texto dos eventos criados pelo admin **deixa de passar pelo `copy-lock`**: não há commit
para revisar. Foi o preço do «publica na hora», e a contrapartida é que a validação
(`problemas()`) é a última porta antes de gravar.

### Uma armadilha ao mexer aqui

`conferirCatalogo` (`src/data/events.ts`) dá **`throw`** se um evento tiver `kind` ou
`icon` fora das listas fechadas — e isso **derruba `/eventos-inovacao` inteira**, não só
aquele cartão. É por isso que o campo oculto de `icon` continua no formulário mesmo depois
de o campo visível sair: sem ele, salvar gravaria string vazia e a página pública quebraria
no acesso seguinte.

### Por que `proxy.ts` e não `middleware.ts`

Este projeto está no Next 16, onde `middleware` foi **renomeado** para `proxy`. Escrever
`middleware.ts` não daria erro — daria coisa pior: um arquivo depreciado que ainda
funciona hoje.
