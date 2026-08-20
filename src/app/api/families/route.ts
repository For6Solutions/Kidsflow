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
    const createdFamily = await tx.family.create({
      data: {
        familyLabel: data.familyLabel,
        zipCode: data.zipCode,
        street: data.street,
        number: data.number,
        complement: data.complement,
        neighborhood: data.neighborhood,
        city: data.city,
        state: data.state,
        createdByUserId: session.userId,
      },
    });

    await tx.guardian.createMany({
      data: data.guardians.map((item) => ({
        familyId: createdFamily.id,
        fullName: item.fullName,
        cpf: item.cpf,
        phone: item.phone,
        email: item.email || null,
        relationship: item.relationship,
      })),
    });

    for (const child of data.children) {
      const createdChild = await tx.child.create({
        data: {
          familyId: createdFamily.id,
          fullName: child.fullName,
          nickname: child.nickname,
          birthDate: new Date(child.birthDate),
          sex: child.sex,
          school: child.school,
          schoolGrade: child.schoolGrade,
          unitClass: child.unitClass,
          allergies: child.allergies,
          foodRestriction: child.foodRestriction,
          continuousMedication: child.continuousMedication,
          medicationDetails: child.medicationDetails,
          hasHealthCondition: child.hasHealthCondition,
          healthConditionDetails: child.healthConditionDetails,
          specialAttentionNeeds: child.specialAttentionNeeds,
          generalNotes: child.generalNotes,
          shirtSize: child.shirtSize,
          eventDiscoveryChannel: child.eventDiscoveryChannel,
          imageConsent: child.imageConsent,
          lgpdConsent: child.lgpdConsent,
        },
      });

      if (child.interests && child.interests.length > 0) {
        await tx.childInterest.createMany({
          data: child.interests.map((interest) => ({
            childId: createdChild.id,
            activity: interest,
          })),
        });
      }
    }

    if (data.emergencyContacts.length > 0) {
      await tx.emergencyContact.createMany({
        data: data.emergencyContacts.map((item) => ({
          familyId: createdFamily.id,
          fullName: item.fullName,
          phone: item.phone,
        })),
      });
    }

    if (data.authorizedPickups.length > 0) {
      await tx.authorizedPickup.createMany({
        data: data.authorizedPickups.map((item) => ({
          familyId: createdFamily.id,
          fullName: item.fullName,
          document: item.document,
          phone: item.phone || null,
        })),
      });
    }

    return createdFamily;
  });

  return NextResponse.json({ familyId: family.id }, { status: 201 });
}
