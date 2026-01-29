"use client";
import { ProductCard } from "../../components/ProductCard";
import useApi from "../../lib/api";
import React from "react";

export default function Loja() {
  const api = useApi();

  const [products, setProducts] = React.useState([]);

  const getProducts = async () => {
    try {
      const response = await api.get("/products");
      setProducts(response.data.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  React.useEffect(() => {
    getProducts();
  }, []);

  return (
    <div className="w-full h-auto p-4 grid grid-cols-2 md:grid-cols-6 bg-background">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
