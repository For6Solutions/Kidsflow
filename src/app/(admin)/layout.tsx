import { UserButton } from "@clerk/nextjs";
import { ReactNode } from "react";

import { requireUser } from "@/lib/auth";

type Props = {
  children: ReactNode;
};

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: Props) {
  await requireUser();

  return (
    <div className="min-h-screen bg-[#f4f5ef]">
      <header className="border-b border-[#18221d]/10 bg-[#f4f5ef]/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 md:px-8">
          <p className="font-extrabold tracking-tight text-[#18221d]">kids<span className="text-[#738a12]">flow</span> <span className="ml-2 text-xs font-bold uppercase tracking-[0.16em] text-[#18221d]/40">Admin</span></p>
          <UserButton />
        </div>
      </header>
      {children}
    </div>
  );
}
