"use client";

import { useState } from "react";
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
import { Plus, Search, Eye, Pencil, ChevronRight } from "lucide-react";
import {
  products,
  drops,
  getDropById,
  productStatusLabels,
  type ProductStatus,
} from "@/lib/mock-data";

export function ProductsList() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProductStatus | "all">(
    "all",
  );
  const [dropFilter, setDropFilter] = useState<string>("all");

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.brand.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || product.status === statusFilter;
    const matchesDrop = dropFilter === "all" || product.dropId === dropFilter;

    return matchesSearch && matchesStatus && matchesDrop;
  });

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
        <h1 className="text-xl font-bold text-foreground">Peças</h1>
        <Button asChild size="sm">
          <Link href="/admin/products/new">
            <Plus className="h-4 w-4 mr-1" />
            Nova peça
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou marca..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex gap-2">
          <Select
            value={statusFilter}
            onValueChange={(value) =>
              setStatusFilter(value as ProductStatus | "all")
            }
          >
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              <SelectItem value="available">Disponível</SelectItem>
              <SelectItem value="reserved">Reservada</SelectItem>
              <SelectItem value="sold">Vendida</SelectItem>
            </SelectContent>
          </Select>

          <Select value={dropFilter} onValueChange={setDropFilter}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Drop" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os drops</SelectItem>
              {drops.map((drop) => (
                <SelectItem key={drop.id} value={drop.id}>
                  {drop.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground font-serif">
        {filteredProducts.length}{" "}
        {filteredProducts.length === 1
          ? "peça encontrada"
          : "peças encontradas"}
      </p>

      {/* Products Grid (Cards for mobile) */}
      <div className="space-y-3">
        {filteredProducts.map((product) => {
          const drop = getDropById(product.dropId);

          return (
            <Card key={product.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex gap-3 p-3">
                  {/* Image */}
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-secondary shrink-0">
                    <img
                      src={product.images[0] || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-sm font-semibold text-foreground truncate">
                          {product.name}
                        </h3>
                        <p className="text-xs text-muted-foreground font-serif">
                          {product.brand} • Tam. {product.size}
                        </p>
                      </div>
                      <p className="text-sm font-bold text-foreground whitespace-nowrap">
                        {formatCurrency(product.price)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <StatusBadge
                          variant={getProductStatusVariant(product.status)}
                        >
                          {productStatusLabels[product.status]}
                        </StatusBadge>
                        {drop && (
                          <span className="text-xs text-muted-foreground font-serif">
                            {drop.name}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 mt-3">
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="flex-1 bg-transparent"
                      >
                        <Link href={`/admin/products/${product.id}`}>
                          <Eye className="h-3 w-3 mr-1" />
                          Ver
                        </Link>
                      </Button>
                      <Button
                        asChild
                        variant="secondary"
                        size="sm"
                        className="flex-1"
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
          );
        })}

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground font-serif">
              Nenhuma peça encontrada
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
