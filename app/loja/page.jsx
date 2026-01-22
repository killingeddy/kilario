"use client";
import { RiFireFill } from "react-icons/ri";
import Image from "next/image";
import React from "react";

export default function Loja() {
  const [products, setProducts] = React.useState([]);

  const productsNames = [
    "Colete",
    "Bermuda Oversized",
    "Blusa de Alça",
    "Shorts Jeans",
    "Camiseta Estampada",
    "Calça Jeans",
    "Jaqueta Casual",
    "Saia Midi",
    "Camisa Social",
    "Vestido Floral",
    "Calça de Moletom",
  ];

  const collections = [
    "Coleção de Verão",
    "Coleção Casual",
    "Coleção Esportiva",
    "Coleção Streetwear",
    "Coleção Clássica",
    "Coleção Vintage",
    "Coleção Outono",
    "Coleção Inverno",
    "Coleção Formal",
    "Coleção Praia",
    "Coleção Fitness",
  ];

  const interressedUsers = [3, 2, 2, 1, 3, 5, 4, 1, 5, 1, 3];

  const prices = [20, 15, 18, 10, 13, 9, 25, 22, 30, 28, 16];

  React.useEffect(() => {
    const fetchProducts = async () => {
      const simulatedProducts = Array.from({ length: 11 }, (_, index) => ({
        id: index + 1,
        name: productsNames[index],
        collection: collections[index],
        price: prices[index],
        image: `/images/roupas/${index + 1}.png`,
        interressedUsers: interressedUsers[index],
      }));
      setProducts(simulatedProducts);
    };

    fetchProducts();
  }, []);
  return (
    <div className="w-full h-auto p-4 grid grid-cols-2 md:grid-cols-6 bg-background">
      {products.map((product, index) => (
        <div className="p-2" key={product.id}>
          <div className="overflow-hidden gap-2 flex flex-col">
            <div className="relative w-full aspect-square">
              <Image
                src={product.image}
                fill
                alt={product.name}
                className="object-contain"
              />
            </div>

            <div>
              <h1 className="text-sm font-nunito text-text truncate">
                {product.name}
              </h1>

              <p className="text-xl font-montserrat font-medium text-text">
                R$ {product.price.toFixed(2)}
              </p>
            </div>

            <button className="w-full bg-button-aux cursor-pointer font-medium text-background py-2 font-montserrat uppercase text-sm">
              Comprar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
