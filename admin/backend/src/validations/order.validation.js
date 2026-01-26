const { z } = require("zod");

const ORDER_STATUS = ["pending", "paid", "refunded", "cancelled"];
const PAYMENT_METHODS = ["pix", "credit_card", "debit_card"];

const updateOrderStatusSchema = z.object({
  status: z.enum(ORDER_STATUS, {
    errorMap: () => ({
      message: `Status must be one of: ${ORDER_STATUS.join(", ")}`,
    }),
  }),
  reason: z.string().optional(),
});

const orderQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  status: z.enum(ORDER_STATUS).optional(),
  customer_email: z.string().optional(),
  date_from: z.string().datetime().optional(),
  date_to: z.string().datetime().optional(),
  sort_by: z.enum(["created_at", "total"]).default("created_at"),
  sort_order: z.enum(["asc", "desc"]).default("desc"),
});

module.exports = {
  updateOrderStatusSchema,
  orderQuerySchema,
  ORDER_STATUS,
  PAYMENT_METHODS,
};
