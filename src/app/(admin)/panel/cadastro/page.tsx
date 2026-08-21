import { FamilyRegistrationForm } from "@/components/forms/family-registration-form";
import { PanelShell } from "@/components/ui/panel-shell";
import { requireUser } from "@/lib/auth";

export default async function CadastroPage() {
  await requireUser();

  return (
    <PanelShell
      title="Cadastro de criança"
      subtitle="Registre apenas o essencial e reaproveite famílias já conhecidas."
    >
      <FamilyRegistrationForm />
    </PanelShell>
  );
}
