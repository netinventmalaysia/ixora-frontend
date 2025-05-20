import { ReactNode } from "react";

export default function LayoutWithoutSidebar({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        {children}
      </div>
    </main>
  );
}