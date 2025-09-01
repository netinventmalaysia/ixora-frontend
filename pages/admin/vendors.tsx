import React, { useEffect, useState } from 'react';
import SidebarLayout from '@/components/main/SidebarLayout';
import Heading from '@/components/forms/Heading';
import Spacing from '@/components/forms/Spacing';
import LineSeparator from '@/components/forms/LineSeparator';
import Button from '@/components/forms/Button';
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useForm, FormProvider } from 'react-hook-form';
import TextInput from '@/components/forms/TextInput';
import { createVendor, generateVendorKey, listVendors } from '@/services/api';
import toast from 'react-hot-toast';

type Vendor = any;

export default function AdminVendorsPage() {
  const methods = useForm<{ name: string; app_name: string; key: string }>();
  const { setValue, handleSubmit, reset } = methods;
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const data = await listVendors();
      setVendors(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      toast.error('Failed to load vendors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchVendors(); }, []);

  const onGenerateKey = async () => {
    try {
      const res = await generateVendorKey();
      if (res?.key) {
        setValue('key', res.key, { shouldDirty: true });
        toast.success('Key generated');
      } else {
        toast('No key returned');
      }
    } catch (e) {
      toast.error('Failed to generate key');
    }
  };

  const onSubmit = handleSubmit(async (values) => {
    try {
      setSubmitting(true);
      await createVendor(values);
      toast.success('Vendor created');
      reset();
      fetchVendors();
    } catch (e) {
      toast.error('Failed to create vendor');
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <SidebarLayout>
      <Heading level={3} align="left" bold>MBMB API • Add Vendor</Heading>
      <Spacing size="sm" />
      <LineSeparator />
      <Spacing size="md" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <Heading level={5} align="left" bold>Create Vendor</Heading>
          <Spacing size="sm" />
          <FormProvider {...methods}>
            <form onSubmit={onSubmit} className="space-y-2">
              <TextInput name="name" label="Name" required placeholder="Vendor name" />
              <TextInput name="app_name" label="App Name" required placeholder="INVENT" />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="sm:col-span-2">
                  <TextInput name="key" label="Key" required placeholder="Generate or paste key" />
                </div>
                <div className="sm:col-span-1 flex items-end">
                  <Button type="button" variant="secondary" className="w-full" onClick={onGenerateKey}>Generate Key</Button>
                </div>
              </div>
              <div className="flex justify-end">
                <Button type="submit" loading={submitting}>Create Vendor</Button>
              </div>
            </form>
          </FormProvider>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <Heading level={5} align="left" bold>Vendors</Heading>
          <Spacing size="sm" />
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[10%]">ID</TableHead>
                  <TableHead className="w-[25%]">Name</TableHead>
                  <TableHead className="w-[20%]">App</TableHead>
                  <TableHead className="w-[20%]">Status</TableHead>
                  <TableHead className="w-[25%]">Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(!loading && vendors.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-gray-500">No vendors</TableCell>
                  </TableRow>
                )}
                {vendors.map((v: any) => (
                  <TableRow key={v.id}>
                    <TableCell>{v.id}</TableCell>
                    <TableCell>{v.name}</TableCell>
                    <TableCell>{v.app_name}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${
                        v.status === 'Active' ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20' : 'bg-gray-50 text-gray-700 ring-gray-600/20'
                      }`}>{v.status || '-'}</span>
                    </TableCell>
                    <TableCell className="text-xs text-gray-600">{v.created_at || v.createdAt || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
