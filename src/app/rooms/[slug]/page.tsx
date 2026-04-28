import { RoomDetailClient } from "@/components/room-detail-client";
import { SiteHeader } from "@/components/site-header";

type RoomDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function RoomDetailPage({ params }: RoomDetailPageProps) {
  const { slug } = await params;

  return (
    <div className="page-shell">
      <div className="mesh" />
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <RoomDetailClient slug={slug} />
      </main>
    </div>
  );
}
