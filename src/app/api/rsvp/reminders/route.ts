import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function POST() {
  const session = await auth();
  if (!session.userId) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const families = await db.family.findMany({
    include: {
      guardians: true,
    },
    take: 200,
    orderBy: { createdAt: "desc" },
  });

  const reminders = families
    .filter((family) => family.guardians.length > 0)
    .map((family) => ({
      familyId: family.id,
      status: "PENDING",
      source: "AUTOMATION",
      sentAt: new Date(),
    }));

  if (reminders.length > 0) {
    await db.rSVP.createMany({ data: reminders });
  }

  return NextResponse.json(
    {
      message: "Lembretes de RSVP preparados com sucesso.",
      total: reminders.length,
      note: "Conecte este endpoint a um provedor de WhatsApp/e-mail para envio real.",
    },
    { status: 200 },
  );
}
