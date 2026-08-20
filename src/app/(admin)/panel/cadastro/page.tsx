import { FamilyRegistrationForm } from "@/components/forms/family-registration-form";
import { AutocompleteSearch } from "@/components/ui/autocomplete-search";
import { PanelShell } from "@/components/ui/panel-shell";

export default function CadastroPage() {
  return (
    <PanelShell
      title="Cadastro por etapas"
      subtitle="Fluxo completo com validação para evitar duplicidade e manter qualidade dos dados."
    >
      <div className="space-y-4">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">Passo 1: buscar família existente</h2>
          <p className="mt-1 text-sm text-slate-600">Use autocompletar por nome, CPF ou telefone.</p>
          <div className="mt-4">
            <AutocompleteSearch />
          </div>
        </section>
        <FamilyRegistrationForm />
      </div>
    </PanelShell>
  );
}
