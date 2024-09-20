import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems = [
  { key: 'overview', title: 'Календарь', href: paths.dashboard.overview, icon: 'calendar' },
  { key: 'customers', title: 'Мои события', href: paths.dashboard.customers, icon: 'users' },
  { key: 'settings', title: 'Настройки', href: paths.dashboard.settings, icon: 'gear-six' },
  { key: 'account', title: 'Аккаунт', href: paths.dashboard.account, icon: 'user' },
] satisfies NavItemConfig[];
