import { CardItem } from "../forms/CardList";

type UserRole = 'admin' | 'staff' | 'viewer'; // You can expand this as needed

// Mock current user role (you can later pass it dynamically)
const currentUserRole: UserRole = 'staff';

// Utility to check role access
function hasPermission(action: string): boolean {
  const rolePermissions: Record<UserRole, string[]> = {
    admin: ['view', 'download', 'pay'],
    staff: ['view', 'download'],
    viewer: ['view'],
  };

  return rolePermissions[currentUserRole].includes(action.toLowerCase());
}

// Simple browser confirm dialog
function confirmAction(message: string): boolean {
  return window.confirm(message);
}

// Actual action handlers
export function handleView(item: CardItem) {
  if (!hasPermission('view')) {
    alert('You do not have permission to view.');
    return;
  }

  console.log('View', item);
}

export function handleDownload(item: CardItem) {
  if (!hasPermission('download')) {
    alert('You do not have permission to download.');
    return;
  }

  const confirmed = confirmAction(`Do you want to download invoice for "${item.name}"?`);
  if (!confirmed) return;

  alert(`Downloading ${item.name}...`);
}

export function handlePay(item: CardItem) {
  if (!hasPermission('pay')) {
    alert('You do not have permission to pay.');
    return;
  }

  const confirmed = confirmAction(`Are you sure you want to pay RM ${item.lastInvoice.amount} for "${item.name}"?`);
  if (!confirmed) return;

  alert(`Proceeding to pay for ${item.name}...`);
}
