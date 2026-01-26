const { query, transaction } = require('../database/connection');

const productRepository = {
  async findAll({ limit, offset, status, collection_id, search, sort_by, sort_order }) {
    let sql = `
      SELECT 
        p.id, p.name, p.description, p.price, p.original_price,
        p.size, p.brand, p.color, p.condition, p.status,
        p.images, p.tags, p.collection_id,
        p.created_at, p.updated_at,
        c.name as collection_name
      FROM products p
      LEFT JOIN collections c ON p.collection_id = c.id
      WHERE 1=1
    `;
    
    const params = [];
    let paramIndex = 1;
    
    if (status) {
      sql += ` AND p.status = $${paramIndex++}`;
      params.push(status);
    }
    
    if (collection_id) {
      sql += ` AND p.collection_id = $${paramIndex++}`;
      params.push(collection_id);
    }
    
    if (search) {
      sql += ` AND (p.name ILIKE $${paramIndex} OR p.description ILIKE $${paramIndex} OR p.brand ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }
    
    // Sorting
    const allowedSortColumns = ['created_at', 'price', 'name'];
    const sortColumn = allowedSortColumns.includes(sort_by) ? sort_by : 'created_at';
    const sortDir = sort_order === 'asc' ? 'ASC' : 'DESC';
    sql += ` ORDER BY p.${sortColumn} ${sortDir}`;
    
    // Pagination
    sql += ` LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
    params.push(limit, offset);
    
    const result = await query(sql, params);
    return result.rows;
  },

  async count({ status, collection_id, search }) {
    let sql = `SELECT COUNT(*) FROM products p WHERE 1=1`;
    const params = [];
    let paramIndex = 1;
    
    if (status) {
      sql += ` AND p.status = $${paramIndex++}`;
      params.push(status);
    }
    
    if (collection_id) {
      sql += ` AND p.collection_id = $${paramIndex++}`;
      params.push(collection_id);
    }
    
    if (search) {
      sql += ` AND (p.name ILIKE $${paramIndex} OR p.description ILIKE $${paramIndex} OR p.brand ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
    }
    
    const result = await query(sql, params);
    return parseInt(result.rows[0].count, 10);
  },

  async findById(id) {
    const sql = `
      SELECT 
        p.id, p.name, p.description, p.price, p.original_price,
        p.size, p.brand, p.color, p.condition, p.status,
        p.images, p.tags, p.collection_id,
        p.created_at, p.updated_at,
        c.name as collection_name
      FROM products p
      LEFT JOIN collections c ON p.collection_id = c.id
      WHERE p.id = $1
    `;
    const result = await query(sql, [id]);
    return result.rows[0] || null;
  },

  async create(data) {
    const sql = `
      INSERT INTO products (
        name, description, price, original_price,
        size, brand, color, condition, status,
        images, tags, collection_id
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `;
    
    const params = [
      data.name,
      data.description || null,
      data.price,
      data.original_price || null,
      data.size || null,
      data.brand || null,
      data.color || null,
      data.condition || 'good',
      'available',
      JSON.stringify(data.images || []),
      JSON.stringify(data.tags || []),
      data.collection_id || null,
    ];
    
    const result = await query(sql, params);
    return result.rows[0];
  },

  async update(id, data) {
    const fields = [];
    const params = [];
    let paramIndex = 1;
    
    const allowedFields = [
      'name', 'description', 'price', 'original_price',
      'size', 'brand', 'color', 'condition', 'collection_id',
    ];
    
    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        fields.push(`${field} = $${paramIndex++}`);
        params.push(data[field]);
      }
    }
    
    // Handle JSON fields
    if (data.images !== undefined) {
      fields.push(`images = $${paramIndex++}`);
      params.push(JSON.stringify(data.images));
    }
    
    if (data.tags !== undefined) {
      fields.push(`tags = $${paramIndex++}`);
      params.push(JSON.stringify(data.tags));
    }
    
    if (fields.length === 0) {
      return this.findById(id);
    }
    
    fields.push('updated_at = NOW()');
    params.push(id);
    
    const sql = `
      UPDATE products
      SET ${fields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;
    
    const result = await query(sql, params);
    return result.rows[0];
  },

  async updateStatus(id, status) {
    const sql = `
      UPDATE products
      SET status = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING *
    `;
    const result = await query(sql, [status, id]);
    return result.rows[0];
  },

  async delete(id) {
    const sql = `DELETE FROM products WHERE id = $1 RETURNING id`;
    const result = await query(sql, [id]);
    return result.rowCount > 0;
  },

  // Bulk update status for order processing
  async updateStatusBulk(ids, status, client = null) {
    const queryFn = client ? client.query.bind(client) : query;
    const sql = `
      UPDATE products
      SET status = $1, updated_at = NOW()
      WHERE id = ANY($2)
      RETURNING id
    `;
    const result = await queryFn(sql, [status, ids]);
    return result.rows;
  },

  async countByStatus() {
    const sql = `
      SELECT status, COUNT(*) as count
      FROM products
      GROUP BY status
    `;
    const result = await query(sql);
    return result.rows;
  },
};

module.exports = productRepository;
