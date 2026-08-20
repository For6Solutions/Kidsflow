import { PanelShell } from "@/components/ui/panel-shell";
import { StatCard } from "@/components/ui/stat-card";
import { getDashboardSummary } from "@/services/dashboard";

export const dynamic = "force-dynamic";

export default async function PanelHomePage() {
  const summary = await getDashboardSummary();

  return (
    <PanelShell title="Painel Kidsflow" subtitle="Visão geral de cadastros, check-ins e alertas operacionais.">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Famílias cadastradas" value={summary.totalFamilies} />
        <StatCard label="Crianças cadastradas" value={summary.totalChildren} />
        <StatCard label="Check-ins" value={summary.checkedInChildren} hint={`${summary.attendanceRate}% de comparecimento`} />
        <StatCard label="Alertas de saúde" value={summary.healthAlerts} />
        <StatCard label="Uso de imagem - sim" value={summary.imageGranted} />
        <StatCard label="Uso de imagem - não" value={summary.imageDenied} />
      </div>
    </PanelShell>
  );
}
