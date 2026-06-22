import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";

export const Route = createFileRoute("/dashboard/customize")({
  head: () => ({ meta: [{ title: "Customize — DearMemory" }] }),
  component: Customize,
});

function Customize() {
  return (
    <AppShell
      headerTabs={[
        { label: "Content", href: "/dashboard/content" },
        { label: "Customize", active: true, href: "/dashboard/customize" },
      ]}
      hideSidebar
    >
      <div className="max-w-3xl mx-auto space-y-4 overflow-y-auto h-[calc(100vh-200px)]">
        <div className="bg-white rounded-2xl ring-1 ring-border p-5">
          <div className="font-bold mb-1">Gallery section</div>
          <div className="text-xs text-warm-gray mb-5">Style controls</div>
          <Block label="Layout">
            <div className="grid grid-cols-3 gap-2">
              {["Grid", "Masonry", "Carousel"].map((l, i) => (
                <button
                  key={l}
                  className={`text-xs font-semibold py-2 rounded-xl ${i === 0 ? "bg-emerald text-white" : "bg-cream"}`}
                >
                  {l}
                </button>
              ))}
            </div>
          </Block>
          <Block label="Columns">
            <input
              type="range"
              defaultValue={3}
              min={1}
              max={6}
              className="w-full accent-emerald"
            />
          </Block>
          <Block label="Spacing">
            <input
              type="range"
              defaultValue={4}
              min={0}
              max={12}
              className="w-full accent-emerald"
            />
          </Block>
          <Block label="Corner radius">
            <input
              type="range"
              defaultValue={12}
              min={0}
              max={32}
              className="w-full accent-emerald"
            />
          </Block>
          <Block label="Background">
            <div className="flex gap-2">
              {["#ffffff", "#EEEAFE", "#e8f0ed", "#2d2a29"].map((c) => (
                <button
                  key={c}
                  className="w-8 h-8 rounded-full ring-1 ring-border"
                  style={{ background: c }}
                />
              ))}
            </div>
          </Block>
          <Block label="Animation">
            <select className="w-full bg-cream rounded-xl px-3 py-2 text-sm outline-none">
              <option>Fade up</option>
              <option>Scale in</option>
              <option>None</option>
            </select>
          </Block>
        </div>
      </div>
    </AppShell>
  );
}

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-5 last:mb-0">
      <div className="text-[10px] font-bold uppercase tracking-widest text-warm-gray mb-2">
        {label}
      </div>
      {children}
    </div>
  );
}
