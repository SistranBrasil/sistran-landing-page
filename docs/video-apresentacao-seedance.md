# Vídeo de apresentação — Sistran Brasil

Roteiro para geração no **Seedance 2.0** + mapa de lettering de pós-produção.
Do legado de 1988 à plataforma atual: sede real, times, serviços e aceleradores.

> **Fonte dos dados.** Todo número, nome de acelerador, tecnologia e endereço
> deste documento sai do próprio projeto. Nada aqui é inventado — quem alterar
> um rótulo altera a fonte primeiro:
>
> | Dado | Fonte |
> |---|---|
> | Fundação no Brasil: 1988 | `src/app/layout.tsx:212`, `.claude/conteudo-site/01-a-sistran.md:14` |
> | Métricas (850+, 150+, 230+, 35+, 25+, 23+, 650 mil h) | `src/data/metrics.ts` |
> | Aceleradores (7) | `src/data/accelerators.ts` |
> | Domínios de seguros (5) | `src/data/domains.ts` |
> | Soluções de negócio (4) | `src/data/solutions.ts` |
> | Endereço da matriz e unidades | `src/data/contact.ts` |
> | Fotos da sede | `public/images/escritorios/` |
> | Paleta | `tailwind.config.ts` |

---

## 1. Especificação técnica

| Item | Valor |
|---|---|
| Formato | 16:9, 1920×1080, 24 fps |
| Duração | ~30 s — 6 cenas de 5 s |
| Câmera | movimento contínuo e motivado; nenhum corte seco |
| Acabamento | luz volumétrica, reflexos anamórficos, foco cinematográfico |
| Cenas documentais | 3 e 4 (luz natural, textura, imperfeição) |
| Cenas gráficas | 2, 5 e 6 (abstratas, holográficas) |

### Paleta obrigatória

| Cor | Hex | Uso |
|---|---|---|
| Azul profundo | `#004D8A` | fundos das cenas 2, 5, 6 |
| Azul marca | `#0079CB` | luz-chave, dados, transições |
| Ciano destaque | `#0ED8F6` | pulsos, arestas, `2026` |
| Violeta apoio | `#A78BFA` | painéis de sinistro/vida |
| Verde-menta | `#6EE7B7` | esteira de QA, conformidade |
| Branco frio | `#F8FAFC` | lettering de pós |

Cena 1 é a exceção: **âmbar dessaturado, quase sépia**. As cenas 2 a 6 saturam
progressivamente para o azul da marca.

### Regra de texto (importante)

Os **únicos caracteres legíveis gerados pela IA** são `1988` (Cena 1) e `2026`
(Cena 6). Nenhuma outra palavra, sigla, legenda ou logotipo deve ser gerado —
modelos de vídeo erram texto e o resultado desmonta a credibilidade da peça.

Todo o lettering de serviços, tecnologias e métricas entra em **pós-produção**,
na tipografia da marca. Cada cena reserva espaço negativo para isso; o mapa
está na §4.

---

## 2. Arco narrativo

```
1988              →  stack       →  sede        →  time        →  IA          →  escala
papel travado        migração       lastro          capacidade     aceleradores   presença
peso                 destravamento  solidez         humana         inteligência   nacional
âmbar                azul           dia real        interior real  holográfico    aéreo
```

Progressão emocional: **peso → destravamento → solidez → capacidade → inteligência → escala.**

---

## 3. Roteiro por cena

### CENA 1 — O LEGADO · `00:00–00:05`

Escritório de seguradora dos anos 80, luz âmbar fluorescente, poeira suspensa no
ar. Monitores CRT de fósforo verde piscando, apólices em papel carbono, armários
de arquivo metálicos, mainframe girando fitas magnéticas ao fundo.

**Único elemento de data:** um carimbo datador de borracha pressionado sobre uma
apólice, deixando `1988` em tinta roxa desbotada em primeiro plano. Aparece por
cerca de 1 s e sai de foco — é âncora histórica, não protagonista.

**Câmera:** dolly lateral lento da direita para a esquerda, lente 35 mm, foco
raso, grão de filme, leve aberração cromática, saturação baixa. Peso, lentidão,
processo manual travado — dignidade histórica, não decadência.

**→ Transição 1 · match cut de tela:** a tela do CRT satura em azul `#0079CB`, a
varredura de fósforo se converte em linhas de dados fluindo, e a câmera
atravessa o vidro do monitor em whip-pan. A poeira do escritório vira partículas
de luz.

---

### CENA 2 — A STACK EM MOVIMENTO · `00:05–00:10`

Túnel de dados abstrato. Folhas de apólice se fragmentam em partículas e se
reorganizam em arquitetura viva, em cinco camadas simultâneas:

