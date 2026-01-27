"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataCard } from "@/components/admin/data-card";
import {
  StatusBadge,
  getOrderStatusVariant,
} from "@/components/admin/status-badge";
import {
  DollarSign,
  ShoppingBag,
  Truck,
  ShirtIcon,
  Bell,
  ChevronRight,
  Layers,
  Loader2,
} from "lucide-react";
import {
  dashboardApi,
  ordersApi,
  collectionsApi,
  notificationsApi,
  type Order,
  type Collection,
  type Notification,
  type DashboardStats,
} from "@/lib/api";

const orderStatusLabels: Record<string, string> = {
  pending: "Pendente",
  paid: "Pago",
  shipped: "Enviado",
  delivered: "Entregue",
  cancelled: "Cancelado",
};

export function DashboardContent() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [activeCollections, setActiveCollections] = useState<Collection[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [statsRes, ordersRes, collectionsRes, notificationsRes] =
          await Promise.all([
            dashboardApi.getStats().catch(() => null),
            ordersApi.list({ limit: 3 }).catch(() => ({ data: [] })),
            collectionsApi.list({ limit: 5 }).catch(() => ({ data: [] })),
            notificationsApi
              .list({ unread: true, limit: 3 })
              .catch(() => ({ data: [], unreadCount: 0 })),
          ]);

        if (statsRes) setStats(statsRes);
        setRecentOrders(ordersRes.data || []);
        setActiveCollections(
          (collectionsRes.data || []).filter((c) => c.is_active),
        );
        setNotifications(notificationsRes.data || []);
        setUnreadCount(notificationsRes.unreadCount || 0);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", {
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

  return (
    <div className="p-4 space-y-6">
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <DataCard
          title="Total vendido"
          value={formatCurrency(stats?.total_sales || 0)}
          icon={<DollarSign className="h-5 w-5" />}
        />
        <DataCard
          title="Pedidos"
          value={stats?.total_orders || 0}
          icon={<ShoppingBag className="h-5 w-5" />}
        />
        <DataCard
          title="Entregas pendentes"
          value={stats?.pending_deliveries || 0}
          icon={<Truck className="h-5 w-5" />}
        />
        <DataCard
          title="Peças disponiveis"
          value={stats?.total_products || 0}
          icon={<ShirtIcon className="h-5 w-5" />}
        />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section>
          <Card
            className="border"
            style={{ backgroundColor: "var(--background)" }}
          >
            <CardHeader className="">
              <div className="flex items-center justify-between">
                <CardTitle
                  className="text-base font-semibold"
                  style={{ color: "var(--text)" }}
                >
                  Ultimas vendas
                </CardTitle>
                <Link
                  href="/admin/orders"
                  className="text-sm font-medium flex items-center gap-1"
                  style={{ color: "var(--button)" }}
                >
                  Ver todas
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div
                className="divide-y"
                style={{ borderColor: "var(--highlight-blur)" }}
              >
                {recentOrders.length === 0 ? (
                  <p
                    className="p-4 text-sm text-center"
                    style={{ color: "var(--text-aux)" }}
                  >
                    Nenhuma venda recente
                  </p>
                ) : (
                  recentOrders.map((order) => (
                    <Link
                      key={order.id}
                      href={`/admin/orders/${order.id}`}
                      className="flex items-center justify-between p-4 transition-colors hover:opacity-80"
                    >
                      <div className="space-y-1">
                        <p
                          className="text-sm font-medium"
                          style={{ color: "var(--text)" }}
                        >
                          {order.customer_name}
                        </p>
                        <p
                          className="text-xs font-serif"
                          style={{ color: "var(--text-aux)" }}
                        >
                          {order.items?.length || 0}{" "}
                          {(order.items?.length || 0) === 1 ? "item" : "itens"}{" "}
                          • {formatDate(order.created_at)}
                        </p>
                      </div>
                      <div className="text-right space-y-1">
                        <p
                          className="text-sm font-semibold"
                          style={{ color: "var(--text)" }}
                        >
                          {formatCurrency(order.total)}
                        </p>
                        <StatusBadge
                          variant={getOrderStatusVariant(order.status)}
                        >
                          {orderStatusLabels[order.status] || order.status}
                        </StatusBadge>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </section>

        <section>
          <Card
            className="border"
            style={{ backgroundColor: "var(--background)" }}
          >
            <CardHeader className="">
              <div className="flex items-center justify-between">
                <CardTitle
                  className="text-base font-semibold"
                  style={{ color: "var(--text)" }}
                >
                  Drops ativos
                </CardTitle>
                <Link
                  href="/admin/drops"
                  className="text-sm font-medium flex items-center gap-1"
                  style={{ color: "var(--button)" }}
                >
                  Ver todos
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div
                className="divide-y"
                style={{ borderColor: "var(--highlight-blur)" }}
              >
                {activeCollections.length === 0 ? (
                  <p
                    className="p-4 text-sm text-center"
                    style={{ color: "var(--text-aux)" }}
                  >
                    Nenhum drop ativo
                  </p>
                ) : (
                  activeCollections.map((collection) => (
                    <Link
                      key={collection.id}
                      href={`/admin/drops/${collection.id}`}
                      className="flex items-center gap-3 p-4 transition-colors hover:opacity-80"
                    >
                      <div
                        className="flex items-center justify-center h-10 w-10 rounded-lg"
                        style={{ backgroundColor: "var(--highlight-blur)" }}
                      >
                        <Layers
                          className="h-5 w-5"
                          style={{ color: "var(--text)" }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-sm font-medium truncate"
                          style={{ color: "var(--text)" }}
                        >
                          {collection.title}
                        </p>
                        <p
                          className="text-xs font-serif"
                          style={{ color: "var(--text-aux)" }}
                        >
                          {collection.products_count || 0} peças
                        </p>
                      </div>
                      <ChevronRight
                        className="h-4 w-4"
                        style={{ color: "var(--text-aux)" }}
                      />
                    </Link>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </section>

        <section>
          <Card
            className=""
            style={{ backgroundColor: "var(--background)" }}
          >
            <CardHeader className="">
              <div className="flex items-center justify-between">
                <CardTitle
                  className="text-base font-semibold flex items-center gap-2"
                  style={{ color: "var(--text)" }}
                >
                  Notificacoes
                  {unreadCount > 0 && (
                    <span
                      className="flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold"
                      style={{
                        backgroundColor: "var(--button)",
                        color: "var(--background)",
                      }}
                    >
                      {unreadCount}
                    </span>
                  )}
                </CardTitle>
                <Link
                  href="/admin/notifications"
                  className="text-sm font-medium flex items-center gap-1"
                  style={{ color: "var(--button)" }}
                >
                  Ver todas
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div
                className="divide-y"
                style={{ borderColor: "var(--highlight-blur)" }}
              >
                {notifications.length === 0 ? (
                  <p
                    className="p-4 text-sm text-center font-serif"
                    style={{ color: "var(--text-aux)" }}
                  >
                    Nenhuma notificacao nova
                  </p>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="flex items-start gap-3 p-4"
                    >
                      <div
                        className="flex items-center justify-center h-8 w-8 rounded-full shrink-0"
                        style={{ backgroundColor: "var(--highlight-blur)" }}
                      >
                        <Bell
                          className="h-4 w-4"
                          style={{ color: "var(--button)" }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-sm font-medium"
                          style={{ color: "var(--text)" }}
                        >
                          {notification.title}
                        </p>
                        <p
                          className="text-xs font-serif mt-0.5"
                          style={{ color: "var(--text-aux)" }}
                        >
                          {notification.message}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </section>

        <section>
          <Card
            className="border"
            style={{ backgroundColor: "var(--background)" }}
          >
            <CardHeader className="">
              <div className="flex items-center justify-between">
                <CardTitle
                  className="text-base font-semibold flex items-center gap-2"
                  style={{ color: "var(--text)" }}
                >
                  Notificacoes
                  {unreadCount > 0 && (
                    <span
                      className="flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold"
                      style={{
                        backgroundColor: "var(--button)",
                        color: "var(--background)",
                      }}
                    >
                      {unreadCount}
                    </span>
                  )}
                </CardTitle>
                <Link
                  href="/admin/notifications"
                  className="text-sm font-medium flex items-center gap-1"
                  style={{ color: "var(--button)" }}
                >
                  Ver todas
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div
                className="divide-y"
                style={{ borderColor: "var(--highlight-blur)" }}
              >
                {notifications.length === 0 ? (
                  <p
                    className="p-4 text-sm text-center font-serif"
                    style={{ color: "var(--text-aux)" }}
                  >
                    Nenhuma notificacao nova
                  </p>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="flex items-start gap-3 p-4"
                    >
                      <div
                        className="flex items-center justify-center h-8 w-8 rounded-full shrink-0"
                        style={{ backgroundColor: "var(--highlight-blur)" }}
                      >
                        <Bell
                          className="h-4 w-4"
                          style={{ color: "var(--button)" }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-sm font-medium"
                          style={{ color: "var(--text)" }}
                        >
                          {notification.title}
                        </p>
                        <p
                          className="text-xs font-serif mt-0.5"
                          style={{ color: "var(--text-aux)" }}
                        >
                          {notification.message}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
