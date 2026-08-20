import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { getDashboardSummary } from "@/services/dashboard";

export async function GET() {
  const session = await auth();
  if (!session.userId) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const data = await getDashboardSummary();
  return NextResponse.json(data, { status: 200 });
}
