"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataCard } from "@/components/admin/data-card";
import {
  StatusBadge,
  getOrderStatusVariant,
  getDeliveryStatusVariant,
} from "@/components/admin/status-badge";
import {
  DollarSign,
  ShoppingBag,
  Truck,
  ShirtIcon,
  Bell,
  ChevronRight,
  Layers,
} from "lucide-react";
import {
  getStats,
  orders,
  notifications,
  drops,
  orderStatusLabels,
} from "@/lib/mock-data";

export function DashboardContent() {
  const stats = getStats();
  const recentOrders = orders.slice(0, 3);
  const recentNotifications = notifications
    .filter((n) => !n.isRead)
    .slice(0, 3);
  const activeDrops = drops.filter((d) => d.isActive);

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

  return (
    <div className="p-4 space-y-6">
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <DataCard
          title="Total vendido"
          value={formatCurrency(stats.totalSales)}
          icon={<DollarSign className="h-5 w-5" />}
          className="bg-highlight"
        />
        <DataCard
          title="Pedidos hoje"
          value={stats.todayOrdersCount}
          icon={<ShoppingBag className="h-5 w-5" />}
        />
        <DataCard
          title="Entregas pendentes"
          value={stats.pendingDeliveries}
          icon={<Truck className="h-5 w-5" />}
        />
        <DataCard
          title="Peças disponíveis"
          value={stats.availableProducts}
          icon={<ShirtIcon className="h-5 w-5" />}
        />
      </section>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <section>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">
                  Últimas vendas
                </CardTitle>
                <Link
                  href="/admin/orders"
                  className="text-sm text-primary font-medium flex items-center gap-1"
                >
                  Ver todas
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {recentOrders.map((order) => (
                  <Link
                    key={order.id}
                    href={`/admin/orders/${order.id}`}
                    className="flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-foreground">
                        {order.customerName}
                      </p>
                      <p className="text-xs text-muted-foreground font-serif">
                        {order.items.length}{" "}
                        {order.items.length === 1 ? "item" : "itens"} •{" "}
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="text-sm font-semibold text-foreground">
                        {formatCurrency(order.total)}
                      </p>
                      <StatusBadge
                        variant={getOrderStatusVariant(order.status)}
                      >
                        {orderStatusLabels[order.status]}
                      </StatusBadge>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        <section>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">
                  Drops ativos
                </CardTitle>
                <Link
                  href="/admin/drops"
                  className="text-sm text-primary font-medium flex items-center gap-1"
                >
                  Ver todos
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {activeDrops.map((drop) => (
                  <Link
                    key={drop.id}
                    href={`/admin/drops/${drop.id}`}
                    className="flex items-center gap-3 p-4 hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-accent/20">
                      <Layers className="h-5 w-5 text-accent-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {drop.name}
                      </p>
                      <p className="text-xs text-muted-foreground font-serif">
                        {drop.productCount} peças
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        <section>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  Notificações
                  {stats.unreadNotifications > 0 && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                      {stats.unreadNotifications}
                    </span>
                  )}
                </CardTitle>
                <Link
                  href="/admin/notifications"
                  className="text-sm text-primary font-medium flex items-center gap-1"
                >
                  Ver todas
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {recentNotifications.length === 0 ? (
                  <p className="p-4 text-sm text-muted-foreground text-center font-serif">
                    Nenhuma notificação nova
                  </p>
                ) : (
                  recentNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="flex items-start gap-3 p-4"
                    >
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 shrink-0">
                        <Bell className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">
                          {notification.title}
                        </p>
                        <p className="text-xs text-muted-foreground font-serif mt-0.5">
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
