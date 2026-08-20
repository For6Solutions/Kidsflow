import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { jsPDF } from "jspdf";

import { db } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session.userId) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const families = await db.family.findMany({
    include: {
      children: true,
      guardians: true,
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  const doc = new jsPDF();
  doc.setFontSize(14);
  doc.text("Kidsflow - Relatório de Famílias", 14, 16);

  let line = 28;
  doc.setFontSize(10);

  for (const family of families) {
    const row = `${family.familyLabel || "Família"} | ${family.city}/${family.state} | Crianças: ${family.children.length}`;
    doc.text(row.slice(0, 180), 14, line);
    line += 6;

    if (line > 280) {
      doc.addPage();
      line = 20;
    }
  }

  const bytes = doc.output("arraybuffer");

  return new NextResponse(bytes, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=kidsflow-relatorio.pdf",
    },
  });
}
