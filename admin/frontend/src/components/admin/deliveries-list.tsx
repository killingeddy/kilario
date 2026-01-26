"use client";

import { useEffect, useState } from "react";
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
import {
  Search,
  Truck,
  MapPin,
  ChevronRight,
  Calendar,
  Loader2,
} from "lucide-react";
import { deliveriesApi, type Delivery } from "@/lib/api";

const deliveryStatusLabels: Record<string, string> = {
  pending: "Pendente",
  scheduled: "Agendada",
  in_transit: "Em transito",
  delivered: "Entregue",
  failed: "Falhou",
};

export function DeliveriesList() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    async function loadDeliveries() {
      try {
        const res = await deliveriesApi.list({
          status: statusFilter !== "all" ? statusFilter : undefined,
        });
        let data = res.data || [];

        // Client-side search filtering
        if (search) {
          const searchLower = search.toLowerCase();
          data = data.filter(
            (delivery) =>
              delivery.order?.customer_name
                ?.toLowerCase()
                .includes(searchLower) ||
              delivery.order?.address?.neighborhood
                ?.toLowerCase()
                .includes(searchLower) ||
              delivery.order_id.includes(search),
          );
        }

        setDeliveries(data);
      } catch (error) {
        console.error("Error loading deliveries:", error);
      } finally {
        setIsLoading(false);
      }
    }

    const debounce = setTimeout(() => {
      setIsLoading(true);
      loadDeliveries();
    }, 300);

    return () => clearTimeout(debounce);
  }, [search, statusFilter]);

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
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold" style={{ color: "var(--text)" }}>
          Entregas
        </h1>
      </div>

      <div className="flex gap-4 text-sm">
        <span className="font-serif" style={{ color: "var(--text-aux)" }}>
          {pendingCount} pendentes • {scheduledCount} agendadas
        </span>
      </div>

      <div className="space-y-3">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"
            style={{ color: "var(--text-aux)" }}
          />
          <Input
            placeholder="Buscar por cliente ou bairro..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            style={{
              backgroundColor: "var(--background-aux)",
              borderColor: "var(--highlight-blur)",
              color: "var(--text)",
            }}
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger
            style={{
              backgroundColor: "var(--background-aux)",
              borderColor: "var(--highlight-blur)",
              color: "var(--text)",
            }}
          >
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="pending">Pendente</SelectItem>
            <SelectItem value="scheduled">Agendada</SelectItem>
            <SelectItem value="in_transit">Em transito</SelectItem>
            <SelectItem value="delivered">Entregue</SelectItem>
            <SelectItem value="failed">Falhou</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2
            className="h-8 w-8 animate-spin"
            style={{ color: "var(--button)" }}
          />
        </div>
      )}

      {!isLoading && (
        <div className="space-y-3">
          {deliveries.map((delivery) => (
            <Link key={delivery.id} href={`/admin/deliveries/${delivery.id}`}>
              <Card
                className="transition-opacity hover:opacity-80 border-0 "
                style={{ backgroundColor: "var(--background)" }}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div
                        className="flex items-center justify-center h-10 w-10 rounded-full shrink-0"
                        style={{ backgroundColor: "var(--highlight-blur)" }}
                      >
                        <Truck
                          className="h-5 w-5"
                          style={{ color: "var(--text)" }}
                        />
                      </div>
                      <div className="min-w-0">
                        <p
                          className="text-sm font-semibold truncate"
                          style={{ color: "var(--text)" }}
                        >
                          {delivery.order?.customer_name || "Cliente"}
                        </p>
                        <p
                          className="text-xs font-serif mt-0.5"
                          style={{ color: "var(--text-aux)" }}
                        >
                          Pedido #{delivery.order_id.slice(0, 8)}
                        </p>

                        {delivery.order?.address && (
                          <div
                            className="flex items-center gap-1 mt-1 text-xs"
                            style={{ color: "var(--text-aux)" }}
                          >
                            <MapPin className="h-3 w-3" />
                            {delivery.order.address.neighborhood}
                          </div>
                        )}

                        <div className="flex items-center gap-2 mt-2">
                          <StatusBadge
                            variant={getDeliveryStatusVariant(delivery.status)}
                          >
                            {deliveryStatusLabels[delivery.status] ||
                              delivery.status}
                          </StatusBadge>
                          {delivery.scheduled_date && (
                            <span
                              className="flex items-center gap-1 text-xs"
                              style={{ color: "var(--text-aux)" }}
                            >
                              <Calendar className="h-3 w-3" />
                              {formatDate(delivery.scheduled_date)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <ChevronRight
                      className="h-4 w-4 shrink-0"
                      style={{ color: "var(--text-aux)" }}
                    />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}

          {deliveries.length === 0 && (
            <div className="text-center py-12">
              <Truck
                className="h-12 w-12 mx-auto mb-3"
                style={{ color: "var(--text-aux)" }}
              />
              <p className="font-serif" style={{ color: "var(--text-aux)" }}>
                Nenhuma entrega encontrada
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
