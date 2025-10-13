// components/ItemList.tsx

import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid';
import { useState } from 'react';
import { fetchBusinessById, withdrawBusiness } from '@/services/api';
import DetailDialog from './DetailDialog';
import BusinessEditDialog from './BusinessEditDialog';
import ConfirmDialog from './ConfirmDialog';

type Item = {
  id: number | string;
  // Flexible shape to accommodate all fields from /business/registered
  [key: string]: any;
  name?: string;
  href?: string;
  status?: string;
  createdBy?: string;
  dueDate?: string;
  dueDateTime?: string;
};

type StatusMap = Record<string, string>;

type ActionItem = {
  label: string;
  onClick?: (item: Item) => void;
};

type ItemListProps = {
  items: Item[];
  statusClasses: StatusMap;
  actions?: ActionItem[];
  onItemUpdated?: (updated: Item) => void;
  onView?: (item: Item) => void; // optional override for View button
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function ItemList({ items, statusClasses, actions = [], onItemUpdated, onView }: ItemListProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<Item | null>(null);

  const [loadingDetails, setLoadingDetails] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editData, setEditData] = useState<Item | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingWithdraw, setPendingWithdraw] = useState<Item | null>(null);

  const openModal = async (item: Item) => {
    setLoadError(null);
    setSelected(item); // show basic info immediately
    setIsOpen(true);
    try {
      setLoadingDetails(true);
      const idNum = typeof item.id === 'string' ? Number(item.id) : item.id;
      const details = await fetchBusinessById(idNum as number);
      setSelected(details);
    } catch (err: any) {
      console.error('Failed to load details', err);
      setLoadError(err?.message ?? 'Failed to load details');
    } finally {
      setLoadingDetails(false);
    }
  };

  const closeModal = () => {
    setIsOpen(false);
    // keep selected for a11y focus restoration; clear if you prefer
  };

  const handleEdit = async (item: Item) => {
    setEditData(item);
    setIsEditOpen(true);
    try {
      const idNum = typeof item.id === 'string' ? Number(item.id) : item.id;
      const details = await fetchBusinessById(idNum as number);
      setEditData(details);
    } catch (e) {
      // fallback to basic data
    }
  };

  const requestWithdraw = (item: Item) => {
  const st = (getStatus(item) || '').toLowerCase();
  if (st !== 'submitted') {
      return; // Only allow for Submitted
    }
    setPendingWithdraw(item);
    setConfirmOpen(true);
  };

  const confirmWithdraw = async () => {
    if (!pendingWithdraw) return;
    try {
      const idNum = typeof pendingWithdraw.id === 'string' ? Number(pendingWithdraw.id) : pendingWithdraw.id;
      const updated = await withdrawBusiness(idNum as number);
      // Reflect in local items if passed from parent (immutable update expected upstream)
      // Update selected/edit data if matches
      if (selected && selected.id === updated.id) setSelected(updated);
      if (editData && editData.id === updated.id) setEditData(updated);
  onItemUpdated?.(updated);
    } catch (e) {
      console.error('Withdraw failed', e);
    } finally {
      setConfirmOpen(false);
      setPendingWithdraw(null);
    }
  };

  return (
    <>
      <ul role="list" className="divide-y divide-gray-100">
        {items.map((item) => (
          <li key={item.id} className="flex items-center justify-between gap-x-6 py-5">
            <div className="min-w-0">
              <div className="flex items-start gap-x-3">
                <p className="text-sm/6 font-semibold text-gray-900">{item.name ?? item.companyName ?? `#${item.id}`}</p>
                <p
                  className={classNames(
                    (() => {
                      const s = getStatus(item);
                      if (!s) return '';
                      const key = findStatusKey(statusClasses, s);
                      return key ? statusClasses[key] : '';
                    })(),
                    'mt-0.5 rounded-md px-1.5 py-0.5 text-xs font-medium whitespace-nowrap ring-1 ring-inset',
                  )}
                >
                  {getStatus(item) ?? '—'}
                </p>
              </div>
              <div className="mt-1 flex items-center gap-x-2 text-xs/5 text-gray-500">
                <p className="whitespace-nowrap">
                  Created: {item.dueDate ? (
                    <time dateTime={item.dueDateTime}>{item.dueDate}</time>
                  ) : item.createdAt ? (
                    <time dateTime={item.createdAt}>{formatDateString(item.createdAt)}</time>
                  ) : (
                    '—'
                  )}
                </p>
                <svg viewBox="0 0 2 2" className="size-0.5 fill-current">
                  <circle r={1} cx={1} cy={1} />
                </svg>
                <p className="whitespace-nowrap">By: {getCreator(item) ?? '—'}</p>
                <svg viewBox="0 0 2 2" className="size-0.5 fill-current">
                  <circle r={1} cx={1} cy={1} />
                </svg>
                {/* Consultant submission hint */}
                {item.submittedByConsultant ? (
                  <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20">
                    Submitted by consultant
                  </span>
                ) : null}
                {Array.isArray(item.coOwners) && item.coOwners.length > 0 ? (
                  <span className="truncate" title={`Co-owners: ${item.coOwners.join(', ')}`}>
                    Co-owners: {item.coOwners.slice(0, 3).join(', ')}{item.coOwners.length > 3 ? '…' : ''}
                  </span>
                ) : null}
              </div>
            </div>
            <div className="flex flex-none items-center gap-x-4">
              <button
                type="button"
                onClick={() => (onView ? onView(item) : openModal(item))}
                className="hidden rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50 sm:block"
              >
                View<span className="sr-only">, {item.name}</span>
              </button>
              {actions.length > 0 && (
                <Menu as="div" className="relative flex-none">
                  <MenuButton className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
                    <span className="sr-only">Open options</span>
                    <EllipsisVerticalIcon aria-hidden="true" className="size-5" />
                  </MenuButton>
                  <MenuItems
                    transition
                    className="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                  >
                    {actions.map((action) => (
                      <MenuItem key={action.label}>
                        <button
                          type="button"
                          onClick={() => {
                            if (action.label.toLowerCase() === 'edit') {
                              handleEdit(item);
                            } else if (action.label.toLowerCase() === 'withdraw') {
                              requestWithdraw(item);
                            }
                            action.onClick?.(item);
                          }}
                          className="w-full text-left px-3 py-1 text-sm/6 text-gray-900 data-focus:bg-gray-50 data-focus:outline-hidden"
                        >
                          {action.label}
                          <span className="sr-only">, {item.name}</span>
                        </button>
                      </MenuItem>
                    ))}
                  </MenuItems>
                </Menu>
              )}
            </div>
          </li>
        ))}
      </ul>

      <DetailDialog
        open={isOpen}
        onClose={closeModal}
        data={selected}
        statusClasses={statusClasses}
        loading={loadingDetails}
  error={loadError}
  // hide token fields and unrelated others by default
  excludeKeys={["invitationToken"]}
  hideTokenLike={true}
  showOther={false}
      />

      <BusinessEditDialog
        open={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        data={editData}
        onSaved={(updated) => {
          // reflect changes in the view dialog if same item
          if (selected && updated && selected.id === updated.id) {
            setSelected(updated);
          }
          if (updated) {
            onItemUpdated?.(updated);
          }
        }}
      />

      <ConfirmDialog
        open={confirmOpen}
        title="Withdraw application?"
        description="Are you sure you want to withdraw your application? This action cannot be undone."
        onCancel={() => { setConfirmOpen(false); setPendingWithdraw(null); }}
        onConfirm={confirmWithdraw}
        confirmText="Yes, withdraw"
        cancelText="No, keep it"
      />
    </>
  );
}

