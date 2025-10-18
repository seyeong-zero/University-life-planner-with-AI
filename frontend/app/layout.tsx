
import "./globals.css";

// import { Pixelify_Sans, Jersey_10 } from "next/font/google";

// const pixelify = Pixelify_Sans({
//   subsets: ["latin"],
//   display: 'swap',
//   variable: "--font-pixelify",
// });

// const jersey = Jersey_10({
//   subsets: ["latin"],
//   weight: "400",
//   display: 'swap',
//   variable: "--font-jersey",
// });

export const metadata = {
  title: "University Planner",
  description: "AI Agent for your university life",
  icons: {
    icon: "/favicon.png", 
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={``}>
      <body className="bg-white text-gray-900 flex flex-col min-h-screen">

        <main className="flex-grow">{children}</main>
      </body>
    </html>
  );
}