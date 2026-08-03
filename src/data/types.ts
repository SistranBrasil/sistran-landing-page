import type { IconName } from '@/lib/icons';

export type NavItem = { label: string; href: string };
export type Differential = { id: string; title: string; icon: IconName; color: string; description?: string };
export type Metric = { id: string; value: number; suffix: string; label: string };
export type Solution = { id: string; title: string; description: string; icon: IconName; color: string };
export type FutureArea = { id: string; title: string; icon: IconName };
export type Unit = { id: string; city: string; state: string; address?: string; phone?: string };
