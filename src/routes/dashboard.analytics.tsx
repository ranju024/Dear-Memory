import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { ANALYTICS_TRAFFIC, EVENTS } from "@/lib/mock/data";

export const Route = createFileRoute("/dashboard/analytics")({
  head: () => ({ meta: [{ title: "Analytics — DearMemory" }] }),
  component: Analytics,
});

const DEVICES = [
  { l: "Mobile", v: 58, c: "bg-emerald" },
  { l: "Desktop", v: 31, c: "bg-lavender" },
  { l: "Tablet", v: 11, c: "bg-sky" },
];

function Analytics() {
  return (
    <AppShell title="Analytics" subtitle="Last 7 days · All event websites">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {[
          { l: "Views", v: "24.8k", d: "+18%" },
          { l: "Visitors", v: "5,471", d: "+12%" },
          { l: "Downloads", v: "1,204", d: "+24%" },
          { l: "Shares", v: "412", d: "+9%" },
          { l: "Favorites", v: "2,810", d: "+31%" },
        ].map((m) => (
          <div key={m.l} className="bg-white rounded-[1.5rem] p-5 ring-1 ring-border">
            <div className="text-xs font-bold uppercase tracking-widest text-warm-gray mb-2">{m.l}</div>
            <div className="text-3xl font-bold font-mono text-emerald">{m.v}</div>
            <div className="text-[11px] text-warm-gray mt-2">{m.d}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-white rounded-[2rem] p-6 ring-1 ring-border">
          <div className="font-bold mb-6">Traffic over time</div>
          <div className="flex items-end gap-4 h-64">
            {ANALYTICS_TRAFFIC.map((d, i) => {
              const max = Math.max(...ANALYTICS_TRAFFIC.map((x) => x.views));
              return (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex flex-col gap-1 items-stretch h-full justify-end">
                    <div className={`${i === 5 ? "bg-emerald" : "bg-emerald/30"} rounded-t-xl`} style={{ height: `${(d.views / max) * 100}%` }} />
                    <div className="bg-emerald/10 rounded-b-xl" style={{ height: `${(d.visitors / max) * 100}%` }} />
                  </div>
                  <div className="text-[10px] font-bold uppercase text-warm-gray">{d.day}</div>
                </div>
              );
            })}
          </div>
          <div className="flex gap-4 mt-6 text-xs">
            <div className="flex items-center gap-2"><span className="w-3 h-3 bg-emerald rounded-sm" /> Views</div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 bg-emerald/10 rounded-sm" /> Visitors</div>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] p-6 ring-1 ring-border">
          <div className="font-bold mb-6">Device analytics</div>
          <div className="space-y-4">
            {DEVICES.map((s) => (
              <div key={s.l}>
                <div className="flex justify-between text-sm mb-2"><span>{s.l}</span><span className="font-mono text-warm-gray">{s.v}%</span></div>
                <div className="h-2 bg-cream rounded-full overflow-hidden">
                  <div className={`${s.c} h-full rounded-full`} style={{ width: `${s.v}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] p-6 ring-1 ring-border">
        <div className="font-bold mb-4">Most viewed events</div>
        <div className="space-y-3">
          {EVENTS.slice(0, 5).sort((a, b) => b.views - a.views).map((e, i) => (
            <div key={e.id} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-cream">
              <div className="font-mono text-warm-gray w-6 text-sm">{i + 1}</div>
              <img src={e.cover} alt="" className="w-12 h-12 rounded-xl object-cover" />
              <div className="flex-1 min-w-0">
                <div className="font-semibold truncate">{e.title}</div>
                <div className="text-xs text-warm-gray">{e.type}</div>
              </div>
              <div className="font-mono text-emerald text-sm">{e.views.toLocaleString()}</div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
