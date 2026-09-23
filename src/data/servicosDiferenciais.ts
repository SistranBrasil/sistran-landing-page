/* SIS-268 — os quatro cards da seção **Serviços** de `/solucoes`.

   POR QUE UM ARQUIVO NOVO, E NÃO `solutions.ts`
   `SOLUTIONS` é consumido TAMBÉM pela home (`src/components/SolutionsStory.tsx`):
   editar o título ou a descrição de lá para casar com `docs/servicos.md` mudaria a
   home junto, que não é escopo desta issue. E a escrita dos quatro cards aqui é
   OUTRA — o doc dá quatro frases próprias, diferentes das da home.

   A escrita mora em `src/data/**`, então ela entra no `copy-lock`
   (`scripts/copy-lock.mjs` extrai todo literal de string sob essa pasta): é o
   travamento que a Regra Zero pede para texto de site.

   AS FOTOS SÃO `1.png`–`4.png`, E NÃO OS `.webp` DO DOC. A issue nomeia o pareamento
   («Fotos: `public/images/solucoes/1.png`…`4.png`, não os webp do doc») e diz
   explicitamente que usar os `.webp` existindo as PNG está FORA de escopo. Os quatro
   arquivos `.webp` que o doc cita não existem no repositório — medido: `public/images`
   não tem `servicos-*`. Cada `alt` descreve a foto que está no arquivo, vista uma por
   uma antes de escrever (não é o título do card repetido). */

import type { LucideIcon } from 'lucide-react';
import { Network, Workflow, Layers3, UsersRound } from 'lucide-react';

export type ServicoDiferencial = {
  id: string;
  titulo: string;
  descricao: string;
  foto: string;
  /* Descrição da FOTOGRAFIA. Card com título e descrição em texto ao lado torna a
     imagem ilustrativa, mas ela ainda carrega cena própria — então o alt conta a
     cena, sem repetir a escrita que o leitor de tela já vai ler a seguir. */
  alt: string;
  Icone: LucideIcon;
  /* O card de maior destaque do doc: borda ciano e glow discreto, «sem aumentar
     excessivamente seu tamanho» — então é só pintura, nunca `grid-column`. */
  destaque?: boolean;
};

export const SERVICOS_DIFERENCIAIS: ServicoDiferencial[] = [
  {
    id: 'apis-projetos',
    titulo: 'APIs, Projetos, Desenvolvimento, Sustentação e Migrações',
    descricao: 'Produção confiável, entregas de qualidade e ótima relação custo-benefício.',
    foto: '/images/solucoes/1.png',
    alt: 'Profissional apresentando um quadro coberto de post-its para três colegas sentados à mesa de reunião com notebooks',
    Icone: Network,
    destaque: true,
  },
  {
    id: 'servicos-processos',
    titulo: 'Serviços e Processos',
    descricao: 'Domínio de negócios e processos de seguros em todos os ramos.',
    foto: '/images/solucoes/2.png',
    alt: 'Três profissionais em volta de uma mesa de madeira coberta de fichas de papel, uma delas anotando ao lado de um notebook',
    Icone: Workflow,
  },
  {
    id: 'tipos-de-servico',
    titulo: 'Tipos de Serviço',
    descricao: 'Squads, vilas, Managed Services, alocações e projetos fechados.',
    foto: '/images/solucoes/3.png',
    alt: 'Profissional mais experiente apontando para um monitor enquanto dois colegas acompanham, em escritório aberto',
    Icone: Layers3,
  },
  {
    id: 'staff-augmentation',
    titulo: 'Staff Augmentation',
    descricao: 'Especialistas integrados ao seu delivery.',
    foto: '/images/solucoes/4.png',
    alt: 'Dupla de profissionais diante de um monitor com um diagrama de fluxo, um deles apontando para a tela',
    Icone: UsersRound,
  },
];
