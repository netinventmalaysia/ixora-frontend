import SidebarContent from "@/components/main/Sidebar";
import { teams, logoUrl } from '@/components/main/SidebarConfig';
import { userColumns, userData } from '@/components/table/DummyTblData';
import { DataTable } from '@/components/table/DataTable';
import { t } from '@/utils/i18n';
import LogoSpinner from '@/components/common/LogoSpinner';
import { useState } from 'react';
export default function FormPage() {
    const [loading] = useState(false);
    return (
        <SidebarContent teams={teams} logoUrl={logoUrl} userRole="admin">
            {loading && (
                <div className="fixed inset-0 z-[999] flex items-center justify-center bg-white/60 dark:bg-black/60" aria-hidden="true">
                    <LogoSpinner size={56} className="drop-shadow-md" title={t('common.loading')} />
                </div>
            )}
            <h1 className="sr-only">{t('report.title')}</h1>
            <DataTable columns={userColumns} data={userData} />
        </SidebarContent>
    );
}
