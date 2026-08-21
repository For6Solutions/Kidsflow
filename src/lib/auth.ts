import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export function isAuthConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY,
  );
}

export async function getAuthenticatedUserId() {
  if (!isAuthConfigured()) {
    return null;
  }

  try {
    return (await auth()).userId;
  } catch (error) {
    console.error("Falha ao validar sessão do Clerk", error);
    return null;
  }
}

export async function requireUser() {
  if (!isAuthConfigured()) {
    redirect("/sign-in?error=auth-config");
  }

  const session = await auth();

  if (!session.userId) {
    redirect("/sign-in");
  }

  return session;
}
