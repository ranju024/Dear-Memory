import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";

export const Route = createFileRoute("/dashboard/brand")({
  head: () => ({ meta: [{ title: "Brand Kit — DearMemory" }] }),
  component: Brand,
});

function Brand() {
  return (
    <AppShell title="Brand Kit" subtitle="Upload once. Applied beautifully across every event.">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-[2rem] p-6 ring-1 ring-border">
          <div className="font-bold mb-4">Logo</div>
          <div className="aspect-square bg-cream rounded-2xl grid place-items-center">
            <div className="w-20 h-20 rounded-full bg-emerald grid place-items-center text-white font-bold text-2xl">G</div>
          </div>
          <button className="mt-4 w-full bg-white ring-1 ring-border py-2.5 rounded-full text-sm font-semibold">Replace logo</button>
        </div>

        <div className="bg-white rounded-[2rem] p-6 ring-1 ring-border">
          <div className="font-bold mb-4">Colors</div>
          <div className="space-y-3">
            {[
              { l: "Primary", v: "#4a7c6a" },
              { l: "Background", v: "#EEEAFE" },
              { l: "Accent", v: "#e1f0f7" },
              { l: "Text", v: "#2d2a29" },
            ].map((c) => (
              <div key={c.l} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-cream">
                <div className="w-10 h-10 rounded-xl ring-1 ring-border" style={{ background: c.v }} />
                <div className="flex-1">
                  <div className="text-sm font-semibold">{c.l}</div>
                  <div className="font-mono text-xs text-warm-gray">{c.v}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-[2rem] p-6 ring-1 ring-border">
          <div className="font-bold mb-4">Typography</div>
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-cream">
              <div className="text-2xl font-bold mb-1">Headings</div>
              <div className="text-xs text-warm-gray font-mono">Plus Jakarta Sans · 700</div>
            </div>
            <div className="p-4 rounded-2xl bg-cream">
              <div className="text-base mb-1">Body text reads beautifully here.</div>
              <div className="text-xs text-warm-gray font-mono">Plus Jakarta Sans · 400</div>
            </div>
            <div className="p-4 rounded-2xl bg-cream">
              <div className="font-serif italic text-xl mb-1">Quote moments</div>
              <div className="text-xs text-warm-gray font-mono">Instrument Serif · 400 italic</div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-[2rem] p-6 ring-1 ring-border">
          <div className="font-bold mb-4">Watermark</div>
          <div className="aspect-[16/9] bg-cream rounded-2xl relative overflow-hidden grid place-items-center">
            <div className="text-warm-gray text-sm">Watermark preview</div>
            <div className="absolute bottom-4 right-4 text-emerald font-bold opacity-50 text-2xl font-serif italic">goldenhour</div>
          </div>
        </div>

        <div className="bg-emerald rounded-[2rem] p-6 text-white">
          <div className="font-bold mb-2">Brand assets</div>
          <div className="text-xs text-white/70 mb-6">14 files synced</div>
          <button className="w-full bg-white text-emerald py-3 rounded-full text-sm font-semibold">Manage assets</button>
        </div>
      </div>
    </AppShell>
  );
}
