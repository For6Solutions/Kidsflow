import { CheckInQuick } from "@/components/ui/checkin-quick";
import { PanelShell } from "@/components/ui/panel-shell";

export default function CheckinPage() {
  return (
    <PanelShell
      title="Check-in rápido"
      subtitle="Tela otimizada para celular e uso no dia do evento."
    >
      <CheckInQuick />
    </PanelShell>
  );
}
