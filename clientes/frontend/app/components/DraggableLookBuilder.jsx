"use client";

import React, { useState, useMemo, useRef } from "react";
import Draggable from "react-draggable";
import { MOCK_CLOTHES } from "../data/mockClothes";
import { useMounted } from "../hooks/useMounted";

const filteredClothes = MOCK_CLOTHES.filter((i) => i.id !== "none").slice(0, 6);
const initialPositions = filteredClothes.reduce(
  (acc, item, index) => {
    const x_start = 50;
    const y_start = 50;
    const x_spacing = 250;
    const y_spacing = 250;
    const items_per_row = 3;

    const row = Math.floor(index / items_per_row);
    const col = index % items_per_row;

    acc[item.id] = {
      x: x_start + col * x_spacing,
      y: y_start + row * y_spacing,
      isWorn: false,
    };
    return acc;
  },
  {}
);

export default function DraggableLookBuilder() {
  const mounted = useMounted();

  const [clothes, setClothes] = useState(initialPositions);

  const mannequinRef = useRef(null);
  const clothesRefs = useRef({});

  const worn = useMemo(
    () =>
      MOCK_CLOTHES.filter((i) => clothes[i.id]?.isWorn).sort(
        (a, b) => a.zIndex - b.zIndex
      ),
    [clothes]
  );


  if (!mounted) return null;

  const handleStop = (item, data) => {
    setClothes((prev) => ({
      ...prev,
      [item.id]: {
        x: data.x,
        y: data.y,
        isWorn: false, 
      },
    }));
  };

  return (
    <div className="flex flex-col items-center min-h-screen ">
      <div className="relative w-full h-150 rounded-lg overflow-hidden">
        <div
          ref={mannequinRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <img
            src="/images/roupas/mannequin_base2.png"
            alt="manequim"
            className="w-150 pointer-events-none select-none"
          />
        </div>

        {MOCK_CLOTHES.filter((i) => i.id !== "none").slice(0, 6).map((item) => {
          const ref = (clothesRefs.current[item.id] ??= React.createRef());

          return (
            <Draggable
              key={item.id}
              nodeRef={ref}
              bounds="parent"
              position={{
                x: clothes[item?.id]?.x,
                y: clothes[item?.id]?.y,
              }}
              onStop={(e, data) => handleStop(item, data)}
            >
              <img
                ref={ref}
                src={item?.imagePath}
                alt={item?.name}
                className="absolute cursor-grab select-none z-50"
                style={{
                  width: 220,
                  zIndex: item?.zIndex,
                  transform: "translate(-50%, -50%)",
                }}
              />
            </Draggable>
          );
        })}
      </div>
    </div>
  );
}