// --- helpers ---

function formatDateString(input: string) {
  const d = new Date(input);
  if (isNaN(d.getTime())) return input;
  return d.toLocaleString();
}

function getStatus(item: Item): string | undefined {
  // Prefer commonly-used fields; extend as needed
  const direct =
    item.status ||
    (item as any).applicationStatus ||
    (item as any).approvalStatus ||
    (item as any).statusName ||
    (item as any).currentStatus ||
    (item as any).state ||
    (item as any).application_status ||
    (item as any).approval_status ||
    (item as any).status_name ||
    (item as any).current_status;
  if (direct) return direct as string;

  // Generic fallback: first string field whose key includes 'status'
  for (const [k, v] of Object.entries(item)) {
    if (typeof v === 'string' && /status/i.test(k)) return v;
  }
  return undefined;
}

function findStatusKey(map: StatusMap, status: string): string | undefined {
  const target = status.toLowerCase();
  return Object.keys(map).find((k) => k.toLowerCase() === target);
}

function buildUrl(path: string) {
  if (!path) return path;
  if (/^https?:\/\//i.test(path)) return path;
  const base = process.env.NEXT_PUBLIC_API_URL || 'https://ixora-api.mbmb.gov.my';
  // Ensure it goes under /uploads/file/<path>
  let normalized = String(path).replace(/^\/+/, '');
  if (!/^uploads\/file\//i.test(normalized)) {
    normalized = `uploads/file/${normalized}`;
  }
  const url = `${base}/${normalized}`;
  // collapse duplicate slashes but keep protocol
  return url.replace(/([^:]\/)\/+/, '$1/');
}

function getCreator(item: Item): string | undefined {
  const candidate =
    (item as any).createdByName ||
    (item as any).creatorName ||
    (item as any).createdByUser?.name ||
    (item as any).createdByUser?.username ||
    (item as any).createdBy ||
    (item as any).created_by ||
    (item as any).creator ||
    (item as any).owner;
  if (candidate === undefined || candidate === null) return undefined;
  return String(candidate);
}
