import { useState } from 'react';
import PersonList from '@/components/staff/StaffList';
import { people as initialPeople, Person } from '@/components/data/StaffList';
import { FormProvider, useForm } from 'react-hook-form';
import Heading from '../forms/Heading';
import Spacing from '../forms/Spacing';
import LayoutWithoutSidebar from '../main/LayoutWithoutSidebar';
import { businessNameOptions } from '../data/SelectionList';
import SelectField from '../forms/SelectField';
import InputText from '../forms/InputText';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import LineSeparator from '../forms/LineSeparator';
import Button from '../forms/Button';
import ProfileRow from '../forms/ProfileRow';
import ProfileActionMenu from '../forms/ProfileActionMenu';
import { Profile } from '@/components/types/Profile';
import { owner } from '../data/OwnershipList';
import {
    handleDownload,
    handlePay,
    handleAssignRole,
    handleRemove,
} from '../actions/consultantActions';

import Tabs, { Tab } from '../forms/Tab'
import FilterTabs from '../forms/FilterTabs';

const tabOptions: Tab[] = [
    { name: 'All', href: '#' },
    { name: 'Request', href: '#', badge: `${owner.filter(p => p.status === 'Pending').length}`, badgeColor: 'yellow' },
    { name: 'Approved', href: '#', badge: `${owner.filter(p => p.status === 'Approved').length}`, badgeColor: 'green' },
];

export const businessTabs: Tab[] = [
    { name: 'Home', href: '#' },
    { name: 'Registration', href: '#' },
    { name: 'Application', href: '#', badge: '5', badgeColor: 'blue' },
    { name: 'Team', href: '#' },
    { name: 'Billing', href: '#' },
]

export default function Ownership() {
    const methods = useForm();
    const [profiles, setProfiles] = useState<Profile[]>(owner);
    const [currentTab, setCurrentTab] = useState<string>('All');
    

    const filteredProfiles = profiles.filter((profile) => {
        if (currentTab === 'All') return true;
        if (currentTab === 'Request') return profile.status === 'Pending';
        if (currentTab === 'Approved') return profile.status === 'Approved';
        return false;
    });

    function doSearch(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
        event.preventDefault();
        const searchValue = methods.getValues('search')?.toLowerCase() || '';
        if (!searchValue) {
            setProfiles(owner);
            return;
        }
        const filtered = owner.filter(person =>
            person.name.toLowerCase().includes(searchValue) ||
            person.email.toLowerCase().includes(searchValue) ||
            person?.project?.toLowerCase().includes(searchValue)
        );
        setProfiles(filtered);
    }

    return (
        <FormProvider {...methods}>
            <LayoutWithoutSidebar shiftY="-translate-y-0">
                <Heading level={5} align="left" bold>
                    Project Ownership Management
                </Heading>
                <Spacing size="lg" />
                <SelectField id="businessName" name="businessName" label="Business Name" options={businessNameOptions} />
                <Spacing size="lg" />

                <InputText
                    id="search"
                    name="search"
                    label="Add project owner"
                    type="email"
                    placeholder="Search by registered email address"
                    icon={MagnifyingGlassIcon}
                    rightElement={<Button type="button" variant="ghost" size="sm" className={`  bg-transparent shadow-none px-3 py-1 text-sm text-indigo-600 hover:bg-indigo-50`} onClick={doSearch}>Invite</Button>}


                />

                <Spacing size="lg" />
                <FilterTabs
                    tabs={tabOptions}
                    currentTab={currentTab}
                    onTabChange={(tab) => setCurrentTab(tab.name)}
                />
      

                <ProfileRow
                    profile={filteredProfiles}
                    actions={(profile) => (
                        <ProfileActionMenu
                            profile={profile}
                            actions={[
                                { label: 'View', onClick: () => handleAssignRole(profile, setProfiles) },
                                { label: 'Remove', onClick: () => handleRemove(profile, setProfiles), danger: true },
                            ]}
                        />
                    )}
                />
            </LayoutWithoutSidebar>
        </FormProvider>

    );
}