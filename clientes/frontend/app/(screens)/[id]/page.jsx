"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ProductDetails from "../../components/ProductDetails";
import useApi from "../../lib/api";

export default function Page() {
  const { id } = useParams();
  const router = useRouter();
  const api = useApi();

  const [product, setProduct] = useState(null);

  useEffect(() => {
    if (!id) return;

    const getProduct = async () => {
      try {
        const response = await api.get(`/products/${id}`);
        if (!response.data.data) {
          router.push("/");
          return;
        }
        setProduct(response.data.data);
      } catch (error) {
        console.error("Error fetching product:", error);
        router.push("/");
      }
    };

    getProduct();
  }, [id]);

  return (
    <main className="min-h-screen p-4 pt-16">
      {product && <ProductDetails product={product} />}
    </main>
  );
}
