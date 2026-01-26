const { query } = require("../database/connection");

const NOTIFICATION_TYPES = {
  NEW_ORDER: "new_order",
  PAYMENT_RECEIVED: "payment_received",
  DELIVERY_COMPLETED: "delivery_completed",
  LOW_STOCK: "low_stock",
  SYSTEM: "system",
};

const notificationRepository = {
  async findAll({ limit, offset, unread_only }) {
    let sql = `
      SELECT 
        id, type, title, message, data, is_read,
        created_at, read_at
      FROM notifications
      WHERE 1=1
    `;

    const params = [];
    let paramIndex = 1;

    if (unread_only) {
      sql += ` AND is_read = false`;
    }

    sql += ` ORDER BY created_at DESC`;
    sql += ` LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
    params.push(limit, offset);

    const result = await query(sql, params);
    return result.rows;
  },

  async count({ unread_only }) {
    let sql = `SELECT COUNT(*) FROM notifications WHERE 1=1`;

    if (unread_only) {
      sql += ` AND is_read = false`;
    }

    const result = await query(sql);
    return parseInt(result.rows[0].count, 10);
  },

  async countUnread() {
    const sql = `SELECT COUNT(*) FROM notifications WHERE is_read = false`;
    const result = await query(sql);
    return parseInt(result.rows[0].count, 10);
  },

  async findById(id) {
    const sql = `SELECT * FROM notifications WHERE id = $1`;
    const result = await query(sql, [id]);
    return result.rows[0] || null;
  },

  async create(data, client = null) {
    const queryFn = client ? client.query.bind(client) : query;

    const sql = `
      INSERT INTO notifications (type, title, message, data)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;

    const params = [
      data.type,
      data.title,
      data.message,
      data.data ? JSON.stringify(data.data) : null,
    ];

    const result = await queryFn(sql, params);
    return result.rows[0];
  },

  async markAsRead(id) {
    const sql = `
      UPDATE notifications
      SET is_read = true, read_at = NOW()
      WHERE id = $1
      RETURNING *
    `;
    const result = await query(sql, [id]);
    return result.rows[0];
  },

  async markAllAsRead() {
    const sql = `
      UPDATE notifications
      SET is_read = true, read_at = NOW()
      WHERE is_read = false
      RETURNING id
    `;
    const result = await query(sql);
    return result.rowCount;
  },

  async getRecent(limit = 5) {
    const sql = `
      SELECT id, type, title, message, is_read, created_at
      FROM notifications
      ORDER BY created_at DESC
      LIMIT $1
    `;
    const result = await query(sql, [limit]);
    return result.rows;
  },

  async delete(id) {
    const sql = `DELETE FROM notifications WHERE id = $1 RETURNING id`;
    const result = await query(sql, [id]);
    return result.rowCount > 0;
  },

  async deleteOld(daysOld = 30) {
    const sql = `
      DELETE FROM notifications
      WHERE created_at < NOW() - INTERVAL '${daysOld} days'
      RETURNING id
    `;
    const result = await query(sql);
    return result.rowCount;
  },
};

module.exports = {
  notificationRepository,
  NOTIFICATION_TYPES,
};
