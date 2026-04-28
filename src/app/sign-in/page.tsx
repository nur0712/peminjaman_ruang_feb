import { AuthForm } from "@/components/auth-form";
import { SiteHeader } from "@/components/site-header";

export default function SignInPage() {
  return (
    <div className="page-shell">
      <div className="mesh" />
      <SiteHeader />
      <main className="mx-auto flex min-h-[calc(100vh-120px)] w-full max-w-7xl items-center px-4 py-10 sm:px-6 lg:px-8">
        <AuthForm mode="sign-in" />
      </main>
    </div>
  );
}
