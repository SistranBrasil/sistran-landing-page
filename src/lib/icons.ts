import {
  Shield,
  Zap,
  Cpu,
  Building2,
  Users,
  Award,
  Briefcase,
  Clock,
  Layers,
  Boxes,
  Code2,
  Cog,
  Workflow,
  UserPlus,
  Handshake,
  Calendar,
  Leaf,
  HeartHandshake,
  Sparkles,
  ArrowRight,
  Menu,
  X,
  Linkedin,
  Youtube,
  Phone,
  MapPin,
  Check,
  ShieldCheck,
  /* SIS-204 — os dois ícones que `docs/consultoria.md` nomeia para as frentes de
     Consultoria e que não estavam no registro: `UsersRound` (bancassurance) e
     `BriefcaseBusiness` (estudos econômicos). `Cog` e `ShieldCheck`, os outros dois
     da lista do documento, já estavam aqui. */
  UsersRound,
  BriefcaseBusiness,
  /* 23/09 — os três que os Diferenciais de `/quem-somos` pedem e que não estavam
     aqui: `Globe` (atendimento de nível global), `PieChart` (a fatia de 1/3 dos
     prêmios) e `FileCheck2` (regulação da Susep conferida). Os outros três da
     seção — `ShieldCheck`, `Building2` e `Workflow` — já existiam. Entram pelo
     mesmo caminho que a SIS-204 abriu: registro ampliado, nada importado solto
     no componente, para o `IconName` continuar sendo a lista fechada do site. */
  Globe,
  PieChart,
  FileCheck2,
  /* SIS-260 — os três selos do painel de «Nossa Essência». A bússola é a ÚNICA
     que a mock `public/ms.png` mostra (canto superior esquerdo do painel da
     Missão); `Gem` e `Columns3` são escolha desta implementação, porque a mock
     só desenhou o estado Missão e os outros dois estados têm o mesmo selo na
     mesma posição. Não substituem as artes entregues — o selo é um glifo de
     11px ao lado do título, e o visual grande da direita continua sendo
     `missao/valores/pilares.webp`, como o doc exige. */
  Compass,
  Gem,
  Columns3,
  /* Os três selos que «Como Agimos» (`/quem-somos`) pede e que não estavam aqui.
     Os outros cinco valores são atendidos pelo registro como ele já estava
     (`HeartHandshake`, `Boxes`, `Sparkles`, `Handshake`, `BriefcaseBusiness`).
     `Scale` (balança) para Ética, `Eye` para Transparência e `BadgeCheck` para
     Qualidade — nenhum deles repete glifo já em uso NESTA página, que é o critério
     que decidiu a escolha: os Diferenciais, seis seções acima, já gastam
     `ShieldCheck`, `Globe`, `Building2`, `PieChart`, `FileCheck2` e `Workflow`, e
     repetir um deles faria duas listas diferentes parecerem a mesma lista. */
  Scale,
  Eye,
  BadgeCheck,
  /* SIS-277 — `Network`, o único dos oito selos que `docs/comagimos.md` §5 nomeia e
     que faltava aqui. Ele substitui `Boxes` em «Integração»: `Boxes` é caixas
     empilhadas (estoque), e o documento pede «pessoas ou nós conectados» para esse
     valor — nó conectado é exatamente o glifo de `Network`, e é o que o mock
     `public/imagensexemplo/exemplocomoagimos.png` desenha ali (três figuras ligadas,
     não caixas). Entra pelo caminho de sempre: registro ampliado, nada importado
     solto no componente, `IconName` segue sendo a lista fechada do site. Nenhuma
     dependência nova — `lucide-react` já é a biblioteca do projeto, que é o que o
     documento manda reutilizar. `Boxes` FICA no registro: tem outros consumidores. */
  Network,
  type LucideIcon,
} from 'lucide-react';

export const ICONS = {
  Shield,
  Zap,
  Cpu,
  Building2,
  Users,
  Award,
  Briefcase,
  Clock,
  Layers,
  Boxes,
  Code2,
  Cog,
  Workflow,
  UserPlus,
  Handshake,
  Calendar,
  Leaf,
  HeartHandshake,
  Sparkles,
  ArrowRight,
  Menu,
  X,
  Linkedin,
  Youtube,
  Phone,
  MapPin,
  Check,
  ShieldCheck,
  UsersRound,
  BriefcaseBusiness,
  Globe,
  PieChart,
  FileCheck2,
  Compass,
  Gem,
  Columns3,
  Scale,
  Eye,
  BadgeCheck,
  Network,
} as const satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof ICONS;

export function getIcon(name: IconName): LucideIcon {
  return ICONS[name];
}
