const { query } = require("../database/connection");
const orderService = require("./order.service");
const productService = require("./product.service");
const deliveryService = require("./delivery.service");
const notificationService = require("./notification.service");

const dashboardService = {
  async getDashboardData() {
    const [
      salesStats,
      productStatusCounts,
      pendingDeliveries,
      recentOrders,
      recentNotifications,
      todaySales,
      monthSales,
    ] = await Promise.all([
      orderService.getSalesStats(),
      productService.getStatusCounts(),
      deliveryService.getPendingCount(),
      orderService.getRecentOrders(5),
      notificationService.getRecent(5),
      this.getTodaySales(),
      this.getMonthSales(),
    ]);

    return {
      summary: {
        total_sales: parseInt(salesStats.total_sales, 10),
        total_orders: parseInt(salesStats.order_count, 10),
        available_products: productStatusCounts.available,
        pending_deliveries: pendingDeliveries,
        today_sales: parseInt(todaySales.total_sales, 10),
        today_orders: parseInt(todaySales.order_count, 10),
        month_sales: parseInt(monthSales.total_sales, 10),
        month_orders: parseInt(monthSales.order_count, 10),
      },
      products: productStatusCounts,
      recent_orders: recentOrders,
      recent_notifications: recentNotifications,
    };
  },

  async getTodaySales() {
    const sql = `
      SELECT 
        COALESCE(SUM(total), 0) as total_sales,
        COUNT(*) as order_count
      FROM orders
      WHERE status = 'paid'
        AND paid_at >= CURRENT_DATE
    `;
    const result = await query(sql);
    return result.rows[0];
  },

  async getMonthSales() {
    const sql = `
      SELECT 
        COALESCE(SUM(total), 0) as total_sales,
        COUNT(*) as order_count
      FROM orders
      WHERE status = 'paid'
        AND paid_at >= DATE_TRUNC('month', CURRENT_DATE)
    `;
    const result = await query(sql);
    return result.rows[0];
  },

  async getSalesChart(days = 30) {
    const sql = `
      SELECT 
        DATE(paid_at) as date,
        COALESCE(SUM(total), 0) as total,
        COUNT(*) as order_count
      FROM orders
      WHERE status = 'paid'
        AND paid_at >= CURRENT_DATE - INTERVAL '${days} days'
      GROUP BY DATE(paid_at)
      ORDER BY date ASC
    `;
    const result = await query(sql);
    return result.rows;
  },

  async getTopProducts(limit = 5) {
    const sql = `
      SELECT 
        p.id, p.name, p.price, p.images,
        COUNT(oi.id) as sales_count,
        SUM(oi.price) as total_sales
      FROM products p
      JOIN order_items oi ON p.id = oi.product_id
      JOIN orders o ON oi.order_id = o.id
      WHERE o.status = 'paid'
      GROUP BY p.id
      ORDER BY sales_count DESC
      LIMIT $1
    `;
    const result = await query(sql, [limit]);
    return result.rows;
  },
};

module.exports = dashboardService;
