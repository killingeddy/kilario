"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  StatusBadge,
  getProductStatusVariant,
} from "@/components/admin/status-badge";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import {
  products,
  getDropById,
  productStatusLabels,
  conditionLabels,
} from "@/lib/mock-data";

interface ProductDetailProps {
  id: string;
}

export function ProductDetail({ id }: ProductDetailProps) {
  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="p-4">
        <div className="flex items-center gap-3 mb-6">
          <Button asChild variant="ghost" size="icon">
            <Link href="/admin/products">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-xl font-bold text-foreground">
            Peça não encontrada
          </h1>
        </div>
        <p className="text-muted-foreground font-serif">
          A peça que você está procurando não existe ou foi removida.
        </p>
      </div>
    );
  }

  const drop = getDropById(product.dropId);

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
            <Link href="/admin/products">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-xl font-bold text-foreground">Detalhes</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="icon">
            <Link href={`/admin/products/${product.id}/edit`}>
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

      {/* Images */}
      <div className="space-y-2">
        <div className="aspect-square rounded-xl overflow-hidden bg-secondary">
          <img
            src={product.images[0] || "/placeholder.svg"}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
        {product.images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {product.images.map((image, index) => (
              <div
                key={index}
                className="w-16 h-16 rounded-lg overflow-hidden bg-secondary shrink-0"
              >
                <img
                  src={image || "/placeholder.svg"}
                  alt={`${product.name} ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main Info */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-bold text-foreground">
                {product.name}
              </h2>
              <p className="text-sm text-muted-foreground font-serif">
                {product.brand}
              </p>
            </div>
            <p className="text-xl font-bold text-foreground">
              {formatCurrency(product.price)}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <StatusBadge variant={getProductStatusVariant(product.status)}>
              {productStatusLabels[product.status]}
            </StatusBadge>
            {drop && (
              <span className="text-sm text-muted-foreground font-serif">
                {drop.name}
              </span>
            )}
          </div>

          {product.description && (
            <p className="text-sm text-foreground font-serif leading-relaxed">
              {product.description}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Details */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Detalhes</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <dl className="space-y-3">
            <div className="flex justify-between">
              <dt className="text-sm text-muted-foreground font-serif">
                Tamanho
              </dt>
              <dd className="text-sm font-medium text-foreground">
                {product.size}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-muted-foreground font-serif">
                Estado
              </dt>
              <dd className="text-sm font-medium text-foreground">
                {conditionLabels[product.condition]}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-muted-foreground font-serif">
                Marca
              </dt>
              <dd className="text-sm font-medium text-foreground">
                {product.brand}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      {/* Measurements */}
      {product.measurements.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Medidas</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <dl className="space-y-3">
              {product.measurements.map((measurement, index) => (
                <div key={index} className="flex justify-between">
                  <dt className="text-sm text-muted-foreground font-serif">
                    {measurement.name}
                  </dt>
                  <dd className="text-sm font-medium text-foreground">
                    {measurement.value}
                  </dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="sticky bottom-20 bg-background pt-4 pb-2">
        <Button asChild className="w-full h-12 text-base">
          <Link href={`/admin/products/${product.id}/edit`}>
            <Pencil className="h-5 w-5 mr-2" />
            Editar peça
          </Link>
        </Button>
      </div>
    </div>
  );
}
