"use client";

import { usePathname } from "next/navigation";
import { Footer } from "./Footer";
import { FooterV2 } from "./FooterV2";

export function FooterWrapper() {
  const pathname = usePathname();
  if (pathname?.startsWith("/v2")) return <FooterV2 />;
  return <Footer />;
}
