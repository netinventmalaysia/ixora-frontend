import { CardItem } from "../forms/CardList";

export const invoices: CardItem[] = [
  {
    id: 1,
    name: 'Booth Rental',
    lastInvoice: {
      date: 'December 13, 2024',
      dateTime: '2024-12-13',
      amount: 'RM 2,000.00',
      status: 'Overdue',
    },
  },
  {
    id: 2,
    name: 'MySKB (Net Invent Sdn Bhd)',
    lastInvoice: {
      date: 'January 22, 2025',
      dateTime: '2023-01-22',
      amount: 'RM 400.00',
      status: 'Paid',
    },
  },
  {
    id: 3,
    name: 'Compound',
    lastInvoice: {
      date: 'January 23, 2025',
      dateTime: '2023-01-23',
      amount: 'RM 600.00',
      status: 'Paid',
    },
  },
]