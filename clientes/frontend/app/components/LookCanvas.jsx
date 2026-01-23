"use client";
import React, { useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import html2canvas from "html2canvas";

export function LookCanvas({ selectedIndices, groupedClothes }) {
  const ref = useRef(null);

  const layers = useMemo(() => {
    return Object.keys(selectedIndices)
      .map((categoryId) => {
        const idx = selectedIndices[categoryId];
        const item = groupedClothes[categoryId]?.[idx + 1];
        return item && item.id !== "none" ? item : null;
      })
      .filter(Boolean)
      .sort((a, b) => a.zIndex - b.zIndex);
  }, [selectedIndices, groupedClothes]);

  const exportPNG = async () => {
    if (!ref.current) return;
    const canvas = await html2canvas(ref.current, { backgroundColor: null });
    const link = document.createElement("a");
    link.download = "look-kilario.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative w-[340px] h-[540px] rounded-[56px]  overflow-hidden"
      >
        {/* Camadas de roupas */}
        <AnimatePresence>
          {layers.map((item) => (
            <motion.img
              key={item.id}
              src={item.imagePath}
              alt={item.name}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className={`absolute inset-0 object-contain pointer-events-none mx-auto
                ${
                    item.category_id === 3 ? "top-0" : item.category_id === 1 ? "top-24" : "top-72"
                }`}
              style={{
                height: item?.category_id === 3 ? "110px" : "240px",
                width: "240px",
                zIndex: item.zIndex
              }}
            />
          ))}
        </AnimatePresence>

        {/* Assinatura */}
        <span className="absolute bottom-4 right-6 text-xs italic opacity-60">
          kilário
        </span>
      </motion.div>

      <button
        onClick={exportPNG}
        className="px-6 py-2 rounded-md border border-text text-text hover:bg-text hover:text-white transition"
      >
        Baixar imagem
      </button>
    </div>
  );
}

/**
 * INTEGRAÇÃO NO LOOKBUILDER
 * ------------------------
 * Use assim dentro do seu componente atual:
 *
 * <LookCanvas
 *   selectedIndices={selectedIndices}
 *   groupedClothes={GROUPED_CLOTHES}
 * />
 */
