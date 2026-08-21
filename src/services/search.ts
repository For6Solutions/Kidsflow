import { db } from "@/lib/db";

export async function globalSearch(query: string) {
  const q = query.trim();
  if (!q) return [];

  const [families, guardians, children] = await Promise.all([
    db.family.findMany({
      where: {
        OR: [
          { familyLabel: { contains: q, mode: "insensitive" } },
          { city: { contains: q, mode: "insensitive" } },
          { zipCode: { contains: q, mode: "insensitive" } },
        ],
      },
      take: 6,
      select: { id: true, familyLabel: true, city: true },
      orderBy: { createdAt: "desc" },
    }),
    db.guardian.findMany({
      where: {
        OR: [
          { fullName: { contains: q, mode: "insensitive" } },
          { cpf: { contains: q, mode: "insensitive" } },
          { phone: { contains: q, mode: "insensitive" } },
        ],
      },
      take: 8,
      select: { id: true, fullName: true, familyId: true, phone: true, relationship: true },
      orderBy: { createdAt: "desc" },
    }),
    db.child.findMany({
      where: { fullName: { contains: q, mode: "insensitive" } },
      take: 8,
      select: { id: true, fullName: true, familyId: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return [
    ...families.map((item) => ({
      type: "family",
      id: item.id,
      label: item.familyLabel || `Família ${item.city}`,
      familyId: item.id,
    })),
    ...guardians.map((item) => ({
      type: "guardian",
      id: item.id,
      label: item.relationship ? `${item.fullName} — ${item.relationship}` : item.fullName,
      familyId: item.familyId,
      phone: item.phone,
      relationship: item.relationship,
    })),
    ...children.map((item) => ({
      type: "child",
      id: item.id,
      label: item.fullName,
      familyId: item.familyId,
    })),
  ].slice(0, 15);
}
