"use client";

import React from "react";

import { cn } from "@/lib/utils";

type BadgeVariant = "success" | "warning" | "danger" | "neutral" | "info";

interface StatusBadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  success: "bg-green-100 text-green-800",
  warning: "bg-amber-100 text-amber-800",
  danger: "bg-red-100 text-red-800",
  neutral: "bg-secondary text-secondary-foreground",
  info: "bg-accent/30 text-accent-foreground",
};

export function StatusBadge({
  children,
  variant = "neutral",
  className,
}: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variantStyles[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}

// Helper to get badge variant based on status
export function getProductStatusVariant(status: string): BadgeVariant {
  switch (status) {
    case "available":
      return "success";
    case "reserved":
      return "warning";
    case "sold":
      return "neutral";
    default:
      return "neutral";
  }
}

export function getOrderStatusVariant(status: string): BadgeVariant {
  switch (status) {
    case "paid":
      return "success";
    case "pending":
      return "warning";
    case "refunded":
      return "danger";
    default:
      return "neutral";
  }
}

export function getDeliveryStatusVariant(status: string): BadgeVariant {
  switch (status) {
    case "delivered":
      return "success";
    case "scheduled":
      return "info";
    case "pending":
      return "warning";
    default:
      return "neutral";
  }
}
