const { query } = require("../database/connection");

const webhookEventRepository = {
  async findByEventId(eventId) {
    const sql = `SELECT * FROM webhook_events WHERE event_id = $1`;
    const result = await query(sql, [eventId]);
    return result.rows[0] || null;
  },

  async create(data, client = null) {
    const queryFn = client ? client.query.bind(client) : query;

    const sql = `
      INSERT INTO webhook_events (event_id, event_type, payload, status, processed_at)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;

    const params = [
      data.event_id,
      data.event_type,
      JSON.stringify(data.payload),
      data.status || "pending",
      data.processed_at || null,
    ];

    const result = await queryFn(sql, params);
    return result.rows[0];
  },

  async updateStatus(id, status, error = null) {
    const sql = `
      UPDATE webhook_events
      SET status = $1, 
          error = $2,
          processed_at = CASE WHEN $1 IN ('processed', 'failed') THEN NOW() ELSE processed_at END
      WHERE id = $3
      RETURNING *
    `;
    const result = await query(sql, [status, error, id]);
    return result.rows[0];
  },

  async getRecent(limit = 20) {
    const sql = `
      SELECT id, event_id, event_type, status, created_at, processed_at
      FROM webhook_events
      ORDER BY created_at DESC
      LIMIT $1
    `;
    const result = await query(sql, [limit]);
    return result.rows;
  },
};

module.exports = webhookEventRepository;
