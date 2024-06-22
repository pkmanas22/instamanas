import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import Sidebar from "@/components/sidebar";
import { HomeSvg, ProfileSvg } from "@/components/svgIcons";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "InstaManas",
  description: "A Social Media App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Add any head elements here if necessary */}
      </head>
      <body className={inter.className}>
        <Providers>
          <Sidebar listItems={[
            { label: 'Home', href: '/', svgIcon: <HomeSvg /> },
            // { label: 'Explore', href: '/' },
            // { label: 'My Posts', href: '/' },
            { label: 'Profile', href: '/profile', svgIcon: <ProfileSvg /> },
          ]} />
          <div className="w-[95%] p-10 md:w-[70%] m-auto">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}


