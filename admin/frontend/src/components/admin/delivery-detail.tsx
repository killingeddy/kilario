"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
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
} from "lucide-react";
import { deliveries, deliveryStatusLabels } from "@/lib/mock-data";

interface DeliveryDetailProps {
  id: string;
}

export function DeliveryDetail({ id }: DeliveryDetailProps) {
  const [isMarking, setIsMarking] = useState(false);
  const delivery = deliveries.find((d) => d.id === id);

  if (!delivery) {
    return (
      <div className="p-4">
        <div className="flex items-center gap-3 mb-6">
          <Button asChild variant="ghost" size="icon">
            <Link href="/admin/deliveries">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-xl font-bold text-foreground">
            Entrega não encontrada
          </h1>
        </div>
        <p className="text-muted-foreground font-serif">
          A entrega que você está procurando não existe ou foi removida.
        </p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatAddress = (address: typeof delivery.address) => {
    return `${address.street}, ${address.number}${address.complement ? ` - ${address.complement}` : ""}`;
  };

  const getGoogleMapsUrl = () => {
    const address = `${delivery.address.street}, ${delivery.address.number}, ${delivery.address.neighborhood}, ${delivery.address.city}, ${delivery.address.state}`;
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  };

  const getWhatsAppUrl = () => {
    const phone = delivery.customerPhone.replace(/\D/g, "");
    return `https://wa.me/55${phone}`;
  };

  const handleMarkAsDelivered = async () => {
    setIsMarking(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // In a real app, this would update the delivery status
    console.log("Marking delivery as delivered:", delivery.id);
    setIsMarking(false);
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="icon">
          <Link href="/admin/deliveries">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-xl font-bold text-foreground">
            Entrega #{delivery.id}
          </h1>
          <p className="text-xs text-muted-foreground font-serif">
            Pedido #{delivery.orderId}
          </p>
        </div>
      </div>

      {/* Status Card */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground font-serif">Status</p>
              <div className="mt-1">
                <StatusBadge
                  variant={getDeliveryStatusVariant(delivery.status)}
                >
                  {deliveryStatusLabels[delivery.status]}
                </StatusBadge>
              </div>
            </div>
            {delivery.scheduledDate && (
              <div className="text-right">
                <p className="text-sm text-muted-foreground font-serif">
                  Agendada para
                </p>
                <p className="text-sm font-medium text-foreground flex items-center gap-1 mt-1">
                  <Calendar className="h-4 w-4" />
                  {formatDate(delivery.scheduledDate)}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Customer Info */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Cliente</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0 space-y-3">
          <p className="text-sm font-semibold text-foreground">
            {delivery.customerName}
          </p>

          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors"
          >
            <span className="flex items-center gap-2 text-sm text-foreground">
              <Phone className="h-4 w-4" />
              {delivery.customerPhone}
            </span>
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
          </a>
        </CardContent>
      </Card>

      {/* Address */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Endereço
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0 space-y-3">
          <div className="text-sm">
            <p className="text-foreground font-medium">
              {formatAddress(delivery.address)}
            </p>
            <p className="text-muted-foreground font-serif">
              {delivery.address.neighborhood} - {delivery.address.city}/
              {delivery.address.state}
            </p>
            <p className="text-muted-foreground font-serif">
              CEP: {delivery.address.zipCode}
            </p>
          </div>

          <a
            href={getGoogleMapsUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 p-3 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors text-sm text-foreground"
          >
            <MapPin className="h-4 w-4" />
            Abrir no Google Maps
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
          </a>
        </CardContent>
      </Card>

      {/* Notes */}
      {delivery.notes && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Observações
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-sm text-foreground font-serif bg-accent/10 p-3 rounded-lg">
              {delivery.notes}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      {delivery.status !== "delivered" && (
        <div className="sticky bottom-20 bg-background pt-4 pb-2 space-y-3">
          <Button
            onClick={handleMarkAsDelivered}
            className="w-full h-12 text-base"
            disabled={isMarking}
          >
            <CheckCircle className="h-5 w-5 mr-2" />
            {isMarking ? "Marcando..." : "Marcar como entregue"}
          </Button>

          <Button asChild variant="outline" className="w-full bg-transparent">
            <Link href={`/admin/orders/${delivery.orderId}`}>
              Ver pedido completo
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
