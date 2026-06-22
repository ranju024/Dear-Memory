import { createFileRoute, useParams } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { EVENTS } from "@/lib/mock/data";

export const Route = createFileRoute("/dashboard/events/$id")({
  head: () => ({ meta: [{ title: "Event — DearMemory" }] }),
  component: EventDetail,
});

function EventDetail() {
  const { id } = useParams({ from: "/dashboard/events/$id" });
  const ev = EVENTS.find((e) => e.id === id || e.slug === id) ?? EVENTS[0];

  return (
    <AppShell
      title={ev.title}
      subtitle={`${ev.subtitle} · ${ev.date}`}
      action={
        <div className="flex gap-2">
          <a
            href={`/event/${ev.slug}`}
            className="bg-white ring-1 ring-border px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-cream"
          >
            View public
          </a>
          <a
            href="/album-editor"
            className="bg-emerald text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-emerald-deep"
          >
            Edit website
          </a>
        </div>
      }
    >
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-[2rem] overflow-hidden ring-1 ring-border">
          <img src={ev.cover} alt="" className="w-full aspect-[16/9] object-cover" />
          <div className="p-6">
            <div className="flex gap-2 border-b border-border mb-6">
              {["Overview", "Photos", "Guestbook", "Settings"].map((t, i) => (
                <button
                  key={t}
                  className={`px-4 py-3 text-sm font-semibold ${i === 0 ? "border-b-2 border-emerald text-emerald" : "text-warm-gray"}`}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                { l: "Views", v: ev.views.toLocaleString() },
                { l: "Visitors", v: ev.visitors.toLocaleString() },
                { l: "Photos", v: ev.photos.toLocaleString() },
              ].map((m) => (
                <div key={m.l} className="bg-cream rounded-2xl p-4">
                  <div className="font-mono text-emerald text-2xl">{m.v}</div>
                  <div className="text-[10px] uppercase tracking-widest text-warm-gray mt-1">
                    {m.l}
                  </div>
                </div>
              ))}
            </div>
            <h3 className="font-bold mb-3">Activity</h3>
            <div className="space-y-3 text-sm">
              {[
                "Sophie L. signed the guestbook",
                "32 photos favorited today",
                "New visitor from Lisbon",
                "Album exported by Étienne",
              ].map((a, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-cream rounded-2xl">
                  <div className="w-2 h-2 rounded-full bg-emerald" />
                  {a}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-white rounded-[2rem] p-6 ring-1 ring-border">
            <div className="font-bold mb-4">Share</div>
            <div className="bg-cream rounded-2xl p-4 mb-3 text-xs font-mono break-all">
              dearmemory.com/event/{ev.slug}
            </div>
            <button className="w-full bg-emerald text-white py-3 rounded-full text-sm font-semibold mb-2">
              Copy link
            </button>
            <button className="w-full bg-white ring-1 ring-border py-3 rounded-full text-sm font-semibold">
              Download QR
            </button>
          </div>
          <div className="bg-emerald rounded-[2rem] p-6 text-white">
            <div className="font-bold mb-2">Quote requests</div>
            <div className="text-3xl font-bold font-mono mb-1">4</div>
            <div className="text-xs text-white/70">From this event's traffic</div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
