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

export default function PeoplePage() {
    const methods = useForm()
    const [people, setPeople] = useState<Person[]>(initialPeople);

    const handleAssignRole = (person: Person) => {
        const newRole = prompt(`Assign new role for ${person.name}:`, person.role);
        if (newRole) {
            setPeople((prev) =>
                prev.map((p) => (p.email === person.email ? { ...p, role: newRole } : p))
            );
        }
    };

    const handleRemove = (person: Person) => {
        if (confirm(`Remove ${person.name} from the list?`)) {
            setPeople((prev) => prev.filter((p) => p.email !== person.email));
        }
    };

    function doSearch(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
        event.preventDefault();
        const searchValue = methods.getValues('search')?.toLowerCase() || '';
        if (!searchValue) {
            setPeople(initialPeople);
            return;
        }
        const filtered = initialPeople.filter(person =>
            person.name.toLowerCase().includes(searchValue) ||
            person.email.toLowerCase().includes(searchValue) ||
            person.role.toLowerCase().includes(searchValue)
        );
        setPeople(filtered);
    }

    return (
        <FormProvider {...methods}>
            <LayoutWithoutSidebar shiftY="-translate-y-0">
                <Heading level={5} align="left" bold>
                    Business Team Management
                </Heading>
                <Spacing size="lg" />
                <SelectField id="businessName" name="businessName" label="Business Name" options={businessNameOptions} />
                <Spacing size="lg" />

                     <InputText
                    id="search"
                    name="search"
                    label="Add staff member"
                    type="email"
                    placeholder="Search by registered email address"
                    icon={MagnifyingGlassIcon}
                    rightElement={<Button type="button" variant="ghost" size="sm"  className={`  bg-transparent shadow-none px-3 py-1 text-sm text-indigo-600 hover:bg-indigo-50`}  onClick={doSearch}>Invite</Button>}
                    
                    
                />

                <Spacing size="lg" />
                <LineSeparator />
                <PersonList people={people} onAssignRole={handleAssignRole} onRemove={handleRemove} />
            </LayoutWithoutSidebar>
        </FormProvider>

    );
}