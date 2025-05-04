import SidebarContent from "@/components/main/Sidebar";
import { navigation, teams, logoUrl } from '@/components/main/SidebarConfig';
import { userColumns, userData } from '@/components/table/DummyTblData';
import { DataTable } from '@/components/table/DataTable';
export default function FormPage() {
    return (
        <SidebarContent navigation={navigation} teams={teams} logoUrl={logoUrl}>
            <DataTable columns={userColumns} data={userData} />
        </SidebarContent>
    );
}
