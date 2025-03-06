"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Brain } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/lib/store";
import { logout } from "@/lib/features/auth/authSlice";
import { Button } from "@/components/ui/button";
import { Logo } from "./logo";

export default function Navbar() {
  const pathname = usePathname();
  const isLoggedIn = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  // Don't show navbar on login page
  if (pathname === "/login") return null;

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Logo className="h-6" />
          <span className="text-xl font-bold">QuizMaster</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {isLoggedIn && (
            <>
              <Link
                href="/dashboard"
                className={`text-sm font-medium ${
                  pathname === "/dashboard"
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Dashboard
              </Link>
              <Link
                href="/create-quiz"
                className={`text-sm font-medium ${
                  pathname === "/create-quiz"
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Create Quiz
              </Link>
              <Link
                href="/practice"
                className={`text-sm font-medium ${
                  pathname === "/practice"
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Practice
              </Link>
            </>
          )}
        </nav>

        <div>
          {isLoggedIn ? (
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          ) : (
            <Link href="/login">
              <Button>Login</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
