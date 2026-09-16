"use client";

import type { ReactNode } from "react";
import type { FilterKey } from "@/content/site";
import { emit } from "@/lib/bus";

export default function FooterLink({ href, filter, children }: { href: string; filter?: FilterKey; children: ReactNode }) {
  return (
    <a href={href} onClick={() => filter && emit("tf:filter", filter)}>
      {children}
    </a>
  );
}
