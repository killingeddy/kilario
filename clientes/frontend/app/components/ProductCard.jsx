import { useRef, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";

import "swiper/css";
import Link from "next/link";

export function ProductCard({ product }) {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  const hasDiscount =
    product.original_price &&
    Number(product.original_price) > Number(product.price);

  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  return (
    <div className="p-2">
      <div className="flex flex-col gap-3">
        <div
          className="relative w-full aspect-square overflow-hidden rounded-lg bg-background"
          onClick={(e) => e.stopPropagation()}
        >
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
            nested={true}
            touchStartPreventDefault={false}
            touchMoveStopPropagation={true}
            allowTouchMove={true}
            simulateTouch={true}
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
                className={`absolute left-0 bottom-0 z-10 -translate-y-1/2 rounded-full p-1 cursor-pointer
                    ${isBeginning && "opacity-30 cursor-not-allowed"}`}
              >
                <ChevronLeft className="h-5 w-5 text-text" />
              </button>

              <button
                ref={nextRef}
                className={`absolute right-0 bottom-0 z-10 -translate-y-1/2 rounded-full p-1 cursor-pointer
                    ${isEnd && "opacity-30 cursor-not-allowed"}`}
              >
                <ChevronRight className="h-5 w-5 text-text" />
              </button>
            </>
          )}
        </div>

        {/* INFO */}
        <div className="flex flex-col gap-1">
          <h1 className="truncate text-sm font-nunito text-text">
            {product.title}
          </h1>

          <div className="flex items-center gap-2">
            {hasDiscount && (
              <span className="text-xs line-through text-text/60 font-montserrat">
                R$ {Number(product.original_price).toFixed(2)}
              </span>
            )}

            <span className="text-lg font-semibold font-montserrat text-text">
              R$ {Number(product.price).toFixed(2)}
            </span>
          </div>
        </div>

        <Link
          href={`/${product.id}`}
          className="w-full flex items-center justify-center cursor-pointer rounded bg-text-aux py-2 text-sm font-montserrat font-medium uppercase text-background"
        >
          Comprar
        </Link>
      </div>
    </div>
  );
}
