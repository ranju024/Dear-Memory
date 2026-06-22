import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { PHOTOS } from "@/lib/mock/data";

export const Route = createFileRoute("/dashboard/albums/$id")({
  head: () => ({ meta: [{ title: "Album editor — DearMemory" }] }),
  component: AlbumEditor,
});

const LAYOUTS = ["Magazine", "Collage", "Timeline", "Full-bleed", "Two-up"];

const PAGES = [
  { type: "cover", img: PHOTOS.weddingHero },
  { type: "chapter", title: "Chapter I — The morning" },
  { type: "full", img: PHOTOS.weddingDetails },
  { type: "duo", a: PHOTOS.weddingFlowers, b: PHOTOS.weddingCouple },
  { type: "chapter", title: "Chapter II — The vows" },
  { type: "full", img: PHOTOS.weddingDance },
];

function AlbumEditor() {
  return (
    <AppShell
      title="Sophie & Étienne — Forever"
      subtitle="48 pages · Heirloom format"
      action={
        <div className="flex gap-2">
          <button className="bg-white ring-1 ring-border px-4 py-2 rounded-full text-sm font-semibold">Preview</button>
          <button className="bg-white ring-1 ring-border px-4 py-2 rounded-full text-sm font-semibold">Export PDF</button>
          <button className="bg-emerald text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-emerald-deep">Send to print</button>
        </div>
      }
    >
      <div className="grid grid-cols-12 gap-4">
        <aside className="col-span-12 lg:col-span-3 space-y-4">
          <div className="bg-white rounded-[1.5rem] ring-1 ring-border p-5">
            <div className="font-bold mb-3 text-sm">Page layouts</div>
            <div className="space-y-2">
              {LAYOUTS.map((l, i) => (
                <button key={l} className={`w-full text-left px-3 py-2.5 rounded-xl text-sm ${i === 0 ? "bg-emerald-light text-emerald-deep font-semibold" : "hover:bg-cream"}`}>
                  {l}
                </button>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-[1.5rem] ring-1 ring-border p-5">
            <div className="font-bold mb-3 text-sm">Cover</div>
            <div className="aspect-[4/5] bg-cream rounded-2xl overflow-hidden">
              <img src={PHOTOS.weddingHero} className="w-full h-full object-cover" alt="" />
            </div>
          </div>
        </aside>

        <div className="col-span-12 lg:col-span-6 bg-cream rounded-[1.5rem] p-8 min-h-[600px]">
          <div className="space-y-8">
            {PAGES.map((p, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow ring-1 ring-border">
                {p.type === "cover" && (
                  <div className="relative aspect-[3/4]">
                    <img src={p.img} className="w-full h-full object-cover" alt="" />
                    <div className="absolute inset-0 grid place-items-center text-white text-center bg-foreground/30">
                      <div>
                        <div className="font-serif italic text-3xl">Sophie & Étienne</div>
                        <div className="text-xs uppercase tracking-widest mt-2">June 14, 2024</div>
                      </div>
                    </div>
                  </div>
                )}
                {p.type === "chapter" && (
                  <div className="aspect-[3/2] grid place-items-center bg-cream">
                    <div className="font-serif italic text-2xl text-warm-gray">{p.title}</div>
                  </div>
                )}
                {p.type === "full" && <img src={p.img} className="w-full aspect-[3/2] object-cover" alt="" />}
                {p.type === "duo" && (
                  <div className="grid grid-cols-2 aspect-[3/2]">
                    <img src={p.a} className="w-full h-full object-cover" alt="" />
                    <img src={p.b} className="w-full h-full object-cover" alt="" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <aside className="col-span-12 lg:col-span-3 bg-white rounded-[1.5rem] ring-1 ring-border p-5">
          <div className="font-bold mb-3 text-sm">Chapters</div>
          <div className="space-y-2 text-sm">
            {["Cover", "The morning", "The vows", "The party", "The afterglow"].map((c, i) => (
              <div key={c} className={`flex items-center gap-3 px-3 py-2 rounded-xl ${i === 0 ? "bg-emerald-light text-emerald-deep font-semibold" : "hover:bg-cream"}`}>
                <span className="font-mono text-xs text-warm-gray">{String(i + 1).padStart(2, "0")}</span>
                {c}
              </div>
            ))}
          </div>
          <button className="mt-4 w-full text-sm font-semibold py-2 rounded-xl border border-dashed border-warm-gray/30 text-warm-gray hover:bg-cream">+ Add chapter</button>
        </aside>
      </div>
    </AppShell>
  );
}
