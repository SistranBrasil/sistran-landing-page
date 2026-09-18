# SIS-89 — Tornar mais fluida a transição de “Staff Augmentation” para a seção dos números

- Arquivo Linear (lote F), somente leitura
- Data de exportação: 2026-09-15T20:51:00.000Z
- URL: https://linear.app/sistran-labs/issue/SIS-89/tornar-mais-fluida-a-transicao-de-staff-augmentation-para-a-secao-dos

## Metadados

- id: SIS-89
- uuid: 59ebec63-8269-4af2-9650-e62cdd93a678
- title: Tornar mais fluida a transição de “Staff Augmentation” para a seção dos números
- priority.value: 0
- priority.name: No priority
- gitBranchName: meduardamcp/sis-89-tornar-mais-fluida-a-transicao-de-staff-augmentation-para-a
- createdAt: 2026-09-01T12:52:21.001Z
- updatedAt: 2026-09-15T20:33:33.760Z
- archivedAt: null
- completedAt: null
- startedAt: 2026-09-01T21:15:12.173Z
- canceledAt: null
- dueDate: null
- slaStartedAt: null
- slaMediumRiskAt: null
- slaHighRiskAt: null
- slaBreachesAt: null
- status: Entregue
- statusType: started
- labels: []
- createdBy: Maria Eduarda M Camargo
- createdById: d540a312-a721-479d-9da4-3b86ed7868ba
- assignee: (ausente na resposta get_issue)
- assigneeId: (ausente na resposta get_issue)
- project: (ausente na resposta get_issue)
- projectId: (ausente na resposta get_issue)
- team: Sistran Labs
- teamId: b98f204c-dea3-41e6-99c3-c0347bfb0454

## Descrição

## Problema

A passagem da seção **Staff Augmentation** (trilha horizontal com os 4 ícones, "A serviço do Delivery.") para a seção de números (**"Escala que transforma o mercado de seguros."**) está abrupta/travada.

## O que fazer

* Suavizar o encadeamento: a saída da trilha e a entrada do bloco de números devem se sobrepor, sem pausa nem salto.
* Revisar o `end` da seção Staff Augmentation vs. o `start` da seção de números — provável gap ou disputa entre os dois triggers.
* Se houver pin, conferir `pinSpacing` e se o scroll consumido é maior que o necessário (sensação de "seção presa").
* Levar um elemento de continuidade entre as seções (a linha/trilha, o último ícone ativo ou a moldura) em vez de cortar seco.
* `anticipatePin: 1` para evitar flicker no início do pin, se aplicável.
* Easing consistente com o resto da página (em scrub, usar `ease: none`).

## Relacionado

* <issue id="d51d386d-64f2-4e8a-b2d1-c8a825ba584e" href="https://linear.app/sistran-labs/issue/SIS-85/metricas-corrigir-alinhamento-e-transicao-entre-os-numeros-deslocados">SIS-85</issue> (alinhamento e ritmo dos números)

## Critérios de aceite

- [ ] Transição contínua, sem salto ou pausa entre as duas seções
- [ ] Sem flicker no início/fim do pin
- [ ] Sem trecho de scroll "morto" entre elas
- [ ] Fluida em desktop e notebook; aceitável em mobile
- [ ] Com reduced-motion, as duas seções continuam legíveis e alcançáveis

## Relações

- blocks: []
- blockedBy: []
- relatedTo:
  - SIS-85 — Métricas: corrigir alinhamento e transição entre os números (deslocados à direita)
  - SIS-101 — Faixa de logos: remover a linha azul e os cantos soltos, e integrá-la ao rodapé da seção “Escala que transforma o mercado de seguros.”
- duplicateOf: null

## Anexos (issue)

[]

## Documents

[]

## Releases

[]

## Customer needs

[]

## Histórico de status

1. Backlog (type=backlog, id=bc5681b9-61b8-47a5-b698-88ac72996d2e) startedAt=2026-09-01T12:52:21.001Z endedAt=2026-09-01T21:15:12.190Z
2. In Progress (type=started, id=5f40aa5d-3589-452e-8bff-8f2539a4fd24) startedAt=2026-09-01T21:15:12.190Z endedAt=2026-09-01T21:23:10.009Z
3. Done (type=completed, id=95119256-352d-4f0c-b5ae-695c7d838974) startedAt=2026-09-01T21:23:10.009Z endedAt=2026-09-15T20:33:33.751Z
4. Entregue (type=started, id=dbb9dfbe-2cc4-423a-862f-94ca7705f813) startedAt=2026-09-15T20:33:33.751Z endedAt=null

