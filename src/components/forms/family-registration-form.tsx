"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

import { createFamilySchema } from "@/lib/validation";

type FormData = z.infer<typeof createFamilySchema>;

const defaultValues: FormData = {
  familyLabel: "",
  zipCode: "",
  street: "",
  number: "",
  complement: "",
  neighborhood: "",
  city: "",
  state: "",
  guardians: [
    {
      fullName: "",
      cpf: "",
      phone: "",
      email: "",
      relationship: "",
    },
  ],
  children: [
    {
      fullName: "",
      nickname: "",
      birthDate: "",
      sex: "NOT_INFORMED",
      school: "",
      schoolGrade: "",
      unitClass: "",
      allergies: "",
      foodRestriction: "",
      continuousMedication: false,
      medicationDetails: "",
      hasHealthCondition: false,
      healthConditionDetails: "",
      specialAttentionNeeds: "",
      generalNotes: "",
      shirtSize: "P",
      eventDiscoveryChannel: "",
      imageConsent: "GRANTED",
      lgpdConsent: false,
      interests: [""],
    },
  ],
  emergencyContacts: [
    {
      fullName: "",
      phone: "",
    },
  ],
  authorizedPickups: [
    {
      fullName: "",
      document: "",
      phone: "",
    },
  ],
};

export function FamilyRegistrationForm() {
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState<string>("");

  const form = useForm<FormData>({
    resolver: zodResolver(createFamilySchema) as never,
    defaultValues,
    mode: "onBlur",
  });

  const guardians = useFieldArray({
    control: form.control,
    name: "guardians",
  });

  const children = useFieldArray({
    control: form.control,
    name: "children",
  });

  const emergencyContacts = useFieldArray({
    control: form.control,
    name: "emergencyContacts",
  });

  const authorizedPickups = useFieldArray({
    control: form.control,
    name: "authorizedPickups",
  });

  async function fillByCep() {
    const cep = form.getValues("zipCode");
    if (!cep) return;

    const response = await fetch(`/api/viacep?cep=${encodeURIComponent(cep)}`);
    const data = (await response.json()) as {
      street?: string;
      neighborhood?: string;
      city?: string;
      state?: string;
      complement?: string;
      error?: string;
    };

    if (data.error) {
      setStatus(data.error);
      return;
    }

    form.setValue("street", data.street || "");
    form.setValue("neighborhood", data.neighborhood || "");
    form.setValue("city", data.city || "");
    form.setValue("state", data.state || "");
    if (data.complement) {
      form.setValue("complement", data.complement);
    }
  }

  async function submit(data: FormData) {
    setStatus("Salvando cadastro...");
    const response = await fetch("/api/families", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const err = (await response.json()) as { error?: string };
      setStatus(err.error || "Erro ao salvar");
      return;
    }

    setStatus("Cadastro salvo com sucesso.");
    form.reset(defaultValues);
    setStep(1);
  }

  return (
    <form onSubmit={form.handleSubmit(submit)} className="space-y-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="flex flex-wrap gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((number) => (
          <button
            key={number}
            type="button"
            onClick={() => setStep(number)}
            className={`rounded-full px-3 py-1 text-xs font-bold ${step === number ? "bg-cyan-500 text-white" : "bg-slate-100 text-slate-700"}`}
          >
            Passo {number}
          </button>
        ))}
      </div>

      {step === 1 ? (
        <section className="grid gap-4 md:grid-cols-2">
          <label className="text-sm">
            CEP
            <div className="mt-1 flex gap-2">
              <input className="w-full rounded-lg border border-slate-300 px-3 py-2" {...form.register("zipCode")} />
              <button type="button" className="rounded-lg bg-slate-900 px-4 py-2 text-white" onClick={fillByCep}>
                ViaCEP
              </button>
            </div>
          </label>
          <label className="text-sm">
            Família / etiqueta
            <input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" {...form.register("familyLabel")} />
          </label>
          <label className="text-sm md:col-span-2">
            Rua
            <input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" {...form.register("street")} />
          </label>
          <label className="text-sm">
            Numero
            <input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" {...form.register("number")} />
          </label>
          <label className="text-sm">
            Complemento
            <input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" {...form.register("complement")} />
          </label>
          <label className="text-sm">
            Bairro
            <input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" {...form.register("neighborhood")} />
          </label>
          <label className="text-sm">
            Cidade
            <input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" {...form.register("city")} />
          </label>
          <label className="text-sm">
            UF
            <input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" {...form.register("state")} />
          </label>
        </section>
      ) : null}

      {step === 2 ? (
        <section className="space-y-4">
          {guardians.fields.map((field, index) => (
            <div key={field.id} className="grid gap-3 rounded-xl border border-slate-200 p-4 md:grid-cols-2">
              <label className="text-sm md:col-span-2">
                Nome completo
                <input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" {...form.register(`guardians.${index}.fullName`)} />
              </label>
              <label className="text-sm">
                CPF
                <input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" {...form.register(`guardians.${index}.cpf`)} />
              </label>
              <label className="text-sm">
                Telefone
                <input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" {...form.register(`guardians.${index}.phone`)} />
              </label>
              <label className="text-sm">
                E-mail
                <input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" {...form.register(`guardians.${index}.email`)} />
              </label>
              <label className="text-sm">
                Parentesco
                <input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" {...form.register(`guardians.${index}.relationship`)} />
              </label>
            </div>
          ))}

          <button
            type="button"
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm"
            onClick={() => guardians.append({ fullName: "", cpf: "", phone: "", email: "", relationship: "" })}
          >
            + Adicionar responsável
          </button>
        </section>
      ) : null}

      {step === 3 ? (
        <section className="space-y-4">
          {children.fields.map((field, index) => (
            <div key={field.id} className="grid gap-3 rounded-xl border border-slate-200 p-4 md:grid-cols-2">
              <label className="text-sm md:col-span-2">
                Nome da criança
                <input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" {...form.register(`children.${index}.fullName`)} />
              </label>
              <label className="text-sm">
                Apelido
                <input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" {...form.register(`children.${index}.nickname`)} />
              </label>
              <label className="text-sm">
                Data de nascimento
                <input type="date" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" {...form.register(`children.${index}.birthDate`)} />
              </label>
              <label className="text-sm">
                Sexo
                <select className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" {...form.register(`children.${index}.sex`)}>
                  <option value="NOT_INFORMED">Não informado</option>
                  <option value="FEMALE">Feminino</option>
                  <option value="MALE">Masculino</option>
                  <option value="OTHER">Outro</option>
                </select>
              </label>
              <label className="text-sm">
                Escola
                <input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" {...form.register(`children.${index}.school`)} />
              </label>
              <label className="text-sm">
                Série/Ano
                <input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" {...form.register(`children.${index}.schoolGrade`)} />
              </label>
              <label className="text-sm">
                Unidade/Turma
                <input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" {...form.register(`children.${index}.unitClass`)} />
              </label>
            </div>
          ))}

          <button
            type="button"
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm"
            onClick={() =>
              children.append({
                fullName: "",
                nickname: "",
                birthDate: "",
                sex: "NOT_INFORMED",
                school: "",
                schoolGrade: "",
                unitClass: "",
                allergies: "",
                foodRestriction: "",
                continuousMedication: false,
                medicationDetails: "",
                hasHealthCondition: false,
                healthConditionDetails: "",
                specialAttentionNeeds: "",
                generalNotes: "",
                shirtSize: "P",
                eventDiscoveryChannel: "",
                imageConsent: "GRANTED",
                lgpdConsent: false,
                interests: [""],
              })
            }
          >
            + Adicionar criança
          </button>
        </section>
      ) : null}

      {step === 4 ? (
        <section className="space-y-4">
          {emergencyContacts.fields.map((field, index) => (
            <div key={field.id} className="grid gap-3 rounded-xl border border-slate-200 p-4 md:grid-cols-2">
              <label className="text-sm">
                Contato emergencia
                <input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" {...form.register(`emergencyContacts.${index}.fullName`)} />
              </label>
              <label className="text-sm">
                Telefone
                <input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" {...form.register(`emergencyContacts.${index}.phone`)} />
              </label>
            </div>
          ))}

          <button
            type="button"
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm"
            onClick={() => emergencyContacts.append({ fullName: "", phone: "" })}
          >
            + Adicionar contato
          </button>
        </section>
      ) : null}

      {step === 5 ? (
        <section className="space-y-4">
          <p className="text-sm text-slate-600">Preencha dados de saúde na seção de cada criança.</p>
          {children.fields.map((field, index) => (
            <div key={field.id} className="grid gap-3 rounded-xl border border-slate-200 p-4 md:grid-cols-2">
              <label className="text-sm md:col-span-2">
                Alergias / restrição alimentar ({index + 1})
                <input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" {...form.register(`children.${index}.allergies`)} />
              </label>
              <label className="text-sm">
                Medicação contínua
                <input type="checkbox" className="ml-2" {...form.register(`children.${index}.continuousMedication`)} />
              </label>
              <label className="text-sm">
                Condição de saúde relevante
                <input type="checkbox" className="ml-2" {...form.register(`children.${index}.hasHealthCondition`)} />
              </label>
              <label className="text-sm md:col-span-2">
                Detalhes de medicação
                <input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" {...form.register(`children.${index}.medicationDetails`)} />
              </label>
              <label className="text-sm md:col-span-2">
                Necessidade especial de atenção
                <input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" {...form.register(`children.${index}.specialAttentionNeeds`)} />
              </label>
            </div>
          ))}
        </section>
      ) : null}

      {step === 6 ? (
        <section className="space-y-4">
          {children.fields.map((field, index) => (
            <div key={field.id} className="grid gap-3 rounded-xl border border-slate-200 p-4 md:grid-cols-2">
              <label className="text-sm">
                Atividades (separe por virgula)
                <input
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                  onBlur={(event) => {
                    const parsed = event.target.value
                      .split(",")
                      .map((item) => item.trim())
                      .filter(Boolean);
                    form.setValue(`children.${index}.interests`, parsed);
                  }}
                />
              </label>
              <label className="text-sm">
                Tamanho camiseta
                <select className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" {...form.register(`children.${index}.shirtSize`)}>
                  <option value="PP">PP</option>
                  <option value="P">P</option>
                  <option value="M">M</option>
                  <option value="G">G</option>
                </select>
              </label>
              <label className="text-sm md:col-span-2">
                Como ficou sabendo do evento
                <input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" {...form.register(`children.${index}.eventDiscoveryChannel`)} />
              </label>
            </div>
          ))}
        </section>
      ) : null}

      {step === 7 ? (
        <section className="space-y-4">
          {children.fields.map((field, index) => (
            <div key={field.id} className="grid gap-3 rounded-xl border border-slate-200 p-4 md:grid-cols-2">
              <label className="text-sm">
                Autoriza uso de imagem
                <select className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" {...form.register(`children.${index}.imageConsent`)}>
                  <option value="GRANTED">Sim</option>
                  <option value="DENIED">Não</option>
                </select>
              </label>
              <label className="text-sm">
                Aceite LGPD (obrigatório)
                <input type="checkbox" className="ml-2" {...form.register(`children.${index}.lgpdConsent`)} />
              </label>
            </div>
          ))}

          {authorizedPickups.fields.map((field, index) => (
            <div key={field.id} className="grid gap-3 rounded-xl border border-slate-200 p-4 md:grid-cols-3">
              <label className="text-sm">
                Autorizado retirada
                <input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" {...form.register(`authorizedPickups.${index}.fullName`)} />
              </label>
              <label className="text-sm">
                Documento
                <input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" {...form.register(`authorizedPickups.${index}.document`)} />
              </label>
              <label className="text-sm">
                Telefone
                <input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" {...form.register(`authorizedPickups.${index}.phone`)} />
              </label>
            </div>
          ))}
        </section>
      ) : null}

      {step === 8 ? (
        <section className="rounded-xl border border-cyan-200 bg-cyan-50 p-4 text-sm text-cyan-900">
          <h3 className="text-base font-bold">Confirmacao final</h3>
          <p className="mt-2">Revise os dados e clique em salvar cadastro.</p>
          <p className="mt-2">Famílias: 1 | Responsáveis: {guardians.fields.length} | Crianças: {children.fields.length}</p>
        </section>
      ) : null}

      {Object.keys(form.formState.errors).length > 0 ? (
        <p className="text-sm text-rose-600">Existem campos inválidos. Verifique antes de salvar.</p>
      ) : null}

      {status ? <p className="text-sm text-slate-700">{status}</p> : null}

      <div className="flex gap-3">
        <button type="button" className="rounded-lg border border-slate-300 px-4 py-2" onClick={() => setStep((s) => Math.max(1, s - 1))}>
          Voltar
        </button>
        <button type="button" className="rounded-lg border border-slate-300 px-4 py-2" onClick={() => setStep((s) => Math.min(8, s + 1))}>
          Próximo
        </button>
        <button type="submit" className="rounded-lg bg-slate-900 px-4 py-2 font-semibold text-white">
          Salvar cadastro
        </button>
      </div>
    </form>
  );
}
