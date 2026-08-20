import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

import { rateLimit } from "@/lib/rate-limit";
import { fetchViaCep } from "@/services/via-cep";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session.userId) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const ip = request.headers.get("x-forwarded-for") || "local";
  const limiter = rateLimit(`viacep:${ip}`, 30, 60_000);

  if (!limiter.allowed) {
    return NextResponse.json({ error: "Muitas requisições" }, { status: 429 });
  }

  const cep = request.nextUrl.searchParams.get("cep") ?? "";

  try {
    const data = await fetchViaCep(cep);
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erro no ViaCEP" },
      { status: 400 },
    );
  }
}
