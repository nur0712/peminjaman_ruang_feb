"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type AuthFormProps = {
  mode: "sign-in" | "sign-up";
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isSignUp = mode === "sign-up";

  return (
    <Card className="glass-panel mx-auto w-full max-w-xl">
      <CardHeader>
        <CardTitle className="font-display text-4xl">{isSignUp ? "Buat akun" : "Masuk ke sistem"}</CardTitle>
        <CardDescription>
          {isSignUp
            ? "Daftar dulu supaya pengajuan booking dan riwayat Anda bisa tercatat otomatis."
            : "Gunakan akun Anda untuk mengajukan booking, melihat status, dan mengakses dashboard yang sesuai."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>
        ) : null}

        <form
          className="space-y-4"
          onSubmit={async (event) => {
            event.preventDefault();
            setIsSubmitting(true);
            setError(null);

            try {
              if (isSignUp) {
                const result = await authClient.signUp.email({
                  name,
                  email,
                  password,
                });

                if (result.error) {
                  setError(result.error.message ?? "Pendaftaran gagal.");
                  return;
                }

                router.push("/rooms");
                router.refresh();
                return;
              }

              const result = await authClient.signIn.email({
                email,
                password,
                rememberMe: true,
              });

              if (result.error) {
                setError(result.error.message ?? "Login gagal.");
                return;
              }

              router.push("/my-bookings");
              router.refresh();
            } finally {
              setIsSubmitting(false);
            }
          }}
        >
          {isSignUp ? (
            <div className="space-y-2">
              <label className="text-sm font-semibold">Nama lengkap</label>
              <Input value={name} onChange={(event) => setName(event.target.value)} required />
            </div>
          ) : null}

          <div className="space-y-2">
            <label className="text-sm font-semibold">Email</label>
            <Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Password</label>
            <Input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Memproses..." : isSignUp ? "Daftar" : "Masuk"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          {isSignUp ? "Sudah punya akun?" : "Belum punya akun?"}{" "}
          <Link href={isSignUp ? "/sign-in" : "/sign-up"} className="font-semibold text-foreground">
            {isSignUp ? "Masuk" : "Daftar"}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
