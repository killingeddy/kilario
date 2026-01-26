const { z } = require("zod");

const DELIVERY_STATUS = [
  "pending",
  "scheduled",
  "in_transit",
  "delivered",
  "failed",
];

const updateDeliveryStatusSchema = z.object({
  status: z.enum(DELIVERY_STATUS, {
    errorMap: () => ({
      message: `Status must be one of: ${DELIVERY_STATUS.join(", ")}`,
    }),
  }),
  notes: z.string().optional(),
  scheduled_at: z.string().datetime().optional(),
  delivered_at: z.string().datetime().optional(),
});

const deliveryQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  status: z.enum(DELIVERY_STATUS).optional(),
  date_from: z.string().datetime().optional(),
  date_to: z.string().datetime().optional(),
});

module.exports = {
  updateDeliveryStatusSchema,
  deliveryQuerySchema,
  DELIVERY_STATUS,
};
