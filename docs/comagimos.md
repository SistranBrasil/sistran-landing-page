Quero que você altere diretamente a seção **“Como Agimos”** da página `/quem-somos`, seguindo rigorosamente as orientações abaixo.

## Objetivo

Redesenhar completamente a apresentação dos valores da empresa, deixando a seção mais moderna, organizada e visualmente relevante.

A estrutura atual se parece com uma tabela contínua, possui numeração de `01` a `08` e não dá destaque suficiente aos valores. A nova versão deve eliminar essa aparência e transformar cada valor em um card independente.

## Alterações obrigatórias

### 1. Remover as numerações

Remova completamente os números:

- 01
- 02
- 03
- 04
- 05
- 06
- 07
- 08

Não deixe espaços vazios ou elementos decorativos que pareçam numeração.

### 2. Preservar o conteúdo

Mantenha exatamente estes textos:

- Ética
- Transparência
- Valorização Humana
- Integração
- Inovação
- Qualidade
- Comprometimento
- Profissionalismo

Na área editorial, mantenha:

**COMO AGIMOS**

**Nossos valores são a base da nossa cultura organizacional.**

**Respeitando as individualidades, prezamos pela:**

Não altere a redação nem a ortografia.

### 3. Nova estrutura dos cards

Substitua a tabela atual por oito cards independentes.

No desktop:

- Organizar em duas colunas e quatro linhas.
- Manter espaçamento visível entre os cards.
- Os cards não podem parecer células de uma tabela.
- Usar cards maiores, com boa área interna e bastante respiro.
- Todos devem possuir o mesmo tamanho e alinhamento.

Estrutura interna de cada card:

- Ícone à esquerda.
- Nome do valor à direita.
- Ícone dentro de um círculo ou badge translúcido.
- Título centralizado verticalmente.
- Padding confortável.
- Nenhum texto descritivo adicional.
- Nenhuma seta ou botão.

### 4. Aparência dos cards

Utilize um azul mais claro que o fundo principal, com transparência moderada.

Referência visual:

```css
background: linear-gradient(
  135deg,
  rgba(29, 133, 195, 0.42),
  rgba(13, 87, 151, 0.28)
);

border: 1px solid rgba(78, 221, 255, 0.55);
border-radius: 20px;

box-shadow:
  inset 0 1px 0 rgba(255, 255, 255, 0.12),
  0 18px 40px rgba(0, 35, 79, 0.18);
```

Aplique `backdrop-filter` apenas se já houver suporte e uso desse recurso no projeto.

Os cards devem ter contraste suficiente em relação ao fundo, mas sem parecerem luminosos demais.

Não utilizar roxo.

### 5. Ícones

Utilize ícones lineares, modernos e coerentes entre si.

Sugestão de associação:

- Ética: balança
- Transparência: olho
- Valorização Humana: coração com pessoa ou mãos
- Integração: pessoas ou nós conectados
- Inovação: brilho ou faísca
- Qualidade: selo com check
- Comprometimento: aperto de mãos
- Profissionalismo: pasta executiva

Use a biblioteca de ícones já instalada no projeto. Se houver Lucide React, utilize:

- `Scale`
- `Eye`
- `HeartHandshake`
- `Network`
- `Sparkles`
- `BadgeCheck`
- `Handshake`
- `BriefcaseBusiness`

Não instale outra biblioteca sem necessidade.

Características visuais dos ícones:

- Traço consistente.
- Cor branca ou ciano-claro.
- Tamanho aproximado entre `28px` e `32px`.
- Container entre `58px` e `64px`.
- Borda circular em ciano com baixa opacidade.
- Sem emojis.
- Sem ícones preenchidos de estilos diferentes.

### 6. Composição da seção

No desktop, utilize uma estrutura aproximada de:

```css
grid-template-columns: minmax(320px, 0.8fr) minmax(620px, 1.35fr);
gap: clamp(64px, 7vw, 120px);
```

A coluna esquerda deve conter:

1. Carimbo “Como Agimos”.
2. Frase manuscrita em destaque.
3. Pequeno traço ciano abaixo da frase.
4. Texto de apoio.

