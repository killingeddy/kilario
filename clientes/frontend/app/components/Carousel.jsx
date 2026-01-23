"use client";
import { FiChevronRight, FiChevronLeft } from "react-icons/fi";

import React from "react";
import { i } from "framer-motion/client";

const Carousel = ({ items, selectedIndex, onSelect, label }) => {
  const totalItems = items.length;

  const goToNext = () => {
    if (totalItems === 0) return;
    if (selectedIndex === -1) return;
    const nextIndex = (selectedIndex + 1) % totalItems;
    onSelect(nextIndex);
  };

  const goToPrev = () => {
    if (totalItems === 0) return;
    if (selectedIndex === -1) return;
    const prevIndex = (selectedIndex - 1 + totalItems) % totalItems;
    onSelect(prevIndex);
  };

  const selectedItem = items[selectedIndex + 1];

  const isFirst = selectedIndex === 0;
  const isLast = selectedIndex === items.length - 1;

  return (
    <div className="flex flex-col items-center p-2 justify-center">
      {/* <h3 className="text-sm font-semibold mb-2 text-gray-700">{label}</h3> */}
      <div className="flex items-center justify-center w-full">
        <button
          onClick={goToPrev}
          className="p-2 text-xl font-bold text-text cursor-pointer transition duration-150"
          aria-label={`Anterior ${label}`}
          disabled={isFirst}
        >
          <FiChevronLeft width={24} height={24} className="inline-block" />
        </button>

        <div className="flex flex-col items-center mx-4 justify-center">
          {selectedItem?.imagePath && (
            <img
              src={selectedItem?.imagePath}
              alt={selectedItem?.name}
              className="object-contain"
              style={{ height: selectedItem?.category_id === 3 ? "80px" : "150px", width: "150px" }}
            />
          )}
        </div>

        <button
          onClick={goToNext}
          className="p-2 text-xl font-bold text-text cursor-pointer transition duration-150"
          aria-label={`Próximo ${label}`}
          disabled={isLast}
        >
          <FiChevronRight width={24} height={24} className="inline-block" />
        </button>
      </div>
    </div>
  );
};

export default Carousel;
