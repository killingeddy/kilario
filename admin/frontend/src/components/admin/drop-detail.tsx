"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  StatusBadge,
  getProductStatusVariant,
} from "@/components/admin/status-badge";
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Calendar,
  ShirtIcon,
  Plus,
  Eye,
} from "lucide-react";
import { drops, getProductsByDrop, productStatusLabels } from "@/lib/mock-data";

interface DropDetailProps {
  id: string;
}

export function DropDetail({ id }: DropDetailProps) {
  const drop = drops.find((d) => d.id === id);
  const dropProducts = drop ? getProductsByDrop(drop.id) : [];

  if (!drop) {
    return (
      <div className="p-4">
        <div className="flex items-center gap-3 mb-6">
          <Button asChild variant="ghost" size="icon">
            <Link href="/admin/drops">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-xl font-bold text-foreground">
            Drop não encontrado
          </h1>
        </div>
        <p className="text-muted-foreground font-serif">
          O drop que você está procurando não existe ou foi removido.
        </p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="icon">
            <Link href="/admin/drops">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-xl font-bold text-foreground">{drop.name}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="icon">
            <Link href={`/admin/drops/${drop.id}/edit`}>
              <Pencil className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="text-destructive bg-transparent"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Info Card */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center gap-2">
            <StatusBadge variant={drop.isActive ? "success" : "neutral"}>
              {drop.isActive ? "Ativo" : "Inativo"}
            </StatusBadge>
          </div>

          {drop.description && (
            <p className="text-sm text-foreground font-serif leading-relaxed">
              {drop.description}
            </p>
          )}

          <div className="flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              {formatDate(drop.launchDate)}
            </span>
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <ShirtIcon className="h-4 w-4" />
              {dropProducts.length} peças
            </span>
          </div>

          <div className="pt-2 border-t border-border">
            <p className="text-xs text-muted-foreground font-serif">
              URL: /drops/{drop.slug}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Products in Drop */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Peças do drop</CardTitle>
            <Button asChild size="sm" variant="outline">
              <Link href={`/admin/products/new?drop=${drop.id}`}>
                <Plus className="h-3 w-3 mr-1" />
                Adicionar
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {dropProducts.length === 0 ? (
            <div className="p-6 text-center">
              <ShirtIcon className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground font-serif">
                Nenhuma peça neste drop ainda
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {dropProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/admin/products/${product.id}`}
                  className="flex items-center gap-3 p-4 hover:bg-secondary/50 transition-colors"
                >
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-secondary shrink-0">
                    <img
                      src={product.images[0] || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {product.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <StatusBadge
                        variant={getProductStatusVariant(product.status)}
                      >
                        {productStatusLabels[product.status]}
                      </StatusBadge>
                      <span className="text-xs text-muted-foreground font-serif">
                        {formatCurrency(product.price)}
                      </span>
                    </div>
                  </div>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="sticky bottom-20 bg-background pt-4 pb-2">
        <Button asChild className="w-full h-12 text-base">
          <Link href={`/admin/drops/${drop.id}/edit`}>
            <Pencil className="h-5 w-5 mr-2" />
            Editar drop
          </Link>
        </Button>
      </div>
    </div>
  );
}
