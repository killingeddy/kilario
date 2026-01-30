"use client";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState } from "react";

import "swiper/css";

export default function ProductDetails({ product }) {
  if (!product) return null;

  const prevRef = useRef(null);
  const nextRef = useRef(null);

  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const hasDiscount =
    product.original_price &&
    Number(product.original_price) > Number(product.price);

  return (
    <div className="mx-auto max-w-6xl md:py-6">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* ESQUERDA — IMAGENS */}
        <div className="relative w-full aspect-square overflow-hidden rounded-lg">
          <Swiper
            modules={[Navigation]}
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}
            onSwiper={(swiper) => {
              setTimeout(() => {
                swiper.params.navigation.prevEl = prevRef.current;
                swiper.params.navigation.nextEl = nextRef.current;
                swiper.navigation.destroy();
                swiper.navigation.init();
                swiper.navigation.update();

                setIsBeginning(swiper.isBeginning);
                setIsEnd(swiper.isEnd);
              });
            }}
            onSlideChange={(swiper) => {
              setIsBeginning(swiper.isBeginning);
              setIsEnd(swiper.isEnd);
            }}
            className="h-full w-full"
          >
            {product.images.map((img, index) => (
              <SwiperSlide key={index}>
                <div className="relative h-full w-full">
                  <Image
                    src={img}
                    alt={product.title}
                    fill
                    className="object-contain"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {product.images.length > 1 && (
            <>
              <button
                ref={prevRef}
                disabled={isBeginning}
                className={`absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full p-2 transition
                  ${isBeginning && "opacity-30 cursor-not-allowed"}`}
              >
                <ChevronLeft />
              </button>

              <button
                ref={nextRef}
                disabled={isEnd}
                className={`absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full p-2 transition
                  ${isEnd && "opacity-30 cursor-not-allowed"}`}
              >
                <ChevronRight />
              </button>
            </>
          )}
        </div>

        {/* DIREITA — INFORMAÇÕES */}
        <div className="flex flex-col gap-6 relative">
          <Image
            src="/footerfish.png"
            alt="Kilario"
            width={200}
            height={200}
            className="object-cover rotate-y-180 absolute max-sm:hidden top-80 left-20 z-0 opacity-35 -z-50"
          />
          <Image
            src="/footerfish.png"
            alt="Kilario"
            width={200}
            height={200}
            className="object-cover rotate-y-180 absolute max-sm:hidden top-50 -left-5 z-0 opacity-35 -z-50"
          />
          <Image
            src="/footerfish.png"
            alt="Kilario"
            width={200}
            height={200}
            className="object-cover rotate-y-180 absolute max-sm:hidden -top-10 left-75 opacity-35 -z-50"
          />
          <Image
            src="/footerfish.png"
            alt="Kilario"
            width={200}
            height={200}
            className="object-cover rotate-y-180 absolute max-sm:hidden top-20 left-25 opacity-35 -z-50"
          />
          <Image
            src="/footerfish.png"
            alt="Kilario"
            width={200}
            height={200}
            className="object-cover rotate-y-180 absolute max-sm:hidden -top-20 left-0 opacity-35 -z-50"
          />
          <Image
            src="/footerfish.png"
            alt="Kilario"
            width={200}
            height={200}
            className="object-cover rotate-y-180 absolute max-sm:hidden top-55 left-75 opacity-35 -z-50"
          />
          {/* TÍTULO */}
          <div>
            <h1 className="text-xl font-montserrat font-semibold text-text">
              {product.title}
            </h1>

            <p className="text-sm text-text/60">
              Condição: {product.condition} • Tamanho: {product.size}
            </p>
          </div>

          {/* PREÇO */}
          <div className="flex items-center gap-3">
            {hasDiscount && (
              <span className="text-sm line-through text-text/60">
                R$ {Number(product.original_price).toFixed(2)}
              </span>
            )}

            <span className="text-2xl font-semibold text-text">
              R$ {Number(product.price).toFixed(2)}
            </span>
          </div>

          {/* DESCRIÇÃO */}
          <div>
            <h2 className="mb-1 text-sm font-semibold uppercase text-text">
              Descrição
            </h2>

            <p className="text-sm leading-relaxed text-text/80">
              {product.description}
            </p>
          </div>

          {/* TABELA DE MEDIDAS */}
          {product.measurements.length > 0 && (
            <div>
              <h2 className="mb-2 text-sm font-semibold uppercase text-text">
                Medidas
              </h2>

              <div className="overflow-hidden rounded border border-text/10">
                <table className="w-full text-sm">
                  <tbody>
                    {product.measurements.map((item, index) => (
                      <tr
                        key={index}
                        className="border-b border-text/10 last:border-0"
                      >
                        <td className="px-3 py-2 text-text/70">{item.key}</td>
                        <td className="px-3 py-2 text-right font-medium text-text">
                          {item.value} cm
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* BOTÃO */}
          <button className="mt-2 w-full rounded bg-text-aux py-3 text-sm font-montserrat font-medium uppercase text-background transition active:scale-[0.98]">
            Adicionar ao carrinho
          </button>
        </div>
      </div>
    </div>
  );
}
