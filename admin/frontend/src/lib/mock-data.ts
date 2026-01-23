// Types
export type ProductStatus = "available" | "reserved" | "sold";
export type ClothingCondition = "new" | "like-new" | "good" | "fair";
export type OrderStatus = "pending" | "paid" | "refunded";
export type DeliveryStatus = "pending" | "scheduled" | "delivered";
export type PaymentMethod = "pix" | "card" | "cash";

export interface Measurement {
  name: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  brand: string;
  price: number;
  dropId: string;
  size: string;
  condition: ClothingCondition;
  status: ProductStatus;
  images: string[];
  measurements: Measurement[];
  createdAt: string;
}

export interface Drop {
  id: string;
  name: string;
  slug: string;
  description: string;
  launchDate: string;
  isActive: boolean;
  productCount: number;
}

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  image: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  total: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  deliveryAddress: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  deliveryFee: number;
  createdAt: string;
}

export interface Delivery {
  id: string;
  orderId: string;
  customerName: string;
  customerPhone: string;
  address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  status: DeliveryStatus;
  scheduledDate?: string;
  notes?: string;
}

export interface Notification {
  id: string;
  type: "sale" | "delivery" | "stock" | "general";
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

// Mock Data
export const drops: Drop[] = [
  {
    id: "1",
    name: "Verão 2026",
    slug: "verao-2026",
    description: "Coleção de verão com peças leves e coloridas",
    launchDate: "2026-01-15T10:00:00",
    isActive: true,
    productCount: 12,
  },
  {
    id: "2",
    name: "Vintage Collection",
    slug: "vintage-collection",
    description: "Peças vintage selecionadas com muito carinho",
    launchDate: "2026-01-20T14:00:00",
    isActive: true,
    productCount: 8,
  },
  {
    id: "3",
    name: "Outono 2026",
    slug: "outono-2026",
    description: "Peças quentinhas para os dias mais frios",
    launchDate: "2026-03-01T10:00:00",
    isActive: false,
    productCount: 0,
  },
];

export const products: Product[] = [
  {
    id: "1",
    name: "Vestido Floral Midi",
    description: "Vestido midi com estampa floral, perfeito para o verão",
    brand: "Farm",
    price: 89.9,
    dropId: "1",
    size: "M",
    condition: "like-new",
    status: "available",
    images: ["/placeholder.svg?height=400&width=300"],
    measurements: [
      { name: "Busto", value: "92cm" },
      { name: "Cintura", value: "76cm" },
      { name: "Comprimento", value: "110cm" },
    ],
    createdAt: "2026-01-10T10:00:00",
  },
  {
    id: "2",
    name: "Calça Jeans Mom",
    description: "Calça jeans modelo mom, cintura alta",
    brand: "Levis",
    price: 120.0,
    dropId: "1",
    size: "38",
    condition: "good",
    status: "reserved",
    images: ["/placeholder.svg?height=400&width=300"],
    measurements: [
      { name: "Cintura", value: "72cm" },
      { name: "Quadril", value: "98cm" },
      { name: "Comprimento", value: "100cm" },
    ],
    createdAt: "2026-01-11T14:00:00",
  },
  {
    id: "3",
    name: "Blusa de Seda",
    description: "Blusa de seda pura, cor nude",
    brand: "Animale",
    price: 75.0,
    dropId: "2",
    size: "P",
    condition: "new",
    status: "available",
    images: ["/placeholder.svg?height=400&width=300"],
    measurements: [
      { name: "Busto", value: "88cm" },
      { name: "Comprimento", value: "58cm" },
    ],
    createdAt: "2026-01-12T09:00:00",
  },
  {
    id: "4",
    name: "Saia Plissada",
    description: "Saia midi plissada em tom terracota",
    brand: "Zara",
    price: 65.0,
    dropId: "1",
    size: "M",
    condition: "like-new",
    status: "sold",
    images: ["/placeholder.svg?height=400&width=300"],
    measurements: [
      { name: "Cintura", value: "70cm" },
      { name: "Comprimento", value: "75cm" },
    ],
    createdAt: "2026-01-13T11:00:00",
  },
  {
    id: "5",
    name: "Blazer Oversized",
    description: "Blazer oversized em linho bege",
    brand: "Mango",
    price: 150.0,
    dropId: "2",
    size: "G",
    condition: "good",
    status: "available",
    images: ["/placeholder.svg?height=400&width=300"],
    measurements: [
      { name: "Ombro", value: "48cm" },
      { name: "Busto", value: "110cm" },
      { name: "Comprimento", value: "72cm" },
    ],
    createdAt: "2026-01-14T16:00:00",
  },
];

export const orders: Order[] = [
  {
    id: "1",
    customerName: "Maria Silva",
    customerEmail: "maria@email.com",
    customerPhone: "(11) 99999-1234",
    items: [
      {
        productId: "4",
        productName: "Saia Plissada",
        price: 65.0,
        image: "/placeholder.svg?height=80&width=60",
      },
    ],
    total: 75.0,
    paymentMethod: "pix",
    status: "paid",
    deliveryAddress: {
      street: "Rua das Flores",
      number: "123",
      complement: "Apto 45",
      neighborhood: "Jardim Paulista",
      city: "São Paulo",
      state: "SP",
      zipCode: "01234-000",
    },
    deliveryFee: 10.0,
    createdAt: "2026-01-22T10:30:00",
  },
  {
    id: "2",
    customerName: "Ana Costa",
    customerEmail: "ana@email.com",
    customerPhone: "(11) 98888-5678",
    items: [
      {
        productId: "1",
        productName: "Vestido Floral Midi",
        price: 89.9,
        image: "/placeholder.svg?height=80&width=60",
      },
      {
        productId: "3",
        productName: "Blusa de Seda",
        price: 75.0,
        image: "/placeholder.svg?height=80&width=60",
      },
    ],
    total: 179.9,
    paymentMethod: "card",
    status: "pending",
    deliveryAddress: {
      street: "Av. Brasil",
      number: "456",
      neighborhood: "Centro",
      city: "São Paulo",
      state: "SP",
      zipCode: "01000-000",
    },
    deliveryFee: 15.0,
    createdAt: "2026-01-23T09:15:00",
  },
  {
    id: "3",
    customerName: "Carla Mendes",
    customerEmail: "carla@email.com",
    customerPhone: "(11) 97777-9012",
    items: [
      {
        productId: "5",
        productName: "Blazer Oversized",
        price: 150.0,
        image: "/placeholder.svg?height=80&width=60",
      },
    ],
    total: 160.0,
    paymentMethod: "pix",
    status: "paid",
    deliveryAddress: {
      street: "Rua Augusta",
      number: "789",
      complement: "Loja 2",
      neighborhood: "Consolação",
      city: "São Paulo",
      state: "SP",
      zipCode: "01305-000",
    },
    deliveryFee: 10.0,
    createdAt: "2026-01-23T14:00:00",
  },
];

export const deliveries: Delivery[] = [
  {
    id: "1",
    orderId: "1",
    customerName: "Maria Silva",
    customerPhone: "(11) 99999-1234",
    address: {
      street: "Rua das Flores",
      number: "123",
      complement: "Apto 45",
      neighborhood: "Jardim Paulista",
      city: "São Paulo",
      state: "SP",
      zipCode: "01234-000",
    },
    status: "scheduled",
    scheduledDate: "2026-01-24T14:00:00",
    notes: "Ligar antes de entregar",
  },
  {
    id: "2",
    orderId: "3",
    customerName: "Carla Mendes",
    customerPhone: "(11) 97777-9012",
    address: {
      street: "Rua Augusta",
      number: "789",
      complement: "Loja 2",
      neighborhood: "Consolação",
      city: "São Paulo",
      state: "SP",
      zipCode: "01305-000",
    },
    status: "pending",
  },
];

export const notifications: Notification[] = [
  {
    id: "1",
    type: "sale",
    title: "Nova venda!",
    message: "Ana Costa comprou 2 peças - R$ 179,90",
    isRead: false,
    createdAt: "2026-01-23T09:15:00",
  },
  {
    id: "2",
    type: "delivery",
    title: "Entrega pendente",
    message: "A entrega para Carla Mendes precisa ser agendada",
    isRead: false,
    createdAt: "2026-01-23T14:05:00",
  },
  {
    id: "3",
    type: "sale",
    title: "Pagamento confirmado",
    message: "Maria Silva pagou o pedido #1",
    isRead: true,
    createdAt: "2026-01-22T10:35:00",
  },
  {
    id: "4",
    type: "stock",
    title: "Peça vendida",
    message: "Saia Plissada foi marcada como vendida",
    isRead: true,
    createdAt: "2026-01-22T10:30:00",
  },
];

// Helper functions
export const getDropById = (id: string) => drops.find((d) => d.id === id);
export const getProductsByDrop = (dropId: string) =>
  products.filter((p) => p.dropId === dropId);
export const getOrderById = (id: string) => orders.find((o) => o.id === id);
export const getDeliveryByOrderId = (orderId: string) =>
  deliveries.find((d) => d.orderId === orderId);

// Stats helpers
export const getStats = () => {
  const todayOrders = orders.filter((o) => {
    const orderDate = new Date(o.createdAt).toDateString();
    const today = new Date().toDateString();
    return orderDate === today;
  });

  const totalSales = orders
    .filter((o) => o.status === "paid")
    .reduce((sum, o) => sum + o.total, 0);

  const pendingDeliveries = deliveries.filter(
    (d) => d.status !== "delivered",
  ).length;
  const availableProducts = products.filter(
    (p) => p.status === "available",
  ).length;
  const unreadNotifications = notifications.filter((n) => !n.isRead).length;

  return {
    totalSales,
    todayOrdersCount: todayOrders.length,
    pendingDeliveries,
    availableProducts,
    unreadNotifications,
  };
};

// Size options
export const sizeOptions = [
  "PP",
  "P",
  "M",
  "G",
  "GG",
  "34",
  "36",
  "38",
  "40",
  "42",
  "44",
  "46",
];

// Condition labels
export const conditionLabels: Record<ClothingCondition, string> = {
  new: "Novo com etiqueta",
  "like-new": "Como novo",
  good: "Bom estado",
  fair: "Estado razoável",
};

// Status labels
export const productStatusLabels: Record<ProductStatus, string> = {
  available: "Disponível",
  reserved: "Reservada",
  sold: "Vendida",
};

export const orderStatusLabels: Record<OrderStatus, string> = {
  pending: "Pendente",
  paid: "Pago",
  refunded: "Reembolsado",
};

export const deliveryStatusLabels: Record<DeliveryStatus, string> = {
  pending: "Pendente",
  scheduled: "Agendada",
  delivered: "Entregue",
};

export const paymentMethodLabels: Record<PaymentMethod, string> = {
  pix: "PIX",
  card: "Cartão",
  cash: "Dinheiro",
};
