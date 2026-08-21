import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";
import { createFamilySchema } from "@/lib/validation";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session.userId) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = createFamilySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Payload inválido", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const data = parsed.data;

  const family = await db.$transaction(async (tx) => {
    let familyId = data.existingFamilyId;

    if (data.existingGuardianId) {
      const guardian = await tx.guardian.findUnique({
        where: { id: data.existingGuardianId },
        select: { familyId: true },
      });
      if (!guardian || guardian.familyId !== data.existingFamilyId) {
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
          createdByUserId: session.userId,
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
    }

    await tx.child.create({
      data: {
        familyId,
        fullName: data.child.fullName,
        birthDate: new Date(data.child.birthDate),
        imageConsent: "GRANTED",
        lgpdConsent: true,
      },
    });

    return { id: familyId };
  });

  return NextResponse.json({ familyId: family.id }, { status: 201 });
}
