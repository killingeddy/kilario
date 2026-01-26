"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  ArrowLeft,
  Phone,
  MapPin,
  Calendar,
  FileText,
  CheckCircle,
  ExternalLink,
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

interface DeliveryDetailProps {
  id: string;
}

export function DeliveryDetail({ id }: DeliveryDetailProps) {
  const [delivery, setDelivery] = useState<Delivery | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    deliveriesApi
      .get(id)
      .then(setDelivery)
      .catch(() => setDelivery(null))
      .finally(() => setIsLoading(false));
  }, [id]);

  const handleStatusChange = async (newStatus: string) => {
    if (!delivery) return;

    setIsUpdating(true);
    try {
      const updated = await deliveriesApi.updateStatus(id, newStatus);
      setDelivery(updated);
    } catch (error) {
      console.error("Error updating delivery status:", error);
      alert("Erro ao atualizar status");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleMarkAsDelivered = () => handleStatusChange("delivered");

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getGoogleMapsUrl = () => {
    if (!delivery?.order?.address) return "#";
    const addr = delivery.order.address;
    const address = `${addr.street}, ${addr.number}, ${addr.neighborhood}, ${addr.city}, ${addr.state}`;
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  };

  const getWhatsAppUrl = () => {
    if (!delivery?.order?.customer_phone) return "#";
    const phone = delivery.order.customer_phone.replace(/\D/g, "");
    return `https://wa.me/55${phone}`;
  };

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

  if (!delivery) {
    return (
      <div className="p-4">
        <div className="flex items-center gap-3 mb-6">
          <Button asChild variant="ghost" size="icon">
            <Link href="/admin/deliveries">
              <ArrowLeft className="h-5 w-5" style={{ color: "var(--text)" }} />
            </Link>
          </Button>
          <h1 className="text-xl font-bold" style={{ color: "var(--text)" }}>
            Entrega nao encontrada
          </h1>
        </div>
        <p className="font-serif" style={{ color: "var(--text-aux)" }}>
          A entrega que voce esta procurando nao existe ou foi removida.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="icon">
          <Link href="/admin/deliveries">
            <ArrowLeft className="h-5 w-5" style={{ color: "var(--text)" }} />
          </Link>
        </Button>
        <div>
          <h1 className="text-xl font-bold" style={{ color: "var(--text)" }}>
            Entrega #{delivery.id.slice(0, 8)}
          </h1>
          <p className="text-xs font-serif" style={{ color: "var(--text-aux)" }}>
            Pedido #{delivery.order_id.slice(0, 8)}
          </p>
        </div>
      </div>

      {/* Status Card */}
      <Card className="border-0 shadow-sm" style={{ backgroundColor: "var(--background)" }}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-serif" style={{ color: "var(--text-aux)" }}>
                Status
              </p>
              <Select
                value={delivery.status}
                onValueChange={handleStatusChange}
                disabled={isUpdating}
              >
                <SelectTrigger
                  className="w-40"
                  style={{
                    backgroundColor: "var(--background-aux)",
                    borderColor: "var(--highlight-blur)",
                    color: "var(--text)",
                  }}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="scheduled">Agendada</SelectItem>
                  <SelectItem value="in_transit">Em transito</SelectItem>
                  <SelectItem value="delivered">Entregue</SelectItem>
                  <SelectItem value="failed">Falhou</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {delivery.scheduled_date && (
              <div className="text-right">
                <p className="text-sm font-serif" style={{ color: "var(--text-aux)" }}>
                  Agendada para
                </p>
                <p
                  className="text-sm font-medium flex items-center gap-1 mt-1"
                  style={{ color: "var(--text)" }}
                >
                  <Calendar className="h-4 w-4" />
                  {formatDate(delivery.scheduled_date)}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Customer Info */}
      {delivery.order && (
        <Card className="border-0 shadow-sm" style={{ backgroundColor: "var(--background)" }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base" style={{ color: "var(--text)" }}>
              Cliente
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-3">
            <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
              {delivery.order.customer_name}
            </p>

            {delivery.order.customer_phone && (
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-lg transition-opacity hover:opacity-80"
                style={{ backgroundColor: "var(--background-aux)" }}
              >
                <span
                  className="flex items-center gap-2 text-sm"
                  style={{ color: "var(--text)" }}
                >
                  <Phone className="h-4 w-4" />
                  {delivery.order.customer_phone}
                </span>
                <ExternalLink className="h-4 w-4" style={{ color: "var(--text-aux)" }} />
              </a>
            )}
          </CardContent>
        </Card>
      )}

      {/* Address */}
      {delivery.order?.address && (
        <Card className="border-0 shadow-sm" style={{ backgroundColor: "var(--background)" }}>
          <CardHeader className="pb-2">
            <CardTitle
              className="text-base flex items-center gap-2"
              style={{ color: "var(--text)" }}
            >
              <MapPin className="h-4 w-4" />
              Endereco
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-3">
            <div className="text-sm">
              <p className="font-medium" style={{ color: "var(--text)" }}>
                {delivery.order.address.street}, {delivery.order.address.number}
                {delivery.order.address.complement &&
                  ` - ${delivery.order.address.complement}`}
              </p>
              <p className="font-serif" style={{ color: "var(--text-aux)" }}>
                {delivery.order.address.neighborhood} -{" "}
                {delivery.order.address.city}/{delivery.order.address.state}
              </p>
              <p className="font-serif" style={{ color: "var(--text-aux)" }}>
                CEP: {delivery.order.address.zip_code}
              </p>
            </div>

            <a
              href={getGoogleMapsUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 p-3 rounded-lg transition-opacity hover:opacity-80 text-sm"
              style={{
                backgroundColor: "var(--background-aux)",
                color: "var(--text)",
              }}
            >
              <MapPin className="h-4 w-4" />
              Abrir no Google Maps
              <ExternalLink className="h-4 w-4" style={{ color: "var(--text-aux)" }} />
            </a>
          </CardContent>
        </Card>
      )}

      {/* Notes */}
      {delivery.notes && (
        <Card className="border-0 shadow-sm" style={{ backgroundColor: "var(--background)" }}>
          <CardHeader className="pb-2">
            <CardTitle
              className="text-base flex items-center gap-2"
              style={{ color: "var(--text)" }}
            >
              <FileText className="h-4 w-4" />
              Observacoes
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p
              className="text-sm font-serif p-3 rounded-lg"
              style={{
                backgroundColor: "var(--highlight-blur)",
                color: "var(--text)",
              }}
            >
              {delivery.notes}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      {delivery.status !== "delivered" && (
        <div
          className="sticky bottom-20 pt-4 pb-2 space-y-3"
          style={{ backgroundColor: "var(--background)" }}
        >
          <Button
            onClick={handleMarkAsDelivered}
            className="w-full h-12 text-base"
            disabled={isUpdating}
            style={{
              backgroundColor: "var(--button)",
              color: "var(--background)",
            }}
          >
            {isUpdating ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Atualizando...
              </>
            ) : (
              <>
                <CheckCircle className="h-5 w-5 mr-2" />
                Marcar como entregue
              </>
            )}
          </Button>

          <Button
            asChild
            variant="outline"
            className="w-full bg-transparent"
            style={{ borderColor: "var(--highlight-blur)" }}
          >
            <Link href={`/admin/orders/${delivery.order_id}`}>Ver pedido completo</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
