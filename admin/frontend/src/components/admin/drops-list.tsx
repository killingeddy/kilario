"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/admin/status-badge";
import { Plus, Layers, ShirtIcon, ChevronRight, Loader2 } from "lucide-react";
import { collectionsApi, type Collection } from "@/lib/api";

export function DropsList() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    collectionsApi
      .list()
      .then((res) => setCollections(res.data || []))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const activeCount = collections.filter((c) => c.is_active).length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2
          className="h-8 w-8 animate-spin"
          style={{ color: "var(--button)" }}
        />
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold" style={{ color: "var(--text)" }}>
          Drops
        </h1>
        <Button
          asChild
          size="sm"
          style={{ backgroundColor: "var(--button)", color: "var(--background)" }}
        >
          <Link href="/admin/drops/new">
            <Plus className="h-4 w-4 mr-1" />
            Novo drop
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="flex gap-4 text-sm">
        <span className="font-serif" style={{ color: "var(--text-aux)" }}>
          {collections.length} drops • {activeCount} ativos
        </span>
      </div>

      {/* Drops List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {collections.map((collection) => (
          <Link key={collection.id} href={`/admin/drops/${collection.id}`}>
            <Card
              className="transition-opacity hover:opacity-80 border pt-0"
              style={{ backgroundColor: "var(--background)" }}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div
                    className="flex items-center justify-center h-20 w-20 rounded-lg shrink-0"
                    style={{ backgroundColor: "var(--highlight-blur)" }}
                  >
                    <Layers className="h-6 w-6" style={{ color: "var(--text)" }} />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3
                        className="text-sm font-semibold truncate"
                        style={{ color: "var(--text)" }}
                      >
                        {collection.title}
                      </h3>
                      <ChevronRight
                        className="h-4 w-4 shrink-0"
                        style={{ color: "var(--text-aux)" }}
                      />
                    </div>

                    {collection.description && (
                      <p
                        className="text-xs font-serif mt-1 line-clamp-1"
                        style={{ color: "var(--text-aux)" }}
                      >
                        {collection.description}
                      </p>
                    )}

                    <div className="flex items-center gap-3 mt-2">
                      <StatusBadge variant={collection.is_active ? "success" : "neutral"}>
                        {collection.is_active ? "Ativo" : "Inativo"}
                      </StatusBadge>

                      <span
                        className="flex items-center gap-1 text-xs"
                        style={{ color: "var(--text-aux)" }}
                      >
                        <ShirtIcon className="h-3 w-3" />
                        {collection.products_count || 0} peças
                      </span>

                      <span
                        className="text-xs"
                        style={{ color: "var(--text-aux)" }}
                      >
                        {formatDate(collection.created_at)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}

        {collections.length === 0 && (
          <div className="text-center py-12">
            <Layers
              className="h-12 w-12 mx-auto mb-3"
              style={{ color: "var(--text-aux)" }}
            />
            <p className="font-serif" style={{ color: "var(--text-aux)" }}>
              Nenhum drop criado ainda
            </p>
            <Button
              asChild
              className="mt-4"
              style={{ backgroundColor: "var(--button)", color: "var(--background)" }}
            >
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
