import type { Metadata } from "next";
import { Cormorant_Garamond, Caveat, Nunito } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-caveat",
});

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  title: "Anı Panosu | Scrapbook",
  description: "Kurutulmuş çiçekler ve notlarla kişisel bir anı defteri.",
  icons: {
    icon: "/icon.png", // public içindeki icon.svg'yi çeker
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body
        className={`${cormorant.variable} ${caveat.variable} ${nunito.variable} font-ui antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
