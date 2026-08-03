# Prompt — Landing Page Sistran (Inovação)

## Objetivo
Gerar uma landing page institucional executiva para a **Sistran**, especialista em tecnologia para seguradoras desde 1988. Tom corporativo, moderno, técnico. Paleta navy/azul/violeta com glass cards, gradientes e alternância entre seções claras e escuras.

## Identidade
- **Marca:** Sistran — "Especialistas em seguros desde 1988"
- **Tagline principal:** Especialistas em tecnologia para seguradoras
- **Subheadline:** Empresas que aderem a tecnologia em seus processos estão sempre à frente no mercado.
- **Paleta:** `#0079CB` (azul principal), `#0ed8f6` (ciano), `#7c3aed` / `#a855f7` (violeta), `#004D8A` (navy), `#0a1f44` (texto escuro), `#B8DDF6` (texto claro sobre navy)
- **Stack sugerida:** Next 14 + Tailwind 3 + motion/react

## Estrutura de seções (ordem)

### 1. Header fixo
Links: Quem somos · Soluções, Serviços e Consultoria · Parceiros e Implementações · Eventos & Inovação · ESG · Trabalhe conosco · Contato

### 2. Hero (dark, sticky com scroll parallax)
- Badge: "Especialistas em seguros desde 1988"
- Headline morphing com gradiente
- CTAs: "Veja como a Sistran pode ajudar" (primário) · "Entre em contato conosco" (link)
- Carrossel lateral de pilares
- Trust ticker de clientes

### 3. Quem somos (light)
- Eyebrow: "Quem somos"
- Título: **Especialistas em tecnologia para seguradoras**
- Texto: Há mais de três décadas transformando processos, sistemas e operações de seguradoras no Brasil e exterior. Combinamos domínio profundo do negócio com tecnologia pragmática para entregar resultados mensuráveis. Da subscrição ao sinistro, do vida ao P&C, da sustentação ao delivery de novos produtos.
- Highlights: **1988** Ano de fundação · **850+** Profissionais · **3** Unidades no Brasil

### 4. Diferenciais (light, 4 cards com tilt 3D)
1. **Conhecimento em Seguros** — Domínio completo dos processos de subscrição, sinistro, resseguro e produtos em todos os ramos, do vida ao P&C.
2. **Flexibilidade** — Modelo de entrega adaptável: squads dedicadas, alocações, managed services ou projetos fechados.
3. **Tecnologia** — Aceleradores próprios, integração de plataformas de mercado e uso pragmático de cloud, IA e APIs.
4. **Solidez e permanência** — Mais de três décadas atendendo seguradoras. Estabilidade e relacionamento de longo prazo.

### 5. Resultados / Métricas (light, counter animation)
- **850+** Membros do Grupo Sistran
- **23+** Prêmios e Reconhecimentos
- **130+** Clientes
- **650+ mil** horas de Capacidade Produtiva no Brasil
- **230+** Implementações de ERPs
- **35+** Total de Seguradoras
- **25+** Implantações de Sinistro

### 6. Soluções (dark — CTA-mor)
1. **APIs, Projetos, Desenvolvimento, Sustentação e Migrações** — Produção confiável, entregas de qualidade, ótima relação custo-benefício.
2. **Serviços e Processos** — Amplo domínio de negócios e processos em Seguros em TODOS os ramos.
3. **Tipos de Serviço** — Squads/vilas, Managed Services, alocações, projetos fechados.
4. **Staff Augmentation** — A serviço do Delivery.

### 7. Prova social — Client Wall
Grade/marquee de logos de seguradoras clientes.

### 8. Faixa fina — Áreas futuras
Eventos & Inovação · ESG · Trabalhe conosco

### 9. Social
Presença digital (LinkedIn, YouTube).

### 10. Contato (light)
- Telefone: **+55 (11) 2192-4400**
- LinkedIn: https://www.linkedin.com/company/sistran/
- Unidades:
  - **São Paulo/SP** — R. Dr. Geraldo Campos Moreira, 240, Cidade Monções — +55 (11) 2192-4400
  - **Pato Branco/PR**
  - **Rio de Janeiro/RJ**

### 11. Footer + BackToTop

## Padrões visuais
- Glass cards com borda `rgba(120,201,248,0.28)` e fundo `rgba(255,255,255,0.85)` nas seções claras
- Gradientes de destaque `linear-gradient(140deg, #0079CB, #004D8A)` para cards escuros
- Blobs blur (`#0099E6/22`, `#7c3aed/16`) no hero
- Tipografia display bold/black, `font-variant-numeric: tabular-nums` em números
- Reveal on scroll (motion/react `whileInView`), stagger em grids, tilt 3D em cards, counters com `easeOutCubic`
- Respeitar `prefers-reduced-motion`
