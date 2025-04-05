/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import "./globals.css";
import React from "react";

import Providers from "@front/providers";

export const generateMetadata = async (): Promise<Metadata> => {
  const json = await import("../../public/manifest.json");
  return {
    title: json.name,
    description: json.description,
    openGraph:{
      title: json.name,
      siteName: json.name,
      description: json.description,
      type: "website",
      url: "http://192.168.0.76:3000",
      locale: "ko_KR",
      images: [
        {
          url: "http://192.168.0.76:3000/og-image.png",
          width: 4800,
          height: 2520,
        }
      ],
    },
    appleWebApp: true,
    icons: [
      { 
        "url": "/favicon.ico", 
        "type": "image/x-icon", 
        "sizes": "16x16 32x32"
      },
      { 
        "url": "/icons/icon-192.png", 
        "type": "image/png", 
        "sizes": "192x192"
      },
      { 
        "url": "/icons/icon-512.png", 
        "type": "image/png", 
        "sizes": "512x512"
      },
    ],
    manifest: "/manifest.json",
    metadataBase: new URL("http://localhost:3000"),
  };
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="ko" className="w-full h-full overflow-hidden bg-white">
      <body className="antialiased w-full h-full flex flex-col items-center justify-center overflow-hidden bg-dark/5">
        <Providers>
          <div className="max-w-2xl w-full h-full overflow-hidden">
            <div className="overflow-y-auto w-full h-full">
              {children}
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;