const { query, transaction, getClient } = require("../database/connection");

const orderRepository = {
  async findAll({
    limit,
    offset,
    status,
    customer_email,
    date_from,
    date_to,
    sort_by,
    sort_order,
  }) {
    let sql = `
      SELECT 
        o.id, o.reference_code, u.name as customer_name, u.email as customer_email, u.phone as customer_phone,
        o.total, o.status, o.payment_method, o.external_payment_id,
        o.created_at, o.paid_at,
        COUNT(oi.id) as item_count
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN users u ON o.user_id = u.id
      WHERE 1=1
    `;

    const params = [];
    let paramIndex = 1;

    if (status) {
      sql += ` AND o.status = $${paramIndex++}`;
      params.push(status);
    }

    if (customer_email) {
      sql += ` AND u.email ILIKE $${paramIndex++}`;
      params.push(`%${customer_email}%`);
    }

    if (date_from) {
      sql += ` AND o.created_at >= $${paramIndex++}`;
      params.push(date_from);
    }

    if (date_to) {
      sql += ` AND o.created_at <= $${paramIndex++}`;
      params.push(date_to);
    }

    sql += ` GROUP BY o.id, u.name, u.email, u.phone`;

    // Sorting
    const allowedSortColumns = ["created_at", "total"];
    const sortColumn = allowedSortColumns.includes(sort_by)
      ? sort_by
      : "created_at";
    const sortDir = sort_order === "asc" ? "ASC" : "DESC";
    sql += ` ORDER BY o.${sortColumn} ${sortDir}`;

    sql += ` LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
    params.push(limit, offset);

    const result = await query(sql, params);
    return result.rows;
  },

  async count({ status, customer_email, date_from, date_to }) {
    let sql = `SELECT COUNT(*) FROM orders o LEFT JOIN users u ON o.user_id = u.id WHERE 1=1`;
    const params = [];
    let paramIndex = 1;

    if (status) {
      sql += ` AND o.status = $${paramIndex++}`;
      params.push(status);
    }

    if (customer_email) {
      sql += ` AND u.email ILIKE $${paramIndex++}`;
      params.push(`%${customer_email}%`);
    }

    if (date_from) {
      sql += ` AND o.created_at >= $${paramIndex++}`;
      params.push(date_from);
    }

    if (date_to) {
      sql += ` AND o.created_at <= $${paramIndex++}`;
      params.push(date_to);
    }

    const result = await query(sql, params);
    return parseInt(result.rows[0].count, 10);
  },

  async findById(id) {
    const sql = `
      SELECT 
        o.id, o.reference_code, o.customer_name, o.customer_email, o.customer_phone,
        o.shipping_address, o.total, o.status, o.payment_method, o.payment_id,
        o.notes, o.created_at, o.updated_at, o.paid_at
      FROM orders o
      WHERE o.id = $1
    `;
    const result = await query(sql, [id]);
    return result.rows[0] || null;
  },

  async findByIdWithItems(id) {
    const order = await this.findById(id);
    if (!order) return null;

    // Get order items with product details
    const itemsSql = `
      SELECT 
        oi.id, oi.product_id, oi.price, oi.created_at,
        p.name as product_name, p.images as product_images,
        p.size as product_size, p.brand as product_brand
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = $1
    `;
    const itemsResult = await query(itemsSql, [id]);

    // Get delivery info
    const deliverySql = `
      SELECT id, status, scheduled_at, delivered_at, notes
      FROM deliveries
      WHERE order_id = $1
    `;
    const deliveryResult = await query(deliverySql, [id]);

    return {
      ...order,
      items: itemsResult.rows,
      delivery: deliveryResult.rows[0] || null,
    };
  },

  async findByReferenceCode(referenceCode) {
    const sql = `SELECT * FROM orders WHERE reference_code = $1`;
    const result = await query(sql, [referenceCode]);
    return result.rows[0] || null;
  },

  async findByPaymentId(paymentId) {
    const sql = `SELECT * FROM orders WHERE payment_id = $1`;
    const result = await query(sql, [paymentId]);
    return result.rows[0] || null;
  },

  async create(data, client = null) {
    const queryFn = client ? client.query.bind(client) : query;

    const sql = `
      INSERT INTO orders (
        reference_code, customer_name, customer_email, customer_phone,
        shipping_address, total, status, payment_method, payment_id, notes
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;

    const params = [
      data.reference_code,
      data.customer_name,
      data.customer_email,
      data.customer_phone || null,
      data.shipping_address ? JSON.stringify(data.shipping_address) : null,
      data.total,
      data.status || "pending",
      data.payment_method || null,
      data.payment_id || null,
      data.notes || null,
    ];

    const result = await queryFn(sql, params);
    return result.rows[0];
  },

  async createOrderItem(orderId, productId, price, client = null) {
    const queryFn = client ? client.query.bind(client) : query;

    const sql = `
      INSERT INTO order_items (order_id, product_id, price)
      VALUES ($1, $2, $3)
      RETURNING *
    `;

    const result = await queryFn(sql, [orderId, productId, price]);
    return result.rows[0];
  },

  async updateStatus(id, status, additionalData = {}) {
    const fields = ["status = $1", "updated_at = NOW()"];
    const params = [status];
    let paramIndex = 2;

    if (status === "paid" && !additionalData.paid_at) {
      fields.push(`paid_at = NOW()`);
    }

    if (additionalData.paid_at) {
      fields.push(`paid_at = $${paramIndex++}`);
      params.push(additionalData.paid_at);
    }

    params.push(id);

    const sql = `
      UPDATE orders
      SET ${fields.join(", ")}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const result = await query(sql, params);
    return result.rows[0];
  },

  async getRecentOrders(limit = 5) {
    const sql = `
      SELECT 
        o.id, o.reference_code, o.customer_name, o.total, o.status,
        o.created_at,
        COUNT(oi.id) as item_count
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      GROUP BY o.id
      ORDER BY o.created_at DESC
      LIMIT $1
    `;
    const result = await query(sql, [limit]);
    return result.rows;
  },

  async getTotalSales(dateFrom = null, dateTo = null) {
    let sql = `
      SELECT 
        COALESCE(SUM(total), 0) as total_sales,
        COUNT(*) as order_count
      FROM orders
      WHERE status = 'paid'
    `;

    const params = [];
    let paramIndex = 1;

    if (dateFrom) {
      sql += ` AND paid_at >= $${paramIndex++}`;
      params.push(dateFrom);
    }

    if (dateTo) {
      sql += ` AND paid_at <= $${paramIndex++}`;
      params.push(dateTo);
    }

    const result = await query(sql, params);
    return result.rows[0];
  },

  async countByStatus() {
    const sql = `
      SELECT status, COUNT(*) as count
      FROM orders
      GROUP BY status
    `;
    const result = await query(sql);
    return result.rows;
  },
};

module.exports = orderRepository;
