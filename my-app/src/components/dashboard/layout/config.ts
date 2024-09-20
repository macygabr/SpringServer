import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems = [
  { key: 'overview', title: 'Календарь', href: paths.dashboard.overview, icon: 'chart-pie' },
  { key: 'customers', title: 'Мои события', href: paths.dashboard.customers, icon: 'users' },
  // { key: 'integrations', title: 'Мои события', href: paths.dashboard.integrations, icon: 'plugs-connected' },
  { key: 'settings', title: 'Настройки', href: paths.dashboard.settings, icon: 'gear-six' },
  { key: 'account', title: 'Аккаунт', href: paths.dashboard.account, icon: 'user' },
  // { key: 'error', title: 'Error', href: paths.errors.notFound, icon: 'x-square' },
] satisfies NavItemConfig[];
