"use client";

import React from "react";

import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

interface DataCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  description?: string;
  className?: string;
}

export function DataCard({
  title,
  value,
  icon,
  description,
  className,
}: DataCardProps) {
  return (
    <Card className={cn("", className, "pt-0")}>
      <CardContent className="p-4">
        <div className="flex items-center gap-2">
          {icon && (
            <div className="p-5 bg-accent/20 rounded-lg text-accent-foreground">
              {icon}
            </div>
          )}
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground font-serif">{title}</p>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            {description && (
              <p className="text-xs text-muted-foreground font-serif">
                {description}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
