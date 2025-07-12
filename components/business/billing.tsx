import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import Heading from '../forms/Heading';
import Spacing from '../forms/Spacing';
import LayoutWithoutSidebar from '../main/LayoutWithoutSidebar';
import LineSeparator from '../forms/LineSeparator';
import { invoices } from '../data/CardList';
import { statusColors } from '../config/StatusColors';
import CardList from '../forms/CardList';
import { businessNameOptions } from '../data/SelectionList';
import SelectField from '../forms/SelectField';
import { BillingActions } from '../config/ActionList';
import FilterTabs from '../forms/FilterTabs';
import Tabs, { Tab } from '../forms/Tab';
import Button from '../forms/Button';

export default function Billing() {
    const methods = useForm();
    const [currentTab, setCurrentTab] = useState<string>('All');
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    const tabOptions: Tab[] = [
        { name: 'All', href: '#' },
        { name: 'Pending Payment', href: '#', badge: `${invoices.filter(p => p.lastInvoice.status === 'Overdue').length}`, badgeColor: 'red' },
        { name: 'Paid', href: '#', badge: `${invoices.filter(p => p.lastInvoice.status === 'Paid').length}`, badgeColor: 'green' },
    ];

    const filteredBilling = invoices.filter((invoice) => {
        if (currentTab === 'All') return true;
        if (currentTab === 'Pending Payment') return invoice.lastInvoice.status === 'Overdue';
        if (currentTab === 'Paid') return invoice.lastInvoice.status === 'Paid';
        return false;
    });

    const handleSelect = (id: number) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const totalAmount = filteredBilling
        .filter(item => selectedIds.includes(item.id))
        .reduce((sum, item) => sum + parseFloat(item.lastInvoice.amount.replace(/[^\d.-]/g, '')), 0);

    const handlePaySelected = () => {
        const selectedInvoices = invoices.filter(inv => selectedIds.includes(inv.id));
        // 👉 You can trigger your payment API here with selectedInvoices
        alert(`Processing payment for ${selectedInvoices.length} item(s) totaling RM ${totalAmount.toFixed(2)}`);
    };

    return (
        <FormProvider {...methods}>
            <LayoutWithoutSidebar shiftY="-translate-y-0">
                <Heading level={5} align="left" bold>
                    Invoice Billing
                </Heading>

                <Spacing size="lg" />
                <SelectField id="businessName" name="businessName" label="Business Name" options={businessNameOptions} />

                <Spacing size="sm" />
                <LineSeparator />

                <FilterTabs
                    tabs={tabOptions}
                    currentTab={currentTab}
                    onTabChange={(tab) => {
                        setCurrentTab(tab.name);
                        setSelectedIds([]); // Clear selection on tab switch
                    }}
                />

                {currentTab === 'Pending Payment' && (
                    <>
                        <div className="flex justify-between items-center mt-4 mb-2">
                            <p className="text-sm font-semibold text-gray-700">
                                Total Selected: RM {totalAmount.toFixed(2)}
                            </p>
                            <Button
                                onClick={handlePaySelected}
                                disabled={selectedIds.length === 0}
                                className="px-4 py-2 text-sm"
                            >
                                Pay Selected
                            </Button>
                        </div>
                    </>
                )}

                <CardList
                    items={filteredBilling}
                    statusColors={statusColors}
                    actions={BillingActions}
                    selectable={currentTab === 'Pending Payment'}
                    selectedIds={selectedIds}
                    onSelect={handleSelect}
                />
            </LayoutWithoutSidebar>
        </FormProvider>
    );
}
