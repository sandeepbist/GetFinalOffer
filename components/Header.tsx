"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { authClient, signOut } from "@/lib/auth/auth-client";

export function Header() {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const handleSignOut = async () => {
    await signOut();
    router.push("/auth");
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-200">
      <nav className="flex items-center justify-between max-w-7xl mx-auto px-6 py-4 sm:px-8 lg:px-0">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          GetFinalOffer
        </Link>

        <div className="flex items-center space-x-3">
          {session?.user ? (
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              Sign Out
            </Button>
          ) : (
            <Link href="/auth" passHref>
              <Button variant="outline" size="sm" asChild>
                <a>Sign In</a>
              </Button>
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
