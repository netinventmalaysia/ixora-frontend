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

export default function Billing() {
    const methods = useForm()
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
                <CardList items={invoices} statusColors={statusColors} actions={BillingActions}/>
            </LayoutWithoutSidebar>
        </FormProvider>

    );
}