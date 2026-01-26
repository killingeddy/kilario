"use client";

import { useState } from "react";
import Link from "next/link";
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
  getDeliveryStatusVariant,
} from "@/components/admin/status-badge";
import { Search, Truck, MapPin, ChevronRight, Calendar } from "lucide-react";
import {
  deliveries,
  deliveryStatusLabels,
  type DeliveryStatus,
} from "@/lib/mock-data";

export function DeliveriesList() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<DeliveryStatus | "all">(
    "all",
  );

  const filteredDeliveries = deliveries.filter((delivery) => {
    const matchesSearch =
      delivery.customerName.toLowerCase().includes(search.toLowerCase()) ||
      delivery.address.neighborhood
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      delivery.orderId.includes(search);
    const matchesStatus =
      statusFilter === "all" || delivery.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const pendingCount = deliveries.filter((d) => d.status === "pending").length;
  const scheduledCount = deliveries.filter(
    (d) => d.status === "scheduled",
  ).length;

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">Entregas</h1>
      </div>

      {/* Stats */}
      <div className="flex gap-4 text-sm">
        <span className="text-muted-foreground font-serif">
          {pendingCount} pendentes • {scheduledCount} agendadas
        </span>
      </div>

      {/* Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por cliente ou bairro..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select
          value={statusFilter}
          onValueChange={(value) =>
            setStatusFilter(value as DeliveryStatus | "all")
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="pending">Pendente</SelectItem>
            <SelectItem value="scheduled">Agendada</SelectItem>
            <SelectItem value="delivered">Entregue</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDeliveries.map((delivery) => (
          <Link key={delivery.id} href={`/admin/deliveries/${delivery.id}`}>
            <Card className="hover:bg-secondary/50 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-accent/20 shrink-0">
                      <Truck className="h-5 w-5 text-accent-foreground" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {delivery.customerName}
                      </p>
                      <p className="text-xs text-muted-foreground font-serif mt-0.5">
                        Pedido #{delivery.orderId}
                      </p>

                      <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {delivery.address.neighborhood}
                      </div>

                      <div className="flex items-center gap-2 mt-2">
                        <StatusBadge
                          variant={getDeliveryStatusVariant(delivery.status)}
                        >
                          {deliveryStatusLabels[delivery.status]}
                        </StatusBadge>
                        {delivery.scheduledDate && (
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {formatDate(delivery.scheduledDate)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}

        {filteredDeliveries.length === 0 && (
          <div className="text-center py-12">
            <Truck className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground font-serif">
              Nenhuma entrega encontrada
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
