import { ReactNode } from "react";

type LayoutWithoutSidebarProps = {
  children: ReactNode;
  paddingY?: string;
  shiftY?: string; // e.g., "-translate-y-4"
};

export default function LayoutWithoutSidebar({
  children,
  paddingY = "py-4 md:py-8 lg:py-12",
  shiftY = "", // Optional vertical shift
}: LayoutWithoutSidebarProps) {
  return (
    <main className="min-h-screen bg-white flex items-start justify-center p-6">
      <div className={`flex min-h-full flex-1 flex-col justify-start px-6 ${paddingY} ${shiftY}`}>
        {children}
      </div>
    </main>
  );
}
