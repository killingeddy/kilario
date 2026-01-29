"use client";
import Image from "next/image";
import React from "react";
import Footer from "./components/footer";
import Link from "next/link";
import { IoChevronForward } from "react-icons/io5";
import { ProductCard } from "./components/ProductCard";
import useApi from "./lib/api";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

export default function Home() {
  const api = useApi();

  const [products, setProducts] = React.useState([]);

  const getProducts = async () => {
    try {
      const response = await api.get("/products");
      console.log("response", response);

      setProducts(response.data.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  React.useEffect(() => {
    getProducts();
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
      <div className="py-2 flex justify-between md:items-center flex-row gap-y-3  top-0 w-full">
        <div>
          <h1 className="text-base tracking-wide font-bold text-button font-montserrat">
            Nosso último drop
          </h1>
          <p className="text-xs text-text font-nunito">
            Peças novas, recém-chegadas por aqui
          </p>
        </div>
        <Link
          href={"/guardaroupa"}
          className="flex items-center gap-1 hover:underline"
        >
          <IoChevronForward className="inline-block w-4 h-4 text-button" />
        </Link>
      </div>
      <Swiper
        modules={[Navigation]}
        navigation={{
          nextEl: null,
          prevEl: null,
        }}
        spaceBetween={16}
        slidesPerView={2}
        breakpoints={{
          768: {
            slidesPerView: 6,
          },
        }}
        className="w-full min-h-88"
      >
        {products.map((product) => (
          <SwiperSlide key={product.id} onClick={(e) => e.stopPropagation()}>
            <ProductCard product={product} key={product.id} />
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="grid grid-cols-1 md:grid-cols-2">
        <Image
          src="/images/canfish.png"
          width={1920}
          height={1080}
          alt="Home Image"
          style={{ objectFit: "cover", zIndex: -1 }}
        />
        <div className="relative w-full">
          <div className="py-2 flex justify-between md:items-center flex-row gap-y-3 absolute top-0 w-full">
            <div>
              <h1 className="text-base tracking-wide font-bold text-button font-montserrat">
                Monte seu look <span className="font-burgues">Kilariô</span>
              </h1>
              <p className="text-xs text-text font-nunito">
                Misture, combine e crie do seu jeito
              </p>
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
            className="max-sm:mt-10"
          />
        </div>
      </div>
      <div className="py-2 flex justify-between md:items-center flex-row gap-y-3  top-0 w-full">
        <div>
          <h1 className="text-base tracking-wide font-bold text-button font-montserrat">
            Confira todas as peças disponíveis
          </h1>
          <p className="text-xs text-text font-nunito">
            Entre, explore e descubra o que combina com você
          </p>
        </div>
        <Link
          href={"/loja"}
          className="flex items-center gap-1 hover:underline"
        >
          <IoChevronForward className="inline-block w-4 h-4 text-button" />
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mt-4 z-10">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <Footer />
    </div>
  );
}