A coluna direita deve conter os oito cards.

A frase manuscrita deve continuar sendo o principal elemento editorial da coluna esquerda, mas não pode competir visualmente com os cards.

Utilize a fonte manuscrita já configurada no projeto. Não adicione uma nova fonte se já existir uma equivalente.

### 7. Fundo da seção

Mantenha o fundo azul-escuro institucional.

Pode ser utilizado um degradê discreto:

```css
background:
  radial-gradient(
    circle at 22% 18%,
    rgba(0, 174, 239, 0.12),
    transparent 35%
  ),
  linear-gradient(
    135deg,
    #062d5a 0%,
    #07578f 48%,
    #063d73 100%
  );
```

Adicione somente detalhes técnicos muito sutis:

- Linhas finas.
- Grid com baixa opacidade.
- Um ou dois arcos grandes parcialmente visíveis.
- Pequenos pontos decorativos.

Esses elementos devem permanecer no fundo e nunca prejudicar a leitura.

Não utilizar fotografias ou ilustrações nessa seção.

### 8. Interações

No hover de cada card:

```css
transform: translateY(-4px);
border-color: rgba(79, 224, 255, 0.9);
box-shadow:
  inset 0 1px 0 rgba(255, 255, 255, 0.16),
  0 22px 46px rgba(0, 35, 79, 0.28);
```

O ícone pode receber uma pequena mudança de escala:

```css
transform: scale(1.06);
```

Use transição suave entre `250ms` e `350ms`.

Não aplique rotação, efeito exagerado de neon ou animação contínua.

### 9. Entrada durante o scroll

Os cards podem aparecer progressivamente quando a seção entrar na tela:

- Opacidade de `0` para `1`.
- Movimento vertical máximo de `20px`.
- Pequeno stagger entre os cards.
- Duração entre `450ms` e `600ms`.
- A animação deve acontecer somente na entrada da seção.
- Não bloquear ou controlar o scroll.
- Respeitar `prefers-reduced-motion`.

Reutilize o componente de reveal ou biblioteca de animação já existente no projeto.

### 10. Responsividade

Desktop:

- Duas colunas na seção.
- Grid de cards com duas colunas.

Tablet:

- Coluna editorial acima.
- Cards abaixo em duas colunas.

Mobile:

- Uma única coluna.
- Carimbo e frase centralizados ou alinhados à esquerda conforme o padrão existente.
- Um card por linha.
- Ícones entre `48px` e `54px`.
- Cards com altura automática.
- Texto sem cortes.
- Sem scroll horizontal.
- Espaçamento lateral mínimo de `20px`.

### 11. Acessibilidade

- Garantir contraste adequado.
- Ícones decorativos devem usar `aria-hidden="true"`.
- Utilizar elementos semânticos.
- Manter foco visível caso algum card futuramente se torne interativo.
- Não transformar os cards em botões ou links se não houver ação.
- Respeitar redução de movimento do sistema.

## Restrições

- Não alterar o header.
- Não alterar outras seções da página.
- Não mudar os textos.
- Não utilizar numeração.
- Não criar carrossel.
- Não criar paginação.
- Não adicionar setas.
- Não adicionar imagens.
- Não utilizar roxo.
- Não usar neon excessivo.
- Não deixar os cards unidos como uma tabela.
- Não adicionar dependências desnecessárias.

## Resultado esperado

A seção deve comunicar que os valores são importantes e individuais.

Os oito cards devem ser o principal foco visual, com maior contraste, ícones maiores e uma composição organizada. O resultado precisa continuar integrado ao design institucional azul da página `/quem-somos`, mas com aparência mais moderna e premium.

Implemente diretamente no código existente, reutilizando os componentes, tokens, fontes e animações já disponíveis no projeto.

Ao finalizar:

1. Informe quais arquivos foram alterados.
2. Explique resumidamente a nova estrutura.
3. Confirme que todas as numerações foram removidas.
4. Confirme o comportamento responsivo.
5. Execute o lint e o build do projeto.
6. Corrija qualquer erro provocado pela alteração antes de concluir.