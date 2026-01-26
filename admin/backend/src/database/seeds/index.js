require("dotenv").config();
const bcrypt = require("bcryptjs");
const { pool } = require("../connection");

const SALT_ROUNDS = 12;

async function seed() {
  console.log("🌱 Seeding database...");
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    /* =========================
      ADMINS
    ========================= */
    const adminPassword = await bcrypt.hash("admin123", SALT_ROUNDS);

    await client.query(
      `
      INSERT INTO admins (name, email, password, role)
      VALUES ($1, $2, $3, 'owner')
      ON CONFLICT (email) DO NOTHING
    `,
      ["Administradora", "admin@brecho.com", adminPassword],
    );

    /* =========================
      CONDITIONS
    ========================= */
    const conditionResult = await client.query(`
      INSERT INTO conditions (label, description)
      VALUES
        ('Novo', 'Produto sem uso'),
        ('Seminovo', 'Pouco uso, ótimo estado'),
        ('Usado', 'Com marcas de uso')
      RETURNING id
    `);

    const [condNew, condLikeNew, condUsed] = conditionResult.rows;

    /* =========================
      SIZES
    ========================= */
    const sizeResult = await client.query(`
      INSERT INTO sizes (label)
      VALUES ('P'), ('M'), ('G')
      RETURNING id
    `);

    const [sizeP, sizeM, sizeG] = sizeResult.rows;

    /* =========================
      COLLECTIONS
    ========================= */
    const collectionResult = await client.query(`
      INSERT INTO collections (title, slug, description, is_active)
      VALUES
        ('Drop de Verão 2024', 'drop-verao-2024', 'Peças leves e fresquinhas', true),
        ('Clássicos Atemporais', 'classicos-atemporais', 'Nunca saem de moda', true),
        ('Vintage 90s', 'vintage-90s', 'O melhor dos anos 90', false)
      RETURNING id
    `);

    const [colSummer, colClassic, colVintage] = collectionResult.rows;

    /* =========================
      PRODUCTS
    ========================= */
    const productResult = await client.query(
      `
      INSERT INTO products (
        title,
        description,
        brand,
        price,
        status,
        collection_id,
        condition_id,
        size_id
      )
      VALUES
        (
          'Vestido Floral Zara',
          'Vestido midi floral, perfeito para o verão',
          'Zara',
          89.00,
          'available',
          $1, $2, $3
        ),
        (
          'Calça Jeans Mom Farm',
          'Jeans cintura alta, corte reto',
          'Farm',
          129.00,
          'available',
          $1, $2, $4
        ),
        (
          'Blazer Preto Animale',
          'Blazer estruturado clássico',
          'Animale',
          159.00,
          'available',
          $5, $6, $7
        ),
        (
          'Jaqueta Jeans Vintage',
          'Oversized anos 90',
          'Levis',
          119.00,
          'sold',
          $8, $9, $7
        )
      RETURNING id
    `,
      [
        colSummer.id,
        condLikeNew.id,
        sizeM.id,
        sizeP.id,
        colClassic.id,
        condLikeNew.id,
        sizeG.id,
        colVintage.id,
        condUsed.id,
      ],
    );

    const [prodDress, prodJeans, prodBlazer, prodJacket] = productResult.rows;

    /* =========================
      PRODUCT IMAGES
    ========================= */
    await client.query(
      `
      INSERT INTO product_images (product_id, url, position)
      VALUES
        ($1, 'https://picsum.photos/600/800?1', 0),
        ($1, 'https://picsum.photos/600/800?2', 1),
        ($2, 'https://picsum.photos/600/800?3', 0),
        ($3, 'https://picsum.photos/600/800?4', 0)
    `,
      [prodDress.id, prodJeans.id, prodBlazer.id],
    );

    /* =========================
      USERS
    ========================= */
    const userPassword = await bcrypt.hash("123456", SALT_ROUNDS);

    const userResult = await client.query(
      `
      INSERT INTO users (name, email, phone, password)
      VALUES
        ('Maria Silva', 'maria@email.com', '11999998888', $1),
        ('Ana Costa', 'ana@email.com', '11988887777', $1)
      RETURNING id
    `,
      [userPassword],
    );

    const [userMaria, userAna] = userResult.rows;

    /* =========================
      ORDERS
    ========================= */
    const orderResult = await client.query(
      `
      INSERT INTO orders (
        user_id,
        subtotal,
        delivery_fee,
        discount,
        total,
        status,
        payment_method,
        payment_provider,
        paid_at
      )
      VALUES
        (
          $1,
          119.00,
          10.00,
          0,
          129.00,
          'paid',
          'pix',
          'infinite_pay',
          now()
        ),
        (
          $2,
          89.00,
          0,
          0,
          89.00,
          'pending',
          'pix',
          'infinite_pay',
          null
        )
      RETURNING id
    `,
      [userMaria.id, userAna.id],
    );

    const [orderPaid, orderPending] = orderResult.rows;

    /* =========================
      ORDER ITEMS
    ========================= */
    await client.query(
      `
      INSERT INTO order_items (order_id, product_id, price)
      VALUES ($1, $2, 119.00)
    `,
      [orderPaid.id, prodJacket.id],
    );

    /* =========================
      DELIVERIES
    ========================= */
    await client.query(
      `
      INSERT INTO deliveries (
        order_id,
        address,
        city,
        neighborhood,
        delivery_fee,
        status
      )
      VALUES
        (
          $1,
          'Rua das Flores, 123',
          'São Paulo',
          'Centro',
          10.00,
          'delivered'
        )
    `,
      [orderPaid.id],
    );

    /* =========================
      NOTIFICATIONS
    ========================= */
    await client.query(`
      INSERT INTO notifications (type, title, message)
      VALUES
        (
          'payment_received',
          'Pagamento confirmado',
          'Pagamento do pedido foi confirmado com sucesso.'
        ),
        (
          'new_order',
          'Novo pedido',
          'Novo pedido aguardando pagamento.'
        )
    `);

    await client.query("COMMIT");

    console.log("✅ Seed finalizado com sucesso!");
    console.log("Admin: admin@brecho.com | senha: admin123");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ Seed falhou:", err);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch(() => process.exit(1));
