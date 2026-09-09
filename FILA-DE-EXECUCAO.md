# Fila de execução — SIS

Ordem em que as issues devem ser feitas. **Eu consulto este arquivo ao terminar cada
conferência** e passo a próxima ao agente implementador, sem esperar novo pedido seu.

- Só você reordena. Se eu achar que a ordem está errada, eu argumento aqui e espero.
- Quando uma issue é aprovada (`conferido`, In Review), ela **sai** desta lista — a mesma regra
  do `DECISOES-PENDENTES.md`. O histórico fica nos comentários das issues.
- Issue que depende de conteúdo seu não entra na fila: fica no `DECISOES-PENDENTES.md` até a
  informação chegar.

Última atualização: 08/09/2026.

---

## Agora

| # | Issue | O que é | Estado |
|---|---|---|---|
| 1 | **SIS-179** | Grade de marcas: sobe para depois do hero, título centrado, malha aberta | **em implementação** |

A **SIS-178 saiu da fila: aprovada e conferida** (`conferido`, In Review). O hero está com o claro
`#f4f8fc`, o logo inteiro nos vinte casos medidos (folga mínima de 50,2px contra piso de 16) e o
vídeo all-intra. Duas consequências do desenho novo foram para o item **3c** do
`DECISOES-PENDENTES.md`, e uma delas aparece na home agora: a emenda entre o claro do hero e o
branco da seção seguinte.

## Depois, nesta ordem

| # | Issue | O que é | Por que aqui |
|---|---|---|---|
| 2 | **SIS-176** | "Sistran em números": fundo de imagem no palco, divisórias entre os sete, trilho de nós que acende na rolagem | Estava fora da lista por descuido meu — foi aberta às 20:07, antes de eu montar a fila. Entra aqui porque monta em `src/app/page.tsx:142`, o mesmo arquivo da SIS-179. **Liberada.** O comentário `7a95c6af` apontou dois defeitos (o item 1 não produzia resultado visível — a foto entraria por baixo de cor chapada opaca — e todas as linhas de `globals.css` deslocadas em +200) e o autor corrigiu, inclusive a regra base da grade: são **quatro** faixas (1 / 2 / 4 / 7 colunas), e a borda tem de ser **redevolvida** ao subir de faixa, senão a fileira de 7 fica sem divisória nenhuma |
| 3 | **SIS-174** | Piso de tamanho de texto: subir os 30 pontos abaixo de 11px | A SIS-178 já cita este piso como restrição. Fazer depois evita remedir o hero duas vezes. **Cuidado herdado da SIS-180 (aprovada):** o token `text-palco` em `tailwind.config.ts:96` é exceção deliberada e não pode ser "consertado" de volta para `text-section` numa varredura |
| 4 | **SIS-175** | O `copy-lock` trava `as React.CSSProperties` como se fosse cópia do site | Ferramenta de portão: consertar cedo poupa ruído em toda issue seguinte |
| 5 | **SIS-173** | O `pareceCodigo()` descartando cinco frases publicadas de verdade | Mesma ferramenta da 175; fazer as duas em sequência |
| 6 | **SIS-155** | Trocar o sistema tipográfico pelo par Geist Sans / Geist | **Última e isolada, ratificado por você.** Ela muda a largura de todo texto do site e reabre limiares medidos em pixel — ver item 6 do `DECISOES-PENDENTES.md` |

## Fora da fila, à espera de você

Estão no `DECISOES-PENDENTES.md`, não aqui: SIS-131 (três URLs de vídeo), SIS-123 (texto
jurídico), SIS-124 (PDF do MTE), SIS-154 (`images: unoptimized`, decisão de deploy), SIS-125
(índice de varredura).

## A abrir como issue, quando você mandar

Item 4 e 5 do `DECISOES-PENDENTES.md`: a varredura de `matchMedia` dentro de `useEffect` em oito
componentes, a auditoria dos dois interruptores de movimento, a rolagem lateral de 7px em `/esg`
no celular, e os caminhos SP/PR fechados da cena de escritórios.
