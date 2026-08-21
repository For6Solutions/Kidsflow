import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { jsPDF } from "jspdf";

import { db } from "@/lib/db";

function formatDate(value: Date | string | null) {
  if (!value) return "—";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("pt-BR");
}

function joinGuardians(guardians: { fullName: string; relationship: string | null }[]) {
  return guardians
    .map((guardian) => `${guardian.fullName}${guardian.relationship ? ` (${guardian.relationship})` : ""}`)
    .join("; ") || "—";
}

export async function GET() {
  const session = await auth();
  if (!session.userId) {
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
    take: 120,
  });

  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 42;

  doc.setFillColor(15, 118, 110);
  doc.rect(0, 0, pageWidth, 72, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("Kidsflow", margin, 36);

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text("Relatório de cadastro", margin, 56);

  const summaryY = 100;
  const summaryCardWidth = (pageWidth - margin * 2 - 18) / 3;
  const summaryCards = [
    { label: "Crianças", value: String(children.length) },
    { label: "Famílias", value: String(new Set(children.map((child) => child.familyId)).size) },
    { label: "Cidades", value: String(new Set(children.map((child) => child.family.city)).size) },
  ];

  summaryCards.forEach((card, index) => {
    const x = margin + index * (summaryCardWidth + 9);
    doc.setFillColor(245, 247, 250);
    doc.roundedRect(x, summaryY, summaryCardWidth, 52, 8, 8, "F");
    doc.setTextColor(71, 85, 105);
    doc.setFontSize(10);
    doc.text(card.label, x + 16, summaryY + 18);
    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text(card.value, x + 16, summaryY + 40);
  });

  let y = 188;

  children.forEach((child, index) => {
    if (y > pageHeight - 120) {
      doc.addPage();
      y = 52;
    }

    const guardianText = joinGuardians(child.family.guardians);
    const cardHeight = 86;

    doc.setDrawColor(226, 232, 240);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(margin, y, pageWidth - margin * 2, cardHeight, 10, 10, "FD");

    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(`${index + 1}. ${child.fullName}`, margin + 16, y + 22);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105);

    const lines = [
      `Apelido: ${child.nickname || "—"}`,
      `Nascimento: ${formatDate(child.birthDate)}`,
      `Sexo: ${child.sex}`,
      `Responsável: ${guardianText}`,
      `Família: ${child.family.familyLabel || child.family.city}`,
      `Cidade/UF: ${child.family.city} / ${child.family.state}`,
    ];

    lines.forEach((line, lineIndex) => {
      doc.text(line, margin + 16, y + 40 + lineIndex * 14);
    });

    y += cardHeight + 14;
  });

  return new NextResponse(doc.output("arraybuffer"), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=kidsflow-relatorio.pdf",
    },
  });
}