import { NextResponse } from "next/server";

import { getAuthenticatedUserId } from "@/lib/auth";
import { getDashboardSummary } from "@/services/dashboard";

export async function GET() {
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const data = await getDashboardSummary();
  return NextResponse.json(data, { status: 200 });
}
