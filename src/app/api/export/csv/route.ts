import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session.userId) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const children = await db.child.findMany({
    include: {
      family: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const header = [
    "Criança",
    "Apelido",
    "Nascimento",
    "Sexo",
    "Família",
    "Cidade",
    "UF",
    "Restricoes",
    "Saúde",
    "AutorizaçãoImagem",
  ];

  const lines = children.map((child) => {
    const values = [
      child.fullName,
      child.nickname ?? "",
      child.birthDate.toISOString().slice(0, 10),
      child.sex,
      child.family.familyLabel ?? "",
      child.family.city,
      child.family.state,
      child.foodRestriction ?? child.allergies ?? "",
      child.healthConditionDetails ?? child.medicationDetails ?? "",
      child.imageConsent,
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
