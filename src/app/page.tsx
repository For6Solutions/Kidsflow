import Link from "next/link";
import { ArrowUpRight, Check, ClipboardList, Sparkles, UsersRound } from "lucide-react";
import { getDashboardSummary } from "@/services/dashboard";

export const dynamic = "force-dynamic";

export default async function Home() {
  const summary = await getDashboardSummary();

  return (
    <main className="min-h-screen overflow-hidden bg-[#f4f5ef] text-[#18221d]">
      <div className="relative mx-auto min-h-screen max-w-[1440px] px-5 py-5 sm:px-8 lg:px-12">
        <div className="absolute -right-32 -top-40 h-[520px] w-[520px] rounded-full bg-[#d7ef43] blur-3xl opacity-70" />
        <nav className="relative z-10 flex items-center justify-between border-b border-[#18221d]/15 pb-5">
          <Link href="/" className="flex items-center gap-3 text-lg font-extrabold tracking-tight">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#18221d] text-[#d7ef43]"><Sparkles size={18} /></span>
            kids<span className="text-[#738a12]">flow</span>
          </Link>
          <div className="flex items-center gap-3 text-sm font-bold">
            <span className="hidden text-[#18221d]/60 sm:inline">Gestão que flui.</span>
            <Link href="/sign-in" className="rounded-full border border-[#18221d]/25 px-4 py-2 transition hover:bg-[#18221d] hover:text-white">Entrar</Link>
          </div>
        </nav>

        <section className="relative z-10 grid min-h-[600px] items-center gap-12 py-16 lg:grid-cols-[1.08fr_.92fr] lg:py-20">
          <div>
            <p className="mb-6 flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.22em] text-[#738a12]"><span className="h-2 w-2 rounded-full bg-[#d7ef43] ring-4 ring-[#d7ef43]/30" /> Operação simples, impacto real</p>
            <h1 className="max-w-4xl text-5xl font-extrabold leading-[.98] tracking-[-0.04em] sm:text-7xl lg:text-[88px]">O evento começa muito antes da primeira <span className="text-[#738a12]">criança chegar.</span></h1>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-[#18221d]/65">Kidsflow organiza famílias, check-ins e informações importantes em uma experiência leve para quem cuida de tudo.</p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link href="/panel" className="group inline-flex items-center gap-3 rounded-full bg-[#18221d] px-6 py-3.5 text-sm font-extrabold text-white shadow-xl shadow-[#18221d]/20 transition hover:-translate-y-1"><span>Acessar painel</span><ArrowUpRight size={18} className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></Link>
              <span className="text-sm font-bold text-[#18221d]/55">Feito para equipes que fazem acontecer</span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[460px] lg:ml-auto">
            <div className="absolute -left-6 top-10 h-24 w-24 rounded-3xl border border-[#18221d]/15 bg-white/60" />
            <div className="relative rounded-[2rem] bg-[#18221d] p-5 text-white shadow-2xl shadow-[#18221d]/25 sm:p-7">
              <div className="flex items-start justify-between"><div><p className="text-sm text-white/55">Visão do evento</p><p className="mt-1 text-xl font-extrabold">Dia das Crianças 2025</p></div><span className="rounded-full bg-[#d7ef43] px-3 py-1 text-xs font-extrabold text-[#18221d]">Ao vivo</span></div>
              <div className="mt-8 grid grid-cols-2 gap-3"><div className="rounded-2xl bg-white/10 p-4"><UsersRound size={19} className="text-[#d7ef43]" /><p className="mt-5 text-3xl font-extrabold">{summary.totalChildren}</p><p className="text-xs text-white/50">crianças cadastradas</p></div><div className="rounded-2xl bg-[#d7ef43] p-4 text-[#18221d]"><Check size={19} /><p className="mt-5 text-3xl font-extrabold">{summary.attendanceRate}%</p><p className="text-xs text-[#18221d]/60">check-in concluído</p></div></div>
              <div className="mt-3 rounded-2xl border border-white/10 p-4"><div className="flex items-center justify-between text-xs font-bold"><span>Presença confirmada</span><span className="text-[#d7ef43]">{summary.checkedInChildren} de {summary.totalChildren}</span></div><div className="mt-4 h-2 rounded-full bg-white/10"><div className="h-2 rounded-full bg-[#d7ef43]" style={{ width: `${summary.attendanceRate}%` }} /></div></div>
              <div className="mt-5 flex items-center gap-3 border-t border-white/10 pt-5 text-sm text-white/60"><ClipboardList size={17} className="text-[#d7ef43]" /> Dados importantes, sempre à mão.</div>
            </div>
          </div>
        </section>

        <section className="relative z-10 grid gap-4 border-t border-[#18221d]/15 py-8 sm:grid-cols-3">
          {[{ title: "Cadastro sem ruído", text: "Tudo que sua equipe precisa em um fluxo guiado." }, { title: "Check-in em segundos", text: "Menos filas, mais tempo para viver o evento." }, { title: "Decisão com clareza", text: "Relatórios que transformam dados em ação." }].map((item, index) => <article key={item.title} className="flex gap-4 border-[#18221d]/15 py-3 sm:border-r sm:pr-6 last:border-0"><span className="text-sm font-extrabold text-[#738a12]">0{index + 1}</span><div><h2 className="font-extrabold">{item.title}</h2><p className="mt-1 text-sm leading-relaxed text-[#18221d]/55">{item.text}</p></div></article>)}
        </section>
      </div>
    </main>
  );
}
