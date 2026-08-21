import type { Metadata } from "next";

import { AuthProvider } from "@/components/auth/auth-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Criança Feliz | Cadastro e organização de eventos infantis",
  description: "Plataforma moderna para cadastro, check-in e relatórios de eventos infantis.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="min-h-full bg-slate-50 text-slate-900">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
