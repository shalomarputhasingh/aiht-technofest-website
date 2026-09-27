"use client";

import type { ReactNode } from "react";

export default function FooterLink({ href, children }: { href: string; children: ReactNode }) {
  return <a href={href}>{children}</a>;
}
