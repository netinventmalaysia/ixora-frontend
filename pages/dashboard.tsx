import {useEffect, useMemo, useState} from 'react';
import SidebarLayout from '@/components/main/SidebarLayout';
import Heading from '@/components/forms/Heading';
import Spacing from '@/components/forms/Spacing';
import LineSeparator from '@/components/forms/LineSeparator';
import TextLine from '@/components/forms/HyperText';
import {CheckCircleIcon} from '@heroicons/react/24/solid';
import {useTranslation} from '@/utils/i18n';

type Bill = {
  type: string;
  account: string;
  amount: number;   // simpan nombor (senang kira)
  due: string;      // paparan tarikh
  color?: string;   // tailwind text color utk amaun (optional)
};

type Invoice = {
  type: string;
  amount: number;
  due: string;
  color?: string;
};

export default function DashboardPage() {
  const {t} = useTranslation();

  // ====== Mock data dari mesej anda (tukar RM-->number) ======
  const bills: Bill[] = [
    { type: 'Assessment Tax Bill', account: '124090000257', amount: 120.00, due: '30 Sep 2025', color: 'text-emerald-600' },
    { type: 'Compound',            account: 'KN-44328990',  amount:  50.00, due: '15 Sep 2025', color: 'text-red-600' },
    { type: 'Booth Rental Bill',   account: '111290-01',     amount: 300.00, due: '10 Oct 2025', color: 'text-emerald-600' },
  ];

  const invoices: Invoice[] = [
    { type: 'Invoice Permit #P11223',  amount:  80.00, due: '05 Sep 2025', color: 'text-emerald-600' },
    { type: 'Invoice Licence #L33445', amount: 150.00, due: '20 Sep 2025', color: 'text-sky-600' },
    { type: 'Invoice Thypoid #T55667', amount:  40.00, due: '25 Sep 2025', color: 'text-amber-600' },
  ];

  // ====== Helpers ======
  const fRM = (n: number) => `RM ${n.toFixed(2)}`;

  const totals = useMemo(() => {
    const billTotal = bills.reduce((s, b) => s + b.amount, 0);
    const invoiceTotal = invoices.reduce((s, i) => s + i.amount, 0);
    // cari due paling hampir
    const asDate = (d: string) => new Date(d.replace(/(\d{2}) (\w{3}) (\d{4})/, '$3-$2-$1'));
    const nextBill = [...bills].sort((a,b)=>+asDate(a.due)-+asDate(b.due))[0];
    const nextInvoice = [...invoices].sort((a,b)=>+asDate(a.due)-+asDate(b.due))[0];
    return { billTotal, invoiceTotal, nextBill, nextInvoice };
  }, [bills, invoices]);

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
        {t('dashboard.welcome', 'Welcome to MBMB IXORA')}
      </Heading>
      <TextLine>
        {t('dashboard.description', 'MBMB IXORA is the official digital portal of Majlis Bandaraya Melaka Bersejarah that simplifies citizen and business transactions online.')}
      </TextLine>

      <Spacing size="lg" />

      {/* ===================== SUMMARY CARDS (HYBRID) ===================== */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total Bills */}
        <div className="bg-white shadow rounded-lg p-5">
          <div className="text-xs uppercase text-gray-500">Jumlah Bil</div>
          <div className="mt-1 text-2xl font-bold">{fRM(totals.billTotal)}</div>
          <div className="mt-2 text-sm text-gray-500">Bil aktif: {bills.length}</div>
        </div>

        {/* Total Invoices */}
        <div className="bg-white shadow rounded-lg p-5">
          <div className="text-xs uppercase text-gray-500">Jumlah Invois</div>
          <div className="mt-1 text-2xl font-bold">{fRM(totals.invoiceTotal)}</div>
          <div className="mt-2 text-sm text-gray-500">Invois aktif: {invoices.length}</div>
        </div>

        {/* Next Bill Due */}
        <div className="bg-white shadow rounded-lg p-5">
          <div className="text-xs uppercase text-gray-500">Bil Terdekat</div>
          <div className="mt-1 text-base font-semibold">{totals.nextBill?.type || '-'}</div>
          <div className="text-sm text-gray-500">Tarikh Akhir: {totals.nextBill?.due || '-'}</div>
          <div className="mt-1 font-bold">{totals.nextBill ? fRM(totals.nextBill.amount) : '-'}</div>
        </div>

        {/* Next Invoice Due */}
        <div className="bg-white shadow rounded-lg p-5">
          <div className="text-xs uppercase text-gray-500">Invois Terdekat</div>
          <div className="mt-1 text-base font-semibold">{totals.nextInvoice?.type || '-'}</div>
          <div className="text-sm text-gray-500">Tarikh Akhir: {totals.nextInvoice?.due || '-'}</div>
          <div className="mt-1 font-bold">{totals.nextInvoice ? fRM(totals.nextInvoice.amount) : '-'}</div>
        </div>
      </div>

      <Spacing size="lg" />

      {/* ===================== BILLS TABLE ===================== */}
      <Heading level={2} align="left" bold>
        {t('dashboard.billsTitle', 'Your Bills')}
      </Heading>
      <TextLine>
        {t('dashboard.billsDesc', 'Below is a summary of your current bills. Click on each bill type for more details and payment options.')}
      </TextLine>
      <Spacing size="sm" />
      <div className="bg-white shadow rounded-lg p-6 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-3 font-semibold text-gray-700">Bill Type</th>
              <th className="text-left py-2 px-3 font-semibold text-gray-700">Account Number</th>
              <th className="text-left py-2 px-3 font-semibold text-gray-700">Amount</th>
              <th className="text-left py-2 px-3 font-semibold text-gray-700">Due Date</th>
              <th className="text-right py-2 px-3 font-semibold text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {bills.map((b, i) => (
              <tr key={i} className="border-b last:border-0">
                <td className="py-2 px-3">{b.type}</td>
                <td className="py-2 px-3">{b.account}</td>
                <td className={`py-2 px-3 font-bold ${b.color || 'text-gray-800'}`}>{fRM(b.amount)}</td>
                <td className="py-2 px-3 text-xs text-gray-500">{b.due}</td>
                <td className="py-2 px-3 text-right">
                  <button className="inline-flex items-center px-3 py-1.5 rounded-md bg-[#00A7A6] text-white hover:opacity-90">
                    Bayar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td className="py-3 px-3 font-semibold" colSpan={2}>Total</td>
              <td className="py-3 px-3 font-extrabold">{fRM(totals.billTotal)}</td>
              <td colSpan={2}></td>
            </tr>
          </tfoot>
        </table>
      </div>

      <Spacing size="lg" />

      {/* ===================== INVOICES TABLE ===================== */}
      <Heading level={2} align="left" bold>
        {t('dashboard.favoriteAccountsTitle', 'Invoices')}
      </Heading>
      <TextLine>{t('dashboard.invoicesDesc', 'Below is a summary of your invoices.')}</TextLine>
      <Spacing size="sm" />
      <div className="bg-white shadow rounded-lg p-6 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-3 font-semibold text-gray-700">Invoice Type</th>
              <th className="text-left py-2 px-3 font-semibold text-gray-700">Amount</th>
              <th className="text-left py-2 px-3 font-semibold text-gray-700">Due Date</th>
              <th className="text-right py-2 px-3 font-semibold text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv, i) => (
              <tr key={i} className="border-b last:border-0">
                <td className="py-2 px-3">{inv.type}</td>
                <td className={`py-2 px-3 font-bold ${inv.color || 'text-gray-800'}`}>{fRM(inv.amount)}</td>
                <td className="py-2 px-3 text-xs text-gray-500">{inv.due}</td>
                <td className="py-2 px-3 text-right">
                  <button className="inline-flex items-center px-3 py-1.5 rounded-md bg-[#B01C2F] text-white hover:opacity-90">
                    Bayar / Lihat
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td className="py-3 px-3 font-semibold">Total</td>
              <td className="py-3 px-3 font-extrabold">{fRM(totals.invoiceTotal)}</td>
              <td colSpan={2}></td>
            </tr>
          </tfoot>
        </table>
      </div>

      <Spacing size="lg" />
      <LineSeparator />

      {/* ============== Features (kekal) ============== */}
      <Heading level={2} align="left" bold>
        {t('dashboard.featuresTitle', 'Features')}
      </Heading>
      <Spacing size="sm" />
      <ul className="space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2 text-gray-700 text-base">
            <CheckCircleIcon className="h-5 w-5 text-emerald-600"/>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <Spacing size="lg" />
      <LineSeparator />
    </SidebarLayout>
  );
}
