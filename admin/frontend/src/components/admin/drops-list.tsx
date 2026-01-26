"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/admin/status-badge";
import { Plus, Layers, Calendar, ShirtIcon, ChevronRight } from "lucide-react";
import { drops } from "@/lib/mock-data";

export function DropsList() {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">Drops</h1>
        <Button asChild size="sm">
          <Link href="/admin/drops/new">
            <Plus className="h-4 w-4 mr-1" />
            Novo drop
          </Link>
        </Button>
      </div>

      <div className="flex gap-4 text-sm">
        <span className="text-muted-foreground font-serif">
          {drops.length} drops • {drops.filter((d) => d.isActive).length} ativos
        </span>
      </div>

      {/* Drops List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {drops.map((drop) => (
          <Link key={drop.id} href={`/admin/drops/${drop.id}`}>
            <Card className="hover:bg-secondary/50 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-accent/20 shrink-0">
                    <Layers className="h-6 w-6 text-accent-foreground" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-sm font-semibold text-foreground truncate">
                        {drop.name}
                      </h3>
                      <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                    </div>

                    <p className="text-xs text-muted-foreground font-serif mt-1 line-clamp-1">
                      {drop.description}
                    </p>

                    <div className="flex items-center gap-3 mt-2">
                      <StatusBadge
                        variant={drop.isActive ? "success" : "neutral"}
                      >
                        {drop.isActive ? "Ativo" : "Inativo"}
                      </StatusBadge>

                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <ShirtIcon className="h-3 w-3" />
                        {drop.productCount} peças
                      </span>

                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {formatDate(drop.launchDate)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}

        {drops.length === 0 && (
          <div className="text-center py-12">
            <Layers className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground font-serif">
              Nenhum drop criado ainda
            </p>
            <Button asChild className="mt-4">
              <Link href="/admin/drops/new">
                <Plus className="h-4 w-4 mr-1" />
                Criar primeiro drop
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
