"use client";

import React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { FormSection } from "@/components/admin/form-section";
import { ImageUploader } from "@/components/admin/image-uploader";
import { MeasurementInput } from "@/components/admin/measurement-input";
import { ArrowLeft, Save } from "lucide-react";
import {
  drops,
  sizeOptions,
  conditionLabels,
  productStatusLabels,
  type Product,
  type Measurement,
  type ClothingCondition,
  type ProductStatus,
} from "@/lib/mock-data";

interface ProductFormProps {
  product?: Product;
  isEditing?: boolean;
}

export function ProductForm({ product, isEditing = false }: ProductFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [name, setName] = useState(product?.name || "");
  const [description, setDescription] = useState(product?.description || "");
  const [brand, setBrand] = useState(product?.brand || "");
  const [price, setPrice] = useState(product?.price?.toString() || "");
  const [dropId, setDropId] = useState(product?.dropId || "");
  const [size, setSize] = useState(product?.size || "");
  const [condition, setCondition] = useState<ClothingCondition | "">(
    product?.condition || "",
  );
  const [status, setStatus] = useState<ProductStatus>(
    product?.status || "available",
  );
  const [images, setImages] = useState<string[]>(product?.images || []);
  const [measurements, setMeasurements] = useState<Measurement[]>(
    product?.measurements || [],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // In a real app, this would send data to the API
    console.log({
      name,
      description,
      brand,
      price: parseFloat(price),
      dropId,
      size,
      condition,
      status,
      images,
      measurements,
    });

    setIsSubmitting(false);
    router.push("/admin/products");
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="icon">
          <Link href="/admin/products">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-xl font-bold text-foreground">
          {isEditing ? "Editar peça" : "Nova peça"}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Images */}
        <Card>
          <CardContent className="p-4">
            <FormSection
              title="Imagens"
              description="Adicione até 5 fotos da peça"
            >
              <ImageUploader
                images={images}
                onChange={setImages}
                maxImages={5}
              />
            </FormSection>
          </CardContent>
        </Card>

        {/* Basic Info */}
        <Card>
          <CardContent className="p-4">
            <FormSection title="Informações básicas">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome da peça *</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Vestido Floral Midi"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Descreva a peça..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="brand">Marca</Label>
                    <Input
                      id="brand"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      placeholder="Ex: Farm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Preço (R$) *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="0,00"
                      required
                    />
                  </div>
                </div>
              </div>
            </FormSection>
          </CardContent>
        </Card>

        {/* Classification */}
        <Card>
          <CardContent className="p-4">
            <FormSection title="Classificação">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Drop / Coleção *</Label>
                  <Select value={dropId} onValueChange={setDropId} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um drop" />
                    </SelectTrigger>
                    <SelectContent>
                      {drops.map((drop) => (
                        <SelectItem key={drop.id} value={drop.id}>
                          {drop.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Tamanho *</Label>
                    <Select value={size} onValueChange={setSize} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {sizeOptions.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Estado *</Label>
                    <Select
                      value={condition}
                      onValueChange={(v) =>
                        setCondition(v as ClothingCondition)
                      }
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(conditionLabels).map(
                          ([value, label]) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          ),
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={status}
                    onValueChange={(v) => setStatus(v as ProductStatus)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(productStatusLabels).map(
                        ([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </FormSection>
          </CardContent>
        </Card>

        {/* Measurements */}
        <Card>
          <CardContent className="p-4">
            <FormSection
              title="Medidas"
              description="Adicione as medidas da peça para ajudar na escolha"
            >
              <MeasurementInput
                measurements={measurements}
                onChange={setMeasurements}
              />
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
                : "Cadastrar peça"}
          </Button>
        </div>
      </form>
    </div>
  );
}
