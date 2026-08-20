import Link from "next/link";
import { ReactNode } from "react";
import { BarChart3, ClipboardPenLine, LayoutDashboard, ScanFace } from "lucide-react";

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
  return (
    <div className="mx-auto flex w-full max-w-7xl gap-6 px-4 py-6 md:px-8">
      <aside className="hidden w-64 shrink-0 rounded-[1.5rem] bg-[#18221d] p-5 text-white shadow-xl shadow-[#18221d]/10 lg:block">
        <p className="flex items-center gap-2 text-lg font-extrabold tracking-tight">kids<span className="text-[#d7ef43]">flow</span></p>
        <p className="mt-12 text-xs font-bold uppercase tracking-[0.18em] text-white/35">Workspace</p>
        <nav className="mt-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-white/60 transition hover:bg-white/10 hover:text-white"
            >
              <item.icon size={18} strokeWidth={1.8} />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <section className="w-full">
        <header className="mb-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-lime-400 to-amber-300 p-6 text-slate-900 shadow-sm">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#738a12]">Resumo da operação</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight">{title}</h1>
          <p className="mt-2 text-sm font-medium text-[#18221d]/60">{subtitle}</p>
        </header>
        {children}
      </section>
    </div>
  );
}
