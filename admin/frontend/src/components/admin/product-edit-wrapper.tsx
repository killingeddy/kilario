"use client";

import { ProductForm } from "@/components/admin/product-form";
import { products } from "@/lib/mock-data";

interface ProductEditWrapperProps {
  id: string;
}

export function ProductEditWrapper({ id }: ProductEditWrapperProps) {
  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="p-4">
        <p className="text-muted-foreground font-serif">Peça não encontrada</p>
      </div>
    );
  }

  return <ProductForm product={product} isEditing />;
}