1. **Blocos de código** flutuando e se compilando em contêineres cúbicos que se
   encaixam — evoca Java / Spring Boot / microserviços.
2. **Grafo de nós de API** se conectando por linhas ciano pulsantes, com pacotes
   de dados viajando pelas arestas.
3. **Planos de infraestrutura em wireframe** se desenhando sozinhos, camada
   sobre camada, como se fossem provisionados por código — evoca IaC/Terraform.
4. **Ícones de nuvem abstratos** em contraluz azul ao fundo, dois deles
   espelhados — evoca multicloud AWS/Azure.
5. **Documento sob varredura horizontal de luz**, campos se destacando e
   extraindo-se em dados estruturados — evoca OCR e extração documental.

**Câmera:** fly-through acelerado (push-in), motion blur direcional, luz
volumétrica azul, ritmo crescente.

**Espaço reservado:** faixa inferior do quadro limpa, para a régua de chips de
tecnologia.

**→ Transição 2 · máscara circular:** um círculo de luz branca expande do centro
do quadro, apaga o túnel e revela o céu — a câmera já está em contra-plongée.

---

### CENA 3 — A SEDE REAL, SÃO PAULO · `00:10–00:15`

Contra-plongée extremo de torre corporativa em São Paulo, Cidade Monções:
fachada dupla de **vidro azul-espelhado** de um lado e **painéis de aço inox
escovado curvo** do outro, arestas verticais afiladas convergindo para um céu
azul limpo. Sol batendo na quina do inox, criando um ponto de brilho estelar. Na
base, canteiro de estrelas-do-nordeste com flores laranja, calçada clara,
pilotis de acesso e palmeiras. Skyline de torres de escritório ao fundo.

**Câmera:** tilt-up lento subindo a fachada, seguido de leve rotação orbital na
quina do prédio, lente 24 mm com distorção suave. Luz de dia real, aspecto
documental — não CGI. Sólido, estabelecido, presente.

**Frame de partida recomendado:** `public/images/escritorios/sp-1-1-1600.webp`.

**→ Transição 3 · entrada por reflexo:** a câmera avança contra o vidro azul e
atravessa o reflexo; o skyline espelhado se dissolve e revela o interior do
andar.

---

### CENA 4 — O TIME E O SERVIÇO · `00:15–00:20`

Interior real de andar corporativo em open space: teto de concreto aparente com
dutos e luminárias lineares expostas, colunas e paredes em azul-petróleo,
grandes esferas acrílicas transparentes penduradas do teto, bancadas brancas
longas, cadeiras ergonômicas de assento azul, piso de cimento queimado.

Times de tecnologia trabalhando de verdade: squads em bancadas paralelas,
notebooks e monitores duplos, alguns de headset, duas pessoas em pé discutindo
diante de um monitor de parede, outra apontando para um quadro. Movimento
natural, ambiente ocupado e produtivo, luz difusa fria misturada com luz de
janela.

**Câmera:** steadicam avançando pelo corredor central entre as bancadas, lente
35 mm, foco seguindo os planos. Pessoas em plano médio, de costas ou em silhueta
parcial — nenhum close frontal de rosto.

**Frame de partida recomendado:** `public/images/escritorios/sp-5-1600.webp`.

**→ Transição 4 · pull-focus para holografia:** a câmera para diante de um
monitor; a interface na tela se desprende e flutua como painéis holográficos,
com o escritório desfocando ao fundo.

---

### CENA 5 — ACELERADORES E IA APLICADA · `00:20–00:25`

Painéis de vidro holográficos flutuando em semicírculo ao redor da câmera, sobre
fundo azul profundo. Cada painel roda uma micro-animação abstrata distinta,
todas **sem texto**:

| Painel | Animação | Acelerador que representa |
|---|---|---|
| 1 | ondas de voz pulsando e virando bolhas de diálogo geométricas | Guru de Seguros |
| 2 | perfil abstrato se conectando a três opções que se reordenam por prioridade | Match AI |
| 3 | fluxo de etapas acendendo em sequência até um selo de conformidade fechar | Fast |
| 4 | pilha de documentos se separando sozinha em categorias, cada um com selo colorido | Smart Miner |
| 5 | barra de testes preenchendo em verde-menta e anel de progresso fechando | QA Integrado |
| 6 | esteira de commits se encadeando e um cursor gerando blocos de código sozinho | Lumina AI |
| 7 | duas malhas separadas se ligando por um par de conectores que se encaixam | Connect API |

