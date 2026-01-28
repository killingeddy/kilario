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
import {
  ArrowLeft,
  Pencil,
  Trash2,
  ShirtIcon,
  Plus,
  Eye,
  Loader2,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import {
  collectionsApi,
  productsApi,
  type Collection,
  type Product,
} from "@/lib/api";

const productStatusLabels: Record<string, string> = {
  draft: "Rascunho",
  available: "Disponivel",
  sold: "Vendida",
  archived: "Arquivada",
};

interface DropDetailProps {
  id: string;
}

export function DropDetail({ id }: DropDetailProps) {
  const router = useRouter();
  const [collection, setCollection] = useState<Collection | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [collectionRes, productsRes] = await Promise.all([
          collectionsApi.get(id),
          productsApi.list({ collection_id: id }),
        ]);
        setCollection(collectionRes.data);
        setProducts(productsRes.data || []);
      } catch (error) {
        console.error("Error loading collection:", error);
        setCollection(null);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("Tem certeza que deseja excluir este drop?")) return;

    setIsDeleting(true);
    try {
      await collectionsApi.delete(id);
      router.push("/admin/drops");
    } catch (error) {
      console.error("Error deleting collection:", error);
      alert("Erro ao excluir drop");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggle = async () => {
    if (!collection) return;

    setIsToggling(true);
    try {
      const updated = await collectionsApi.toggle(id);
      setCollection(updated.data);
    } catch (error) {
      console.error("Error toggling collection:", error);
      alert("Erro ao alterar status");
    } finally {
      setIsToggling(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
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

  if (!collection) {
    return (
      <div className="p-4">
        <div className="flex items-center gap-3 mb-6">
          <Button asChild variant="ghost" size="icon">
            <Link href="/admin/drops">
              <ArrowLeft className="h-5 w-5" style={{ color: "var(--text)" }} />
            </Link>
          </Button>
          <h1 className="text-xl font-bold" style={{ color: "var(--text)" }}>
            Drop nao encontrado
          </h1>
        </div>
        <p className="font-serif" style={{ color: "var(--text-aux)" }}>
          O drop que voce esta procurando nao existe ou foi removido.
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
            <Link href="/admin/drops">
              <ArrowLeft className="h-5 w-5" style={{ color: "var(--text)" }} />
            </Link>
          </Button>
          <h1 className="text-xl font-bold" style={{ color: "var(--text)" }}>
            {collection.title}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="bg-transparent"
            style={{ borderColor: "var(--highlight-blur)" }}
            onClick={handleToggle}
            disabled={isToggling}
          >
            {isToggling ? (
              <Loader2
                className="h-4 w-4 animate-spin"
                style={{ color: "var(--button)" }}
              />
            ) : collection.is_active ? (
              <ToggleRight className="h-4 w-4" style={{ color: "var(--button)" }} />
            ) : (
              <ToggleLeft className="h-4 w-4" style={{ color: "var(--text-aux)" }} />
            )}
          </Button>
          <Button
            asChild
            variant="outline"
            size="icon"
            className="bg-transparent"
            style={{ borderColor: "var(--highlight-blur)" }}
          >
            <Link href={`/admin/drops/${collection.id}/edit`}>
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

      {/* Info Card */}
      <Card className="border-0 " style={{ backgroundColor: "var(--background)" }}>
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center gap-2">
            <StatusBadge variant={collection.is_active ? "success" : "neutral"}>
              {collection.is_active ? "Ativo" : "Inativo"}
            </StatusBadge>
          </div>

          {collection.description && (
            <p
              className="text-sm font-serif leading-relaxed"
              style={{ color: "var(--text)" }}
            >
              {collection.description}
            </p>
          )}

          <div
            className="flex items-center gap-4 text-sm"
            style={{ color: "var(--text-aux)" }}
          >
            <span className="flex items-center gap-1.5">
              <ShirtIcon className="h-4 w-4" />
              {products.length} peças
            </span>
            <span>Criado em {formatDate(collection.created_at)}</span>
          </div>

          <div
            className="pt-2 border-t"
            style={{ borderColor: "var(--highlight-blur)" }}
          >
            <p className="text-xs font-serif" style={{ color: "var(--text-aux)" }}>
              URL: /drops/{collection.slug}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Products in Drop */}
      <Card className="border-0 " style={{ backgroundColor: "var(--background)" }}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base" style={{ color: "var(--text)" }}>
              Peças do drop
            </CardTitle>
            <Button
              asChild
              size="sm"
              variant="outline"
              className="bg-transparent"
              style={{ borderColor: "var(--highlight-blur)" }}
            >
              <Link href={`/admin/products/new?collection_id=${collection.id}`}>
                <Plus className="h-3 w-3 mr-1" />
                Adicionar
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {products.length === 0 ? (
            <div className="p-6 text-center">
              <ShirtIcon
                className="h-10 w-10 mx-auto mb-2"
                style={{ color: "var(--text-aux)" }}
              />
              <p className="text-sm font-serif" style={{ color: "var(--text-aux)" }}>
                Nenhuma peça neste drop ainda
              </p>
            </div>
          ) : (
            <div className="divide-y" style={{ borderColor: "var(--highlight-blur)" }}>
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/admin/products/${product.id}`}
                  className="flex items-center gap-3 p-4 transition-opacity hover:opacity-80"
                >
                  <div
                    className="w-12 h-12 rounded-lg overflow-hidden shrink-0"
                    style={{ backgroundColor: "var(--background-aux)" }}
                  >
                    <img
                      src={product.images?.[0] || "/placeholder.svg"}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm font-medium truncate"
                      style={{ color: "var(--text)" }}
                    >
                      {product.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <StatusBadge variant={getProductStatusVariant(product.status)}>
                        {productStatusLabels[product.status] || product.status}
                      </StatusBadge>
                      <span
                        className="text-xs font-serif"
                        style={{ color: "var(--text-aux)" }}
                      >
                        {formatCurrency(product.price ?? 0)}
                      </span>
                    </div>
                  </div>
                  <Eye className="h-4 w-4" style={{ color: "var(--text-aux)" }} />
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

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
          <Link href={`/admin/drops/${collection.id}/edit`}>
            <Pencil className="h-5 w-5 mr-2" />
            Editar drop
          </Link>
        </Button>
      </div>
    </div>
  );
}
