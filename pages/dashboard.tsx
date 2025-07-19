import { useEffect, useState } from 'react';
import SidebarContent from '@/components/main/Sidebar';
import Heading from '@/components/forms/Heading';
import Spacing from '@/components/forms/Spacing';
import LineSeparator from '@/components/forms/LineSeparator';
import TextLine from '@/components/forms/HyperText';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { teams, logoUrl } from '@/components/main/SidebarConfig';
import SidebarLayout from 'todo/components/main/SidebarLayout';

export default function DashboardPage() {
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
    'Pembayaran Cukai Taksiran',
    'Bayaran Kompaun',
    'Sewaan Gerai',
    'Bayaran Bil Pelbagai',
    'Pendaftaran Perniagaan dan Permohonan Lesen',
    'Pengurusan Akaun dan Staf Perniagaan',
    'Permohonan Permit Bangunan Sementara (MySKB)',
    'Pengumuman dan Berita MBMB'
  ];

  return (
    <SidebarLayout>
      <Heading level={1} align="left" bold>
          Selamat Datang ke MBMB Go (Ixora)
        </Heading>
        <TextLine>
          MBMB Go ialah portal digital rasmi Majlis Bandaraya Melaka Bersejarah yang memudahkan urusan rakyat dan perniagaan secara dalam talian.
        </TextLine>

      
        <Spacing size="lg" />
        <LineSeparator />

        <Heading level={2} align="left" bold>
          Ciri-Ciri Utama MBMB Go
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
          Matriks Peranan Pengguna
        </Heading>
       <Spacing size="sm" />
        <ul className="list-disc list-inside text-gray-700 text-base space-y-2">
          <li><strong>Guest:</strong> Boleh lihat pengumuman dan capaian awam</li>
          <li><strong>Personal:</strong> Boleh daftar perniagaan, bayar cukai, kompaun dan akses gerai</li>
          <li><strong>Business:</strong> Boleh daftar sebagai perunding dan akses modul MySKB</li>
          <li><strong>Consultant:</strong> Boleh hantar projek permit bangunan sementara dan perbaharui lesen</li>
        </ul>

        <Spacing size="lg" />
        <LineSeparator />

        <Heading level={2} align="left" bold>
          Berita & Pengumuman Terkini
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
