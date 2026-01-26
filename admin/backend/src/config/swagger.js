const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Brecho Admin API",
      version: "1.0.0",
      description: "API administrativa para gerenciamento de brechó local",
      contact: {
        name: "Suporte",
        email: "suporte@brecho.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3002",
        description: "Servidor de Desenvolvimento",
      },
      {
        url: "https://kilario-admin-backend.vercel.app",
        description: "Servidor de Producao",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Token JWT obtido no login",
        },
      },
      schemas: {
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "admin@brecho.com",
            },
            password: { type: "string", minLength: 6, example: "admin123" },
          },
        },
        LoginResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            data: {
              type: "object",
              properties: {
                token: {
                  type: "string",
                  example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                },
                admin: {
                  type: "object",
                  properties: {
                    id: { type: "string", format: "uuid" },
                    email: { type: "string" },
                    name: { type: "string" },
                    role: {
                      type: "string",
                      enum: ["super_admin", "admin", "operator"],
                    },
                  },
                },
              },
            },
          },
        },

        Product: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            sku: { type: "string", example: "CAM-001" },
            title: { type: "string", example: "Camiseta Vintage" },
            description: { type: "string" },
            brand: { type: "string", example: "Nike" },
            category: {
              type: "string",
              enum: [
                "camisetas",
                "calcas",
                "vestidos",
                "casacos",
                "sapatos",
                "acessorios",
                "outros",
              ],
            },
            size: { type: "string", example: "M" },
            color: { type: "string", example: "Azul" },
            gender: {
              type: "string",
              enum: ["masculino", "feminino", "unissex"],
            },
            condition: {
              type: "string",
              enum: ["novo", "seminovo", "bom", "regular"],
            },
            cost_price: { type: "number", example: 25.0 },
            sell_price: { type: "number", example: 59.9 },
            status: {
              type: "string",
              enum: ["draft", "active", "reserved", "sold", "archived"],
            },
            images: { type: "array", items: { type: "string" } },
            collection_id: { type: "string", format: "uuid", nullable: true },
            created_at: { type: "string", format: "date-time" },
            updated_at: { type: "string", format: "date-time" },
          },
        },
        CreateProductRequest: {
          type: "object",
          required: ["title", "category", "size", "cost_price", "sell_price"],
          properties: {
            sku: { type: "string" },
            title: { type: "string", example: "Camiseta Vintage" },
            description: { type: "string" },
            brand: { type: "string" },
            category: {
              type: "string",
              enum: [
                "camisetas",
                "calcas",
                "vestidos",
                "casacos",
                "sapatos",
                "acessorios",
                "outros",
              ],
            },
            size: { type: "string", example: "M" },
            color: { type: "string" },
            gender: {
              type: "string",
              enum: ["masculino", "feminino", "unissex"],
              default: "unissex",
            },
            condition: {
              type: "string",
              enum: ["novo", "seminovo", "bom", "regular"],
              default: "bom",
            },
            cost_price: { type: "number", example: 25.0 },
            sell_price: { type: "number", example: 59.9 },
            images: { type: "array", items: { type: "string" } },
            collection_id: { type: "string", format: "uuid" },
          },
        },

        Collection: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            name: { type: "string", example: "Drop Verão 2024" },
            slug: { type: "string", example: "drop-verao-2024" },
            description: { type: "string" },
            cover_image: { type: "string" },
            release_date: { type: "string", format: "date-time" },
            status: {
              type: "string",
              enum: ["draft", "scheduled", "active", "ended"],
            },
            product_count: { type: "integer" },
            created_at: { type: "string", format: "date-time" },
          },
        },
        CreateCollectionRequest: {
          type: "object",
          required: ["name"],
          properties: {
            name: { type: "string", example: "Drop Verão 2024" },
            description: { type: "string" },
            cover_image: { type: "string" },
            release_date: { type: "string", format: "date-time" },
          },
        },

        Order: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            order_number: { type: "string", example: "ORD-2024-001" },
            customer_name: { type: "string" },
            customer_email: { type: "string" },
            customer_phone: { type: "string" },
            customer_document: { type: "string" },
            subtotal: { type: "number" },
            discount: { type: "number" },
            shipping_cost: { type: "number" },
            total: { type: "number" },
            payment_status: {
              type: "string",
              enum: ["pending", "paid", "failed", "refunded"],
            },
            payment_method: {
              type: "string",
              enum: ["pix", "credit_card", "debit_card", "cash"],
            },
            fulfillment_status: {
              type: "string",
              enum: [
                "pending",
                "processing",
                "shipped",
                "delivered",
                "cancelled",
              ],
            },
            delivery_type: { type: "string", enum: ["pickup", "delivery"] },
            notes: { type: "string" },
            items: {
              type: "array",
              items: { $ref: "#/components/schemas/OrderItem" },
            },
            created_at: { type: "string", format: "date-time" },
          },
        },
        OrderItem: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            product_id: { type: "string", format: "uuid" },
            product_title: { type: "string" },
            product_sku: { type: "string" },
            price: { type: "number" },
          },
        },

        Delivery: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            order_id: { type: "string", format: "uuid" },
            type: { type: "string", enum: ["pickup", "delivery"] },
            status: {
              type: "string",
              enum: [
                "pending",
                "scheduled",
                "in_transit",
                "delivered",
                "failed",
              ],
            },
            scheduled_date: { type: "string", format: "date-time" },
            delivered_at: { type: "string", format: "date-time" },
            address: {
              type: "object",
              properties: {
                street: { type: "string" },
                number: { type: "string" },
                complement: { type: "string" },
                neighborhood: { type: "string" },
                city: { type: "string" },
                state: { type: "string" },
                zipcode: { type: "string" },
              },
            },
            tracking_code: { type: "string" },
            notes: { type: "string" },
          },
        },

        Notification: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            type: {
              type: "string",
              enum: [
                "new_order",
                "payment_received",
                "low_stock",
                "collection_scheduled",
                "delivery_scheduled",
                "system",
              ],
            },
            title: { type: "string" },
            message: { type: "string" },
            is_read: { type: "boolean" },
            created_at: { type: "string", format: "date-time" },
          },
        },

        DashboardStats: {
          type: "object",
          properties: {
            overview: {
              type: "object",
              properties: {
                total_revenue: { type: "number" },
                total_orders: { type: "integer" },
                total_products: { type: "integer" },
                products_sold: { type: "integer" },
                average_ticket: { type: "number" },
              },
            },
            revenue_by_period: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  date: { type: "string" },
                  revenue: { type: "number" },
                  orders: { type: "integer" },
                },
              },
            },
            top_products: {
              type: "array",
              items: { $ref: "#/components/schemas/Product" },
            },
            recent_orders: {
              type: "array",
              items: { $ref: "#/components/schemas/Order" },
            },
            pending_deliveries: {
              type: "array",
              items: { $ref: "#/components/schemas/Delivery" },
            },
          },
        },

        SuccessResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            data: { type: "object" },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string" },
            errors: { type: "array", items: { type: "object" } },
          },
        },
        PaginatedResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            data: { type: "array", items: { type: "object" } },
            pagination: {
              type: "object",
              properties: {
                page: { type: "integer" },
                limit: { type: "integer" },
                total: { type: "integer" },
                totalPages: { type: "integer" },
              },
            },
          },
        },
      },
    },
    tags: [
      { name: "Auth", description: "Autenticacao de administradores" },
      { name: "Products", description: "Gerenciamento de produtos" },
      { name: "Collections", description: "Gerenciamento de colecoes/drops" },
      { name: "Orders", description: "Gerenciamento de pedidos" },
      { name: "Deliveries", description: "Gerenciamento de entregas" },
      { name: "Notifications", description: "Central de notificacoes" },
      { name: "Dashboard", description: "Estatisticas e metricas" },
      { name: "Webhooks", description: "Integracao com gateway de pagamento" },
    ],
    paths: {
      "/api/auth/login": {
        post: {
          tags: ["Auth"],
          summary: "Login administrativo",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/LoginRequest" },
              },
            },
          },
          responses: {
            200: {
              description: "Login realizado com sucesso",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/LoginResponse" },
                },
              },
            },
            401: {
              description: "Credenciais inválidas",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
          },
        },
      },

      "/api/admin/products": {
        get: {
          tags: ["Products"],
          security: [{ bearerAuth: [] }],
          summary: "Listar produtos",
          responses: {
            200: {
              description: "Lista de produtos",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/PaginatedResponse" },
                },
              },
            },
          },
        },
        post: {
          tags: ["Products"],
          security: [{ bearerAuth: [] }],
          summary: "Criar produto",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CreateProductRequest" },
              },
            },
          },
          responses: {
            201: {
              description: "Produto criado",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/SuccessResponse" },
                },
              },
            },
          },
        },
      },

      "/api/admin/collections": {
        get: {
          tags: ["Collections"],
          security: [{ bearerAuth: [] }],
          summary: "Listar coleções",
          responses: {
            200: {
              description: "Lista de coleções",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/PaginatedResponse" },
                },
              },
            },
          },
        },
        post: {
          tags: ["Collections"],
          security: [{ bearerAuth: [] }],
          summary: "Criar coleção",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/CreateCollectionRequest",
                },
              },
            },
          },
          responses: {
            201: {
              description: "Coleção criada",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/SuccessResponse" },
                },
              },
            },
          },
        },
      },

      "/api/admin/orders": {
        get: {
          tags: ["Orders"],
          security: [{ bearerAuth: [] }],
          summary: "Listar pedidos",
          responses: {
            200: {
              description: "Lista de pedidos",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/PaginatedResponse" },
                },
              },
            },
          },
        },
      },

      "/api/admin/deliveries": {
        get: {
          tags: ["Deliveries"],
          security: [{ bearerAuth: [] }],
          summary: "Listar entregas",
          responses: {
            200: {
              description: "Lista de entregas",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/PaginatedResponse" },
                },
              },
            },
          },
        },
      },

      "/api/admin/notifications": {
        get: {
          tags: ["Notifications"],
          security: [{ bearerAuth: [] }],
          summary: "Listar notificações",
          responses: {
            200: {
              description: "Lista de notificações",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/PaginatedResponse" },
                },
              },
            },
          },
        },
      },

      "/api/admin/dashboard": {
        get: {
          tags: ["Dashboard"],
          security: [{ bearerAuth: [] }],
          summary: "Dados do dashboard",
          responses: {
            200: {
              description: "Estatísticas administrativas",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/DashboardStats" },
                },
              },
            },
          },
        },
      },

      "/api/webhooks": {
        post: {
          tags: ["Webhooks"],
          summary: "Webhook de gateway de pagamento",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  additionalProperties: true,
                },
              },
            },
          },
          responses: {
            200: {
              description: "Webhook recebido com sucesso",
            },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.js"],
};

const specs = swaggerJsdoc(options);

module.exports = specs;
