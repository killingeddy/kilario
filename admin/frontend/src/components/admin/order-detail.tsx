"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  StatusBadge,
  getOrderStatusVariant,
  getDeliveryStatusVariant,
} from "@/components/admin/status-badge";
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Truck,
  Package,
} from "lucide-react";
import {
  orders,
  getDeliveryByOrderId,
  orderStatusLabels,
  paymentMethodLabels,
  deliveryStatusLabels,
} from "@/lib/mock-data";

interface OrderDetailProps {
  id: string;
}

export function OrderDetail({ id }: OrderDetailProps) {
  const order = orders.find((o) => o.id === id);
  const delivery = order ? getDeliveryByOrderId(order.id) : undefined;

  if (!order) {
    return (
      <div className="p-4">
        <div className="flex items-center gap-3 mb-6">
          <Button asChild variant="ghost" size="icon">
            <Link href="/admin/orders">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-xl font-bold text-foreground">
            Pedido não encontrado
          </h1>
        </div>
        <p className="text-muted-foreground font-serif">
          O pedido que você está procurando não existe ou foi removido.
        </p>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatAddress = (address: typeof order.deliveryAddress) => {
    return `${address.street}, ${address.number}${address.complement ? ` - ${address.complement}` : ""}`;
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="icon">
          <Link href="/admin/orders">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-xl font-bold text-foreground">
            Pedido #{order.id}
          </h1>
          <p className="text-xs text-muted-foreground font-serif">
            {formatDate(order.createdAt)}
          </p>
        </div>
      </div>

      {/* Status */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground font-serif">
                Status do pedido
              </p>
              <div className="mt-1">
                <StatusBadge variant={getOrderStatusVariant(order.status)}>
                  {orderStatusLabels[order.status]}
                </StatusBadge>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground font-serif">Total</p>
              <p className="text-xl font-bold text-foreground">
                {formatCurrency(order.total)}
              </p>
            </div>
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
            {order.customerName}
          </p>

          <div className="space-y-2">
            <a
              href={`tel:${order.customerPhone}`}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
            >
              <Phone className="h-4 w-4" />
              {order.customerPhone}
            </a>
            <a
              href={`mailto:${order.customerEmail}`}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
            >
              <Mail className="h-4 w-4" />
              {order.customerEmail}
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Items */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Package className="h-4 w-4" />
            Itens do pedido
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {order.items.map((item) => (
              <div key={item.productId} className="flex items-center gap-3 p-4">
                <div className="w-14 h-14 rounded-lg overflow-hidden bg-secondary shrink-0">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.productName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {item.productName}
                  </p>
                </div>
                <p className="text-sm font-semibold text-foreground">
                  {formatCurrency(item.price)}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Pagamento
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <dl className="space-y-2">
            <div className="flex justify-between">
              <dt className="text-sm text-muted-foreground font-serif">
                Método
              </dt>
              <dd className="text-sm font-medium text-foreground">
                {paymentMethodLabels[order.paymentMethod]}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-muted-foreground font-serif">
                Subtotal
              </dt>
              <dd className="text-sm text-foreground">
                {formatCurrency(order.total - order.deliveryFee)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-muted-foreground font-serif">
                Entrega
              </dt>
              <dd className="text-sm text-foreground">
                {formatCurrency(order.deliveryFee)}
              </dd>
            </div>
            <div className="flex justify-between pt-2 border-t border-border">
              <dt className="text-sm font-semibold text-foreground">Total</dt>
              <dd className="text-sm font-bold text-foreground">
                {formatCurrency(order.total)}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      {/* Delivery */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Truck className="h-4 w-4" />
            Entrega
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0 space-y-3">
          {delivery && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground font-serif">
                Status
              </span>
              <StatusBadge variant={getDeliveryStatusVariant(delivery.status)}>
                {deliveryStatusLabels[delivery.status]}
              </StatusBadge>
            </div>
          )}

          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="text-foreground">
                {formatAddress(order.deliveryAddress)}
              </p>
              <p className="text-muted-foreground font-serif">
                {order.deliveryAddress.neighborhood} -{" "}
                {order.deliveryAddress.city}/{order.deliveryAddress.state}
              </p>
              <p className="text-muted-foreground font-serif">
                CEP: {order.deliveryAddress.zipCode}
              </p>
            </div>
          </div>

          {delivery && (
            <Button asChild className="w-full mt-2">
              <Link href={`/admin/deliveries/${delivery.id}`}>
                Ver detalhes da entrega
              </Link>
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
