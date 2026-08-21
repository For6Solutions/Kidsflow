"use client";

import Link from "next/link";
import { ArrowRight, Menu, Sparkles, X } from "lucide-react";
import { useState } from "react";

export function NavbarMenu() {
  const [open, setOpen] = useState(false);

  return (
    <header className="relative z-20">
      <nav className="flex items-center justify-between rounded-full border border-white/60 bg-white/55 px-4 py-3 shadow-[0_14px_35px_rgba(15,23,42,0.08)] backdrop-blur-md sm:px-5">
        <Link href="/" className="flex items-center gap-3 text-lg font-black tracking-tight text-slate-900">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[linear-gradient(135deg,#0ea5e9,#1d4ed8)] text-white shadow-[0_10px_20px_rgba(59,130,246,0.35)]">
            <Sparkles size={18} />
          </span>
          <span className="hidden sm:inline">
            Criança<span className="text-[#0ea5e9]">Feliz</span>
          </span>
        </Link>

        <div className="hidden items-center gap-3 text-sm font-bold text-slate-700 md:flex">
          <span>Cadastro</span>
          <span className="text-slate-300">•</span>
          <span>Check-in</span>
          <span className="text-slate-300">•</span>
          <span>Relatórios</span>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link href="/sign-in" className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#f59e0b,#f97316)] px-5 py-2.5 text-sm font-black text-white shadow-[0_12px_24px_rgba(249,115,22,0.35)] transition hover:-translate-y-0.5">
            Entrar
            <ArrowRight size={16} />
          </Link>
        </div>

        <button
          type="button"
          aria-label="Abrir menu"
          onClick={() => setOpen((value) => !value)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white/80 text-slate-800 shadow-sm md:hidden"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      {open ? (
        <div className="mt-3 rounded-[24px] border border-white/60 bg-white/80 p-3 shadow-[0_20px_35px_rgba(15,23,42,0.08)] backdrop-blur-md md:hidden">
          <div className="flex flex-col gap-2 text-sm font-bold text-slate-700">
            <Link href="/" className="rounded-xl px-3 py-2 hover:bg-slate-100" onClick={() => setOpen(false)}>
              Início
            </Link>
            <Link href="/panel" className="rounded-xl px-3 py-2 hover:bg-slate-100" onClick={() => setOpen(false)}>
              Painel
            </Link>
            <Link href="/sign-in" className="rounded-xl bg-[linear-gradient(135deg,#f59e0b,#f97316)] px-3 py-2 text-white" onClick={() => setOpen(false)}>
              Entrar
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
