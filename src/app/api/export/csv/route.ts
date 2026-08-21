import { NextResponse } from "next/server";

import { getAuthenticatedUserId } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const children = await db.child.findMany({
    include: {
      family: {
        include: {
          guardians: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const header = [
    "Criança",
    "Apelido",
    "Nascimento",
    "Sexo",
    "Responsável",
    "Parentesco",
    "Telefone",
    "Família",
    "Cidade",
    "UF",
  ];

  const lines = children.map((child) => {
    const guardian = child.family.guardians[0];
    const values = [
      child.fullName,
      child.nickname ?? "",
      child.birthDate.toISOString().slice(0, 10),
      child.sex,
      guardian?.fullName ?? "",
      guardian?.relationship ?? "",
      guardian?.phone ?? "",
      child.family.familyLabel ?? "",
      child.family.city,
      child.family.state,
    ];

    return values.map((value) => `"${String(value).replaceAll("\"", "\"\"")}"`).join(",");
  });

  const csv = [header.join(","), ...lines].join("\n");

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": "attachment; filename=kidsflow-export.csv",
    },
  });
}
