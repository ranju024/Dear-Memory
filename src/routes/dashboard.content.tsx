import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { PHOTOS } from "@/lib/mock/data";

export const Route = createFileRoute("/dashboard/content")({
  head: () => ({ meta: [{ title: "Content — DearMemory" }] }),
  component: Content,
});

function Content() {
  return (
    <AppShell
      headerTabs={[
        { label: "Content", active: true, href: "/dashboard/content" },
        { label: "Customize", href: "/dashboard/customize" },
      ]}
      hideSidebar
    >
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="bg-white rounded-2xl overflow-hidden shadow-lg max-w-4xl w-full">
          <div className="bg-cream px-4 py-3 flex items-center gap-2 border-b border-border">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-300" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-300" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald/60" />
            <div className="ml-4 text-[11px] text-warm-gray font-mono">
              sophie-and-etienne.com
            </div>
          </div>
          <div>
            <div className="relative">
              <img
                src={PHOTOS.weddingHero}
                alt="Album preview"
                className="w-full aspect-[16/10] object-cover"
              />
              <div className="absolute inset-0 bg-foreground/30 flex items-center justify-center text-white text-center">
                <div>
                  <div className="font-serif italic text-3xl md:text-4xl">Sophie & Étienne</div>
                  <div className="text-xs uppercase tracking-widest mt-2">June 14, 2024</div>
                </div>
              </div>
            </div>
            <div className="p-8 text-center">
              <p className="font-serif italic text-xl md:text-2xl text-warm-gray">
                "The way you held her hand told us everything."
              </p>
            </div>
            <div className="grid grid-cols-3 gap-1 p-1">
              <img src={PHOTOS.weddingCouple} className="aspect-square object-cover" alt="" />
              <img src={PHOTOS.weddingFlowers} className="aspect-square object-cover" alt="" />
              <img src={PHOTOS.weddingDetails} className="aspect-square object-cover" alt="" />
              <img src={PHOTOS.weddingDance} className="aspect-square object-cover" alt="" />
              <img src={PHOTOS.portfolio1} className="aspect-square object-cover" alt="" />
              <img src={PHOTOS.portfolio2} className="aspect-square object-cover" alt="" />
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
