import Link from "next/link";

import { PanelShell } from "@/components/ui/panel-shell";
import { StatCard } from "@/components/ui/stat-card";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function RelatoriosPage() {
  await requireUser();

  const [byCity, bySex, byShirt] = await Promise.all([
    db.family.groupBy({ by: ["city"], _count: { _all: true }, orderBy: { _count: { city: "desc" } }, take: 8 }),
    db.child.groupBy({ by: ["sex"], _count: { _all: true } }),
    db.child.groupBy({ by: ["shirtSize"], _count: { _all: true } }),
  ]);

  return (
    <PanelShell
      title="Relatórios e exportação"
      subtitle="Visão operacional de demografia, logística, marketing e consentimentos."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {bySex.map((item) => (
          <StatCard key={item.sex} label={`Sexo ${item.sex}`} value={item._count._all} />
        ))}
      </div>

      <section className="mt-6 grid gap-4 md:grid-cols-2">
        <article className="rounded-[28px] border border-slate-200 bg-white/80 p-5 shadow-[0_20px_35px_rgba(15,23,42,0.06)] backdrop-blur-sm">
          <h2 className="text-lg font-black text-slate-900">Distribuição por cidade</h2>
          <ul className="mt-4 space-y-2 text-sm text-slate-700">
            {byCity.map((item) => (
              <li key={item.city} className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2.5">
                <span>{item.city}</span>
                <strong>{item._count._all}</strong>
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-[28px] border border-slate-200 bg-white/80 p-5 shadow-[0_20px_35px_rgba(15,23,42,0.06)] backdrop-blur-sm">
          <h2 className="text-lg font-black text-slate-900">Tamanhos de camiseta</h2>
          <ul className="mt-4 space-y-2 text-sm text-slate-700">
            {byShirt.map((item) => (
              <li key={`${item.shirtSize}`} className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2.5">
                <span>{item.shirtSize || "Não informado"}</span>
                <strong>{item._count._all}</strong>
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="mt-6 rounded-[30px] border border-slate-200 bg-white/80 p-5 shadow-[0_20px_35px_rgba(15,23,42,0.06)] backdrop-blur-sm">
        <h2 className="text-lg font-black text-slate-900">Exportações</h2>
        <p className="mt-1 text-sm text-slate-600">Baixe os dados do evento para análise externa.</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/api/export/csv" className="rounded-2xl bg-[linear-gradient(135deg,#0f172a,#1d4ed8)] px-4 py-2.5 text-sm font-black text-white shadow-[0_12px_24px_rgba(29,78,216,0.28)]">
            Exportar CSV
          </Link>
          <Link href="/api/export/pdf" className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-black text-slate-800 shadow-sm">
            Exportar PDF
          </Link>
        </div>
      </section>
    </PanelShell>
  );
}
