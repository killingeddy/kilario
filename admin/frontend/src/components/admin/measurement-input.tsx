"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";
import type { Measurement } from "@/lib/mock-data";

interface MeasurementInputProps {
  measurements: Measurement[];
  onChange: (measurements: Measurement[]) => void;
}

const commonMeasurements = [
  "Busto",
  "Cintura",
  "Quadril",
  "Comprimento",
  "Ombro",
  "Manga",
  "Largura",
];

export function MeasurementInput({
  measurements,
  onChange,
}: MeasurementInputProps) {
  const [newName, setNewName] = useState("");
  const [newValue, setNewValue] = useState("");

  const addMeasurement = () => {
    if (newName && newValue) {
      onChange([...measurements, { name: newName, value: newValue }]);
      setNewName("");
      setNewValue("");
    }
  };

  const removeMeasurement = (index: number) => {
    onChange(measurements.filter((_, i) => i !== index));
  };

  const addQuickMeasurement = (name: string) => {
    if (!measurements.find((m) => m.name === name)) {
      onChange([...measurements, { name, value: "" }]);
    }
  };

  const updateMeasurementValue = (index: number, value: string) => {
    const updated = [...measurements];
    updated[index].value = value;
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      {/* Existing Measurements */}
      {measurements.length > 0 && (
        <div className="space-y-2">
          {measurements.map((measurement, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="flex-1 grid grid-cols-2 gap-2">
                <Input
                  value={measurement.name}
                  disabled
                  className="bg-secondary"
                />
                <Input
                  value={measurement.value}
                  onChange={(e) =>
                    updateMeasurementValue(index, e.target.value)
                  }
                  placeholder="Ex: 92cm"
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeMeasurement(index)}
                className="shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Quick Add Buttons */}
      <div className="flex flex-wrap gap-2">
        {commonMeasurements
          .filter((m) => !measurements.find((existing) => existing.name === m))
          .map((name) => (
            <Button
              key={name}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addQuickMeasurement(name)}
              className="text-xs"
            >
              <Plus className="h-3 w-3 mr-1" />
              {name}
            </Button>
          ))}
      </div>

      {/* Custom Measurement */}
      <div className="pt-2 border-t border-border">
        <Label className="text-xs text-muted-foreground mb-2 block">
          Adicionar medida personalizada
        </Label>
        <div className="flex items-center gap-2">
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Nome"
            className="flex-1"
          />
          <Input
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            placeholder="Valor"
            className="flex-1"
          />
          <Button
            type="button"
            variant="secondary"
            size="icon"
            onClick={addMeasurement}
            disabled={!newName || !newValue}
            className="shrink-0"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
