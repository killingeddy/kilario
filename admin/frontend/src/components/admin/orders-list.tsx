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
  getOrderStatusVariant,
} from "@/components/admin/status-badge";
import { Search, ShoppingBag, ChevronRight, Loader2 } from "lucide-react";
import { ordersApi, type Order } from "@/lib/api";

const orderStatusLabels: Record<string, string> = {
  pending: "Pendente",
  paid: "Pago",
  shipped: "Enviado",
  delivered: "Entregue",
  cancelled: "Cancelado",
};

const paymentMethodLabels: Record<string, string> = {
  pix: "PIX",
  credit_card: "Cartao de Credito",
  debit_card: "Cartao de Debito",
  boleto: "Boleto",
  cash: "Dinheiro",
};

export function OrdersList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [total, setTotal] = useState(0);

  useEffect(() => {
    async function loadOrders() {
      try {
        const res = await ordersApi.list({
          status: statusFilter !== "all" ? statusFilter : undefined,
        });
        let data = res.data || [];

        // Client-side search filtering
        if (search) {
          const searchLower = search.toLowerCase();
          data = data.filter(
            (order) =>
              order.customer_name.toLowerCase().includes(searchLower) ||
              order.id.includes(search),
          );
        }

        setOrders(data);
        setTotal(res.total || data.length);
      } catch (error) {
        console.error("Error loading orders:", error);
      } finally {
        setIsLoading(false);
      }
    }

    const debounce = setTimeout(() => {
      setIsLoading(true);
      loadOrders();
    }, 300);

    return () => clearTimeout(debounce);
  }, [search, statusFilter]);

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
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const totalRevenue = orders
    .filter((o) => o.status === "paid" || o.status === "delivered")
    .reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold" style={{ color: "var(--text)" }}>
          Vendas
        </h1>
      </div>

      {/* Stats */}
      <div className="flex gap-4 text-sm">
        <span className="font-serif" style={{ color: "var(--text-aux)" }}>
          {total} pedidos • {formatCurrency(totalRevenue)} em vendas
        </span>
      </div>

      {/* Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"
            style={{ color: "var(--text-aux)" }}
          />
          <Input
            placeholder="Buscar por cliente ou pedido..."
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
            <SelectItem value="paid">Pago</SelectItem>
            <SelectItem value="shipped">Enviado</SelectItem>
            <SelectItem value="delivered">Entregue</SelectItem>
            <SelectItem value="cancelled">Cancelado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2
            className="h-8 w-8 animate-spin"
            style={{ color: "var(--button)" }}
          />
        </div>
      )}

      {/* Orders List */}
      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {orders.map((order) => (
            <Link key={order.id} href={`/admin/orders/${order.id}`}>
              <Card
                className="transition-opacity hover:opacity-80 border pt-0"
                style={{ backgroundColor: "var(--background)" }}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div
                        className="flex items-center justify-center h-10 w-10 rounded-full shrink-0"
                        style={{ backgroundColor: "var(--highlight-blur)" }}
                      >
                        <ShoppingBag
                          className="h-5 w-5"
                          style={{ color: "var(--text)" }}
                        />
                      </div>
                      <div className="min-w-0">
                        <p
                          className="text-sm font-semibold truncate"
                          style={{ color: "var(--text)" }}
                        >
                          {order.customer_name}
                        </p>
                        <p
                          className="text-xs font-serif mt-0.5"
                          style={{ color: "var(--text-aux)" }}
                        >
                          Pedido #{order.id.slice(0, 8)} •{" "}
                          {formatDate(order.created_at)}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <StatusBadge
                            variant={getOrderStatusVariant(order.status)}
                          >
                            {orderStatusLabels[order.status] || order.status}
                          </StatusBadge>
                          {order.payment_method && (
                            <span
                              className="text-xs font-serif"
                              style={{ color: "var(--text-aux)" }}
                            >
                              {paymentMethodLabels[order.payment_method] ||
                                order.payment_method}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <p
                          className="text-sm font-bold"
                          style={{ color: "var(--text)" }}
                        >
                          {formatCurrency(order.total)}
                        </p>
                        <p
                          className="text-xs font-serif"
                          style={{ color: "var(--text-aux)" }}
                        >
                          {order.item_count || 0}{" "}
                          {(order.item_count === 1 ? "item" : "itens")}
                        </p>
                      </div>
                      <ChevronRight
                        className="h-4 w-4"
                        style={{ color: "var(--text-aux)" }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}

          {orders.length === 0 && (
            <div className="text-center py-12">
              <ShoppingBag
                className="h-12 w-12 mx-auto mb-3"
                style={{ color: "var(--text-aux)" }}
              />
              <p className="font-serif" style={{ color: "var(--text-aux)" }}>
                Nenhum pedido encontrado
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