Ao fundo, **cinco ícones abstratos em anel** orbitam lentamente em ciano e
violeta, evocando os domínios de seguros: subscrição, sinistro, resseguro, vida
e P&C.

**Câmera:** órbita lenta (arc shot) ao redor do semicírculo, lente 50 mm,
reflexos anamórficos horizontais, partículas finas no ar.

**Espaço reservado:** margem generosa entre os painéis, para o nome de cada
acelerador em pós.

**→ Transição 5 · crane up:** a câmera sobe rápido, os painéis se achatam, se
alinham como camadas empilhadas e dissolvem em pontos de luz que sobem com ela.

---

### CENA 6 — ESCALA E FECHAMENTO · `00:25–00:30`

Plano aéreo amplo: malha de luz azul se espalhando sobre um território, nós
luminosos acendendo em sequência e se ligando por linhas finas ciano — presença
nacional e rede de parceiros. **Três nós brilham mais forte** que os demais:
São Paulo, Pato Branco e Rio de Janeiro. Fundo em gradiente azul profundo com
brilho radial no canto superior direito.

A malha converge para o centro e deixa o **centro do quadro como espaço negativo
limpo** para o logotipo em pós. No terço inferior direito, `2026` acende discreto
em ciano, fechando o arco aberto em 1988.

**Câmera:** pull-back final suave, desacelerando até quase parar. Último frame:
azul limpo, poucas partículas flutuando, silêncio visual.

---

## 4. Mapa de lettering por cena (pós-produção)

Tudo abaixo entra em **pós**, na tipografia da marca. Nada é gerado pela IA.

### Convenções

- **Régua inferior** = faixa horizontal a 12% da base do quadro, chips pequenos.
- **Rótulo de painel** = texto ancorado ao painel holográfico, acompanha o movimento.
- **Placa** = card com fundo `#004D8A` a 70% de opacidade, canto inferior esquerdo.
- Entrada padrão: fade + `y: 12px → 0`, 400 ms, `ease-out`. Saída: fade 300 ms.

---

### Cena 1 · `00:00–00:05` — O legado

| Timecode | Posição | Texto | Estilo |
|---|---|---|---|
| `00:01.5–00:04.5` | canto inferior esquerdo | **1988** — Sistran estabelecida no Brasil | placa, âmbar `#E8D5B0` |

> Só um rótulo. A cena é curta e a data já aparece no carimbo em quadro.

---

### Cena 2 · `00:05–00:10` — A stack

| Timecode | Posição | Texto | Estilo |
|---|---|---|---|
| `00:05.3–00:09.5` | topo, alinhado à esquerda | Modernização de legado | título de seção, `#F8FAFC` |
| `00:06.0` | régua inferior, chip 1 | Java · Spring Boot | chip ciano |
| `00:06.4` | régua inferior, chip 2 | Microserviços | chip ciano |
| `00:06.8` | régua inferior, chip 3 | AWS · Azure | chip ciano |
| `00:07.2` | régua inferior, chip 4 | Terraform · IaC | chip ciano |
| `00:07.6` | régua inferior, chip 5 | CI/CD | chip ciano |
| `00:08.0` | régua inferior, chip 6 | OCR · Data Science | chip ciano |

> Chips entram em **stagger de 400 ms** e permanecem até o fim da cena.
> Seis é o teto legível em 5 s — não adicionar um sétimo.

---

### Cena 3 · `00:10–00:15` — A sede

| Timecode | Posição | Texto | Estilo |
|---|---|---|---|
| `00:10.5–00:14.5` | canto inferior esquerdo | **Matriz São Paulo** · Cidade Monções | placa, linha 1 em bold |
| `00:11.0–00:14.5` | idem, linha 2 | R. Dr. Geraldo Campos Moreira, 240 – 2º andar | placa, corpo menor |
| `00:12.0–00:14.5` | canto inferior direito | 3 unidades · SP · PR · RJ | chip discreto |

---

### Cena 4 · `00:15–00:20` — O time

| Timecode | Posição | Texto | Estilo |
|---|---|---|---|
| `00:15.3–00:19.5` | topo, alinhado à esquerda | Capacidade produtiva | título de seção |
| `00:16.0` | métrica 1, terço esquerdo | **850+** membros do Grupo Sistran | número grande + label |
| `00:16.6` | métrica 2, centro | **650 mil+** horas de capacidade no Brasil | idem |
| `00:17.2` | métrica 3, terço direito | **150+** clientes | idem |
| `00:18.0–00:19.5` | régua inferior | Squads · Managed Services · Alocação · Projetos fechados | chip único, quatro itens |

> Contadores de `0` até o valor final em 800 ms, `ease-out`. Em
> `prefers-reduced-motion`, exibir o valor final direto.

