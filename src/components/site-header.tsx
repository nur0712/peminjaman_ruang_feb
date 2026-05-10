"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

import { AuthStatus } from "@/components/auth-status";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Beranda" },
  { href: "/rooms", label: "Ruang" },
  { href: "/my-bookings", label: "Riwayat" },
  { href: "/admin", label: "Admin" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  useEffect(() => {
    setIsMobileNavOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isMobileNavOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileNavOpen]);

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/75 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-foreground text-sm font-bold text-background">
            FEB
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
              Peminjaman Ruang
            </p>
            <p className="font-display text-lg text-foreground">Gedung FEB</p>
          </div>
        </Link>

        <Button
          type="button"
          variant="outline"
          size="icon"
          className="md:hidden"
          aria-label={isMobileNavOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
          aria-expanded={isMobileNavOpen}
          onClick={() => setIsMobileNavOpen((current) => !current)}
        >
          {isMobileNavOpen ? <X /> : <Menu />}
        </Button>

        <nav className="hidden items-center gap-2 md:flex">
          {links.map((link) => {
            const active =
              pathname === link.href ||
              (link.href !== "/" && pathname.startsWith(link.href));

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition",
                  active ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
            <Link href="/rooms">Ajukan Booking</Link>
          </Button>
          <AuthStatus />
        </div>
      </div>

      <div
        className={cn(
          "fixed inset-0 z-50 bg-foreground/30 backdrop-blur-sm transition-opacity duration-300 md:hidden",
          isMobileNavOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
        aria-hidden={!isMobileNavOpen}
        onClick={() => setIsMobileNavOpen(false)}
      />

      <aside
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex w-[min(88vw,24rem)] flex-col border-l border-border/60 bg-[linear-gradient(180deg,rgba(255,251,246,0.98),rgba(246,240,232,0.96))] p-5 shadow-2xl shadow-black/10 transition-transform duration-300 md:hidden",
          isMobileNavOpen ? "translate-x-0" : "translate-x-full",
        )}
        aria-hidden={!isMobileNavOpen}
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
              Navigasi
            </p>
            <p className="font-display text-2xl text-foreground">Gedung FEB</p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Tutup menu navigasi"
            onClick={() => setIsMobileNavOpen(false)}
          >
            <X />
          </Button>
        </div>

        <nav className="flex flex-col gap-2">
          {links.map((link) => {
            const active =
              pathname === link.href ||
              (link.href !== "/" && pathname.startsWith(link.href));

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-2xl px-4 py-3 text-sm font-semibold transition",
                  active
                    ? "bg-foreground text-background shadow-lg shadow-black/10"
                    : "bg-background/70 text-foreground hover:bg-muted/75",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-6 rounded-[28px] border border-border/70 bg-card/85 p-4">
          <p className="text-sm font-semibold text-foreground">Akses cepat</p>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Ajukan peminjaman atau masuk ke akun Anda langsung dari menu ini.
          </p>
          <Button asChild className="mt-4 w-full">
            <Link href="/rooms">Ajukan Booking</Link>
          </Button>
        </div>

        <div className="mt-6 border-t border-border/60 pt-5">
          <AuthStatus />
        </div>
      </aside>
    </header>
  );
}
