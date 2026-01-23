"use client";

import React from "react";

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
import { ArrowLeft, Save } from "lucide-react";
import type { Drop } from "@/lib/mock-data";

interface DropFormProps {
  drop?: Drop;
  isEditing?: boolean;
}

export function DropForm({ drop, isEditing = false }: DropFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [name, setName] = useState(drop?.name || "");
  const [slug, setSlug] = useState(drop?.slug || "");
  const [description, setDescription] = useState(drop?.description || "");
  const [launchDate, setLaunchDate] = useState("");
  const [launchTime, setLaunchTime] = useState("");
  const [isActive, setIsActive] = useState(drop?.isActive ?? false);

  // Initialize date/time from drop
  useEffect(() => {
    if (drop?.launchDate) {
      const date = new Date(drop.launchDate);
      setLaunchDate(date.toISOString().split("T")[0]);
      setLaunchTime(date.toTimeString().slice(0, 5));
    }
  }, [drop]);

  // Auto-generate slug from name
  useEffect(() => {
    if (!isEditing && name) {
      const generatedSlug = name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setSlug(generatedSlug);
    }
  }, [name, isEditing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Combine date and time
    const launchDateTime = new Date(`${launchDate}T${launchTime || "00:00"}`);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log({
      name,
      slug,
      description,
      launchDate: launchDateTime.toISOString(),
      isActive,
    });

    setIsSubmitting(false);
    router.push("/admin/drops");
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="icon">
          <Link href="/admin/drops">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-xl font-bold text-foreground">
          {isEditing ? "Editar drop" : "Novo drop"}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardContent className="p-4">
            <FormSection title="Informações do drop">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome do drop *</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Verão 2026"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">Slug (URL)</Label>
                  <Input
                    id="slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="verao-2026"
                  />
                  <p className="text-xs text-muted-foreground font-serif">
                    URL: /drops/{slug || "slug-do-drop"}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Descreva o drop..."
                    rows={3}
                  />
                </div>
              </div>
            </FormSection>
          </CardContent>
        </Card>

        {/* Launch Settings */}
        <Card>
          <CardContent className="p-4">
            <FormSection
              title="Lançamento"
              description="Configure quando o drop será disponibilizado"
            >
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="launchDate">Data *</Label>
                    <Input
                      id="launchDate"
                      type="date"
                      value={launchDate}
                      onChange={(e) => setLaunchDate(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="launchTime">Horário</Label>
                    <Input
                      id="launchTime"
                      type="time"
                      value={launchTime}
                      onChange={(e) => setLaunchTime(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                  <div className="space-y-0.5">
                    <Label htmlFor="isActive" className="text-sm font-medium">
                      Drop ativo
                    </Label>
                    <p className="text-xs text-muted-foreground font-serif">
                      Drops ativos aparecem na loja
                    </p>
                  </div>
                  <Switch
                    id="isActive"
                    checked={isActive}
                    onCheckedChange={setIsActive}
                  />
                </div>
              </div>
            </FormSection>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="sticky bottom-20 bg-background pt-4 pb-2">
          <Button
            type="submit"
            className="w-full h-12 text-base"
            disabled={isSubmitting}
          >
            <Save className="h-5 w-5 mr-2" />
            {isSubmitting
              ? "Salvando..."
              : isEditing
                ? "Salvar alterações"
                : "Criar drop"}
          </Button>
        </div>
      </form>
    </div>
  );
}
