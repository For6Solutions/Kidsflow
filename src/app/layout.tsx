import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Baloo_2, Nunito } from "next/font/google";
import "./globals.css";

const baloo = Baloo_2({
  variable: "--font-title",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const nunito = Nunito({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Kidsflow | Cadastro Dia das Crianças",
  description: "Plataforma de cadastro, check-in e relatórios para eventos infantis.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${baloo.variable} ${nunito.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-slate-50 text-slate-900">
        <ClerkProvider>{children}</ClerkProvider>
      </body>
    </html>
  );
}
      