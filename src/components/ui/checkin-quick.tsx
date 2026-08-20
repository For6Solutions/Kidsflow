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
    if (item.type !== "child") {
      setMessage("Selecione uma criança para check-in.");
      return;
    }

    setLoading(true);
    setMessage("Registrando chegada...");

    const response = await fetch("/api/checkin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ childId: item.id }),
    });

    const data = (await response.json()) as { checkedInAt?: string; error?: string };

    if (!response.ok) {
      setMessage(data.error || "Erro ao registrar check-in");
      setLoading(false);
      return;
    }

    setMessage(`Check-in confirmado para ${item.label}.`);
    setLoading(false);
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-bold text-slate-900">Check-in rápido</h2>
      <p className="mt-1 text-sm text-slate-600">Busque pelo nome e toque para registrar presença.</p>
      <div className="mt-4">
        <AutocompleteSearch onSelect={handleSelect} placeholder="Buscar criança para check-in" />
      </div>
      <p className="mt-4 text-sm text-slate-700">{loading ? "Aguarde..." : message}</p>
    </section>
  );
}
