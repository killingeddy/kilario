import { DropDetail } from "@/components/admin/drop-detail";

export default async function DropDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <DropDetail id={id} />;
}
