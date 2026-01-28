const { query } = require("../database/connection");

const deliveryRepository = {
  async findAll({ limit, offset, status, date_from, date_to }) {
    let sql = `
      SELECT 
        d.id, d.order_id, d.status, d.notes,
        d.created_at, d.updated_at,
        o.reference_code, u.name as customer_name, 
        u.email as customer_email, u.phone as customer_phone,
        CONCAT(
        d.address, ', ', 
        d.neighborhood, ', ',
        d.city)
      FROM deliveries d
      JOIN orders o ON d.order_id = o.id
      JOIN users u ON o.user_id = u.id
      WHERE 1=1
    `;

    const params = [];
    let paramIndex = 1;

    if (status) {
      sql += ` AND d.status = $${paramIndex++}`;
      params.push(status);
    }

    if (date_from) {
      sql += ` AND d.created_at >= $${paramIndex++}`;
      params.push(date_from);
    }

    if (date_to) {
      sql += ` AND d.created_at <= $${paramIndex++}`;
      params.push(date_to);
    }

    sql += ` ORDER BY 
      CASE d.status 
        WHEN 'pending' THEN 1 
        WHEN 'scheduled' THEN 2 
        WHEN 'delivered' THEN 3 
        ELSE 4
      END,
      d.created_at DESC`;

    sql += ` LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
    params.push(limit, offset);

    const result = await query(sql, params);
    return result.rows;
  },

  async count({ status, date_from, date_to }) {
    let sql = `SELECT COUNT(*) FROM deliveries d WHERE 1=1`;
    const params = [];
    let paramIndex = 1;

    if (status) {
      sql += ` AND d.status = $${paramIndex++}`;
      params.push(status);
    }

    if (date_from) {
      sql += ` AND d.created_at >= $${paramIndex++}`;
      params.push(date_from);
    }

    if (date_to) {
      sql += ` AND d.created_at <= $${paramIndex++}`;
      params.push(date_to);
    }

    const result = await query(sql, params);
    return parseInt(result.rows[0].count, 10);
  },

  async findById(id) {
    const sql = `
      SELECT 
        d.id, d.order_id, d.status, d.notes,
        d.created_at, d.updated_at,
        o.reference_code, u.name as customer_name, 
        u.email as customer_email, u.phone as customer_phone,
        CONCAT(
        d.address, ', ', 
        d.neighborhood, ', ',
        d.city)
      FROM deliveries d
      JOIN orders o ON d.order_id = o.id
      JOIN users u ON o.user_id = u.id
      WHERE d.id = $1
    `;
    const result = await query(sql, [id]);
    return result.rows[0] || null;
  },

  async findByOrderId(orderId) {
    const sql = `
      SELECT 
        d.id, d.order_id, d.status, d.notes,
        d.created_at, d.updated_at,
        o.reference_code, u.name as customer_name, 
        u.email as customer_email, u.phone as customer_phone,
        CONCAT(
        d.address, ', ', 
        d.neighborhood, ', ',
        d.city)
      FROM deliveries d
      JOIN orders o ON d.order_id = o.id
      JOIN users u ON o.user_id = u.id
      WHERE d.order_id = $1
    `;
    const result = await query(sql, [orderId]);
    return result.rows[0] || null;
  },

  async create(data, client = null) {
    const queryFn = client ? client.query.bind(client) : query;

    const sql = `
      INSERT INTO deliveries (order_id, status, scheduled_at, notes)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;

    const params = [
      data.order_id,
      data.status || "pending",
      data.scheduled_at || null,
      data.notes || null,
    ];

    const result = await queryFn(sql, params);
    return result.rows[0];
  },

  async updateStatus(id, status, additionalData = {}) {
    const fields = ["status = $1", "updated_at = NOW()"];
    const params = [status];
    let paramIndex = 2;

    if (additionalData.scheduled_at !== undefined) {
      fields.push(`scheduled_at = $${paramIndex++}`);
      params.push(additionalData.scheduled_at);
    }

    if (status === "delivered" && !additionalData.delivered_at) {
      fields.push(`delivered_at = NOW()`);
    } else if (additionalData.delivered_at) {
      fields.push(`delivered_at = $${paramIndex++}`);
      params.push(additionalData.delivered_at);
    }

    if (additionalData.notes !== undefined) {
      fields.push(`notes = $${paramIndex++}`);
      params.push(additionalData.notes);
    }

    params.push(id);

    const sql = `
      UPDATE deliveries
      SET ${fields.join(", ")}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const result = await query(sql, params);
    return result.rows[0];
  },

  async countPending() {
    const sql = `
      SELECT COUNT(*) FROM deliveries
      WHERE status IN ('pending', 'scheduled', 'in_transit')
    `;
    const result = await query(sql);
    return parseInt(result.rows[0].count, 10);
  },

  async countByStatus() {
    const sql = `
      SELECT status, COUNT(*) as count
      FROM deliveries
      GROUP BY status
    `;
    const result = await query(sql);
    return result.rows;
  },
};

module.exports = deliveryRepository;
