type StatCardProps = {
  label: string;
  value: string | number;
  hint?: string;
};

export function StatCard({ label, value, hint }: StatCardProps) {
  return (
    <article className="rounded-[1.35rem] border border-[#18221d]/10 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg hover:shadow-[#18221d]/5">
      <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-[#18221d]/45">{label}</p>
      <p className="mt-3 text-4xl font-extrabold tracking-tight text-[#18221d]">{value}</p>
      {hint ? <p className="mt-1 text-sm font-bold text-[#738a12]">{hint}</p> : null}
    </article>
  );
}
