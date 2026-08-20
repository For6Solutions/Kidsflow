import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

import { rateLimit } from "@/lib/rate-limit";
import { globalSearch } from "@/services/search";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session.userId) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const ip = request.headers.get("x-forwarded-for") || "local";
  const limiter = rateLimit(`search:${ip}`, 100, 60_000);

  if (!limiter.allowed) {
    return NextResponse.json({ error: "Muitas requisições" }, { status: 429 });
  }

  const q = request.nextUrl.searchParams.get("q") ?? "";
  if (q.trim().length < 2) {
    return NextResponse.json({ items: [] }, { status: 200 });
  }

  const items = await globalSearch(q);
  return NextResponse.json({ items }, { status: 200 });
}
