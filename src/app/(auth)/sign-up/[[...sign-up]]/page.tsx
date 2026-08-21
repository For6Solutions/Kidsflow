import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
        <section className="w-full max-w-lg rounded-[32px] border border-slate-200 bg-white p-8 text-center shadow-xl">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-600">Kidsflow</p>
          <h1 className="mt-3 text-2xl font-black text-slate-900">Cadastro de usuários indisponível</h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            Configure o Clerk no ambiente de build e runtime do Cloudflare Pages antes de criar usuários administrativos.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,#cffafe,transparent_45%),radial-gradient(circle_at_bottom,#fde68a,transparent_35%),#f8fafc] px-4">
      <SignUp
        forceRedirectUrl="/panel"
        fallbackRedirectUrl="/panel"
        appearance={{
          elements: {
            card: "shadow-xl rounded-2xl border border-slate-200",
          },
        }}
      />
    </main>
  );
}