## Comentários (ordem createdAt; list_comments limit=250; hasNextPage=false)

### Comentário 1 — 2026-09-01T21:23:05.377Z

- id: db1ccddf-e6c4-4393-b6ad-7c42af520c51
- createdAt: 2026-09-01T21:23:05.377Z
- updatedAt: 2026-09-01T21:23:05.358Z
- parentId: null
- resolvedAt: null
- quotedText: null
- author.id: d540a312-a721-479d-9da4-3b86ed7868ba
- author.name: Maria Eduarda M Camargo
- onBehalfOf: null
- attachments: []

#### Corpo (texto integral)

Implementado. A causa era geométrica, não calibragem de easing.

**Diagnóstico (medido em 1440×900, produção)**

As duas seções são capítulos da mesma `ProofJourney`, que mede a faixa de rolagem de cada um como `top top` → `bottom bottom`:

- Soluções: **3888 → 5724**
- Números: começa em **6624**

Sobram **900px — uma janela inteira — entre 5724 e 6624**. Um `sticky` solta quando o rodapé da seção encosta na base da janela, ou seja uma tela antes de a próxima começar. Nesse trecho `--sol-p` estava cravado em `1` e `--impact-p` em `0`: a saída de Soluções já tinha acabado e a entrada de Números só começava quando o palco dela prendia. Era o "scroll morto" do critério de aceite — e as duas seções estão na tela ao mesmo tempo justamente ali, com o quadro de Soluções já esvaziado subindo e o navy de Números chegando **vazio** (título fora do recorte, grade apagada).

**Correção**

1. `ProofJourney` passou a medir, além da faixa presa, a fração da **aproximação** de cada capítulo, publicada como `--pj-chegada-<capítulo>` e entregue ao capítulo no segundo argumento de `aplicar`. Vale 1 durante todo o percurso preso, então quem não se interessa ignora.
2. A aproximação começa **dentro** da saída do capítulo anterior: `SOBREPOSICAO = 0.35` de janela (315px a 900px de altura), cerca dos dois últimos terços da janela de `--sol-saida` (~54vh). Sem isso saída e entrada ficariam apenas adjacentes — a máscara de "Soluções de Negócios" terminaria no mesmo pixel em que "Escala que transforma…" começasse a subir; o pedido era que se sobrepusessem.
3. `Metrics`: `--impact-entrada` passou a vir da chegada, não de `p / ENTRADA_FIM`. A seção agora se monta **enquanto chega**, e prende já entrada.

Nenhum gatilho novo, nenhum `pin`, nenhuma altura alterada. `ease: none` continua implícito (tudo é função da posição de rolagem, não de tempo), então o scroll reverso é simétrico por construção.

**Verificação — varredura da emenda, 100px por amostra**

| y | `--sol-p` | `--pj-chegada-metrics` | `--impact-entrada` |
|---|---|---|---|
| 5330 | 0.785 | 0 | 0 |
| 5432 | 0.841 | 0.019 | 0.019 |
| 5721 | 0.998 | 0.257 | 0.257 |
| 6027 | 1.000 | 0.509 | 0.509 |
| 6333 | 1.000 | 0.761 | 0.761 |
| 6622 | 1.000 | 0.998 | 0.998 |
| 6724 | 1.000 | 1.000 (`--impact-p` 0.046) | 1 |

Não há mais nenhum y entre 5212 e 6826 em que as duas frações estejam saturadas ao mesmo tempo: o trecho morto de 900px desapareceu. Screenshots do meio da emenda em 1440×900 e 1366×768 mostram "Escala que transforma o mercado de seguros." em meio-desvelamento por máscara **enquanto** "Staff Augmentation" ainda sai — o movimento único pedido.

Sem `pin` envolvido em nenhuma das duas seções (é `sticky`, por causa do Lenis), então não há flicker de pin nem `pinSpacing` a conferir.

**Movimento reduzido e mobile**: `data-dirigindo` ausente, `--impact-entrada` e `--pj-chegada-metrics` não definidas, `.impact-titulo` com `opacity: 1`, `clip-path: none`, `transform: none`. As duas seções continuam legíveis e alcançáveis, no fluxo.

`tsc --noEmit` limpo, `npm run lint` no baseline (25 warnings / 0 errors), `npm run build` ok.

Arquivos: `src/components/ProofJourney.tsx`, `src/components/Metrics.tsx`.

## Lacunas

- assignee/project ausentes na resposta get_issue.
- Anexos, documents, releases e customer needs vazios.
- list_comments: 1 comentário; hasNextPage=false.
- Nenhum arquivo/imagem de Linear para baixar.
- Linear não foi alterado.
