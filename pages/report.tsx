import SidebarContent from "@/components/main/Sidebar";
import { teams, logoUrl } from '@/components/main/SidebarConfig';
import { userColumns, userData } from '@/components/table/DummyTblData';
import { DataTable } from '@/components/table/DataTable';
import { t } from '@/utils/i18n';
export default function FormPage() {
    return (
        <SidebarContent teams={teams} logoUrl={logoUrl} userRole="admin">
            <h1 className="sr-only">{t('report.title')}</h1>
            <DataTable columns={userColumns} data={userData} />
        </SidebarContent>
    );
}
