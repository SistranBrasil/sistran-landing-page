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
} as const satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof ICONS;

export function getIcon(name: IconName): LucideIcon {
  return ICONS[name];
}
