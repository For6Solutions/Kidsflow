import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,#cffafe,transparent_45%),radial-gradient(circle_at_bottom,#fde68a,transparent_35%),#f8fafc] px-4">
      <SignUp
        appearance={{
          elements: {
            card: "shadow-xl rounded-2xl border border-slate-200",
          },
        }}
      />
    </main>
  );
}
