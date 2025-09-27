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
    <main className="min-h-screen bg-white">
      {/* Responsive container with standardized horizontal padding (matches Sidebar content) */}
      <div className="px-10 sm:px-4 lg:px-6 xl:px-8 2xl:px-10 max-w-screen-2xl mx-auto w-full">
        <div className={`flex min-h-full flex-1 flex-col justify-start ${paddingY} ${shiftY}`}>
          {children}
        </div>
      </div>
    </main>
  );
}
