"use client";

import React from "react"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { FormSection } from "@/components/admin/form-section";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { collectionsApi, type Collection } from "@/lib/api";

interface DropFormProps {
  drop?: Collection;
  isEditing?: boolean;
}

export function DropForm({ drop, isEditing = false }: DropFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [name, setName] = useState(drop?.name || "");
  const [description, setDescription] = useState(drop?.description || "");
  const [isActive, setIsActive] = useState(drop?.is_active ?? false);

  // Auto-generate slug preview
  const slug = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      if (isEditing && drop) {
        await collectionsApi.update(drop.id, { name, description });
        if (drop.is_active !== isActive) {
          await collectionsApi.toggle(drop.id);
        }
      } else {
        const newCollection = await collectionsApi.create({ name, description });
        if (isActive) {
          await collectionsApi.toggle(newCollection.id);
        }
      }
      router.push("/admin/drops");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar drop");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="icon">
          <Link href="/admin/drops">
            <ArrowLeft className="h-5 w-5" style={{ color: "var(--text)" }} />
          </Link>
        </Button>
        <h1 className="text-xl font-bold" style={{ color: "var(--text)" }}>
          {isEditing ? "Editar drop" : "Novo drop"}
        </h1>
      </div>

      {error && (
        <div
          className="p-3 rounded-lg text-sm"
          style={{
            backgroundColor: "var(--button)",
            color: "var(--background)",
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <Card className="border-0 " style={{ backgroundColor: "var(--background)" }}>
          <CardContent className="p-4">
            <FormSection title="Informacoes do drop">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" style={{ color: "var(--text)" }}>
                    Nome do drop *
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Verao 2026"
                    required
                    style={{
                      backgroundColor: "var(--background-aux)",
                      borderColor: "var(--highlight-blur)",
                      color: "var(--text)",
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label style={{ color: "var(--text)" }}>Slug (URL)</Label>
                  <p
                    className="text-sm p-2 rounded"
                    style={{
                      backgroundColor: "var(--background-aux)",
                      color: "var(--text-aux)",
                    }}
                  >
                    /drops/{slug || "slug-do-drop"}
                  </p>
                  <p className="text-xs font-serif" style={{ color: "var(--text-aux)" }}>
                    Gerado automaticamente a partir do nome
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" style={{ color: "var(--text)" }}>
                    Descricao
                  </Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Descreva o drop..."
                    rows={3}
                    style={{
                      backgroundColor: "var(--background-aux)",
                      borderColor: "var(--highlight-blur)",
                      color: "var(--text)",
                    }}
                  />
                </div>
              </div>
            </FormSection>
          </CardContent>
        </Card>

        {/* Status */}
        <Card className="border-0 " style={{ backgroundColor: "var(--background)" }}>
          <CardContent className="p-4">
            <FormSection title="Status" description="Configure a visibilidade do drop">
              <div
                className="flex items-center justify-between p-4 rounded-lg"
                style={{ backgroundColor: "var(--background-aux)" }}
              >
                <div className="space-y-0.5">
                  <Label
                    htmlFor="isActive"
                    className="text-sm font-medium"
                    style={{ color: "var(--text)" }}
                  >
                    Drop ativo
                  </Label>
                  <p className="text-xs font-serif" style={{ color: "var(--text-aux)" }}>
                    Drops ativos aparecem na loja
                  </p>
                </div>
                <Switch id="isActive" checked={isActive} onCheckedChange={setIsActive} />
              </div>
            </FormSection>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div
          className="sticky bottom-20 pt-4 pb-2"
          style={{ backgroundColor: "var(--background)" }}
        >
          <Button
            type="submit"
            className="w-full h-12 text-base"
            disabled={isSubmitting}
            style={{
              backgroundColor: "var(--button)",
              color: "var(--background)",
            }}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="h-5 w-5 mr-2" />
                {isEditing ? "Salvar alteracoes" : "Criar drop"}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
