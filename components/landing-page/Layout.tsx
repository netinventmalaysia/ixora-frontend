"use client";
import type { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

type LayoutProps = {
  /** Kandungan utama halaman */
  children: ReactNode;
  /** Override navbar default (contoh: <NavbarInner />) */
  navbar?: ReactNode;
  /** Override footer default jika perlu */
  footer?: ReactNode;
  /** Letak <Head> atau elemen tambahan sebelum navbar */
  head?: ReactNode;
  /** Kelas tambahan untuk <main> */
  className?: string;
};

export default function Layout({
  children,
  navbar,
  footer,
  head,
  className,
}: LayoutProps) {
  return (
    <>
      {head}
      {/* Navbar: guna override kalau diberi, jika tidak guna default */}
      {navbar ?? <Navbar />}

      <main className={className ?? "relative overflow-hidden"}>
        {children}
      </main>

      {/* Footer: guna override kalau diberi, jika tidak guna default */}
      {footer ?? <Footer />}
    </>
  );
}
