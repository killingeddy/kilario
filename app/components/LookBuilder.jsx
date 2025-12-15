"use client";
import { CATEGORIES, GROUPED_CLOTHES } from "../data/mockClothes";
import React, { useState, useMemo, useEffect } from "react";
import { IoShuffle } from "react-icons/io5";
import Carousel from "./Carousel";

const initialSelectedIndices = CATEGORIES.reduce((acc, category) => {
  acc[category.id] = 0;
  return acc;
}, {});

const LookBuilder = () => {
  const LOCAL_STORAGE_KEY = "kilario_saved_looks";
  const [savedLooks, setSavedLooks] = useState([]);
  const [lookName, setLookName] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedLooks = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedLooks) {
        setSavedLooks(JSON.parse(storedLooks));
      }
    }
  }, []);

  const saveCurrentLook = () => {
    if (!lookName.trim()) {
      return;
    }

    const lookToSave = {
      id: Date.now(),
      name: lookName.trim(),
      indices: selectedIndices,
      date: new Date().toLocaleString("pt-BR").split(",")[0],
    };

    const newSavedLooks = [...savedLooks, lookToSave];
    setSavedLooks(newSavedLooks);
    if (typeof window !== "undefined") {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newSavedLooks));
    }

    setLookName("");
  };

  const loadLook = (indices) => {
    setSelectedIndices(indices);
  };

  const clearLook = () => {
    setSelectedIndices(initialSelectedIndices);
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
    if (typeof window !== "undefined") {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newSavedLooks));
    }
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

  const [selectedIndices, setSelectedIndices] = useState(
    initialSelectedIndices
  );

  const handleSelect = (categoryId, newIndex) => {
    setSelectedIndices((prev) => ({
      ...prev,
      [categoryId]: newIndex,
    }));
  };

  return (
    <div className="flex flex-col lg:flex-row p-4 ">
      <h1 className="text-3xl font-bold mb-6 w-full text-center lg:hidden">
        O Que Eu Usaria Em...
      </h1>

      <div className="w-full lg:w-5/12 flex flex-col justify-center relative h-auto">
        <h1 className="text-xl font-bold font-montserrat text-text hidden lg:block">
          O Que Eu Usaria Em...
        </h1>
        {CATEGORIES.map((category) => (
          <Carousel
            key={category.id}
            label={category.label}
            items={GROUPED_CLOTHES[category.id]}
            selectedIndex={selectedIndices[category.id]}
            onSelect={(newIndex) => handleSelect(category.id, newIndex)}
          />
        ))}

        <div className="mt-4 p-4 border-t border-gray-200 w-full">
          <h3 className="text-lg font-semibold mb-2">Salvar Combinação</h3>
          <div className="flex justify-between space-x-2">
            <button>
              <IoShuffle
                size={24}
                className="text-text cursor-pointer hover:text-text/80 transition duration-150"
                title="Sortear Look"
                onClick={shuffleLook}
              />
            </button>
            <input
              type="text"
              placeholder="Ao Cinema, Em um date..."
              value={lookName}
              onChange={(e) => setLookName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md "
            />
            <button
              onClick={saveCurrentLook}
              className="flex-1 px-2  font-nunito bg-text text-white rounded-md cursor-pointer transition duration-150 font-medium"
            >
              Salvar
            </button>
          </div>
        </div>
      </div>
      <div className="w-full mt-6 lg:mt-0">
        <h2 className="text-xl font-semibold mb-4">Combinações Salvas</h2>
        <div className="p-4 rounded-lg overflow-y-auto">
          {savedLooks.length === 0 ? (
            <p className="text-gray-500 italic">
              Nenhuma combinação salva ainda.
            </p>
          ) : (
            <ul className="space-y-3 flex">
              {savedLooks.map((look) => (
                <li
                  key={look.id}
                  className="flex items-center flex-col justify-between p-2 rounded-md transition duration-150"
                >
                  <div
                    flex
                    className="flex w-full items-center mb-2 justify-between"
                  >
                    <p className="font-semibold text-sm font-montserrat">
                      {look.name}
                    </p>
                    <p className="text-xs text-text/60"> {look.date}</p>
                  </div>
                  <div className="flex items-center flex-col">
                    {getLookPreview(look.indices, 3) && (
                      <img
                        src={getLookPreview(look.indices, 3)}
                        alt="Preview Accessory"
                        className="w-16 h-16 object-contain rounded"
                      />
                    )}
                    <img
                      src={getLookPreview(look.indices, 1)}
                      alt="Preview Top"
                      className="w-28 h-28 object-contain rounded"
                    />
                    <img
                      src={getLookPreview(look.indices, 2)}
                      alt="Preview Bottom"
                      className="w-28 h-28 object-contain rounded"
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
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default LookBuilder;
