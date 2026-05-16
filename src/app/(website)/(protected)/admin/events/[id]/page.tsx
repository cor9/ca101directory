import { redirect } from "next/navigation";

export default function AdminEventDetailAliasPage({
  params,
}: {
  params: { id: string };
}) {
  redirect(`/dashboard/admin/events/${params.id}`);
}
