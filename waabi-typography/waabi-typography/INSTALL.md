# Instalação e uso

## Claude Code — instalar apenas no projeto

1. Baixe e extraia o ZIP.
2. Copie a pasta inteira `waabi-typography` para:

```text
SEU-PROJETO/.claude/skills/waabi-typography/
```

3. Confirme que este arquivo existe:

```text
SEU-PROJETO/.claude/skills/waabi-typography/SKILL.md
```

4. Dentro do Claude Code, execute:

```text
/waabi-typography
```

O Claude também poderá selecionar a skill automaticamente quando o pedido mencionar a tipografia do Waabi, instalação dessas fontes ou a criação de uma hierarquia editorial semelhante.

## Claude Code — instalar para todos os projetos

Copie a pasta para:

```text
~/.claude/skills/waabi-typography/
```

Skills pessoais ficam disponíveis em todos os projetos. Se a pasta superior `~/.claude/skills/` for criada durante uma sessão já aberta e a skill não aparecer, reinicie o Claude Code.

## Usar sem instalar a skill

Abra o arquivo:

```text
references/claude-code-prompt.md
```

Copie o prompt e cole diretamente no Claude Code dentro do projeto que será alterado.

## Fontes exatas

O ZIP não contém arquivos de fonte proprietários. Para obter o resultado exato, compre a licença web e baixe os arquivos nos sites oficiais:

- F37 Zagma: https://f37.com/buying-options/f37-zagma
- F37 trial para avaliação: https://f37.com/account/trial-downloads
- Licenças F37: https://f37.com/information
- Neue Haas Grotesk: https://commercialtype.com/catalog/neue_haas_grotesk

Depois, coloque os `.woff2` legalmente fornecidos no projeto. A skill detectará o framework e configurará CSS, `next/font/local` ou Tailwind conforme o caso.

## Alternativa gratuita recomendada

Se você não comprar as fontes comerciais, a skill utilizará:

- Instrument Serif 400 para títulos: https://fonts.google.com/specimen/Instrument+Serif
- Inter 400 e 500 para corpo e interface: https://fonts.google.com/specimen/Inter

Essa dupla conserva o contraste editorial do Waabi, mas não é idêntica às fontes comerciais.
