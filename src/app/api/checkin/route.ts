import { NextRequest, NextResponse } from "next/server";

import { getAuthenticatedUserId } from "@/lib/auth";
import { db } from "@/lib/db";
import { checkInSchema } from "@/lib/validation";

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

  const parsed = checkInSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Payload inválido" }, { status: 400 });
  }

  const checkedInAt = new Date();
  const updated = await db.child.updateMany({
    where: { id: parsed.data.childId },
    data: { checkedInAt },
  });

  if (updated.count === 0) {
    return NextResponse.json({ error: "Criança não encontrada" }, { status: 404 });
  }

  return NextResponse.json({ childId: parsed.data.childId, checkedInAt }, { status: 200 });
}
