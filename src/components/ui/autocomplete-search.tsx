"use client";

import { useEffect, useState } from "react";

type SearchItem = {
  type: string;
  id: string;
  label: string;
  familyId: string;
  phone?: string;
  relationship?: string;
};

type Props = {
  placeholder?: string;
  allowedTypes?: string[];
  onSelect?: (item: SearchItem) => void;
};

export function AutocompleteSearch({ placeholder, allowedTypes, onSelect }: Props) {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<SearchItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const allowedTypesKey = allowedTypes?.join(",") ?? "";

  useEffect(() => {
    const controller = new AbortController();

    const timeout = setTimeout(async () => {
      if (query.trim().length < 2) {
        setItems([]);
        setError("");
        return;
      }

      setLoading(true);
      setError("");
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`, { signal: controller.signal });
        if (!response.ok) {
          throw new Error("Busca indisponível");
        }
        const data = (await response.json()) as { items: SearchItem[] };
        setItems((data.items || []).filter((item) => !allowedTypes || allowedTypes.includes(item.type)));
      } catch (requestError) {
        if (requestError instanceof DOMException && requestError.name === "AbortError") {
          return;
        }
        setItems([]);
        setError("Não foi possível buscar agora.");
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [allowedTypesKey, query, allowedTypes]);

  return (
    <div className="relative">
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={placeholder ?? "Buscar família, responsável ou criança"}
        aria-autocomplete="list"
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none ring-cyan-300 transition focus:ring"
      />

      {loading ? <p className="mt-2 text-xs text-slate-500">Buscando...</p> : null}
      {error ? <p className="mt-2 text-xs text-rose-600">{error}</p> : null}

      {items.length > 0 ? (
        <ul role="listbox" className="absolute z-20 mt-2 w-full rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
          {items.map((item) => (
            <li key={`${item.type}-${item.id}`} role="option" aria-selected="false">
              <button
                type="button"
                className="w-full rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100"
                onClick={() => {
                  setQuery(item.relationship ? `${item.label} — ${item.relationship}` : item.label);
                  setItems([]);
                  onSelect?.(item);
                }}
              >
                {item.label} <span className="text-xs text-slate-400">({item.type === "guardian" ? "responsável" : item.type})</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
