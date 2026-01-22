"use client";
import { CATEGORIES, GROUPED_CLOTHES } from "../data/mockClothes";
import React, { useState, useEffect } from "react";
import { IoShuffle } from "react-icons/io5";
import { LookCanvas } from "./LookCanvas";
import Carousel from "./Carousel";
import Image from "next/image";

const initialSelectedIndices = CATEGORIES.reduce((acc, category) => {
  acc[category.id] = 0;
  return acc;
}, {});

const LookBuilder = () => {
  const LOCAL_STORAGE_KEY = "kilario_saved_looks";

  const [savedLooks, setSavedLooks] = useState([]);
  const [lookName, setLookName] = useState("");
  const [selectedIndices, setSelectedIndices] = useState(
    initialSelectedIndices
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedLooks = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedLooks) {
        setSavedLooks(JSON.parse(storedLooks));
      }
    }
  }, []);

  const saveCurrentLook = () => {
    if (!lookName.trim()) return;

    const lookToSave = {
      id: Date.now(),
      name: lookName.trim(),
      indices: selectedIndices,
      date: new Date().toLocaleDateString("pt-BR"),
    };

    const newSavedLooks = [...savedLooks, lookToSave];
    setSavedLooks(newSavedLooks);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newSavedLooks));
    setLookName("");
  };

  const loadLook = (indices) => {
    setSelectedIndices(indices);
  };

  const shuffleLook = () => {
    const newIndices = CATEGORIES.reduce((acc, category) => {
      const items = GROUPED_CLOTHES[category.id];
      if (!items || items.length <= 1) {
        acc[category.id] = selectedIndices[category.id];
        return acc;
      }

      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * items.length);
      } while (randomIndex === selectedIndices[category.id]);

      acc[category.id] = randomIndex;
      return acc;
    }, {});

    setSelectedIndices(newIndices);
  };

  const removeLook = (id) => {
    const newSavedLooks = savedLooks.filter((look) => look.id !== id);
    setSavedLooks(newSavedLooks);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newSavedLooks));
  };

  const getLookPreview = (indices, categoryId) => {
    const group = GROUPED_CLOTHES[categoryId] || [];
    const selectedIdx = indices?.[categoryId];
    const item = group[selectedIdx + 1];

    if (!item || item.id === "none") {
      return;
    }

    return item.imagePath;
  };

  const handleSelect = (categoryId, newIndex) => {
    setSelectedIndices((prev) => ({
      ...prev,
      [categoryId]: newIndex,
    }));
  };

  return (
    <div className="flex flex-col gap-10 p-4">
      {/* LAYOUT PRINCIPAL */}
      <div className="flex flex-col lg:flex-row gap-10">
        {/* ESQUERDA — CONTROLES */}
        <div className="lg:w-4/12 flex flex-col">
          {CATEGORIES.map((category) => (
            <Carousel
              key={category.id}
              label={category.label}
              items={GROUPED_CLOTHES[category.id]}
              selectedIndex={selectedIndices[category.id]}
              onSelect={(newIndex) => handleSelect(category.id, newIndex)}
            />
          ))}

          <div className="mt-6 p-4 border-t">
            <h3 className="text-lg font-semibold mb-2">Dar um nome a isso</h3>
            <div className="flex gap-2 items-center">
              <button onClick={shuffleLook}>
                <IoShuffle
                  size={22}
                  className="text-text hover:opacity-70"
                  title="Sortear look"
                />
              </button>

              <input
                type="text"
                placeholder="Cinema, festa estranha, domingo sem pressa…"
                value={lookName}
                onChange={(e) => setLookName(e.target.value)}
                className="flex-1 p-2 border rounded-md"
              />

              <button
                onClick={saveCurrentLook}
                className="px-4 py-2 bg-text text-white rounded-md"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>

        {/* CENTRO — CORPO / ARTE */}
        <div className="lg:w-4/12 flex justify-center">
          <LookCanvas
            selectedIndices={selectedIndices}
            groupedClothes={GROUPED_CLOTHES}
          />
        </div>

        {/* DIREITA — ARQUIVOS */}
        <div className="lg:w-4/12">
          <h2 className="text-xl font-semibold mb-4">Combinações Favoritas</h2>

          {savedLooks.length === 0 ? (
            <p className="italic text-gray-500">
              Nenhum corpo arquivado ainda.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {savedLooks.map((look, index) => (
                <li
                  key={look.id}
                  className="flex relative items-center flex-col justify-between p-2 rounded-md transition duration-150"
                >
                  <div
                    className={`absolute z-50 ${
                      index % 2 === 0 ? "top-32 left-2" : "top-18 left-2 -rotate-14"
                    } flex items-center`}
                  >
                    <Image
                      src="/images/papertag.png"
                      alt="Tag Icon"
                      width={480}
                      height={480}
                      className="absolute min-w-28 min-h-18 -top-8 -left-6 rotate-8"
                    />
                    <div className="w-full min-w-28 min-h-18 -top-4 -left-5 absolute rotate-8">
                      <p className="font-semibold text-sm font-montserrat">
                        {look.name}
                      </p>
                      <p className="text-[8px] italic text-gray-500">Drop Novo!</p>
                    </div>
                  </div>
                  <div className="flex items-center flex-col">
                    {getLookPreview(look.indices, 3) && (
                      <img
                        src={getLookPreview(look.indices, 3)}
                        alt="Preview Accessory"
                        className="w-14 h-14 object-contain rounded"
                      />
                    )}
                    <img
                      src={getLookPreview(look.indices, 1)}
                      alt="Preview Top"
                      className="w-20 h-20 object-contain rounded"
                    />
                    <img
                      src={getLookPreview(look.indices, 2)}
                      alt="Preview Bottom"
                      className="w-20 h-20 object-contain rounded"
                    />
                  </div>
                  <div className="flex space-x-2 w-full">
                    <button
                      onClick={() => removeLook(look.id)}
                      className="text-xs px-2 py-1 bg-text text-white rounded cursor-pointer transition duration-150"
                      title="Remover Look"
                    >
                      X
                    </button>
                    <button
                      onClick={() => loadLook(look.indices)}
                      className="text-xs px-2 py-1 cursor-pointer text-text font-nunito w-full border border-text rounded transition duration-150"
                      title="Carregar Look"
                    >
                      Usar
                    </button>
                  </div>
                </li>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LookBuilder;
