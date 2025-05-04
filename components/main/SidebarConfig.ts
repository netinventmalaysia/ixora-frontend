import { HomeIcon, UsersIcon, FolderIcon, CalendarIcon, DocumentDuplicateIcon, ChartPieIcon, BookOpenIcon, KeyIcon } from '@heroicons/react/24/outline';

export const navigation = [
    { name: 'Form', href: 'form', icon: BookOpenIcon, current: false },
    { name: 'Login', href: 'login', icon: KeyIcon, current: true },
    { name: 'Team', href: '#', icon: UsersIcon, current: false },
    { name: 'Projects', href: '#', icon: FolderIcon, current: false },
    { name: 'Calendar', href: '#', icon: CalendarIcon, current: false },
    { name: 'Documents', href: '#', icon: DocumentDuplicateIcon, current: false },
    { name: 'Reports', href: 'report', icon: ChartPieIcon, current: false },
];

export const teams = [
    { id: 1, name: 'Product Team', href: '#', initial: 'PT', current: false },
    { id: 2, name: 'Dev Team', href: '#', initial: 'DT', current: false },
];

export const logoUrl = "https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500";
