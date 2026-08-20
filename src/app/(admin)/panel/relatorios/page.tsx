import Link from "next/link";

import { PanelShell } from "@/components/ui/panel-shell";
import { StatCard } from "@/components/ui/stat-card";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function RelatoriosPage() {
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
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">Distribuição por cidade</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            {byCity.map((item) => (
              <li key={item.city} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                <span>{item.city}</span>
                <strong>{item._count._all}</strong>
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">Tamanhos de camiseta</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            {byShirt.map((item) => (
              <li key={`${item.shirtSize}`} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                <span>{item.shirtSize || "Não informado"}</span>
                <strong>{item._count._all}</strong>
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">Exportações</h2>
        <p className="mt-1 text-sm text-slate-600">Baixe os dados do evento para análise externa.</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/api/export/csv" className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
            Exportar CSV
          </Link>
          <Link href="/api/export/pdf" className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">
            Exportar PDF
          </Link>
        </div>
      </section>
    </PanelShell>
  );
}
