"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Bell,
  ShoppingBag,
  Truck,
  Package,
  CheckCheck,
  Circle,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { notificationsApi, type Notification } from "@/lib/api";
import { cn } from "@/lib/utils";

export function NotificationsList() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    notificationsApi
      .list()
      .then((res) => {
        setNotifications(res.data || []);
        setUnreadCount(res.unreadCount || 0);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "order":
        return ShoppingBag;
      case "delivery":
        return Truck;
      case "product":
        return Package;
      case "system":
        return AlertCircle;
      default:
        return Bell;
    }
  };

  const getIconColors = (type: Notification["type"]) => {
    switch (type) {
      case "order":
        return { bg: "rgba(34, 197, 94, 0.1)", color: "rgb(34, 197, 94)" };
      case "delivery":
        return { bg: "rgba(245, 158, 11, 0.1)", color: "rgb(245, 158, 11)" };
      case "product":
        return { bg: "rgba(59, 130, 246, 0.1)", color: "rgb(59, 130, 246)" };
      default:
        return { bg: "var(--highlight-blur)", color: "var(--button)" };
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60);
      return `${diffInMinutes} min atras`;
    }
    if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h atras`;
    }
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const markAsRead = async (id: string) => {
    try {
      await notificationsApi.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationsApi.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
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
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold" style={{ color: "var(--text)" }}>
            Notificacoes
          </h1>
          {unreadCount > 0 && (
            <p
              className="text-sm font-serif mt-0.5"
              style={{ color: "var(--text-aux)" }}
            >
              {unreadCount} {unreadCount === 1 ? "nao lida" : "nao lidas"}
            </p>
          )}
        </div>
        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={markAllAsRead}
            className="bg-transparent"
          >
            <CheckCheck className="h-4 w-4 mr-1" />
            Marcar todas
          </Button>
        )}
      </div>

      {/* Notifications List */}
      <div className="space-y-2">
        {notifications.map((notification) => {
          const Icon = getIcon(notification.type);
          const iconColors = getIconColors(notification.type);

          return (
            <Card
              key={notification.id}
              className={cn(
                "transition-opacity cursor-pointer border pt-0",
              )}
              onClick={() =>
                !notification.is_read && markAsRead(notification.id)
              }
            >
              <CardContent className="p-4 border-0">
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div
                    className="flex items-center justify-center h-10 w-10 rounded-full shrink-0"
                    style={{ backgroundColor: iconColors.bg }}
                  >
                    <Icon
                      className="h-5 w-5"
                      style={{ color: iconColors.color }}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p
                        className={cn(
                          "text-sm",
                          !notification.is_read && "font-semibold",
                        )}
                        style={{ color: "var(--text)" }}
                      >
                        {notification.title}
                      </p>
                      {!notification.is_read && (
                        <Circle
                          className="h-2 w-2 shrink-0 mt-1.5"
                          style={{
                            fill: "var(--button)",
                            color: "var(--button)",
                          }}
                        />
                      )}
                    </div>
                    <p
                      className="text-xs font-serif mt-0.5"
                      style={{ color: "var(--text-aux)" }}
                    >
                      {notification.message}
                    </p>
                    <p
                      className="text-xs mt-1"
                      style={{ color: "var(--text-aux)" }}
                    >
                      {formatDate(notification.created_at)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {notifications.length === 0 && (
          <div className="text-center py-12">
            <Bell
              className="h-12 w-12 mx-auto mb-3"
              style={{ color: "var(--text-aux)" }}
            />
            <p className="font-serif" style={{ color: "var(--text-aux)" }}>
              Nenhuma notificacao
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
