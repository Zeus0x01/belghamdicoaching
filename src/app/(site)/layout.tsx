import type { ReactNode } from "react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { ScrollCanvasMount } from "@/components/three/ScrollCanvasMount";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Nav />
      <ScrollCanvasMount />
      <main className="bg-graphite min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
