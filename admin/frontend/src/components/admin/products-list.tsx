"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  StatusBadge,
  getProductStatusVariant,
} from "@/components/admin/status-badge";
import { Plus, Search, Eye, Pencil, Loader2 } from "lucide-react";
import {
  productsApi,
  collectionsApi,
  type Product,
  type Collection,
} from "@/lib/api";

const productStatusLabels: Record<string, string> = {
  draft: "Rascunho",
  available: "Disponivel",
  sold: "Vendida",
  archived: "Arquivada",
};

export function ProductsList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [collectionFilter, setCollectionFilter] = useState<string>("all");
  const [total, setTotal] = useState(0);

  useEffect(() => {
    async function loadData() {
      try {
        const [productsRes, collectionsRes] = await Promise.all([
          productsApi.list({
            search: search || undefined,
            status: statusFilter !== "all" ? statusFilter : undefined,
            collection_id:
              collectionFilter !== "all" ? collectionFilter : undefined,
          }),
          collectionsApi.list(),
        ]);
        setProducts(productsRes.data || []);
        setTotal(productsRes.total || 0);
        setCollections(collectionsRes.data || []);
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setIsLoading(false);
      }
    }

    const debounce = setTimeout(() => {
      setIsLoading(true);
      loadData();
    }, 300);

    return () => clearTimeout(debounce);
  }, [search, statusFilter, collectionFilter]);

  const formatCurrency = (value: number) => {
    if (isNaN(value)) return "-";
    if (value === 0) return "Grátis";

    return parseFloat(value.toString()).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold" style={{ color: "var(--text)" }}>
          Peças
        </h1>
        <Button
          asChild
          size="sm"
          style={{
            backgroundColor: "var(--button)",
            color: "var(--background)",
          }}
        >
          <Link href="/admin/products/new">
            <Plus className="h-4 w-4 mr-1" />
            Nova peça
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"
            style={{ color: "var(--text-aux)" }}
          />
          <Input
            placeholder="Buscar por nome ou marca..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            style={{
              backgroundColor: "var(--background-aux)",
              borderColor: "var(--highlight-blur)",
              color: "var(--text)",
            }}
          />
        </div>

        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger
              className="flex-1"
              style={{
                backgroundColor: "var(--background-aux)",
                borderColor: "var(--highlight-blur)",
                color: "var(--text)",
              }}
            >
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              <SelectItem value="draft">Rascunho</SelectItem>
              <SelectItem value="active">Disponivel</SelectItem>
              <SelectItem value="sold">Vendida</SelectItem>
              <SelectItem value="archived">Arquivada</SelectItem>
            </SelectContent>
          </Select>

          <Select value={collectionFilter} onValueChange={setCollectionFilter}>
            <SelectTrigger
              className="flex-1"
              style={{
                backgroundColor: "var(--background-aux)",
                borderColor: "var(--highlight-blur)",
                color: "var(--text)",
              }}
            >
              <SelectValue placeholder="Drop" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os drops</SelectItem>
              {collections.map((collection) => (
                <SelectItem key={collection.id} value={collection.id}>
                  {collection.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2
            className="h-8 w-8 animate-spin"
            style={{ color: "var(--button)" }}
          />
        </div>
      )}

      {/* Products Grid */}
      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map((product) => (
            <Card
              key={product.id}
              className="overflow-hidden border pt-0"
              style={{ backgroundColor: "var(--background)" }}
            >
              <CardContent className="p-0">
                <div className="flex gap-3 p-3">
                  {/* Image */}
                  {product.images?.[0] ? (
                    <div
                      className="w-20 h-20 rounded-lg overflow-hidden shrink-0"
                      style={{ backgroundColor: "var(--background-aux)" }}
                    >
                      <img
                        src={product.images?.[0] || "/placeholder.svg"}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div
                      className="flex items-center justify-center w-20 h-20 rounded-lg shrink-0"
                      style={{ backgroundColor: "var(--highlight-blur)" }}
                    >
                      <Search
                        className="h-6 w-6"
                        style={{ color: "var(--text)" }}
                      />
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3
                          className="text-sm font-semibold truncate"
                          style={{ color: "var(--text)" }}
                        >
                          {product.title}
                        </h3>
                        <p
                          className="text-xs font-serif"
                          style={{ color: "var(--text-aux)" }}
                        >
                          {product.brand || "Sem marca"} • Tam.{" "}
                          {product.size || "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center gap-2">
                        <StatusBadge
                          variant={getProductStatusVariant(product.status)}
                        >
                          {productStatusLabels[product.status] ||
                            product.status}
                        </StatusBadge>
                      </div>
                      <p
                        className="text-sm font-bold whitespace-nowrap"
                        style={{ color: "var(--text)" }}
                      >
                        {formatCurrency(product.price ?? 0)}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 mt-3">
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="flex-1 bg-transparent"
                        style={{ borderColor: "var(--highlight-blur)" }}
                      >
                        <Link href={`/admin/products/${product.id}`}>
                          <Eye className="h-3 w-3 mr-1" />
                          Ver
                        </Link>
                      </Button>
                      <Button
                        asChild
                        size="sm"
                        className="flex-1"
                        style={{
                          backgroundColor: "var(--background-aux)",
                          color: "var(--text)",
                        }}
                      >
                        <Link href={`/admin/products/${product.id}/edit`}>
                          <Pencil className="h-3 w-3 mr-1" />
                          Editar
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {products.length === 0 && (
            <div className="text-center py-12">
              <p className="font-serif" style={{ color: "var(--text-aux)" }}>
                Nenhuma peça encontrada
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
