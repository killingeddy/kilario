"use client";

import React from "react";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  LayoutDashboard,
  ShirtIcon,
  Layers,
  ShoppingBag,
  Truck,
  Bell,
  Menu,
  X,
  LogOut,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { notificationsApi } from "@/lib/api";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Peças", icon: ShirtIcon },
  { href: "/admin/drops", label: "Drops", icon: Layers },
  { href: "/admin/orders", label: "Vendas", icon: ShoppingBag },
  { href: "/admin/deliveries", label: "Entregas", icon: Truck },
  { href: "/admin/notifications", label: "Notificacoes", icon: Bell },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      notificationsApi
        .list({ unread: true })
        .then((res) => setUnreadCount(res.unreadCount || 0))
        .catch(() => setUnreadCount(0));
    }
  }, [isAuthenticated, pathname]);

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname.startsWith(href);
  };

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "var(--background)" }}
      >
        <Loader2
          className="h-8 w-8 animate-spin"
          style={{ color: "var(--button)" }}
        />
      </div>
    );
  }

  console.log("isAuthenticated", isAuthenticated);

  if (!isAuthenticated) {
    return null;
  }

  const NavLinks = ({ onClose }: { onClose?: () => void }) => (
    <nav className="flex flex-col gap-1">
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.href);
        const showBadge =
          item.href === "/admin/notifications" && unreadCount > 0;

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
            )}
            style={{
              backgroundColor: active ? "var(--button)" : "transparent",
              color: active ? "var(--background)" : "var(--text)",
            }}
          >
            <Icon className="h-5 w-5" />
            <span className="flex-1">{item.label}</span>
            {showBadge && (
              <span
                className="flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold"
                style={{
                  backgroundColor: "var(--highlight)",
                  color: "var(--text)",
                }}
              >
                {unreadCount}
              </span>
            )}
          </Link>
        );
      })}

      <button
        onClick={() => {
          onClose?.();
          logout();
        }}
        className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors mt-4"
        style={{ color: "var(--button)" }}
      >
        <LogOut className="h-5 w-5" />
        <span>Sair</span>
      </button>
    </nav>
  );

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--background)" }}
    >
      <header
        className="sticky top-0 z-50 flex items-center h-14 px-4 border-b gap-2"
        style={{
          backgroundColor: "var(--background)",
          borderColor: "var(--highlight-blur)",
        }}
      >
        <div className="flex items-center gap-2">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Menu className="h-5 w-5" style={{ color: "var(--text)" }} />
                {unreadCount > 0 && (
                  <span
                    className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold"
                    style={{
                      backgroundColor: "var(--button)",
                      color: "var(--background)",
                    }}
                  >
                    {unreadCount}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-72 p-0"
              style={{ backgroundColor: "var(--background)" }}
            >
              <div
                className="flex items-center justify-between h-14 px-4 border-b"
                style={{ borderColor: "var(--highlight-blur)" }}
              >
                <span
                  className="text-lg font-bold"
                  style={{ color: "var(--text)" }}
                >
                  Menu
                </span>
              </div>
              <div className="p-4">
                <NavLinks onClose={() => setIsOpen(false)} />
              </div>
            </SheetContent>
          </Sheet>
        </div>
        <h1 className="text-lg font-bold" style={{ color: "var(--text)" }}>
          Kilariô Admin
        </h1>
      </header>

      <main className="pb-20">{children}</main>

      {/* Bottom Navigation (Mobile) */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 border-t safe-area-inset-bottom"
        style={{
          backgroundColor: "var(--background)",
          borderColor: "var(--highlight-blur)",
        }}
      >
        <div className="flex items-center justify-around h-16">
          {navItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            const showBadge =
              item.href === "/admin/notifications" && unreadCount > 0;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center justify-center flex-1 h-full gap-1 relative"
                style={{
                  color: active ? "var(--button)" : "var(--text-aux)",
                }}
              >
                <div className="relative">
                  <Icon className="h-5 w-5" />
                  {showBadge && (
                    <span
                      className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full"
                      style={{ backgroundColor: "var(--button)" }}
                    />
                  )}
                </div>
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
