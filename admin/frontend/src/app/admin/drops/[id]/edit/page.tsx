import { DropEditWrapper } from "@/components/admin/drop-edit-wrapper";

export default async function DropEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <DropEditWrapper id={id} />;
}
