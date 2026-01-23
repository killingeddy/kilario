// app/data/mockClothes.js

/**
 * Estrutura de dados mockados para as roupas.
 * A categoria é definida por um ID para facilitar a lógica de agrupamento e carrossel.
 *
 * category_id:
 * 1: Top (Blusas, Camisetas, Coletes)
 * 2: Bottom (Bermudas, Saias, Calças)
 * 3: Accessory (Acessórios, Bonés, Óculos)
 * 4: Footwear (Calçados)
 */
export const CATEGORIES = [
  { id: 3, name: 'Accessory', label: 'Acessórios' },
  { id: 1, name: 'Top', label: 'Blusas/Coletes' },
  { id: 2, name: 'Bottom', label: 'Bermudas/Saias' },
  // Adicione mais categorias conforme necessário
];

export const MOCK_CLOTHES = [
  // --- Tops (category_id: 1) ---
  {
    id: 't1',
    name: 'Colete Bege de Caça',
    category_id: 1,
    imagePath: '/images/roupas/1.png',
    zIndex: 10,
  },
  {
    id: 't2',
    name: 'Regata Bege Simples',
    category_id: 1,
    imagePath: '/images/roupas/3.png',
    zIndex: 10,
  },
  {
    id: 't3',
    name: 'Camisa Roxa Estampada',
    category_id: 1,
    imagePath: '/images/roupas/5.png',
    zIndex: 10,
  },
  {
    id: 't4',
    name: 'Colete Bege de Caça',
    category_id: 1,
    imagePath: '/images/roupas/7.png',
    zIndex: 10,
  },
  {
    id: 't5',
    name: 'Regata Bege Simples',
    category_id: 1,
    imagePath: '/images/roupas/10.png',
    zIndex: 10,
  },
  {
    id: 't6',
    name: 'Camisa Roxa Estampada',
    category_id: 1,
    imagePath: '/images/roupas/11.png',
    zIndex: 10,
  },
  // --- Bottoms (category_id: 2) ---
  {
    id: 'b1',
    name: 'Bermuda Jeans Cargo',
    category_id: 2,
    imagePath: '/images/roupas/2.png',
    zIndex: 5,
  },
  {
    id: 'b2',
    name: 'Saia Preta Caveira',
    category_id: 2,
    imagePath: '/images/roupas/4.png',
    zIndex: 5,
  },
  {
    id: 'b4',
    name: 'Calça Cargo Verde',
    category_id: 2,
    imagePath: '/images/roupas/8.png',
    zIndex: 5,
  },
  {
    id: 'b5',
    name: 'Calça Cargo Verde',
    category_id: 2,
    imagePath: '/images/roupas/9.png',
    zIndex: 5,
  },
  // --- Accessories (category_id: 3) ---
  {
    id: 'a1',
    name: 'Boné Preto Básico',
    category_id: 3,
    imagePath: '/images/roupas/12.png',
    zIndex: 15,
  },
  {
    id: 'a2',
    name: 'Óculos de Sol Vintage',
    category_id: 3,
    imagePath: '/images/roupas/13.png',
    zIndex: 15,
  },
  {
    id: 'a2',
    name: 'Óculos de Sol Vintage',
    category_id: 3,
    imagePath: '/images/roupas/14.png',
    zIndex: 15,
  },
  {
    id: 'a2',
    name: 'Óculos de Sol Vintage',
    category_id: 3,
    imagePath: '/images/roupas/15.png',
    zIndex: 15,
  },
];

export const getGroupedClothes = () => {
  const grouped = {};

  CATEGORIES.forEach(cat => {
    grouped[cat.id] = [MOCK_CLOTHES.find(c => c.id === 'none')];
  });

  MOCK_CLOTHES.forEach(item => {
    if (item.category_id > 0) {
      grouped[item.category_id].push(item);
    }
  });

  return grouped;
};

export const GROUPED_CLOTHES = getGroupedClothes();
