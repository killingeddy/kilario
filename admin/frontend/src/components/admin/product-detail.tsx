"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  StatusBadge,
  getProductStatusVariant,
} from "@/components/admin/status-badge";
import { ArrowLeft, Pencil, Trash2, Loader2 } from "lucide-react";
import { productsApi, type Product } from "@/lib/api";

const productStatusLabels: Record<string, string> = {
  draft: "Rascunho",
  available: "Disponivel",
  sold: "Vendida",
  archived: "Arquivada",
};

const conditionLabels: Record<string, string> = {
  new: "Novo com etiqueta",
  like_new: "Novo sem etiqueta",
  excellent: "Excelente",
  good: "Bom",
  fair: "Regular",
};

interface ProductDetailProps {
  id: string;
}

export function ProductDetail({ id }: ProductDetailProps) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    productsApi
      .get(id)
      .then(setProduct)
      .catch(() => setProduct(null))
      .finally(() => setIsLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("Tem certeza que deseja excluir esta peça?")) return;

    setIsDeleting(true);
    try {
      await productsApi.delete(id);
      router.push("/admin/products");
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Erro ao excluir produto");
    } finally {
      setIsDeleting(false);
    }
  };

  const formatCurrency = (value: number) => {
    if (isNaN(value)) return "-";
    if (value === 0) return "Grátis";

    return parseFloat(value.toString()).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

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

  if (!product) {
    return (
      <div className="p-4">
        <div className="flex items-center gap-3 mb-6">
          <Button asChild variant="ghost" size="icon">
            <Link href="/admin/products">
              <ArrowLeft className="h-5 w-5" style={{ color: "var(--text)" }} />
            </Link>
          </Button>
          <h1 className="text-xl font-bold" style={{ color: "var(--text)" }}>
            Peça nao encontrada
          </h1>
        </div>
        <p className="font-serif" style={{ color: "var(--text-aux)" }}>
          A peça que voce esta procurando nao existe ou foi removida.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="icon">
            <Link href="/admin/products">
              <ArrowLeft className="h-5 w-5" style={{ color: "var(--text)" }} />
            </Link>
          </Button>
          <h1 className="text-xl font-bold" style={{ color: "var(--text)" }}>
            Detalhes
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            asChild
            variant="outline"
            size="icon"
            className="bg-transparent"
            style={{ borderColor: "var(--highlight-blur)" }}
          >
            <Link href={`/admin/products/${product.id}/edit`}>
              <Pencil className="h-4 w-4" style={{ color: "var(--text)" }} />
            </Link>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="bg-transparent"
            style={{ borderColor: "var(--highlight-blur)" }}
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <Loader2
                className="h-4 w-4 animate-spin"
                style={{ color: "var(--button)" }}
              />
            ) : (
              <Trash2 className="h-4 w-4" style={{ color: "var(--button)" }} />
            )}
          </Button>
        </div>
      </div>

      {/* Images */}
      <div className="space-y-2">
        <div
          className="aspect-square rounded-xl overflow-hidden"
          style={{ backgroundColor: "var(--background-aux)" }}
        >
          <img
            src={product.images?.[0] || "/placeholder.svg"}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        </div>
        {product.images && product.images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {product.images.map((image, index) => (
              <div
                key={index}
                className="w-16 h-16 rounded-lg overflow-hidden shrink-0"
                style={{ backgroundColor: "var(--background-aux)" }}
              >
                <img
                  src={image || "/placeholder.svg"}
                  alt={`${product.title} ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main Info */}
      <Card
        className="border-0 "
        style={{ backgroundColor: "var(--background)" }}
      >
        <CardContent className="p-4 space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h2
                className="text-lg font-bold"
                style={{ color: "var(--text)" }}
              >
                {product.title}
              </h2>
              <p
                className="text-sm font-serif"
                style={{ color: "var(--text-aux)" }}
              >
                {product.brand || "Sem marca"}
              </p>
            </div>
            <p className="text-xl font-bold" style={{ color: "var(--text)" }}>
              {formatCurrency(product.price ?? 0)}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <StatusBadge variant={getProductStatusVariant(product.status)}>
              {productStatusLabels[product.status] || product.status}
            </StatusBadge>
            {product.collection && (
              <span
                className="text-sm font-serif"
                style={{ color: "var(--text-aux)" }}
              >
                {product.collection.title}
              </span>
            )}
          </div>

          {product.description && (
            <p
              className="text-sm font-serif leading-relaxed"
              style={{ color: "var(--text)" }}
            >
              {product.description}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Details */}
      <Card
        className="border-0 "
        style={{ backgroundColor: "var(--background)" }}
      >
        <CardHeader className="pb-2">
          <CardTitle className="text-base" style={{ color: "var(--text)" }}>
            Detalhes
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <dl className="space-y-3">
            <div className="flex justify-between">
              <dt
                className="text-sm font-serif"
                style={{ color: "var(--text-aux)" }}
              >
                Categoria
              </dt>
              <dd
                className="text-sm font-medium"
                style={{ color: "var(--text)" }}
              >
                {product.category}
              </dd>
            </div>
            {product.size && (
              <div className="flex justify-between">
                <dt
                  className="text-sm font-serif"
                  style={{ color: "var(--text-aux)" }}
                >
                  Tamanho
                </dt>
                <dd
                  className="text-sm font-medium"
                  style={{ color: "var(--text)" }}
                >
                  {product.size}
                </dd>
              </div>
            )}
            {product.condition && (
              <div className="flex justify-between">
                <dt
                  className="text-sm font-serif"
                  style={{ color: "var(--text-aux)" }}
                >
                  Estado
                </dt>
                <dd
                  className="text-sm font-medium"
                  style={{ color: "var(--text)" }}
                >
                  {conditionLabels[product.condition] || product.condition}
                </dd>
              </div>
            )}
            {product.original_price && (
              <div className="flex justify-between">
                <dt
                  className="text-sm font-serif"
                  style={{ color: "var(--text-aux)" }}
                >
                  Preço original
                </dt>
                <dd
                  className="text-sm font-medium"
                  style={{ color: "var(--text)" }}
                >
                  {formatCurrency(product.original_price)}
                </dd>
              </div>
            )}
          </dl>
        </CardContent>
      </Card>

      {/* Measurements */}
      {product.measurements && Object.keys(product.measurements).length > 0 && (
        <Card
          className="border-0 "
          style={{ backgroundColor: "var(--background)" }}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-base" style={{ color: "var(--text)" }}>
              Medidas
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <dl className="space-y-3">
              {Object.entries(product.measurements).map(([name, value]) => (
                <div key={name} className="flex justify-between">
                  <dt
                    className="text-sm font-serif"
                    style={{ color: "var(--text-aux)" }}
                  >
                    {name}
                  </dt>
                  <dd
                    className="text-sm font-medium"
                    style={{ color: "var(--text)" }}
                  >
                    {value} cm
                  </dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div
        className="sticky bottom-20 pt-4 pb-2"
        style={{ backgroundColor: "var(--background)" }}
      >
        <Button
          asChild
          className="w-full h-12 text-base"
          style={{
            backgroundColor: "var(--button)",
            color: "var(--background)",
          }}
        >
          <Link href={`/admin/products/${product.id}/edit`}>
            <Pencil className="h-5 w-5 mr-2" />
            Editar peça
          </Link>
        </Button>
      </div>
    </div>
  );
}
