"use client";

import Link from "next/link";
import { ReactNode, useState } from "react";
import { usePathname } from "next/navigation";
import { BarChart3, ClipboardPenLine, LayoutDashboard, Menu, ScanFace, X } from "lucide-react";

const navItems = [
  { href: "/panel", label: "Visão geral", icon: LayoutDashboard },
  { href: "/panel/cadastro", label: "Cadastro", icon: ClipboardPenLine },
  { href: "/panel/checkin", label: "Check-in", icon: ScanFace },
  { href: "/panel/relatorios", label: "Relatórios", icon: BarChart3 },
];

type PanelShellProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
};

export function PanelShell({ title, subtitle, children }: PanelShellProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function renderNavigation(onNavigate?: () => void) {
    return navItems.map((item) => {
      const isActive = pathname === item.href;

      return (
        <Link
          key={item.href}
          href={item.href}
          onClick={onNavigate}
          className={`flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-bold transition ${
            isActive ? "bg-white/12 text-white shadow-inner" : "text-white/65 hover:bg-white/8 hover:text-white"
          }`}
        >
          <item.icon size={18} strokeWidth={1.8} />
          {item.label}
        </Link>
      );
    });
  }

  return (
    <div className="mx-auto flex w-full max-w-[1400px] gap-6 px-4 py-6 md:px-8">
      <aside className="hidden w-72 shrink-0 rounded-[30px] bg-[linear-gradient(180deg,#0f172a,#111827)] p-5 text-white shadow-[0_30px_60px_rgba(15,23,42,0.22)] lg:block">
        <div className="flex items-center gap-3 text-xl font-black tracking-tight">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[linear-gradient(135deg,#0ea5e9,#2563eb)] text-white shadow-[0_10px_20px_rgba(37,99,235,0.35)]">CF</span>
          <span>Criança<span className="text-[#facc15]">Feliz</span></span>
        </div>

        <p className="mt-10 text-[10px] font-black uppercase tracking-[0.22em] text-white/40">Workspace</p>
        <nav className="mt-4 space-y-2">{renderNavigation()}</nav>
      </aside>

      <section className="w-full min-w-0">
        <header className="relative mb-6 rounded-[30px] bg-[linear-gradient(135deg,#5eead4,#67e8f9_30%,#facc15_100%)] p-5 text-slate-900 shadow-[0_24px_50px_rgba(15,118,110,0.16)] md:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-700">Resumo da operação</p>
              <h1 className="mt-3 text-3xl font-black tracking-[-0.06em] text-slate-900 sm:text-4xl">{title}</h1>
              <p className="mt-2 max-w-2xl text-sm font-medium text-slate-700">{subtitle}</p>
            </div>
            <button
              type="button"
              aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
              aria-expanded={mobileMenuOpen}
              className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-slate-900 text-white shadow-lg lg:hidden"
              onClick={() => setMobileMenuOpen((open) => !open)}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {mobileMenuOpen ? (
            <nav className="mt-5 space-y-2 rounded-3xl bg-slate-950/95 p-3 shadow-xl lg:hidden">{renderNavigation(() => setMobileMenuOpen(false))}</nav>
          ) : null}
        </header>
        {children}
      </section>
    </div>
  );
}
