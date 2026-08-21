import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.18),_transparent_35%),radial-gradient(circle_at_bottom,_rgba(250,204,21,0.22),_transparent_28%),linear-gradient(135deg,#eff6ff_0%,#fef3c7_100%)] px-4 py-10">
      <div className="w-full max-w-[520px] rounded-[32px] border border-white/60 bg-white/75 p-4 shadow-[0_30px_80px_rgba(15,23,42,0.12)] backdrop-blur-md sm:p-6">
        <div className="mb-5 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.26em] text-emerald-700">Criança Feliz</p>
          <h1 className="mt-2 text-3xl font-black tracking-[-0.06em] text-slate-900">Entrar</h1>
        </div>

        <SignIn
          forceRedirectUrl="/panel"
          fallbackRedirectUrl="/panel"
          appearance={{
            elements: {
              card: "shadow-none rounded-[28px] border-0 bg-transparent",
              rootBox: "w-full",
              socialButtonsBlockButton: "rounded-2xl border border-slate-200 shadow-sm",
              formButtonPrimary: "rounded-2xl bg-[linear-gradient(135deg,#0ea5e9,#2563eb)] text-white font-black shadow-[0_12px_24px_rgba(37,99,235,0.3)]",
              formFieldInput: "rounded-2xl border border-slate-200 bg-slate-50",
            },
          }}
        />
      </div>
    </main>
  );
}
