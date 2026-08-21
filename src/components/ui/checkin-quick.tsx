"use client";

import { useState } from "react";

import { AutocompleteSearch } from "@/components/ui/autocomplete-search";

type SearchItem = {
  type: string;
  id: string;
  label: string;
  familyId: string;
};

export function CheckInQuick() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSelect(item: SearchItem) {
    if (loading) return;

    if (item.type !== "child") {
      setMessage("Selecione uma criança para check-in.");
      return;
    }

    setLoading(true);
    setMessage("Registrando chegada...");

    try {
      const response = await fetch("/api/checkin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ childId: item.id }),
      });

      const data = (await response.json().catch(() => ({}))) as { checkedInAt?: string; error?: string };

      if (!response.ok) {
        setMessage(data.error || "Erro ao registrar check-in");
        return;
      }

      setMessage(`Check-in confirmado para ${item.label}.`);
    } catch {
      setMessage("Não foi possível registrar o check-in agora.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-[30px] border border-slate-200 bg-white/80 p-5 shadow-[0_24px_60px_rgba(15,23,42,0.07)] backdrop-blur-sm md:p-6">
      <div className="mb-4">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-emerald-700">Check-in</p>
        <h2 className="mt-2 text-2xl font-black text-slate-900">Check-in rápido</h2>
      </div>
      <p className="text-sm text-slate-600">Busque pelo nome e toque para registrar presença.</p>
      <div className="mt-5">
        <AutocompleteSearch onSelect={handleSelect} placeholder="Buscar criança para check-in" />
      </div>
      <p aria-live="polite" className="mt-5 rounded-2xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">{loading ? "Aguarde..." : message || "Pronto para registrar a próxima presença."}</p>
    </section>
  );
}
