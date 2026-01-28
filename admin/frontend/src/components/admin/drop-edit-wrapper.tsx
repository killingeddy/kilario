"use client";

import { useEffect, useState } from "react";
import { DropForm } from "@/components/admin/drop-form";
import { collectionsApi, type Collection } from "@/lib/api";
import { Loader2 } from "lucide-react";

interface DropEditWrapperProps {
  id: string;
}

export function DropEditWrapper({ id }: DropEditWrapperProps) {
  const [collection, setCollection] = useState<Collection | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    collectionsApi
      .get(id)
      .then((res) => setCollection(res.data))
      .catch(() => setCollection(null))
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

  if (!collection) {
    return (
      <div className="p-4">
        <p className="font-serif" style={{ color: "var(--text-aux)" }}>
          Drop nao encontrado
        </p>
      </div>
    );
  }

  return <DropForm drop={collection} isEditing />;
}
