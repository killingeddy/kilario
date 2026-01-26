const { query } = require('../database/connection');

const collectionRepository = {
  async findAll({ limit, offset, is_active, search }) {
    let sql = `
      SELECT 
        c.id, c.name, c.description, c.cover_image,
        c.is_active, c.starts_at, c.ends_at,
        c.created_at, c.updated_at,
        COUNT(p.id) as product_count,
        COUNT(CASE WHEN p.status = 'available' THEN 1 END) as available_count
      FROM collections c
      LEFT JOIN products p ON c.id = p.collection_id
      WHERE 1=1
    `;
    
    const params = [];
    let paramIndex = 1;
    
    if (is_active !== undefined) {
      sql += ` AND c.is_active = $${paramIndex++}`;
      params.push(is_active);
    }
    
    if (search) {
      sql += ` AND (c.name ILIKE $${paramIndex} OR c.description ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }
    
    sql += ` GROUP BY c.id ORDER BY c.created_at DESC`;
    sql += ` LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
    params.push(limit, offset);
    
    const result = await query(sql, params);
    return result.rows;
  },

  async count({ is_active, search }) {
    let sql = `SELECT COUNT(*) FROM collections c WHERE 1=1`;
    const params = [];
    let paramIndex = 1;
    
    if (is_active !== undefined) {
      sql += ` AND c.is_active = $${paramIndex++}`;
      params.push(is_active);
    }
    
    if (search) {
      sql += ` AND (c.name ILIKE $${paramIndex} OR c.description ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
    }
    
    const result = await query(sql, params);
    return parseInt(result.rows[0].count, 10);
  },

  async findById(id) {
    const sql = `
      SELECT 
        c.id, c.name, c.description, c.cover_image,
        c.is_active, c.starts_at, c.ends_at,
        c.created_at, c.updated_at,
        COUNT(p.id) as product_count,
        COUNT(CASE WHEN p.status = 'available' THEN 1 END) as available_count,
        COUNT(CASE WHEN p.status = 'sold' THEN 1 END) as sold_count
      FROM collections c
      LEFT JOIN products p ON c.id = p.collection_id
      WHERE c.id = $1
      GROUP BY c.id
    `;
    const result = await query(sql, [id]);
    return result.rows[0] || null;
  },

  async findByIdWithProducts(id) {
    // Get collection
    const collection = await this.findById(id);
    if (!collection) return null;
    
    // Get products
    const productsSql = `
      SELECT id, name, price, status, images, size, brand
      FROM products
      WHERE collection_id = $1
      ORDER BY created_at DESC
    `;
    const productsResult = await query(productsSql, [id]);
    
    return {
      ...collection,
      products: productsResult.rows,
    };
  },

  async create(data) {
    const sql = `
      INSERT INTO collections (name, description, cover_image, is_active, starts_at, ends_at)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    
    const params = [
      data.name,
      data.description || null,
      data.cover_image || null,
      data.is_active !== undefined ? data.is_active : true,
      data.starts_at || null,
      data.ends_at || null,
    ];
    
    const result = await query(sql, params);
    return result.rows[0];
  },

  async update(id, data) {
    const fields = [];
    const params = [];
    let paramIndex = 1;
    
    const allowedFields = ['name', 'description', 'cover_image', 'is_active', 'starts_at', 'ends_at'];
    
    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        fields.push(`${field} = $${paramIndex++}`);
        params.push(data[field]);
      }
    }
    
    if (fields.length === 0) {
      return this.findById(id);
    }
    
    fields.push('updated_at = NOW()');
    params.push(id);
    
    const sql = `
      UPDATE collections
      SET ${fields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;
    
    const result = await query(sql, params);
    return result.rows[0];
  },

  async toggleActive(id, isActive) {
    const sql = `
      UPDATE collections
      SET is_active = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING *
    `;
    const result = await query(sql, [isActive, id]);
    return result.rows[0];
  },

  async delete(id) {
    const sql = `DELETE FROM collections WHERE id = $1 RETURNING id`;
    const result = await query(sql, [id]);
    return result.rowCount > 0;
  },

  async getActiveCollections() {
    const sql = `
      SELECT 
        c.id, c.name, c.description, c.cover_image,
        c.starts_at, c.ends_at,
        COUNT(CASE WHEN p.status = 'available' THEN 1 END) as available_count
      FROM collections c
      LEFT JOIN products p ON c.id = p.collection_id
      WHERE c.is_active = true
        AND (c.starts_at IS NULL OR c.starts_at <= NOW())
        AND (c.ends_at IS NULL OR c.ends_at > NOW())
      GROUP BY c.id
      ORDER BY c.created_at DESC
    `;
    const result = await query(sql);
    return result.rows;
  },
};

module.exports = collectionRepository;
