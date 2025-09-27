import { Dialog, DialogBackdrop, DialogPanel, TransitionChild } from '@headlessui/react';
import { Bars3Icon, BriefcaseIcon, UserIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useState, useEffect, ReactNode } from 'react';

import { BuildingOfficeIcon, HomeIcon, UsersIcon, FolderIcon, CalendarIcon, DocumentDuplicateIcon, ChartPieIcon, BookOpenIcon, KeyIcon, ArrowRightOnRectangleIcon, CogIcon, ReceiptPercentIcon, BriefcaseIcon as BizBriefcaseIcon, BuildingStorefrontIcon, RectangleStackIcon, BellIcon } from '@heroicons/react/24/outline';
import { ArrowRightCircleIcon } from '@heroicons/react/24/solid';

export const superAdminNavigation = [
  { name: 'Login', href: '/', icon: KeyIcon, current: true },
  { name: 'Form', href: 'form', icon: BookOpenIcon, current: false },
  { name: 'Team', href: '#', icon: UsersIcon, current: false },
  { name: 'Projects', href: '#', icon: FolderIcon, current: false },
  { name: 'Calendar', href: '#', icon: CalendarIcon, current: false },
  { name: 'Documents', href: '#', icon: DocumentDuplicateIcon, current: false },
  { name: 'Reports', href: 'report', icon: ChartPieIcon, current: false },
];

export const accountNavigation = [
  { name: 'Dashboard', href: '/account/dashboard', icon: HomeIcon, current: false },
  { name: 'Profile', href: '/profile', icon: UsersIcon, current: false },
];

export const adminNavigation = [
  { name: 'Admin Panel', href: '/admin/dashboard', icon: ChartPieIcon, current: false },
  { name: 'Verifications', href: '/admin/verifications', icon: DocumentDuplicateIcon, current: false },
  { name: 'MBMB API', href: '/admin/vendors', icon: KeyIcon, current: false },
  { name: 'User Management', href: '/admin/users', icon: UsersIcon, current: false },
  { name: 'Reports', href: '/admin/reports', icon: DocumentDuplicateIcon, current: false },
  { name: 'Push Test', href: '/admin/push-test', icon: BellIcon, current: false },
];

export const userNavigation = [
  { nameKey: 'sidebar.profile', href: '/profile', icon: UsersIcon, current: true },
  { nameKey: 'sidebar.settings', href: '/account/settings', icon: CogIcon, current: false },
  { nameKey: 'sidebar.signOut', href: '/logout', icon: ArrowRightCircleIcon, current: false },
];

export const developerNavigation = [
  { name: 'Form', href: 'form', icon: BookOpenIcon, current: false },
  { name: 'Your Profile', href: '/developer/profile', icon: UsersIcon, current: true },
  { name: 'Settings', href: '/developer/settings', icon: CogIcon, current: false },
];

export const teams = [
  { id: 1, name: 'Company', href: '#', initial: 'Com', current: false },
  { id: 2, name: 'Organization', href: '#', initial: 'Org', current: false },
  { id: 3, name: 'Consultant', href: '#', initial: 'Cnt', current: false },
  { id: 4, name: 'Developer', href: '#', initial: 'Dev', current: false },
];

export const generalAppNavigation = [
  { nameKey: 'sidebar.assessmentTax', href: '/assessment-tax', icon: HomeIcon, current: false },
  { nameKey: 'sidebar.compound', href: '/compound', icon: ReceiptPercentIcon, current: false },
  { nameKey: 'sidebar.boothRental', href: '/booth-rental', icon: BuildingStorefrontIcon, current: false },
  { nameKey: 'sidebar.miscBills', href: '/misc-bills', icon: RectangleStackIcon, current: false },
];

export const businessAppNavigation = [
  { name: 'My SKB', href: '/myskb', icon: BuildingOfficeIcon, current: false },
];

export const businessEnrollmentNavigation = [
  { name: 'Business Registration', href: '/business', icon: BizBriefcaseIcon, current: true },
];

export const logoUrl = "/images/logo.png";
