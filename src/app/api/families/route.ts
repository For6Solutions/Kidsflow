import { NextRequest, NextResponse } from "next/server";

import { getAuthenticatedUserId } from "@/lib/auth";
import { db } from "@/lib/db";
import { createFamilySchema } from "@/lib/validation";

export async function POST(request: NextRequest) {
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const parsed = createFamilySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Payload inválido", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const data = parsed.data;

  try {
    const family = await db.$transaction(async (tx) => {
      let familyId = data.existingFamilyId;

      if (data.existingGuardianId) {
        const guardian = await tx.guardian.findUnique({
          where: { id: data.existingGuardianId },
          select: { familyId: true },
        });
        if (!guardian || (familyId && guardian.familyId !== familyId)) {
          throw new Error("Responsável inválido");
        }
        familyId = guardian.familyId;
      }

      if (!familyId) {
        const createdFamily = await tx.family.create({
          data: {
            zipCode: data.zipCode,
            street: data.street,
            number: data.number,
            neighborhood: data.neighborhood,
            city: data.city,
            state: data.state,
            createdByUserId: userId,
          },
        });
        familyId = createdFamily.id;

        await tx.guardian.create({
          data: {
            familyId,
            fullName: data.guardian.fullName,
            cpf: `sem-cpf-${createdFamily.id}`,
            phone: data.guardian.phone,
            relationship: data.guardian.relationship,
          },
        });
      } else {
        const existingFamily = await tx.family.findUnique({ where: { id: familyId }, select: { id: true } });
        if (!existingFamily) {
          throw new Error("Família inválida");
        }
      }

      await tx.child.create({
        data: {
          familyId,
          fullName: data.child.fullName,
          birthDate: new Date(data.child.birthDate),
          imageConsent: data.child.imageConsent,
          lgpdConsent: data.child.lgpdConsent,
        },
      });

      return { id: familyId };
    });

    return NextResponse.json({ familyId: family.id }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && ["Responsável inválido", "Família inválida"].includes(error.message)) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.error("Falha ao salvar cadastro de família", error);
    return NextResponse.json({ error: "Não foi possível salvar o cadastro" }, { status: 500 });
  }
}
