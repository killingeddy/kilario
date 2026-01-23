import { DeliveryDetail } from "@/components/admin/delivery-detail";

export default async function DeliveryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <DeliveryDetail id={id} />;
}
