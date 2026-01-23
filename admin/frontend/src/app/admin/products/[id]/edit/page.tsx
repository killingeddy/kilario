import { ProductEditWrapper } from "@/components/admin/product-edit-wrapper";

export default async function ProductEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ProductEditWrapper id={id} />;
}
