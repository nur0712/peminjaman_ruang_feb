"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export function AuthStatus() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return <div className="h-10 w-32 rounded-full bg-muted/70" />;
  }

  if (!session) {
    return (
      <div className="flex items-center gap-2">
        <Button asChild variant="ghost" size="sm">
          <Link href="/sign-in">Masuk</Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link href="/sign-up">Daftar</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="hidden rounded-full bg-muted/65 px-4 py-2 text-sm text-muted-foreground lg:block">
        {session.user.name}
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={async () => {
          await authClient.signOut();
          router.refresh();
          router.push("/");
        }}
      >
        <LogOut className="size-4" />
        Keluar
      </Button>
    </div>
  );
}
