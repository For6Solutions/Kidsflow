import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function requireUser() {
  const session = await auth();

  if (!session.userId) {
    redirect("/sign-in");
  }

  return session;
}
