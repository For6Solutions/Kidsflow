import { NextResponse } from "next/server";

import { getAuthenticatedUserId } from "@/lib/auth";
import { db } from "@/lib/db";

const PAGE_WIDTH = 595;
const PAGE_HEIGHT = 842;
const PAGE_MARGIN = 42;

function formatDate(value: Date | string | null) {
  if (!value) return "—";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("pt-BR");
}

function joinGuardians(guardians: { fullName: string; relationship: string | null }[]) {
  return (
    guardians
      .map((guardian) => `${guardian.fullName}${guardian.relationship ? ` (${guardian.relationship})` : ""}`)
      .join("; ") || "—"
  );
}

function toPdfText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\x20-\x7E]/g, "?")
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");
}

function drawText(text: string, x: number, y: number, fontSize: number) {
  return `BT /F1 ${fontSize} Tf ${x} ${y} Td (${toPdfText(text)}) Tj ET`;
}

function createPdf(pages: string[][]) {
  const pageCount = Math.max(pages.length, 1);
  const pageObjectIds = pages.map((_, index) => 4 + index * 2);
  const objects = new Array<string>(3 + pageCount * 2);

  objects[0] = "<< /Type /Catalog /Pages 2 0 R >>";
  objects[1] = `<< /Type /Pages /Kids [${pageObjectIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pageCount} >>`;
  objects[2] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>";

  pages.forEach((lines, pageIndex) => {
    const pageObjectId = 4 + pageIndex * 2;
    const contentObjectId = pageObjectId + 1;
    let y = PAGE_HEIGHT - PAGE_MARGIN;
    const commands = [
      "0.07 0.46 0.43 rg 42 815 511 2 re f",
      drawText("Kidsflow", PAGE_MARGIN, y, pageIndex === 0 ? 18 : 12),
    ];
    y -= pageIndex === 0 ? 28 : 22;

    lines.forEach((line, lineIndex) => {
      const isTitle = pageIndex === 0 && lineIndex === 0;
      const fontSize = isTitle ? 18 : line.startsWith("Relatorio") ? 11 : 9;
      commands.push(drawText(line, PAGE_MARGIN, y, fontSize));
      y -= isTitle ? 24 : line ? 14 : 8;
    });

    const content = commands.join("\n");
    objects[pageObjectId - 1] =
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}] ` +
      `/Resources << /Font << /F1 3 0 R >> >> /Contents ${contentObjectId} 0 R >>`;
    objects[contentObjectId - 1] = `<< /Length ${content.length} >>\nstream\n${content}\nendstream`;
  });

  let pdf = "%PDF-1.4\n";
  const offsets = [0];

  objects.forEach((object, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });

  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return new TextEncoder().encode(pdf);
}

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
    take: 120,
  });

  const familyCount = new Set(children.map((child) => child.familyId)).size;
  const cityCount = new Set(children.map((child) => child.family.city)).size;
  const rows = [
    "Relatorio de cadastro",
    `Resumo: ${children.length} criancas | ${familyCount} familias | ${cityCount} cidades`,
    "",
  ];

  children.forEach((child, index) => {
    rows.push(`${index + 1}. ${child.fullName}`);
    rows.push(`Nascimento: ${formatDate(child.birthDate)} | Sexo: ${child.sex}`);
    rows.push(`Responsavel: ${joinGuardians(child.family.guardians)}`);
    rows.push(`Familia: ${child.family.familyLabel || child.family.city} | Cidade/UF: ${child.family.city} / ${child.family.state}`);
    rows.push("");
  });

  const pageSize = 48;
  const pages = Array.from({ length: Math.max(1, Math.ceil(rows.length / pageSize)) }, (_, index) =>
    rows.slice(index * pageSize, (index + 1) * pageSize),
  );

  return new NextResponse(createPdf(pages), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=kidsflow-relatorio.pdf",
    },
  });
}
