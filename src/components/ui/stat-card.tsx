type StatCardProps = {
  label: string;
  value: string | number;
  hint?: string;
};

export function StatCard({ label, value, hint }: StatCardProps) {
  return (
    <article className="rounded-[28px] border border-slate-200 bg-white/75 p-5 shadow-[0_20px_35px_rgba(15,23,42,0.06)] backdrop-blur-sm transition hover:-translate-y-1 hover:shadow-[0_24px_40px_rgba(15,23,42,0.10)]">
      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-4 text-4xl font-black tracking-[-0.06em] text-slate-900">{value}</p>
      {hint ? <p className="mt-2 text-sm font-bold text-emerald-700">{hint}</p> : null}
    </article>
  );
}
