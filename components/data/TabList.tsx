import { Tab } from '../forms/Tab';

// Static fallback (no stale "0")
export const businessTabs: Tab[] = [
  { name: 'Home', href: '#' },
  { name: 'Registration', href: '#' },
  { name: 'Application', href: '#', badge: '5', badgeColor: 'blue' },
  { name: 'Team', href: '#' },
  { name: 'Billing', href: '#' }, // no hardcoded 0
];

export const vendorsTabs: Tab[] = [
  { name: 'Home', href: '#' },
  { name: 'Registration', href: '#' },
    { name: 'Team', href: '#' },
  { name: 'Project List', href: '#', badge: '5', badgeColor: 'blue' },
  { name: 'Payments Status', href: '#' }, // no hardcoded 0
];

export const myskbTabs: Tab[] = [
  { name: 'Home', href: '#' },
  { name: 'Registration', href: '#' },
  { name: 'Ownership', href: '#' },
  { name: 'Project', href: '#' },
  { name: 'Application', href: '#' },
];