import Link from "next/link";
import { ArrowRight, Check, ClipboardList, UsersRound } from "lucide-react";
import { NavbarMenu } from "@/components/ui/navbar-menu";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.9),_rgba(255,255,255,0)_32%),linear-gradient(135deg,#ecfeff_0%,#e0f2fe_22%,#fef3c7_52%,#fef9c3_100%)] text-slate-900">
      <div className="relative mx-auto max-w-[1440px] px-5 py-5 sm:px-8 lg:px-10">
        <div className="pointer-events-none absolute -left-20 top-8 h-72 w-72 rounded-full bg-[#ffb703]/30 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 top-40 h-80 w-80 rounded-full bg-[#0ea5e9]/25 blur-3xl" />

        <div className="relative z-10">
          <NavbarMenu />
        </div>

        <section className="relative z-10 grid items-center gap-12 pb-16 pt-14 lg:grid-cols-[1.08fr_0.92fr] lg:pt-20">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#0ea5e9]/20 bg-white/70 px-4 py-2 text-[10px] font-black uppercase tracking-[0.25em] text-[#0f172a] shadow-[0_10px_25px_rgba(14,165,233,0.08)]">
              <span className="h-2.5 w-2.5 rounded-full bg-[#facc15] shadow-[0_0_0_4px_rgba(250,204,21,0.22)]" />
              Gestão moderna e humanizada
            </div>

            <h1 className="max-w-[650px] text-4xl font-black leading-[0.95] tracking-[-0.06em] text-slate-900 sm:text-5xl lg:text-[88px]">
              Mais <span className="text-[#0ea5e9]">abraços</span>,
              <br />
              menos telas.
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-relaxed text-slate-700">
              A plataforma que organiza o cadastro, o check-in e os relatórios de um evento infantil com visual moderno, fluxo simples e muito menos dor de cabeça.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/sign-in" className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#0ea5e9,#2563eb)] px-6 py-3 text-sm font-black text-white shadow-[0_16px_25px_rgba(37,99,235,0.35)] transition hover:-translate-y-0.5">
                Quero participar
                <ArrowRight size={16} />
              </Link>
              <Link href="/panel" className="rounded-full border border-slate-300 bg-white/75 px-6 py-3 text-sm font-black text-slate-800 shadow-[0_10px_20px_rgba(15,23,42,0.07)] transition hover:-translate-y-0.5">
                Ver painel
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-4 text-sm font-bold text-slate-600">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-2 shadow-sm"><Check size={14} className="text-emerald-500" /> Cadastro guiado</span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-2 shadow-sm"><Check size={14} className="text-emerald-500" /> Relatórios reais</span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-2 shadow-sm"><Check size={14} className="text-emerald-500" /> Operação enxuta</span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[490px] lg:ml-auto">
            <div className="absolute -left-6 top-10 h-24 w-24 rotate-12 rounded-[28px] border border-sky-200 bg-white/80 shadow-[0_20px_30px_rgba(14,165,233,0.15)]" />
            <div className="absolute -right-8 bottom-8 h-28 w-28 rotate-[-16deg] rounded-[30px] border border-yellow-200 bg-[#facc15]/90 shadow-[0_18px_30px_rgba(250,204,21,0.28)]" />

            <div className="relative rounded-[32px] border border-white/60 bg-[linear-gradient(145deg,#0f172a,#1d4ed8,#0ea5e9)] p-5 text-white shadow-[0_35px_80px_rgba(37,99,235,0.42)] sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-100">Evento</p>
                  <p className="mt-2 text-2xl font-black">Dia de Criança</p>
                </div>
                <span className="rounded-full bg-[#facc15] px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-slate-900 shadow-[0_8px_14px_rgba(250,204,21,0.45)]">
                  Pronto
                </span>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-3">
                <div className="rounded-[24px] bg-white/10 p-4 shadow-inner shadow-white/10 backdrop-blur-sm">
                  <UsersRound size={20} className="text-[#facc15]" />
                  <p className="mt-5 text-3xl font-black">03</p>
                  <p className="text-[11px] uppercase tracking-[0.14em] text-sky-100/80">Fluxos</p>
                </div>

                <div className="rounded-[24px] bg-[linear-gradient(135deg,#facc15,#f59e0b)] p-4 text-slate-900 shadow-[0_18px_28px_rgba(245,158,11,0.35)]">
                  <Check size={20} />
                  <p className="mt-5 text-3xl font-black">100%</p>
                  <p className="text-[11px] uppercase tracking-[0.14em] text-slate-700">Pronto para operar</p>
                </div>
              </div>

              <div className="mt-4 rounded-[24px] border border-white/15 bg-slate-950/15 p-4 shadow-inner shadow-slate-950/20">
                <div className="flex items-center justify-between text-[11px] font-extrabold uppercase tracking-[0.18em] text-sky-100/80">
                  <span>Operação</span>
                  <span>Pronta para usar</span>
                </div>
                <div className="mt-4 h-2.5 rounded-full bg-white/10">
                  <div className="h-2.5 w-full rounded-full bg-[linear-gradient(90deg,#facc15,#7dd3fc)]" />
                </div>
              </div>

              <div className="mt-5 flex items-center gap-3 border-t border-white/10 pt-5 text-sm text-sky-100">
                <ClipboardList size={17} className="text-[#facc15]" />
                Dados importantes, sempre à mão.
              </div>
            </div>
          </div>
        </section>

        <section className="relative z-10 grid gap-5 pb-16 md:grid-cols-3">
          {[
            { title: "Cadastro sem ruído", text: "Fluxo guiado para cada família e para cada criança." },
            { title: "Check-in em segundos", text: "Menos filas, mais organização e agilidade na entrada." },
            { title: "Decisão com clareza", text: "Relatórios prontos para agir em tempo real." },
          ].map((item, index) => (
            <article
              key={item.title}
              className="rounded-[28px] border border-white/60 bg-white/60 p-5 shadow-[0_20px_35px_rgba(15,23,42,0.08)] backdrop-blur-sm transition hover:-translate-y-1"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#dbeafe,#bfdbfe)] text-lg font-black text-[#1d4ed8] shadow-[0_10px_20px_rgba(59,130,246,0.18)]">
                0{index + 1}
              </div>
              <h2 className="text-xl font-black text-slate-900">{item.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.text}</p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
