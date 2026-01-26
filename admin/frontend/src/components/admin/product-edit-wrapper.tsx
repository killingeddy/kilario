"use client";

import { useEffect, useState } from "react";
import { ProductForm } from "@/components/admin/product-form";
import { productsApi, type Product } from "@/lib/api";
import { Loader2 } from "lucide-react";

interface ProductEditWrapperProps {
  id: string;
}

export function ProductEditWrapper({ id }: ProductEditWrapperProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    productsApi
      .get(id)
      .then(setProduct)
      .catch(() => setProduct(null))
      .finally(() => setIsLoading(false));
  }, [id]);

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
        <p className="font-serif" style={{ color: "var(--text-aux)" }}>
          Peca nao encontrada
        </p>
      </div>
    );
  }

  return <ProductForm product={product} isEditing />;
}
