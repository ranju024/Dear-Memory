import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { PHOTOS } from "@/lib/mock/data";

export const Route = createFileRoute("/dashboard/albums/")({
  head: () => ({ meta: [{ title: "Albums — DearMemory" }] }),
  component: Albums,
});

const ALBUMS = [
  { id: "a1", title: "Sophie & Étienne — Forever", cover: PHOTOS.weddingHero, pages: 48, status: "Ready to print" },
  { id: "a2", title: "Olive Turns Five", cover: PHOTOS.birthday, pages: 24, status: "Draft" },
  { id: "a3", title: "Midnight Bloom — Night One", cover: PHOTOS.concert, pages: 36, status: "In review" },
  { id: "a4", title: "The Westwood Class", cover: PHOTOS.graduation, pages: 60, status: "Ready to print" },
];

function Albums() {
  return (
    <AppShell
      title="Albums"
      subtitle="Story-driven, magazine-quality album design."
      action={<button className="bg-emerald text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-emerald-deep">+ New album</button>}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {ALBUMS.map((a) => (
          <a href={`/dashboard/albums/${a.id}`} key={a.id} className="bg-white rounded-[2rem] overflow-hidden ring-1 ring-border hover:-translate-y-1 transition-transform group">
            <div className="aspect-[4/3] overflow-hidden">
              <img src={a.cover} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="p-5">
              <div className="font-bold mb-1">{a.title}</div>
              <div className="text-sm text-warm-gray">{a.pages} pages · {a.status}</div>
            </div>
          </a>
        ))}
      </div>

      <div className="bg-emerald-light/50 rounded-[2.5rem] p-8 md:p-12 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-3">Magazine, collage, timeline & more</h2>
        <p className="text-warm-gray max-w-md mx-auto mb-6">Auto layout suggestions, full-width hero photos, chapter sections — all built in.</p>
        <button className="bg-emerald text-white px-6 py-3 rounded-full font-bold hover:bg-emerald-deep">Browse layouts</button>
      </div>
    </AppShell>
  );
}
