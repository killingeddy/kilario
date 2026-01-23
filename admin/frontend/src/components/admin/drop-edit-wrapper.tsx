"use client";

import { DropForm } from "@/components/admin/drop-form";
import { drops } from "@/lib/mock-data";

interface DropEditWrapperProps {
  id: string;
}

export function DropEditWrapper({ id }: DropEditWrapperProps) {
  const drop = drops.find((d) => d.id === id);

  if (!drop) {
    return (
      <div className="p-4">
        <p className="text-muted-foreground font-serif">Drop não encontrado</p>
      </div>
    );
  }

  return <DropForm drop={drop} isEditing />;
}
