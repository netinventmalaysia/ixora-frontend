import { useEffect, useState } from 'react';
import SidebarContent from '@/components/main/Sidebar';
import Heading from '@/components/forms/Heading';
import { useTranslation } from '@/utils/i18n';
import Spacing from '@/components/forms/Spacing';
import LineSeparator from '@/components/forms/LineSeparator';
import TextLine from '@/components/forms/HyperText';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { teams, logoUrl } from '@/components/main/SidebarConfig';
import SidebarLayout from '@/components/main/SidebarLayout';

export default function DashboardPage() {
  const { t } = useTranslation();
  const [userRole, setUserRole] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    setUserRole(role || '');
    setUsername(localStorage.getItem('username') || '');
    setEmail(localStorage.getItem('email') || '');

  }, []);

  const features = [
    t('dashboard.features.assessmentTax'),
    t('dashboard.features.compoundPayments'),
    t('dashboard.features.boothRental'),
    t('dashboard.features.miscBills'),
    t('dashboard.features.businessRegistration'),
    t('dashboard.features.accountStaffMgmt'),
    t('dashboard.features.myskb'),
    t('dashboard.features.announcements')
  ];

  return (
    <SidebarLayout>
          <Heading level={1} align="left" bold>
          {t('dashboard.welcome')}
        </Heading>
        <TextLine>
          {t('dashboard.description')}
        </TextLine>

      
        <Spacing size="lg" />
        <LineSeparator />

        <Heading level={2} align="left" bold>
          {t('dashboard.featuresTitle')}
        </Heading>
        <Spacing size="sm" />
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2 text-gray-700 text-base">
              <CheckCircleIcon className="h-5 w-5 text-green-600" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <Spacing size="lg" />
        <LineSeparator />

        <Heading level={2} align="left" bold>
          {t('dashboard.rolesTitle', 'Matriks Peranan Pengguna')}
        </Heading>
       <Spacing size="sm" />
        <ul className="list-disc list-inside text-gray-700 text-base space-y-2">
          <li><strong>{t('dashboard.roles.guest.label')}:</strong> {t('dashboard.roles.guest.desc')}</li>
          <li><strong>{t('dashboard.roles.personal.label')}:</strong> {t('dashboard.roles.personal.desc')}</li>
          <li><strong>{t('dashboard.roles.business.label')}:</strong> {t('dashboard.roles.business.desc')}</li>
          <li><strong>{t('dashboard.roles.consultant.label')}:</strong> {t('dashboard.roles.consultant.desc')}</li>
        </ul>

        <Spacing size="lg" />
        <LineSeparator />

        <Heading level={2} align="left" bold>
          {t('dashboard.announcementsTitle', 'Berita & Pengumuman Terkini')}
        </Heading>
        <Spacing size="sm" />
        <ul className="list-none space-y-4">
          <li>
            <Heading level={4}>13 Julai 2025 - Notis Penutupan Gerai Sementara</Heading>
            <TextLine>Semua gerai di Jalan Hang Tuah akan ditutup mulai 15 Julai bagi kerja-kerja penyelenggaraan.</TextLine>
          </li>
          <li>
            <Heading level={4}>1 Julai 2025 - Pembukaan Permohonan Gerai Baharu</Heading>
            <TextLine>Permohonan sewaan gerai bagi suku ketiga tahun 2025 kini dibuka di bawah menu "Gerai".</TextLine>
          </li>
        </ul>

        <Spacing size="lg" />
        <LineSeparator />

    </SidebarLayout>
  );
}
