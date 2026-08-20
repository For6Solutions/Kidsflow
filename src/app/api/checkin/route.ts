import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";
import { checkInSchema } from "@/lib/validation";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session.userId) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = checkInSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Payload inválido" }, { status: 400 });
  }

  const updated = await db.child.update({
    where: { id: parsed.data.childId },
    data: { checkedInAt: new Date() },
  });

  return NextResponse.json({ childId: updated.id, checkedInAt: updated.checkedInAt }, { status: 200 });
}
