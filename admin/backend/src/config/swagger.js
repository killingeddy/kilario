const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "Brechó Admin API",
      version: "1.0.0",
      description: "API administrativa para gerenciamento do brechó",
    },

    servers: [
      {
        url: "http://localhost:3002",
        description: "Servidor de Desenvolvimento",
      },
    ],

    /* ===================== SECURITY ===================== */
    security: [{ bearerAuth: [] }],

    /* ===================== TAGS ===================== */
    tags: [
      { name: "Auth", description: "Autenticação administrativa" },
      { name: "Products", description: "Gerenciamento de produtos" },
      { name: "Collections", description: "Gerenciamento de coleções" },
      { name: "Orders", description: "Gerenciamento de pedidos" },
      { name: "Deliveries", description: "Gerenciamento de entregas" },
      { name: "Notifications", description: "Notificações do sistema" },
      { name: "Dashboard", description: "Métricas e indicadores" },
    ],

    /* ===================== COMPONENTS ===================== */
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },

      parameters: {
        IdParam: {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string", format: "uuid" },
        },
      },

      schemas: {
        /* ---------- AUTH ---------- */
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", example: "admin@brecho.com" },
            password: { type: "string", example: "123456" },
          },
        },

        RegisterAdminRequest: {
          type: "object",
          required: ["name", "email", "password"],
          properties: {
            name: { type: "string" },
            email: { type: "string" },
            password: { type: "string" },
          },
        },

        ChangePasswordRequest: {
          type: "object",
          required: ["currentPassword", "newPassword"],
          properties: {
            currentPassword: { type: "string" },
            newPassword: { type: "string" },
          },
        },

        /* ---------- COMMON ---------- */
        PaginationQuery: {
          type: "object",
          properties: {
            page: { type: "integer", default: 1 },
            limit: { type: "integer", default: 10 },
            search: { type: "string" },
          },
        },

        /* ---------- PRODUCTS ---------- */
        CreateProductRequest: {
          type: "object",
          required: ["title", "category", "sell_price"],
          properties: {
            title: { type: "string" },
            category: { type: "string" },
            sell_price: { type: "number" },
            status: {
              type: "string",
              enum: ["draft", "active", "sold", "archived"],
            },
          },
        },

        UpdateProductRequest: {
          allOf: [{ $ref: "#/components/schemas/CreateProductRequest" }],
        },

        UpdateProductStatusRequest: {
          type: "object",
          required: ["status"],
          properties: {
            status: {
              type: "string",
              enum: ["draft", "active", "sold", "archived"],
            },
          },
        },

        /* ---------- COLLECTIONS ---------- */
        CreateCollectionRequest: {
          type: "object",
          required: ["name"],
          properties: {
            name: { type: "string" },
            description: { type: "string" },
          },
        },

        UpdateCollectionRequest: {
          allOf: [{ $ref: "#/components/schemas/CreateCollectionRequest" }],
        },

        /* ---------- ORDERS ---------- */
        UpdateOrderStatusRequest: {
          type: "object",
          required: ["status"],
          properties: {
            status: {
              type: "string",
              enum: ["pending", "paid", "shipped", "delivered", "cancelled"],
            },
          },
        },

        /* ---------- DELIVERIES ---------- */
        UpdateDeliveryStatusRequest: {
          type: "object",
          required: ["status"],
          properties: {
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
          },
        },
      },
    },

    /* ===================== PATHS ===================== */
    paths: {
      /* ---------- AUTH ---------- */
      "/api/auth/login": {
        post: {
          tags: ["Auth"],
          security: [],
          summary: "Login administrativo",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/LoginRequest" },
              },
            },
          },
          responses: { 200: { description: "Login realizado" } },
        },
      },

      "/api/auth/register": {
        post: {
          tags: ["Auth"],
          security: [],
          summary: "Registrar administrador",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/RegisterAdminRequest" },
              },
            },
          },
          responses: { 201: { description: "Administrador criado" } },
        },
      },

      "/api/auth/me": {
        get: {
          tags: ["Auth"],
          summary: "Dados do admin logado",
          responses: { 200: { description: "Dados retornados" } },
        },
      },

      "/api/auth/change-password": {
        post: {
          tags: ["Auth"],
          summary: "Alterar senha",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ChangePasswordRequest" },
              },
            },
          },
          responses: { 200: { description: "Senha alterada" } },
        },
      },

      /* ---------- PRODUCTS ---------- */
      "/api/admin/products": {
        get: {
          tags: ["Products"],
          summary: "Listar produtos",
          responses: { 200: { description: "Lista de produtos" } },
        },
        post: {
          tags: ["Products"],
          summary: "Criar produto",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CreateProductRequest" },
              },
            },
          },
          responses: { 201: { description: "Produto criado" } },
        },
      },

      "/api/admin/products/{id}": {
        get: {
          tags: ["Products"],
          summary: "Buscar produto",
          parameters: [{ $ref: "#/components/parameters/IdParam" }],
          responses: { 200: { description: "Produto encontrado" } },
        },
        put: {
          tags: ["Products"],
          summary: "Atualizar produto",
          parameters: [{ $ref: "#/components/parameters/IdParam" }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/UpdateProductRequest" },
              },
            },
          },
          responses: { 200: { description: "Produto atualizado" } },
        },
        delete: {
          tags: ["Products"],
          summary: "Excluir produto",
          parameters: [{ $ref: "#/components/parameters/IdParam" }],
          responses: { 204: { description: "Produto removido" } },
        },
      },

      "/api/admin/products/{id}/status": {
        patch: {
          tags: ["Products"],
          summary: "Atualizar status do produto",
          parameters: [{ $ref: "#/components/parameters/IdParam" }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/UpdateProductStatusRequest",
                },
              },
            },
          },
          responses: { 200: { description: "Status atualizado" } },
        },
      },

      /* ---------- COLLECTIONS ---------- */
      "/api/admin/collections/active": {
        get: {
          tags: ["Collections"],
          summary: "Coleção ativa",
          responses: { 200: { description: "Coleção ativa retornada" } },
        },
      },

      "/api/admin/collections/{id}/toggle": {
        patch: {
          tags: ["Collections"],
          summary: "Ativar/desativar coleção",
          parameters: [{ $ref: "#/components/parameters/IdParam" }],
          responses: { 200: { description: "Coleção atualizada" } },
        },
      },

      /* ---------- ORDERS ---------- */
      "/api/admin/orders/{id}/status": {
        patch: {
          tags: ["Orders"],
          summary: "Atualizar status do pedido",
          parameters: [{ $ref: "#/components/parameters/IdParam" }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/UpdateOrderStatusRequest",
                },
              },
            },
          },
          responses: { 200: { description: "Status atualizado" } },
        },
      },

      /* ---------- DELIVERIES ---------- */
      "/api/admin/deliveries/{id}/status": {
        patch: {
          tags: ["Deliveries"],
          summary: "Atualizar status da entrega",
          parameters: [{ $ref: "#/components/parameters/IdParam" }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/UpdateDeliveryStatusRequest",
                },
              },
            },
          },
          responses: { 200: { description: "Entrega atualizada" } },
        },
      },
    },
  },

  apis: [],
};

module.exports = swaggerJsdoc(options);
