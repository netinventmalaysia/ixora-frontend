import React from 'react';
import { ChevronDownIcon } from '@heroicons/react/16/solid';
import Badge, { BadgeProps } from '@/components/forms/Badge';

export interface Tab {
  name: string;
  href: string;
  badge?: string;
  badgeColor?: BadgeProps['color'];
}

export interface TabsProps {
  tabs: Tab[];
  currentTab: string;
  onTabChange: (tab: Tab) => void;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const Tabs: React.FC<TabsProps> = ({ tabs, currentTab, onTabChange }) => {
  return (
    <div>
      {/* Mobile: select dropdown */}
      <div className="grid grid-cols-1 sm:hidden">
        <select
          aria-label="Select a tab"
          value={currentTab}
          onChange={(e) => {
            const selected = tabs.find((t) => t.name === e.target.value);
            if (selected) onTabChange(selected);
          }}
          className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-2 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
        >
          {tabs.map((tab) => (
            <option key={tab.name} value={tab.name}>
              {tab.badge ? `${tab.name} (${tab.badge})` : tab.name}
            </option>
          ))}
        </select>
        <ChevronDownIcon
          aria-hidden="true"
          className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end fill-gray-500"
        />
      </div>

      {/* Desktop: horizontal full-width tabs */}
      <div className="hidden sm:block">
        <div className="border-b border-gray-200">
          <nav aria-label="Tabs" className="-mb-px flex">
            {tabs.map((tab) => {
              const isActive = tab.name === currentTab;
              return (
                <a
                  key={tab.name}
                  href={tab.href}
                  onClick={(e) => {
                    e.preventDefault();
                    onTabChange(tab); // ✅ Full tab object passed
                  }}
                  aria-current={isActive ? 'page' : undefined}
                  className={classNames(
                    isActive
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                    'w-full border-b-2 px-1 py-4 text-center text-sm font-medium'
                  )}
                >
                  <div className="inline-flex items-center justify-center gap-x-2">
                    <span>{tab.name}</span>
                    {tab.badge && (
                      <Badge label={tab.badge} color={tab.badgeColor ?? 'red'} />
                    )}
                  </div>
                </a>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Tabs;
