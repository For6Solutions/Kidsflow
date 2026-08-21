import { FamilyRegistrationForm } from "@/components/forms/family-registration-form";
import { PanelShell } from "@/components/ui/panel-shell";

export default function CadastroPage() {
  return (
    <PanelShell
      title="Cadastro de criança"
      subtitle="Registre apenas o essencial e reaproveite famílias já conhecidas."
    >
      <FamilyRegistrationForm />
    </PanelShell>
  );
}
