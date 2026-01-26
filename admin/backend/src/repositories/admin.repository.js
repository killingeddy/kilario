const { query } = require("../database/connection");

const adminRepository = {
  async findByEmail(email) {
    const sql = `
      SELECT id, name, email, password, created_at, updated_at
      FROM admins
      WHERE email = $1
      LIMIT 1
    `;
    const result = await query(sql, [email]);
    return result.rows[0] || null;
  },

  async findById(id) {
    const sql = `
      SELECT id, name, email, created_at, updated_at
      FROM admins
      WHERE id = $1
      LIMIT 1
    `;
    const result = await query(sql, [id]);
    return result.rows[0] || null;
  },

  async create({ name, email, password }) {
    const sql = `
      INSERT INTO admins (name, email, password)
      VALUES ($1, $2, $3)
      RETURNING id, name, email, created_at
    `;
    const result = await query(sql, [name, email, password]);
    return result.rows[0];
  },

  async updatePassword(id, hashedPassword) {
    const sql = `
      UPDATE admins
      SET password = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING id, name, email, updated_at
    `;
    const result = await query(sql, [hashedPassword, id]);
    return result.rows[0];
  },

  async updateLastLogin(id) {
    const sql = `
      UPDATE admins
      SET last_login_at = NOW()
      WHERE id = $1
    `;
    await query(sql, [id]);
  },
};

module.exports = adminRepository;
