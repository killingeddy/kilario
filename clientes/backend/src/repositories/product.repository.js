const { query, transaction } = require("../database/connection");

const productRepository = {
  async findAll({
    limit,
    offset,
    status,
    collection_id,
    search,
    sort_by,
    sort_order,
  }) {
    let sql = `
      SELECT 
          p.id,
          p.title,
          p.description,
          p.price,
          p.original_price,
          p.brand,
          p.status,
          p.collection_id,
          s.label AS size,
          p.created_at,
          p.updated_at,
          c.title AS collection_name,
          COALESCE(img.images, '{}'::text[]) AS images,
          cond.label AS condition,
          COALESCE(m.measurements, '[]'::json) AS measurements
      FROM products p
      LEFT JOIN collections c ON p.collection_id = c.id
      LEFT JOIN conditions cond ON p.condition_id = cond.id
      LEFT JOIN sizes s ON p.size_id = s.id
      LEFT JOIN (
          SELECT 
              product_id,
              ARRAY_AGG(url) FILTER (WHERE url IS NOT NULL) AS images
          FROM product_images
          GROUP BY product_id
      ) img ON img.product_id = p.id
      LEFT JOIN (
          SELECT
              product_id,
              json_agg(
                  json_build_object(
                      'key', "key",
                      'value', value
                  )
              ) FILTER (WHERE "key" IS NOT NULL AND value IS NOT NULL) AS measurements
          FROM product_measurements
          GROUP BY product_id
      ) m ON m.product_id = p.id
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
      sql += ` AND (p.title ILIKE $${paramIndex} OR p.description ILIKE $${paramIndex} OR p.brand ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    // Sorting
    const allowedSortColumns = ["created_at", "price", "title"];
    const sortColumn = allowedSortColumns.includes(sort_by)
      ? sort_by
      : "created_at";
    const sortDir = sort_order === "asc" ? "ASC" : "DESC";
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
      sql += ` AND (p.title ILIKE $${paramIndex} OR p.description ILIKE $${paramIndex} OR p.brand ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    const result = await query(sql, params);
    return parseInt(result.rows[0].count, 10);
  },

  async findById(id) {
    const sql = `
       SELECT 
          p.id,
          p.title,
          p.description,
          p.price,
          p.original_price,
          p.brand,
          p.status,
          p.collection_id,
          s.label AS size,
          p.created_at,
          p.updated_at,
          c.title AS collection_name,
          COALESCE(img.images, '{}'::text[]) AS images,
          cond.label AS condition,
          COALESCE(m.measurements, '[]'::json) AS measurements
      FROM products p
      LEFT JOIN collections c ON p.collection_id = c.id
      LEFT JOIN conditions cond ON p.condition_id = cond.id
      LEFT JOIN sizes s ON p.size_id = s.id
      LEFT JOIN (
          SELECT 
              product_id,
              ARRAY_AGG(url) FILTER (WHERE url IS NOT NULL) AS images
          FROM product_images
          GROUP BY product_id
      ) img ON img.product_id = p.id
      LEFT JOIN (
          SELECT
              product_id,
              json_agg(
                  json_build_object(
                      'key', "key",
                      'value', value
                  )
              ) FILTER (WHERE "key" IS NOT NULL AND value IS NOT NULL) AS measurements
          FROM product_measurements
          GROUP BY product_id
      ) m ON m.product_id = p.id
      WHERE p.id = $1
    `;
    const result = await query(sql, [id]);
    if (!result.rows[0]) return null;

    return result.rows[0];
  },

  async create(data, client = null) {
    const sql = `
      INSERT INTO products (
        title, description, price, original_price,
        brand, status, collection_id, size_id, condition_id
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;

    const params = [
      data.title,
      data.description || null,
      data.price,
      data.original_price || null,
      data.brand || null,
      data.status || "available",
      data.collection_id || null,
      data.size_id || null,
      data.condition_id || null,
    ];

    const result = await query(sql, params);
    return result.rows[0];
  },

  async update(id, data, client = null) {
    const queryFn = client ? client.query.bind(client) : query;
    const fields = [];
    const params = [];
    let paramIndex = 1;

    const allowedFields = [
      "title",
      "description",
      "price",
      "original_price",
      "brand",
      "status",
      "collection_id",
      "size_id",
      "condition_id",
    ];

    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        fields.push(`${field} = $${paramIndex++}`);
        params.push(data[field]);
      }
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    fields.push("updated_at = NOW()");
    params.push(id);

    const sql = `
      UPDATE products
      SET ${fields.join(", ")}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const result = await queryFn(sql, params);
    return result.rows[0];
  },

  // Métodos para gerenciar imagens e medidas (usados dentro de transações no service)
  async saveImages(productId, images, client) {
    // Limpar imagens antigas
    await client.query(`DELETE FROM product_images WHERE product_id = $1`, [
      productId,
    ]);

    if (images && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        await client.query(
          `INSERT INTO product_images (product_id, url, position) VALUES ($1, $2, $3)`,
          [productId, images[i], i],
        );
      }
    }
  },

  async saveMeasurements(productId, measurements, client) {
    // Limpar medidas antigas
    await client.query(
      `DELETE FROM product_measurements WHERE product_id = $1`,
      [productId],
    );

    if (measurements && Object.keys(measurements).length > 0) {
      for (const [key, value] of Object.entries(measurements)) {
        await client.query(
          `INSERT INTO product_measurements (product_id, key, value) VALUES ($1, $2, $3)`,
          [productId, key, value],
        );
      }
    }
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

  async getSizes() {
    const sql = `SELECT id, label FROM sizes ORDER BY label`;
    const result = await query(sql);
    return result.rows;
  },

  async getConditions() {
    const sql = `SELECT id, label FROM conditions ORDER BY label`;
    const result = await query(sql);
    return result.rows;
  }
};

module.exports = productRepository;
