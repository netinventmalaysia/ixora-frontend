
# 🚀 MBMB Template Frontend

A responsive web application template built with Next.js (Pages Router), Tailwind CSS, Tailwind UI components, and React Hook Form for modern and efficient form handling.

This project is structured to support rapid frontend development for MBMB systems and other scalable Next.js applications.

---

## 📦 Tech Stack

- Next.js (Pages Router)
- Tailwind CSS
- Tailwind UI Blocks
- React Hook Form
- Heroicons

---

## 📁 Project Structure

src/
├── components/
│   ├── FormWrapper.tsx
│   ├── auth/
│   │   └── LoginForm.tsx
│   └── form-sections/
│       ├── ProfileSection.tsx
│       ├── PersonalInfoSection.tsx
│       └── NotificationsSection.tsx
├── pages/
│   ├── form.tsx
│   └── login.tsx
└── styles/
   └── globals.css

---

## 🚀 Getting Started

1. Clone the project
git clone https://github.com/netinventmalaysia/mbmb-template-frontend.git
cd mbmb-template-frontend

2. Install dependencies
npm install

3. Run the development server
npm run dev

Then open http://localhost:3000 to view it in your browser.

---

## 🧩 Available Pages

Page | URL | Description
---- | --- | -----------
Form | /form | Full modular profile form
Login | /login | Tailwind UI styled login form

---

## ✅ Features

- Modular ProfileSection, PersonalInfoSection, NotificationsSection
- Unified FormWrapper using react-hook-form
- Reusable LoginForm component
- Beautiful Tailwind UI styling
- Pages Router architecture (no App Router)
- Fully mobile-responsive design
- Simple to extend and scale

---

## 🛠 Future Enhancements (Planned)

- Connect to authentication APIs
- Add Zod/Yup schema validation for better form control
- Add file upload previews (for photos, documents)
- Build a multi-step wizard form (optional)
- Save form submissions to a database (e.g., MongoDB, PostgreSQL)

---

## 📄 License

This project is maintained by Net Invent Malaysia.
Built with ❤️ using Tailwind UI.

---

## 💳 Billing, Selection & Checkout Flow

The application implements a unified multi-module outstanding bill selection and checkout process covering:

Modules: Assessment Tax, Booth Rental, Miscellaneous Bills, Compound (prototype state)

### Data Normalization

Each backend endpoint may return heterogeneous fields. We normalize to the internal shape:

```
SelectableBill {
   id: string | number
   bill_no: string
   amount: number (>0 to be selectable)
   due_date: string (ISO or yyyy-mm-dd)
   description?: string
   source: 'assessment' | 'booth' | 'misc' | 'compound'
   meta?: { item_type?: string; account_no?: string; compound_no?: string; raw?: any }
}
```

### Item Type Codes (MBMB jenis)

| Source       | Default item_type |
|--------------|-------------------|
| assessment   | 01                |
| booth        | 02                |
| misc         | 05 (or meta override) |
| compound     | 99 (placeholder until confirmed) |

### Global Selection Store

Located in `context/BillSelectionContext.tsx` using a reducer with dedupe key: `source|id|bill_no`.

API:
```
const { bills, total, count, add, remove, clear, has } = useBillSelection();
```

Rules:
- Zero-amount bills are ignored when adding.
- Cross-page accumulation is allowed (no auto-clear on new search).
- Toggle logic implemented per page to create + add/remove SelectableBill objects.

### Pages Refactored for Global Selection

- `assessment-tax.tsx`
- `booth-rental.tsx`
- `misc-bills.tsx`
- `compound.tsx` (using placeholder `item_type: '99'`)

### Checkout Tray

Component: `components/billing/CheckoutTray.tsx`

Features:
- Floating panel showing selected bills + total.
- Auto-opens via custom event: `window.dispatchEvent(new Event('ixora:openCheckout'))`.
- Payer fields auto-filled from `localStorage` then refreshed with `/users?email=...`.
- Description auto-derived from bill numbers (single = bill_no; multiple = first 5 joined + `+n more`).
- Builds payload for `POST /billings/checkout`:

```
{
   reference: generateReference(),
   billName, billEmail, billMobile, billDesc,
   bills: [ { account_no, item_type, amount, bill_no? } ]
}
```

### Reference Generation

`utils/reference.ts` – timestamp + in-session sequence ensures uniqueness.

### Assessment Endpoint Fallback

`fetchAssessmentOutstanding` tries `/assessment-tax` first then falls back to legacy `/assessment/outstanding` and detects pre-normalized data.

### Miscellaneous Bill Normalization

Backend fields (examples): `no_akaun`, `trk_bil`, `jumlah`, `catitan1`. Mapped into `MiscBill` unified shape with description fallbacks.

### Post-payment Placeholder

`/payment-status` page accepts `?ref=...` and provides user guidance until a status endpoint (e.g. `/billings/status?reference=`) is implemented.

### Adding a New Bill Source
1. Implement fetch + normalization in `services/api.ts`.
2. Add source type to `BillSource` union.
3. Map an `item_type` code (or placeholder) in CheckoutTray mapping.
4. Refactor the page to use global selection with `add/remove/has`.
5. Test multi-source selection and checkout payload structure.

### Custom Events

- `ixora:pulltorefresh` – pages listen and refetch current query.
- `ixora:openCheckout` – opens the checkout tray programmatically.

### Future Enhancements
- Real payment status polling.
- Replace compound placeholder item_type with confirmed code.
- Add unit tests for selection reducer logic.
- Graceful handling of stale references (retry generation UI hint).

---

## 🧪 Smoke Test Checklist (Internal)
1. Search assessment bills by IC; select a few.
2. Navigate to misc; add additional bills.
3. Trigger `window.dispatchEvent(new Event('ixora:openCheckout'))` in console – tray opens.
4. Confirm payer info pre-filled; Pay Now redirects to gateway URL.
5. Manually visit `/payment-status?ref=LATEST_REFERENCE`.

---

## 📝 Documentation Status
This section documents the current billing & checkout architecture. Update upon changes to payload contract or selection semantics.

