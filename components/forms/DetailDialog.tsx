import { Dialog } from '@headlessui/react';
import React from 'react';

type StatusMap = Record<string, string>;

export type DetailDialogProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  data: Record<string, any> | null | undefined;
  statusClasses?: StatusMap;
  loading?: boolean;
  error?: string | null;
};

export default function DetailDialog({ open, onClose, title, data, statusClasses = {}, loading = false, error = null }: DetailDialogProps) {
  const effectiveTitle = title || (data?.name || data?.companyName || (data ? `ID: ${data.id}` : 'Details'));

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl ring-1 ring-gray-900/10">
            <div className="flex items-start justify-between">
              <Dialog.Title className="text-base font-semibold text-gray-900">{effectiveTitle}</Dialog.Title>
              <button
                type="button"
                onClick={onClose}
                className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-600"
                aria-label="Close"
              >
                <svg viewBox="0 0 20 20" fill="currentColor" className="size-5" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M10 8.586 3.293 1.879 1.879 3.293 8.586 10l-6.707 6.707 1.414 1.414L10 11.414l6.707 6.707 1.414-1.414L11.414 10l6.707-6.707-1.414-1.414L10 8.586z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {data?.status && (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-500">Status:</span>
                  <span
                    className={`${statusClasses[data.status] ?? ''} rounded-md px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset`}
                  >
                    {data.status}
                  </span>
                </div>
              )}

              {loading && (
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <svg className="size-4 animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a 8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  Loading details…
                </div>
              )}

              {error && (
                <div className="rounded-md bg-red-50 p-3 text-sm text-red-700 ring-1 ring-red-200">{error}</div>
              )}

              {data && !loading && (
                <div className="max-h-[60vh] overflow-auto">
                  <dl className="grid grid-cols-3 gap-2 text-sm">
                    {Object.keys(data)
                      .sort()
                      .map((key) => {
                        const value = (data as any)[key];
                        return (
                          <div className="contents" key={key}>
                            <dt className="text-gray-500 break-words">{humanize(key)}</dt>
                            <dd className="col-span-2 text-gray-900 break-words">{renderValue(value, key)}</dd>
                          </div>
                        );
                      })}
                  </dl>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Close
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
}

// --- helpers ---
function humanize(key: string) {
  return key
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/_/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^\w/, (c) => c.toUpperCase());
}

function renderValue(value: any, key?: string) {
  if (value === null || value === undefined) return <span className="text-gray-400">-</span>;
  if (typeof value === 'boolean') return value ? 'True' : 'False';
  if (typeof value === 'number') return String(value);
  if (typeof value === 'string') {
    if (/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}\.\d{3}Z)?$/.test(value)) {
      return <time dateTime={value}>{formatDateString(value)}</time>;
    }
    const isUrl = /^https?:\/\//i.test(value);
    const isImage = /\.(png|jpe?g|gif|webp|svg)$/i.test(value);
    const src = isUrl ? value : buildUrl(value);
    if (key === 'certificateFilePath' && isImage) {
      return (
        <a href={src} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-500">
          <img src={src} alt="Certificate" className="h-12 w-12 rounded object-cover ring-1 ring-gray-200" />
          <span>Open certificate</span>
        </a>
      );
    }
    if (isUrl) {
      return (
        <a href={src} target="_blank" rel="noreferrer" className="text-indigo-600 hover:text-indigo-500 break-all">
          {src}
        </a>
      );
    }
    return value;
  }
  try {
    return <pre className="whitespace-pre-wrap text-xs text-gray-700">{JSON.stringify(value, null, 2)}</pre>;
  } catch {
    return String(value);
  }
}

function formatDateString(input: string) {
  const d = new Date(input);
  if (isNaN(d.getTime())) return input;
  return d.toLocaleString();
}

function buildUrl(path: string) {
  if (!path) return path;
  if (/^https?:\/\//i.test(path)) return path;
  const base = process.env.NEXT_PUBLIC_API_URL || 'https://ixora-api.mbmb.gov.my';
  let normalized = String(path).replace(/^\/+/, '');
  if (!/^uploads\/file\//i.test(normalized)) {
    normalized = `uploads/file/${normalized}`;
  }
  const url = `${base}/${normalized}`;
  return url.replace(/([^:]\/)\/+/, '$1/');
}