---

### Cena 5 · `00:20–00:25` — Aceleradores

| Timecode | Painel | Texto | Estilo |
|---|---|---|---|
| `00:20.2` | painel 1 | **Guru de Seguros** — assistente conversacional com LLM | rótulo de painel |
| `00:20.5` | painel 2 | **Match AI** — propostas inteligentes e personalizadas | idem |
| `00:20.8` | painel 3 | **Fast** — automação de sinistros | idem |
| `00:21.1` | painel 4 | **Smart Miner** — tipificação e extração documental | idem |
| `00:21.4` | painel 5 | **QA Integrado** — qualidade contínua | idem |
| `00:21.7` | painel 6 | **Lumina AI** — IA generativa na esteira de DevOps | idem |
| `00:22.0` | painel 7 | **Connect API** — jornada de distribuição Vida | idem |
| `00:23.0–00:24.5` | anel de fundo | Subscrição · Sinistro · Resseguro · Vida · P&C | régua inferior, ciano/violeta |

> Sete rótulos em 5 s é denso. Se a leitura ficar apertada, **corte Connect API
> e QA Integrado** — os cinco restantes carregam a mensagem. Alternativa
> melhor: alongar a cena para 7 s e estender o vídeo para 32 s.

---

### Cena 6 · `00:25–00:30` — Fechamento

| Timecode | Posição | Texto | Estilo |
|---|---|---|---|
| `00:25.5` | nó SP | São Paulo | rótulo de nó, pequeno |
| `00:25.8` | nó PR | Pato Branco | idem |
| `00:26.1` | nó RJ | Rio de Janeiro | idem |
| `00:26.8–00:29.5` | régua inferior | **230+** ERPs implementados · **35+** seguradoras · **25+** implantações de Sinistro · **23+** prêmios | chips de métrica |
| `00:27.5–00:30.0` | centro do quadro | logotipo Sistran | SVG da marca, fade-in 600 ms |
| `00:28.2–00:30.0` | abaixo do logotipo | Soluções de Negócio em Seguros | assinatura, corpo leve |
| `00:28.8–00:30.0` | canto inferior direito | sistran.com.br | discreto, `#BCD8EE` |

---

## 5. Negative prompt

```
texto, palavras, siglas, legendas ou logotipos (exceto 1988 e 2026);
anos incorretos (1998, 1888, 1968, 2020, 2062);
interfaces de software reais ou reconhecíveis;
monitores com conteúdo ilegível ou distorcido;
rostos em close frontal; rostos deformados; mãos deformadas;
cores quentes ou alaranjadas nas cenas 2 a 6;
escritório vazio ou genérico de banco de imagem;
prédio genérico de vidro sem a fachada dupla vidro + inox;
corte seco; câmera tremida; estética cartoon; excesso de lens flare
```

---

## 6. Notas de execução

1. **Cenas 3 e 4 devem ser geradas por image-to-video**, usando
   `public/images/escritorios/sp-1-1-1600.webp` (fachada) e
   `sp-5-1600.webp` (open space) como frames de partida. A fidelidade da sede é
   o principal diferencial da peça e é exatamente o que a geração livre erraria.

2. **Nunca confiar texto à IA.** O prompt reserva espaço negativo nas cenas 2, 5
   e 6 justamente porque o lettering entra depois. Se o Seedance gerar `1988` ou
   `2026` com dígitos errados, regerar sem os números e inserir os dois anos
   também em pós.

3. **Densidade da Cena 5.** Sete aceleradores em 5 s está no limite. Duas saídas:
   cortar dois painéis, ou alongar a cena para 7 s (vídeo de 32 s). A segunda é
   preferível — os aceleradores são o argumento comercial mais forte.

4. **Coerência de escopo na data.** 1988 é a operação Brasil. O site também
   afirma "45+ anos Latam" (`src/data/aSistran.ts:98`), que se refere ao grupo.
   Se a peça for institucional do **grupo**, o par correto é `1980 → 2026`, não
   `1988`. Definir o escopo antes de gerar.

5. **Divergências de números já mapeadas.** `.claude/conteudo-site/_index.md:89`
   registra conflitos entre páginas (130 vs. 150 clientes, "30 anos" vs. "45+
   anos"). Este roteiro usa os valores de `src/data/metrics.ts`, que é a fonte
   canônica do projeto. Se o material for para cliente, validar com o comercial.

6. **Versão vertical.** Para LinkedIn e Instagram, regerar em 9:16 com a régua
   inferior virando bloco de texto centralizado, e reduzir a Cena 5 para quatro
   painéis — sete rótulos não cabem em vertical.
