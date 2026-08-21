"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { AutocompleteSearch } from "@/components/ui/autocomplete-search";
import { createFamilySchema } from "@/lib/validation";

type FormData = z.infer<typeof createFamilySchema>;

const defaultValues: FormData = {
  existingFamilyId: undefined,
  existingGuardianId: undefined,
  zipCode: "",
  street: "",
  number: "",
  neighborhood: "",
  city: "",
  state: "",
  child: { fullName: "", birthDate: "", imageConsent: "GRANTED", lgpdConsent: false },
  guardian: { fullName: "", relationship: "", phone: "" },
};

function getAge(birthDate: string) {
  if (!birthDate) return null;
  const birth = new Date(`${birthDate}T00:00:00`);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const birthdayHasPassed = today.getMonth() > birth.getMonth() || (today.getMonth() === birth.getMonth() && today.getDate() >= birth.getDate());
  if (!birthdayHasPassed) age -= 1;
  return age >= 0 ? age : null;
}

export function FamilyRegistrationForm() {
  const [status, setStatus] = useState("");
  const [cepLoading, setCepLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const form = useForm<FormData>({ resolver: zodResolver(createFamilySchema) as never, defaultValues, mode: "onBlur" });
  const age = getAge(useWatch({ control: form.control, name: "child.birthDate" }));
  const guardianName = form.register("guardian.fullName");

  async function fillByCep() {
    const cep = form.getValues("zipCode");
    if (!cep) return;
    setCepLoading(true);

    try {
      const response = await fetch(`/api/viacep?cep=${encodeURIComponent(cep)}`);
      const data = (await response.json()) as { street?: string; neighborhood?: string; city?: string; state?: string; error?: string };
      if (!response.ok || data.error) {
        setStatus(data.error || "Não foi possível consultar o CEP.");
        return;
      }

      form.setValue("street", data.street || "", { shouldValidate: true });
      form.setValue("neighborhood", data.neighborhood || "", { shouldValidate: true });
      form.setValue("city", data.city || "", { shouldValidate: true });
      form.setValue("state", data.state || "", { shouldValidate: true });
      setStatus("Endereço preenchido pelo ViaCEP.");
    } catch {
      setStatus("Não foi possível consultar o CEP agora.");
    } finally {
      setCepLoading(false);
    }
  }

  async function submit(data: FormData) {
    setStatus("Salvando cadastro...");
    setSubmitting(true);

    try {
      const response = await fetch("/api/families", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const result = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) {
        setStatus(result.error || "Erro ao salvar");
        return;
      }

      setStatus("Cadastro salvo com sucesso.");
      form.reset(defaultValues);
    } catch {
      setStatus("Não foi possível salvar agora. Verifique a conexão e tente novamente.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(submit)} className="space-y-6 rounded-[32px] border border-slate-200 bg-white/80 p-4 shadow-[0_24px_60px_rgba(15,23,42,0.07)] backdrop-blur-sm sm:p-6">
      <section className="rounded-[28px] border border-slate-200 bg-slate-50/80 p-4 sm:p-5">
        <div className="mb-4"><p className="text-[10px] font-black uppercase tracking-[0.22em] text-emerald-700">Criança</p><h2 className="mt-2 text-xl font-black text-slate-900">Dados principais</h2></div>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm font-bold text-slate-700 md:col-span-2">Nome completo<input className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-slate-900 outline-none ring-0 transition focus:border-sky-400 focus:shadow-[0_0_0_4px_rgba(14,165,233,0.12)]" {...form.register("child.fullName")} /></label>
          <label className="text-sm font-bold text-slate-700">Data de nascimento<input type="date" className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-slate-900 outline-none transition focus:border-sky-400 focus:shadow-[0_0_0_4px_rgba(14,165,233,0.12)]" {...form.register("child.birthDate")} /></label>
          <label className="text-sm font-bold text-slate-700">Idade<input value={age === null ? "" : `${age} anos`} readOnly placeholder="Calculada automaticamente" className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-100 px-3 py-3 text-slate-500" /></label>
        </div>
      </section>

      <section className="rounded-[28px] border border-slate-200 bg-slate-50/80 p-4 sm:p-5">
        <div className="mb-4"><p className="text-[10px] font-black uppercase tracking-[0.22em] text-emerald-700">Endereço</p><h2 className="mt-2 text-xl font-black text-slate-900">Onde a família mora</h2></div>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm font-bold text-slate-700">CEP<div className="mt-2 flex gap-2"><input className="min-w-0 w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-slate-900 outline-none transition focus:border-sky-400 focus:shadow-[0_0_0_4px_rgba(14,165,233,0.12)]" {...form.register("zipCode")} /><button type="button" disabled={cepLoading} className="rounded-2xl bg-[linear-gradient(135deg,#0ea5e9,#2563eb)] px-4 py-3 text-sm font-black text-white shadow-[0_12px_20px_rgba(37,99,235,0.35)] disabled:cursor-wait disabled:opacity-60" onClick={fillByCep}>{cepLoading ? "Buscando..." : "ViaCEP"}</button></div></label>
          <label className="text-sm font-bold text-slate-700">Número<input className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-slate-900 outline-none transition focus:border-sky-400 focus:shadow-[0_0_0_4px_rgba(14,165,233,0.12)]" {...form.register("number")} /></label>
          <label className="text-sm font-bold text-slate-700 md:col-span-2">Endereço<input className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-slate-900 outline-none transition focus:border-sky-400 focus:shadow-[0_0_0_4px_rgba(14,165,233,0.12)]" {...form.register("street")} /></label>
          <label className="text-sm font-bold text-slate-700">Cidade<input className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-slate-900 outline-none transition focus:border-sky-400 focus:shadow-[0_0_0_4px_rgba(14,165,233,0.12)]" {...form.register("city")} /></label>
          <label className="text-sm font-bold text-slate-700">Bairro<input className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-slate-900 outline-none transition focus:border-sky-400 focus:shadow-[0_0_0_4px_rgba(14,165,233,0.12)]" {...form.register("neighborhood")} /></label>
        </div>
      </section>

      <section className="rounded-[28px] border border-slate-200 bg-slate-50/80 p-4 sm:p-5">
        <div className="mb-4"><p className="text-[10px] font-black uppercase tracking-[0.22em] text-emerald-700">Responsável</p><h2 className="mt-2 text-xl font-black text-slate-900">Quem cuida da criança</h2><p className="mt-2 text-sm text-slate-500">Busque alguém já cadastrado para manter a mesma família.</p></div>
        <div className="space-y-4">
          <AutocompleteSearch placeholder="Buscar responsável pelo nome ou telefone" allowedTypes={["guardian"]} onSelect={(item) => { form.setValue("existingFamilyId", item.familyId); form.setValue("existingGuardianId", item.id); form.setValue("guardian.fullName", item.label); form.setValue("guardian.phone", item.phone || ""); form.setValue("guardian.relationship", item.relationship || ""); setStatus("Família encontrada. A criança será adicionada a ela."); }} />
          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm font-bold text-slate-700 md:col-span-2">Nome do responsável (menor de 18 anos)<input className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-slate-900 outline-none transition focus:border-sky-400 focus:shadow-[0_0_0_4px_rgba(14,165,233,0.12)]" {...guardianName} onChange={(event) => { guardianName.onChange(event); form.setValue("existingFamilyId", undefined); form.setValue("existingGuardianId", undefined); }} /></label>
            <label className="text-sm font-bold text-slate-700">Parentesco<select className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-slate-900 outline-none transition focus:border-sky-400 focus:shadow-[0_0_0_4px_rgba(14,165,233,0.12)]" {...form.register("guardian.relationship")}><option value="">Selecione</option><option value="Mãe">Mãe</option><option value="Pai">Pai</option><option value="Avó/Avô">Avó/Avô</option><option value="Responsável legal">Responsável legal</option><option value="Outro">Outro</option></select></label>
            <label className="text-sm font-bold text-slate-700">Telefone<input className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-slate-900 outline-none transition focus:border-sky-400 focus:shadow-[0_0_0_4px_rgba(14,165,233,0.12)]" {...form.register("guardian.phone")} /></label>
          </div>
        </div>
      </section>

      <section className="rounded-[28px] border border-slate-200 bg-slate-50/80 p-4 sm:p-5">
        <div className="mb-4"><p className="text-[10px] font-black uppercase tracking-[0.22em] text-emerald-700">Consentimentos</p><h2 className="mt-2 text-xl font-black text-slate-900">Permissões do cadastro</h2><p className="mt-2 text-sm text-slate-500">Registre as escolhas do responsável para manter o evento em conformidade.</p></div>
        <fieldset>
          <legend className="text-sm font-bold text-slate-700">Autoriza o uso de imagem?</legend>
          <div className="mt-3 flex flex-wrap gap-3">
            <label className="flex cursor-pointer items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
              <input type="radio" value="GRANTED" {...form.register("child.imageConsent")} /> Sim, autorizo
            </label>
            <label className="flex cursor-pointer items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
              <input type="radio" value="DENIED" {...form.register("child.imageConsent")} /> Não autorizo
            </label>
          </div>
        </fieldset>
        <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-relaxed text-slate-700">
          <input type="checkbox" className="mt-1" {...form.register("child.lgpdConsent")} />
          <span>Confirmo que o responsável autorizou o tratamento dos dados necessários para a participação no evento.</span>
        </label>
      </section>

      {Object.keys(form.formState.errors).length > 0 ? <p className="text-sm font-medium text-rose-600">Existem campos inválidos. Verifique antes de salvar.</p> : null}
      {status ? <p className="text-sm font-medium text-slate-700">{status}</p> : null}
      <button type="submit" disabled={submitting} className="w-full rounded-[22px] bg-[linear-gradient(135deg,#0ea5e9,#2563eb)] px-5 py-3.5 text-base font-black text-white shadow-[0_18px_28px_rgba(37,99,235,0.32)] transition hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-60">{submitting ? "Salvando..." : "Salvar cadastro"}</button>
    </form>
  );
}
