"use client";
import Image from "next/image";
import React from "react";
import "swiper/css";
import Footer from "./components/footer";
import Link from "next/link";
import { IoChevronForward } from "react-icons/io5";

export default function Home() {
  const [products, setProducts] = React.useState([]);

  const productsNames = [
    "Colete",
    "Bermuda oversized",
    "Blusa de alça",
    "Shorts jeans",
    "Camiseta estampada",
    "Calça jeans",
    "Blusa de alça fina",
    "Bermuda jeans",
    "Saia jeans branca",
    "Camiseta listrada",
    "Jaqueta jeans",
    "Boné",
  ];

  const interressedUsers = [3, 2, 2, 1, 3, 5, 1, 4, 1, 2, 3, 1];

  const prices = [20, 15, 18, 10, 13, 9, 25, 30, 22, 18, 20, 15];

  React.useEffect(() => {
    const fetchProducts = async () => {
      const simulatedProducts = Array.from({ length: 12 }, (_, index) => ({
        id: index + 1,
        name: productsNames[index],
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
        src="/images/home2.png"
        width={1920}
        height={1080}
        alt="Home Image"
        style={{ objectFit: "cover", zIndex: -1 }}
        className="md:-mt-25"
      />
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mt-4 z-10">
        {products.map((product) => (
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

              <button className="w-full bg-text-aux rounded cursor-pointer font-medium text-background py-2 font-montserrat uppercase text-sm">
                Comprar
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2">
        <Image
          src="/images/canfish.png"
          width={1920}
          height={1080}
          alt="Home Image"
          style={{ objectFit: "cover", zIndex: -1 }}
        />
        <div className="relative w-full">
          <div className="py-pr-10 flex justify-between md:items-center flex-col md:flex-row gap-y-3 absolute top-0 w-full">
            <div>
              <h1 className="text-base tracking-wide font-bold text-button font-montserrat">
                Monte seu look <span className="font-burgues">Kilariô</span>
              </h1>
              <p className="text-xs text-text font-nunito">Confira as peças do nosso guarda-roupa</p>
            </div>
              <Link
                href={"/guardaroupa"}
                className="flex items-center gap-1 hover:underline"
              >
                <IoChevronForward className="inline-block w-4 h-4 text-button" />
              </Link>
          </div>
          <Image
            src="/images/guardaroupa.png"
            width={1920}
            height={1080}
            alt="Home Image"
            style={{ objectFit: "cover", zIndex: -1 }}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mt-4 z-10">
        {products.map((product) => (
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

              <button className="w-full bg-text-aux rounded cursor-pointer font-medium text-background py-2 font-montserrat uppercase text-sm">
                Comprar
              </button>
            </div>
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
}
