import React from 'react';
import { ChevronDownIcon } from '@heroicons/react/16/solid';
import Badge, { BadgeProps } from '@/components/forms/Badge';

export interface FilterTab {
  name: string;
  badge?: string;
  badgeColor?: BadgeProps['color'];
}

interface FilterTabsProps {
  tabs: FilterTab[];
  currentTab: string;
  onTabChange: (tab: FilterTab) => void;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const FilterTabs: React.FC<FilterTabsProps> = ({ tabs, currentTab, onTabChange }) => {
  return (
    <div className="my-4 w-full">
      {/* Mobile: outer box with background */}
      <div className="sm:hidden">
        <div className="bg-gray-50 px-4 py-6 sm:px-6 sm:py-12 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <div className="relative w-full rounded-md border border-gray-300 bg-white shadow-sm px-3 py-2">
              <select
                aria-label="Filter by tab"
                value={currentTab}
                onChange={(e) => {
                  const selected = tabs.find((t) => t.name === e.target.value);
                  if (selected) onTabChange(selected);
                }}
                className="block w-full appearance-none bg-transparent pr-8 text-sm text-gray-800 font-normal focus:outline-none"
              >
                {tabs.map((tab) => (
                  <option
                    key={tab.name}
                    value={tab.name}
                    className="text-sm font-normal"
                  >
                    {tab.badge ? `${tab.name} (${tab.badge})` : tab.name}
                  </option>
                ))}
              </select>
              <ChevronDownIcon
                aria-hidden="true"
                className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Desktop: pill-style full-width tabs */}
      <div className="hidden sm:block">
        <div className="flex w-full divide-x divide-gray-200 rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {tabs.map((tab, idx) => {
            const isActive = tab.name === currentTab;
            return (
              <button
                key={tab.name}
                onClick={() => onTabChange(tab)}
                type="button"
                className={classNames(
                  isActive ? 'bg-indigo-50 text-indigo-700' : 'bg-white text-gray-700 hover:bg-gray-50',
                  idx === 0 ? 'rounded-l-lg' : '',
                  idx === tabs.length - 1 ? 'rounded-r-lg' : '',
                  'group relative flex-1 min-w-0 px-4 py-2 text-sm font-medium text-center focus:z-10'
                )}
              >
                <div className="w-full inline-flex items-center justify-center gap-x-2">
                  <span>{tab.name}</span>
                  {tab.badge && (
                    <Badge label={tab.badge} color={tab.badgeColor ?? 'gray'} />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FilterTabs;
