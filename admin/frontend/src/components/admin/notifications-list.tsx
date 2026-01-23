"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Bell,
  ShoppingBag,
  Truck,
  Package,
  CheckCheck,
  Circle,
} from "lucide-react";
import { notifications, type Notification } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function NotificationsList() {
  const [notifs, setNotifs] = useState(notifications);

  const unreadCount = notifs.filter((n) => !n.isRead).length;

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "sale":
        return ShoppingBag;
      case "delivery":
        return Truck;
      case "stock":
        return Package;
      default:
        return Bell;
    }
  };

  const getIconColor = (type: Notification["type"]) => {
    switch (type) {
      case "sale":
        return "text-green-600 bg-green-100";
      case "delivery":
        return "text-amber-600 bg-amber-100";
      case "stock":
        return "text-blue-600 bg-blue-100";
      default:
        return "text-primary bg-primary/10";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60);
      return `${diffInMinutes} min atrás`;
    }
    if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h atrás`;
    }
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const markAsRead = (id: string) => {
    setNotifs((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );
  };

  const markAllAsRead = () => {
    setNotifs((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Notificações</h1>
          {unreadCount > 0 && (
            <p className="text-sm text-muted-foreground font-serif mt-0.5">
              {unreadCount} {unreadCount === 1 ? "não lida" : "não lidas"}
            </p>
          )}
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllAsRead}>
            <CheckCheck className="h-4 w-4 mr-1" />
            Marcar todas
          </Button>
        )}
      </div>

      {/* Notifications List */}
      <div className="space-y-2">
        {notifs.map((notification) => {
          const Icon = getIcon(notification.type);
          const iconColor = getIconColor(notification.type);

          return (
            <Card
              key={notification.id}
              className={cn(
                "transition-colors cursor-pointer",
                !notification.isRead && "bg-accent/5 border-accent/30",
              )}
              onClick={() => markAsRead(notification.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div
                    className={cn(
                      "flex items-center justify-center h-10 w-10 rounded-full shrink-0",
                      iconColor,
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p
                        className={cn(
                          "text-sm text-foreground",
                          !notification.isRead && "font-semibold",
                        )}
                      >
                        {notification.title}
                      </p>
                      {!notification.isRead && (
                        <Circle className="h-2 w-2 fill-primary text-primary shrink-0 mt-1.5" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground font-serif mt-0.5">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDate(notification.createdAt)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {notifs.length === 0 && (
          <div className="text-center py-12">
            <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground font-serif">
              Nenhuma notificação
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
