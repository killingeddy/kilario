"use client";

import React from "react";

import { useEffect, useState } from "react";
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
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import {
  productsApi,
  collectionsApi,
  type Product,
  type Collection,
  type CreateProductData,
} from "@/lib/api";

const sizeOptions = [
  "PP",
  "P",
  "M",
  "G",
  "GG",
  "XG",
  "36",
  "38",
  "40",
  "42",
  "44",
  "46",
];

const conditionLabels: Record<string, string> = {
  new: "Novo com etiqueta",
  like_new: "Novo sem etiqueta",
  excellent: "Excelente",
  good: "Bom",
  fair: "Regular",
};

const productStatusLabels: Record<string, string> = {
  draft: "Rascunho",
  available: "Disponivel",
  sold: "Vendida",
  archived: "Arquivada",
};

interface Measurement {
  name: string;
  value: string;
}

interface ProductFormProps {
  product?: Product;
  isEditing?: boolean;
}

export function ProductForm({ product, isEditing = false }: ProductFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [error, setError] = useState("");

  // Form state
  const [title, setTitle] = useState(product?.title || "");
  const [description, setDescription] = useState(product?.description || "");
  const [brand, setBrand] = useState(product?.brand || "");
  const [category, setCategory] = useState(product?.category || "");
  const [price, setPrice] = useState(
    product?.price?.toString() || "",
  );
  const [originalPrice, setOriginalPrice] = useState(
    product?.original_price?.toString() || "",
  );
  const [collectionId, setCollectionId] = useState(
    product?.collection_id || "none",
  );
  const [sizeId, setSizeId] = useState(product?.size_id || "none");
  const [condition, setCondition] = useState(product?.condition || "none");
  const [status, setStatus] = useState(product?.status || "draft");
  const [images, setImages] = useState<string[]>(product?.images || []);
  const [measurements, setMeasurements] = useState<Measurement[]>(
    product?.measurements
      ? Object.entries(product.measurements).map(([name, value]) => ({
          name,
          value: String(value),
        }))
      : [],
  );

  useEffect(() => {
    collectionsApi
      .list()
      .then((res) => setCollections(res.data || []))
      .catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const measurementsObj: Record<string, number> = {};
    for (const m of measurements) {
      if (m.name && m.value) {
        measurementsObj[m.name] = Number.parseFloat(m.value);
      }
    }

    const data: CreateProductData = {
      title,
      description: description || undefined,
      category,
      brand: brand || undefined,
      size_id: sizeId || undefined,
      condition: condition || undefined,
      original_price: originalPrice ? Number.parseFloat(originalPrice) : undefined,
      price: Number.parseFloat(price),
      status,
      images: images.length > 0 ? images : undefined,
      measurements:
        Object.keys(measurementsObj).length > 0 ? measurementsObj : undefined,
      collection_id: collectionId || undefined,
    };

    try {
      if (isEditing && product) {
        await productsApi.update(product.id, data);
      } else {
        await productsApi.create(data);
      }
      router.push("/admin/products");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar produto");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="icon">
          <Link href="/admin/products">
            <ArrowLeft className="h-5 w-5" style={{ color: "var(--text)" }} />
          </Link>
        </Button>
        <h1 className="text-xl font-bold" style={{ color: "var(--text)" }}>
          {isEditing ? "Editar peça" : "Nova peça"}
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
        {/* Images */}
        <Card
          className="border-0 "
          style={{ backgroundColor: "var(--background)" }}
        >
          <CardContent className="p-4">
            <FormSection
              title="Imagens"
              description="Adicione ate 5 fotos da peça"
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
        <Card
          className="border-0 "
          style={{ backgroundColor: "var(--background)" }}
        >
          <CardContent className="p-4">
            <FormSection title="Informacoes basicas">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title" style={{ color: "var(--text)" }}>
                    Nome da peça *
                  </Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Vestido Floral Midi"
                    required
                    style={{
                      backgroundColor: "var(--background-aux)",
                      borderColor: "var(--highlight-blur)",
                      color: "var(--text)",
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category" style={{ color: "var(--text)" }}>
                    Categoria *
                  </Label>
                  <Input
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Ex: Vestido, Blusa, Calca"
                    required
                    style={{
                      backgroundColor: "var(--background-aux)",
                      borderColor: "var(--highlight-blur)",
                      color: "var(--text)",
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" style={{ color: "var(--text)" }}>
                    Descricao
                  </Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Descreva a peça..."
                    rows={3}
                    style={{
                      backgroundColor: "var(--background-aux)",
                      borderColor: "var(--highlight-blur)",
                      color: "var(--text)",
                    }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="brand" style={{ color: "var(--text)" }}>
                      Marca
                    </Label>
                    <Input
                      id="brand"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      placeholder="Ex: Farm"
                      style={{
                        backgroundColor: "var(--background-aux)",
                        borderColor: "var(--highlight-blur)",
                        color: "var(--text)",
                      }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="originaPrice" style={{ color: "var(--text)" }}>
                      Preco de custo (R$)
                    </Label>
                    <Input
                      id="originaPrice"
                      type="number"
                      step="0.01"
                      min="0"
                      value={originalPrice}
                      onChange={(e) => setOriginalPrice(e.target.value)}
                      placeholder="0,00"
                      style={{
                        backgroundColor: "var(--background-aux)",
                        borderColor: "var(--highlight-blur)",
                        color: "var(--text)",
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pric" style={{ color: "var(--text)" }}>
                      Preco de venda (R$) *
                    </Label>
                    <Input
                      id="pric"
                      type="number"
                      step="0.01"
                      min="0"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="0,00"
                      required
                      style={{
                        backgroundColor: "var(--background-aux)",
                        borderColor: "var(--highlight-blur)",
                        color: "var(--text)",
                      }}
                    />
                  </div>
                </div>
              </div>
            </FormSection>
          </CardContent>
        </Card>

        {/* Classification */}
        <Card
          className="border-0 "
          style={{ backgroundColor: "var(--background)" }}
        >
          <CardContent className="p-4">
            <FormSection title="Classificacao">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label style={{ color: "var(--text)" }}>Drop / Colecao</Label>
                  <Select value={collectionId} onValueChange={setCollectionId}>
                    <SelectTrigger
                      style={{
                        backgroundColor: "var(--background-aux)",
                        borderColor: "var(--highlight-blur)",
                        color: "var(--text)",
                      }}
                    >
                      <SelectValue placeholder="Selecione um drop" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Nenhum</SelectItem>
                      {collections.map((collection) => (
                        <SelectItem key={collection.id} value={collection.id}>
                          {collection.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label style={{ color: "var(--text)" }}>Tamanho</Label>
                    <Select value={sizeId} onValueChange={setSizeId}>
                      <SelectTrigger
                        style={{
                          backgroundColor: "var(--background-aux)",
                          borderColor: "var(--highlight-blur)",
                          color: "var(--text)",
                        }}
                      >
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
                    <Label style={{ color: "var(--text)" }}>Estado</Label>
                    <Select value={condition} onValueChange={setCondition}>
                      <SelectTrigger
                        style={{
                          backgroundColor: "var(--background-aux)",
                          borderColor: "var(--highlight-blur)",
                          color: "var(--text)",
                        }}
                      >
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
                  <Label style={{ color: "var(--text)" }}>Status</Label>
                  <Select
                    value={status}
                    // onValueChange={setStatus}
                  >
                    <SelectTrigger
                      style={{
                        backgroundColor: "var(--background-aux)",
                        borderColor: "var(--highlight-blur)",
                        color: "var(--text)",
                      }}
                    >
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
        <Card
          className="border-0 "
          style={{ backgroundColor: "var(--background)" }}
        >
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
        <div
          className="pt-4 pb-2"
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
                {isEditing ? "Salvar alteracoes" : "Cadastrar peça"}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
