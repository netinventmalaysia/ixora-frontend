import LayoutWithoutSidebar from "todo/components/main/LayoutWithoutSidebar";
import { FormProvider, useForm } from "react-hook-form";
import ItemList from "../forms/ItemList";


import { BusinessRegistration, statuses } from '@/components/data/ItemData';
import Heading from "../forms/Heading";
import { RegistrationApplicationActions } from "todo/components/config/ActionList";

const Application: React.FC = () => {
    const methods = useForm()

    return (
        <FormProvider {...methods}>
            <LayoutWithoutSidebar shiftY="-translate-y-0">
            <Heading level={5} align="left" bold>Business Application</Heading>
                <ItemList items={BusinessRegistration} statusClasses={statuses} actions={RegistrationApplicationActions} />

            </LayoutWithoutSidebar>
        </FormProvider>
    );
}


export default Application;

