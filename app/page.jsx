"use client";
import DraggableLookBuilder from "./components/DraggableLookBuilder";
import { IoChevronForward } from "react-icons/io5";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const HeaderSection = ({ title, subtitle, link, linkText }) => (
  <div className="py-2 flex justify-between md:items-center flex-col md:flex-row gap-y-3">
    <div>
      <h1 className="text-base tracking-wide font-bold text-text font-montserrat">
        {title}
      </h1>
      <p className="text-xs text-text font-nunito">{subtitle}</p>
    </div>
    {link && (
      <Link href={link} className="flex items-center gap-1 hover:underline">
        <h1 className="text-xs tracking-wide font-bold text-text font-nunito">
          {linkText}
        </h1>
        <IoChevronForward className="inline-block w-4 h-4 text-text" />
      </Link>
    )}
  </div>
);

export default function Home() {
  const [products, setProducts] = React.useState([]);

  const productsNames = [
    "Colete",
    "Bermuda Oversized",
    "Blusa de Alça",
    "Shorts Jeans",
    "Camiseta Estampada",
    "Calça Jeans",
    "Jaqueta de Couro",
    "Vestido Floral",
    "Camisa Social",
    "Saia Plissada",
    "Moletom com Capuz",
    "Tênis Casual",
  ];

  const collections = [
    "Coleção de Verão",
    "Coleção Casual",
    "Coleção Esportiva",
    "Coleção Streetwear",
    "Coleção Clássica",
    "Coleção Vintage",
    "Coleção Rocker",
    "Coleção Romântica",
    "Coleção Formal",
    "Coleção Feminina",
    "Coleção Conforto",
    "Coleção Urbana",
  ];

  const interressedUsers = [3, 2, 2, 1, 3, 5, 1, 4, 1, 2, 3, 1];

  const prices = [20, 15, 18, 10, 13, 9, 25, 30, 22, 18, 20, 15];

  React.useEffect(() => {
    const fetchProducts = async () => {
      const simulatedProducts = Array.from({ length: 12 }, (_, index) => ({
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
    <div className="relative w-full h-screen flex flex-col p-4 pt-0">
      <Image
        src="/images/homealt.png"
        width={1920}
        height={1080}
        alt="Home Image"
        style={{ objectFit: "cover", zIndex: -1 }}
      />
      <div>
        <HeaderSection
          title="Último drop disponível!"
          link="loja"
          linkText="Ir para a loja"
        />
        <div className="grid grid-cols-6 h-auto">
          {products.map((product, index) => (
            <div key={index} className="p-2">
              <div className="bg-background-aux shadow shadow-text/10 h-auto bg-opacity-70 rounded-lg p-4 flex flex-col items-center">
                <Image
                  src={`/images/roupas/${index + 1}.png`}
                  width={150}
                  height={150}
                  alt={`Product ${index + 1}`}
                  style={{ objectFit: "contain" }}
                />
                <div className="w-full h-auto mt-2 bg-background-aux rounded-md ">
                  <div>
                    <h1 className="text-sm font-bold text-text font-montserrat mt-2">
                      {product.name}
                    </h1>
                    <h1 className="text-xs text-text font-nunito">
                      {product.collection}
                    </h1>
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
      </div>
      <div className="mt-4 flex-1">
        <DraggableLookBuilder />
      </div>
    </div>
  );
}
