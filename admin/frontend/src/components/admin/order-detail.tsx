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
  getOrderStatusVariant,
} from "@/components/admin/status-badge";
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Truck,
  Package,
  Loader2,
} from "lucide-react";
import { ordersApi, type Order } from "@/lib/api";

const orderStatusLabels: Record<string, string> = {
  pending: "Pendente",
  paid: "Pago",
  shipped: "Enviado",
  reunded: "Reembolsado",
  cancelled: "Cancelado",
};

const paymentMethodLabels: Record<string, string> = {
  pix: "PIX",
  credit_card: "Cartao de Credito",
  debit_card: "Cartao de Debito",
  boleto: "Boleto",
  cash: "Dinheiro",
};

interface OrderDetailProps {
  id: string;
}

export function OrderDetail({ id }: OrderDetailProps) {
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    ordersApi
      .get(id)
      .then((res) => {
        setOrder(res.data);
      })
      .catch((error) => {
        console.error("Error loading order:", error);
      })
      .finally(() => setIsLoading(false));
  }, [id]);

  const handleStatusChange = async (newStatus: string) => {
    if (!order) return;

    setIsUpdating(true);
    try {
      const updated = await ordersApi.updateStatus(id, newStatus);
      setOrder(updated);
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Erro ao atualizar status");
    } finally {
      setIsUpdating(false);
    }
  };

  const formatCurrency = (value: number) => {
    if (isNaN(value)) return "-";
    if (value === 0) return "Grátis";

    return parseFloat(value.toString()).toLocaleString("pt-BR", {
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
  
  if (!order) {
    return (
      <div className="p-4">
        <div className="flex items-center gap-3 mb-6">
          <Button asChild variant="ghost" size="icon">
            <Link href="/admin/orders">
              <ArrowLeft className="h-5 w-5" style={{ color: "var(--text)" }} />
            </Link>
          </Button>
          <h1 className="text-xl font-bold" style={{ color: "var(--text)" }}>
            Pedido nao encontrado
          </h1>
        </div>
        <p className="font-serif" style={{ color: "var(--text-aux)" }}>
          O pedido que voce esta procurando nao existe ou foi removido.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="icon">
          <Link href="/admin/orders">
            <ArrowLeft className="h-5 w-5" style={{ color: "var(--text)" }} />
          </Link>
        </Button>
        <div>
          <h1 className="text-xl font-bold" style={{ color: "var(--text)" }}>
            Pedido #{order?.id?.slice(0, 8)}
          </h1>
          <p
            className="text-xs font-serif"
            style={{ color: "var(--text-aux)" }}
          >
            {formatDate(order.created_at)}
          </p>
        </div>
      </div>

      {/* Status */}
      <Card
        className="border-0 "
        style={{ backgroundColor: "var(--background)" }}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p
                className="text-sm font-serif"
                style={{ color: "var(--text-aux)" }}
              >
                Status do pedido
              </p>
              <Select
                value={order.status}
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
                  <SelectItem value="paid">Pago</SelectItem>
                  <SelectItem value="shipped">Enviado</SelectItem>
                  <SelectItem value="reunded">Reembolsado</SelectItem>
                  <SelectItem value="cancelled">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="text-right">
              <p
                className="text-sm font-serif"
                style={{ color: "var(--text-aux)" }}
              >
                Total
              </p>
              <p className="text-xl font-bold" style={{ color: "var(--text)" }}>
                {formatCurrency(order.total)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customer Info */}
      <Card
        className="border-0 "
        style={{ backgroundColor: "var(--background)" }}
      >
        <CardHeader className="pb-2">
          <CardTitle className="text-base" style={{ color: "var(--text)" }}>
            Cliente
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0 space-y-3">
          <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
            {order.customer_name}
          </p>

          <div className="space-y-2">
            {order.customer_phone && (
              <a
                href={`tel:${order.customer_phone}`}
                className="flex items-center gap-2 text-sm transition-opacity hover:opacity-70"
                style={{ color: "var(--text-aux)" }}
              >
                <Phone className="h-4 w-4" />
                {order.customer_phone}
              </a>
            )}
            {order.customer_email && (
              <a
                href={`mailto:${order.customer_email}`}
                className="flex items-center gap-2 text-sm transition-opacity hover:opacity-70"
                style={{ color: "var(--text-aux)" }}
              >
                <Mail className="h-4 w-4" />
                {order.customer_email}
              </a>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Items */}
      <Card
        className="border-0 "
        style={{ backgroundColor: "var(--background)" }}
      >
        <CardHeader className="pb-2">
          <CardTitle
            className="text-base flex items-center gap-2"
            style={{ color: "var(--text)" }}
          >
            <Package className="h-4 w-4" />
            Itens do pedido
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div
            className="divide-y"
            style={{ borderColor: "var(--highlight-blur)" }}
          >
            {(order.items || []).map((item, index) => (
              <div
                key={item.id || index}
                className="flex items-center gap-3 p-4"
              >
                <div
                  className="w-14 h-14 rounded-lg overflow-hidden shrink-0"
                  style={{ backgroundColor: "var(--background-aux)" }}
                >
                  <img
                    src={item.product?.images?.[0] || "/placeholder.svg"}
                    alt={item.product?.title || "Produto"}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm font-medium truncate"
                    style={{ color: "var(--text)" }}
                  >
                    {item.product?.title || "Produto"}
                  </p>
                  {item.quantity > 1 && (
                    <p
                      className="text-xs font-serif"
                      style={{ color: "var(--text-aux)" }}
                    >
                      Qtd: {item.quantity}
                    </p>
                  )}
                </div>
                <p
                  className="text-sm font-semibold"
                  style={{ color: "var(--text)" }}
                >
                  {formatCurrency(item.price)}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment */}
      <Card
        className="border-0 "
        style={{ backgroundColor: "var(--background)" }}
      >
        <CardHeader className="pb-2">
          <CardTitle
            className="text-base flex items-center gap-2"
            style={{ color: "var(--text)" }}
          >
            <CreditCard className="h-4 w-4" />
            Pagamento
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <dl className="space-y-2">
            {order.payment_method && (
              <div className="flex justify-between">
                <dt
                  className="text-sm font-serif"
                  style={{ color: "var(--text-aux)" }}
                >
                  Metodo
                </dt>
                <dd
                  className="text-sm font-medium"
                  style={{ color: "var(--text)" }}
                >
                  {paymentMethodLabels[order.payment_method] ||
                    order.payment_method}
                </dd>
              </div>
            )}
            <div
              className="flex justify-between pt-2 border-t"
              style={{ borderColor: "var(--highlight-blur)" }}
            >
              <dt
                className="text-sm font-semibold"
                style={{ color: "var(--text)" }}
              >
                Total
              </dt>
              <dd
                className="text-sm font-bold"
                style={{ color: "var(--text)" }}
              >
                {formatCurrency(order.total)}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      {/* Delivery Address */}
      {order.address && (
        <Card
          className="border-0 "
          style={{ backgroundColor: "var(--background)" }}
        >
          <CardHeader className="pb-2">
            <CardTitle
              className="text-base flex items-center gap-2"
              style={{ color: "var(--text)" }}
            >
              <Truck className="h-4 w-4" />
              Entrega
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-3">
            <div className="flex items-start gap-2">
              <MapPin
                className="h-4 w-4 shrink-0 mt-0.5"
                style={{ color: "var(--text-aux)" }}
              />
              <div className="text-sm">
                <p style={{ color: "var(--text)" }}>
                  {order.address.street}, {order.address.number}
                  {order.address.complement && ` - ${order.address.complement}`}
                </p>
                <p className="font-serif" style={{ color: "var(--text-aux)" }}>
                  {order.address.neighborhood} - {order.address.city}/
                  {order.address.state}
                </p>
                <p className="font-serif" style={{ color: "var(--text-aux)" }}>
                  CEP: {order.address.zip_code}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
