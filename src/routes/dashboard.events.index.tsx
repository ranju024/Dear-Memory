import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { EVENTS } from "@/lib/mock/data";

export const Route = createFileRoute("/dashboard/events/")({
  head: () => ({ meta: [{ title: "Events — DearMemory" }] }),
  component: EventsList,
});

const STATUS_COLORS: Record<string, string> = {
  Live: "bg-emerald-light text-emerald-deep",
  Draft: "bg-cream text-warm-gray",
  Scheduled: "bg-sky text-foreground",
};

function EventsList() {
  return (
    <AppShell
      title="Events"
      subtitle="Every gallery you've created, published, and scheduled."
      action={
        <div className="flex gap-2">
          <div className="hidden md:flex items-center gap-2 bg-white ring-1 ring-border rounded-full px-4 py-2 w-72">
            <input
              className="flex-1 bg-transparent text-sm outline-none"
              placeholder="Search events…"
            />
          </div>
        </div>
      }
    >
      <div className="flex gap-2 mb-6 flex-wrap">
        {["All", "Live", "Draft", "Scheduled", "Archived"].map((s, i) => (
          <button
            key={s}
            className={`px-4 py-2 rounded-full text-sm font-semibold ${i === 0 ? "bg-emerald text-white" : "bg-white ring-1 ring-border text-warm-gray hover:bg-cream"}`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {EVENTS.map((e) => (
          <div
            key={e.id}
            className="bg-white rounded-[2rem] overflow-hidden ring-1 ring-border hover:-translate-y-1 transition-transform group"
          >
            <div className="relative aspect-[16/10] overflow-hidden">
              <img
                src={e.cover}
                alt={e.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div
                className={`absolute top-4 left-4 ${STATUS_COLORS[e.status]} px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest`}
              >
                {e.status}
              </div>
            </div>
            <div className="p-5">
              <div className="text-[10px] uppercase tracking-widest text-warm-gray font-bold mb-1">
                {e.type} · {e.template}
              </div>
              <div className="font-bold text-lg">{e.title}</div>
              <div className="text-sm text-warm-gray">
                {e.subtitle} · {e.date}
              </div>
              <div className="grid grid-cols-3 gap-3 mt-5 pt-5 border-t border-border">
                <Stat label="Views" v={e.views.toLocaleString()} />
                <Stat label="Visitors" v={e.visitors.toLocaleString()} />
                <Stat label="Photos" v={e.photos.toLocaleString()} />
              </div>
              <div className="flex gap-2 mt-5">
                <a
                  href={`/event/${e.slug}`}
                  className="flex-1 text-center text-sm font-semibold py-2.5 rounded-full bg-cream hover:bg-emerald-light/60 transition-colors"
                >
                  View
                </a>
                <a
                  href="/album-editor"
                  className="flex-1 text-center text-sm font-semibold py-2.5 rounded-full bg-emerald text-white hover:bg-emerald-deep"
                >
                  Edit
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}

function Stat({ label, v }: { label: string; v: string }) {
  return (
    <div>
      <div className="font-mono text-emerald text-sm">{v}</div>
      <div className="text-[10px] uppercase tracking-widest text-warm-gray">{label}</div>
    </div>
  );
}
