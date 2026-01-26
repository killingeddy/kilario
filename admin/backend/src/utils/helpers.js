// General helper functions

// Pagination helper
const paginate = (page = 1, limit = 20) => {
  const parsedPage = Math.max(1, parseInt(page, 10) || 1);
  const parsedLimit = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
  const offset = (parsedPage - 1) * parsedLimit;
  
  return {
    page: parsedPage,
    limit: parsedLimit,
    offset,
  };
};

// Build pagination response
const paginationResponse = (data, total, page, limit) => {
  const totalPages = Math.ceil(total / limit);
  
  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
};

// Format currency (BRL)
const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value / 100); // Assuming values are stored in cents
};

// Parse currency to cents
const toCents = (value) => {
  if (typeof value === 'string') {
    value = parseFloat(value.replace(/[^\d.,]/g, '').replace(',', '.'));
  }
  return Math.round(value * 100);
};

// Generate unique reference code
const generateReferenceCode = (prefix = 'ORD') => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}${random}`;
};

// Clean object from undefined/null values
const cleanObject = (obj) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v !== undefined && v !== null)
  );
};

// Sleep helper for retry logic
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Retry helper
const retry = async (fn, retries = 3, delay = 1000) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries - 1) throw error;
      await sleep(delay * (i + 1));
    }
  }
};

module.exports = {
  paginate,
  paginationResponse,
  formatCurrency,
  toCents,
  generateReferenceCode,
  cleanObject,
  sleep,
  retry,
};
