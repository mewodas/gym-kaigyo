"use client";

import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { HeaderV2 } from "./HeaderV2";

export function HeaderWrapper() {
  const pathname = usePathname();
  if (pathname?.startsWith("/v2")) return <HeaderV2 />;
  return <Header />;
}
