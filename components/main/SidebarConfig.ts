import { HomeIcon, UsersIcon, FolderIcon, CalendarIcon, DocumentDuplicateIcon, ChartPieIcon, BookOpenIcon } from '@heroicons/react/24/outline';

export const navigation = [
    { name: 'Example', href: 'form', icon: BookOpenIcon, current: false },
    { name: 'Dashboard', href: '#', icon: HomeIcon, current: true },
    { name: 'Team', href: '#', icon: UsersIcon, current: false },
    { name: 'Projects', href: '#', icon: FolderIcon, current: false },
    { name: 'Calendar', href: '#', icon: CalendarIcon, current: false },
    { name: 'Documents', href: '#', icon: DocumentDuplicateIcon, current: false },
    { name: 'Reports', href: '#', icon: ChartPieIcon, current: false },
];

export const teams = [
    { id: 1, name: 'Product Team', href: '#', initial: 'PT', current: false },
    { id: 2, name: 'Dev Team', href: '#', initial: 'DT', current: false },
];

export const logoUrl = "https://www.mbmb.gov.my//images/2023/08/08/logo.jpg";
