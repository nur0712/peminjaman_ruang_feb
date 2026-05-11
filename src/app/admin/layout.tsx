import Link from "next/link";
import { Bell, ChartNoAxesCombined } from "lucide-react";

import { AdminNav } from "@/components/admin-nav";
import { Button } from "@/components/ui/button";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="page-shell min-h-screen">
      <div className="mesh" />
      <header className="border-b border-border/60 bg-background/75 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-foreground text-background">
                <ChartNoAxesCombined className="size-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Admin Workspace</p>
                <h1 className="font-display text-3xl">Kontrol Peminjaman Program Studi Bisnis Digital</h1>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="outline" size="sm">
                <Bell className="size-4" />
                5 pending
              </Button>
              <Button asChild size="sm">
                <Link href="/rooms">Lihat Portal User</Link>
              </Button>
            </div>
          </div>
          <AdminNav />
        </div>
      </header>
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
