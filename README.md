
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
