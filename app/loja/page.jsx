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
    <div className="w-full h-auto p-4 pt-18 grid grid-cols-6 bg-background">
      {products.map((product, index) => (
        <div key={index} className="p-2">
          <div className="bg-background-aux shadow h-auto bg-opacity-70 rounded-lg p-4 flex flex-col items-center">
            <Image
              src={`/images/roupas/${index + 1}.png`}
              width={150}
              height={150}
              alt={`Product ${index + 1}`}
              style={{ objectFit: "contain" }}
            />
            <div className="w-full h-auto mt-2 bg-background-aux rounded-md ">
              <div>
                <div className="flex flex-row items-center justify-between">
                  <div>
                    <h1 className="text-sm font-bold text-text font-montserrat mt-2">
                      {product.name}
                    </h1>
                    <h1 className="text-xs text-text font-nunito">
                      {product.collection}
                    </h1>
                  </div>
                  {product.interressedUsers >= 5 && (
                    <div className="flex flex-col items-center justify-center">
                      <RiFireFill className="text-text" size={16} />
                      <span className="text-text text-xs font-nunito">em alta!</span>
                    </div>
                  )}
                </div>
                <div className="flex justify-between items-center mt-2 mb-2">
                  <p className="text-base text-text font-montserrat mb-2 mt-1">
                    R$ {product.price.toFixed(2)}
                  </p>
                  <button className="px-2 py-1 bg-text rounded cursor-pointer hover:bg-text/80 transition">
                    <span className="text-background-aux font-nunito text-sm">
                      Comprar
                    </span>
                  </button>
                </div>
              </div>
              {product.interressedUsers > 0 && (
                <p className="text-xs opacity-80 font-bold text-text font-nunito mb-2">
                  {product.interressedUsers} pessoas interessadas nesta peça
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
